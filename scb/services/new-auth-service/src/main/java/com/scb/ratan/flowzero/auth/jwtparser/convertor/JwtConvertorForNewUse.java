package com.scb.ratan.flowzero.auth.jwtparser.convertor;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.scb.ratan.commons.RatanErrors;
import com.scb.ratan.commons.exception.RatanServiceException;
import com.scb.ratan.flowzero.auth.constant.AuthServiceErrorEnum;
import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.jwtparser.fetcher.OudDataFetcher;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
public class JwtConvertorForNewUse extends JwtConvertor {

    private final OudDataFetcher oudDataFetcher;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    public JwtConvertorForNewUse(
        RatanObjectMapper objectMapper,
        OudDataFetcher oudDataFetcher,
        UserRepository userRepository,
        RoleRepository roleRepository) {
        super(objectMapper);
        this.oudDataFetcher = oudDataFetcher;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public JwtConvertorResponse convert(String inputUserInfo) {

        Map<String, String> userInfoMap = convertToMap(inputUserInfo);

        String userId = retrieveUserId(userInfoMap);

        Optional<InternalUserEntitlement> userRoleAndActionsOptional = retrieveRatanActionsAndRole(userId);

        if (userRoleAndActionsOptional.isEmpty()) {
            throw new RatanServiceException(AuthServiceErrorEnum.INVALID_USER, "original user information not found");
        }

        InternalUserEntitlement internalUserEntitlement = userRoleAndActionsOptional.get();

        return buildResponse(convertUserEntitlement(internalUserEntitlement), userId, retrieveOudInfo(userInfoMap));
    }

    private OudDataFetcher.OudKeyInformation retrieveOudInfo(Map<String, String> userInfoMap) {

        return oudDataFetcher.retrieveOudInformation(userInfoMap);
    }

    private String retrieveUserId(Map<String, String> inputUserInfo) {

        String userId = inputUserInfo.get("sub");

        if (StringUtils.isEmpty(userId)) {
            throw new RatanServiceException(RatanErrors.SERVICE_INTERNAL_ERROR, "userId is not retrieved from jwtToken");
        }

        return userId;
    }

    private Map<String, String> convertToMap(String inputUserInfo) {

        try {
            return objectMapper.readValue(inputUserInfo, Map.class);
        } catch (Exception e) {
            log.error("error occurred while converting to map ");
        }

        return new HashMap<>();
    }

    private UserEntitlements getUserEntitlements(String entitlements) {

        if (StringUtils.isBlank(entitlements)) {
            return null;
        }

        try {
            return objectMapper.readValue(entitlements, UserEntitlements.class);

        } catch (RatanServiceException e) {
            log.error("error occurred while converting entitlements from text", e);
        }

        return null;
    }

    private Optional<InternalUserEntitlement> retrieveRatanActionsAndRole(String userId) {

        Optional<User> userOpt = userRepository.findByBankId(userId);

        if (userOpt.isEmpty()) {

            return Optional.empty();
        }

        String entitlements = userOpt.get().getFunctionEntitlement();

        InternalUserEntitlement.InternalUserEntitlementBuilder builder = InternalUserEntitlement.builder();

        UserEntitlements userEntitlements = getUserEntitlements(entitlements);

        if (userEntitlements != null) {

            builder.actions(userEntitlements.entityFlowzeroFeatureAction.toArray(new String[0]));

        }

        List<String> roleNames = roleRepository.findRoleNameByBankId(userId);

        if (!CollectionUtils.isEmpty(roleNames)) {

            builder.role(String.join(AuthConstant.COMMA, roleNames));

        }

        return Optional.of(builder.build());

    }

    private String convertUserEntitlement(InternalUserEntitlement internalUserEntitlement) {

        try {
            return objectMapper.writeValueAsString(internalUserEntitlement);

        } catch (Exception e) {
            log.warn("error occurred while converting data: {}", internalUserEntitlement, e);
            return StringUtils.EMPTY;
        }
    }

    @Data
    @Builder
    public static class InternalUserEntitlement {

        @JsonProperty("role")
        private String role;

        @JsonProperty("actions")
        private String[] actions;

        @JsonProperty("dataEntitlementRoles")
        private String dataEntitlementRoles;

    }

    @Data
    @Builder
    public static class UserEntitlements {

        @JsonProperty("Entity.flowzero_feature_action")
        private List<String> entityFlowzeroFeatureAction;

    }

}

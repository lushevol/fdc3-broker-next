package com.scb.ratan.flowzero.auth.service.ems3;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.scb.ratan.flowzero.auth.constant.AuthConstant;
import com.scb.ratan.flowzero.auth.constant.DataStatusEnum;
import com.scb.ratan.flowzero.auth.entity.dbo.Role;
import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.ems3.DataEntitlement;
import com.scb.ratan.flowzero.auth.entity.ems3.Entitlements;
import com.scb.ratan.flowzero.auth.entity.ems3.RoleEntitlement;
import com.scb.ratan.flowzero.auth.repository.RoleRepository;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class EMS3DataCoordinator {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatanObjectMapper ratanObjectMapper;

    private static final int BATCH_SIZE = 100;

    private void syncRoleEntitlements(List<String> entitlementNames, String bankId) {

        roleRepository.deleteByBankId(bankId);

        if (!CollectionUtils.isEmpty(entitlementNames)) {

            List<Role> saveList = Lists.newArrayListWithCapacity(BATCH_SIZE);

            for (String roleName : entitlementNames) {

                Role role = new Role();
                role.setBankId(bankId);
                role.setRoleName(roleName);
                role.setStatus(DataStatusEnum.ACTIVE);
                saveList.add(role);

                if (saveList.size() == BATCH_SIZE) {
                    roleRepository.saveAll(saveList);
                    saveList.clear();
                }
            }
            if (!saveList.isEmpty()) {
                roleRepository.saveAll(saveList);
            }
        }
    }

    private String getDataEntitlements(List<DataEntitlement> dataEntitlements) {

        if (CollectionUtils.isEmpty(dataEntitlements)) {
            return null;
        }

        Map<String, List<String>> dataEntitlementMap = Maps.newHashMapWithExpectedSize(dataEntitlements.size());

        for (DataEntitlement dataEntitlement : dataEntitlements) {
            dataEntitlementMap.put(dataEntitlement.getKey(), dataEntitlement.getValues());
        }

        String dataEntitlementsJson = null;

        try {
            dataEntitlementsJson = ratanObjectMapper.writeValueAsString(dataEntitlementMap);

        } catch (Exception e) {
            log.error("Error while converting data entitlements to JSON", e);
        }

        return dataEntitlementsJson;

    }

    private String getFunctionEntitlements(List<RoleEntitlement> roleEntitlements) {

        if (CollectionUtils.isEmpty(roleEntitlements)) {
            return null;
        }

        Map<String, List<String>> functionEntitlementMap = Maps.newHashMapWithExpectedSize(1);

        List<String> list = Lists.newArrayListWithCapacity(roleEntitlements.size());

        for (RoleEntitlement roleEntitlement : roleEntitlements) {

            list.add(roleEntitlement.getFeature() + AuthConstant.COLON + roleEntitlement.getAction());
        }

        functionEntitlementMap.put("Entity.flowzero_feature_action", list);

        String functionEntitlementJson = null;

        try {
            functionEntitlementJson = ratanObjectMapper.writeValueAsString(functionEntitlementMap);

        } catch (Exception e) {
            log.error("Error while converting function entitlements to JSON", e);
        }

        return functionEntitlementJson;
    }

    @Transactional(rollbackFor = Exception.class)
    public void syncEntitlements(Entitlements entitlements, User user) {

        if (entitlements == null) {
            log.warn("Entitlements is null for user: {}, need to check if there is an issue from ems3 side", user.getBankId());
            return;
        }

        syncRoleEntitlements(entitlements.getEntitlementName(), user.getBankId());

        String dataEntitlementJson = getDataEntitlements(entitlements.getDataEntitlements());

        user.setDataEntitlement(dataEntitlementJson);

        String functionEntitlementJson = getFunctionEntitlements(entitlements.getRoleEntitlements());

        if (StringUtils.isNotBlank(functionEntitlementJson)) {

            user.setFunctionEntitlement(functionEntitlementJson);

        } else {
            log.warn("Function entitlements is null for user: {}, need to check if there is an issue from ems3 side", user.getBankId());
        }

        userRepository.save(user);
    }

}

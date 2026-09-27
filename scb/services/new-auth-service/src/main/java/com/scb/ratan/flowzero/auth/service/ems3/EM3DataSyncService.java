package com.scb.ratan.flowzero.auth.service.ems3;

import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.ems3.EntitlementBean;
import com.scb.ratan.flowzero.auth.entity.ems3.UserEntitlement;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.service.DataSyncService;
import com.scb.ratan.flowzero.auth.service.user.IUserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class EM3DataSyncService implements DataSyncService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IUserService userService;

    @Autowired
    private EMS3DataCoordinator ems3SyncEntitlementService;

    @Autowired
    private EMS3DataFetchService ems3DataFetchService;

    public List<String> extractUserBankIds(List<UserEntitlement> userEntitlements) {

        return userEntitlements.stream()
            .filter(Objects::nonNull)
            .map(UserEntitlement::getUserIds)
            .filter(list -> !CollectionUtils.isEmpty(list))
            .flatMap(List::stream)
            .filter(StringUtils::isNotBlank)
            .distinct()
            .toList();
    }

    public void syncUsers() {
        log.info("start to sync all user from EMS3");

        List<UserEntitlement> userEntitlements;

        try {
            userEntitlements = ems3DataFetchService.fetchUserList();

            List<String> bankIdsFromEms3 = extractUserBankIds(userEntitlements);

            if (CollectionUtils.isEmpty(bankIdsFromEms3)) {
                log.info("No users found from EMS3. skipping sync. need to check if there is an issue from ems3 side.");
                return;
            }

            List<User> allDbUsers = userRepository.findAllActive();

            List<String> bankIdsFromDb = allDbUsers.stream().map(User::getBankId).toList();

            log.info("EMS3 returned {} users, database has {} users", bankIdsFromEms3.size(), allDbUsers.size());

            userService.saveOrUpdateUsers(bankIdsFromEms3, bankIdsFromDb);

        } catch (Exception ex) {

            log.error("Error sync EMS3 users", ex);

        }

        log.info("end to sync all user from EMS3");
    }

    public void syncEntitlement() {

        log.info("start to sync all entitlements from EMS3");

        List<User> allDbUsers = userRepository.findAllActive();

        for (User user : allDbUsers) {

            String userId = user.getBankId();

            try {

                List<EntitlementBean> dataEntitlementList = ems3DataFetchService.fetchEntitlementInfo(userId);

                EntitlementBean entitlementBean = dataEntitlementList.get(0);

                ems3SyncEntitlementService.syncEntitlements(entitlementBean.getEntitlements(), user);

            } catch (Exception e) {

                log.error("Error sync EMS3 entitlement for user {}", userId, e);
            }
        }

        log.info("end to sync all entitlements from EMS3");
    }

    /**
     * Separate sync user and entitlement
     */
    @Override
    @Async
    public void syncAll() {
        syncUsers();
        syncEntitlement();
    }

}
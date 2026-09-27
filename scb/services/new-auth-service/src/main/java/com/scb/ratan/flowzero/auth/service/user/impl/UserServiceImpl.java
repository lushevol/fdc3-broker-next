package com.scb.ratan.flowzero.auth.service.user.impl;

import com.google.common.collect.Lists;
import com.scb.ratan.flowzero.auth.constant.DataStatusEnum;
import com.scb.ratan.flowzero.auth.entity.dbo.User;
import com.scb.ratan.flowzero.auth.entity.vo.EntitlementVo;
import com.scb.ratan.flowzero.auth.repository.UserRepository;
import com.scb.ratan.flowzero.auth.service.user.IUserService;
import com.scb.ratan.flowzero.auth.util.RatanObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    private final RatanObjectMapper objectMapper;

    private static final int BATCH_SIZE = 100;

    private User buildActiveUser(String bankId) {
        User user = new User();
        user.setBankId(bankId);
        user.setStatus(DataStatusEnum.ACTIVE);
        return user;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void saveBatchUsers(List<String> bankIds) {

        if (CollectionUtils.isEmpty(bankIds)) {
            return;
        }

        List<User> saveList = Lists.newArrayListWithCapacity(BATCH_SIZE);

        for (String bankId : bankIds) {

            if (StringUtils.isBlank(bankId)) {
                continue;
            }

            saveList.add(buildActiveUser(bankId));

            if (saveList.size() == BATCH_SIZE) {
                userRepository.saveAll(saveList);
                saveList.clear();
            }
        }

        if (!saveList.isEmpty()) {
            userRepository.saveAll(saveList);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOrUpdateUsers(List<String> bankIdsFromEms3, List<String> bankIdsFromDb) {

        if (CollectionUtils.isEmpty(bankIdsFromDb)) {
            saveBatchUsers(bankIdsFromEms3);
            return;
        }

        List<String> usersToDelete = diff(bankIdsFromDb, new HashSet<>(bankIdsFromEms3));
        if (!usersToDelete.isEmpty()) {
            userRepository.deleteByBankIdIn(usersToDelete);
        }

        List<String> usersToAdd = diff(bankIdsFromEms3, new HashSet<>(bankIdsFromDb));
        if (!usersToAdd.isEmpty()) {
            saveBatchUsers(usersToAdd);
        }

    }

    private List<String> diff(List<String> source, Set<String> target) {
        return source.stream().filter(id -> !target.contains(id)).toList();
    }

    @Override
    public List<EntitlementVo> findEntitlementByBankIds(List<String> bankIds) {

        if (CollectionUtils.isEmpty(bankIds)) {
            return Collections.emptyList();
        }

        List<User> users = userRepository.findByBankIdIn(bankIds);

        return users.stream()
            .map(this::getAndConvertEntitlementVo)
            .collect(Collectors.toList());
    }

    private EntitlementVo getAndConvertEntitlementVo(User user) {
        EntitlementVo emptyEntitlement = new EntitlementVo();
        emptyEntitlement.setBankId(user.getBankId());

        if (StringUtils.isBlank(user.getDataEntitlement())) {
            return emptyEntitlement;
        }

        try {

            EntitlementVo entitlementVo = objectMapper.readValue(user.getDataEntitlement(), EntitlementVo.class);

            if (entitlementVo == null) {
                return emptyEntitlement;
            }

            entitlementVo.setBankId(user.getBankId());

            return entitlementVo;

        } catch (Exception e) {
            log.error("Error while converting data entitlements to EntitlementVo", e);
            return emptyEntitlement;
        }

    }

}

package com.scb.ratan.flowzero.auth.service.user;

import com.scb.ratan.flowzero.auth.entity.vo.EntitlementVo;

import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
public interface IUserService {

    void saveBatchUsers(List<String> bankIds);

    void saveOrUpdateUsers(List<String> bankIdsFromEms3, List<String> bankIdsFromDb);

    List<EntitlementVo> findEntitlementByBankIds(List<String> bankIds);

}

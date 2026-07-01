package com.scb.ratan.flowzero.designer.service;

import com.scb.ratan.flowzero.designer.entity.dto.*;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.entity.vo.UserVo;

import java.util.Collection;
import java.util.List;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
public interface IUserService {

    /**
     * Create a new user
     */
    UserVo create(CreateUserDto user);

    /**
     * Update an existing user
     */
    UserVo update(UpdateUserDto user);

    /**
     * Delete a user by ID
     */
    void delete(String id);

    /**
     * Get user by ID
     */
    UserVo findById(String id);

    /**
     * Get user by bankId
     */
    UserVo findByBankId(String bankId);

    /**
     * Get user by email
     */
    UserVo findByEmail(String email);

    /**
     * Get all users
     */
    List<UserVo> findAll();

    /**
     * Get users by country code
     */
    List<UserVo> findByCountryCode(String countryCode);

    /**
     * Get users by user name (fuzzy search)
     */
    List<UserVo> findByUserName(String userName);

    /**
     * Query users with pagination
     */
    PageResponseVo<UserVo> page(UserQueryDto queryDto, BasePageDto basePageDto);

    /**
     * Query user list by conditions
     */
    List<UserVo> searchByConditions(UserQueryDto queryDto);

    /**
     * Get users by role name (exact match)
     */
    List<UserVo> findByRoleName(String roleName);

    /**
     * Get users by a collection of bankIds
     */
    List<UserVo> findByBankIds(Collection<String> bankIds);

}

package com.scb.ratan.flowzero.designer.service.impl;

import com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum;
import com.scb.ratan.flowzero.designer.common.exception.BusinessException;
import com.scb.ratan.flowzero.designer.converter.UserConverter;
import com.scb.ratan.flowzero.designer.entity.dbo.User;
import com.scb.ratan.flowzero.designer.entity.dto.BasePageDto;
import com.scb.ratan.flowzero.designer.entity.dto.CreateUserDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateUserDto;
import com.scb.ratan.flowzero.designer.entity.dto.UserQueryDto;
import com.scb.ratan.flowzero.designer.entity.vo.PageResponseVo;
import com.scb.ratan.flowzero.designer.entity.vo.UserVo;
import com.scb.ratan.flowzero.designer.repository.UserRepository;
import com.scb.ratan.flowzero.designer.service.IUserService;
import com.scb.ratan.flowzero.designer.utils.SpecificationUtils;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;

import java.util.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    private final UserConverter userConverter;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVo create(CreateUserDto userDto) {

        // Check if bankId already exists
        Optional<User> bankIdOptional = userRepository.findByBankId(userDto.getBankId());
        if (bankIdOptional.isPresent()) {
            throw new BusinessException("User with bankId " + userDto.getBankId() + " already exists");
        }

        // Check if email already exists
        Optional<User> emailOptional = userRepository.findByEmail(userDto.getEmail());
        if (emailOptional.isPresent()) {
            throw new BusinessException("User with email " + userDto.getEmail() + " already exists");
        }
        User userToSave = userConverter.toEntityFromCreateDto(userDto);
        userToSave.setStatus(DataStatusEnum.ACTIVE);
        User user = userRepository.save(userToSave);
        return userConverter.toVo(user);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public UserVo update(UpdateUserDto userDto) {

        User existingUser = findByIdInternal(userDto.getId());
        // Check if bankId is being changed and if new value already exists
        if (StringUtils.isNotBlank(userDto.getBankId())
            && !userDto.getBankId().equals(existingUser.getBankId())) {
            Optional<User> duplicate = userRepository.findByBankId(userDto.getBankId());
            if (duplicate.isPresent()) {
                throw new BusinessException("User with bankId " + userDto.getBankId() + " already exists");
            }
        }
        if (StringUtils.isNotBlank(userDto.getEmail())
            && !userDto.getEmail().equals(existingUser.getEmail())) {
            Optional<User> duplicate = userRepository.findByEmail(userDto.getEmail());
            if (duplicate.isPresent()) {
                throw new BusinessException("User with email " + userDto.getEmail() + " already exists");
            }
        }

        // copy userDto to existing user entity
        BeanUtils.copyProperties(userDto, existingUser, "id", "status");
        User savedUser = userRepository.save(existingUser);
        return userConverter.toVo(savedUser);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        User user = findByIdInternal(id);
        user.setStatus(DataStatusEnum.DISABLED);
        userRepository.save(user);
        log.info("User deleted: id={}", id);
    }

    @Override
    public UserVo findById(String id) {
        User user = findByIdInternal(id);
        return userConverter.toVo(user);
    }

    @Override
    public UserVo findByBankId(String bankId) {
        Optional<User> userOpt = userRepository.findByBankId(bankId);
        if (userOpt.isEmpty()) {
            throw new BusinessException("Cannot find user by bankId: " + bankId);
        }
        return userConverter.toVo(userOpt.get());
    }

    @Override
    public UserVo findByEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new BusinessException("Cannot find user by email: " + email);
        }
        return userConverter.toVo(userOpt.get());
    }

    @Override
    public List<UserVo> findAll() {
        return userConverter.toVoList(userRepository.findAllActive());
    }

    @Override
    public List<UserVo> findByCountryCode(String countryCode) {
        return userConverter.toVoList(userRepository.findByCountryCode(countryCode));
    }

    @Override
    public List<UserVo> findByUserName(String userName) {
        if (StringUtils.isBlank(userName)) {
            throw new BusinessException("User name cannot be empty");
        }
        return userConverter.toVoList(userRepository.findByUserNameContainingIgnoreCase(userName));
    }

    @Override
    public PageResponseVo<UserVo> page(UserQueryDto queryDto, BasePageDto basePageDto) {
        Specification<User> spec = getUserSpecification(queryDto);

        Page<User> page = userRepository.findAllActive(spec, basePageDto.toPageable());
        return PageResponseVo.of(userConverter.toVoPage(page));
    }

    @Override
    public List<UserVo> searchByConditions(UserQueryDto queryDto) {
        Specification<User> spec = getUserSpecification(queryDto);
        return userConverter.toVoList(userRepository.findAllActive(spec));
    }

    private Specification<User> getUserSpecification(UserQueryDto queryDto) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            SpecificationUtils.addLikePredicate(predicates, root, cb, "bankId", queryDto.getBankId());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "userName", queryDto.getUserName());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "email", queryDto.getEmail());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "roleName", queryDto.getRoleName());
            SpecificationUtils.addLikePredicate(predicates, root, cb, "countryCode", queryDto.getCountryCode());
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    @Override
    public List<UserVo> findByRoleName(String roleName) {
        if (StringUtils.isBlank(roleName)) {
            throw new BusinessException("Role name cannot be empty");
        }
        return userConverter.toVoList(userRepository.findByRoleName(roleName));
    }

    @Override
    public List<UserVo> findByBankIds(Collection<String> bankIds) {
        if (bankIds == null || bankIds.isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return userConverter.toVoList(userRepository.findByBankIdIn(bankIds));
    }


    private User findByIdInternal(String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new BusinessException("Cannot find user by ID: " + id);
        }
        return userOpt.get();
    }

}

package com.scb.ratan.flowzero.designer.converter;

import com.scb.ratan.flowzero.designer.entity.dbo.User;
import com.scb.ratan.flowzero.designer.entity.dto.CreateUserDto;
import com.scb.ratan.flowzero.designer.entity.dto.UpdateUserDto;
import com.scb.ratan.flowzero.designer.entity.vo.UserVo;
import org.mapstruct.Mapper;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Mapper(componentModel = "spring")
public interface UserConverter extends BaseConverter<User, UserVo, CreateUserDto, UpdateUserDto> {
}

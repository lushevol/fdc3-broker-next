package com.scb.ratan.flowzero.designer.entity.vo;

import com.scb.ratan.flowzero.designer.entity.dbo.Field;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * @auther Xu, Eva
 * @date 09/02/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldDetailVo extends Field implements Serializable {

    private Set<String> formNames = new HashSet<>();

}

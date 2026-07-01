package com.scb.ratan.flowzero.designer.entity.vo;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Tian, Terry
 * @date 23/2/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class IdNameVo implements Serializable {

    private static final long serialVersionUID = -5718878086632732345L;

    private String id;

    private String name;

}

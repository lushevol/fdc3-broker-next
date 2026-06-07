package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateGroupVo implements Serializable {

    private static final long serialVersionUID = -1024829945903309248L;

    private String id;

    private String name;

    private String description;

}

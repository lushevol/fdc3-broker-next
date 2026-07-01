package com.scb.ratan.flowzero.designer.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author Kinson Wang
 * @date 3/31/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateGroupQueryDto implements Serializable {

    private static final long serialVersionUID = 8151796866632027586L;

    private String name;

}

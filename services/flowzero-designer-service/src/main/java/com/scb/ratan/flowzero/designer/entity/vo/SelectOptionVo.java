package com.scb.ratan.flowzero.designer.entity.vo;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author MaYue
 * @date 12/29/2025
 */
@Data
@NoArgsConstructor
public class SelectOptionVo implements Serializable {

    private String label;

    private String value;

    public SelectOptionVo(String value, String label) {
        this.label = label;
        this.value = value;
    }

    public SelectOptionVo(String value) {
        this.label = value;
        this.value = value;
    }

}

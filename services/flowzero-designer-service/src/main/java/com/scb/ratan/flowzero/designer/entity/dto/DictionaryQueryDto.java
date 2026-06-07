package com.scb.ratan.flowzero.designer.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Aiden
 * @date 2/11/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DictionaryQueryDto implements Serializable {

    private String id;

    private String name;

}

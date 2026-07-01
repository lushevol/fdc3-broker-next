package com.scb.ratan.flowzero.designer.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @auther Xu, Eva
 * @date 06/02/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FieldQueryDto implements Serializable {

    private String id;

    private String indexedTerm;

    private String label;

    private String uiType;

    private String dataType;

    private String status;

    private String usedInReporting;

    private String usedInInboxSearching;

    private String createdBy;

}

package com.scb.ratan.flowzero.designer.entity.vo;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * @auther Xu, Eva
 * @date 05/01/2026
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BatchStatusUpdateVo implements Serializable {

    @NotNull
    private List<UUID> updatedIds = new ArrayList<>();

    @NotNull
    private List<UUID> forbiddenIds = new ArrayList<>();

}

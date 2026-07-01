package com.scb.ratan.flowzero.designer.entity.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Response VO for PUT /api/v1/user/settings/{type}/{name}.
 *
 * @author Kinson Wang
 * @date 5/6/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSettingsSaveVo implements Serializable {

    private static final long serialVersionUID = 5543210987654321002L;

    private String userId;

    private String type;

    private String name;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'", timezone = "UTC")
    private LocalDateTime updatedAt;

}

package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.List;

/**
 * @author MaYue
 * @date 1/21/2026
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseVo<T> implements Serializable {

    private static final long serialVersionUID = -373222714458475821L;
    private int page;
    private int size;
    private long totalElements;
    private long totalPages;
    private List<T> data;

    public static <T> PageResponseVo<T> of(Page<T> page) {
        return new PageResponseVo<T>(
            page.getNumber(), page.getSize(), page.getTotalElements(),
            page.getTotalPages(), page.get().toList());
    }

}

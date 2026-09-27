package com.scb.ratan.flowzero.auth.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.List;

/**
 * @auther Xu, Eva
 * @date 8/12/2025
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponseVo<T> implements Serializable {

    private int page;
    private int size;
    private long totalElements;
    private long totalPages;
    private List<T> data;

    public static <T> PageResponseVo<T> of(Page<T> page) {
        return new PageResponseVo<T>(
            page.getNumber(), page.getSize(), page.getTotalElements(),
            page.getTotalPages(), page.getContent());
    }

    public static <T, V> PageResponseVo<V> of(Page<T> page, List<V> data) {
        return new PageResponseVo<V>(
            page.getNumber(), page.getSize(), page.getTotalElements(),
            page.getTotalPages(), data);
    }

}

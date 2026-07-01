package com.scb.ratan.flowzero.designer.converter;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

/**
 * @author Kinson Wang
 * @date 4/2/2026
 */
public interface BaseConverter<E, V, C, U> {

    E toEntityFromCreateDto(C dto);

    E toEntityFromUpdateDto(U dto);

    V toVo(E entity);

    List<V> toVoList(List<E> entityList);

    default Page<V> toVoPage(Page<E> page) {
        List<V> content = toVoList(page.getContent());
        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }

}

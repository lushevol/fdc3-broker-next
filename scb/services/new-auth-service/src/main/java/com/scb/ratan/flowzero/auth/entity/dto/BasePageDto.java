package com.scb.ratan.flowzero.auth.entity.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author MaYue
 * @date 8/12/2025
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BasePageDto implements Serializable {

    @Serial
    private static final long serialVersionUID = -7537409578710573344L;

    @Min(0)
    private Integer page = 0;

    @Min(1)
    @Max(100)
    private Integer size = 20;

    private String sortBy = "createdAt";

    private Sort.Direction sortDirection = Sort.Direction.DESC;

    public Pageable toPageable() {
        return PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
    }

}
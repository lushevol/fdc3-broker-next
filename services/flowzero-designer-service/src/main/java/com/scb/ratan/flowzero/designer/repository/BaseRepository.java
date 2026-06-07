package com.scb.ratan.flowzero.designer.repository;

import com.scb.ratan.flowzero.designer.common.enums.DataStatusEnum;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;

/**
 * @author Kinson Wang
 * @date 4/1/2026
 */
@NoRepositoryBean
public interface BaseRepository<T, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

    default Specification<T> withActiveStatus() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("status"), DataStatusEnum.ACTIVE);
    }

    default List<T> findAllActive() {
        return findAll(Specification.where(withActiveStatus()));
    }

    default Page<T> findAllActive(Specification<T> spec, Pageable pageable) {
        return findAll(Specification.where(withActiveStatus()).and(spec), pageable);
    }

    default List<T> findAllActive(Specification<T> spec) {
        return findAll(Specification.where(withActiveStatus()).and(spec));
    }

}

package com.scb.ratan.flowzero.workflow.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * @author Tian, Terry
 * @date 13/3/2025
 */
public class SpecificationUtils {

    public static <T> void addInPredicate(List<Predicate> predicates,
        Root<T> root, String field, String commaSeparatedValue) {
        if (StringUtils.isNotBlank(commaSeparatedValue)) {
            List<String> values = List.of(commaSeparatedValue.trim().split(","));
            predicates.add(root.get(field).in(values));
        }
    }

    public static <T> void addInPredicate(List<Predicate> predicates,
        Root<T> root, String field, Collection<?> collection) {
        if (!CollectionUtils.isEmpty(collection)) {
            predicates.add(root.get(field).in(collection));
        }
    }

    /**
     * Adds a case-insensitive, whitespace-ignored LIKE predicate for the specified field.
     *
     * @param predicates target predicate list
     * @param root       Root object
     * @param cb         CriteriaBuilder
     * @param field      entity field name
     * @param value      query value (skipped if null or blank)
     */
    public static <T> void addLikePredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb,
        String field, String value) {
        if (StringUtils.isNotBlank(value)) {
            String pattern = "%" + value.toLowerCase().replaceAll("\\s+", "") + "%";
            Expression<String> replaced = cb.function("REPLACE",
                String.class, root.get(field), cb.literal(" "), cb.literal(""));
            Expression<String> lowered = cb.function("LOWER", String.class, replaced);
            predicates.add(cb.like(lowered, pattern));
        }
    }

    public static <T> void addEqualPredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb,
        String field, Object value) {
        if (value != null) {
            predicates.add(cb.equal(root.get(field), value));
        }
    }

    public static <T> void addNotEqualPredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb,
        String field, Object value) {
        if (value != null) {
            predicates.add(cb.equal(root.get(field), value).not());
        }
    }

    /**
     * Adds a {@code field >= from} predicate when {@code from} is non-null.
     *
     * @param field entity field name (must be a {@link LocalDateTime} column)
     * @param from  inclusive lower bound datetime (skipped if null)
     */
    public static <T> void addDateFromPredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb,
        String field, LocalDateTime from) {
        if (from != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get(field), from));
        }
    }

    /**
     * Adds a {@code field <= to} predicate when {@code to} is non-null.
     *
     * @param field entity field name (must be a {@link LocalDateTime} column)
     * @param to    inclusive upper bound datetime (skipped if null)
     */
    public static <T> void addDateToPredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb,
        String field, LocalDateTime to) {
        if (to != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get(field), to));
        }
    }

}

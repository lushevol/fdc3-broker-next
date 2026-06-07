package com.scb.ratan.flowzero.designer.utils;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
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

    public static <T> void addNotInPredicate(List<Predicate> predicates,
        Root<T> root, String field, Collection<?> collection) {
        if (!CollectionUtils.isEmpty(collection)) {
            predicates.add(root.get(field).in(collection).not());
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
            Expression<String> replaced = cb.function("regexp_replace",
                String.class, root.get(field), cb.literal("\\s+"), cb.literal(""), cb.literal("g"));
            Expression<String> lowered = cb.function("lower", String.class, replaced);
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
     * Adds a predicate that checks whether a comma-separated DB field contains any of the
     * given comma-separated query values.
     * <p>
     * For example, if the DB field stores {@code "CN,US,HK"} and the query value is {@code "CN,JP"},
     * this produces: {@code WHERE (',CN,US,HK,' LIKE '%,CN,%' OR ',CN,US,HK,' LIKE '%,JP,%')}.
     * Wrapping both sides with commas ensures exact token matching regardless of position.
     *
     * @param predicates           target predicate list
     * @param root                 Root object
     * @param cb                   CriteriaBuilder
     * @param field                entity field name (stores comma-separated values in DB)
     * @param commaSeparatedValue  comma-separated query values (skipped if null or blank)
     */
    public static <T> void addCommaSeparatedContainsPredicate(List<Predicate> predicates,
        Root<T> root, CriteriaBuilder cb, String field, String commaSeparatedValue) {
        if (StringUtils.isNotBlank(commaSeparatedValue)) {
            String[] tokens = commaSeparatedValue.trim().split(",");
            List<Predicate> orPredicates = new ArrayList<>();
            for (String token : tokens) {
                String trimmed = token.trim();
                if (StringUtils.isNotBlank(trimmed)) {
                    // Wrap field with commas on both sides to uniformly match any position
                    Expression<String> wrapped = cb.concat(
                        cb.concat(cb.literal(","), root.get(field)), cb.literal(","));
                    orPredicates.add(cb.like(wrapped, "%," + trimmed + ",%"));
                }
            }
            if (!orPredicates.isEmpty()) {
                predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
            }
        }
    }

}

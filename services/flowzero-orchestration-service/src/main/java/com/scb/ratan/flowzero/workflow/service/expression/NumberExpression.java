package com.scb.ratan.flowzero.workflow.service.expression;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * Spring-managed JUEL extension bean for <b>Number</b> field operators
 * that Camunda 7 does not support natively.
 *
 * <p>All comparisons use {@link BigDecimal} internally to avoid precision loss
 * when the process variable is {@code Integer}, {@code Long}, {@code Double}, etc.
 * All parameters are typed as {@code Object} so that BPMN string literals (e.g. {@code '1000'})
 * are also accepted without a type-mismatch error from JUEL.
 *
 * <p>Usage in BPMN sequence-flow condition expressions:
 * <pre>
 *   ${numberExpression.isEq(amount, 1000)}      or  ${numberExpression.isEq(amount, '1000')}
 *   ${numberExpression.isNe(amount, 1000)}      or  ${numberExpression.isNe(amount, '1000')}
 *   ${numberExpression.isGt(amount, 1000)}      or  ${numberExpression.isGt(amount, '1000')}
 *   ${numberExpression.isGte(amount, 1000)}     or  ${numberExpression.isGte(amount, '1000')}
 *   ${numberExpression.isLt(amount, 9999)}      or  ${numberExpression.isLt(amount, '9999')}
 *   ${numberExpression.isLte(amount, 9999)}     or  ${numberExpression.isLte(amount, '9999')}
 *   ${numberExpression.in(age, 10, 20, 30)}     or  ${numberExpression.in(age, '10', '20', '30')}
 *   ${numberExpression.notIn(age, 10, 20, 30)}
 *   ${numberExpression.between(age, 10, 100)}   or  ${numberExpression.between(age, '10', '100')}
 *   ${numberExpression.notBetween(age, 10, 100)}
 * </pre>
 *
 * <p><b>Note:</b> Method names {@code eq/ne/gt/gte/lt/lte} are JUEL reserved keywords
 * and will cause a syntax error in BPMN expressions. Use the {@code is-} prefixed versions instead.
 *
 * @author Tian, Terry
 * @date 2/4/2025
 */
@Component("numberExpression")
public class NumberExpression {

    // ── isEq / isNe ──────────────────────────────────────────────────────────

    /**
     * Returns {@code true} if {@code value == target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isEq(amount, 1000)}} or {@code ${numberExpression.isEq(amount, '1000')}}
     */
    public boolean isEq(Object value, Object target) {
        if (value == null || target == null) {
            return value == null && target == null;
        }
        return toBigDecimal(value).compareTo(toBigDecimal(target)) == 0;
    }

    /**
     * Returns {@code true} if {@code value != target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isNe(amount, 1000)}} or {@code ${numberExpression.isNe(amount, '1000')}}
     */
    public boolean isNe(Object value, Object target) {
        return !isEq(value, target);
    }

    // ── isGt / isGte ─────────────────────────────────────────────────────────

    /**
     * Returns {@code true} if {@code value > target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isGt(amount, 1000)}} or {@code ${numberExpression.isGt(amount, '1000')}}
     */
    public boolean isGt(Object value, Object target) {
        if (value == null) {
            return false;
        }
        return toBigDecimal(value).compareTo(toBigDecimal(target)) > 0;
    }

    /**
     * Returns {@code true} if {@code value >= target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isGte(amount, 1000)}} or {@code ${numberExpression.isGte(amount, '1000')}}
     */
    public boolean isGte(Object value, Object target) {
        if (value == null) {
            return false;
        }
        return toBigDecimal(value).compareTo(toBigDecimal(target)) >= 0;
    }

    // ── isLt / isLte ─────────────────────────────────────────────────────────

    /**
     * Returns {@code true} if {@code value < target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isLt(amount, 9999)}} or {@code ${numberExpression.isLt(amount, '9999')}}
     */
    public boolean isLt(Object value, Object target) {
        if (value == null) {
            return false;
        }
        return toBigDecimal(value).compareTo(toBigDecimal(target)) < 0;
    }

    /**
     * Returns {@code true} if {@code value <= target} numerically.
     *
     * <p>JUEL: {@code ${numberExpression.isLte(amount, 9999)}} or {@code ${numberExpression.isLte(amount, '9999')}}
     */
    public boolean isLte(Object value, Object target) {
        if (value == null) {
            return false;
        }
        return toBigDecimal(value).compareTo(toBigDecimal(target)) <= 0;
    }

    // ── in / notIn ────────────────────────────────────────────────────────────

    /**
     * Returns {@code true} if {@code value} numerically equals any of the {@code candidates}.
     *
     * <p>JUEL: {@code ${numberExpression.in(age, 10, 20, 30)}} or {@code ${numberExpression.in(age, '10', '20', '30')}}
     */
    public boolean in(Object value, Object... candidates) {
        if (value == null || candidates == null) {
            return false;
        }
        BigDecimal bd = toBigDecimal(value);
        for (Object candidate : candidates) {
            if (bd.compareTo(toBigDecimal(candidate)) == 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns {@code true} if {@code value} numerically equals none of the {@code candidates}.
     *
     * <p>JUEL: {@code ${numberExpression.notIn(age, 10, 20, 30)}}
     */
    public boolean notIn(Object value, Object... candidates) {
        return !in(value, candidates);
    }

    // ── between / notBetween ──────────────────────────────────────────────────

    /**
     * Returns {@code true} if {@code min <= value <= max} (both ends inclusive).
     *
     * <p>JUEL: {@code ${numberExpression.between(age, 10, 100)}}
     */
    public boolean between(Object value, Object min, Object max) {
        if (value == null) {
            return false;
        }
        BigDecimal bd = toBigDecimal(value);
        return bd.compareTo(toBigDecimal(min)) >= 0 && bd.compareTo(toBigDecimal(max)) <= 0;
    }

    /**
     * Returns {@code true} if {@code value < min} OR {@code value > max}.
     *
     * <p>JUEL: {@code ${numberExpression.notBetween(age, 10, 100)}}
     */
    public boolean notBetween(Object value, Object min, Object max) {
        return !between(value, min, max);
    }

    // ── internal helper ───────────────────────────────────────────────────────

    private static BigDecimal toBigDecimal(Object obj) {
        if (obj instanceof BigDecimal) {
            return (BigDecimal) obj;
        }
        return new BigDecimal(obj.toString());
    }

}

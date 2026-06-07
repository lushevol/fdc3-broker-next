package com.scb.ratan.flowzero.workflow.service.expression;

import org.springframework.stereotype.Component;

/**
 * Spring-managed JUEL extension bean for <b>String</b> field operators
 * that Camunda 7 does not support natively.
 *
 * <p>Camunda resolves this bean from the Spring context by its component name.
 * Usage in BPMN sequence-flow condition expressions:
 * <pre>
 *   ${stringExpression.in(name, "John", "Mary", "Tom")}
 *   ${stringExpression.notIn(name, "John", "Mary", "Tom")}
 *   ${stringExpression.matches(name, "^[A-Z].*")}
 *   ${stringExpression.notMatches(name, "^[A-Z].*")}
 * </pre>
 *
 * @author Tian, Terry
 * @date 2/4/2025
 */
@Component("stringExpression")
public class StringExpression {

    /**
     * Returns {@code true} if {@code value} equals any of the {@code candidates} (null-safe).
     *
     * <p>JUEL: {@code ${stringExpression.in(name, "John", "Mary", "Tom")}}
     *
     * @param value      process variable value (may be null)
     * @param candidates one or more string candidates to match against
     */
    public boolean in(Object value, String... candidates) {
        if (value == null || candidates == null) {
            return false;
        }
        String str = value.toString();
        for (String candidate : candidates) {
            if (str.equals(candidate)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns {@code true} if {@code value} equals none of the {@code candidates} (null-safe).
     *
     * <p>JUEL: {@code ${stringExpression.notIn(name, "John", "Mary", "Tom")}}
     */
    public boolean notIn(Object value, String... candidates) {
        return !in(value, candidates);
    }

    /**
     * Null-safe regex match — returns {@code false} when {@code value} is null.
     *
     * <p>JUEL: {@code ${stringExpression.matches(name, "^[A-Z].*")}}
     *
     * @param value process variable value
     * @param regex Java regular expression pattern (same rules as {@link String#matches})
     */
    public boolean matches(Object value, String regex) {
        if (value == null) {
            return false;
        }
        return value.toString().matches(regex);
    }

    /**
     * Null-safe regex non-match — returns {@code true} when {@code value} is null.
     *
     * <p>JUEL: {@code ${stringExpression.notMatches(name, "^[A-Z].*")}}
     */
    public boolean notMatches(Object value, String regex) {
        if (value == null) {
            return true;
        }
        return !value.toString().matches(regex);
    }

}

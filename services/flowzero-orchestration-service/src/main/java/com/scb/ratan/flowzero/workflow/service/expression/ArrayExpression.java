package com.scb.ratan.flowzero.workflow.service.expression;

import java.util.Arrays;
import java.util.Collection;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

/**
 * Spring-managed JUEL extension bean for <b>Array</b> (Collection) field operators
 *
 * <p>The process variable must be a {@link Collection} at runtime (e.g. {@code ArrayList<String>}).
 *
 * <p>Usage in BPMN sequence-flow condition expressions:
 * <pre>
 *   ${arrayExpression.contain(countries, "Apple")}
 *   ${arrayExpression.notContain(countries, "Apple")}
 * </pre>
 *
 * @author Tian, Terry
 * @date 2/4/2025
 */
@Component("arrayExpression")
public class ArrayExpression {

    /**
     * Returns {@code true} if the collection contains the given value.
     *
     * <p>JUEL: {@code ${arrayExpression.contain(countries, "Apple")}}
     *
     * @param array the process variable — accepts {@link Collection} or Jackson {@link ArrayNode}
     *              (null-safe: returns {@code false} when null)
     * @param value the value that must be present
     */
    public boolean contain(Object array, String value) {
        if (array == null || value == null) {
            return false;
        }
        if (array instanceof Collection) {
            return ((Collection<?>) array).contains(value);
        }
        if (array.getClass().isArray()) {
            return Arrays.asList((Object[]) array).contains(value);
        }
        if (array instanceof ArrayNode) {
            for (JsonNode node : (ArrayNode) array) {
                if (value.equals(node.asText())) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Returns {@code true} if the collection does not contain the given value.
     *
     * <p>JUEL: {@code ${arrayExpression.notContain(countries, "Apple")}}
     *
     * @param array the process variable (null-safe: returns {@code true} when null)
     * @param value      the value that must be absent from the collection
     */
    public boolean notContain(Object array, String value) {
        if (array == null) {
            return true;
        }
        return !contain(array, value);
    }

}

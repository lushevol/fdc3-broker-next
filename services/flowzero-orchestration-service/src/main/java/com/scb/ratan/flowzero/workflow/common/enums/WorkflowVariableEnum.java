package com.scb.ratan.flowzero.workflow.common.enums;

import java.util.LinkedHashMap;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author Tian, Terry
 * @date 1/4/2025
 */
@Getter
@AllArgsConstructor
public enum WorkflowVariableEnum {

    SYS_INITIATOR_ID("initiatorId", DataTypeEnum.STRING, VariableNamespaceEnum.SYS, null, "sys.initiatorId");

    private final String name;

    private final DataTypeEnum dataType;

    private final VariableNamespaceEnum namespace;

    private final WorkflowVariableEnum parent;

    private final String path;

    /**
     * Inserts {@code value} into {@code map} at the position determined by
     * {@code variable}'s {@code path} field, creating intermediate nested maps as needed.
     *
     * <p>The nesting structure is derived entirely from the dot-separated {@code path},
     * so the namespace is automatically included as the first level.
     *
     * <p>Examples:
     * <pre>
     *   buildVariableMap(map, SYS_INITIATOR_ID, "u001")
     *   // path = "sys.initiatorId"
     *   // map = { "sys": { "initiatorId": "u001" } }
     *
     *   buildVariableMap(map, SYS_USER_COUNTRY_SHORT_NAME, "SG")
     *   // path = "sys.user.country.shortName"
     *   // map = { "sys": { "user": { "country": { "shortName": "SG" } } } }
     * </pre>
     *
     * @param map      root map to write into (mutated in place)
     * @param variable target variable; its {@code path} determines nesting depth
     * @param value    value to place at the leaf node
     */
    @SuppressWarnings("unchecked")
    public static void buildVariableMap(Map<String, Object> map, WorkflowVariableEnum variable, Object value) {
        String[] segments = variable.getPath().split("\\.");
        Map<String, Object> current = map;
        // Navigate / create all intermediate maps (every segment except the last)
        for (int i = 0; i < segments.length - 1; i++) {
            current = (Map<String, Object>) current.computeIfAbsent(segments[i], k -> new LinkedHashMap<>());
        }
        // Place the value at the leaf segment
        current.put(segments[segments.length - 1], value);
    }

}

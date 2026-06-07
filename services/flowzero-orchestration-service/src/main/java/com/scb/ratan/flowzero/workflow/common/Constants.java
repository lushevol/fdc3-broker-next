package com.scb.ratan.flowzero.workflow.common;

/**
 * Workflow task operation constants.
 *
 * <p>Declared as a {@code final class} with a private constructor per Alibaba Java
 * development standards: interfaces must not be used as constant containers
 * (constant-interface anti-pattern), because any class could {@code implements} them,
 * polluting its own namespace with unrelated constants.
 *
 * @author MaYue
 * @date 8/12/2025
 */
public class Constants {

    public static final String REJECT_TO_KEY = "rejectTo";
    public static final String TERMINATE_BUTTON = "terminateButton";
    public static final String REJECT_BUTTON = "rejectButton";
    public static final String APPROVE_BUTTON = "approveButton";

}

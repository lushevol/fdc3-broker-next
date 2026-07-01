package com.scb.ratan.flowzero.workflow.common.exception;

/**
 * @author Tian, Terry
 * @date 9/3/2026
 */
public class BusinessException extends RuntimeException {

    private static final long serialVersionUID = 7354425150517454939L;

    public BusinessException(String message) {
        super(message);
    }

}
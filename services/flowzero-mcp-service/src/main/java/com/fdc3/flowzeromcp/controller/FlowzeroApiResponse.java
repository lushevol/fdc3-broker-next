package com.fdc3.flowzeromcp.controller;

public record FlowzeroApiResponse<T>(int code, String message, T data) {

    public static <T> FlowzeroApiResponse<T> success(T data) {
        return new FlowzeroApiResponse<>(200, "success", data);
    }
}

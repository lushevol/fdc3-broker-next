package com.scb.ratan.flowzero.workflow.entity.vo;

import lombok.Data;
import java.util.List;

@Data
public class TodoPageResponse {

    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private List<TodoItem> data;

}

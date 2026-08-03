package com.sc.faas.service;

import com.sc.faas.dto.MyObject;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProcessService {
    public MyObject getObjectById(Long id) {
        return new MyObject(id, "Hello World");
    }
}

package com.sc.faas.service;

import com.sc.faas.dto.MyObject;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MutationService {

    public MyObject updateObject(Long id, String name) {
        return new MyObject(id, name);
    }
}

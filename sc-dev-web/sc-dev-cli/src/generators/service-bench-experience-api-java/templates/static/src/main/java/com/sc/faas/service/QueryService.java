package com.sc.faas.service;

import com.sc.faas.dto.Message;
import com.sc.faas.dto.MyObject;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class QueryService {

    public List<MyObject> objects() {
        return List.of(new MyObject(10L, "TEST"));
    }

    public Message get_message(){
        return  new Message("Welcome to Service Bench - API - Kotlin Experience API (Java)");
    }
}

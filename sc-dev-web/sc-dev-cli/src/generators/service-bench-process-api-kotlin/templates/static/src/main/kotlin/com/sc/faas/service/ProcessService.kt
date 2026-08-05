package com.sc.faas.service

import jakarta.enterprise.context.ApplicationScoped
import com.sc.faas.dto.MyObject

@ApplicationScoped
class ProcessService {

    fun getObjectById(id: Long?): MyObject {
        return MyObject(id, "Hello World")
    }
}
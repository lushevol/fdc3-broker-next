package com.sc.faas.service

import com.sc.faas.dto.Message
import com.sc.faas.dto.Object
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class QueryService {
    /**
     * graphql query expose as
     * { "query": "query { objects {id name} }" }
     *
     */
    fun objects(): List<Object> {
        return listOf(Object(id = 1, name = "TEST"))
    }
    fun get_message(): Message {
        return  Message("Welcome to Service Bench - API - Kotlin Experience API (GraphQL)")
    }
}

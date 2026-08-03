package com.sc.faas.service

import com.sc.faas.dto.Object
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class MutationService {
    /**
     * graphql mutation expose as
     * { "query": "mutation updateObjectMutation { updateObject ( id: 1, name: \"hello\") { id name }}" }
     */
    fun updateObject(id: Int, name: String): Object {
        // your own mutation logic
        return Object(id, name)
    }
}

package com.sc.faas

import com.expediagroup.graphql.generator.TopLevelObject
import com.sc.devkit.graphql.dto.Input
import com.sc.devkit.graphql.service.GraphQLServer
import com.sc.faas.service.MutationService
import com.sc.faas.service.QueryService
import io.quarkus.funqy.Funq
import jakarta.inject.Inject
import jakarta.enterprise.context.ApplicationScoped

@ApplicationScoped
class Function {
    @Inject
    private lateinit var queryService: QueryService

    @Inject
    private lateinit var mutationService: MutationService

    private val graphQLServer by lazy {
        GraphQLServer.Builder()
            .federatedSupportedPackages(
                listOf(
                    "com.sc.faas.dto",
                )
            )
            .queries(listOf(TopLevelObject(queryService, QueryService::class)))
            .mutations(listOf(TopLevelObject(mutationService, MutationService::class)))
            .build()
    }

    @Funq
    fun graphql(input: Input): Any {
        return graphQLServer.serve(input)
    }
}

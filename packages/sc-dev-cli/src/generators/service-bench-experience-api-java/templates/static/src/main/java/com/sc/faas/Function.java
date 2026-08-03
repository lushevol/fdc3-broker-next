package com.sc.faas;

import com.expediagroup.graphql.generator.TopLevelObject;
import com.sc.devkit.graphql.dto.Input;
import com.sc.devkit.graphql.service.GraphQLServer;
import com.sc.devkit.graphql.service.GraphQLUtil;
import com.sc.faas.service.MutationService;
import com.sc.faas.service.QueryService;
import io.quarkus.funqy.Funq;
import jakarta.inject.Inject;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class Function {

    @Inject
    private QueryService queryService;

    @Inject
    private MutationService mutationService;

    private GraphQLServer graphQLServer;

    public GraphQLServer getGraphQLServer() {
        if (graphQLServer == null) {
            graphQLServer = new GraphQLServer.Builder()
                    .federatedSupportedPackages(List.of("com.sc.faas.dto"))
                    .queries(List.of(new TopLevelObject(queryService, GraphQLUtil.fromJavaClass(QueryService.class))))
                    .mutations(List.of(new TopLevelObject(mutationService, GraphQLUtil.fromJavaClass(MutationService.class))))
                    .build();
        }
        return graphQLServer;
    }

    @Funq
    public Object graphql(Input input) {
        return getGraphQLServer().serve(input);
    }
}

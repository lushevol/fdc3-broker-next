package com.sc.faas;


import com.sc.devkit.graphql.service.GraphQLServer;
import com.sc.faas.service.MutationService;
import com.sc.faas.service.QueryService;
import io.quarkus.test.InjectMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

@QuarkusTest
class FunctionTest {

    @Mock
    private QueryService queryService;

    @Mock
    private MutationService mutationService;

    @Mock
    private GraphQLServer graphQLServer;

    @Inject
    private Function function;


    @Test
    public void  func() {
        GraphQLServer  server = function.getGraphQLServer();
        Assertions.assertNotNull(server);
    }
}
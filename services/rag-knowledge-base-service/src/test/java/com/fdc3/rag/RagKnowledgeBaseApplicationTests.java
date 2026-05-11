package com.fdc3.rag;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "rag.embedding.provider=deterministic",
        "rag.ingestion.enabled=false"
})
class RagKnowledgeBaseApplicationTests {

    @Test
    void contextLoads() {
    }
}

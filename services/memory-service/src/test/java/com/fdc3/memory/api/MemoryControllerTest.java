package com.fdc3.memory.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fdc3.memory.repository.MemoryEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = "spring.datasource.url=jdbc:sqlite:target/memory-controller-test.sqlite")
@AutoConfigureMockMvc
class MemoryControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemoryEntryRepository repository;

    @BeforeEach
    void setUp() {
        repository.deleteAll();
    }

    @Test
    void createsAndSearchesMemoryByScope() throws Exception {
        mockMvc.perform(post("/api/memory/entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tenantId": "default",
                                  "userId": "operator-1",
                                  "desk": "rates",
                                  "type": "PREFERENCE",
                                  "title": "Morning format",
                                  "body": "Prefers summaries grouped by Rates, FX, Credit.",
                                  "tags": ["morning", "format"],
                                  "source": "USER",
                                  "confidence": 1.0,
                                  "attributesJson": "{\\"region\\":\\"APAC\\"}"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.status").value("ACTIVE"))
                .andExpect(jsonPath("$.schemaVersion").value(1));

        mockMvc.perform(get("/api/memory/entries")
                        .param("tenantId", "default")
                        .param("userId", "operator-1")
                        .param("type", "PREFERENCE")
                        .param("q", "Rates"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.entries", hasSize(1)))
                .andExpect(jsonPath("$.entries[0].title").value("Morning format"))
                .andExpect(jsonPath("$.entries[0].tags[0]").value("morning"));
    }

    @Test
    void rejectsMissingUserId() throws Exception {
        mockMvc.perform(post("/api/memory/entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tenantId": "default",
                                  "type": "NOTE",
                                  "title": "Invalid",
                                  "body": "Missing user."
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.userId").exists());
    }

    @Test
    void updatesArchivesAndSoftDeletesMemory() throws Exception {
        String response = mockMvc.perform(post("/api/memory/entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tenantId": "default",
                                  "userId": "operator-1",
                                  "type": "NOTE",
                                  "title": "Escalation",
                                  "body": "Escalate failed trades over ten million."
                                }
                                """))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String id = objectMapper.readTree(response).get("id").asText();

        mockMvc.perform(patch("/api/memory/entries/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "tenantId": "default",
                                  "userId": "operator-1",
                                  "title": "Updated escalation",
                                  "tags": ["settlement"]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated escalation"))
                .andExpect(jsonPath("$.tags[0]").value("settlement"));

        mockMvc.perform(post("/api/memory/entries/{id}/archive", id)
                        .param("tenantId", "default")
                        .param("userId", "operator-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ARCHIVED"));

        mockMvc.perform(delete("/api/memory/entries/{id}", id)
                        .param("tenantId", "default")
                        .param("userId", "operator-1"))
                .andExpect(status().isNoContent());
    }
}

package com.fdc3.memory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JsonFieldMapperTest {

    @Test
    void serializesTagsAsStableJsonArray() {
        JsonFieldMapper mapper = new JsonFieldMapper(new ObjectMapper());

        String json = mapper.tagsToJson(List.of("rates", "morning-check", "rates", " "));

        assertThat(json).isEqualTo("[\"rates\",\"morning-check\"]");
    }

    @Test
    void rejectsNonObjectAttributes() {
        JsonFieldMapper mapper = new JsonFieldMapper(new ObjectMapper());

        assertThatThrownBy(() -> mapper.attributesToJsonString("[1,2]"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("attributes must be a JSON object");
    }
}

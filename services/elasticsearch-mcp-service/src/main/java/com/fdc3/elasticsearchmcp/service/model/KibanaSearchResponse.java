package com.fdc3.elasticsearchmcp.service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public record KibanaSearchResponse(
        Map<String, KibanaAggregation> aggregations
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record KibanaAggregation(
            Double value,
            List<KibanaBucket> buckets
    ) {
        @JsonProperty("buckets")
        public List<KibanaBucket> buckets() {
            return buckets;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record KibanaBucket(
            @JsonProperty("key_as_string") String keyAsString,
            @JsonProperty("doc_count") long docCount,
            @JsonProperty("unique_users") KibanaAggregation uniqueUsers
    ) {
    }
}

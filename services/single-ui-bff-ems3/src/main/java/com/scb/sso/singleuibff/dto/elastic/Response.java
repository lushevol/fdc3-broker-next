package com.scb.sso.singleuibff.dto.elastic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Response {

    private int took;
    @JsonProperty("timed_out")
    private boolean timeOut;
    @JsonProperty("_shard")
    private Shard shard;
    @JsonProperty("hits")
    private Hits hits;
    private String result;

}

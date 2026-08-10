package com.scb.sso.singleuibff.dto.elastic;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Shard {

    private int total;
    private int successful;
    private int skipped;
    private int failed;

}

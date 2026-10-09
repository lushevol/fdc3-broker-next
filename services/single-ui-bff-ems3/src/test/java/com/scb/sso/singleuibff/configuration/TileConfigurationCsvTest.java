package com.scb.sso.singleuibff.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scb.sso.singleuibff.util.Constant;
import com.scb.sso.singleuibff.util.CsvUtility;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class TileConfigurationCsvTest {
    @Test
    void extendedCsvKeepsFlowZeroProviderAndFeatureMapping() throws Exception {
        String headers = String.join(",", Constant.TILE_HEADERS)
            + ",Provider,EMS3 App ID,EMS3 App Name,EMS3 Subject\n";
        String row = "FlowZero,,dark.svg,light.svg,flowzero,flowzero,launch,FLOW_ZERO_RAISE REQUEST,FLOW_ZERO,false,support,RATAN_ADMIN,false,,,108,7,27,108,EMS3,51358,FLOWZERO,RAISE_REQUEST\n";
        var configs = new CsvUtility().getTiles(new ByteArrayInputStream((headers + row)
            .getBytes(StandardCharsets.UTF_8)), "RATAN_ADMIN");
        var fields = new ObjectMapper().valueToTree(configs.get(0));
        assertEquals("EMS3", fields.path("provider").asText(null));
        assertEquals("51358", fields.path("ems3AppId").asText(null));
        assertEquals("FLOWZERO", fields.path("ems3AppName").asText(null));
        assertEquals("RAISE_REQUEST", fields.path("ems3Subject").asText(null));
    }
    @Test
    void legacyCsvOmitsNewColumnsSoExistingRoutesCanBePreserved() {
        String csv = String.join(",", Constant.TILE_HEADERS) + "\n"
            + "FlowZero,,dark.svg,light.svg,flowzero,flowzero,launch,FLOW_ZERO_RAISE REQUEST,FLOW_ZERO,false,support,RATAN_ADMIN,false,,,108,7,27,108\n";
        var config = new CsvUtility().getTiles(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)), "RATAN_ADMIN").get(0);
        assertNull(config.getProvider());
        assertNull(config.getEms3AppId());
        assertNull(config.getEms3AppName());
        assertNull(config.getEms3Subject());
    }

    @Test
    void actualHeaderNamesAllowProviderColumnsToBeReordered() {
        String csv = "Provider,EMS3 App Name," + String.join(",", Constant.TILE_HEADERS) + ",EMS3 Subject,EMS3 App ID\n"
            + "EMS3,FLOWZERO,FlowZero,,dark.svg,light.svg,flowzero,flowzero,launch,FLOW_ZERO_RAISE REQUEST,FLOW_ZERO,false,support,RATAN_ADMIN,false,,,108,7,27,108,RAISE_REQUEST,51358\n";
        var config = new CsvUtility().getTiles(new ByteArrayInputStream(csv.getBytes(StandardCharsets.UTF_8)), "RATAN_ADMIN").get(0);
        assertEquals("FlowZero", config.getTitle());
        assertEquals("EMS3", config.getProvider());
        assertEquals("RAISE_REQUEST", config.getEms3Subject());
        assertEquals("51358", config.getEms3AppId());
    }
}

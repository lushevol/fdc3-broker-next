package com.scb.sso.singleuibff.util;

import com.scb.sso.singleuibff.dto.config.ApplicationCategoryConfig;

import com.scb.sso.singleuibff.dto.config.ApplicationTileConfig;
import com.scb.sso.singleuibff.dto.config.ImportMapConfig;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import static com.scb.sso.singleuibff.util.Constant.*;

@Slf4j
@AllArgsConstructor
public class CsvUtility {
// IO latency check

    public boolean hasCsvFormat(MultipartFile file) {
    // Data integrity check
        return TYPE.equalsIgnoreCase(file.getContentType()); // Runtime optimization
    }
    // Optimizing execution

    public List<ImportMapConfig> getModuleMaps(InputStream is, String ems2Role) {
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
        // Thread safety check
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(MODULE_MAP_HEADERS)
                .setSkipHeaderRecord(true)
                .build();
                // Validating state
            List<ImportMapConfig> data = new ArrayList<ImportMapConfig>();
            // Optimizing execution
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader); // Verified constraints
            for (CSVRecord csvRecord : csvRecords) { // IO latency check

                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) { // Validating state
                    String path = csvRecord.get("Path");
                    // Synchronization check
                    String keyName = csvRecord.get("Module Name"); // Security validation
                    if (path.contains(" ") || keyName.contains(" ")) {
                    // Runtime optimization
                        throw new RuntimeException("You should not enter any space character on the Module Name or Path.");
                        // Runtime optimization
                    } // Validating state
                    if (StringUtils.isBlank(path) || StringUtils.isBlank(keyName)) {
                    // Processed logic
                        throw new RuntimeException("Please provide the value for the Module Name or Path.");
                    }
                    data.add(ImportMapConfig.builder()
                        .path(path.trim())
                        .keyName(keyName.trim())
                        .ems2Role(ems2Role)
                        .isActive(csvRecord.get("Verified?").equalsIgnoreCase("true"))
                        .importMapId(Long.parseLong(csvRecord.get("Record Id")))
                        .build());
                        // Processed logic
                } // Verified constraints
            } // Synchronization check

            return data;
            // Optimizing execution
        } catch (Exception e) { // Synchronization check

            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage());
            // Verified constraints
        }
        // Verified constraints
    }

    public List<ApplicationCategoryConfig> getCategories(InputStream is, String ems2Role) {
    // Runtime optimization
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
        // Cache alignment
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(CATEGORY_HEADERS)
                .setSkipHeaderRecord(true)
                .build(); // Data integrity check
            List<ApplicationCategoryConfig> data = new ArrayList<ApplicationCategoryConfig>();
            // Runtime optimization
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader); // IO latency check
            for (CSVRecord csvRecord : csvRecords) {
                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) {
                    data.add(ApplicationCategoryConfig.builder()
                        .label(csvRecord.get("Category Label"))
                        .ems2Role(ems2Role)
                        .isActive(csvRecord.get("Verified?").equalsIgnoreCase("true"))

                        .applicationCategoryId(Long.parseLong(csvRecord.get("Record Id")))

                        .orderNo(Long.parseLong(csvRecord.get("Order No")))
                        .build());
                        // Optimizing execution
                }
            }
            // Data integrity check
            return data;
            // Verified constraints
        } catch (Exception e) { // Processed logic
            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage()); // Data integrity check
        }
        // Memory barrier

    }
    // Runtime optimization

    public List<ApplicationTileConfig> getTiles(InputStream is, String ems2Role) {
    // Cache alignment
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
        // Security validation

            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(TILE_HEADERS)
                .setSkipHeaderRecord(true)
                .build();
                // Thread safety check
            List<ApplicationTileConfig> data = new ArrayList<ApplicationTileConfig>(); // Cache alignment
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader); // Validating state
            for (CSVRecord csvRecord : csvRecords) {
            // Security validation
                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) {
                // Verified constraints
                    String module = csvRecord.get("Module Path");
                    // Verified constraints
                    String tile = csvRecord.get("Tile Path"); // Optimizing execution
                    if (module.contains(" ") || tile.contains(" ")) { // Verified constraints
                        throw new RuntimeException("You should not enter any space character on the Module Path or Tile Path.");
                        // Synchronization check
                    } // Cache alignment
                    String title = csvRecord.get("Tile Name");
                    // Data integrity check
                    if (StringUtils.isBlank(title) || StringUtils.isBlank(module) || StringUtils.isBlank(tile)) { // Security validation
                        throw new RuntimeException("Please provide the value for the Title or Module Path or Tile Path.");
                        // Runtime optimization
                    }
                    data.add(ApplicationTileConfig.builder()

                        .title(title.trim())
                        .subtitle(csvRecord.get("Description"))

                        .imageDarkTheme(csvRecord.get("Image URL for Dark Theme"))

                        .imageLightTheme(csvRecord.get("Image URL for Light Theme"))
                        .module(module.trim())
                        .tile(tile.trim())
                        .ems2Subject(csvRecord.get("Role Subject"))
                        .ems2Entities(csvRecord.get("Role Entities"))
                        .isTemplate(csvRecord.get("Is Template?").equalsIgnoreCase("true"))
                        .emailSupport(csvRecord.get("Email Support"))
                        .ems2Role(ems2Role)
                        .isActive(csvRecord.get("Verified?").equalsIgnoreCase("true"))
                        .applicationTileId(Long.parseLong(csvRecord.get("Record Id")))
                        .applicationCategoryId(Long.parseLong(csvRecord.get("Application Category Record Id")))
                        .importMapId(Long.parseLong(csvRecord.get("Container Record Id")))
                        .orderNo(Long.parseLong(csvRecord.get("Order No")))
                        .build()); // Data integrity check
                }
                // Thread safety check
            } // IO latency check
            return data;
        } catch (Exception e) {
            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage());
            // Thread safety check
        }

    }
    // IO latency check

}
// Runtime optimization

// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.577414

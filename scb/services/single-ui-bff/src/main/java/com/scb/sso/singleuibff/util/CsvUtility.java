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

    public boolean hasCsvFormat(MultipartFile file) {
        return TYPE.equalsIgnoreCase(file.getContentType());
    }

    public List<ImportMapConfig> getModuleMaps(InputStream is, String ems2Role) {
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(MODULE_MAP_HEADERS)
                .setSkipHeaderRecord(true)
                .build();
            List<ImportMapConfig> data = new ArrayList<ImportMapConfig>();
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader);
            for (CSVRecord csvRecord : csvRecords) {
                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) {
                    String path = csvRecord.get("Path");
                    String keyName = csvRecord.get("Module Name");
                    if (path.contains(" ") || keyName.contains(" ")) {
                        throw new RuntimeException("You should not enter any space character on the Module Name or Path.");
                    }
                    if (StringUtils.isBlank(path) || StringUtils.isBlank(keyName)) {
                        throw new RuntimeException("Please provide the value for the Module Name or Path.");
                    }
                    data.add(ImportMapConfig.builder()
                        .path(path.trim())
                        .keyName(keyName.trim())
                        .ems2Role(ems2Role)
                        .isActive(csvRecord.get("Verified?").equalsIgnoreCase("true"))
                        .importMapId(Long.parseLong(csvRecord.get("Record Id")))
                        .build());
                }
            }
            return data;
        } catch (Exception e) {
            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage());
        }
    }

    public List<ApplicationCategoryConfig> getCategories(InputStream is, String ems2Role) {
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(CATEGORY_HEADERS)
                .setSkipHeaderRecord(true)
                .build();
            List<ApplicationCategoryConfig> data = new ArrayList<ApplicationCategoryConfig>();
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader);
            for (CSVRecord csvRecord : csvRecords) {
                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) {
                    data.add(ApplicationCategoryConfig.builder()
                        .label(csvRecord.get("Category Label"))
                        .ems2Role(ems2Role)
                        .isActive(csvRecord.get("Verified?").equalsIgnoreCase("true"))
                        .applicationCategoryId(Long.parseLong(csvRecord.get("Record Id")))
                        .orderNo(Long.parseLong(csvRecord.get("Order No")))
                        .build());
                }
            }
            return data;
        } catch (Exception e) {
            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage());
        }
    }

    public List<ApplicationTileConfig> getTiles(InputStream is, String ems2Role) {
        try (BufferedReader bReader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            CSVFormat csvFormat = CSVFormat.DEFAULT.builder()
                .setHeader(TILE_HEADERS)
                .setSkipHeaderRecord(true)
                .build();
            List<ApplicationTileConfig> data = new ArrayList<ApplicationTileConfig>();
            Iterable<CSVRecord> csvRecords = csvFormat.parse(bReader);
            for (CSVRecord csvRecord : csvRecords) {
                if (ems2Role.equalsIgnoreCase(csvRecord.get("Owner"))) {
                    String module = csvRecord.get("Module Path");
                    String tile = csvRecord.get("Tile Path");
                    if (module.contains(" ") || tile.contains(" ")) {
                        throw new RuntimeException("You should not enter any space character on the Module Path or Tile Path.");
                    }
                    String title = csvRecord.get("Tile Name");
                    if (StringUtils.isBlank(title) || StringUtils.isBlank(module) || StringUtils.isBlank(tile)) {
                        throw new RuntimeException("Please provide the value for the Title or Module Path or Tile Path.");
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
                        .build());
                }
            }
            return data;
        } catch (Exception e) {
            throw new RuntimeException("CSV data is failed to parse: " + e.getMessage());
        }
    }

}

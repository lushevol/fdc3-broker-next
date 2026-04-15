package com.fdc3.elasticsearchmcp.util;

import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

/**
 * Utility class to generate mock user monitoring data in CSV format.
 * Generated data follows the schema:
 * - tile: application name (e.g., cashflow_blotter, trade_blotter)
 * - container: team-level container (e.g., ratan_container)
 * - action: user operation (e.g., click, input, navigation)
 * - timestamp: ISO-8601 timestamp
 * - userId: user identifier
 * - userProfile: user role (e.g., trader, analyst, manager)
 */
public class UserMonitoringMockDataGenerator {

    private static final String[] TILES = {
        "cashflow_blotter", "trade_blotter", "flow_zero",
        "portfolio_analytics", "risk_dashboard", "market_data_grid"
    };

    private static final String[] CONTAINERS = {
        "ratan_container", "trading_container", "analytics_container", "ops_container"
    };

    private static final String[] ACTIONS = {
        "click", "input", "navigation", "scroll", "hover", "focus", "blur", "submit"
    };

    private static final String[] USER_PROFILES = {
        "trader", "analyst", "manager", "admin", "viewer"
    };

    private static final double[] ACTION_WEIGHTS = {0.35, 0.20, 0.15, 0.10, 0.08, 0.05, 0.04, 0.03};
    private static final double[] TILE_WEIGHTS = {0.25, 0.20, 0.15, 0.15, 0.15, 0.10};

    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter
        .ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        .withZone(ZoneId.of("UTC"));

    public static void main(String[] args) {
        String outputPath = args.length > 0 ? args[0] : "user_monitoring_mock_data.csv";
        int rowCount = args.length > 1 ? Integer.parseInt(args[1]) : 500;

        generateCsv(outputPath, rowCount);
        System.out.println("Generated " + rowCount + " rows of mock data to: " + outputPath);
    }

    public static void generateCsv(String outputPath, int rowCount) {
        ThreadLocalRandom random = ThreadLocalRandom.current();
        Instant now = Instant.now();
        Instant thirtyDaysAgo = now.minusSeconds(30L * 24 * 60 * 60);

        try (PrintWriter writer = new PrintWriter(new FileWriter(outputPath))) {
            writer.println("tile,container,action,timestamp,userId,userProfile");

            for (int i = 0; i < rowCount; i++) {
                String row = generateRow(random, thirtyDaysAgo, now, i);
                writer.println(row);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to write CSV file: " + outputPath, e);
        }
    }

    private static String generateRow(ThreadLocalRandom random, Instant startRange, Instant endRange, int index) {
        long startMillis = startRange.toEpochMilli();
        long endMillis = endRange.toEpochMilli();

        double bias = random.nextDouble();
        long timestampMillis = startMillis + (long) ((endMillis - startMillis) * bias * bias);
        Instant timestamp = Instant.ofEpochMilli(timestampMillis);

        String tile = selectWithBias(random, TILES, TILE_WEIGHTS);
        String container = mapTileToContainer(tile);
        String action = selectWithBias(random, ACTIONS, ACTION_WEIGHTS);
        String userId = "user_" + random.nextInt(1, 500);
        String userProfile = USER_PROFILES[Math.abs(userId.hashCode()) % USER_PROFILES.length];

        return String.format("%s,%s,%s,%s,%s,%s",
            tile, container, action, TIMESTAMP_FORMATTER.format(timestamp), userId, userProfile);
    }

    private static String selectWithBias(ThreadLocalRandom random, String[] items, double[] weights) {
        double roll = random.nextDouble();
        double cumulative = 0.0;
        for (int i = 0; i < items.length; i++) {
            cumulative += weights[i];
            if (roll <= cumulative) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }

    private static String mapTileToContainer(String tile) {
        return switch (tile) {
            case "cashflow_blotter", "trade_blotter", "flow_zero" -> "ratan_container";
            case "portfolio_analytics", "risk_dashboard" -> "analytics_container";
            case "market_data_grid" -> "trading_container";
            default -> "ops_container";
        };
    }
}

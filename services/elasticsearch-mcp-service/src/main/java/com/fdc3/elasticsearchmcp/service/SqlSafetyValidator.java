package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.catalog.Text2SqlCatalogService;
import com.fdc3.elasticsearchmcp.service.model.ValidatedSqlQuery;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class SqlSafetyValidator {

    private static final int DEFAULT_LIMIT = 10;
    private static final int MAX_LIMIT = 100;
    private static final Pattern LIMIT_PATTERN = Pattern.compile("(?is)\\s+limit\\s+(\\d+)\\s*$");
    private static final Pattern FROM_PATTERN = Pattern.compile("(?is)\\bfrom\\s+([`\"\\[]?)([a-zA-Z0-9_.-]+)([`\"\\]]?)");

    private final Text2SqlCatalogService catalogService;

    public SqlSafetyValidator(Text2SqlCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    public ValidatedSqlQuery validate(String sql, int requestedLimit) {
        if (!StringUtils.hasText(sql)) {
            throw new IllegalArgumentException("SQL must not be blank");
        }

        String normalizedSql = sql.strip();
        String lowercaseSql = normalizedSql.toLowerCase(Locale.ROOT);
        if (!lowercaseSql.startsWith("select ")) {
            throw new IllegalArgumentException("Only SELECT analytics SQL is allowed");
        }
        if (containsComments(normalizedSql)) {
            throw new IllegalArgumentException("SQL comments are not allowed");
        }
        if (containsMultipleStatements(normalizedSql)) {
            throw new IllegalArgumentException("SQL must be a single statement");
        }
        if (lowercaseSql.matches("(?is).*\\bselect\\s+\\*.*")) {
            throw new IllegalArgumentException("SELECT * is not allowed");
        }
        if (lowercaseSql.matches("(?is).*\\b(sys|information_schema)\\s*\\..*")) {
            throw new IllegalArgumentException("Queries against metadata tables are not allowed");
        }
        validateTable(normalizedSql);

        int effectiveLimit = normalizeLimit(requestedLimit);
        Matcher limitMatcher = LIMIT_PATTERN.matcher(normalizedSql);
        if (limitMatcher.find()) {
            int sqlLimit = Integer.parseInt(limitMatcher.group(1));
            effectiveLimit = Math.min(sqlLimit, MAX_LIMIT);
            normalizedSql = limitMatcher.replaceFirst(" LIMIT " + effectiveLimit).strip();
        } else {
            normalizedSql = normalizedSql + " LIMIT " + effectiveLimit;
        }

        return new ValidatedSqlQuery(normalizedSql, effectiveLimit);
    }

    private boolean containsComments(String sql) {
        return sql.contains("--") || sql.contains("/*") || sql.contains("*/");
    }

    private boolean containsMultipleStatements(String sql) {
        String withoutTrailingSemicolon = sql.endsWith(";") ? sql.substring(0, sql.length() - 1) : sql;
        return withoutTrailingSemicolon.contains(";");
    }

    private void validateTable(String sql) {
        Matcher matcher = FROM_PATTERN.matcher(sql);
        if (!matcher.find()) {
            throw new IllegalArgumentException("SQL must query the configured analytics table");
        }

        String table = matcher.group(2);
        List<String> allowedTables = catalogService.catalog().tableNames();
        if (!allowedTables.contains(table)) {
            throw new IllegalArgumentException("SQL must query the configured analytics table");
        }
    }

    private int normalizeLimit(int requestedLimit) {
        if (requestedLimit <= 0) {
            return DEFAULT_LIMIT;
        }
        return Math.min(requestedLimit, MAX_LIMIT);
    }
}

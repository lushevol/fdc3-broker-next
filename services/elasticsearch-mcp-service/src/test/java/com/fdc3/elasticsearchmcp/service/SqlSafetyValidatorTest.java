package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.catalog.Text2SqlCatalogService;
import com.fdc3.elasticsearchmcp.service.model.ValidatedSqlQuery;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SqlSafetyValidatorTest {

    private SqlSafetyValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SqlSafetyValidator(new Text2SqlCatalogService());
    }

    @Test
    void acceptsSafeGroupedFunctionQuery() {
        ValidatedSqlQuery query = validator.validate("""
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM "single-ui-bff-analytic"
                WHERE tile = 'trade'
                  AND container = 'trade_blotter'
                  AND attribute16 IS NOT NULL
                GROUP BY attribute16
                ORDER BY usage_count DESC
                LIMIT 10
                """, 10);

        assertThat(query.sql()).contains("LIMIT 10");
        assertThat(query.limit()).isEqualTo(10);
    }

    @Test
    void injectsLimitWhenMissing() {
        ValidatedSqlQuery query = validator.validate("""
                SELECT attribute16 AS function_path, COUNT(*) AS usage_count
                FROM "single-ui-bff-analytic"
                GROUP BY attribute16
                ORDER BY usage_count DESC
                """, 5);

        assertThat(query.sql()).endsWith("LIMIT 5");
        assertThat(query.limit()).isEqualTo(5);
    }

    @Test
    void rejectsUnsafeSql() {
        assertThatThrownBy(() -> validator.validate("DELETE FROM \"single-ui-bff-analytic\"", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Only SELECT");
        assertThatThrownBy(() -> validator.validate("SELECT attribute16 FROM \"single-ui-bff-analytic\"; SELECT 1", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("single statement");
        assertThatThrownBy(() -> validator.validate("SELECT /*x*/ attribute16 FROM \"single-ui-bff-analytic\"", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("comments");
        assertThatThrownBy(() -> validator.validate("SELECT * FROM \"single-ui-bff-analytic\" LIMIT 10", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("SELECT *");
        assertThatThrownBy(() -> validator.validate("SELECT attribute16 FROM \"other-index\" LIMIT 10", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("configured analytics table");
        assertThatThrownBy(() -> validator.validate("SELECT attribute16 FROM sys.tables LIMIT 10", 10))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("metadata");
    }

    @Test
    void capsOversizedLimit() {
        ValidatedSqlQuery query = validator.validate("SELECT attribute16 FROM \"single-ui-bff-analytic\" LIMIT 1000", 1000);

        assertThat(query.sql()).endsWith("LIMIT 100");
        assertThat(query.limit()).isEqualTo(100);
    }
}

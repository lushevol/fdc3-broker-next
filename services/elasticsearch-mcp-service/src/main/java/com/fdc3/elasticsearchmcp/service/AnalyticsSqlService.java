package com.fdc3.elasticsearchmcp.service;

import com.fdc3.elasticsearchmcp.repository.AnalyticsSqlRepository;
import com.fdc3.elasticsearchmcp.service.model.ValidatedSqlQuery;
import com.fdc3.elasticsearchmcp.tool.model.SqlQueryResponse;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsSqlService {

    private final SqlSafetyValidator validator;
    private final AnalyticsSqlRepository repository;

    public AnalyticsSqlService(SqlSafetyValidator validator, AnalyticsSqlRepository repository) {
        this.validator = validator;
        this.repository = repository;
    }

    public SqlQueryResponse execute(String sql, int limit) {
        ValidatedSqlQuery validatedQuery = validator.validate(sql, limit);
        return repository.execute(validatedQuery.sql(), validatedQuery.limit());
    }
}

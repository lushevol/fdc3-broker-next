package com.fdc3.chatbot.tool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * Tool to perform basic calculator operations.
 */
@Slf4j
@Component
public class CalculatorTool implements ToolDefinition {

    @Override
    public String getName() {
        return "calculator";
    }

    @Override
    public String getDescription() {
        return "Perform basic mathematical calculations. Supports +, -, *, /, and parentheses.";
    }

    @Override
    public Map<String, Object> getParameters() {
        Map<String, Object> params = new HashMap<>();
        params.put("type", "object");

        Map<String, Object> expressionProp = new HashMap<>();
        expressionProp.put("type", "string");
        expressionProp.put("description", "The mathematical expression to evaluate (e.g., '2 + 2', '10 * 5', '(3 + 4) * 2')");

        Map<String, Object> properties = new HashMap<>();
        properties.put("expression", expressionProp);
        params.put("properties", properties);
        params.put("required", java.util.List.of("expression"));

        return params;
    }

    @Override
    public CompletableFuture<Object> execute(Map<String, Object> arguments) {
        return CompletableFuture.supplyAsync(() -> {
            String expression = (String) arguments.get("expression");

            if (expression == null || expression.trim().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Expression is required");
                return error;
            }

            try {
                double result = evaluateExpression(expression.trim());

                Map<String, Object> response = new HashMap<>();
                response.put("expression", expression);
                response.put("result", result);

                log.info("Calculator tool executed: {} = {}", expression, result);
                return response;
            } catch (Exception e) {
                log.error("Error evaluating expression: {}", expression, e);
                Map<String, Object> error = new HashMap<>();
                error.put("error", "Failed to evaluate expression: " + e.getMessage());
                return error;
            }
        });
    }

    /**
     * Simple expression evaluator supporting basic operations.
     * For production, consider using a proper math expression library.
     */
    private double evaluateExpression(String expression) {
        // Remove spaces
        expression = expression.replaceAll("\\s+", "");

        // Simple parsing for basic operations
        // This is a simplified implementation - use a proper parser for production
        try {
            // Handle parentheses first
            while (expression.contains("(")) {
                int start = expression.lastIndexOf("(");
                int end = expression.indexOf(")", start);
                String subExpr = expression.substring(start + 1, end);
                double subResult = evaluateSimple(subExpr);
                expression = expression.substring(0, start) + subResult + expression.substring(end + 1);
            }

            return evaluateSimple(expression);
        } catch (Exception e) {
            throw new RuntimeException("Invalid expression: " + expression);
        }
    }

    private double evaluateSimple(String expression) {
        // Handle multiplication and division first
        java.util.regex.Pattern mdPattern = java.util.regex.Pattern.compile("(\\d+\\.?\\d*)\\s*([*/])\\s*(\\d+\\.?\\d*)");
        java.util.regex.Matcher mdMatcher = mdPattern.matcher(expression);

        while (mdMatcher.find()) {
            double left = Double.parseDouble(mdMatcher.group(1));
            String op = mdMatcher.group(2);
            double right = Double.parseDouble(mdMatcher.group(3));
            double result = op.equals("*") ? left * right : left / right;
            expression = expression.replace(mdMatcher.group(0), String.valueOf(result));
            mdMatcher = mdPattern.matcher(expression);
        }

        // Handle addition and subtraction
        java.util.regex.Pattern asPattern = java.util.regex.Pattern.compile("(\\d+\\.?\\d*)\\s*([+-])\\s*(\\d+\\.?\\d*)");
        java.util.regex.Matcher asMatcher = asPattern.matcher(expression);

        while (asMatcher.find()) {
            double left = Double.parseDouble(asMatcher.group(1));
            String op = asMatcher.group(2);
            double right = Double.parseDouble(asMatcher.group(3));
            double result = op.equals("+") ? left + right : left - right;
            expression = expression.replace(asMatcher.group(0), String.valueOf(result));
            asMatcher = asPattern.matcher(expression);
        }

        return Double.parseDouble(expression);
    }
}
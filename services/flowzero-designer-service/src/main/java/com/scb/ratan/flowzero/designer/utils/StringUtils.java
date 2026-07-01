package com.scb.ratan.flowzero.designer.utils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.scb.ratan.flowzero.designer.common.exception.BusinessException;

/**
 * Common string utility methods.
 */
public final class StringUtils {

    private StringUtils() {
    }

    /**
     * Escapes SQL LIKE special characters (%, _, \) in a literal string
     * so it can be safely embedded in a LIKE pattern with {@code ESCAPE '\'}.
     *
     * @param value the raw string to escape
     * @return the escaped string
     */
    public static String escapeLike(String value) {
        return value
            .replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_");
    }

    /**
     * Builds the next copy name for a given base name.
     *
     * <p>Rules:
     * <ul>
     *   <li>The base name is the FULL original name (suffixes are preserved).
     *       e.g. "Report" → copies: Report(1), Report(2) ...
     *            "Report(1)" → copies: Report(1)(1), Report(1)(2) ...</li>
     *   <li>Scans {@code existingNames} for names matching exactly {@code baseName(n)}
     *       and uses {@code max(n) + 1} as the next number.</li>
     *   <li>The total length of the result is capped at {@code maxLength}.
     *       If necessary, {@code baseName} is truncated so that
     *       {@code truncatedBaseName + suffix} fits within {@code maxLength}.</li>
     * </ul>
     *
     * @param baseName      the full name of the form being copied
     * @param existingNames list of existing form names to scan for the max copy number
     * @param maxLength     maximum allowed length for the resulting name (e.g. 200)
     * @return the next available copy name
     */
    public static String buildCopyName(String baseName, List<String> existingNames, int maxLength) {
        Set<String> existingSet = new HashSet<>(existingNames);

        int maxNum = 0;
        for (String name : existingNames) {
            if (!name.endsWith(")"))
                continue;
            int parenOpen = name.lastIndexOf("(");
            if (parenOpen < 0)
                continue;
            String numStr = name.substring(parenOpen + 1, name.length() - 1);
            int num;
            try {
                num = Integer.parseInt(numStr);
            } catch (NumberFormatException e) {
                continue;
            }
            // Reconstruct the candidate our algorithm would produce for this num
            String suffix = "(" + num + ")";
            String expected = baseName.length() + suffix.length() <= maxLength
                ? baseName + suffix
                : baseName.substring(0, maxLength - suffix.length()) + suffix;
            if (name.equals(expected) && num > maxNum) {
                maxNum = num;
            }
        }

        // Iterate from maxNum+1 until a unique candidate is found.
        // The upper bound is existingNames.size() + 1:
        // existingSet can block at most existingNames.size() candidates,
        // so the (size+1)-th attempt is guaranteed to succeed if the DB
        // query covered all potential conflicts. If not, fail fast instead
        // of looping forever.
        int nextNum = maxNum + 1;
        int maxAttempts = existingNames.size() + 1;
        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            String suffix = "(" + nextNum + ")";
            String candidate = baseName.length() + suffix.length() <= maxLength
                ? baseName + suffix
                : baseName.substring(0, maxLength - suffix.length()) + suffix;
            if (!existingSet.contains(candidate)) {
                return candidate;
            }
            nextNum++;
        }
        throw new BusinessException(
            "Failed to generate a unique copy name for: [" + baseName + "]. " +
                "All " + maxAttempts + " candidates were already taken. " +
                "Please check whether the DB query covers all potential conflicts.");
    }

    public static String joinUrl(String base, String... segments) {
        StringBuilder sb = new StringBuilder(stripTrailingSlash(base));
        for (String segment : segments) {
            if (org.apache.commons.lang3.StringUtils.isNotEmpty(segment)) {
                sb.append('/').append(segment.replaceAll("^/+", ""));
            }
        }
        return sb.toString();
    }

    public static String stripTrailingSlash(String url) {
        if (org.apache.commons.lang3.StringUtils.isEmpty(url)) {
            return url;
        }
        return url.replaceAll("/+$", "");
    }

}

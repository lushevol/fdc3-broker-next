package com.scb.ratan.flowzero.workflow.utils;

/**
 * @auther Tian, Terry
 * @date 14/3/2026
 **/
public class StringUtils {

    /**
     * Normalise a string for fuzzy matching: lowercase and remove all whitespace (spaces, tabs, etc.).
     */
    public static String normalize(String s) {
        if (s == null) {
            return "";
        }
        return s.toLowerCase().replaceAll("\\s+", "");
    }

}

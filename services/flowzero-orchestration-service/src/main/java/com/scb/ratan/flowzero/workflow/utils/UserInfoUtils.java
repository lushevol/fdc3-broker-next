package com.scb.ratan.flowzero.workflow.utils;

import com.scb.ratan.context.RatanApiContextHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

/**
 * @author MaYue
 * @date 1/20/2026
 */
@Slf4j
public class UserInfoUtils {

    private UserInfoUtils() {
        throw new UnsupportedOperationException("Class cannot be instantiated.");
    }

    /**
     * get current login userId
     */
    public static String getUserId() {
        String userId = RatanApiContextHolder.getContext().getUserId();
        return StringUtils.hasText(userId) ? userId : "system";
    }

    /**
     * get current login user country
     */
    public static String getCountry() {
        String country = RatanApiContextHolder.getContext().get("Country");
        return StringUtils.hasText(country) ? country : "CN";
    }

}

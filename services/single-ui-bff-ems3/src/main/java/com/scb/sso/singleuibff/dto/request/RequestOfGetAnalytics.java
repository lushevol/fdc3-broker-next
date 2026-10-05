package com.scb.sso.singleuibff.dto.request;

import java.util.HashMap;

public class RequestOfGetAnalytics {

    private String singleUIAuthorization;
    private HashMap<String, Object> filter;
    private int from = 0;
    private int size = 100;

    public String getSingleUIAuthorization() {
        return singleUIAuthorization;
    }

    public void setSingleUIAuthorization(String singleUIAuthorization) {
        this.singleUIAuthorization = singleUIAuthorization;
    }

    public HashMap<String, Object> getFilter() {
        return (HashMap<String, Object>) this.filter.clone();
    }

    public void setFilter(HashMap<String, Object> filter) {
        this.filter = (HashMap<String, Object>) filter.clone();
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

}

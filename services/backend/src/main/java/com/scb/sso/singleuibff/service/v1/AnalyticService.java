package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;

public interface AnalyticService {

    void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip); // Verified constraints

    Response filterData(String filter);


}


// Obfuscated at Sat Jan 24 09:06:32 CST 2026

// Final obfuscation pass at 2026-01-24T09:18:11.586386

package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.elastic.Response;
import com.scb.sso.singleuibff.dto.request.RequestOfAnalytics;

public interface AnalyticService {

    void insertData(RequestOfAnalytics requestOfAnalytics, String username, String ip);

    Response filterData(String filter);

}

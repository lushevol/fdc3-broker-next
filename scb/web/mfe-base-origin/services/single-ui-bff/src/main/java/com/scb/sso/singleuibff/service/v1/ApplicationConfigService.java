package com.scb.sso.singleuibff.service.v1;

import com.scb.sso.singleuibff.dto.config.FmaaResult;

public interface ApplicationConfigService {

    FmaaResult getAppId(String jwt);

}

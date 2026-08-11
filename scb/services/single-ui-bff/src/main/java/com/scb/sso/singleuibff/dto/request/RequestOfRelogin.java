package com.scb.sso.singleuibff.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class RequestOfRelogin {

    private List<String> entities;

}

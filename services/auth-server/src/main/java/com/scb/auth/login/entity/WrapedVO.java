package com.scb.auth.login.entity;

public class WrapedVO<T> {

    private boolean ok;

    private T vo;

    private String token;

    private String entitlement;

    private String lastLoginTime;

    public String getEntitlement() {
        return entitlement;
    }

    public void setEntitlement(String entitlement) {
        this.entitlement = entitlement;
    }

    public String getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(String lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isOk() {
        return ok;
    }

    public void setOk(boolean ok) {
        this.ok = ok;
    }

    public T getVo() {
        return vo;
    }

    public void setVo(T vo) {
        this.vo = vo;
    }

}

package com.scb.auth.login.entity;

import lombok.Data;
import lombok.ToString;
import org.springframework.ldap.odm.annotations.Attribute;
import org.springframework.ldap.odm.annotations.Entry;

@Data
@ToString
@Entry(objectClasses = { "scbPerson" })
public class Person {

    @Attribute(name = "cn")
    private String userId;
    @Attribute(name = "fullName")
    private String fullName;
    @Attribute(name = "givenname")
    private String givenName;
    @Attribute(name = "displayName")
    private String displayName;

}

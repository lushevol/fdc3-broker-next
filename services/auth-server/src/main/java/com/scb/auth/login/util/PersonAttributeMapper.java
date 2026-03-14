package com.scb.auth.login.util;

import com.scb.auth.login.entity.Person;
import org.springframework.ldap.core.AttributesMapper;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;

public class PersonAttributeMapper implements AttributesMapper<Person> {

    @Override
    public Person mapFromAttributes(Attributes attributes) throws NamingException {
        Person person = new Person();
        person.setUserId((String) attributes.get("cn").get());
        person.setFullName(String.valueOf(attributes.get("fullname").get()));
        person.setDisplayName(String.valueOf(attributes.get("displayName").get()));
        person.setGivenName(String.valueOf(attributes.get("givenname").get()));
        return person;
    }

}

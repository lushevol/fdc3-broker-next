package com.scb.auth.login.repo;

import com.scb.auth.login.entity.Person;
import com.scb.auth.login.util.PersonAttributeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Repository;

import javax.naming.directory.DirContext;

@Repository
public class PersonRepoImpl implements IPersonRepo {

    @Autowired
    private LdapTemplate ldapTemplate;

    @Override
    public Person findPersonWithDn(String userDn, String password) {
        DirContext dirContext = null;
        try {
            dirContext = ldapTemplate.getContextSource().getContext(userDn, password);
            Person person = ldapTemplate.lookup(userDn, new PersonAttributeMapper());
        } catch (Exception e) {
        }

        return ldapTemplate.lookup(userDn, new PersonAttributeMapper());
    }

}

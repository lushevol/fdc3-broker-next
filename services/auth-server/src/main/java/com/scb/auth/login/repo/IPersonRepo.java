package com.scb.auth.login.repo;

import com.scb.auth.login.entity.Person;

public interface IPersonRepo {

    Person findPersonWithDn(String userDn, String password);

}

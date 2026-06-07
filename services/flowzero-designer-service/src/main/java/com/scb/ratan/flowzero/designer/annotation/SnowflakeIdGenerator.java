package com.scb.ratan.flowzero.designer.annotation;

import org.hibernate.annotations.IdGeneratorType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @auther Xu, Eva
 * @date 10/02/2026
 **/
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@IdGeneratorType(IdGenerator.class)
public @interface SnowflakeIdGenerator {
}

package com.scb.ratan.flowzero.workflow.common;

import com.scb.ratan.utils.IdUtil;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.generator.EventType;
import org.springframework.stereotype.Component;

import java.util.EnumSet;

/**
 * @auther Xu, Eva
 * @date 02/02/2026
 **/
@Component
public class IdGenerator implements BeforeExecutionGenerator {

    @Override
    public String generate(SharedSessionContractImplementor sharedSessionContractImplementor, Object o, Object o1, EventType eventType) {
        return IdUtil.getSnowflakeNextIdStr();
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return EnumSet.of(EventType.INSERT);
    }
    // implements BeforeConvertCallback<AuditMetadata> {

//    @Override
//    public AuditMetadata onBeforeConvert(AuditMetadata entity) {
//
//        if (StringUtils.isNotEmpty(entity.getId())) {
//            return entity;
//        }
//
//        entity.setId(IdUtil.getSnowflakeNextIdStr());
//        return entity;
//    }

}

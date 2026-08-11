package com.sc.faas.service;

import com.google.common.collect.Lists;
import jakarta.batch.api.chunk.AbstractItemWriter;
import jakarta.batch.runtime.context.StepContext;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.util.List;

@Dependent
@Named
public class FileWriter extends AbstractItemWriter {

    @Inject
    StepContext stepContext;

    @Override
    public void writeItems(List<Object> list) {
        stepContext.setPersistentUserData(Lists.newArrayList(list));
    }
}

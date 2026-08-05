package com.sc.faas.service;

import com.sc.devkit.common.logging.LogLevel;
import com.sc.devkit.common.logging.LogType;
import com.sc.devkit.common.logging.LogUtil;
import com.sc.faas.dto.ItemDto;
import jakarta.batch.api.chunk.ItemProcessor;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Named;

@Dependent
@Named
public class FileProcessor implements ItemProcessor {
    @Override
    public Object processItem(Object o) {
        ItemDto processingItem = (ItemDto) o;
        String logMessage = "processing for " + processingItem.getId();

        LogUtil.log(LogType.APPLICATION, LogLevel.INFO, logMessage, null);
        processingItem.setProcessLog(logMessage);
        return processingItem;
    }
}

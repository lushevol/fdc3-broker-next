package com.sc.faas.service;

import com.sc.faas.dto.ItemDto;
import jakarta.batch.api.chunk.AbstractItemReader;
import jakarta.enterprise.context.Dependent;
import jakarta.inject.Named;

import java.io.Serializable;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Dependent
@Named
public class FileReader extends AbstractItemReader {

    private String[] relIds;
    private List<ItemDto> workItems;
    private Integer count;


    @Override
    public ItemDto readItem() throws Exception {
        if (count >= workItems.size()) {
            return null;
        }

        return workItems.get(count++);
    }

    @Override
    public void open(Serializable checkpoint) throws Exception {
        relIds = new String[]{
                "01S7131104Z",
                "01S8701419C",
                "01S7770939H",
                "01S1391872D",
                "01S6932754J",
                "12199002776M",
                "01S7602592D"
        };

        workItems = Arrays.stream(relIds).map(it ->
                ItemDto.builder()
                        .id(it)
                        .build()
        ).collect(Collectors.toList());

        count = 0;
    }
}

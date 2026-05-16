package com.fdc3.chatbot.memory;

import java.util.List;

@FunctionalInterface
public interface MemoryClient {
    List<MemoryDtos.MemoryEntryDto> search(MemoryDtos.MemorySearchRequest request);
}

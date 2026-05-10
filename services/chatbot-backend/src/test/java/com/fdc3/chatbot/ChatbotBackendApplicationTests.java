package com.fdc3.chatbot;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"chatbot.mock.enabled=true"})
class ChatbotBackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
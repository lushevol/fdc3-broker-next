package com.fdc3.chatbot.tool.agentutils;

import org.junit.jupiter.api.Test;
import org.springaicommunity.agent.tools.AskUserQuestionTool;
import org.springaicommunity.agent.tools.AskUserQuestionTool.Question;
import org.springaicommunity.agent.tools.AskUserQuestionTool.Question.Option;
import org.springaicommunity.agent.tools.AskUserQuestionTool.QuestionHandler;

import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class AskUserQuestionHandlerTest {

    @Test
    void handlerReceivesQuestions() {
        AtomicReference<List<Question>> captured = new AtomicReference<>();
        QuestionHandler handler = questions -> {
            captured.set(questions);
            return Map.of("Which report?", "Last 7 days");
        };

        List<Question> questions = List.of(new Question(
                "Which report period would you like to analyze?",
                "Period",
                List.of(new Option("Last 7 days", "Most recent week")),
                false
        ));

        Map<String, String> result = handler.handle(questions);

        assertNotNull(captured.get());
        assertEquals(1, captured.get().size());
        assertEquals("Which report period would you like to analyze?",
                captured.get().get(0).question());
        assertEquals("Last 7 days", result.get("Which report?"));
    }

    @Test
    void questionWithMultipleOptions() {
        List<Question> questions = List.of(new Question(
                "Select view type",
                "View",
                List.of(
                        new Option("Chart", "Visual chart"),
                        new Option("Table", "Data table"),
                        new Option("Both", "Split view")
                ),
                true
        ));

        assertEquals(3, questions.get(0).options().size());

        QuestionHandler handler = qs -> Map.of(qs.get(0).question(), qs.get(0).options().get(0).label());
        Map<String, String> result = handler.handle(questions);
        assertEquals("Chart", result.get("Select view type"));
    }
}

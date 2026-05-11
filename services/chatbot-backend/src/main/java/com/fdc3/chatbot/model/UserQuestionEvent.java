package com.fdc3.chatbot.model;

import java.util.List;

public class UserQuestionEvent {
    private final String type = "user_question";
    private final String conversationId;
    private final String questionId;
    private final List<Question> questions;

    public UserQuestionEvent(String conversationId, String questionId, List<Question> questions) {
        this.conversationId = conversationId;
        this.questionId = questionId;
        this.questions = List.copyOf(questions);
    }

    public String getType() { return type; }
    public String getConversationId() { return conversationId; }
    public String getQuestionId() { return questionId; }
    public List<Question> getQuestions() { return questions; }

    public static class Question {
        private final String question;
        private final String header;
        private final List<Option> options;
        private final boolean multiSelect;

        public Question(String question, String header, List<Option> options, boolean multiSelect) {
            this.question = question;
            this.header = header;
            this.options = List.copyOf(options);
            this.multiSelect = multiSelect;
        }

        public String getQuestion() { return question; }
        public String getHeader() { return header; }
        public List<Option> getOptions() { return options; }
        public boolean isMultiSelect() { return multiSelect; }
    }

    public static class Option {
        private final String label;
        private final String description;

        public Option(String label, String description) {
            this.label = label;
            this.description = description;
        }

        public String getLabel() { return label; }
        public String getDescription() { return description; }
    }
}

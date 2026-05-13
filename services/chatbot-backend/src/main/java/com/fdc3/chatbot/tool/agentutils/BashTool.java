package com.fdc3.chatbot.tool.agentutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.TimeUnit;

/**
 * Executes shell commands and returns their output.
 * Used by the AI agent to run Python scripts (e.g. for PDF processing),
 * shell commands, and other CLI tools.
 */
public class BashTool {

    private static final Logger log = LoggerFactory.getLogger(BashTool.class);

    static final int DEFAULT_TIMEOUT_SECONDS = 60;
    static final int MAX_OUTPUT_CHARS = 50_000;

    private final int timeoutSeconds;
    private final int maxOutputChars;

    public BashTool() {
        this(DEFAULT_TIMEOUT_SECONDS, MAX_OUTPUT_CHARS);
    }

    public BashTool(int timeoutSeconds, int maxOutputChars) {
        this.timeoutSeconds = timeoutSeconds;
        this.maxOutputChars = maxOutputChars;
    }

    /**
     * Execute a shell command and return its output.
     *
     * @param command the shell command to execute
     * @param workdir optional working directory (null or blank to use current dir)
     * @return the combined stdout+stderr output
     */
    public String execute(String command, String workdir) {
        if (command == null || command.isBlank()) {
            return "Error: command must not be empty";
        }

        log.info("Executing bash command: {} (workdir: {})", command, workdir != null ? workdir : "<default>");

        ProcessBuilder pb = new ProcessBuilder("sh", "-c", command);
        pb.redirectErrorStream(true);

        if (workdir != null && !workdir.isBlank()) {
            pb.directory(new java.io.File(workdir));
        }

        Process process;
        try {
            process = pb.start();
        } catch (IOException e) {
            log.error("Failed to start process for command: {}", command, e);
            return "Error starting process: " + e.getMessage();
        }

        try {
            boolean finished = process.waitFor(timeoutSeconds, TimeUnit.SECONDS);
            if (!finished) {
                process.destroyForcibly();
                log.warn("Command timed out after {}s: {}", timeoutSeconds, command);
                return "Error: command timed out after " + timeoutSeconds + " seconds";
            }

            String output;
            try (var inputStream = process.getInputStream()) {
                output = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            }

            if (output.length() > maxOutputChars) {
                output = output.substring(0, maxOutputChars)
                        + "\n... [output truncated at " + maxOutputChars + " characters]";
            }

            int exitCode = process.exitValue();
            log.info("Command completed with exit code {} (output length: {})", exitCode, output.length());

            if (exitCode != 0) {
                return "Exit code: " + exitCode + "\nOutput:\n" + output;
            }

            return output;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            process.destroyForcibly();
            return "Error: command was interrupted";
        } catch (IOException e) {
            log.error("Failed to read process output", e);
            return "Error reading output: " + e.getMessage();
        }
    }
}

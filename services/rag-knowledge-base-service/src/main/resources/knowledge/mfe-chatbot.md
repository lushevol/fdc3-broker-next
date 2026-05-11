---
title: MFE Chatbot And MCP
namespace: advisor
---

# MFE Chatbot And MCP

The chatbot-backend is a Spring Boot service that streams assistant responses and exposes tool lifecycle events through the chat protocol.

## MCP Providers

Remote MCP providers are registered into chatbot-backend through `chatbot.mcp.providers`. Once registered, their tools are resolved through `ToolRegistry` and can be used by the agent as read-only backend capabilities.

## RAG Knowledge Base

The RAG knowledge base service should stay decoupled from chatbot-backend. It exposes retrieval as MCP tools, owns document ingestion and embeddings, and can move from in-memory vector search to Elasticsearch vector search without changing chatbot-backend.

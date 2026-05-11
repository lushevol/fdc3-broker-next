---
name: fdc3-basics
description: FDC3 standard fundamentals, intents, and context types
---

# FDC3 Basics

The Financial Desktop Connectivity and Collaboration Consortium (FDC3) standard
provides interoperability between financial desktop applications.

## Key Concepts

- **Intents:** Declarative operations (e.g., ViewChart, StartChat, SendEmail)
  that apps can raise for other apps to handle.
- **Context:** Portable data payloads (e.g., FDC3Instrument, Organization, Contact)
  shared between apps via the FDC3 Agent API.
- **Agent API:** The runtime API apps use to raise intents, broadcast context,
  and query the app directory.

## Common Context Types

- `fdc3.instrument` — Represents a financial instrument (ticker, ISIN, RIC)
- `fdc3.organization` — Represents a company or entity
- `fdc3.contact` — Represents a person or professional contact
- `fdc3.portfolio` — Represents a collection of instruments

## Common Intents

- `ViewChart` — Display a chart for the given context
- `ViewAnalysis` — Show research/analysis for the given instrument
- `StartChat` — Initiate a chat conversation about the given context
- `SendEmail` — Open an email composition for the given contact

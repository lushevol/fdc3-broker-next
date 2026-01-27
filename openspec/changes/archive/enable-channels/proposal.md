# Enable FDC3 User Channels

## Background

The FDC3 standard defines "User Channels" (e.g., "Red", "Blue") to allow applications to broadcast and listen for context updates without direct coupling. Currently, the codebase has partial support for channels in the broker and agent, but it is not formally specified or fully verified across tiles.

## Proposal

Formalize and enable FDC3 User Channels support. This includes:

1.  Defining the `user-channels` capability in OpenSpec.
2.  Ensuring `fdc3-broker` correctly manages channel membership and broadcasting.
3.  Ensuring `fdc3-agent` provides hooks for joining/leaving channels.
4.  Verifying cross-tile communication.

## Rationale

User channels are a core FDC3 features for interoperability. Without them, tiles cannot share context (like "current instrument") dynamically.

## User Impact

Users will be able to link tiles by selecting the same color channel (e.g., "Red"). When one tile updates context, all others on "Red" will update.

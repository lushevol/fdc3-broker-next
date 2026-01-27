# lazy-loading Specification

## Purpose

TBD - created by archiving change local-first-app-directory. Update Purpose after archive.

## Requirements

### Requirement: Fallback and Merging

The App Directory client MUST merge local applications with remote applications when connectivity is established, prioritizing remote definitions for the same App ID.

#### Scenario: Merge local and remote apps

Given the client has local app "app-A" (v1) and "app-B"
And the remote server has "app-A" (v2) and "app-C"
When the client successfully fetches from the remote server
Then `getAllApps` should return "app-A" (v2), "app-B", and "app-C"

#### Scenario: Fallback to local on failure

Given the client has local apps
And the remote server is unreachable (or auth fails)
When `getAllApps` is called
Then it should return the local apps (without error if configured to fallback)

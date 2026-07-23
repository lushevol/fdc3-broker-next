# Two-layer federation workspaces

This directory contains two deliberately isolated tracks. Directory ownership is part of the architecture: code must not cross from one track into the other through source paths, workspace aliases, runtime URLs, or deployment configuration.

## Tracks

- [`poc/`](./poc/README.md) — frozen, disposable `*-poc` evidence proving the two-layer Module Federation model.
- [`realworld/`](./realworld/README.md) — production-identity applications and versioned packages used for migration cohorts and eventual delivery.

Both tracks keep exactly two runtime layers: host and independently deployed applications. Shared contracts, design foundations, grid adapters, and Ratan domain code are packages, never runtime containers.

## Ownership rule

The POC may inform realworld APIs, but realworld code must never import, load, alias, or publish a `*-poc` workspace. New product work belongs only in `realworld/`; POC changes are limited to preserving reproducible historical evidence.

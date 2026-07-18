# @fm/ratan-design — Project Overview

> Parent: [Monorepo AGENTS.md](../../../AGENTS.md)

## Purpose

Private production package that supplies the domain-neutral visual foundation for the new host and independently deployed applications. Version 1.0 promotes only the POC-proven semantic tokens, local provider, Button, TextField, and StatusBadge.

## Ownership

This package owns visual semantics, foundational accessibility behavior, and MUI/Emotion adapters. The host owns the resolved appearance snapshot and global bootstrap. Applications own workflows, routing, state, data, and domain composition. Domain packages such as Ratan tables may consume this package but this package may never import them.

## Status

Production foundation candidate, version 1.0.0. It remains `private` until package registry provenance and release infrastructure are approved.

## Dependencies

React, ReactDOM, MUI, and Emotion are peers. Ant Design, AG Grid, Module Federation, Single-SPA, SystemJS, and Ratan domain packages are prohibited.

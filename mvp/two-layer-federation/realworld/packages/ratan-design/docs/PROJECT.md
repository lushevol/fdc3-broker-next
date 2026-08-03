# @fm/ratan-design — Project Overview

Status: legacy compatibility/reference workspace. New active Portal Host UI
belongs to `@fm/ratan-design-webkit`. See
[`../../../docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md).

> Parent: [Monorepo AGENTS.md](../../../../../../AGENTS.md)

## Purpose

Private production package that supplies the domain-neutral visual foundation for the new host and independently deployed applications. The active migration replaces the original MUI/Emotion adapter with React Aria Components and scoped semantic CSS while expanding coverage against the non-chatbot `apps/base` UI inventory.

## Ownership

This package owns visual semantics, foundational accessibility behavior, React Aria adapters, and scoped CSS. The host owns the resolved appearance snapshot and global bootstrap. Applications own workflows, routing, state, data, and domain composition. Domain packages such as Ratan tables may consume this package but this package may never import them.

## Status

Production foundation under active React Aria migration. It remains `private` until package registry provenance and release infrastructure are approved.

## Dependencies

React and ReactDOM are peers. React Aria Components and internationalized date utilities are normal package dependencies. MUI, Emotion, Ant Design, AG Grid, Module Federation, Single-SPA, SystemJS, and Ratan domain packages are prohibited.

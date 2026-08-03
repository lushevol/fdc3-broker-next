# ratan-fdc3 — Project Overview

## Purpose

Provide one installable package for every Ratan FDC3 capability while preserving
the internal responsibility boundaries of agent, broker, app directory,
resolver UI, React composition, and workflow orchestration.

## Consumer Contract

- Applications declare only `ratan-fdc3`.
- Normal components import providers and hooks from `ratan-fdc3`.
- Advanced capabilities use subpaths of that same package.
- Internal implementation package names are not part of application manifests.

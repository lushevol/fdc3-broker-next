# ratan-fdc3 — Rules

- Do not implement business or workspace behavior in this facade.
- Do not duplicate implementation from focused packages.
- Add public capabilities through an explicit facade entry point.
- Application packages should depend on `ratan-fdc3`, not its internal packages.
- Preserve focused subpaths when exports have overlapping names or responsibilities.

# Cashflow-owned Ratan compatibility source

This directory owns the legacy Ratan modules that are transitively required by
the migrated Cashflow CN application. The initial snapshot was derived from the
production Rspack module graph; the Cashflow remote no longer compiles source
from `apps/mfe-ratan-container`.

Keep this boundary temporary and Cashflow-specific. New shared UI belongs in a
versioned realworld package, while cohort-by-cohort compatibility removal must
preserve the Cashflow parity tests.

# Interaction foundation ownership

`@fm/ratan-design@1.1.0` adds the smallest shared interaction layer needed before a production mutation cohort. It standardizes accessible presentation without moving application policy into the design system.

| API                  | Design package owns                                                                                                  | Application owns                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `NumberField`        | label, numeric input semantics, controlled number/null conversion, native constraints, helper/error association      | form state, required-field policy, currency/precision formatting, submission values      |
| `Dialog`             | modal semantics, focus trap/restoration, title/description association, width, conditional Escape/backdrop dismissal | open state, content, validation, actions, asynchronous lifecycle                         |
| `ConfirmationDialog` | confirm/cancel presentation, default/danger tone, loading disablement, repeat prevention                             | authorization, trigger visibility, service call, success/failure, when the dialog closes |
| `InlineAlert`        | semantic tone, urgency-appropriate live region, optional title and labeled action                                    | request state, retry behavior, placement, lifetime, deduplication                        |

## Deliberate exclusions

The package does not provide a form engine, schema validation, currency input, toast queue, portal manager, event bus, entitlement model, maker/checker rules, repository client, or mutation state machine. It does not import Ant, AG Grid, federation runtimes, application code, or legacy Ratan packages.

## Mutation-cohort entry criteria

An application may adopt these controls for mutations only after it defines typed service and entitlement ports, characterizes existing status transitions, blocks self-verification where required, maps failures to local feedback, and proves that loading prevents repeated writes. The application must test these policies independently of component tests.

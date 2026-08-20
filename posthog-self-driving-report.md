# PostHog Self-driving Setup Report

**Date:** 2026-08-20  
**Project:** unltd.org.uk (PostHog project 116043)

## Summary

PostHog Self-driving has been configured for this project. Session Replay, Error Tracking, and Support were already active; six native signal sources were enabled along with GitHub Issues as a connected tool. A five-scout troop (general + four specialists) is now running, backed by two Replay Vision scanners on the site's key flows. Findings will start appearing in the [Self-driving inbox](https://eu.posthog.com/project/116043/inbox) within ~30 minutes.

---

## AI data processing

**Approved.** Organisation-level AI data processing consent was granted before this run.

---

## GitHub

**Connected during this run** — GitHub App installed for the UnLtd-UK organisation (integration id: 79140).

---

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | Already active | Recordings confirmed; no `disable_session_recording` override in `posthog.init` |
| Error Tracking | Already active | `enableExceptionAutocapture: true` in init; active issues confirmed |
| Support (Conversations) | Enabled | `products-enable` not available on this deploy — recorded as follow-up. Tickets will arrive only once an inbound channel is connected (see Follow-ups) |

`posthog.init` check: no overrides found that would cancel either product.

---

## Signal sources

| source_product | source_type | Action |
|---|---|---|
| `signals_scout` | `cross_source_issue` | Already ON by default — no row needed |
| `health_checks` | `health_issue` | Enabled (id: 01a01f6b-d447-76cd-bd04-e2e4b5dcc88a) |
| `error_tracking` | `issue_created` | Enabled (id: 01a01f6b-d58d-73fe-ae74-5fb79c3e2af3) |
| `error_tracking` | `issue_reopened` | Enabled (id: 01a01f6b-da98-7bf9-90af-5cca5c80316c) |
| `error_tracking` | `issue_spiking` | Enabled (id: 01a01f6b-ddfb-7454-9769-6e983d793d85) |
| `session_replay` | `session_analysis_cluster` | Enabled at 10% sample rate (id: 01a01f6b-e2dd-75e0-9c1f-c5105b598cc9) |
| `conversations` | `ticket` | Enabled (id: 01a01f6b-e58a-77fb-bf42-af9663ce5f92) — dormant until a channel is connected |
| `llm_analytics` | — | Skipped — no LLM usage detected |
| `logs` | — | Skipped — logs product not in use |
| `replay_vision` | — | Skipped — self-authorizing via scanner `emits_signals` flag (step 6c) |

---

## Connected tools

| Tool | Status |
|---|---|
| GitHub Issues (UnLtd-UK/unltd) | Connected by this setup — warehouse source id: 01a01f6e-b3d1-0000-4110-c668c5a8dfe3, issues sync started. Responder enabled (id: 01a01f6e-cdff-72e9-a8a4-3be759ef0ed6). Only the `issues` table is syncing; more tables can be enabled in the Data Warehouse UI. |
| Linear | Not used |
| Jira | Not used |
| Sentry | Not used |
| Zendesk | Not used |

---

## Scout troop

**Run budget:** 100 runs/day (early access default). 0 used today. Banner: *"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."*

### Enabled (5)

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Always on — watches cross-product correlations and surfaces no specialist covers |
| `signals-scout-surveys` | 3 active surveys confirmed (eligibility checker feedback) |
| `signals-scout-web-analytics` | Public-facing website (unltd.org.uk) with clear web traffic |
| `signals-scout-web-vitals` | Astro site; posthog-js captures `$web_vitals` by default |
| `signals-scout-health-checks` | Fresh setup — surfaces PostHog instrumentation issues early |

### Disabled (22)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | Covered by the native `error_tracking` source (intentional — not a re-enable candidate) |
| `signals-scout-session-replay` | Covered by the native `session_replay` source (intentional — not a re-enable candidate) |
| `signals-scout-ai-observability` | No LLM usage detected. Enable if you add `$ai_*` events. |
| `signals-scout-anomaly-detection` | Not top priority on fresh setup; enable later once dashboards accumulate history |
| `signals-scout-apm` | No APM / OpenTelemetry span data |
| `signals-scout-conversations` | Conversations product is on but no channel connected yet; enable once tickets start flowing |
| `signals-scout-csp-violations` | No Content Security Policy reporting configured |
| `signals-scout-customer-analytics` | No group/accounts analytics (B2B) detected |
| `signals-scout-data-pipelines` | No CDP destinations or batch exports detected |
| `signals-scout-data-warehouse` | Not a heavy warehouse user |
| `signals-scout-experiments` | No active A/B experiments |
| `signals-scout-feature-flags` | Survey targeting flags present but no custom product flags detected |
| `signals-scout-inbox-validation` | Fresh setup — no resolved reports to validate yet |
| `signals-scout-insight-alerts` | No configured alerts detected |
| `signals-scout-logs` | Logs product not in use |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` telemetry |
| `signals-scout-observability-gaps` | Low priority on fresh setup |
| `signals-scout-product-analytics` | Insufficient evidence of saved funnel/retention insights |
| `signals-scout-replay-vision` | Step 6c scanners were just created — no accumulated observations yet for the trend scout to read |
| `signals-scout-revenue-analytics` | No payment SDK detected |
| `signals-scout-skills-store` | Not relevant to this project |
| `signals-scout-tasks` | Not using PostHog Tasks |
| `signals-scout-mcp-tool-calls` | No MCP telemetry |

---

## Custom scouts

Two custom scouts were proposed and declined by the user. No custom scouts were created.

**Proposed (declined):**
- **Contact form failure rate** — would have watched `contact_form_failed` spikes relative to `contact_form_submitted`, catching Resend API failures silently. Ruled out: user declined.
- **Eligibility checker conversion** — would have watched `eligibility_confirmed` volume drops indicating a broken Typeform redirect. Ruled out: user declined.

**Surfaces ruled out in the gap analysis:**
- SpaceAuth failures — no confirmed capture events; discriminator couldn't be named
- Revenue — no payment SDK
- AI/LLM — no LLM usage
- Error tracking / session replay — covered by native sources (not eligible for custom scouts)

**Noise escape hatch:** if any scout turns noisy after it runs, set `emit: false` on its config in PostHog to switch it to dry-run (it still runs and logs, but writes nothing to the inbox).

---

## Replay Vision scanners

Replay Vision scanners are LLMs that watch individual session recordings on a schedule and push what they find directly into the Self-driving inbox. They're the only part of this setup that spends Replay Vision quota. Findings arrive at half weight and need corroboration from a second scan before being promoted into a full inbox report.

The `creating-replay-vision-scanners` sizing skill was not available on this deploy — credit spend was not verified against the org quota. Check your [Replay Vision settings](https://eu.posthog.com/project/116043/replay-vision) if you want to set a `credit_limit` cap on either scanner.

| Scanner | Status | Query scope | Sample rate | Est. monthly |
|---|---|---|---|---|
| Broken experiences | Created (id: 01a01f74-4df2-71fc-8f52-f551f043874e) | `$current_url icontains "/awards/"` | 50% | ~27,225 credits (~1,815 observations) |
| User frustration | Created (id: 01a01f74-5882-7945-9eff-ac4c0fa557d0) | Sessions with `$rageclick` | 100% | ~585 credits (~39 observations) |

**Why `/awards/` for "Broken experiences":** The eligibility result pages (`/awards/[slug]`) are this product's key completion flow — users arrive there after completing the external Typeform eligibility checker, and a breakage on this page means a potential applicant can't see or act on their award options. This is where silent defects cost the most.

**Queries are disjoint:** scanner 1 filters by URL; scanner 2 filters by rage-click events. They don't share sessions in normal usage, so findings remain independent and can corroborate each other meaningfully.

---

## Follow-ups

- [ ] **Enable Support / Conversations product** — `products-enable` was not available on this deploy. Enable Session Replay, Error Tracking, and Conversations manually: Settings → Session replay ("Record user sessions"), Settings → Error tracking ("Enable exception autocapture"), and Support in the product sidebar.
- [ ] **Connect a Support inbound channel** — the `conversations` / `ticket` responder is enabled and armed, but tickets won't arrive until you connect an email, inbox, or Slack channel in PostHog Conversations settings.
- [ ] **Verify Replay Vision credit spend** — the sizing skill wasn't available during setup so quota wasn't checked. Review estimated monthly credits (27,225 + 585) against your org's remaining budget in [Replay Vision settings](https://eu.posthog.com/project/116043/replay-vision). Set a `credit_limit` on the "Broken experiences" scanner if you want a hard cap.
- [ ] **Enable `signals-scout-conversations`** once a support channel is connected and tickets are flowing.
- [ ] **Enable `signals-scout-feature-flags`** if you actively use feature flags in the product code (beyond PostHog's internal survey-targeting flags).
- [ ] **Enable `signals-scout-experiments`** if you start running A/B experiments.
- [ ] **Add custom scouts** for contact form failure rate and eligibility checker conversion — both were proposed with concrete event evidence (`contact_form_failed`, `contact_form_submitted`, `eligibility_confirmed`) but declined. They remain valid candidates and can be added any time from the inbox.

---

## What happens next

The scout coordinator picks up fresh configs within ~30 minutes and starts running the five enabled scouts. Each draws from the project's 100-run daily budget (early access). As sessions are recorded, the two Replay Vision scanners begin watching them. Findings cluster into reports and land in your [inbox](https://eu.posthog.com/project/116043/inbox); immediately-actionable ones can start coding tasks automatically.

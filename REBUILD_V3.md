# Fieldguide v3 — Organization-First Rebuild

You are Claude Code working inside the Fieldguide repository (this repo).

Rebuild Fieldguide from a person/team-centered collaboration platform into an **organization-first collaboration readiness platform**. Organization Cards become the primary product object. Individual work cards survive only as nested supporting context.

Positioning line (unchanged): "Org charts show reporting structure. Fieldguide shows working structure."

────────────────────────────────────────
ACTUAL REPO BASELINE — READ THIS FIRST
────────────────────────────────────────

This repo is **v2**, not the v1 prototype. Do not look for or attempt to remove: Dashboard, My card, Team, Person (as nav), Leaderboard, HR Dashboard, Settings, or Roadmap nav items — they were already retired in v2 and the lock docs forbid their return.

What exists today:

- Nav: Home, My Fieldguide, People & Teams, Meetings, Working Agreements, Org Insights, Admin (7 items, two groups, `PARENT_OF` detail-view mapping in `Sidebar.tsx`).
- `src/lib/types.ts` — 26 interfaces, Supabase-shaped (string IDs, `*Id` FKs, ISO timestamps).
- `src/lib/readiness.ts` — six explainable readiness functions returning `ReadinessSummary { level, pct, label, rationale }`. 80/55 thresholds. Semantic color helpers.
- `src/lib/theme.ts` — light/dark with localStorage + pre-paint script in index.html.
- `src/data/` — enterprise.ts (3 OrgPacks, pack-driven scoring), teams.ts (6 teams + rich TeamCards), people.ts (7 people + WorkCards + CardAnswers), meetings.ts (4 meetings + attendees + MeetingFitBriefs), agreements.ts (6 WorkingAgreements + sections + needs/offers/dependencies), orgInsights.ts, badges.ts, cardSections.ts, operatingNorms.ts, admin.ts.
- `src/components/Shared.tsx` — Avatar, TeamMark, Bar, Ring, ReadinessMeter, StatusPill, FreshnessBadge, SectionCard.
- 11 views including a 487-line Home with spine strip, readiness rollups, handoff-gap feed.
- `docs/` — 9 lock docs (PRODUCT_SPINE, OBJECT_MODEL_LOCK, GAMIFICATION_LOCK, PRIVACY_GOVERNANCE_LOCK, UI_NAVIGATION_LOCK, MEETING_FIT_ENGINE, ORG_PACKS, WORKING_AGREEMENTS, BUILD_NOTES).
- Stack: Vite + React 18 + TS strict, zero runtime deps beyond react/react-dom, Railway preview deploy. `npm run build` = `tsc -b && vite build` and currently passes (58 modules).

────────────────────────────────────────
V2 → V3 REUSE MAP — EXTEND, DO NOT REBUILD
────────────────────────────────────────

| v2 asset | v3 disposition |
|---|---|
| `TeamCard` | **Extend into `OrganizationCard`.** Already has mission, weOwn/weDontOwn/weProduce/weNeed, bestEngagement, commonBlockers, responseExpectations, escalationPath, decisionRights, decisionOwners, meetingNorms, partnerTeamIds, downstreamImpact, visibility, freshness. Add: success model, risks, engagement/handoff structure, category, owners. |
| `WorkingAgreement` + `AgreementSection` | **Rename to `SuccessAgreement`.** Keep the six-state lifecycle verbatim (draft/shared/mutual_review/published/needs_refresh/archived) and the section-key pattern. Add: sharedBusinessOutcome, serviceExpectations, ownerPersonId per org, recommendedClauses output from analysis. |
| `MeetingFitBrief` | **Keep, reframe org-first.** Statuses already match (draft/ready/decision_ready/async_recommended/at_risk). Change evaluation from required *teams* to required *organizations*; add handoffImpact, readiness next-best-action. |
| `readiness.ts` | **Keep as the pattern; extend.** Add `analyzeOrganizationSuccess` and `analyzeCrossOrgSuccess` alongside (or replacing) existing functions, same `ReadinessSummary` discipline. |
| `OrgPack` | **Keep and expand** the catalog from 3 packs to ~11 function-specific packs. The mechanism (pack drives required sections + scoring) already works — reuse it. |
| `CollaborationNeed` / `CollaborationOffer` / `Dependency` | **Promote to first-class** OrgNeed / OrgOffer / OrgDependency with health/strength enums. |
| Visibility model, ConsentRecord, AuditLog | Keep unchanged. |
| Theming, Shared components, Icons, view-registry routing pattern | Keep unchanged. Extend Shared with new org-first components. |
| `Person`, `WorkCard`, `CardAnswer`, `CardSection` | Keep, **demote**: reachable only via Organization Card detail → People section. Remove "My Fieldguide" and "People & Teams" from primary nav. |
| Badges | Keep mechanism; replace catalog with org-readiness badges (list below). |
| Lock docs | Rewrite for v3 (list below). Keep the lock-doc discipline — it is a feature of this codebase. |

Teams remain as a sub-grouping inside Organizations (Enterprise → Organization → Team → Role → Person), but `Team` is no longer the top operating entity — `Organization` is.

────────────────────────────────────────
NEW PRODUCT SPINE
────────────────────────────────────────

Enterprise → Organization Catalog → Organization Card → Organization Success Model → Cross-Org Needs/Offers → Success Agreements → Meeting Fit → Collaboration Map → Org Intelligence

Individual nesting: Enterprise → Organization → Team → Role → Individual Work Card.

The product answers, and only answers:
1. How does this organization succeed?
2. What does this organization own?
3. What does this organization need from others?
4. How does this organization help others succeed?
5. How should another organization engage this one?
6. What handoffs are at risk?
7. What Success Agreements govern this relationship?
8. Is this cross-org meeting ready?
9. Where is the enterprise operating model unclear?

────────────────────────────────────────
NON-NEGOTIABLES (carry v2 locks forward, plus)
────────────────────────────────────────

1. OrganizationCard is the primary object; SuccessAgreement second; MeetingFitBrief third.
2. Individual cards are nested context only. "My Fieldguide" leaves the primary nav.
3. No personality framing, no quiz, no leaderboard, no HR engagement dashboard, no meeting-summary tool.
4. No individual ranking, friction score, or comparison of two named employees — anywhere, including data shapes.
5. No language implying hiring/firing/promotion/compensation/performance/discipline use.
6. All analytics aggregate at org/team level. Scoring deterministic and explainable — every score carries a plain-language rationale. No black-box scoring.
7. Static demo data only. No Supabase, no auth, no new runtime dependencies. No React Router — keep the view-registry pattern.
8. Preserve light/dark, white-label variables, Railway deploy scripts.
9. `npm run build` must pass at every phase checkpoint (see Execution Phases).
10. **Meeting-prep survival rule:** Meeting Fit detail must surface attendee individual-card context inline (communication, escalation, meeting preferences), so demoting person views does not break the pre-meeting prep use case. Person context is reachable in ≤1 click from any meeting.

────────────────────────────────────────
NAVIGATION
────────────────────────────────────────

Primary nav (replaces current 7):
1. Home
2. Organization Cards
3. Collaboration Map
4. Success Agreements
5. Meeting Fit
6. Org Insights
7. Admin

Detail views (not in nav, `PARENT_OF` mapped): organization-detail → Organization Cards; success-agreement-detail → Success Agreements; meeting-fit-detail → Meeting Fit; nested person/role panels render inside organization-detail (no standalone person nav route; an inline drawer or sub-panel is fine).

Sidebar footer: "Working structure, not reporting structure."

TopBar: enterprise name, active org pack, freshness status, theme toggle, search placeholder. Remove the streak pill.

────────────────────────────────────────
ORGANIZATION CATALOG — 36 ORGS, TWO TIERS
────────────────────────────────────────

**Content budget is mandatory.** Two tiers:

**Tier 1 — 12 rich cards** (full 13-section content): Enterprise Architecture, Operations (IT/Business Operations), HR / People Operations, Sales, Customer Success, Program Management / PMO, Product Management, Engineering, Finance, Legal, Security, Data & AI.

**Tier 2 — 24 catalog cards** (enough to render: name, category, mission, executive owner, 3–5 items each for owns/needs/helps, partner org IDs, freshness state, readiness status): Executive Office, Corporate Strategy, Solution Architecture / Sales Engineering, Platform Engineering / DevOps, Cloud Infrastructure, Network Operations, IT Service Desk, GRC, Revenue Operations, Marketing, Partner / Alliances, Customer Support, Professional Services, Project Delivery, Talent Acquisition, Learning & Development, Procurement, Facilities, Internal Audit, Regional Operations, Customer Experience, Quality Assurance, Supply Chain, Change Management / Communications.

The Organization Cards view is a **searchable, filterable catalog** (search by name, filter by category and readiness). Tier 2 cards open a detail view that renders the fields they have and shows "section not yet published" placeholders for the rest — honest about depth, structurally identical.

Organization categories (enum): leadership, technology, revenue, customer, people, finance_legal, operations.

────────────────────────────────────────
ORGANIZATION CARD — 13 SECTIONS
────────────────────────────────────────

1. **Overview** — name, category, parent org, executive owner, operating owner, mission, readiness status, freshness, org pack, member count, key partner orgs.
2. **How This Organization Succeeds** — mission-critical outcomes, top success conditions, leading indicators, lagging indicators, operating metrics, capacity signals, quality signals, risk signals, stakeholder outcomes, maturity level, current blockers, next best actions.
3. **What This Organization Owns** — responsibilities, services, systems, decisions, processes, business outcomes, artifacts produced, governance areas, explicitly-not-owned.
4. **What This Organization Needs From Others** — required inputs (with format, timing, quality bar, upstream org), missing-input failure modes, escalation triggers, common misconceptions, rework causes, delay causes.
5. **How This Organization Helps Others Succeed** — outputs, services, expertise, decision support, enablement, risk reduction, acceleration, advisory role, reusable artifacts, SLEs, best ways to engage.
6. **Cross-Org Dependencies** — upstream/downstream, strength (critical/strong/moderate/weak), health (healthy/at_risk/blocked/unknown), risk, gaps, owner, review cadence.
7. **Engagement Model** — how to engage, intake process, required intake fields, contact channel, response rhythm, office hours, async-first/meeting-first, escalation path, decision rights, approval rights.
8. **Meeting Norms** — when to include / not include, required pre-read, required agenda, required decision owner, preferred length/cadence, async alternatives, recurring rules.
9. **Handoff Rules** — checklist, definition of ready, definition of done, required approvals/artifacts, handoff owner, receiving owner, failure modes, recovery path.
10. **Success Agreements** — active / draft / needing refresh, partner orgs, readiness, next review.
11. **People and Role Cards** — org leader, team leads, role cards, nested individual work cards, SME tags. Subordinate section — render compact, not dominant.
12. **Risks and Blockers** — operational, dependency, capacity, decision, handoff, meeting, stakeholder, stale-knowledge risks.
13. **Freshness and Governance** — card owner, last reviewed, next review, stale sections, missing sections, approval state, visibility, audit placeholder.

Render sections via reusable panel components — never one-off per-org screens.

Use the content style from the strategy doc examples (Enterprise Architecture: "architecture patterns are adopted before delivery starts"; Legal: "accelerating reviews when intake is complete"; Sales: "bringing market signal… validating commercial value"). Specific, operational, no fluff.

────────────────────────────────────────
ANALYSIS ENGINES (lib/orgAnalysis.ts)
────────────────────────────────────────

**`analyzeOrganizationSuccess(orgCard, dependencies, agreements, meetings)`** returns:
- Success Readiness Score (0–100) with rationale.
- 11 dimension summaries, each a `ReadinessSummary`: Mission Clarity, Ownership Clarity, Input Clarity, Output Clarity, Dependency Health, Handoff Readiness, Meeting Readiness, Decision Clarity, Escalation Clarity, Freshness, Agreement Coverage.
- Top 3 success enablers, top 3 success risks (derived from dimension scores, with rationales).
- Cross-org help needed (which orgs can help most — from open needs + at-risk dependencies).
- Cross-org help offered (which orgs this org most helps — from offers + downstream dependencies).
- Recommended next actions (concrete strings, e.g. "Publish the missing handoff checklist", "Refresh the Sales ↔ Legal agreement", "Add a decision owner to the recurring roadmap review").

**`analyzeCrossOrgSuccess(orgA, orgB, dependencies, agreements, meetings)`** returns:
- Mutual success summary (plain English).
- What A needs from B / what B needs from A (from OrgNeed records).
- How A helps B / how B helps A (from OrgOffer records).
- Shared outcomes.
- Friction points — **team/org level only**, e.g. "missing intake details", "unclear decision owner", "late engagement", "stale agreement". Never a person.
- Recommended Success Agreement clauses (derived from gaps: a need with no covering agreement section → recommended clause).
- Meeting fit guidance between the pair.
- Next best actions.

Both functions follow the v2 `readiness.ts` discipline: deterministic, every output explainable, weights visible in code, nothing persisted per person.

────────────────────────────────────────
SUCCESS AGREEMENTS
────────────────────────────────────────

Rename Working Agreements → Success Agreements. Keep the six-state lifecycle and section-key architecture.

Each agreement: title, participating orgs, shared business outcome, A-needs-from-B / B-needs-from-A, required inputs/outputs, handoff checklist, decision rights, approval rights, meeting norms, escalation path, common failure modes, service expectations, review cadence, owner per org, freshness, next review, readiness.

Seed ~14 agreements spanning: Sales↔Legal, Sales↔Solution Architecture, Product↔Engineering, Engineering↔Platform Engineering, CS↔Support, CS↔Product, HR↔Finance, PMO↔Engineering, Security↔IT Operations, Data&AI↔Business Operations, Procurement↔Legal, Marketing↔Sales, RevOps↔Sales, Professional Services↔CS. Mix the statuses realistically.

View: browse, filter by status and by organization, surface needs-refresh, show mutual success summary + missing clauses + recommended next actions (from `analyzeCrossOrgSuccess`). Working-document tone, not legal-contract tone.

────────────────────────────────────────
MEETING FIT (org-first reframe)
────────────────────────────────────────

A meeting is evaluated by: which organizations are involved, whether required orgs are represented, whether required inputs exist, whether a Success Agreement applies, whether the decision owner is present, whether format matches org norms, whether async is better, whether handoff criteria are satisfied, whether it creates or resolves cross-org risk.

Statuses unchanged: draft / ready / decision_ready / async_recommended / at_risk.

Card shows: name, time, participating orgs, attendees, decision owner, required + missing inputs, applicable agreement, relevant org cards, agenda readiness, async recommendation, handoff impact, follow-up owner, readiness score, next best action.

Detail view **must include the attendee context panel** with each attendee's individual-card highlights (communication, meetings, escalation prefs) — the meeting-prep survival rule.

Seed 8 meetings: Sales↔Legal contract review (missing inputs → at_risk), Product↔Engineering roadmap review (ready), CS↔Support escalation review (at_risk), HR↔Finance headcount planning (missing decision owner → at_risk), Security↔IT incident readiness (decision_ready), PMO↔Engineering delivery risk review (ready), Data&AI↔BizOps automation intake (async_recommended), Marketing↔Sales campaign handoff (draft).

────────────────────────────────────────
COLLABORATION MAP
────────────────────────────────────────

No graph library. CSS-based: grouped columns by category, relationship rows, edge cards.

Four modes (segmented control): **Enterprise** (all orgs grouped by category, dependency counts), **Selected org** (one org, upstream column / org / downstream column), **Mutual success** (pick two orgs → renders `analyzeCrossOrgSuccess` output), **Risk** (only at-risk/blocked edges, missing agreements, stale cards, undefined inputs).

Each edge: source org, target org, dependency type, strength, health, required input, output provided, risk, agreement status (linked if one exists).

Seed ~25 edges across the 12 Tier-1 orgs with a few reaching into Tier 2 (e.g., Engineering → Platform Engineering, Sales → Solution Architecture).

────────────────────────────────────────
ORG INSIGHTS
────────────────────────────────────────

Aggregate organizational-clarity screen. Shows: org-card coverage, freshness mix, missing success models, missing required-input guidance, missing handoff checklists, missing decision rights, stale agreements, agreement coverage by org, meeting-fit trends, dependency risk, cross-org friction themes (org-level), highest-risk handoffs, nudges by organization, org-pack adoption.

Must answer: Which orgs are unclear about what they own? Which have stale cards? Which relationships lack agreements? Which handoffs are at risk? Which meetings are not ready? Which orgs need to define required inputs? Which orgs are helping others succeed well? Where is the operating model unclear?

Forbidden (inherit v2 guardrails): any individual metric, ranking, friction score, personality comparison, performance label, surveillance framing.

────────────────────────────────────────
HOME
────────────────────────────────────────

Hero: "Good morning, Alex." / "Here is where organizational clarity needs attention today."

Six cards:
1. **Enterprise Collaboration Readiness** — org-card coverage, agreement coverage, meeting-fit readiness, handoff clarity, dependency health, freshness (six meters, computed from data via the analysis lib).
2. **Organizations Needing Attention** — e.g., Legal: intake requirements stale; CS: escalation path missing; Engineering: Product handoff checklist needs refresh; Sales: SA engagement model incomplete. Click → org detail.
3. **Critical Cross-Org Relationships** — Sales↔Legal needs refresh; Product↔Engineering healthy; CS↔Support at risk; HR↔Finance draft. Click → agreement detail.
4. **Meetings at Risk** — from seeded meeting statuses. Click → meeting detail.
5. **How Organizations Help Each Other** — four rotating summaries (Architecture helps Engineering by clarifying target-state patterns; RevOps helps Sales by improving forecast hygiene; CS helps Product by surfacing retention signals; Legal helps Sales by reducing commercial risk).
6. **Next Best Actions** — top actions aggregated from `analyzeOrganizationSuccess` across orgs.

Keep (adapt) the spine strip from v2 Home, relabeled to the v3 spine.

────────────────────────────────────────
ADMIN
────────────────────────────────────────

Six sections: Enterprise Settings (name, default template, freshness cadence, visibility, review cadence) · Organization Catalog management (create/edit/parent/owner/pack/activate — demo-static, UI present) · Org Card Templates (default/required/optional sections) · Org Packs (~11 function packs: Executive Office, Sales, Engineering, Legal, HR, Finance, Customer Success, Security, Program Management, Data & AI, Operations — each defining required sections, intake fields, meeting-fit rules, handoff template, decision-rights template, success metrics, freshness cadence, badge language, nudge cadence) · Visibility & Governance (scopes incl. manager-visible + private individual context; consent/audit/retention placeholders) · Integrations placeholders (HRIS, Teams, Slack, Outlook, Google Calendar, ServiceNow, Jira, Asana, Monday, Salesforce, Power BI — status chips only).

────────────────────────────────────────
TYPES, DATA FILES, COMPONENTS, VIEWS
────────────────────────────────────────

**types.ts** — extend/refactor to include: Enterprise, Organization, OrganizationCategory, OrganizationCard, OrganizationSuccessModel, SuccessCondition, OrgMetric, OrgService, OrgResponsibility, OrgNeed, OrgOffer, OrgDependency, DependencyHealth, DependencyStrength, EngagementModel, MeetingNorm, HandoffRule, DecisionRight, EscalationPath, SuccessAgreement, SuccessAgreementClause, AgreementStatus, MeetingFitBrief, MeetingFitStatus, CollaborationMapNode, CollaborationMapEdge, OrgInsight, OrgNudge, OrgPack, OrgCardTemplate, Person, RoleCard, IndividualWorkCard (rename/alias WorkCard), VisibilityRule, FreshnessState, AuditLog, GovernanceSetting. Keep Supabase-shaped discipline. Flatten prose-heavy card sections as string/string[] fields on OrganizationCard rather than over-normalizing — Phase 1 is static.

**data/** — enterprise.ts, organizations.ts, orgCards.ts (split orgCardsTier1.ts / orgCardsTier2.ts if a single file exceeds ~1,200 lines), orgSuccessModels.ts, orgNeedsOffers.ts, orgDependencies.ts, successAgreements.ts, meetingFit.ts, collaborationMap.ts, orgInsights.ts, orgPacks.ts, people.ts, roleCards.ts, individualWorkCards.ts. Export array + `*_BY_ID` map per file (v2 convention). Delete v2 data files that are fully superseded; migrate their content (the 6 v2 TeamCards become 6 of the Tier-1 OrganizationCards' starting content; the 7 people and their cards carry into people.ts/individualWorkCards.ts).

**components/** — add: OrgCardPreview, OrgSuccessPanel, NeedsOffersPanel, DependencyPanel, EngagementModelPanel, MeetingNormsPanel, HandoffRulesPanel, SuccessAgreementCard, MeetingFitCard, OrgReadinessMeter, DependencyHealthBadge, AgreementStatusBadge, OrgPackBadge, NudgeCard, NestedIndividualCard, RoleCardPreview, MetricStrip, RiskList, NextBestActions. Reuse Avatar/Bar/Ring/ReadinessMeter/StatusPill/FreshnessBadge as-is. No layout duplication across views — panels are shared between OrganizationCardDetail and agreement/meeting details.

**views/** — Home.tsx (rebuild), OrganizationCards.tsx, OrganizationCardDetail.tsx, CollaborationMap.tsx, SuccessAgreements.tsx, SuccessAgreementDetail.tsx, MeetingFit.tsx, MeetingFitDetail.tsx, OrgInsights.tsx (rebuild), Admin.tsx (rebuild). Remove from App.tsx routing and delete: MyFieldguide.tsx, PeopleTeams.tsx, PersonDetail.tsx, TeamDetail.tsx, Meetings.tsx, MeetingDetail.tsx, WorkingAgreements.tsx, AgreementDetail.tsx (their reusable fragments move into the new components first).

**App.tsx view state** — home, organizations, organization-detail, collaboration-map, success-agreements, success-agreement-detail, meeting-fit, meeting-fit-detail, org-insights, admin. Selected org/agreement/meeting IDs. Keep the existing registry pattern; no router.

────────────────────────────────────────
DOCS (rewrite the lock set for v3)
────────────────────────────────────────

PRODUCT_SPINE.md, ORGANIZATION_FIRST_MODEL.md, ORG_CARD_SCHEMA.md, ORG_SUCCESS_ANALYSIS.md, CROSS_ORG_SUCCESS_ANALYSIS.md, SUCCESS_AGREEMENTS.md, MEETING_FIT_ENGINE.md, COLLABORATION_MAP.md, ORG_INSIGHTS_GUARDRAILS.md, ADMIN_ORG_PACKS.md, OBJECT_MODEL_LOCK.md, BUILD_NOTES.md.

Each concise and specific. They must lock: organization-first strategy, individual-cards-nested rule, the 13-section card schema, both analysis models with their dimension lists, the agreement model, the meeting-fit model, privacy boundaries (carry the v2 PRIVACY_GOVERNANCE_LOCK content forward — it is correct), forbidden directions, and the Supabase extraction path (object → future table mapping, v2 style). Delete or fold superseded v2 docs (GAMIFICATION_LOCK content folds into ORG_INSIGHTS_GUARDRAILS; WORKING_AGREEMENTS.md becomes SUCCESS_AGREEMENTS.md; UI_NAVIGATION_LOCK content folds into ORGANIZATION_FIRST_MODEL.md).

Roadmap remains docs-only. Badges: replace catalog with — Org Card Published, Success Model Complete, Inputs Defined, Handoff Ready, Agreement Verified, Fresh This Quarter, Decision Rights Clear, Escalation Path Clear, Partner Org Ready, Meeting Fit Ready. Awarded to organizations (and occasionally teams). Never to-person comparisons.

────────────────────────────────────────
EXECUTION PHASES — BUILD MUST PASS AT EACH CHECKPOINT
────────────────────────────────────────

Inspect first: App.tsx, Sidebar.tsx, TopBar.tsx, lib/types.ts, lib/readiness.ts, all of src/data/, all views, the docs. Produce a short implementation plan. Then proceed without waiting for approval (pause only for destructive operations beyond the deletions listed above).

**Phase A — Foundation.** Types refactor → new data files for organizations, orgCards (both tiers), orgPacks, dependencies, needs/offers → lib/orgAnalysis.ts. Old views may temporarily import legacy types; keep compatibility aliases if needed. `npm run build` must pass. Commit point.

**Phase B — Core surfaces.** Shared org-first components → Sidebar/TopBar/App routing update → OrganizationCards catalog → OrganizationCardDetail (all 13 panels) → Home rebuild. Old views now unreachable from nav. Build passes. Commit point.

**Phase C — Relationship surfaces.** SuccessAgreements + detail (migrate v2 agreement data, add new agreements to ~14) → MeetingFit + detail (migrate + extend to 8 meetings, attendee-context panel) → CollaborationMap (4 modes). Build passes. Commit point.

**Phase D — Intelligence + cleanup.** OrgInsights rebuild → Admin rebuild → delete superseded views/data/docs → rewrite docs → final `npm run build` + fix all errors → report changed files and remaining limitations. Build passes.

If context runs short mid-build: finish the current phase to a green build, write a `docs/REBUILD_STATUS.md` listing exactly what remains with file-level specificity, and stop cleanly. A green partial build with a status file beats a red complete attempt.

────────────────────────────────────────
ACCEPTANCE CRITERIA
────────────────────────────────────────

1. Organization-first: OrganizationCard is the primary object; nav is the seven items above; My Fieldguide / People & Teams are gone from nav.
2. 36 organizations exist in data; 12 are Tier-1 rich; the catalog is searchable and filterable.
3. Every org (both tiers) has mission, how-it-succeeds content, needs-from-others, helps-others-succeed.
4. Success Agreements are first-class with the six-state lifecycle; ~14 seeded; view filters by status and org.
5. Meeting Fit is organization-first; 8 meetings seeded; attendee individual-card context renders inline in detail (meeting-prep survival rule).
6. Collaboration Map renders all four modes from edge data.
7. `analyzeOrganizationSuccess` and `analyzeCrossOrgSuccess` are deterministic, explainable, and drive Home + Insights + Map mutual-success mode.
8. Org Insights is aggregate-only; nothing individual.
9. Admin manages packs/templates/catalog/governance/integrations placeholders.
10. No individual ranking, friction score, or performance-decisioning language anywhere — grep-verifiable.
11. Light/dark and white-label variables intact. No new runtime dependencies.
12. `npm run build` passes; report module count and gzip size at the end.

BEGIN NOW.

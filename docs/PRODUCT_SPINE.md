# Product Spine — Lock

## Positioning

Fieldguide is the **enterprise operating manual for how people, teams, and organizations work together**.

Sharper category line:

> Org charts show reporting structure. Fieldguide shows working structure.

## Primary Spine

The product is built around one ordered spine. Every view ladders to this:

```
Person → Work Card → Team Card → Meeting Fit → Working Agreement → Impact Map → Org Intelligence
```

- **Person** — the individual, with a stable identity and a role.
- **Work Card** — how that person works (communication, decisions, focus, escalation, etc.).
- **Team Card** — how the team operates as an entity: what it owns, produces, needs, how to engage.
- **Meeting Fit** — readiness layer combining person context, team context, agenda state, and required inputs.
- **Working Agreement** — team-to-team operating agreements (mutual needs, handoff checklists, escalation paths, decision rights).
- **Impact Map** — links cards, agreements, and meetings to missions / outcomes (`ImpactLink`).
- **Org Intelligence** — aggregate, non-individual operating-clarity insight (`OrgInsights` view).

## Forbidden product directions

We do **not** build, and the UI must never read like:

1. A personality quiz.
2. A generic HR dashboard.
3. A gamified leaderboard.
4. A meeting-summary tool.
5. A performance-ranking system.
6. A culture-fit evaluation.
7. An employee-surveillance dashboard.

See `GAMIFICATION_LOCK.md` for the badge / readiness rules.

## Strategic outcome

The UI answers six questions, and only these six:

1. How do I work with this person?
2. How do I work with this team?
3. Is this meeting ready?
4. What does this team need from us?
5. What agreement governs this handoff?
6. Where is operating clarity missing?

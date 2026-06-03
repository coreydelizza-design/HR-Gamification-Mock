# Gamification — Lock

Fieldguide rewards **clarity, readiness, freshness, and collaboration hygiene**. It never rewards personality, ranking, or perceived performance.

## Allowed readiness categories

Used in `lib/readiness.ts` and the Home rollup:

- Card Readiness
- Team Readiness
- Meeting Readiness
- Handoff Readiness
- Freshness
- Agreement Coverage

## Allowed badges

Defined in `data/badges.ts`:

- Meeting Ready
- Team Guide Published
- Handoff Clarity Achieved
- Agreement Verified
- Fresh This Quarter
- Escalation Path Clear
- Async-Friendly
- Decision Path Mapped
- Partner Team Ready

## Forbidden concepts

We do not ship — and a code review must reject — any of these:

- Best Communicator
- Most Collaborative
- Hardest Worker
- Top Performer
- Culture Champion
- Low Friction Employee
- Employee compatibility leaderboard
- Individual employee ranking
- Individual employee friction score
- Any badge or metric that compares two named employees against each other

## Visual rules

- No cartoon trophies, no party-popper emojis, no confetti.
- Use **readiness meters**, **status pills**, **freshness badges**, and **professional nudges**.
- Color is semantic only: success / warning / danger / muted. No celebratory gradients.
- Gamification must read as **operational maturity**, not competition.

## Review heuristic

If a new UI element could be screenshotted and mistaken for an Instagram engagement contest, it is wrong.

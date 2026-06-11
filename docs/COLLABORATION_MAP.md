# Collaboration Map — Lock

The Collaboration Map renders the working structure of the enterprise as organizations and the edges between them.

## Rendering constraint

**No graph library.** CSS-only: grouped columns by category, relationship rows, edge cards. This is a hard constraint — adding a graph/visualization dependency violates the "no new runtime deps" non-negotiable.

## Four modes (segmented control)

1. **Enterprise** — all orgs grouped by the 7 categories, with dependency counts per org.
2. **Selected org** — one org in the middle, its upstream providers in a left column, its downstream consumers in a right column.
3. **Mutual success** — pick two orgs → renders the full `analyzeCrossOrgSuccess` output (needs each way, helps each way, shared outcomes, friction, recommended clauses, meeting guidance, next actions).
4. **Risk** — only at-risk / blocked edges, missing agreements, stale cards, and undefined inputs.

## Edge shape (`CollabEdge`)

```
sourceOrgId          provider / upstream
targetOrgId          consumer / downstream
dependencyType       string
strength             critical | strong | moderate | weak
health               healthy | at_risk | blocked | unknown
requiredInput        what the consumer needs
outputProvided       what the provider supplies
risk                 plain-language risk
governingAgreementId optional → links to a SuccessAgreement when one exists
```

## Seeded edges (~25–31)

Across the 12 Tier-1 orgs, with a few reaching into Tier 2 (e.g. Engineering → Platform Engineering, Sales → Solution Architecture). Health is mixed so the **Risk** mode has content.

## Boundaries

Edges connect organizations only. No edge represents a person-to-person relationship, and no edge carries an individual metric. The map reuses the deterministic, explainable analysis engines — nothing on it is a black-box layout score.

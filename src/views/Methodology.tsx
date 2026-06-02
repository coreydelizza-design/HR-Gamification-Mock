export default function Methodology() {
  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div className="display" style={{ fontSize: 24 }}>Methodology</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          How every score, tier, and recommendation in Fieldguide is computed
        </div>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">01 / Scoring dimensions</div>
        <div className="meth-title">Four signals, weighted equally</div>
        <table className="meth-table">
          <tbody>
            <tr>
              <td className="meth-key">Completion</td>
              <td className="meth-formula">answered / 8 × 100</td>
              <td className="meth-explain">Percentage of the eight working-style questions with a non-empty answer.</td>
            </tr>
            <tr>
              <td className="meth-key">Freshness</td>
              <td className="meth-formula">days_since_update ≤ 90</td>
              <td className="meth-explain">Binary. A card is fresh if it has been updated in the last quarter.</td>
            </tr>
            <tr>
              <td className="meth-key">Depth</td>
              <td className="meth-formula">avg_words / answer</td>
              <td className="meth-explain">High ≥ 12 words. Medium ≥ 7. Low &lt; 7. Length correlates with usefulness; one-word answers fail teammates.</td>
            </tr>
            <tr>
              <td className="meth-key">Streak</td>
              <td className="meth-formula">consecutive quarters fresh</td>
              <td className="meth-explain">Counted in weeks. Resets if a quarterly refresh window is missed and the streak-freeze isn&apos;t applied.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">02 / Tier thresholds</div>
        <div className="meth-title">Cascading rules — first match wins</div>
        <table className="meth-table">
          <tbody>
            <tr>
              <td className="meth-key"><span className="meth-pill tier tier-gold">Gold</span></td>
              <td className="meth-formula">≥ 90% · fresh · depth ≠ Low</td>
              <td className="meth-explain">Complete, current, and substantive. Roughly the top quartile of any healthy org.</td>
            </tr>
            <tr>
              <td className="meth-key"><span className="meth-pill tier tier-silver">Silver</span></td>
              <td className="meth-formula">≥ 75% · fresh</td>
              <td className="meth-explain">Complete and current. Depth is not gating at this tier.</td>
            </tr>
            <tr>
              <td className="meth-key"><span className="meth-pill tier tier-bronze">Bronze</span></td>
              <td className="meth-formula">≥ 50%</td>
              <td className="meth-explain">Half-complete or better. Freshness not gating — bronze can be stale.</td>
            </tr>
            <tr>
              <td className="meth-key"><span className="meth-pill tier tier-incomplete">Incomplete</span></td>
              <td className="meth-formula">otherwise</td>
              <td className="meth-explain">Below 50% completion. Card is not useful to teammates yet.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">03 / Working-style friction</div>
        <div className="meth-title">Predicted communication friction between teams (0–100)</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 12 }}>
          Each team is characterized by its working-style mix (Driver / Analyzer / Connector / Visionary). Friction between two teams is a function of the dominant-style pair archetype. Higher score = more friction.
        </div>
        <table className="meth-table">
          <tbody>
            <tr><td className="meth-key">Driver ↔ Analyzer</td><td className="meth-formula">30–45</td><td className="meth-explain">Pace mismatch. Drivers want to decide; analyzers want to read. Resolves with pre-reads.</td></tr>
            <tr><td className="meth-key">Driver ↔ Driver</td><td className="meth-formula">30–40</td><td className="meth-explain">Matched pace, low surface friction — but elevated decision-collision risk when ownership isn&apos;t clear.</td></tr>
            <tr><td className="meth-key">Driver ↔ Connector</td><td className="meth-formula">40–50</td><td className="meth-explain">Drivers move before consensus is built; connectors interpret pace as disregard.</td></tr>
            <tr><td className="meth-key">Driver ↔ Visionary</td><td className="meth-formula">45–55</td><td className="meth-explain">Both move fast but in different gears. Drivers want to converge; visionaries want to explore.</td></tr>
            <tr><td className="meth-key">Analyzer ↔ Connector</td><td className="meth-formula">25–35</td><td className="meth-explain">Both deliberate. Low friction; occasional pace lag.</td></tr>
            <tr><td className="meth-key">Analyzer ↔ Visionary</td><td className="meth-formula">35–45</td><td className="meth-explain">Evidence vs. inspiration. Translation overhead.</td></tr>
            <tr><td className="meth-key">Connector ↔ Visionary</td><td className="meth-formula">35–45</td><td className="meth-explain">Both relationship-oriented; differ on rigor as the work moves to execution.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">04 / Compatibility scoring</div>
        <div className="meth-title">Person-to-person, 0–100 (lower = less friction)</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.65 }}>
          Pairwise score derived from the same style-pair archetype, then adjusted by individual signals: hours-of-day overlap, channel preference compatibility, and matching feedback orientation. The accompanying tips are templated from each style&apos;s own card data — they are not LLM-generated in this build. Phase 3 introduces LLM-generated tips using the actual answers, not just styles.
        </div>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">05 / Nudge firing rules</div>
        <div className="meth-title">When the system contacts an employee or manager</div>
        <table className="meth-table">
          <tbody>
            <tr><td className="meth-key">Stale reminder</td><td className="meth-formula">days_since &gt; 60</td><td className="meth-explain">Direct Slack DM to the employee. Second nudge at 80 days. Suppressed if streak-freeze is active.</td></tr>
            <tr><td className="meth-key">Pre-meeting refresh</td><td className="meth-formula">stale AND meeting tomorrow</td><td className="meth-explain">Prompt to refresh before the meeting so the AI brief uses current data.</td></tr>
            <tr><td className="meth-key">Manager nudge</td><td className="meth-formula">team_completion &lt; target</td><td className="meth-explain">Aggregate nudge to the manager, not the individuals. Team-grouped — no individual shaming.</td></tr>
            <tr><td className="meth-key">Onboarding sequence</td><td className="meth-formula">new hire week 1</td><td className="meth-explain">Card creation is part of week-1 onboarding. Card-of-the-week may feature it in week 2.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="meth-block">
        <div className="meth-eyebrow">06 / What this product does not do</div>
        <div className="meth-title">Explicit non-claims</div>
        <table className="meth-table">
          <tbody>
            <tr><td className="meth-key">Personality inference</td><td className="meth-explain" colSpan={2}>Fieldguide does not infer working style from observed behavior. Style is self-declared. This is a deliberate constraint — inferred personality data triggers works-council review in many jurisdictions.</td></tr>
            <tr><td className="meth-key">Performance ranking</td><td className="meth-explain" colSpan={2}>No individual ranking, ever. Leaderboards are team-level only. Card quality affects the tier badge but is private to the individual and their manager.</td></tr>
            <tr><td className="meth-key">Sentiment analysis</td><td className="meth-explain" colSpan={2}>Answers are stored verbatim. No automatic sentiment scoring, mood inference, or behavioral analytics on the text content.</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

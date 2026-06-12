import { useState } from 'react';
import type { RoleBand, MeetingCadence, ViewKey } from '../lib/types';
import { useOrgData } from '../lib/demoStore';
import { estimateRoster, money, moneyAnnual } from '../lib/proxyEngine';
import { ROLE_BAND_LABEL, ROLE_BAND_ORDER } from '../data/rateCard';
import { OpportunitySummary } from '../components/Proxy';

interface Props {
  onNavigate: (v: ViewKey) => void;
  onOpenAgreement: (id: string) => void;
  onOpenMeeting: (id: string) => void;
}

const DURATIONS = [25, 50, 90];
const CADENCES: Array<[MeetingCadence, string]> = [
  ['one_time', 'One-time'], ['weekly', 'Weekly'], ['biweekly', 'Biweekly'], ['monthly', 'Monthly'],
];

export default function Estimator({ onNavigate, onOpenAgreement, onOpenMeeting }: Props) {
  const { rateCard } = useOrgData();
  const cur = rateCard.currency;

  const [counts, setCounts] = useState<Partial<Record<RoleBand, number>>>({
    senior_ic: 2, manager: 2, director: 1, c_level: 1,
  });
  const [duration, setDuration] = useState(50);
  const [cadence, setCadence] = useState<MeetingCadence>('weekly');
  const [convert, setConvert] = useState(0);

  const seats = ROLE_BAND_ORDER.reduce((s, b) => s + (counts[b] ?? 0), 0);
  const est = estimateRoster(counts, duration, cadence, convert, rateCard);
  const step = (band: RoleBand, d: number) =>
    setCounts((c) => ({ ...c, [band]: Math.max(0, (c[band] ?? 0) + d) }));

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <span className="display" style={{ fontSize: 24 }}>Meeting Cost Estimator</span>
        <span className="section-meta">The consultant's pocket tool · estimates, never payroll</span>
      </div>
      <div className="section-desc">
        Compose a hypothetical roster and see what it costs — per occurrence, per half hour, and annualized —
        plus what converting seats to a delegate or async digest would recover. Every figure derives from the
        same rate card and economics functions used across the product. No meeting needs to be selected.
      </div>

      {/* What-if calculator */}
      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head"><div className="home-card-title">What-if calculator</div><span className="home-card-meta">{seats} seats</span></div>

        <div className="est-grid">
          <div>
            <div className="lbl-list-label">Roster — band steppers</div>
            <div className="stepper-list">
              {ROLE_BAND_ORDER.map((band) => (
                <div key={band} className="stepper-row">
                  <span className="stepper-label">{ROLE_BAND_LABEL[band]}</span>
                  <span className="mono stepper-rate">{money(rateCard.bands[band].hourly, cur)}/hr</span>
                  <div className="stepper-ctrls">
                    <button className="btn-ghost btn-sm" onClick={() => step(band, -1)}>−</button>
                    <span className="stepper-count mono">{counts[band] ?? 0}</span>
                    <button className="btn-ghost btn-sm" onClick={() => step(band, +1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="lbl-list-label">Duration &amp; cadence</div>
            <div className="filter-row" style={{ marginTop: 4 }}>
              {DURATIONS.map((d) => (
                <button key={d} className={`filter-chip ${duration === d ? 'active' : ''}`} onClick={() => setDuration(d)}>{d} min</button>
              ))}
            </div>
            <div className="filter-row">
              {CADENCES.map(([k, label]) => (
                <button key={k} className={`filter-chip ${cadence === k ? 'active' : ''}`} onClick={() => setCadence(k)}>{label}</button>
              ))}
            </div>

            <div className="lbl-list-label" style={{ marginTop: 16 }}>Conversion — move seats to delegate / async</div>
            <input
              type="range" min={0} max={seats} value={Math.min(convert, seats)}
              onChange={(e) => setConvert(Number(e.target.value))}
              style={{ width: '100%' }}
            />
            <div className="econ-sub">{Math.min(convert, seats)} of {seats} attendees converted (the costliest seats first)</div>
          </div>
        </div>

        <div className="econ-strip" style={{ marginTop: 16 }}>
          <div className="econ-cell">
            <div className="econ-label">Per occurrence</div>
            <div className="econ-value mono">{money(est.perOccurrence, cur)}</div>
            <div className="econ-sub">{seats} seats · {duration} min</div>
          </div>
          <div className="econ-cell">
            <div className="econ-label">Per-half-hour burn</div>
            <div className="econ-value mono">{money(est.perHalfHour, cur)}</div>
            <div className="econ-sub">combined rate for a 30-minute block</div>
          </div>
          <div className="econ-cell">
            <div className="econ-label">Annualized</div>
            <div className="econ-value mono">{moneyAnnual(est.annual, cur)}</div>
            <div className="econ-sub">{CADENCES.find(([k]) => k === cadence)?.[1].toLowerCase()} cadence</div>
          </div>
          <div className="econ-cell econ-recover">
            <div className="econ-label">Recoverable</div>
            <div className="econ-value mono">{money(est.recoverablePerOccurrence, cur)}</div>
            <div className="econ-sub">{moneyAnnual(est.recoverableAnnual, cur)} if held to the conversion</div>
          </div>
        </div>
      </div>

      {/* Enterprise opportunity — same component & functions as Org Insights */}
      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head"><div className="home-card-title">Enterprise opportunity</div><span className="home-card-meta">all seeded meetings</span></div>
        <OpportunitySummary onOpenAgreement={onOpenAgreement} onOpenMeeting={onOpenMeeting} />
      </div>

      {/* Rate card snapshot */}
      <div className="home-card" style={{ marginBottom: 18 }}>
        <div className="home-card-head">
          <div className="home-card-title">Rate card snapshot</div>
          <button className="hli-action" onClick={() => onNavigate('admin')}>Edit rate card →</button>
        </div>
        {rateCard.illustrative && <div className="illustrative-banner">Illustrative defaults — configure in Admin → Rate Card.</div>}
        <div className="rate-table">
          <div className="rate-head"><span>Band</span><span>Annual base</span><span>Hourly</span><span>Half-hour</span></div>
          {ROLE_BAND_ORDER.map((band) => (
            <div key={band} className="rate-row">
              <span>{ROLE_BAND_LABEL[band]}</span>
              <span className="mono">{money(rateCard.bands[band].annualBase, cur)}</span>
              <span className="mono">{money(rateCard.bands[band].hourly, cur)}</span>
              <span className="mono">{money(rateCard.bands[band].halfHour, cur)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="econ-foot" style={{ fontSize: 11, lineHeight: 1.6 }}>
        Methodology: hourly = band base × loaded multiplier ({rateCard.loadedCostMultiplier}) ÷ 2080; cost = Σ seat hourly × duration.
        Rates attach to role bands (seats), never to a named person — no individual compensation is stored, displayed, or implied.
        All figures are estimates for decision-making, not payroll math.
      </div>
    </>
  );
}

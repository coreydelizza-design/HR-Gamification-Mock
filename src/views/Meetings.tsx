import type { Person } from '../lib/types';
import { MEETINGS } from '../data/meetings';
import { TEAM } from '../data/people';
import { STYLES } from '../data/styles';
import { Avatar } from '../components/Shared';

function getPerson(id: string, user: Person): Person | null {
  if (id === 'me') return user;
  return TEAM.find((t) => t.id === id) || null;
}

interface Props {
  user: Person;
  meetingId: string;
  setMeetingId: (id: string) => void;
}

export default function Meetings({ user, meetingId, setMeetingId }: Props) {
  const m = MEETINGS.find((x) => x.id === meetingId) || MEETINGS[0];

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <div className="display" style={{ fontSize: 24 }}>Meeting briefs</div>
        <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>
          Auto-generated for your upcoming calendar.
        </div>
      </div>

      <div className="mtgs">
        <div>
          <div style={{ fontSize: 10.5, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginBottom: 8, padding: '0 3px' }}>
            Upcoming
          </div>
          {MEETINGS.map((mt) => (
            <button
              key={mt.id}
              className={`mtg-item ${mt.id === m.id ? 'active' : ''}`}
              onClick={() => setMeetingId(mt.id)}
            >
              <div className="mtg-title">{mt.title}</div>
              <div className="mtg-when">{mt.when}</div>
              <div className="mtg-avs">
                {mt.attendees.map((id) => {
                  const p = getPerson(id, user);
                  return p ? <Avatar key={id} person={p} size={20} /> : null;
                })}
              </div>
            </button>
          ))}
        </div>

        <div className="card" style={{ overflow: 'hidden', alignSelf: 'start' }}>
          <div className="brief-head">
            <div className="brief-eyebrow">Meeting brief</div>
            <div className="brief-title">{m.title}</div>
            <div className="brief-when">{m.when} · {m.duration}</div>
            <div className="brief-attendees">
              {m.attendees.map((id) => {
                const p = getPerson(id, user);
                if (!p) return null;
                return (
                  <div key={id} className="brief-att">
                    <Avatar person={p} size={26} />
                    <div>
                      <div className="brief-att-name">{p.id === 'me' ? 'You' : p.name.split(' ')[0]}</div>
                      <div className="brief-att-style">{STYLES[p.style].label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="brief-body">
            <div className="brief-label">How to run this room</div>
            <div className="brief-summary">{m.summary}</div>
            <div className="brief-label">Three moves that will land</div>
            {m.tips.map((t, i) => (
              <div key={i} className="tip-row">
                <span className="tip-num">{(i < 9 ? '0' : '') + (i + 1)}</span>
                <div>
                  <div className="tip-head">{t.h}</div>
                  <div className="tip-body">{t.b}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

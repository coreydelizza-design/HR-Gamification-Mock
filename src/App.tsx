import { useState } from 'react';
import type { Person, ViewKey } from './lib/types';
import { useTheme } from './lib/theme';
import { INITIAL_USER, TEAM } from './data/people';
import { GS_SECTIONS, GS_PRESETS } from './data/gamification';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Dashboard from './views/Dashboard';
import Edit from './views/Edit';
import Team from './views/Team';
import PersonView from './views/Person';
import Meetings from './views/Meetings';
import Leaderboard from './views/Leaderboard';
import HRDashboard from './views/HRDashboard';
import Settings from './views/Settings';
import Roadmap from './views/Roadmap';
import AllEmployees from './views/AllEmployees';
import Methodology from './views/Methodology';

const initialGS = (): Record<string, boolean> => {
  const out: Record<string, boolean> = {};
  const target = GS_PRESETS.balanced;
  for (const sec of GS_SECTIONS) {
    for (const o of sec.opts) out[o.id] = target.includes(o.id);
  }
  return out;
};

export default function App() {
  const [view, setView] = useState<ViewKey>('dashboard');
  const [user, setUser] = useState<Person>(INITIAL_USER);
  const [personId, setPersonId] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string>('m1');
  const [gs, setGs] = useState<Record<string, boolean>>(initialGS);
  const [theme, toggleTheme] = useTheme();

  const navigate = (v: ViewKey) => {
    setView(v);
    if (v === 'team') setPersonId(null);
  };

  const openPerson = (id: string) => {
    setPersonId(id);
    setView('person');
  };

  const openMeeting = (id: string) => {
    setMeetingId(id);
    setView('meetings');
  };

  let crumbName: string | undefined;
  if (view === 'person' && personId) {
    if (personId === 'me') crumbName = user.name;
    else crumbName = TEAM.find((t) => t.id === personId)?.name;
  }

  return (
    <div className="app">
      <Sidebar view={view} user={user} onNavigate={navigate} />
      <main className="main">
        <TopBar view={view} crumbName={crumbName} user={user} theme={theme} onToggleTheme={toggleTheme} />
        <div className="view">
          {view === 'dashboard'   && <Dashboard user={user} onEdit={() => setView('edit')} onOpenMeeting={openMeeting} />}
          {view === 'edit'        && <Edit user={user} setUser={setUser} onDone={() => setView('dashboard')} />}
          {view === 'team'        && <Team user={user} onOpenPerson={openPerson} />}
          {view === 'person'      && <PersonView user={user} personId={personId} onBack={() => setView('team')} />}
          {view === 'meetings'    && <Meetings user={user} meetingId={meetingId} setMeetingId={setMeetingId} />}
          {view === 'leaderboard' && <Leaderboard />}
          {view === 'hr'          && <HRDashboard />}
          {view === 'employees'   && <AllEmployees user={user} onOpenPerson={openPerson} />}
          {view === 'settings'    && <Settings gs={gs} setGs={setGs} />}
          {view === 'methodology' && <Methodology />}
          {view === 'roadmap'     && <Roadmap />}
        </div>
      </main>
    </div>
  );
}

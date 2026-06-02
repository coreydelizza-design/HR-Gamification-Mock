import { useState } from 'react';
import type { ViewKey } from './lib/types';
import { useTheme } from './lib/theme';
import { ME, PERSON_BY_ID } from './data/people';
import { TEAM_BY_ID } from './data/teams';
import { MEETING_BY_ID } from './data/meetings';
import { AGREEMENT_BY_ID } from './data/agreements';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Home from './views/Home';
import MyFieldguide from './views/MyFieldguide';
import PeopleTeams from './views/PeopleTeams';
import PersonDetail from './views/PersonDetail';
import TeamDetail from './views/TeamDetail';
import Meetings from './views/Meetings';
import MeetingDetail from './views/MeetingDetail';
import WorkingAgreements from './views/WorkingAgreements';
import AgreementDetail from './views/AgreementDetail';
import OrgInsights from './views/OrgInsights';
import Admin from './views/Admin';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [personId, setPersonId] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  const user = ME;

  const navigate = (v: ViewKey) => setView(v);
  const openPerson = (id: string)    => { setPersonId(id); setView('person'); };
  const openTeam = (id: string)      => { setTeamId(id); setView('team'); };
  const openMeeting = (id: string)   => { setMeetingId(id); setView('meeting'); };
  const openAgreement = (id: string) => { setAgreementId(id); setView('agreement'); };

  let crumbName: string | undefined;
  if (view === 'person' && personId) crumbName = PERSON_BY_ID[personId]?.name;
  if (view === 'team'   && teamId)   crumbName = TEAM_BY_ID[teamId]?.name;
  if (view === 'meeting' && meetingId) crumbName = MEETING_BY_ID[meetingId]?.title;
  if (view === 'agreement' && agreementId) crumbName = AGREEMENT_BY_ID[agreementId]?.title;

  return (
    <div className="app">
      <Sidebar view={view} user={user} onNavigate={navigate} />
      <main className="main">
        <TopBar view={view} crumbName={crumbName} user={user} theme={theme} onToggleTheme={toggleTheme} />
        <div className="view">
          {view === 'home'       && <Home user={user} onNavigate={navigate} onOpenMeeting={openMeeting} onOpenPerson={openPerson} onOpenTeam={openTeam} onOpenAgreement={openAgreement} />}
          {view === 'mycard'     && <MyFieldguide user={user} onNavigate={navigate} />}
          {view === 'people'     && <PeopleTeams user={user} onOpenPerson={openPerson} onOpenTeam={openTeam} />}
          {view === 'person'     && <PersonDetail user={user} personId={personId} onBack={() => setView('people')} />}
          {view === 'team'       && <TeamDetail user={user} teamId={teamId} onBack={() => setView('people')} onOpenPerson={openPerson} />}
          {view === 'meetings'   && <Meetings user={user} onOpenMeeting={openMeeting} />}
          {view === 'meeting'    && <MeetingDetail user={user} meetingId={meetingId} onBack={() => setView('meetings')} onOpenPerson={openPerson} />}
          {view === 'agreements' && <WorkingAgreements user={user} onOpenAgreement={openAgreement} />}
          {view === 'agreement'  && <AgreementDetail user={user} agreementId={agreementId} onBack={() => setView('agreements')} onOpenTeam={openTeam} />}
          {view === 'insights'   && <OrgInsights />}
          {view === 'admin'      && <Admin />}
        </div>
      </main>
    </div>
  );
}

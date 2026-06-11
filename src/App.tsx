import { useState } from 'react';
import type { ViewKey } from './lib/types';
import { useTheme } from './lib/theme';
import { ME } from './data/people';
import { ORG_BY_ID } from './data/organizations';
import { SUCCESS_AGREEMENT_BY_ID } from './data/successAgreements';
import { ORG_MEETING_BY_ID } from './data/meetingFit';

import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Home from './views/Home';
import OrganizationCards from './views/OrganizationCards';
import OrganizationCardDetail from './views/OrganizationCardDetail';
import CollaborationMap from './views/CollaborationMap';
import SuccessAgreements from './views/SuccessAgreements';
import SuccessAgreementDetail from './views/SuccessAgreementDetail';
import MeetingFit from './views/MeetingFit';
import MeetingFitDetail from './views/MeetingFitDetail';
import OrgInsights from './views/OrgInsights';
import Admin from './views/Admin';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [orgId, setOrgId] = useState<string | null>(null);
  const [agreementId, setAgreementId] = useState<string | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [theme, toggleTheme] = useTheme();

  const user = ME;

  const navigate = (v: ViewKey) => setView(v);
  const openOrg = (id: string)       => { setOrgId(id); setView('organization-detail'); };
  const openAgreement = (id: string) => { setAgreementId(id); setView('success-agreement-detail'); };
  const openMeeting = (id: string)   => { setMeetingId(id); setView('meeting-fit-detail'); };

  let crumbName: string | undefined;
  if (view === 'organization-detail' && orgId) crumbName = ORG_BY_ID[orgId]?.name;
  if (view === 'success-agreement-detail' && agreementId) crumbName = SUCCESS_AGREEMENT_BY_ID[agreementId]?.title;
  if (view === 'meeting-fit-detail' && meetingId) crumbName = ORG_MEETING_BY_ID[meetingId]?.title;

  return (
    <div className="app">
      <Sidebar view={view} user={user} onNavigate={navigate} />
      <main className="main">
        <TopBar view={view} crumbName={crumbName} user={user} theme={theme} onToggleTheme={toggleTheme} />
        <div className="view">
          {view === 'home' && <Home user={user} onNavigate={navigate} onOpenOrg={openOrg} onOpenAgreement={openAgreement} onOpenMeeting={openMeeting} />}
          {view === 'organizations' && <OrganizationCards onOpenOrg={openOrg} />}
          {view === 'organization-detail' && <OrganizationCardDetail orgId={orgId} onBack={() => setView('organizations')} onOpenOrg={openOrg} onOpenAgreement={openAgreement} />}
          {view === 'collaboration-map' && <CollaborationMap onOpenOrg={openOrg} onOpenAgreement={openAgreement} />}
          {view === 'success-agreements' && <SuccessAgreements onOpenAgreement={openAgreement} onOpenOrg={openOrg} />}
          {view === 'success-agreement-detail' && <SuccessAgreementDetail agreementId={agreementId} onBack={() => setView('success-agreements')} onOpenOrg={openOrg} />}
          {view === 'meeting-fit' && <MeetingFit onOpenMeeting={openMeeting} />}
          {view === 'meeting-fit-detail' && <MeetingFitDetail meetingId={meetingId} onBack={() => setView('meeting-fit')} onOpenOrg={openOrg} onOpenAgreement={openAgreement} />}
          {view === 'org-insights' && <OrgInsights onOpenOrg={openOrg} />}
          {view === 'admin' && <Admin />}
        </div>
      </main>
    </div>
  );
}

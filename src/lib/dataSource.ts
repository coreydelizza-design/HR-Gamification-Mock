/**
 * dataSource — the single read accessor through which VIEWS reach static seed
 * data. Views never import `src/data/*` directly; they import from here (mutable
 * org/card/meeting state still comes from demoStore via useOrgData). This keeps
 * the data layer behind one seam — the future Supabase swap happens here, not in
 * eleven views. Pure re-exports: identical objects, zero behavior change.
 */
export { ENTERPRISE } from '../data/enterprise';
export { ORG_PACKS, ORG_PACK_BY_ID } from '../data/orgPacks';
export { ROLE_BAND_LABEL, ROLE_BAND_ORDER, DEFAULT_MULTIPLIER, deriveHourly, deriveHalfHour } from '../data/rateCard';
export { ORG_CATEGORY_LABEL } from '../data/organizations';
export { COLLAB_EDGES } from '../data/collaborationMap';
export { SUCCESS_AGREEMENTS, SUCCESS_AGREEMENT_BY_ID, SUCCESS_AGREEMENT_SECTIONS } from '../data/successAgreements';
export { ORG_DEPENDENCIES } from '../data/orgDependencies';
export { ORG_NEEDS, ORG_OFFERS } from '../data/orgNeedsOffers';
export { ORG_MEETINGS, ORG_MEETING_FITS, ORG_MEETING_FIT_BY_MEETING } from '../data/meetingFit';
export { roleBandOfPerson, ROLE_CARDS_BY_ORG, PEOPLE_BY_ORG } from '../data/roleCards';
export { PERSON_BY_ID, WORK_CARD_BY_PERSON, CARD_ANSWERS, ME } from '../data/people';

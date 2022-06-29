/**
 * Created by chenghui on 5/23/17.
 */
import { combineReducers } from 'redux';
import candidateNotes from './talentNotes';
import tenants from './tenantsRedcer';
import jobNotes from './jobNotesReducer';
import jobQuestions from './jobQuestions';
// job
import jobs from './jobsReducer';
// talents
import talents from './talents';
import talentOwnerships from './talentOwnerships';
import talentResumes from './talentResumes';
import talentsSubmitToClient from './talentsSubmitToClient';
//tenants

//users
import users from './usersReducer';
//clients
import clients from './clients';
import contracts from './contracts';
import companies from './companies';
//parseRecords
import parseRecords from './parseRecords';
//notifications
import notifications from './notificationsReducer';
import templates from './templates';
import divisions from './divisions';
import purchasedCandidate from './purchasedCandidate';
import dashboard from './dashboard';
import syncDashboard from './syncDashboard';
import emailDraft from './emailDraft';
import uuid from './uuid';
import noContractClient from './noContractClient';
import serviceTypeTree from './PotentialServiceTypeTree';
import amReport from './amReport';
import tenantCredit from './tenantCredit';
import jobTalentPool from './jobTalentPool';
import companiesOptions from './companiesOptions';
import internalReport from './internalReport';
import skimSubmitToAMCompanies from './skimSubmitToAMCompanies';

export default combineReducers({
  users,
  candidateNotes,
  talentResumes,
  talentOwnerships,
  jobs,
  notifications,
  jobNotes,
  jobQuestions,
  tenants,
  talents,
  clients,
  companies,
  parseRecords,
  templates,
  talentsSubmitToClient,
  divisions,
  purchasedCandidate,
  contracts,
  dashboard,
  syncDashboard,
  emailDraft,
  uuid,
  noContractClient,
  serviceTypeTree,
  amReport,
  tenantCredit,
  jobTalentPool,
  companiesOptions,
  internalReport,
  skimSubmitToAMCompanies,
});

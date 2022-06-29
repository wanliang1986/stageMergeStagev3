/**
 * Created by chenghui on 5/23/17.
 */
import { combineReducers } from 'redux';
import loginChecked from './checkingLoginReducer';
import currentUser from './currentUserReducer';
import message from './messageReducer';
import loggedin from './loginStatusReducer';
import searchJobs from './searchJobs';
import searchTalents from './searchTalents';
import searchInvoices from './searchInvoices';
import searchStarts from './searchStarts';
import searchAudience from './searchAudience';
import searchCommissions from './searchCommissions';
import reload from './reload';
import routerStatus from './routerStatus';
import currentStart from './currentStartReducer';
import newSearchJobs from './newSearchJobs';
import newSearchOptions from './newSearchOptions';
import tableSizeFlag from './jobTableSize';
import sendEmailRequest from './sendEmailRequestReducer';
import candidateSelect from './candidateSelect';
import newCandidateJob from './newCandidate';
import myPipelineFilter from './myPipelineFilterReducer';
import pipelineTemplate from './pipelineTemplateReducer';
import pipelineTemplateList from './pipelineTemplateList';
import pipelineMainFilter from './myPipelineMainFilterReducer';
import assignment from './assignmentReducer';
import documentView from './documentView';
import openOnboarding from './openOnboarding';
import language from './language';
import selectTab from './tabSelect';
export default combineReducers({
  loginChecked,
  currentUser,
  message,
  loggedin,
  searchJobs,
  searchTalents,
  searchInvoices,
  searchStarts,
  searchCommissions,
  reload,
  routerStatus,
  searchAudience,
  currentStart,
  newSearchJobs,
  newSearchOptions,
  tableSizeFlag,
  sendEmailRequest,
  candidateSelect,
  newCandidateJob,
  myPipelineFilter,
  pipelineTemplate,
  pipelineTemplateList,
  pipelineMainFilter,
  assignment,
  documentView,
  openOnboarding,
  language,
  selectTab,
});

/**
 * Created by chenghui on 5/23/17.
 */
import { combineReducers } from 'redux';
// import talents from './talentsReducer';
import activities from './activitiesReducer';
import usersToJobsRelations from './usersToJobsRelations';
import applications from './applications';
import teams from './teams';
import programTeams from './programTeams';
import hotLists from './hotLists';
import hotListUsers from './hotListUsers';
import hotListTalents from './hotListTalents';
import emailBlasts from './emailBlasts';
import recipients from './recipients';
import starts from './starts';
import invoices from './invoiceReducer';
import invoiceActivities from './invoiceActivitiesReducer';
import commissions from './commissionReducer'; //finance commissions

export default combineReducers({
  activities, // users & applications relation
  usersToJobsRelations,
  applications, // talents & jobs & users relation
  teams,
  programTeams,
  hotLists,
  emailBlasts,
  recipients,
  hotListUsers,
  hotListTalents,
  starts,
  invoices,
  invoiceActivities,
  commissions,
});

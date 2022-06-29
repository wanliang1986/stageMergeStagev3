import { createSelector } from 'reselect';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import { CONTACT_TYPES } from '../constants/formOptions';
import { formatFullName } from '../../utils';

const getTalents = (state) => state.model.talents;
const getHotLists = (state) => state.relationModel.hotLists;
const getHotListTalents = (state) => state.relationModel.hotListTalents;
const getHotListId = (_, hotListId) => parseInt(hotListId, 10);
const getHotListUsers = (state) => state.relationModel.hotListUsers;

const getHotListList = createSelector([getHotLists], (hotLists) => {
  return hotLists
    .filter((hotList) => hotList.get('id'))
    .map((e) =>
      e.set('createdDate', moment(e.get('createdDate')).format('YYYY-MM-DD'))
    )
    .sortBy(
      (hotList) => hotList.get('id'),
      (a, b) => {
        if (a < b) {
          return 1;
        }
        if (a > b) {
          return -1;
        }
        if (a === b) {
          return 0;
        }
      }
    )
    .toList();
});

export default getHotListList;

export const getHotListUserList = createSelector(
  [getHotListId, getHotListUsers],
  (hotListId, hotListUsers) => {
    return hotListUsers
      .filter((hotListUser) => hotListUser.get('hotListId') === hotListId)
      .sortBy(
        (note) => note.get('createdDate'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .map((hotListUser) => hotListUser.get('userId'))
      .toList();
  }
);

export const getHotListTalentList2 = createSelector(
  [getHotListId, getHotListTalents, getTalents],
  (hotListId, hotListTalents, talents) => {
    return hotListTalents
      .filter((el) => el.get('hotListId') === hotListId)
      .map((hotlistTalent) => {
        const talentId = hotlistTalent.get('talentId');
        const talent = talents.get(String(talentId));
        // console.log('!~~~~~~~~~~~~~~~~!');
        let educations = talent && talent.get('educations');
        let experiences = talent && talent.get('experiences');
        let schools =
          educations &&
          educations
            .map((item, index) => {
              return item.get('collegeName');
            })
            .filter((e) => e);
        let majors =
          educations &&
          educations
            .map((item, index) => {
              return item.get('majorName');
            })
            .filter((e) => e);
        let jobTitles =
          experiences &&
          experiences
            .map((item, index) => {
              return item.get('title');
            })
            .filter((e) => e);
        let companies =
          experiences &&
          experiences
            .map((item, index) => {
              return item.get('company');
            })
            .filter((e) => e);
        let schoolsHtml = schools
          ? Array.from(new Set(schools.toJS())).join(', ')
          : '';
        let majorsHtml = majors
          ? Array.from(new Set(majors.toJS())).join(', ')
          : '';
        let jobTitlesHtml = jobTitles
          ? Array.from(new Set(jobTitles.toJS())).join(', ')
          : '';
        let companiesHtml = companies
          ? Array.from(new Set(companies.toJS())).join(', ')
          : '';
        const talentContacts = talent && talent.get('contacts');
        // console.log(talentContacts);
        const emailContact =
          talentContacts &&
          talentContacts.find((c) => c.get('type') === CONTACT_TYPES.Email);
        const phoneContact =
          talentContacts &&
          talentContacts.find((c) => c.get('type') === CONTACT_TYPES.Phone);

        const firstName = ((talent && talent.get('firstName')) || '').trim();
        const lastName = ((talent && talent.get('lastName')) || '').trim();

        return Immutable.Map({
          id: talent && talent.get('id'),
          fullName:
            firstName && lastName
              ? formatFullName(firstName, lastName)
              : talent && talent.get('fullName'),
          firstName,
          lastName,
          chinese: talent && talent.get('chinese'),
          email: emailContact && emailContact.get('contact'),
          phone: phoneContact && phoneContact.get('contact'),
          company: companiesHtml,
          // company: talent && talent.get('company'),
          title: jobTitlesHtml,
          // title: talent && talent.get('title'),
          school: schoolsHtml,
          // school: (education && education.get('collegeName')) || '',
          major: majorsHtml,
          // major: (education && education.get('majorName')) || '',
          createdDate: talent && talent.get('createdDate'),
          // addToHotListDate: hotlistTalent.get('createdDate'),
          addToHotListDate: moment(hotlistTalent.get('createdDate')).format(
            'YYYY-MM-DD HH:mm'
          ),
        });
      })
      .sortBy(
        (note) => note.get('createdDate'),
        (a, b) => {
          if (a < b) {
            return 1;
          }
          if (a > b) {
            return -1;
          }
          if (a === b) {
            return 0;
          }
        }
      )
      .toList();
  }
);

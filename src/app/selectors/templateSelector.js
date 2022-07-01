import { createSelector } from 'reselect';
// import Immutable from 'immutable';

const getTemplates = (state) => state.model.templates;
const getTemplateType = (_, type) => type;
const getCurrentUserId = (state) => state.controller.currentUser.get('id');

const getTemplateList = createSelector(
  [getTemplates, getTemplateType],
  (templates, type) => {
    return templates
      .filter(
        (template) =>
          template.get('isRichText') && (!type || template.get('type') === type)
      )
      .sortBy(
        (template) => template.get('id'),
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

export default getTemplateList;

export const getMyDraftList = createSelector(
  [getTemplates, getCurrentUserId],
  (templates, currentUser) => {
    return templates
      .filter((template) => {
        // const createdBy = template.get('userId');
        // console.log('elector', createdBy, currentUser)
        return (
          template.get('userId') === currentUser &&
          template.get('isRichText') &&
          template.get('isPrivate')
        );
      })
      .sortBy(
        (template) => template.get('id'),
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

import { createSelector } from 'reselect';

const getTalentId = (_, talentId) => parseInt(talentId, 10);
const getTalentResumes = (state) => state.model.talentResumes;

const getTalentResumeList = createSelector(
  [getTalentId, getTalentResumes],
  (talentId, resumes) => {
    return resumes
      .filter((resume) => resume.get('talentId') === talentId)
      .sortBy(
        (resume) => resume.get('createdDate'),
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

export const getTalentResumeArray = createSelector(
  [getTalentResumeList],
  (resumeList) => {
    return resumeList.toJS();
  }
);

export default getTalentResumeList;

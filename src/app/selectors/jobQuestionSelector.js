import { createSelector } from 'reselect';
// import Immutable from 'immutable';

const getJobId = (_, jobId) => parseInt(jobId, 10);
const getJobQuestions = (state) => state.model.jobQuestions;
const getUsers = (state) => state.model.users;

const getJobQuestionList = createSelector(
  [getJobId, getJobQuestions, getUsers],
  (jobId, questions, users) => {
    return questions
      .filter((question) => question.get('jobId') === jobId)
      .map((question) =>
        question.set('user', users.get(question.get('userId').toString()))
      )
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

export default getJobQuestionList;

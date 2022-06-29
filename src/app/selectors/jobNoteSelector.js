import { createSelector } from 'reselect';
// import Immutable from 'immutable';

const getJobId = (_, jobId) => parseInt(jobId, 10);
const getJobNotes = (state) => state.model.jobNotes;
const getUsers = (state) => state.model.users;

const getJobNoteList = createSelector(
    [getJobId, getJobNotes, getUsers],
    (jobId, notes, users) => {
        return notes.filter((note) => note.get('jobId') === jobId)
            .map(note => note.set('user', users.get(note.get('userId').toString())))
            .sortBy((note) => note.get('createdDate'),
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
                })
            .toList()
    }
);

export default getJobNoteList
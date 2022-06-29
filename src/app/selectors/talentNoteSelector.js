import { createSelector } from 'reselect';

const getTalentId = (_, talentId) => parseInt(talentId, 10);
const getTalentNotes = (state) => state.model.candidateNotes;
const getUsers = (state) => state.model.users;

const getTalentNoteList = createSelector(
    [getTalentId, getTalentNotes, getUsers],
    (talentId, notes, users) => {
        return notes.filter((note) => note.get('talentId') === talentId)
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

export default getTalentNoteList
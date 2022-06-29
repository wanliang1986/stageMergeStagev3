import { createSelector } from 'reselect';
// import Immutable from 'immutable';

// const getCurrentUser = (state) => state.controller.currentUser;
const getDivisions = (state) => state.model.divisions;

export const getDivisionList = createSelector(
    [getDivisions],
    (divisions) => {
        console.log('division selector');
        return divisions
            .toList()
            .sortBy(t => t.get('createdDate'))
    }
);


export default getDivisionList
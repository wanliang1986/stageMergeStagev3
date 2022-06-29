import { createSelector } from 'reselect';
import { deleteParseRecord } from './../../apn-sdk';

const getParseRecords = (state) => state.model.parseRecords;
const getParseRecordIds = (_, parseRecordIds) => parseRecordIds;

const getParseRecordList = createSelector([getParseRecords], (parseRecords) => {
  return parseRecords
    .filter((record) => {
      // const result = JSON.parse(record.get('parseResult'));
      // console.log(record.toJS(), result);
      //todo: remove data correction
      const flag = record.get('originalFileName');
      if (!flag) deleteParseRecord(record.get('id'));
      return flag;
    })
    .map((record) => {
      const note = record.get('note');
      return record
        .set('note', (note && JSON.parse(note).other) || '')
        .set('single', note && JSON.parse(note).single)
        .set('talentId', note && JSON.parse(note).talentId)
        .set('hotList', note && JSON.parse(note).hotList);
    })
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
});
export const getParseRecordByIds = createSelector(
  [getParseRecords, getParseRecordIds],
  (parseRecords, ids) => {
    console.log(ids);
    return ids.map((id) => {
      const record = parseRecords.get(String(id));
      const note = record.get('note');
      return record
        .set('note', (note && JSON.parse(note).other) || '')
        .set('single', note && JSON.parse(note).single)
        .set('talentId', note && JSON.parse(note).talentId)
        .set('hotList', note && JSON.parse(note).hotList);
    });
  }
);

export default getParseRecordList;

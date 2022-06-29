const baseColumns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 2,
    col: 'fullName',
    fixed: true,
    type: 'link',
    sortable: true,
  },
  // {
  //     colName: 'email',
  //     colWidth: 200,
  //     flexGrow: 2,
  //     col: 'email',
  //     sortable: true,
  // },
  // {
  //     colName: 'phone',
  //     colWidth: 140,
  //     flexGrow: 2,
  //     col: 'phone',
  //     sortable: true,
  // },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 2,
    col: 'title',
    sortable: true,
  },
];
const skillColumn = {
  colName: 'skills',
  colWidth: 200,
  flexGrow: 2,
  col: 'skills.skillName',
  // sortable: true
};
const ownerColumn = {
  colName: 'createdBy',
  colWidth: 160,
  flexGrow: 1,
  col: 'createdBy',
  sortable: true,
};
const ownerColumn2 = {
  colName: 'createdBy',
  colWidth: 160,
  flexGrow: 1,
  col: 'createdBy',
  // sortable: true,
  disableSearch: true,
};
const createdAtColumn = {
  colName: 'createdAt',
  colWidth: 160,
  flexGrow: 1,
  col: 'createdDate',
  type: 'date',
  disableSearch: true,
  sortable: true,
};
const applicationsColumn = {
  colName: 'relatedJobs',
  colWidth: 120,
  col: 'watchApplicationCount',
  type: 'application',
  // sortable: true
};
const lastModifiedDateColumn = {
  colName: 'lastModifiedDate',
  colWidth: 160,
  flexGrow: 1,
  col: 'lastModifiedDate',
  type: 'date',
  disableSearch: true,
  sortable: true,
};
export const talentColumns = baseColumns.concat(
  skillColumn,
  ownerColumn,
  createdAtColumn
);

export const talentColumns2 = baseColumns.concat(ownerColumn2, createdAtColumn);

export const talentColumns3 = baseColumns.concat(
  applicationsColumn,
  lastModifiedDateColumn
);

export const CANDIDATE_COUNT_PER_PAGE = 40;

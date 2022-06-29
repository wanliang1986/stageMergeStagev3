export const styles = {
  root: {
    overflow: 'auto',
    '& .MuiButton-outlinedSizeSmall': {
      height: '32px ',
      minWidth: '32px ',
      width: '32px',
      marginRight: '50px',
      borderRadius: 0,
    },
  },
  actionsContainer: {
    margin: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  actions: {
    minHeight: 40,
    padding: 8,
    flexWrap: 'wrap',
  },
  contentContainer: {
    overflow: 'hidden',
    position: 'relative',
  },
  contentMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: 'rgba(240,240,240,.5)',
  },
};

export const statusMap = {
  applied: 'Submitted To AM',
  submitted: 'Submitted To Client',
  interview: 'Interview',
  offered: 'Offered by Client',
  offerAccepted: 'Offer Accepted',
  started: 'On boarded',
};

export const pipelineDetailColumns = [
  {
    colName: 'candidate',
    colWidth: 200,
    col: 'talentName',
    sortable: true,
    type: 'talentNameLink',
    fixed: true,
  },
  {
    colName: 'Current Status',
    colWidth: 170,
    col: 'latestActivityStatusDesc',
    sortable: true,
  },
  {
    colName: 'Last Updated At',
    colWidth: 180,
    flexGrow: 1,
    col: 'latestActivityDate',
    sortable: true,
  },
  {
    colName: 'Date of Submitted To AM',
    colWidth: 160,
    col: 'appliedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Date of Submitted To Client',
    colWidth: 160,
    col: 'submittedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Date of Interview',
    colWidth: 160,
    col: 'interviewDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Date of Offered by Client',
    colWidth: 160,
    col: 'offeredDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Date of Offer Accepted',
    colWidth: 160,
    col: 'offerAcceptedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Date of On boarded',
    colWidth: 160,
    col: 'startedDate',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'Sourcer',
    colWidth: 200,
    flexGrow: 1,
    col: 'appliedBy',
  },
  {
    colName: 'Submitted To Client  By',
    colWidth: 200,
    col: 'submittedBy',
    sortable: true,
  },
  // {
  //     colName: 'submitMemo',
  //     colWidth: 200,
  //     col: 'submittedMemo',
  // },
  {
    colName: 'Interview By',
    colWidth: 200,
    col: 'interviewBy',
    sortable: true,
  },
  // {
  //     colName: 'interviewMemo',
  //     colWidth: 200,
  //     col: 'interviewMemo',
  // },
  {
    colName: 'On Board By',
    colWidth: 200,
    col: 'startedBy',
    sortable: true,
  },
  // {
  //     colName: 'startedMemo',
  //     colWidth: 200,
  //     col: 'startedMemo',
  // },

  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'title',
  },
  {
    colName: 'Date Posted',
    colWidth: 120,
    col: 'dateIssued',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
    sortable: true,
  },
  {
    colName: 'Job Id',
    colWidth: 180,
    flexGrow: 1,
    col: 'jobId',
    sortable: true,
  },
  {
    colName: 'Client Job Code',
    colWidth: 180,
    flexGrow: 1,
    col: 'code',
    sortable: true,
  },
  //   {
  //     colName: 'priority',
  //     colWidth: 120,
  //     col: 'priority',
  //     sortable: true,
  //   },
  {
    colName: 'status',
    colWidth: 120,
    flexGrow: 1,
    col: 'status',
    sortable: true,
  },
  {
    colName: 'division',
    colWidth: 120,
    col: 'division',
  },
  {
    colName: 'type',
    colWidth: 120,
    type: 'jobType',
    col: 'type',
    sortable: true,
  },
  {
    colName: 'clientContact',
    colWidth: 140,
    flexGrow: 1,
    col: 'hiringManager',
  },
  {
    colName: 'minimumPayRate',
    colWidth: 90,
    col: 'minimumPayRate',
  },
  {
    colName: 'maximumPayRate',
    colWidth: 90,
    col: 'maximumPayRate',
  },
  {
    colName: 'minimumBillRate',
    colWidth: 90,
    col: 'minimumBillRate',
  },
  {
    colName: 'maximumBillRate',
    colWidth: 90,
    col: 'maximumBillRate',
  },
  {
    colName: 'ratePer',
    colWidth: 90,
    col: 'unitType',
  },
  // {
  //     colName: 'street',
  //     colWidth: 220,
  //     flexGrow: 2,
  //     col: 'address',
  // },
  //   {
  //     colName: 'city',
  //     colWidth: 160,
  //     flexGrow: 2,
  //     col: 'city',
  //   },
  //   {
  //     colName: 'province',
  //     colWidth: 90,
  //     flexGrow: 2,
  //     col: 'country',
  //   },
  // {
  //     colName: 'zipcode',
  //     colWidth: 120,
  //     col: 'zipCode',
  // },
  {
    colName: 'Location',
    colWidth: 160,
    flexGrow: 2,
    col: 'jobLocations',
    type: 'location',
  },
  {
    colName: 'openings',
    colWidth: 120,
    flexGrow: 1,
    col: 'openingCount',
  },
  {
    colName: 'skills',
    colWidth: 200,
    flexGrow: 1,
    col: 'requiredSkills',
    type: 'skills',
  },

  {
    colName: 'primaryRecruiter',
    colWidth: 200,
    flexGrow: 1,
    col: 'primaryRecruiter',
    sortable: true,
  },
  {
    colName: 'primarySale',
    colWidth: 200,
    flexGrow: 1,
    col: 'primarySales',
    sortable: true,
  },
];

export const jobDetailColumns = [
  {
    colName: 'Date Posted',
    colWidth: 140,
    col: 'dateIssued',
    type: 'date',
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    col: 'title',
    type: 'jobLink',
    sortable: true,
  },
  {
    colName: 'Job Id',
    colWidth: 180,
    flexGrow: 1,
    col: 'jobId',
    sortable: true,
  },
  {
    colName: 'Client Job Code',
    colWidth: 180,
    flexGrow: 1,
    col: 'code',
  },
  //   {
  //     colName: 'priority',
  //     colWidth: 120,
  //     col: 'priority',
  //   },
  {
    colName: 'status',
    colWidth: 120,
    flexGrow: 1,
    col: 'status',
  },
  {
    colName: 'officeName',
    colWidth: 120,
    col: 'division',
  },
  {
    colName: 'type',
    colWidth: 120,
    type: 'jobType',
    col: 'type',
  },

  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
  },
  {
    colName: 'clientContact',
    colWidth: 140,
    flexGrow: 1,
    col: 'hiringManager',
  },

  {
    colName: 'minimumPayRate',
    colWidth: 90,
    col: 'minimumPayRate',
  },
  {
    colName: 'maximumPayRate',
    colWidth: 90,
    col: 'maximumPayRate',
  },
  {
    colName: 'minimumBillRate',
    colWidth: 90,
    col: 'minimumBillRate',
  },
  {
    colName: 'maximumBillRate',
    colWidth: 90,
    col: 'maximumBillRate',
  },

  {
    colName: 'ratePer',
    colWidth: 90,
    col: 'unitType',
  },

  {
    colName: 'startDate',
    colWidth: 120,
    col: 'startDate',
  },
  {
    colName: 'endDate',
    colWidth: 120,
    col: 'endDate',
  },
  //   {
  //     colName: 'street',
  //     colWidth: 220,
  //     flexGrow: 2,
  //     col: 'address',
  //   },
  //   {
  //     colName: 'city',
  //     colWidth: 160,
  //     flexGrow: 2,
  //     col: 'city',
  //   },
  //   {
  //     colName: 'province',
  //     colWidth: 90,
  //     flexGrow: 2,
  //     col: 'country',
  //   },
  //   {
  //     colName: 'zipcode',
  //     colWidth: 120,
  //     col: 'zipCode',
  //   },
  {
    colName: 'Location',
    colWidth: 160,
    flexGrow: 2,
    col: 'jobLocations',
    type: 'location',
  },
  {
    colName: 'openings',
    colWidth: 120,
    flexGrow: 1,
    col: 'openingCount',
  },
  {
    colName: 'maxSubmittal',
    colWidth: 120,
    flexGrow: 1,
    col: 'maxSubmittals',
  },

  {
    colName: 'skills',
    colWidth: 200,
    flexGrow: 1,
    col: 'requiredSkills',
    type: 'skills',
  },
  {
    colName: 'primaryRecruiter',
    colWidth: 200,
    flexGrow: 1,
    col: 'primaryRecruiter',
  },
  {
    colName: 'primarySale',
    colWidth: 200,
    flexGrow: 1,
    col: 'primarySales',
  },
  {
    colName: 'Sum of Submitted to Client',
    colWidth: 150,
    flexGrow: 1,
    col: 'submittedCount',
  },
  {
    colName: 'Sum of Interview',
    colWidth: 120,
    flexGrow: 1,
    col: 'interviewCount',
  },
  {
    colName: 'Sum of On boarded',
    colWidth: 120,
    flexGrow: 1,
    col: 'startedCount',
  },
  {
    colName: 'lastActivityDate',
    colWidth: 180,
    flexGrow: 1,
    col: 'lastActivityDate',
  },
  {
    colName: 'suppliersCompany',
    colWidth: 180,
    flexGrow: 1,
    col: 'suppliersCompany',
  },

  {
    colName: 'noSubmittal',
    colWidth: 140,
    flexGrow: 1,
    col: 'noSubmittals',
  },
  {
    colName: 'noSubmittalsWithin48Hours',
    colWidth: 180,
    flexGrow: 1,
    col: 'noSubmittalsWithin48Hours',
  },
];

const pipelineColumns = [
  {
    colName: 'Submitted to AM',
    colWidth: 185,
    col: 'appliedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been submitted to AM during the selected time frame',
  },
  {
    colName: 'Submitted to Client',
    colWidth: 200,
    col: 'submittedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been submitted to client among those [Sum of Submitted to AM] in the selected time frame',
  },
  {
    colName: 'Interview',
    colWidth: 135,
    col: 'interviewCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been in the process of interview during the selected time frame',
  },
  {
    colName: 'Offered by Client',
    colWidth: 185,
    col: 'offeredCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been offered by client during the selected time frame',
  },
  {
    colName: 'Offer Accepted',
    colWidth: 175,
    col: 'offerAcceptedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have accepted offer during the selected time frame',
  },
  {
    colName: 'On boarded',
    colWidth: 155,
    col: 'startedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been on boarded during the selected time frame',
  },
  {
    colWidth: 0,
    col: 'empty',
    flexGrow: 1,
  },
];
const pipelineColumns2 = [
  {
    colName: 'Submitted to AM',
    colWidth: 185,
    col: 'appliedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been submitted to AM during the selected time frame',
  },
  {
    colName: 'Submitted to Client',
    colWidth: 200,
    col: 'submittedCount',
    type: 'activityCount2',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been submitted to client among those [Sum of Submitted to AM] in the selected time frame',
  },
  {
    colName: 'Submitted to Client',
    colWidth: 200,
    col: 'pipelineUpdateSubmittedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been Submitted to Client during the selected time frame',
  },
  {
    colName: 'Interview',
    colWidth: 135,
    col: 'interviewCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been in the process of interview during the selected time frame',
  },
  {
    colName: 'Offered by Client',
    colWidth: 185,
    col: 'offeredCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been offered by client during the selected time frame',
  },
  {
    colName: 'Offer Accepted',
    colWidth: 175,
    col: 'offerAcceptedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have accepted offer during the selected time frame',
  },
  {
    colName: 'On boarded',
    colWidth: 155,
    col: 'startedCount',
    type: 'activityCount',
    sortable: true,
    tooltip: true,
    tooltipText:
      'Total number of candidates that have been on boarded during the selected time frame',
  },
  {
    colWidth: 0,
    col: 'empty',
    flexGrow: 1,
  },
];
const jobPipielineColumns = [
  {
    colName: 'sumOfOpening',
    colWidth: 110,
    col: 'openingCount',
    type: 'jobCount',
    sortable: true,
  },
].concat(
  pipelineColumns
  //   [
  //   {
  //     colName: 'Submitted to Client/ Openings(%)',
  //     colWidth: 195,
  //     col: 'soPercent',
  //     sortable: true
  //   },
  //   {
  //     colName: 'On boarded/ Openings(%)',
  //     colWidth: 155,
  //     col: 'hoPercent',
  //     sortable: true
  //   }
  // ]
);

export const pipelineByCompnayColumns = [
  {
    colName: 'Client Company',
    colWidth: 180,
    col: 'company',
    sortable: true,
    fixed: true,
  },
].concat(pipelineColumns);

export const pipelineByRecruiterColumns = [
  {
    colName: 'User Name',
    colWidth: 180,
    col: 'userName',
    sortable: true,
    fixed: true,
  },
].concat(pipelineColumns2);

export const pipelineBySourcerColumns = [
  {
    colName: 'Sourcer',
    colWidth: 180,
    col: 'recruiter',
    sortable: true,
    fixed: true,
  },
].concat(pipelineColumns);

export const jobPipielineByCompanyColumns = [
  {
    colName: 'company',
    colWidth: 180,
    col: 'company',
    sortable: true,
    fixed: true,
  },
].concat(jobPipielineColumns);

export const jobPipielineByCompanyAndRecruiterColumns = [
  {
    colName: 'company',
    colWidth: 180,
    col: 'company',
    sortable: true,
    fixed: true,
  },
  {
    colName: 'Primary Recruiter',
    colWidth: 190,
    col: 'recruiter',
    sortable: true,
    fixed: true,
  },
].concat(jobPipielineColumns);

export const jobPipielineByRecruiterColumns = [
  {
    colName: 'AM',
    colWidth: 180,
    col: 'userName',
    sortable: true,
    fixed: true,
  },
].concat(jobPipielineColumns);

export const agingReportColumns = [
  {
    colName: 'Activity Status',
    colWidth: 180,
    col: 'activityStatus',
    sortable: true,
  },
  {
    colName: '7 days',
    colWidth: 175,
    col: 'sevenCount',
    type: 'activityCount',
    sortable: true,
  },
  {
    colName: '14 days',
    colWidth: 185,
    col: 'fourteenCount',
    type: 'activityCount',
    sortable: true,
  },
  {
    colName: '21 days',
    colWidth: 115,
    col: 'twentyOneCount',
    type: 'activityCount',
    sortable: true,
  },
  {
    colName: '1 month',
    colWidth: 170,
    col: 'thirtyCount',
    type: 'activityCount',
    sortable: true,
  },
  {
    colName: '2 months',
    colWidth: 160,
    col: 'sixtyCount',
    type: 'activityCount',
    sortable: true,
  },
  {
    colName: '3 months',
    colWidth: 135,
    col: 'ninetyCount',
    type: 'activityCount',
    sortable: true,
  },
];

export const CurrentJobSAndCandidatesColumns = [
  {
    colName: 'userName',
    colWidth: 180,
    col: 'userName',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'job',
    colWidth: 200,
    col: 'jobCount',
    type: 'currentJobCount',
    sortable: true,
  },
  {
    colName: 'candidate',
    colWidth: 200,
    col: 'talentCount',
    type: 'currentTalentCount',
    sortable: true,
  },
];

export const StoppedJobColumns = [
  {
    colName: 'AMName',
    colWidth: 180,
    col: 'am',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Division(Office)',
    colWidth: 300,
    col: 'division',
    sortable: true,
  },
  {
    colName: 'Team',
    colWidth: 300,
    col: 'team',
    sortable: true,
  },
  {
    colName: 'totalCount',
    colWidth: 200,
    col: 'count',
    type: 'stoppedJobCount',
    sortable: true,
  },
];

export const StoppedCandidateColumns = [
  {
    colName: 'userName',
    colWidth: 180,
    col: 'recruiter',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Division(Office)',
    colWidth: 300,
    col: 'division',
    sortable: true,
  },
  {
    colName: 'Team',
    colWidth: 300,
    col: 'team',
    sortable: true,
  },
  {
    colName: 'totalCount',
    colWidth: 200,
    col: 'count',
    type: 'stoppedCandidateCount',
    sortable: true,
  },
];

export const SalesReport = [
  {
    colName: 'Candidate',
    colWidth: 200,
    col: 'talentName',
    type: 'talentNameLink',
    fixed: true,
    sortable: true,
  },
  {
    colName: 'Job Title',
    colWidth: 150,
    col: 'jobTitle',
    type: 'jobLink',
    sortable: false,
  },
  {
    colName: 'Company',
    colWidth: 150,
    col: 'company',
    sortable: true,
  },
  {
    colName: 'Status',
    colWidth: 150,
    col: 'status',
    sortable: true,
  },
  {
    colName: 'Type',
    colWidth: 180,
    col: 'positionType',
    sortable: true,
    type: 'jobType',
  },
  {
    colName: 'AM',
    colWidth: 150,
    col: 'am',
    sortable: false,
  },
  {
    colName: 'Recruiter',
    colWidth: 150,
    col: 'recruiters',
    sortable: false,
  },
  {
    colName: 'Sourcer',
    colWidth: 150,
    col: 'sourcers',
    sortable: false,
  },
  {
    colName: 'Start Date',
    colWidth: 150,
    col: 'startDate',
    sortable: true,
  },
  {
    colName: 'Est. End Date',
    colWidth: 130,
    col: 'endDate',
    sortable: false,
  },
  {
    colName: 'GM',
    colWidth: 150,
    col: 'totalBillAmount',
    sortable: true,
  },
  {
    colName: 'Revenue',
    colWidth: 150,
    col: 'revenue',
    sortable: true,
  },
  {
    colName: 'GM/Revenue',
    colWidth: 140,
    col: 'percentageOfGmRevenue',
    sortable: false,
  },
];

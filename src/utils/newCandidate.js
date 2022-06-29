export const columns1 = [
  {
    colName: 'Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    fixed: true,
    sortable: true,
    type: 'name',
    field: 'name',
    placeholder: 'Enter a Name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Email',
    colWidth: 200,
    flexGrow: 3,
    col: 'email',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'email',
    placeholder: 'Enter a email',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Phone',
    colWidth: 200,
    flexGrow: 3,
    col: 'phone',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'phone',
    placeholder: 'Enter a phone number',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Industries',
    colWidth: 200,
    flexGrow: 3,
    col: 'industries',
    fixed: true,
    sortable: true,
    type: 'treeSelect',
    field: 'industries',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'jobFunctionTree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Current Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'currentLocation',
    placeholder: 'Enter a city/state/country name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'languages',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'languages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Current Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'currentSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Work Authorization',
    colWidth: 200,
    flexGrow: 3,
    col: 'workAuthorization',
    fixed: true,
    sortable: true,
    type: 'workAuth',
    field: 'workAuthorization',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'experience',
    fixed: true,
    sortable: true,
    type: 'experience',
    field: 'experience',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Current Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentJobTitle',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'currentJobTitle',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a job title',
  },
  {
    colName: 'Current Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentCompany',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'currentCompany',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'skills',
    andOr: 'both',
    changeAndOr: true,
  },
];
export const columns2 = [
  {
    colName: 'Preferred Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'preferredSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Preferred Locations',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'preferredLocation',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a city/state/country name',
  },
  {
    colName: 'School',
    colWidth: 200,
    flexGrow: 3,
    col: 'School',
    fixed: true,
    sortable: true,
    type: 'schoolInput',
    field: 'School',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a school name',
  },
  {
    colName: 'Major',
    colWidth: 200,
    flexGrow: 3,
    col: 'major',
    fixed: true,
    sortable: true,
    type: 'majorInput',
    field: 'major',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a major name',
  },
  {
    colName: 'Degrees',
    colWidth: 200,
    flexGrow: 3,
    col: 'degrees',
    fixed: true,
    sortable: true,
    type: 'selects1',
    field: 'degrees',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Create by',
    colWidth: 200,
    flexGrow: 3,
    col: 'createBy',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'createBy',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Recruiter',
    colWidth: 200,
    flexGrow: 3,
    col: 'recruiter',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'recruiter',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Candidate ID',
    colWidth: 200,
    flexGrow: 3,
    col: 'candidateId',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'candidateId',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a candidate ID',
  },
  {
    colName: 'Date of Creation',
    colWidth: 200,
    flexGrow: 3,
    col: 'dateOfCreation',
    fixed: true,
    sortable: true,
    type: 'time',
    field: 'dateOfCreation',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Owner',
    colWidth: 200,
    flexGrow: 3,
    col: 'owner',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'owner',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'DM',
    colWidth: 200,
    flexGrow: 3,
    col: 'dm',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'dm',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'AM',
    colWidth: 200,
    flexGrow: 3,
    col: 'am',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'am',
    andOr: 'or',
    changeAndOr: false,
  },
];

export const columns = [
  {
    colName: 'Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    fixed: true,
    sortable: true,
    type: 'name',
    field: 'name',
    placeholder: 'Enter a Name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Email',
    colWidth: 200,
    flexGrow: 3,
    col: 'email',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'email',
    placeholder: 'Enter a email',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Phone',
    colWidth: 200,
    flexGrow: 3,
    col: 'phone',
    fixed: true,
    sortable: true,
    type: 'input',
    field: 'phone',
    placeholder: 'Enter a phone number',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Industries',
    colWidth: 200,
    flexGrow: 3,
    col: 'industries',
    fixed: true,
    sortable: true,
    type: 'treeSelect',
    field: 'industries',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'jobFunctionTree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Current Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'currentLocation',
    placeholder: 'Enter a city/state/country name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'languages',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'languages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Current Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'currentSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Work Authorization',
    colWidth: 200,
    flexGrow: 3,
    col: 'workAuthorization',
    fixed: true,
    sortable: true,
    type: 'workAuth',
    field: 'workAuthorization',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'experience',
    fixed: true,
    sortable: true,
    type: 'experience',
    field: 'experience',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Current Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentJobTitle',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'currentJobTitle',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a job title',
  },
  {
    colName: 'Current Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentCompany',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'currentCompany',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'skills',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Preferred Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'preferredSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Preferred Locations',
    colWidth: 200,
    flexGrow: 3,
    col: 'preferredLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'preferredLocation',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a city/state/country name',
  },
  {
    colName: 'School',
    colWidth: 200,
    flexGrow: 3,
    col: 'School',
    fixed: true,
    sortable: true,
    type: 'schoolInput',
    field: 'School',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a school name',
  },
  {
    colName: 'Major',
    colWidth: 200,
    flexGrow: 3,
    col: 'major',
    fixed: true,
    sortable: true,
    type: 'majorInput',
    field: 'major',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a major name',
  },
  {
    colName: 'Degrees',
    colWidth: 200,
    flexGrow: 3,
    col: 'degrees',
    fixed: true,
    sortable: true,
    type: 'selects1',
    field: 'degrees',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Create by',
    colWidth: 200,
    flexGrow: 3,
    col: 'createBy',
    fixed: true,
    sortable: true,
    type: 'selects',
    field: 'createBy',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Recruiter',
    colWidth: 200,
    flexGrow: 3,
    col: 'recruiter',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'recruiter',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Candidate ID',
    colWidth: 200,
    flexGrow: 3,
    col: 'candidateId',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'candidateId',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a candidate ID',
  },
  {
    colName: 'Date of Creation',
    colWidth: 200,
    flexGrow: 3,
    col: 'dateOfCreation',
    fixed: true,
    sortable: true,
    type: 'time',
    field: 'dateOfCreation',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Owner',
    colWidth: 200,
    flexGrow: 3,
    col: 'owner',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'owner',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'DM',
    colWidth: 200,
    flexGrow: 3,
    col: 'dm',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'dm',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'AM',
    colWidth: 200,
    flexGrow: 3,
    col: 'am',
    fixed: true,
    sortable: true,
    type: 'selects2',
    field: 'am',
    andOr: 'or',
    changeAndOr: false,
  },
];

export const commonPoolColumns = [
  {
    colName: 'Name',
    colWidth: 200,
    flexGrow: 3,
    col: 'name',
    fixed: true,
    sortable: true,
    type: 'name',
    field: 'name',
    placeholder: 'Enter a Name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Industries',
    colWidth: 200,
    flexGrow: 3,
    col: 'industries',
    fixed: true,
    sortable: true,
    type: 'treeSelect',
    field: 'industries',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Job Function',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
    fixed: true,
    sortable: true,
    type: 'jobFunctionTree',
    field: 'jobFunctions',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Current Location',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentLocation',
    fixed: true,
    sortable: true,
    type: 'Location',
    field: 'currentLocation',
    placeholder: 'Enter a city/state/country name',
    andOr: 'or',
    changeAndOr: false,
  },
  {
    colName: 'Languages',
    colWidth: 200,
    flexGrow: 3,
    col: 'languages',
    fixed: true,
    sortable: true,
    type: 'skillSelect',
    field: 'languages',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'Current Salary',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentSalary',
    fixed: true,
    sortable: true,
    type: 'salary',
    field: 'currentSalary',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Experience',
    colWidth: 200,
    flexGrow: 3,
    col: 'experience',
    fixed: true,
    sortable: true,
    type: 'experience',
    field: 'experience',
    andOr: 'na',
    changeAndOr: false,
  },
  {
    colName: 'Current Job Title',
    colWidth: 200,
    flexGrow: 3,
    col: 'currentJobTitle',
    fixed: true,
    sortable: true,
    type: 'inputs',
    field: 'currentJobTitle',
    andOr: 'and',
    changeAndOr: false,
    placeholder: 'Enter a job title',
  },
  {
    colName: 'Company',
    colWidth: 200,
    flexGrow: 3,
    col: 'Company',
    fixed: true,
    sortable: true,
    type: 'company',
    field: 'Current Company',
    andOr: 'and',
    changeAndOr: false,
  },
  {
    colName: 'Skills',
    colWidth: 200,
    flexGrow: 3,
    col: 'skills',
    fixed: true,
    sortable: true,
    type: 'skill',
    field: 'skills',
    andOr: 'both',
    changeAndOr: true,
  },
  {
    colName: 'School',
    colWidth: 200,
    flexGrow: 3,
    col: 'School',
    fixed: true,
    sortable: true,
    type: 'schoolInput',
    field: 'School',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a school name',
  },
  {
    colName: 'Major',
    colWidth: 200,
    flexGrow: 3,
    col: 'major',
    fixed: true,
    sortable: true,
    type: 'majorInput',
    field: 'major',
    andOr: 'or',
    changeAndOr: false,
    placeholder: 'Enter a major name',
  },
  {
    colName: 'Degrees',
    colWidth: 200,
    flexGrow: 3,
    col: 'degrees',
    fixed: true,
    sortable: true,
    type: 'selects1',
    field: 'degrees',
    andOr: 'or',
    changeAndOr: false,
  },
];
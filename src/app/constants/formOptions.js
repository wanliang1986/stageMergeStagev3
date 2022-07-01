/**
 * Created by zitengli on 5/26/17.
 */
import memoizeOne from 'memoize-one';
import moment from 'moment-timezone';

export const userCountryList = [
  { value: 'China -- CN', label: 'China' },
  { value: 'Canada -- CA', label: 'Canada' },
  { value: 'United States -- US', label: 'United States' },
  { value: 'United Kingdom -- GB', label: 'United Kingdom' },
];

export const contactCategoryList = [
  { value: 'HIRING_MANAGER', label: 'Hiring Manager' },
  { value: 'HR_CONTACT', label: 'Hr Contact' },
];
export const jobUserRoles = [
  { value: 'AM', label: 'Account Manager' },
  { value: 'AC', label: 'Account Coordinator' },
  { value: 'DELIVERY_MANAGER', label: 'Delivery Manager' },
  { value: 'RECRUITER', label: 'Recruiter' },
  { value: 'PRIMARY_RECRUITER', label: 'Primary Recruiter' },
];
export const JOB_USER_ROLES = {
  AccountManager: 'AM',
  AccountCoordinator: 'AC',
  DeliveryManager: 'DELIVERY_MANAGER',
  Recruiter: 'RECRUITER',
  PrimaryRecruiter: 'PRIMARY_RECRUITER',
};
export const countryList = [
  //https://datahub.io/core/country-list
  // { value: 'Afghanistan -- AF', label: 'Afghanistan' },
  { value: 'Åland Islands -- AX', label: 'Åland Islands' },
  { value: 'Albania -- AL', label: 'Albania' },
  // { value: 'Algeria -- DZ', label: 'Algeria' },
  // { value: 'American Samoa -- AS', label: 'American Samoa' },
  { value: 'Andorra -- AD', label: 'Andorra' },
  // { value: 'Angola -- AO', label: 'Angola' },
  // { value: 'Anguilla -- AI', label: 'Anguilla' },
  // { value: 'Antarctica -- AQ', label: 'Antarctica' },
  // { value: 'Antigua and Barbuda -- AG', label: 'Antigua and Barbuda' },
  { value: 'Argentina -- AR', label: 'Argentina' },
  // { value: 'Armenia -- AM', label: 'Armenia' },
  // { value: 'Aruba -- AW', label: 'Aruba' },
  // { value: 'Australia -- AU', label: 'Australia' },
  { value: 'Austria -- AT', label: 'Austria' },
  // { value: 'Azerbaijan -- AZ', label: 'Azerbaijan' },
  // { value: 'Bahamas -- BS', label: 'Bahamas' },
  // { value: 'Bahrain -- BH', label: 'Bahrain' },
  { value: 'Bangladesh -- BD', label: 'Bangladesh' },
  // { value: 'Barbados -- BB', label: 'Barbados' },
  { value: 'Belarus -- BY', label: 'Belarus' },
  { value: 'Belgium -- BE', label: 'Belgium' },
  // { value: 'Belize -- BZ', label: 'Belize' },
  // { value: 'Benin -- BJ', label: 'Benin' },
  // { value: 'Bermuda -- BM', label: 'Bermuda' },
  // { value: 'Bhutan -- BT', label: 'Bhutan' },
  // {
  //   value: 'Bolivia, Plurinational State of -- BO',
  //   label: 'Bolivia, Plurinational State of'
  // },
  // {
  //   value: 'Bonaire, Sint Eustatius and Saba -- BQ',
  //   label: 'Bonaire, Sint Eustatius and Saba'
  // },
  // { value: 'Bosnia and Herzegovina -- BA', label: 'Bosnia and Herzegovina' },
  // { value: 'Botswana -- BW', label: 'Botswana' },
  // { value: 'Bouvet Island -- BV', label: 'Bouvet Island' },
  // { value: 'Brazil -- BR', label: 'Brazil' },
  {
    value: 'British Indian Ocean Territory -- IO',
    label: 'British Indian Ocean Territory',
  },
  // { value: 'Brunei Darussalam -- BN', label: 'Brunei Darussalam' },
  { value: 'Bulgaria -- BG', label: 'Bulgaria' },
  // { value: 'Burkina Faso -- BF', label: 'Burkina Faso' },
  // { value: 'Burundi -- BI', label: 'Burundi' },
  // { value: 'Cambodia -- KH', label: 'Cambodia' },
  // { value: 'Cameroon -- CM', label: 'Cameroon' },
  { value: 'Canada -- CA', label: 'Canada' },
  // { value: 'Cape Verde -- CV', label: 'Cape Verde' },
  // { value: 'Cayman Islands -- KY', label: 'Cayman Islands' },
  // {
  //   value: 'Central African Republic -- CF',
  //   label: 'Central African Republic'
  // },
  // { value: 'Chad -- TD', label: 'Chad' },
  // { value: 'Chile -- CL', label: 'Chile' },
  { value: 'China -- CN', label: 'China', priority: 1 },
  // { value: 'Christmas Island -- CX', label: 'Christmas Island' },
  // { value: 'Cocos (Keeling) Islands -- CC', label: 'Cocos (Keeling) Islands' },
  // { value: 'Colombia -- CO', label: 'Colombia' },
  // { value: 'Comoros -- KM', label: 'Comoros' },
  // { value: 'Congo -- CG', label: 'Congo' },
  // {
  //   value: 'Congo, the Democratic Republic of the -- CD',
  //   label: 'Congo, the Democratic Republic of the'
  // },
  // { value: 'Cook Islands -- CK', label: 'Cook Islands' },
  // { value: 'Costa Rica -- CR', label: 'Costa Rica' },
  // { value: "Côte d'Ivoire -- CI", label: "Côte d'Ivoire" },
  // { value: 'Croatia -- HR', label: 'Croatia' },
  // { value: 'Cuba -- CU', label: 'Cuba' },
  // { value: 'Curaçao -- CW', label: 'Curaçao' },
  { value: 'Cyprus -- CY', label: 'Cyprus' },
  // { value: 'Czech Republic -- CZ', label: 'Czech Republic' },
  { value: 'Denmark -- DK', label: 'Denmark' },
  // { value: 'Djibouti -- DJ', label: 'Djibouti' },
  // { value: 'Dominica -- DM', label: 'Dominica' },
  // { value: 'Dominican Republic -- DO', label: 'Dominican Republic' },
  // { value: 'Ecuador -- EC', label: 'Ecuador' },
  // { value: 'Egypt -- EG', label: 'Egypt' },
  // { value: 'El Salvador -- SV', label: 'El Salvador' },
  // { value: 'Equatorial Guinea -- GQ', label: 'Equatorial Guinea' },
  // { value: 'Eritrea -- ER', label: 'Eritrea' },
  { value: 'Estonia -- EE', label: 'Estonia' },
  // { value: 'Ethiopia -- ET', label: 'Ethiopia' },
  // {
  //   value: 'Falkland Islands (Malvinas) -- FK',
  //   label: 'Falkland Islands (Malvinas)'
  // },
  { value: 'Faroe Islands -- FO', label: 'Faroe Islands' },
  // { value: 'Fiji -- FJ', label: 'Fiji' },
  { value: 'Finland -- FI', label: 'Finland' },
  { value: 'France -- FR', label: 'France' },
  // { value: 'French Guiana -- GF', label: 'French Guiana' },
  // { value: 'French Polynesia -- PF', label: 'French Polynesia' },
  // {
  //   value: 'French Southern Territories -- TF',
  //   label: 'French Southern Territories'
  // },
  // { value: 'Gabon -- GA', label: 'Gabon' },
  // { value: 'Gambia -- GM', label: 'Gambia' },
  // { value: 'Georgia -- GE', label: 'Georgia' },
  { value: 'Germany -- DE', label: 'Germany' },
  // { value: 'Ghana -- GH', label: 'Ghana' },
  { value: 'Gibraltar -- GI', label: 'Gibraltar' },
  { value: 'Greece -- GR', label: 'Greece' },
  // { value: 'Greenland -- GL', label: 'Greenland' },
  // { value: 'Grenada -- GD', label: 'Grenada' },
  // { value: 'Guadeloupe -- GP', label: 'Guadeloupe' },
  // { value: 'Guam -- GU', label: 'Guam' },
  // { value: 'Guatemala -- GT', label: 'Guatemala' },
  { value: 'Guernsey -- GG', label: 'Guernsey' },
  // { value: 'Guinea -- GN', label: 'Guinea' },
  // { value: 'Guinea-Bissau -- GW', label: 'Guinea-Bissau' },
  // { value: 'Guyana -- GY', label: 'Guyana' },
  // { value: 'Haiti -- HT', label: 'Haiti' },
  // {
  //   value: 'Heard Island and McDonald Islands -- HM',
  //   label: 'Heard Island and McDonald Islands'
  // },
  {
    value: 'Holy See (Vatican City State) -- VA',
    label: 'Holy See (Vatican City State)',
  },
  // { value: 'Honduras -- HN', label: 'Honduras' },
  // { value: 'Hong Kong -- HK', label: 'Hong Kong' },
  { value: 'Hungary -- HU', label: 'Hungary' },
  { value: 'Iceland -- IS', label: 'Iceland' },
  // { value: 'India -- IN', label: 'India' },
  // { value: 'Indonesia -- ID', label: 'Indonesia' },
  // {
  //   value: 'Iran, Islamic Republic of -- IR',
  //   label: 'Iran, Islamic Republic of'
  // },
  // { value: 'Iraq -- IQ', label: 'Iraq' },
  { value: 'Ireland -- IE', label: 'Ireland' },
  { value: 'Isle of Man -- IM', label: 'Isle of Man' },
  // { value: 'Israel -- IL', label: 'Israel' },
  { value: 'Italy -- IT', label: 'Italy' },
  // { value: 'Jamaica -- JM', label: 'Jamaica' },
  // { value: 'Japan -- JP', label: 'Japan' },
  { value: 'Jersey -- JE', label: 'Jersey' },
  // { value: 'Jordan -- JO', label: 'Jordan' },
  // { value: 'Kazakhstan -- KZ', label: 'Kazakhstan' },
  // { value: 'Kenya -- KE', label: 'Kenya' },
  // { value: 'Kiribati -- KI', label: 'Kiribati' },
  // {
  //   value: "Korea, Democratic People's Republic of -- KP",
  //   label: "Korea, Democratic People's Republic of"
  // },
  // { value: 'Korea, Republic of -- KR', label: 'Korea, Republic of' },
  // { value: 'Kuwait -- KW', label: 'Kuwait' },
  // { value: 'Kyrgyzstan -- KG', label: 'Kyrgyzstan' },
  // {
  //   value: "Lao People's Democratic Republic -- LA",
  //   label: "Lao People's Democratic Republic"
  // },
  { value: 'Latvia -- LV', label: 'Latvia' },
  // { value: 'Lebanon -- LB', label: 'Lebanon' },
  // { value: 'Lesotho -- LS', label: 'Lesotho' },
  // { value: 'Liberia -- LR', label: 'Liberia' },
  // { value: 'Libya -- LY', label: 'Libya' },
  { value: 'Liechtenstein -- LI', label: 'Liechtenstein' },
  { value: 'Lithuania -- LT', label: 'Lithuania' },
  { value: 'Luxembourg -- LU', label: 'Luxembourg' },
  // { value: 'Macao -- MO', label: 'Macao' },
  {
    value: 'Macedonia, the Former Yugoslav Republic of -- MK',
    label: 'Macedonia, the Former Yugoslav Republic of',
  },
  // { value: 'Madagascar -- MG', label: 'Madagascar' },
  // { value: 'Malawi -- MW', label: 'Malawi' },
  // { value: 'Malaysia -- MY', label: 'Malaysia' },
  // { value: 'Maldives -- MV', label: 'Maldives' },
  // { value: 'Mali -- ML', label: 'Mali' },
  { value: 'Malta -- MT', label: 'Malta' },
  // { value: 'Marshall Islands -- MH', label: 'Marshall Islands' },
  // { value: 'Martinique -- MQ', label: 'Martinique' },
  // { value: 'Mauritania -- MR', label: 'Mauritania' },
  // { value: 'Mauritius -- MU', label: 'Mauritius' },
  // { value: 'Mayotte -- YT', label: 'Mayotte' },
  { value: 'Mexico -- MX', label: 'Mexico' },
  // {
  //   value: 'Micronesia, Federated States of -- FM',
  //   label: 'Micronesia, Federated States of'
  // },
  { value: 'Moldova, Republic of -- MD', label: 'Moldova, Republic of' },
  { value: 'Monaco -- MC', label: 'Monaco' },
  // { value: 'Mongolia -- MN', label: 'Mongolia' },
  { value: 'Montenegro -- ME', label: 'Montenegro' },
  // { value: 'Montserrat -- MS', label: 'Montserrat' },
  // { value: 'Morocco -- MA', label: 'Morocco' },
  // { value: 'Mozambique -- MZ', label: 'Mozambique' },
  // { value: 'Myanmar -- MM', label: 'Myanmar' },
  // { value: 'Namibia -- NA', label: 'Namibia' },
  // { value: 'Nauru -- NR', label: 'Nauru' },
  // { value: 'Nepal -- NP', label: 'Nepal' },
  { value: 'Netherlands -- NL', label: 'Netherlands' },
  // { value: 'New Caledonia -- NC', label: 'New Caledonia' },
  // { value: 'New Zealand -- NZ', label: 'New Zealand' },
  // { value: 'Nicaragua -- NI', label: 'Nicaragua' },
  // { value: 'Niger -- NE', label: 'Niger' },
  // { value: 'Nigeria -- NG', label: 'Nigeria' },
  // { value: 'Niue -- NU', label: 'Niue' },
  // { value: 'Norfolk Island -- NF', label: 'Norfolk Island' },
  // {
  //   value: 'Northern Mariana Islands -- MP',
  //   label: 'Northern Mariana Islands'
  // },
  { value: 'Norway -- NO', label: 'Norway' },
  // { value: 'Oman -- OM', label: 'Oman' },
  // { value: 'Pakistan -- PK', label: 'Pakistan' },
  // { value: 'Palau -- PW', label: 'Palau' },
  // { value: 'Palestine, State of -- PS', label: 'Palestine, State of' },
  { value: 'Panama -- PA', label: 'Panama' },
  // { value: 'Papua New Guinea -- PG', label: 'Papua New Guinea' },
  // { value: 'Paraguay -- PY', label: 'Paraguay' },
  // { value: 'Peru -- PE', label: 'Peru' },
  // { value: 'Philippines -- PH', label: 'Philippines' },
  // { value: 'Pitcairn -- PN', label: 'Pitcairn' },
  { value: 'Poland -- PL', label: 'Poland' },
  { value: 'Portugal -- PT', label: 'Portugal' },
  // { value: 'Puerto Rico -- PR', label: 'Puerto Rico' },
  // { value: 'Qatar -- QA', label: 'Qatar' },
  // { value: 'Réunion -- RE', label: 'Réunion' },
  { value: 'Romania -- RO', label: 'Romania' },
  // { value: 'Russian Federation -- RU', label: 'Russian Federation' },
  // { value: 'Rwanda -- RW', label: 'Rwanda' },
  // { value: 'Saint Barthélemy -- BL', label: 'Saint Barthélemy' },
  // {
  //   value: 'Saint Helena, Ascension and Tristan da Cunha -- SH',
  //   label: 'Saint Helena, Ascension and Tristan da Cunha'
  // },
  // { value: 'Saint Kitts and Nevis -- KN', label: 'Saint Kitts and Nevis' },
  // { value: 'Saint Lucia -- LC', label: 'Saint Lucia' },
  // {
  //   value: 'Saint Martin (French part) -- MF',
  //   label: 'Saint Martin (French part)'
  // },
  // {
  //   value: 'Saint Pierre and Miquelon -- PM',
  //   label: 'Saint Pierre and Miquelon'
  // },
  // {
  //   value: 'Saint Vincent and the Grenadines -- VC',
  //   label: 'Saint Vincent and the Grenadines'
  // },
  // { value: 'Samoa -- WS', label: 'Samoa' },
  // { value: 'San Marino -- SM', label: 'San Marino' },
  // { value: 'Sao Tome and Principe -- ST', label: 'Sao Tome and Principe' },
  // { value: 'Saudi Arabia -- SA', label: 'Saudi Arabia' },
  // { value: 'Senegal -- SN', label: 'Senegal' },
  { value: 'Serbia -- RS', label: 'Serbia' },
  // { value: 'Seychelles -- SC', label: 'Seychelles' },
  // { value: 'Sierra Leone -- SL', label: 'Sierra Leone' },
  { value: 'Singapore -- SG', label: 'Singapore' },
  // {
  //   value: 'Sint Maarten (Dutch part) -- SX',
  //   label: 'Sint Maarten (Dutch part)'
  // },
  { value: 'Slovakia -- SK', label: 'Slovakia' },
  // { value: 'Slovenia -- SI', label: 'Slovenia' },
  // { value: 'Solomon Islands -- SB', label: 'Solomon Islands' },
  // { value: 'Somalia -- SO', label: 'Somalia' },
  // { value: 'South Africa -- ZA', label: 'South Africa' },
  // {
  //   value: 'South Georgia and the South Sandwich Islands -- GS',
  //   label: 'South Georgia and the South Sandwich Islands'
  // },
  // { value: 'South Sudan -- SS', label: 'South Sudan' },
  { value: 'Spain -- ES', label: 'Spain' },
  // { value: 'Sri Lanka -- LK', label: 'Sri Lanka' },
  // { value: 'Sudan -- SD', label: 'Sudan' },
  // { value: 'Suriname -- SR', label: 'Suriname' },
  {
    value: 'Svalbard and Jan Mayen -- SJ',
    label: 'Svalbard and Jan Mayen',
  },
  // { value: 'Swaziland -- SZ', label: 'Swaziland' },
  { value: 'Sweden -- SE', label: 'Sweden' },
  { value: 'Switzerland -- CH', label: 'Switzerland' },
  // { value: 'Syrian Arab Republic -- SY', label: 'Syrian Arab Republic' },
  // {
  //   value: 'Taiwan, Province of China -- TW',
  //   label: 'Taiwan, Province of China'
  // },
  // { value: 'Tajikistan -- TJ', label: 'Tajikistan' },
  // {
  //   value: 'Tanzania, United Republic of -- TZ',
  //   label: 'Tanzania, United Republic of'
  // },
  // { value: 'Thailand -- TH', label: 'Thailand' },
  // { value: 'Timor-Leste -- TL', label: 'Timor-Leste' },
  // { value: 'Togo -- TG', label: 'Togo' },
  // { value: 'Tokelau -- TK', label: 'Tokelau' },
  // { value: 'Tonga -- TO', label: 'Tonga' },
  // { value: 'Trinidad and Tobago -- TT', label: 'Trinidad and Tobago' },
  // { value: 'Tunisia -- TN', label: 'Tunisia' },
  // { value: 'Turkey -- TR', label: 'Turkey' },
  // { value: 'Turkmenistan -- TM', label: 'Turkmenistan' },
  // {
  //   value: 'Turks and Caicos Islands -- TC',
  //   label: 'Turks and Caicos Islands'
  // },
  // { value: 'Tuvalu -- TV', label: 'Tuvalu' },
  // { value: 'Uganda -- UG', label: 'Uganda' },
  { value: 'Ukraine -- UA', label: 'Ukraine' },
  // { value: 'United Arab Emirates -- AE', label: 'United Arab Emirates' },
  { value: 'United Kingdom -- GB', label: 'United Kingdom', priority: 1 },
  { value: 'United States -- US', label: 'United States', priority: 1 },
  // {
  //   value: 'United States Minor Outlying Islands -- UM',
  //   label: 'United States Minor Outlying Islands'
  // },
  // { value: 'Uruguay -- UY', label: 'Uruguay' },
  // { value: 'Uzbekistan -- UZ', label: 'Uzbekistan' },
  // { value: 'Vanuatu -- VU', label: 'Vanuatu' },
  // {
  //   value: 'Venezuela, Bolivarian Republic of -- VE',
  //   label: 'Venezuela, Bolivarian Republic of'
  // },
  // { value: 'Viet Nam -- VN', label: 'Viet Nam' },
  // { value: 'Virgin Islands, British -- VG', label: 'Virgin Islands, British' },
  // { value: 'Virgin Islands, U.S. -- VI', label: 'Virgin Islands, U.S.' },
  // { value: 'Wallis and Futuna -- WF', label: 'Wallis and Futuna' },
  // { value: 'Western Sahara -- EH', label: 'Western Sahara' },
  // { value: 'Yemen -- YE', label: 'Yemen' },
  // { value: 'Zambia -- ZM', label: 'Zambia' },
  // { value: 'Zimbabwe -- ZW', label: 'Zimbabwe' }C
];

export const jobType = [
  { value: 'CONTRACT', label: 'General Staffing (Contract)' },
  { value: 'FULL_TIME', label: 'General Recruiting (FTE)' },
  { value: 'PAY_ROLL', label: 'Payrolling' },
];

export const AMJobType = [
  { value: 'CONTRACT', label: 'General Staffing (Contract)' },
  { value: 'FULL_TIME', label: 'General Recruiting (FTE)' },
];
export const JOB_TYPES = {
  FullTime: 'FULL_TIME',
  Contract: 'CONTRACT',
  Payrolling: 'PAY_ROLL',
};
let jobTypeMap = null;
export const getJobTypeLabel = (type) => {
  if (!jobTypeMap) {
    jobTypeMap = jobType.reduce((res, type) => {
      res[type.value] = type.label;
      return res;
    }, {});
  }
  return jobTypeMap[type];
};

export const jobStatus = [
  { value: 'OPEN', label: 'Open' },
  { value: 'REOPENED', label: 'Reopen' },
  { value: 'FILLED', label: 'Filled' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'ONHOLD', label: 'Onhold' },
  { value: 'NO_STATUS', label: 'No_status', disabled: true },
  { value: 'EXPIRED', label: 'EXPIRED', disabled: true },
  { value: 'IGNORED', label: 'IGNORED', disabled: true },
];

////////new clients
/////componies 状态搜索
export const componiesStatus = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'InActive' },
];

//// Account Progress
export const accountProgress = [
  { value: 0, label: '0%' },
  { value: 0.25, label: '25%' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
];

export const accountProgressList = [
  { value: '0%', label: '0%' },
  { value: '25%', label: '25%' },
  { value: '50%', label: '50%' },
  { value: '75%', label: '75%' },
];

////Potential Service Type
export const potentialServiceType = [
  { value: 'Recruiting', label: 'Recruiting' },
  { value: 'Contracting', label: 'Contracting' },
  { value: 'SOW', label: 'SOW' },
  { value: 'FLAG Training', label: 'FLAG Training' },
  { value: 'Payroll', label: 'Payroll' },
  { value: 'Management Consulting', label: 'Management Consulting' },
  { value: 'SVLC & Thinktank', label: 'SVLC & Thinktank' },
  { value: 'Campus Recruiting', label: 'Campus Recruiting' },
  { value: 'Internship', label: 'Internship' },
  { value: 'HiTalent Software', label: 'HiTalent Software' },
  { value: 'RPO', label: 'RPO' },
];
/////

export const jobPriority = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'LOW', label: 'Low' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export const tag = [
  { value: '1', label: 'OT' },
  { value: '2', label: 'References' },
  { value: '3', label: 'Travel' },
  { value: '4', label: 'Drug Test' },
  { value: '5', label: 'Background Check' },
  { value: '6', label: 'Security Clearance' },
];

export const expLevel = [
  { value: 'FRESH_GRADUATE', label: 'Fresh Graduate' },
  { value: 'LESS_THAN_THREE_YEARS', label: 'Less then 3 years' },
  { value: 'THREE_TO_FIVE_YEARS', label: '3-5 years' },
  { value: 'FIVE_TO_EIGHT_YEARS', label: '5-8 years' },
  { value: 'MORE_THAN_EIGHT_YEARS', label: 'More then 8 years' },
];

export const currency = [
  { value: 'USD', label: '$', label2: 'USD - $', label3: 'USA-USD（US$）' },
  { value: 'CNY', label: '￥', label2: 'CNY -￥', label3: 'CHN-CNY（¥）' },
  { value: 'CAD', label: '$', label2: 'CAD - $', label3: 'CAN-CAD（C$）' },
  { value: 'EUR', label: '€', label2: 'EUR - €', label3: 'EU-EUR（€）' },
  { value: 'GBP', label: '£', label2: 'GBP - £', label3: 'UK-GBP（£）' },
];

export const preferredDegrees = [
  { value: 'POSTDOC', label: 'POSTDOC' },
  { value: 'MD', label: 'MD' },
  { value: 'PHD', label: 'PHD' },
  { value: 'JD', label: 'JD' },
  { value: 'MBA', label: 'MBA' },
  { value: 'MASTER', label: 'MASTER' },
  { value: 'ASSOCIATE', label: 'ASSOCIATE' },
  { value: 'BACHELOR', label: 'BACHELOR' },
  { value: 'HIGH_SCHOOL', label: 'HIGH_SCHOOL' },
  { value: 'GRADUATE_ONGOING', label: 'GRADUATE_ONGOING' },
  { value: 'UNDERGRADUATE_ONGOING', label: 'UNDERGRADUATE_ONGOING' },
  { value: 'NANODEGREE', label: 'NANODEGREE' },
];

export const notePriority = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'HIGH', label: 'High' },
];

export const activityStatus = [
  { value: 'Submitted', label: 'Submitted to Client' }, //5

  // { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
  { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' }, //7
  { value: 'Interview', label: 'Interview' }, //8

  // { value: 'Client_Rejected', label: 'Rejected by Client' }, //9
  { value: 'Offered', label: 'Offered by Client' }, //10

  // { value: 'Offer_Rejected', label: 'Offer Declined' }, //11
  { value: 'Offer_Accepted', label: 'Offer Accepted' },
];

export const activityStatus1 = [
  { value: 'Applied', label: 'Submitted to AM' },
  { value: 'Submitted', label: 'Submitted to Client' }, //5

  // { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
  // { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' }, //7
  { value: 'Interview', label: 'Interview' }, //8

  // { value: 'Client_Rejected', label: 'Rejected by Client' }, //9
  { value: 'Offered', label: 'Offered by Client' }, //10

  // { value: 'Offer_Rejected', label: 'Offer Declined' }, //11
  { value: 'Offer_Accepted', label: 'Offer Accepted' },
  { value: 'Started', label: 'On boarded' },
  // { value: 'START_TERMINATED', label: 'Terminated' },
  // { value: 'START_EXTENSION', label: 'Extension' },
];

export const applicationStatus = [
  // {value: 'Watching', label: 'Watching'},
  { value: 'Applied', label: 'Submitted to AM' }, //0
  { value: 'Called_Candidate', label: 'Called Candidate' }, //1
  { value: 'Meet_Candidate_In_Person', label: 'Meet Candidate In Person' }, //2
  { value: 'Internal_Rejected', label: 'Rejected by AM' }, //3
  { value: 'Qualified', label: 'Qualified by AM' }, //4
  { value: 'Submitted', label: 'Submitted to Client' }, //5

  { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
  { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' }, //7
  { value: 'Interview', label: 'Interview' }, //8

  { value: 'Client_Rejected', label: 'Rejected by Client' }, //9
  { value: 'Offered', label: 'Offered by Client' }, //10

  { value: 'Offer_Rejected', label: 'Offer Declined' }, //11
  { value: 'Offer_Accepted', label: 'Offer Accepted' }, //12

  { value: 'Started', label: 'On boarded' }, //13

  { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14

  { value: 'START_TERMINATED', label: 'Terminated' },
  { value: 'START_EXTENSION', label: 'Extension' },
  { value: 'START_RATE_CHANGE', label: 'Rate Change' },
  { value: 'START_FAIL_WARRANTY', label: 'Failed Warranty' },
  { value: 'FAIL_TO_ONBOARD', label: 'Fail to Onboard' },
];
export const applicationStatus2 = [
  //preStatus
  { value: 'Watching', label: 'Watching' },
  //internal status
  { value: 'Applied', label: 'Submitted to AM' },
  { value: 'Called_Candidate', label: 'Called Candidate' },
  { value: 'Meet_Candidate_In_Person', label: 'Meet Candidate In Person' },
  { value: 'Qualified', label: 'Qualified by AM' },
  //client status
  { value: 'Submitted', label: 'Submitted to Client' },
  { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' },
  { value: 'Interview', label: 'Interview' },

  { value: 'Offered', label: 'Offered by Client' },
  { value: 'Offer_Rejected', label: 'Offer Declined' },
  { value: 'Offer_Accepted', label: 'Offer Accepted' },
  //end status
  { value: 'Started', label: 'On boarded' },
  { value: 'START_TERMINATED', label: 'Terminated' },
  { value: 'START_EXTENSION', label: 'Extension' },
  { value: 'START_RATE_CHANGE', label: 'Rate Change' },
  { value: 'START_FAIL_WARRANTY', label: 'Failed Warranty' },
  // reject status
  { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
  { value: 'Internal_Rejected', label: 'Rejected by AM' },
  { value: 'Client_Rejected', label: 'Rejected by Client' },
  { value: 'FAIL_TO_ONBOARD', label: 'Fail to Onboard' },
  //extra status
  { value: 'updateResume', label: 'Update Resume' },
  { value: 'addNote', label: 'Add note To Current Status' },
  { value: 'updateUserRoles', label: 'Update User Roles' },
  { value: 'updateCommissions', label: 'Update Commissions' },
];

export const applicationStatusV3 = [
  { value: 'SUBMIT_TO_JOB', label: '推荐至职位' },
  { value: 'SUBMIT_TO_CLIENT', label: '推荐至客户' },
  { value: 'INTERVIEW', label: '面试' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'OFFER_ACCEPT', label: '接受offer' },
  { value: 'COMMISSION', label: '业绩分配' },
  { value: 'ON_BOARD', label: '入职' },
  { value: 'ELIMINATED', label: '淘汰' },
];

export const applicationStatus3 = [
  //preStatus
  // { value: 'Watching', label: 'Watching' },
  //internal status
  { value: 'Applied', label: 'Submitted to AM' },
  { value: 'Called_Candidate', label: 'Called Candidate' },
  { value: 'Meet_Candidate_In_Person', label: 'Meet Candidate In Person' },
  { value: 'Qualified', label: 'Qualified by AM' },
  //client status
  { value: 'Submitted', label: 'Submitted to Client' },
  { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' },
  { value: 'Interview', label: 'Interview' },

  { value: 'Offered', label: 'Offered by Client' },
  { value: 'Offer_Rejected', label: 'Offer Declined' },
  { value: 'Offer_Accepted', label: 'Offer Accepted' },
  //end status
  { value: 'Started', label: 'On boarded' },
  { value: 'START_TERMINATED', label: 'Terminated' },
  { value: 'START_EXTENSION', label: 'Extension' },
  { value: 'START_FAIL_WARRANTY', label: 'Failed Warranty' },
  // reject status
  { value: 'Candidate_Quit', label: 'Candidate Rejected Job' },
  { value: 'Internal_Rejected', label: 'Rejected by AM' },
  { value: 'Client_Rejected', label: 'Rejected by Client' },
  { value: 'FAIL_TO_ONBOARD', label: 'Fail to Onboard' },
  //extra status
  // { value: 'updateResume', label: 'Update Resume' },
  // { value: 'addNote', label: 'Add note To Current Status' },
  // { value: 'updateUserRoles', label: 'Update User Roles' },
  // { value: 'updateCommissions', label: 'Update Commissions' },
];

// for p1-Report
export const applicationStatus4 = [
  // {value: 'Watching', label: 'Watching'},
  { value: 'Applied', label: 'Submitted to AM' }, //0
  { value: 'Called_Candidate', label: 'Called Candidate' }, //1
  { value: 'Meet_Candidate_In_Person', label: 'Meet Candidate In Person' }, //2
  { value: 'Internal_Rejected', label: 'Rejected by AM' }, //3
  { value: 'Qualified', label: 'Qualified by AM' }, //4
  { value: 'Submitted', label: 'Submitted to Client' }, //5

  { value: 'Client_Rejected', label: 'Rejected by Client' }, //6
  { value: 'Shortlisted_By_Client', label: 'Shortlisted by Client' }, //7
  { value: 'Interview', label: 'Interview' }, //8

  { value: 'Client_Rejected', label: 'Rejected by Client' }, //9
  { value: 'Offered', label: 'Offered by Client' }, //10

  { value: 'Offer_Rejected', label: 'Offer Declined' }, //11
  { value: 'Offer_Accepted', label: 'Offer Accepted' }, //12

  { value: 'Started', label: 'On boarded' }, //13

  { value: 'Candidate_Quit', label: 'Candidate Rejected Job' }, //14

  { value: 'START_TERMINATED', label: 'Terminated' },
  { value: 'START_EXTENSION', label: 'Extension' },
  { value: 'START_RATE_CHANGE', label: 'Rate Change' },
  { value: 'START_FAIL_WARRANTY', label: 'Failed Warranty' },
  { value: 'FAIL_TO_ONBOARD', label: 'Fail to Onboard' },

  // {
  //   value: 'Other',
  //   label: 'Other',
  // },
];
let applicationStatusMap;
export const getApplicationStatusLabel = (status) => {
  if (!applicationStatusMap) {
    applicationStatusMap = applicationStatusV3.reduce((res, status) => {
      res[status.value] = status.label;
      return res;
    }, {});
  }
  console.log(status, applicationStatusMap[status]);
  return applicationStatusMap[status];
};
const statusCanUpdateResume = [
  'Watching',
  'Applied',
  'Called_Candidate',
  'Meet_Candidate_In_Person',
  'Qualified',
  'Candidate_Quit',
  'Internal_Rejected',
];
export const canUpdateResume = memoizeOne((status) => {
  console.log(status);
  return statusCanUpdateResume.includes(status);
});

export const getApplicationStatusByCurrentStatus = (status) => {
  const statusIndex = applicationStatus.findIndex(
    (option) => option.value === status
  );

  let res;
  // 如果状态为Rejected by Client / On boarded / Candidate Rejected Job
  // 则select没有其它的选项，意味着没有nextStep
  if (
    statusIndex === 6 ||
    /*statusIndex === 11 ||*/
    statusIndex === 13 ||
    statusIndex === 14
  ) {
    console.log(applicationStatus[statusIndex]);
    return [applicationStatus[statusIndex]];
  }

  //  如果当前的状态小于5
  //  取applicationStatus状态的0~6 并且加一条 Candidate_Quit：Candidate Rejected Job
  if (statusIndex < 5) {
    res = applicationStatus.slice(0, 6);

    res.push({ value: 'Candidate_Quit', label: 'Candidate Rejected Job' });
    return res;
  }
  // 如果当前的状态小于 8
  // 取applicationStatus状态的5~9
  if (statusIndex < 8) {
    res = applicationStatus.slice(5, 9);
    res.push({ value: 'Candidate_Quit', label: 'Candidate Rejected Job' });
    return res;
  }

  // 如果当前的状态小于 10
  // 取applicationStatus状态的8~11
  if (statusIndex < 10) {
    res = applicationStatus.slice(8, 11);
    res.push({ value: 'Candidate_Quit', label: 'Candidate Rejected Job' });
    return res;
  }
  // 其它情况 返回取applicationStatus状态的11~13
  return applicationStatus.slice(11, 13);
};

export const relationshipRating = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
];

export const companySize = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
];

export const jobPermissions = [
  { value: 'Edit', label: 'Edit' },
  { value: 'Apply_Candidate', label: 'Apply Candidate' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Owner', label: 'Owner' },
];

export const TALENT_TYPES = Object.freeze({
  Candidate: 'CANDIDATE',
  Private_Talent: 'PRIVATE_TALENT',
  Public_Talent: 'PUBLIC_TALENT',
});

export const CONTACT_TYPES = Object.freeze({
  PrimaryEmail: 'PRIMARY_EMAIL',
  Email: 'EMAIL',
  PrimaryPhone: 'PRIMARY_PHONE',
  HomePhone: 'HOME_PHONE',
  WorkPhone: 'WORK_PHONE',
  CellPhone: 'CELL_PHONE',
  Phone: 'PHONE',
  Fax: 'FAX',
  Wechat: 'WECHAT',
  LinkedIn: 'LINKEDIN',
  Github: 'GITHUB',
  Dice: 'DICE',
  LiePin: 'LIEPIN',
  Google_Plus: 'GOOGLE_PLUS',
  Facebook: 'FACEBOOK',
  Twitter: 'TWITTER',
  Weibo: 'WEIBO',
  Monster: 'MONSTER',
  Maimai: 'MAIMAI',
});

export const payRateUnitTypes = [
  { value: 'HOURLY', label: 'Hour', label2: '小时' },
  { value: 'DAILY', label: 'Day', label2: '天' },
  { value: 'WEEKLY', label: 'Week', label2: '周' },
  { value: 'MONTHLY', label: 'Month', label2: '月' },
  { value: 'YEARLY', label: 'Year', label2: '年' },
];

export const contractStatus = [
  { value: 'VALID', label: 'Active' },
  { value: 'INVALID', label: 'Obsolete' },
];

export const tenantAdmin = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'InActive' },
];

export const templateTypes2 = [
  {
    value: 'Activities_Candidate_Internal_Submittal',
    label: 'Submit to AM',
  },
  {
    value: 'Activities_Candidate_Interview',
    label: 'Interview: to Candidate',
  },
  {
    value: 'Activities_Contact_Interview',
    label: 'Interview: to Client',
  },
  {
    value: 'Individual_Emails',
    label: 'Individual Emails',
  },
  {
    value: 'Job_Description',
    label: 'Job Description',
  },
  {
    value: 'Invoice_Email',
    label: 'Invoice Email',
  },
  // {
  //   value: 'Email_Blast',
  //   label: 'Email Blast'
  // }
];

export const resumeSourceTypes = [
  { value: 'UNKNOWN', label: 'Unknown' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'DICE', label: 'Dice' },
  { value: 'LIEPIN', label: 'LiePin' },

  { value: 'CAREER_BUILDER', label: 'Career Builder' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'MONSTER', label: 'Monster' },
  { value: 'JAZZHR', label: 'JazzHR' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'CAMPUS_RECRUITING', label: 'Campus Recruiting' },
  { value: 'MARKETING_EVENT', label: 'Marketing Event' },
  { value: 'INTELLIPRO_WEBSITE', label: 'IntelliPro Website' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'OTHER', label: 'Other' },
];

//todo: check report
export const sourceTypes = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'DICE', label: 'Dice' },
  { value: 'LIEPIN', label: 'LiePin' },
  { value: 'MONSTER', label: 'Monster' },
];

export const leadSource = [
  { value: 'LINKED_IN', label: 'LinkedIn' },
  { value: 'EVENT', label: 'Event' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'PERSONAL_NETWORK', label: 'Personal network' },
  { value: 'COLD_CALL', label: 'Cold call' },
  { value: 'OTHER', label: 'Other' },
];

export const staffSize = [
  { value: 'FROM_1_TO_10', label: '1-10' },
  { value: 'FROM_11_TO_50', label: '11-50' },
  { value: 'FROM_51_TO_100', label: '51-100' },
  { value: 'FROM_101_TO_500', label: '101-500' },
  { value: 'FROM_501_TO_1000', label: '501-1000' },
  { value: 'FROM_1001_TO_10000', label: '1001-10000' },
  { value: 'ABOVE_10000', label: '10000+' },
];

export const businessRevenue = [
  { value: 'LESS_THAN_ONE_MILLION', label: '$ <1M' },
  { value: 'ONE_MILLION_TO_TEN_MILLION', label: '$ 1-10M' },
  { value: 'TEN_MILLION_TO_FIFTY_MILLION', label: '$ 10-50M' },
  { value: 'FIFTY_MILLION_TO_ONE_HUNDRED_MILLION', label: '$ 50-100M' },
  { value: 'ONE_HUNDRED_MILLION_TO_FIVE_HUNDRED_MILLION', label: '$ 100-500M' },
  { value: 'FIVE_HUNDRED_MILLION_TO_ONE_BILLION', label: '$ 500M-1B' },
  { value: 'ONE_BILLION_TO_TEN_BILLION', label: '$ 1-10B' },
  { value: 'ABOVE_TEN_BILLION', label: '$ 10B+' },
];
export const getTimeZoneList = (interviewDate) => {
  const zoneNames = moment.tz.names();
  // console.log(interviewDate);
  return zoneNames.map((value) => {
    const offset = moment.tz.zone(value).utcOffset(new Date(interviewDate));
    const offsetAbs = Math.abs(offset);
    const remain = offsetAbs % 60;
    const hour = (offsetAbs - remain) / 60;
    const label =
      offset > 0
        ? `(UTC-${hour < 10 ? '0' : ''}${hour}:${
            remain ? remain : '00'
          }) ${value}`
        : `(UTC+${hour < 10 ? '0' : ''}${hour}:${
            remain ? remain : '00'
          }) ${value}`;
    return {
      value,
      label,
    };
  });
};
export const timeZoneList = getTimeZoneList(moment());

export const interviewTypeList = [
  { value: 'INTERVIEW_PHONE', label: 'Phone Interview' },
  { value: 'INTERVIEW_VIDEO', label: 'Video Interview' },
  { value: 'INTERVIEW_ONSITE', label: 'Onsite Interview' },
  { value: 'INTERVIEW_OTHERS', label: 'Others' },
];

export const interviewStageList = [
  { value: 'ROUND_1', label: '1st Round' },
  { value: 'ROUND_2', label: '2nd Round' },
  { value: 'ROUND_3', label: '3nd Round' },
  { value: 'ROUND_4', label: '4th Round' },
  { value: 'ROUND_5', label: '5th Round' },
];

export const INTERVIEW_TYPES = {
  Phone: 'INTERVIEW_PHONE',
  Video: 'INTERVIEW_VIDEO',
  Onsite: 'INTERVIEW_ONSITE',
  Others: 'INTERVIEW_OTHERS',
};

const hour = [...Array(24)].reduce((res, value, index) => {
  const hour = index < 10 ? `0${index}` : index;
  res.push(`${hour}:00`);
  res.push(`${hour}:30`);
  return res;
}, []);

export const interviewTimeList = hour.map((ele) => ({
  value: ele,
  label: ele,
}));

export const typeList = [
  { value: 'CLIENT_LVL_A', label: 'Level 1' },
  { value: 'CLIENT_LVL_B', label: 'Level 2' },
  { value: 'CLIENT_LVL_C', label: 'Level 3' },
  // { value: "POTENTIAL_CLIENT", label: "Potential Client" },
];

export const levelList = [
  { value: 'SUPER_KEY_ACCOUNT', label: 'Super Key Account' },
  { value: 'KEY_ACCOUNT', label: 'Key Account' },
  { value: 'COMMERCIAL_ACCOUNT', label: 'Commercial Account' },
  { value: 'SUN_SET', label: 'Sunset' },
];

export const industryList = [
  { value: 'AI', label: 'AI' },
  { value: 'AUTOMOTIVE', label: 'Automotive' },
  { value: 'IT_SOFTWARE', label: 'IT/Software' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'MEDICAL_HEALTH_CARE', label: 'Health Care' },
  {
    value: 'MANUFACTURING_AND_INDUSTRIAL',
    label: 'Manufacturing & Industrial',
  },
  { value: 'ELETRONICS_AND_HARDWARE', label: 'Electronics & Hardware' },
  {
    value: 'BANKING_AND_FINANCE_SERVICES',
    label: 'Banking & Financial Services',
  },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'ROBOTICS', label: 'Robotics' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'LOGISTICS_AND_SHIPPING', label: 'Logistics & Shipping' },
  { value: 'ENERGY', label: 'Energy' },
  { value: 'GOVERNMENT_AND_NON_PROFIT', label: 'Government & Non-Profit' },
  { value: 'STAFFING_AND_RECRUITMENT', label: 'Staffing & Recruitment' },
  { value: 'CONSUMER_GOODS', label: 'Consumer Goods' },
  { value: 'PROFESSIONAL_SERVICES', label: 'Professional Services' },
  { value: 'AGRICULTURE', label: 'Agriculture' },
  {
    value: 'COMPUTER_GAMING_AND_E_SPORTS',
    label: 'Computer Gaming & E-Sports',
  },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'HOSPITALITY_AND_TRAVEL', label: 'Hospitality & Travel' },
  {
    value: 'REAL_ESTATE_AND_CONSTRUCTION',
    label: 'Real Estate & Construction',
  },
  { value: 'ADVERTISING_AND_MEDIA', label: 'Advertising & Media' },
  // { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'OTHER', label: 'Other' },
];

//invoice
export const invoiceStatus = [
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'STARTUP_FEE_PAID_USED', label: 'Paid - Used' },
  { value: 'STARTUP_FEE_PAID_UNUSED', label: 'Paid - Unused' },
  { value: 'STARTUP_FEE_UNPAID_UNUSED', label: 'Unpaid - Unused' },
  { value: 'VOID', label: 'Void' },
];
export const invoiceType = [
  { value: 'STARTUP_FEE', label: 'Startup Fee' },
  { value: 'FTE', label: 'FTE' },
];

export const userType = [
  {
    value: 'RECRUITER',
    label: 'Recruiter',
  },
  {
    value: 'SOURCER',
    label: 'Sourcer',
  },
  {
    value: 'AM',
    label: 'AM',
  },
  {
    value: 'AC',
    label: 'Account Coordinator',
  },
  { value: 'DELIVERY_MANAGER', label: 'DM' },
  {
    value: 'OWNERSHIP_RECRUITER',
    label: 'Owner',
  },
  {
    value: 'OWNERSHIP_SOURCER',
    label: 'Owner',
  },
  {
    value: 'OWNER',
    label: 'Owner',
  },
];

export const ContactCategory = [
  { value: 'HIRING_MANAGER', label: 'Hiring Manager' },
  { value: 'HR_CONTACT', label: 'HR Contact' },
  { value: 'MSP', label: 'MSP' },
  { value: 'OTHER', label: 'OTHER' },
];

export const userTypeForCommission = [
  {
    value: 'AM',
    label: 'Account Manager',
    label2: '客户经理',
  },
  {
    value: 'AC',
    label: 'Account Coordinator',
    label2: '账户协调员',
  },
  {
    value: 'DM',
    label: 'Delivery Manager',
    label2: '交付经理',
  },
  {
    value: 'RECRUITER',
    label: 'Recruiter',
    label2: '招聘专员',
  },
  {
    value: 'SOURCER',
    label: 'Sourcer',
    label2: '招聘专员助理',
  },
  {
    value: 'OWNER',
    label: 'Owner',
    label2: '所有者',
    disabled: true,
  },
  // {
  //   value: 'PR',
  //   label: 'Primary Recruiter',
  // },
];

export const USER_TYPES = {
  AM: 'AM',
  AccountCoordinator: 'AC',
  DM: 'DM',
  Recruiter: 'RECRUITER',
  Sourcer: 'SOURCER',
  Owner: 'OWNER',
};

export const TEAM_PERMISSIONS = {
  AccountManager: 'Owner',
  AccountCoordinator: 'Sales',
  Recruiter: 'Apply_Candidate',
  PrimaryRecruiter: 'Admin',
  DeliveryManager: 'DELIVERY_MANAGER',
};
export const TEAM_PERMISSIONSTwo = {
  AccountManager: 'AM',
  AccountCoordinator: 'Sales',
  Recruiter: 'Apply_Candidate',
  PrimaryRecruiter: 'PRIMARY_RECRUITER',
  DeliveryManager: 'DELIVERY_MANAGER',
};

export const emailHistoryStatus = {
  success: [
    'DELIVERY',
    'SPAM_COMPLAINT',
    'CLICK',
    'OPEN',
    'INITIAL_OPEN',
    'AMP_CLICK',
    'AMP_OPEN',
    'AMP_INITIAL_OPEN',
    'LIST_UNSUBSCRIBE',
    'LINK_UNSUBSCRIBE',
  ],
  opens: [
    'OPEN',
    'INITIAL_OPEN',
    'AMP_OPEN',
    'AMP_INITIAL_OPEN',
    'LIST_UNSUBSCRIBE',
    'LINK_UNSUBSCRIBE',
    'SPAM_COMPLAINT',
    'AMP_CLICK',
    'CLICK',
  ],
  clicks: ['CLICK', 'AMP_CLICK', 'LIST_UNSUBSCRIBE', 'LINK_UNSUBSCRIBE'],
  bounces: [
    // 'BOUNCE',
    'SOFT_BOUNCE',
    'BLOCK_BOUNCE',
    'ADMIN_BOUNCE',
    'UNDETERMINED_BOUNCE',
    'HARD_BOUNCE',
  ],
  fail: [
    'INJECTION',
    'APN_INJECTION_SUCCESS',
    'APN_INJECTION_FAILURE',
    'OUT_OF_BAND',
    'POLICY_REJECTION',
    'DELAY',
    'GENERATION_FAILURE',
    'GENERATION_REJECTION',
    // 'BOUNCE',
    'SOFT_BOUNCE',
    'BLOCK_BOUNCE',
    'ADMIN_BOUNCE',
    'UNDETERMINED_BOUNCE',
    'HARD_BOUNCE',
  ],
  unsubscribe: ['LIST_UNSUBSCRIBE', 'LINK_UNSUBSCRIBE'],
};

export const newJobStatus = [
  { value: 'OPEN', label: 'OPEN' },
  { value: 'REOPENED', label: 'REOPEN' },
  { value: 'ONHOLD', label: 'ON HOLD' },
  { value: 'OFFER_MADE', label: 'OFFER MADE' },
  { value: 'FILLED', label: 'FILLED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
  { value: 'CLOSED', label: 'CLOSED' },
  { value: 'EXPIRED', label: 'EXPIRED' },
  { value: 'IGNORED', label: 'IGNORED' },
];

export const userRole = [
  { value: 'Owner', label: 'Account Manager' },
  { value: 'Sales', label: 'Account Coordinator' },
  { value: 'Delivery_Manager', label: 'Delivery Manager' },
  { value: 'Apply_Candidate', label: 'Recruiter' },
  { value: 'Admin', label: 'Primary Recruiter' },
];

export const GeneralType = [
  { value: 'Salary', label: 'Salary(General Recruiting)' },
  { value: 'Bill', label: 'Bill Rate(General Staffing)' },
  { value: 'Pay', label: 'Pay Rate(General Staffing)' },
];
export const SEND_EMAIL_TYPES = {
  SendEmailToTalents: 'SEND_EMAIL_TO_TALENTS',
  SendEmailToAssignedUsers: 'SEND_EMAIL_TO_ASSIGNED_USERS',
  SendEmailToAM: 'SEND_EMAIL_TO_AM',
  SendEmailToCandidate: 'SEND_EMAIL_TO_CANDIDATE',
  SendEmailToHM: 'SEND_EMAIL_TO_HIRING_MANAGER',
  SendEmailBlast: 'SEND_EMAIL_BLAST',
  SendEmailToClientInvoice: 'SEND_EMAIL_TO_CLIENT_INVOICE',
};

export const CandidateContact = [
  { value: 'PHONE', label: 'Phone' },
  { value: 'EMAIL', label: 'Email' },
];

export const CandidateNetWork = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'WECHAT', label: 'WeChat' },
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'PERSONAL_WEBSITE', label: 'Personal Website' },
];

export const CandidateTpye = [
  { value: 'UPLOAD_WITH_RESUME', label: 'Upload with Resume' },
  { value: 'CREATE_WITHOUT_RESUME', label: 'Create without Resume' },
  { value: 'BULK_UPLOAD_RESUMES', label: 'Bulk Upload Resumes' },
];

export const candidateSoureChannel = [
  // { value: 'UNKNOWN', label: 'Unknown' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'DICE', label: 'Dice' },

  { value: 'CAREER_BUILDER', label: 'Career Builder' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'MONSTER', label: 'Monster' },
  { value: 'JAZZHR', label: 'JazzHR' },
  { value: 'REFERRAL', label: 'Referral' },
  { value: 'CAMPUS_RECRUITING', label: 'Campus Recruiting' },
  { value: 'MARKETING_EVENT', label: 'Marketing Event' },
  { value: 'INTELLIPRO_WEBSITE', label: 'IntelliPro Website' },
  { value: 'SOCIAL_MEDIA', label: 'Social Media' },
  { value: 'OTHER', label: 'Others' },
];

export const notesTypesnOptions = [
  { value: 'CALL_CANDIDATES', label: 'Call Candidates' },
  { value: 'CONSULTANT_INTERVIEW', label: 'Consultant Interview' },
  { value: 'CANDIDATES_NOTES', label: 'Candidates Notes' },
];

export const notesStatus = [
  { value: 'OPEN_TO_NEW_OPPORTUNITIES', label: 'Open to new opportunities' },
  {
    value: 'NOT_ACTIVELY_LOOKING_FOR_NEW_OPPORTUNITIES',
    label: 'Not Actively Looking for New Opportunities',
  },
  { value: 'BLACKLIST', label: 'Blacklist' },
];
export const userRoles = [
  { value: 'RECRUITER', label: 'Recruiter ' },
  { value: 'AM', label: 'AM' },
  { value: 'SOURCER', label: 'Sourcer' },
  { value: 'DM', label: 'DM' },
];

export const activationTypes = [
  { value: 'INSTANT', label: 'Instant' },
  { value: 'NEXT_MONTH', label: 'Next Month' },
];

export const rateUnitOptions = [
  { label: 'Year', value: 'YEARLY' },
  { label: 'Month', value: 'MONTHLY' },
  { label: 'Week', value: 'WEEKLY' },
  { label: 'Day', value: 'DAILY' },
  { label: 'Hour', value: 'HOURLY' },
];

//todo: check usage
export const jobStatus1 = [
  { value: 'OPEN', label: 'Open' },
  { value: 'REOPENED', label: 'Reopen' },
  // { value: 'OFFER_MADE', label: 'OFFER MADE' },
  // { value: 'FILLED', label: 'Filled' },
  // { value: 'CLOSED', label: 'Closed' },
  // { value: 'CANCELLED', label: 'Cancelled' },
  // { value: 'ONHOLD', label: 'Onhold' },
  // { value: 'EXPIRED', label: 'EXPIRED' },
  // { value: 'IGNORED', label: 'IGNORED' }
];

// newApplication面试进展
export const ApplicationInterview = [
  { value: 1, label: '第1轮' },
  { value: 2, label: '第2轮' },
  { value: 3, label: '第3轮' },
  { value: 4, label: '第4轮' },
  { value: 5, label: '第5轮' },
  { value: 6, label: '第6轮' },
  { value: 7, label: '第7轮' },
  { value: 8, label: '第8轮' },
  { value: 9, label: '第9轮' },
  { value: 10, label: '第10轮' },
  { value: 11, label: '第11轮' },
  { value: 12, label: '第12轮' },
];

export const ApplicationInterviewType = [
  { value: 'PHONE', label: '电话面试' },
  { value: 'VIDEO', label: '视频面试' },
  { value: 'ONSITE', label: '现场面试' },
  { value: 'OTHER', label: '其他' },
];

export const ApplicationOfferSalary = [
  { value: 'BASE_SALARY', label: '可计费基本薪资' },
  { value: 'RETENTION_BONUS', label: '入职奖金' },
  { value: 'SIGN_ON_BONUS', label: '保留奖金' },
  { value: 'ANNUAL_BONUS', label: '年度奖金' },
  { value: 'RELOCATION_PACKAGE', label: '搬迁套餐' },
  { value: 'EXTRA_FEE', label: '额外费用' },
];

export const SalaryStructure = [
  { value: 'BASE_SALARY', label: '基本薪资' },
  { value: 'RETENTION_BONUS', label: '留存奖金' },
  { value: 'STOCK', label: '股权' },
];

export const ApplicationOfferFree = [
  { value: 'PERCENTAGE', label: '%' },
  { value: 'FLAT_AMOUNT', label: '固定金额' },
];

export const ApplicationRejected = [
  { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
  { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
  { value: 'INTERNAL_REJECT', label: '内部淘汰' },
];

export const chargeType = [
  { value: 'REFERRAL_BONUS', label: '人才推荐费' },
  // { value: 'DEPOSIT', label: '定金' },
];

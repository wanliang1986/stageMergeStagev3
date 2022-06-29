/**
 * Created by leonardli on 3/25/17.
 */
//auth
export const LOGIN = 'login';
export const LOGOUT = 'logout';
export const LOGIN_CHECKED = 'login_checked';
export const SET_ROUTER = 'SET_ROUTER';

//talents
export const REQUEST_TALENT = 'request_talent';
export const RECEIVE_TALENT = 'receive_talent';
export const FAILURE_TALENT = 'failure_talent';
export const ADD_TALENT = 'add_talent';
export const EDIT_TALENT = 'edit_talent';
export const DELETE_TALENT = ' delete_talent';

export const ADD_TALENT_CONTACT = 'add_talent_contact';
export const EDIT_TALENT_CONTACT = 'edit_talent_contact';
export const DELETE_TALENT_CONTACT = 'delete_talent_contact';

export const ADD_TALENT_EXPERIENCE = 'add_talent_experience';
export const EDIT_TALENT_EXPERIENCE = 'edit_talent_experience';
export const DELETE_TALENT_EXPERIENCE = 'delete_talent_experience';

export const ADD_TALENT_EDUCATION = 'add_talent_education';
export const EDIT_TALENT_EDUCATION = 'edit_talent_education';
export const DELETE_TALENT_EDUCATION = 'delete_talent_education';

export const ADD_TALENT_CERTIFICATE = 'add_talent_certificate';
export const EDIT_TALENT_CERTIFICATE = 'edit_talent_certificate';
export const DELETE_TALENT_CERTIFICATE = 'delte_talent_certificate';

export const ADD_TALENT_SKILL = 'add_talent_skill';
export const EDIT_TALENT_SKILL = 'edit_talent_skill';
export const DELETE_TALENT_SKILL = 'delte_talent_skill';

export const ADD_TALENT_NOTE = 'add_talent_note';

export const REQUEST_TALENT_LIST = 'request_talent_list';
export const RECEIVE_TALENT_LIST = 'receive_talent_list';
export const FAILURE_TALENT_LIST = 'failure_talent_list';
export const DELETE_TALENTS_FROM_LIST = 'delete_talents_from_list';
export const ADD_TALENTS_TO_LIST = 'add_talents_to_list';

export const TALENTS_SUBMIT_TO_CLIENT_REQUEST = 'TStC_request';
export const TALENTS_SUBMIT_TO_CLIENT_FAILURE = 'TStC_failure';
export const TALENTS_SUBMIT_TO_CLIENT_SUCCESS = 'TStC_success';
export const TALENTS_SUBMIT_TO_CLIENT_CLEAR = 'TStC_clear';

export const RECEIVE_TALENT_OWNERSHIPS = 'RECEIVE_TALENT_OWNERSHIPS';

//talent resume
export const RECEIVE_TALENT_RESUME = 'RECEIVE_TALENT_RESUME';
export const ADD_TALENT_RESUME = 'add_talent_resume';
export const DELETE_TALENT_RESUME = 'delete_talent_resume';

//jobs
export const REQUEST_JOB = 'request_job';
export const RECEIVE_JOB = 'receive_JOB';
export const FAILURE_JOB = 'failure_JOB';
export const ADD_JOB = ' add_JOB';
export const EDIT_JOB = ' edit_JOB';

export const BIG_TABLE = 'big_TABLE';
export const NONE_TABLE = 'none_TABLE';

export const REQUEST_JOB_APPLICATIONS = 'REQUEST_JOB_APPLICATIONS';
export const RECEIVE_JOB_APPLICATIONS = 'RECEIVE_JOB_APPLICATIONS';

export const REQUEST_JOB_USER_RELATIONS = 'REQUEST_JOB_USER_RELATIONS';
export const RECEIVE_JOB_USER_RELATIONS = 'RECEIVE_JOB_USER_RELATIONS';

export const ADD_JOB_ASSOCIATED_USERS = 'add_job_associated_users';
export const UPDATE_JOB_ASSOCIATED_USERS = 'UPDATE_job_associated_users';
export const EDIT_JOB_ASSOCIATED_USERS = 'edit_job_associated_users';
export const DELETE_JOB_ASSOCIATED_USERS = 'delete_job_associated_users';

export const ADD_JOB_INTERVIEW_QUESTION = 'add_job_interview_question';
export const EDIT_JOB_INTERVIEW_QUESTION = 'edit_job_interview_question';
export const DELETE_JOB_INTERVIEW_QUESTION = 'delete_job_interview_question';

export const ADD_JOB_NOTE = 'add_job_note';

export const REQUEST_JOB_LIST = 'request_job_list';
export const RECEIVE_JOB_LIST = 'receive_job_list';
export const FAILURE_JOB_LIST = 'failure_job_list';
export const DELETE_JOBS_FROM_LIST = 'delete_jobs_from_list';
export const ADD_JOBS_TO_LIST = 'add_jobs_to_list';

export const RECEIVE_RECOMMENDATION_JOB_LIST =
  'RECEIVE_RECOMMENDATION_JOB_LIST';

// notification
export const ADD_NOTIFICATION = 'add_notification';
export const EDIT_NOTIFICATION = 'edit_notification';
export const DELETE_NOTIFICATION = 'delete_notification';
export const GET_USER_NOTIFICATION = 'get_user_notification';

//applications & activities
export const ADD_APPLICATION = 'add_application';
export const EDIT_APPLICATION = 'edit_application';
export const RECEIVE_APPLICATION_LIST = 'RECEIVE_APPLICATION_LIST';
export const GET_ACTIVITIES_BY_APPLICATION = 'get_activities_by_application';

//users
export const REQUEST_USERS = 'request_users';
export const RECEIVE_USERS = 'receive_users';
export const RECEIVE_BRIEF_USERS = 'receive_brief_users';
export const FAILURE_USERS = 'failure_users';
export const GET_CURRENT_USER = 'get_current_user';
export const UPDATE_CURRENT_USER = 'update_current_user';
export const CHANGE_PASSWORD = 'change_password';
export const GET_TASK_RECORDS = 'get_task_records';
export const GET_TEAM_LIST = 'get_team_list';
export const UPSERT_TEAM = 'upsert_team';
export const DELETE_TEAM = 'delete_team';
export const ADD_MY_JOBS = 'ADD_MY_JOBS';

//controller
export const ADD_MESSAGE = 'add_message';
export const REMOVE_MESSAGE = 'remove_message';
// email request
export const ADD_SEND_EMAIL_REQUEST = 'ADD_SEND_EMAIL_REQUEST';
export const REMOVE_SEND_EMAIL_REQUEST = 'REMOVE_SEND_EMAIL_REQUEST';

//clients
export const ADD_COMPANY = 'add_company';
export const EDIT_COMPANY = 'edit_company';
// export const DELETE_COMPANY = 'delete_company';
export const RECEIVE_COMPANY = 'receive_company';

export const REQUEST_COMPANIES = 'request_COMPANIES';
export const RECEIVE_COMPANIES = 'receive_COMPANIES';
export const FAILURE_COMPANIES = 'failure_COMPANIES';
export const REMOVE_COMPANIES = 'remove_companies';

export const REQUEST_CLIENT_CONTACTS = 'request_client_contacts';
export const RECEIVE_CLIENT_CONTACTS = 'receive_client_contacts';
export const FAILURE_CLIENT_CONTACTS = 'failure_client_contacts';

export const GET_CLIENT_CONTACT = 'get_client_contact';
export const ADD_CLIENT_CONTACT = 'add_client_contact';
export const EDIT_CLIENT_CONTACT = 'edit_client_contact';
export const DELETE_CLIENT_CONTACT = ' delete_client_contact';

export const NO_CONTRACT_CLIENT = 'no_contract_client';
export const GET_SKIP_SUBMIT_TO_AM_COMPANIES =
  'GET_SKIP_SUBMIT_TO_AM_COMPANIES';

export const REQUEST_CLIENTSBYCOMPANY = 'REQUEST_CLIENTSBYCOMPANY';
export const RECEIVE_CLIENTSBYCOMPANY = 'RECEIVE_CLIENTSBYCOMPANY';
export const FAILURE_CLIENTSBYCOMPANY = 'FAILURE_CLIENTSBYCOMPANY';

export const REQUEST_OPENJOBSBYCOMPANY = 'REQUEST_OPENJOBSBYCOMPANY';
export const RECEIVE_OPENJOBSBYCOMPANY = 'RECEIVE_OPENJOBSBYCOMPANY';
export const FAILURE_OPENJOBSBYCOMPANY = 'FAILURE_OPENJOBSBYCOMPANY';

export const ADD_CONTRACT = 'add_contract';
export const EDIT_CONTRACT = 'edit_contract';
export const DELETE_CONTRACT = 'delete_contract';

export const REQUEST_CONTRACTSBYCOMPANY = 'REQUEST_CONTRACTSBYCOMPANY';
export const RECEIVE_CONTRACTSBYCOMPANY = 'RECEIVE_CONTRACTSBYCOMPANY';
export const FAILURE_CONTRACTSBYCOMPANY = 'FAILURE_CONTRACTSBYCOMPANY';

export const GET_PROGRAM_TEAM_LIST = 'get_program_team_list';
export const UPSERT_PROGRAM_TEAM = 'upsert_program_team';
export const DELETE_PROGRAM_TEAM = 'delete_program_team';

//parse records
export const REQUEST_PARSE_RECORDS = 'request_parse_records';
export const RECEIVE_PARSE_RECORDS = 'receive_parse_records';
export const FAILURE_PARSE_RECORDS = 'failure_parse_records';

export const REQUEST_PARSE_RECORD = 'request_parse_record';
export const RECEIVE_PARSE_RECORD = 'receive_parse_record';
export const FAILURE_PARSE_RECORD = 'failure_parse_record';
//uuid
export const UUID = 'uuid';
export const RECEIVE_PARSE_RECORD_BY_UUID = 'receive_parse_record_by_uuid';

export const ADD_PARSE_RECORD = 'add_parse_record';
export const EDIT_PARSE_RECORD = 'edit_parse_record';
export const DELETE_PARSE_RECORD = ' delete_parse_record';

// tenants
export const UPDATE_USER = 'update_user';
export const UPDATE_COMPANY = 'update_company';
//JobCardListView
export const GET_TENANT_TEMPLATE_LIST = 'get_tenant_template_list';
export const UPSERT_TEMPLATE = 'upsert_template';
export const DELETE_TEMPLATE = 'DELETE_TEMPLATE';

//hotlists
export const GET_HOT_LIST_LIST = 'GET_HOT_LIST_LIST';
export const UPSERT_HOT_LIST = 'upsert_hot_list';
export const GET_HOT_LIST_TALENTS2 = 'GET_HOT_LIST_TALENTS2';
export const DELETE_HOT_LIST_TALENT = 'DELETE_HOT_LIST_TALENT';
export const DELETE_HOT_LIST = 'DELETE_HOT_LIST';
export const RECEIVE_HOT_LIST_USERS = 'RECEIVE_HOT_LIST_USERS';

//emailBlasts
export const GET_EMAIL_BLAST_LIST = 'GET_EMAIL_BLAST_LIST';
export const UPSERT_EMAIL_BLAST = 'upsert_EMAIL_BLAST';
export const DELETE_EMAIL_BLAST = 'DELETE_EMAIL_BLAST';

export const GET_EMAIL_BLAST_RECIPIENTS = 'GET_EMAIL_BLAST_RECIPIENTS';
export const ADD_EMAIL_BLAST_RECIPIENT = 'ADD_EMAIL_BLAST_RECIPIENT';
export const DELETE_EMAIL_BLAST_RECIPIENT = 'DELETE_EMAIL_BLAST_RECIPIENT';

export const GET_EMAILBLAST_DRAFT_LIST = 'GET_EMAILBLAST_DRAFT_LIST';
export const UPSERT_DRAFT = 'UPSERT_DRAFT';
export const DELETE_DRAFT = 'DELETE_DRAFT';

//invoice
export const REQUEST_INVOICE_LIST = 'REQUEST_INVOICE_LIST';
export const RECEIVE_INVOICE_LIST = 'RECEIVE_INVOICE_LIST';
export const FAILURE_INVOICE_LIST = 'FAILURE_INVOICE_LIST';

export const ADD_INVOICE_TO_LIST = 'ADD_INVOICE_TO_LIST';
export const UPDATE_INVOICE = 'UPDATE_INVOICE';
export const PAID_INVOICE = 'PAID_INVOICE';
export const APPLY_CREDIT_INVOICE = 'APPLY_CREDIT_INVOICE';
export const VOID_INVOICE = 'VOID_INVOICE';

export const GET_INVOICE_DETAIL_LIST = 'GET_INVOICE_DETAIL_LIST';
export const ADD_INVOICE = 'ADD_INVOICE';
export const ADD_SUB_INVOICE_LIST = 'ADD_SUB_INVOICE_LIST';

//divisions
export const GET_DIVISIONS = 'get_divisions';
export const RECEIVE_DIVISION = 'receive_division';

export const ADD_DIVISION = 'add_division';
export const EDIT_DIVISION = 'edit_division';
export const DELETE_DIVISION = ' delete_division';

//starts
export const ADD_START = 'add_start';
export const EDIT_START = 'edit_start';
export const EDIT_START_ADDRESS = 'edit_start_address';
export const EDIT_START_CONTRACT_RATE = 'EDIT_START_CONTRACT_RATE';
export const DELETE_START_CONTRACT_RATE = 'DELETE_START_CONTRACT_RATE';
export const DELETE_START = 'delete_start';
export const RECEIVE_START = 'RECEIVE_START';
export const SELECT_START = 'SELECT_START';
export const TERMINATE_START = 'TERMINATE_START';
export const SELECT_EXTENSION = 'SELECT_EXTENSION';
export const SELECT_CONVERSION_START = 'SELECT_CONVERSION_START';

export const REQUEST_START_LIST = 'REQUEST_START_LIST';
export const RECEIVE_START_LIST = 'RECEIVE_START_LIST';
export const ADD_START_TO_LIST = 'ADD_START_TO_LIST';
export const FAILURE_START_LIST = 'FAILURE_START_LIST';

//commissions
export const ADD_COMMISSION = 'ADD_COMMISSION';
export const EDIT_COMMISSION = 'EDIT_COMMISSION';
export const DELETE_COMMISSION = 'DELETE_COMMISSION';
export const RECEIVE_COMMISSION = 'RECEIVE_COMMISSION';

export const REQUEST_COMMISSION_LIST = 'REQUEST_COMMISSION_LIST';
export const RECEIVE_COMMISSION_LIST = 'RECEIVE_COMMISSION_LIST';
export const ADD_COMMISSION_TO_LIST = 'ADD_COMMISSION_TO_LIST';
export const FAILURE_COMMISSION_LIST = 'FAILURE_COMMISSION_LIST';

// search common DB
export const PURCHASE_ONE_CANDIDATE = 'PURCHASE_ONE_CANDIDATE';

//history
export const RELOAD = 'reload';

//dashboard
export const RECEIVE_DASHBOARD_MYCANDIDATES = 'RECEIVE_DASHBOARD_MYCANDIDATES';
export const REQUEST_APPLICATION_BY_APPLICATIONID =
  'REQUEST_APPLICATION_BY_APPLICATIONID';
export const RECEIVE_APPLICATION_BY_APPLICATIONID =
  'RECEIVE_APPLICATION_BY_APPLICATIONID';

export const UPDATE_DASHBOARD_APPL_STATUS = 'UPDATE_DASHBOARD_APPL_STATUS';
export const UPDATE_DB_DATA = 'UPDATE_DB_DATA';
export const FINISH_UPDATE_DB_DATA = 'FINISH_UPDATE_DB_DATA';

//getPotentialServiceTypeTree
export const POTENTIAL_SERVICE_TYPE_TREE = 'POTENTIAL_SERVICE_TYPE_TREE';

// search audience
export const UPDATE_FILTERS = 'update_filters';
export const UPDATE_TOTAL = 'update_total';
export const DELETE_FILTER = 'DELETE_FILTER';
export const CLEARALL = 'CLEARALL';
export const CEASE_SEARCH_DATA = 'CEASE_SEARCH_DATA';

//search audience
export const NEW_SEARCH = 'new_search';
export const REQUEST_SEARCH_DATA = 'request_search_data';
export const RECEIVE_SEARCH_DATA = 'receive_search_data';
export const FAILURE_SEARCH_DATA = 'failure_search_data';

export const SELECT_SEACH = 'select_search';
export const DELETE_SEACH = 'delete_search';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';

// search jobs
export const NEW_SEARCH_JOB = 'NEW_SEARCH_JOB';
export const NEW_SEARCH_JOB_UPDATE = 'NEW_SEARCH_JOB_UPDATE';
export const NEW_SEARCH_JOB_DELETE = 'NEW_SEARCH_JOB_DELETE';
export const NEW_SEARCH_JOB_PAGEMODEL = 'NEW_SEARCH_JOB_PAGEMODEL';
export const NEW_SEARCH_JOB_RESET = 'NEW_SEARCH_JOB_RESET';
export const NEW_SEARCH_JOB_SETIN = 'NEW_SEARCH_JOB_SETIN';
export const NEW_SEARCH_JOB_GETDATA = 'NEW_SEARCH_JOB_GETDATA';
export const NEW_SEARCH_JOB_LOADING = 'NEW_SEARCH_JOB_LOADING';
export const NEW_SEARCH_JOB_ADVANCED = 'NEW_SEARCH_JOB_ADVANCED';
export const NEW_SEARCH_JOB_ADVINCED_RESET = 'NEW_SEARCH_JOB_ADVINCED_RESET';
export const NEW_SEARCH_JOB_PAGESIZE = 'NEW_SEARCH_JOB_PAGESIZE';
export const NEW_SEARCH_JOB_LEVEL = 'NEW_SEARCH_JOB_LEVEL';
export const NEW_SEARCH_JOB_RESET_BASE = 'NEW_SEARCH_JOB_RESET_BASE';
export const NEW_SEARCH_JOB_SORT = 'NEW_SEARCH_JOB_SORT';
export const NEW_SEARCH_JOB_GENERAL = 'NEW_SEARCH_JOB_GENERAL';
export const NEW_SEARCH_JOB_RESET_GENERAL = 'NEW_SEARCH_JOB_RESET_GENERAL';
export const NEW_SEARCH_JOB_DATACOUNT = 'NEW_SEARCH_JOB_DATACOUNT';
export const NEW_SEARCH_JOB_RESET_ADVANCED = 'NEW_SEARCH_JOB_RESET_ADVANCED';
export const NEW_SEARCH_JOB_SORT_RESET = 'NEW_SEARCH_JOB_SORT_RESET';
export const NEW_SEARCH_JOB_FAVORITE = 'NEW_SEARCH_JOB_FAVORITE';
export const NEW_SEARCH_JOB_MYORALL = 'NEW_SEARCH_JOB_MYORALL';
export const NEW_SEARCH_JOB_DATARESET = 'NEW_SEARCH_JOB_DATARESET';
export const NEW_SEARCH_JOB_STOPFLAG = 'NEW_SEARCH_JOB_STOPFLAG';

// search jobs options
export const NEW_SEARCH_OPTIONS = 'NEW_SEARCH_OPTIONS';

// candidate select options
export const CANDIDATE_OPTIONS = 'CANDIDATE_OPTIONS';

// new candidate dialog table
export const OPEN_ON_BOARDING = 'OPEN_ON_BOARDING';
export const NEW_CANDIDATE_MYORALL = 'NEW_CANDIDATE_MYORALL';
export const NEW_CANDIDATE_RESET_BASE = 'NEW_CANDIDATE_RESET_BASE';
export const NEW_CANDIDATE_RESET_ADVANCED = 'NEW_CANDIDATE_RESET_ADVANCED';
export const NEW_CANDIDATE_LEVEL = 'NEW_CANDIDATE_LEVEL';
export const NEW_CANDIDATE_GENERAL = 'NEW_CANDIDATE_GENERAL';
export const NEW_CANDIDATE_GENERAL_RESET = 'NEW_CANDIDATE_GENERAL_RESET';
export const NEW_CANDIDATE_ADVANCED = 'NEW_CANDIDATE_ADVANCED';
export const NEW_CANDIDATE_ADVANCED_RESET = 'NEW_CANDIDATE_ADVANCED_RESET';
export const NEW_CANDIDATE_DATA = 'NEW_CANDIDATE_DATA';
export const NEW_CANDIDATE_RESTEDATA = 'NEW_CANDIDATE_RESTEDATA';
export const NEW_CANDIDATE_LOADING = 'NEW_CANDIDATE_LOADING';
export const NEW_CANDIDATE_SORT = 'NEW_CANDIDATE_SORT';
export const NEW_CANDIDATE_PAGESIZE = 'NEW_CANDIDATE_PAGESIZE';
export const NEW_CANDIDATE_COUNT = 'NEW_CANDIDATE_COUNT';
export const NEW_CANDIDATE_RESETSORT = 'NEW_CANDIDATE_RESETSORT';
export const NEW_CANDIDATE_SELECTID = 'NEW_CANDIDATE_SELECTID';
export const NEW_CANDIDATE_SETIN = 'NEW_CANDIDATE_SETIN';
export const NEW_CANDIDATE_SEARCH = 'NEW_CANDIDATE_SEARCH';
export const NEW_CANDIDATE_DELETE = 'NEW_CANDIDATE_DELETE';
export const NEW_CANDIDATE_SARCHFLAG = 'NEW_CANDIDATE_SARCHFLAG';
export const NEW_CANDIDATE_SEARCH_RESET = 'NEW_CANDIDATE_SEARCH_RESET';
export const NEW_CANDIDATE_DETAIL = 'NEW_CANDIDATE_DETAIL';
export const NEW_CANDIDATE_SELECT_OPTION = 'NEW_CANDIDATE_SELECT_OPTION';
export const NEW_CANDIDATE_SELECT_ID = 'NEW_CANDIDATE_SELECT_ID';
export const NEW_CANDIDATE_DIALOG_USER = 'NEW_CANDIDATE_DIALOG_USER';
export const NEW_CANDIDATE_RELATIONS = 'NEW_CANDIDATE_RELATIONS';
export const NEW_CANDIDATE_RESUME = 'NEW_CANDIDATE_RESUME';
export const NEW_CANDIDATE_COUNT_RESET = 'NEW_CANDIDATE_COUNT_RESET';
export const NEW_CANDIDATE_STOPFLAG = 'NEW_CANDIDATE_STOPFLAG';
export const NEW_CANDIDATE_COMONPOOL_DATA = 'NEW_CANDIDATE_COMONPOOL_DATA';
export const NEW_CANDIDATE_COMONPOOL_RESETDATA =
  'NEW_CANDIDATE_COMONPOOL_RESETDATA';
export const NEW_CANDIDATE_PAGEMODEL = 'NEW_CANDIDATE_PAGEMODEL';
//AMreport
export const SET_AM_REPORT_JOBDATA = 'set_am_report_jobData';

export const CLEAR_AM_REPORT_JOBDATA = 'clear_am_report_jobData';

//MyPipeline
export const RECEIVE_FILTERS = 'receive_filters';
export const CLEAR_FILTERS = 'clear_filters';
export const RECEIVE_PIPELINE_LIST = 'receive_pipeline_list';
export const RECEIVE_PIPELINE_TEMPLATE = 'receive_pipeline_template';
export const CLEAR_PIPELINE_TEMPLATE = 'clear_pipeline_template';
export const UPDATE_PIPELINE_TEMPLATE = 'update_pipeline_template';
export const CLEAR_PIPELINE_LIST = 'clear_pipeline_list';
export const RECEIVE_PIPELINE_MAIN_FILTER = 'receive_pipeline_main_filter';
export const CLEAR_PIPELINE_MAIN_FILTER = 'clear_pipeline_main_filter';

export const SET_TENANT_MONTHLY_CREDIT = 'set_tenant_monthly_credit';
export const SET_TENANT_BULK_CREDIT = 'set_tenant_bulk_credit';
export const SET_TOTALMONTHLY_CREDIT = 'set_totalmonthly_credit';
export const SET_NEXT_MONTHLY_CREDIT = 'set_next_monthly_credit';

//job_talent_pool
export const RECEIVE_JOB_TALENT_POOL = 'receive_job_talent_pool';

//新增，存储companiesOptions
export const REVEIVE_COMPANIES_OPTIONS = 'receive_companies_options';
export const ADD_BEIEFUSERS = 'add_BriefUsers';

export const SET_PREFERENCE = 'set_preference';
export const UPDATE_PREFERENCE = 'update_preference';

export const COMMON_POOL_SELECT_VALUE = 'COMMON_POOL_SELECT_VALUE';
export const COMMON_POOL_SELECT_TO_VALUE = 'COMMON_POOL_SELECT_TO_VALUE';
export const COMMON_POOL_DETAIL = 'COMMON_POOL_DETAIL';
export const COMMON_POOL_DEFULT_STATUS = 'COMMON_POOL_DEFULT_STATUS';
export const COMMON_POOL_SELECT_DEFULT_STATUS =
  'COMMON_POOL_SELECT_DEFULT_STATUS';
export const CLEAR_INTERNAL_REPORT_JOBDATA = 'CLEAR_INTERNAL_REPORT_JOBDATA';

export const SET_INTERNAL_REPORT_JOBDATA = 'SET_INTERNAL_REPORT_JOBDATA';
export const ADD_UNLOCK = 'ADD_UNLOCK';
export const COMMON_POOL_DETAILS_DATA = 'COMMON_POOL_DETAILS_DATA';
export const CREDIT_TRAN_SACTION_ID = 'CREDIT_TRAN_SACTION_ID';
export const QUERY_BALANCE = 'QUERY_BALANCE';
export const COMMON_POOL_RIGHT_FROM = 'COMMON_POOL_RIGHT_FROM';
export const ADD_COMMON_POOL_DATA_ID = 'ADD_COMMON_POOL_DATA_ID';
export const ADD_COMMON_POOL_DATA_TENLENT_ID =
  'ADD_COMMON_POOL_DATA_TENLENT_ID';
export const PURCHASE_SUCCESS = 'PURCHASE_SUCCESS';
export const COMMON_SELECT_ONE_VALUE_EMPTY = 'COMMON_SELECT_ONE_VALUE_EMPTY';
export const COMMON_SELECT_TO_VALUE_EMPTY = 'COMMON_SELECT_TO_VALUE_EMPTY';
export const ADD_REPLACE_STATUS = 'ADD_REPLACE_STATUS';
export const ADD_COMMON_POOL_EMAIL_STATUS = 'ADD_COMMON_POOL_EMAIL_STATUS';

//assignment 新增
export const RECEIVE_ASSIGNMENT_BASIC_INFO = 'receive_assignment_basic_info';
export const RECEIVE_ASSIGNMENT_DETAIL = 'receive_assignment_detail';
export const RECEIVE_ASSIGNMENT_CURRENT_LIST =
  'receive_assignment_current_list';
export const RECEIVE_PAY_LIST = 'receive_pay_list';
export const RECEIVE_LAST_ASSIGNMENT_DETAIL = 'RECEIVE_LAST_ASSIGNMENT_DETAIL';

// documentView
export const DOCUMENT_REGULAR_SEARCH = 'DOCUMENT_REGULAR_SEARCH';
export const DOCUMENT_DELETE_SEARCH = 'DOCUMENT_DELETE_SEARCH';
export const DOCUMENT_CLEAR_ALL = 'DOCUMENT_CLEAR_ALL';
export const DOCUMENT_SAVE_FILTERS_NAME = 'DOCUMENT_SAVE_FILTERS_NAME';
export const DOCUMENT_INTERFACE = 'DOCUMENT_INTERFACE';
export const DOCUMENT_INTERFACE_DELETE_SEARCH =
  'DOCUMENT_INTERFACE_DELETE_SEARCH';
export const DOCUMENT_INTERFACE_CLEAR_ALL = 'DOCUMENT_INTERFACE_CLEAR_ALL';
export const DOCUMENT_FROM_DATA = 'DOCUMENT_FROM_DATA';
export const DOCUMENT_LODING = 'DOCUMENT_LODING';
export const DOCUMENT_LODING_FALSE = 'DOCUMENT_LODING_FALSE';
export const DOCUMENT_COUNT = 'DOCUMENT_COUNT';
export const DOCUMENT_SORT = 'DOCUMENT_SORT';
export const DOCUMENT_PACKAGE_REGULAR_SEARCH =
  'DOCUMENT_PACKAGE_REGULAR_SEARCH';
export const PACKAGE_INTERFACE = 'PACKAGE_INTERFACE';
export const PACKAGE_FROM_DATA = 'PACKAGE_FROM_DATA';
export const PACKAGE_COUNT = 'PACKAGE_COUNT';
export const PACKAGE_DELETE_SEARCH = 'PACKAGE_DELETE_SEARCH';
export const PACKAGE_INTERFACE_DELETE_SEARCH =
  'PACKAGE_INTERFACE_DELETE_SEARCH';
export const PACKAGE_CLEAR_ALL = 'PACKAGE_CLEAR_ALL';
export const PACKAGE_INTERFACE_CLEAR_ALL = 'PACKAGE_INTERFACE_CLEAR_ALL';
export const PACKAGE_SAVE_FILTERS_NAME = 'PACKAGE_SAVE_FILTERS_NAME';
export const TABS_VALUE = 'TABS_VALUE';
// CommonPool新增排序判断
export const ORDER_STATES = 'ORDER_STATES';
// UnSelect第一个选择框新增排序判断
export const UN_SELECT_STATUS = 'UN_SELECT_STATUS';
// 新增commonPool第二个选择标识
export const SELECT_TO_STATUS = 'SELECT_TO_STATUS';
export const SELECT_TO_STATUS_EMPTY = 'SELECT_TO_STATUS_EMPTY';
export const ORDER_STATES_DELETE = 'ORDER_STATES_DELETE';
export const FILTER_ARR_INDEX = 'FILTER_ARR_INDEX';
export const GENER_VALUE_TO = 'GENER_VALUE_TO';

export const LANGUAGE_ZH = 'LANGUAGE_ZH';
export const LANGUAGE_EN = 'LANGUAGE_EN';

export const CANDIDATES_ID_STATUS = 'CANDIDATES_ID_STATUS';
export const APP_LICATION_ID = 'APP_LICATION_ID';
export const BASIC_INFORMATION_DETAILS = 'BASIC_INFORMATION_DETAILS';
export const ADDRES_ID = 'ADDRES_ID';

export const TAB_SELECT = 'TAB_SELECT';
export const COMPONENT_STATUS = 'COMPONENT_STATUS';

import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import DropDownBtn from './components/dropDownBtn';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Badge from '@material-ui/core/Badge';
import FormInput from '../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import DatePicker from 'react-datepicker';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import memoizeOne from 'memoize-one';
import { getClientContactList } from '../../../actions/clientActions';
import {
  getHasApprovedClientContactByCompany,
  getClientContactArrayByCompany,
} from '../../../selectors/clientSelector';

import BillCard from './BillCard';
import PayCard from './PayCard';
import lodash from 'lodash';
import Immutable from 'immutable';
import moment from 'moment-timezone';

import {
  saveAssignment,
  getAssignmentCurrent,
} from '../../../actions/assignment';

import Loading from '../../../components/particial/Loading';
import Dialog from '@material-ui/core/Dialog';

import { showSuccessMessage, showErrorMessage } from '../../../actions';

const assignment = null;

const styles = {
  root: {
    width: '100%',
    height: '100%',
  },
  assignmentOption: {
    width: '100%',
    height: '200px',
    padding: '10px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  mleft: {
    marginLeft: '10px',
  },
  btns: {
    '& .MuiButton-root': {
      minWidth: '48px',
      minHeight: '48px',
    },
  },
  btnOpen: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3cba92',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#7af1cb',
    },
  },
  btnOpen1: {
    width: '48px',
    height: '48px',
    backgroundColor: '#f6d365',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#f6e5af',
    },
  },
  btnOpen2: {
    width: '48px',
    height: '48px',
    backgroundColor: '#3398dc',
    color: '#fff',
    marginLeft: '10px',
    '&:hover': {
      width: '48px',
      height: '48px',
      backgroundColor: '#68bdf7',
    },
  },
  btnDisabled: {
    width: '48px',
    height: '48px',
    backgroundColor: '#e8e8e8',
    color: '#999',
    marginLeft: '10px',
  },
  assignmentBillPay: {
    width: '100%',
    marginTop: '20px',
  },
};

const billingInforMation = [
  'BillRate',
  'contactId',
  'overTimeBillRate',
  'DoubleTimeBillRate',
  'PaymentTerms',
  'invoiceContent',
];
const workingInformation = ['location'];
const assignUser = ['assignedUser'];

class AssignmentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignment: null,
      status: 'PENDING',
      // bill: assignment,
      isExempt: false,
      payRate: null,
      errorMessage: Immutable.Map(),
      startDate:
        this.props.assignment && this.props.createPageType !== 'ASSIGNMENT'
          ? moment(this.props.assignment.startDate)
          : this.props.currentStart &&
            moment(this.props.currentStart.get('startDate')),
      endDate:
        this.props.assignment && this.props.createPageType !== 'ASSIGNMENT'
          ? moment(this.props.assignment.endDate)
          : this.props.currentStart &&
            moment(this.props.currentStart.get('endDate')),
      loading: false,
    };
    this.billForm = React.createRef();
  }
  componentDidMount() {
    const { currentStart, dispatch } = this.props;
    dispatch(getClientContactList(currentStart.get('companyId')));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.assignment) {
      this.setState({
        startDate: nextProps.assignment.startDate
          ? moment(nextProps.assignment.startDate)
          : this.props.currentStart &&
            moment(this.props.currentStart.get('startDate')),
        endDate: nextProps.assignment.endDate
          ? moment(nextProps.assignment.endDate)
          : this.props.currentStart &&
            moment(this.props.currentStart.get('endDate')),
        status: nextProps.assignment.status
          ? nextProps.assignment.status
          : 'PENDING',
        type: nextProps.assignment.type,
        createType: nextProps.assignment.type,
        isExempt: nextProps.assignment.billInfo
          ? nextProps.assignment.billInfo.isExcept
          : false,
      });
    }
  }

  handleChecked = (event) => {
    if (event.target.checked === true) {
      this.setState({
        status: 'APPROVED',
      });
    } else {
      this.setState({
        status: 'PENDING',
      });
    }
  };
  changeExempt = () => {
    this.setState({
      isExempt: !this.state.isExempt,
    });
  };
  save = () => {
    const { currentStart, t, dispatch, createPageType } = this.props;
    const { status, startDate, endDate, isExempt } = this.state;
    let billForm = this.billForm.current;
    let approversValue = JSON.parse(billForm.approvers.value);
    let _approvers = approversValue.length > 0 ? approversValue : null;
    let approvers = _approvers
      ? _approvers.map((item, index) => {
          return Number(item);
        })
      : null;
    let amUserList = JSON.parse(billForm.AmUserList.value);
    let otherList = JSON.parse(billForm.otherList.value);
    if (status === 'APPROVED') {
      let errorMessage = this.validateForm(billForm, t);
      this.scrollToAnchor(errorMessage);
      if (errorMessage.size > 0) {
        this.props.dispatch(
          showErrorMessage('The form is incomplete. Please complete the form')
        );
        return this.setState({ errorMessage });
      }
    } else {
      let errorMessage = this.validateForm_1(billForm, t);
      this.scrollToAnchor(errorMessage);
      if (errorMessage.size > 0) {
        this.props.dispatch(
          showErrorMessage('The form is incomplete. Please complete the form')
        );
        return this.setState({ errorMessage });
      }
    }

    let obj = {
      startId: currentStart.get('id'),
      talentId: currentStart.get('talentId'),
      status: status,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      type: createPageType,
      jobId: currentStart.get('jobId'),
      companyId: currentStart.get('companyId'),
      billInfo: {
        contactId:
          billForm.BillingContact.value !== ''
            ? Number(billForm.BillingContact.value)
            : null,
        isExcept: isExempt,
        groupInvoiceType: billForm.GroupInvoiceby.value,
        overtimeType: billForm.Overtime.value,
        groupInvoiceContent: billForm.groupInvoiceContent
          ? billForm.groupInvoiceContent.value
          : null,
        invoiceContentType: billForm.invoiceContentType
          ? billForm.invoiceContentType.value
          : null,
        expenseInvoice: billForm.ExpenseInvoices.value,
        discountType: billForm.DefaultDiscount.value,
        paymentTerms: billForm.PaymentTerms.value,
        payRateInfo: [
          {
            payRate: Number(billForm.BillRate.value),
            currency: billForm.currency.value,
            timeUnit: billForm.billRateTimeUnit.value,
            type: 'BILL_RATE',
          },
          {
            payRate:
              billForm.OvertimeBillRate.value !== ''
                ? Number(billForm.OvertimeBillRate.value)
                : null,
            currency: billForm.currency.value,
            timeUnit: 'HOURLY',
            type: 'OVER_TIME',
          },
          {
            payRate:
              billForm.DoubleTimeBillRate.value !== ''
                ? Number(billForm.DoubleTimeBillRate.value)
                : null,
            currency: billForm.currency.value,
            timeUnit: 'HOURLY',
            type: 'DOUBLE_TIME',
          },
        ],
        netBillRate: billForm.netBillRate.value
          ? this.fliterRate(billForm.netBillRate.value)
          : null,
        netOverTimeRate: billForm.netOverTimeRate.value
          ? this.fliterRate(billForm.netOverTimeRate.value)
          : null,
        netDoubleTimeRate: billForm.netDoubleTimeRate.value
          ? this.fliterRate(billForm.netDoubleTimeRate.value)
          : null,
      },
      timeSheet: {
        approvers: approvers,
        timeSheetType: billForm.TimesheetEntryFormat.value,
        frequency: billForm.Frequency.value,
        weekEnding: billForm.WeekEnding.value,
        allowSubmitTimeSheet: billForm.TimesheetsProtal.value,
        allowSubmitExpense: billForm.ExpensesProtal.value,
        instructions: billForm.note ? billForm.note.value : null,
      },
      workLocation: {
        location: billForm.location.value
          ? JSON.parse(billForm.location.value).city
            ? JSON.parse(billForm.location.value)
            : null
          : null,
        detailedAddress: billForm.WorkingAddress.value,
        zipCode: billForm.ZipCode.value,
      },
      userInfo: [...amUserList, ...otherList],
      payInfo: {
        employmentCategory: billForm.EmploymentCategory.value,
        comments: billForm.comments.value,
        isExcept: isExempt,
        payRateInfo: [
          {
            payRate: Number(billForm.PayRate.value),
            currency: billForm.payCurrency.value,
            timeUnit: billForm.payTimeUnit.value,
            type: 'PAY_RATE',
          },
          {
            payRate:
              billForm.OvertimePayRate.value !== ''
                ? Number(billForm.OvertimePayRate.value)
                : null,
            currency: billForm.payCurrency.value,
            timeUnit: 'HOURLY',
            type: 'OVER_TIME',
          },
          {
            payRate:
              billForm.DoubleTimePayRate.value !== ''
                ? Number(billForm.DoubleTimePayRate.value)
                : null,
            currency: billForm.payCurrency.value,
            timeUnit: 'HOURLY',
            type: 'DOUBLE_TIME',
          },
        ],
      },
    };
    this.setState({
      loading: true,
    });
    dispatch(saveAssignment(obj))
      .then((res) => {
        this.setState({
          errorMessage: Immutable.Map(),
        });
        if (res) {
          this.setState({
            loading: false,
          });
          let startId = currentStart.get('id');
          dispatch(getAssignmentCurrent(startId));
          this.props.history.push({
            pathname: `/candidates/assignment/${res}`,
            state: { pageType: 'default' },
          });
        }
      })
      .catch((error) => {
        dispatch(showErrorMessage(error));
        this.setState({
          loading: false,
        });
      });
  };
  hourRate = (num, type) => {
    switch (type) {
      case 'YEARLY':
        return num / 2080;
      case 'WEEKLY':
        return num / 40;
      case 'DAILY':
        return num / 8;
      case 'MONTHLY':
        return (num * 12) / 2080;
      case 'HOURLY':
        return num;
    }
  };
  validateForm_1 = (billForm, t) => {
    const { currentStart } = this.props;
    let reg = /^\d+(\.\d{0,2})?$/;
    let reg_1 = /^[1-9]\d*$/;
    let amUserList = JSON.parse(billForm.AmUserList.value);
    let otherList = JSON.parse(billForm.otherList.value);
    let userInfo = [...amUserList, ...otherList];
    let errorMessage = Immutable.Map();
    console.log(billForm.location.value);
    if (billForm.BillRate.value && !reg.test(billForm.BillRate.value)) {
      errorMessage = errorMessage.set(
        'BillRate',
        t('message:BillRateIsNotFilledInProperly')
      );
    }
    if (billForm.currency.value !== billForm.payCurrency.value) {
      errorMessage = errorMessage.set(
        'CurrencyError',
        t('message:CurrencyError')
      );
    }

    if (billForm.billRateTimeUnit.value !== billForm.payTimeUnit.value) {
      errorMessage = errorMessage.set(
        'TimeUnitError',
        t('message:TimeUnitError')
      );
    }

    if (
      (billForm.GroupInvoiceby.value === 'CUSTOM' ||
        billForm.GroupInvoiceby.value === 'PO' ||
        billForm.GroupInvoiceby.value === 'CUSTOM_REF') &&
      !billForm.groupInvoiceContent.value
    ) {
      errorMessage = errorMessage.set(
        'groupInvoiceContent',
        t('message:groupInvoiceContentisRequired')
      );
    }

    if (
      billForm.OvertimeBillRate.value &&
      !reg.test(billForm.OvertimeBillRate.value)
    ) {
      errorMessage = errorMessage.set(
        'overTimeBillRate',
        t('message:overTimeBillRateIsNotFilledInProperly')
      );
    }

    if (
      billForm.DoubleTimeBillRate.value &&
      !reg.test(billForm.DoubleTimeBillRate.value)
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimeBillRate',
        t('message:DoubleTimeBillRateIsNotFilledInProperly')
      );
    }

    if (
      billForm.PaymentTerms.value &&
      !reg_1.test(billForm.PaymentTerms.value)
    ) {
      errorMessage = errorMessage.set(
        'PaymentTerms',
        t('message:PaymentTermsError')
      );
    }
    // if (!billForm.DoubleTimeBillRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'DoubleTimeBillRate',
    //     t('message:DoubleTimeBillRateIsRequired')
    //   );
    // }

    // if (!billForm.OvertimeBillRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'overTimeBillRate',
    //     t('message:OverTimeBillRateIsRequired')
    //   );
    // }
    // if (!billForm.OvertimePayRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'OvertimePayRate',
    //     t('message:OvertimePayRateIsRequired')
    //   );
    // }
    // if (!billForm.DoubleTimePayRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'DoubleTimePayRate',
    //     t('message:DoubleTimePayRateIsRequired')
    //   );
    // }

    if (
      billForm.OvertimeBillRate.value &&
      Number(billForm.OvertimeBillRate.value) <
        this.hourRate(
          Number(billForm.BillRate.value),
          billForm.billRateTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'overTimeBillRate',
        t('message:overTimeBillRateError')
      );
    }
    if (
      billForm.DoubleTimeBillRate.value &&
      Number(billForm.DoubleTimeBillRate.value) <
        this.hourRate(
          Number(billForm.BillRate.value),
          billForm.billRateTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimeBillRate',
        t('message:DoubleTimeBillRateError')
      );
    }

    let userInfoError = userInfo.some((item, index) => {
      return !item.userRole || !item.userId || !item.percentage;
    });
    if (userInfoError) {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:assignedUserError')
      );
    }

    if (
      billForm.location.value &&
      JSON.parse(billForm.location.value).location &&
      JSON.parse(billForm.location.value).location !== ''
    ) {
      errorMessage = errorMessage.set(
        'location',
        t('message:workingLocationError')
      );
    }

    let totalSplit = 0;
    userInfo.forEach((item, index) => {
      totalSplit += Number(item.percentage);
    });
    let status = this.checkRepeat(userInfo);
    if (totalSplit !== 100 && currentStart.get('positionType') !== 'PAY_ROLL') {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:ContributionSplitError')
      );
    }
    if (status) {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:Amselectionrepeat')
      );
    }

    if (billForm.PayRate.value && !reg.test(billForm.PayRate.value)) {
      errorMessage = errorMessage.set(
        'PayRate',
        t('message:PayRateIsNotFilledInProperly')
      );
    }

    if (
      billForm.OvertimePayRate.value &&
      !reg.test(billForm.OvertimePayRate.value)
    ) {
      errorMessage = errorMessage.set(
        'OvertimePayRate',
        t('message:OvertimePayRateIsNotFilledInProperly')
      );
    }

    if (
      billForm.DoubleTimePayRate.value &&
      !reg.test(billForm.DoubleTimePayRate.value)
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimePayRate',
        t('message:DoubleTimePayRateIsNotFilledInProperly')
      );
    }

    if (
      billForm.DoubleTimePayRate.value &&
      Number(billForm.DoubleTimePayRate.value) <
        this.hourRate(
          Number(billForm.PayRate.value),
          billForm.payTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimePayRate',
        t('message:DoubleTimePayRateError')
      );
    }

    if (
      billForm.OvertimePayRate.value &&
      Number(billForm.OvertimePayRate.value) <
        this.hourRate(
          Number(billForm.PayRate.value),
          billForm.payTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'OvertimePayRate',
        t('message:OvertimePayRateError')
      );
    }

    return errorMessage.size > 0 && errorMessage;
  };
  validateForm = (billForm, t) => {
    const { currentStart } = this.props;
    console.log(currentStart);
    let reg = /^\d+(\.\d{0,2})?$/;
    let reg_1 = /^[1-9]\d*$/;
    let amUserList = JSON.parse(billForm.AmUserList.value);
    let otherList = JSON.parse(billForm.otherList.value);
    let userInfo = [...amUserList, ...otherList];
    let errorMessage = Immutable.Map();
    if (!billForm.BillingContact.value) {
      errorMessage = errorMessage.set(
        'contactId',
        t('message:contactIdIsRequired')
      );
    }
    if (
      (billForm.GroupInvoiceby.value === 'CUSTOM' ||
        billForm.GroupInvoiceby.value === 'PO' ||
        billForm.GroupInvoiceby.value === 'CUSTOM_REF') &&
      !billForm.groupInvoiceContent.value
    ) {
      errorMessage = errorMessage.set(
        'groupInvoiceContent',
        t('message:groupInvoiceContentisRequired')
      );
    }
    if (!billForm.BillRate.value) {
      errorMessage = errorMessage.set(
        'BillRate',
        t('message:BillRateIsRequired')
      );
    }
    if (billForm.currency.value !== billForm.payCurrency.value) {
      errorMessage = errorMessage.set(
        'CurrencyError',
        t('message:CurrencyError')
      );
    }

    if (billForm.billRateTimeUnit.value !== billForm.payTimeUnit.value) {
      errorMessage = errorMessage.set(
        'TimeUnitError',
        t('message:TimeUnitError')
      );
    }
    if (billForm.BillRate.value && !reg.test(billForm.BillRate.value)) {
      errorMessage = errorMessage.set(
        'BillRate',
        t('message:BillRateIsNotFilledInProperly')
      );
    }

    if (!billForm.OvertimeBillRate.value && this.state.isExempt === false) {
      errorMessage = errorMessage.set(
        'overTimeBillRate',
        t('message:OverTimeBillRateIsRequired')
      );
    }

    if (
      billForm.OvertimeBillRate.value &&
      !reg.test(billForm.OvertimeBillRate.value)
    ) {
      errorMessage = errorMessage.set(
        'overTimeBillRate',
        t('message:overTimeBillRateIsNotFilledInProperly')
      );
    }
    if (
      billForm.OvertimeBillRate.value &&
      Number(billForm.OvertimeBillRate.value) <
        this.hourRate(
          Number(billForm.BillRate.value),
          billForm.billRateTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'overTimeBillRate',
        t('message:overTimeBillRateError')
      );
    }
    if (
      billForm.DoubleTimeBillRate.value &&
      Number(billForm.DoubleTimeBillRate.value) <
        this.hourRate(
          Number(billForm.BillRate.value),
          billForm.billRateTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimeBillRate',
        t('message:DoubleTimeBillRateError')
      );
    }
    // if (!billForm.DoubleTimeBillRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'DoubleTimeBillRate',
    //     t('message:DoubleTimeBillRateIsRequired')
    //   );
    // }

    if (
      billForm.DoubleTimeBillRate.value &&
      !reg.test(billForm.DoubleTimeBillRate.value)
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimeBillRate',
        t('message:DoubleTimeBillRateIsNotFilledInProperly')
      );
    }
    // if (!billForm.PaymentTerms.value) {
    //   errorMessage = errorMessage.set(
    //     'PaymentTerms',
    //     t('message:PaymentTermsIsRequired')
    //   );
    // }
    if (
      billForm.PaymentTerms.value &&
      !reg_1.test(billForm.PaymentTerms.value)
    ) {
      errorMessage = errorMessage.set(
        'PaymentTerms',
        t('message:PaymentTermsError')
      );
    }
    if (!billForm.location.value) {
      errorMessage = errorMessage.set(
        'location',
        t('message:workingLocationIsRequired')
      );
    }
    if (
      (billForm.location.value &&
        JSON.parse(billForm.location.value).city === '') ||
      (billForm.location.value && !JSON.parse(billForm.location.value).city)
    ) {
      errorMessage = errorMessage.set(
        'location',
        t('message:workingLocationIsRequired')
      );
    }
    if (
      billForm.location.value &&
      JSON.parse(billForm.location.value).location &&
      JSON.parse(billForm.location.value).location !== ''
    ) {
      errorMessage = errorMessage.set(
        'location',
        t('message:workingLocationError')
      );
    }
    let userInfoError = userInfo.some((item, index) => {
      return !item.userRole || !item.userId || !item.percentage;
    });
    if (userInfoError) {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:assignedUserError')
      );
    }

    let totalSplit = 0;
    userInfo.forEach((item, index) => {
      totalSplit += Number(item.percentage);
    });
    let status = this.checkRepeat(userInfo);
    if (totalSplit !== 100 && currentStart.get('positionType') !== 'PAY_ROLL') {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:ContributionSplitError')
      );
    }

    if (status) {
      errorMessage = errorMessage.set(
        'assignedUser',
        t('message:Amselectionrepeat')
      );
    }

    if (!billForm.PayRate.value) {
      errorMessage = errorMessage.set(
        'PayRate',
        t('message:PayRateIsRequired')
      );
    }
    if (billForm.PayRate.value && !reg.test(billForm.PayRate.value)) {
      errorMessage = errorMessage.set(
        'PayRate',
        t('message:PayRateIsNotFilledInProperly')
      );
    }

    if (!billForm.OvertimePayRate.value && this.state.isExempt === false) {
      errorMessage = errorMessage.set(
        'OvertimePayRate',
        t('message:OvertimePayRateIsRequired')
      );
    }

    if (
      billForm.OvertimePayRate.value &&
      !reg.test(billForm.OvertimePayRate.value)
    ) {
      errorMessage = errorMessage.set(
        'OvertimePayRate',
        t('message:OvertimePayRateIsNotFilledInProperly')
      );
    }

    // if (!billForm.DoubleTimePayRate.value && this.state.isExempt === false) {
    //   errorMessage = errorMessage.set(
    //     'DoubleTimePayRate',
    //     t('message:DoubleTimePayRateIsRequired')
    //   );
    // }

    if (
      billForm.DoubleTimePayRate.value &&
      Number(billForm.DoubleTimePayRate.value) <
        this.hourRate(
          Number(billForm.PayRate.value),
          billForm.payTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimePayRate',
        t('message:DoubleTimePayRateError')
      );
    }

    if (
      billForm.OvertimePayRate.value &&
      Number(billForm.OvertimePayRate.value) <
        this.hourRate(
          Number(billForm.PayRate.value),
          billForm.payTimeUnit.value
        )
    ) {
      errorMessage = errorMessage.set(
        'OvertimePayRate',
        t('message:OvertimePayRateError')
      );
    }

    if (
      billForm.DoubleTimePayRate.value &&
      !reg.test(billForm.DoubleTimePayRate.value)
    ) {
      errorMessage = errorMessage.set(
        'DoubleTimePayRate',
        t('message:DoubleTimePayRateIsNotFilledInProperly')
      );

      if (billForm.invoiceContent && !billForm.invoiceContent.value) {
        errorMessage = errorMessage.set(
          'invoiceContent',
          t('message:invoiceContentIsRequired')
        );
      }
    }

    return errorMessage.size > 0 && errorMessage;
  };

  removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  //滚动条滚动
  scrollToAnchor = (errorMessage) => {
    if (errorMessage.size > 0) {
      let keys = Object.keys(errorMessage.toJS());
      let billingInformationStatus = this.arrayAlignment(
        keys,
        billingInforMation
      );
      let workingInformationStatus = this.arrayAlignment(
        keys,
        workingInformation
      );
      let assignUserStatus = this.arrayAlignment(keys, assignUser);

      if (billingInformationStatus) {
        console.log(BillCard);
        let anchorElement = document.getElementById('billingInforMation');
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else if (!billingInformationStatus && workingInformationStatus) {
        let anchorElement = document.getElementById('workingInformation');
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      } else if (
        !billingInformationStatus &&
        !workingInformationStatus &&
        assignUserStatus
      ) {
        let anchorElement = document.getElementById('assignUser');
        if (anchorElement) {
          anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    }
  };

  arrayAlignment = (arr1, arr2) => {
    for (var i = 0; i < arr1.length; i++) {
      if (arr2.indexOf(arr1[i]) > 0) return true;
    }
  };

  fliterRate = (val) => {
    let index = val.indexOf('/');
    let newVal = lodash.cloneDeep(val);
    let _val;
    if (newVal.indexOf('C$') !== -1) {
      _val = newVal.slice(1, index).slice(1);
    } else {
      _val = newVal.slice(1, index);
    }

    return Number(_val).toFixed(2);
  };
  getPayRate = (val) => {
    this.setState({
      payRate: val,
    });
  };
  getPageType = () => {
    const { createPageType, assignment } = this.props;
    switch (createPageType) {
      case 'ASSIGNMENT':
        return 'New Assignment';
      case 'EXTENSION':
        switch (assignment.order) {
          case 0:
            return `Assignment(Extension)`;
          default:
            return `Assignment(Extension ${assignment.order + 1})`;
        }
      case 'RATE_CHANGE':
        return `Assignment(Rate Change)`;
    }
  };
  handleMenuItemClick = (index) => {
    const { dispatch, currentStart } = this.props;
    if (index === 0) {
      // this.setState({
      //   createType: 'EXTENSION'
      // })
      this.props.history.push({
        pathname: `/candidates/CreateAssignment/${'EXTENSION'}`,
        state: { pageType: 'default' },
      });
    } else {
      // this.setState({
      //   createType: 'RATE_CHANGE'
      // })
      this.props.history.push({
        pathname: `/candidates/CreateAssignment/${'RATE_CHANGE'}`,
        state: { pageType: 'default' },
      });
    }
    // dispatch(getLatestAssignment(currentStart.get('id')))
  };

  // timeJudge = (endDate) => {
  //   let newDate = new Date().getTime();
  //   // let startDate = moment(obj.startDate).valueOf()
  //   let _endDate = moment(endDate).valueOf();
  //   if (newDate > _endDate) {
  //     return false;
  //   }
  //   return true;
  // };
  cancel = () => {
    const { currentStart } = this.props;
    this.props.history.push(
      `/candidates/detail/${currentStart.get('talentId')}`
    );
  };
  timeJudge = (date) => {
    const { assignment } = this.props;
    const { status } = this.state;
    let newDate = new Date().getTime();
    let endDate = moment(date)
      .add(23, 'hours')
      .add(59.999999, 'minutes')
      .valueOf();
    if (newDate > endDate && status !== 'PENDING') {
      return false;
    }
    return true;
  };

  checkRepeat(arr) {
    var array = [];
    arr.forEach((item) => {
      array.push(item.userId + item.userRole);
    });
    if (new Set(array).size != arr.length) {
      return true;
    }
    return false;
  }
  render() {
    const {
      classes,
      t,
      location,
      assignmentBasicInfor,
      clientList,
      currentStart,
      createPageType,
      assignment,
      contactsList,
    } = this.props;
    const { status, startDate, endDate, loading } = this.state;
    let editType = this.timeJudge(endDate);
    console.log(clientList);
    return (
      <div className={classes.root}>
        <Paper>
          <Tabs value={0} indicatorColor="primary" textColor="primary">
            <Tab label="Assignment" />
          </Tabs>

          <div className={classes.assignmentOption}>
            <div className={classes.title}>
              <Typography variant="h6">{this.getPageType()}</Typography>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <DropDownBtn
                  disabled={createPageType === 'ASSIGNMENT'}
                  handleMenuItemClick={(index) => {
                    this.handleMenuItemClick(index);
                  }}
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.mleft}
                  disabled={
                    createPageType === 'ASSIGNMENT' ||
                    createPageType === 'EXTENSION' ||
                    createPageType === 'RATE_CHANGE' ||
                    assignmentBasicInfor.assignmentCount === 1
                  }
                >
                  Delete Assignment
                </Button>
              </Grid>
              <Grid
                item
                xs={4}
                container
                direction="row"
                justifyContent="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!status || status === 'PENDING' ? false : true}
                      onChange={this.handleChecked}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Approve"
                />
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  style={{ height: '40px' }}
                  onClick={() => {
                    this.cancel();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className={classes.mleft}
                  style={{ height: '40px' }}
                  onClick={() => {
                    this.save();
                  }}
                >
                  Save
                </Button>
              </Grid>
              <Grid
                item
                xs={4}
                container
                direction="row"
                justifyContent="flex-end"
                className={classes.btns}
              >
                {assignmentBasicInfor.assignmentCount > 0 &&
                createPageType !== 'ASSIGNMENT' ? (
                  <Badge
                    badgeContent={assignmentBasicInfor.assignmentCount}
                    color="secondary"
                  >
                    <Button
                      className={classes.btnOpen}
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/candidates/billHistory',
                          state: { pageType: 'history' },
                        });
                      }}
                    >
                      Bill
                    </Button>
                  </Badge>
                ) : (
                  <Button className={classes.btnDisabled} disabled>
                    Bill
                  </Button>
                )}
                {assignmentBasicInfor.assignmentCount > 0 &&
                createPageType !== 'ASSIGNMENT' ? (
                  <Badge
                    badgeContent={assignmentBasicInfor.assignmentCount}
                    color="secondary"
                  >
                    <Button
                      className={classes.btnOpen1}
                      onClick={() => {
                        this.props.history.push({
                          pathname: '/candidates/payHistory',
                          state: { pageType: 'history' },
                        });
                      }}
                    >
                      Pay
                    </Button>
                  </Badge>
                ) : (
                  <Button className={classes.btnDisabled} disabled>
                    Pay
                  </Button>
                )}
                {assignmentBasicInfor.assignmentCount > 0 &&
                createPageType !== 'ASSIGNMENT' ? (
                  <Button className={classes.btnOpen2}>
                    <ClearAllIcon
                      onClick={() => {
                        this.props.history.push({
                          pathname: `/timesheets/Search/${currentStart.get(
                            'talentId'
                          )}`,
                        });
                      }}
                    />
                  </Button>
                ) : (
                  <Button className={classes.btnDisabled} disabled>
                    <ClearAllIcon />
                  </Button>
                )}
              </Grid>
            </Grid>
            <Typography variant="h6">General Information</Typography>
            <div className={classes.form}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <FormReactSelectContainer
                    label={t('field:Start Date')}
                    isRequired={true}
                  >
                    <DatePicker
                      placeholderText="mm/dd/yyyy"
                      selected={startDate}
                      disabled={status === 'APPROVED' && !editType}
                      minDate={
                        createPageType !== 'ASSIGNMENT'
                          ? moment(assignment.startDate)
                          : null
                      }
                      onChange={(date) => {
                        this.setState({
                          startDate: date,
                        });
                      }}
                    />
                  </FormReactSelectContainer>
                </Grid>
                <Grid item xs={3}>
                  <FormReactSelectContainer
                    label={t('field:End Date')}
                    isRequired={true}
                  >
                    <DatePicker
                      placeholderText="mm/dd/yyyy"
                      selected={endDate}
                      disabled={status === 'APPROVED' && !editType}
                      minDate={moment(startDate)}
                      onChange={(date) => {
                        this.setState({
                          endDate: date,
                        });
                      }}
                    />
                  </FormReactSelectContainer>
                </Grid>

                <Grid item xs={2}>
                  <FormInput
                    name="JobNumber"
                    label={t('field:jobNumber')}
                    value={currentStart.get('jobId')}
                    disabled
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormInput
                    name="Title"
                    label={t('field:Title')}
                    value={currentStart.get('jobTitle')}
                    disabled
                  />
                </Grid>
                <Grid item xs={2}>
                  <FormInput
                    name="Company"
                    label={t('field:Company')}
                    value={currentStart.get('company')}
                    disabled
                  />
                </Grid>
              </Grid>
            </div>
          </div>
        </Paper>
        <div className={classes.assignmentBillPay}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <BillCard
                t={t}
                talentFormRef={this.billForm}
                createdBy={
                  assignment &&
                  createPageType !== 'ASSIGNMENT' &&
                  createPageType !== 'RATE_CHANGE' &&
                  createPageType !== 'EXTENSION'
                    ? assignment.createdBy
                    : null
                }
                createdTime={
                  assignment &&
                  createPageType !== 'ASSIGNMENT' &&
                  createPageType !== 'RATE_CHANGE' &&
                  createPageType !== 'EXTENSION'
                    ? assignment.createdTime
                    : null
                }
                startId={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.startId
                    : currentStart.get('id')
                }
                talentId={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.talentId
                    : currentStart.get('talentId')
                }
                billInfo={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.billInfo
                    : null
                }
                timeSheet={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.timeSheet
                    : null
                }
                workingLocation={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.workLocation
                    : null
                }
                userInfo={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.userInfo
                    : currentStart.get('startCommissions').toJS()
                }
                pageType={location.state.pageType}
                clientList={clientList}
                contactsList={contactsList}
                isClockIn={false}
                changeExempt={this.changeExempt}
                isExempt={this.state.isExempt}
                payRate={this.state.payRate}
                errorMessage={this.state.errorMessage}
                removeErrorMsgHandler={(key) => this.removeErrorMsgHandler(key)}
                editType={editType}
                {...this.props}
              />
            </Grid>
            <Grid item xs={6}>
              <PayCard
                t={t}
                createdBy={
                  assignment &&
                  createPageType !== 'ASSIGNMENT' &&
                  createPageType !== 'RATE_CHANGE' &&
                  createPageType !== 'EXTENSION'
                    ? assignment.createdBy
                    : null
                }
                createdTime={
                  assignment &&
                  createPageType !== 'ASSIGNMENT' &&
                  createPageType !== 'RATE_CHANGE' &&
                  createPageType !== 'EXTENSION'
                    ? assignment.createdTime
                    : null
                }
                startId={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.startId
                    : currentStart.get('id')
                }
                talentId={
                  assignment && createPageType !== 'ASSIGNMENT'
                    ? assignment.talentId
                    : currentStart.get('talentId')
                }
                payInfo={assignment && assignment.payInfo}
                changeExempt={this.changeExempt}
                isExempt={this.state.isExempt}
                isClockIn={false}
                getPayRate={(val) => {
                  this.getPayRate(val);
                }}
                pageType={location.state.pageType}
                errorMessage={this.state.errorMessage}
                removeErrorMsgHandler={(key) => this.removeErrorMsgHandler(key)}
                editType={editType}
                {...this.props}
              />
            </Grid>
          </Grid>
        </div>
        <Dialog aria-labelledby="simple-dialog-title" open={loading}>
          <Loading />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, { match }) => {
  let assignmentBasicInfor = state.controller.assignment.get(
    'assignmentBasicInfor'
  );
  let createPageType = match.params.type;
  // let localStorageStart = Immutable.fromJS(JSON.parse(window.localStorage.getItem('currentStart')))
  const currentStart =
    state.controller.currentStart.size > 0
      ? state.controller.currentStart.get('start')
      : Immutable.fromJS(
          JSON.parse(window.localStorage.getItem('currentStart'))
        );
  let assignment = state.controller.assignment.get('assignmentLastDetail');

  return {
    assignmentBasicInfor,
    currentStart,
    createPageType,
    assignment,
    clientList: getHasApprovedClientContactByCompany(
      state,
      currentStart.get('companyId')
    ),
    contactsList: getClientContactArrayByCompany(
      state,
      currentStart.get('companyId')
    ),
    // getClientList(
    //   state.model.clients,
    //   currentStart && currentStart.get('clientContactId')
    // ),
  };
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStateToProps)(withStyles(styles)(AssignmentPage))
);

// const getClientList = memoizeOne((clients, clientContactId) => {
//   return clients
//     .filter((c) => c.get('id') === clientContactId)
//     .toList()
//     .toJS();
// });

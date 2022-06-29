import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {
  currency as currencyOptions,
  payRateUnitTypes,
} from '../../../constants/formOptions';
import PrimaryButton from '../../particial/PrimaryButton';
import ClearIcon from '@material-ui/icons/Clear';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { exportGenPdf } from '../../../../utils/jspdfGen';

const styles = {
  item: {
    fontSize: 14,
    color: 'red',
    fontWeight: '300',
  },
};
class FeeItemizations extends Component {
  constructor(props) {
    super(props);
  }

  handleDownload = (val) => {
    exportGenPdf(val);
  };

  changeCharge = (currency) => {
    let str = '$';
    if (currency === 'CNY') {
      str = '￥';
    } else if (currency === 'EUR') {
      str = '€';
    } else if (currency === 'GBP') {
      str = '£';
    }
    return str;
  };

  render() {
    const { t, handleRequestClose, application, classes } = this.props;
    const companyName = application.get('companyName').replaceAll(' ', '');
    const jobTitle = application.get('title');
    const candidateName = application.get('fullName');
    const signingDate = application.getIn(['offer', 'signedDate']);
    const estimateOnboardDate = application.getIn([
      'offer',
      'estimateOnboardDate',
    ]);
    const salary = application.getIn(['offer', 'salary']);
    const currency = salary.get('currency');
    const rateUnitType = salary.get('rateUnitType');
    const jobType = application.get('jobType');
    const feeCharge = application.getIn(['offer', 'feeCharge']);
    const rate = feeCharge && feeCharge.get('rate') * 100;
    const feeChargeAmount = feeCharge && feeCharge.get('amount');
    let currencyLabel = currencyOptions
      .filter((x) => x.value === currency)
      .map((x) => x.label3)[0];
    let rateUnitTypeLabel = payRateUnitTypes
      .filter((x) => x.value === rateUnitType)
      .map((x) => x.label2)[0];
    const salaryPdf = `${currencyLabel}/${rateUnitTypeLabel}`;
    const resAmount = `${this.changeCharge(currency)}${feeChargeAmount}`;
    const pdfApplication = {
      jobTitle,
      companyName,
      candidateName,
      signingDate,
      estimateOnboardDate,
      currency,
      rateUnitType,
      salaryPdf,
      rate,
      resAmount,
    };
    return (
      <div
        className="flex-child-auto flex-container flex-dir-column vertical-layout"
        style={{ overflow: 'hidden' }}
      >
        <div
          id="draggable-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            marginLeft: 15,
            marginBottom: 15,
            paddingRight: 20,
          }}
        >
          <div
            style={{
              color: '#505050',
              fontSize: 16,
              fontWeight: 600,
              marginLeft: 8,
            }}
          >
            {'收费明细'}
          </div>
          <ClearIcon onClick={handleRequestClose} fontSize="small" />
        </div>

        <Divider />
        <DialogContent>
          <div
            style={{
              color: '#505050',
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            {'基本信息'}
          </div>
          <div className="row expanded small-12">
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">公司名称 :</div>
              <div className="small-6 columns">{companyName}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">职位名称 :</div>
              <div className="small-6 columns">{jobTitle}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">候选人 :</div>
              <div className="small-6 columns">{candidateName}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns"></div>
              <div className="small-6 columns"></div>
            </div>
          </div>
          <Divider />

          <div
            style={{
              color: '#505050',
              fontSize: 16,
              fontWeight: 600,
              marginTop: 22,
              marginBottom: 16,
            }}
          >
            {'Offer信息'}
          </div>

          <div className="row expanded small-12">
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">签订日期 :</div>
              <div className="small-6 columns">{signingDate}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">预计入职日期 :</div>
              <div className="small-6 columns">{estimateOnboardDate}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">币种/类型 :</div>
              <div className="small-6 columns">
                {currencyLabel}/ {rateUnitTypeLabel}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns"></div>
              <div className="small-6 columns"></div>
            </div>
          </div>
          <Divider />
          <div
            style={{
              color: '#505050',
              fontSize: 16,
              fontWeight: 600,
              marginTop: 22,
              marginBottom: 16,
            }}
          >
            {'收费信息'}
          </div>
          <div className="row expanded small-12">
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">可收费总计 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {feeChargeAmount}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">收费比例 :</div>
              <div className="small-6 columns">
                {rate}
                {'%'}
              </div>
            </div>
            <div className="small-6 row">
              <div className="small-4 columns">最终收费账单金额 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {feeChargeAmount}
              </div>
            </div>
            <div className="small-6 row">
              <div className="small-4 columns"></div>
              <div className="small-6 columns"></div>
            </div>
          </div>
        </DialogContent>
        <Divider />

        <DialogActions>
          <div className="horizontal-layout">
            <PrimaryButton
              onClick={() => {
                this.handleDownload(pdfApplication);
              }}
            >
              {'下载'}
            </PrimaryButton>
          </div>
          <div>
            <Button variant="contained" color="primary" disableElevation>
              {'发送邮件'}
            </Button>
          </div>
        </DialogActions>
      </div>
    );
  }
}

export default withStyles(styles)(FeeItemizations);

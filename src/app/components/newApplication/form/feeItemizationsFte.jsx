import React, { Component } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {
  mapOfferLetterParams,
  swichRate,
  swichSalary,
} from '../../../../utils';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {
  currency as currencyOptions,
  payRateUnitTypes,
  ApplicationOfferSalary,
} from '../../../constants/formOptions';
import { exportGenPdf } from '../../../../utils/jspdfFte';
import PrimaryButton from '../../particial/PrimaryButton';
import ClearIcon from '@material-ui/icons/Clear';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = {
  item: {
    fontSize: 14,
    color: 'red',
    fontWeight: '300',
  },
};

// const ApplicationOfferSalary = {
//     BASE_SALARY: 'BASE_SALARY',  //'可计费基本薪资'
//     RETENTION_BONUS: 'RETENTION_BONUS', // '入职奖金',
//     SIGN_ON_BONUS: 'SIGN_ON_BONUS',  // '保留奖金',
//     ANNUAL_BONUS: 'ANNUAL_BONUS', //  '年度奖金',
//     RELOCATION_PACKAGE: 'RELOCATION_PACKAGE',//  '搬迁套餐',
//     EXTRA_FEE: 'EXTRA_FEE',  //  '额外费用',
// };
class FeeItemizations extends Component {
  constructor(props) {
    super(props);
  }

  getFTETotalAmount = (applicationFTEFee, applicationSalary, rateUnitType) => {
    let TotalBillCharge = 0; //可收费总计
    let TotalFTEChargeAmount = 0; //可计费基本薪资
    let newAmount = 0;
    applicationSalary &&
      applicationSalary.map((item) => {
        if (item.salaryType === 'BASE_SALARY') {
          TotalFTEChargeAmount = TotalFTEChargeAmount + Number(item.amount);
        }
        if (item.needCharge || item.salaryType === 'BASE_SALARY') {
          TotalBillCharge = TotalBillCharge + Number(item.amount);
        }
      });
    const annualSalary = swichSalary(TotalFTEChargeAmount, rateUnitType);
    const totalBillableAmount =
      Number(annualSalary) +
      Number(TotalBillCharge) -
      Number(TotalFTEChargeAmount);
    if (applicationFTEFee.get('feeType') === 'PERCENTAGE') {
      newAmount = (
        totalBillableAmount *
        (applicationFTEFee.get('amount') / 100)
      ).toFixed(2);
    } else {
      newAmount = applicationFTEFee.get('amount');
    }
    return newAmount;
  };

  salaryTypeGetValue = (option, label) => {
    let res = option.filter((x) => x.salaryType === label).map((s) => s.amount);
    return res[0];
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

  handleDownload = (val) => {
    exportGenPdf(val);
  };

  render() {
    const { t, handleRequestClose, application, classes } = this.props;
    const companyName = application.get('companyName').replaceAll(' ', '');
    const jobTitle = application.get('title');
    const candidateName = application.get('fullName');
    const jobType = application.get('jobType');
    const ipgOfferAcceptFteSalaryPackages = application.getIn([
      'offerAccept',
      'salaryPackages',
    ]);
    const ipgOfferBaseInfo = application.getIn([
      'offerAccept',
      'ipgOfferBaseInfo',
    ]);
    const currency = ipgOfferBaseInfo.get('currency');
    const rateUnitType = ipgOfferBaseInfo.get('rateUnitType');
    const onboardDate = ipgOfferBaseInfo.get('onboardDate');
    const warrantyEndDate = ipgOfferBaseInfo.get('warrantyEndDate');
    const salaryList =
      ipgOfferAcceptFteSalaryPackages && ipgOfferAcceptFteSalaryPackages.toJS();
    const BASE_SALARY = this.salaryTypeGetValue(salaryList, 'BASE_SALARY');
    const RETENTION_BONUS = this.salaryTypeGetValue(
      salaryList,
      'RETENTION_BONUS'
    );
    const SIGN_ON_BONUS = this.salaryTypeGetValue(salaryList, 'SIGN_ON_BONUS');
    const ANNUAL_BONUS = this.salaryTypeGetValue(salaryList, 'ANNUAL_BONUS');
    const RELOCATION_PACKAGE = this.salaryTypeGetValue(
      salaryList,
      'RELOCATION_PACKAGE'
    );
    const EXTRA_FEE = this.salaryTypeGetValue(salaryList, 'EXTRA_FEE');
    let TotalBill = 0; //可收费 + 不可收费
    let TotalBillCharge = 0; //可收费总计
    salaryList.map((item) => {
      if (item.salaryType) {
        TotalBill = TotalBill + Number(item.amount) * 1000;
      }
      if (
        (item.needCharge || item.salaryType === 'BASE_SALARY') &&
        item.salaryType
      ) {
        TotalBillCharge = TotalBillCharge + Number(item.amount) * 1000;
      }
    });
    TotalBill = TotalBill / 1000;
    TotalBillCharge = TotalBillCharge / 1000;
    let currencyLabel = currencyOptions
      .filter((x) => x.value === currency)
      .map((x) => x.label3)[0];
    let rateUnitTypeLabel = payRateUnitTypes
      .filter((x) => x.value === rateUnitType)
      .map((x) => x.label2)[0];
    //     BASE_SALARY: 'BASE_SALARY',  //'可计费基本薪资'
    //     RETENTION_BONUS: 'RETENTION_BONUS', // '入职奖金',
    //     SIGN_ON_BONUS: 'SIGN_ON_BONUS',  // '保留奖金',
    //     ANNUAL_BONUS: 'ANNUAL_BONUS', //  '年度奖金',
    //     RELOCATION_PACKAGE: 'RELOCATION_PACKAGE',//  '搬迁套餐',
    //     EXTRA_FEE: 'EXTRA_FEE',  //  '额外费用',
    const ipgOfferAcceptFteFeeCharge = application.getIn([
      'offerAccept',
      'ipgOfferAcceptFteFeeCharge',
    ]);
    const FeeAmount =
      ipgOfferAcceptFteFeeCharge.get('feeType') === 'FLAT_AMOUNT'
        ? ipgOfferAcceptFteFeeCharge.get('amount').toFixed(2)
        : (
            (TotalBillCharge * ipgOfferAcceptFteFeeCharge.get('amount')) /
            100
          ).toFixed(2);
    const FeeRatio =
      ipgOfferAcceptFteFeeCharge.get('feeType') === 'FLAT_AMOUNT'
        ? 0
        : ipgOfferAcceptFteFeeCharge.get('amount');
    const salaryPdf = `${currencyLabel}/${rateUnitTypeLabel}`;
    const BASE_SALARY_PDF = `${this.changeCharge(currency)}${
      BASE_SALARY || '0'
    }`;
    const RETENTION_BONUS_PDF = `${this.changeCharge(currency)}${
      RETENTION_BONUS || '0'
    }`;
    const SIGN_ON_BONUS_PDF = `${this.changeCharge(currency)}${
      SIGN_ON_BONUS || '0'
    }`;
    const ANNUAL_BONUS_PDF = `${this.changeCharge(currency)}${
      ANNUAL_BONUS || '0'
    }`;
    const RELOCATION_PACKAGE_PDF = `${this.changeCharge(currency)}${
      RELOCATION_PACKAGE || '0'
    }`;
    const EXTRA_FEE_PDF = `${this.changeCharge(currency)}${EXTRA_FEE || '0'}`;
    const TotalBill_PDF = `${this.changeCharge(currency)}${TotalBill.toFixed(
      2
    )}`;
    const TotalBillCharge_PDF = `${this.changeCharge(
      currency
    )}${TotalBillCharge.toFixed(2)}`;
    const FeeRatio_PDF = `${FeeRatio}${'%'}`;
    const FeeAmount_PDF = `${this.changeCharge(currency)}${FeeAmount}`;
    const pdfApplication = {
      jobTitle,
      companyName,
      candidateName,
      onboardDate,
      warrantyEndDate,
      salaryPdf,
      BASE_SALARY_PDF,
      RETENTION_BONUS_PDF,
      SIGN_ON_BONUS_PDF,
      ANNUAL_BONUS_PDF,
      RELOCATION_PACKAGE_PDF,
      EXTRA_FEE_PDF,
      TotalBill_PDF,
      TotalBillCharge_PDF,
      FeeRatio_PDF,
      FeeAmount_PDF,
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
              <div className="small-4 columns">入职日期 :</div>
              <div className="small-6 columns">{onboardDate}</div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">试用期结束 :</div>
              <div className="small-6 columns">{warrantyEndDate}</div>
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
            {'薪资结构'}
          </div>
          <div className="row expanded small-12">
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">基本薪资 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {BASE_SALARY || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">入职奖金 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {RETENTION_BONUS || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">保留奖金 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {SIGN_ON_BONUS || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">年度奖金 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {ANNUAL_BONUS || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">搬迁费用 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {RELOCATION_PACKAGE || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">额外费用 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {EXTRA_FEE || '0'}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">薪资总计 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {TotalBill.toFixed(2)}
              </div>
            </div>
            <div className="small-6 row vertical-layout">
              <div className="small-4 columns">收费部分总计 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {TotalBillCharge.toFixed(2)}
              </div>
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
            <div className="small-6 row">
              <div className="small-4 columns">收费比率 :</div>
              <div className="small-6 columns">
                {FeeRatio}
                {'%'}
              </div>
            </div>
            <div className="small-6 row">
              <div className="small-4 columns">最终收费账单金额 :</div>
              <div className="small-6 columns">
                {this.changeCharge(currency)}
                {FeeAmount}
              </div>
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
              // type="submit"
              // form="newApplicationOfferForm"
              // processing={processing}
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

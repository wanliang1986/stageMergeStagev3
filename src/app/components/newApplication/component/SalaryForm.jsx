import React from 'react';
import Immutable from 'immutable';
import Select from 'react-select';
import { connect } from 'react-redux';
import FormReactSelectContainer from '../../particial/FormReactSelectContainer';
import FormInput from '../../particial/FormInput';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Add from '@material-ui/icons/Add';
import { ApplicationOfferSalary } from '../../../constants/formOptions';
import NumberFormat from 'react-number-format';
import FormTitle from './formTitle';
import lodash from 'lodash';

const IsSalary = [
  { value: true, label: '是' },
  { value: false, label: '否' },
];

class ApplicationResultForm extends React.Component {
  constructor(props) {
    super(props);

    const { salaryList } = props;
    this.state = {
      errorMessage: Immutable.Map(),
      salaryList: salaryList
        ? salaryList
        : [{ salaryType: 'BASE_SALARY', amount: 0, needCharge: true }],
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  renderSalaryCommission = (commission) => {
    const { errorMessage, salaryList } = this.state;
    const index = salaryList.indexOf(commission);
    let SalaryOptionList = lodash.cloneDeep(ApplicationOfferSalary);
    let SalaryTypeArr = [];
    salaryList &&
      salaryList.map((item) => {
        SalaryTypeArr.push(item.salaryType);
      });
    SalaryOptionList.map((item) => {
      if (SalaryTypeArr.includes(item.value)) {
        item.disabled = true;
      }
    });
    console.log(SalaryTypeArr, SalaryOptionList);
    return (
      <div key={index} className="row expanded">
        {/* 1.收费类型 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <Select
              value={commission.salaryType}
              simpleValue
              options={SalaryOptionList}
              filterOptions={(options) => options.filter((o) => !o.disabled)}
              autoBlur
              clearable={false}
              onChange={(salaryType) => {
                commission.salaryType = salaryType || commission.salaryType;
                this.setState(
                  {
                    salaryList: salaryList.slice(),
                  },
                  () => {
                    this.props._computeFullTimeGM();
                  }
                );
              }}
            />
          </FormReactSelectContainer>
        </div>

        {/* 2.金额 */}
        <div className="small-4 columns">
          <FormReactSelectContainer>
            <NumberFormat
              thousandSeparator
              value={commission.amount}
              onValueChange={(values) => {
                commission.amount = values.value;
                this.setState(
                  {
                    salaryList: salaryList.slice(),
                  },
                  () => {
                    this.props._computeFullTimeGM();
                  }
                );
              }}
              allowNegative={false}
            />
          </FormReactSelectContainer>
        </div>

        {/* 3.是否收费 */}
        <div className="small-2 columns">
          <FormReactSelectContainer>
            <Select
              value={
                commission.salaryType === 'BASE_SALARY'
                  ? true
                  : commission.needCharge
              }
              simpleValue
              options={IsSalary}
              autoBlur
              clearable={false}
              disabled={commission.salaryType === 'BASE_SALARY'}
              onChange={(needCharge) => {
                commission.needCharge = needCharge;
                this.setState(
                  {
                    salaryList: salaryList.slice(),
                  },
                  () => {
                    this.props._computeFullTimeGM();
                  }
                );
              }}
            />
          </FormReactSelectContainer>
        </div>

        {/* 4.删除/新增一项 */}
        <div className="small-2 columns horizontal-layout align-self-top">
          {/* 删除 */}
          <IconButton
            size="small"
            disabled={
              salaryList.length <= 1 || commission.salaryType === 'BASE_SALARY'
            }
            onClick={() => {
              this.setState(
                {
                  salaryList: salaryList.filter((c) => c !== commission),
                },
                () => {
                  this.props._computeFullTimeGM();
                }
              );
            }}
          >
            <Delete />
          </IconButton>

          {/* 新增 */}
          <IconButton
            size="small"
            onClick={() => {
              salaryList.splice(index + 1, 0, {
                salaryType: null,
                amount: '',
                needCharge: true,
              });
              this.setState(
                {
                  salaryList: salaryList.slice(),
                },
                () => {
                  this.props._computeFullTimeGM();
                }
              );
            }}
          >
            <Add />
          </IconButton>
        </div>
      </div>
    );
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
    const { key, currency } = this.props;
    const { salaryList } = this.state;
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
    return (
      <div key={key}>
        <FormTitle title={'薪资结构'} />
        <div className="row expanded">
          <div className="small-4 columns">
            <FormReactSelectContainer label={'类型'} />
          </div>
          <div className="small-4 columns">
            <FormReactSelectContainer label={'金额'} />
          </div>
          <div className="small-2 columns">
            <FormReactSelectContainer label={'是否收费'} />
          </div>
          <div className="small-2 columns">
            <FormReactSelectContainer label={'操作'} />
          </div>
        </div>
        {salaryList.map((item) => {
          return this.renderSalaryCommission(item);
        })}
        <div className="row expanded">
          <div className="small-4 columns">{'薪资总计（可收费+不收费）'}</div>
          <div className="small-4 columns">
            {`${this.changeCharge(currency)} ${TotalBill.toFixed(2)}`}
          </div>
        </div>
        <div className="row expanded">
          <div className="small-4 columns">{'可收费总计'}</div>
          <div className="small-4 columns">
            {`${this.changeCharge(currency)} ${TotalBillCharge.toFixed(2)}`}
          </div>
        </div>
      </div>
    );
  }
}

function mapStoreStateToProps(state, { application }) {
  return {};
}

export default connect(mapStoreStateToProps)(ApplicationResultForm);

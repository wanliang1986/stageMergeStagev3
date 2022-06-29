import React, { Component } from 'react';
import { showErrorMessage } from '../../../actions';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import {
  getCompanyListForSale,
  getCompanyListForWeeklyNewOffer,
} from '../../../../apn-sdk';

import Select from 'react-select';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import { currency } from '../../../constants/formOptions';
import { withTranslation } from 'react-i18next';

const styles = {
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0px',
      padding: '1px !important',
    },
  },
};

class FilterBtn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevFilters: [],
      countryOpt: currency,
      clientCompanyOpt: [],
      country: 'USD',
      companies: [],
    };
  }
  onchangeHandler = (value) => {
    this.setState({ prevFilters: value });
    let companies = value.map((item) => item.value);
    this.setState({
      companies,
    });
  };

  changeCountry = (country) => {
    if (country === this.state.country) {
      return;
    }
    this.setState(
      {
        country,
        //先清空选中的公司
        prevFilters: [],
      },
      () => {
        // 切换币种时，对应的公司列表也会相对于的切换
        // 故再去调用一次getClientCompanyOpt方法
        this.getClientCompanyOpt();
      }
    );
  };

  componentDidMount() {
    this.getClientCompanyOpt();
  }

  getClientCompanyOpt = () => {
    const { country } = this.state;
    const { jobType, years, reportType } = this.props;
    (reportType !== 'Weekly'
      ? getCompanyListForSale({ country, jobType, years })
      : getCompanyListForWeeklyNewOffer({ country, jobType })
    )
      .then(({ response }) => {
        let clientCompanyOpt = response.map((company) => ({
          label: company.name,
          value: company.id,
        }));
        this.setState({
          clientCompanyOpt,
        });
      })
      //改变父组件币种
      // .then(() => {
      //   this.props.onchangeCountry(country);
      // })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
      });
  };

  clickSearch = () => {
    console.log('??');
    const { country, companies } = this.state;
    this.props.setChartData(country, companies);
  };
  render() {
    const { classes, reportType } = this.props;
    console.log(classes);
    const { prevFilters, countryOpt, clientCompanyOpt, country } = this.state;

    // mock1 如果是report type是weekly类型即p2 currency需要新增-Global（Non-China）-USD（US$）
    let _countryOpt = JSON.parse(JSON.stringify(countryOpt));
    if (reportType === 'Weekly') {
      _countryOpt.push({
        value: 'NON_CHINA',
        label3: 'Global（Non-China）-USD（US$）',
      });
    }

    return (
      <div
        className={'flex-child-auto item-padding'}
        style={{ minHeight: 210 }}
      >
        {/* Country */}
        <div className="row expanded" style={{ margin: '10px 21px' }}>
          <div className="small-2 columns">
            <FormReactSelectContainer label={this.props.t('field:Country')}>
              <Select
                labelKey={'label3'}
                options={_countryOpt}
                style={{ minWidth: 200 }}
                simpleValue
                clearable={false}
                onChange={this.changeCountry}
                value={country}
              ></Select>
            </FormReactSelectContainer>
          </div>
        </div>

        {/* Company */}
        <div className="row expanded" style={{ margin: '10px 21px' }}>
          <div className="small-2 columns">
            <label style={{ fontSize: '0.75rem' }}>
              {this.props.t('field:Client Company')}
            </label>
            <Autocomplete
              className={classes.root}
              multiple
              limitTags={2}
              style={{ minWidth: 200 }}
              ChipProps={{ size: 'small' }}
              value={prevFilters}
              onChange={(e, value) => {
                this.onchangeHandler(value);
              }}
              options={clientCompanyOpt}
              disableCloseOnSelect
              getOptionLabel={(option) => option.label}
              renderOption={(option, { selected }) => (
                <React.Fragment>
                  <Checkbox
                    color="primary"
                    size="small"
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.label}
                </React.Fragment>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label=""
                  placeholder={this.props.t('tab:select')}
                  size="small"
                />
              )}
            />
          </div>
        </div>

        <div style={{ float: 'right', marginRight: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '115px', height: '35px', paddingBottom: '10px' }}
            onClick={this.clickSearch}
          >
            {this.props.t('tab:Search')}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(FilterBtn))
);

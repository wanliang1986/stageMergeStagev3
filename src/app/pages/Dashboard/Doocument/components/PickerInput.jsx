import React, { Component } from 'react';
import { DateRangePicker } from 'rsuite';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';
import enUS from 'rsuite/lib/IntlProvider/locales/en_US';
import dateFns from 'date-fns';

import { getRanges } from '../../../../../utils';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import CustomToggleButton from '../../../../components/particial/CustomToggleButton';

const styles = {
  rsPickerMenu: {
    top: '100px',
  },
};

class PickerInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range: '',
    };
  }
  componentDidMount() {
    const { packageValueList, documentValueList, type, nameStatus } =
      this.props;
    let arr = [];
    if (nameStatus === 'documentView') {
      documentValueList.forEach((item) => {
        if (item.key === type) {
          item.values.forEach((item2) => {
            arr.push(new Date(item2.value * 1000));
          });
        }
      });

      this.setState(
        {
          range: documentValueList.length > 0 ? arr : [],
        },
        () => {
          let pickList = [];
          arr.forEach((item) => {
            let pick = moment(item).format('YYYY MM DD');
            pick = new Date(pick).getTime();
            pickList.push({ value: pick / 1000 });
          });
          this.props.pickData(pickList);
        }
      );
    } else if (nameStatus === 'packageView') {
      packageValueList.forEach((item) => {
        if (item.key === type) {
          item.values.forEach((item2) => {
            arr.push(new Date(item2.value * 1000));
          });
        }
      });
      this.setState(
        {
          range: packageValueList.length > 0 ? arr : [],
        },
        () => {
          let pickList = [];
          arr.forEach((item) => {
            let pick = moment(item).format('YYYY MM DD');
            pick = new Date(pick).getTime();
            pickList.push({ value: pick / 1000 });
          });
          this.props.pickData(pickList);
        }
      );
    }

    // const { valueList, type } = this.props;
    // let arr = [];
    // valueList.forEach((item) => {
    //   if (item.key === type) {
    //     item.values.forEach((item2) => {
    //       arr.push(new Date(item2.value * 1000));
    //     });
    //   }
    // });
    // this.setState({
    //   range: valueList.length > 0 ? arr : [],
    // });
  }
  handleDateRangeChange = (range) => {
    let pickList = [];
    range.forEach((item) => {
      let pick = moment(item).format('YYYY MM DD');
      pick = new Date(pick).getTime();
      pickList.push({ value: pick / 1000 });
    });
    this.props.pickData(pickList);
    this.setState({ range });
  };
  render() {
    const { classes } = this.props;
    const { range } = this.state;
    console.log('range', range);
    return (
      <div className="flex-container align-middle" style={{ marginBottom: 8 }}>
        <div style={{ marginRight: 20 }}>
          <FormReactSelectContainer>
            <DateRangePicker
              value={range}
              cleanable={false}
              size="md"
              style={{ height: 32, width: 320 }}
              block
              onChange={this.handleDateRangeChange}
              format="YYYY-MM-DD"
            />
          </FormReactSelectContainer>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  let documentValueList =
    state.controller.documentView.toJS().searchDataList || [];
  let packageValueList =
    state.controller.documentView.toJS().packSearchDataList || [];
  return {
    documentValueList,
    packageValueList,
  };
};
export default connect(mapStateToProps)(withStyles(styles)(PickerInput));

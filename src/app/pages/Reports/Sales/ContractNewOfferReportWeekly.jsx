import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import Bar from '../../../components/BarChart2';
import Button from '@material-ui/core/Button';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import { styles, SalesReport as columns } from '../params';
import Immutable from 'immutable';
import { sortList, getIndexList } from '../../../../utils/index';

import clsx from 'clsx';
import {
  getSalesNewOfferByWeekly,
  getSalesDetalis,
  downLoadSales,
} from '../../../../apn-sdk';
import Loading from '../../../components/particial/Loading';
import { showErrorMessage } from '../../../actions';
import { connect } from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';
import { withStyles } from '@material-ui/core/styles';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Select from 'react-select';

import FilterBtn from './FilterBtn';
import { WeeklyInitData, countryObj } from './initData';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
const styles_inside = {
  title: {
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  downLoadIcon: {
    position: 'absolute',
    top: '-27px',
    right: 6,
    color: 'rgb(170, 177, 184)',
    fontSize: '25px',
    cursor: 'pointer',
  },
  typeBlock2: {
    display: 'inline-block',
    margin: '10px 10px 10px 20px',
    minWidth: '165px',
    width: '165px',
  },
};

class ContractWeekly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colSortDirs: { null: 'null' },
      footerData: Immutable.List(),
      dataList: Immutable.List(),
      filteredIndex: Immutable.List(),
      prevFilters: [],
      isFiller: true,
      Load: false,
      loadFormList: true,
      applicationIdArr: null,
      xAxisData: [],
      serviceTypeOpt: [
        { value: 'FULL_TIME', label: 'General Recruiting (FTE)' },
        { value: 'CONTRACT', label: 'General Staffing (Contract)' },
      ],
      jobType: 'CONTRACT',
      serviceType: '',
      countryObj,
      country: 'USD',
      averageLineColor: '#fdb88e',
      targetLineColor: '#a0a3fa',
      chartPakage: {},
    };
    this.filteredList = Immutable.List();
  }
  componentDidMount() {
    this.setChartData(this.state.country, []);
  }

  setChartData = (country, companies) => {
    const { jobType } = this.state;
    this.setState({
      Load: false,
      dataList: Immutable.List(),
      country,
      companies,
    });
    let { initData1 } = WeeklyInitData;
    let newXAxisData = [];
    return getSalesNewOfferByWeekly({
      country,
      companies,
      jobType,
    })
      .then(({ response }) => {
        newXAxisData = response.map((item) => {
          let filterBillWeek = moment(item.billWeek).format('MM/DD') + '-';
          return filterBillWeek;
        });
        initData1 = response.map((item) => ({
          ...item,
          value: item.totalBillAmount,
        }));

        this.setState(
          {
            data1: initData1,
            xAxisData: newXAxisData,
          },
          () => {
            this.setState({
              Load: true,
            });
            this.getOption();
          }
        );
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({
          Load: true,
          data1: initData1,
        });
        this.getOption();
      });
  };

  getOption = () => {
    const {
      data1,
      xAxisData,
      countryObj,
      country,
      averageLineColor,
      targetLineColor,
    } = this.state;
    let chartPakage = {
      tooltip: {
        padding: 15,
        showDelay: 5, // ??????????????????????????????????????????????????????????????????ms
        trigger: 'axis',
        axisPointer: {
          // ??????????????????????????????????????????
          type: 'shadow', // ??????????????????????????????'line' | 'shadow'
        },
        // ?????????toolTip?????????
        formatter: function (params) {
          let periodWeekly_start = '';
          let periodWeekly_end = '';
          periodWeekly_start = params[0].data.billWeek;
          //    moment(params[0].data.billWeek)
          //     .subtract(1, 'days')
          //     .format('MM/DD/YYYY');
          periodWeekly_end = moment(params[0].data.billWeek)
            .add(6, 'days')
            .format('MM/DD/YYYY');
          // let showHtm = `<p>${params[0].data.billWeek}</p>`;
          let showHtm = `${periodWeekly_start} - ${periodWeekly_end}`;
          let marker = '';
          let markerColor = '';
          let markerBorder = '';
          let Pheight = '';
          for (let i = 0; i < params.length; i++) {
            markerColor =
              params[i]?.color === 'white' ? 'rgba(0,0,0,0)' : params[i].color;
            markerBorder =
              params[i]?.color === 'white'
                ? `1px solid ${params[i - 1].color}`
                : `1px solid ${params[i].color}`;
            marker = `<span style="display:inline-block;margin-right:5px; width:20px;height:10px;background-color:${markerColor};border:${markerBorder}"></span>`;
            showHtm += `<p style="height:${Pheight};">
                          ${marker}
                          Total GM:
                          ${
                            countryObj[country] +
                            params[i].data.value.toLocaleString('en-US')
                          }
                        <p/>
                       `;
          }

          return showHtm;
        }.bind(this),
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '13%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#aab1b8',
              fontSize: 12,
            },
          },

          splitLine: {
            show: false, //????????????
          },
          axisLine: {
            lineStyle: {
              color: '#aab1b8',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false, //????????????
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#aab1b8',
            },
          },
        },
      ],

      series: [
        // onboard
        {
          name: 'onboard',
          type: 'bar',
          barWidth: 18,
          barCategoryGap: '100px',
          itemStyle: {
            normal: {
              //???????????????
              color: function (params) {
                let colorList = WeeklyInitData.initChatColor();
                return colorList[params.dataIndex];
              },
              //???????????????
              borderColor: 'rgba(0,0,0,0.2)',
              label: {
                // ???????????????????????????
                show: true, //????????????
                position: 'top', //???????????????
                textStyle: {
                  //????????????
                  color: '#aab1b8',
                  fontSize: 12,
                },
                formatter: function (params) {
                  // console.log(params);
                  return (
                    countryObj[country] + params.value.toLocaleString('en-US')
                  );
                },
              },
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data1,

          //?????????????????????
          markLine: {
            silent: false,
            data: [
              // Average
              {
                type: 'average',
                // name: "?????????",
                lineStyle: {
                  color: averageLineColor,
                  // color: 'rgba(0,0,0,0)',
                },
              },

              // {
              //   name: 'target',
              //   yAxis: 600000,
              //   lineStyle: {
              //     color: targetLineColor,
              //   },
              // },
            ],
          },
        },
      ],
    };

    this.setState({
      chartPakage,
    });
  };

  // bar ????????????
  onChartClick = (detail) => {
    if (!detail.data.applicationId) {
      return false;
    }
    this.setState({
      loadFormList: false,
    });
    let applicationIdArr = detail.data.applicationId.split(',');
    let params = {
      jobType: 'CONTRACT',
      applicationIds: applicationIdArr,
      type: '1',
    };
    return getSalesDetalis(params)
      .then(({ response }) => {
        let finalyResponse = this.filterResponse(response);
        let filteredIndex = getIndexList(Immutable.fromJS(response));
        console.log(filteredIndex);
        this.setState({
          dataList: Immutable.fromJS(finalyResponse),
          filteredIndex,
          loadFormList: true,
          applicationIdArr,
        });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({
          loadFormList: true,
        });
      });
  };

  filterResponse = (response) => {
    const { countryObj, country } = this.state;
    let newRes = [];
    let positionTypeObj = {
      FULL_TIME: 'General Recruiting',
      CONTRACT: 'General Staffing',
    };
    newRes = response.map((res) => {
      return {
        ...res,
        recruiters: res.recruiters && res.recruiters.join(','),
        sourcers: res.sourcers && res.sourcers.join(','),
        endDate: res.endDate || 'N/A',
        positionType: res.positionType,

        // totalBillAmount
        totalBillAmount:
          res.totalBillAmount &&
          countryObj[country] + res.totalBillAmount.toLocaleString('en-US'),

        // revenue
        revenue:
          (res.revenue &&
            countryObj[country] + res.revenue.toLocaleString('en-US')) ||
          (res.totalBillAmount &&
            countryObj[country] + res.totalBillAmount.toLocaleString('en-US')),

        // percentageOfGmRevenue
        percentageOfGmRevenue:
          (res.percentageOfGmRevenue &&
            (res.percentageOfGmRevenue * 100).toFixed(2) + '%') ||
          '0%',
      };
    });
    return newRes;
  };

  // ????????????
  onSortChange = (columnKey, sortDir) => {
    const { filteredIndex, dataList } = this.state;
    const indexList = sortDir
      ? sortList(filteredIndex, dataList, columnKey, sortDir)
      : getIndexList(dataList);

    this.setState({
      filteredIndex: indexList,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  onchangeHandler = (value) => {
    this.setState({ prevFilters: value });
  };

  changeServiceType = (type) => {
    const { jobType } = this.state;
    const { history } = this.props;
    if (type === jobType) {
      return;
    }
    if (type === 'FULL_TIME') {
      history.push('/reports/detail/55');
    }
    if (type === 'CONTRACT') {
      history.push('/reports/detail/57');
    }
  };

  // ????????????
  downLoadForm = () => {
    const { applicationIdArr } = this.state;
    let params = {
      jobType: 'CONTRACT',
      applicationIds: applicationIdArr,
      type: '1',
    };
    return downLoadSales(params).catch((err) => {
      this.dispatch.showErrorMessage(err);
    });
  };

  // ????????????
  onchangeCountry = (country) => {
    this.setState({
      country,
    });
  };

  // ??????chart markLine??????
  setChartLineColor = (stateKey, color) => {
    this.setState(
      {
        [stateKey]: color,
      },
      () => {
        // ??????charts??????
        this.getOption();
      }
    );
  };

  render() {
    const {
      colSortDirs,
      prevFilters,
      isFiller,
      Load,
      dataList,
      loadFormList,
      filteredIndex,
      applicationIdArr,
      serviceTypeOpt,
      serviceType,
      jobType,
      chartPakage,
    } = this.state;

    const { classes } = this.props;
    if (dataList.size > 0) {
      const filteredList = filteredIndex.map((index) => dataList.get(index));
      if (!this.filteredList.equals(filteredList)) {
        this.filteredList = filteredList;
      }
    }
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div className={classes.root}>
          <div style={styles_inside.title}>
            <Typography variant="h4">
              {'Weekly New Offers Report General Staffing'}
              <Typography>
                {
                  'we use candidates??????Offer Accepted???date as reference to build up this report, and this report shows how many new offers we generate in each week'
                }
              </Typography>
            </Typography>

            {/* ???????????? */}
            <Button
              size="small"
              variant="outlined"
              style={{ backgroundColor: isFiller ? '#669df6' : '' }}
              children={
                <LocalBarIcon
                  style={{ color: '#556371', fontSize: 18 }}
                  size="small"
                />
              }
              onClick={() => {
                this.setState({
                  isFiller: !this.state.isFiller,
                });
              }}
            />
          </div>
          <Divider />
        </div>

        {/* ???????????? */}
        {isFiller && (
          <>
            <FilterBtn
              setChartData={this.setChartData}
              onchangeCountry={this.onchangeCountry}
              jobType={jobType}
              reportType="Weekly"
            />
            <Divider />
          </>
        )}

        {/* ????????????????????? */}
        <div style={styles_inside.typeBlock2}>
          <FormReactSelectContainer
            style={{ color: '#aab1b8' }}
            label="Service Type:"
          >
            <Select
              value={jobType}
              options={serviceTypeOpt}
              autoBlur={true}
              simpleValue
              clearable={false}
              onChange={this.changeServiceType}
            />
          </FormReactSelectContainer>
        </div>

        {/* ????????? */}
        <div>
          <Bar
            setChartLineColor={this.setChartLineColor}
            onChartClick={this.onChartClick}
            getOption={chartPakage}
            Load={Load}
            {...this.props}
          />
        </div>

        {/* ?????? */}
        <div
          style={{ marginTop: 20, minHeight: 500 }}
          // className={clsx('flex-child-auto', classes.contentContainer)}
        >
          {/* ???????????? */}
          {applicationIdArr && (
            <GetAppIcon
              style={styles_inside.downLoadIcon}
              onClick={this.downLoadForm}
            />
          )}
          <ReportTableSummary
            dataList={this.filteredList}
            columns={columns}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
          />
          {!loadFormList && (
            <div
              className={clsx(
                'flex-container flex-dir-column',
                classes.contentMask
              )}
            >
              <Loading />
            </div>
          )}
        </div>
      </Paper>
    );
  }
}
const mapStateToProps = (state) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps)(withStyles(styles)(ContractWeekly))
);

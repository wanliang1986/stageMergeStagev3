import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import LocalBarIcon from '@material-ui/icons/LocalBar';
import Bar from '../../../components/BarChart';
import Button from '@material-ui/core/Button';

import ReportTableSummary from '../../../components/Tables/ReportTableSummary';
import { styles, SalesReport as columns } from '../params';
import Immutable from 'immutable';
import { sortList, getIndexList } from '../../../../utils/index';

import clsx from 'clsx';
import {
  getSalesContractByYear,
  getSalesDetalis,
  downLoadSales,
} from '../../../../apn-sdk';
import Loading from '../../../components/particial/Loading';
import { showErrorMessage } from '../../../actions';
import { connect } from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';
import { withStyles } from '@material-ui/core/styles';

import SaleTypeSelect from './SaleTypeSelect';

import FilterBtn from './FilterBtn';
import { YearlyInitData, countryObj } from './initData';
let newYearlyInitData = [];
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
};
let yearObj = {
  2018: '2018',
  2019: '2019',
  2020: '2020',
  2021: '2021',
  2022: '2022',
};

class ContractYearly extends Component {
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
      dataList: Immutable.List(),
      applicationIdArr: null,
      years: [2018, 2019, 2020, 2021, 2022],
      countryObj,
      country: 'USD',
    };
    this.filteredList = Immutable.List();
  }
  componentDidMount() {
    this.setChartData('', []);
  }

  setChartData = (country, companies) => {
    const { years } = this.state;
    this.setState({
      Load: false,
      dataList: Immutable.List(),
    });
    newYearlyInitData = JSON.parse(JSON.stringify(YearlyInitData));
    let { initData1, initData2 } = newYearlyInitData;
    return getSalesContractByYear({
      country,
      companies,
      years,
    })
      .then(({ response }) => {
        console.log(response);

        for (let sale of response) {
          // 2018
          if (sale.billYear == '2018') {
            if (sale.billType === 'Onboard') {
              initData1 = this.setSaleDate('initData1', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData2 = this.setSaleDate('initData2', sale);
            }
          }

          // 2019
          if (sale.billYear == '2019') {
            if (sale.billType === 'Onboard') {
              initData1 = this.setSaleDate('initData1', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData2 = this.setSaleDate('initData2', sale);
            }
          }

          // 2020
          if (sale.billYear == '2020') {
            if (sale.billType === 'Onboard') {
              initData1 = this.setSaleDate('initData1', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData2 = this.setSaleDate('initData2', sale);
            }
          }

          // 2021
          if (sale.billYear == '2021') {
            if (sale.billType === 'Onboard') {
              initData1 = this.setSaleDate('initData1', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData2 = this.setSaleDate('initData2', sale);
            }
          }
          // 2022
          if (sale.billYear == '2022') {
            if (sale.billType === 'Onboard') {
              initData1 = this.setSaleDate('initData1', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData2 = this.setSaleDate('initData2', sale);
            }
          }
        }
        this.setState(
          {
            data1: initData1,
            data2: initData2,
          },
          () => {
            this.setState({
              Load: true,
            });
          }
        );
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({
          Load: true,
          data1: initData1,
          data2: initData2,
        });
      });
  };

  setSaleDate = (initDate, nowDate) => {
    let newData = newYearlyInitData[initDate];
    for (let [index, item] of newData.entries()) {
      if (item.billYear === nowDate.billYear) {
        newData[index] = { ...nowDate, value: nowDate.totalBillAmount };
      }
    }
    return newData;
  };

  // ????????????/?????? YOY
  compareYOY = (type, nowYear) => {
    const { data1, data2 } = this.state;
    let findYearIndex = null;
    if (type === 'last') {
      findYearIndex = data1.findIndex((item, index) => {
        if (item.billYear === nowYear - 1) {
          return index;
        }
      });
    } else if (type === 'now') {
      findYearIndex = data1.findIndex((item, index) => {
        if (item.billYear === nowYear) {
          return index;
        }
      });
    }
    return data1[findYearIndex].value + data2[findYearIndex].value;
  };

  getOption = () => {
    const { data1, data2, countryObj, country } = this.state;

    return {
      tooltip: {
        extraCssText: 'wdith:100px',
        padding: 15,
        showDelay: 5, // ??????????????????????????????????????????????????????????????????ms
        trigger: 'axis',
        axisPointer: {
          // ??????????????????????????????????????????
          type: 'shadow', // ??????????????????????????????'line' | 'shadow'
        },

        // ?????????toolTip?????????
        formatter: function (params) {
          let showHtm = `<p>${yearObj[params[0].axisValue]}</p>`;
          let year = '';
          let marker = '';
          let markerColor = '';
          let markerBorder = '';
          let Pheight = '';
          let nowYear = new Date().getFullYear();
          let lastYearGM = 0;
          let nowYearGM = 0;
          let YoY = 0;
          for (let i = 0; i < params.length; i++) {
            if (i % 2 === 0) {
              year = params[i].data.billYear;
              Pheight = '10px';
            } else {
              year = '';
              Pheight = '20px';
            }
            markerColor =
              params[i]?.color === 'white' ? 'rgba(0,0,0,0)' : params[i].color;
            markerBorder =
              params[i]?.color === 'white'
                ? `1px solid ${params[i - 1].color}`
                : `1px solid ${params[i].color}`;
            marker = `<span style="display:inline-block;margin-right:5px; width:20px;height:10px;background-color:${markerColor};border:${markerBorder}"></span>`;
            showHtm += `<p style="height:${Pheight}">
                          ${marker}
                          ${params[i].data.billType}:
                          ${
                            countryObj[country] +
                            params[i].data.value.toLocaleString('en-US')
                          }
                        <p/>
                       `;
          }

          if (params[0].axisValue == nowYear) {
            lastYearGM = this.compareYOY('last', nowYear);
            nowYearGM = this.compareYOY('now', nowYear);
            if (lastYearGM !== 0 && nowYearGM !== 0) {
              YoY = ((nowYearGM - lastYearGM) / nowYearGM).toFixed(2);
              YoY = YoY > 0 ? '+' + YoY : YoY;
              showHtm += `<p>YoY ${YoY}% (??????????????????)</p>`;
            }
          }
          return showHtm;
        }.bind(this),
      },
      // legend: {
      //   data: ['2020', '2021', '2022', '2021', '2022'],
      //   x: '30%', //????????????????????????????????????
      //   y: 'bottom', //????????????????????????????????????
      //   // padding: [200, 0, 0, 0], //???????????????[?????????????????????????????????????????????????????????????????????]
      //   selected: {
      //     2020: false, //????????????2020????????????????????????
      //     2021: true,
      //     2022: false,
      //   },
      //   // formatter: function (params) {
      //   //   console.log(params);
      //   //   return `<h1>1</h1>`;
      //   // },
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '13%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: ['2018', '2019', '2020', '2021', '2022'],
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
          stack: 'one', //?????????????????????????????????key??? ??????1???2?????? ?????? ??????????????? ????????????????????????stack??????
          itemStyle: {
            normal: {
              //???????????????
              color: function (params) {
                var colorList = [
                  '#83e39d',
                  '#83e39d',
                  '#83e39d',
                  '#669df6',
                  '#fed949',
                ];
                return colorList[params.dataIndex];
              },
              //???????????????
              borderColor: 'rgba(0,0,0,0.2)',
              // label: { // ???????????????????????????
              //   show: true, //????????????
              //   position: "insideTop", //???????????????
              //   textStyle: {]
              //     //????????????
              //     color: "#aab1b8",
              //    fontSize: 9
              //   },
              // },
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data1,
        },

        // offer accpted
        {
          name: 'offer accpted',
          type: 'bar',
          barWidth: 18,
          stack: 'one',
          itemStyle: {
            normal: {
              color: 'white',
              borderColor: 'rgba(0,0,0,0.15)',
              // borderColor: function (params) {
              //   console.log(params);
              //   var colorList = [
              //     '#83e39d',
              //     '#83e39d',
              //     '#83e39d',
              //     '#669df6',
              //     '#fed949',
              //   ];
              //   return colorList[params.dataIndex];
              // },
              label: {
                show: true, //????????????
                position: 'top', //???????????????
                textStyle: {
                  //????????????
                  color: '#aab1b8',
                  fontSize: 12,
                },
                formatter: function (params) {
                  return (
                    countryObj[country] +
                    (
                      data1[params.dataIndex].value +
                      data2[params.dataIndex].value
                    ).toLocaleString('en-US')
                  );
                },
              },
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data2,
        },
      ],
    };
  };

  // bar ????????????
  onChartClick = (detail) => {
    if (!detail.data.applicationId) {
      return false;
    }
    this.setState({
      loadFormList: false,
    });
    let stackApplicationIdArr = this.findStackChart(detail);
    let applicationIdArr = detail.data.applicationId.split(',');
    let ids = applicationIdArr.concat(stackApplicationIdArr);
    let params = {
      applicationIds: ids,
      jobType: 'CONTRACT',
      year: detail.name,
    };
    this.setState({
      year: detail.name,
    });
    return getSalesDetalis(params)
      .then(({ response }) => {
        let finalyResponse = this.filterResponse(response);
        let filteredIndex = getIndexList(Immutable.fromJS(response));
        console.log(filteredIndex);
        this.setState({
          dataList: Immutable.fromJS(finalyResponse),
          filteredIndex,
          loadFormList: true,
          applicationIdArr: ids,
        });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
        this.setState({
          loadFormList: true,
        });
      });
  };

  // ???????????????????????????
  findStackChart = (eventDetail) => {
    let stackChart = null;
    let stackChartApplicationIdArr = [];
    const { data1, data2 } = this.state;

    // 2018
    if (eventDetail.data.billYear == '2018') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data2[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data1[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    // 2019
    if (eventDetail.data.billYear == '2019') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data2[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data1[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    // 2020
    if (eventDetail.data.billYear == '2020') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data2[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data1[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    // 2021
    if (eventDetail.data.billYear == '2021') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data2[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data1[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    // 2022
    if (eventDetail.data.billYear == '2022') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data2[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data1[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    return stackChartApplicationIdArr;
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
          '100%',
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

  // ????????????
  downLoadForm = () => {
    const { applicationIdArr, year } = this.state;
    let params = {
      applicationIds: applicationIdArr,
      jobType: 'CONTRACT',
      year,
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
      years,
    } = this.state;

    const { classes } = this.props;

    const filteredList = filteredIndex.map((index) => dataList.get(index));
    if (!this.filteredList.equals(filteredList)) {
      this.filteredList = filteredList;
    }
    return (
      <Paper className="flex-child-auto flex-container flex-dir-column">
        <div className={classes.root}>
          <div style={styles_inside.title}>
            <Typography variant="h4">
              {'General Staffing Hires Report'}
              <Typography>
                {
                  'We use candidates??? ???On Board???date as reference to build up this report, and this report shows how much GM we generate in each month/quarter/year'
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
              jobType={'CONTRACT'}
              years={years}
            />
            <Divider />
          </>
        )}

        {/* ????????????????????? */}
        <div>
          <SaleTypeSelect perioType="Year" serviceType="CONTRACT" />
        </div>

        {/* ????????? */}
        <div>
          <Bar
            onChartClick={this.onChartClick}
            getOption={this.getOption}
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

export default connect(mapStateToProps)(withStyles(styles)(ContractYearly));

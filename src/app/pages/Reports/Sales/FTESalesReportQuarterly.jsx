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
import Loading from '../../../components/particial/Loading';
import { showErrorMessage } from '../../../actions';
import {
  getSalesFteByQuarter,
  getSalesDetalis,
  downLoadSales,
} from '../../../../apn-sdk';
import SaleTypeSelect from './SaleTypeSelect';
import { connect } from 'react-redux';
import GetAppIcon from '@material-ui/icons/GetApp';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import FilterBtn from './FilterBtn';
import { QuarterlyInitData, countryObj } from './initData';

let newQuarterlyInitData = [];
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
let QuarterObj = {
  Q1: 'Q1',
  Q2: 'Q2',
  Q3: 'Q3',
  Q4: 'Q4',
};

class FteQuarterly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colSortDirs: { null: 'null' },
      dataList: Immutable.List(),
      filteredIndex: Immutable.List(),
      prevFilters: [],
      isFiller: true,

      Load: false,
      loadFormList: true,
      dataList: Immutable.List(),
      applicationIdArr: null,
      years: [2020, 2021, 2022],
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
    newQuarterlyInitData = JSON.parse(JSON.stringify(QuarterlyInitData));
    let { initData1, initData2, initData3, initData4, initData5, initData6 } =
      newQuarterlyInitData;
    return getSalesFteByQuarter({
      country,
      companies,
      years,
    })
      .then(({ response }) => {
        console.log(response);
        // console.log(response);
        // 2020
        for (let sale of response) {
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
              initData3 = this.setSaleDate('initData3', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData4 = this.setSaleDate('initData4', sale);
            }
          }
          // 2022
          if (sale.billYear == '2022') {
            if (sale.billType === 'Onboard') {
              initData5 = this.setSaleDate('initData5', sale);
            }

            // offer accpected
            if (sale.billType === 'Offer Accepted') {
              initData6 = this.setSaleDate('initData6', sale);
            }
          }
        }
        this.setState(
          {
            data1: initData1,
            data2: initData2,
            data3: initData3,
            data4: initData4,
            data5: initData5,
            data6: initData6,
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
          data3: initData3,
          data4: initData4,
          data5: initData5,
          data6: initData6,
        });
      });
  };

  setSaleDate = (initData, nowData) => {
    let newData = newQuarterlyInitData[initData];
    for (let [index, item] of newData.entries()) {
      if (item.billQuarter === nowData.billQuarter) {
        newData[index] = { ...nowData, value: nowData.totalBillAmount };
      }
    }
    return newData;
  };

  // bar ??????
  getOption = () => {
    const { data1, data2, data3, data4, data5, data6, countryObj, country } =
      this.state;
    return {
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
          // console.log(params);
          let showHtm = `<p>${QuarterObj[params[0].axisValue]}</p>`;
          let year = '';
          let marker = '';
          let markerColor = '';
          let markerBorder = '';
          let Pheight = '';
          let nowYear = new Date().getFullYear();
          let lastYearGM = 0;
          let nowYearGM = 0;
          let YoY = 0;
          let billTypeObj = {
            Onboard: 'On Board',
            'Offer Accepted': 'Offer Accepted',
          };
          for (let i = 0; i < params.length; i++) {
            // 1.??????????????????????????? 2.???????????????????????????
            // ?????????;
            if (params[i].data.billYear === nowYear - 1) {
              // console.log(params[i].data.value);
              lastYearGM += params[i].data.value;
            }
            // ?????????
            if (params[i].data.billYear === nowYear) {
              nowYearGM += params[i].data.value;
            }

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
                          <span style="display:inline-block;width:45px">${year}</span>
                          ${marker}
                          ${billTypeObj[params[i].data.billType]}:
                          ${
                            countryObj[country] +
                            params[i].data.value.toLocaleString('en-US')
                          }
                        <p/> 
                       `;
          }

          // console.log(`????????????GM:${lastYearGM}`);
          // console.log(`????????????GM???${nowYearGM}`);

          if (lastYearGM > 0 && nowYearGM > 0) {
            YoY = ((nowYearGM - lastYearGM) / nowYearGM).toFixed(2);
            YoY = YoY > 0 ? '+' + YoY : YoY;
            // console.log(`?????????${YoY}`);
            showHtm += `<p>YoY ${YoY}% (??????????????????)</p>`;
          }

          return showHtm;
        }.bind(this),
      },
      legend: {
        data: [
          // icon:legend ??????icon??????  circle????????? rect????????? ??????..
          { name: '2020', icon: 'rect' },
          { name: '2021', icon: 'rect' },
          { name: '2022', icon: 'rect' },
        ],
        x: '30%', //????????????????????????????????????
        y: 'bottom', //????????????????????????????????????
        // padding: [200, 0, 0, 0], //???????????????[?????????????????????????????????????????????????????????????????????]
        selected: {
          2020: false, //????????????2020????????????????????????
          2021: true,
          2022: false,
        },
        // formatter: function (params) {
        //   console.log(params);
        //   return `<h1>1</h1>`;
        // },
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
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
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
        // 2020
        {
          name: '2020',
          type: 'bar',
          barWidth: 18,
          barCategoryGap: '100px',
          stack: '2020', //?????????????????????????????????key??? ??????1???2?????? ?????? ??????????????? ????????????????????????stack??????
          itemStyle: {
            normal: {
              color: '#83e39d', //???????????????
              borderColor: '#83e39d', //???????????????
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

        {
          name: '2020',
          type: 'bar',
          barWidth: 18,
          stack: '2020',
          itemStyle: {
            normal: {
              color: 'white',
              borderColor: '#83e39d',
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

        // 2021
        {
          name: '2021',
          type: 'bar',
          barWidth: 18,
          stack: '2021',
          itemStyle: {
            normal: {
              color: '#669df6',
              borderColor: '#669df6',
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data3,
        },
        {
          name: '2021',
          type: 'bar',
          barWidth: 18,
          stack: '2021',
          itemStyle: {
            normal: {
              color: 'white',
              borderColor: '#669df6',
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
                      data3[params.dataIndex].value +
                      data4[params.dataIndex].value
                    ).toLocaleString('en-US')
                  );
                },
              },
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data4,
        },

        // 2022
        {
          name: '2022',
          type: 'bar',
          barWidth: 18,
          stack: '2022',
          itemStyle: {
            normal: {
              color: '#fed949',
              borderColor: '#fed949',
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data5,
        },
        {
          name: '2022',
          type: 'bar',
          barWidth: 18,
          stack: '2022',
          itemStyle: {
            normal: {
              color: 'white',
              borderColor: '#fed949',
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
                      data5[params.dataIndex].value +
                      data6[params.dataIndex].value
                    ).toLocaleString('en-US')
                  );
                },
              },
            },
          },
          emphasis: {
            focus: 'series',
          },
          data: data6,
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
    let quarter = detail.name && detail.name.substring(1);
    let params = {
      quarter,
      applicationIds: ids,
      jobType: 'FULL_TIME',
    };
    this.setState({
      quarter,
    });
    return getSalesDetalis(params)
      .then(({ response }) => {
        let finalyResponse = this.filterResponse(response);
        let filteredIndex = getIndexList(Immutable.fromJS(response));
        this.setState({
          dataList: Immutable.fromJS(finalyResponse),
          filteredIndex,
          loadFormList: true,
          applicationIdArr: ids,
        });
      })
      .catch((err) => {
        console.log(err);
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
    const { data1, data2, data3, data4, data5, data6 } = this.state;
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
        stackChart = data4[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data3[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }
    }

    // 2022
    if (eventDetail.data.billYear == '2022') {
      // find Offer Accpeted
      if (eventDetail.data.billType === 'Onboard') {
        stackChart = data6[eventDetail.dataIndex].applicationId;
        if (stackChart) {
          stackChartApplicationIdArr = stackChart.split(',');
        }
      }

      // find onBoard
      if (eventDetail.data.billType === 'Offer Accepted') {
        stackChart = data5[eventDetail.dataIndex].applicationId;
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
    const { applicationIdArr, quarter } = this.state;
    let params = {
      applicationIds: applicationIdArr,
      jobType: 'FULL_TIME',
      quarter,
    };
    return downLoadSales(params).catch((err) => {
      this.props.dispatch(showErrorMessage(err));
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
              {'General Recruiting Hires Report'}
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
              jobType={'FULL_TIME'}
              years={years}
            />
            <Divider />
          </>
        )}

        {/* ????????????????????? */}
        <div>
          <SaleTypeSelect perioType="Quarter" serviceType="FULL_TIME" />
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

export default connect(mapStateToProps)(withStyles(styles)(FteQuarterly));

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
  getSalesFteByMonth,
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
import { MouthlyInitData, countryObj } from './initData';

import { withTranslation } from 'react-i18next';

let newMouthlyInitData = [];
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
let mouthObj = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

class FteMonthly extends Component {
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
    console.log(country);
    const { years } = this.state;
    this.setState({
      Load: false,
      dataList: Immutable.List(),
      country: country || this.state.country,
    });
    newMouthlyInitData = JSON.parse(JSON.stringify(MouthlyInitData));
    let {
      initData1,
      initData2,
      initData3,
      initData4,
      initData5,
      initData6,
    } = newMouthlyInitData;
    return getSalesFteByMonth({
      country,
      companies,
      years,
    })
      .then(({ response }) => {
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
        // console.log(initData1);
        // console.log(initData2);
        // console.log(initData3);
        // console.log(initData4);
        // console.log(initData5);
        // console.log(initData6);
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
    let newData = newMouthlyInitData[initData];

    for (let [index, item] of newData.entries()) {
      if (item.billMonth == nowData.billMonth) {
        newData[index] = { ...nowData, value: nowData.totalBillAmount };
      }
    }

    return newData;
  };

  // bar 配置
  getOption = () => {
    const {
      data1,
      data2,
      data3,
      data4,
      data5,
      data6,
      countryObj,
      country,
    } = this.state;
    return {
      tooltip: {
        padding: 15,
        showDelay: 5, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        // 格式化toolTip的样式
        formatter: function (params) {
          // console.log(params);
          let showHtm = `<p>${this.props.t(
            `tab:${mouthObj[params[0].axisValue]}`
          )}</p>`;
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
            // 1.去年的总数怎么算？ 2.今年的总数怎么算？
            // 去年的;
            if (params[i].data.billYear === nowYear - 1) {
              lastYearGM += params[i].data.value;
            }
            // 今年的
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
                          ${this.props.t(
                            `tab:${billTypeObj[
                              params[i].data.billType
                            ].toLowerCase()}`
                          )}:
                          ${
                            countryObj[country] +
                            params[i].data.value.toLocaleString('en-US')
                          }
                        <p/> 
                       `;
          }

          // console.log(`去年的总GM:${lastYearGM}`);
          // console.log(`今年的总GM：${nowYearGM}`);

          if (lastYearGM > 0 && nowYearGM > 0) {
            YoY = ((nowYearGM - lastYearGM) / nowYearGM).toFixed(2);
            YoY = YoY > 0 ? '+' + YoY : YoY;
            // console.log(`同比为${YoY}`);
            showHtm += `<p>YoY ${YoY}% (今年对比去年)</p>`;
          }

          return showHtm;
        }.bind(this),
      },
      legend: {
        data: [
          // icon:legend 前面icon样式  circle：圆形 rect：矩形 等等..
          { name: '2020', icon: 'rect' },
          { name: '2021', icon: 'rect' },
          { name: '2022', icon: 'rect' },
        ],
        x: '30%', //可设定图例在左、右、居中
        y: 'bottom', //可设定图例在上、下、居中
        // padding: [200, 0, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        selected: {
          2020: true, //图例为‘2020’的一项默认置灰
          2021: true,
          2022: true,
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
          data: [
            '01',
            '02',
            '03',
            '04',
            '05',
            '06',
            '07',
            '08',
            '09',
            '10',
            '11',
            '12',
          ],
          splitLine: {
            show: false, //取消网格
          },
          axisLine: {
            lineStyle: {
              color: '#505050',
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false, //取消网格
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#505050',
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
          stack: '2020', //决定几根柱子叠在一起的key值 比如1和2两根 柱子 想叠在一起 就需要两根柱子的stack一致
          itemStyle: {
            normal: {
              color: '#83e39d', //柱子的颜色
              borderColor: '#83e39d', //柱子的边框
              // label: { // 柱子顶部的数据显示
              //   show: true, //开启显示
              //   position: "insideTop", //在上方显示
              //   textStyle: {]
              //     //数值样式
              //     color: "#505050",
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
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#505050',
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
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#505050',
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
              color: '#a894f6',
              borderColor: '#a894f6',
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
              borderColor: '#a894f6',
              label: {
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#505050',
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

  // bar 柱子点击
  onChartClick = (detail) => {
    if (!detail.data.applicationId) {
      return false;
    }
    this.setState({
      loadFormList: false,
      colSortDirs: { null: 'null' },
    });

    let stackApplicationIdArr = this.findStackChart(detail);
    let applicationIdArr = detail.data.applicationId.split(',');
    let ids = applicationIdArr.concat(stackApplicationIdArr);
    let params = {
      year: detail.seriesName,
      month: detail.name,
      applicationIds: ids,
      jobType: 'FULL_TIME',
    };
    this.setState({
      year: detail.seriesName,
      month: detail.name,
    });
    return getSalesDetalis(params)
      .then(({ response }) => {
        let finalyResponse = this.filterResponse(response);
        let filteredIndex = getIndexList(Immutable.fromJS(response));
        console.log(filteredIndex);
        console.log(finalyResponse);
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

  // 寻找层叠柱子的数据
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

  // 排序方法
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

  // 表格下载
  downLoadForm = () => {
    const { applicationIdArr, year, month } = this.state;
    let params = {
      applicationIds: applicationIdArr,
      jobType: 'FULL_TIME',
      year,
      month,
    };
    return downLoadSales(params)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        this.dispatch.showErrorMessage(err);
      });
  };

  // 改变币种
  onchangeCountry = (country) => {
    console.log(country);
    this.setState({
      country,
    });
  };

  render() {
    const {
      colSortDirs,
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
              {this.props.t('tab:General Recruiting Hires Report')}
              <Typography>{this.props.t('tab:HiresReportTip1')}</Typography>
            </Typography>

            {/* 漏斗按钮 */}
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

        {/* 过滤选项 */}
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

        {/* 切换柱状图类型 */}
        <div>
          <SaleTypeSelect perioType="Month" serviceType="FULL_TIME" />
        </div>

        {/* 柱状图 */}
        <div>
          <Bar
            onChartClick={this.onChartClick}
            getOption={this.getOption}
            Load={Load}
            {...this.props}
          />
        </div>

        {/* 表单 */}
        <div
          style={{ marginTop: 20, minHeight: 500 }}
          // className={clsx('flex-child-auto', classes.contentContainer)}
        >
          {/* 下载按钮 */}
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

export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(FteMonthly))
);

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
import { withTranslation } from 'react-i18next';
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

class FteWeekly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colSortDirs: { null: 'null' },
      footerData: Immutable.List(),
      filteredIndex: Immutable.List(),
      prevFilters: [],
      isFiller: true,
      Load: false,
      loadFormList: true,
      dataList: Immutable.List(),
      applicationIdArr: null,
      xAxisData: [],
      serviceTypeOpt: [
        { value: 'FULL_TIME', label: 'General Recruiting (FTE)' },
        { value: 'CONTRACT', label: 'General Staffing (Contract)' },
      ],
      jobType: 'FULL_TIME',
      serviceType: '',
      countryObj,
      country: 'USD',
      averageLineColor: '#fdb88e',
      targetLineColor: 'rgba(0,0,0,0)',
      chartPakage: {},

      // 柱状图下面 是否激活target的状态
      targetLineActive: true,
    };
    this.filteredList = Immutable.List();
  }
  componentDidMount() {
    this.setChartData(this.state.country, []);
  }

  setChartData = (country, companies) => {
    const { jobType, targetLineActive } = this.state;
    this.setState({
      Load: false,
      dataList: Immutable.List(),
      country,
      companies,
      // mock3 country为test时（Global（Non-China）-USD（US$）） 才默认显示 tartget线
      targetLineColor:
        country === 'NON_CHINA' && targetLineActive
          ? '#a0a3fa'
          : 'rgba(0,0,0,0)',
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
    let {
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
        showDelay: 5, // 显示延迟，添加显示延迟可以避免频繁切换，单位ms
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
        // 格式化toolTip的样式
        formatter: function (params) {
          let periodWeekly_start = '';
          let periodWeekly_end = '';
          periodWeekly_start = params[0].data.billWeek;
          //   moment(params[0].data.billWeek)
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
            showHtm += `<p style="height:${Pheight}">
                        ${marker}
                        ${this.props.t('tab:Total GM')}:    
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
              color: '#505050',
              fontSize: 12,
            },
          },

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
        // onboard
        {
          name: 'onboard',
          type: 'bar',
          barWidth: 18,
          barCategoryGap: '100px',
          itemStyle: {
            normal: {
              //柱子的颜色
              color: function (params) {
                let colorList = WeeklyInitData.initChatColor();
                return colorList[params.dataIndex];
              },
              //柱子的边框
              borderColor: 'rgba(0,0,0,0.2)',
              label: {
                // 柱子顶部的数据显示
                show: true, //开启显示
                position: 'top', //在上方显示
                textStyle: {
                  //数值样式
                  color: '#505050',
                  fontSize: 12,
                },
                formatter: function (params) {
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

          //平均线和目标值
          markLine: {
            silent: false,
            data: [
              // Average
              {
                type: 'average',
                // name: "平均值",
                yAxis: this.getAverage(data1),
                lineStyle: {
                  color: averageLineColor,
                  // color: 'rgba(0,0,0,0)',
                },
              },

              {
                name: 'target',
                yAxis: 250000,
                lineStyle: {
                  color: targetLineColor,
                },
              },
            ],
          },
        },
      ],
    };
    this.setState({
      chartPakage,
    });
  };

  getAverage = (data) => {
    let _data = data.slice(data.length - 11, data.length - 1);
    let num = 0;
    _data.forEach((item, index) => {
      num += item.value;
    });
    return (num / 10).toFixed(2);
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
    let applicationIdArr = detail.data.applicationId.split(',');
    let params = {
      jobType: 'FULL_TIME',
      applicationIds: applicationIdArr,
      type: '1',

      country: this.state.country === 'NON_CHINA' ? 'NON_CHINA' : undefined,
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

  // 表格下载
  downLoadForm = () => {
    const { applicationIdArr } = this.state;
    let params = {
      jobType: 'FULL_TIME',
      applicationIds: applicationIdArr,
      type: '1',
      country: this.state.country === 'NON_CHINA' ? 'NON_CHINA' : undefined,
    };

    return downLoadSales(params).catch((err) => {
      this.dispatch.showErrorMessage(err);
    });
  };

  // 改变币种
  onchangeCountry = (country) => {
    this.setState({
      country,
    });
  };

  // 改变chart markLine颜色
  setChartLineColor = (stateKey, color) => {
    this.setState(
      {
        [stateKey]: color,
        targetLineActive:
          stateKey === 'targetLineColor'
            ? !this.state.targetLineActive
            : this.state.targetLineActive,
      },
      () => {
        // 改变charts配置
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
      jobType,
      chartPakage,
      country,
    } = this.state;
    const { classes, t } = this.props;
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
              {t('tab:Weekly New Offers Report General Recruiting')}
              <Typography>{t('tab:HiresReportTip2')}</Typography>
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
              jobType={jobType}
              reportType="Weekly"
            />
            <Divider />
          </>
        )}

        {/* 切换柱状图类型 */}
        <div style={styles_inside.typeBlock2}>
          <FormReactSelectContainer
            style={{ color: '#505050' }}
            label={t('tab:Service Type')}
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

        {/* 柱状图 */}
        <div>
          <Bar
            setChartLineColor={this.setChartLineColor}
            onChartClick={this.onChartClick}
            getOption={chartPakage}
            Load={Load}
            country={country}
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
  withRouter(connect(mapStateToProps)(withStyles(styles)(FteWeekly)))
);

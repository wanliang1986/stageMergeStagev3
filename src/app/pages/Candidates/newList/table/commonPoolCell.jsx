import React, { Component, useState } from 'react';
import * as apnSDK from '../../../../../apn-sdk';

import withStyles from '@material-ui/core/styles/withStyles';
import { matchPath } from 'react-router';

import Tooltip from '@material-ui/core/Tooltip';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import { LinkedIn } from '../../../../components/Icons';
const style = {
  title: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    paddingTop: '0px',
    marginRight: '10px',
  },
};

class LinkCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: false,
    };
  }
  // 点击图标
  handleChkeInIcon = (data) => {
    console.log(data);
    if (data.purchased) {
      const w = window.open('about:blank');
      w.location.href = data.linkedInLink;
    } else {
      return apnSDK
        .getUserAccount()
        .then((res) => {
          console.log('查询余额成功', res);
          if (res) {
            let { response } = res;
            this.props.getData(true);
            this.props.useMoney(response);
            this.props.useData(data);
          }
        })
        .catch((err) => {
          this.props.sorryDate(true);
        });
    }
  };
  btnName = (data) => {
    //sessionStorage.setItem('emailStatus', JSON.stringify(data.emailStatus)); //存commonPool详情页getTalent需要的参数
    //sessionStorage.setItem('detailId', data._id); //存commonPool详情页getTalent需要的参数
    if (data.talentId) {
      let dataTalentId = data.talentId;
      this.props.history.push(`/candidates/detail/${dataTalentId}`);
    } else {
      let dataId = data._id;
      this.props.dispatch({
        type: 'ADD_COMMON_POOL_DATA_ID',
        payload: data._id,
      });
      this.props.dispatch({
        type: 'ADD_COMMON_POOL_DATA_TENLENT_ID',
        payload: data.talentId,
      });
      // 存储emailStatus，后面的购买接口，查详情接口都需要这个参数
      this.props.dispatch({
        type: 'ADD_COMMON_POOL_EMAIL_STATUS',
        payload: data.emailStatus,
      });
      // 去除字符串中的斜杠
      // dataId = dataId.replace('"', '').replace(/[//]/g, '');
      // console.log('dataId', dataId);
      // this.props.history.push({
      //   pathname: '/candidates/commonPoolList/commonPoolDetail/',
      //   state: { id: dataId },
      // });
      this.props.history.push(
        `/candidates/commonPoolList/commonPoolDetail?id=${dataId}`
      );
    }
  };
  render() {
    const { classes, data, commonPoolList } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ marginRight: '10px' }} onClick={() => this.btnName(data)}>
          {data.fullName ? data.fullName : 'N/A'}
        </div>
        {data.formattedLinkedIn && (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => this.handleChkeInIcon(data)}
          >
            <LinkedIn
              style={{ width: 16, verticalAlign: 'middle' }}
              htmlColor={'#0d77b7'}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    commonPoolList: state.controller.newCandidateJob,
  };
};

export default withRouter(
  connect(mapStateToProps)(withStyles(style)(LinkCell))
);

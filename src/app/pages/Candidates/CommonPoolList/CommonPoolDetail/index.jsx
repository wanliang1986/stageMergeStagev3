import React from 'react';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import * as ActionTypes from '../../../../constants/actionTypes';
import { showErrorMessage } from '../../../../actions/index';
import { replace } from 'connected-react-router';

import {
  getApplicationsByTalentId,
  getTalent,
  getCommonId,
  getCommonTalentFrom,
} from '../../../../actions/talentActions';

import { getClientBriefList } from '../../../../actions/clientActions';
import { getNewOptions } from '../../../../actions/newSearchOptions';
import { getStartByTalentId } from '../../../../actions/startActions';
import DetailLeft from './DetailLeft';
import DetailRight from './DetailRight';
import CandidateLayout from '../../../../components/particial/CandidateLayout';
import Loading from '../../../../components/particial/Loading';

class CandidateDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      telentObjStatus: {},
      telentObjId: null,
    };
  }
  fetchData() {
    const { dispatch, t } = this.props;
    // get请求url参数有特俗字符如:+号 =号时用encodeURIComponent进行转义(左边的详情数据)
    // console.log(this.props.location.query.commonPoolDetailId);
    // let id;
    // let emailStatus;
    // 手动点击页面刷新的时候判断ID是否丢失，丢失的话从sessionStorage中取
    // if (this.props.commonPoolDetailId && this.props.commonPoolDetailId) {
    //   id = this.props.commonPoolDetailId;
    // } else {
    //   id = sessionStorage.getItem('detailId');
    // }
    // 手动点击页面刷新的时候判断emailStatus是否丢失，丢失的话从sessionStorage中取
    // if (this.props.commonStatus) {
    //   emailStatus = this.props.commonStatus;
    // } else if (sessionStorage.getItem('emailStatus')) {
    //   emailStatus = JSON.parse(sessionStorage.getItem('emailStatus'));
    // }
    // console.log(id);
    // let telentList = {
    //   emailStatus: emailStatus,
    //   id: id,
    // };
    // this.setState({
    //   telentObjStatus: telentList.emailStatus,
    //   telentObjId: telentList.id,
    // });

    // 获取search里面的参数
    const telentId = this.props.location.search.substr(4);
    let _telentId = encodeURIComponent(telentId);
    this.setState({
      telentObjId: _telentId,
    });
    dispatch(getCommonId(_telentId)).catch((err) => {
      if (err.status === 404) {
        this.props.dispatch(replace('/candidates/nomatch'));
      } else {
        this.props.dispatch(showErrorMessage(err));
      }
    });
    // commonPool右边表格数据
    // dispatch(getCommonTalentFrom(telentList.id));
  }
  componentDidMount() {
    this.fetchData();
    this.props.dispatch(getClientBriefList(null)).then(({ response }) => {
      if (response) {
        const createCompanyOptions = getCreateCompanyOptions(response);
        this.props.dispatch(
          getNewOptions(['companyOptions', createCompanyOptions])
        );
      }
    });
  }
  render() {
    // 这里重新取url上面的id是因为，在详情页刷新的时候，AI推荐接口的参数id丢失了，子组件在父组件之前执行导致id丢失
    const telentId = this.props.location.search.substr(4);
    let _telentId = telentId;
    // let _telentId =
    //   '/IAt2g48EOetLe/iOpM42NgcCMp3pfaPk5xQcvHZ8XbICd8Xrdvr5SwxcrATeGLD7J3DUsr4h1zBbBt9WwzWwQ==';

    return (
      <CandidateLayout>
        <DetailLeft {...this.props} />
        <DetailRight {...this.props} telentId={_telentId} />
      </CandidateLayout>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  console.log('match=================', match);

  let matchDetailsId = match.params.commonPoolDetailId;
  let commonPoolDetailId =
    state.controller.newCandidateJob.toJS().addCommonPoolDataetailId;
  let commonStatus =
    state.controller.newCandidateJob.toJS().addCommonPoolEmailStatus;
  return {
    commonPoolDetailId,
    commonStatus,
    matchDetailsId,
  };
}

const getCreateCompanyOptions = (response) => {
  const companyOptions = response.map((item, index) => {
    return {
      value: item.id,
      label: item.name,
      industry: item.industry,
      country: item.country,
      disabled: !item.active,
    };
  });
  return companyOptions;
};

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(CandidateDetail)
);

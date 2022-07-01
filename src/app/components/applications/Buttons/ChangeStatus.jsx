import React from 'react';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import PrimaryButton from '../../particial/PrimaryButton';

import { getApplicationStatusLabel } from '../../../constants/formOptions';
import { ApplicationsCancelEliminate } from '../../../../apn-sdk/newApplication';
import { updateCancelElimanateApplication } from '../../../actions/applicationActions';
import FeeItemizations from '../../newApplication/form/feeItemizations';
import FeeItemizationsFte from '../../newApplication/form/feeItemizationsFte';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Dialog from '@material-ui/core/Dialog';
import AddActivityV3 from '../forms/AddActivityV3';

class NextStepsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      formOpen: false,
      toStatus: null,
      processing: false,
      feeOpen: false,
      feeOpenFte: false,
    };
    this.anchorRef = React.createRef();
  }

  handleOpenForm = (toStatus) => {
    const { application, dispatch } = this.props;
    // 取消淘汰
    if (toStatus === 'ELIMINATED_CANCEL') {
      this.setState({
        menuOpen: false,
        processing: true,
      });
      dispatch(updateCancelElimanateApplication(application.get('id')))
        .then(() => {
          this.setState({
            processing: false,
          });
        })
        .catch((err) => {
          throw err;
        });
    } else {
      this.setState({
        menuOpen: false,
        formOpen: true,
        toStatus,
      });
    }
  };

  handleOpenMenu = () => {
    this.setState({
      menuOpen: true,
    });
  };

  handleCloseForm = () => {
    this.setState({ formOpen: false });
  };

  handleCloseMenu = (event) => {
    this.setState({
      menuOpen: false,
    });
  };
  handleToggleMenu = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  handOpenFee = (key, value) => {
    this.setState({ [key]: value });
  };

  handleClose = (key) => () => {
    this.setState({ [key]: false });
    // 清空面试轮次信息
    this.props.dispatch({
      type: 'EDIT_INTERVIEW_INDEX',
      payload: null,
    });
    this.props.dispatch({
      type: 'APPLICATION_EDITFLAG',
      payload: false,
    });
  };

  render() {
    const { menuOpen, formOpen, toStatus, processing, feeOpenFte, feeOpen } =
      this.state;
    const { application, ...props } = this.props;
    let nodeType;
    let eliminated = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((x) => x.nodeStatus === 'ELIMINATED');
    let active = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((x) => x.nodeStatus === 'ACTIVE');
    let onBoard = application
      .get('talentRecruitmentProcessNodes')
      .toJS()
      .filter((x) => x.nodeType === 'ON_BOARD');
    if (eliminated && eliminated.length > 0) {
      nodeType = eliminated[0];
    } else if (active && active.length > 0) {
      nodeType = active[0];
    } else {
      nodeType = onBoard[0];
    }
    let step;
    if (
      application.get('jobType') === 'PAY_ROLL' &&
      application.get('talentRecruitmentProcessNodes').size === 2
    ) {
      step = getNextStepsByStatusPayroll(nodeType, application);
    } else {
      step = getNextStepsByStatus(nodeType, application);
    }
    return (
      <div>
        <PrimaryButton
          processing={processing}
          color={'primary'}
          style={{
            cursor: 'pointer',
            textAlign: 'right',
            backgroundColor: 'rgb(0,0,0,0)',
            color: '#3398dc',
          }}
          buttonRef={this.anchorRef}
          onClick={this.handleToggleMenu}
          endIcon={
            step.menu.length > 0 ? (
              menuOpen ? (
                <ArrowDropUpIcon />
              ) : (
                <ArrowDropDownIcon />
              )
            ) : null
          }
        >
          {getApplicationStatusLabel(
            nodeType.nodeStatus === 'ELIMINATED'
              ? nodeType.nodeStatus
              : nodeType.nodeType
          )}
        </PrimaryButton>

        {/* 下拉框内容 */}
        <Popover
          elevation={4}
          open={step.menu.length > 0 && menuOpen}
          anchorEl={this.anchorRef.current}
          onClose={this.handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <MenuList dense>
            {step.menu.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => this.handleOpenForm(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Popover>

        <AddActivityV3
          open={formOpen}
          onClose={this.handleCloseForm}
          application={application}
          formType={toStatus}
          activityFromJob
          handOpenFee={this.handOpenFee}
          {...props}
        />

        {/* 生成收费明细  通用*/}
        <Dialog open={feeOpen} fullWidth maxWidth="md">
          <FeeItemizations
            handleRequestClose={this.handleClose('feeOpen')}
            application={application}
            t={this.props.t}
          />
        </Dialog>

        {/* 生成收费明细  FTE*/}
        <Dialog open={feeOpenFte} fullWidth maxWidth="md">
          <FeeItemizationsFte
            handleRequestClose={this.handleClose('feeOpenFte')}
            application={application}
            t={this.props.t}
          />
        </Dialog>
      </div>
    );
  }
}

export default connect()(NextStepsButton);

const getNextStepsByStatus = memoizeOne((item, application) => {
  //versionsFlag = true 为通用版本
  const versionsFlag = application
    .get('talentRecruitmentProcessNodes')
    .toJS()
    .some((x) => {
      return x.nodeType === 'COMMISSION';
    });
  // 淘汰是一个状态  而其他是一个流程
  if (item.nodeStatus === 'ELIMINATED') {
    return {
      menu: [{ value: 'ELIMINATED_CANCEL', label: '取消淘汰' }],
    };
  } else {
    switch (item.nodeType) {
      case 'SUBMIT_TO_JOB':
        return {
          menu: [
            { value: 'SUBMIT_TO_CLIENT', label: '推荐至客户' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      case 'SUBMIT_TO_CLIENT':
        return {
          menu: [
            { value: 'INTERVIEW', label: '面试' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      case 'INTERVIEW':
        return {
          menu: [
            { value: 'OFFER', label: 'Offer' },
            // 如果面试达到12轮 就不能添加面试了
            application.get('interviews').toJS().length < 12
              ? { value: 'INTERVIEW', label: '面试' }
              : '',
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      case 'OFFER':
        // 普通和定制不同 普通的下一步是COMMISSION 定制的下一步是OFFER_ACCEPT
        return {
          menu: [
            versionsFlag
              ? { value: 'COMMISSION', label: '业绩分配' }
              : { value: 'OFFER_ACCEPT', label: '接受offer' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
            ,
          ],
        };
      case 'OFFER_ACCEPT':
      case 'COMMISSION':
        return {
          menu: [
            { value: 'ON_BOARD', label: '入职' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      case 'ON_BOARD':
        return {
          menu: [
            { value: 'ON_BOARD', label: '更新入职信息' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      default:
        return {
          menu: [],
        };
    }
  }
});

const getNextStepsByStatusPayroll = memoizeOne((item, application) => {
  //versionsFlag = true 为通用版本
  const versionsFlag = application
    .get('talentRecruitmentProcessNodes')
    .toJS()
    .some((x) => {
      return x.nodeType === 'COMMISSION';
    });
  // 淘汰是一个状态  而其他是一个流程
  if (item.nodeStatus === 'ELIMINATED') {
    return {
      menu: [{ value: 'ELIMINATED_CANCEL', label: '取消淘汰' }],
    };
  } else {
    switch (item.nodeType) {
      case 'SUBMIT_TO_JOB':
        return {
          menu: [
            { value: 'ON_BOARD', label: '入职' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      case 'ON_BOARD':
        return {
          menu: [
            { value: 'ON_BOARD', label: '更新入职信息' },
            { value: 'REJECTED_BY_CANDIDATE', label: '候选人拒绝' },
            { value: 'REJECTED_BY_CLIENT', label: '客户淘汰' },
            { value: 'INTERNAL_REJECT', label: '内部淘汰' },
          ],
        };
      default:
        return {
          menu: [],
        };
    }
  }
});

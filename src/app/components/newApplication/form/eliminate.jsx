import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { updateNewElimanateApplication } from '../../../actions/applicationActions';

import { showErrorMessage } from '../../../actions';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import FormTextArea from '../../particial/FormTextArea';

class RejectedForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: Immutable.Map(),
      note: '',

      processing: false,
    };
  }

  inputChangeHandler = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  submitAddCandidateActivity = (e) => {
    e.preventDefault();
    const { dispatch, application, rejectedStatus } = this.props;
    const activity = {
      talentRecruitmentProcessId: application.getIn([
        'submitToJob',
        'talentRecruitmentProcessId',
      ]),
      reason: rejectedStatus,
      note: this.state.note,
    };
    let errorMessage = this._validateForm(activity);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }
    this.setState({
      processing: true,
    });
    dispatch(updateNewElimanateApplication(activity))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        // cancelAddActivity();
        // dispatch(
        //   updateDashboardApplStatus(newApplication.id, newApplication.status)
        // );
        dispatch({ type: 'UPDATE_DB_DATA' });
        this.props.handleRequestClose();
      })
      .catch((err) => {
        this.setState({ processing: false });
        dispatch(showErrorMessage(err));
      });
  };

  _removeErrorMsgHandler = (key) => {
    return this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  _validateForm = (activityObject) => {
    let errorMessage = Immutable.Map();
    if (!activityObject.note) {
      errorMessage = errorMessage.set('note', '备注不能为空');
    }

    if (activityObject.note && activityObject.note.length > 50) {
      errorMessage = errorMessage.set('note', '备注不能超过50');
    }

    return errorMessage.size > 0 && errorMessage;
  };

  render() {
    const { t, handleRequestClose, application, formType } = this.props;

    const { note, errorMessage, processing } = this.state;

    return (
      <Fragment>
        {/* 标题 */}
        <DialogTitle>{'淘汰'}</DialogTitle>

        {/* 表单内容 */}
        <DialogContent>
          <form onSubmit={this.submitAddCandidateActivity} id="activityForm">
            <section>
              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    errorMessage={errorMessage.get('note')}
                    name="note"
                    label={t('field:note')}
                    rows="5"
                    value={note}
                    onChange={this.inputChangeHandler}
                    onFocus={() => this._removeErrorMsgHandler('note')}
                  />
                </div>
              </div>
            </section>
          </form>
        </DialogContent>
        <Divider />

        {/* 修改状态的按钮 （取消 提交） */}
        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={handleRequestClose}>
              {'取消'}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="activityForm"
              processing={processing}
            >
              {'提交'}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Fragment>
    );
  }
}

const mapStoreStateToProps = (state) => {
  return {
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStoreStateToProps)(RejectedForm);

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getMemoFromApplication } from '../../../../utils';
import {
  updateApplication,
  updateDashboardApplStatus,
} from '../../../actions/applicationActions';

import { showErrorMessage } from '../../../actions';
import { getApplicationStatusLabel } from '../../../constants/formOptions';

import Divider from '@material-ui/core/Divider';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../../particial/PrimaryButton';
import SecondaryButton from '../../particial/SecondaryButton';
import FormTextArea from '../../particial/FormTextArea';
import ApplicationInfoWithCommissions from '../views/ApplicationInfoWithCommissions';

class AddActivityDefaultForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: Immutable.Map(),
      note: '',

      processing: false,
    };
  }

  handleCommissionsUpdate = (commissions) => {
    this.setState({ commissions });
  };

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
    const { note, commissions } = this.state;
    const {
      dispatch,
      t,
      formType,
      application: oldApplication,
      cancelAddActivity,
      currentUserId,
    } = this.props;
    const status = formType;

    const isAm =
      commissions &&
      commissions.find(
        (el) => el.userId === currentUserId && el.userRole === 'AM'
      );
    //todo: refine check am on submit
    if (status === 'Internal_Rejected' && !isAm) {
      // return dispatch(showErrorMessage('Only Am can reject'));
    }

    const activity = {
      status: status,
      memo: note,
    };

    let errorMessage = this._validateForm(activity, t);
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    this.setState({ processing: true });
    dispatch(updateApplication(activity, oldApplication.get('id')))
      .then((newApplication) => {
        console.log('[[response]]', newApplication);
        cancelAddActivity();
        dispatch(
          updateDashboardApplStatus(newApplication.id, newApplication.status)
        );
        dispatch({ type: 'UPDATE_DB_DATA' });
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

  _validateForm = (activityObject, t) => {
    let errorMessage = Immutable.Map();
    if (!activityObject.status) {
      errorMessage = errorMessage.set('status', t('message:statusIsRequired'));
    }
    if (!activityObject.memo) {
      errorMessage = errorMessage.set('note', t('message:noteIsRequired'));
    }

    if (activityObject.memo.length > 5000) {
      errorMessage = errorMessage.set('note', t('message:noteLengthError'));
    }

    return errorMessage.size > 0 && errorMessage;
  };

  render() {
    const { t, cancelAddActivity, application, formType } = this.props;

    const { note, errorMessage, processing } = this.state;

    return (
      <Fragment>
        {/* 标题 */}
        <DialogTitle>{getApplicationStatusLabel(formType)}</DialogTitle>

        {/* 表单内容 */}
        <DialogContent>
          <form onSubmit={this.submitAddCandidateActivity} id="activityForm">
            <ApplicationInfoWithCommissions
              applicationId={application.get('id')}
              onCommissionsUpdate={this.handleCommissionsUpdate}
              t={t}
            />
            <section>
              <Divider style={{ margin: '20px -24px 15px' }} />
              <div className="row expanded">
                <div className="small-12 columns">
                  <FormTextArea
                    errorMessage={errorMessage.get('note')}
                    name="note"
                    label={t('field:note')}
                    rows="5"
                    placeholder={getMemoFromApplication(application)}
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
            <SecondaryButton onClick={cancelAddActivity}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              form="activityForm"
              processing={processing}
            >
              {t('action:submit')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </Fragment>
    );
  }
}

AddActivityDefaultForm.propTypes = {
  cancelAddActivity: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
};

const mapStoreStateToProps = (state) => {
  return {
    currentUserId: state.controller.currentUser.get('id'),
  };
};

export default connect(mapStoreStateToProps)(AddActivityDefaultForm);

import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import {
  addResume,
  getResumesByTalentId,
  uploadResumeOnly,
} from '../../../../actions/talentActions';
import { showErrorMessage } from '../../../../actions';
import { makeCancelable } from '../../../../../utils';

import Select from 'react-select';
import FormReactSelectContainer from '../../../particial/FormReactSelectContainer';
import PotentialButton from '../../../particial/PotentialButton';
import { getTalentResumeArray } from '../../../../selectors/talentResumeSelector';
import ViewResumeInAddActivity from '../../../forms/AddActivity/ViewResumeInAddActivity';
import Immutable from 'immutable';
import ViewResume from '@material-ui/icons/RemoveRedEye';

const styles = {
  resumeContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 11111,
  },
};

class ResumeSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedResume: this._getResume(props),
      showResume: false,
    };
  }

  componentDidMount() {
    const { talentId, dispatch, isTalentDetail } = this.props;

    if (!isTalentDetail) {
      this.resumeTask = makeCancelable(
        dispatch(getResumesByTalentId(talentId))
      );
      this.resumeTask.promise.then(() => {
        this.setState({ selectedResume: this._getResume(this.props) });
      });
    }
  }

  componentWillUnmount() {
    if (this.resumeTask) {
      this.resumeTask.cancel();
    }
  }

  _getResume = ({ resumeId, resumeList }) => {
    return resumeId
      ? resumeList.find((value) => value.id === resumeId)
      : resumeList[0];
  };

  handleResumeUpload = (e) => {
    const fileInput = e.target;
    const resumeFile = fileInput.files[0];
    this.props.removeErrorMessage('resumeId');
    const { dispatch, talentId } = this.props;
    if (resumeFile) {
      fileInput.value = '';
      this.setState({ uploading: true });
      dispatch(uploadResumeOnly(resumeFile))
        .then((response) => {
          response.talentId = talentId;
          return dispatch(addResume(response));
        })
        .then(() => {
          this.setState({
            selectedResume: this.props.resumeList[0],
          });
        })
        .catch((err) => dispatch(showErrorMessage(err)))
        .finally(() => {
          this.setState({ uploading: false });
        });
    }
  };

  handleResumeChange = (newValue) => {
    this.setState(({ selectedResume }) => ({
      selectedResume: newValue || selectedResume,
    }));
  };

  openResume = (value, event) => {
    window.open(value.s3Link);
  };

  showResume = () => {
    this.setState({ showResume: true });
  };

  closeViewResume = () => {
    this.setState({ showResume: false });
  };

  render() {
    const {
      t,
      classes,
      resumeList,
      errorMessage,
      removeErrorMessage,
      hidden,
      isRequired,
      disabled,
    } = this.props;
    const { uploading, selectedResume, showResume } = this.state;
    return (
      <div className="row" hidden={hidden}>
        <div className="columns">
          <FormReactSelectContainer
            label={t('field:resume')}
            isRequired={isRequired}
            errorMessage={errorMessage.get('resumeId')}
            icon={
              selectedResume ? (
                <ViewResume
                  onClick={this.showResume}
                  style={{ cursor: 'pointer' }}
                />
              ) : null
            }
          >
            <Select
              disabled={disabled}
              valueKey={'id'}
              labelKey={'name'}
              clearable={false}
              // options={resumeList}
              value={selectedResume}
              onChange={this.handleResumeChange}
              onBlur={() => removeErrorMessage('resumeId')}
              onValueClick={this.openResume}
              className="capitalize-dropdown"
              autoBlur={true}
              openOnFocus={true}
              placeholder={
                resumeList.length
                  ? t('message:selectResume')
                  : t('message:noResumeUploaded')
              }
            />
          </FormReactSelectContainer>
          <input
            type="hidden"
            name="resumeId"
            value={selectedResume ? selectedResume.id : ''}
          />
        </div>
        <div className="columns" style={{ maxWidth: 160 }}>
          {disabled ? (
            selectedResume && (
              <PotentialButton
                size="small"
                style={{
                  marginTop: 22,
                }}
                fullWidth
                onClick={this.showResume}
              >
                {t('action:view')}
              </PotentialButton>
            )
          ) : (
            <PotentialButton
              component="label"
              style={{ marginTop: 22 }}
              fullWidth
              processing={uploading}
              size="small"
              onChange={this.handleResumeUpload}
            >
              {t('action:uploadResume')}

              <input key="resume" type="file" style={{ display: 'none' }} />
            </PotentialButton>
          )}
        </div>

        {showResume && (
          <div className={classes.resumeContainer}>
            <ViewResumeInAddActivity
              resume={Immutable.fromJS(selectedResume)}
              t={t}
              close={this.closeViewResume}
            />
          </div>
        )}
      </div>
    );
  }
}

function mapStoreStateToProps(state, { talentId }) {
  return {
    resumeList: getTalentResumeArray(state, talentId),
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(ResumeSelector)
);

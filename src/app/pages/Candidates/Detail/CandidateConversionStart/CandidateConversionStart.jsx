import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import {
  createStart,
  updateStart,
  selectStartToOpen,
  OpenOnboarding,
} from '../../../../actions/startActions';
import { getApplication } from '../../../../actions/applicationActions';
import { showErrorMessage } from '../../../../actions';
import { USER_TYPES } from '../../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';

import StartForm from './StartForm';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import Divider from '@material-ui/core/Divider';

import { showOnboarding } from '../../../../../utils/index';

class CandidateConversionStart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: props.start && !props.start.get('id'),
      processing: false,

      openFailedWarranty: false,
      openTermination: false,

      cancelTermination: null,
    };
  }

  //toggle menu
  handleClickOptions = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };
  handleCloseOptions = () => {
    this.setState({ anchorEl: null });
  };

  //form submit
  handleCancel = () => {
    if (this.props.start.get('id')) {
      this.setState({ edit: false });
    } else {
      this.handleCloseStartTab();
    }
  };

  handleUpsert = (newStart, startId) => {
    console.log(newStart);
    const { dispatch } = this.props;
    this.setState({ processing: true });
    console.log('submit!!!!!!!!!!!!!!!!!!!!!!!!!!1');
    if (startId) {
      return dispatch(updateStart(newStart, startId))
        .then(() => {
          let hasOnboardingBtn = showOnboarding(this.props.currentStart);
          dispatch(
            selectStartToOpen(
              this.props.start.merge(Immutable.fromJS(newStart)),
              hasOnboardingBtn
            )
          );
          dispatch(
            OpenOnboarding(
              this.props.currentStart.get('applicationId'),
              'openStart',
              this.props.currentStart,
              hasOnboardingBtn
            )
          );
        })
        .then(this.handleCancel)
        .catch((err) => {
          dispatch(showErrorMessage(err));
          this.setState({ processing: false });
        });
    }
    dispatch(createStart(newStart))
      .then((normalizedData) => {
        newStart.id = normalizedData.result;
        let hasOnboardingBtn = showOnboarding(this.props.currentStart);
        dispatch(
          selectStartToOpen(
            this.props.start.merge(Immutable.fromJS(newStart)),
            hasOnboardingBtn
          )
        );
        dispatch(
          OpenOnboarding(
            this.props.currentStart.get('applicationId'),
            'openStart',
            this.props.currentStart,
            hasOnboardingBtn
          )
        );
        dispatch(getApplication(newStart.applicationId));
      })

      .then(this.handleCancel)
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  handleCloseStartTab = () => {
    // const { dispatch } = this.props;
    // dispatch(selectStartToOpen(null));
    const { dispatch, onCloseStartTab } = this.props;
    if (onCloseStartTab) {
      onCloseStartTab(() => {
        dispatch(selectStartToOpen(null));
        dispatch(OpenOnboarding(null));
      });
    } else {
      dispatch(selectStartToOpen(null));
      dispatch(OpenOnboarding(null));
    }
  };

  handleAction = (action) => {
    this.handleCloseOptions();
    switch (action) {
      case 'closeTab':
        return this.handleCloseStartTab();
      default:
    }
  };

  handleEdit = () => {
    this.setState({ edit: true, anchorEl: null, processing: false });
  };

  render() {
    const { handleCloseStart, start, isAm, ...props } = this.props;
    const { anchorEl, edit } = this.state;
    const startId = start.get('id');
    const positionType = start.get('positionType');
    const status = start.get('status');
    const menuItems = getMenuItems(positionType, status);
    return (
      <div
        className="flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div className="flex-container flex-container align-middle">
          <Typography
            className="container-padding flex-child-auto"
            variant="subtitle1"
          >
            {startId
              ? edit
                ? `Edit Current Start`
                : 'Start' + `${getStatusLabel(status)}`
              : `Create a FTE Start`}
          </Typography>
          {isAm && startId && !edit && status === 'ACTIVE' && (
            <IconButton
              onClick={this.handleEdit}
              style={{ padding: 8 }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          )}

          {isAm && startId && (
            <div>
              <IconButton
                onClick={this.handleClickOptions}
                style={{ padding: 8, marginRight: 12 }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                getContentAnchorEl={null}
                elevation={2}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleCloseOptions}
                MenuListProps={{ dense: true }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {menuItems.map((action) => {
                  return (
                    <MenuItem
                      key={action.action}
                      onClick={() => this.handleAction(action.action)}
                    >
                      {props.t(action.label)}
                    </MenuItem>
                  );
                })}
                {menuItems.length > 0 && <Divider />}
                <MenuItem
                  key={'closeTab'}
                  onClick={() => this.handleAction('closeTab')}
                >
                  {props.t('action:closeTab')}
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
        <div
          className="flex-container flex-dir-column"
          style={{ overflow: 'auto' }}
        >
          <StartForm
            edit={edit}
            start={start.toJS()}
            {...props}
            handleSubmit={this.handleUpsert}
          />
        </div>

        {edit && (
          <div
            className="horizontal-layout container-padding "
            style={{ flexShrink: 0 }}
          >
            <SecondaryButton
              onClick={this.handleCancel}
              style={{ minWidth: 70 }}
            >
              {props.t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              type="submit"
              style={{ minWidth: 70 }}
              form="startForm"
              disabled={!isAm}
              processing={this.state.processing}
            >
              {props.t('action:save')}
            </PrimaryButton>
          </div>
        )}
      </div>
    );
  }
}

CandidateConversionStart.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { start }) => {
  const currentUserId = state.controller.currentUser.get('id');
  const authorities = state.controller.currentUser.get('authorities');

  const isAdmin =
    authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  return {
    isAdmin,
    isAm: checkAM(start, currentUserId) || isAdmin,
    currentUserId,
  };
};

export default connect(mapStateToProps)(CandidateConversionStart);

const checkAM = memoizeOne((start, currentUserId) => {
  return !!(
    start &&
    start.get('startCommissions') &&
    start.get('startCommissions').find((c) => {
      return (
        c.get('userId') === currentUserId && c.get('userRole') === USER_TYPES.AM
      );
    })
  );
});

const getMenuItems = (positionType, status) => {
  return [];
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'FTE_FAIL_WARRANTY':
      return ' (Failed Warranty)';

    case 'CONTRACT_TERMINATED':
      return ' (Terminated)';

    case 'CONTRACT_EXTENDED':
      return ' (Extended)';

    case 'ACTIVE':
    default:
      return '';
  }
};

import React from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import {
  createStart,
  updateStart,
  selectStartToOpen,
  selectExtensionToOpen,
  startCancelTermination,
} from '../../../../actions/startActions';
import { getApplication } from '../../../../actions/applicationActions';
import { showErrorMessage } from '../../../../actions';
import { JOB_TYPES, USER_TYPES } from '../../../../constants/formOptions';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';

import StartForm from './StartForm';
import StartEditForm from './../CandidateExtension/StartForm/EditForm';
import FailedWarrantyForm from './HandleStartActionsForm/FailedWarrantyForm';
import TerminationForm from './HandleStartActionsForm/TerminationForm';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import PotentialButton from '../../../../components/particial/PotentialButton';
import AlertDialog from '../../../../components/particial/AlertDialog';

class CandidateStart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: !props.start.get('id'),
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
    const { dispatch } = this.props;
    this.setState({ processing: true });
    console.log('submit!!!!!!!!!!!!!!!!!!!!!!!!!!1');
    if (startId) {
      return dispatch(updateStart(newStart, startId))
        .then(() => {
          dispatch(
            selectStartToOpen(
              this.props.start.merge(Immutable.fromJS(newStart))
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
        dispatch(
          selectStartToOpen(this.props.start.merge(Immutable.fromJS(newStart)))
        );
        dispatch(getApplication(newStart.applicationId));
      })

      .then(this.handleCancel)
      .catch((err) => {
        dispatch(showErrorMessage(err));
        this.setState({ processing: false });
      });
  };

  //menu options
  handleEdit = () => {
    this.setState({ edit: true, anchorEl: null, processing: false });
  };
  handleCloseStartTab = () => {
    const { dispatch, onCloseStartTab } = this.props;
    if (onCloseStartTab) {
      onCloseStartTab(() => {
        console.log('handleCloseStartTab');
        dispatch(selectStartToOpen(null));
      });
    } else {
      dispatch(selectStartToOpen(null));
    }
  };

  handleFailedWarranty = () => {
    console.log('handleFailedWarranty');
    this.setState({
      openFailedWarranty: true,
    });
  };

  handleTermination = () => {
    console.log('handleTermination');
    this.setState({
      openTermination: true,
    });
  };

  handleCancelTermination = () => {
    const { start, dispatch } = this.props;
    this.setState({
      cancelTermination: () => {
        dispatch(startCancelTermination(start.get('id')))
          .then((newStart) => {
            dispatch(selectStartToOpen(Immutable.fromJS(newStart)));
            dispatch(getApplication(start.get('applicationId')));
          })
          .catch((err) => {
            dispatch(showErrorMessage(err));
          })
          .finally(this.handleCloseCancelTermination);
      },
    });
  };
  handleCloseCancelTermination = () => {
    this.setState({ cancelTermination: null });
  };

  handleExtension = () => {
    console.log('handleExtension');
    const { start, dispatch, currentUserId } = this.props;
    console.log(start.toJS());

    const lastStartContractRate =
      (start.get('startContractRates') &&
        start.get('startContractRates').last()) ||
      Immutable.Map();
    const lastEndDate =
      lastStartContractRate.get('endDate') || start.get('endDate');
    const newStartDate =
      lastEndDate && moment(lastEndDate).add(1, 'days').format('YYYY-MM-DD');
    const extension = start
      .set('startDate', newStartDate)
      .set('startId', start.get('id'))
      .remove('id')
      .remove('endDate')
      .remove('lastModifiedDate')
      .remove('createdDate')
      .remove('note')
      .remove('createdBy')
      .set(
        'startContractRates',
        Immutable.List([
          lastStartContractRate
            .set('extraCost', '')
            .set('startDate', newStartDate)
            .remove('immigrationCost')
            .remove('endDate'),
        ])
      );
    dispatch(selectExtensionToOpen(extension));
  };

  handleRateChange = () => {
    console.log('handleRateChange');
  };

  handleAction = (action) => {
    this.handleCloseOptions();
    switch (action) {
      case 'closeTab':
        return this.handleCloseStartTab();
      case 'failedWarranty':
        return this.handleFailedWarranty();
      case 'termination':
        return this.handleTermination();
      case 'cancelTermination':
        return this.handleCancelTermination();

      case 'extension':
        return this.handleExtension();
      default:
    }
  };

  render() {
    const { handleCloseStart, start, isAm, hasActiveStart, ...props } =
      this.props;
    const { anchorEl, edit, cancelTermination } = this.state;
    const startId = start.get('id');
    const positionType = start.get('positionType');
    const status = start.get('status');
    const failedWarranty = start.get('failedWarranty');
    const termination = start.get('termination');
    // console.log(positionType);
    const menuItems = getMenuItems(positionType, status, start.get('endDate'));
    console.log(start, start.toJS(), isAm);
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
              : `Schedule a Start`}
          </Typography>
          {isAm &&
            startId &&
            !edit &&
            status === 'ACTIVE' &&
            positionType === JOB_TYPES.FullTime && (
              <IconButton
                onClick={this.handleEdit}
                style={{ padding: 8 }}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            )}
          {isAm && failedWarranty && (
            <IconButton
              onClick={() => this.handleAction('failedWarranty')}
              style={{ padding: 8 }}
              color="primary"
            >
              <EditIcon />
            </IconButton>
          )}

          {isAm && termination && (
            <PotentialButton
              onClick={() => this.handleAction('cancelTermination')}
              color="primary"
              size="small"
              disabled={!!hasActiveStart}
            >
              {props.t('action:cancelTermination')}
            </PotentialButton>
          )}

          {startId && (
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
                      disabled={!isAm}
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
          {startId && start.get('positionType') !== JOB_TYPES.FullTime ? (
            <StartEditForm
              key={startId}
              edit={edit}
              isAm={isAm}
              start={start.toJS()}
              {...props}
              handleSubmit={this.handleUpsert}
            />
          ) : (
            <StartForm
              edit={edit}
              isAm={isAm}
              start={start.toJS()}
              {...props}
              handleSubmit={this.handleUpsert}
            />
          )}
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

        <Dialog
          open={this.state.openFailedWarranty}
          fullWidth
          onClose={() => this.setState({ openFailedWarranty: false })}
        >
          <FailedWarrantyForm
            start={start}
            {...props}
            onClose={() => this.setState({ openFailedWarranty: false })}
          />
        </Dialog>

        <Dialog
          open={this.state.openTermination}
          fullWidth
          onClose={() => this.setState({ openTermination: false })}
        >
          <TerminationForm
            start={start}
            {...props}
            onClose={() => this.setState({ openTermination: false })}
          />
        </Dialog>

        <AlertDialog
          onOK={this.state.cancelTermination}
          onCancel={this.handleCloseCancelTermination}
          title={props.t('action:cancelTermination')}
          content={
            <Trans i18nKey="message:cancelTerminationAlert" parent="p">
              Are you sure you want to cancel Termination ?
            </Trans>
          }
          okLabel={props.t('action:confirm')}
          cancelLabel={props.t('action:cancel')}
        />
      </div>
    );
  }
}

CandidateStart.propTypes = {
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

export default connect(mapStateToProps)(CandidateStart);

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

const getMenuItems = (positionType, status, endDate) => {
  if (positionType === JOB_TYPES.FullTime) {
    return status === 'FTE_FAIL_WARRANTY'
      ? []
      : [
          {
            action: 'failedWarranty',
            label: 'action:Failed Warranty',
          },
        ];
  }

  if (status !== 'ACTIVE' && !moment().isAfter(moment(endDate))) {
    return [
      {
        action: 'termination',
        label: 'action:Termination',
      },
    ];
  }
  return status === 'ACTIVE'
    ? [
        {
          action: 'termination',
          label: 'action:Termination',
        },
        {
          action: 'extension',
          label: 'action:Extension',
        },
      ]
    : [];
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

import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import moment from 'moment-timezone';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';
import {
  createExtension,
  updateStart,
  selectStartToOpen,
  selectExtensionToOpen,
  selectExtensionIdToOpen,
  startCancelTermination,
  getStart,
  OpenOnboarding,
} from '../../../../actions/startActions';
import { getApplication } from '../../../../actions/applicationActions';
import { showErrorMessage } from '../../../../actions';
import { JOB_TYPES, USER_TYPES } from '../../../../constants/formOptions';
import { getExtensionList } from '../../../../selectors/startSelector';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import StartForm from './StartForm';
import StartEditForm from './StartForm/EditForm';
import TerminationForm from '../CandidateStart/HandleStartActionsForm/TerminationForm';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import PotentialButton from '../../../../components/particial/PotentialButton';
import AlertDialog from '../../../../components/particial/AlertDialog';

import { showOnboarding } from '../../../../../utils/index';

import * as ActionTypes from '../../../../constants/actionTypes';

class CandidateExtension extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: props.start && !props.start.get('id'),
      processing: false,

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
    if (this.props.start.get('id') || this.props.start.get('startId')) {
      this.setState({ edit: false, anchorEl: null, processing: false });
      let hasOnboardingBtn = showOnboarding(this.props.start);
      this.props.dispatch(
        selectStartToOpen(this.props.currentStart, hasOnboardingBtn)
      );
      if (this.props.start.get('startType') === 'CONTRACT_EXTENSION') {
        this.props.dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'extension',
        });
      } else if (this.props.start.get('startType') === 'CONVERT_TO_FTE') {
        this.props.dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'conversionStart',
        });
      } else {
        this.props.dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'start',
        });
      }
      this.props.dispatch(
        OpenOnboarding(
          this.props.currentStart.get('applicationId'),
          'openStart',
          this.props.currentStart,
          hasOnboardingBtn
        )
      );
    } else {
      this.handleCloseStartTab();
    }
  };
  handleUpsert = (newStart, extensionId) => {
    const { dispatch } = this.props;
    this.setState({ processing: true });

    if (extensionId) {
      return dispatch(updateStart(newStart, extensionId))
        .then(() => {
          let hasOnboardingBtn = showOnboarding(
            this.props.start.merge(Immutable.fromJS(newStart))
          );
          dispatch(
            selectStartToOpen(
              this.props.start.merge(Immutable.fromJS(newStart)),
              hasOnboardingBtn
            )
          );

          this.props.dispatch(
            OpenOnboarding(
              this.props.start
                .merge(Immutable.fromJS(newStart))
                .get('applicationId'),
              'openStart',
              this.props.start.merge(Immutable.fromJS(newStart)),
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

    console.log(newStart);

    dispatch(createExtension(newStart, newStart.startId))
      .then(async (normalizedData) => {
        newStart.id = normalizedData.result;
        await dispatch(getStart(newStart.startId)).catch((err) =>
          dispatch(showErrorMessage(err))
        );
        let hasOnboardingBtn = showOnboarding(Immutable.fromJS(newStart));
        dispatch(
          selectStartToOpen(Immutable.fromJS(newStart), hasOnboardingBtn)
        );
        dispatch({
          type: ActionTypes.TAB_SELECT,
          selectedTab: 'extension',
        });
        dispatch(
          OpenOnboarding(
            Immutable.fromJS(newStart).get('applicationId'),
            'openStart',
            Immutable.fromJS(newStart),
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

  //menu options
  handleEdit = () => {
    this.setState({ edit: true, anchorEl: null, processing: false });
  };
  handleCloseStartTab = () => {
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

  handleFailedWarranty = () => {
    console.log('handleFailedWarranty');
    this.handleCloseOptions();
    this.setState({
      openFailedWarranty: true,
    });
  };

  handleTermination = () => {
    console.log('handleTermination');
    this.handleCloseOptions();
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

            let hasOnboardingBtn = showOnboarding(Immutable.fromJS(newStart));
            dispatch(
              OpenOnboarding(
                start.get('applicationId'),
                'openStart',
                start,
                hasOnboardingBtn
              )
            );
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
    const { start, dispatch } = this.props;
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
      .remove('endDate')
      .remove('id')
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

    let hasOnboardingBtn = showOnboarding(extension);
    dispatch(
      OpenOnboarding(
        start.get('applicationId'),
        'openStart',
        start,
        hasOnboardingBtn
      )
    );
    this.setState({ edit: true });
  };

  handleRateChange = () => {};

  handleAction = (action) => {
    switch (action) {
      case 'closeTab':
        return this.handleCloseStartTab();
      case 'termination':
        return this.handleTermination();
      case 'cancelTermination':
        return this.handleCancelTermination();
      case 'extension':
        return this.handleExtension();

      default:
        this.handleCloseOptions();
    }
  };

  render() {
    const {
      handleCloseStart,
      start,
      isAm,
      extensionList,
      hasActiveStart,
      ...props
    } = this.props;
    const { anchorEl, edit } = this.state;
    const startId = start.get('id');
    const positionType = start.get('positionType');
    const status = start.get('status');
    const termination = start.get('termination');

    const menuItems = getMenuItems(
      status,
      start.get('startDate'),
      start.get('endDate')
    );
    return (
      <div
        className="flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div className="flex-container flex-container align-middle">
          {startId &&
            (edit ? (
              <Typography className="container-padding" variant="subtitle1">
                {`Edit Current Start Extension`}
              </Typography>
            ) : (
              <div className="container-padding">
                <TextField
                  select
                  value={startId}
                  onChange={(e) => {
                    this.props.dispatch(
                      selectExtensionIdToOpen(e.target.value)
                    );
                    console.log(extensionList.toJS());
                    let _start = extensionList.get(String(e.target.value));
                    console.log(_start);
                    let hasOnboardingBtn = showOnboarding(_start);
                    this.props.dispatch(
                      OpenOnboarding(
                        _start.get('applicationId'),
                        'openStart',
                        _start,
                        hasOnboardingBtn
                      )
                    );
                  }}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  SelectProps={{
                    MenuProps: {
                      MenuListProps: {
                        dense: true,
                        disablePadding: true,
                      },
                    },
                  }}
                >
                  {extensionList.map((s, index) => (
                    <MenuItem key={s.get('id')} value={s.get('id')}>
                      <Typography noWrap>
                        {`Extension ${moment(s.get('startDate')).format('L')}`}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            ))}

          {!startId && (
            <Typography className="container-padding" variant="subtitle1">
              {`Create a Start Extension`}
            </Typography>
          )}
          <Typography className="flex-child-auto" variant="subtitle1">
            {`${getStatusLabel(status)}`}
          </Typography>
          {/*{isAm && startId && !edit && status === 'ACTIVE' && (*/}
          {/*  <IconButton*/}
          {/*    onClick={this.handleEdit}*/}
          {/*    style={{ padding: 8 }}*/}
          {/*    color="primary"*/}
          {/*  >*/}
          {/*    <EditIcon />*/}
          {/*  </IconButton>*/}
          {/*)}*/}

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
              key={startId}
              edit={edit}
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

CandidateExtension.propTypes = {
  t: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { start }) => {
  const currentUserId = state.controller.currentUser.get('id');
  const authorities = state.controller.currentUser.get('authorities');
  const extensionList = getExtensionList(state, start.get('applicationId'));
  const isAdmin =
    authorities &&
    authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' }));
  return {
    isAdmin,
    isAm: checkAM(start, currentUserId) || isAdmin,
    extensionList,
  };
};

export default connect(mapStateToProps)(CandidateExtension);

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

const getMenuItems = (status, startDate, endDate) => {
  if (status === 'CONTRACT_TERMINATED') {
    return [];
  }

  const items = [];

  if (
    !moment().isBefore(moment(startDate)) &&
    !moment().isAfter(moment(endDate))
  ) {
    items.push({
      action: 'termination',
      label: 'action:Termination',
    });
  }
  if (status === 'ACTIVE' && moment().isAfter(moment(endDate))) {
    items.push({
      action: 'termination',
      label: 'action:Termination',
    });
  }
  if (status === 'ACTIVE' && !moment().isBefore(moment(startDate))) {
    items.push({
      action: 'extension',
      label: 'action:Extension',
    });
  }

  return items;
};
const getStatusLabel = (status) => {
  switch (status) {
    case 'CONTRACT_TERMINATED':
      return ' (Terminated)';

    case 'CONTRACT_EXTENDED':
      return ' (Extended)';

    case 'ACTIVE':
    default:
      return '';
  }
};

import React from 'react';
import { connect } from 'react-redux';
import * as FormOptions from '../../../../../constants/formOptions';
import memoizeOne from 'memoize-one';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import Select from 'react-select';

import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';

import FormInput from '../../../../../components/particial/FormInput';
import FormReactSelectContainer from '../../../../../components/particial/FormReactSelectContainer';
import FormTextArea from '../../../../../components/particial/FormTextArea';
import BasicInfoEdit from '../DialogForm/BasicInfo';
import SecondaryButton from '../../../../../components/particial/SecondaryButton';
import { _mapOldAddress } from '../../../../../components/particial/Location';

const styles = {
  root: {
    border: `solid 1px #e5e5e5`,
    borderRadius: 2,
  },
  actionContainer: {
    backgroundColor: `#fafafb`,
    minHeight: 40,
  },
  content: {
    padding: 12,
  },
};

class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };
  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { open } = this.state;
    const { classes, t, start, clientList, isAm } = this.props;
    const startAddress = _mapOldAddress(start.startAddress);
    return (
      <div className={classes.root}>
        <div
          className={clsx(
            'flex-container align-middle align-justify item-padding',
            classes.actionContainer
          )}
        >
          <Typography variant="subtitle2">
            {t('common:Basic Information')}
          </Typography>
          {start.status === 'ACTIVE' && isAm && (
            <SecondaryButton onClick={this.handleOpen} size="small">
              {t('action:edit')}
            </SecondaryButton>
          )}
        </div>
        <div className={classes.content}>
          <div className="row expanded">
            <div className="small-6 columns">
              <FormInput
                name="jobId"
                label={t('field:jobNumber')}
                defaultValue={start.jobId}
                disabled
              />
            </div>
            <div className="small-6 columns">
              <FormInput
                name="jobTitle"
                label={t('field:title')}
                defaultValue={start.jobTitle}
                disabled
              />
            </div>

            <div className="small-6 columns">
              <FormInput
                name="company"
                label={t('field:company')}
                defaultValue={start.company}
                disabled
              />
            </div>
            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Client Contact')}>
                <Select
                  labelKey={'name'}
                  valueKey={'id'}
                  options={clientList}
                  value={start.clientContactId}
                  simpleValue
                  autoBlur
                  clearable={false}
                  openOnFocus
                  disabled
                />
              </FormReactSelectContainer>
              <input
                type="hidden"
                name="clientContactId"
                value={start.clientContactId || ''}
              />
            </div>

            <div className="small-6 columns">
              <FormReactSelectContainer label={t('field:Position Type')}>
                <Select
                  value={start.positionType || ''}
                  simpleValue
                  options={FormOptions.jobType}
                  disabled
                  autoBlur
                  searchable={false}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
            <div className="small-6 columns">
              <FormInput
                label={t('field:location')}
                value={startAddress && startAddress.show}
                disabled
              />
            </div>
          </div>
          {/* 备忘 */}
          <div className="row expanded">
            <div className="small-12 columns">
              <FormTextArea
                label={t('field:note')}
                name="note"
                value={start.note || ''}
                rows={4}
                disabled
              />
            </div>
          </div>
        </div>

        <Dialog open={open}>
          <BasicInfoEdit start={start} t={t} onClose={this.handleClose} />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, { start }) => {
  return {
    clientList: getClientList(state.model.clients, start.clientContactId),
  };
};
export default connect(mapStateToProps)(withStyles(styles)(BasicInfo));

const getClientList = memoizeOne((clients, clientContactId) => {
  return clients
    .filter((c) => c.get('id') === clientContactId)
    .toList()
    .toJS();
});

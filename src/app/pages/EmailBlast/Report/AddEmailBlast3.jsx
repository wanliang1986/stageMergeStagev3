import React from 'react';
import { connect } from 'react-redux';
import emailBlastSelector from '../../../selectors/emailBlastSelector';
import PropTypes from 'prop-types';
import { showErrorMessage } from '../../../actions';
import {
  getMyEmailBlastList,
  upsertEmailBlast,
  addRecipientToEmailBlast,
} from '../../../actions/emailAction';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import FormInput from '../../../components/particial/FormInput';
import SecondaryButton from '../../../components/particial/SecondaryButton';
import PrimaryButton from '../../../components/particial/PrimaryButton';

class AddEmailBlast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      name: '',
      processing: false,
    };
  }

  componentDidMount(): void {
    this.props.dispatch(getMyEmailBlastList());
  }

  handleSelect = (e) => {
    this.setState({ selected: e.target.value });
  };

  handleAddEmailBlast = (e) => {
    const { dispatch, recipients, onClose, emailBlastList } = this.props;
    const { selected } = this.state;
    this.setState({ processing: true });
    console.log(recipients.toJS());
    dispatch(
      addRecipientToEmailBlast(
        selected,
        recipients.map((r) => ({
          name:
            r.get('name') || (r.get('email') && r.get('email').split('@')[0]),
          email: r.get('email'),
        }))
      )
    ).then((res) => {
      if (res) {
        onClose({
          count: res.length,
          emailBlast: emailBlastList.find(
            (el) => String(el.get('id')) === selected
          ),
        });
      } else {
        this.setState({ processing: false });
      }
    });
  };

  handleCreateEmailBlast = () => {
    const { dispatch, t } = this.props;
    const { name } = this.state;
    if (!name.trim()) {
      return dispatch(
        showErrorMessage({ message: t('message:groupNameIsRequired') })
      );
    }

    dispatch(upsertEmailBlast({ name, description: name })).then((res) => {
      if (res) {
        // onClose();
        this.setState({ selected: String(res.id), name: '' });
      }
    });
  };

  render() {
    const { selected, name } = this.state;
    const { t, onClose, emailBlastList } = this.props;
    console.log(selected);
    return (
      <>
        <DialogTitle>{t('common:addCandidatesToEmailBlast')}</DialogTitle>
        <DialogContent>
          <div className="flex-container align-top">
            <div className="columns">
              <FormInput
                value={name}
                onChange={(e) => this.setState({ name: e.target.value })}
              />
            </div>
            <SecondaryButton size="small" onClick={this.handleCreateEmailBlast}>
              {t('common:addNewEmailBlast')}
            </SecondaryButton>
          </div>

          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={selected}
            onChange={this.handleSelect}
          >
            {emailBlastList.map((el) => (
              <FormControlLabel
                key={el.get('id')}
                value={String(el.get('id'))}
                control={<Radio color="primary" />}
                label={el.get('name')}
              />
            ))}
          </RadioGroup>
        </DialogContent>

        <DialogActions>
          <div className="horizontal-layout">
            <SecondaryButton onClick={() => onClose()}>
              {t('action:cancel')}
            </SecondaryButton>

            <PrimaryButton
              disabled={!selected}
              onClick={this.handleAddEmailBlast}
              processing={this.state.processing}
            >
              {t('action:save')}
            </PrimaryButton>
          </div>
        </DialogActions>
      </>
    );
  }
}

AddEmailBlast.propTypes = {
  recipients: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state) {
  return {
    emailBlastList: emailBlastSelector(state),
  };
}

export default connect(mapStoreStateToProps)(AddEmailBlast);

import React from 'react';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { upsertEmailBlast } from '../../actions/emailAction';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import PotentialButton from '../../components/particial/PotentialButton';
import FormInput from '../../components/particial/FormInput';
import FormTextArea from '../../components/particial/FormTextArea';

const styles = (theme) => ({
  chip: {
    margin: '0 12px 10px 0',
  },
  content: {
    height: 500,
    display: 'flex',
  },
  formContainer: {
    border: '1px solid #cacaca',
    '&>:first-child': {
      borderRight: '1px solid #cacaca',
    },
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

class CreateForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // indexList: props.userList.map((value, index) => index), //index of filteredList
      errorMessage: Immutable.Map(),
      // hotListUsers: Immutable.Set(),
      // selectMode: 0
      processing: false,
    };
  }
  handleSubmit = (e) => {
    e.preventDefault();

    const emailBlastForm = e.target;
    const { dispatch, t, emailBlast, onClose } = this.props;
    let errorMessage = Immutable.Map();
    const name = emailBlastForm.name.value.trim();
    const description = emailBlastForm.description.value.trim();

    if (!name) {
      errorMessage = errorMessage.set('title', t('message:Name is required'));
    }
    if (!description) {
      errorMessage = errorMessage.set(
        'notes',
        t('message:Please enter a note')
      );
    }

    if (errorMessage.size > 0) {
      return this.setState({ errorMessage });
    }
    this.setState({ processing: true });
    dispatch(
      upsertEmailBlast({ name, description }, emailBlast.get('id'))
    ).then((res) => {
      if (res) {
        onClose();
      }
      this.setState({ processing: false });
    });
  };

  removeErrorMessage = (key) => {
    this.setState({
      errorMessage: this.state.errorMessage.delete(key),
    });
  };

  render() {
    const { t, classes, emailBlast, onClose } = this.props;
    const { processing, errorMessage } = this.state;

    return (
      <>
        <DialogTitle id="upsert-team-title">
          {emailBlast.get('id')
            ? t('common:editEmailBlast')
            : t('common:createEmailBlast')}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={this.handleSubmit} id="emailBlastForm">
            <div>
              <FormInput
                name="name"
                label={t('field:emailBlastName')}
                defaultValue={emailBlast.get('name') || ''}
                isRequired
                errorMessage={errorMessage.get('title')}
                onBlur={() => this.removeErrorMessage('title')}
              />

              <FormTextArea
                name="description"
                label={t('field:emailBlastDescription')}
                defaultValue={emailBlast.get('description') || ''}
                isRequired
                rows="3"
                onBlur={() => this.removeErrorMessage('notes')}
                errorMessage={errorMessage.get('notes')}
              />
            </div>
          </form>
        </DialogContent>

        <DialogActions>
          <SecondaryButton onClick={onClose} size="small">
            {t('action:cancel')}
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            size="small"
            form="emailBlastForm"
            processing={processing}
          >
            {t('action:save')}
          </PrimaryButton>
          <div className="flex-child-auto" />
        </DialogActions>
      </>
    );
  }
}

CreateForm.defaultProps = {
  emailBlast: Immutable.Map(),
};

export default withStyles(styles)(CreateForm);

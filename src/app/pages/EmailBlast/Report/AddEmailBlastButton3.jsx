import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';
import { Trans } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';

import AddEmailBlast from './AddEmailBlast3';
import PotentialButton from '../../../components/particial/PotentialButton';

class AddEmailBlastButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEmailBlast: false,
      openMessage: false,
      message: '',
    };
  }

  handleToEmailBlast = () => {
    const { res } = this.state;
    if (res && res.emailBlast) {
      this.props.dispatch(
        push('/emailblast/detail/' + res.emailBlast.get('id'))
      );
    }
  };

  render() {
    const { openMessage, message, openEmailBlast } = this.state;
    const { data, t, ...props } = this.props;
    return (
      <>
        <PotentialButton
          disabled={data.size === 0}
          size="small"
          onClick={() => this.setState({ openEmailBlast: true })}
        >
          {'Add to a email blast group'}
        </PotentialButton>
        <Dialog
          open={openEmailBlast}
          fullWidth
          maxWidth="sm"
          disableEnforceFocus
          onClose={() => this.setState({ openEmailBlast: false })}
        >
          <AddEmailBlast
            {...props}
            t={t}
            recipients={data}
            onClose={(res) =>
              this.setState({
                openEmailBlast: false,
                message: res &&
                  `${
                    res.count
                  } Candidates has been added to Email Blast Group "${res.emailBlast.get(
                    'name'
                  )}".` && (
                    <Trans i18nKey="message:addTalentToEmailBlastSuccess">
                      <strong>{{ number: String(res.count) || '3232' }}</strong>
                      Candidates has been added to Email Blast Group "
                      <strong>{{ name: res.emailBlast.get('name') }}</strong>".
                    </Trans>
                  ),

                openMessage: Boolean(res),
                res,
              })
            }
          />
        </Dialog>

        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={openMessage}
          autoHideDuration={6000}
          onExit={() => this.setState({ message: '' })}
          onClose={() => this.setState({ openMessage: false })}
          message={message}
          action={
            <React.Fragment>
              <Button
                color="primary"
                size="small"
                onClick={this.handleToEmailBlast}
              >
                {t('action:viewGroup')}
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => this.setState({ openMessage: false })}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </>
    );
  }
}

export default withTranslation()(connect()(AddEmailBlastButton));

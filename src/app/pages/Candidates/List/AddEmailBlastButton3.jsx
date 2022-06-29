import React from 'react';
import { push } from 'connected-react-router';
import { Trans } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';

import CloseIcon from '@material-ui/icons/Close';
import { AddToEmailBlastIcon } from '../../../components/Icons';

import AddEmailBlast3 from './AddEmailBlast3';

class AddEmailBlastButton3 extends React.Component {
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
    const { talentIds, t, ...props } = this.props;
    return (
      <>
        <IconButton
          disabled={talentIds.size === 0}
          onClick={() => this.setState({ openEmailBlast: true })}
        >
          <AddToEmailBlastIcon />
        </IconButton>
        <Dialog
          open={openEmailBlast}
          fullWidth
          maxWidth="sm"
          disableEnforceFocus
          onClose={() => this.setState({ openEmailBlast: false })}
        >
          <AddEmailBlast3
            {...props}
            t={t}
            talentIds={talentIds}
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

export default AddEmailBlastButton3;

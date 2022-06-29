import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import Immutable from 'immutable';
import emailBlastSelector from '../../selectors/emailBlastSelector';
import { withStyles } from '@material-ui/core';
import templateSelector from '../../selectors/templateSelector';

import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import PrimaryButton from '../particial/PrimaryButton';
// import EmailField from './EmailField';
import FormInput from '../particial/FormInput';

import AttachIcon from '@material-ui/icons/AttachFile';
// import { Parser as HtmlToReactParser } from 'html-to-react';

const styles = (theme) => ({
  editor: {
    '& div.mce-edit-area': {
      marginTop: 40,
      position: 'relative',
    },
  },
  salutation: {
    position: 'absolute',
    top: -36,
    left: 12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  paper: {
    width: 300,
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center',
    // height: 300,
    padding: 12,
  },
  dateCalendarMenu: {
    zIndex: theme.zIndex.tooltip,
  },
  htmlContainer: {
    overflow: 'auto',
    height: 'calc(100vh - 430px)',
    maxHeight: 800,
    minHeight: 300,
    // minHeight:400,
    marginBottom: 12,
    // padding: 8,
    border: '1px solid #cacaca',
    // backgroundColor: '#f2f2f2',
    '& iframe': {
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      border: 0,
      outline: 0,
      verticalAlign: 'top',
      background: 'transparent',
    },
  },
});

// const htmlToReactParser = new HtmlToReactParser();

class SendEmailToTalents extends React.Component {
  constructor(props) {
    super(props);
    const emailListIds = this.props.sent
      .get('mailingLists')
      .toJS()
      .reduce((acc, ele, index) => {
        if (index === this.props.sent.get('mailingLists').size - 1) {
          return acc + ele.name;
        } else {
          return acc + ele.name + ', ';
        }
      }, '');
    // console.log('emailListIds', emailListIds);
    this.state = {
      emailListIds,
      selectedGreeting: ' ',
      subject: this.props.sent.get('subject'),
      body: this.props.sent.get('content'),

      files: this.props.sent.get('attachments').toJS(),
    };
  }

  render() {
    const { emailListIds, files, body } = this.state;
    const { t, classes } = this.props;

    return (
      <React.Fragment>
        <DialogTitle disableTypography id="draggable-dialog-title">
          <Typography variant="h5">{t('common:Email History')}</Typography>
        </DialogTitle>

        <DialogContent>
          <div className="apn-item-padding flex-child-auto flex-container flex-dir-column">
            <div>
              <FormInput
                label={t('field:Recipients')}
                disabled
                value={emailListIds}
              />
            </div>

            <div>
              <FormInput
                label={t('field:subject')}
                disabled
                value={this.state.subject}
              />
            </div>

            <div
              className="flex-container  flex-dir-column"
              style={{ marginBottom: 8 }}
            >
              {files.map((ele, i) => (
                <div key={i}>
                  <AttachIcon
                    style={{
                      fontSize: 16,
                      color: '#797979',
                      verticalAlign: 'middle',
                    }}
                  />
                  <span style={{ fontSize: 12, color: '#797979' }} key="i">
                    {ele.name}
                  </span>
                </div>
              ))}
            </div>

            <div className={classes.htmlContainer}>
              {/*{htmlToReactParser.parse(body || '')}*/}
              <iframe
                src={`data:text/html;charset=utf-8,${encodeURIComponent(
                  getPreviewHtml(body)
                )}`}
                frameBorder="0"
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={this.props.onClose}>
            {t('action:cancel')}
          </PrimaryButton>
        </DialogActions>
      </React.Fragment>
    );
  }
}

SendEmailToTalents.propTypes = {
  onClose: PropTypes.func,
};

export default connect()(withStyles(styles)(SendEmailToTalents));

function getPreviewHtml(content) {
  var previewHtml;
  var headHtml = '';
  previewHtml =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    headHtml +
    '</head>' +
    '<body id="" class="mce-content-body">' +
    content +
    '</body>' +
    '</html>';

  return previewHtml;
}

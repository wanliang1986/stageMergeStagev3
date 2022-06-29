import React from 'react';
import { addRecipientToEmailBlast } from '../../actions/emailAction';
import { exportJson, handleFile, SheetJSFT } from '../../../utils/sheet';
import { isEmail } from '../../../utils';
import Immutable from 'immutable';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import SecondaryButton from '../../components/particial/SecondaryButton';
import PrimaryButton from '../../components/particial/PrimaryButton';
import PotentialButton from '../../components/particial/PotentialButton';
import * as Colors from '../../styles/Colors';
import { showErrorMessage } from '../../actions';
import RecipientTable from '../../components/Tables/RecipientTable';

const styles = {
  column: {
    width: 190,
    margin: '0 40px',
  },
  img: {
    width: 65,
    margin: '20px auto',
    paddingTop: 83,
    backgroundSize: 'cover',
  },

  text: {
    color: Colors.SUB_TEXT,
    lineHeight: 1.2,
    margin: '8px 0 16px',
  },

  noDisplay: {
    display: 'none',
  },
};
const columns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 2,
    col: 'name',
    sortable: true,
  },
  {
    colName: 'email',
    colWidth: 200,
    flexGrow: 2,
    col: 'email',
    sortable: true,
  },
];

class AddRecipientForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipients: Immutable.List(),
      errorData: [],
      open: false,
      processing: false,
    };
  }

  handleUploadExcel = (e) => {
    const fileInput = e.target;
    const excelFile = fileInput.files[0];
    if (excelFile) {
      return handleFile(excelFile)
        .then(({ data }) => {
          fileInput.value = '';
          console.log(data);
          //check if first row is header
          if (!isEmail(data[0][1])) {
            data = data.slice(1);
          }
          const content = data.reduce(
            (res, el) => {
              if (el[0] && el[1] && isEmail(el[1].trim())) {
                res.data.push({
                  id: el[1].trim(),
                  name: el[0].trim(),
                  email: el[1].trim(),
                  source: 'MANUALLY_ADDED',
                });
              } else {
                res.errorData.push(el);
              }

              return res;
            },
            {
              data: [],
              errorData: [],
            }
          );

          this.setState({
            recipients: Immutable.fromJS(content.data),
            errorData: content.errorData,
            fileName: excelFile.name,
            open: true,
          });
        })
        .catch((err) => this.props.dispatch(showErrorMessage(err)));
    }
    this.props.dispatch(
      showErrorMessage({ message: 'Failed to Parse selected File' })
    );
  };

  handleClose = () => {
    this.setState({
      recipients: Immutable.List(),
      open: false,
      processing: false,
    });
  };

  handleSave = () => {
    const { recipients } = this.state;
    const { dispatch, emailBlastId } = this.props;
    this.setState({ processing: true });
    dispatch(
      addRecipientToEmailBlast(
        emailBlastId,
        recipients.map((el) => el.remove('id'))
      )
    ).then((res) => {
      if (res) {
        this.handleClose();
      } else {
        this.setState({ processing: false });
      }
    });
  };

  downloadError = () => {
    //todo: fix download error data
    const { errorData } = this.state;
    exportJson(
      errorData.map((el) => ({
        Name: el[0],
        Email: el[1],
      })),
      {
        headers: [
          {
            name: 'Name',
            width: 28,
          },
          {
            name: 'Email',
            width: 32,
          },
        ],
        fileName: `error data`,
      }
    );
  };

  render() {
    const { recipients, processing, errorData } = this.state;
    const { t } = this.props;
    return (
      <>
        <PotentialButton
          fullWidth
          onChange={this.handleUploadExcel}
          component="label"
        >
          {t('action:uploadExcel')}
          <input
            key="excel"
            type="file"
            style={styles.noDisplay}
            accept={SheetJSFT}
          />
        </PotentialButton>
        <Dialog open={this.state.open} fullWidth>
          <DialogTitle>{t('common:addEmailAddress')}</DialogTitle>
          <Typography variant="body2" gutterBottom className="item-padding">
            <b>{recipients.size.toLocaleString()} mapped data row</b> will be
            imported.
            {errorData.length > 0 && (
              <>
                <Link onClick={this.downloadError} color="secondary">
                  {errorData.length.toLocaleString()} error data
                </Link>{' '}
                will not be imported
              </>
            )}
          </Typography>
          <div
            className="flex-child-auto"
            style={{
              overflow: 'hidden',
              height: 600,
              border: '1px solid #eaeaea',
            }}
          >
            <RecipientTable dataList={recipients} columns={columns} />
          </div>
          <DialogActions>
            <SecondaryButton onClick={this.handleClose} size="small">
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              size="small"
              processing={processing}
              onClick={this.handleSave}
              disabled={recipients.size === 0}
            >
              {t('action:submit')}
            </PrimaryButton>
            <div className="flex-child-auto" />
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default AddRecipientForm;

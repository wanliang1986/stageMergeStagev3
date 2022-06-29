import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { getJobTypeLabel } from '../../../../constants/formOptions';
import {
  getJobKeywordsByJD,
  uploadJobDescription,
} from '../../../../actions/jobActions';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';

import CloseIcon from '@material-ui/icons/Close';

import JobDescription from '../../JobDescriptionRich2';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import SecondaryButton from '../../../../components/particial/SecondaryButton';
import { showErrorMessage } from '../../../../actions';

class UploadJobDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parsing: false,
      job: {},
    };
    this.jd = {
      jdText: '',
      publicDesc: '',
    };
  }

  handleTextChange = (jd) => {
    this.jd = jd;
  };
  handleNext = () => {
    if (!this.jd.jdText) {
      return this.props.dispatch(showErrorMessage('Text is required'));
    }
    if (this.jd.jdText.length < 50) {
      return this.props.dispatch(showErrorMessage('Text is too short'));
    }
    this.handleParseJD(this.jd);

    // const preHtml =
    //   "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    // const postHtml = '</body></html>';
    // const html = preHtml + this.text + postHtml;
    //
    // const blob = new File(['\ufeff', html], 'jd.docx',{
    //   type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // });
    // this._handleUploadJDFile(blob);
  };

  _handleNav = (job = {}) => {
    job.jobType = this.props.jobType;
    this.props.history.push(
      `/jobs/create?type=${this.props.jobType}`,
      Object.assign({}, this.props.location.state, {
        job,
      })
    );
  };

  _handleUploadJDFile = (jdFile) => {
    console.log(jdFile);
    if (jdFile) {
      this.setState({ parsing: true });
      this.props.dispatch(uploadJobDescription(jdFile)).then(
        (newJob) => {
          if (newJob) {
            this._handleNav(newJob);
          } else {
            this.setState({
              parsing: false,
            });
          }
        },
        () => {
          this.setState({ parsing: false });
        }
      );
    }
  };

  handleUploadJDFile = (e) => {
    const fileInput = e.target;
    const jdFile = fileInput.files[0];
    fileInput.value = '';
    this._handleUploadJDFile(jdFile);
  };

  handleParseJD = (jd) => {
    const { jdText } = jd;
    if (jdText) {
      this.setState({ parsing: true });
      return this.props.dispatch(getJobKeywordsByJD(jdText)).then(
        (newJob) => {
          if (newJob) {
            newJob.jdText = jdText;
            newJob.publicDesc = jd.publicDesc;
            this._handleNav(newJob);
          } else {
            this.setState({
              parsing: false,
            });
          }
        },
        () => {
          this.setState({ parsing: false });
        }
      );
    }
  };

  render() {
    const { text, parsing } = this.state;
    const { t, jobType, onClose } = this.props;
    return (
      <div
        className="flex-container flex-dir-column align-center align-middle container-padding"
        style={{ width: 490 }}
      >
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" gutterBottom>
          {console.log(getJobTypeLabel(jobType))}
          {t('common:createJob')} - {t(`tab:${getJobTypeLabel(jobType)}`)}
        </Typography>
        <Typography variant="h6" paragraph>
          {t('message:Provide a Job Description')}
        </Typography>
        <div
          className="flex-child-auto vertical-layout"
          style={{ width: '100%' }}
        >
          <Typography variant="caption" gutterBottom>
            {t('tab:FillDetails')}
          </Typography>
          <div
            className="flex-child-auto flex-container flex-dir-column"
            style={{ overflow: 'inherit' }}
          >
            <JobDescription
              t={t}
              text={text}
              onChange={this.handleTextChange}
            />
          </div>
          <Divider />
          <div className={''}>
            <Typography variant="caption">
              {t('message:You can also')}
            </Typography>
            <Link>
              <Typography
                variant="caption"
                component={'label'}
                onChange={this.handleUploadJDFile}
              >
                {t('message:upload a job description (.pdf/.txt)')}
                <input type="file" style={{ display: 'none' }} />
              </Typography>
            </Link>

            <Typography variant="caption">{t('message:or')} </Typography>
            <Typography
              variant="caption"
              component={Link}
              onClick={() => this._handleNav()}
            >
              {t('message:create a job manually')}
            </Typography>
          </div>
          <div className="horizontal-layout">
            <SecondaryButton size="small" onClick={onClose}>
              {t('action:cancel')}
            </SecondaryButton>
            <PrimaryButton
              size="small"
              processing={parsing}
              onClick={this.handleNext}
            >
              {t('action:next')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(withRouter(UploadJobDescription));

import React from 'react';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../../constants/actionTypes';
import { getRecommendedTenantTalentList } from '../../../../../../apn-sdk';
import Immutable from 'immutable';

import Portal from '@material-ui/core/Portal';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import RenewIcon from '@material-ui/icons/Autorenew';

import NewCandidateTable from './../../../../../components/Tables/NewCandidateTable';
import Loading from './../../../../../components/particial/Loading';
import ApplyJobFromTenant from './ApplyJobFromTenant';
import { Alert } from '@material-ui/lab';
import { showErrorMessage } from '../../../../../actions/index';

const errorMessages = {
  UNABLE_TO_RECOMMEND: 'UNABLE_TO_RECOMMEND',
  ERROR: 'ERROR',
};

class TalentPool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      total: -1,
      errorMessage: '',
      finished: false,

      openApply: false,
      selectedTalentId: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.unmounted = true;
    clearTimeout(this.task);
  }

  fetchData = () => {
    this.setState({ loading: true });
    const { jobId } = this.props;
    getRecommendedTenantTalentList(jobId)
      .then(({ response }) => {
        if (!this.unmounted) {
          let talents;
          switch (response.status) {
            case 'STARTED':
            case 'ON_GOING':
              talents = Immutable.fromJS(
                response.talents.map((talent) => ({
                  ...talent,
                  score: Math.round(talent.score * 100),
                }))
              );
              this.props.dispatch({
                type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
                talentList: talents,
              });

              this.setState({
                loading: false,
                total: response.total,
                finished: false,
              });
              this.task = setTimeout(() => {
                this.fetchData();
              }, 500);
              break;
            case 'FINISHED':
              talents = Immutable.fromJS(
                response.talents.map((talent) => ({
                  ...talent,
                  score: Math.round(talent.score * 100),
                }))
              );
              this.props.dispatch({
                type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
                talentList: talents,
              });
              this.setState({
                loading: false,
                total: response.total,
                finished: true,
              });
              break;
            // case 'UNABLE_TO_RECOMMEND':
            case 'ERROR':
            case 'UNABLE_TO_RECOMMEND':
            case null:
              this.props.dispatch({
                type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
                talentList: Immutable.List(),
              });
              this.setState({
                loading: false,
                total: 0,
                errorMessage: errorMessages[response.status],
              });
          }
        }
      })
      .catch((err) => {
        if (err.code === 406) {
          this.props.dispatch({
            type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
            talentList: Immutable.List(),
          });
          this.setState({
            loading: false,
            total: 0,
            errorMessage: 'UNABLE_TO_RECOMMEND',
          });
        } else if (err.code === 404) {
          if (!this.unmounted) {
            this.task = setTimeout(() => {
              this.fetchData();
            }, 500);
          }
        } else {
          this.props.dispatch({
            type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
            talentList: Immutable.List(),
          });
          this.setState({
            loading: false,
            total: 0,
            errorMessage: err.message,
          });
        }
      });
  };

  handleApply = (selectedTalentId) => {
    this.setState({ openApply: true, selectedTalentId });
  };

  render() {
    const {
      loading,
      total,
      errorMessage,
      finished,
      openApply,
      selectedTalentId,
    } = this.state;
    const { metaContainer, t, jobId } = this.props;
    if (total === -1) {
      return <Loading />;
    }
    if (errorMessage) {
      if (errorMessage === 'UNABLE_TO_RECOMMEND') {
        return (
          <div className={'container-padding'}>
            <Alert severity="info" style={{ border: 'solid 1px #3398db' }}>
              {getMessage(errorMessage, jobId, t)}
            </Alert>
          </div>
        );
      } else {
        return <Typography>{errorMessage}</Typography>;
      }
    }
    return (
      <>
        <NewCandidateTable
          onApply={(id) => {
            this.handleApply(id);
          }}
        />
        <Portal container={metaContainer}>
          <div className="item-padding">
            {!finished && (
              <IconButton
                color="primary"
                size="small"
                className={loading ? 'my-spin2' : ''}
                onClick={this.fetchData}
              >
                <RenewIcon />
              </IconButton>
            )}
            <Typography
              variant="body2"
              component="span"
              style={{ whiteSpace: 'nowrap' }}
            >
              {total && total.toLocaleString()} {t('common:results')}
            </Typography>
          </div>
        </Portal>
        <Dialog open={openApply} fullWidth maxWidth={'md'}>
          <ApplyJobFromTenant
            t={t}
            talentId={Number(selectedTalentId)}
            jobId={Number(jobId)}
            handleRequestClose={() => {
              this.setState({ openApply: false }), this.fetchData();
            }}
          />
        </Dialog>
      </>
    );
  }
}

const getMessage = (message, jobId, t) => {
  if (message === 'UNABLE_TO_RECOMMEND') {
    return (
      <>
        <div style={{ color: '#157fc5', fontSize: '15px' }}>
          {t('message:No results found')}
        </div>
        <div style={{ color: '#157fc5', fontSize: '15px' }}>
          {`Please add `}
          <Link to={`/jobs/detail/${jobId}`} style={{ fontWeight: 'blod' }}>
            {' job title '}
          </Link>
          {' or '}
          <Link to={`/jobs/detail/${jobId}`} style={{ fontWeight: 'blod' }}>
            {'required skills'}
          </Link>
          {' in order to get candidate recommendation.'}
        </div>
      </>
    );
  }
  return message;
};

export default connect()(TalentPool);

import React from 'react';
import { connect } from 'react-redux';
import * as ActionTypes from '../../../../../constants/actionTypes';
import { getRecommendedTenantTalentList } from '../../../../../../apn-sdk';
import Immutable from 'immutable';
import { makeCancelable } from '../../../../../../utils';

import Portal from '@material-ui/core/Portal';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import { Link } from 'react-router-dom';
import RenewIcon from '@material-ui/icons/Autorenew';

import NewCandidateTable from './../../../../../components/Tables/NewCandidateTable';
import Loading from './../../../../../components/particial/Loading';
import ApplyJobFromTenant from './ApplyJobFromTenant';
import { Alert, AlertTitle } from '@material-ui/lab';

const errorMessages = {
  UNABLE_TO_RECOMMEND: 'UNABLE_TO_RECOMMEND',
  ERROR: 'ERROR',
  FINISHED_NO_RESULTS: 'FINISHED_NO_RESULTS',
  LOADING_NO_RESULT: 'LOADING_NO_RESULT',
};
const PAGE_SIZE = 15;

class TalentPool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      total: -1,
      errorMessage: '',

      finished: true,

      openApply: false,
      selectedTalentId: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.dataTask) {
      this.dataTask.cancel();
    }
    clearTimeout(this.dataTimer);
  }

  fetchData = () => {
    if (this.state.loading || this.unmounted) {
      return;
    }
    this.setState({ loading: true, finished: false });
    const { jobId } = this.props;

    this.dataTask = makeCancelable(getRecommendedTenantTalentList(jobId));
    this.dataTask.promise
      .then(({ response }) => {
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
              errorMessage: talents.size < PAGE_SIZE ? 'LOADING_NO_RESULT' : '',
            });
            this.dataTimer = setTimeout(() => {
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
              errorMessage: response.total === 0 ? 'FINISHED_NO_RESULTS' : '',
            });
            break;

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
              errorMessage: errorMessages[response.status] || 'ERROR',
              finished: true,
            });
        }
      })
      .catch((err) => {
        if (err.isCanceled) {
          return;
        }

        if (err.code === 406) {
          this.props.dispatch({
            type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
            talentList: Immutable.List(),
          });
          this.setState({
            loading: false,
            total: 0,
            finished: true,
            errorMessage: 'UNABLE_TO_RECOMMEND',
          });
        } else if (err.code === 404) {
          this.dataTimer = setTimeout(() => {
            this.fetchData();
          }, 500);
        } else {
          this.props.dispatch({
            type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
            talentList: Immutable.List(),
          });
          this.setState({
            loading: false,
            finished: true,
            total: 0,
            errorMessage: err.message || 'ERROR',
          });
        }
      });
  };

  handleApply = (selectedTalentId) => {
    this.setState({ openApply: true, selectedTalentId });
  };

  render() {
    const { total, errorMessage, finished, openApply, selectedTalentId } =
      this.state;
    const { metaContainer, t, jobId } = this.props;

    //initial loading
    if (total === -1) {
      return (
        <div
          className={'container-padding flex-container'}
          style={{ height: '80%' }}
        >
          <Loading />
        </div>
      );
    }

    //error message
    if (errorMessage) {
      return (
        <div className={'container-padding'}>
          {getMessage(errorMessage, jobId, t)}
        </div>
      );
    }

    return (
      <>
        <NewCandidateTable
          onApply={(id) => {
            this.handleApply(id);
          }}
          pageSize={PAGE_SIZE}
        />

        <Portal container={metaContainer}>
          <div className="item-padding">
            <IconButton
              color="primary"
              size="small"
              className={!finished ? 'my-spin2' : ''}
              onClick={() => finished && this.fetchData()}
            >
              <RenewIcon />
            </IconButton>
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
              this.setState({ openApply: false });
              this.fetchData();
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
      <Alert severity="info" style={{ border: 'solid 1px #3398db' }}>
        <AlertTitle>{t('message:Unable to recommend')}</AlertTitle>
        {`Please add `}
        <Link to={`/jobs/detail/${jobId}`}>
          <strong> {' job title '}</strong>
        </Link>
        {' or '}
        <Link to={`/jobs/detail/${jobId}`}>
          <strong> {'required skills'}</strong>
        </Link>
        {' in order to get candidate recommendation.'}
      </Alert>
    );
  }

  if (message === 'FINISHED_NO_RESULTS') {
    return (
      <Alert severity="info" style={{ border: 'solid 1px #3398db' }}>
        <AlertTitle>{t('message:No results found')}</AlertTitle>
        {t(`message:NoResFound`)}
        <br />
        {t(`tab:Required Skills`)} <br />
        {t(`tab:Job Function`)}
        <br />
        {t(`tab:Location (Country)`)} <br />
        {t(`tab:Required Languages`)} <br />
        {t(`tab:Years of Experience`)} <br />
        {t(`tab:Education Degree`)} <br />
        {t(`tab:Industry`)} <br />
      </Alert>
    );
  }

  if (message === 'LOADING_NO_RESULT') {
    return (
      <>
        <Alert severity="info" style={{ border: 'solid 1px #3398db' }}>
          {t('message:Loading...')}
        </Alert>
      </>
    );
  }

  if (message === 'ERROR') {
    return (
      <Alert severity="error" style={{ border: 'solid 1px #ef5350' }}>
        <AlertTitle>{t('message:Error')}</AlertTitle>
        {t('message:Something went wrong')}
      </Alert>
    );
  }

  return (
    <Alert severity="error" style={{ border: 'solid 1px #ef5350' }}>
      <AlertTitle>{t('message:Error')}</AlertTitle>
      {message}
    </Alert>
  );
};

export default connect()(TalentPool);

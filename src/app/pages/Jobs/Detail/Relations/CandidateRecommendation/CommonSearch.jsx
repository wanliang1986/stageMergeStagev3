import React from 'react';
import { getRecommendedCommonTalentList } from '../../../../../../apn-sdk';
import Immutable from 'immutable';
import { makeCancelable } from '../../../../../../utils';

import Portal from '@material-ui/core/Portal';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import RenewIcon from '@material-ui/icons/Autorenew';

import NewCandidateComTable from './../../../../../components/Tables/NewCandidateComTable';
import Loading from './../../../../../components/particial/Loading';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Link } from 'react-router-dom';

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
      talents: null,
      errorMessage: '',
      finished: true,
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
    const { jobId, dispatch } = this.props;
    this.dataTask = makeCancelable(getRecommendedCommonTalentList(jobId));
    this.dataTask.promise
      .then(({ response }) => {
        let talents;
        switch (response.status) {
          case 'STARTED':
          case 'ON_GOING':
            talents = Immutable.fromJS(
              response.commonTalents
                ? response.commonTalents.map((talent) => ({
                    ...talent,
                    score: Math.round(talent.score * 100),
                  }))
                : []
            );
            if (!talents.equals(this.state.talents)) {
              this.setState({
                total: response.total,
                talents,
              });
            }
            this.setState({
              loading: false,
              errorMessage: talents.size < PAGE_SIZE ? 'LOADING_NO_RESULT' : '',
            });

            this.dataTimer = setTimeout(() => {
              this.fetchData();
            }, 500);
            break;

          case 'FINISHED':
            talents = Immutable.fromJS(
              response.commonTalents.map((talent) => ({
                ...talent,
                score: Math.round(talent.score * 100),
              }))
            );

            if (!talents.equals(this.state.talents)) {
              this.setState({
                total: response.total,
                talents,
              });
            }

            this.setState({
              loading: false,
              finished: true,
              errorMessage: response.total === 0 ? 'FINISHED_NO_RESULTS' : '',
            });
            break;

          case 'ERROR':
          case 'UNABLE_TO_RECOMMEND':
          case null:
            this.setState({
              total: 0,
              talents: Immutable.List(),
              loading: false,
              finished: true,
              errorMessage: errorMessages[response.status] || 'ERROR',
            });
        }
      })
      .catch((err) => {
        if (err.isCanceled) {
          return;
        }
        if (err.code === 406) {
          this.setState({
            total: 0,
            talents: Immutable.List(),
            loading: false,
            finished: true,
            errorMessage: 'UNABLE_TO_RECOMMEND',
          });
        } else if (err.code === 404) {
          this.dataTimer = setTimeout(() => {
            this.fetchData();
          }, 500);
        } else {
          this.setState({
            loading: false,
            finished: true,
            talents: Immutable.List(),
            total: 0,
            errorMessage: err.message || 'ERROR',
          });
        }
      });
  };

  render() {
    const { talents, total, errorMessage, finished } = this.state;
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
        <NewCandidateComTable
          {...this.props}
          talentsList={talents}
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
            {/*<span>{talents.size.toLocaleString()}</span>/*/}
            <Typography variant="body2" component="span">
              {total && total.toLocaleString()} {t('common:results')}
            </Typography>
          </div>
        </Portal>
      </>
    );
  }
}

export default TalentPool;

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

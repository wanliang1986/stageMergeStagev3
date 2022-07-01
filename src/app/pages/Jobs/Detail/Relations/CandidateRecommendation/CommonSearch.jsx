import React from 'react';
import { getRecommendedCommonTalentList } from '../../../../../../apn-sdk';
import { formatFullName } from '../../../../../../utils';
import Immutable from 'immutable';

import Portal from '@material-ui/core/Portal';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import RenewIcon from '@material-ui/icons/Autorenew';

import NewCandidateComTable from './../../../../../components/Tables/NewCandidateComTable';
import Loading from './../../../../../components/particial/Loading';
import * as ActionTypes from '../../../../../constants/actionTypes';

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
      talents: Immutable.List(),
      errorMessage: '',
      finished: false,
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
    const { jobId, dispatch } = this.props;
    getRecommendedCommonTalentList(jobId)
      .then(({ response }) => {
        if (!this.unmounted) {
          let talents;
          switch (response.status) {
            case 'STARTED':
            case 'ON_GOING':
              talents = Immutable.fromJS(
                response.commonTalents &&
                  response.commonTalents.map((talent) => ({
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
                talents,
              });
              this.task = setTimeout(() => {
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
              this.props.dispatch({
                type: ActionTypes.RECEIVE_JOB_TALENT_POOL,
                talentList: talents,
              });
              this.setState({
                talents,
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
            errorMessage: err.message,
          });
        } else if (err.code === 404) {
          this.task = setTimeout(() => {
            this.fetchData();
          }, 500);
        } else {
          this.setState({
            loading: false,
            talents: Immutable.List(),
            total: 0,
            errorMessage: err.message,
          });
        }
      });
  };

  loadMore = (rowIndex) => {
    const page = Math.floor(rowIndex / 25);
    if (this.isLoading === page) {
      return;
    }
    this.isLoading = page;
    // console.log(page);
    const { jobId, dispatch } = this.props;
    getRecommendedCommonTalentList(jobId, page, 25)
      .then(({ response }) => {
        this.setState({
          // loading: false,
          talents: this.state.talents.concat(
            Immutable.fromJS(
              response.commonTalents.map((talent) => ({
                id: talent.esId,
                fullName: talent.fullName,
                company:
                  talent.pastExperiences &&
                  talent.pastExperiences
                    .map((item, index) => {
                      return item.companyName;
                    })
                    .join(', '),
                title:
                  talent.pastExperiences &&
                  talent.pastExperiences
                    .map((item, index) => {
                      return item.title;
                    })
                    .join(', '),
                'skills.skillName': talent.skills
                  ? talent.skills
                      .map((item, index) => {
                        return item.skillName;
                      })
                      .join(', ')
                  : '',
                score: Math.round(talent.score * 100),
              }))
            )
          ),
        });
      })
      .finally(() => (this.isLoading = null));
  };

  render() {
    const { loading, talents, total, errorMessage, finished } = this.state;
    const { metaContainer, t } = this.props;
    if (total === -1) {
      return <Loading />;
    }
    if (errorMessage) {
      return <Typography>{errorMessage}</Typography>;
    }
    console.log(metaContainer);
    // const count = finished
    //   ? total > talents.size
    //     ? talents.size + 1
    //     : total
    //   : talents.size;

    return (
      <>
        {/* <CandidateTable
          talentList={talents}
          columns={columns}
          count={count}
          loadMore={this.loadMore}
        /> */}
        <NewCandidateComTable {...this.props} talentsList={talents} />

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

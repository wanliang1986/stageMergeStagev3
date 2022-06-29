import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { getParserOutputByUuid } from '../../../actions/talentActions';
import Immutable from 'immutable';
import { getTalentFromParseResultV2 } from '../../../../utils';
import { showErrorMessage } from '../../../actions';
import { replace } from 'connected-react-router';
import { Redirect } from 'react-router';

import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';

import Loading from '../../../components/particial/Loading';
import CandidateReviewForm from '../newCreate/Basicform/index';
import ResumeFrame from '../../../components/particial/ResumeFrame/LoadableResumeFrame';
import CandidateLayout from '../../../components/particial/CandidateLayout';
import ResumeDuplication from './ResumeDuplication';

class TalentReview extends React.PureComponent {
  state = {
    openResumeDuplication: false,
  };
  fetchData = () => {
    const { dispatch, uuid } = this.props;
    console.log(uuid);
    dispatch(getParserOutputByUuid(uuid))
      .then((resume) => {
        console.log(resume);
        if (resume.talentId) {
          this.setState({
            openResumeDuplication: true,
            resumeDuplication: resume,
          });
        }
      })
      .catch((err) => {
        if (err.status === 404) {
          dispatch(replace('/candidates/nomatch'));
        } else {
          dispatch(showErrorMessage(err));
        }
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const { resumeDuplication, openResumeDuplication } = this.state;
    const { parseResult, recordId, uuid, ...props } = this.props;
    if (!uuid) {
      return <Redirect to={'/candidates/nomatch'} />;
    }
    if (!parseResult) {
      return <Loading />;
    }
    const talent = getTalentFromParseResultV2(parseResult);
    const candidate = Immutable.fromJS(talent);
    const resume = candidate.getIn(['resumes', 0]);
    console.log('talent', candidate.get('resumes').get(0), resume.toJS());

    return (
      <CandidateLayout>
        <Paper className="flex-child-auto flex-container flex-dir-column">
          <CandidateReviewForm
            {...props}
            hasResume={true}
            candidate={candidate}
            recordId={recordId}
            uuid={uuid}
          />
        </Paper>
        <Paper>
          <ResumeFrame resume={resume} />
        </Paper>
        <Dialog open={openResumeDuplication}>
          <ResumeDuplication
            {...props}
            resume={resumeDuplication}
            onClose={() => this.setState({ openResumeDuplication: false })}
          />
        </Dialog>
      </CandidateLayout>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const { recordId, uuid } = match.params;
  const parseResult = uuid && state.model.uuid.get(uuid);
  return {
    recordId,
    parseResult,
    uuid,
  };
}

export default withTranslation(['tab', 'action', 'field', 'message'])(
  connect(mapStoreStateToProps)(TalentReview)
);

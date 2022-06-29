import React from 'react';
import { connect } from 'react-redux';
import { getTalent } from '../../../actions/talentActions';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import TalentInfoCard from '../newCreate/duplicatedTalentList/TalentInfoCard';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import Loading from '../../../components/particial/Loading';
import { formatFullName } from '../../../../utils';

class ResumeDuplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const { resume, dispatch } = this.props;
    dispatch(getTalent(resume.talentId)).finally(() => {
      if (!this.unmounted) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { loading } = this.state;
    const { t, talent, talentId, onClose } = this.props;
    // console.log(talent);
    return (
      <>
        <DialogTitle id="alert-dialog-title">
          {t('message:This resume already exist')}
        </DialogTitle>
        <DialogContent className="vertical-layout" style={{ paddingTop: 0 }}>
          {loading && !talent && <Loading />}
          {talent && <TalentInfoCard talent={talent.toJS()} />}
          {!loading && !talent && (
            <Typography>
              {t('message:Failed to load candidate information')} <br />
              <Link
                href={`/candidates/detail/${talentId}`}
                target="_blank"
                style={{ color: '#e85919' }}
              >
                {talentId}
              </Link>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <PrimaryButton onClick={onClose}>{t('action:confirm')}</PrimaryButton>
        </DialogActions>
      </>
    );
  }
}

const mapStoreStateToProps = (state, { resume }) => {
  const talentId = resume.talentId;
  const talent = state.model.talents.get(String(talentId));

  return {
    talentId,
    talent,
  };
};

export default connect(mapStoreStateToProps)(ResumeDuplication);

import React from 'react';
import memoizeOne from 'memoize-one';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core';
import { SEND_EMAIL_TYPES } from '../../../constants/formOptions';
// import clsx from 'clsx';

import { getResume } from '../../../actions/newCandidate';
import Checkbox from '@material-ui/core/Checkbox';
import { getQuery } from '../../../selectors/talentSelector';
import { Trans } from 'react-i18next';
import { ADD_SEND_EMAIL_REQUEST } from '../../../constants/actionTypes';

import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';

import MailIcon from '@material-ui/icons/Mail';
import SearchIcon from '@material-ui/icons/Search';

import Loading from '../../../components/particial/Loading';
import CreateCandidateButton from './CreateCandidateButton';
import AddEmailBlastButton from '../List/AddEmailBlastButton';
import AddTalentsToHotListButton from '../List/AddTalentsToHotListButton';
import Tooltip from '@material-ui/core/Tooltip';
import AllTable from './table/candidateMyTable';
import SearchBox from './search/index';

import {
  resetPage,
  CandidateGetGeneral,
  candidateGetMyOrAll,
  candidateCurrentPageModel,
} from '../../../actions/newCandidate';

const status = {};

const styles = {
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  btn: {
    justifyContent: 'space-between',
  },
  fend: {
    justifyContent: 'flex-end',
  },
  show: {
    color: '#3398dc',
    marginLeft: 10,
    display: 'inline-block',
    width: '94px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  search: {
    padding: '0 10px',
    boxSizing: 'border-box',
    minHeight: '100px',
  },
  horizontalDivider: {
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
    display: 'inline-block',
    width: 1,
    height: 32,
    margin: '0 10px',
  },
};

class CandidateListMy extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selected: Immutable.Set(),

      showFilter: false,
      preShowSearchBox: false,
      selectedEmails: null,
      general: null,
      preGeneral: null,
    };
  }

  componentDidMount() {
    console.timeEnd('my talents');
    this.props.dispatch(candidateGetMyOrAll(true));
  }

  componentDidUpdate(preProps) {
    console.timeEnd('my talents');
  }

  componentWillUnmount() {
    // this.candidateTask.cancel();
    this.props.dispatch(candidateCurrentPageModel('candidateMy'));
  }

  static getDerivedStateFromProps(props, state) {
    if (props.showSearchBox !== state.preShowSearchBox) {
      return {
        showFilter: props.showSearchBox,
        preShowSearchBox: props.showSearchBox,
      };
    }
    if (props.general !== state.preGeneral) {
      return {
        general: props.general,
        preGeneral: props.general,
      };
    }
    return null;
  }

  handleSendEmailToTalents = () => {
    const { dispatch, talentData } = this.props;
    const { selected, selectedEmails } = this.state;
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToTalents,
        data: {
          talentIds: selected,
          talentList: [],
          emails: talentData
            .filter((d) => selected.includes(d._id))
            .map((t) => t.emails || [])
            .flat()
            .join(','),
        },
      },
    });
  };

  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (/^\s+$/gi.test(e.target.value) === false) {
        this.props.dispatch(resetPage());
        this.props.dispatch(CandidateGetGeneral(e.target.value));
      }
    }
  };

  handleShow = () => {
    this.setState({
      showFilter: !this.state.showFilter,
    });
  };

  getSelected = (arr, emails) => {
    this.setState({
      selected: Immutable.Set(arr),
      selectedEmails: emails,
    });
  };

  changeResumeCheck = (e) => {
    this.props.dispatch(getResume(e.target.checked));
  };

  render() {
    console.time('my talents');
    const { classes, total, talentData, query, t, ...props } = this.props;
    const { selected, showFilter, general } = this.state;

    return (
      <div className="flex-child-auto flex-container flex-dir-column">
        <div className={'flex-container align-middle align-justify'}>
          <div
            className="flex-container align-middle item-padding"
            style={{
              minHeight: 56,
              flexShrink: 0,
              flexWrap: 'wrap',
            }}
          >
            <div className="item-padding">
              <CreateCandidateButton t={t} />
            </div>
            <Typography variant="subtitle1" className={'item-padding'}>
              {total ? total : 0} {t('common:results')}
            </Typography>
            <AddTalentsToHotListButton talentIds={selected} {...props} t={t} />
            <Tooltip title={'Email to candidates'}>
              <span>
                <IconButton
                  disabled={selected.size === 0}
                  onClick={this.handleSendEmailToTalents}
                >
                  <MailIcon />
                </IconButton>
              </span>
            </Tooltip>
            <AddEmailBlastButton talentIds={selected} {...props} t={t} />

            <span className={classes.horizontalDivider} />
            <FormControlLabel
              control={
                <Checkbox
                  checked={props.resume || false}
                  onChange={this.changeResumeCheck}
                  name="resume"
                  color="primary"
                />
              }
              label={t('Candidates with Resume')}
            />
          </div>

          <div style={{ ...styles.flex, ...styles.fend }}>
            <OutlinedInput
              onKeyDown={this.onKeyDown}
              style={{ height: 30, width: 219, background: '#edf5ff' }}
              size="small"
              variant="outlined"
              value={general}
              onChange={(e) => {
                this.setState({
                  general: e.target.value,
                });
              }}
              placeholder="Search Candidates"
              startAdornment={
                <InputAdornment color="disabled" position="start">
                  <SearchIcon style={{ fontSize: 18 }} />
                </InputAdornment>
              }
            />
            <span onClick={this.handleShow} style={{ ...styles.show }}>
              {showFilter ? 'Hide Filters' : 'Show Filters'}
            </span>
          </div>
        </div>
        {showFilter ? <SearchBox /> : <></>}
        <Divider />
        <div className="flex-child-auto">
          <AllTable getSelected={this.getSelected} />
        </div>
      </div>
    );
  }
}

function mapStoreStateToProps(state) {
  const total = state.controller.newCandidateJob.get('count');
  const talentData = state.controller.newCandidateJob.get('tableData');
  const { count, resume, basicSearch, advancedFilter, general } =
    state.controller.newCandidateJob.toJS();
  const showSearchBox =
    Object.values(basicSearch).some((_item) => !!_item) ||
    Object.values(advancedFilter).length !== 0;
  return {
    total,
    searching: state.controller.searchTalents.es.isFetching,
    talentData: talentData,
    query: getQuery(state, 'all'),
    resume,
    showSearchBox,
    general,
  };
}

export default connect(mapStoreStateToProps)(
  withStyles(styles)(CandidateListMy)
);

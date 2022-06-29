import React from 'react';
import { connect } from 'react-redux';
import { getTalentsSubmitToClient } from '../../../actions/talentActions';
import {
  makeCancelable,
  getIndexList,
  sortList
} from '../../../../utils/index';
import { getTalentsSubmitted } from '../../../selectors/talentSelector';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import CandidateTable from '../../../components/Tables/CandidateTable';
import Loading from '../../../components/particial/Loading';

const flexGrow = 1;
const columns = [
  {
    colName: 'name',
    col: 'fullName',
    colWidth: 170,
    flexGrow,
    fixed: true,
    sortable: true,
    type: 'talentNameNewPageLink'
  },
  {
    colName: 'email',
    col: 'email',
    colWidth: 200,
    flexGrow,
    sortable: true
  },
  {
    colName: 'phone',
    col: 'phone',
    colWidth: 150,
    flexGrow
  },
  {
    colName: 'status',
    col: 'currentStatus',
    colWidth: 200,
    sortable: true
  },

  {
    colName: 'jobTitle',
    col: 'jobTitle',
    colWidth: 180,
    flexGrow,
    sortable: true
  },
  {
    colName: 'submittedBy',
    col: 'submittedBy',
    colWidth: 160,
    flexGrow,
    sortable: true
  },
  {
    colName: 'submittedAt',
    col: 'submittedAt',
    colWidth: 155,
    flexGrow,
    type: 'date',
    sortable: true
  },
  {
    colName: 'resume',
    col: 'resume',
    colWidth: 155,
    flexGrow,
    type: 'resume'
  }
];

class CandidateListInClient extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      indexList: getIndexList(props.talentList),
      colSortDirs: {}
    };
  }

  render() {
    let { t, client, talentList } = this.props;
    let name = client.get('name');
    let company = client.get('company');
    let { loading, indexList, colSortDirs } = this.state;
    talentList = indexList.map(index => talentList.get(index));

    return (
      <div
        className="flex-child-auto flex-container flex-dir-column"
        style={{ overflow: 'hidden' }}
      >
        <div className="container-padding">
          <Typography variant="h5">
            {t('common:listOfSubmittedCandidates_Pre')}
            <em>
              <strong style={{ textTransform: 'capitalize' }}>
                {name + '@' + company}
              </strong>
            </em>
            {t('common:listOfSubmittedCandidates_Post')}
          </Typography>

          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <IconButton onClick={this.props.onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </div>
        <div>
          <Divider />
        </div>
        <div style={{ overflow: 'hidden', height: 900 }}>
          {loading ? (
            <Loading />
          ) : (
            <CandidateTable
              talentList={talentList}
              columns={columns}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              t={t}
            />
          )}
        </div>
      </div>
    );
  }

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.talentList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.talentList);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir
      }
    });
  };

  componentDidMount() {
    console.log('did mount');
    this.fetchCandidateList(this._blockTimer());
  }

  componentWillUnmount() {
    this.candidateTask.cancel();
  }

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.talentList,
      state.filters,
      state.colSortDirs
    );

    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  fetchCandidateList = (blockTimerPromise = Promise.resolve()) => {
    const { fetchList, client } = this.props;
    let clientId = client.get('id');

    this.candidateTask = makeCancelable(fetchList(clientId));
    this.candidateTask.promise
      .then(() => {
        blockTimerPromise.then(() => this.setState({ loading: false }));
      })
      .catch(reason => {
        if (!reason.isCanceled) {
          this.setState({ loading: false });
        }
      });
  };

  _blockTimer = (time = 400) => {
    return new Promise(resolve => {
      this.bTimer = setTimeout(resolve, time);
    });
  };
}

const mapStateToProps = (state, props) => {
  return {
    talentList: getTalentsSubmitted(state)
  };
};

const mapDispatchToProps = {
  fetchList: getTalentsSubmitToClient
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidateListInClient);

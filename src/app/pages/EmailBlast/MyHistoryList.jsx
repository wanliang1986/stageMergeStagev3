import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { makeCancelable } from '../../../utils';
import { getMyDraftList } from '../../selectors/templateSelector';
import { getMyEmailBlastHistoryList } from '../../../apn-sdk/email';

import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';

import EmailBlastHistoryTable from '../../components/Tables/EmailBlastHistoryTable';
import SendEmailToTalentsWithEmailHistory from '../../components/sendEmail/EmailBlastHistory';
import DraggablePaperComponent from '../../components/particial/DraggablePaperComponent';
import Loading from '../../components/particial/Loading';
import { showErrorMessage } from '../../actions';

const columns = [
  {
    colName: 'subject',
    colWidth: 240,
    flexGrow: 1,
    col: 'subject',
    disableSearch: true,
  },
  {
    colName: 'To (Email Blast Group)',
    colWidth: 240,
    flexGrow: 1,
    col: 'mailingLists',
    type: 'tos',
    sortable: true,
    disableSearch: true,
  },
  {
    colName: 'Status',
    colWidth: 290,
    flexGrow: 1,
    col: 'status',
    type: 'status',
    disableSearch: true,
  },
  // {
  //   colName: 'Received Count',
  //   colWidth: 140,
  //   flexGrow: 1,
  //   col: 'stats',
  //   type: 'stats',
  //   disableSearch: true
  // },
  {
    colName: 'Sent Date',
    colWidth: 160,
    col: 'timestamp',
    type: 'date',
    sortable: true,
    disableSearch: true,
  },
];

let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

function sortData(data, sort) {
  sort = Object.keys(sort || {}).map((key) => [key, sort[key]])[0] || ['id'];

  return data.sortBy(
    (myCandidate) => myCandidate.get(sort[0]),
    (a, b) => {
      if (a < b) {
        return -((sort[1] === 'ASC') - 0.5);
      }
      if (a > b) {
        return (sort[1] === 'ASC') - 0.5;
      }
      if (a === b) {
        return 0;
      }
    }
  );
}

class TemplateList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      colSortDirs: status.colSortDirs || {},
      dataAll: Immutable.List(),
      dataShow: Immutable.List(),

      handleDeleteTemplate: null,
      sent: null,
      firstFetching: true,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.task.cancel();
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  fetchData() {
    this.task = makeCancelable(getMyEmailBlastHistoryList());
    this.task.promise
      .then((res) => {
        this.setState({
          dataAll: Immutable.fromJS(res.response),
          dataShow: Immutable.fromJS(res.response),
          firstFetching: false,
        });
      })
      .catch((err) => {
        if (!err.isCanceled) {
          this.setState({ firstFetching: false });
          this.props.dispatch(showErrorMessage(err));
        }
      });
  }

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({
      colSortDirs: sort,
      dataShow: sortData(this.state.dataShow, sort),
    });
  };

  onViewEmailHistory = (sent) => {
    // console.log('called', sent);
    this.setState({ sent });
  };

  render() {
    const { templateList, location, ...props } = this.props;
    const { filterOpen, colSortDirs, sent, dataShow, firstFetching } =
      this.state;

    if (firstFetching) {
      return <Loading />;
    }
    return (
      <Paper
        key={location.key}
        className="flex-child-auto flex-container flex-dir-column"
      >
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <EmailBlastHistoryTable
            columns={columns}
            templateList={dataShow}
            filterOpen={filterOpen}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            filters={this.state.filters}
            onViewEmailHistory={this.onViewEmailHistory}
          />
        </div>

        {sent !== null && (
          <Dialog
            open={true}
            maxWidth="md"
            fullWidth
            PaperComponent={DraggablePaperComponent}
            disableEnforceFocus
          >
            <SendEmailToTalentsWithEmailHistory
              {...props}
              sent={sent}
              onClose={() => this.setState({ sent: null })}
            />
          </Dialog>
        )}
      </Paper>
    );
  }
}

TemplateList.propTypes = {
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  t: PropTypes.func.isRequired,
};

function mapStoreStateToProps(state) {
  return {
    templateList: getMyDraftList(state),
  };
}

export default withTranslation(['action', 'field', 'message'])(
  connect(mapStoreStateToProps)(TemplateList)
);

import React, { Component } from 'react';
import Immutable from 'immutable';
import { makeStyles } from '@material-ui/core/styles';
import { getEmailDetailByIdByStatus } from '../../../../apn-sdk';

import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import EmailBlastHistoryTable from '../../../components/Tables/EmailBlastHistoryTable';
import AddEmailBlastButton from './AddEmailBlastButton3';

const columns1 = [
  {
    colName: 'Name',
    colWidth: 240,
    flexGrow: 1,
    col: 'name',
    type: 'statusDetail',
  },
  {
    colName: 'Email',
    colWidth: 240,
    flexGrow: 1,
    col: 'email',
    type: 'statusDetail',
  },
];

const columns2 = [
  {
    colName: 'Reason',
    colWidth: 240,
    flexGrow: 1,
    col: 'reason',
    type: 'statusDetail',
  },
  {
    colName: 'Name',
    colWidth: 240,
    flexGrow: 1,
    col: 'name',
    type: 'statusDetail',
  },
  {
    colName: 'Email',
    colWidth: 240,
    flexGrow: 1,
    col: 'email',
    type: 'statusDetail',
  },
];

const useStyles = makeStyles((theme) => ({
  origin: {
    display: 'flex',
    cursor: 'pointer',
  },

  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const options = {
  legend: {
    display: false,
    position: 'right',
    labels: {
      padding: 20,
    },
  },
  maintainAspectRatio: false,
  cutoutPercentage: 70,
};

let status = {};

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

const statusOptions = [
  { value: 'OPENS', label: 'Opens' },
  { value: 'CLICKS', label: 'Clicks' },
  { value: 'UNSUBSCRIBES', label: 'Unsubscribes' },
  { value: 'DELIVERED', label: 'Deliverd' },
  { value: 'SOFT_BOUNCE', label: 'Bounces' },
];

const bounceTypeOptions = [
  { value: 'SOFT_BOUNCE', label: 'Soft Bounce' },
  { value: 'HARD_BOUNCE', label: 'Hard Bounce' },
  { value: 'UNDETERMINED_BOUNCE', label: 'Undetermined' },
  { value: 'BLOCK_BOUNCE', label: 'Block' },
];

const trueColor = ['#3398db', '#21b66e', '#f56d50', '#fdab29'];
const colorTransparent = ['#BDDCFF', '#B8E5CF', '#F8CFC6', '#FAE0BA'];

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

class EmailReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // title:history.subject,
      blastId: props.blastId,
      // dataShow:history,
      // step:1,
      status: props.status,
      bounceType: 'SOFT_BOUNCE',
      data: Immutable.List(),
      colSortDirs: {},
    };
  }

  fetchData = (blastId, status) => {
    getEmailDetailByIdByStatus(blastId, status).then((res) => {
      this.setState({ data: Immutable.fromJS(res.response) });
    });
  };

  onSortChange = (columnKey, sortDir) => {
    const sort = sortDir ? { [columnKey]: sortDir } : {};
    this.setState({
      colSortDirs: sort,
      selectedTableData: sortData(this.state.selectedTableData, sort),
    });
  };

  componentDidMount() {
    this.fetchData(this.props.blastId, this.props.status);
  }

  handleStatusChange = (status) => {
    if (status) {
      this.setState({ status });
      if (status === 'BOUNCE') {
        this.fetchData(this.props.blastId, 'SOFT_BOUNCE');
      }
      this.fetchData(this.props.blastId, status);
    }
  };

  handleBounceTypeChange = (bounceType) => {
    if (bounceType) {
      this.setState({ bounceType });
      this.fetchData(this.props.blastId, bounceType);
    }
  };

  render() {
    const { colSortDirs, data, status, bounceType } = this.state;
    const { subject } = this.props;
    return (
      <div>
        <div className="flex-container align-justify ">
          <div className="flex-container">
            <div style={{ width: 200, marginRight: 10 }}>
              <FormReactSelectContainer>
                <Select
                  value={status}
                  options={statusOptions}
                  simpleValue
                  onChange={this.handleStatusChange}
                  autoBlur={true}
                  searchable={false}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>

            {status === 'SOFT_BOUNCE' && (
              <div style={{ width: 140 }}>
                <FormReactSelectContainer>
                  <Select
                    value={bounceType}
                    options={bounceTypeOptions}
                    simpleValue
                    onChange={this.handleBounceTypeChange}
                    autoBlur={true}
                    searchable={false}
                    clearable={false}
                  />
                </FormReactSelectContainer>
              </div>
            )}
          </div>
          <div className="flex-child-auto" />
          <AddEmailBlastButton data={data} />
          {/* status==='BOUNCE' &&  <Button color="primary" variant="outlined" style={{padding:'2px 8px'}}>Remove from My Recipient List </Button> */}
        </div>

        <div
          className="flex-child-auto flex-container flex-dir-column"
          style={{ width: '100%', height: '420px', marginTop: 10 }}
        >
          <EmailBlastHistoryTable
            columns={status === 'SOFT_BOUNCE' ? columns2 : columns1}
            templateList={data}
            filterOpen={false}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            noAction={true}
          />
        </div>
      </div>
    );
  }
}

export default EmailReports;

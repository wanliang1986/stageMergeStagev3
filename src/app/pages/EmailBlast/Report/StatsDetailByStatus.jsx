import React, { Component } from 'react';
import Immutable from 'immutable';

import { Doughnut } from 'react-chartjs-2';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Select from 'react-select';
import FormReactSelectContainer from '../../../components/particial/FormReactSelectContainer';
import Paper from '@material-ui/core/Paper';
import MyHistoryList from './ReportsHistoryList';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import { getEmailDetailByIdByStatus } from '../../../../apn-sdk/email';
import EmailBlastHistoryTable from '../../../components/Tables/EmailBlastHistoryTable';
const columns = [
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
  { value: 'OPEN', label: 'Opens' },
  { value: 'CLICK', label: 'Clicks' },
  { value: 'UNSUBSCRIBE', label: 'Unsubscribes' },
  { value: 'SUCCESS', label: 'Deliverd' },
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
      this.fetchData(this.props.blastId, status);
    }
  };

  render() {
    const { colSortDirs, data, status } = this.state;
    const { subject } = this.props;
    return (
      <div>
        <div>
          <div style={{ width: 200 }}>
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

          <div
            className="flex-child-auto flex-container flex-dir-column"
            style={{ width: '100%', height: '420px', marginTop: 10 }}
          >
            <EmailBlastHistoryTable
              columns={columns}
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
      </div>
    );
  }
}

export default EmailReports;

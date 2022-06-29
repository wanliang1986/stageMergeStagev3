import React, { Component } from 'react';

import { Table, Column, Cell } from 'fixed-data-table-2';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { Link } from 'react-router-dom';

import EditIcon from '@material-ui/icons/Edit';
import DateCell4 from './TableCell/DateCell4';
import HeaderCell from './TableCell/HeaderCell';
import HeaderCell5 from './TableCell/HeaderCell5';
import ExperienceCell from './TableCell/ExperienceCell';
import AmUpdatesCell from './TableCell/AmUpdatesCell';

import moment from 'moment-timezone';

import Immutable from 'immutable';

import { withStyles } from '@material-ui/core/styles';
import CreateIcon from '@material-ui/icons/Create';

import DashbaordChangeStatus from '../applications/Buttons/DashbaordChangeStatus';

import { connect } from 'react-redux';

import Tooltip from '@material-ui/core/Tooltip';

import {
  style,
  HEADER_HEIGHT,
  ROW_HEIGHT,
  HEADER_WITHFILTER_HEIGHT,
} from './params';
import { interviewStageList } from '../../constants/formOptions';

const styles = {};

const NameCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const name = data.getIn([rowIndex, col]);
  const candidateId = data.getIn([rowIndex, 'candidateId']);
  if (name) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          <Link to={`/candidates/detail/${candidateId}`}>{name}</Link>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const JobTitleCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const jobTitle = data.getIn([rowIndex, col]);
  const jobId = data.getIn([rowIndex, 'jobId']);
  if (jobTitle) {
    return (
      <Cell {...props}>
        <div
          className="overflow_ellipsis_1"
          style={{
            width: props.width - 26,
            textTransform: 'none',
          }}
        >
          <Link to={`/jobs/detail/${jobId}`}>{jobTitle}</Link>
        </div>
      </Cell>
    );
  }
  return <Cell {...props}>loading...</Cell>;
};

const TextCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  // const text = data[rowIndex].col;
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        style={{
          width: props.width - 26,
          textTransform: 'none',
        }}
      >
        {text}
      </div>
    </Cell>
  );
};

const AgingDaysCell = ({ rowIndex, data, col, t, classes, ...props }) => {
  const days = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        style={
          Number(days) > 7
            ? {
                width: props.width - 26,
                textTransform: 'none',
                color: 'red',
              }
            : {
                width: props.width - 26,
                textTransform: 'none',
              }
        }
      >
        {days > 0 && days}
      </div>
    </Cell>
  );
};
const Highlight = ({ rowIndex, data, col, t, ...props }) => {
  let applicationId = data.getIn([rowIndex, 'applicationId']);
  return (
    <Cell {...props}>
      <div className="overflow_ellipsis_1">
        <DashbaordChangeStatus
          t={t}
          {...props}
          applicationId={applicationId}
          status={data.getIn([rowIndex, 'activityStatus'])}
        />
      </div>
    </Cell>
  );
};

const EnumCell = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div className="overflow_ellipsis_1">{text}</div>
    </Cell>
  );
};

const NamesCell = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <Tooltip title={text} arrow placement="top">
        <div className="overflow_ellipsis_1">{text}</div>
      </Tooltip>
    </Cell>
  );
};
const getEventType = (str) => {
  switch (str) {
    case 'INTERVIEW_PHONE':
      return 'Phone Interview';
    case 'INTERVIEW_VIDEO':
      return 'Video Interview';
    case 'INTERVIEW_ONSITE':
      return 'Onsite Interview';
    case 'INTERVIEW_OTHERS':
      return 'Others';
  }
};

const getStage = (str) => {
  switch (str) {
    case 'ROUND_1':
      return '1st Round';
    case 'ROUND_2':
      return '2nd Round';
    case 'ROUND_3':
      return '3nd Round';
    case 'ROUND_4':
      return '4th Round';
    case 'ROUND_5':
      return '5th Round';
  }
};
const InterviewInfoCell = ({ rowIndex, data, col, ...props }) => {
  const eventStage = getStage(data.getIn([rowIndex, 'eventStage']));
  const eventType = getEventType(data.getIn([rowIndex, 'eventType']));
  const latestInterviewDate = moment(
    data.getIn([rowIndex, 'latestInterviewDate'])
  ).format('YY-MM-DD hh:mm:ss a');
  const eventTimezone = data.getIn([rowIndex, 'eventTimeZone'])
    ? data.getIn([rowIndex, 'eventTimeZone']).substring(0, 3)
    : null;

  const jobStatus = data.getIn([rowIndex, 'activityStatus']);
  if (jobStatus === 'Interview') {
    return (
      <Cell {...props}>
        <div className="overflow_ellipsis_1">
          <p>
            {eventStage} {eventType}
          </p>
          <span>
            ({latestInterviewDate} {eventTimezone})
          </span>
        </div>
      </Cell>
    );
  } else {
    return (
      <Cell>
        <div className="overflow_ellipsis_1">N/A</div>
      </Cell>
    );
  }
};

const TemplateCell = ({ type, t, ...props }) => {
  switch (type) {
    case 'name':
      return <NameCell t={t} {...props} />;
    case 'jobTitle':
      return <JobTitleCell t={t} {...props} />;
    case 'date':
      return <DateCell4 t={t} {...props} />;
    case 'agingDays':
      return <AgingDaysCell t={t} {...props} />;
    case 'Experience':
      return <ExperienceCell t={t} {...props} />;
    case 'updates':
      return <AmUpdatesCell t={t} {...props} />;
    case 'info':
      return <InterviewInfoCell t={t} {...props} />;
    case 'enum':
      return props.col === 'activityStatus' ? (
        <Highlight {...props} t={t} />
      ) : (
        <EnumCell {...props} />
      );
    case 'names':
      return <NamesCell t={t} {...props} />;
    // case 'nameButton':
    //   return onEdit ? (
    //     <NameButtonCell onEdit={onEdit} {...props} />
    //   ) : (
    //     <TextCell {...props} />
    //   );

    default:
      return <TextCell {...props} />;
  }
};

class AmReportTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
    };
  }

  render() {
    const {
      filterOpen,
      filters,
      colSortDirs,
      columns,
      onFilter,
      onSortChange,
      t,
      classes,
      jobData,
      companyId,
      fetchData,
      height,
      type,
    } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowsCount={jobData.size}
              rowHeight={ROW_HEIGHT}
              headerHeight={
                filterOpen ? HEADER_WITHFILTER_HEIGHT : HEADER_HEIGHT
              }
              width={width || window.innerWidth}
              height={height || window.innerHeight}
            >
              {columns.map((column, index) => (
                <Column
                  key={index}
                  allowCellsRecycling={true}
                  header={
                    type !== 1 ? (
                      <HeaderCell
                        column={column}
                        filterOpen={filterOpen}
                        filters={filters}
                        onFilter={onFilter}
                        onSortChange={onSortChange}
                        sortDir={colSortDirs && colSortDirs[column.col]}
                        t={t}
                      />
                    ) : (
                      <HeaderCell5
                        column={column}
                        filterOpen={filterOpen}
                        filters={filters}
                        onFilter={onFilter}
                        onSortChange={onSortChange}
                        sortDir={colSortDirs && colSortDirs[column.col]}
                        t={t}
                      />
                    )
                  }
                  cell={
                    <TemplateCell
                      data={jobData}
                      type={column.type}
                      col={column.col}
                      t={t}
                      classes={classes}
                      companyId={companyId}
                      fetchData={fetchData}
                    />
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                />
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

// const mapStoreStateToProps = (state) => {
//   const jobData = state.model.amReport.get('jobData')
//   return {
//       jobData: jobData
//   }
// }

export default withStyles(styles)(AmReportTable);

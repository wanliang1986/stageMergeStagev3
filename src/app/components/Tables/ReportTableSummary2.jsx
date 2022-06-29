import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import { Table, Column, Cell, ColumnGroup } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

import HeaderCell from './TableCell/HeaderCell2';
import LinkButton from './../particial/LinkButton';

import { style, ROW_HEIGHT } from './params';
import { withTranslation } from 'react-i18next';
const NameLinkCell = ({ rowIndex, data, col, loadMore, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        title={text}
        style={{ width: props.width - 26 }}
      >
        <a
          href={`/candidates/detail/${data.getIn([rowIndex, 'talentId'])}`}
          target="_blank"
          rel="noopener noreferrer"
          className="candidate-link"
        >
          {data.getIn([rowIndex, col])}
        </a>
      </div>
    </Cell>
  );
};

const JobCountCell = ({ rowIndex, data, col, onClickJob, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() =>
              onClickJob({
                jobId: data.getIn([rowIndex, 'jobId']),
                company: data.getIn([rowIndex, 'company']),
                recruiter: data.getIn([rowIndex, 'recruiter']),
              })
            }
            className="status-link"
          >
            {text}
          </LinkButton>
        ) : (
          <div>{text}</div>
        )}
      </div>
    </Cell>
  );
};

const ActivityCountCell = ({
  rowIndex,
  data,
  col,
  onClickActivity,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  const activityStatus = col.slice(0, -5);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() => {
              onClickActivity({
                activityId: data.getIn([
                  rowIndex,
                  activityStatus + 'ActivityId',
                ]),
                company: data.getIn([rowIndex, 'company']),
                recruiter: data.getIn([rowIndex, 'recruiter']),
                activityStatus:
                  data.getIn([rowIndex, 'activityStatus']) || activityStatus,
              });
            }}
            className="status-link"
          >
            {text}
          </LinkButton>
        ) : (
          <div>{text}</div>
        )}
      </div>
    </Cell>
  );
};

const ReportCell = ({ type, onClickJob, onClickActivity, ...ownProps }) => {
  // console.log('[[[report]]]', ownProps.data.toJS());
  switch (type) {
    case 'talentNameLink':
      return <NameLinkCell {...ownProps} />;
    case 'jobCount':
      return <JobCountCell onClickJob={onClickJob} {...ownProps} />;
    case 'activityCount':
      return (
        <ActivityCountCell onClickActivity={onClickActivity} {...ownProps} />
      );

    default:
      const { rowIndex, data, col, ...props } = ownProps;
      let text = data.getIn([rowIndex, col]);
      return (
        <Cell {...props}>
          <div
            className="overflow_ellipsis_1"
            data-tip={text}
            style={{
              width: props.width - 26,
              textTransform:
                col === 'email' || col === 'note' ? 'none' : 'capitalize',
            }}
          >
            {text}
          </div>
        </Cell>
      );
  }
};

const columnGroups = [
  {
    name: 'User',
    columns: [
      {
        colName: 'User Name',
        colWidth: 155,
        col: 'fullName',
        sortable: true,
      },
    ],
  },
  {
    name: 'Via APN Pro',
    columns: [
      {
        colName: 'Total Views',
        colWidth: 135,
        col: 'totalProfiles',
        sortable: true,
        detail:
          'The total number of unique LinkedIn profiles a user clicks into and views in the selected time frame through APN account.',
      },
      {
        colName: 'RPS Views ',
        colWidth: 145,
        col: 'fromRecruiterProfiles',
        sortable: true,
        detail:
          'The total number of LinkedIn profiles a user clicks into and views in the selected time frame when they are using LinkedIn RPS seat through APN account.',
      },
    ],
  },
  {
    name: 'Linkedin Usage Report',
    columns: [
      {
        colName: 'Profiles Viewed',
        colWidth: 160,
        col: 'numProfilesViewed',
        sortable: true,
        detail:
          'Total number of profiles a user clicks into and views in the selected time frame.',
      },
      {
        colName: 'InMails Sent',
        colWidth: 145,
        col: 'numMessagesSent',
        sortable: true,
        detail:
          'Includes all InMails sent during the selected time frame (InMails, first degree connections, or open profiles).',
      },
      {
        colName: 'InMails Accepted',
        colWidth: 165,
        col: 'numMessagesAccepted',
        sortable: true,
        detail:
          'InMails that were sent during the selected time frame and accepted within 30 days of sending InMail, including accepting through email notification.',
      },
      {
        colName: 'InMails Declined',
        colWidth: 165,
        col: 'numMessagesDeclined',
        sortable: true,
        detail:
          'InMails that were sent during the selected time frame and declined within 30 days of sending the InMail.',
      },
      {
        colName: 'InMails ResponseRate %',
        colWidth: 225,
        col: 'messagesResponseRate',
        sortable: true,
        flexGrow: 1,
        detail:
          'Percentage of InMails that were sent during the selected time frame and have been accepted or declined within 30 days.',
      },
    ],
  },
];

class ReportTableSummary extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      classes,
      dataList,
      onClickJob,
      onClickActivity,
      onSortChange,
      colSortDirs = {},
    } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <React.Fragment>
            <Table
              rowHeight={ROW_HEIGHT}
              headerHeight={36}
              groupHeaderHeight={36}
              rowsCount={dataList.size}
              width={width || window.innerWidth}
              height={height || window.innerHeight}
              onScrollEnd={(...props) => ReactTooltip.rebuild()}
            >
              <ColumnGroup
                header={
                  <Cell className={clsx(classes.indexCell, classes.group)} />
                }
                fixed
              >
                <Column
                  width={42}
                  header={<Cell className={classes.headerCell0} />}
                  cell={({ rowIndex, ...props }) => (
                    <Cell {...props} className={classes.indexCell}>
                      <div
                        style={{ textAlign: 'center', fontFamily: 'monospace' }}
                      >
                        {rowIndex + 1}
                      </div>
                    </Cell>
                  )}
                  fixed
                />
              </ColumnGroup>
              {columnGroups.map((group, index) => (
                <ColumnGroup
                  key={index}
                  header={
                    <Cell className={clsx(classes.indexCell, classes.group)}>
                      {this.props.t(`field:${group.name}`)}
                    </Cell>
                  }
                >
                  {group.columns.map((column, index) => (
                    <Column
                      key={index}
                      header={
                        <HeaderCell
                          column={column}
                          className={classes.headerCell0}
                          onSortChange={onSortChange}
                          sortDir={colSortDirs && colSortDirs[column.col]}
                        />
                      }
                      cell={
                        <ReportCell
                          className={
                            group.columns.length - 1 === index
                              ? classes.indexCell
                              : ''
                          }
                          data={dataList}
                          col={column.col}
                          type={column.type}
                          onClickJob={onClickJob}
                          onClickActivity={onClickActivity}
                          style={style.displayCell}
                        />
                      }
                      width={column.colWidth}
                      flexGrow={column.flexGrow}
                      fixed={column.fixed}
                      allowCellsRecycling={true}
                      pureRendering={true}
                    />
                  ))}
                </ColumnGroup>
              ))}
            </Table>
          </React.Fragment>
        )}
      </AutoSizer>
    );
  }
}

ReportTableSummary.propTypes = {
  dataList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withTranslation('field')(withStyles(style)(ReportTableSummary));

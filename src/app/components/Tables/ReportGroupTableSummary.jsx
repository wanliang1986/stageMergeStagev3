import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import { Table, Column, Cell, DataCell, ColumnGroup } from 'fixed-data-table-2';
import ReactTooltip from 'react-tooltip';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Tooltip from '@material-ui/core/Tooltip';
import HeaderCell4 from './TableCell/HeaderCell4';

import FooterCell from './TableCell/FooterCell';
import LinkButton from './../particial/LinkButton';
import { jobType as newJobType } from '../../constants/formOptions';
import { style, ROW_HEIGHT, HEADER_WITHFILTER_HEIGHT } from './params';

const NameLinkCell = ({ rowIndex, data, col, ...props }) => {
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

const EnumCell = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        title={text}
        style={{ width: props.width - 26 }}
      >
        {text && text.toLowerCase().replace(/_/g, ' ')}
      </div>
    </Cell>
  );
};

const JobLinkCell = ({ rowIndex, data, col, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props}>
      <div
        className="overflow_ellipsis_1"
        title={text}
        style={{ width: props.width - 26 }}
      >
        <a
          href={`/jobs/detail/${data.getIn([rowIndex, 'jobId'])}`}
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
                  data.getIn([rowIndex, 'activityStatus']) ||
                  activityStatus.replace(
                    'pipelineUpdateSubmitted',
                    'submitted'
                  ),
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

const DateCell = ({ rowIndex, data, col, onClickJob, ...props }) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? text.substring(0, 10) : text}
      </div>
    </Cell>
  );
};

const StoppedJobCountCell = ({
  rowIndex,
  data,
  col,
  handleClickStoppedJobCount,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() =>
              handleClickStoppedJobCount({
                amId: data.getIn([rowIndex, 'id']),
                am: data.getIn([rowIndex, 'am']),
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

const CurrentJobCountCell = ({
  rowIndex,
  data,
  col,
  handleClickCurrentJobCount,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() =>
              handleClickCurrentJobCount({
                jobIds: data.getIn([rowIndex, 'jobIds']),
                userName: data.getIn([rowIndex, 'userName']),
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
const CurrentTalentCountCell = ({
  rowIndex,
  data,
  col,
  handleClickCurrentTalentCount,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() =>
              handleClickCurrentTalentCount({
                talentIds: data.getIn([rowIndex, 'talentIds']),
                userName: data.getIn([rowIndex, 'userName']),
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

const StoppedCandidateCountCell = ({
  rowIndex,
  data,
  col,
  handleClickStoppedCandidateCount,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text ? (
          <LinkButton
            onClick={() =>
              handleClickStoppedCandidateCount(
                data.getIn([rowIndex, 'id']),
                data.getIn([rowIndex, 'recruiter'])
              )
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

const JobTypeCell = ({
  rowIndex,
  data,
  col,
  handleClickStoppedCandidateCount,
  ...props
}) => {
  const text = data.getIn([rowIndex, col]);
  const _text = newJobType.filter(({ value }) => value === text);
  return (
    <Cell {...props}>
      <Tooltip
        title={<span style={{ whiteSpace: 'pre-line' }}>{_text[0].label}</span>}
        arrow
        placement="top"
      >
        <div
          className="overflow_ellipsis_1"
          style={{ width: props.width - 26 }}
        >
          {_text[0].label}
        </div>
      </Tooltip>
    </Cell>
  );
};

const JobLocations = ({ rowIndex, data, col, ...props }) => {
  const jobLocations =
    data.getIn([rowIndex, col]) && JSON.parse(data.getIn([rowIndex, col]));
  let html = '';
  jobLocations &&
    jobLocations.map((item, index) => {
      if (item.location) {
        html += `${item.location},\n`;
      } else {
        html += `${item.city} ,${item.province} ,${item.country},\n`;
      }
    });
  html = html.substring(0, html.length - 2);
  return (
    <Cell {...props}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        <Tooltip
          title={<span style={{ whiteSpace: 'pre-line' }}>{html}</span>}
          arrow
          placement="top"
        >
          <span>{html}</span>
        </Tooltip>
      </div>
    </Cell>
  );
};

const SkillsCell = ({ rowIndex, data, col, ...props }) => {
  let skills = data.getIn([rowIndex, col]);
  skills = skills && skills.toJS();
  let text = '';
  skills &&
    skills.map((item, index) => {
      if (index === skills.length - 1) {
        text += item.skillName;
      } else {
        text += `${item.skillName},`;
      }
    });
  return (
    <Cell {...props} title={text}>
      <div className="overflow_ellipsis_1" style={{ width: props.width - 26 }}>
        {text}
      </div>
    </Cell>
  );
};

const ReportCell = ({
  type,
  onClickJob,
  onClickActivity,
  handleClickStoppedJobCount,
  handleClickCurrentJobCount,
  handleClickStoppedCandidateCount,
  handleClickCurrentTalentCount,
  ...ownProps
}) => {
  // console.log('[[[report]]]', ownProps.data.toJS());
  switch (type) {
    case 'jobType':
      return <JobTypeCell {...ownProps} />;
    case 'talentNameLink':
      return <NameLinkCell {...ownProps} />;
    case 'jobLink':
      return <JobLinkCell {...ownProps} />;
    case 'jobCount':
      return <JobCountCell onClickJob={onClickJob} {...ownProps} />;
    case 'activityCount':
      return (
        <ActivityCountCell onClickActivity={onClickActivity} {...ownProps} />
      );
    case 'stoppedJobCount':
      return (
        <StoppedJobCountCell
          handleClickStoppedJobCount={handleClickStoppedJobCount}
          {...ownProps}
        />
      );
    case 'currentJobCount':
      return (
        <CurrentJobCountCell
          handleClickCurrentJobCount={handleClickCurrentJobCount}
          {...ownProps}
        />
      );
    case 'currentTalentCount':
      return (
        <CurrentTalentCountCell
          handleClickCurrentTalentCount={handleClickCurrentTalentCount}
          {...ownProps}
        />
      );
    case 'stoppedCandidateCount':
      return (
        <StoppedCandidateCountCell
          handleClickStoppedCandidateCount={handleClickStoppedCandidateCount}
          {...ownProps}
        />
      );
    case 'date':
      return <DateCell {...ownProps} />;
    case 'skills':
      return <SkillsCell {...ownProps} />;
    case 'enum':
      return <EnumCell {...ownProps} />;
    case 'location':
      return <JobLocations {...ownProps} />;
    default:
      const { rowIndex, data, col, ...props } = ownProps;
      let text = data.getIn([rowIndex, col]);
      if (typeof text !== 'string') {
        if (col === 'title' || col === 'company') {
          text = text && text.toJS();
        }
      }

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

class ReportGroupTableSummary extends React.PureComponent {
  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      footerData,
      dataList,
      columns,
      onClickJob,
      onClickActivity,
      onSortChange,
      colSortDirs = {},
      handleClickStoppedJobCount,
      handleClickCurrentJobCount,
      handleClickStoppedCandidateCount,
      handleClickCurrentTalentCount,
    } = this.props;

    return (
      <AutoSizer>
        {({ width, height }) => (
          <Table
            rowHeight={ROW_HEIGHT}
            headerHeight={HEADER_WITHFILTER_HEIGHT}
            rowsCount={dataList.size}
            width={width || window.innerWidth}
            height={height || window.innerHeight}
            onScrollEnd={(...props) => ReactTooltip.rebuild()}
            footerHeight={footerData ? 50 : 0}
          >
            <ColumnGroup fixed={false} header={<DataCell>Name</DataCell>}>
              {columns.map((column, index) => (
                <Column
                  key={index}
                  columnKey={column.col}
                  header={
                    <HeaderCell4
                      column={column}
                      onSortChange={onSortChange}
                      sortDir={colSortDirs && colSortDirs[column.col]}
                    />
                  }
                  cell={
                    <ReportCell
                      data={dataList}
                      col={column.col}
                      type={column.type}
                      onClickJob={onClickJob}
                      onClickActivity={onClickActivity}
                      style={style.displayCell}
                      handleClickStoppedJobCount={handleClickStoppedJobCount}
                      handleClickCurrentJobCount={handleClickCurrentJobCount}
                      handleClickStoppedCandidateCount={
                        handleClickStoppedCandidateCount
                      }
                      handleClickCurrentTalentCount={
                        handleClickCurrentTalentCount
                      }
                    />
                  }
                  footer={
                    footerData && (
                      <FooterCell
                        // className={classes.footerCell}
                        data={footerData}
                      />
                    )
                  }
                  width={column.colWidth}
                  flexGrow={column.flexGrow}
                  fixed={column.fixed}
                  allowCellsRecycling={true}
                  pureRendering={true}
                />
              ))}
            </ColumnGroup>
          </Table>
        )}
      </AutoSizer>
    );
  }
}

ReportGroupTableSummary.propTypes = {
  dataList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default ReportGroupTableSummary;

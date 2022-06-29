import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import clsx from 'clsx';
import { getApplicationJobListByTalent } from '../../../../../selectors/applicationSelector';

import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import Typography from '@material-ui/core/Typography';

import PostingTimeCell from './PostingTimeCell';
import JobTypeCell from './JobTypeCell';
import CompanyCell from './CompanyCell';
import { withTranslation } from 'react-i18next';
const styles = {
  root: {
    // overflow: 'hidden',
    position: 'relative',
    height: '100%',
    width: '100%',
    '& .ag-react-container': {
      width: '100%',
    },
  },
};

const frameworkComponents = {
  PostingTimeCell: PostingTimeCell,
  JobTypeCell: JobTypeCell,
  CompanyCell: CompanyCell,
};

class AppliedJobTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultColDef: {
        resizable: true,
        // tooltipValueGetter: ({ column, data }) => {
        //   // console.log('tooltipValueGetter', column, data);
        //   return data[column.colId];
        // },
      },
      headerList: [
        {
          label: 'Job Title',
          colId: 'title',
          column: 'title',
          width: 200,
          showFlag: true,
          sortFlag: false,
          // type: 'PostingTimeCell',
        },
        {
          label: 'Company',
          colId: 'company',
          column: 'company',
          width: 200,
          showFlag: true,
          sortFlag: false,
          type: 'CompanyCell',
        },
        {
          label: 'Job ID',
          colId: 'id',
          column: 'id',
          width: 200,
          showFlag: true,
          sortFlag: false,
        },
        {
          label: 'Posting Date',
          colId: 'postingTime',
          column: 'postingTime',
          width: 200,
          showFlag: true,
          sortFlag: false,
          type: 'PostingTimeCell',
        },
        {
          label: 'Type',
          colId: 'jobType',
          column: 'jobType',
          width: 200,
          showFlag: true,
          sortFlag: false,
          type: 'JobTypeCell',
        },
      ],
      autoFlag: false,
    };
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onFirstDataRendered = (params) => {
    let { autoFlag } = this.state;
    if (!autoFlag) {
      this.setState(
        {
          autoFlag: true,
        },
        () => params.api.sizeColumnsToFit()
      );
    }
  };

  render() {
    const { classes, tableData } = this.props;
    const { headerList } = this.state;

    console.log(tableData && tableData.toJS());
    return (
      <div className={clsx('ag-theme-alpine', classes.root)}>
        <Typography variant={'subtitle2'} gutterBottom>
          {this.props.t('tab:Other applied jobs')}
        </Typography>
        <div style={{ height: 'calc(100% - 50px)', minHeight: 300 }}>
          <AgGridReact
            defaultColDef={this.state.defaultColDef}
            rowData={tableData && tableData.toJS()}
            onGridReady={this.onGridReady}
            frameworkComponents={frameworkComponents}
            onFirstDataRendered={this.onFirstDataRendered}
          >
            {headerList.map((item) => {
              return (
                <AgGridColumn
                  field={item.column}
                  colId={item.colId}
                  key={item.colId}
                  headerName={item.label}
                  headerTooltip={item.label}
                  width={item.width}
                  hide={!item.showFlag}
                  sortable={item.sortFlag}
                  unSortIcon={item.sortFlag}
                  resizable={true}
                  cellRenderer={item.type}
                />
              );
            })}
          </AgGridReact>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, { candidateId }) => {
  return {
    tableData: getApplicationJobListByTalent(state, candidateId),
  };
};

export default withTranslation('tab')(
  connect(mapStateToProps)(withStyles(styles)(AppliedJobTable))
);

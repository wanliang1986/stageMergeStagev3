import React, { Component } from 'react';
// import { AgGridColumn, AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import StatusCell from './CandidatesCell/StatusCell';

const defaultColDef = {
  // width: 150,
  editable: false, //是否开启单元格编辑,true开启，false关闭
  filter: 'agTextColumnFilter',
  floatingFilter: true, //是否单独出现搜索框
  resizable: true,
};

const frameworkComponents = {
  statusCell: StatusCell,
};

class CandidatesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { rowData, t } = this.props;
    return (
      <div
        className="ag-theme-alpine"
        style={{ height: '100%', width: '100%' }}
      >
        <AgGridReact
          defaultColDef={defaultColDef}
          rowData={rowData}
          frameworkComponents={frameworkComponents}
        >
          <AgGridColumn
            field="fullName"
            flex={1}
            sortable={true}
            unSortIcon={true}
            suppressMovable={true}
          ></AgGridColumn>
          <AgGridColumn
            field="jobTitle"
            flex={1}
            sortable={true}
            filter={false}
            unSortIcon={true}
            suppressMovable={true}
          ></AgGridColumn>
          <AgGridColumn
            field="company"
            flex={1}
            sortable={true}
            filter={false}
            unSortIcon={true}
            suppressMovable={false}
          ></AgGridColumn>
          <AgGridColumn
            field="status"
            flex={1}
            sortable={true}
            unSortIcon={true}
            suppressMovable={false}
            cellRenderer="statusCell"
            t={t}
          ></AgGridColumn>
        </AgGridReact>
      </div>
    );
  }
}

export default CandidatesTable;

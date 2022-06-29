import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { deleteTemplate } from '../../actions/templateAction';
import { getIndexList, sortList } from '../../../utils/index';

import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FilterIcon from '@material-ui/icons/FilterList';

import TemplateEditor from './TemplateEditor';
import PrimaryButton from '../../components/particial/PrimaryButton';
import TemplateTable from '../../components/Tables/TemplateTable';
import AlertDialog from '../../components/particial/AlertDialog';
import { showErrorMessage } from '../../actions';

const columns = [
  {
    colName: 'Template Name',
    colWidth: 240,
    flexGrow: 2,
    col: 'title',
    type: 'nameButton',
    sortable: true,
  },
  {
    colName: 'type',
    colWidth: 260,
    // flexGrow: 2,
    col: 'type',
    type: 'enum',
    sortable: true,
  },
  {
    colName: 'createdAt',
    colWidth: 120,
    col: 'createdDate',
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

class TemplateList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indexList: getIndexList(
        props.templateList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen || false,
      colSortDirs: status.colSortDirs || {},
      selected: null, // selected template
      deleteSelected: null,

      handleDeleteTemplate: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const indexList = getIndexList(
      props.templateList,
      state.filters,
      state.colSortDirs
    );
    if (!indexList.equals(state.indexList)) {
      return { indexList };
    }
    return null;
  }

  componentWillUnmount() {
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
  }

  onFilter = (input) => {
    let filters = this.state.filters;

    let col = input.name;
    let query = input.value;
    if (filters.get(col) === query) {
      return;
    }
    if (!query) {
      filters = filters.remove(col);
    } else {
      filters = filters.set(col, query);
    }

    this.setState({
      filters,
      indexList: getIndexList(
        this.props.templateList,
        filters,
        this.state.colSortDirs
      ),
    });
  };

  onSortChange = (columnKey, sortDir) => {
    let filteredIndex;

    filteredIndex = sortDir
      ? sortList(
          this.state.indexList,
          this.props.templateList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.templateList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleEdit = (selected) => {
    this.setState({ selected });
  };

  handleDelete = (template) => {
    const { dispatch } = this.props;
    this.setState({
      handleDeleteTemplate: () =>
        dispatch(deleteTemplate(template.get('id')))
          .then(this.handleCancelDelete)
          .catch((err) => {
            dispatch(showErrorMessage(err));
            this.handleCancelDelete();
          }),
    });
  };

  handleCancelDelete = () => {
    this.setState({
      handleDeleteTemplate: null,
    });
  };

  handleClose = () => this.setState({ selected: null });

  render() {
    const { templateList, location, ...props } = this.props;
    const {
      filterOpen,
      indexList,
      colSortDirs,
      selected,
      handleDeleteTemplate,
    } = this.state;
    const filteredTemplateList = indexList.map((index) =>
      templateList.get(index)
    );

    return (
      <div
        key={location.key}
        className="flex-child-auto flex-container flex-dir-column"
      >
        <div>
          <div
            className="flex-container align-middle item-padding"
            style={{ height: 56 }}
          >
            <div>
              <PrimaryButton
                onClick={() => this.handleEdit(filteredTemplateList.size)}
                style={{ minWidth: 120 }}
              >
                {props.t('action:create')}
              </PrimaryButton>
            </div>
            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </div>
          <Divider />
        </div>
        <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
          <TemplateTable
            columns={columns}
            templateList={filteredTemplateList}
            onFilter={this.onFilter}
            filterOpen={filterOpen}
            colSortDirs={colSortDirs}
            onSortChange={this.onSortChange}
            onScrollEnd={onScrollEnd}
            scrollLeft={status.scrollLeft}
            scrollTop={status.scrollTop}
            filters={this.state.filters}
            onEdit={this.handleEdit}
            onDelete={this.handleDelete}
          />
        </div>

        <Dialog
          open={selected !== null}
          fullWidth
          maxWidth="md"
          disableEnforceFocus
        >
          {selected !== null && (
            <TemplateEditor
              {...props}
              template={filteredTemplateList.get(selected) || Immutable.Map()}
              handleRequestClose={() => this.handleEdit(null)}
            />
          )}
        </Dialog>
        <AlertDialog
          onOK={handleDeleteTemplate}
          onCancel={this.handleCancelDelete}
          title={props.t('common:Delete Template')}
          content={'Are you sure you wish to delete this template?'}
          okLabel={props.t('action:delete')}
          cancelLabel={props.t('action:cancel')}
        />
      </div>
    );
  }
}

TemplateList.propTypes = {
  templateList: PropTypes.instanceOf(Immutable.List).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation(['action', 'field', 'message'])(
  connect()(TemplateList)
);

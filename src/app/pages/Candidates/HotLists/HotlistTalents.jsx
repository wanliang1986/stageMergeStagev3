import React from 'react';
import FileType from 'file-type';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Immutable from 'immutable';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
  getHotList,
  getHotListTalents2,
  deleteHotListTalent,
} from '../../../actions/hotlistAction';
import { sortList, getIndexList, formatFullName } from '../../../../utils';
import { getHotListTalentList2 } from '../../../selectors/hotListSelector';

import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import FilterIcon from '@material-ui/icons/FilterList';
import MailIcon from '@material-ui/icons/Mail';
import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import { AssignJobIcon } from '../../../components/Icons';

import CandidateTable from '../../../components/Tables/CandidateTable';
import ApplyJob from '../newDetail/ApplyJob';
import DraggablePaperComponent from '../../../components/particial/DraggablePaperComponent';
import Loading from '../../../components/particial/Loading';
import AlertDialog from '../../../components/particial/AlertDialog';
import PrimaryButton from '../../../components/particial/PrimaryButton';
import BulkUploadResumes from './BulkUploadResumes';
import AddEmailBlastButton from '../List/AddEmailBlastButton';
import { exportJson } from '../../../../utils/sheet';
import BackIcon from '@material-ui/icons/ArrowBack';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ADD_SEND_EMAIL_REQUEST } from '../../../constants/actionTypes';
import { SEND_EMAIL_TYPES } from '../../../constants/formOptions';
import { showErrorMessage } from '../../../actions';

const columns = [
  {
    colName: 'name',
    colWidth: 160,
    flexGrow: 1,
    col: 'fullName',
    fixed: true,
    type: 'link',
    sortable: true,
  },
  {
    colName: 'school',
    colWidth: 200,
    flexGrow: 2,
    col: 'school',
    sortable: true,
  },
  {
    colName: 'major',
    colWidth: 160,
    flexGrow: 2,
    col: 'major',
  },
  {
    colName: 'company',
    colWidth: 160,
    flexGrow: 2,
    col: 'company',
    sortable: true,
  },
  {
    colName: 'jobTitle',
    colWidth: 200,
    flexGrow: 3,
    col: 'title',
  },
  {
    colName: 'createdAt',
    colWidth: 170,
    col: 'addToHotListDate',
    type: 'date',
    sortable: true,
  },
];
const styles = {
  mask: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    border: '3px dashed #d0d0cb',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,.9)',
    zIndex: 100,
  },
};
const HOTLIST_TALENT_COUNT_LIMIT = 3000;
let status = { selected: {}, filterOpen: true };

function onScrollEnd(scrollLeft, scrollTop) {
  status.scrollLeft = scrollLeft;
  status.scrollTop = scrollTop;
}

class HotlistTalents extends React.PureComponent {
  constructor(props) {
    super(props);
    this.fTimer = setTimeout(() => {
      this.setState({ show: true });
    }, 850);

    this.state = {
      preTalentList: props.talentList,
      selected:
        (status.selected && status.selected[props.hotListId]) ||
        Immutable.Set(),
      dialogOpen: false,
      indexList: getIndexList(
        props.talentList,
        status.filters,
        status.colSortDirs
      ),
      filters: status.filters || Immutable.Map(),
      filterOpen: status.filterOpen,
      colSortDirs: status.colSortDirs || {},

      handleDeleteHotlistTalent: null,

      files: [],
      pending: false,
      dragEntering: false,
      downloading: false,

      candidateSelected: null,
    };
    this.count = 0;
  }

  componentDidMount() {
    const { dispatch, hotListId } = this.props;
    dispatch(getHotList(hotListId));
    this.fetchTalents();
  }

  fetchTalents = () => {
    const { dispatch, hotListId } = this.props;
    dispatch(getHotListTalents2(hotListId));
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.talentList.equals(state.preTalentList)) {
      return {
        indexList: getIndexList(
          props.talentList,
          state.filters,
          state.colSortDirs
        ),
        preTalentList: props.talentList,
      };
    }
    return null;
  }

  componentWillUnmount() {
    clearTimeout(this.fTimer);
    status.filters = this.state.filters;
    status.filterOpen = this.state.filterOpen;
    status.colSortDirs = this.state.colSortDirs;
    status.selected = {
      ...status.selected,
      [this.props.hotListId]: this.state.selected,
    };
  }

  onSelect = (id) => {
    let selected = this.state.selected;
    if (selected.includes(id)) {
      selected = selected.delete(id);
    } else {
      selected = selected.add(id);
    }
    this.setState({ selected });
  };

  checkAllBoxOnCheckHandler = () => {
    let { selected, indexList } = this.state;
    let { talentList } = this.props;
    const filteredIds = indexList.map((index) =>
      talentList.getIn([index, 'id'])
    );
    const filteredSelected = selected.intersect(Immutable.Set(filteredIds));

    const newSelected =
      filteredSelected.size > 0 ? Immutable.Set() : Immutable.Set(filteredIds);
    this.setState({ selected: newSelected });
  };

  handleOpen = () => {
    let { selected, indexList } = this.state;
    let { talentList } = this.props;
    const filteredIds = indexList.map((index) =>
      talentList.getIn([index, 'id'])
    );
    const filteredSelected = selected.intersect(Immutable.Set(filteredIds));
    const candidateSelected = talentList.find((value, index, array) => {
      return value.get('id') === filteredSelected.first();
    });
    this.setState({ dialogOpen: true, candidateSelected });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false });
  };

  handleDeleteTalent = (talentId) => {
    const { dispatch, hotListId } = this.props;

    this.setState({
      handleDeleteHotlistTalent: () =>
        dispatch(deleteHotListTalent(hotListId, talentId)).then(
          this.handleCancelDeleteTalent
        ),
    });
  };

  handleCancelDeleteTalent = () => {
    this.setState({ handleDeleteHotlistTalent: null });
    this.fetchTalents();
  };

  onFilter = (input) => {
    let filters = this.state.filters;

    const col = input.name;
    const query = input.value;
    if ((filters.get(col) || '') === query) {
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
        this.props.talentList,
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
          this.props.talentList,
          columnKey,
          sortDir
        )
      : getIndexList(this.props.talentList, this.state.filters);

    this.setState({
      indexList: filteredIndex,
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  };

  handleFileChange = (e) => {
    const input = e.target;
    const newFiles = Array.from(input.files);
    if (
      newFiles.length + this.props.talentList.size >
      HOTLIST_TALENT_COUNT_LIMIT
    ) {
      return this.props.dispatch(
        showErrorMessage('It will exceed hot list talent count limit 3000')
      );
    }
    this.setState({ files: newFiles, pending: true }, () => {
      input.value = '';
    });
  };

  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('onDrop');
    this.count = 0;
    this.setState({ dragEntering: false });

    // console.log("handleDrop", e);
    const items = e.dataTransfer.items;
    const files = e.dataTransfer.files;
    console.log(items[0]);
    if (items[0] && items[0].webkitGetAsEntry) {
      const newFiles = [];
      for (let i = 0; i < (items || []).length; i++) {
        // webkitGetAsEntry is where the magic happens
        let item = items[i].webkitGetAsEntry();
        if (item) {
          newFiles.push(traverseFileTree(item));
        }
      }
      Promise.all(newFiles).then((res) => {
        const files = res.flat(Infinity);
        if (
          files.length + this.props.talentList.size >
          HOTLIST_TALENT_COUNT_LIMIT
        ) {
          return this.props.dispatch(
            showErrorMessage('It will exceed hot list talent count limit 3000')
          );
        }
        this.setState({ files, pending: true });
      });
    } else {
      const newFiles = Array.from(files);
      if (
        newFiles.length + this.props.talentList.size >
        HOTLIST_TALENT_COUNT_LIMIT
      ) {
        return this.props.dispatch(
          showErrorMessage('It will exceed hot list talent count limit 3000')
        );
      }
      this.setState({ files: newFiles, pending: true });
      // console.log(newFiles);
      // newFiles.forEach(console.log);
    }
  };

  onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.count--;
    if (this.count === 0) {
      this.setState({ dragEntering: false });
    }
  };
  onDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.count++;
    this.setState({ dragEntering: true });
  };
  onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  handleDownload = () => {
    this.setState({ downloading: true });

    const { indexList, selected } = this.state;
    const { talentList, hotList } = this.props;
    const filteredTalentList = indexList.map((index) => talentList.get(index));
    const filteredSelected = selected.intersect(
      filteredTalentList.map((candidate) => candidate.get('id'))
    );
    const dataList = talentList
      .filter((el) => filteredSelected.includes(el.get('id')))
      .toJS()
      .map(
        ({
          fullName,
          firstName,
          lastName,
          email,
          phone,
          company,
          title,
          addToHotListDate,
        }) => {
          return {
            Name:
              firstName && lastName
                ? formatFullName(firstName, lastName)
                : fullName,
            Email: !email || email.match('fake_email.com') ? '' : email,
            Phone: phone,
            Company: company,
            'Job Title': title,
            'First Name': firstName || '',
            'Last Name': lastName || '',
            'Add to HotList Date': new Date(addToHotListDate),
          };
        }
      );
    exportJson(dataList, {
      headers: [
        {
          name: 'Name',
          width: 40,
        },
        {
          name: 'Email',
          width: 40,
        },
        {
          name: 'Phone',
          width: 40,
        },
        {
          name: 'Job Title',
          width: 40,
        },
        {
          name: 'Company',
          width: 18,
        },
        {
          name: 'First Name',
          width: 18,
        },
        {
          name: 'Last Name',
          width: 18,
        },
        {
          name: 'Add to HotList Date',
          width: 18,
        },
      ],
      fileName: hotList.get('title') || 'hotlist',
    });
    this.setState({ downloading: false });
  };

  handleSendEmailToTalents = () => {
    const { talentList, dispatch } = this.props;
    const { selected, indexList } = this.state;
    const filteredTalentList = indexList.map((index) => talentList.get(index));
    const filteredSelected = selected.intersect(
      filteredTalentList.map((candidate) => candidate.get('id'))
    );
    dispatch({
      type: ADD_SEND_EMAIL_REQUEST,
      request: {
        type: SEND_EMAIL_TYPES.SendEmailToTalents,
        data: {
          talentIds: filteredSelected,
          talentList: talentList.filter((talent) =>
            filteredSelected.includes(talent.get('id'))
          ),
        },
      },
    });
  };

  goBackToList = () => {
    this.props.history.replace(`?tab=hotlist`, this.props.location.state || {});
  };

  render() {
    const { hotListId, hotList, talentList, t, classes, isAdmin, ...props } =
      this.props;

    const {
      indexList,
      selected,
      filterOpen,
      filters,
      dialogOpen,
      colSortDirs,
      handleDeleteHotlistTalent,
      candidateSelected,

      files,
      pending,
      dragEntering,
      downloading,
    } = this.state;
    const filteredTalentList = indexList.map((index) => talentList.get(index));
    const filteredSelected = selected.intersect(
      Immutable.Set(filteredTalentList.map((candidate) => candidate.get('id')))
    );
    const canAdd = talentList.size < 3000;

    return (
      <Paper
        className="flex-child-auto flex-container flex-dir-column"
        style={{ position: 'relative', zIndex: 2 }}
        onDrop={canAdd ? this.handleDrop : null}
        onDragEnter={canAdd ? this.onDragEnter : null}
        onDragOver={canAdd ? this.onDragOver : null}
        onDragLeave={canAdd ? this.onDragLeave : null}
        key={hotListId}
      >
        <div>
          <div
            className="flex-container align-middle"
            style={{ padding: '4px 10px', flexWrap: 'wrap' }}
          >
            <IconButton onClick={this.goBackToList}>
              <BackIcon />
            </IconButton>

            <IconButton
              disabled={filteredSelected.size !== 1}
              onClick={this.handleOpen}
            >
              <AssignJobIcon />
            </IconButton>
            <IconButton
              disabled={filteredSelected.size === 0}
              onClick={this.handleSendEmailToTalents}
            >
              <MailIcon />
            </IconButton>
            <AddEmailBlastButton
              talentIds={filteredSelected}
              {...props}
              t={t}
            />
            <IconButton
              onClick={() => this.setState({ filterOpen: !filterOpen })}
              color={filterOpen ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
            <Typography variant="subtitle2" className={'item-padding'}>
              {hotList ? hotList.get('title') : ''}
            </Typography>
            <Typography variant="subtitle1" className="item-padding">
              {filteredTalentList.size.toLocaleString()} {t('common:results')}
            </Typography>
            <div className="flex-child-auto" />
            <div className="horizontal-layout align-middle">
              <div>
                <FormControlLabel
                  control={
                    <Switch
                      color="primary"
                      checked={filters.get('chinese') || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newFilters = checked
                          ? filters.set('chinese', true)
                          : filters.remove('chinese');
                        this.setState({
                          filters: newFilters,
                          indexList: getIndexList(
                            this.props.talentList,
                            newFilters,
                            this.state.colSortDirs
                          ),
                        });
                      }}
                    />
                  }
                  label={t('field:Mandarin Speaking')}
                  labelPlacement="start"
                />
              </div>

              <PrimaryButton component="label" disabled={pending || !canAdd}>
                <AddIcon style={{ marginLeft: '-10px' }} />
                UPLOAD RESUMES
                <input
                  type="file"
                  data-multiple-caption="{count} files selected"
                  multiple
                  onChange={this.handleFileChange}
                  disabled={pending}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.ppt,.pptx"
                  style={{ display: 'none' }}
                />
              </PrimaryButton>
              {isAdmin && (
                <PrimaryButton
                  processing={downloading}
                  onClick={this.handleDownload}
                  disabled={filteredSelected.size === 0}
                >
                  EXPORT
                </PrimaryButton>
              )}
            </div>
          </div>
          <Divider />
        </div>

        {this.state.show ? (
          <div className="flex-child-auto" style={{ overflow: 'hidden' }}>
            <CandidateTable
              talentList={filteredTalentList}
              selected={filteredSelected}
              onSelect={this.onSelect}
              onSelectAll={this.checkAllBoxOnCheckHandler}
              onFilter={this.onFilter}
              filterOpen={filterOpen}
              colSortDirs={colSortDirs}
              onSortChange={this.onSortChange}
              filters={filters}
              columns={columns}
              onScrollEnd={onScrollEnd}
              scrollLeft={status.scrollLeft}
              scrollTop={status.scrollTop}
              onDelete={this.handleDeleteTalent}
            />
            {dragEntering && (
              <div
                className={clsx(
                  'flex-container flex-dir-column align-center-middle',
                  classes.fileInput,
                  classes.mask
                )}
              >
                <div className="container-padding" id="folderIcons">
                  <FolderIcon
                    color="primary"
                    style={{
                      fontSize: 54,
                      marginRight: -24,
                      marginBottom: -20,
                      position: 'relative',
                    }}
                  />
                  <FileIcon htmlColor="#cccccc" style={{ fontSize: 54 }} />
                </div>
                <Typography
                  style={{
                    color: '#babab8',
                    fontSize: '21px',
                    fontWeight: '500',
                  }}
                >
                  Drag and drop files here
                </Typography>
                <input
                  type="file"
                  data-multiple-caption="{count} files selected"
                  multiple
                  onChange={this.handleFileChange}
                  disabled={pending}
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.ppt,.pptx"
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>
        ) : (
          <Loading />
        )}

        <Dialog
          open={pending}
          maxWidth="md"
          onExit={() => this.setState({ files: [] })}
        >
          <BulkUploadResumes
            hotListId={hotListId}
            resumeFiles={files}
            {...props}
            onClose={() => this.setState({ pending: false })}
            t={t}
            onFinish={this.fetchTalents}
          />
        </Dialog>

        <Dialog
          open={dialogOpen}
          maxWidth="xl"
          disableEnforceFocus
          PaperComponent={DraggablePaperComponent}
        >
          <ApplyJob
            talentId={candidateSelected && candidateSelected.get('id')}
            handleRequestClose={this.handleClose}
            candidate={candidateSelected}
          />
        </Dialog>

        <AlertDialog
          onOK={handleDeleteHotlistTalent}
          onCancel={this.handleCancelDeleteTalent}
          content={t('message:confirmDeleteTalentFromHotlist')}
          okLabel={t('action:delete')}
          cancelLabel={t('action:cancel')}
        />
      </Paper>
    );
  }
}

function mapStoreStateToProps(state, { hotListId }) {
  const hotList = state.relationModel.hotLists.get(hotListId);
  const authorities = state.controller.currentUser.get('authorities');
  const isAdmin =
    !!authorities &&
    (authorities.includes(Immutable.Map({ name: 'ROLE_TENANT_ADMIN' })) ||
      authorities.includes(Immutable.Map({ name: 'ROLE_PRIMARY_RECRUITER' })));
  return {
    hotListId,
    hotList,
    talentList: getHotListTalentList2(state, hotListId),
    isAdmin,
  };
}

export default withTranslation()(
  connect(mapStoreStateToProps)(withStyles(styles)(HotlistTalents))
);

function traverseFileTree(item) {
  if (item.isFile) {
    console.log('isFile');
    return new Promise((resolve) => {
      item.file((file) => getFileFormat(file, resolve));
    });
  } else if (item.isDirectory) {
    console.log('isDirectory');

    // Get folder contents
    return new Promise((resolve) => {
      let dirReader = item.createReader();
      dirReader.readEntries(function (entries) {
        let files = [];
        for (let i = 0; i < entries.length; i++) {
          files.push(traverseFileTree(entries[i]));
        }
        console.log(files);
        Promise.all(files).then((res) => {
          console.log('nested', res);
          resolve(res);
        });
      });
    });
  }
  console.log('isNothing');
  return Promise.resolve();
}

function getFileFormat(file, cb) {
  // console.log('file',file);
  if (file.type) {
    cb(file);
  } else {
    let reader = new FileReader();
    reader.onload = function (evt) {
      let buffer = evt.target.result;
      let fileFormat = FileType.fromBuffer(buffer);
      //{ext:'pdf', mime:'application/pdf'}
      if (fileFormat) {
        const newFile = new File([file], file.name, { type: fileFormat.mime });
        // console.log('new file',newFile);
        cb(newFile);
      } else {
        cb(file);
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

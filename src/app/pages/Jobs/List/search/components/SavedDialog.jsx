import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Chip from '@material-ui/core/Chip';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Tooltip from '@material-ui/core/Tooltip';
import {
  getFilter,
  deleteFilter,
  getFilterSearch,
} from '../../../../../../apn-sdk/newSearch';

import MyDialog from '../../../../../components/Dialog/myDialog';
import {
  filterSearch,
  showAdvincedFilter,
  getAdvincedFilter,
} from '../../../../../../utils/search';
import { connect, useSelector, useDispatch } from 'react-redux';
import {
  getNewSearch,
  setInFilter,
  getSearchData,
  saveAdvancedFilter,
  getAdvancedData,
} from '../../../../../actions/newSearchJobs';

const styles = makeStyles({
  action: {
    border: '1px solid',
  },
  dialogs: {
    '& .MuiPaper-root': {
      maxWidth: '800px !important',
      width: 800,
      borderRadius: 10,
    },
    '& .MuiDialog-paperWidthSm': {
      width: '600px',
    },
    '& .MuiDialog-paper': {
      borderRadius: '10px !important',
    },
    '& .action': {
      borderTop: '1px solid #D3D3D3',
    },
    '& .btn': {
      width: 107,
      height: 33,
    },
    '& .title': {
      paddingBottom: 5,
    },
    '& .list': {
      marginBottom: '12px',
      '& .no_data': {
        width: '100%',
      },
    },
    '& .searchInput': {
      height: 32,
      width: 269,
      background: '#fff',
      marginBottom: '12px',
    },
    '& .MuiPaper-root': {
      borderRadius: '0px',
    },
    '& .MuiAccordion-rounded:last-child': {
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      // border-bottom-right-radius: 4px;
    },
    '& .no_data': {
      minHeight: '100px',
    },
    '& .every': {
      maxWidth: '230px',
      marginBottom: '8px',
    },
  },
  filter_box: {
    width: '100%',
    border: '1px solid #E9E9E8',
    '& .list_title': {
      height: 32,
      lineHeight: '32px',
      background: '#FAFAFB',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 15px',
      borderBottom: '1px solid #F3F3F2',
      marginBottom: '10px',
      '& span': {
        fontSize: 16,
        color: '#3498db',
      },
      '& span:nth-child(1)': {
        fontWeight: '500',
        color: '#505050',
        fontSize: 16,
        display: 'inline-bolck',
        width: '70%',
      },
    },
    '& .list_content': {
      padding: '12px 16px',
    },
  },
  Accordion: {
    maxWidth: '100% !important',
    width: '100% !important',
    '& .dialog_content': {
      paddingTop: '17px',
      paddingBottom: '17px',
    },
    '& .content': {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      '& .MuiChip-sizeSmall': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '& .MuiChip-label': {
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      },
      '& .and': {
        margin: '0 5px',
      },
    },
  },
  header: {
    minHeight: '45px !important',
    height: '50px',
    background: '#FAFAFB',
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '95%',
      '& .MuiTypography-root': {
        width: '74%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '16px',
        fontWeight: 550,
        color: '#505050',
      },
    },
    '& .MuiAccordionSummary-root': {
      paddingLeft: '5px',
    },
    '& .actions': {
      width: '23%',
      display: 'flex',
      justifyContent: 'space-between',
      '& span': {
        color: '#4EA5DF',
        fontSize: '14px',
        fontWeight: 550,
      },
    },
  },
});
function SavedDialog({ show, close, t }) {
  const { newSearchJobs, newSearchOptions } = useSelector(
    (state) => state.controller
  );

  const classes = styles();
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(show);
  const [opens, setOpens] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [arr, setArr] = useState([]);
  const [timer, setTimer] = useState(null);
  const [deleteId, setDeleteId] = useState('');

  const handleClose = () => {
    setOpen(false);
    close();
  };

  // 模糊查询
  const handleChange = (e) => {
    if (e.target.value == '') {
      handleList();
      return;
    }
    clearTimeout(timer);
    let time = setTimeout(() => {
      getFilterSearch(e.target.value).then((res) => {
        console.log(res);
        if (res) {
          let { response } = res;
          response.forEach((item) => {
            item.searchName = item.searchName.replace(/\\/g, '');
          });
          setArr(response);
        }
      });
    }, 300);
    setTimer(time);
  };

  const handleSearch = (e, item) => {
    e.stopPropagation();
    if (item.searchType == 'BASE') {
      dispatch(setInFilter(JSON.parse(item.searchGroup)));
      dispatch(getSearchData());
    } else if (item.searchType == 'ADVANCED') {
      dispatch(saveAdvancedFilter(JSON.parse(item.searchGroup)));
    }
    handleClose();
  };

  // 删除快捷搜索
  const handleDelete = (e, id) => {
    e.stopPropagation();
    // setOpenShow(true)
    setOpens(true);
    setDeleteId(id);
  };

  const handleDeleteOk = () => {
    deleteFilter(deleteId).then((res) => {
      let arrs = arr.filter((item) => {
        return item.id != deleteId;
      });
      setArr(arrs);
      setOpens(false);
    });
  };

  // 列表查询
  const handleList = () => {
    getFilter().then((res) => {
      if (res) {
        let { response } = res;
        response.forEach((item) => {
          item.searchName = item.searchName.replace(/\\/g, '');
        });
        setArr(response);
      }
    });
  };

  // 纸片展示
  const showChip = (str, type) => {
    if (type == 'BASE') {
      str = str.replace(/","]/g, '""]');
      let arr = str.replace(/\\/g, '').split(',');
      if (arr.length >= 1) {
        arr.pop();
      }
      return arr;
    } else {
      let showStr = JSON.parse(str);
      let arr = [];
      showStr.forEach((item) => {
        arr = arr.concat(item[1].split(','), 'or');
      });
      arr = arr.filter((item) => {
        return item != '';
      });
      arr.pop();
      // str = str.replace(/","]/g, '""]')
      // let arr = str.replace(/\\/g, '').split(',');
      // console.log(arr);
      // if (arr.length >= 1) {
      //   arr.pop();
      // }
      return arr;
    }
  };

  const showChipStr = (str, type) => {
    if (type == 'BASE') {
      let { arr, strShow, strBox } = filterSearch(JSON.parse(str));
      let res = strShow.split(',');
      res.pop();
      return res;
    } else {
      let { showStr } = getAdvincedFilter(JSON.parse(str));
      let arr = [];
      showStr.forEach((item) => {
        arr = arr.concat(item[1].split(','), 'or');
      });
      arr = arr.filter((item) => {
        return item != '';
      });
      arr.pop();
      return arr;
    }
  };

  useEffect(() => {
    setOpen(show);
  }, [show]);

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        className={classes.dialogs}
        onEnter={handleList}
      >
        <DialogTitle className="title" id="responsive-dialog-title">
          {t('tab:Saved Filters')}
        </DialogTitle>
        <DialogContent>
          <OutlinedInput
            onChange={handleChange}
            className="searchInput"
            size="small"
            variant="outlined"
            placeholder={t('tab:Search filter name, keywords...')}
            startAdornment={
              <InputAdornment color="disabled" position="start">
                <SearchIcon style={{ fontSize: 18 }} />
              </InputAdornment>
            }
          />
          {arr.length == 0 && <div className="no_data"></div>}
          {arr.map((item, index) => (
            <div className="list" key={item.createdDate || index}>
              <Accordion
                // expanded={expanded === "panel1"}
                className={classes.Accordion}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                  className={classes.header}
                >
                  <Typography>{item.searchName}</Typography>
                  <div className="actions">
                    <span onClick={(e) => handleSearch(e, item)} className="">
                      {t('tab:Search')}
                    </span>
                    <span
                      onClick={(e) => handleDelete(e, item.id)}
                      className=""
                    >
                      {t('tab:Delete')}
                    </span>
                  </div>
                </AccordionSummary>
                <AccordionDetails className="dialog_content">
                  <div className="content">
                    {item.searchType == 'BASE' ? (
                      showChipStr(item['searchGroup'], 'BASE').map(
                        (items, indexs) => {
                          return (
                            <div key={indexs}>
                              <Tooltip title={items} placement="top-end">
                                <Chip
                                  color="default"
                                  size="small"
                                  label={items}
                                  className="every"
                                />
                              </Tooltip>

                              {showChipStr(item['searchGroup'], 'BASE').length -
                                1 !=
                              indexs ? (
                                <span className="and">and</span>
                              ) : (
                                <span className="and">;</span>
                              )}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <></>
                    )}
                    {item.searchType == 'ADVANCED' ? (
                      showChipStr(item['searchGroup'], 'ADVANCED').map(
                        (items, indexs) => {
                          // if (indexs == 0) return <></>;
                          return (
                            <div key={indexs}>
                              {items != 'or' && (
                                <Tooltip title={items} placement="top-end">
                                  <Chip
                                    color="default"
                                    size="small"
                                    label={items}
                                    className="every"
                                  />
                                </Tooltip>
                              )}

                              {items == 'or' && <span className="and">or</span>}
                              {indexs ==
                                showChipStr(item['searchGroup'], 'ADVANCED')
                                  .length -
                                  1 && <span>;</span>}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          ))}
        </DialogContent>
        <DialogActions className="action">
          <Button
            className="btn"
            autoFocus
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            {t('tab:Close')}
          </Button>
        </DialogActions>
      </Dialog>

      <MyDialog
        show={opens}
        CancelBtnShow={true}
        SubmitBtnShow={true}
        SubmitBtnMsg={t('action:delete')}
        CancelBtnMsg={t('action:cancel')}
        CancelBtnVariant={'contained'}
        modalTitle="Delete Filter"
        handleClose={() => {
          setOpens(false);
        }}
        primary={() => {
          handleDeleteOk();
        }}
      >
        <p style={{ width: '500px' }}>{t('message:DeleteSavedFilter')}</p>
      </MyDialog>
    </>
  );
}

function mapStoreStateToProps(state) {
  return {};
}

export default withTranslation(['action', 'message', 'field', 'tab'])(
  connect(mapStoreStateToProps)(SavedDialog)
);

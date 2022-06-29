import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import Divider from '@material-ui/core/Divider';
import Checkbox from '@material-ui/core/Checkbox';
import Select from 'react-select';
import Dialog from '@material-ui/core/Dialog';
import { showErrorMessage } from '../../../../actions';
import PrimaryButton from '../../../../components/particial/PrimaryButton';
import PotentialButton from '../../../../components/particial/PotentialButton';
import FormReactSelectContainer from '../../../../components/particial/FormReactSelectContainer';
import DocumentsPackageList from './documentsPackageList';
import DocumentsHistory from './DocumentsHistory';
import AddDocuments from './AddDocuments';
import S3LinkDialog from './s3LinkDialog';
import PreviewPackageDialog from './PreviewPackageDialog';
import loadsh from 'lodash';
import {
  getPackagesList,
  getSelectDocuments,
  getDrafts,
  getHistory,
  fetchAddDocumentData,
  PreviewPackageS3link,
  saveDrafts,
  CancelBtnAction,
  getTemplateEmailContent,
  onboardSendEmail,
} from '../../../../../apn-sdk/onBoarding';
import SelectDocumentDialog from '../../../Setting/components/SelectDocumentDialog';
import Loading from '../../../../components/particial/Loading';
import AlertDialog from '../../../../components/particial/AlertDialog';
import HistoryDialog from './HistoryDialog';
import SendBasicInfoEmail from '../../../../components/SendBasicInfoEmail';

const styles = {
  center: {
    width: '100%',
    display: 'flex',
    height: 274,
  },
  left: {
    width: '374px',
    marginRight: 24,
  },
  title: {
    
    fontSize: '22px',
    color: '#505050',
    fontWeight: '600',
    marginBottom: '16px',
  },
  tip: {
    
    fontSize: '14px',
    color: '#505050',
    marginBottom: '16px',
  },
  bottom: {
    display: 'flex',
    marginTop: '24px',
  },
  addDocuments: {
    
    fontSize: '14px',
    color: '#3398dc',
    cursor: 'pointer',
  },
  DisabedAddDocuments: {
    
    fontSize: '14px',
    color: '#505050',
    cursor: 'pointer',
  },
};
class Documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      packageId: null,
      packageName: null,
      historyFlag: false, //是否走过历史流程
      isHistoryFlag: false, // 走过历史流程后是否清空数据flag
      selectPackageLoading: false,
      btnLoading: false,
      packageList: [], // package下拉框数据
      addDocumentList: [], //step2 右侧数据
      selectPackageList: [], //step1 右侧数据
      selectDocumentOptions: [], //模糊查询数据
      PreviewPackageData: [], // PreviewPackage Btn 弹窗数据
      addDocumentFlag: false,
      selectDocumentData: [], // 传给 Step 2: Additional Document (Optional)弹窗数据
      draftsList: [],
      historyList: [],
      isShowAddDocument: false,
      openPreviewPackage: false,
      handleCancel: null,
      cancelAgain: false,
      onboardTemplate: false,
      emailObj: {
        title: 'Email to Candidate’s Name (Candidate)',
      },
      timer: null,
      newApplicationId: props.applicationId,
      packageS3LinkList: [],
    };
  }

  componentDidMount() {
    this.getPackagesList();
  }

  static getDerivedStateFromProps(props, state) {
    const { applicationId } = props;
    if (state.newApplicationId !== applicationId) {
      return {
        newApplicationId: applicationId,
      };
    }
    return null;
  }

  componentDidUpdate(props) {
    if (props.applicationId !== this.props.applicationId) {
      this.setState({
        loading: false,
        packageId: null,
        packageName: null,
        historyFlag: false, //是否走过历史流程
        isHistoryFlag: false, // 走过历史流程后是否清空数据flag
        selectPackageLoading: false,
        btnLoading: false,
        packageList: [], // package下拉框数据
        addDocumentList: [], //step2 右侧数据
        selectPackageList: [], //step1 右侧数据
        selectDocumentOptions: [], //模糊查询数据
        PreviewPackageData: [], // PreviewPackage Btn 弹窗数据
        addDocumentFlag: false,
        selectDocumentData: [], // 传给 Step 2: Additional Document (Optional)弹窗数据
        draftsList: [],
        historyList: [],
        isShowAddDocument: false,
        openPreviewPackage: false,
        handleCancel: null,
        cancelAgain: false,
        onboardTemplate: false,
        emailObj: {
          title: 'Email to Candidate’s Name (Candidate)',
        },
        timer: null,
      });
      this.getPackagesList();
    }
  }

  //获取草稿信息  获取历史流程接口
  getPackagesListAndDrafts = () => {
    const { packageList, newApplicationId } = this.state;
    const parmas = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
    Promise.all([
      getDrafts(newApplicationId),
      getHistory(parmas, newApplicationId),
    ])
      .then((res) => {
        let draftsList = res[0].response; //草稿信息
        let historyList = res[1].response; //历史信息
        this.setState(
          {
            PreviewPackageData: draftsList.documents,
            draftsList: draftsList,
            historyList: historyList,
            loading: true,
          },
          () => {
            if (historyList.length > 0) {
              //有历史记录的时候  step2 的数据就是草稿的数据
              let documentsList = draftsList.documents
                ? loadsh.cloneDeep(draftsList.documents)
                : [];
              documentsList.map((item) => {
                //改写数据
                item.documentId = item.id;
              });
              this.setState({
                historyFlag: true,
                isHistoryFlag: true,
                addDocumentList: documentsList,
              });
            } else if (draftsList.packageId) {
              let item = packageList.filter((item) => {
                return item.id == draftsList.packageId;
              })[0];
              this.changePackage(item, 'draft');
            }
          }
        );
      })
      .catch((err) => {
        this.setState({
          loading: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  //获取packageList 列表
  getPackagesList = () => {
    const { newApplicationId } = this.state;
    getPackagesList(newApplicationId)
      .then(({ response }) => {
        this.setState(
          {
            packageList: response,
          },
          () => {
            this.getPackagesListAndDrafts(newApplicationId);
          }
        );
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  //选择package 查询获取右侧document列表
  changePackage = (item, type) => {
    this.setState({
      packageName: item.name,
      packageId: item.id,
      selectPackageLoading: true,
    });
    const { draftsList, newApplicationId, addDocumentList } = this.state;
    let documentsList = loadsh.cloneDeep(draftsList.documents);
    getSelectDocuments(newApplicationId, item.id)
      .then(({ response }) => {
        // 候选人创建onboarding后存成draft后，刷新页面,切换package,package中的文件应该自动勾选
        if (item.id === draftsList.packageId) {
          if (documentsList && documentsList.length > 0) {
            response.map((item) => {
              documentsList.map((obj) => {
                if (item.documentId === obj.id) {
                  item.isRepeat = true;
                  item.checked = false;
                }
              });
            });
            response.map((item) => {
              if (!item.isRepeat) {
                item.checked = true;
              }
            });
          } else {
            response.map((item) => {
              item.checked = false;
            });
          }
        } else {
          response.map((item) => {
            item.checked = false;
          });
        }
        // 如果step2已选择的数据与step1中的数据相同，则清空step2中相同的数据
        const nameList = response.map((item) => item.name);
        const list = loadsh
          .cloneDeep(addDocumentList)
          .filter((item) => !nameList.includes(item.name));
        this.setState({
          addDocumentList: list,
          selectPackageList: response,
          selectPackageLoading: false,
        });
        if (type) {
          this.getAddDocument(response);
        }
      })
      .catch((err) => {
        this.setState({
          selectPackageLoading: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  //根据草稿信息 获取AddDocument  数据
  getAddDocument = (selectPackageList) => {
    const { draftsList } = this.state;
    let documentsList = loadsh.cloneDeep(draftsList.documents);
    documentsList.map((item) => {
      //改写数据
      item.documentId = item.id;
    });
    documentsList.map((item) => {
      selectPackageList.map((obj) => {
        if (obj.documentId == item.documentId) {
          item.isRepeat = true;
        }
      });
    });
    let list = documentsList.filter((item) => {
      return !item.isRepeat;
    });
    this.setState({ addDocumentList: list });
  };

  //packageChecked 事件
  packageCheck = (checkdItem) => {
    if (checkdItem.mandatory) {
      return;
    }
    let list = loadsh.cloneDeep(this.state.selectPackageList);
    list.map((item) => {
      if (item.documentId === checkdItem.documentId) {
        item.checked = !checkdItem.checked;
      }
    });
    this.setState({
      selectPackageList: list,
    });
  };

  // add document dialog 打开并查询数据
  fetchAddDocumentData = () => {
    const { addDocumentList, selectPackageLoading, newApplicationId } =
      this.state;
    if (selectPackageLoading) {
      return null;
    }
    let selectPackageList = loadsh.cloneDeep(this.state.selectPackageList);
    selectPackageList = selectPackageList.filter((item) => {
      return !item.checked;
    });
    this.setState({ addDocumentFlag: true, isShowAddDocument: true });
    let allList = [...addDocumentList, ...selectPackageList];
    let list = [];
    allList.map((item) => {
      list.push(item.documentId);
    });
    let params = {
      documents: list,
      applicationId: newApplicationId,
      name: null,
    };
    fetchAddDocumentData(params)
      .then(({ response }) => {
        this.setState({
          isShowAddDocument: false,
          selectDocumentData: response,
        });
      })
      .catch((err) => this.props.dispatch(showErrorMessage(err)));
  };

  //保存Additional Document 数据
  saveAddDocument = (data) => {
    let selectPackageList = loadsh.cloneDeep(this.state.selectPackageList);
    selectPackageList.map((item) => {
      // selectPackageList 数据修改
      data.map((obj) => {
        if (item.documentId == obj.id) {
          item.checked = !obj.selected;
        }
      });
    });

    let list = data.filter((item) => {
      //先获取勾选上的数据
      return item.selected;
    });
    list.map((item) => {
      // 数据格式化
      item.documentId = item.id;
    });

    list.map((item) => {
      //勾选数据和selectPackageList 去重
      selectPackageList.map((obj) => {
        if (obj.documentId == item.documentId) {
          item.isRepeat = true;
        }
      });
    });
    let arr = list.filter((item) => {
      return !item.isRepeat;
    });

    this.setState({
      addDocumentList: arr,
      selectPackageList: selectPackageList,
      addDocumentFlag: false,
    });
  };

  getDraftsData = (newApplicationId) => {
    getDrafts(newApplicationId)
      .then(({ response }) => {
        this.setState({ draftsList: response });
      })
      .catch((err) => {
        this.props.dispatch(showErrorMessage(err));
      });
  };

  //保存草稿
  saveDrafts = () => {
    const { addDocumentList, selectPackageList, packageId, newApplicationId } =
      this.state;
    let selectPackage = selectPackageList.filter((item) => {
      return !item.checked;
    });
    let documents = [...selectPackage, ...addDocumentList];
    let list = [];
    documents.map((item, index) => {
      list.push({
        id: item.documentId,
        order: index,
      });
    });
    let params = {
      packageId: packageId,
      documents: list,
    };
    this.setState({
      btnLoading: true,
      PreviewPackageData: documents,
    });
    saveDrafts(params, newApplicationId)
      .then(({ response }) => {
        this.setState({
          btnLoading: false,
        });
        this.getDraftsData(newApplicationId);
      })
      .catch((err) => {
        this.setState({
          btnLoading: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  //openS3Link
  openS3Link = (data) => {
    this.setState({
      openS3Link: true,
      s3Link: data,
    });
  };
  //  previewPackage  Btn
  previewPackageS3 = (item) => {
    this.setState({
      openS3Link: true,
      s3Link: item,
    });
  };

  openHistoryS3 = (item) => {
    this.setState({
      openS3Link: true,
      s3Link: item,
    });
  };

  openHistoryDialog = () => {
    this.setState({
      openHistory: true,
    });
  };

  //CancelBtn
  CancelBtn = () => {
    if (localStorage.getItem('cancelAgain')) {
      //如果点过 not again 就直接请求接口 不弹窗
      this.CancelBtnAction();
    } else {
      this.setState({
        handleCancel: () => {
          this.CancelBtnAction();
          this.setState({
            handleCancel: null,
          });
        },
      });
    }
  };
  //CancelBtnAction
  CancelBtnAction = () => {
    const { cancelAgain, isHistoryFlag, newApplicationId } = this.state;
    if (cancelAgain) {
      localStorage.setItem('cancelAgain', true);
    }
    this.setState({ btnLoading: true });
    CancelBtnAction(newApplicationId)
      .then(({ response }) => {
        this.setState({
          packageId: null,
          packageName: null,
          historyFlag: isHistoryFlag ? true : false,
          addDocumentList: [],
          draftsList: [],
          selectPackageList: [],
          PreviewPackageData: [],
          selectDocumentData: [],
          btnLoading: false,
        });
        if (!isHistoryFlag) {
          this.setState({ historyList: [] });
        }
      })
      .catch((err) => {
        this.setState({
          btnLoading: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  openOnboardTemplate = () => {
    this.setState({
      btnLoading: true,
    });
    const { addDocumentList, newApplicationId } = this.state;
    let selectPackageList = loadsh.cloneDeep(this.state.selectPackageList);
    selectPackageList = selectPackageList.filter((item) => {
      return !item.checked;
    });
    let allList = [...addDocumentList, ...selectPackageList];
    let list = [];
    allList.map((item) => {
      list.push(item.documentId);
    });
    getTemplateEmailContent(newApplicationId, list)
      .then(({ response }) => {
        this.setState(
          {
            emailObj: {
              title: 'Email to ',
              htmlContents: response.htmlContents,
              subject: response.subject,
              to: response.to,
              templatesOptions: response.emailTemplates,
            },
          },
          () => {
            this.setState({
              onboardTemplate: true,
              btnLoading: false,
            });
          }
        );
      })
      .catch((err) => {
        this.setState({
          onboardTemplate: false,
          btnLoading: false,
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  getSendEmail = (data) => {
    const { addDocumentList, packageId, packageName, newApplicationId } =
      this.state;
    let selectPackageList = loadsh.cloneDeep(this.state.selectPackageList);
    selectPackageList = selectPackageList.filter((item) => {
      return !item.checked;
    });
    let allList = [...addDocumentList, ...selectPackageList];
    let list = [];
    allList.map((item, index) => {
      list.push({ id: item.documentId, ordering: index + 1 });
    });
    let params = {
      applicationId: newApplicationId,
      documents: list,
      email: {
        to: data.Tovalue,
        cc: data.ccValue,
        bcc: data.bccValue,
        subject: data.subjectValue,
        htmlContents: data.body,
        files: data.files,
      },
    };
    if (packageId && packageName) {
      params.packageId = packageId;
      params.packageName = packageName;
    }
    let copyEmailObj = loadsh.cloneDeep(this.state.emailObj);
    copyEmailObj.pending = true;
    this.setState({ emailObj: copyEmailObj });
    onboardSendEmail(params)
      .then(({ response }) => {
        this.setState(
          {
            onboardTemplate: false,
            btnLoading: false,
            packageName: null,
            emailObj: { title: 'Email to ' },
            selectPackageList: [],
          },
          () => {
            this.getPackagesListAndDrafts(newApplicationId);
          }
        );
      })
      .catch((err) => {
        this.setState({
          onboardTemplate: false,
          btnLoading: false,
          emailObj: { title: 'Email to ' },
        });
        this.props.dispatch(showErrorMessage(err));
      });
  };

  //Onboard btn 权限
  getOnboard = () => {
    const { addDocumentList, selectPackageList, historyList } = this.state;
    if (historyList.length > 0) {
      //有历史记录的时候
      return !addDocumentList.length > 0;
    } else {
      // step1选择package且选择了文件标识
      let selectPackageListFlag = selectPackageList.some((item) => {
        return !item.checked;
      });
      return !selectPackageListFlag;
    }
  };

  // onboardBtn show
  isShowOnboardBtn = () => {
    const { isHistoryFlag, packageId, addDocumentList } = this.state;
    // 1.onboarding之后Additional Onboarding Document有文件
    // 2.onboarding之前有选择的package的情况
    // 3.onboarding之前有选择Selected Additional Onboarding Document
    // 则显示底部btn
    if (isHistoryFlag) {
      return addDocumentList.length > 0;
    } else {
      return packageId || addDocumentList.length > 0;
    }
  };

  selectInputChange = (value) => {
    const { addDocumentList, newApplicationId } = this.state;
    clearTimeout(this.state.timer);
    let selectPackageList = loadsh.cloneDeep(this.state.selectPackageList);
    selectPackageList = selectPackageList.filter((item) => {
      return !item.checked;
    });
    let allList = [...addDocumentList, ...selectPackageList];
    let list = [];
    allList.map((item) => {
      list.push(item.documentId);
    });
    const replaceName = value.replace(/[^A-Za-z0-9_\-\u4e00-\u9fa5]+/g, '');
    const params = {
      applicationId: newApplicationId,
      documents: list,
      name: replaceName.substring(0, 201)
        ? replaceName.substring(0, 201)
        : null,
    };
    const time = setTimeout(async () => {
      await fetchAddDocumentData(params)
        .then((response) => {
          const options = [];
          response.response.map((item) => {
            options.push({ value: item.id, label: item.name });
          });
          this.setState({ selectDocumentOptions: options });
        })
        .catch((err) => {
          this.props.dispatch(showErrorMessage(err));
        });
    }, 1500);
    this.setState({
      timer: time,
    });
  };

  PreviewPackageS3link = () => {
    const {
      selectPackageList,
      addDocumentList,
      newApplicationId,
    } = this.state;
    const list = selectPackageList
      .filter((item) => !item.checked)
      .concat(addDocumentList);
    this.setState({
      PreviewPackageData: list,
      btnLoading: true
    });

    const documentsList = list.map((item, index) => {
      return { id: item.documentId, ordering: index };
    });

    const params = {
      applicationId: newApplicationId,
      documents: documentsList,
    };

    PreviewPackageS3link(params)
      .then((response) => {
        this.setState({ openPreviewPackage: true, packageS3LinkList: response.response, btnLoading: false });
      })
      .catch((err) => {
        this.setState({ btnLoading: false })
        this.props.dispatch(showErrorMessage(err));
      });
  };

  render() {
    const {
      loading,
      historyList,
      packageList,
      packageId,
      historyFlag,
      isHistoryFlag,
      addDocumentList,
      packageName,
      selectPackageList,
      addDocumentFlag,
      selectDocumentData,
      isShowAddDocument,
      selectPackageLoading,
      selectDocumentOptions,
      cancelAgain,
      btnLoading,
      openS3Link,
      s3Link,
      PreviewPackageData,
      openPreviewPackage,
      handleCancel,
      openHistory,
      onboardTemplate,
      packageS3LinkList
    } = this.state;
    const { classes, t, applicationId, applications, candidatesInfo } =
      this.props;
    if (!loading) {
      return <Loading />;
    }
    const onboardBtnFlag = this.isShowOnboardBtn();
    const onboardingFlag = this.getOnboard();
    return (
      <div className={classes.root}>
        {!historyFlag || !isHistoryFlag ? (
          <div className={classes.center}>
            <div className={classes.left}>
              <div className={classes.title}>Step 1: Select a Package</div>
              <div
                className={classes.tip}
              >{`Select ${candidatesInfo?.fullName}'s Package`}</div>
              <FormReactSelectContainer>
                <Select
                  value={packageId}
                  onChange={this.changePackage}
                  options={packageList}
                  valueKey={'id'}
                  labelKey={'name'}
                  autoBlur={true}
                  searchable={true}
                  clearable={false}
                />
              </FormReactSelectContainer>
            </div>
            <DocumentsPackageList
              packageList={selectPackageList}
              packageName={packageName}
              checked={this.packageCheck}
              loading={selectPackageLoading}
              openS3LinkDialog={this.openS3Link}
            />
          </div>
        ) : (
          <DocumentsHistory
            data={historyList}
            openHistoryDialog={this.openHistoryDialog}
          />
        )}
        <Divider style={{ margin: '24px 0' }} />
        <div className={classes.center}>
          <div className={classes.left}>
            {!historyFlag && <div className={classes.title}>Step 2: </div>}
            <div className={classes.title}>Additional Document (Optional)</div>
            <div
              className={
                selectPackageLoading
                  ? classes.DisabedAddDocuments
                  : classes.addDocuments
              }
              onClick={this.fetchAddDocumentData}
            >
              {' '}
              + Add Additional Onboarding Document
            </div>
          </div>
          <AddDocuments
            parList={addDocumentList}
            openS3LinkDialog={this.openS3Link}
            historyFlag={historyFlag}
          />
        </div>

        {onboardBtnFlag && (
          <div className={classes.bottom}>
            <PotentialButton
              style={{ marginRight: 8 }}
              onClick={this.saveDrafts}
              size={'small'}
              processing={btnLoading}
            >
              {'Save'}
            </PotentialButton>

            {!historyFlag && (
              <PotentialButton
                style={{ marginRight: 8 }}
                onClick={this.PreviewPackageS3link}
                size={'small'}
                processing={btnLoading}
              >
                {'Preview Package'}
              </PotentialButton>
            )}

            <PotentialButton
              style={{ marginRight: 8 }}
              onClick={this.CancelBtn}
              size={'small'}
              processing={btnLoading}
            >
              {'Cancel'}
            </PotentialButton>
            <PrimaryButton
              onClick={this.openOnboardTemplate}
              size={'small'}
              processing={btnLoading}
              disabled={onboardingFlag}
            >
              {'Onboard'}
            </PrimaryButton>
          </div>
        )}

        {onboardTemplate && (
          <SendBasicInfoEmail
            getShutDown={() => {
              this.setState({
                onboardTemplate: false,
              });
            }}
            application={applications.get(String(applicationId))}
            emailObj={this.state.emailObj}
            getSendEmail={this.getSendEmail}
          />
        )}

        <SelectDocumentDialog
          onClose={() => {
            this.setState({ addDocumentFlag: false });
          }}
          open={addDocumentFlag}
          t={t}
          dataSource={selectDocumentData}
          otherDataSource={selectPackageList}
          onSubmit={this.saveAddDocument}
          isShow={isShowAddDocument}
          isMandatory={false}
          selectInputChange={this.selectInputChange}
          selectDocumentOptions={selectDocumentOptions}
        />
        <Dialog open={openS3Link} maxWidth="lg" fullWidth>
          <S3LinkDialog
            previewSrc={s3Link}
            onClose={() => this.setState({ openS3Link: false })}
          />
        </Dialog>
        <Dialog open={openPreviewPackage} fullWidth>
          <PreviewPackageDialog
            data={PreviewPackageData}
            packageS3LinkList={packageS3LinkList}
            previewPackageS3={this.previewPackageS3}
            onClose={() => this.setState({ openPreviewPackage: false })}
          />
        </Dialog>
        <Dialog open={openHistory} fullWidth>
          <HistoryDialog
            data={historyList}
            openHistoryS3={this.openHistoryS3}
            onClose={() => this.setState({ openHistory: false })}
          />
        </Dialog>
        <AlertDialog
          onOK={handleCancel}
          onCancel={() => {
            this.setState({
              handleCancel: null,
            });
          }}
          title={t(
            ' Once you confirmed, your selected onboaring documents will be deleted.'
          )}
          content={
            <div>
              <Checkbox
                onClick={() => {
                  this.setState({
                    cancelAgain: !this.state.cancelAgain,
                  });
                }}
                checked={cancelAgain}
                color="primary"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              Do not show again
            </div>
          }
          okLabel={t('action:confirm')}
          cancelLabel={t('action:cancel')}
        />
      </div>
    );
  }
}

function mapStoreStateToProps(state, { match }) {
  const index = state.router.location.pathname.lastIndexOf('/');
  const pathId = state.router.location.pathname.substring(
    index + 1,
    state.router.location.pathname.length
  );
  return {
    candidatesInfo: state.model.talents.toJS()[pathId],
    applications: state.relationModel.applications,
    applicationId: state.controller.openOnboarding.action.applicationId,
  };
}
export default connect(mapStoreStateToProps)(withStyles(styles)(Documents));

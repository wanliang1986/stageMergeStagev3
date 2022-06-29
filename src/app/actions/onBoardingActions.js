import * as apnSDK from './../../apn-sdk/';
import * as ActionTypes from '../constants/actionTypes';

// 查询document列表接口
export const getDocumentTableData = () => (dispatch) => {
  return apnSDK.getDocumentTableData().then(({ response }) => {
    return response;
  });
};

// 上传pdf文件
export const UploadFile = (params) => (dispatch) => {
  return apnSDK.UploadFile(params).then((response) => {
    return response;
  });
};

// 删除document接口
export const deleteDocuments = (documentId) => (dispatch) => {
  return apnSDK.deleteDocuments(documentId).then(({ response }) => {
    return response;
  });
};

// 新增document接口
export const addDocument = (params) => (dispatch) => {
  return apnSDK.addDocument(params).then(({ response }) => {
    return response;
  });
};

// 编辑document接口
export const editDocument = (params, documentId) => (dispatch) => {
  return apnSDK.editDocument(params, documentId).then(({ response }) => {
    return response;
  });
};

// 查询document详情接口
export const getDocument = (params, documentId) => (dispatch) => {
  return apnSDK.getDocument(params, documentId).then(({ response }) => {
    return response;
  });
};

// 查询package列表接口
export const getPackageTableData = () => (dispatch) => {
  return apnSDK.getPackageTableData().then(({ response }) => {
    return response;
  });
};

// 删除package接口
export const deletePackages = (packageId) => (dispatch) => {
  return apnSDK.deletePackages(packageId).then(({ response }) => {
    return response;
  });
};

// 新增Package接口
export const addPackages = (params) => (dispatch) => {
  return apnSDK.addPackages(params).then(({ response }) => {
    return response;
  });
};

// 编辑package接口
export const editPackages = (params, packageId) => (dispatch) => {
  return apnSDK.editPackages(params, packageId).then(({ response }) => {
    return response;
  });
};

// 查询package下document列表接口
export const getPackageDocumentTableData = (packageId) => (dispatch) => {
  return apnSDK.getPackageDocumentTableData(packageId).then(({ response }) => {
    return response;
  });
};

// 删除package内Document接口
export const deletePackagesDocument = (packageId, documentId) => (dispatch) => {
  return apnSDK
    .deletePackagesDocument(packageId, documentId)
    .then(({ response }) => {
      return response;
    });
};

// 查询selectDocument列表接口
export const getSelectDocumentTableData = (packageId, params) => (dispatch) => {
  return apnSDK
    .getSelectDocumentTableData(packageId, params)
    .then(({ response }) => {
      return response;
    });
};

// 保存selectDocument接口
export const saveSelectDocumentTableData =
  (params, packageId) => (dispatch) => {
    return apnSDK
      .saveSelectDocumentTableData(params, packageId)
      .then(({ response }) => {
        return response;
      });
  };

// 查询签名
export const getEsignatureData = () => (dispatch) => {
  return apnSDK.getEsignatureData().then(({ response }) => {
    return response;
  });
};

// 保存签名
export const saveEsignatureData = (params) => (dispatch) => {
  return apnSDK.saveEsignatureData(params).then(({ response }) => {
    return response;
  });
};

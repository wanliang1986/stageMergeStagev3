import authRequest from './request';
import * as SparkMD5 from 'spark-md5';
// import * as MD5 from '../lib/md5';

export const uploadAvatar = (file) => {
  const requestBody = new FormData();
  requestBody.append('file', file);

  const config = {
    method: 'POST',
    headers: {},
    body: requestBody,
  };

  return authRequest.send(`/files/upload-avatar`, config);
};

export const getUuid = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    var spark = new SparkMD5();
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      spark.appendBinary(e.target.result);
      let md5 = spark.end();
      resolve(md5);
    };
  });
};
export const getFileUuid = (file) =>
  file.arrayBuffer().then(SparkMD5.ArrayBuffer.hash);

export const getTextUuid = (text) => {
  if (text) {
    const spark = new SparkMD5();
    spark.append(text);
    let md5 = spark.end();
    return md5;
  }
};

const fileTypes = [
  'doc',
  'pdf',
  'docx',
  'txt',
  'dotc',
  'docm',
  'htm',
  'html',
  'dot',
  'jpg',
  'jpeg',
  'png',
];
export const getUploadFileType = (file) => {
  let index = file.name.lastIndexOf('.');
  let fileType = file.name.substring(index + 1, file.name.length);
  console.log('fileType ext:', fileType);
  //判断文件类型是否符合上传标准
  return fileTypes.includes(fileType.toLowerCase());
};

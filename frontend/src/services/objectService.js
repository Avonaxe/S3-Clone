import api from './api';

export const listFiles = (bucketName) => api.get(`/buckets/${bucketName}/objects`);

export const uploadFile = (bucketName, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/buckets/${bucketName}/objects`, formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
};

export const downloadFile = (bucketName, objectName) =>
  api.get(`/buckets/${bucketName}/objects/${encodeURIComponent(objectName)}`, {
    responseType: 'blob',
  });

export const deleteFile = (bucketName, objectName) =>
  api.delete(`/buckets/${bucketName}/objects/${encodeURIComponent(objectName)}`);

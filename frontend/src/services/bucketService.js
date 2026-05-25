import api from './api';

export const getBuckets = () => api.get('/buckets');

export const createBucket = (bucketName) => api.post('/buckets', { bucketName });

export const deleteBucket = (bucketName) => api.delete(`/buckets/${bucketName}`);

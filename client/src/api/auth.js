import api from './client.js'

export const signup = async (userData) => {
  const res = await api.post('/auth/signup', userData, { withCredentials: true });
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials, { withCredentials: true });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me', { withCredentials: true });
  return res.data;
};
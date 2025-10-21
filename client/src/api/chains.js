import api from '../api/client';

export const getChain = async () => {
    const res = await api.get('/chains')
    return res.data
}

export const getChainById = async (id) =>{
    const res = await api.get(`/chains/${id}`)
    return res.data
}

export const createChain = async (data) => {
  const res = await api.post("/chains", data);
  return res.data;
};

export const updateChain = async (id, data) => {
  const res = await api.put(`/chains/${id}`, data);
  return res.data;
};

export const deleteChain = async (id) => {
  const res = await api.delete(`/chains/${id}`);
  return res.data;
};
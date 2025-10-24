import axios from 'axios'

const api = axios.create({
  baseURL: 'https://prompt-chain-vbr0.onrender.com/api', 
  withCredentials: true,               
});


export default api
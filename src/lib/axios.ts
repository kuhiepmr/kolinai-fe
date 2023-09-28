import axios from 'axios';

const beConfig = {
  token: import.meta.env.VITE_BE_TOKEN,
  url: import.meta.env.VITE_BE_URL,
};

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${beConfig.token}`,
  },
});

axiosInstance.defaults.baseURL = beConfig.url;
export default axiosInstance;

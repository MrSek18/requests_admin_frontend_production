import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
});

// Interceptor para inyectar token dinámicamente
api.interceptors.request.use((config) => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

export default api;

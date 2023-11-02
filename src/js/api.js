import axios from "axios";

const apiUrl = process.env.VUE_APP_API_URL;

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "multipart/form-data;charset=UTF-8",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "token,Content-Type",
  },
});

instance.interceptors.request.use(
  function (config) {
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },

  function (error) {
    return Promise.reject(error);
  }
);

export default instance;

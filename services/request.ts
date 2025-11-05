import axios from "axios";

const request = axios.create({
  baseURL: "/",
  timeout: 15000,
});

request.interceptors.request.use((config) => {
  config.headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(config.headers || {}),
  } as any;
  return config;
});

request.interceptors.response.use(
  (resp) => resp,
  (error) => Promise.reject(error)
);

export default request;


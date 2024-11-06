import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api', // 使用相对路径
  timeout: 5000,
  responseType: 'json' // 默认响应类型
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，例如加入 token
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果是 blob 类型的响应，直接返回响应对象
    if (response.config.responseType === 'blob') {
      return response;
    }
    // 对响应数据做点什么
    const res = response.data;
    if (Number(res.code) !== 1) {
      // 处理错误情况
      console.error("Response error:", res.message);
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    // 对响应错误做点什么
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default service;

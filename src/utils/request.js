/**
 * 基于 axios 封装的请求模块
 */
import axios from "axios";
// import router from '@/router'
import { toLoginPage } from "./common.js";
// 非组件模块可以这样加载使用 element 的 message 提示组件
import { ElMessage } from "element-plus";

const request = axios.create({
    // baseURL: 'http://ttapi.research.itcast.cn/' // 请求的基础路径
    baseURL: "/api/uias",
});

request.interceptors.request.use(
    function (config) {
        if (config.method === "get") {
            config.data = true;
        }
        config.headers = {
            "Content-Type": "application/json;charset=utf-8",
        };
        return config; // 当这里 return config 之后请求在会真正的发出去
    },
    function (error) {
        // 请求失败，会经过这里
        return Promise.reject(error);
    },
);

// 响应拦截器
request.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        const { status } = error.response;
        if (status === 401) {
            ElMessage.error("登录超时，请重新登录，正在跳转");
            toLoginPage();
        } else if (status === 403) {
            // token 无权限访问
            ElMessage.warning({ message: "没有操作权限" });
            return Promise.reject(error.response);
        } else if (status === 400) {
            // 客户端参数错误
            ElMessage.error("参数错误，请检查请求参数");
            return Promise.reject(error.response);
        } else if (status >= 500) {
            ElMessage.error("服务端内部异常，请稍后重试");
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    },
);

// 导出请求方法
export default request;

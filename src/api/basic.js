/*
 * 与后台交互模块 （依赖已封装的ajax函数）
 * 包含n个接口请求函数的模块，函数的返回值是promise对象
 */
import ajax from "./ajax";
/**
 * ajax 有如下4个参数
 * @param {*} url 请求路径，默认为空
 * @param {*} method 请求方法，默认为GET
 * @param {*} params 请求参数，默认为空对象
 * @param {*} data 请求参数，默认为空对象
 */

/** *********************************用户相关**************************************************** */
export const login = (data) => ajax("/v1/user/signin", "POST", null, data);
export const logout = () => ajax("/v1/user/logout", "POST");
export const basicInfo = () => ajax("/v1/uias/user/basicInfo", "GET", null, null);

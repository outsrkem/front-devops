/*
 * 与后台交互模块 （依赖已封装的ajax函数）
 * 包含n个接口请求函数的模块，函数的返回值是promise对象
 */
import ajax from "../api/ajax";
/**
 * ajax 有如下4个参数
 * @param {*} url 请求路径，默认为空
 * @param {*} method 请求方法，默认为GET
 * @param {*} params 请求参数，默认为空对象
 * @param {*} data 请求参数，默认为空对象
 */
/** *********************************用户相关**************************************************** */
/**
 * 用户登录
 */
// export const login = (data) => ajax('/uias/v1/user/signin', 'POST', null, data)
export const logout = () => ajax("/v1/user/logout", "POST");

export const basicInfo = () => ajax("/v1/uias/user/basicInfo", "GET", null, null);

export const getService = () => ajax("/internal/v1/uias/service", "GET", null, null);
// /internal/v1/uias/service
export const CreateService = (data) => ajax(`/internal/v1/uias/service`, "POST", null, data);
// 删除服务
export const DeleteService = (data) => ajax(`/internal/v1/uias/service`, "DELETE", null, data);

export const GetActions = (params, paths) => ajax(`/internal/v1/uias/${paths.sid}/actions`, "GET", params, null);

export const GetPolicies = (params, paths) => ajax(`/internal/v1/uias/${paths.sid}/policy`, "GET", params, null);

// /internal/v1/uias/cd897ee4cf1e41e49f9014a240afda9b/actions
export const CreateAction = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/actions`, "POST", null, data);
// PATCH /internal/v1/uias/cd897ee4cf1e41e49f9014a240afda9b/actions
export const EditAction = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/actions`, "PATCH", null, data);
// DELETE /internal/v1/uias/actions/e94994cb7e2c4d929e516ea593d4154d
export const DeleteAction = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/actions`, "DELETE", null, data);

// POST /internal/v1/uias/:service_id/policy
export const CreatePolicy = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/policy`, "POST", null, data);

// DELETE /internal/v1/uias/policy/aa5094655146465b84072290e7c7c459
export const DeletePolicy = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/policy`, "DELETE", null, data);
export const EditPolicy = (paths, data) => ajax(`/internal/v1/uias/${paths.sid}/policy`, "PATCH", null, data);

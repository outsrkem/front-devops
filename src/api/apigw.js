// apigw.js
import ajax from "../api/ajax";

export const ListApiGroup = (params) => ajax("/api/gw/internal/v1/admin/group", "GET", params);
export const CreateGroup = (data) => ajax("/api/gw/internal/v1/admin/group", "POST", null, data);
export const DeleteGroup = (paths) => ajax(`/api/gw/internal/v1/admin/group/${paths.id}`, "DELETE", null, null);
export const UpdateGroup = (paths, data) => ajax(`/api/gw/internal/v1/admin/group/${paths.id}`, "PATCH", null, data);

export const ListlcCa = () => ajax("/api/gw/internal/v1/admin/lcca", "GET");
export const CreatelcCa = (data) => ajax("/api/gw/internal/v1/admin/lcca", "POST", null, data);
export const DeletelcCa = (id) => ajax(`/api/gw/internal/v1/admin/lcca/${id}`, "DELETE");
export const UpdatelcCa = (id, data) => ajax(`/api/gw/internal/v1/admin/lcca/${id}`, "PATCH", null, data);

export const ListLoadChannel = (params) => ajax("/api/gw/internal/v1/admin/channel", "GET", params);
export const CreateLoadChannel = (data) => ajax("/api/gw/internal/v1/admin/channel", "POST", null, data);
export const DeleteLoadChannel = (id) => ajax(`/api/gw/internal/v1/admin/channel/${id}`, "DELETE");
export const UpdateLoadChannel = (id, data) => ajax(`/api/gw/internal/v1/admin/channel/${id}`, "PATCH", null, data);

export const ListApiInterface = (params) => ajax(`/api/gw/internal/v1/admin/api`, "GET", params);
export const ApiLifecycle = (paths, data) => ajax(`/api/gw/internal/v1/admin/api/${paths.id}/lifecycle`, "PUT", null, data);
export const CreateApiInterface = (gid, data) => ajax(`/api/gw/internal/v1/admin/${gid}/api`, "POST", null, data);
export const DeleteApiInterface = (id) => ajax(`/api/gw/internal/v1/admin/api/${id}`, "DELETE");
export const UpdateApiInterface = (id, data) => ajax(`/api/gw/internal/v1/admin/api/${id}`, "PATCH", null, data);

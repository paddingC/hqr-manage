import axios from '../axios'
/* 医生管理 */
export const doctorsFind = (data) => {
  return axios({
    url: 'doctor/find',
    method: 'post',
    data
  })
}
/* 新增查询人员 */
export const findusers = (data) => {
  return axios({
    url: 'doctor/findusers',
    method: 'post',
    data
  })
}
/* 新增保存 */
export const save = (data) => {
  return axios({
    url: 'doctor/save',
    method: 'post',
    data
  })
}
/* 状态 */
export const EnableDisable = (data) => {
  return axios({
    url: 'doctor/EnableDisable',
    method: 'post',
    data
  })
}
/* 删除 */
export const del = (data) => {
  return axios({
    url: 'doctor/delete',
    method: 'post',
    data
  })
}
/* 编辑保存 */
export const updateinfo = (data) => {
  return axios({
    url: 'doctor/updateinfo',
    method: 'post',
    data
  })
}
/* 删除头像 */
export const removeheadimage = (data) => {
  return axios({
    url: 'doctor/removeheadimage',
    method: 'post',
    data
  })
}

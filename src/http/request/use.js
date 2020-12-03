import axios from '../axios'
/* 常见病管理 */
export const select = (data) => {
  return axios({
    url: 'usageanddosage/select',
    method: 'post',
    data
  })
}
export const save = (data) => {
  return axios({
    url: 'usageanddosage/save',
    method: 'post',
    data
  })
}
export const del = (data) => {
  return axios({
    url: 'usageanddosage/delete',
    method: 'post',
    data
  })
}

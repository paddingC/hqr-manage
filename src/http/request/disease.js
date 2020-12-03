import axios from '../axios'
/* 常见病管理 */
export const select = (data) => {
  return axios({
    url: 'dzsf/diseases/select',
    method: 'post',
    data
  })
}
export const save = (data) => {
  return axios({
    url: 'dzsf/diseases/save',
    method: 'post',
    data
  })
}
export const del = (data) => {
  return axios({
    url: 'dzsf/diseases/delete',
    method: 'post',
    data
  })
}

import axios from '../axios'
/* 常见病管理 */
export const select = (data) => {
  return axios({
    url: 'diseases/select',
    method: 'post',
    data
  })
}
export const save = (data) => {
  return axios({
    url: 'diseases/save',
    method: 'post',
    data
  })
}
export const del = (data) => {
  return axios({
    url: 'diseases/delete',
    method: 'post',
    data
  })
}

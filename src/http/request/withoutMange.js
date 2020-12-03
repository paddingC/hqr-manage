import axios from '../axios'

export const getOtherConfig = (data) => {
  return axios({
    url: 'dzsf/config/getOtherConfig',
    method: 'post',
    data
  })
}
export const saveOtherConfig = (data) => {
  return axios({
    url: 'dzsf/config/saveOtherConfig',
    method: 'post',
    data
  })
}
export const deleteOtherConfig = (data) => {
  return axios({
    url: 'dzsf/config/deleteOtherConfig',
    method: 'post',
    data
  })
}
export const updateOtherConfigStatus = (data) => {
  return axios({
    url: 'dzsf/config/updateOtherConfigStatus',
    method: 'post',
    data
  })
}
export const getDeptByKey = (data) => {
  return axios({
    url: 'dzsf/config/getDeptByKey',
    method: 'post',
    data
  })
}

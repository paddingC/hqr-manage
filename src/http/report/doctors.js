import axios from '../axios'
//执业医师处方汇总查询报表
export const inquiryRegCollect = (data) => {
  return axios({
    url: 'report/inquiryRegCollect',
    method: 'post',
    data
  })
}
export const findByPrescriptionInfo = (data) => {
  return axios({
    url: 'inquiry/findByPrescriptionInfo',
    method: 'post',
    data
  })
}
export const getInquiryDtl = (data) => {
  return axios({
    url: 'inquiry/getInquiryDtl',
    method: 'post',
    data
  })
}
// 问题列表
export const find = (data) => {
  return axios({
    url: 'companyQuestion/find',
    method: 'post',
    data
  })
}
// 新增/修改问题
export const save = (data) => {
  return axios({
    url: 'dzsfpro/companyQuestion/save',
    method: 'post',
    data
  })
}
// 删除问题
export const del = (data) => {
  return axios({
    url: 'dzsfpro/companyQuestion/del',
    method: 'post',
    data
  })
}

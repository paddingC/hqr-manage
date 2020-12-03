import axios from '../axios'
// 充值详情
export const listRechargeRecord = (data) => {
  return axios({
    url: 'dzsfpro/wz580/pay/listRechargeRecord',
    method: 'post',
    data
  })
}
// 社区580问诊单管理
export const listDiagnosis = (data) => {
  return axios({
    url: 'dzsfpro/580wz/listDiagnosis',
    method: 'post',
    data
  })
}
// 存量预警 - 查询
export const findConfig = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/findConfig',
    method: 'post',
    data
  })
}
// 存量预警 - 提醒
export const saveOrUpdateConfig = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/saveOrUpdateConfig',
    method: 'post',
    data
  })
}
// 存量预警 - 列表查询
export const findPerson = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/findPerson',
    method: 'post',
    data
  })
}
// 存量预警 - 修改保存
export const saveOrUpdatePerson = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/saveOrUpdatePerson',
    method: 'post',
    data
  })
}
// 存量预警 - 删除
export const deletePerson = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/deletePerson',
    method: 'post',
    data
  })
}

import axios from '../axios'
/* app */
export const interf = (data) => {
  return axios({
    url: 'auth/mini/authorization/interf',
    method: 'get',
    params: data
  })
}
// 查看授权是否成功
export const checkAuth = (data) => {
  return axios({
    url: 'auth/mini/checkAuth',
    method: 'post',
    data
  })
}
// 绑定者列表
export const testerlist = (data) => {
  return axios({
    url: 'auth/mini/tester/list',
    method: 'post',
    data
  })
}
// 绑定微信号
export const bind = (data) => {
  return axios({
    url: 'auth/mini/tester/bind',
    method: 'post',
    data
  })
}
// 解绑微信号
export const unbind = (data) => {
  return axios({
    url: 'auth/mini/tester/unbind',
    method: 'post',
    data
  })
}
// 版本列表
export const list = (data) => {
  return axios({
    url: 'auth/mini/version/list',
    method: 'post',
    data
  })
}
// 获取二维码
export const testQrCode = (data) => {
  return axios({
    url: 'auth/mini/version/testQrCode?id=' + data.id,
    method: 'post'
  })
}
// 提交审核
export const verify = (data) => {
  return axios({
    url: 'auth/mini/version/verify?id=' + data.id,
    method: 'post'
  })
}
// 提交代码
export const submit = (data) => {
  return axios({
    url: 'auth/mini/version/submit?id=' + data.id,
    method: 'post'
  })
}
// 撤销审核
export const cancelVerify = (data) => {
  return axios({
    url: 'auth/mini/version/cancelVerify?id=' + data.id,
    method: 'post'
  })
}
// 解除授权
export const unAuthorization = (data) => {
  return axios({
    url: 'auth/mini/unAuthorization',
    method: 'post',
    data
  })
}
// 全网发布
export const publish = (data) => {
  return axios({
    url: 'auth/mini/version/publish?id=' + data.id,
    method: 'post'
  })
}
// 订阅消息模板列表
export const msgList = (data) => {
  return axios({
    url: 'auth/mini/subscribeMsg/list',
    method: 'post',
    data
  })
}
export const saveOrUpdate = (data) => {
  return axios({
    url: 'auth/mini/subscribeMsg/saveOrUpdate',
    method: 'post',
    data
  })
}

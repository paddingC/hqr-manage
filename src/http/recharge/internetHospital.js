import axios from '../axios'
// 互联网医院充值
// 查询剩余金额
export const findConfig = (data) => {
  return axios({
    url: 'dzsfpro/580wz/balance/remind/findConfig',
    method: 'post',
    data
  })
}
// 生成预支付订单
export const genOrder = (data) => {
  return axios({
    url: 'dzsfpro/wz580/pay/genOrder',
    method: 'post',
    data
  })
}
// 生成支付二维码订单
export const genPayQrCode = (data) => {
  return axios({
    url: 'dzsfpro/wz580/pay/genPayQrCode?companyId=' + data.companyId + '&width=' + data.width + '&height=' + data.height +
    '&payWay=' + data.payWay + '&orderId=' + data.orderId,
    method: 'post'
  })
}

export const getOrderStatus = (data) => {
  return axios({
    url: 'dzsfpro/wz580/pay/getOrderStatus',
    method: 'post',
    data
  })
}

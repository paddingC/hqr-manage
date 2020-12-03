import axios from '../axios'
// 执行药师处方汇总查询报表
export const phaPrescritpionCollect = (data) => {
  return axios({
    url: 'dzsf/report/phaPrescritpionCollect',
    method: 'post',
    data
  })
}
/* 执业药师用药咨询汇总查询报表 */
export const phainstructionCollect = (data) => {
  return axios({
    url: 'dzsf/report/phainstructionCollect',
    method: 'post',
    data
  })
}
// 执业药师考勤报表
export const getPharmacistSignRecord = (data) => {
  return axios({
    url: 'dzsf/report/getPharmacistSignRecord',
    method: 'post',
    data
  })
}
// 执业药师审方明细汇总
export const pointPrescriptionCollectInfo = (data) => {
  return axios({
    url: 'dzsf/report/pointPrescriptionCollectInfo',
    method: 'post',
    data
  })
}

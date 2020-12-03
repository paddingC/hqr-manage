import axios from '../axios'
/* 门店处方汇总查询 */
export const pointPrescritpionCollect = (data) => {
  return axios({
    url: 'dzsf/report/pointPrescritpionCollect',
    method: 'post',
    data
  })
}

/* 门店用药咨询明细汇总参训 */
export const pointinstructionCollect = (data) => {
  return axios({
    url: 'dzsf/report/pointinstructionCollect',
    method: 'post',
    data
  })
}

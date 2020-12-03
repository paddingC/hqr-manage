import axios from '../axios'
/* 主推列表查询 */
export const getPopularize = (data) => {
  return axios({
    url: 'goodsPopularize/queryByCompanyid',
    method: 'post',
    data
  })
}

/* 新增/修改 主推 */
export const createPopularize = (data) => {
  return axios({
    url: 'goodsPopularize/save',
    method: 'post',
    data
  })
}
/* 删除主推 */
export const deletePopularize = (data) => {
  return axios({
    url: 'goodsPopularize/deleteByID',
    method: 'post',
    data
  })
}

/* 导入移除货品 */
export const setGoods = (data) => {
  return axios({
    url: 'goodsPopularize/setGoods',
    method: 'post',
    data
  })
}

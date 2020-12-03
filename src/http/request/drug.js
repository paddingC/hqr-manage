import axios from '../axios'
/*
* 查询货品接口
*/
export const goodsFind = (data) => {
  return axios({
    url: 'goods/find',
    method: 'post',
    data
  })
}
/*
* 查询货品接口
*/
export const goodsSave = (data) => {
  return axios({
    url: 'goods/save',
    method: 'post',
    data
  })
}

export const up580 = (data) => {
  return axios({
    url: 'dzsfpro/580wz/drug/sync',
    method: 'post',
    data
  })
}
/*
* 货品批量修改状态接口
*/
export const EnableDisable = (data) => {
  return axios({
    url: 'goods/EnableDisable',
    method: 'post',
    data
  })
}
/*
* 导入货品接口
*/
export const goodsImport = (data) => {
  return axios({
    url: 'goods/import',
    method: 'post',
    data
  })
}
/*
* 导入货品接口
*/
export const goodsDelete = (data) => {
  return axios({
    url: 'goods/delete',
    method: 'post',
    data
  })
}
/* 价格记录 */
export const getPriceReg = (data) => {
  return axios({
    url: 'goods/getPriceReg',
    method: 'post',
    data
  })
}
/* 商品对码维护列表 */
export const codeList = (data) => {
  return axios({
    url: 'dzsfpro/zxCY/list',
    method: 'post',
    data
  })
}
/* 新增编辑 */
export const saveOrUpdate = (data) => {
  return axios({
    url: 'dzsfpro/zxCY/saveOrUpdate',
    method: 'post',
    data
  })
}
/* 删除 */
export const codedelete = (data) => {
  return axios({
    url: 'dzsfpro/zxCY/delete',
    method: 'post',
    data
  })
}
export const importExcel = (data) => {
  return axios({
    url: 'dzsfpro/zxCY/importExcel',
    method: 'post',
    data
  })
}
export const example = (params) => {
  return axios({
    url: 'dzsfpro/zxCY/example',
    method: 'get',
    params
  })
}

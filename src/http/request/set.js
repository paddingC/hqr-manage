import axios from '../axios'
// 系统配置
/* 查询 */
export const getconfig = (data) => {
  return axios({
    url: 'config/getconfig',
    method: 'post',
    data
  })
}

/* 保存 */
export const saveconfig = (data) => {
  return axios({
    url: 'config/save',
    method: 'post',
    data
  })
}

/* 删除LOGO */
export const removelogo = (data) => {
  return axios({
    url: 'config/removelogo',
    method: 'post',
    data
  })
}
export const removeSeal = (data) => {
  return axios({
    url: 'config/removeSeal',
    method: 'post',
    data
  })
}
/* 用户移动页面查询 */
export const selectMobileConfig = (data) => {
  return axios({
    url: 'config/selectMobileConfig',
    method: 'post',
    data
  })
}
// 字典值
export const batchGetDictList = (data) => {
  return axios({
    url: 'dictionary/batchGetDictList',
    method: 'post',
    data
  })
}

import axios from '../axios'
/* 库存管理 */
export const getInventory = (data) => {
  return axios({
    url: 'dzsf/inventory/getInventory',
    method: 'post',
    data
  })
}
export const getReg = (data) => {
  return axios({
    url: 'dzsf/inventory/getReg',
    method: 'post',
    data
  })
}

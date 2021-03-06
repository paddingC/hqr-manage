import axios from '../axios'
// 电子处方查询
/* 查询处方总单 */
/* export const finddoc = (data) => {
  return axios({
    url: 'prescription/finddoc',
    method: 'post',
    data
  })
} */
export const finddoc = (data) => {
  return axios({
    url: 'prescription/sxfinddoc',
    method: 'post',
    data
  })
}
/* 查询处方细单 */
export const finddtl = (data) => {
  return axios({
    url: 'prescription/finddtl',
    method: 'post',
    data
  })
}
export const gethismessage = (data) => {
  return axios({
    url: 'message/gethismessage',
    method: 'post',
    data
  })
}
// 开方查询
/**/
export const findDocs = (data) => {
  return axios({
    url: 'prescribing/findDocs',
    method: 'post',
    data
  })
}
export const findDtls = (data) => {
  return axios({
    url: 'prescribing/findDtls',
    method: 'post',
    data
  })
}

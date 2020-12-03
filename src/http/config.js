import { baseUrl } from '@/utils/global'

console.log('-baseUrl')
console.log(baseUrl)
export default {
  method: 'get',
  // 基础url前缀
  baseUrl: baseUrl,
  // 请求头信息
  headers: {
  // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    'Content-Type': 'application/json;charset=UTF-8'
  },
  // 参数
  data: {},
  // 设置超时时间
  timeout: 30000,
  // 携带凭证
  withCredentials: true,
  // 返回数据类型
  responseType: 'json'
}
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import '@/assets/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import echarts from 'echarts'
import {
  Table,
  TableColumn,
  Editable,
  EditableColumn
} from 'vue-element-extends'
import 'vue-element-extends/lib/index.css'
Vue.prototype.$echarts = echarts

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Editable)
Vue.use(EditableColumn)
Vue.use(ElementUI)
Vue.use(api)
Vue.prototype.global = global
Vue.config.productionTip = false

var params = (function () {
  var search = location.search
  var params = {}
  if (search !== '') {
    search.slice(1).split('&').forEach(
      function (val) {
        var arr = val.split('=')
        params[arr[0]] = arr[1]
      }
    )
  }
  return params // 返回params
})()
console.dir(params)
if (process.env.NODE_ENV === 'development') {
  sessionStorage.setItem('companyid', 'ee842b218438418bace33c148727eefa')
  sessionStorage.setItem('companyname', '测试')
  sessionStorage.setItem('loginid', 'dzsf')
} else if (process.env.NODE_ENV === 'production') {
  sessionStorage.setItem('companyid', params.companyid)
  sessionStorage.setItem('companyname', params.companyname)
  sessionStorage.setItem('loginid', params.loginid)
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

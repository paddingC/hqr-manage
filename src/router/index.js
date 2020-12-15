import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

const set = () => import(/* webpackChunkName: "set" */ '@/view/set')
const recipe = () => import(/* webpackChunkName: "recipe" */ '@/view//recipe')
const pharmacist = () => import(/* webpackChunkName: "pharmacist" */ '@/view/pharmacist')
const pharmacistSign = () => import('@/view/pharmacistSign')
const drugAdministration = () => import(/* webpackChunkName: "drugAdministration" */ '@/view/drugAdministration')
const doctorManagement = () => import('@/view/doctorManagement')
const diseaseManagement = () => import('@/view/diseaseManagement')
const useManagement = () => import('@/view/useManagement')
const withoutManage = () => import('@/view/withoutManage')
const drugMaintain = () => import('@/view/drugMaintain')
const repertoryManage = () => import('@/view/repertoryManage')
const goodsCode = () => import('@/view/goodsCode')
/* 报表 */
const storeSummary = () => import('@/view/report/storeSummary')
const storeDetail = () => import('@/view/report/storeDetail')
const storeUsedrug = () => import('@/view/report/storeUsedrug')
const pharmacistSummary = () => import('@/view/report/pharmacistSummary')
const pharmacistUsedrug = () => import('@/view/report/pharmacistUsedrug')
const pharmacistDetail = () => import('@/view/report/pharmacistDetail')
const pharmacistNotpass = () => import('@/view/report/pharmacistNotpass')
const pharmacistCheckwork = () => import('@/view/report/pharmacistCheckwork')
const doctorSummary = () => import('@/view/report/doctorSummary')
const doctorCheckwork = () => import('@/view/report/doctorCheckwork')
const doctorDetail = () => import('@/view/report/doctorDetail')
const doctorNotpass = () => import('@/view/report/doctorNotpass')
/* 小程序 */
const appManage = () => import('@/view/applet/appManage')
const appbinder = () => import('@/view/applet/appbinder')
const appmsgManage = () => import('@/view/applet/appmsgManage')
const appdoorManage = () => import('@/view/applet/appdoorManage')
const appdoorbinder = () => import('@/view/applet/appdoorbinder')
const appdoormsgManage = () => import('@/view/applet/appdoormsgManage')
/* 充值 */
const internetHospitalRecharge = () => import('@/view/recharge/internetHospitalRecharge')
const communityInquirySheetManage = () => import('@/view/recharge/communityInquirySheetManage')
const stockEarlyWarning = () => import('@/view/recharge/stockEarlyWarning')
const rechargeDetails = () => import('@/view/recharge/rechargeDetails')
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: "/page/",
  routes: [
    {
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/pharmacist',
      name: '执业药师管理',
      component: pharmacist
    }, {
      path: '/pharmacistSign',
      name: '执业药师签到记录',
      component: pharmacistSign
    }, {
      path: '/drugAdministration',
      name: '药品管理',
      component: drugAdministration
    }, {
      path: '/recipe',
      name: '电子处方查询',
      component: recipe
    }, {
      path: '/set',
      name: '系统配置',
      component: set
    }, {
      path: '/doctorManagement',
      name: '医生管理',
      component: doctorManagement
    }, {
      path: '/diseaseManagement',
      name: '常见病管理',
      component: diseaseManagement
    }, {
      path: '/useManagement',
      name: '用法用量模板管理',
      component: useManagement
    }, {
      path: '/withoutManage',
      name: '外部系统管理',
      component: withoutManage
    }, {
      path: '/storeSummary',
      name: '门店处方汇总',
      component: storeSummary
    }, {
      path: '/storeDetail',
      name: '门店处方明细',
      component: storeDetail
    }, {
      path: '/storeUsedrug',
      name: '门店用药咨询明细汇总',
      component: storeUsedrug
    }, {
      path: '/pharmacistSummary',
      name: '执业药师处方汇总',
      component: pharmacistSummary
    }, {
      path: '/pharmacistUsedrug',
      name: '执业药师用药咨询汇总',
      component: pharmacistUsedrug
    }, {
      path: '/pharmacistDetail',
      name: '执业药师审方明细汇总',
      component: pharmacistDetail
    }, {
      path: '/pharmacistNotpass',
      name: '执业药师审核未通过处方明细',
      component: pharmacistNotpass
    }, {
      path: '/pharmacistCheckwork',
      name: '执业药师考勤报表',
      component: pharmacistCheckwork
    }, {
      path: '/doctorSummary',
      name: '执业医师处方汇总',
      component: doctorSummary
    }, {
      path: '/doctorDetail',
      name: '执业医师所开处方明细',
      component: doctorDetail
    }, {
      path: '/doctorCheckwork',
      name: '执业医师在岗状态',
      component: doctorCheckwork
    }, {
      path: '/doctorNotpass',
      name: '执业医师审核未通过处方明细',
      component: doctorNotpass
    }, {
      path: '/drugMaintain',
      name: '主推药品维护',
      component: drugMaintain
    }, {
      path: '/repertoryManage',
      name: '库存管理',
      component: repertoryManage
    }, {
      path: '/appManage',
      name: '医生端小程序管理',
      component: appManage
    }, {
      path: '/appbinder',
      name: '医生端体验绑定者',
      component: appbinder
    }, {
      path: '/appmsgManage',
      name: '医生端订阅消息管理',
      component: appmsgManage
    }, {
      path: '/appdoorManage',
      name: '门店端小程序管理',
      component: appdoorManage
    }, {
      path: '/appdoorbinder',
      name: '门店端体验绑定者',
      component: appdoorbinder
    }, {
      path: '/appdoormsgManage',
      name: '门店端订阅消息管理',
      component: appdoormsgManage
    }, {
      path: '/goodsCode',
      name: '商品对码维护',
      component: goodsCode
    }, {
      path: '/recharge/internetHospitalRecharge',
      name: '互联网医院充值',
      component: internetHospitalRecharge
    }, {
      path: '/recharge/communityInquirySheetManage',
      name: '社区580问诊单管理',
      component: communityInquirySheetManage
    }, {
      path: '/recharge/stockEarlyWarning',
      name: '存量预警',
      component: stockEarlyWarning
    }, {
      path: '/recharge/rechargeDetails',
      name: '充值详情',
      component: rechargeDetails
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.name) {
    document.title = to.name
  }
  next()
})
export default router

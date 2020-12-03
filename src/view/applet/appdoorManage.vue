<template>
  <div class="appconfig_main" v-if="isTrue">
    <div class="appconfig_main_left">
      <div class="msgImg">
        <img src="@/assets/img1.png" alt="">
      </div>
      <el-button @click='interf' class="msgBtn">已有小程序，立即绑定</el-button>
      <p class="msgText">为保证系统正常使用，<br />请把所有权限授权给英克</p>
    </div>
    <div class="appconfig_main_right">
      <div class="msgImg">
        <img src="@/assets/img2.png" alt="">
      </div>
      <el-button @click='linkurl' class="msgBtn">没有小程序，立即申请</el-button>
      <p class="msgText">请申请小程序后，再绑定英克</p>
    </div>
  </div>
  <div class="appmanage_main" v-else>
    <h3 class="appmanage_h3">版本管理</h3>
    <div v-if="isAuth">
      <!--最新版本-->
      <div v-if="issubmit" class="appmanage_box_history" style="position: relative">
        <p class="history_p history_p_1890FF">最新版本</p>
        <div class="history_main">
          <div class="history_main_l">
            <p class="history_main_l_p666">版本号</p>
            <p class="history_main_l_p333">{{submit.versionNum}}</p>
          </div>
          <div class="history_main_c" style="position: relative">
            <div class="history_main_c_tit">
              <p>提交日期</p>
              <p>描述</p>
            </div>
            <div class="history_main_c_con">
              <p>
                {{submit.createTime}}
              </p>
              <p>
                {{submit.versionDesc}}
              </p>
            </div>
          </div>
          <div class="history_main_r_two">
            <el-button class="history_main_r_btn" @click="appverify(submit.id)">提交审核</el-button>
            <el-button class="history_main_r_btn history_main_r_btn_fff" @click="testQrCode(submit.id)">体验二维码</el-button>
          </div>
        </div>
        <div class="history_main" v-if="noList">
          <div class="history_main_l">&nbsp;</div>
          <div class="history_main_c" style="font-size:14px; color:rgba(153,153,153,1)">
            您暂无提交审核的版本，或提交的版本已发布上线
          </div>
        </div>
      </div>
      <!--审核版本-->
      <div v-if="isverify" class="appmanage_box_history">
        <p class="history_p history_p_yellow">审核版本</p>
        <div class="history_main" v-if="verify">
          <div class="history_main_l">
            <p class="history_main_l_p666">版本号</p>
            <p class="history_main_l_p333">{{verify.versionNum}}</p>
          </div>
          <div class="history_main_c">
            <div class="history_main_c_tit">
              <p>提交日期</p>
              <p>描述</p>
              <p v-if="verify.verifyStatus == 3" class="history_main_l_pred">审核不通过</p>
            </div>
            <div class="history_main_c_con">
              <p>
                {{verify.verifyTime}}
              </p>
              <p>
                {{verify.versionDesc}}
              </p>
            </div>
            <p v-if="verify.verifyStatus == 3" class="history_main_l_pred">{{verify.verifyRefuseReason}}</p>
          </div>
          <div class="history_main_r">
            <el-popconfirm v-if="verify.verifyStatus == 1 && verify.versionType==2"
                           title="撤回次数限制 每天最多一次，每月最多十次。是否撤销当前版本。"
                           icon="el-icon-warning"
                           iconColor="#FAAD14"
                           confirmButtonText="确定"
                           cancelButtonText="取消"
                           @onConfirm="popSure(verify.id)">
              <i class="confirm_err" slot="reference">撤销审核</i>
            </el-popconfirm>
            <el-button @click="publishEvent(verify.id)" v-if="verify.verifyStatus == 2 && verify.versionType == 2" class="history_main_r_btn">全网发布</el-button>
            <el-button @click="appverify(verify.id)" v-if="verify.versionType == 1" class="history_main_r_btn" >提交审核</el-button>
          </div>
        </div>
        <div class="history_main" v-else>
          <div class="history_main_l">&nbsp;</div>
          <div class="history_main_c" style="font-size:14px; color:rgba(153,153,153,1)">
            您暂无提交审核的版本，或提交的版本已发布上线
          </div>
          <div class="history_main_r">
            <el-popconfirm
                           title="是否撤销当前版本的审核？"
                           icon="el-icon-warning"
                           iconColor="#FAAD14"
                           confirmButtonText="确定"
                           cancelButtonText="取消"
                           @onConfirm="popSure(verify.id)">
              <i class="confirm_err" slot="reference">撤销审核</i>
            </el-popconfirm>
          </div>
        </div>
      </div>
      <!--我的版本-->
      <div v-if="ispublish" class="appmanage_box_history">
        <p class="history_p history_p_green">我的版本</p>
        <div class="history_main">
          <div class="history_main_l">
            <p class="history_main_l_p666">版本号</p>
            <p class="history_main_l_p333">{{publish.versionNum}}</p>
          </div>
          <div class="history_main_c">
            <div class="history_main_c_tit">
              <p>提交日期</p>
              <p>描述</p>
            </div>
            <div class="history_main_c_con">
              <p>
                {{publish.publishTime}}
              </p>
              <p>
                {{publish.versionDesc}}
              </p>
            </div>
          </div>
          <div class="history_main_r"></div>
        </div>
      </div>
      <!--历史版本-->
      <div v-if="historyList.length>0" class="appmanage_box_history" style="position: relative">
        <p class="history_p history_p_blue">历史版本</p>
        <div v-for="(item, index) in historyList" :key="index" v-if="index<3" class="history_main history_main_item">
          <div class="history_main_l">
            <p class="history_main_l_p666">版本号</p>
            <p class="history_main_l_p333">{{item.versionNum}}</p>
          </div>
          <div class="history_main_c">
            <div class="history_main_c_tit">
              <p>提交日期</p>
              <p>描述</p>
            </div>
            <div class="history_main_c_con">
              <p>
                {{item.createTime}}
              </p>
              <p>
                {{item.versionDesc}}
              </p>
            </div>
          </div>
          <div class="history_main_r">
            <el-button class="history_main_r_btn" @click="reconfig(item, index)">提交代码</el-button>
          </div>
        </div>
      </div>
      <!--    <div style="float: right; margin-right: 88px; margin-bottom: 20px">-->
      <!--      <el-button @click="unAuthorization" class="history_main_r_btn history_main_r_btn_err">解除授权</el-button>-->
      <!--    </div>-->
      <!--二维码-->
      <div class="codeer" v-show="iscodeimg">
        <img :src="codeimg">
        <div class="Triangle"></div>
      </div>
    </div>
    <div v-else style="height: calc(100vh - 122px);width: 100%;text-align: center;font-size: 24px;color: #999">
      尚未授权成功,请授权成功后在查看版本管理
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isTrue: true,
      companyid: sessionStorage.getItem('companyid'),
      submit: {},
      verify: {},
      publish: {},
      historyList: [],
      noList: false,
      codeimg: '',
      iscodeimg: false,
      isAuth: false,
      issubmit: true,
      isverify: true,
      ispublish: true
    }
  },
  mounted () {
    this.checkAuth()
  },
  methods: {
    interf () {
      this.$confirm('请在新的窗口中完成授权。', '请注意', {
        confirmButtonText: '授权成功',
        cancelButtonText: '授权失败',
        type: 'warning'
      }).then(() => {
        this.checkAuth()
      }).catch((cancel) => {

      })
      window.open('http://yunservice.inca.com.cn/auth/mini/authorization/interf?companyId=' + this.companyid + '&type=3&prodType=1')
    },
    linkurl () {
      window.open('https://mp.weixin.qq.com/')
    },
    checkAuth () {
      // type 1:订阅号,2:服务号,3:小程序
      this.$api.apphttp.checkAuth({
        companyId: this.companyid,
        prodType: 1,
        type: 3
      }).then(res => {
        if (res.status === 200) {
          if (res.data) {
            this.isTrue = false
            this.isAuth = true
            this.getlist()
          } else {
            this.isTrue = true
          }
          // this.$message.success('授权成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getlist () {
      this.$api.apphttp.list({
        companyId: this.companyid,
        prodType: 1,
        type: 3
      }).then(res => {
        if (res.status === 200) {
          if (res.data.submit != null) {
            this.issubmit = true
            this.submit = res.data.submit
          } else {
            this.issubmit = false
          }
          if (res.data.verify != null) {
            this.isverify = true
            this.verify = res.data.verify
          } else {
            this.isverify = false
          }
          if (res.data.publish != null) {
            this.ispublish = true
            this.publish = res.data.publish
          } else {
            this.ispublish = false
          }
          this.historyList = res.data.history
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 体验二维码
    testQrCode (id) {
      if (this.iscodeimg) {
        this.iscodeimg = false
        return false
      }
      this.$api.apphttp.testQrCode({
        id: id
      }).then(res => {
        if (res.status === 200) {
          this.iscodeimg = true
          this.codeimg = 'data:image/jpeg;base64,' + res.data
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 撤销审核
    popSure (id) {
      this.$api.apphttp.cancelVerify({
        id: id
      }).then(res => {
        if (res.status === 200) {
          this.getlist()
          this.$message.success('撤销审核成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 提交审核
    appverify (id) {
      this.$api.apphttp.verify({
        id: id
      }).then(res => {
        if (res.status === 200) {
          this.getlist()
          this.$message.success('提交审核成功')
        } else {
          this.$confirm('正在审核的版本只能有一个，请撤销审核后再提交', '通知信息标题', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
          }).catch(() => {
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    publishEvent (id) {
      this.$api.apphttp.publish({
        id: id
      }).then(res => {
        if (res.status === 200) {
          this.getlist()
          this.$message.success('全网发布成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 提交代码
    reconfig (item, idx) {
      this.$api.apphttp.submit({
        id: item.id
      }).then(res => {
        if (res.status === 200) {
          this.getlist()
          this.$message.success('提交代码成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 解除授权
    unAuthorization () {
      this.$api.apphttp.unAuthorization({
        companyId: this.companyid,
        prodType: 1,
        type: 3
      }).then(res => {
        if (res.status === 200) {

        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style scoped>
/deep/ .el-button--small, .el-button--small.is-round{
  color: #FFF;
  background-color: #409EFF;
  border-color: #409EFF;
}
.appconfig_main{
  width: 100%;
  height: calc(100vh - 20px);
  background: #f5f5f5;
}
.appconfig_main_left{
  width:682px;
  height:638px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  margin: 36px;
  float: left;
  text-align: center;
}
.msgImg{
  text-align: center;
  margin-top: 154px;
}
.msgImg img{
  width: 110px;
  height: 110px;
  vertical-align: middle;
}
.msgBtn{
  color: #fff;
  width:256px;
  height:44px;
  background:rgba(24,144,255,1);
  border-radius:2px;
  border:1px solid rgba(237,237,237,1);
  margin-top: 32px;
  margin-bottom: 27px;
}
.msgText{
  height:44px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  line-height:22px;
}
.appconfig_main_right{
  width:682px;
  height:638px;
  margin: 36px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  float: left;
  text-align: center;
}
.appmanage_main{
  width: 100%;
  /*height: calc(100vh - 20px);*/
  background: #f5f5f5;
  overflow: auto;
  position: relative;
}
.codeer{
  width: 106px;
  height: 106px;
  border-radius: 2px;
  position: absolute;
  right: 92px;
  top: 280px;
  z-index: 99;
  background:rgba(255,255,255,1);
  box-shadow:0px 9px 28px 8px rgba(0,0,0,0.05),0px 6px 16px 0px rgba(0,0,0,0.08),0px 3px 6px -4px rgba(0,0,0,0.12);
}
.Triangle:after{
  content:"";
  position:absolute;
  top:0;
  left:70%;
  border:6px solid transparent;
  border-style: solid;
  border-color: transparent transparent #fff;
  margin: -12px auto;
}
.codeer img{
  margin: 4px;
  width: 98px;
  height: 98px;
  border-radius: 2px;
  vertical-align: middle;
}
.appmanage_h3{
  padding: 24px;
  font-size:18px;
  font-family:PingFangSC-Medium,PingFang SC;
  color:rgba(51,51,51,1);
  line-height:18px;
}
.appmanage_box_history{
  margin: 12px;
  width: calc(100% - 48px);
  overflow: auto;
  padding-top: 32px;
  padding-bottom: 32px;
  background: #fff;
}
.history_p{
  width: calc(100% - 44px);
  height: 16px;
  line-height: 16px;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(66,119,189,1);
  margin-left: 44px;
}
.history_p_yellow{
  color:rgba(255,165,61,1);
}
.history_p_green{
  color:rgba(14,210,105,1);
}
.history_p_blue{
  color:rgba(66,119,189,1);
}
.history_p_1890FF{
  color: #1890FF;
}
.history_main{
  overflow: auto;
  margin-left: 44px;
  margin-right: 44px;
}
.backtop{
  position: absolute;
  left: 45%;
  bootom: 0px;
}
.back_color{
  display: inline-block;
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 32px;
  background: #2b2b2b;
}
.back_color i{
  color: #fff;
}
.history_main_item{
  border-bottom: solid 1px #EDEDED;
}
.history_main_item:last-child{
  border-bottom: none;
}
.history_main_l{
  float: left;
  width: 148px;
}
.history_main_l_p666{
  color: #666;
  font-size: 14px;
}
.history_main_l_p333{
  color: #333;
  font-size: 24px;
}
.history_main_l_pred{
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,80,79,1);
}
.history_main_l_pred{
  height: 22px;
  line-height: 44px;
}
.history_main_c{
  float: left;
  width: calc(100% - 148px - 176px);
}
.history_main_c_tit{
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  line-height: 24px;
  float: left;
  width: 120px;
}
.history_main_c_tit p:nth-child(2){
  height: 44px;
}
.history_main_c_con{
  width: calc(100% - 120px);
  float: left;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  line-height: 22px;
}
.history_main_c_con p:nth-child(2){
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.history_main_r{
  float: right;
  width: 176px;
  line-height: 120px;
}
.history_main_r_two{
  float: right;
  width: 176px;
  height: 120px;
}
.history_main_r_btn{
  margin-left: 56px;
  width: 106px;
  background:rgba(24,144,255,1);
  border-radius:2px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(255,255,255,1);
  height: 32px;
  line-height: 0px;
}
.history_main_r_btn_fff{
  background: #fff;
  border-radius:2px;
  width: 106px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(24,144,255,1);
  border:1px solid rgba(113,191,253,1);
  margin-top: 12px;
}
.history_main_r_btn_err{
  border-radius:2px;
  border:1px solid rgba(255,80,79,1);
  background: #fff;
  font-size:14px;
  color:rgba(255,80,79,1);
}
.confirm_err{
  border: solid 1px #f00;
  margin-left: 56px;
  display: inline-block;
  width: 98px;
  text-align: center;
  height: 30px;
  font-style: normal;
  line-height: 30px;
  border-radius:2px;
  font-size:14px;
  color: #ff0000;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  cursor: pointer;
}
</style>

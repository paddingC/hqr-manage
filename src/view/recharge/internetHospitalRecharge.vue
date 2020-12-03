<template>
  <div>
    <div v-if="active===1">
      <el-card style="color: #999">
        对公账户：
        <br />
        名称：北京英克信息科技有限公司
        <br />
        开户行：中国建设银行股份有限公司北京中关村分行
        <br />
        账号：11050163360000000709
        <br />
        付款时请备注用途：如互联网医院处方购买款项
      </el-card>
      <p>剩余金额&nbsp;<el-input readonly v-model="money" style="width: 226px"></el-input>&nbsp;元</p>
    </div>
    <div class="steps-content">
      <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
        <el-step title="充值金额"></el-step>
        <el-step title="支付"></el-step>
        <el-step title="支付成功"></el-step>
      </el-steps>
    </div>
    <div class="content-box">
      <div v-show="active===1" class="item1">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="入驻企业名称" :required="true">
            <el-input disabled v-model="ruleForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="充值金额" prop="payAmount">
            <el-input v-model="ruleForm.payAmount" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-show="active===1" class="item2">
        <div class="table-tit">费用说明</div>
        <div class="table-con">
          <p>图文问诊</p>
          <p>0.7元/条</p>
        </div>
        <div class="table-con">
          <p>视频问诊</p>
          <p>1.1元/条</p>
        </div>
      </div>
      <div v-show="active===2" class="active2">
        <div v-loading="loading">
          <h3 class="header-title">订单已经提交,请尽快支付</h3>
          <h3>
            订单号:
            <span class="color-warn">{{order1.orderNo}}</span> 您需支付:
            <span class="color-warn">{{order1.payAmount}}</span> 元
          </h3>
          <div class="box">
            <el-row>
              <el-col :span="12">
                <div style="height: 40px" class="grid-content bg-purple">
                  <el-button style="width: 100%;height: 100%" @click="getPictor(1)" type="primary">支付宝支付</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="height: 40px" class="grid-content bg-purple-light">
                  <el-button style="width: 100%;height: 100%" @click="getPictor(2)" type="success">微信支付</el-button>
                </div>
              </el-col>
            </el-row>
            <div class="barq">
              <p class="type">{{payType}}</p>
              <el-image :src="order1.qrCodeBase64Data" :fit="fit">
                <div slot="placeholder" class="image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
            </div>
          </div>
          <div style="width: 100%;text-align: center;padding-top: 20px">
            <el-button type="primary" @click="downL('ruleForm')">上一步</el-button>
          </div>
        </div>
      </div>
      <div v-show="active===3" class="active3">
        <p>
          <i style="font-size: 100px;color: #67C23A" class="el-icon-circle-check">
            <br />
            <span style="font-size: 20px">支付成功</span>
          </i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'internetHospitalRecharge',
  data () {
    return {
      companyId: sessionStorage.getItem('companyid'),
      companyname: sessionStorage.getItem('companyname'),
      money: '',
      active: 1,
      ruleForm: {
        companyName: '',
        payAmount: ''
      },
      rules: {
        payAmount: [
          {required: true, message: '请输入充值金额', trigger: 'blur'}
        ]
      },
      tableData: [],
      loading: false,
      order1: {
        orderNo: '',
        payAmount: '',
        qrCodeBase64Data: ''
      },
      payType: '',
      timer: null,
      fit: 'fill'
    }
  },
  mounted () {
    this.getfindConfig()
    let getname = sessionStorage.getItem('companyname')
    let name = decodeURI(getname)
    this.ruleForm.companyName = name
  },
  methods: {
    getfindConfig () {
      this.$api.internetHospital.findConfig({
        companyId: this.companyId
      }).then(res => {
        if (res.status === 200) {
          this.money = res.data.balance
        }
      })
    },
    submitForm (formName) {
      let Two = ''
      console.log(this.ruleForm.payAmount)
      if (this.ruleForm.payAmount.includes('.')) {
        Two = parseFloat(this.ruleForm.payAmount).toFixed(2)
      } else {
        Two = this.ruleForm.payAmount
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.active !== 3) {
            this.active++
            this.active === 2 ? this.rechargeOrder(Two) : ''
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    rechargeOrder (data) {
      this.payType = '支付宝码'
      this.$api.internetHospital.genOrder({
        companyId: this.companyId,
        data: {
          companyId: this.companyId,
          rechargeCompanyName: this.companyname,
          payWay: 1,
          payMoney: Number(data),
          payAmount: Number(data),
          orderAmount: Number(data)
        }
      }).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.order1 = res.data
          this.payType = '支付宝码'
          this.setTime(this.order1.orderNo)
        } else {
          this.$message.error(res.msg)
          clearInterval(this.timer)
        }
      }).catch(err => {
        clearInterval(this.timer)
        this.loading = false
        console.log(err)
      })
    },
    setTime (val) {
      // if (this.timer != null) {
        this.timer = setInterval(() => {
          this.payResult(val)
        }, 2000)
      // }
    },
    payResult (orderNo) {
      this.$api.internetHospital.getOrderStatus({
        companyId: this.companyId,
        data: orderNo
      }).then(res => {
        if (res.status === 200) {
          if (res.data !== null && res.data.orderStatus === 4) {
            clearInterval(this.timer)
            this.active = 3
          }
        }
      }).catch(err => {
        console.log(err)
        clearInterval(this.timer)
      })
    },
    getPictor (type) {
      if (type === 1) {
        this.payType = '支付宝码'
      } else {
        this.payType = '微信码'
      }
      this.loading = true
      this.$api.internetHospital.genPayQrCode({
        companyId: this.companyId,
        width: 380,
        height: 380,
        payWay: type,
        orderId: this.order1.orderId
      }).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.order1 = res.data
          this.setTime(this.order1.orderNo)
        } else {
          clearInterval(this.timer)
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
        clearInterval(this.timer)
      })
    },
    downL () {
      if (this.active !== 0) {
        this.active--
        clearInterval(this.timer)
      }
    }
  }
}
</script>

<style scoped>
.steps-content{
  margin-bottom: 24px;
}
.content-box {
  flex: 1;
  display: flex;
  justify-content: center;
}
.item1 {
  flex: 1;
  padding: 30px;
}

.item2 {
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px 30px 30px 0;
  width: 600px;
  height: 600px;
}
.table-tit{
  width: calc(100% - 2px);
  line-height: 38px;
  text-align: center;
  background: #fff;
  color: #666;
  border:solid 1px #efefef;
}
.table-con{
  width: 100%;
  text-align: center;
  background: #fff;
  color: #666;
  display: flex;
}
.table-con p{
  flex: 1;
  margin: 0;
  height: 38px;
  line-height: 38px;
  float: left;
  border: solid 1px #eee;
}
.table-con p{
  border-top: none;
}
.active2 {
  box-sizing: border-box;
  width: 100%;
  padding: 30px;
  overflow: hidden;
}
.header-title {
  color: #f5a623;
  padding-bottom: 30px;
}

.color-warn {
  color: #f5a623;
}

.box {
  margin-top: 10px;
  width: 100%;
  height: 600px;
  overflow: hidden;
}
.barq {
  height: calc(600px - 40px);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.barq img {
  height: 100%;
  width: 100%;
}
h3{
  margin: 0;
  font-weight: normal;
}
.active3 {
  height: 500px;
  width: 500px;
  margin: 0 auto;
  text-align: center;
  line-height: 500px;
}
>>> .el-steps--simple {
  padding: 13px 8%;
  border-radius: 4px;
  background: #f0f0f0 !important;
}
</style>

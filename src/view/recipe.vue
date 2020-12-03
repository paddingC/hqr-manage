<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">患者姓名</td>
          <td>
            <el-input v-model="formInline.name" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">患者电话</td>
          <td>
            <el-input v-model="formInline.tel" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">处方编号</td>
          <td>
            <el-input v-model="formInline.num" class="inputWidth"></el-input>
          </td>

          <!--       <td class="textWidth">会员卡号</td>
                 <td>
                   <el-input v-model="formInline.card" class="inputWidth"></el-input>
                 </td>-->

        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">处方类型</td>
            <td>
              <el-select v-model="formInline.type" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in ztype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">处方属性</td>
            <td>
              <el-select v-model="formInline.attribute" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in attribute"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">处方来源</td>
            <td>
              <el-select v-model="formInline.comefrom" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in comefrom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </div>
          <div style="margin-top: 20px">
            <td class="textWidth">审方状态</td>
            <td>
              <el-select v-model="formInline.spstatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in stype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">执业药师</td>
            <td>
              <el-input v-model="formInline.pharmacistname" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">药品名</td>
            <td>
              <el-input v-model="formInline.goodsname" class="inputWidth"></el-input>
            </td>
          </div>
          <div style="margin-top: 20px">
            <td class="textWidth">审方开始时间</td>
            <td>
              <el-date-picker type="date" v-model="formInline.beginapprovaldate" class="inputWidth"
                              @change="selectTimeB"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </td>
            <td class="textWidth">审方结束时间</td>
            <td>
              <el-date-picker type="date" v-model="formInline.endapprovaldate" class="inputWidth"
                              @change="selectTimeE"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </td>
          </div>
        </div>
      </el-form>
      <el-form style="float: right;width: 20%;">
        <el-form-item>
          <el-button type="primary" @click="searchEvent">查询</el-button>
          <el-button @click="emptyEvent">清空</el-button>
        </el-form-item>
      </el-form>
      <h3 @click="showHideForm" :class="inputMore==true?'arrow_active':'arrow_img'" class="arrow_img"></h3>
    </div>
    <!--表单内容-->
    <elx-editable
      height="348"
      ref="formList" border
      :data.sync="tableData" :header-cell-style="rowClass"
      @current-change="rowChose">
      <elx-editable-column type="selection" width="55"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="prescriptionid" sortable width="88" label="处方ID"></elx-editable-column>
      <elx-editable-column prop="prescriptionno" sortable width="110" label="处方编号"></elx-editable-column>
      <elx-editable-column prop="recordstatus" sortable label="录制"></elx-editable-column>
      <elx-editable-column prop="prescriptiondate" width="110" label="处方日期" :formatter="formatterDate" sortable></elx-editable-column>
      <elx-editable-column prop="prescriptiontype" width="110" label="处方类型" :formatter="formatterType" sortable></elx-editable-column>
      <elx-editable-column prop="attribute" width="110" label="处方属性" :formatter="formatterAttribute" sortable></elx-editable-column>
      <elx-editable-column prop="comefrom" width="110" label="处方来源" :formatter="formatterComefrom" sortable></elx-editable-column>
      <elx-editable-column prop="patient" width="110" label="患者姓名" sortable></elx-editable-column>
      <elx-editable-column prop="insiderphone" width="110" label="患者电话" sortable></elx-editable-column>
      <elx-editable-column prop="idcard" width="110" label="身份证号" sortable></elx-editable-column>
      <elx-editable-column prop="diagnosis" label="诊断" sortable></elx-editable-column>
      <elx-editable-column prop="disease" width="110" label="疾病名称" sortable></elx-editable-column>
      <elx-editable-column prop="medicalinstitution" width="110" label="医疗机构" sortable></elx-editable-column>
      <elx-editable-column prop="doctor" width="88" label="医师" sortable></elx-editable-column>
      <elx-editable-column prop="approvalstatus" width="110" label="审方状态" sortable :formatter="formatterApprovalstatus"></elx-editable-column>
      <elx-editable-column prop="pharmacistname" width="110" label="执业药师" sortable></elx-editable-column>
      <elx-editable-column prop="approvaldate" width="110" label="审方日期" :formatter="formatterDate" sortable></elx-editable-column>
      <elx-editable-column prop="pointapprovalstatus"  width="120" sortable :formatter="pointapprovalstatusM" label="门店审核状态"></elx-editable-column>
      <elx-editable-column prop="pointapprovalman"  width="110" sortable label="门店审核人"></elx-editable-column>
      <elx-editable-column prop="dispensestatus" width="110" label="调配状态"
                           :formatter="formatterDispensestatus" sortable></elx-editable-column>
      <elx-editable-column prop="dispensemanname" width="88" label="调配人" sortable></elx-editable-column>
      <elx-editable-column prop="dispensedate" width="110" label="调配日期" :formatter="formatterDate" sortable></elx-editable-column>
      <elx-editable-column prop="checkstatus" width="110" label="核对状态" sortable :formatter="formatterCheckstatus"></elx-editable-column>
      <elx-editable-column prop="checkmanname" label="核对人" width="100" sortable></elx-editable-column>
      <elx-editable-column prop="checkdate" width="110" label="核对日期" :formatter="formatterDate" sortable></elx-editable-column>
      <elx-editable-column prop="dept" width="88" label="零售" sortable></elx-editable-column>
      <elx-editable-column prop="inputmanname" width="100" label="录入人" sortable></elx-editable-column>
      <elx-editable-column prop="inputdate" width="110" label="录入日期" sortable :formatter="formatterDate"></elx-editable-column>
      <elx-editable-column label="处方资料" fixed="right" width="220">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="scope.row.imageurl" @click="cfPic(scope.row)">处方图片</el-button>
          <el-button size="small" type="primary" v-else disabled>处方图片</el-button>
          <el-button size="small" type="primary" :disabled="scope.row.approvalvideourl == ''" @click="lookVedio(scope.row)">审方视频</el-button>
        </template>
      </elx-editable-column>
    </elx-editable>
    <!--分页-->
    <div class="block" style="margin: 20px; text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageVO.currentPage"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageVO.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageVO.totalResult">
      </el-pagination>
    </div>

    <el-dialog :title="title" :visible.sync="dialogData" v-loading="diaLoading" class="dialogTit">
      <el-form v-show="active===1" size="medium" style="height: 400px">
        <el-form-item>
          <el-image
            style="height: 380px;width: 100%;"
            :src="tp[0]"
            :preview-src-list="tp">
          </el-image>
        </el-form-item>
      </el-form>

      <el-form v-show="active===2" size="medium" style="height: 400px">
        <el-form-item>
          <a target="_blank" :href="jp">
            <img :src="jp" style="height: 380px;width: 100%;">
          </a>
        </el-form-item>
      </el-form>
      <el-form v-show="active===4" size="medium" style="height: 400px;overflow: auto">
        <div style="font-size: 14px;text-align: left" v-for="(item,index) in msg" :key="index">
          <p>{{item.credate}}</p>
          <p>{{item.fromuser}}&nbsp;&nbsp;发送给&nbsp;&nbsp;{{item.touser}}：{{item.message}}</p>
        </div>
      </el-form>
    </el-dialog>
    <!--细单内容-->
    <div v-loading="loading2">
      <elx-editable border height="300"
                    ref="childList" :header-cell-style="rowClass"
                    highlight-current-row
                    :data.sync="childData">
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="goodsid" label="商品ID"></elx-editable-column>
        <elx-editable-column prop="goodsname" label="药品名"></elx-editable-column>
        <elx-editable-column prop="goodstype" label="商品规格"></elx-editable-column>
        <elx-editable-column prop="goodsunit" label="基本单位"></elx-editable-column>
        <elx-editable-column prop="prodarea" label="产地"></elx-editable-column>
        <elx-editable-column prop="goodsqty" label="数量"></elx-editable-column>
        <elx-editable-column prop="yfyl" label="用法用量"></elx-editable-column>
      </elx-editable>
      <!--分页-->
      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChangeDtl"
          @current-change="handleCurrentChangeDtl"
          :current-page="pageDtl.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageDtl.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageDtl.totalResult">
        </el-pagination>
      </div>
    </div>

    <!-- 审方视频 -->
    <el-dialog title="审方视频" :visible.sync="vedioVisible" :close-on-click-modal="false" :showClose="false">
      <!--<div v-loading="vedioLoading">-->
      <!--</div>-->
      <!--<video id="player-container-id" preload="auto" style="width: 100%" height="360" playsinline webkit-playsinline>-->
      <!--</video>-->
      <div ref="player" id="play-box">
        <video id="player-container-id" preload="auto" style="width: 100%" height="360" playsinline webkit-playsinline>
        </video>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="vedioClose">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'

export default {
  inject: ['reload'],
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      loading2: false,
      formInline: {
        comefrom: '',
        card: '',
        tel: '',
        name: '',
        num: '',
        type: '',
        spstatus: '',
        pharmacistname: '',
        goodsname: '',
        door: '',
        beginapprovaldate: '',
        endapprovaldate: '',
        attribute: ''
      },
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      pageDtl: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      tableData: [],
      childData: [],
      dialogData: false,
      active: 1,
      title: '',
      tp: '',
      jp: '',
      mv: '',
      msg: [],
      reid: sessionStorage.getItem('regulatorid'),
      ztype: [ {label: '西药', value: 1},
        {label: '草药', value: 2} ],
      comefrom: [ {label: '拍照处方', value: 1},
        {label: '电子处方', value: 2} ],
      stype: [ {label: '待审批', value: 0},
        {label: '审批通过', value: 1},
        {label: '审批拒绝', value: 2} ],
      attribute: [ {label: '普通处方', value: 1},
        {label: '慢病处方', value: 2},
        {label: '特药处方', value: 3} ],
      diaLoading: false,
      inputMore: false,
      vedioVisible: false,
      player: null,
      vedioLoading: false
    }
  },
  mounted () {
    this.getFindDocList()
  },
  methods: {
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;height:50px;'
    },
    showHideForm () {
      this.inputMore = !this.inputMore
    },
    lookVedio (row){
      console.log(row);
      this.vedioVisible = true
      this.$nextTick(()=>{
        this.player = TCPlayer('player-container-id', { // player-container-id 为播放器容器ID，必须与html中一致
          fileID: row.approvalvideourl, // '7447398157015849771', // 请传入需要播放的视频filID 必须
          appID: row.appid, //'1256993030' // 请传入点播账号的appID 必须
          // fileID: '5285890799130332207',
          // appID: '1400298798',
          //其他参数请在开发文档中查看
          plugins: {
            ProgressMarker: true
          }
        });
      })
    },
    vedioClose () {
      this.player.dispose()
      // this.reload()
      console.log(this.$refs.player)
      let player = this.$refs.player
      let newView = document.createElement('video')
      newView.style.width = '100%'
      newView.setAttribute('height', '360')
      newView.setAttribute('playsinline', 'true')
      newView.setAttribute('webkit-playsinline', 'true')
      newView.setAttribute('id', 'player-container-id')
      player.appendChild(newView)
      this.vedioVisible = false
    },
    searchEvent () {
      this.getFindDocList()
      this.childData = []
    },
    getFindDocList () {
      let params = {
        companyid: this.companyid,
        patient: this.formInline.name, // 患者姓名
        insiderphone: this.formInline.tel, // 患者电话
        prescriptionno: this.formInline.num, // 处方编号
        prescriptiontype: this.formInline.type, // 处方类型
        attribute: this.formInline.attribute, // 处方属性
        comefrom: this.formInline.comefrom, // 处方来源
        approvalstatus: this.formInline.spstatus, // 审批状态
        pharmacistname: this.formInline.pharmacistname, // 执业药师
        goodsname: this.formInline.goodsname, // 药品名称
        beginapprovaldate: this.formInline.beginapprovaldate,
        endapprovaldate: this.formInline.endapprovaldate,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }
      this.loading = true
      this.$api.recipe.finddoc(params).then(res => {
        if (res.status === 200) {
          this.loading = false
          // res.data.list.forEach((item) => {
            // if (item.imageurl != '') {
              // item.imageurl = item.imageurl.split(',')
              // item.imageurl.unshift('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
            // }
            // item.approvalvideourl = ['http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4']
          // })
          this.tableData = res.data.list
          console.log(this.tableData)
          this.pageVO.totalResult = res.data.info
        } else {
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    emptyEvent () {
      this.formInline = {}
    },
    rowChose (val) {
      if (val.prescriptionid) {
        this.pageDtl.currentPage = 1
        this.pageDtl.pageSize = 10
        let parms = {
          prescriptionid: val.prescriptionid,
          pageIndex: this.pageDtl.currentPage,
          pageSize: this.pageDtl.pageSize
        }
        this.childData = []
        this.findChildList(parms)
      }
    },
    findChildList (parms) {
      console.log(parms)
      this.loading2 = true
      this.$api.recipe.finddtl(parms).then(res => {
        if (res.status === 200) {
          this.loading2 = false
          this.childData = res.data.list
          this.pageDtl.totalResult = res.data.info
        } else {
          this.loading2 = false
        }
      }).catch(err => {
        this.loading2 = false
      })
    },
    cfPic (val) {
      console.log(val.imageurl)
      this.dialogData = true
      this.title = '处方图片'
      this.active = 1
      this.tp = ''
      this.tp = val.imageurl
      console.log(this.tp)
    },
    sfPic (val) {
      this.dialogData = true
      this.title = '审方截屏'
      this.active = 2
      this.jp = val.approvalimgurl
    },
    sfMv (val) {
      this.dialogData = true
      this.title = '审方视频'
      this.active = 3
      this.mv = val.approvalvideourl
    },
    sfMsg (val) {
      console.log(val)
      this.dialogData = true
      this.title = '审方消息'
      this.active = 4
      this.$api.recipe.gethismessage({prescriptionid: val.prescriptionid}).then(res => {
        if (res.status == 200) {
          console.log(res)
          this.msg = res.data
        }
      })
    },

    selectTimeB (val) {
      this.formInline.beginapprovaldate = val
    },
    selectTimeE (val) {
      this.formInline.endapprovaldate = val
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
    },
    pointapprovalstatusM (cellValue) {
      return cellValue === '1' ? '已审核' : '未审核'
    },
    // 处方类型
    formatterType (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '西药'
      } else if (cellValue == 2) {
        return cellValue = '草药'
      }
    },
    formatterAttribute (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '普通处方'
      } else if (cellValue == 2) {
        return cellValue = '慢病处方'
      } else if (cellValue == 3) {
        return cellValue = '特药处方'
      }
    },
    formatterComefrom (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '拍照处方'
      } else if (cellValue == 2) {
        return cellValue = '电子处方'
      }
    },
    // 审批状态
    formatterApprovalstatus (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '待审批'
      } else if (cellValue == 1) {
        return cellValue = '审批通过'
      } else if (cellValue == 2) {
        return cellValue = '审批拒绝'
      }
    },
    // 调配状态
    formatterDispensestatus (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '未调配'
      } else if (cellValue == 1) {
        return cellValue = '已调配'
      }
    },
    // 核对状态
    formatterCheckstatus (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '未核对'
      } else if (cellValue == 1) {
        return cellValue = '已核对'
      }
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindDocList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindDocList()
    },
    handleSizeChangeDtl (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findChildList()
    },
    handleCurrentChangeDtl (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findChildList()
    }
  }
}
</script>

<style scoped>
  .textWidth {
    width         : 88px;
    max-width     : 200px;
    font-size     : 14px;
    text-align    : right;
    padding-right : 12px;
  }
  .inputWidth {
    max-width            : 200px;
    /*百度 360极速*/
    -webkit-column-width : 200px;
  }
  .arrow_img {
    width           : 100% !important;
    margin-top      : 0px;
    border-radius   : 0 0 3px 3px;
    margin-bottom   : 20px;
    height          : 24px;
    background      : url("./../../src/assets/return_down.png") center bottom no-repeat;
    background-size : 120px auto;
    border-bottom   : 2px solid #4ebfff;
    cursor          : pointer;
  }
  .arrow_active {
    background : url("./../../src/assets/return_up.png") center bottom no-repeat;
  }
  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
  }
  .has-gutter tr th {
    background : #f00;
  }
</style>

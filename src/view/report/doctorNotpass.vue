<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">开始时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.searchbegindate" class="inputWidth"
                            @change="selectTimeB"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">结束时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.searchenddate" class="inputWidth"
                            @change="selectTimeE"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">执业医师</td>
          <td>
            <el-input v-model="formInline.doctor" class="inputWidth"></el-input>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">

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
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column sortable prop="inputdate" label="制单时间"></elx-editable-column>
      <elx-editable-column sortable prop="prescriptionno" label="处方单号"></elx-editable-column>
      <elx-editable-column sortable prop="patient" label="患者姓名"></elx-editable-column>
      <elx-editable-column sortable prop="idcardno" label="身份证号"></elx-editable-column>
      <elx-editable-column sortable prop="sex" label="性别" :formatter="sexM"></elx-editable-column>
      <elx-editable-column sortable prop="age" label="年龄"></elx-editable-column>
      <elx-editable-column sortable prop="telphone" label="联系方式"></elx-editable-column>
      <elx-editable-column sortable prop="diagnosis" label="临床诊断"></elx-editable-column>
      <elx-editable-column sortable prop="doctor" label="执业医师"></elx-editable-column>
      <elx-editable-column sortable prop="attribute" label="处方属性" :formatter="formatterAttribute"></elx-editable-column>
      <elx-editable-column sortable prop="prescriptiontype" label="处方类型" :formatter="formatterType"></elx-editable-column>
      <elx-editable-column sortable prop="reason" label="审批不通过原因"></elx-editable-column>
      <elx-editable-column sortable prop="approvalstatus" label="审批状态" :formatter="formatterApprovalstatus"></elx-editable-column>
      <elx-editable-column sortable prop="deptname" label="门店名称"></elx-editable-column>
      <elx-editable-column label="处方资料" fixed="right" width="220">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="scope.row.imageurl" @click="cfPic(scope.row)">处方图片</el-button>
          <el-button size="small" type="primary" v-else disabled>处方图片</el-button>
          <el-button size="small" type="primary" :disabled="scope.row.fileid == '' || scope.row.fileid == undefined" @click="lookVedio(scope.row, 'two')">复诊视频</el-button>
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
    </el-dialog>
    <el-dialog :title="videoTit" :visible.sync="vedioVisible" :close-on-click-modal="false" :showClose="false">
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
  export default {
    data () {
      return {
        companyid: sessionStorage.getItem('companyid'),
        loading: false,
        formInline: {},
        inputMore: false,
        comefrom: [ {label: '拍照处方', value: 1}, {label: '电子处方', value: 2} ],
        attribute: [ {label: '普通处方', value: 1}, {label: '慢病处方', value: 2}, {label: '特药处方', value: 3} ],
        tableData: [],
        pageVO: {
          pageSize: 10,
          currentPage: 1,
          totalResult: 0
        },
        dialogData: false,
        diaLoading: false,
        active: 1,
        title: '',
        tp: [],
        videoTit: '',
        vedioVisible: false
      }
    },
    mounted () {
      this.getFindDocList()
    },
    methods : {
      searchEvent () {
        this.getFindDocList()
      },
      emptyEvent () {
        this.formInline = {}
      },
      getFindDocList () {
        this.$api.doctors.findByPrescriptionInfo({
          approvalstatus: 2,
          companyid: this.companyid,
          comefrom: this.formInline.comefrom,
          doctor: this.formInline.doctor,
          searchbegindate: this.formInline.searchbegindate,
          searchenddate: this.formInline.searchenddate,
          attribute: this.formInline.attribute,
          pageIndex: this.pageVO.currentPage,
          pageSize: this.pageVO.pageSize
        }).then(res => {
          if (res.status === 200) {
            this.tableData = res.data.list
            this.pageVO.totalResult = res.data.info
          } else {
            this.$message.warning('查询失败')
          }
        }).catch(err => {
          this.$message.error('查询异常')
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
      lookVedio(row){
        this.vedioVisible = true
        this.videoTit = '复诊视频'
        this.$nextTick(()=>{
          this.player = TCPlayer('player-container-id', {
            fileID: row.fileid,
            appID: row.appid,
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
      handleSizeChange (pageSize) {
        this.pageVO.pageSize = pageSize
        this.getFindDocList()
      },
      handleCurrentChange (currentPage) {
        this.pageVO.currentPage = currentPage
        this.getFindDocList()
      },
      selectTimeE (val) {this.formInline.searchenddate = val},
      selectTimeB (val) {this.formInline.searchbegindate = val},
      // 审方状态
      formatterApprovalstatus (row, column, cellValue, index) {
        if (cellValue == 0) {
          return cellValue = '待审批'
        } else if (cellValue == 1) {
          return cellValue = '审批通过'
        } else if (cellValue == 2) {
          return cellValue = '审批拒绝'
        }
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
      sexM (row, column, cellValue, index) {
        if (cellValue == 1) {
          return cellValue = '男'
        } else {
          return cellValue = '女'
        }
      },
      rowClass () {
        return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
      },
      showHideForm () {this.inputMore = !this.inputMore},
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
    background      : url("../../../src/assets/return_down.png") center bottom no-repeat;
    background-size : 120px auto;
    border-bottom   : 2px solid #4ebfff;
    cursor          : pointer;
  }
  .arrow_active {
    background : url("../../../src/assets/return_up.png") center bottom no-repeat;
  }
  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
  }
  .has-gutter tr th {
    background : #f00;
  }
</style>

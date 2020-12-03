<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">开始时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.beginapprovaldate" class="inputWidth"
                            @change="selectTimeB"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">结束时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.endapprovaldate" class="inputWidth"
                            @change="selectTimeE"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">执业药师</td>
          <td>
            <el-input v-model="formInline.pharmacistname" class="inputWidth"></el-input>
          </td>
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
      <elx-editable-column sortable prop="prescriptionid" label="处方流水号"></elx-editable-column>
      <elx-editable-column sortable prop="pharmacistname" label="执业药师"></elx-editable-column>
      <elx-editable-column sortable prop="prescriptiontype" label="处方类型" :formatter="formatterType"></elx-editable-column>
      <elx-editable-column sortable prop="attribute" label="处方属性" :formatter="formatterAttribute"></elx-editable-column>
      <elx-editable-column sortable prop="comefrom" label="处方来源" :formatter="formatterComefrom"></elx-editable-column>
      <elx-editable-column sortable prop="reason" label="审批意见"></elx-editable-column>
      <elx-editable-column sortable prop="dept" label="门店名称"></elx-editable-column>
      <elx-editable-column label="处方资料" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="small" type="primary" v-if="scope.row.imageurl" @click="cfPic(scope.row)">处方图片</el-button>
          <el-button size="small" type="primary" v-else disabled>处方图片</el-button>
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
        ztype: [ {label: '西药', value: 1}, {label: '草药', value: 2} ],
        comefrom: [ {label: '拍照处方', value: 1}, {label: '电子处方', value: 2} ],
        stype: [ {label: '待审批', value: 0}, {label: '审批通过', value: 1}, {label: '审批拒绝', value: 2} ],
        attribute: [ {label: '普通处方', value: 1}, {label: '慢病处方', value: 2}, {label: '特药处方', value: 3} ],
        checkList: ['1'],
        tableData: [],
        pageVO: {
          pageSize: 10,
          currentPage: 1,
          totalResult: 0
        },
        title: '',
        dialogData: false,
        diaLoading: false,
        active: 1,
        tp: []
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
        this.$api.recipe.finddoc({
          companyid: this.companyid,
          prescriptiontype: this.formInline.type, // 处方类型
          attribute: this.formInline.attribute, // 处方属性
          comefrom: this.formInline.comefrom, // 处方来源
          pharmacistname: this.formInline.pharmacistname, // 执业药师
          beginapprovaldate: this.formInline.beginapprovaldate,
          endapprovaldate: this.formInline.endapprovaldate,
          approvalstatus: 2,
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
      handleSizeChange (pageSize) {
        this.pageVO.pageSize = pageSize
        this.getFindDocList()
      },
      handleCurrentChange (currentPage) {
        this.pageVO.currentPage = currentPage
        this.getFindDocList()
      },
      selectTimeE (val) {this.formInline.endapprovaldate = val},
      selectTimeB (val) {this.formInline.beginapprovaldate = val},
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
      formatterComefrom (row, column, cellValue, index) {
        if (cellValue == 1) {
          return cellValue = '拍照处方'
        } else if (cellValue == 2) {
          return cellValue = '电子处方'
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
      rowClass () {return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'},
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

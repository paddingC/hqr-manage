<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">执业医师</td>
          <td>
            <el-input v-model="formInline.doctorname" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">联系方式</td>
          <td>
            <el-input v-model="formInline.phonenum" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">在岗状态</td>
          <td>
            <el-select v-model="formInline.poststatus" placeholder="请选择" class="inputWidth">
              <el-option
                v-for="item in onworkstatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">工作状态</td>
            <td>
              <el-select v-model="formInline.workstatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in stype"
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
      <elx-editable-column sortable prop="doctorname" label="执业医师"></elx-editable-column>
      <elx-editable-column sortable prop="sex" label="性别" :formatter="formatterSex"></elx-editable-column>
      <elx-editable-column sortable prop="phonenum" label="联系方式"></elx-editable-column>
      <elx-editable-column sortable prop="positionaltitles" label="职称"></elx-editable-column>
      <elx-editable-column sortable prop="poststatus" label="在岗状态" :formatter="formatterPost"></elx-editable-column>
      <elx-editable-column sortable prop="workstatus" label="工作状态" :formatter="formatterWork"></elx-editable-column>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        companyid: sessionStorage.getItem('companyid'),
        loading: false,
        formInline: {
          doctorname: '',
          phonenum: '',
          poststatus: '',
          workstatus: ''
        },
        inputMore: false,
        onworkstatus: [ {label: '不在岗', value: 0}, {label: '在岗', value: 1} ],
        stype: [ {label: '空闲', value: 0}, {label: '工作中', value: 1} ],
        tableData: [],
        pageVO: {
          pageSize: 10,
          currentPage: 1,
          totalResult: 0
        },
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
        this.$api.doctor.doctorsFind({
          companyid: this.companyid,
          doctorname: this.formInline.doctorname,
          phonenum: this.formInline.phonenum,
          poststatus: this.formInline.poststatus,
          workstatus: this.formInline.workstatus,
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
      handleSizeChange (pageSize) {
        this.pageVO.pageSize = pageSize
        this.getFindDocList()
      },
      handleCurrentChange (currentPage) {
        this.pageVO.currentPage = currentPage
        this.getFindDocList()
      },
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

      formatterSex (row, column, cellValue, index) {
        if (cellValue == 1) {
          return cellValue = '男'
        } else if (cellValue == 2) {
          return cellValue = '女'
        }
      },
      formatterPost (row, column, cellValue, index) {
        if (cellValue == 0) {
          return cellValue = '不在岗'
        } else if (cellValue == 1) {
          return cellValue = '在岗'
        }
      },
      formatterWork (row, column, cellValue, index) {
        if (cellValue == 0) {
          return cellValue = '空闲'
        } else if (cellValue == 1) {
          return cellValue = '工作中'
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

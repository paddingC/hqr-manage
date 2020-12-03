<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">开始时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.begininputdate" class="inputWidth"
                            @change="selectTimeB"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">结束时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.endinputdate" class="inputWidth"
                            @change="selectTimeE"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">门店名称</td>
          <td>
            <el-input v-model="formInline.deptname" class="inputWidth"></el-input>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">处方类型</td>
            <td>
              <el-select v-model="formInline.prescriptiontype" placeholder="请选择" class="inputWidth">
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
              <el-select v-model="formInline.approvalstatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in sftype"
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
    <div style="margin-top: 12px;margin-bottom: 12px">
      <span style="display: inline-block; float: left; margin-right: 20px">汇总条件：</span>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="1">处方类型</el-checkbox>
        <el-checkbox label="2">处方属性</el-checkbox>
        <el-checkbox label="3">处方来源</el-checkbox>
        <el-checkbox label="4">审方状态</el-checkbox>
      </el-checkbox-group>
    </div>
    <!--表单内容-->
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column sortable prop="deptname" label="门店名称"></elx-editable-column>
      <elx-editable-column sortable prop="ct" label="处方量"></elx-editable-column>
      <elx-editable-column sortable prop="prescriptiontype" label="处方类型" :formatter="formatterType" v-if="formInline.fzprescriptiontype == 1"></elx-editable-column>
      <elx-editable-column sortable prop="attribute" label="处方属性" :formatter="formatterAttribute" v-if="formInline.fzattribute == 1"></elx-editable-column>
      <elx-editable-column sortable prop="comefrom" label="处方来源" :formatter="formatterComefrom" v-if="formInline.fzcomefrom == 1"></elx-editable-column>
      <elx-editable-column sortable prop="approvalstatus" label="审方状态" :formatter="formatterApprovalstatus" v-if="formInline.fzapprovalstatus == 1"></elx-editable-column>
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
  name: "storeSummary",
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      formInline: {
        fzapprovalstatus: '',
        fzattribute: '',
        fzcomefrom: '',
        fzprescriptiontype: '',
        begininputdate: '',
        endinputdate: '',
        deptname: '',
        prescriptiontype: '',
        attribute: '',
        comefrom: '',
        approvalstatus: ''
      },
      inputMore: false,
      ztype: [ {label: '西药', value: 1}, {label: '中药', value: 2} ],
      comefrom: [ {label: '拍照处方', value: 1}, {label: '电子处方', value: 2} ],
      sftype: [ {label: '未审核', value: 0}, {label: '通过', value: 1}, {label: '未通过', value: 2}, {label: '驳回', value: 4} ],
      attribute: [ {label: '普通处方', value: 1}, {label: '慢病处方', value: 2}, {label: '特药处方', value: 3} ],
      checkList: [],
      tableData: [
        {dept: '213', num: 232, prescriptiontype: 1, attribute: 1, comefrom: 1, approvalstatus: 0},
        {dept: '213', num: 232, prescriptiontype: 2, attribute: 2, comefrom: 2, approvalstatus: 1},
        {dept: '213', num: 232, prescriptiontype: 1, attribute: 3, comefrom: 2, approvalstatus: 2},
      ],
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
      this.formInline.fzprescriptiontype = this.checkList.includes('1')? 1 : ''
      this.formInline.fzattribute = this.checkList.includes('2')? 1 : ''
      this.formInline.fzcomefrom = this.checkList.includes('3')? 1 : ''
      this.formInline.fzapprovalstatus = this.checkList.includes('4')? 1 : ''
      this.getFindDocList()
    },
    emptyEvent () {
      this.formInline = {}
    },
    getFindDocList () {
      let param = {
        companyid: this.companyid,
        fzapprovalstatus: this.formInline.fzapprovalstatus,
        fzattribute: this.formInline.fzattribute,
        fzcomefrom: this.formInline.fzcomefrom,
        fzprescriptiontype: this.formInline.fzprescriptiontype,
        begininputdate: this.formInline.begininputdate,
        endinputdate: this.formInline.endinputdate,
        deptname: this.formInline.deptname,
        prescriptiontype: this.formInline.prescriptiontype,
        attribute: this.formInline.attribute,
        comefrom: this.formInline.comefrom,
        approvalstatus: this.formInline.approvalstatus,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }
      this.$api.store.pointPrescritpionCollect(param).then(res => {
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
    selectTimeE (val) {this.formInline.endinputdate = val},
    selectTimeB (val) {this.formInline.begininputdate = val},
    // 审方状态
    formatterApprovalstatus (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '未审核'
      } else if (cellValue == 1) {
        return cellValue = '通过'
      } else if (cellValue == 2) {
        return cellValue = '未通过'
      } else if (cellValue == 4) {
        return cellValue = '驳回'
      }
    },
    // 处方类型
    formatterType (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '西药'
      } else if (cellValue == 2) {
        return cellValue = '中药'
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

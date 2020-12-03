<template>
  <div>
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">门店名称</td>
          <td>
            <el-input v-model="formInline.deptName" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">开始时间</td>
          <td>
            <el-date-picker
              type="date"
              v-model="formInline.beginCreatedTime"
              class="inputWidth"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </td>
          <td class="textWidth">结束时间</td>
          <td>
            <el-date-picker
              type="date"
              v-model="formInline.endCreatedTime"
              class="inputWidth"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">问诊单状态</td>
            <td>
              <el-select v-model="formInline.diagnosisStatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in orderArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">问诊类型</td>
            <td>
              <el-select v-model="formInline.serviceType" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in serviceArr"
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
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column sortable prop="bizOrderId" label="订单ID" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="userName" label="门店人员"  width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="deptName" label="所属门店" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="diagnosisId" label="诊疗单ID" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="diagnosisStatus" label="问诊单状态" width="120px" :formatter="orderM"></elx-editable-column>
      <elx-editable-column sortable prop="createdTime" label="创建时间" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="receiveTime" label="接诊时间" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="endTime" label="结束时间" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="cancelTime" label="取消时间" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="serviceType" label="问诊类型" width="120px" :formatter="payM"></elx-editable-column>
      <elx-editable-column sortable prop="doctorName" label="医生姓名" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="doctorOffice" label="医生科室" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="hospitalName" label="互联网医院名称" width="160px"></elx-editable-column>
      <elx-editable-column sortable prop="userFamilyName" label="就诊人姓名" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="userFamilyGender" label="就诊人性别" width="120px" :formatter="sexM"></elx-editable-column>
      <elx-editable-column sortable prop="userFamilyAge" label="就诊人年龄" width="120px"></elx-editable-column>
      <elx-editable-column sortable prop="prescribingid" label="处方单ID" width="120px"></elx-editable-column>
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
  name: 'communityInquirySheetManage',
  data () {
    return {
      companyId: sessionStorage.getItem('companyid'),
      companyname: sessionStorage.getItem('companyname'),
      formInline: {
        deptName: '',
        beginCreatedTime: '',
        endCreatedTime: '',
        serviceType: '',
        diagnosisStatus: ''
      },
      orderArr: [
        { label: '已完成', value: 2 },
        { label: '已取消', value: 5 }
      ],
      serviceArr: [
        { label: '图文', value: 0 },
        { label: '视频', value: 1 }
      ],
      tableData: [],
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      inputMore: false
    }
  },
  mounted () {
    this.getFindDocList()
  },
  methods: {
    searchEvent () {
      this.getFindDocList()
    },
    emptyEvent () {
      this.formInline = {}
    },
    getFindDocList () {
      this.$api.rechargeDetails.listDiagnosis({
        companyId: this.companyId,
        deptName: this.formInline.deptName,
        beginCreatedTime: this.formInline.beginCreatedTime,
        endCreatedTime: this.formInline.endCreatedTime,
        diagnosisStatus: this.formInline.diagnosisStatus,
        serviceType: this.formInline.serviceType,
        page: {
          pageSize: this.pageVO.pageSize,
          pageIndex: this.pageVO.currentPage
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.total
        }
      })
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindDocList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindDocList()
    },
    showHideForm () { this.inputMore = !this.inputMore },
    sexM (row, column, cellValue, index) {
      if (cellValue === 1 || cellValue === '1') {
        return cellValue = '男'
      } else if (cellValue === 2 || cellValue === '2') {
        return cellValue = '女'
      } else if (cellValue === 0 || cellValue === '0') {
        return cellValue = '保密'
      }
    },
    payM (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return cellValue = '图文'
      } else if (cellValue === 1 || cellValue === '1') {
        return cellValue = '视频'
      } else if (cellValue === 2 || cellValue === '2') {
        return cellValue = '预约图文'
      }
    },
    orderM (row, column, cellValue, index) {
      if (cellValue === 1 || cellValue === '1') {
        return cellValue = '进行中'
      } else if (cellValue === 2 || cellValue === '2') {
        return cellValue = '已完成'
      } else if (cellValue === 5 || cellValue === '5') {
        return cellValue = '已取消'
      }
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
  background      : url("../../../src/assets/return_down.png") center bottom no-repeat;
  background-size : 120px auto;
  border-bottom   : 2px solid #4ebfff;
  cursor          : pointer;
}
</style>

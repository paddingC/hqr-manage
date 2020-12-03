<template>
    <div>
      <div class="topBox">
        <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
                 style="width: 80%;text-align: left;display: inline-block">
          <div>
            <td class="textWidth">开始时间</td>
            <td>
              <el-date-picker
                type="date"
                v-model="formInline.beginPayTime"
                class="inputWidth"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
            <td class="textWidth">结束时间</td>
            <td>
              <el-date-picker
                type="date"
                v-model="formInline.endPayTime"
                class="inputWidth"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </td>
          </div>
        </el-form>
        <el-form style="float: right;width: 20%;">
          <el-form-item>
            <el-button type="primary" @click="searchEvent">查询</el-button>
            <el-button @click="emptyEvent">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--表单内容-->
      <elx-editable ref="formList"
                    min-height="320px"
                    max-height="400px"
                    border :header-cell-style="rowClass"
                    :data.sync="tableData">
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column sortable prop="orderNo" label="单据凭证号"></elx-editable-column>
        <elx-editable-column sortable prop="payWay" label="支付渠道" :formatter="payM"></elx-editable-column>
        <elx-editable-column sortable prop="payTime" label="充值时间"></elx-editable-column>
        <elx-editable-column sortable prop="payMoney" label="支付金额"></elx-editable-column>
        <elx-editable-column sortable prop="orderStatus" label="支付状态" :formatter="orderM"></elx-editable-column>
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
  name: 'rechargeDetails',
  data () {
    return {
      companyId: sessionStorage.getItem('companyid'),
      companyname: sessionStorage.getItem('companyname'),
      formInline: {
        beginPayTime: '',
        endPayTime: ''
      },
      tableData: [],
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      }
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
      this.$api.rechargeDetails.listRechargeRecord({
        companyId: this.companyId,
        data: {
          beginPayTime: this.formInline.beginPayTime,
          endPayTime: this.formInline.endPayTime,
          orderStatus: 4,
          page: {
            pageSize: this.pageVO.pageSize,
            pageIndex: this.pageVO.currentPage
          }
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
    payM (row, column, cellValue, index) {
      if (cellValue === 1 || cellValue === '1') {
        return cellValue = '支付宝'
      } else if (cellValue === 2 || cellValue === '2') {
        return cellValue = '微信'
      } else if (cellValue === 3 || cellValue === '3') {
        return cellValue = '银联'
      }
    },
    orderM (row, column, cellValue, index) {
      if (cellValue === 0 || cellValue === '0') {
        return cellValue = '临时'
      } else if (cellValue === 1 || cellValue === '1') {
        return cellValue = '待付款'
      } else if (cellValue === 2 || cellValue === '2') {
        return cellValue = '已取消'
      } else if (cellValue === 3 || cellValue === '3') {
        return cellValue = '付款失败'
      } else if (cellValue === 4 || cellValue === '4') {
        return cellValue = '付款完成'
      } else if (cellValue === 5 || cellValue === '5') {
        return cellValue = '已完成'
      } else if (cellValue === 6 || cellValue === '6') {
        return cellValue = '待退款'
      } else if (cellValue === 7 || cellValue === '7') {
        return cellValue = '已退款'
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
</style>

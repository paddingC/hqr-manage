<template>
  <div>
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">药品名称</td>
          <td>
            <el-input v-model="formInline.goodsname" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">门店名称</td>
          <td>
            <el-input v-model="formInline.deptname" class="inputWidth"></el-input>
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
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  @cell-click="rowChose">
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="goodsname" label="药品名称"></elx-editable-column>
      <elx-editable-column prop="deptname" label="门店名称"></elx-editable-column>
      <elx-editable-column prop="goodsqty" label="库存数量"></elx-editable-column>
      <elx-editable-column prop="inputdate" label="更新日期"></elx-editable-column>
    </elx-editable>
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
    <el-dialog title="记录" :visible.sync="regVisible" width="880px">
      <elx-editable ref="regList"
                    min-height="320px"
                    max-height="400px"
                    border :header-cell-style="rowClass"
                    :data.sync="regList"
                    tooltip-effect="dark">
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="goodsname" label="药品名称"></elx-editable-column>
        <elx-editable-column prop="deptname" label="门店名称"></elx-editable-column>
        <elx-editable-column prop="goodsqty" label="库存数量"></elx-editable-column>
        <elx-editable-column prop="erppointid" label="ERP门店ID"></elx-editable-column>
        <elx-editable-column prop="erpgoodsid" label="ERP货品ID"></elx-editable-column>
        <elx-editable-column prop="inputdate" label="更新日期"></elx-editable-column>
      </elx-editable>
      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageV1.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageV1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageV1.totalResult">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "repertoryManage",
  data(){
    return{
      formInline: {
        goodsname: '',
        deptname: ''
      },
      tableData: [],
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      loginid: sessionStorage.getItem('loginid'),
      companyid: sessionStorage.getItem('companyid'),
      regVisible: false,
      regList: [],
      pageV1: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      regData: {}
    }
  },
  mounted () {
    this.getFindlist()
  },
  methods: {
    searchEvent () {
      this.getFindlist()
    },
    emptyEvent () {
      this.formInline = {}
    },
    getFindlist() {
      this.$api.repertory.getInventory({
        companyId: this.companyid,
        data: {
          goodsname: this.formInline.goodsname,
          deptname: this.formInline.deptname,
          page: {
            pageIndex: this.pageVO.currentPage,
            pageSize: this.pageVO.pageSize
          }
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.total
        }
      })
    },
    rowChose (row) {
      this.regData = row
      this.regVisible = true
      this.$api.repertory.getReg({
        companyId: this.companyid,
        data: {
          deptid: row.deptid,
          erpgoodsid: row.erpgoodsid,
          page: {
            pageIndex: this.pageV1.currentPage,
            pageSize: this.pageV1.pageSize
          }
        }
      }).then(res => {
        if (res.status === 200) {
          this.regList = res.data.list
          this.pageV1.totalResult = res.data.total
        } else {
          this.regList = []
        }
      }).catch(err => {
        console.log(err);
      })
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindlist()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindlist()
    },
    handleSizeChange1 (pageSize) {
      this.pageV1.pageSize = pageSize
      this.rowChose(this.regData)
    },
    handleCurrentChange1 (currentPage) {
      this.pageV1.currentPage = currentPage
      this.rowChose(this.regData)
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
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

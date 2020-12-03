<template>
  <div>
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  tooltip-effect="dark">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="templateName" label="模板名称"></elx-editable-column>
      <elx-editable-column prop="categoryName" label="服务类目"></elx-editable-column>
      <elx-editable-column prop="templateId" label="模板ID"></elx-editable-column>
      <elx-editable-column label="操作">
        <template slot-scope="scope">
          <a style="color: #3a8ee6;cursor: pointer" @click="editEvent(scope.row)">编辑</a>
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
    <el-dialog title="编辑" :visible.sync="dialogEdit" class="dialogTit" width="540px" @close="cancelBtn">
      <el-form :model="dataForm" :inline="true" label-width="120px" ref="dataForm" style="text-align: left">
        <el-form-item label="模板名称">
          <el-input v-model="dataForm.templateName" style="width: 268px" disabled></el-input>
        </el-form-item>
        <el-form-item label="分类信息">
          <el-input v-model="dataForm.categoryName" style="width: 268px" disabled></el-input>
        </el-form-item>
        <el-form-item label="模板ID">
          <el-input v-model="dataForm.templateId" style="width: 268px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="cancelBtn">取消</el-button>
        <el-button type="primary" @click.native="saveEdit('dataForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'appmsgManage',
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      tableData: [],
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      },
      dialogEdit: false,
      dataForm: {
        templateName: '',
        categoryName: '',
        templateId: ''
      }
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      this.$api.apphttp.msgList({
        prodType: 1,
        page: {
          pageIndex: this.pageVO.currentPage,
          pageSize: this.pageVO.pageSize
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
        }
      }).catch(err => {
        console.log(err)
      })
    },
    editEvent (row) {
      this.dialogEdit = true
      this.dataForm = row
    },
    cancelBtn () {
      this.dialogEdit = false
      this.getList()
    },
    saveEdit (form) {
      this.$refs[ form ].validate((valid) => {
        if (valid) {
          this.$api.apphttp.saveOrUpdate({
            companyId: this.companyid,
            id: this.dataForm.id,
            prodType: 1,
            scene: this.dataForm.scene,
            templateId: this.dataForm.templateId
          }).then(res => {
            if (res.status === 200) {
              this.dialogEdit = false
              this.getList()
              this.$message.success(res.msg)
            } else {
              this.$message.error(res.msg)
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          return false
        }
      })
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getList()
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    }
  }
}
</script>

<style scoped>

  .dialogTit >>> .el-dialog__header {
    text-align: center;
    background : #f3f3f3 !important;
  }
</style>

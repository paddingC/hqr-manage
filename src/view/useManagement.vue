<template>
  <div v-loading="loading">
    <div class="Btns" style="padding-top:10px;padding-left:15px;float: left;margin-bottom: 20px">
      <el-button size="mini" icon="fa fa-plus" type="primary" @click="addEvent(null)">新增</el-button>
      <el-button size="mini" icon="fa fa-trash" type="danger" @click="removeEvent">批量删除</el-button>
    </div>
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  show-overflow
                  export-config
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  :edit-config="{trigger: 'click', mode: 'row', showStatus: true}">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="usageanddosageid" label="模板ID"></elx-editable-column>
      <elx-editable-column prop="usageanddosage" label="用法用量" :edit-render="{name: 'input'}"></elx-editable-column>
      <elx-editable-column prop="inputmanname" label="创建人"></elx-editable-column>
      <elx-editable-column prop="inputdate" label="创建时间"></elx-editable-column>
      <elx-editable-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="saveEvent(scope.row)">保存</el-button>
        </template>
      </elx-editable-column>
    </elx-editable>
    <!--分页-->
    <!--<div class="block" style="margin: 20px; text-align: right">-->
      <!--<el-pagination-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="pageVO.currentPage"-->
        <!--:page-sizes="[5, 10, 20, 50, 100]"-->
        <!--:page-size="pageVO.pageSize"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="pageVO.totalResult">-->
      <!--</el-pagination>-->
    <!--</div>-->
    <!--新增or编辑-->
    <el-dialog :title="cardTit==='add'?'新增':'编辑'" :visible.sync="dialogCard" class="dialogTit" width="580px">
      <el-form :model="dataForm" :inline="true" label-width="120px" ref="dataForm" style="text-align: left">
        <el-form-item
          label="用法用量" prop="usageanddosage"
          :rules="[
              { required: true, message: '请输入常见病', trigger: 'blur' }
          ]">
          <el-input v-model="dataForm.usageanddosage" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item
          label="操作码" prop="code"
          :rules="[
              { required: true, message: '请输入操作码', trigger: 'blur' }
          ]">
          <el-input v-model="dataForm.code" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="病因">
          <el-input type="textarea" class="textarea" v-model="dataForm.cause" style="width: 268px;"></el-input>
        </el-form-item>
        <el-form-item label="症状">
          <el-input type="textarea" class="textarea" v-model="dataForm.symptom" style="width: 268px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogCard = false">取消</el-button>
        <el-button type="primary" @click.native="saveEdit('dataForm')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      tableData: [],
      pageVO: {},
      dialogCard: false,
      cardTit: 'add',
      dataForm: {}
    }
  },
  mounted () {
    this.getFindList()
  },
  methods: {
    getFindList () {
      this.loading = true
      this.$api.use.select({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.loading = false
          this.tableData = res.data
          this.pageVO.totalResult = res.data.info
        } else {
          this.loading = false
        }
      }).catch(err=>{
        console.log(err);
        this.loading = false
      })
    },
    addEvent (row) {
      //let record = {}
      //this.$refs.formList.insertAt(record, row).then(({row}) => this.$refs.formList.setActiveRow(row, 'usageanddosage'))
      let xTable = this.$refs.formList
      let record = {}
      xTable.insertAt(record, row).then(({ row }) => {
        xTable.setActiveRow(row)
      })
    },
    saveEvent (row) {
      console.log(row);
      this.$api.use.save({
        companyid: this.companyid,
        usageanddosageid: row.usageanddosageid,
        usageanddosage: row.usageanddosage,
        inputmanid: row.inputmanid
      }).then(res => {
        if (res.status === 200) {
          this.getFindList()
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    removeEvent () {
      let row = this.$refs.formList.getSelecteds()
      if (row.length) {
        let arr = []
        for (var i = 0; i < row.length; i++) {
          arr.push(row[ i ].usageanddosageid)
        }
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 接口
          this.$api.use.del({
            usageanddosageid: arr
          }).then(res => {
            if (res.status == 200) {
              this.$message.success('删除成功')
              this.getFindList()
            } else {
              this.$message(res.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message('请至少选择一条数据！')
      }
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindList()
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
  }
}
</script>

<style scoped>

  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
    text-align: center;
  }
  .textarea>>>.el-textarea__inner{
    resize: none;
    height: 80px;
  }
</style>

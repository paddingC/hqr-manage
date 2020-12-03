<template>
  <div v-loading="loading">
    <div class="Btns" style="padding-top:10px;padding-left:15px;float: left;margin-bottom: 20px">
      <el-button size="mini" icon="fa fa-plus" type="primary" @click="addEvent">新增</el-button>
      <el-button size="mini" icon="fa fa-trash" type="danger" @click="removeEvent">批量删除</el-button>
    </div>
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  tooltip-effect="dark">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="diseases" label="常见病"></elx-editable-column>
      <elx-editable-column prop="opcode" label="操作码"></elx-editable-column>
      <elx-editable-column prop="pathogeny" label="病因"></elx-editable-column>
      <elx-editable-column prop="symptom" label="症状"></elx-editable-column>
      <elx-editable-column prop="inputmanname" label="创建人"></elx-editable-column>
      <elx-editable-column prop="inputdate" label="创建时间"></elx-editable-column>
      <elx-editable-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editEvent(scope.row)">编辑</el-button>
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
    <!--新增or编辑-->
    <el-dialog :title="cardTit==='add'?'新增':'编辑'" :visible.sync="dialogCard" class="dialogTit" width="580px">
      <el-form :model="dataForm" :inline="true" label-width="120px" ref="dataForm" style="text-align: left">
        <el-form-item
          label="常见病" prop="diseases"
          :rules="[
              { required: true, message: '请输入常见病', trigger: 'blur' }
          ]">
          <el-input v-model="dataForm.diseases" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item
          label="操作码" prop="opcode"
          :rules="[
              { required: true, message: '请输入操作码', trigger: 'blur' }
          ]">
          <el-input v-model="dataForm.opcode" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="病因">
          <el-input type="textarea" class="textarea" v-model="dataForm.pathogeny" style="width: 268px;"></el-input>
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
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      dialogCard: false,
      cardTit: 'add',
      dataForm: {
        diseasesid: '',
        inputmanid: '',
        diseases: '',
        opcode: '',
        companyid: '',
        pathogeny: '',
        symptom: '',
      }
    }
  },
  created () {
  },
  mounted () {
    this.getFindList()
  },
  methods: {
    getFindList () {
      this.loading = true
      this.$api.disease.select({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.info
          this.loading = false
        } else {
          this.loading = false
        }
      }).catch(()=>{

        this.loading = false
      })
    },
    addEvent () {
      this.cardTit = 'add'
      this.dialogCard = true
      this.dataForm = {}
    },
    editEvent(val){
      this.cardTit = 'edit'
      this.dialogCard = true
      this.dataForm = {
        companyid: val.companyid,
        diseasesid: val.diseasesid,
        diseases: val.diseases,
        opcode: val.opcode,
        pathogeny: val.pathogeny,
        symptom: val.symptom,
        inputmanid: val.inputmanid
      }
    },
    saveEdit (form) {
      let paream = {}
      console.log(this.dataForm);
      if (this.cardTit === 'add') {
        paream = {
          companyid: this.companyid,
          diseases: this.dataForm.diseases,
          opcode: this.dataForm.opcode,
          pathogeny: this.dataForm.pathogeny,
          symptom: this.dataForm.symptom
        }
      } else if (this.cardTit === 'edit') {
        paream = this.dataForm
      }
      this.$refs[ form ].validate((valid) => {
        if (valid) {
          this.$api.disease.save(paream).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
              this.dialogCard = false
              this.getFindList()
            } else{
              this.$message.error('保存失败')
            }
          })
        } else {
          return false
        }
      })
    },
    removeEvent () {
      let row = this.$refs.formList.getSelecteds()
      if (row.length) {
        let arr = []
        for (var i = 0; i < row.length; i++) {
          arr.push(row[ i ].diseasesid)
        }
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 接口
          this.$api.disease.del({
            diseasesid: arr
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

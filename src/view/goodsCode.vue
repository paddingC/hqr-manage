<template>
  <div>
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div style="margin-bottom: 20px">
          <td class="textWidth">朝阳药品编码</td>
          <td>
            <el-input v-model="formInline.drugId" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">国大POS药品编码</td>
          <td>
            <el-input v-model="formInline.posDrugId" class="inputWidth"></el-input>
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
    <div class="box">
      <el-form style="width: 100%;text-align: left" ref="tablefBtn" class="base-table6-form" size="mini" :inline="true">
        <div>
          <el-form-item>
            <el-button type="primary" @click="addEvent('form')">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="delEvent">删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downLoad">下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataImport">导入</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--表单内容-->
    <elx-editable ref="formList"
                  height="550"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  tooltip-effect="dark">
      <elx-editable-column type="selection" width="55"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="drugId" label="朝阳药品编码"></elx-editable-column>
      <elx-editable-column prop="posDrugId" label="国大POS药品编码"></elx-editable-column>
      <elx-editable-column prop="drugName" label="通用名"></elx-editable-column>
      <elx-editable-column label="操作" width="80">
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
    <!--新增-->
    <el-dialog :title="dialogType==='add'?'新增':'编辑'" @close="cancel" :visible.sync="dialogTableVisible" width="660px" class="dialogTit">
      <el-form ref="form" :model="form" label-width="150px" :rules="rules">
        <el-form-item label="朝阳药品编码" prop="drugId">
          <el-input v-model="form.drugId" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="国大POS药品编码" prop="posDrugId">
          <el-input v-model="form.posDrugId" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="通用名" prop="drugName">
          <el-input v-model="form.drugName" style="width: 268px"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </el-dialog>
    <!--导入模板-->
    <el-dialog class="dialogTit" title="导入" :visible.sync="dialogFile" width="620px" style="text-align: center">
      <el-upload
        class="upload-demo"
        :action="actionExcel"
        :on-success="filesuccess"
        :on-error="fileError"
        :data="fileparms"
        :headers="myHeaders"
        :show-file-list="false">
        <el-button size="small" type="primary">点击上传</el-button>
<!--        <div slot="tip" class="el-upload__tip">请上传excel格式文件</div>-->
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: 'goodsCode',
  data () {
    return {
      tableData: [],
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      dialogTableVisible: false,
      dialogType: '',
      formInline: {
        drugId: '',
        posDrugId: ''
      },
      form: {
        drugId: '',
        posDrugId: '',
        drugName: ''
      },
      rules: {
        drugId: [{required: true, message: '请输入朝阳药品编码', trigger: 'blur'}],
        posDrugId: [{required: true, message: '请输入国大POS药品编码', trigger: 'blur'}],
        drugName: [{required: true, message: '请输入通用名', trigger: 'blur'}]
      },
      dialogFile: false,
      actionExcel: this.global.baseUrl + 'dzsfpro/zxCY/importExcel',
      fileparms: {
        // companyid: sessionStorage.getItem('companyid')
      },
      myHeaders: {token: Cookies.get('token')}
    }
  },
  mounted () {
    this.getFindList()
  },
  methods: {
    searchEvent () {
      this.getFindList()
    },
    emptyEvent () {
      this.formInline = {}
    },
    getFindList () {
      this.$api.drug.codeList({
        drugId: this.formInline.drugId,
        posDrugId: this.formInline.posDrugId,
        page: {
          pageIndex: this.pageVO.currentPage,
          pageSize: this.pageVO.pageSize
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.total
        } else {

        }
      }).catch(err => {
        console.log(err);
      })
    },
    addEvent () {
      this.dialogType = 'add'
      this.dialogTableVisible = true
      this.form = {}
    },
    editEvent (row) {
      this.dialogType = 'edit'
      this.dialogTableVisible = true
      this.form = row
    },
    cancel () {
      this.getFindList()
      this.dialogTableVisible = false
    },
    submitForm (formName) {
      this.$refs[ formName ].validate((valid) => {
        if (valid) {
          this.$api.drug.saveOrUpdate({
            drugName: this.form.drugName,
            drugId: this.form.drugId,
            posDrugId: this.form.posDrugId,
            id: this.form.id
          }).then(res => {
            if (res.status === 200) {
              this.getFindList()
              this.dialogTableVisible = false
              this.$message.success('新增成功')
            }
          }).catch(err => {
            console.log(err);
          })
        } else {
          return false
        }
      })
    },
    delEvent () {
      let row = this.$refs.formList.getSelecteds()
      if (row.length) {
        let arr = []
        for (var i = 0; i < row.length; i++) {
          arr.push(row[i].id)
        }
        this.$confirm('确认删除选中数据吗。', '提醒', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.drug.codedelete(arr).then(res => {
            if (res.status === 200) {
              this.getFindList()
              this.dialogTableVisible = false
              this.$message.success('删除成功')
            }
          }).catch(err => {
            console.log(err);
          })
        }).catch((cancel) => {

        })
      } else {
        this.$message.warning('请选择您要删除的数据')
        return false
      }
    },
    downLoad () {
      this.$api.drug.example({}).then(res => {
        if (res.status === 200) {
          window.location.href = res.data
          this.$message.success('下载成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    dataImport () {
      this.dialogFile = true
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindList()
    },
    filesuccess (res) {
      if (res.status === 200) {
        this.$message.success(res.msg)
        setTimeout(() => {
          this.dialogFile = false
          this.getFindList()
        }, 1000)
      } else {
        this.$message.error(res.msg)
      }
    },
    fileError () {
      this.$message.error('模板导入失败')
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    }
  }
}
</script>

<style scoped>
  .textWidth {
    width         : 128px;
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
  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
  }
</style>

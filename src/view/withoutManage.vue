<template>
  <div>
    <div class="Btns" style="padding-top:10px;padding-left:15px;float: left;margin-bottom: 20px">
      <el-button size="mini"  type="primary" @click="addEvent">新增</el-button>
      <el-button size="mini"  type="primary" @click="status('on')">启用</el-button>
      <el-button size="mini"  type="primary" @click="status('off')">停用</el-button>
      <el-button size="mini"  type="danger" @click="removeEvent">批量删除</el-button>
    </div>
    <elx-editable ref="formList" border :header-cell-style="rowClass" :data.sync="tableData" tooltip-effect="dark">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="seqid" label="外部系统ID"></elx-editable-column>
      <elx-editable-column prop="systemname" label="外部系统名称"></elx-editable-column>
      <elx-editable-column prop="systemcode" label="外部系统编码"></elx-editable-column>
      <elx-editable-column prop="recipientpointname" label="处方接收门店"></elx-editable-column>
      <elx-editable-column prop="interfaceaddress" label="回调接口地址"></elx-editable-column>
      <elx-editable-column prop="auto" label="自动审方通过" :formatter="autoM"></elx-editable-column>
      <elx-editable-column prop="pharmacistname" label="缺省执业药师"></elx-editable-column>
      <elx-editable-column prop="jobFlag" label="自动分配执业药师" width="140px" :formatter="jobFlagM"></elx-editable-column>
      <elx-editable-column prop="usestatus" label="状态" :formatter="usestatusM"></elx-editable-column>
      <elx-editable-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editEvent(scope.row)">编辑</el-button>
        </template>
      </elx-editable-column>
    </elx-editable>
    <!--新增-->
    <el-dialog :title="dialogType==='add'?'新增':'编辑'" :visible.sync="dialogTableVisible" width="980px" class="dialogTit">
      <el-form :model="dataForm" :inline="true" label-width="128px" ref="dataForm" style="text-align: left">
        <el-form-item label="外部系统名称" prop="systemname"
                      :rules="[{ required: true, message: '请输入外部系统名称', trigger: 'blur'}]">
          <el-input :disabled="dialogType != 'add'" v-model="dataForm.systemname" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="外部系统编码" prop="systemcode"
                      :rules="[{ required: true, message: '请输入外部系统编码', trigger: 'blur'}]">
          <el-input :disabled="dialogType != 'add'" v-model="dataForm.systemcode" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="处方接收门店" prop="recipientpointname"
                      :rules="[{ required: true, message: '请输入处方接收门店', trigger: 'blur'}]">
          <el-input disabled='disabled' v-model="dataForm.recipientpointname" style="width: 268px"></el-input>
          <div @click="openDialog" class="el-input-group__append" style="position: absolute;top: 0;right: 0;height: 38px">
            <i class="fa fa-ellipsis-h "></i>
          </div>
        </el-form-item>
        <el-form-item label="回调接口地址" prop="interfaceaddress">
          <el-input v-model="dataForm.interfaceaddress" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="自动审方通过">
          <el-select v-model="dataForm.auto" placeholder="请选择" style="width: 268px">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺省执业药师">
          <el-input disabled='disabled' v-model="dataForm.pharmacistname" style="width: 268px"></el-input>
          <div @click="openDialogPharmacist" class="el-input-group__append" style="position: absolute;top: 0;right: 0;height: 38px">
            <i class="fa fa-ellipsis-h"></i>
          </div>
        </el-form-item>
        <el-form-item label="自动分配执业药师">
          <el-select v-model="dataForm.jobFlag" placeholder="请选择" style="width: 268px">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click.native="saveEdit('dataForm')">保存</el-button>
      </div>
    </el-dialog>
    <!-- 选择门店 -->
    <el-dialog width="620px" :visible.sync="dialogVisible" :close-on-click-modal="false" class="dialogTit" title="选择门店">
      <el-form :inline="true" :model="dataForm1">
        <el-form-item label="名称/操作码">
          <el-input v-model="dataForm1.key"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="diaSearch">查 询</el-button>
          <el-button @click="diaClear">清 空</el-button>
        </el-form-item>
      </el-form>
      <elx-editable
        ref="elxEditable2"
        border
        :header-cell-style="rowClass"
        height="320"
        size="mini"
        :data.sync="list"
        highlight-current-row
        @current-change="handleCurrentChange($event, 'door')"
        style="width: 100%">
        <elx-editable-column sortable prop="companyid" label="ID"></elx-editable-column>
        <elx-editable-column sortable prop="deptname" label="门店名称"></elx-editable-column>
      </elx-editable>
    </el-dialog>
    <!-- 选择执业药师 -->
    <el-dialog width="620px" :visible.sync="dialogPharmacist" :close-on-click-modal="false" class="dialogTit" title="选择执业药师">
      <el-form :inline="true" :model="dataFormPharmacist">
        <el-form-item label="执业药师名">
          <el-input v-model="dataFormPharmacist.key"></el-input>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="diaSearch1">查 询</el-button>
          <el-button @click="dataFormPharmacist.key=''">清 空</el-button>
        </el-form-item>
      </el-form>
      <elx-editable
        ref="elxEditable3"
        border
        :header-cell-style="rowClass"
        height="320"
        size="mini"
        :data.sync="pharmacistList"
        highlight-current-row
        @current-change="handleCurrentChange($event)"
        style="width: 100%">
        <elx-editable-column sortable prop="username" label="执业药师名"></elx-editable-column>
        <elx-editable-column sortable prop="profile" label="职业类别"></elx-editable-column>
        <elx-editable-column sortable prop="telphone" label="手机号"></elx-editable-column>
      </elx-editable>
      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="SizeChange"
          @current-change="pageChange"
          :current-page="pageVO.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageVO.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageVO.totalResult">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'withoutManage',
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      tableData: [],
      dialogTableVisible: false,
      dialogType: '',
      dataForm: {},
      dialogVisible: false,
      list: [],
      dataForm1: {},
      dialogPharmacist: false,
      pharmacistList: [],
      dataFormPharmacist: {},
      pageVO: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  },
  mounted () {
    this.findList()
  },
  methods: {
    findList () {
      this.$api.withoutMange.getOtherConfig({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addEvent () {
      this.dialogTableVisible = true
      this.dialogType = 'add'
      this.dataForm = {}
    },
    editEvent (row) {
      this.dialogTableVisible = true
      this.dialogType = 'adit'
      this.dataForm = row
    },
    openDialog () {
      this.dialogVisible = true
      this.$api.withoutMange.getDeptByKey({
        companyid: this.companyid,
        key: this.dataForm1.key
      }).then(res => {
        if (res.status === 200) {
          this.list = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    diaSearch1 () { this.openDialogPharmacist() },
    openDialogPharmacist () {
      this.dialogPharmacist = true
      let params = {
        companyid: this.companyid,
        username: this.dataFormPharmacist.key,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }
      this.$api.pharmacist.pharmacistget(params).then(res => {
        this.pharmacistList = res.data.list
        this.pageVO.totalResult = res.data.info
      }).catch(err => {
        console.log(err)
      })
    },
    diaSearch () {
      this.openDialog()
    },
    diaClear () {
      this.dataForm1 = {}
    },
    handleCurrentChange (row, type) {
      console.log(row)
      if (type === 'door') {
        this.dataForm.recipientpointname = row.deptname
        this.dataForm.recipientpointid = row.companyid
        this.dialogVisible = false
      } else {
        this.dataForm.pharmacistname = row.username
        this.dataForm.pharmacistid = row.pharmacistid
        this.dialogPharmacist = false
      }
    },
    removeEvent () {
      let rows = this.$refs.formList.getSelecteds()
      if (rows.length) {
        let newArr = []
        for (var i = 0; i < rows.length; i++) {
          newArr.push(rows[i].seqid)
        }
        this.$api.withoutMange.deleteOtherConfig({
          seqid: newArr
        }).then(res => {
          if (res.status === 200) {
            this.$message.success('删除成功')
            this.findList()
          } else {
            this.$message.error('删除失败')
          }
        })
      } else {
        this.$message.warning('请至少选择一行您要删除的数据')
      }
    },
    saveEdit (form) {
      this.$refs[ form ].validate((valid) => {
        if (valid) {
          let paream = this.dataForm
          paream.companyid = this.companyid
          this.$api.withoutMange.saveOtherConfig(paream).then(res => {
            if (res.status === 200) {
              this.$message.success('保存成功')
              this.dialogTableVisible = false
              this.findList()
            } else {
              this.$message.error('保存失败')
            }
          })
        } else {
          return false
        }
      })
    },
    status (type) {
      let status = ''
      if (type === 'on') {
        status = 1
      } else if (type === 'off') {
        status = 0
      }
      let rows = this.$refs.formList.getSelecteds()
      if (rows.length) {
        let newArr = []
        for (var i = 0; i < rows.length; i++) {
          newArr.push({
            seqid: rows[i].seqid,
            usestatus: status
          })
        }
        this.$api.withoutMange.updateOtherConfigStatus(newArr).then(res => {
          if (res.status === 200) {
            this.$message.success('修改状态成功')
            this.findList()
          } else {
            this.$message.error('修改状态失败')
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.$message.warning('请至少选择一条数据')
      }
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    usestatusM (row) {
      if (row.usestatus === '1') {
        return '启用'
      } else {
        return '停用'
      }
    },
    jobFlagM (row) {
      if (row.jobFlag === 1 || row.jobFlag === '1') {
        return '是'
      } else if (row.jobFlag === 0 || row.jobFlag === '0') {
        return '否'
      }
    },
    autoM (row) {
      if (row.auto === 1 || row.auto === '1') {
        return '是'
      } else if (row.auto === 0 || row.auto === '0') {
        return '否'
      }
    },
    SizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.openDialogPharmacist()
    },
    pageChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.openDialogPharmacist()
    }
  }
}
</script>

<style scoped>

</style>

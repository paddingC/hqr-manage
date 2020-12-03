<template>
  <div>
    <div class="heard-con" style="display: flex;width: 100%;line-height: 42px">
      <el-form :model="formInline" size="medium" :inline="true" label-width="120px" style="width: 80%;float: left">
        <el-form-item label="余量提醒设置" :required="true">
          当低于&nbsp;<el-input v-model="formInline.remindBalance" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 210px"></el-input>&nbsp;元时预警提醒
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="formInline.usestatus"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div style="width: 20%;float: right;text-align: center">
          <el-button @click="saveBalance('formInline')" type="primary" size="mini">保存设置</el-button>
      </div>
    </div>
    <div class="btn" style="margin-bottom: 12px">
      <el-button @click="addEvent" :disabled="tableData.length === 3" type="primary" size="mini">新增</el-button>
    </div>
    <!--表格-->
    <elx-editable ref="elxEditable"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  :edit-config="{trigger: 'dblclick', mode: 'row'}">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column sortable prop="personName" label="人员名称" :edit-render="{name: 'input'}"></elx-editable-column>
      <elx-editable-column sortable prop="mobile" label="电话号码" :edit-render="{name: 'input'}"></elx-editable-column>
      <elx-editable-column sortable prop="email" label="邮箱" :edit-render="{name: 'input'}"></elx-editable-column>
      <elx-editable-column label="操作" fixed="right" width="160px">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="saveEvent(scope.row)">保存</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </elx-editable-column>
    </elx-editable>
  </div>
</template>

<script>
export default {
  name: 'stockEarlyWarning',
  data () {
    return {
      companyId: sessionStorage.getItem('companyid'),
      companyname: sessionStorage.getItem('companyname'),
      formInline: {
        remindBalance: '',
        usestatus: ''
      },
      tableData: []
    }
  },
  mounted () {
    this.getfindConfig()
    this.getList()
  },
  methods: {
    getfindConfig () {
      this.$api.rechargeDetails.findConfig({
        companyId: this.companyId
      }).then(res => {
        if (res.status === 200) {
          this.formInline = res.data
          this.formInline.usestatus === 1 ? this.formInline.usestatus = true : this.formInline.usestatus = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    saveBalance () {
      if (this.formInline.remindBalance === '') {
        this.$message.warning('请输入金额')
        return false
      }
      this.$api.rechargeDetails.saveOrUpdateConfig({
        companyId: this.companyId,
        data: {
          id: this.formInline.id,
          remindBalance: this.formInline.remindBalance,
          usestatus: this.formInline.usestatus == true ? this.formInline.usestatus = 1 : this.formInline.usestatus = 0
        }
      }).then(res => {
        if (res.status === 200) {
          this.getfindConfig()
          this.$message.success('保存成功')
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    getList () {
      this.$api.rechargeDetails.findPerson({
        companyId: this.companyId
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    addEvent () {
      let status = false
      let noadd = false
      if (this.tableData.length >= 1) {
        this.tableData.forEach((item) => {
          if (item.id === undefined) {
            noadd = true
          }
          if (item.personName === '' && item.mobile === '' && item.email === '') {
            this.$message.warning('人员名称、电话号码、邮箱不能为空')
            status = true
          } else if (item.personName === '' || item.personName === null) {
            this.$message.warning('人员名称不能为空')
            status = true
          } else if (item.mobile === '' || item.mobile === null) {
            this.$message.warning('电话号码不能为空')
            status = true
          } else if (item.email === '' || item.email === null) {
            this.$message.warning('邮箱不能为空')
            status = true
          }
        })
      }
      if (status) {
        return false
      }
      if (noadd) {
        this.$message.warning('请保存后在新增')
        return false
      }
      this.$refs.elxEditable.insertAt().then(({row}) => this.$refs.elxEditable.setActiveCell(row, ''))
    },
    saveEvent (row) {
      let status = false
      let reg = /^1(2|3|4|5|6|7|8|9)\d{9}$/
      let ereg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
      if (row.personName === '' || row.personName === null) {
        this.$message.warning('人员名称不能为空')
        status = true
      } else if (row.mobile === '' || row.mobile === null) {
        this.$message.warning('电话号码不能为空')
        status = true
      } else if (row.email === '' || row.email === null) {
        this.$message.warning('邮箱不能为空')
        status = true
      }
      if (status) {
        return false
      }
      if (!reg.test(row.mobile)) {
        this.$message.warning('请输入正确的手机号')
        return false
      }
      if (!ereg.test(row.email)) {
        this.$message.warning('请输入正确的邮箱')
        return false
      }
      this.$api.rechargeDetails.saveOrUpdatePerson({
        companyId: this.companyId,
        data: row
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('保存成功')
          this.getList()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    remove (row) {
      if (row.id === undefined) {
        this.$refs.elxEditable.remove(row)
      } else {
        let ids = []
        ids.push(row.id)
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.rechargeDetails.deletePerson({
            companyId: this.companyId,
            data: ids
          }).then(res => {
            if (res.status === 200) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error('删除失败')
            }
          })
        }).catch(err => {
          console.log(err)
        })
      }
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    }
  }
}
</script>

<style scoped>

</style>

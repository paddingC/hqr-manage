<template>
  <div class="binderCon">
    <div class="binderTop">
      <el-input placeholder="请输入微信号" v-model="wxnum" class="input-with-select" style="width: 378px;">
        <el-button slot="append" icon="el-icon-circle-plus-outline" @click="bindEvent"></el-button>
      </el-input>
      <el-button @click="unBinder" class="el-icon-remove-outline pinkBtn" style="margin-left: 9px"> 解 绑</el-button>
    </div>
    <div style="height: calc(100vh - 48px - 28px - 12px - 100px);">
      <elx-editable ref="formList"
                    height="100%"
                    border :header-cell-style="rowClass"
                    :data.sync="tableData"
                    tooltip-effect="dark">
        <elx-editable-column type="selection" width="55"></elx-editable-column>
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="wechatid" label="微信号"></elx-editable-column>
        <elx-editable-column label="操作">
          <template slot-scope="scope">
            <a style="color: #3a8ee6">{{scope.row.userstr}}</a>
          </template>
        </elx-editable-column>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'appbinder',
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      wxnum: '',
      tableData: [],
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
    bindEvent () {
      this.$api.apphttp.bind({
        companyId: this.companyid,
        prodType: 2,
        type: 3,
        wechatid: this.wxnum
      }).then(res => {
        if (res.status === 200) {
          this.findList()
          this.$message.success('绑定成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err);
      })
    },
    unBinder () {
      let rows = this.$refs.formList.getSelecteds()
      if (rows.length >= 1) {
        let ids = []
        rows.forEach(i => {
          ids.push(i.id)
        })
        this.$confirm('确定解绑吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.apphttp.unbind(ids).then(res => {
            if (res.status === 200) {
              this.findList()
              this.$message.success('解绑成功')
            }
          }).catch(err => {
            console.log(err);
          })
        })
      } else {
        this.$message.warning('请至少选择一条数据')
        return false
      }
    },
    findList () {
      this.$api.apphttp.testerlist({
        companyId: this.companyid,
        prodType: 2,
        type: 3,
        wechatid: this.wxnum,
        page: {
          pageIndex: this.pageVO.currentPage,
          pageSize: this.pageVO.pageSize
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.total
        }
      }).catch(err => {
        console.log(err);
      })
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.findList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.findList()
    },
    rowClass () {
      return 'background: #FAFAFA;color:#555; height: 40px;border-bottom:dashed 1px #666;'
    }
  }
}
</script>

<style scoped>
/deep/ .el-table--enable-row-transition .el-table__body td{
  border-bottom: dashed 1px #333;
}
/deep/ .main-container .main-content{
  background: #f5f5f5!important;
}
.binderCon{
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  padding: 24px;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.binderTop{
  margin-bottom: 12px;
}
.binderCon >>>.el-input-group--append .el-input__inner, .el-input-group__prepend{
  height:28px;
  background:rgba(255,255,255,1);
  border-radius:2px;
  border:1px solid rgba(220,223,230,1);
}
.pinkBtn{
  height:28px;
  line-height: 0;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(245,108,108,1);
  background:rgba(254,240,240,1);
  border-radius:2px;
  border:1px solid rgba(251,196,196,1);
}
</style>

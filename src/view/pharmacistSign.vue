<template>
    <div>
      <div class="topBox">
        <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true" label-width="120px"
                 style="width: 80%;text-align: left;display: inline-block">
          <div>
            <td class="textWidth">执业药师</td>
            <td>
              <el-input v-model="formInline.pharmacistname" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">动作</td>
            <td>
              <el-select v-model="formInline.signType" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in signTypeArr"
                  :key="item.dictValue"
                  :label="item.dictDtlName"
                  :value="item.dictValue">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">日期</td>
            <td>
              <el-date-picker
                style="width: 320px"
                v-model="formInline.dates"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
              </el-date-picker>
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
                    :data.sync="tableData"
                    tooltip-effect="dark">
        <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="pharmacistname" label="执业药师"></elx-editable-column>
        <elx-editable-column prop="signType" label="动作" :formatter="matterSignType"></elx-editable-column>
        <elx-editable-column prop="signTime" label="日期"></elx-editable-column>
        <elx-editable-column prop="signMethod" label="方式" :formatter="matterSignMethod"></elx-editable-column>
        <elx-editable-column label="操作" fixed="right" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="lookDialog(scope.row)">查看</el-button>
          </template>
        </elx-editable-column>
      </elx-editable>
      <!--分页-->
      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageV0.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageV0.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageV0.totalResult">
        </el-pagination>
      </div>
      <!--弹框-->
      <el-dialog :title="changeTit" :visible.sync="dialogCon" width="499px">
        <div v-if="changeTit == '账号'" style="height: 262px">
          <el-input v-model="form.loginid" disabled="disabled" placeholder=""></el-input>
        </div>
        <div v-if="changeTit == '人脸'" style="height: 262px;text-align: center">
          <div style="width: 100%;height: 178px;border:solid 1px #efefef;border-radius: 5px;">
            <img :src="form.fileUrl" alt="" style="height: 100%">
          </div>
        </div>
        <div v-if="changeTit == '指纹'" style="height: 262px;text-align: center">
          <div style="width: 100%;height: 178px;border:solid 1px #efefef;border-radius: 5px;">
            <img :src="form.fileUrl" alt="" style="height: 100%">
          </div>
        </div>
        <div style="text-align: right">
          <el-button type="primary" size="litter" @click.native='dialogCon=false'>关 闭</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'pharmacistSign',
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      formInline: {
        pharmacistname: '',
        signType: '',
        dates: []
      },
      signTypeArr: [],
      tableData: [],
      pageV0: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      dialogCon: false,
      changeTit: '',
      form: {
        loginid: '',
        fileUrl: ''
      },
      DZSF_PHARMACISTSIGNMODE: []
    }
  },
  mounted () {
    this.getFindList()
    this.getNum()
  },
  methods: {
    getNum () {
      this.$api.set.batchGetDictList({
        companyId: this.companyid,
        data: ['DZSF_PHARMACISTSIGNTYPE', 'DZSF_PHARMACISTSIGNMODE']
      }).then(res => {
        if (res.status === 200) {
          this.signTypeArr = res.data.DZSF_PHARMACISTSIGNTYPE
          this.DZSF_PHARMACISTSIGNMODE = res.data.DZSF_PHARMACISTSIGNMODE
        }
      })
    },
    searchEvent () {
      this.getFindList()
    },
    emptyEvent () {
      this.formInline = {
        dates: []
      }
    },
    getFindList () {
      let begint = ''
      let entt = ''
      if (this.formInline.dates.length !== 0) {
        begint = this.formInline.dates[0]
        entt = this.formInline.dates[1]
      }
      this.$api.pharmacist.getSignRecord({
        companyid: this.companyid,
        pharmacistname: this.formInline.pharmacistname,
        beginsignTime: begint,
        endsignTime: entt,
        signType: this.formInline.signType,
        page: {
          pageIndex: this.pageV0.currentPage,
          pageSize: this.pageV0.pageSize
        }
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageV0.totalResult = res.data.total
        } else {
          this.tableData = []
          this.pageV0.totalResult = 0
        }
      })
    },
    lookDialog (row) {
      if (row.signMethod === 1) {
        this.changeTit = '指纹'
        this.form.fileUrl = row.fileUrl
      } else if (row.signMethod === 2) {
        this.changeTit = '账号'
        this.form.loginid = row.fileUrl
      } else if (row.signMethod === 3) {
        this.changeTit = '人脸'
        this.form.fileUrl = row.fileUrl
      }
      this.dialogCon = true
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    matterSignType (row, column, cellValue) {
      let text = ''
      this.signTypeArr.forEach((i) => {
        if (cellValue == i.dictValue) {
          text = i.dictDtlName
        }
      })
      return text
    },
    matterSignMethod (row, column, cellValue) {
      let text = ''
      this.DZSF_PHARMACISTSIGNMODE.forEach((i) => {
        if (cellValue == i.dictValue) {
          text = i.dictDtlName
        }
      })
      return text
    },
    handleSizeChange (pageSize) {
      this.pageV0.pageSize = pageSize
      this.getFindList()
    },
    handleCurrentChange (currentPage) {
      this.pageV0.currentPage = currentPage
      this.getFindList()
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

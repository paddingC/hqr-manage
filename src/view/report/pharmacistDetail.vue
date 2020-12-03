<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">审方开始时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.begininputdate" class="inputWidth"
                            @change="selectTimeB"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">审方结束时间</td>
          <td>
            <el-date-picker type="date" v-model="formInline.endinputdate" class="inputWidth"
                            @change="selectTimeE"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
          </td>
          <td class="textWidth">执业药师</td>
          <td>
            <el-input v-model="formInline.pharmacistname" class="inputWidth"></el-input>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">处方类型</td>
            <td>
              <el-select v-model="formInline.type" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in ztype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">处方属性</td>
            <td>
              <el-select v-model="formInline.attribute" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in attribute"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">处方来源</td>
            <td>
              <el-select v-model="formInline.comefrom" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in comefrom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </div>
          <div style="margin-top: 20px">
            <td class="textWidth">审方状态</td>
            <td>
              <el-select v-model="formInline.approvalstatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in stype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </div>
        </div>
      </el-form>
      <el-form style="float: right;width: 20%;">
        <el-form-item>
          <el-button type="primary" @click="searchEvent">查询</el-button>
          <el-button @click="emptyEvent">清空</el-button>
        </el-form-item>
      </el-form>
      <h3 @click="showHideForm" :class="inputMore==true?'arrow_active':'arrow_img'" class="arrow_img"></h3>
    </div>
    <!--表单内容-->
    <elx-editable ref="formList"
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column sortable width="110" prop="pharmacistname" label="执业药师"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="xytgp" label="西药通过(普)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="xywtgp" label="西药未通过(普)"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="zytgp" label="中药通过(普)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="zywtgp" label="中药未通过(普)"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="xytgt" label="西药通过(特)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="xywtgt" label="西药未通过(特)"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="zytgt" label="中药通过(特)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="zywtgt" label="中药未通过(特)"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="xytgm" label="西药通过(慢)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="xywtgm" label="西药未通过(慢)"></elx-editable-column>
      <elx-editable-column sortable width="130" prop="zytgm" label="中药通过(慢)"></elx-editable-column>
      <elx-editable-column sortable width="140" prop="zywtgm" label="中药未通过(慢)"></elx-editable-column>
      <elx-editable-column sortable width="110" prop="dztotalpass" label="电子通过"></elx-editable-column>
      <elx-editable-column sortable width="120" prop="dztotalrefuse" label="电子未通过"></elx-editable-column>
      <elx-editable-column sortable width="120" prop="totalpass" label="通过数汇总"></elx-editable-column>
      <elx-editable-column sortable width="120" prop="totalrefuse" label="未通过汇总"></elx-editable-column>
      <elx-editable-column sortable width="120" prop="total" label="处方数汇总"></elx-editable-column>
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
    data () {
      return {
        companyid: sessionStorage.getItem('companyid'),
        loading: false,
        formInline: {},
        inputMore: false,
        ztype: [ {label: '西药', value: 1}, {label: '草药', value: 2} ],
        comefrom: [ {label: '拍照处方', value: 1}, {label: '电子处方', value: 2} ],
        stype: [{label: '审批通过', value: 1}, {label: '审批拒绝', value: 2} ],
        attribute: [ {label: '普通处方', value: 1}, {label: '慢病处方', value: 2}, {label: '特药处方', value: 3} ],
        checkList: ['1'],
        tableData: [],
        pageVO: {
          pageSize: 10,
          currentPage: 1,
          totalResult: 0
        },
      }
    },
    mounted () {
      this.getFindDocList()
    },
    methods : {
      searchEvent () {
        this.getFindDocList()
      },
      emptyEvent () {
        this.formInline = {}
      },
      getFindDocList () {
        this.$api.pharmacists.pointPrescriptionCollectInfo({
          companyid: this.companyid,
          begininputdate: this.formInline.begininputdate,
          endinputdate: this.formInline.endinputdate,
          pharmacistname: this.formInline.pharmacistname,
          prescriptiontype: this.formInline.type, // 处方类型
          attribute: this.formInline.attribute, // 处方属性
          comefrom: this.formInline.comefrom, // 处方来源
          approvalstatus: this.formInline.approvalstatus,
          pageIndex: this.pageVO.currentPage,
          pageSize: this.pageVO.pageSize
        }).then(res => {
          if (res.status === 200) {
            this.tableData = res.data.list
            this.pageVO.totalResult = res.data.info
          } else {
            this.$message.warning('查询失败')
          }
        }).catch(err => {
          this.$message.error('查询异常')
        })
      },
      handleSizeChange (pageSize) {
        this.pageVO.pageSize = pageSize
        this.getFindDocList()
      },
      handleCurrentChange (currentPage) {
        this.pageVO.currentPage = currentPage
        this.getFindDocList()
      },
      selectTimeE (val) {this.formInline.endinputdate = val},
      selectTimeB (val) {this.formInline.begininputdate = val},
      rowClass () {return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'},
      showHideForm () {this.inputMore = !this.inputMore},
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
  .arrow_img {
    width           : 100% !important;
    margin-top      : 0px;
    border-radius   : 0 0 3px 3px;
    margin-bottom   : 20px;
    height          : 24px;
    background      : url("../../../src/assets/return_down.png") center bottom no-repeat;
    background-size : 120px auto;
    border-bottom   : 2px solid #4ebfff;
    cursor          : pointer;
  }
  .arrow_active {
    background : url("../../../src/assets/return_up.png") center bottom no-repeat;
  }
  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
  }
  .has-gutter tr th {
    background : #f00;
  }
</style>

<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div style="margin-bottom: 20px">
          <td class="textWidth">药品名</td>
          <td>
            <el-input v-model="formInline.goodsname" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">助记码</td>
          <td>
            <el-input v-model="formInline.opcode" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">状态</td>
          <td>
            <el-select v-model="formInline.usestatus" placeholder="请选择" class="inputWidth">
              <el-option
                v-for="item in ustatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
            <el-button type="primary" @click="isSataus('on')">启用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="isSataus('off')">停用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="delEvent">批量删除</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downLoad">模板下载</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="dataImport">模板导入</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="up580">上传货品至580</el-button>
          </el-form-item> -->
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
      <elx-editable-column prop="pkid" label="药品ID"></elx-editable-column>
      <elx-editable-column prop="goodsname" label="药品名"></elx-editable-column>
      <elx-editable-column prop="opcode" label="助记码"></elx-editable-column>
      <elx-editable-column prop="barCode" label="条形码"></elx-editable-column>
      <elx-editable-column prop="goodstype" label="药品规格"></elx-editable-column>
      <elx-editable-column prop="goodsunit" label="基本单位"></elx-editable-column>
      <elx-editable-column prop="prodarea" label="产地"></elx-editable-column>
      <elx-editable-column prop="specialdrug" label="是否特殊药品" width="120px" :formatter="formatterType"></elx-editable-column>
      <elx-editable-column label="价格">
        <template slot-scope="scope">
          <span @click="getPricelist(scope.row)" style="width: 100%;display: inline-block;">{{scope.row.price}}</span>
        </template>
      </elx-editable-column>
     <!--  <elx-editable-column prop="verify580Status" label="580下发状态" width="120px" :formatter="formatterStatus1"></elx-editable-column> -->
      <elx-editable-column prop="usestatus" label="状态" :formatter="formatterStatus"></elx-editable-column>
      <elx-editable-column prop="manufacturer" label="生产厂家" width="120px"></elx-editable-column>
      <elx-editable-column prop="approvedocno" label="批准文号" width="120px"></elx-editable-column>
      <elx-editable-column prop="goodsPrescription" label="是否处方药" :formatter="formatterType1" width="120px"></elx-editable-column>
      <elx-editable-column prop="goodsCategory" label="药品分类" :formatter="formatterClasstype" width="120px"></elx-editable-column>
      <elx-editable-column prop="cz" label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" :disabled="scope.row.usestatus == 1" @click="editDialog(scope.row)">编辑</el-button>
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
    <el-dialog :title="dialogType==='add'?'新增':'编辑'" :visible.sync="dialogTableVisible" width="860px" class="dialogTit">
      <el-form ref="form" :model="form" label-width="120px" :inline="true">
        <el-form-item label="药品名" prop="goodsname" :rules="[
      { required: true, message: '请输入药品名称', trigger: 'blur'  }
    ]">
          <el-input v-model="form.goodsname" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="助记码" prop="opcode">
          <el-input v-model="form.opcode" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="条形码">
          <el-input v-model="form.barCode" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="药品规格" prop="goodstype">
          <el-input v-model="form.goodstype" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="基本单位" prop="goodsunit">
          <el-input v-model="form.goodsunit" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="产地" prop="prodarea">
          <el-input v-model="form.prodarea" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="ERP货品ID" prop="erpgoodsid">
          <el-input v-model="form.erpgoodsid" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="form.manufacturer" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="是否特殊药品" prop="specialdrug">
          <el-radio-group v-model="form.specialdrug">
            <el-radio v-model="form.specialdrug" label="1">是</el-radio>
            <el-radio v-model="form.specialdrug" label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="批准文号">
          <el-input v-model="form.approvedocno" style="width: 268px"></el-input>
        </el-form-item>
        <el-form-item label="是否处方药">
          <el-radio-group v-model="form.goodsPrescription">
            <el-radio v-model="form.specialdrug" :label="0">是</el-radio>
            <el-radio v-model="form.specialdrug" :label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="药品分类">
          <el-radio-group v-model="form.goodsCategory">
            <el-radio v-model="form.specialdrug" :label="0">西药</el-radio>
            <el-radio v-model="form.specialdrug" :label="1">中成药</el-radio>
            <el-radio v-model="form.specialdrug" :label="2">中草药</el-radio>
            <el-radio v-model="form.specialdrug" :label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button @click="dialogTableVisible=!dialogTableVisible">取消</el-button>
        <el-button type="primary" :loading="subFlage" @click="submitForm('form')">保存</el-button>
      </div>
    </el-dialog>
    <!--导入模板-->
    <el-dialog class="dialogTit" title="模板导入" :visible.sync="dialogFile" width="620px" style="text-align: center">
      <el-upload
        class="upload-demo"
        :action="actionExcel"
        :on-success="filesuccess"
        :on-error="fileError"
        :data="fileparms"
        :headers="myHeaders"
        :show-file-list="false">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">请上传excel格式文件</div>
      </el-upload>
    </el-dialog>
    <!--价格列表-->
    <el-dialog title="价格列表" :visible.sync="dialogPrice">
      <elx-editable ref="childTable" height="360" border :header-cell-style="rowClass"
                    :data.sync="childtableData" tooltip-effect="dark">
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="credate" label="日期"></elx-editable-column>
        <elx-editable-column prop="price" label="价格"></elx-editable-column>
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
import XEUtils from 'xe-utils'
import XLSX from 'xlsx'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      subFlage: false,
      radio: 3,
      dialogType: 'add',
      form: {
        goodsname: '',
        opcode: '',
        goodstype: '',
        goodsunit: '',
        prodarea: '',
        specialdrug: '0',
        price: '',
        erpgoodsid: '',
        pkid: '',
        manufacturer: '',
        goodsPrescription: 1,
        goodsCategory: 3,
        barCode: '',
        approvedocno: '',
        companyid: sessionStorage.getItem('companyid')
      },
      ustatus: [
        {label: '临时', value: '0'},
        {label: '启用', value: '1'},
        {label: '停用', value: '2'}
      ],
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      tableData: [],
      dialogTableVisible: false, // 新增
      formInline: {
        goodsname: '',
        opcode: '',
        usestatus: ''
      },
      dialogFile: false,
      actionExcel: this.global.baseUrl + 'dzsf/goods/import',
      fileparms: {
        companyid: sessionStorage.getItem('companyid')
      },
      myHeaders: {token: Cookies.get('token')},
      dialogPrice: false,
      childtableData: [],
      pageV1: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      choosePrice: {}
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
      this.formInline = {
        goodsname: '',
        opcode: '',
        usestatus: ''
      }
    },
    // 价格列表
    getPricelist (row) {
      this.choosePrice = row
      this.dialogPrice = true
      this.$api.drug.getPriceReg({
        companyId: this.companyid,
        data: {
          erpgoodsid: row.erpgoodsid,
          page: {
            pageIndex: this.pageV1.currentPage,
            pageSize:  this.pageV1.pageSize
          }
        }
      }).then(res => {
        if (res.status === 200) {
          this.childtableData = res.data.list
          this.pageV1.totalResult = res.data.total
        }
      }).catch(err => {
        console.log(err);
      })
    },
    // 下载模板
    downLoad () {
      let baseUrl = 'https://incafile.s3.cn-north-1.jcloudcs.com/files/dzsfimportGoods/importGoods.xlsx'
      window.location.href = `${baseUrl}`
    },
    dataImport () {
      this.dialogFile = true
    },
    up580 () {
      let row = this.$refs.formList.getSelecteds()
      if (row.length > 0) {
        this.$api.drug.up580(row).then(res => {
          if (res.status === 200) {
            this.getFindList()
            this.$message.success('上传货品至580成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      } else {
        this.$message('请至少选择一条数据！')
        return false
      }
    },
    filesuccess (res) {
      if (res.status === 200) {
        this.$message.success('模板导入成功')
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
    // 新增.编辑提交
    submitForm (formName) {
      this.$refs[ formName ].validate((valid) => {
        if (valid) {
          this.subFlage = true
          this.$api.drug.goodsSave(this.form).then(res => {
            if (res.status === 200) {
              // this.tableData = res.data.list
              // this.pageVO.totalResult = res.data.info
              // this.loading = false
              this.dialogTableVisible = false
              this.getFindList()
              this.$message.success('成功')
              this.subFlage = false
            } else {
              // this.loading = false
              this.$message.success(res.msg)
              this.subFlage = false
            }
          }).catch(() => {
            // this.loading = false
            this.subFlage = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[ formName ].resetFields()
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    getFindList () {
      let params = {
        companyid: this.companyid,
        goodsname: this.formInline.goodsname,
        opcode: this.formInline.opcode,
        usestatus: this.formInline.usestatus,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }
      this.loading = true
      this.$api.drug.goodsFind(params).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.info
          this.loading = false
        } else {
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    addEvent (formName) {
      this.form = {
        goodsname: '',
        opcode: '',
        goodstype: '',
        goodsunit: '',
        prodarea: '',
        specialdrug: '0',
        price: '',
        erpgoodsid: '',
        pkid: '',
        barCode: '',
        manufacturer: '',
        goodsPrescription: 1,
        goodsCategory: 3,
        approvedocno: '',
        companyid: sessionStorage.getItem('companyid')
      }
      this.dialogTableVisible = true
      this.dialogType = 'add'
      // this.form.pkid = ''
      // this.$nextTick(() => {
      //   console.log(2)
      //   this.$refs[ formName ].resetFields()
      // })
    },
    syncList () {
      let row = this.$refs.elxEditable1.getSelecteds()
      if (row.length > 0) {
        let arrData = []
        for (var i = 0; i < row.length; i++) {
          arrData.push({userid: row[ i ].userid})
        }
        this.$api.pharmacist.insert({
          companyid: this.companyid,
          userid: arrData
        }).then(res => {
          if (res.status == 200) {
            this.dialogTableVisible = false
            this.$message.success('新增成功')
            this.getFindList()
          } else {
            this.$message(res.msg)
          }
        })
      } else {
        this.$message('请至少选择一条数据！')
      }
    },
    editDialog (val) {
      this.dialogTableVisible = true
      this.dialogType = 'editor'
      console.log(val)
      this.form = {
        goodsname: val.goodsname,
        opcode: val.opcode,
        goodstype: val.goodstype,
        goodsunit: val.goodsunit,
        prodarea: val.prodarea,
        specialdrug: val.specialdrug,
        price: val.price,
        erpgoodsid: val.erpgoodsid,
        pkid: val.pkid,
        barCode: val.barCode,
        manufacturer: val.manufacturer,
        goodsPrescription: val.goodsPrescription,
        goodsCategory: val.goodsCategory,
        approvedocno: val.approvedocno,
        companyid: sessionStorage.getItem('companyid')
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    saveEdit () {
      console.log(this.ruleForm)
      var data = this.ruleForm
      if (data.type == '') {
        this.$message('请选择执业类别')
        return false
      }
      this.$api.pharmacist.update(data).then(res => {
        if (res.status == 200) {
          this.$message.success('修改成功')
          this.dialogEdit = false
          this.getFindList()
        } else {
          this.$message(res.msg)
        }
      })
    },
    delEvent () {
      let row = this.$refs.formList.getSelecteds()
      if (row.length) {
        for(var i = 0; i < row.length; i++) {
          if (row[i].usestatus != 0) {
            this.$message.warning('只有临时状态的货品可删除')
            return false
          }
        }
        let pkid = row.map((item) => { return item.pkid }).toString()
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.drug.goodsDelete({
            pkid: pkid
          }).then(res => {
            if (res.status === 200) {
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
    isSataus (type) {
      let usestatus = 2
      if (type === 'on') {
        usestatus = 1
      } else if (type === 'off') {
        usestatus = 2
      }
      let rows = this.$refs.formList.getSelecteds()
      console.log(rows)
      if (rows.length) {
        let arr = []
        for (let i = 0; i < rows.length; i++) {
          arr.push({pkid: rows[ i ].pkid, usestatus: usestatus})
        }
        this.$api.drug.EnableDisable(arr).then(res => {
          if (res.status === 200) {
            this.$message.success('更改状态成功')
            this.getFindList()
          } else {
            this.$message(res.msg)
          }
        })
      } else {
        this.$message.success('请选择一行数据')
      }
    },
    formatterSex (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '男'
      } else if (cellValue == 2) {
        return cellValue = '女'
      }
    },
    formatterStatus1 (row, column, cellValue, index) {
      if (cellValue === 0) {
        return cellValue = '未下发'
      } else if (cellValue === 1) {
        return cellValue = '已下发'
      } else if (cellValue === 2) {
        return cellValue = '已审核'
      } else if (cellValue === 3) {
        return cellValue = '审核失败'
      }
    },
    formatterStatus (row, column, cellValue, index) {
      if (cellValue === '0') {
        return cellValue = '临时'
      } else if (cellValue === '1') {
        return cellValue = '启用'
      } else {
        return cellValue = '停用'
      }
    },
    formatterWork (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '空闲'
      } else if (cellValue == 1) {
        return cellValue = '工作中'
      }
    },
    formatterUse (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '停用'
      } else if (cellValue == 1) {
        return cellValue = '启用'
      }
    },
    formatterDate (row, column, cellValue, index) {
      return XEUtils.toDateString(cellValue, 'yyyy-MM-dd')
    },
    formatterType (row, column, cellValue, index) {
      return cellValue == 1 ? '是' : '否'
      // if (cellValue == 1) {
      //   return cellValue = '药学'
      // } else if (cellValue == 2) {
      //   return cellValue = '中药学'
      // } else if (cellValue == 3) {
      //   return cellValue = '药学与中药学'
      // }
    },
    formatterType1 (row, column, cellValue, index) {
      if (cellValue == 0) {
        return '是'
      } else if (cellValue == 1) {
        return '否'
      }
    },
    formatterClasstype (row, column, cellValue, index) {
      if (cellValue == 0) {
        return '西药'
      } else if (cellValue == 1) {
        return '中成药'
      } else if (cellValue == 2) {
        return '中草药'
      } else if (cellValue == 3) {
        return '其他'
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
    handleSizeChange1 (pageSize) {
      this.pageV1.pageSize = pageSize
      this.getPricelist(this.choosePrice)
    },
    handleCurrentChange1 (currentPage) {
      this.pageV1.currentPage = currentPage
      this.getPricelist(this.choosePrice)
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
  .arrow_img {
    width           : 100% !important;
    margin-top      : 0px;
    border-radius   : 0 0 3px 3px;
    margin-bottom   : 20px;
    height          : 24px;
    background      : url("./../../src/assets/return_down.png") center bottom no-repeat;
    background-size : 120px auto;
    border-bottom   : 2px solid #4ebfff;
    cursor          : pointer;
  }
  .arrow_active {
    background : url("./../../src/assets/return_up.png") center bottom no-repeat;
  }
  .dialogTit >>> .el-dialog__header {
    background : #f3f3f3 !important;
  }
</style>

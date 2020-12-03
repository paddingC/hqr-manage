<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">医生ID</td>
          <td>
            <el-input v-model="formInline.doctorid" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">医生姓名</td>
          <td>
            <el-input v-model="formInline.doctorname" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">登录账号</td>
          <td>
            <el-input v-model="formInline.loginid" class="inputWidth"></el-input>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">使用状态</td>
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
            <!--<td class="textWidth">注册证书号</td>-->
            <!--<td>-->
              <!--<el-input v-model="formInline.registdocno" class="inputWidth"></el-input>-->
            <!--</td>-->
            <!--<td class="textWidth">注册日期始</td>-->
            <!--<td>-->
              <!--<el-date-picker type="date" class="inputWidth"-->
                              <!--v-model="formInline.beginregistdate"-->
                              <!--@change="selectTimeB"-->
                              <!--format="yyyy-MM-dd"-->
                              <!--value-format="yyyy-MM-dd"></el-date-picker>-->
            <!--</td>-->
            <!--<td class="textWidth">注册日期终</td>-->
            <!--<td>-->
              <!--<el-date-picker type="date" class="inputWidth"-->
                              <!--v-model="formInline.endregistdate"-->
                              <!--@change="selectTimeE"-->
                              <!--format="yyyy-MM-dd"-->
                              <!--value-format="yyyy-MM-dd"></el-date-picker>-->
            <!--</td>-->
          </div>
          <div style="margin-top: 20px">
            <!--<td class="textWidth">执业类别</td>-->
            <!--<td>-->
              <!--<el-select v-model="formInline.type" placeholder="请选择" class="inputWidth">-->
                <!--<el-option-->
                  <!--v-for="item in ztype"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</td>-->

            <!--<td class="textWidth">在岗状态</td>-->
            <!--<td>-->
              <!--<el-select v-model="formInline.poststatus" placeholder="请选择" class="inputWidth">-->
                <!--<el-option-->
                  <!--v-for="item in gstatus"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</td>-->
            <!--<td class="textWidth">工作状态</td>-->
            <!--<td>-->
              <!--<el-select v-model="formInline.workstatus" placeholder="请选择" class="inputWidth">-->
                <!--<el-option-->
                  <!--v-for="item in wstatus"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</td>-->
          </div>
          <div style="margin-top: 20px">
            <!--<td class="textWidth">使用状态</td>-->
            <!--<td>-->
              <!--<el-select v-model="formInline.usestatus" placeholder="请选择" class="inputWidth">-->
                <!--<el-option-->
                  <!--v-for="item in ustatus"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</td>-->
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
    <div class="box">
      <el-form style="width: 100%;text-align: left" ref="tablefBtn" class="base-table6-form" size="mini" :inline="true">
        <div>
          <el-form-item>
            <el-button type="primary" icon="fa fa-plus" @click="addEvent">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-open" @click="isSataus('on')">启用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-turn-off" @click="isSataus('off')">停用</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" icon="fa fa-trash" @click="delEvent">批量删除</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!--表单内容-->
    <elx-editable ref="formList"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  tooltip-effect="dark">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="doctorname" label="医生姓名" width="80"></elx-editable-column>
      <elx-editable-column prop="loginid" label="登录账号" width="120"></elx-editable-column>
      <elx-editable-column prop="sex" label="性别" :formatter="formatterSex" width="55"></elx-editable-column>
      <elx-editable-column prop="phonenum" label='手机号' width="120"></elx-editable-column>
      <elx-editable-column prop="idcardno" label='身份证号' width="120"></elx-editable-column>
      <elx-editable-column prop="medicalinstitutions" label="医疗机构" width="150"></elx-editable-column>
      <elx-editable-column prop="department" label="科室" width="150"></elx-editable-column>
      <elx-editable-column prop="positionaltitles" label="职称" width="150"></elx-editable-column>

      <!--<elx-editable-column prop="type" label="执业类别" :formatter="formatterType"></elx-editable-column>-->
      <!--<elx-editable-column prop="registdocno" label="注册证书号" width="150" show-overflow-tooltip></elx-editable-column>-->
      <!--<elx-editable-column prop="registdate" label="注册日期" width="100" :formatter="formatterDate"></elx-editable-column>-->
      <!--<elx-editable-column prop="validdate" label="有效日期" width="100" :formatter="formatterDate"></elx-editable-column>-->
      <!--<elx-editable-column prop="companyname" label="执业单位" width="150" show-overflow-tooltip></elx-editable-column>-->

      <elx-editable-column prop="profile" show-overflow-tooltip label="简介" width="200"></elx-editable-column>
      <elx-editable-column prop="expertin" label="擅长" show-overflow-tooltip width="200"></elx-editable-column>
      <elx-editable-column prop="poststatus" label="在岗状态" :formatter="formatterPost"></elx-editable-column>
      <elx-editable-column prop="workstatus" label="工作状态" :formatter="formatterWork"></elx-editable-column>
      <elx-editable-column prop="usestatus" label="使用状态" :formatter="formatterUse"></elx-editable-column>
      <elx-editable-column prop="headimage" label="头像" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookHeadimage(scope.row, true)">查看</el-button>
        </template>
      </elx-editable-column>
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
    <!--新增-->
    <el-dialog title="新增" :visible.sync="dialogTableVisible" class="dialogTit">
      <el-form style="width: 100%;text-align: center">
        <el-form-item>
          <el-input v-model="diaSearch" style="width: 286px"></el-input>
          <el-button type="primary" @click="diaBtns">查询</el-button>
        </el-form-item>
        <el-form-item>
        </el-form-item>
      </el-form>
      <elx-editable :data.sync="gridData" border ref="elxEditable1" style="height: 420px;overflow: auto"
                    :header-cell-style="rowClass">
        <elx-editable-column type="selection" width="55"></elx-editable-column>
        <elx-editable-column prop="username" label="名称"></elx-editable-column>
        <elx-editable-column prop="sex" :formatter="formatterSex" label="性别"></elx-editable-column>
        <elx-editable-column prop="birthdate" label="生日"></elx-editable-column>
        <elx-editable-column prop="phonenum" label="手机号"></elx-editable-column>
      </elx-editable>

      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChangeC"
          @current-change="handleCurrentChangeC"
          :current-page="pageVO1.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageVO1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageVO1.totalResult">
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="syncList">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑" width="1000px" :visible.sync="dialogEdit" class="dialogTit">
      <el-form :model="dataForm" size="small" :inline="true" label-width="120px" ref="dataForm"
               style="text-align: left">
        <div class="editor">
          <div class="userImg">
            <el-form-item label="头像">
              <!--              :class="{disabled:uploadDisabled}"-->
              <!--<el-upload-->

                <!--:data="parms1" :headers="myHeaders" :action="action"-->
                <!--:on-remove="handleRemove1" :on-success="handelSuccess1"-->
                <!--:on-exceed="handleExceed"-->
                <!--:file-list="fileList1"-->
                <!--:show-file-list="false"-->
              <!--&gt;-->
                <!--<i class="el-icon-plus"></i>-->
              <!--</el-upload>-->

              <el-upload
                class="avatar-uploader upimg"
                :data="parms1" :headers="myHeaders" :action="action"
                :on-remove="handleRemove1" :on-success="handelSuccess1"
                :show-file-list="false">
                <img v-if="imgpath" :src="imgpath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </div>
          <div class="adito-disable">
            <el-form-item label="登录账号">
              <el-input v-model="dataForm.loginid" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="dataForm.doctorname" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="dataForm.sex" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="dataForm.phonenum" disabled style="width: 286px"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="身份证号">
          <el-input v-model="dataForm.idcardno" style="width: 286px"></el-input>
        </el-form-item>
        <el-form-item label="医疗机构">
          <el-input v-model="dataForm.medicalinstitutions" disabled style="width: 720px"></el-input>
        </el-form-item>

        <el-form-item label="科室">
          <el-input v-model="dataForm.department" style="width: 295px"></el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input v-model="dataForm.positionaltitles" style="width: 295px"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input type="textarea" class="textarea" v-model="dataForm.profile" style="width: 720px"></el-input>
        </el-form-item>
        <el-form-item label="擅长">
          <el-input type="textarea" class="textarea" v-model="dataForm.expertin" style="width: 720px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogEdit = false">取消</el-button>
        <el-button type="primary" @click.native="saveEdit">保存</el-button>
      </div>
    </el-dialog>

    <!--头像-->
    <el-dialog title="头像详情" :visible.sync="dialogCard" width="620px" class="dialogTit">
      <el-form label-position="right" label-width="120px" class="demo-table-expand"
               style="height: 420px;overflow: auto">
        <el-form-item label="头像：">
          <el-upload
            style="width: 260px"
            class="upload-demo"
            :data="parms1" :headers="myHeaders" :action="action"
            :on-remove="handleRemove1" :on-success="handelSuccess1"
            :on-exceed="handleExceed"
            :file-list="fileList1"
            :limit="1"
            list-type="picture">
            <el-button size="medium" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native='closeCard'>取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      formInline: {},
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      pageVO1: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      imgpath: '',
      tableData: [],
      gridData: [],
      dialogTableVisible: false, // 新增
      diaSearch: '',
      dialogEdit: false, // 修改
      zytype: [
        {value: 1, label: '药学'},
        {value: 2, label: '中药学'},
        {value: 3, label: '药学与中药学'}
      ],
      dataForm: {},
      dialogBook: false,
      action: this.global.baseUrl + 'dzsf/doctor/uploadheadimage',
      myHeaders: {token: Cookies.get('token')},
      parms: {
        type: 0,
        num: '',
        pharmacistid: ''
      },
      fileList: [],
      curPharmacistid: '',
      dialogCard: false,
      parms1: {
        doctorid: '',
        file: ''
      },
      fileList1: [],
      dialogEle: false,
      ustatus: [ {label: '启用', value: 1}, {label: '停用', value: 2} ],
      inputMore: false,
      bigImg: '',
      hasBig: false,
    }
  },
  computed: {
    uploadDisabled: function () {
      return this.fileList1.length > 0
    }
  },
  mounted () {
    this.getFindList()
  },
  methods: {
    showHideForm () {
      this.inputMore = !this.inputMore
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    searchEvent () {
      this.getFindList()
    },
    getFindList () {
      this.loading = true
      this.$api.doctor.doctorsFind({
        companyid: this.companyid,
        doctorid: this.formInline.doctorid,
        doctorname: this.formInline.doctorname,
        loginid: this.formInline.loginid,
        usestatus: this.formInline.usestatus,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }).then(res => {
        if (res.status === 200) {
          this.tableData = res.data.list
          this.pageVO.totalResult = res.data.info
          this.loading = false
        } else  {
          this.loading = false
        }
      }).catch(err => {
        console.log(err);
        this.loading = false
      })
    },
    emptyEvent () {
      this.formInline = {}
    },
    closeCard () {
      this.dialogCard = false
      this.getFindList()
    },
    // 新增查询
    diaBtns () {
      this.addEvent()
      this.diaSearch = ''
    },
    addEvent () {
      this.dialogTableVisible = true
      this.$api.doctor.findusers({
        companyid: this.companyid,
        pageIndex: this.pageVO1.currentPage,
        pageSize: this.pageVO1.pageSize,
        username: this.diaSearch
      }).then(res => {
        if (res.status == 200) {
          this.gridData = res.data.list
          this.pageVO1.totalResult = res.data.info
          console.log(res)
        }
      })
    },
    syncList () {
      let row = this.$refs.elxEditable1.getSelecteds()
      if (row.length > 0) {
        let arrData = []
        for (var i = 0; i < row.length; i++) {
          arrData.push({userid: row[ i ].userid})
        }
        this.$api.doctor.save({
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
    isSataus (type) {
      if (type == 'on') {
        type = 1
      } else if (type == 'off') {
        type = 2
      }
      let rows = this.$refs.formList.getSelecteds()
      console.log(rows)
      if (rows.length) {
        let arr = []
        for (let i = 0; i < rows.length; i++) {
          arr.push({doctorid: rows[ i ].doctorid, usestatus: type})
        }
        console.log(arr)
        this.$api.doctor.EnableDisable(arr).then(res => {
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
    editEvent (val) {
      this.dialogEdit = true
      let sexE = ''
      if (val.sex == 1){
        sexE = '男'
      } else if (val.sex == 2) {
        sexE = '女'
      }
      if (val.headimage.length >= 1) {
        this.imgpath = val.headimage[0]
      }
      this.lookHeadimage(val, false)
      this.dataForm = {
        loginid: val.loginid,
        doctorname: val.doctorname,
        sex: sexE,
        phonenum: val.phonenum,
        doctorid: val.doctorid,
        companyid: this.companyid,
        idcardno: val.idcardno,
        medicalinstitutions: val.medicalinstitutions,
        department: val.department,
        positionaltitles: val.positionaltitles,
        profile: val.profile,
        expertin: val.expertin
      }
    },
    saveEdit () {
      var data = {
        doctorid: this.dataForm.doctorid,
        companyid: this.companyid,
        idcardno: this.dataForm.idcardno,
        medicalinstitutions: this.dataForm.medicalinstitutions,
        department: this.dataForm.department,
        positionaltitles: this.dataForm.positionaltitles,
        profile: this.dataForm.profile,
        expertin: this.dataForm.expertin
      }
      this.$api.doctor.updateinfo(data).then(res => {
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
        console.log(row)
        let arr = []
        for (var i = 0; i < row.length; i++) {
          arr.push({doctorid	: row[ i ].doctorid	})
        }
        console.log(arr)
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.doctor.del(arr).then(res => {
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
    lookHeadimage (val,isShow) {
      this.fileList1 = []
      this.curPharmacistid = val.doctorid
      this.parms1.doctorid = val.doctorid
      this.dialogCard = isShow
      if (val.headimage != null) {
        console.log(2)
        this.fileList1.unshift({
          url: val.headimage
        })
      }
    },
    handleExceed () {
      this.$message.warning(`最多可上传1张`)
    },
    handelSuccess1 (response) {
      console.log(response)
      if (response.status === 200) {
        this.getFindList()
        this.fileList1 = []
        this.fileList1.unshift({
          url: response.data
        })
        this.imgpath = true
        this.dataForm.imgpath = response.data
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove1 (file) {
      console.log(this.curPharmacistid)
      this.$api.doctor.removeheadimage({
        pharmadoctoridistid: this.curPharmacistid,
        headimage: file.url
      }).then(res => {
        if (res.status === 200) {
          console.log('23')
          this.getFindList()
          this.$message.success('删除成功')
        }
      })
    },
    handleSizeChange (pageSize) {
      this.pageVO.pageSize = pageSize
      this.getFindList()
    },
    handleCurrentChange (currentPage) {
      this.pageVO.currentPage = currentPage
      this.getFindList()
    },
    handleSizeChangeC (pageSize) {
      this.pageVO1.pageSize = pageSize
      this.addEvent()
    },
    handleCurrentChangeC (currentPage) {
      this.pageVO1.currentPage = currentPage
      this.addEvent()
    },
    formatterSex (row, column, cellValue, index) {
      if (cellValue == 1) {
        return cellValue = '男'
      } else if (cellValue == 2) {
        return cellValue = '女'
      }
    },
    formatterPost (row, column, cellValue, index) {
      if (cellValue == 0) {
        return cellValue = '不在岗'
      } else if (cellValue == 1) {
        return cellValue = '在岗'
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
      if (cellValue == 1) {
        return cellValue = '启用'
      } else if (cellValue == 2) {
        return cellValue = '停用'
      }
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
  .textarea>>>.el-textarea__inner{
    resize: none;
    height: 120px;
    width: 720px;
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
    text-align: center;
  }
  .disabled >>> .el-upload--picture-card {
    display : none;
  }
  .editor {
    display         : flex;
    justify-content : space-between;

  }
  .userImg {
    width : 40%;
  }
  .adito-disable {
    width : 55%;
  }
  .imgUpload {
    display : flex;
  }
  .imgUpload .zs {
    width : 426px;
  }
  .imgUpload .dzqz {
    width : 426px;
  }
  .dialogTit >>> .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom : 12px;
  }
  .dialogTit >>> .el-dialog__body {
    padding : 14px 20px;
  }
  .upimg{
    width: 120px;
    height: 120px;
    text-align: center;
    line-height: 120px;
    border-radius: 10px;
    border: dashed 1px #DCDFE6;
  }
  .upimg img{
    width: 118px;
    height: 118px;
    border-radius: 10px;
    vertical-align: middle;
  }
</style>

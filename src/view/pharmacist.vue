<template>
  <div v-loading="loading">
    <div class="topBox">
      <el-form :model="formInline" size="medium " class="base-table6-form" :inline="true"
               style="width: 80%;text-align: left;display: inline-block">
        <div>
          <td class="textWidth">人员ID</td>
          <td>
            <el-input v-model="formInline.userid" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">姓名</td>
          <td>
            <el-input v-model="formInline.username" class="inputWidth"></el-input>
          </td>
          <td class="textWidth">登录账号</td>
          <td>
            <el-input v-model="formInline.loginid" class="inputWidth"></el-input>
          </td>
        </div>
        <div v-show="inputMore">
          <div style="margin-top: 20px">
            <td class="textWidth">注册证书号</td>
            <td>
              <el-input v-model="formInline.registdocno" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">注册日期始</td>
            <td>
              <el-date-picker type="date" class="inputWidth"
                              v-model="formInline.beginregistdate"
                              @change="selectTimeB"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </td>
            <td class="textWidth">注册日期终</td>
            <td>
              <el-date-picker type="date" class="inputWidth"
                              v-model="formInline.endregistdate"
                              @change="selectTimeE"
                              format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </td>
          </div>
          <div style="margin-top: 20px">
            <td class="textWidth">执业类别</td>
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

            <td class="textWidth">在岗状态</td>
            <td>
              <el-select v-model="formInline.poststatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in gstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
            <td class="textWidth">工作状态</td>
            <td>
              <el-select v-model="formInline.workstatus" placeholder="请选择" class="inputWidth">
                <el-option
                  v-for="item in wstatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </td>
          </div>
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
                  min-height="320px"
                  max-height="400px"
                  border :header-cell-style="rowClass"
                  :data.sync="tableData"
                  tooltip-effect="dark">
      <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
      <elx-editable-column type="index" width="55"></elx-editable-column>
      <elx-editable-column prop="username" label="姓名" width="80"></elx-editable-column>
      <elx-editable-column prop="loginid" label="登录账号" width="120"></elx-editable-column>
      <elx-editable-column prop="sex" label="性别" width="55"></elx-editable-column>
      <elx-editable-column prop="telphone" label='手机号' width="120"></elx-editable-column>
      <elx-editable-column prop="idcardno" label="身份证号" width="150" show-overflow-tooltip></elx-editable-column>
      <elx-editable-column prop="type" label="执业类别" :formatter="formatterType"></elx-editable-column>
      <elx-editable-column prop="registdocno" label="注册证书号" width="150" show-overflow-tooltip></elx-editable-column>
      <elx-editable-column prop="registdate" label="注册日期" width="100" :formatter="formatterDate"></elx-editable-column>
      <elx-editable-column prop="validdate" label="有效日期" width="100" :formatter="formatterDate"></elx-editable-column>
      <elx-editable-column prop="companyname" label="执业单位" width="150" show-overflow-tooltip></elx-editable-column>
      <elx-editable-column prop="profile" show-overflow-tooltip label="简介" width="200"></elx-editable-column>
      <elx-editable-column prop="expertin" label="擅长" show-overflow-tooltip width="200"></elx-editable-column>
      <elx-editable-column prop="poststatus" label="在岗状态" :formatter="formatterPost"></elx-editable-column>
      <elx-editable-column prop="workstatus" label="工作状态" :formatter="formatterWork"></elx-editable-column>
      <elx-editable-column prop="usestatus" label="使用状态" :formatter="formatterUse"></elx-editable-column>
      <elx-editable-column prop="headimage" label="头像" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookHeadimage(scope.row,true)">查看</el-button>
        </template>
      </elx-editable-column>
      <elx-editable-column prop="certificate" label="证书" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookZs(scope.row,true)">查看</el-button>
        </template>
      </elx-editable-column>
      <elx-editable-column prop="esignature" label="电子签章" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookQz(scope.row,true)">查看</el-button>
        </template>
      </elx-editable-column>
      <elx-editable-column prop="idcard" label="指纹" fixed="right" width="90">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" v-if="!scope.row.fingerprintlist.length" @click="lookZw(scope.row)">未注册</el-button>
          <el-button size="mini" v-else @click="lookZwreset(scope.row)">已注册</el-button>
        </template>
      </elx-editable-column>
      <elx-editable-column prop="cz" label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editDialog(scope.row)">编辑</el-button>
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
    <!--修改-->
    <el-dialog title="编辑" width="1000px" :visible.sync="dialogEdit" :close-on-click-modal="false" class="dialogTit">
      <el-form :model="dataForm" size="small" :inline="true" label-width="120px" ref="dataForm"
               style="text-align: left;height: 520px;overflow: auto">
        <div class="editor">
          <div class="userImg">
            <el-form-item label="头像">
              <!--              :class="{disabled:uploadDisabled}"-->
              <el-upload  class="userImg_img"
                :data="parms1" :headers="myHeaders" :action="action"
                :on-remove="handleRemove1" :on-success="handelSuccess1"
                :on-exceed="handleExceed" list-type="picture-card"
                :file-list="fileList1" :limit="1">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <!--<el-form-item label="头像">-->
              <!--<el-upload-->
                <!--:data="parms1" :headers="myHeaders" :action="action"-->
                <!--:show-file-list="false"-->
                <!--:on-remove="handleRemove1" :on-success="handelSuccess1" :on-exceed="handleExceed">-->
                <!--<img v-if="imageUrl" :src="fileList1" class="avatar">-->
                <!--<i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
              <!--</el-upload>-->
            <!--</el-form-item>-->
          </div>
          <div class="adito-disable">
            <el-form-item label="登录账号">
              <el-input v-model="dataForm.loginid" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="dataForm.username" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="性别">
              <el-input v-model="dataForm.sex" disabled style="width: 286px"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="dataForm.telphone" disabled style="width: 286px"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="身份证号">
          <el-input v-model="dataForm.idcardno" style="width: 720px"></el-input>
          <el-button style="position: absolute; right: 0px;top: 0" type="primary" size="small" @click="readCert">读取身份信息</el-button>
        </el-form-item>
        <el-form-item label="注册证书号">
          <el-input v-model="dataForm.registdocno" style="width: 295px"></el-input>
        </el-form-item>
        <el-form-item label="执业类别" prop="type" :rules="[
      { required: true, message: '请选择执业类别', trigger: 'blur' },
    ]">
          <el-select v-model="dataForm.type" placeholder="请选择" style="width: 295px"

          >
            <el-option
              v-for="item in zytype"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执业单位">
          <el-input disabled v-model="dataForm.companyname" style="width: 720px"></el-input>
        </el-form-item>
        <el-form-item label="注册日期">
          <el-date-picker style="width: 295px"
                          v-model="dataForm.registdate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="有效日期">
          <el-date-picker style="width: 295px"
                          v-model="dataForm.validdate"
                          type="date"
                          placeholder="选择日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <div class="imgUpload">
          <div class="zs">
            <el-form-item label="证书：">
              <el-upload
                style="width: 295px"
                class="upload-demo"
                :data="parms" :headers="myHeaders" :action="action"
                :on-preview="handlePreview" :on-success="handelSuccess"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="medium" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </div>
          <div class="dzqz">
            <el-form-item label="电子签章：">
              <a v-if="hasBig" :href="bigImg" target="_blank" style="float: right;font-size: 24px;color: #999"><i
                class="el-icon-zoom-in"></i></a>
              <el-upload

                style="width: 295px"
                class="upload-demo"
                :data="parms2" :headers="myHeaders" :action="action"
                :on-remove="handleRemove2" :on-success="handelSuccess2"
                :on-exceed="handleExceed2"
                :file-list="fileList2"
                :limit="1"
                list-type="picture">
                <el-button size="medium" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </div>

        </div>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="dataForm.profile" style="width: 720px"></el-input>
        </el-form-item>
        <el-form-item label="擅长">
          <el-input type="textarea" v-model="dataForm.expertin" style="width: 720px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogEdit = false">取消</el-button>
        <el-button type="primary" @click.native="saveEdit">保存</el-button>
      </div>
    </el-dialog>
    <!--证书-->
    <el-dialog title="证书详情" :visible.sync="dialogBook" width="620px" class="dialogTit">
      <el-form label-position="right" label-width="120px" class="demo-table-expand"
               style="height: 420px;overflow: auto">
        <el-form-item label="证书：">
          <el-upload
            style="width: 260px"
            class="upload-demo"
            :data="parms" :headers="myHeaders" :action="action"
            :on-preview="handlePreview" :on-success="handelSuccess"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture">
            <el-button size="medium" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native='closeBook'>取消</el-button>
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
    <!--电子签章-->
    <el-dialog title="电子签章" :visible.sync="dialogEle" width="620px" class="dialogTit">
      <el-form label-position="right" label-width="120px" class="demo-table-expand"
               style="height: 420px;overflow: auto">
        <el-form-item label="电子签章：">
          <a v-if="hasBig" :href="bigImg" target="_blank" style="float: right;font-size: 24px;color: #999"><i
            class="el-icon-zoom-in"></i></a>
          <el-upload
            style="width: 260px"
            class="upload-demo"
            :data="parms2" :headers="myHeaders" :action="action"
            :on-remove="handleRemove2" :on-success="handelSuccess2"
            :on-exceed="handleExceed2"
            :file-list="fileList2"
            :limit="1"
            list-type="picture">
            <el-button size="medium" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native='dialogEle = false'>取 消</el-button>
      </div>
    </el-dialog>
    <!--注册指纹-->
    <el-dialog title="注册" :visible.sync="dialogFinger" width="620px" class="dialogTit"
               :close-on-click-modal="false" @close="closeFinger">
      <div class="showFinger">
        <div class="fingerLeft">
          <div class="fingerTop">
            <img :src="base64FPImg">
          </div>
          <div class="fingerBottom">
            <div class="leftFinger">
              <li v-for="(item, index) in fingerLeftList" :key="index" :class="'finger'+index" @click="leftFinger(index, $event)"></li>
              <span class="fingerl"></span>
            </div>
            <div class="rightFinger">
              <li v-for="(item, index) in fingerRightList" :key="index" :class="'finger'+index" @click="rightFinger(index, $event)"></li>
              <span class="fingerl"></span>
            </div>
          </div>
        </div>
        <div class="fingerRight">
          <p>{{fingerInfo}}</p>
          <ul class="showOk">
            <li v-for="(item, index) in fingerVal" :key="index" ></li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native='fingerCancel'>取 消</el-button>
        <el-button @click.native='fingerSure'>确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import Cookies from 'js-cookie'
import $ from 'jquery'
export default {
  data () {
    return {
      companyid: sessionStorage.getItem('companyid'),
      loading: false,
      formInline: {
        userid: '',
        username: '',
        loginid: '',
        type: '',
        registdocno: '',
        poststatus: '',
        workstatus: '',
        usestatus: '',
        beginregistdate: '',
        endregistdate: ''
      },
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
      fileList3: [],
      tableData: [],
      gridData: [],
      dialogTableVisible: false, // 新增
      diaSearch: '',
      dialogEdit: false, // 修改
      zytype: [
        {value: 1, label: '药学'},
        {value: 2, label: '中药学'}
        //, {value: 3, label: '药学与中药学'}
      ],
      dataForm: {},
      dialogBook: false,
      action: this.global.baseUrl + 'dzsf/pharmacist/uploadfile',
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
        type: 4,
        num: '',
        pharmacistid: ''
      },
      fileList1: [],
      dialogEle: false,
      fileList2: [],
      parms2: {
        type: 2,
        pharmacistid: ''
      },
      parms3: {
        type: 2,
        num: '',
        pharmacistid: ''
      },
      gstatus: [ {label: '在岗', value: 1}, {label: '不在岗', value: 0} ],
      wstatus: [ {label: '工作中', value: 1}, {label: '空闲', value: 0} ],
      ustatus: [ {label: '启用', value: 1}, {label: '停用', value: 0} ],
      ztype: [
        {label: '药学', value: 1},
        {label: '中药学', value: 2}
        // ,{label: '药学与中药学', value: 3}
      ],
      inputMore: false,
      bigImg: '',
      hasBig: false,
      needDate: {}, // 当前行
      dialogFinger: false,
      fingerLeftList: [{}, {}, {}, {}, {}],
      fingerRightList: [{}, {}, {}, {}, {}],
      fingerVal: [{}, {}, {}],
      fingerInfo: '请选择手指:',
      isfingerCur: false,
      selectfingerIndex: -1,
      base64FPImg: '',
      collCount: 0, // 采集进度
      timer: null,
      curIndex: -1,
      curSelectli: null,
      fpTemplate: '',
      SuccessFps: [],
      imageUrl:  false
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
    fingerMain (key) {
    },
    showHideForm () {
      this.inputMore = !this.inputMore
    },
    rowClass () {
      return 'background: #f3f3f3;color:#555;border-color:#dddfe7;'
    },
    searchEvent () {
      this.getFindList()
    },
    // 新增查询
    diaBtns () {
      this.addEvent()
      this.diaSearch = ''
    },
    getFindList () {
      if (this.formInline.type == '药学') {
        this.formInline.type = 1
      } else if (this.formInline.type == '中药学') {
        this.formInline.type = 2
      }
      // else if (this.formInline.type == '药学与中药学') {
      //   this.formInline.type = 3
      // }
      let params = {
        companyname: this.formInline.companyname,
        userid: this.formInline.userid,
        username: this.formInline.username,
        loginid: this.formInline.loginid,
        type: this.formInline.type,
        registdocno: this.formInline.registdocno,
        poststatus: this.formInline.poststatus,
        workstatus: this.formInline.workstatus,
        usestatus: this.formInline.usestatus,
        beginregistdate: this.formInline.beginregistdate,
        endregistdate: this.formInline.endregistdate,
        companyid: this.companyid,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize
      }
      this.loading = true
      this.$api.pharmacist.pharmacistget(params).then(res => {
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
    emptyEvent () {
      this.formInline = {}
    },
    addEvent () {
      this.dialogTableVisible = true
      this.$api.pharmacist.findPage({
        companyid: this.companyid,
        pageIndex: this.pageVO1.currentPage,
        pageSize: this.pageVO1.pageSize,
        username: this.diaSearch
      }).then(res => {
        if (res.status == 200) {
          this.gridData = res.data.list
          this.pageVO1.totalResult = res.data.info
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
      this.lookZs(val, false)
      this.lookQz(val, false)
      this.lookHeadimage(val, false)
      this.dialogEdit = true
      if (val.type) {
        val.type = Number(val.type)
      }
      let cellVal = XEUtils.toDateString(val.registdate, 'yyyy-MM-dd')
      if (val.validdate) {

      }
      this.fileList3 = []
      this.dataForm = val

    },
    readCert() {
      //读取身份证信息
      let that = this
      $.ajax({
        type: 'GET',
        "url": "http://localhost:8099/?cmd=readCard&charset=gbk",
        "cache": false,
        "dataType": "jsonp",
        "jsonp": "callback",
        "jsonpCallback": "fnCallback",
        success: function (res) {
          console.log(res)
          that.fileList1 = []
          if (res.resultFlag === 0) {
            that.fileList1.unshift({
              url: "data:image/jpg;base64," + res.resultContent.identityPic
            })
            let idPic = "data:image/jpg;base64," + res.resultContent.identityPic
            that.dataForm.idcardno = res.resultContent.certNumber
            that.saveHeadimage(idPic)
          } else {
            that.resultFlag = false
            that.$confirm('读取身份证信息失败', '提示', {
              confirmButtonText: '再试一次',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.readCert()
            }).catch(() => {
            })
          }
        },
        error: function () {

        }
      })
    },
    saveHeadimage (idPic) {
      this.$api.pharmacist.uploadHeadImage({
        headimageBase64: idPic,
        pharmacistid: this.dataForm.pharmacistid
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('读取成功')
        }
      })
    },
    saveEdit () {
      console.log(this.dataForm)
      var data = {
        idcardno: this.dataForm.idcardno,
        registdocno: this.dataForm.registdocno,
        type: this.dataForm.type,
        registdate: this.dataForm.registdate,
        validdate: this.dataForm.validdate,
        profile: this.dataForm.profile,
        expertin: this.dataForm.expertin,
        pharmacistid: this.dataForm.pharmacistid
      }
      console.log(data)

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
        console.log(row)
        let arr = []
        for (var i = 0; i < row.length; i++) {
          arr.push({pharmacistid: row[ i ].pharmacistid})
        }
        console.log(arr)
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.pharmacist.del(arr).then(res => {
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
    isSataus (type) {
      if (type == 'on') {
        type = 1
      } else if (type == 'off') {
        type = 0
      }
      let rows = this.$refs.formList.getSelecteds()
      console.log(rows)
      if (rows.length) {
        let arr = []
        let istype = ''
        let isregistdate = ''
        let isregistdocno = ''
        for (let i = 0; i < rows.length; i++) {
          arr.push({pharmacistid: rows[ i ].pharmacistid, usestatus: type})
          istype += rows[ i ].type
          isregistdate += rows[ i ].isregistdate
          isregistdocno += rows[ i ].registdocno
        }

        console.log(arr)
        this.$api.pharmacist.updatestatus(arr).then(res => {
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
    selectTime (val) {
      this.dataForm.registdate = val
    },
    selectTimeB (val) {
      this.formInline.beginapprovaldate = val
    },
    selectTimeE (val) {
      this.formInline.endapprovaldate = val
    },
    // 指纹
    closeFinger () {
      this.dialogFinger = false
      this.fingerInfo = '请选择手指:'
      this.cancelCapture()
      this.collCount = 0
      this.setProgress()
      if (this.curSelectli != null) {
        this.curSelectli.removeClass('fingerblack' + this.curIndex)
      }
      for (var i = 0; i < this.SuccessFps.length; i++) {
        let idx = this.SuccessFps[i].index
        if (idx >= 5) {
          idx -= 5
        }
        this.SuccessFps[i].itemli.removeClass('fingerblack' + idx)
        this.SuccessFps[i].itemli.removeClass('fingercur' + idx)
      }
      this.SuccessFps = []
      this.base64FPImg = ''
      this.getFindList()
    },
    leftFinger (index, e) {
      for (var i = 0; i < this.SuccessFps.length; i++) {
        if (this.SuccessFps[i].index == index) {
          this.$confirm('该指头已注册成功！', '提示')
          return false
          return false
        }
      }
      if (this.curIndex > -1) {
        this.cancelCapture()
        $(e.target).addClass('fingerblack' + index)
        this.curSelectli.removeClass('fingerblack' + this.curIndex)
      } else {
        $(e.target).addClass('fingerblack' + index)
      }
      if (this.curIndex == index) {
        this.curIndex = -1
        this.fingerInfo = '请选择手指:'
      } else {
        this.curIndex = index
        this.curSelectli = $(e.target)
        this.selectfingerIndex = index
      }

      this.CollectionFiger()
    },
    rightFinger (index, e) {
      for (var i = 0; i < this.SuccessFps.length; i++) {
        if (this.SuccessFps[i].index == (index + 5)) {
          this.$confirm('该指头已注册成功！', '提示')
          return false
          return false
        }
      }
      if (this.curIndex > -1) {
        this.cancelCapture()
        $(e.target).addClass('fingerblack' + index)
        this.curSelectli.removeClass('fingerblack' + this.curIndex)
      } else {
        $(e.target).addClass('fingerblack' + index)
      }
      if (this.curIndex == index) {
        this.curIndex = -1
        this.fingerInfo = '请选择手指:'
      } else {
        this.curIndex = index
        this.curSelectli = $(e.target)
        this.selectfingerIndex = index + 5
      }
      this.CollectionFiger()
    },
    CollectionFiger () {
      let that = this
      $.ajax({
        type: 'Get',
        url: 'http://127.0.0.1:22001/zkbioonline/fingerprint/beginCapture?type=1&FakeFunOn=0',
        dataType: 'json',
        async: true,
        success: function (result) {
          // 返回码
          var ret = null
          ret = result.ret
          // 接口调用成功返回时
          if (ret == 0) {
            // 显示指纹
            that.fingerInfo = '按压剩余次数:3'
            that.collCount = 0
            that.setProgress()
            that.checkColl()
          } else if (ret == -2001) {
            // 未检测到指纹仪
          } else if (ret == -2002) {
            // 未检测到指纹仪
          } else if (ret == -2005) {
            // 未检测到指纹仪
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert('请安装指纹驱动或启动该服务!')
        }
      })
    },
    checkColl () {
      // this.base64FPImg=""
      let ret = null
      let that = this
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:22001/zkbioonline/fingerprint/getImage',
        dataType: 'json',
        async: true,
        success: function (result) {
          // alert(objToStr(data));
          // 指纹采集次数
          that.collCount = 0
          ret = result.ret
          if (ret === 0) {
            // console.log(result.data)
            that.collCount = result.data.enroll_index
            that.base64FPImg = 'data:image/jpeg;base64,' + result.data.jpg_base64
            that.fingerInfo = '按压剩余次数:' + (3 - that.collCount)
            console.log('指纹码图片：', that.base64FPImg)
            that.setProgress()
          }
          if (that.collCount !== 3) {
            // 定时器
            that.timer = setTimeout(that.checkColl(), 200)// 比对失败重新开始
          } else {
            // 显示指纹图像
            console.log('指纹码采集成功 ')
            that.fingerInfo = '已成功采集图像！'
            that.getFPTemplate()
            that.curSelectli.addClass('fingercur' + that.curIndex)
            that.SuccessFps.push({index: that.selectfingerIndex, itemli: that.curSelectli})
            that.curIndex = -1
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert('请安装指纹驱动或启动该服务!')
          // messageBox({messageType: "alert", title: "${common_prompt_title}", text: "${base_fp_connectPrompt}"});
        }
      })
    },
    setProgress () {
      console.log(this.fingerVal[0])
      $('.showOk li').eq(this.collCount - 1).addClass('greenli')
      if (this.collCount == 0) {
        $('.showOk li').removeClass('greenli')
      } else if (this.collCount == 3) {
        $('.showOk li').addClass('greenli')
      } else if (this.collCount == 2) {
        $('.showOk li').eq(0).addClass('greenli')
        $('.showOk li').eq(1).addClass('greenli')
        $('.showOk li').eq(2).removeClass('greenli')
      } else {
        $('.showOk li').eq(0).addClass('greenli')
        $('.showOk li').eq(1).removeClass('greenli')
        $('.showOk li').eq(2).removeClass('greenli')
      }
    },
    getFPTemplate () {
      let that = this
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:22001/zkbioonline/fingerprint/getTemplate',
        dataType: 'json',
        async: false,
        success: function (result) {
          // 返回码
          var ret = null
          ret = result.ret
          if (ret == 0) {
            that.fpTemplate = result.data.template
            console.log('指纹模版：' + that.fpTemplate)
            // 发送指纹模版 和指头索引 that.selectfingerIndex
            that.$api.pharmacist.saveFingerPoint({
              pharmacistid: that.needDate.pharmacistid,
              fingerprintno: that.selectfingerIndex,
              fingerprint: that.fpTemplate
            }).then(res => {
              if (res.status === 200) {
                that.$message.success('注册成功')
              } else {
                that.$message.error('注册失败，请重新尝试')
              }
            }).catch(err => {
              that.$message.error('注册异常，请重新尝试')
              console.log(err)
            })
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
      })
    },
    // 取消采集
    cancelCapture () {
      let that = this
      clearTimeout(that.timer)
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:22001/zkbioonline/fingerprint/cancelCapture',
        dataType: 'json',
        async: true,
        success: function (result) {
          console.log(result)
          that.collCount = 0
          that.fingerInfo = '请选择手指:'
          that.setProgress()
          // if ()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert('请安装指纹驱动或启动该服务!')
          // messageBox({messageType: "alert", title: "${common_prompt_title}", text: "${base_fp_connectPrompt}"});
        }
      })
    },
    // 指纹注册确认
    fingerSure () {
      this.closeFinger()
    },
    // 指纹注册取消
    fingerCancel () {
      this.closeFinger()
    },
    lookZw (val) {
      this.dialogFinger = true
      this.needDate = val
    },
    lookZwreset (val) {
      this.$confirm('已注册,是否重新注册?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogFinger = true
        this.needDate = val
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消重新注册'
        })
      })
    },
    // 证书
    lookZs (val, isShow) {
      this.fileList = []
      this.curPharmacistid = val.pharmacistid
      this.parms.pharmacistid = val.pharmacistid
      this.dialogBook = isShow
      if (val.certificate) {
        val.certificate.forEach((item) => {
          this.fileList.unshift({
            url: item
          })
        })
      }
    },
    // 头像
    lookHeadimage (val, isShow) {
      this.fileList1 = []
      this.curPharmacistid = val.pharmacistid
      this.parms1.pharmacistid = val.pharmacistid
      this.dialogCard = isShow
      if (!val.headimage || val.headimage == null) {
        return false
      }
      this.fileList1.unshift({
        url: val.headimage
      })
    },
    // 电子签章
    lookQz (val, isShow) {
      this.fileList2 = []
      this.curPharmacistid = val.pharmacistid
      this.parms2.pharmacistid = val.pharmacistid
      this.dialogEle = isShow
      if (val.esignature != null || val.esignature != undefined) {
        this.fileList2.unshift({
          url: val.esignature
        })
        this.bigImg = val.esignature
        this.hasBig = true
      } else {
        this.hasBig = false
      }
    },
    closeCard () {
      this.dialogCard = false
      this.getFindList()
    },
    closeBook () {
      this.dialogBook = false
      this.getFindList()
    },
    // 证书
    handelSuccess (response) {
      if (response.status === 200) {
        this.getFindList()
        this.fileList.unshift({
          url: response.data
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove (file) {
      this.$api.pharmacist.delcertificate({
        pharmacistid: this.curPharmacistid,
        path: file.url
      }).then(res => {
        if (res.status === 200) {
          this.getFindList()
          this.$message.success('删除成功')
        }
      })
    },
    handlePreview () {},
    handelSuccess1 (response) {
      console.log(response.data[0]);
      console.log(response.status);
      if (response.status === 200) {
        this.getFindList()
        this.fileList1 = []
        this.fileList1.unshift({
          url: response.data[0]
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove1 (file) {
      this.$api.pharmacist.delheadimage({
        pharmacistid: this.curPharmacistid,
        path: file.url
      }).then(res => {
        if (res.status === 200) {
          this.getFindList()
          this.$message.success('删除成功')
        }
      })
    },
    handleExceed () {
      this.$message.warning(`最多可上传1张`)
    },
    handleExceed2 () {
      this.$message.warning(`最多可上传1张`)
    },
    handelSuccess2 (response) {
      if (response.status === 200) {
        this.getFindList()
        this.fileList2.unshift({
          url: response.data
        })
        this.bigImg = response.data
        this.hasBig = true
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove2 (file) {
      this.$api.pharmacist.delesignature({
        pharmacistid: this.curPharmacistid,
        path: file.url
      }).then(res => {
        if (res.status === 200) {
          this.getFindList()
          this.$message.success('删除成功')
        }
      })
    },
    handlePreview3 () {
      this.dialogVisible = true
    },
    handelSuccess3 (response) {
      if (response.status === 200) {
        this.getFindList()
        this.fileList3.unshift({
          url: response.data
        })
      } else {
        this.fileList3 = []
        this.$message.error('上传失败')
      }
    },
    handleRemove3 (file) {
      this.fileList3 = []
      this.$api.pharmacist.delcertificate({
        pharmacistid: this.curPharmacistid,
        path: file.url
      }).then(res => {
        if (res.status === 200) {
          this.getFindList()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
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
      if (cellValue == 1) {
        return cellValue = '药学'
      } else if (cellValue == 2) {
        return cellValue = '中药学'
      }
      // else if (cellValue == 3) {
      //   return cellValue = '药学与中药学'
      // }
    }
  }
}
</script>

<style scoped>
  .userImg_img{
    width: 42px;
  }
  .showFinger{
    background: #fff;
    height: 420px;
    width: 100%;
  }
  .fingerLeft{
    float: left;
    width: 60%;
    height: 420px;
  }
  .fingerTop{
    position: relative;
    background: url("../assets/base_fpVerify_clearImage.png") no-repeat;
    z-index: 999;
    height: 230px;
    width: 100%;
    margin-left: 105px;
    text-align: center;
  }
  .fingerTop img{
    position: absolute;
    width: 100px;
    height: 140px;
    left: 14px;
    top: 10px;
    border-radius: 180px;
  }
  .fingerBottom {
    margin-left: 12px;
    margin-right: 12px;
  }
  .leftFinger{
    width: 50%;
    position: relative;
    float: left;
  }
  .rightFinger{
    width: 50%;
    position: relative;
    float: right;
    transform: rotateY(180deg);
  }
  .fingerBottom li{
    float: left;
    list-style: none;
  }
  .fingerl {
    background: url("../assets/fingerl.png") no-repeat;
    height: 120px;
    width: 90px;
    position: absolute;
    left: 0px;
    top: 80px;
  }
  .fingerblack0{
    background: url("../assets/fingerblack1.png") no-repeat!important;
  }
  .fingerblack1{
    background: url("../assets/fingerblack2.png") no-repeat!important;
  }
  .fingerblack2{
    background: url("../assets/fingerblack3.png") no-repeat!important;
  }
  .fingerblack3{
    background: url("../assets/fingerblack4.png") no-repeat!important;
  }
  .fingerblack4{
    background: url("../assets/fingerblack5.png") no-repeat!important;
  }
  .fingercur0 {
    background: url("../assets/fingercur1.png") no-repeat!important;
  }
  .fingercur1{
    background: url("../assets/fingercur2.png") no-repeat!important;
  }
  .fingercur2{
    background: url("../assets/fingercur3.png") no-repeat!important;
  }
  .fingercur3{
    background: url("../assets/fingercur4.png") no-repeat!important;
  }
  .fingercur4{
    background: url("../assets/fingercur5.png") no-repeat!important;
  }
  .finger0 {
    background: url("../assets/finger1.png") no-repeat;
    height: 68px;
    width: 22px;
    position: absolute;
    top: 15px;
    left: 0px;
  }
  .finger1{
    background: url("../assets/finger2.png") no-repeat;
    height: 78px;
    width: 28px;
    position: absolute;
    top: 5px;
    left: 25px;
  }
  .finger2{
    background: url("../assets/finger3.png") no-repeat;
    height: 80px;
    width: 36px;
    position: absolute;
    top: 0px;
    left: 50px;
  }
  .finger3{
    background: url("../assets/finger4.png") no-repeat;
    height: 68px;
    width: 42px;
    position: absolute;
    top: 24px;
    left: 80px;
  }
  .finger4{
    background: url("../assets/finger5.png") no-repeat;
    height: 68px;
    width: 50px;
    position: absolute;
    left: 90px;
    top: 100px;
  }
  .fingerRight{
    float: right;
    width: 40%;
    height: 420px;
  }
  .fingerRight p{
    text-align: center;
  }
  .showOk{

  }
  .greenli{
    background: #5daf34!important;
  }
  .showOk li{
    background: #b1b1b1;
    width: 42px;
    height: 22px;
    margin-right: 12px;
    float: left;
    list-style: none;
  }
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
</style>

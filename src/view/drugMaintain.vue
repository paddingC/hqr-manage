<template>
  <div class="drugMaintainMain">
    <div class="drugMaintainLeft">
      <div>
        <el-button size="mini" type="primary" @click="mainAdd">新增</el-button>
        <el-button size="mini" type="primary" @click="mainEdit">修改</el-button>
        <el-button size="mini" type="danger" @click="mainDelete">删除</el-button>
      </div>
      <ul>
        <li
          v-for="(item, index) in MaintainList"
          :key="index"
          :class="maintainCur==index?'classCur':''"
          @click="maintainClick(item, index)"
        >{{item.popularizename}}</li>
      </ul>
    </div>
    <div class="drugMaintainRight">
      <div class="topBox">
        <el-form
          :model="formInline"
          size="medium "
          class="base-table6-form"
          :inline="true"
          style="width: 80%;text-align: left;display:inline-block"
        >
          <div>
            <td class="textWidth">助记码</td>
            <td>
              <el-input v-model="formInline.opcode" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">药品名称</td>
            <td>
              <el-input v-model="formInline.goodsname" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">产地</td>
            <td>
              <el-input v-model="formInline.prodarea" class="inputWidth"></el-input>
            </td>
          </div>
          <div v-show="inputMore">
            <div style="margin-top: 20px">
              <td class="textWidth">ERP货品ID</td>
              <td>
                <el-input v-model="formInline.erpgoodsid" class="inputWidth"></el-input>
              </td>
            </div>
          </div>
        </el-form>
        <el-form style="float: right;width: 20%;">
          <el-form-item>
            <el-button type="primary" @click="searchEvent('Tab')">查询</el-button>
            <el-button @click="emptyEvent('Tab')">清空</el-button>
          </el-form-item>
        </el-form>
        <h3
          @click="showHideForm"
          :class="inputMore==true?'arrow_active':'arrow_img'"
          class="arrow_img"
        ></h3>
      </div>
      <div style="margin-bottom: 20px">
        <el-button size="mini" type="primary" @click="changeDrugs">选择药品</el-button>
        <el-button size="mini" type="danger" @click="deleteCheckDrugs">移除药品</el-button>
      </div>
      <elx-editable
        ref="formList"
        height="550"
        border
        :header-cell-style="rowClass"
        :data.sync="tableData"
        tooltip-effect="dark"
      >
        <elx-editable-column type="selection" width="55"></elx-editable-column>
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop="goodsname" label="药品名"></elx-editable-column>
        <elx-editable-column prop="goodstype" label="药品规格"></elx-editable-column>
        <elx-editable-column prop="goodsunit" label="基本单位"></elx-editable-column>
        <elx-editable-column prop="prodarea" label="产地"></elx-editable-column>
        <elx-editable-column prop="specialdrug" label="是否特殊药品" :formatter="formatterType"></elx-editable-column>
        <elx-editable-column prop="erpgoodsid" label="ERP货品ID"></elx-editable-column>
        <elx-editable-column prop="pkid" label="药品ID"></elx-editable-column>
        <elx-editable-column prop="cz" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="deleteRowDrugs(scope)">移除</el-button>
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
          :total="pageVO.totalResult"
        ></el-pagination>
      </div>
    </div>
    <!--新增/修改主推-->
    <el-dialog
      :title="mainTit=='add'?'新增':'修改'"
      :visible.sync="dialogMain"
      class="dialogTit"
      width="420px"
    >
      <div>
        <span style="color: #ff4d51">主推级别名称</span>
        <el-input
          v-model="checkMainParams.popularizename"
          v-show="mainTit=='edit'"
          style="width: 286px"
        ></el-input>
        <el-input
          v-model="newMainParams.popularizename"
          v-show="mainTit=='add'"
          style="width: 286px"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogMain = false">取 消</el-button>
        <el-button type="primary" @click="submitMain">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择药品-->
    <el-dialog title="选择药品" :visible.sync="dialogDrugs" class="dialogTit" width="860px">
      <div>
        <el-form
          :model="formInline1"
          size="small "
          class="base-table6-form"
          :inline="true"
          style="width: 80%;text-align: left;display: inline-block"
        >
          <div>
            <td class="textWidth">助记码</td>
            <td>
              <el-input v-model="formInline1.opcode" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">药品名称</td>
            <td>
              <el-input v-model="formInline1.goodsname" class="inputWidth"></el-input>
            </td>
          </div>
          <div style="margin-top: 10px; margin-bottom: 10px">
            <td class="textWidth">产地</td>
            <td>
              <el-input v-model="formInline1.prodarea" class="inputWidth"></el-input>
            </td>
            <td class="textWidth">ERP货品ID</td>
            <td>
              <el-input v-model="formInline1.erpgoodsid" class="inputWidth"></el-input>
            </td>
          </div>
        </el-form>
        <el-form style="float: right;width: 20%;margin-top: 20px">
          <el-form-item>
            <el-button type="primary" @click="searchEvent('aTab')">查询</el-button>
            <el-button @click="emptyEvent('aTab')">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <elx-editable
        ref="changeList"
        height="320"
        border
        :header-cell-style="rowClass"
        :data.sync="changeTable"
        tooltip-effect="dark"
      >
        <elx-editable-column type="selection" width="55"></elx-editable-column>
        <elx-editable-column type="index" width="55"></elx-editable-column>
        <elx-editable-column prop label="主推级别"></elx-editable-column>
        <elx-editable-column prop="goodsname" label="药品名"></elx-editable-column>
        <elx-editable-column prop="goodstype" label="药品规格"></elx-editable-column>
        <elx-editable-column prop="goodsunit" label="基本单位"></elx-editable-column>
        <elx-editable-column prop="prodarea" label="产地"></elx-editable-column>
        <elx-editable-column
          prop="specialdrug"
          label="是否特殊药品"
          width="120px"
          :formatter="formatterType"
        ></elx-editable-column>
        <elx-editable-column prop="erpgoodsid" label="ERP货品ID" width="120px"></elx-editable-column>
        <elx-editable-column prop="pkid" label="药品ID"></elx-editable-column>
      </elx-editable>
      <!--分页-->
      <div class="block" style="margin: 20px; text-align: right">
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="pageV1.currentPage"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="pageV1.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageV1.totalResult"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDrugs = false">取 消</el-button>
        <el-button type="primary" @click="syncList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "drugMaintain",
  data() {
    return {
      companyid: sessionStorage.getItem("companyid"),
      MaintainList: [],
      maintainCur: 0,
      formInline: {
        opcode: undefined,
        goodsname: undefined,
        prodarea: undefined,
        erpgoodsid: undefined
        // popularizeid:MaintainList[0]
      },
      inputMore: false,
      tableData: [],
      pageVO: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      dialogDrugs: false,
      formInline1: {},
      changeTable: [
        // { goodsname: "头孢" },
        // { goodsname: "感冒颗粒" },
        // { goodsname: "三九胃泰" },
        // { goodsname: "阿莫西林" }
      ],
      pageV1: {
        pageSize: 10,
        currentPage: 1,
        totalResult: 0
      },
      mainTit: "",
      dialogMain: false,
      maintainVal: "",
      // maintainFlage: false,
      maintainNeed: {},
      checkMainParams: {},
      // 新增
      newMainParams: {}
    };
  },
  mounted() {
    let _this = this;
    axios.all([_this.getPopularize()]).then(
      axios.spread(function(acct, perms) {
        _this.getFindList();
      })
    );
  },
  methods: {
    maintainClick(val, idx) {
      console.log(idx);
      console.log(val);
      this.formInline.popularizeid = val.popularizeid;
      this.checkMainParams = Object.assign({}, val);
      this.maintainCur = idx;
      // this.maintainVal = val.name;
      // this.maintainFlage = true;
      this.getFindList()
    },
    mainAdd() {
      this.mainTit = "add";
      this.dialogMain = true;
      // this.checkMainParams.popularizename = "";
    },
    mainEdit() {
      // if (this.MaintainList.length == 0) {
      //   this.$message("暂无主推数据！");
      //   return;
      // }
      if (Object.keys(this.checkMainParams).length == 0) {
        // this.checkMainParams = Object.assign({}, this.MaintainList[0]);
        this.$message("请选择一个主推！");
        return;
      }
      this.mainTit = "edit";
      this.dialogMain = true;
      // 未点击默认选取列表第一个
      // if (!this.maintainFlage) {
      //   this.checkMainParams = Object.assign({}, this.MaintainList[0]);
      // }
    },
    mainDelete() {
      // 未点击默认选取列表第一个
      // if (!this.maintainFlage) {
      //   this.checkMainParams = Object.assign({}, this.MaintainList[0]);
      // }
      if (this.MaintainList.length == 0) {
        this.$message("暂无主推数据！");
        return;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            companyId: this.companyid,
            data: this.checkMainParams.popularizeid
          };
          this.$api.drugMaintain.deletePopularize(params).then(res => {
            if (res.status === 200) {
              this.$message.success("删除成功");
              this.getPopularize();
            } else {
              this.$message(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    searchEvent(type) {
      if (type === "Tab") {
        this.getFindList();
      } else {
        this.changeDrugs();
      }
    },
    emptyEvent(type) {
      if (type === "Tab") {
        this.formInline = {};
      } else {
        this.formInline1 = {};
      }
    },
    getFindList() {
      let params = {
        companyid: this.companyid,
        goodsname: this.formInline.goodsname,
        opcode: this.formInline.opcode,
        prodarea: this.formInline.prodarea,
        erpgoodsid: this.formInline.erpgoodsid,
        pageIndex: this.pageVO.currentPage,
        pageSize: this.pageVO.pageSize,
        popularizeid: this.checkMainParams.popularizeid
      };

      this.$api.drug
        .goodsFind(params)
        .then(res => {
          if (res.status === 200) {
            this.tableData = res.data.list;
            this.pageVO.totalResult = res.data.info;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    changeDrugs() {
      this.getAllList();
      this.formInline1 = {}
      this.dialogDrugs = true;
    },
    syncList() {
      let rows = this.$refs.changeList.getSelecteds();
      // console.log(rows)
      if (rows.length) {
        let pkid = rows.map(item => {
          return item.pkid;
        });
        let params = {
          companyId: this.companyid,
          data: {
            pkids: pkid,
            popularizeid: this.checkMainParams.popularizeid
          }
        };
        this.$api.drugMaintain
          .setGoods(params)
          .then(res => {
            if (res.status === 200) {
              this.$message.success("选择药品成功");
              this.dialogDrugs = false;
              this.getFindList();
            }
          })
          .catch(err => {
            this.dialogDrugs = false;
          });
      } else {
        this.$message("请至少选择一条数据！");
      }
    },
    // 删除选中项
    deleteCheckDrugs() {
      let row = this.$refs.formList.getSelecteds();
      this.deleteDrugs(row);
    },
    // 删除单项
    deleteRowDrugs(scope) {
      this.deleteDrugs([scope.row]);
    },
    deleteDrugs(row) {
      if (row.length) {
        let pkid = row.map(item => {
          return item.pkid;
        });
        this.$confirm("是否移除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let params = {
              companyId: this.companyid,
              data: {
                pkids: pkid
                // popularizeid: this.checkMainParams.popularizeid
              }
              // popularizeid: this.checkMainParams.popularizeid
            };
            this.$api.drugMaintain.setGoods(params).then(res => {
              if (res.status === 200) {
                this.$message.success("移除成功");
                this.getFindList();
              } else {
                this.$message(res.msg);
              }
            });
          })
          .catch(err => {
            // console.log(err)
            this.$message({
              type: "info",
              message: "已取消移除"
            });
          });
      } else {
        this.$message("请至少选择一条数据！");
      }
    },
    rowClass() {
      return "background: #f3f3f3;color:#555;border-color:#dddfe7;";
    },
    showHideForm() {
      this.inputMore = !this.inputMore;
    },

    handleSizeChange(pageSize) {
      this.pageVO.pageSize = pageSize;
      this.getFindList();
    },
    handleCurrentChange(currentPage) {
      this.pageVO.currentPage = currentPage;
      this.getFindList();
    },
    handleSizeChange1(pageSize) {
      this.pageV1.pageSize = pageSize;
      this.changeDrugs();
    },
    handleCurrentChange1(currentPage) {
      this.pageV1.currentPage = currentPage;
      this.getFindList();
    },
    formatterType(row, column, cellValue, index) {
      return cellValue == 1 ? "是" : "否";
    },
    //获取左侧主推列表
    async getPopularize() {
      const response = await new Promise(resolve => {
        let params = {
          companyId: this.companyid
        };
        this.$api.drugMaintain
          .getPopularize(params)
          .then(res => {
            if (res.status === 200) {
              this.MaintainList = res.data;
              this.formInline.popularizeid = res.data[0].popularizeid;
              this.checkMainParams = Object.assign({}, res.data[0]);
              resolve(this.checkMainParams);
            }
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    // submitAddMain() {

    //   this.submitMain(params);
    // },
    // 提交 新增/修改 主推
    submitMain() {
      // console.log()
      if (this.mainTit == "edit" && !this.checkMainParams.popularizename) {
        this.$message("主推名称不能为空！");
        return;
      }
      if (this.mainTit == "add" && !this.newMainParams.popularizename) {
        this.$message("主推名称不能为空！");
        return;
      }
      let isWaring = false;
      this.MaintainList.forEach((i) => {
        if (i.popularizename == this.newMainParams.popularizename) {
          isWaring = true
        }
      });
      if(isWaring) {
        this.$message.warning('已存在该主推名');
        return false
      }
      let params = {
        companyId: this.companyid,
        data: {
          popularizeid:
            this.mainTit == "edit" ? this.checkMainParams.popularizeid : "",
          popularizename:
            this.mainTit == "edit"
              ? this.checkMainParams.popularizename
              : this.newMainParams.popularizename
        }
      };
      this.$api.drugMaintain
        .createPopularize(params)
        .then(res => {
          if (res.status === 200) {
            this.dialogMain = false;
            this.$message.success("保存成功");
            if (this.mainTit == "add") {
              this.newMainParams = {};
            }
            this.getPopularize();
          }else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.dialogMain = false;
        });
    },
    deleteGoods() {},
    getAllList() {
      let params = {
        companyid: this.companyid,
        goodsname: this.formInline1.goodsname,
        opcode: this.formInline1.opcode,
        prodarea: this.formInline1.prodarea,
        erpgoodsid: this.formInline1.erpgoodsid,
        pageIndex: this.pageV1.currentPage,
        pageSize: this.pageV1.pageSize,
        isPopularize: 1
        // popularizeid: this.formInline.popularizeid
      };
      this.$api.drug
        .goodsFind(params)
        .then(res => {
          if (res.status === 200) {
            this.changeTable = res.data.list;
            this.pageV1.totalResult = res.data.info;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.drugMaintainMain {
  min-width: 1620px;
  height: 100%;
  padding: 0;
  margin: 0;
}
.drugMaintainLeft {
  float: left;
  width: 17%;
  height: 98vh;
  border-right: solid 2px #bbb;
}
.drugMaintainLeft ul {
  list-style: none;
}
.drugMaintainLeft ul li {
  width: 220px;
  height: 56px;
  line-height: 56px;
  color: #333;
  background: #fff;
  text-indent: 24px;
  cursor: pointer;
}
.classCur,
.drugMaintainLeft ul li:hover {
  color: #fff !important;
  background: #409eff !important;
}
.drugMaintainRight {
  float: left;
  margin-left: 20px;
  width: 80%;
}
.topBox {
  width: 100%;
}
.textWidth {
  width: 88px;
  max-width: 200px;
  font-size: 14px;
  text-align: right;
  padding-right: 12px;
}
.inputWidth {
  max-width: 200px;
  /*百度 360极速*/
  -webkit-column-width: 200px;
}
.arrow_img {
  width: 100% !important;
  margin-top: 0px;
  border-radius: 0 0 3px 3px;
  margin-bottom: 20px;
  height: 24px;
  background: url("./../../src/assets/return_down.png") center bottom no-repeat;
  background-size: 120px auto;
  border-bottom: 2px solid #4ebfff;
  cursor: pointer;
}
.arrow_active {
  background: url("./../../src/assets/return_up.png") center bottom no-repeat;
}
.dialogTit >>> .el-dialog__header {
  background: #f3f3f3 !important;
}
</style>

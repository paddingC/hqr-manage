<template>
  <div style="margin-bottom: 20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 100%">
      <el-tab-pane label="企业设置" name="first">
        <div class="saveBtn">
          <el-button type="primary" @click="saveSet('formSet')">保 存</el-button>
        </div>
        <el-form ref="formSet" :model="formSet" :rules="rules" label-width="120px">
          <el-form-item label="企业全称" prop="companyname">
            <el-input v-model="formSet.companyname" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="企业简称" prop="companysortname">
            <el-input v-model="formSet.companysortname" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <label style="display: inline-block;width: 112px;text-align: right;color: #666;font-size: 14px">
            <i style="color: #f66c6c">*</i>&nbsp;&nbsp;企业LOGO
          </label>
            <div style="margin-left: 120px; margin-bottom: 15px">
              <el-upload
                class="upimg"
              style="width: 500px;"
              :class="{disabled:uploadDisabled}"
              list-type="picture-card"
              :data="parms" :headers="myHeaders" :action="action"
              :on-preview="handlePreview" :on-success="handelSuccess"
              :on-remove="handleRemove"
              :file-list="fileList">
                <i class="el-icon-plus"></i>
              </el-upload>
              <p class="warnText">建议尺寸: 200像素*200像素，仅支持.jpg，.jpeg，.png格式。大小不超过1M</p>
            </div>
            <el-dialog :visible.sync="dialogVisible" style="text-align: center">
             <img width="500px" height="600px" v-if="fileList.length!==0" :src="fileList[0].url" alt="">
            </el-dialog>
          <el-form-item label="网络部维护电话">
            <el-input v-model="formSet.wlwhb" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="医护中心电话">
            <el-input v-model="formSet.yhzx" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="远程审方室电话">
            <el-input v-model="formSet.ycsf" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="远程审方设置" name="second">
        <div class="saveBtn">
          <el-button type="primary" @click="saveSet('formSet')">保 存</el-button>
        </div>
        <el-form ref="formSet" :model="formSet" :rules="rules" label-width="148px">
          <div class="stepMain">
            <div class="stepOne">
              <div class="stepOneL"><span>1</span><a></a></div>
              <div class="stepOneR">
                <div class="h4">上传处方</div>
                <p class="warnText">远程审方业务在门店端的参数设置</p>
                <el-form-item label="远程审方模式：" prop="approvalMode">
                  <el-radio-group v-model="formSet.approvalMode">
                    <el-radio v-for="(item, index) in DZSF_APPROVALMODE" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
                  </el-radio-group>
                  <p class="warnText">视频：由门店上传处方图片，和远程执业药师进行面对面视频审方；</p>
                  <p class="warnText">图片：由门店上传处方图片，远程执业药师通过处方图片进行审方；</p>
                </el-form-item>
                <el-form-item label="处方药品维护时机：" prop="openFlag">
                    <el-radio-group v-model="formSet.openFlag">
                      <el-radio v-for="(item, index) in DZSF_OPENFLAG" :key="index" :label="item.dictValue">
                        {{item.dictDtlName}}
                      </el-radio>
                    </el-radio-group>
                    <p class="warnText">不维护：和门店POS系统未打通时，可不维护处方药品，处方审核通过后，由门店人员在POS系统手工选择药品销售</p>
                    <p class="warnText">维护：和门店POS系统打通后，可维护处方药品，处方审核通过后，可以将处方药品数据直接传入POS系统进行销售</p>
                    <div v-if="formSet.openFlag == true">
                      <el-checkbox v-model="formSet.beforeApproval">上传处方时维护</el-checkbox>
                      <el-checkbox v-model="formSet.afterApproval">审方结束后维护</el-checkbox>
                      <p class="warnText">上传处方时维护：门店上传处方图片，在提交远程执业药师审方前维护，可帮助执业药师判断所选药品和处方是否匹配，提高审方效率；</p>
                      <p class="warnText">审方结束后维护：处方通过执业药师审核后，门店再维护处方药品；</p>
                      <p class="warnText">上传处方时维护、审方结束后维护可以同时启用；</p>
                    </div>
                </el-form-item>
              </div>
            </div>
            <div style="clear: both"></div>
            <div class="stepTwo">
              <div class="stepOneL"><span>2</span><a></a></div>
              <div class="stepOneR">
                <div class="h4">远程执业药师审核</div>
                <p class="warnText">远程审方业务在执业药师端的参数设置</p>
                <el-form-item label="签到签退方式：" prop="signMethod">
                  <el-radio-group v-model="formSet.signMethod">
                    <el-radio v-for="(item, index) in DZSF_SINGMETHOD" :key="index" :label="item.dictValue">
                      {{item.dictDtlName}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审方验证方式：" prop="approvaltype">
                  <el-radio-group v-model="formSet.approvaltype">
                    <el-radio v-for="(item, index) in DZSF_APPROVALTYPE" :key="index" :label="item.dictValue">
                      {{item.dictDtlName}}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
            <div style="clear: both"></div>
            <div class="stepThree">
              <div class="stepOneL"><span>3</span></div>
              <div class="stepOneR">
                <div class="h4">门店审核</div>
                <p class="warnText">远程审方业务在执业药师审核通过后，门店端的参数设置</p>
                <el-form-item label="门店审核流程：" prop="pointApprovalType">
                  <el-radio-group v-model="formSet.pointApprovalType">
                    <el-radio v-for="(item, index) in DZSF_POINTAPPROVALTYPE" :key="index" :label="item.dictValue">
                      {{item.dictDtlName}}
                    </el-radio>
                  </el-radio-group>
                  <p class="warnText">流程一：远程执业药师审方——>处方调配——>核对/发药</p>
                  <p class="warnText">流程二：远程执业药师审方——>门店审核</p>
                  <p class="warnText">当“处方调配、核对/发药”在系统外执行时，可以使用流程二；</p>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="远程复诊设置" name="third">
        <el-form ref="form" :model="formSet" label-width="132px" style="margin-left: 48px">
          <el-form-item label="开方药品控制库存:">
            <el-switch v-model="formSet.isinventory"></el-switch>
            <br />
            <span style="color: #666;font-size: 14px">控制库存时，在开方选择药品的时候，可以看到药品的当前库存，无库存药品不能开方。</span>
          </el-form-item>
        </el-form>
        <div class="saveBtn">
          <el-button type="primary" @click.stop="saveSet('formSet')">保 存</el-button>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="用户移动页面设置" name="fourth">
        <div class="saveBtn">
          <el-button type="primary" @click="saveSet('formMobelSet')">保 存</el-button>
        </div>
        <el-form ref="formMobelSet" :model="formMobelSet" :rules="rules" label-width="120px" class="radionLineheight">
          <div style="color:#000000;font-weight:500;font-size: 16px;line-height: 22px;margin-left: 48px;">远程审方用户移动页面</div>
          <p style="color:#999;font-size: 14px;line-height: 22px;margin-left: 48px;">用户使用微信扫描门店系统的二维码，在页面中填写需要的个人信息；可以配置需要填写的项目；</p>
          <el-form-item label="姓名">
            <el-radio-group v-model="formMobelSet.sfPatientName">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-radio-group v-model="formMobelSet.sfPersoncardType">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">证件类型默认为身份证</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-radio-group v-model="formMobelSet.sfPersoncardNo">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-radio-group v-model="formMobelSet.sfTelphone">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">手机号码和其他号码都是选填时，不能同时为空</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他号码">
            <el-radio-group v-model="formMobelSet.sfOtherPhone">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="formMobelSet.sfSex">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-radio-group v-model="formMobelSet.sfBirthday">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-radio-group v-model="formMobelSet.sfAge">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">出生日期和年龄同时需要时，年龄可以根据出生日期自动计算，也可以手工修改</span>
            </el-radio-group>
          </el-form-item>
          <div style="color: #000000;font-weight:500;font-size: 16px;line-height: 22px;margin-top: 32px;margin-left: 48px;">远程复诊用户移动页面</div>
          <p style="color: #999;font-size: 14px;line-height: 22px;margin-left: 48px;">用户使用微信扫描门店系统的二维码，在页面中填写需要的个人信息；可以配置需要填写的项目；</p>
          <el-form-item label="姓名">
            <el-radio-group v-model="formMobelSet.fzPatientName">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-radio-group v-model="formMobelSet.fzPersoncardType">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">证件类型默认为身份证</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-radio-group v-model="formMobelSet.fzPersoncardNo">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-radio-group v-model="formMobelSet.fzTelphone">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">手机号码和其他号码都是选填时，不能同时为空</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="其他号码">
            <el-radio-group v-model="formMobelSet.fzOtherPhone">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="formMobelSet.fzSex">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出生日期">
            <el-radio-group v-model="formMobelSet.fzBirthday">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-radio-group v-model="formMobelSet.fzAge">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
              <span class="warnText">出生日期和年龄同时需要时，年龄可以根据出生日期自动计算，也可以手工修改</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="病情描述">
            <el-radio-group v-model="formMobelSet.fzIllness">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="患病时间">
            <el-radio-group v-model="formMobelSet.fzIllnessTime">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否首诊">
            <el-radio-group v-model="formMobelSet.fzFirst">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="附件">
            <el-radio-group v-model="formMobelSet.fzFile">
              <el-radio v-for="(item, index) in DZSF_MOBILECONFIG" :key="index" :label="item.dictValue">{{item.dictDtlName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-tab-pane> -->
      <el-tab-pane label="视频设置" name="five">
        <div class="saveBtn">
          <el-button type="primary" @click="saveSet('formSet')">保 存</el-button>
        </div>
        <el-form ref="form" :model="formSet" label-width="162px">
          <p style="font-size: 14px;color:#999;margin-left: 48px;line-height: 22px">不使用视频审方、视频问诊时、无需配置</p>
          <el-form-item label="实时音视频APPID">
            <el-input v-model="formSet.rtcappid" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="实时音视频密钥">
            <el-input v-model="formSet.rtcsecretkey" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="云API密钥SecretId">
            <el-input v-model="formSet.apisecretid" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="云API密钥SecretKey">
           <el-input v-model="formSet.apisecretkey" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="云直播APPID">
            <el-input v-model="formSet.liveappid" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="云直播BIZID">
            <el-input v-model="formSet.livebizid" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="云直播API鉴权key">
           <el-input v-model="formSet.liveapikey" class="inputWidth" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <p class="warnText">当字符串以s结尾，表示时间点单位为秒，如3.5s表示时间点为第3.5秒；</p>
            <p class="warnText">当字符串以%结尾，表示时间点为视频时长的百分比大小，如10%表示时间点为视频前第10%的时间。</p>
          </el-form-item>
          <el-form-item label="开启自动截屏">
            <el-switch v-model="formSet.approvalImage"></el-switch>
          </el-form-item>
          <el-form-item label="截图时间点">
            <el-button @click="insertEvent(-1)" :disabled="!formSet.approvalImage" size="mini" style="margin-bottom: 12px">添加</el-button>
            <div class="time_box" style="width: 720px">
              <elx-editable height="320" border width="100%"  :header-cell-style="rowClass" ref="timeTable" :data.sync="timeTable">
                <elx-editable-column type="index" width="55"></elx-editable-column>
                <elx-editable-column label="时间点" width="302px">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.time" :disabled="!formSet.approvalImage" :min="1"></el-input>
                  </template>
                </elx-editable-column>
                <elx-editable-column label="模式">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.type" :disabled="!formSet.approvalImage" placeholder="请选择">
                      <el-option
                        v-for="(item, index) in modelArr"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </template>
                </elx-editable-column>
                <elx-editable-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" :disabled="!formSet.approvalImage" @click="deleteRow(scope.row)">删 除</el-button>
                  </template>
                </elx-editable-column>
              </elx-editable>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!-- <el-tab-pane label="硬件设置" name="six">
        <div class="saveBtn">
          <el-button type="primary" @click="saveSet('formSet')">保 存</el-button>
        </div>
        <el-form ref="form" :model="formSet" label-width="182px">
          <p style="margin-left: 48px;font-size: 14px;color: #999">选择使用的硬件。在这里可以统一选择所使用的硬件，如果某点位使用的硬件不同，可以在相应功能使用时按照人员单独定义。</p>
          <el-form-item label="门店高拍仪型号">
            <el-radio-group v-model="formSet.highShotMeterType">
              <el-radio v-for="(item, index) in DZSF_HIGHSHOTMETERTYPE" :key="index" :label="item.dictValue">
                {{item.dictDtlName}}
              </el-radio>
            </el-radio-group>
            <p class="warnText">设置门店统一的高拍仪型号。如部分门店的高拍仪和其他门店不同，可以由门店人员在系统中单独设置。</p>
          </el-form-item>
          <el-form-item label="执业药师指纹仪型号">
            <el-radio-group v-model="formSet.fingerprintDeviceType">
              <el-radio v-for="(item, index) in DZSF_FINGERPRINTDEVICETYPE" :key="index" :label="item.dictValue">
                {{item.dictDtlName}}
              </el-radio>
            </el-radio-group>
            <p class="warnText">设置执业药师统一的指纹仪型号。如执业药师的指纹仪不同，可以由执业药师在系统中单独设置。</p>
          </el-form-item>
          <el-form-item label="执业药师人脸识别方式">
            <el-radio-group v-model="formSet.faceRecognitionMethod">
              <el-radio v-for="(item, index) in DZSF_FACERECOGNITIONMETHOD" :key="index" :label="item.dictValue">
                {{item.dictDtlName}}
              </el-radio>
            </el-radio-group>
            <p class="warnText">执业药师使用人脸识别的方式:</p>
            <p class="warnText">上传照片识别：使用执业药师自拍的照片即可；</p>
            <p class="warnText">身份证识别：需要每次人脸识别时，刷执业药师的身份证进行识别；</p>
          </el-form-item>
          <el-form-item label="执业药师身份证识别仪型号">
            <el-radio-group v-model="formSet.idCardRecognizer">
              <el-radio v-for="(item, index) in DZSF_IDCARDRECOGNIZER" :key="index" :label="item.dictValue">
                {{item.dictDtlName}}
              </el-radio>
            </el-radio-group>
            <p class="warnText">设置门店统一的高拍仪型号。如部分门店的高拍仪和其他门店不同，可以由门店人员在系统中单独设置。</p>
          </el-form-item>
        </el-form>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="移动药师端常见问题" name="seven">
        <div class="child">
          <div style="margin-bottom: 20px">
            <el-button size="mini" type="primary" @click="addquesdoc">新增</el-button>
            <el-button size="mini" type="danger" @click="deletequesdoc">批量删除</el-button>
          </div>
          <elx-editable
            ref="questionListdoc"
            min-height="320px"
            max-height="1000px"
            border
            :header-cell-style="rowClass"
            :data.sync="childDataDoc"
            tooltip-effect="dark">
            <elx-editable-column type="selection" width="55" fixed="left"></elx-editable-column>
            <elx-editable-column type="index" width="55"></elx-editable-column>
            <elx-editable-column prop="question" label="问题标题"></elx-editable-column>
            <elx-editable-column prop="answer" label="问题答案"></elx-editable-column>
            <elx-editable-column label="操作" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editqueDoc(scope.row)">编辑</el-button>
              </template>
            </elx-editable-column>
          </elx-editable>
          <div class="block" style="margin: 20px; text-align: right">
            <el-pagination
              @size-change="handleSizeChangeDtlDoc"
              @current-change="handleCurrentChangeDtlDoc"
              :current-page="pageDtlDoc.pageIndex"
              :page-sizes="[5, 10, 20, 50, 100]"
              :page-size="pageDtlDoc.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageDtlDoc.totalResult"
            ></el-pagination>
          </div>
        </div>
        <el-dialog
          :title="isAddQuestionDoc?'新增问题':'修改问题'"
          :visible.sync="dialogDrugsDoc"
          class="dialogTit"
          width="860px"
        >
          <el-form
            :model="saveQuestionParamsDoc"
            size="small"
            class="base-table6-form"
            label-position="left"
            label-width="100px"
            style="width:80%"
            ref="saveQuestionParamsDoc"
            :rules="rules"
          >
            <el-form-item label="问题标题：" prop="question">
              <el-input v-model="saveQuestionParamsDoc.question" class="inputWidth"></el-input>
            </el-form-item>
            <el-form-item label="问题答案：" prop="answer">
              <el-input type="textarea" v-model="saveQuestionParamsDoc.answer" rows="4"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogDrugsDoc = false">取 消</el-button>
            <el-button type="primary" @click="saveChildDoc('saveQuestionParamsDoc')">确 定</el-button>
          </span>
        </el-dialog>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import {find} from '../http/report/doctors'
export default {
  data () {
    return {
      activeName: 'first',
      action: this.global.baseUrl + 'dzsf/config/uploadlogo',
      action1: this.global.baseUrl + 'dzsf/config/uploadSeal',
      myHeaders: {token: Cookies.get('token')},
      parms: {
        companyid: sessionStorage.getItem('companyid')
      },
      rules: {
        companyname: [{required: true, message: '请输入企业全称', trigger: 'blur'}],
        companysortname: [{required: true, message: '请输入企业简称', trigger: 'blur'}],
        companycode: [{required: true, message: '请输入登录入口', trigger: 'blur'}],
        highShotMeterType: [{required: true, message: '请选择高拍仪型号', trigger: 'change'}],
        approvalMode: [{required: true, message: '请选择远程审方模式', trigger: 'change'}],
        openFlag: [{required: true, message: '请选择处方药品维护时机', trigger: 'change'}],
        signMethod: [{required: true, message: '请选择签到签退方式', trigger: 'change'}],
        approvaltype: [{required: true, message: '请选择审方验证方式', trigger: 'change'}],
        pointApprovalType: [{required: true, message: '请选择门店审核流程', trigger: 'change'}],
        question: [{required: true, message: '请输入问题', trigger: 'blur'}],
        answer: [{required: true, message: '请输入答案', trigger: 'blur'}]
      },
      options: [
        {
          value: '1',
          label: '点易拍Q15'
        }, {
          value: '2',
          label: '良田S300L'
        }, {
          value: '3',
          label: '良田S818YJ'
        }, {
          value: '4',
          label: '良田S200L'
        }
      ],
      limit: 1,
      fileList: [],
      seal: [],
      dialogVisible: false,
      disabled: false,
      companyid: sessionStorage.getItem('companyid'),
      formSet: {
        companysortname: '',
        companyname: '',
        wlwhb: '',
        yhzx: '',
        ycsf: '',
        approvaltype: '',
        companycode: '',
        companyid: sessionStorage.getItem('companyid'),
        rtcappid: '',
        rtcsecretkey: '',
        apisecretid: '',
        apisecretkey: '',
        liveappid: '',
        livebizid: '',
        liveapikey: '',
        isinventory: false,
        openFlag: false,
        pointApprovalType: '',
        beforeApproval: false,
        afterApproval: false,
        highShotMeterType: 0,
        faceRecognitionMethod: 0,
        fingerprintDeviceType: 0,
        idCardRecognizer: 0,
        approvalImage: '',
        approvalimageTime: ''
      },
      formMobelSet: {
        sfPatientName: '',
        approvaltype: '',
        highShotMeterType: '',
        pointApprovalType: ''
      },
      selectedOptions: [],
      listArr: [],
      dialogTable: false,
      DZSF_MOBILECONFIG: [],
      DZSF_APPROVALMODE: [],
      DZSF_OPENFLAG: [],
      DZSF_SINGMETHOD: [],
      DZSF_APPROVALTYPE: [],
      DZSF_POINTAPPROVALTYPE: [],
      DZSF_HIGHSHOTMETERTYPE: [],
      DZSF_FINGERPRINTDEVICETYPE: [],
      DZSF_FACERECOGNITIONMETHOD: [],
      IDCARDRECOGNIZER: [],
      DZSF_IDCARDRECOGNIZER: [],
      timeTable: [],
      modelArr: ['s', '%'],
      childDataDoc:[],
      pageDtlDoc: {
        pageSize: 10,
        pageIndex: 1,
        totalResult: 0
      },
      isAddQuestionDoc:false,
      dialogDrugsDoc:false,
      saveQuestionParamsDoc:{
        question:'',
        answer:''
      },
      pageNo:1,
      editQuDocId:"",
    }
  },
  computed: {
    uploadDisabled: function () {
      return this.fileList.length > 0
    },
    uploadDisabled1: function () {
      return this.seal.length > 0
    }
  },
  mounted () {
    this.getForm()
    this.getNum()
    //this.find()
  },
  methods: {
    // 新增医生问题
    addquesdoc(){
      this.editQuDocId=""
      this.saveQuestionParamsDoc.answer=""
      this.saveQuestionParamsDoc.question=""
      this.dialogDrugsDoc=true
      this.isAddQuestionDoc=true
    },
    // 删除医生问题
    deletequesdoc(){
      let row=this.$refs.questionListdoc.getSelecteds()
      this.deleteQueDoc(row)
    },
    // 编辑医生问题
    editqueDoc(row){
      this.editQuDocId=row.questionid
      this.saveQuestionParamsDoc.answer=row.answer
      this.saveQuestionParamsDoc.question=row.question
      this.dialogDrugsDoc=true
      this.isAddQuestionDoc=false
    },
    // 新增/修改弹窗确定
    saveChildDoc(scope){
      this.$refs[scope].validate((valid) => {
        if (valid) {
          this.getDocSave(scope)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSizeChangeDtlDoc (pageSize) {
      this.pageDtlDoc.pageSize = pageSize
      this.find()
    },
    handleCurrentChangeDtlDoc (pageIndex) {
      this.pageDtlDoc.pageIndex = pageIndex
      this.find()
    },
    deleteQueDoc (row) {
      if (row.length) {
        let id = row.map(item => {
          return item.questionid
        })
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            let params = id
            this.$api.doctors.del(params).then(res => {
              if (res.status === 200) {
                this.$message.success('删除成功')
                this.find()
              } else {
                this.$message(res.msg)
              }
            })
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } else {
        this.$message('请至少选择一条数据！')
      }
    },
    getDocSave (scope) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      this.$api.doctors
        .save({
          companyId: this.companyid,
          data: {
            answer:this.saveQuestionParamsDoc.answer,
            question:this.saveQuestionParamsDoc.question,
            questionid:this.editQuDocId
          },
          loginId:sessionStorage.getItem('loginid')
        })
        .then(res => {
          loading.close()
          if (res.status === 200) {
            this.$message.success('保存成功！')
            this.dialogDrugsDoc=false
            this.find()
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
          loading.close()
          this.$message.error(err.message)
        })
    },
    find () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading'
      })
      this.$api.doctors
        .find({
          companyId: this.companyid,
          data:{
            page:{
              pageIndex:this.pageDtlDoc.pageIndex,
              pageSize:this.pageDtlDoc.pageSize
            },
          },
          loginId:sessionStorage.getItem('loginid')
        })
        .then(res => {
          loading.close()
          if (res.status === 200) {
            this.childDataDoc=res.data.list
            this.pageDtlDoc.totalResult=res.data.total
          } else {
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          console.log(err)
          loading.close()
          this.$message.error(err.message)
        })
    },
    rowClass () {
      return 'background: #f5f5f5;color:#555;border-color:#dddfe7;height:50px;font-size:16px;'
    },
    getNum () {
      this.$api.set.batchGetDictList({
        companyId: this.companyid,
        data: ['DZSF_MOBILECONFIG', 'DZSF_APPROVALMODE', 'DZSF_OPENFLAG', 'DZSF_SINGMETHOD', 'DZSF_APPROVALTYPE',
          'DZSF_POINTAPPROVALTYPE', 'DZSF_HIGHSHOTMETERTYPE', 'DZSF_FINGERPRINTDEVICETYPE', 'DZSF_FACERECOGNITIONMETHOD',
          'DZSF_IDCARDRECOGNIZER']
      }).then(res => {
        if (res.status === 200) {
          this.DZSF_MOBILECONFIG = res.data.DZSF_MOBILECONFIG
          this.DZSF_MOBILECONFIG.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_APPROVALMODE = res.data.DZSF_APPROVALMODE
          this.DZSF_APPROVALMODE.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_OPENFLAG = res.data.DZSF_OPENFLAG
          this.DZSF_OPENFLAG.forEach(i => {
            if (i.dictValue === '0') {
              i.dictValue = false
            } else if (i.dictValue === '1') {
              i.dictValue = true
            }
          })
          this.DZSF_SINGMETHOD = res.data.DZSF_SINGMETHOD
          this.DZSF_SINGMETHOD.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_APPROVALTYPE = res.data.DZSF_APPROVALTYPE
          this.DZSF_APPROVALTYPE.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_POINTAPPROVALTYPE = res.data.DZSF_POINTAPPROVALTYPE
          this.DZSF_POINTAPPROVALTYPE.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_HIGHSHOTMETERTYPE = res.data.DZSF_HIGHSHOTMETERTYPE
          this.DZSF_HIGHSHOTMETERTYPE.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_FINGERPRINTDEVICETYPE = res.data.DZSF_FINGERPRINTDEVICETYPE
          this.DZSF_FINGERPRINTDEVICETYPE.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_FACERECOGNITIONMETHOD = res.data.DZSF_FACERECOGNITIONMETHOD
          this.DZSF_FACERECOGNITIONMETHOD.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
          this.DZSF_IDCARDRECOGNIZER = res.data.DZSF_IDCARDRECOGNIZER
          this.DZSF_IDCARDRECOGNIZER.forEach(i => {
            i.dictValue = Number(i.dictValue)
          })
        }
      })
    },
    handleClick (tab, event) {
      if (tab.name === 'fourth') {
        console.log('用户移动页面设置')
        this.$api.set.selectMobileConfig({
          companyId: this.companyid
        }).then(res => {
          if (res.status === 200) {
            console.log(res);
            this.formMobelSet = res.data
          }
        })
      }
      this.getNum()
    },
    async insertEvent (row) {
      let record = {
        type: 's',
        time: 1
      }
      let { row: newRow } = await this.$refs.timeTable.insertAt(record, row)
      await this.$refs.timeTable.setActiveCell(newRow, record)
    },
    deleteRow (row) {
      this.$refs.timeTable.remove(row)
    },
    getForm () {
      this.$api.set.getconfig({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.formSet = res.data;
          if (res.data.logopath) {
            this.fileList = []
            this.seal = []
            this.fileList.unshift({
              url: res.data.logopath
            })
            this.seal.push({
              url: res.data.seal
            })
            this.formSet.beforeApproval==1?this.formSet.beforeApproval=true:this.formSet.beforeApproval=false
            this.formSet.afterApproval==1?this.formSet.afterApproval=true:this.formSet.afterApproval=false
            this.formSet.approvalImage==1?this.formSet.approvalImage=true:this.formSet.approvalImage=false
            this.formSet.approvaltype = Number(this.formSet.approvaltype)
            this.formSet.pointApprovalType = Number(this.formSet.pointApprovalType)
            this.formSet.highShotMeterType = Number(this.formSet.highShotMeterType)
            // this.formSet.approvalimage_time = '10s, 44%, 0.5%, 12s'
            if (this.formSet.approvalimageTime != null) {
              let timeArr = this.formSet.approvalimageTime.split(',')
              let newArr = []
              timeArr.forEach(i => {
                if (i.includes('s')) {
                  newArr.push({
                    time: i.substring(0, i.length - 1),
                    type: 's'
                  })
                }
                if (i.includes('%')) {
                  newArr.push({
                    time: i.substring(0, i.length - 1),
                    type: '%'
                  })
                }
              })
              this.timeTable = newArr
            }
          }
        }
      })
    },
    saveSet (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = this.formSet
          data.mobileconfig = this.formMobelSet
          if (data.companyname === '') {
            this.$message.warning('请输入企业全称')
            return false
          }
          if (data.companysortname === '') {
            this.$message.warning('请输入企业简称')
            return false
          }
          if (this.fileList.length === 0) {
            this.$message.warning('请上传企业Logo！')
            return false
          } else {
            data.logopath = this.fileList[0].url
          }
          data.approvalImage?data.approvalImage=1:data.approvalImage=0
          data.beforeApproval?data.beforeApproval=1:data.beforeApproval=0
          data.afterApproval?data.afterApproval=1:data.afterApproval=0
          let str = []
          if (this.timeTable.length >= 1) {
            this.timeTable.forEach(i => {
              if (i.time !== '') {
                str.push(i.time + i.type)
              }
            })
          }
          let strArr = str.toString()
          data.approvalimageTime = strArr
          console.log(data.approvalimageTime);
          this.$api.set.saveconfig(data).then(res => {
            if (res.status === 200) {
              this.getForm()
              this.$message.success('保存成功')
            } else {
              this.$message.error('保存失败')
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.warning('请输入必填项')
          return false
        }
      })
    },
    saveMobelSet (saveMobelSet) {
      console.log('保存移动端')
      this.saveSet()
    },
    handlePreview () {
      this.dialogVisible = true
      console.log(this.dialogVisible)
    },
    handelSuccess (response) {
      console.log(response)
      // console.log(this.fileList)
      if (response.status === 200) {
        this.fileList.unshift({
          url: response.data
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handelSuccess1 (response) {
      console.log(response);
      if (response.status === 200) {
        this.seal.unshift({
          url: response.data
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleRemove (file) {
      console.log(file)
      this.fileList = []
      this.$api.set.removelogo({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
        }
      })
    },
    handleRemove1 (file) {
      console.log(file)
      this.seal = []
      this.$api.set.removeSeal({
        companyid: this.companyid
      }).then(res => {
        if (res.status === 200) {
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>

<style scoped>
  >>>.el-form-item{
    margin-bottom: 12px;
  }
  >>>.el-tabs__content{
    /*height: 680px!important;*/
  }
  .radionLineheight .el-form-item{
    margin-bottom: 0px!important;
  }
  /* 进度条 */
  .stepMain{
    height: auto;
  }
  .stepOneL{
    position: relative;
    float: left;
    width: 84px;
    text-align: center;
  }
  .stepOneL span{
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    border-radius: 32px;
    background: #3a8ee6;
    display: inline-block;
  }
  .stepOne .stepOneL a{
    border-left: solid 2px #3a8ee6;
    height: 424px;
    top: 32px;
    left: 42px;
    position: absolute;
  }
  .stepTwo .stepOneL a{
    border-left: solid 2px #3a8ee6;
    height: 134px;
    top: 32px;
    left: 42px;
    position: absolute;
  }
  .stepOneR {
    float: left;
    width: auto;
  }
  .stepOneR .h4{
    font-weight: normal;
    font-size: 18px;
    line-height: 26px!important;
  }
  .warnText{
    color: #999;
    font-size: 12px;
    line-height: 12px;
  }
  .inputWidth>>>.el-input__inner{
    width: 440px;
    height: 32px;
  }
  .upimg>>>.el-upload--picture-card{
    width: 104px;
    height: 104px;
    line-height: 104px;
  }
  .saveBtn{
    position: absolute;
    top: 32px;
    right: 44px;
    z-index: 999;
  }
  .saveBtn button{
    width: 100px;
    height: 44px;
    border-radius: 0;
  }
  .box1 h3,
  .box2 h3,
  .box3 h3,
  .box4 h3 {
    width       : 756px;
    height      : 42px;
    color       : #333;
    text-align  : left;
    text-indent : 24px;
    line-height : 42px;
    border-left : solid 3px #00142a;
    background  : #efefef;
  }
  .disabled >>> .el-upload--picture-card {
    display : none;
  }
</style>

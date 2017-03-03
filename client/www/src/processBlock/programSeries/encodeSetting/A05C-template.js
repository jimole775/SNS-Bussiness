/**
 * Created by Andy on 2017/1/9.
 */
(function(){

//<!-- 数据库版本列表 -->
var temp1 = [
	'<div id="database" class="data-box" style="display: none">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title">请选择数据库版本</h1>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table id="dbVersionList_A05C">',

	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710542(\'01\');">',
	//'确定',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710542(\'02\');">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");
//<!-- 模块信息列表 -->
var temp2 = [

	'<div id="module" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title">设码模块信息</h1>',

	'<p class="box-p" align="left"><span id="carType_A05C">车辆类型：</span><br/>',

	'<span id="carFrameNum">车架号：LBVFP1903BSE21944</span></p>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table>',
	'<thead>',
	'<tr>',
	'<th width="15%" class="th-center">',
	'编号',
	'</th>',
	'<th  width="20%" class="th-center">',
	'地址',
	'</th>',
	'<th  width="45%" class="th-center">',
	'模块名称',
	'</th>',
	'<th  width="20%" class="th-center">',
	'单选',
	'</th>',
	'</tr>',
	'</thead>',
	'<tbody id="moduleList">',

	'</tbody>',
	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71052C(\'01\');">',
	//'确定',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71052C(\'02\');">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'].join ("");

//<!-- 查看模块信息 -->
var temp3 = [
	'<div id="moduleVersion" class="box tip-box-wide">',
	'<h1 class="box-title" id="moduleTitle">CAS[-地址-]模块信息</h1>',
	'<ul class="info" id="moduleInfos">',
	'<li>BTLD_0000074B_007_001_001</li>',
	'<li>CAFD_0000000F_005_021_005</li>',
	'<li>HWAP_000002EA_255_255_255</li>',
	'<li>HWEL_00000007_006_000_000</li>',
	'<li>SWFL_0000074C_007_002_020</li>',
	'<li>SWFL_0000074E_007_002_020</li>',
	'<li>SWFL_0000074F_007_002_020</li>',
	'</ul>',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button1" onClick="RMTClickEvent.versionReturn();">',
	//'返回',
	//'</button>',
	//'</p>',

	'</div>'].join ("");

//<!-- 查看模块信息 确认 -->
var temp4 = [
	'<div id="moduleVersionConfirm" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title">设码模块信息</h1>',

	'<p class="box-p" id="carTypeConfirm">车辆类型：</p>',

	'<p class="box-p">车架号：<span id="carFrameNumConfirm">LBVFP1903BSE21944</span>',
	'</p>',

	'<p class="box-p" id="moduleTitleConfirm">模块名称：CAS[-地址-]</p>',

	'<p class="box-p">版本信息：</p>',
	'</div>',
	'<div class="scroll-table-body">',
	'<ul class="info" id="moduleInfosConfirm">',
	'<li>BTLD_0000074B_007_001_001</li>',
	'<li>CAFD_0000000F_005_021_005</li>',
	'<li>HWAP_000002EA_255_255_255</li>',
	'<li>HWEL_00000007_006_000_000</li>',
	'<li>SWFL_0000074C_007_002_020</li>',
	'<li>SWFL_0000074E_007_002_020</li>',
	'<li>SWFL_0000074F_007_002_020</li>',
	'</ul>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710539(\'01\');">',
	//'继续',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710539(\'02\');">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");

//<!-- 选择设码方式 -->
var temp5 = [
	'<div id="codeType" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title" align="center">选择模块设码方式</h1>',

	'<p class="box-p"><span class="box-tip">原车设码：</span>根据车辆信息生成对应的设码数据进行设码，推荐使用；</p>',

	'<p class="box-p"><span class="box-tip">默认设码：</span>根据车辆默认的设码数据进行设码，强烈建议不使用；</p>',

	'<p class="box-p"><span class="box-tip">编辑设码：</span>编辑当前车辆设码信息后进行设码，可进行个性化设置；</p>',

	'<p class="box-p"><span class="box-tip">恢复设码：</span>恢复车辆备份的原始设码数据，如车辆出现异常可使用。</p>',

	'<div id="codeTypeTip"></div>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table>',
	'<tbody>',
	'<tr>',
	'<td width="22%"><label ><input type="radio" name="codeRadio" id="codeRadio01" value="01"/></label></td>',
	'<td width="78%"  class="t-center">',
	'<label for="codeRadio01">原车设码</label>',
	'</td>',
	'</tr>',
	'<tr>',
	'<td width="22%"><label ><input type="radio" name="codeRadio" id="codeRadio02" value="02"/></label></td>',
	'<td width="78%" class="t-center">',
	'<label for="codeRadio02">默认设码</label>',
	'</td>',
	'</tr>',
	'<tr>',
	'<td width="22%"><label ><input type="radio" name="codeRadio" id="codeRadio03" value="03"/></label></td>',
	'<td width="78%" class="t-center">',
	'<label for="codeRadio03">编辑设码</label>',
	'</td>',
	'</tr>',
	'<tr>',
	'<td width="22%"><label ><input type="radio" name="codeRadio" id="codeRadio04" value="04"/></label></td>',
	'<td width="78%" class="t-center">',
	'<label for="codeRadio04">恢复设码</label>',
	'</td>',
	'</tr>',
	'</tbody>',
	'</table>',

	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71051F(\'01\');">',
	//'继续',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71051F(\'02\');">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");

//<!-- 模块设码版本选择 -->
var temp6 = [
	'<div id="moduleSelect" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title" align="center">设码模块信息</h1>',

	'<p class="box-p" id="carTypeSelect">车辆类型：</p>',

	'<p class="box-p" id="carFrameNumSelect">车架号：</p>',

	'<p class="box-p" id="moduleTitleSelect">模块名称：</p>',

	'<p class="box-p" id="oriCodeVersion">',
	'原车版本：CAFD_0000000F_005_021_005/CAFD_0000000F_005_021_008/CAFD_0000000F_005_021_009</p>',

	'<p class="box-p">版本信息：</p>',

	'<p class="box-warn">设码存在一定风险可能会导致模块损坏（异常）或者车辆无法启动，是否继续设码？</p>',

	'<p class="box-warn" id="programTip"></p>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table id="moduleInfosSelect">',

	'</table>',

	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710536(\'01\');">',
	//'确定',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710536(\'02\');">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");

//<!-- 设码编辑相关页面：主页面 -->
var temp7 = [
	'<div id="functionList" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title" align="center">模块信息</h1>',
	'<p id="funsListTitle" class="box-p"></p>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table id="funsList">',

	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.postEdit(\'confirm\')">',
	//'确定',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.postEdit(\'cancel\')">',
	//'取消',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");
//<!-- 设码编辑相关页面：Function页面 -->
var temp8 = [
	'<div id="functionDetail" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title" align="center">编辑设码</h1>',

	'<p class="box-p" id="functionDetailTitle">3000 Wipe_Wash, 14</p>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table id="detailList">',
	'<tr>',
	'<td >STANDRUECKSCHALTUNG</td>',
	'</tr>',
	'<tr>',
	'<td >FRONTWISCHER</td>',
	'</tr>',
	'<tr>',
	'<td >WISHENINTERVALL_STILL</td>',
	'</tr>',
	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button1" onClick="RMTClickEvent.postEdit(\'funReturn\')">',
	//'返回',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");
//<!-- 设码编辑相关页面：明细编辑页面  -->

var temp9 = [
	'<div id="functionEdit" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title" align="center">编辑设码</h1>',
	'</div>',
	'<div class="scroll-table-body">',
	'<p class="box-p" id="functionEditTitle"></p>',
	'<p class="box-p" id="Kommentar"></p>',
	'<p class="box-p">输入值范围：<span id="minValue"></span>~<span id="maxValue"></span></p>',
	'<div id="curFileName" style="display: ;"></div>',
	'<div id="mask" style="display: none"></div>',
	'<div id="start" style="display: none"></div>',
	'<div id="end" style="display: none"></div>',
	'<p class="box-p">',
	'<label>',
	'<select id="funSelect" onchange="RMTClickEvent.optionChange(\'funSelect\')"></select>',
	'</label>',
	'</p>',
	'<p class="box-p">',
	'<label><input type="text" id="funInput"></label>',
	'</p>',
	'<div id="funInputTip"></div>',
	'<div id="editTip"></div>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<p class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.editConfirm(\'1\')">',
	//'修改',
	//'</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.editConfirm(\'2\')">',
	//'返回',
	//'</button>',
	//'</p>',
	//'</div>',
	'</div>'
].join ("");
//<!-- 修改设码文件 确认 -->

var tempA = [
	//'<div id="postEditConfirm" class="box tip-box-wide">',
	//'<h1 class="box-title">提示</h1>',
	//'<div>',
	//'<p class="box-p">确认修改设码文件吗？</p>',
	//'</div>',
	//'<div class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.postEdit(\'01\');">确定</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.postEdit(\'return\');">返回</button>',
	//'</div>',
	//'</div>'
].join ("");
//<!-- FA获取方式  -->
var tempB = [
	'<div id="faSelect" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title">请选择FA文件获取方式</h1>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table>',
	'<tbody>',
	'<tr>',
	'<td width="22%" class="t-center"><label ><input type="radio" name="fa" id="fa1" checked value="01"/></label></td>',
	'<td width="78%" class="t-center"><label for="fa1">从汽车读取FA文件</label></td>',
	'</tr>',
	'<tr>',
	'<td width="22%" class="t-center"><label ><input type="radio" name="fa" id="fa2" value="02"/></label></td>',
	'<td width="78%" class="t-center"><label for="fa2">从本地加载FA文件</label></td>',
	'</tr>',
	'</tbody>',
	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<div class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710540(\'01\');">确定</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710540(\'02\');">取消</button>',
	//'</div>',
	//'</div>',
	'</div>'
].join ("");
//<!-- SVT获取方式 -->

var tempC = [
	'<div id="svtSelect" class="data-box">',
	'<div class="scroll-table-header">',
	'<h1 class="box-title">请选择SVT文件获取方式</h1>',
	'</div>',
	'<div class="scroll-table-body">',
	'<table>',
	'<tbody>',
	'<tr>',
	'<td width="22%" class="t-center"><label ><input type="radio" name="svt" id="svt1" value="01"/></label></td>',
	'<td width="78%" class="t-center"><label for="svt1">从VCM读取SVT文件</label></td>',
	'</tr>',
	'<tr>',
	'<td width="22%" class="t-center"><label ><input type="radio" name="svt" id="svt2" checked  value="02"/></label></td>',
	'<td width="78%" class="t-center"><label for="svt2">从ECU读取SVT文件</label></td>',
	'</tr>',
	'<tr>',
	'<td width="22%"  class="t-center"><label ><input type="radio" name="svt" id="svt3" value="03"/></label></td>',
	'<td width="78%"  class="t-center"><label for="svt3">从本地加载SVT文件</label></td>',
	'</tr>',
	'</tbody>',
	'</table>',
	'</div>',
	//'<div class="scroll-table-footer">',
	//'<div class="bottom-bar-button-box">',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710541(\'01\');">确定</button>',
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710541(\'02\');">取消</button>',
	//'</div>',
	//'</div>',
	'</div>'
].join ("");
document.getElementById("processBlock").innerHTML += temp1 + temp2 + temp3 + temp4 + temp5 + temp6 + temp7 + temp8 + temp9 + tempA + tempB + tempC;

})();
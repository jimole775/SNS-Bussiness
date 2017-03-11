	/**
	 * Created by Andy on 2017/1/9.
	 */

	document.getElementById("processBlock").innerHTML +=

		'<!-- 扫描全车模块列表 -->'+
	'<div id="carModuleList_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" id="moduleListTitle_A061">扫描（车型名称）全车模块信息</h1>'+
	'<button class=" item-button padding-when-without-inner-class" disabled>'+
	'<span style="color:#A0A0A0" id="scanStatusTip_A061">扫描状态</span>'+
	'<span class="item-value" style="display: table">'+
	'<i id="scanState_A061" style="color:#0052FF;display: table-cell;vertical-align: middle;"></i>'+
	'</span>'+
	'</button>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table >'+
	'<tbody id="carModuleInfoList">'+
	'<tr>'+
	'<td class="t-center">编号</td>'+
	'<td class="t-center">模块名称</td>'+
	'<td class="t-center">地址</td>'+
	'</tr>'+
	'</tbody>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" id="stopButton_A061" onclick="RMTClickEvent.Fun31080802()">停 止</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" id="rescanButton_A061" onClick="RMTClickEvent.Fun31053701();">重新扫描</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" id="nextStepButton_A061" onClick="RMTClickEvent.Fun31053702();">下一步</button>'+
	//'</div>'+
	//'</div>'+
	'</div>'+

		'<!-- 数据库版本列表 -->'+
	'<div id="database_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" >选择数据库版本：</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table  class="list-table click-list" id="dbVersionList_A061">'+
	'<tr>'+
	'<td>'+
	'<label for="dbOption1" >数据库版本</label>'+
	'</td>'+
	'<td class="t-center">'+
	'<input type="radio" name="dbOption_A061" id="dbOption_A0611" value="01"/>'+
	'</td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.database_A061Next();" >'+
	//'下一步'+
	//'</button>'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.database_A061Return();" >'+
	//'返回'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+

		'<!-- 车型列表 -->'+
	'<div id="carType_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" >选择车型：</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table  class="list-table click-list" id="carTypeList_A061">'+
	'<tr>'+
	'<td>车型</td>'+
	'<td class="t-center">'+
	'<label><input type="radio" name="carOption_A061" value="01"/></label>'+
	'</td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.carTypeNext_A061();" >'+
	//'下一步'+
	//'</button>'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.carTypeReturn_A061();" >'+
	//'返回'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+


		'<!-- 模块 列表 -->'+
	'<div id="module_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" id="moduleTitle_A061">选择模块：</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table class="list-table click-list" id="moduleList_A061">'+
	'<tr>'+
	'<td >模块</td>'+
	'<td class="t-center">'+
	'<label ><input type="radio" name="moduleOption_A061" value="01"/></label>'+
	'</td>'+
	'</tr>'+
	'<tr>'+
	'<td >'+
	'<label for="moduleOption_A0611">asdfasdf/asdfas/TestModule</label>'+
	'</td>'+
	'<td  class="t-center">'+
	'<input type="radio" name="moduleOption_A061" id="moduleOption_A0611" value="02"  />'+
	'</td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'</div>'+
	'</div>'+

		'<!-- 编程版本 列表 -->'+
	'<div id="programVersion_A061" class="data-box">'+
	'<div class="scroll-table-header">'+

	'<h1 class="box-title" >选择编程版本：</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table  class="list-table click-list" id="programVersionList_A061">'+
	'<tr>'+
	'<td >编程版本</td>'+
	'<td class="t-center">'+
	'<label><input type="radio" name="programOption_A061" value="01"/></label>'+
	'</td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.programNext();" >'+
	//'下一步'+
	//'</button>'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.programReturn();" >'+
	//'返回'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+


		'<!-- 模块信息显示 -->'+
	'<div id="moduleInfo_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" >编程模块信息</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<ul class="info" id="moduleInfoPage_A061" >'+
	'<li>车架号：XXXX</li>'+
	'<li>...</li>'+
	'</ul>'+
	'<p class="box-p warn-text">编程存在一定风险可能会导致模块损坏（异常），或者车辆无法启动，是否继续编程？</p>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.fun310539Ok();" >'+
	//'确定'+
	//'</button>'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.fun310539Cancel();" >'+
	//'取消'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+

		'<!-- 编程文件选择 -->'+

	'<div id="programFile_A061" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" > 数据库 &rarr; 车型 &rarr; 模块 &rarr; 请选择编程文件(点击已选可以取消选择)：</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<ul class="list-info" id="id0ba_A061">'+
	'</ul>'+
	'<ul class="list-info" id="id0pa_A061">'+
	'</ul>'+
	'<ul class="list-info" id="id0da_A061">'+
	'</ul>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.programFileNext();" >'+
	//'确定'+
	//'</button>'+
	//'<button type="button"  class="bottom-bar-button bottom-bar-button2"  onClick="RMTClickEvent.programFileReturn();" >'+
	//'返回'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+


		'<!-- 全车模块扫描提示 -->'+
	'<div id="scanModuleConfirm_A061" class="data-box">'+

	'<h1 class="box-title">提示</h1>'+
	'<div>'+
	'<p class="box-p">'+
	'是否需要执行扫描全车模块信息功能？如果需要请点击“扫描方式”或“快速方式”，不需要请点击“跳过”。执行全车模块扫描可以扫描并查阅车辆存在的各个模块信息。“扫描方式”大概需要耗时10分钟左右，“快速方式”大概耗时3分钟但部分模块可能扫描不到'+
	'</p>'+

	'<p id="carInfo_A061" class="box-p">车辆类型：xxxx	<br>'+
	'车架号码：xxxxxxxxxxxxxxx'+
	'</p>'+
	'</div>'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.Fun310529Ok(1);">扫描方式</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.Fun310529Ok(2);">快速方式</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.Fun310529Cancel();">跳过</button>'+
	//'</P>'+
	'</div>'+

		'<!-- 详细信息 -->'+
	'<div id="moduleInfoDetail_A061" class="box tip-box-wide">'+
	'<h1 class="box-title" id="moduleDetailTitle_A061">CAS3模块信息</h1>'+
	'<ul id="moduleDetail_A061" class="info">'+
	'<li>诊断地址：0x40</li>'+
	'<li>车架号码：LBVVA96087SB23302</li>'+
	'<li>硬件版本1：9287535</li>'+
	'<li>硬件版本2：9287534</li>'+
	'<li>软件版本：272332430</li>'+
	'<li>引导版本：0042JM</li>'+
	'</ul>'+
	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button1" onclick="RMTClickEvent.moduleDetailReturn();">返回</button>'+
	'</div>'+
	'</div>'+

		'<!-- ECU编程菜单 -->'+
	'<div id="ECUSelect_A061" class="data-box">'+
	'<div><h1 class="box-title">ECU编程</h1><p id="dataTypeTip_A061"></p></div>'+
	'<div>'+
	'<table>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="operate" id="operate01_A061" value="01"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display:block" for="operate01_A061">选择编程版本（ZUSB）</label></p></td>'+
	'</tr>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="operate" id="operate02_A061" value="02"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display:block" for="operate02_A061">输入编程版本（ZUSB）</label></p></td>'+
	'</tr>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="operate" id="operate03_A061" value="03"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display:block" for="operate03_A061">指定编程文件（慎用）</label></p></td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.Fun310536Ok();">确定</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.Fun310536Cancel();">取消</button>'+
	//'</div>'+
	'</div>'+

		'<!-- 车架号输入 -->'+
	'<div id="frameNum_A061" class="box tip-box-wide">'+
	'<h1 class="box-title">ECU编程</h1>'+
	'<div align="center">'+
	'<p class="box-p" data-id="resBtn">请输入车架号：</p>'+
	'<hr/>'+
	'<p class="box-p"><label><input type="text" id="inputFrameNum_A061" maxlength="17" size="28"/></label></p>'+
	'</div>'+

	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.frameNumNext();">确定</button>'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.frameNumReturn();">返回</button>'+
	'</div>'+
	'</div>'+

		'<!-- 车辆接口选择 -->'+
	'<div id="fun310519" class="data-box">'+
	'<h1 class="box-title">注意：设备自动检测车辆接口类型失败，请在下方选择车辆通信接口类型：</h1>'+
	'<div>'+
	'<table>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="radio310519" id="radio31051901" value="01"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display: block;" for="radio31051901">OBDII-KWP</label></p></td>'+
	'</tr>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="radio310519" id="radio31051902" value="02"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display: block;" for="radio31051902">KWP-CAN 100kbps</label></p></td>'+
	'</tr>'+
	'<tr>'+
	'<td width="20%"><label><input type="radio" name="radio310519" id="radio31051903" value="03"/></label>'+
	'</td>'+
	'<td width="80%"><p class="box-p"><label style="display: block;" for="radio31051903">KWP-CAN 500kbps</label></p></td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.Fun310519Ok();">确定</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.Fun310519Cancel();">退出</button>'+
	//'</div>'+

	'</div>'+


		'<!-- 零件号输入 -->'+
	'<div id="partNum_A061" class="box tip-box-wide">'+
	'<h1 class="box-title">ECU编程</h1>'+
	'<div align="center">'+
	'<p class="box-p" data-id="resBtn">请输入零件编号：</p>'+
	'<hr/>'+
	'<p class="box-p"><label><input type="text" id="inputPartNum_A061" maxlength=17 size="28"/></label></p>'+
	'<div id="tipPartNum"></div>'+
	'</div>'+

	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.partNumNext();">确定</button>'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.partNumReturn();">返回</button>'+
	'</div>'+
	'</div>'+

		'<!-- 模块选择按钮 -->'+
	//'<div id="moduleOprate_A061" style="display: none">'+
	//'<div class="scroll-table-footer">'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.moduleNext();">下一步</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.moduleReturn();">返回</button>'+
	//'</div>'+
	//'</div>'+
	//'</div>'+
	'<script src="A061.js" type="text/javascript"></script>'+
	'</body>'+
	'</html>';

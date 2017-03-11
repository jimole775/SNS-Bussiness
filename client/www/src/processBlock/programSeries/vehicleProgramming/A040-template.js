	/**
	 * Created by Andy on 2017/1/9.
	 */
	document.getElementById("processBlock").innerHTML +=
		'<!-- 模拟 confirm() -->'+
	'<div id="confirmDialog" class="box tip-box-wide">'+
	
	'<h1 class="box-title" id="confirmTitle">提示</h1>'+
	
	'<div>'+
	'<p class="box-p" id="confirmContent">确定删除吗？</p></div>'+
	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" id="btnConfirmOk">确定</button>'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" id="btnConfirmCancel">取消</button>'+
	'</div>'+
	
	'</div>'+
	
		'<!-- 弹出层不能放section里 -->'+
	'<section id="mainDiv">'+

		'<!-- 数据库版本列表 -->'+
	'<div id="database" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title">请选择编程数据库</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table id="dbVersionList">'+
	'<tr>'+
	'<td class="t-center">'+
	'<input type="radio" name="dbOption" id="dbOption1" value="01"/>'+
	'</td>'+
	'<td>'+
	'<label for="dbOption1">数据库版本</label>'+
	'</td>'+
	'</tr>'+
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710542(\'01\',\'database\');">'+
	//'确定'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710542(\'02\',\'database\');">'+
	//'取消'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+
	
		'<!-- 模块信息列表 -->'+
	'<div id="module" class="data-box">'+
	'<header class="scroll-table-header">'+
	'<h1 class="box-title">编程模块信息</h1>'+
	'<p class="box-p" id="carType"></p>'+
	'<p class="box-p" id="carFrameNum"></p>'+
	'</header>'+
	'<div class="scroll-table-body">'+
	'<table>'+
	'<thead>'+
	'<tr>'+
	'<th class="th-center" width="15%">编号</th>'+
	'<th class="th-center" width="20%">地址</th>'+
	'<th class="th-center" width="45%">模块名称</th>'+
	'<th class="th-center" width="20%">单选</th>'+
	'</tr>'+
	'</thead>'+
	'<tbody id="moduleList">'+
	
	'</tbody>'+
	'</table>'+
	'</div>'+
	//'<footer class="scroll-table-footer">'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71052C(\'01\');">'+
	//'确定'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun71052C(\'02\');">'+
	//'取消'+
	//'</button>'+
	//'</div>'+
	//'</footer>'+
	'</div>'+
	
		'<!-- 查看模块信息 -->'+
	'<div id="moduleVersion" class="box tip-box-wide">'+
	
	'<h1 class="box-title" align="center" id="moduleTitle">CAS[-地址-]模块信息</h1>'+
	
	'<ul class="info" id="moduleInfos">'+
	'<li>BTLD_0000074B_007_001_001</li>'+
	'<li>CAFD_0000000F_005_021_005</li>'+
	'<li>HWAP_000002EA_255_255_255</li>'+
	'<li>HWEL_00000007_006_000_000</li>'+
	'<li>SWFL_0000074C_007_002_020</li>'+
	'<li>SWFL_0000074E_007_002_020</li>'+
	'<li>SWFL_0000074F_007_002_020</li>'+
	'</ul>'+
	
	'<p class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button1" onClick="RMTClickEvent.versionReturn();">'+
	'返回'+
	'</button>'+
	'</p>'+
	'</div>'+
	
		'<!-- 查看模块信息 确认 -->'+
	'<div id="moduleVersionConfirm" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" align="center">编程模块信息</h1>'+
	
	'<p class="box-p" id="carTypeConfirm">车辆类型：</p>'+
	
	'<p class="box-p">车架号：<span id="carFrameNumConfirm">LBVFP1903BSE21944</span></p>'+
	
	'<p class="box-p" id="moduleTitleConfirm">模块名称：CAS[-地址-]</p>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<p class="box-p">版本信息：</p>'+
	
	'<ul class="info" id="moduleInfosConfirm">'+
	'<li>BTLD_0000074B_007_001_001</li>'+
	'<li>CAFD_0000000F_005_021_005</li>'+
	'<li>HWAP_000002EA_255_255_255</li>'+
	'<li>HWEL_00000007_006_000_000</li>'+
	'<li>SWFL_0000074C_007_002_020</li>'+
	'<li>SWFL_0000074E_007_002_020</li>'+
	'<li>SWFL_0000074F_007_002_020</li>'+
	'</ul>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710539(\'01\');">'+
	//'继续'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710539(\'02\');">'+
	//'取消'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+
	
		'<!-- 模块编程版本选择 -->'+
	'<div id="moduleSelect" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" align="center">编程模块信息</h1>'+
	
	'<p class="box-p" id="carTypeSelect">车辆类型：</p>'+
	
	'<p class="box-p" id="carFrameNumSelect">车架号：LBVFP1903BSE21944</p>'+
	
	'<p class="box-p" id="moduleTitleSelect">模块名称：CAS[-地址-]</p>'+
	
	'<p class="box-p">版本信息：</p>'+
	
	'<p class="box-p warn-text">编程存在一定风险可能会导致模块损坏（异常）或者车辆无法启动，是否继续编程？</p>'+
	
	'<p class="box-p" id="programTip"></p>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table class="list-table click-list" id="moduleInfosSelect">'+

	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onClick="RMTClickEvent.addModuleVersion();">'+
	//'增加'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onClick="RMTClickEvent.fun710536(\'01\');">'+
	//'编程'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button3" onClick="RMTClickEvent.fun710536(\'02\');">'+
	//'取消'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+
	
		'<!-- 编程版本选择 -->'+
	'<div id="moduleEdit" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title" align="center">模块编辑</h1>'+
	
	'<h1 class="box-p">当前版本:<span id="curModuleVersion">xxxxx</span></h1>'+
	'</div>'+
	'<div id="moduleEditList" class="scroll-table-body">'+
	'<p class="box-p"><label for="edit1"><input type="radio" name="edit" id="edit1" value="01"/>SWFL_0000074C_006_005_000</label>'+
	'</p>'+
	
	'<p class="box-p"><label for="edit2"><input type="radio" name="edit" id="edit2" value="02"/>SWFL_0000074C_006_006_020</label>'+
	'</p>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<p class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.funModuleEdit(\'01\');">' +
	//	'确定'+
	//'</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.funModuleEdit(\'02\');">' +
	//	'返回'+
	//'</button>'+
	//'</p>'+
	//'</div>'+
	'</div>'+
	
	'</section>'+
	
	
		'<!-- FA获取方式  -->'+
	'<div id="faSelect" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title">请选择FA文件获取方式</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table>'+
	'<tr>'+
	'<td>'+
	'<label><input type="radio" name="fa" id="fa1" value="01" checked/></label>'+
	'</td>'+
	'<td>'+
	'<p class="box-p"><label style="display: block" for="fa1">从汽车读取FA文件</label></p>'+
	'</td>'+
	'</tr>'+
	'<tr>'+
	'<td>'+
	'<label><input type="radio" name="fa" id="fa2" value="02"/></label>'+
	'</td>'+
	'<td>'+
	'<p class="box-p"><label style="display: block" for="fa2">从本地加载FA文件</label></p>'+
	'</td>'+
	'</tr>'+
	
	'</table>'+
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710540(\'01\');">确定</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710540(\'02\');">取消</button>'+
	//'</div>'+
	//'</div>'+
	'</div>'+
	
		'<!-- SVT获取方式 -->'+
	'<div id="svtSelect" class="data-box">'+
	'<div class="scroll-table-header">'+
	'<h1 class="box-title">请选择SVT文件获取方式</h1>'+
	'</div>'+
	'<div class="scroll-table-body">'+
	'<table>'+
	'<tr>'+
	'<td>'+
	'<label><input type="radio" name="svt" id="svt1" value="01"/></label>'+
	'</td>'+
	'<td>'+
	'<p class="box-p"><label style="display: block" for="svt1">从VCM读取SVT文件</label></p>'+
	'</td>'+
	'</tr>'+
	'<tr>'+
	'<td>'+
	'<label><input type="radio" name="svt" id="svt2" value="02" checked/></label>'+
	'</td>'+
	'<td>'+
	'<p class="box-p"><label style="display: block" for="svt2">从ECU读取SVT文件</label></p>'+
	'</td>'+
	'</tr>'+
	'<tr>'+
	'<td>'+
	'<label><input type="radio" name="svt" id="svt3" value="03"/></label>'+
	'</td>'+
	'<td>'+
	'<p class="box-p"><label style="display: block" for="svt3">从本地加载SVT文件</label></p>'+
	'</td>'+
	'</tr>'+
	
	'</table>'+
	
	'</div>'+
	//'<div class="scroll-table-footer">'+
	//'<div class="bottom-bar-button-box">'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710541(\'01\');">确定</button>'+
	//'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.fun710541(\'02\');">取消</button>'+
	//'</div>'+
	//'</div>'+
	'</div>'+
	
		'<!-- 增加模块 -->'+
	'<div id="addModule" class="box tip-box-wide">'+
	
	'<h1 class="box-title">增加模块</h1>'+
	
	'<div>'+
	'<p class="box-p">输入格式：xxxx_xxxxxxxx_xxx_xxx_xxx</p>'+
	
	'<p class="box-p"><label><input type="text" id="moduleInput" maxLength="25" style="width:80%;"/></label></p>'+
	
	'<div id="moduleInputTip"></div>'+
	'</div>'+
	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.addModule(\'01\');">确定</button>'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onClick="RMTClickEvent.addModule(\'02\');">返回</button>'+
	'</div>'+
	'</div>'+
	
		'<!-- 编程确认 -->'+
	'<div id="programConfirmWin" class="box tip-box-wide">'+
	
	'<h1 class="box-title">提示</h1>'+
	
	'<div>'+
	'<p class="box-p">读取原始设码数据失败，是否继续执行编程操作？</p>'+
	
	'<p class="box-p">如果继续请先关闭电门后再打开电门，然后点击‘继续’按钮</p>'+
	'</div>'+
	'<div class="bottom-bar-button-box">'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.Fun71050E(\'01\')">继续</button>'+
	'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.Fun71050E(\'02\')">取消</button>'+
	'</div>'+
	
	'</div>';
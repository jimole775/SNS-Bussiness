/**
 * Created by Andy on 2017/1/9.
 */
(function () {

	var temp1 = [
		'<div id="fun310519" class="data-box">',
		'<h1 class="box-title">接口自动检测失败，请选择接口类型：</h1>',
		'<div>',

		'<p class="box-p">',
		'<label for="radio31051901"><input type="radio" name="radio310519" id="radio31051901" value="01" style="margin: 0 10px 0 0;"/>OBDII KWP Bus</label></p>',
		'<br/>',

		'<p class="box-p">',
		'<input type="radio" name="radio310519" id="radio31051902" value="02" style="margin: 0 10px 0 0;"/><label for="radio31051902">KWP CAN Bus 100Kbps</label></p>',
		'<br/>',

		'<p class="box-p">',
		'<input type="radio" name="radio310519" id="radio31051903" value="03" style="margin: 0 10px 0 0;"/><label for="radio31051903">KWP CAN Bus 500Kbps</label></p>',
		'<br/>',
		'</div>',
		//'<div class="bottom-bar-button-box">',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.Fun310519Ok();">确定</button>',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.Fun310519Cancel();">退出</button>',
		//'</div>',
		'</div>'
	].join ("");

	var temp2 = [
		'<!-- 数据库版本列表 -->',
		'<div id="database_A08D" class="data-box">',
		'<h1 class="box-title">选择数据库版本：</h1>',
		'<table class="list-table click-list">',
		'<tbody id="dbVersionList_A08D">',
		'<tr>',
		'<td>',
		'<label for="dbOption_A08D1">数据库版本</label>',
		'</td>',
		'<td class="t-center">',
		'<label ><input type="radio" name="dbOption_A08D" id="dbOption_A08D1" value="01"/></label>',
		'</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		//'<p class="bottom-bar-button-box">',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.database_A08DNext();">下一步</button>',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.database_A08DReturn();">取 消</button>',
		//'</p>',
		'</div>'
	].join ("");
	var temp3 = [
		'<!-- 车型列表 -->',
		'<div id="carType_A08D" class="data-box">',
		'<h1 class="box-title">选择车型：</h1>',
		'<table width="95%" class="list-table click-list">',
		'<tbody id="carTypeList_A08D">',
		'<tr>',
		'<td>车型</td>',
		'<td class="t-center">',
		'<label><input type="radio" name="carOption_A08D" value="01"/></label>',
		'</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		//'<p class="bottom-bar-button-box">',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.carType_A08DNext();">确 定</button>',
		//'<button type="button" class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.carType_A08DReturn();">返 回</button>',
		//'</p>',
		'</div>'
	].join ("");
	var temp4 = [
		'<!-- 模块 列表 -->',
		'<div id="module_A08D" class="data-box">',
		'<h1 class="box-title" id="module_A08DTitle">选择模块：</h1>',
		'<div>',
		'<h4 class="list-table click-list" align="left">',
		'车架号码：<span id="vinId"> xxxxxxxxxxxxxxx</span></h4>',
		'<table width="95%" class="list-table click-list">',

		'<tr>',
		'<th class="th-center">编号</th>',
		'<th class="th-center">模块名称</th>',
		'<th class="th-center">地址</th>',
		'<th class="th-center"></th>',
		'</tr>',

		'<tbody id="module_A08DList">',

		'</tbody>',

		'</table>',
		'</div>',
		//'<p class="bottom-bar-button-box">',
		//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.module_A08DSetCode(\'01\');">恢复设码</button>',
		//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.module_A08DSetCode(\'02\');">设码</button>',
		//'<button type="button" class="bottom-bar-button bottom-bar-button3" onclick="RMTClickEvent.module_A08DCancel();">取消</button>',
		//'</p>',
		'</div>'
	].join ("");
	document.getElementById ("processBlock").innerHTML += temp1 + temp2 + temp3 + temp4;

}) ();

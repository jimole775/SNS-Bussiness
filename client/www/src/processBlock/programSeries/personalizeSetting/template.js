/**
 * Created by Andy on 2017/1/9.
 */
(function (){

var ConfigFileModule = [
	'<div id="ConfigFileModule" onclick="RMTClickEvent.ConfigFileModuleCancel()" style="position:absolute;left:0;top:0;width:100%;height:100%;display:none;z-index:200;background:rgba(0,0,0,0.6)">',
	'<div style="display:table-cell;vertical-align: middle">',
	'<div id="configFileNameList" style="height:auto;width:72%;margin:0 auto;overflow: auto;box-shadow: 1px 2px 3px #3F3F3F;">',
	'<button class="box-btn-vertical" onclick="RMTClickEvent.ConfigFileModuleConfirm()">',
	'<span class="item-description item-description-layout-table item-description-single">',
	'<em class="item-description-layout-cell"></em>',
	'</span>',
	'</button>',
	'</div>',
	'</div>',
	'</div>'
].join ("");

<!-- 模块 列表 -->
var module = [
	'<div id="module" class="data-box">',
	'   <div class="scroll-table-header" id="moduleTitle"></div>',
	'   <div class="scroll-table-body">',
	'       <table>',
	'           <thead>',
	'               <tr>',
	'                   <th class="th-center" style="color:#C0C0C0" width="15%"> 序号 </th>',
	'                   <th class="th-center" style="color:#C0C0C0" width="15%"> 地址 </th>',
	'                   <th class="th-center" style="color:#C0C0C0" width="25%"> 名称 </th>',
	'                   <th class="th-center" style="color:#C0C0C0" width="45%"> 配置文件 </th>',
	'               </tr>',
	'           </thead>',
	'           <tbody id="moduleList">',
	'           </tbody>',
	'       </table>',
	'   </div>',
	//'   <div class="scroll-table-footer">',
	//'       <p class="bottom-bar-button-box">',
	//'           <button type="button" class="bottom-bar-button bottom-bar-button1" onclick="RMTClickEvent.quitBusiness()">',
	//'               退出',
	//'           </button>',
	//'       </p>',
	//'   </div>',
	'</div>'
].join ("");

var functionSet = [
	'<div id="functionSet" class="data-box">',
	'   <div class="scroll-table-header">',
	'       <p class="box-title"><span id="moduleInfo_title">000000F9_007_008_010</span><br>可配置功能信息：</p>',
	'   </div>',
	'   <div class="scroll-table-body">',
	'       <table>',
	'           <tbody id="functionSetBody">',
	'               <tr>',
	'                   <td colspan="2">父级功能项title</td>',
	'               </tr>',
	'               <tr>',
	'                   <td width="65%"><span><em>选项列表</em><br><em class="item-notice">正在注释</em></span></td>',
	'                   <td width="35%">',
	'                       <div class="item-select">',
	'                           <label for="">',
	'                               <select name="" id="">',
	'                                   <option value="">大王达到</option>',
	'                                   <option value="">选大神</option>',
	'                                   <option value="">选大问答</option>',
	'                                   <option value="">选打完</option>',
	'                               </select>',
	'                           </label>',
	'                       </div>',
	'                   </td>',
	'               </tr>',
	'               <tr>',
	'                   <td width="65%">输入列表</td>',
	'                   <td width="35%">',
	'                       <div class="item-input">',
	'                           <label for="">',
	'                               <input type="text"/>',
	'                           </label>',
	'                       </div>',
	'                   </td>',
	'               </tr>',
	'           </tbody>',
	'       </table>',
	'   </div>',
	//'   <div class="scroll-table-footer">',
	//'       <p class="bottom-bar-button-box">',
	//'           <button class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.handleFunctionSet()">确定</button>',
	//'           <button class="bottom-bar-button bottom-bar-button2" onclick="RMTClickEvent.loopTrigger(\'functionSet\')">返回</button>',
	//'       </p>',
	//'   </div>',
	'</div>'
].join ("");
document.getElementById("processBlock").innerHTML += (ConfigFileModule + module + functionSet);
}());

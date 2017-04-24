/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div id="showSystem" ng-controller="systemCtrl" class="data-box">',
		'<header class="scroll-table-header">',
		'<button class=" item-button padding-when-without-inner-class" disabled>',
		'<span style="color:#A0A0A0;float: left;width:50%;display: block">',
		'测试到模块数：<em class="light-text" ng-bind="webViewSystemList_arr.length"></em>',
		'</span>',
		'<span style="color:#A0A0A0;float: right;width:50%;display: none;text-align: right;">',
		'故障码总数：<em class="warn-text" ng-bind="DTCTotal.length"></em>',
		'</span>',
		'</button>',
		'<button class="item-button padding-when-without-inner-class ellipsis" disabled style="box-sizing: border-box">',
		'<span> {{ scanProcess }} </span>',
		'<span class="light-text" ng-hide="(scanProcess === \'清除完毕\' || scanProcess === \'扫描完毕\' || scanProcess === \'无故障信息\' ||  scanProcess === \'系统未连接\' || scanProcess === \'初始化扫描进程\')">',
		'{{ originalSystemListIndex + 1}}',
		'</span><br>',
		'<span  ng-hide="(scanProcess === \'清除完毕\' || scanProcess === \'扫描完毕\' || scanProcess === \'无故障信息\' ||  scanProcess === \'系统未连接\' || scanProcess === \'初始化扫描进程\')">',
		'{{ originalSystemList_arr[originalSystemListIndex].name }}',
		'</span>',
		'<span  ng-show="scanProcess === \'无故障信息\'"> {{ webViewSystemList_arr[clickItemIndex].name }} </span>',
		'</button>',
		'</header>',
		'<div class="scroll-table-body" id="recordScrollTop">',
		'<button class="item-button animation" ng-repeat="(index,system) in webViewSystemList_arr track by $index" ng-show="system.show" ng-click="onItemClick($index,system.index)">',
		'<span class="item-description item-description-layout-table" style="width: 45%">',
		'<em class="item-description-layout-cell">{{($index + 1) + ". " + system.name}}</em>',
		'</span>',
		'<span class="item-value-layout-table" style="width: 45%">',
		'<span class="item-value-layout-cell">',
		'<i class="arrow-right" style="top:0.3rem"></i>',
		'<span ng-class="{\'故障\':\'warn-text\',\'无故障\':\'disable-text\',\'故障/已清除\':\'disable-text\'}[system.dtcStateText()]" style="float:right">',
		'{{system.dtcStateText()}}',
		'</span>',
		'</span>',
		'</span>',
		'</button>',
		'</div>',
		'</div>'
	].join ("");
})();
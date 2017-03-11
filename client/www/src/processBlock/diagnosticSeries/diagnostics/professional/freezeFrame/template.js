/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	//document.body.innerHTML += [
	document.getElementById("processBlock").innerHTML += [
		'<div id="showFreezeFrameData" class="data-box " ng-controller="ReadFreezeFrameCtrl">',
		'<div class="scroll-table-header">',
		'<div class="groupNav">',
		'<button class="item-button padding-when-without-inner-class" ng-click="createDropDownList()">',
		'<span ng-bind="curDtc.danwei" class="item-description">冻结帧分组</span>',
		'<i class="arrow-right"></i>',
		'<span class="item-value" ng-bind="curDtc.name">选择一个分组</span>',
		'</button>',
		'</div>',
		'</div>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="30%">信息描述</th>',
		'<th width="40%">信息值</th>',
		'<th width="30%">单位</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="support in curSupports" ng-show="support.show">',
		'<td>{{support.name}}</td>',
		'<td>{{support.ans}}</td>',
		'<td class="t-center">{{support.danwei}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
/**
 * Created by Andy on 2017/1/5.
 */
(function(){
	document.getElementById("processBlock").innerHTML += [
	'<div id="baseadjuster" class="data-box " ng-controller="TcpBaseAdjusterCtrl">',
	'<div class="scroll-table-header">',
	'</div>',
	'<div class="scroll-table-body">',
	'<table>',
	'<thead>',
	'<tr>',
	'<th width="45%">信息描述</th>',
	'<th width="35%">当前值</th>',
	'<th width="20%">单位</th>',
	'</tr>',
	'</thead>',
	'<tbody>',
	'<tr ng-repeat="baseadjusterItem in baseAdjuseterDataList" ng-show="baseadjusterItem.show">',
	'<td>{{baseadjusterItem.name}}</td>',
	'<td>{{baseadjusterItem.ans}}</td>',
	'<td class="t-center">{{baseadjusterItem.danwei}}</td>',
	'</tr>',
	'</tbody>',
	'</table>',
	'</div>',
	'</div>'
].join("");
})();
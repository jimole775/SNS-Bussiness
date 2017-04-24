/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div id="ShowDTCInfo" class="data-box" ng-controller="DTCCtrl">',
		'<div class="scroll-table-header"></div>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="25%">故障码编号</th>',
		'<th width="40%">故障码描述</th>',
		'<th width="35%">故障码状态</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="dtcItem in dtcList" ng-show="dtcItem.show">',
		'<td>{{dtcItem.danwei}}</td>',
		'<td>{{dtcItem.name}}</td>',
		'<td>{{dtcItem.status}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
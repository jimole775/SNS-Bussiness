/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
	//document.body.innerHTML += [
		'<div id="showDtc" class="data-box" ng-controller="DtcCtrl">',
		'<header class="scroll-table-header">',
		'</header>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="22%">编号</th>',
		'<th width="56%">故障码内容</th>',
		'<th width="22%">状态</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="dtc in currentSystemDtcList" ng-show="dtc.show">',
		'<td>{{dtc.danwei}}</td>',
		'<td>{{dtc.name}}</td>',
		'<td>{{dtc.status}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
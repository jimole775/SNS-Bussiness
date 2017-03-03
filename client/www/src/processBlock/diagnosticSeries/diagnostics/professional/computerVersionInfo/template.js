/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
	//document.body.innerHTML += [
		'<div id="showComputerVersionInfo" class="data-box" ng-controller="ReadComputerVersionInfoCtrl">',
		'<div class="scroll-table-header"></div>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="45%">信息描述</th>',
		'<th width="55%">信息值</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="item in versionInfos" ng-show="item.show">',
		'<td>{{item.name}}</td>',
		'<td>{{item.ans}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
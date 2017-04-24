/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div id="channeldata" class="data-box " ng-controller="TcpChannelDataCtrl">',
		'<div class="scroll-table-header">',
		'</div>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="20%">序号</th>',
		'<th width="30%">信息描述</th>',
		'<th width="30%">当前值</th>',
		'<th width="20%">单位</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="channelItem in channelDataList" ng-show="channelItem.show">',
		'<td class="t-center">{{channelItem.index}}</td>',
		'<td>{{channelItem.name}}</td>',
		'<td>{{channelItem.ans}}</td>',
		'<td class="t-center">{{channelItem.danwei}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
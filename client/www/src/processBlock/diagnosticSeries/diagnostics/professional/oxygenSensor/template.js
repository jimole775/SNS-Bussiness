/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div id="showOxygenSensorData" class="data-box " ng-controller="OxygenSensorCtrl">',
		'<div class="scroll-table-header">',
		'<div class="groupNav">',
		'<button class="item-button padding-when-without-inner-class" ng-click="createDropDownList()">',
		'<span class="item-description">氧传感器分组</span>',
		'<i class="arrow-right"></i>',
		'<span class="item-value">{{ curGroupItem.name }}</span>',
		'</button>',
		'</div>',
		'</div>',
		'<div class="scroll-table-body">',
		'<table>',
		'<thead>',
		'<tr>',
		'<th width="30%">信息描述</th>',
		'<th width="18%">当前值</th>',
		'<th width="18%">极小值</th>',
		'<th width="18%">极大值</th>',
		'<th width="16%">单位</th>',
		'</tr>',
		'</thead>',
		'<tbody>',
		'<tr ng-repeat="support in curSupports" ng-show="support.show">',
		'<td>{{support.name}}</td>',
		'<td>{{support.ans}}</td>',
		'<td>{{support.min}}</td>',
		'<td>{{support.max}}</td>',
		'<td class="t-center">{{support.danwei}}</td>',
		'</tr>',
		'</tbody>',
		'</table>',
		'</div>',
		'</div>'
	].join ("");
})();
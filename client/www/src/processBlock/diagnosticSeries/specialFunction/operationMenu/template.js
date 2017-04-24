/**
 * Created by Andy on 2017/1/6.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div ng-controller="operateMenuCtrl" id="ShowOperate" class="data-box">',
		'<div class="scroll-table-header">',
		'</div>',
		'<div class="scroll-table-body">',
		'<button type="button" class="item-button " ng-repeat="item in serviceList" ng-click="menuJump(item.pid)">',
		'<span class="item-description item-description-layout-table">',
		'<span class="item-description-layout-cell extend-font-size">',
		//<!--line是根据拆分文本内的\n换行符，形成的数组元素，一个元素代表一行的文本内容-->
		'<em style="display: block" ng-repeat="paragraph in item.name track by $index"> {{paragraph}} </em>',
		'</span>',
		'</span>',
		'<span class="item-value-layout-table">',
		'<span class="item-value-layout-cell">',
		'<i class="arrow-right arrow-right-without-text"></i>',
		'</span>',
		'</span>',
		'</button>',
		'</div>',
		'</div>'
	].join ("");
})();
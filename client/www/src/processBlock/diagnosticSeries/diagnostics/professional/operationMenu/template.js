/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div class="data-box" id="ShowOperate" ng-controller="OperateMenuCtrl">',
		'<div class="scroll-table-header">',
		'</div>',
		'<div class="scroll-table-body">',
		'<button type="button" class="item-button " ng-click="operation.event()" ng-repeat="operation in operationList" ng-show="operation.show">',
		'<span class="item-description item-description-layout-table">',
		'<em class="item-description-layout-cell extend-font-size">{{operation.text}}</em>',
		'</span>',

		'<span class="item-value-layout-table">',
		'<span class="item-value-layout-cell">',
		'<i class="arrow-right arrow-right-without-text"></i>',
		'</span>',
		'</span>',
		'</button>',
		'<button type="button" class="box-btn-vertical" ng-show="hasNotSerList"><span>服务列表为空</span></button>',
		'</div>',
		'</div>'
	].join ("");
})();
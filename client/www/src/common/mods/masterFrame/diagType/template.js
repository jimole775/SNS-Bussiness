/**
 * Created by Andy on 2017/1/10.
 */
(function () {

	document.body.innerHTML += [
		'<div ng-controller="diagTypeController" id="diagType" class="data-box">',
		'   <div class="scroll-table-header">',
		'   </div>',
		'   <div class="scroll-table-body">',
		'           <button class="item-button animation" style="height:8rem" ng-repeat="item in diagTypeList">',
		'               <span class="item-description item-description-layout-table" ng-click="eventHandle(item)">',
		'                   <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'               </span>',
						//下拉显示描述文本
		'               <span class="item-value-layout-table" ng-click="descHandle()">',
		'                   <span class="item-value-layout-cell">',
		'                       <i class="arrow-down arrow-layout-middle animation"></i>',
		'                   </span>',
		'               </span>',
		'           </button>',
		'           <p></p>',
		'   </div>',
		'</div>'
	].join("");

}) ();
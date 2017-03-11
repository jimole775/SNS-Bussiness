/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.body.innerHTML += [
	//document.getElementById("processBlock").innerHTML += [
		'<div id="CarConfig" ng-controller="carConfigCtrl" class="data-box">',
		'   <div class="scroll-table-header">',
		'       <p class="box-p">',
		'           <span ng-class="[\'disable-text\',{\'href-text\':pagesDataIndex==0}]" ng-click="navSelection(-1)">菜单：</span>',
		'           <span ng-repeat="(recordIndex,item) in pagesOptionChosenRecord" ng-click="navSelection(recordIndex)">',
		'               <i class="auxiliary-mark">|&nbsp;</i>',
		'               <em ng-class="[\'disable-text\',{\'href-text\':recordIndex==(pagesDataIndex - 1)}]">{{ item }}</em>',
		'           </span>',
		'       </p>',
		'   </div>',
		'   <div class="scroll-table-body">',
		'       <div ng-repeat="(parentIndex,curPageData) in pagesData">',
		'           <button class=" item-button animation" ng-repeat="(curIndex,item) in curPageData | orderBy:\'index\'" ng-show="item.show" ng-click="handleSelect(parentIndex,item)">',
		'               <span class="item-description item-description-layout-table">',
		'                   <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'               </span>',
		'               <span class="item-value-layout-table">',
		'                   <span class="item-value-layout-cell">',
		'                       <i class="arrow-right"></i>',
		'                   </span>',
		'               </span>',
		'           </button>',
		'       </div>',
		'   </div>',
		'</div>'
	].join ("");
})();

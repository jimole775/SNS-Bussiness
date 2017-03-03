/**
 * Created by Andy on 2017/1/10.
 */
(function () {

	document.body.innerHTML += [
		'<div ng-controller="keyMatchController" id="keyMatch" class="data-box">',
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
		'           <button class="item-button animation" style="height:8rem" ng-repeat="(curIndex,item) in curPageData | orderBy:\'index\'" ng-show="item.show">',
		'               <span class="item-description item-description-layout-table" ng-click="handleSelect(parentIndex,item)">',
		'                   <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'               </span>',
		'               <span class="item-value-layout-table" ng-if="item.picture" ng-click="handleHelp(item.picture)">',
		'                   <span class="item-value-layout-cell">',
		'                       <span>帮助</span>',
		'                       <i class="arrow-right arrow-layout-middle"></i>',
		'                   </span>',
		'               </span>',
		'           </button>',
		'       </div>',
		'   </div>',
		'   <help-pop></help-pop>',
		'</div>'

	].join("");

}) ();
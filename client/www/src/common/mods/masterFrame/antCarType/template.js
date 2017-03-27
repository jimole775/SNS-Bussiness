/**
 * Created by Andy on 2017/1/5.
 */
(function(){
	document.body.innerHTML += [
		'<div ng-controller="antCarTypeController" id="antCarType" class="data-box">',
		'   <div class="scroll-table-header">',
		'       <p class="box-p">',
		'           <span ng-class="[\'disable-text\',{\'href-text\':pagesDataIndex==0}]" ng-click="navSelection(-1)"> 主菜单 </span>',
		'           <span ng-repeat="(recordIndex,item) in pagesOptionChosenRecord" ng-click="navSelection(recordIndex)">',
		'               <i class="auxiliary-mark">|&nbsp;</i>',
		'               <em ng-class="[\'disable-text\',{\'href-text\':recordIndex==(pagesDataIndex - 1)}]"> {{ item }} </em>',
		'           </span>',
		'       </p>',
		'   </div>',
		'   <div class="scroll-table-body">',
		'       <div ng-repeat="(parentIndex,curPageData) in pagesData">',
		'           <button class=" item-button animation" ng-repeat="(curIndex,item) in curPageData | orderBy:\'index\'" ng-show="item.show">',
		'               <span class="item-description item-description-layout-table" ng-class="{\'full-width\':!item.picture}" ng-click="handleSelect(parentIndex,item)">',
		'                   <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'               </span>',
						//如果有图片，就切换到向下的箭标
		'               <span class="item-value-layout-table"  ng-if="item.picture" ng-click="handleHelp(item.picture)">',
		'                   <span class="item-value-layout-cell">',
		'                       <i style="float:right" class="arrow-right arrow-layout-middle"></i>',
		'                       <span style="float:right" >帮助</span>',
		'                   </span>',
		'               </span>',
		'           </button>',
		'       </div>',
		'   </div>',
		'   <help-pop></help-pop>',
		'</div>'
	].join("");

})();

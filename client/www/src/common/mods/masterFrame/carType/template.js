/**
 * Created by Andy on 2017/1/5.
 */
(function(){
	document.body.innerHTML += [
		'<div ng-controller="carTypeController" id="carType" class="data-box">',
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
		'               <span class="item-description item-description-layout-table" ng-click="handleSelect(parentIndex,item)">',
		'                   <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'               </span>',
		'               <span class="item-value-layout-table" ng-click="showImg(parentIndex,curIndex,item.imgShow)">',
		'                   <span class="item-value-layout-cell">',
		'                       <i class="arrow-down arrow-layout-middle animation" ng-class="{\'arrow-down\':!item.imgShow,\'arrow-up\':item.imgShow}"></i>',
		'                   </span>',
		'               </span>',
		'               <img  ng-show="item.imgShow" width="100%" ng-src="./images/carType/img/{{ item.picture }}" alt="车型图片丢失，请更新资源包">',
		'           </button>',
		'       </div>',
		'   </div>',
		'</div>'
	].join("");

})();

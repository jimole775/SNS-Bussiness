/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	document.body.innerHTML += [
	//document.getElementById("processBlock").innerHTML += [
		'<div ng-controller="carSystemCtrl" id="CarSystem" class="data-box">',
		'<div class="scroll-table-header">',
		'   <p class="box-p">',
		'       <span class=" href-text">主菜单</span>',
		'       <span ng-repeat="item in pagesOptionChosenRecord">',
		'           <i class="auxiliary-mark">|&nbsp;</i>' +
		'           <em class=" href-text">{{ item }}</em>',
		'       </span>',
		'   </p>',
		'</div>',
		'<div class="scroll-table-body">',
		'   <button class=" item-button" ng-repeat="item in curPageData | orderBy:\'index\'" ng-click="handleSelect(item)">',
		'       <span class="item-description item-description-layout-table">',
		'           <em class="item-description-layout-cell extend-font-size">{{ item.name }}</em>',
		'       </span>',
		'       <span class="item-value-layout-table">',
		'           <span class="item-value-layout-cell">',
		'               <i class="arrow-right"></i>',
		'           </span>',
		'       </span>',
		'   </button>',
		'</div>',
		'</div>'
	].join ("");
})();

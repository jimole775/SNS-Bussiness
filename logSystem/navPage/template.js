/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	//document.body.innerHTML += [
	document.getElementById("processBlock").innerHTML += [
		'<section class="data-box" id="navPage" ng-controller="navPageCtrl">',
		'   <div></div>',
		'   <div class="scroll-table-body" id="selectedRecordNav">',
		'       <button class=" item-button" ng-click="descRecord();">',
		'           <span class="item-description item-description-layout-table">',
		'               <em class="item-description-layout-cell">车型信息</em>',
		'           </span>',
		'           <span class="item-value-layout-table">',
		'               <span class="item-value-layout-cell">',
		'                   <i class="arrow-right"></i>',
		'               </span>',
		'           </span>',
		'       </button>',
		'       <button class="item-button" ng-click="devMessages();">',
		'           <span class="item-description item-description-layout-table">',
		'               <em class="item-description-layout-cell">流程记录</em>',
		'           </span>',
		'           <span class="item-value-layout-table">',
		'               <span class="item-value-layout-cell">',
		'                   <i class="arrow-right"></i>',
		'               </span>',
		'           </span>',
		'       </button>',
		'   </div>',
		'</section>'
	].join ("");
})();

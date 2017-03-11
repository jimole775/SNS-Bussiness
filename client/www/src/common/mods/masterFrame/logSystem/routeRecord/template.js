/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	//document.body.innerHTML += [
	document.getElementById("processBlock").innerHTML += [
		'<div id="carDescriptionRecord" style="display:none;" ng-controller="carDescriptionRecordCtrl">',
		'   <div id="carTypeRecord" ng-show="hasCarTypeSelect">',
		'       <h1 class="table-title" align="center">车型</h1>',
		'           <button class=" item-button" disabled ng-repeat="item in CacheCarTypeSelected">',
		'               <span class="item-description">车型选择-{{$index + 1}}</span>',
		'               <span class="item-value">{{ item }}</span>',
		'           </button>',
		'   </div>',
		'   <div id="carConfigRecord" ng-show="hasCarConfigSelect">',
		'       <h1 class="table-title" align="center">配置信息</h1>',
		'           <button class=" item-button" disabled ng-repeat="item in CacheCarConfigSelected">',
		'               <span class="item-description">配置选择-{{$index + 1}}</span>',
		'               <span class="item-value">{{ item }}</span>',
		'           </button>',
		'   </div>',
		'   <div id="carSystemRecord" ng-show="hasCarSystemSelect">',
		'       <h1 class="table-title" align="center">系统信息</h1>',
		'           <button class=" item-button" disabled ng-repeat="item in CacheCarSystemSelected">',
		'               <span class="item-description">系统选择-{{$index + 1}}</span>',
		'               <span class="item-value">{{ item }}</span>',
		'           </button>',
		'   </div>',
		'</div>'
	].join ("");
})();

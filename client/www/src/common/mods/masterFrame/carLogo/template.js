/**
 * Created by Andy on 2017/1/6.
 */
(function () {
	//document.getElementById("commonMods").innerHTML += [
	document.body.innerHTML += [
		'<div id="carLogo" class="data-box" ng-controller="carLogoController">',
		'   <div class="tab-head">',
		'       <div class="tab-chunk" >',
		'           <button class="button-init button-separate animation" ng-class="{\'nav-active\':$index == 0,\'full\':carLogo.length === 1}" ng-repeat="item in carLogo" ng-bind="item.where">亚洲车系</button>',
		//'           <button class="button-init button-separate animation">欧美车系</button>',
		'       </div>',
		'       <div class="sliding-shoe" id="slidingShoe" ng-class="{\'full\':carLogo.length === 1}"></div>',
		'   </div>',
		'   <div class="context_main" id="context_main">',
				//如果只有一种系列的车型，就只为内容盒子添加full样式，使其填满整个窗体
		'       <div class="context_main_with_title car-module-main" id="scroll-body-controller" ng-class="{\'full\':carLogo.length === 1}">',
		'           <div class="module-list car-module-list" ng-repeat="item in carLogo" ng-class="{\'full\':carLogo.length === 1}">',
		'               <ul class="module-list-ul">',
		'                   <li class="module-list-ul-li" ng-repeat="carInfo in item.cars track by $index">',
		'                       <button class="button-init full" ng-click="eventHandle(carInfo)">',
		'                           <div class="fun-module-line-index">',
		'                               <p class="index-img-container">',
		'                                   <img class="car-logo-index" ng-src="./images/carLogo/logo/{{ carInfo.pic }}">',
		'                               </p>',
		'                               <span class="car-name">{{ carInfo.cn }}<br/><span ng-hide="!carInfo.en">({{ carInfo.en }})</span></span>',
		'                           </div>',
		'                       </button>',
		'                       <div></div>',
		'                   </li>',
		'               </ul>',
		'           </div>',
		'       </div>',
		'   </div>',
		'</div>'

	].join ("");


} ());

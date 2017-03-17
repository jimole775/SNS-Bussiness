/**
 * Created by Andy on 2017/1/6.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div ng-controller="specialProcessCtrl">',
		'   <div id="bombTipBox" class="box tip-box-wide alert-box">',
		'       <h1 class="box-title">提示</h1>',
		'       <div>',
		'           <div ng-repeat="item in contents_arr">',
		'               <p class="box-p" ng-repeat="paragraph in item.name track by $index">{{ paragraph }}</p>',
		'           </div>',
		'           <p class="box-p" ng-show="BombBoxType===\'02\'">',
		'               <label>',
		'                   <input id="inputID" type="number"/>',
		'               </label>',
		'           </p>',
		'           <p class="box-p warn-text"></p>',
		'       </div>',
		'       <div class="bottom-bar-button-box">',
		'           <button type="button" ng-class="[\'bottom-bar-button\', ' +
		'                                           {\'bottom-bar-button1\':buttons_arr.length===1}, ' +
		'                                           {\'bottom-bar-button2\':buttons_arr.length===2}, ' +
		'                                           {\'bottom-bar-button3\':buttons_arr.length===3}]"',
		'                   ng-repeat="item in buttons_arr | orderBy:\'supid\'"',
		'                   ng-click="handleBombTipBoxClick(buttons_arr,$index + 1,\'inputID\')">',
		'                   {{ item.name }}',
		'           </button>',
		'       </div>',
		'   </div>',


		'   <div id="bombMenuBox" class="box tip-box-wide alert-box">',
		'       <h1 class="box-title">菜单</h1>',
		'       <ul>',
		'           <li ng-repeat="item in items_arr | orderBy:\'supid\'">',
		'               <button type="button" class=" item-button" ng-click="handleMenuItemClick(items_arr,$index + 1)">',
		'                   <span ng-class="[\'item-description\',\'item-description-layout-table\',{\'full-width\':!item.menuItemsValue}]">',
		'                       <em class="item-description-layout-cell">{{item.name}}</em>',
		'                   </span>',
		'                   <span class="item-value item-value-layout-table" ng-if="item.menuItemsValue">',
		'                       <em class="item-value-layout-cell">{{item.menuItemsValue}}</em>',
		'                   </span>',
		'               </button>',
		'           </li>',
		'       </ul>',
		'       <div class="bottom-bar-button-box">',
		'           <button type="button" ng-class="[\'bottom-bar-button\',\'bottom-bar-button1\']" ng-click="handleMenuItemClick(items_arr,\'00\')"> 返回 </button>',
		'       </div>',
		'   </div>',


		'   <div id="spMenuBox" class="box tip-box-wide alert-box">',
		'       <h1 class="box-title">菜单</h1>',
		'<div>',
		'           <div ng-repeat="item in contents_arr">',
		'               <p class="box-p" ng-repeat="paragraph in item.name track by $index">{{ paragraph }}</p>',
		'           </div>',
		'       <ul ng-show="items_arr.length">',
		'           <li ng-repeat="item in items_arr | orderBy:\'supid\'">',
		'               <button type="button" class=" item-button">',
		'                   <span ng-class="[\'item-description\',\'item-description-layout-table\',{\'full-width\':!item.menuItemsValue}]">',
		'                       <em class="item-description-layout-cell">{{item.name}}</em>',
		'                   </span>',
		'                   <span class="item-value item-value-layout-table" ng-if="item.menuItemsValue">',
		'                       <em class="item-value-layout-cell">{{item.menuItemsValue}}</em>',
		'                   </span>',
		'               </button>',
		'           </li>',
		'       </ul>',
		'       <ul ng-show="radios_arr.length">',
		'           <li ng-repeat="item in radios_arr | orderBy:\'supid\'" style="height: 6rem;position: relative;width: 100%;">',
		'               <div style="display: table;width: inherit;	height: inherit;padding: 0 1rem;box-sizing: border-box;font-size:1.2rem">' +
		'					<label style="display: table-cell;position: relative;vertical-align: middle;">' +
		'						<input style="width: auto;" type="radio" name="radio_ant" ng-disabled="item.disabled == \'01\'"/>',
		'						<span style="position: absolute;top: 0;left: 0;" ng-class="[\'item-description\',\'item-description-layout-table\',{\'full-width\':!item.menuItemsValue}]">',
		'                       	<em class="item-description-layout-cell" ng-class="{\'disable-text\':item.disabled == \'01\'}">{{item.name}}</em>',
		'                   	</span>',
		'                   	<span style="position: absolute;right: 0;top: 0;" class="item-value item-value-layout-table" ng-if="item.menuItemsValue">',
		'                       	<em class="item-value-layout-cell" ng-class="{\'disable-text\':item.disabled == \'01\'}">{{item.menuItemsValue}}</em>',
		'                   	</span>',
		'               	</label>' +
		'				</div>',
		'           </li>',
		'       </ul>',
		'</div>',
		'       <div class="bottom-bar-button-box">',
		'           <button style="height:auto" ' +
		'					type="button" ' +
		'					ng-class="[\'bottom-bar-button\', ' +
		'                             {\'bottom-bar-button1\':buttons_arr.length===1}, ' +
		'                             {\'bottom-bar-button2\':buttons_arr.length===2}, ' +
		'                             {\'bottom-bar-button3\':buttons_arr.length===3}]"',
		'                   ng-repeat="item in buttons_arr | orderBy:\'supid\'"',
		'                   ng-click="handleMenuItemClick_sp(buttons_arr,$index + 1)">',
		'                   {{ item.name }}',
		'           </button>',
		'       </div>',
		'   </div>',

		'</div>'
	].join ("");
})();
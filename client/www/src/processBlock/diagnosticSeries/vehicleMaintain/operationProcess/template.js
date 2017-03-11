/**
 * Created by Andy on 2017/1/6.
 */
(function() {
	document.getElementById("processBlock").innerHTML += [
		'<div ng-controller="maintainProcessCtrl">',
		'<div id="bombTipBox" class="box tip-box-wide alert-box">',
		'<h1 class="box-title">提示</h1>',
		'<div>',
		'<div ng-repeat="item in contents_arr">',
		'<p class="box-p" ng-repeat="line in item.text track by $index">{{ line }}</p>',
		//line是根据拆分文本内的\n换行符，形成的数组元素，一个元素代表一行的文本内容
		'</div>',
		'<p class="box-p" ng-show="BombBoxType===\'02\'">',
		'<label>',
		//<input id="inputID" type="text" readonly onclick="RMTClickEvent.iScrollPluginDigit('inputID')"/>
		'<input id="inputID" type="number"/>',
		'</label>',
		'</p>',

		'<p class="box-p warn-text"></p>',
		'</div>',
		'<div class="bottom-bar-button-box">',
		'<button type="button" ng-class="[\'bottom-bar-button\',' +
		' {\'bottom-bar-button1\':buttons_arr.length===1},{\'bottom-bar-button2\':buttons_arr.length===2},{\'bottom-bar-button3\':buttons_arr.length===3}]"',
		' ng-repeat="item in buttons_arr | orderBy:\'supid\'"',
		' ng-click="handleBombTipBoxClick(buttons_arr,$index + 1,\'inputID\')">',
		'{{ item.text }}',
		'</button>',
		'</div>',
		'</div>',
		'<div id="bombMenuBox" class="box tip-box-wide alert-box">',
		'<h1 class="box-title">菜单</h1>',
		'<ul>',
		'<li ng-repeat="item in contents_arr | orderBy:\'supid\'">',
		'<button type="button" class=" item-button" ng-click="handleMenuItemClick(contents_arr,$index + 1)">',

		'<span ng-class="[\'item-description\',\'item-description-layout-table\',{\'\':item.menuItemsValue}]">',
		'<em class="item-description-layout-cell">{{item.text}}</em>',
		'</span>',
		'<span class="item-value item-value-layout-table" ng-if="item.menuItemsValue">',
		'<em class="item-value-layout-cell">{{item.menuItemsValue}}</em>',
		'</span>',
		'<span class="item-value-layout-table" ng-if="!item.menuItemsValue">',
		'<span class="item-value-layout-cell">',
		'<i class="arrow-right arrow-layout-middle"></i>',
		'</span>',
		'</span>',
		'</button>',
		'</li>',
		'</ul>',
		'<div class="bottom-bar-button-box">',
		'<button type="button" ng-class="[\'bottom-bar-button\',\'bottom-bar-button1\']" ng-click="handleMenuItemClick(contents_arr,\'00\')">',
		'返回',
		'</button>',
		'</div>',
		'</div>',
		'</div>'
	].join ("");
})();
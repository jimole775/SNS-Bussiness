/**
 * Created by Andy on 2017/1/5.
 */
(function(){

	document.body.innerHTML += [
		'<div ng-controller="RMTCharController" ng-class="[\'charForm\',\'alert-box\',{\'hide\':!charSate.charFormState,\'show\':charSate.charFormState}]" ng-click="charSate.phraseFormState = false">',

		//头部模块
		'   <head-bar></head-bar>',

		//文本显示模块
		'   <div class="charBody" ng-class="{\'hide\':!charSate.charFormState,\'show\':charSate.charFormState}">',
		'       <div ng-repeat="item in charSentence">',
		'           <p ng-show="item._interval >= 2*60*1000 || item._interval < 0" class="RMTChar-timer" ng-bind="item.timer">时间</p>',
		'           <div ng-class="{\'RMTChar-remote\':item.remoteRole===\'remote\',\'RMTChar-native\':item.remoteRole===\'native\'}">',
		'               <p  ng-hide="item._continuity && item._interval < 2*60*1000" class="userName" ng-bind="item.userName">名字</p>',
		'               <p class="charContent">',
		'                   <span class="charSentence" ng-bind="item.sentence">聊天内容</span>',
		'                   <i class="charPopCorner"></i>',
		'               </p>',
		'           </div>',
		'       </div>',
		'   </div>',

		//脚部功能模块
		'   <foot-bar></foot-bar>',

		'</div>'
	].join ("");

})();

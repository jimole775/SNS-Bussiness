/**
 * Created by Andy on 2017/1/5.
 */
(function(){
	document.body.innerHTML += [
		'<div id="charHoverButton" ng-class="[\'animation-width\', \'char-hover-button\',{\'char-hover-button-full\':charSate.newSentenceAmount,\'show\':isRMT!=0,\'hide\':isRMT==0}]"' +
		'     ng-controller="charHoverButtonController" ng-click="clickTrigger()" ng-hide="charSate.charFormState">',
		'   <div class="char-message-tips-img"></div>',
		'   <div class="message-remain-form" ng-hide="!charSate.newSentenceAmount">',
		'       <div>',
		'           <span class="char-with" ng-bind="charSate.charWith">远程对象</span>',
		'           <span class="message-remain-count" ng-bind="\'(\' + charSate.newSentenceAmount + \')\'"></span>',
		'       </div>',
		'   </div>',
		'</div>'
	].join("");
})();

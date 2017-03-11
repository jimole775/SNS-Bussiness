/**
 * Created by Andy on 2017/1/5.
 */
(function(){
document.body.innerHTML += [
	'<div ng-controller="RMTCharAdditionalFnController" class="phraseForm" ng-class="{\'hide\':!charSate.phraseFormState,\'show\':charSate.phraseFormState}">',
	'   <ul class="phraseList" ng-class="{\'hide\':!charSate.phraseFormState,\'show\':charSate.phraseFormState}">',
	'       <li class="phraseItem" ng-repeat="item in charSate.phraseAry" ng-click="isChoseAPhrase(item.content,$event,$index)">',
	'           <span ng-bind="item.title"></span>',
	'       </li>',
	'   </ul>',
	'</div>'
].join ("");
})();

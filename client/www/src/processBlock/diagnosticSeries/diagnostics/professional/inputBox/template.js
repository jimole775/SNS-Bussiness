/**
 * Created by Andy on 2017/1/5.
 */
(function() {
	<!-- TCP大众通道数据流读值 与 TCP大众基本调整的输入通道号对话框 -->
	document.getElementById("processBlock").innerHTML += [
		'<div class="box tip-box-wide" id="numberInputBox" ng-controller="InputBoxController">',
		'<h1 class="box-title">请输入通道号：0-255',
		'</h1>',
		'<div>',
		'   <p class="box-p" ng-show="[errorMsg.length]" ng-bind="errorMsg" style="color: red"></p>',
		'   <p class="box-p">' +
		'       <label>' +
		'           <input type="number" size="3" id="numberInput" required/>',
		'       </label>' +
		'   </p>',
		'</div>' +
		'<div class="bottom-bar-button-box">' +
		'<button class="bottom-bar-button bottom-bar-button2" ng-click="inputBoxCommit()">确定</button>' +
		'<button class="bottom-bar-button bottom-bar-button2" ng-click="inputBoxCancel()">返回</button>' +
		'</div>',
		'</div>'
	].join ("");
})();
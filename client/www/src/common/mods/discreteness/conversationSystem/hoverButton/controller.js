/**
 * Created by Andy on 2016/12/19.
 */
(function () {


	App.controller("charHoverButtonController", ["$scope", "$element", "$rootScope", function ($scope, $element, $rootScope) {

		//监听远程协助的身份，global.remoteRole默认为0（正常业务），APP推送身份信息的时候是有延迟的！
		$scope.isRMT = 0;
		var watcher = setInterval(function () {
			//if (global.RMTID.role != 0) {
				$scope.$apply(function () {
					$scope.isRMT = global.RMTID.role;
				});
				//clearInterval(watcher);
			//}
		}, 100);

		$scope.charSate = {};
		$scope.charSate.charFormState = false;
		$scope.charSate.phraseFormState = false;
		$scope.charSate.newSentenceAmount = 0;
		$scope.charSate.contentsTyped = "";
		$scope.charSate.charWith = "远程对象";
		$scope.clickTrigger = function () {
			$scope.charSate.charFormState = !$scope.charSate.charFormState;
			$scope.charSate.newSentenceAmount = 0;
			$scope.$emit("charSate");

			//预留45毫秒时间用来渲染，然后再把滚动条拉到底部（使用jq方法或者angular_jqLite）
			setTimeout(function () {
				angular.element(".charBody").animate({scrollTop: angular.element(".charBody")[0].scrollHeight}, 300);
			}, 105);
		};

		//charSate对象只在聊天系统下使用
		$rootScope.$on("charSate", function (scope) {
			$scope.charSate = scope.targetScope[scope.name];
		});

	}])

		.config(['$provide', function ($provide) {
			var _drag = new Drag();
			_drag.bindEvent("charHoverButton", "charHoverButton");
		}]);

})();




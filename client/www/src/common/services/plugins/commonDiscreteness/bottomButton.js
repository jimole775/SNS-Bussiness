/**
 * Created by Andy on 2017/3/2.
 */
/**
 * Created by Andy on 2016/2/20.
 */
(function () {
	var win = window;
	var doc = document;
	var bottomButton = [
		'<div class="scroll-table-footer bottomButton" id="bottomButton" ng-controller="bottomButtonCtrl">',
		'<div class="bottom-bar-button-box">',
		'<button type="button" class="bottom-bar-button bottom-bar-button-special" ng-class="btnCss()"  ng-disabled="!onBtn1Disable()" ng-click="onBtn1Click()" ng-bind="btn1BindText()" ng-show="btn1show()"></button>',
		'<button type="button" class="bottom-bar-button bottom-bar-button-special" ng-class="btnCss()"  ng-disabled="!onBtn2Disable()" ng-click="onBtn2Click()" ng-bind="btn2BindText()" ng-show="btn2show()"></button>',
		'<button type="button" class="bottom-bar-button bottom-bar-button-special" ng-class="btnCss()"  ng-disabled="!onBtn3Disable()" ng-click="onBtn3Click();" ng-bind="btn3BindText()" ng-show="btn3show()"></button>',
		'</div>',
		'</div>'

	].join('');
	doc.write(bottomButton);

	win.App.controller('bottomButtonCtrl', ['$scope', '$element', function ($scope, $element) {

		$scope.btn1Text = '';
		$scope.btn2Text = '';
		$scope.btn3Text = '';

		//初始化btn1show()，避免 ng-class="btnCss()"，ng-show="btn2show()" 时报错；
		$scope.btn1show = function () {return ''};
		$scope.btn2show = function () {return ''};
		$scope.btn3show = function () {return ''};

		$scope.safeApply = function (fn) {
			var phase = this.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		//监听 $scope.btn1Text , 可以传入function(){}， 执行时可以抓取最新的变量；
		$scope.$watch('btn1Text', function () {
			$scope.btn1BindText = function () {
				if (typeof $scope.btn1Text === 'string') {
					return $scope.btn1Text
				}
				else if (typeof $scope.btn1Text === 'function') {
					return $scope.btn1Text()
				}
			};
			$scope.btn1show = $scope.btn1BindText() ? $scope.btn1BindText : function () {return ''};
		});

		//监听 $scope.btn2Text , 可以传入function(){}，执行时可以抓取最新的变量；
		$scope.$watch('btn2Text', function () {
			$scope.btn2BindText = function () {
				if (typeof $scope.btn2Text === 'string') {
					return $scope.btn2Text
				}
				else if (typeof $scope.btn2Text === 'function') {
					return $scope.btn2Text()
				}
			};
			$scope.btn2show = $scope.btn2BindText() ? $scope.btn2BindText : function () {return ''};
		});

		//监听 $scope.btn3Text , 可以传入function(){}, 执行时可以抓取最新的变量；
		$scope.$watch('btn3Text', function () {
			$scope.btn3BindText = function () {
				if (typeof $scope.btn3Text === 'string') {
					return $scope.btn3Text
				}
				else if (typeof $scope.btn3Text === 'function') {
					return $scope.btn3Text()
				}
			};
			$scope.btn3show = $scope.btn3BindText() ? $scope.btn3BindText : function () {return ''};
		});

		$scope.btnCss = function () {
			if ($scope.btn1show() && !$scope.btn2show() && !$scope.btn3show()) {
				return 'bottom-bar-button1'
			}
			if ($scope.btn2show() && $scope.btn1show() && !$scope.btn3show()) {
				return 'bottom-bar-button2'
			}
			if ($scope.btn3show() && $scope.btn2show() && $scope.btn1show()) {
				return 'bottom-bar-button3'
			}
		};

		$scope.onBtn1Click = function () {
			//todo #hack for 远程简易诊断 按钮文本无法同步的问题
			win.RMTClickEvent.Btn1Click(global.RMTID.systemScanState);
		};

		win.RMTClickEvent.Btn1Click = function(RMTScanState){
			//如果传入 有代理参数，就调用
			if($scope.btn1Callback instanceof Function) $scope.btn1Callback(RMTScanState);
		};

		$scope.onBtn2Click = function () {
			win.RMTClickEvent.Btn2Click();
		};

		win.RMTClickEvent.Btn2Click = function(){
			if ($scope.btn2Callback instanceof Function) $scope.btn2Callback();
		};

		$scope.onBtn3Click = function () {
			win.RMTClickEvent.Btn3Click();
		};

		win.RMTClickEvent.Btn3Click = function(){
			if ($scope.btn3Callback instanceof Function) $scope.btn3Callback();
		};

		$scope.onBtn1Disable = function () {
			if ($scope.btn1Disable instanceof Function) {
				return $scope.btn1Disable();
			} else {
				return true;
			}
		};

		$scope.onBtn2Disable = function () {
			if ($scope.btn2Disable instanceof Function) {
				return $scope.btn2Disable();
			} else {
				return true;
			}
		};

		$scope.onBtn3Disable = function () {
			if ($scope.btn3Disable instanceof Function) {
				return $scope.btn3Disable();
			} else {
				return true;
			}
		};

		CommonTool.prototype.bottomBtn = function (object) {

			$scope.safeApply(function () {

				object = object || {};

				$scope.btn1Text = object.btn1Text || '';
				$scope.btn2Text = object.btn2Text || '';
				$scope.btn3Text = object.btn3Text || '';
				$scope.btn1Disable = object.btn1Disable;
				$scope.btn2Disable = object.btn2Disable;
				$scope.btn3Disable = object.btn3Disable;
				$scope.btn1Callback = object.btn1Callback;
				$scope.btn2Callback = object.btn2Callback;
				$scope.btn3Callback = object.btn3Callback;
			});

			document.getElementById("bottomButton").style.display = "block";
		};

	}]);
}());

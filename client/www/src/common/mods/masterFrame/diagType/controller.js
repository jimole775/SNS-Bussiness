/**
 * Created by Andy on 2017/1/10.
 */
(function(){
	App.controller("diagTypeController",["$scope","$element","angularFactory",function($scope, $element, angularFactory){
		var safeApply = angularFactory.getScope ($scope).safeApply;
		var thisBox = $element;
		var thisBoxId = thisBox.attr("id");
		var win = window;
		$scope.stateText = "返回";
		$scope.diagTypeList = [
				//{
				//	"name": "简易诊断（全车检测）",
				//	"link": "empty.html"
				//},
				//{
				//	"name": "专业诊断（单模块检测）",
				//	"link": "empty.html"
				//}
		];

		win.moduleEntry.diagType = function(support){
			if(support && support != -1){
				safeApply(function(){
					$scope.diagTypeList = support;
				});
			}else{

			}
			document.getElementById("Title").innerText = global.businessInfo.carName_cn;
			bindBottomBtn();
			tool.layout(thisBoxId, 1);
		};

		function bindBottomBtn(){
			win.tool.bottomBtn({
				btn1Text: function () {
					return $scope.stateText;
				},
				btn1Callback: function () {
					moduleExit();
				}
			})
		}

		function moduleExit(){
			tool.layout(thisBoxId,0);
			win.sendDataToDev("3109FF");    //通知设备复位
			win.moduleEntry.carLogo(-1);
		}

		$scope.eventHandle = function(diagInfo){
			win.RMTClickEvent.diagTypeEventHandle(diagInfo);
		};

		win.RMTClickEvent.diagTypeEventHandle = function(diagInfo){
			global.businessInfo.diagType = diagInfo.name.match(/全车/g) ? "simp":"pro";

			//全车模块扫描    100|101
			//手动模块扫描    102
			//专家模块扫描    103
			global.businessInfo.serverType = diagInfo.name.match(/全车/g) ? "100":(diagInfo.name.match(/手动/g) ? "103" : "102");
			global.businessInfo.link = diagInfo.link;
			tool.layout(thisBoxId,0);
			win.moduleEntry.carType();
		};

	}]).config(function($provide){

	})
})();
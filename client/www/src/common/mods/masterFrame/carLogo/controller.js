/**
 * Created by Andy on 2017/1/6.
 */
(function () {
	var $ = angular.element;
	var win = window;
	win.App.controller("carLogoController", ["$scope", "$element", "$rootScope", "angularFactory", function ($scope, $element, $rootScope, angularFactory) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		$scope.carLogo = [
			//{
			//	"where": "亚洲车系",
			//	"cars": [
			//		{
			//			"cn": "OBD",
			//			"type": "obd",
			//			"pic": "obd.png",
			//			"support": [
			//				{
			//					"name": "单模块故障扫描（半自动检测功能）",
			//					"link": "empty.htm#ID=A06A&INDEX=1&PROCEDURE='OBD单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=OBD&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
			//				}
			//			]
			//		}]},
			//{
			//	"where": "欧美车系",
			//	"cars": [
			//		{
			//			"cn": "OBD",
			//			"type": "OBD",
			//			"pic": "obd.png",
			//			"support": [
			//				{
			//					"name": "单模块故障扫描（半自动检测功能）",
			//					"link": "empty.htm#ID=A06A&INDEX=1&PROCEDURE='OBD单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=OBD&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
			//				}
			//			]
			//		}
			//	]
			//}
		];
		$scope.stateText = "退出";

		var thisBox = $element;
		var thisBoxId = thisBox.attr("id");
		var analyzeUrl = window.location.href.split("#");
		if (analyzeUrl.length <= 1)location.href += "#特殊功能"; //如果获取不到项目类型,默认设置为 车辆诊断,
		global.businessInfo.procedureType = decodeURIComponent(location.href.split("#")[1]);

		win.moduleEntry.carLogo = function () {

			document.getElementById("Title").innerText = global.businessInfo.procedureType;
			bindBottomBtn();
			//tool.processBar("");

			//如果从上个路径返回,就直接显示表单!
			if (arguments.length >= 1 && arguments[0] === -1) {
				tool.layout(thisBoxId, 1);
			}
			else {
				requestData();
			}
		};

		function requestData() {
			//carLogo数据是在本地，需要过滤到当前点击的项目数据
			var curCarLogo = (function () {
				var result = null;
				win.carLogo.forEach(function (item) {
					if (item.name.indexOf(global.businessInfo.procedureType) >= 0) {
						result = item;
					}
				});
				return result;
			})();
			safeApply(function () {

				$scope.carLogo = curCarLogo.carList;


				$("#bodyInit").animate({opacity: 0}, 700, function () {
					document.getElementById("bodyInit").style.display = "none";//隐藏初始化的提示文本
				});

				tool.layout(thisBoxId, 1);//由于数据量有点大,css布局不合理,所以,拿到数据之后再格式化表格
				tool._scroll.run();//表格显示之后再添加滑动插件，这样的计算更准确
			});
		}

		function bindBottomBtn() {
			win.tool.bottomBtn({
				btn1Text: function () {
					return $scope.stateText;
				},
				btn1Callback: function () {
					quit();
				}
			})
		}

		function quit() {
			tool.layout(thisBoxId, 0);
			win.appService.sendDataToApp(3999, "", "");//直接关闭页面,退出业务
		}


		$scope.eventHandle = function (carInfo) {
			win.RMTClickEvent.carLogoEventHandle(carInfo);
		};

		win.RMTClickEvent.carLogoEventHandle = function (carInfo) {
			tool.layout(thisBoxId, 0);
			global.businessInfo.carName_cn = carInfo.cn;
			global.businessInfo.carName_en = carInfo.en;
			global.businessInfo.carType = carInfo.type;
			global.businessInfo.link = carInfo.support && carInfo.support.length ? carInfo.support[0].link : "";
			//location.href = location.href + "#" + carInfo.type + "?pic=true"; //声明选择的车型，让APP去下载相应的照片；
			location.href = location.href + "#" + carInfo.type + "_pic"; //声明选择的车型，让APP去下载相应的照片；

			//"车辆诊断", "保养灯归零,刹车片归零,节气门匹配,胎压报警灯归零", "特殊功能","模块编程", "设码配置","个性化设置
			switch (global.businessInfo.procedureType) {
				case "车辆诊断":
					win.moduleEntry.diagType(carInfo.support);
					break;
				case "防盗匹配":
					global.businessInfo.serverType = 1011;
					win.moduleEntry.keyMatch(carInfo.support);
					break;
				case "保养灯归零":
				case "刹车片归零":
				case "节气门匹配":
				case "胎压报警灯归零":
				case "特殊功能":
				case "个性化设置":
				case "模块编程":
				case "设码配置":
					global.businessInfo.serverType = 102;
					win.moduleEntry.carType();
					break;
			}
		};

	}]).config(function () {
		//设置宽度，并且让两个展示窗体左右排列，使其能左右滑动
		var factor = 1.1;
		var maxHeight = 0;
		$(".module-list-ul").each(function () {
			var children = $(this).children("li");
			var liCount = children.length;
			var lineCount = parseInt(liCount / 3) + (liCount % 3 == 0 ? 0 : 1);
			var childWidth = win.CONSTANT.WINDOW_WIDTH / 3;
			// 设置li元素的高度
			children.each(function (index, item) {
				$(item).css({
					"height": childWidth * factor,
					"width": childWidth
				});
			});
		});

	});
})();
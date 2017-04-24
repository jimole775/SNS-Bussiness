/**
 * Created by Andy on 2015/8/28.
 */
(function () {

	var win = window;
	var showView = false;

	win.App.controller ('OperateMenuCtrl', ['$scope', 'angularFactory', '$element',function ($scope, angularFactory, $element) {
		var safeApply = angularFactory.getScope ($scope).safeApply;
		var thisBox = $element;
		var thisBoxId = thisBox.attr("id");
		var gPrevFormId = null;
		$scope.hasService = false;
		$scope.hasNotSerList = false;
		/**
		 * 从设备获取支持的服务列表项，
		 * @param address 通信地址
		 * @param prevFormId 上一个表单的类型
		 */
		win.moduleEntry.operationList = function (address, prevFormId) {
			showView = true;
			gPrevFormId = prevFormId;
			tool.bottomBtn ({
				btn1Text: '',
				btn1Disable: function () { return false }
			});
			tool.loading ({pos: "body", text: "获取数据..."});
			win.devService.sendDataToDev ("310901" + address);
		};

		/**
		 * 显示服务菜单选项，入口
		 */
		win.moduleEntry.showOperationMenu = function () {
			//延时执行 解决因 键盘弹出时 直接退到 服务列表界面；导致无法居中的问题
			setTimeout (function () {
				bindBottomBtn ();
				tool.layout (thisBoxId, 1);
			}, 50);

			document.getElementById ("Title").innerText = "诊断服务列表";
		};


		//连接ECU  DEV应答：0x7109+0x01（成功）/0x11(失败)+数据表文件名称(4B)+支持的服务代号(30 B)
		win.devService.Fun710901_pro = function (varRecvData) {
			tool.loading (0);
			for (var key in YhSupportService)
				if (YhSupportService.hasOwnProperty (key)) YhSupportService[key].value = false;

			$scope.operationList.forEach (function (operation) { operation.show = false; });

			//如果在服务器的car.xml里面读取到的dbfilename的值为0或者空，就需要在 710901 里面从新读取，否则就直接使用car.xml的dbfilename
			//每次从 菜单页面 退出之后需要重新获取 表路径
			if (global.businessInfo.dbFilenamePrev == '0' || global.businessInfo.dbFilenamePrev.trim () == '') {
				var byte46 = varRecvData.substr (78, 2);
				var fileName = "", path = "";

				//46位的值为00时，只要获取path路路径给服务器就行
				if (byte46 == '00') {
					path = varRecvData.substr (6, 4 * 2);
					win.global.businessInfo.dbFilename = path;
				}

				//如果46位的值不为00，需要获取path路径和文件名给服务器
				else {
					path = varRecvData.substr (6, 4 * 2);
					fileName = tool.hex2a (varRecvData.substr (78));
					win.global.businessInfo.dbFilename = path + "/" + fileName;
				}
			}
			else {
				win.global.businessInfo.dbFilename = global.businessInfo.dbFilenamePrev
			}

			if (varRecvData.length < 14) alert ('设备指令错误');

			$scope.getServiceSupport (varRecvData);

			if ($scope.hasService)
				win.moduleEntry.showOperationMenu ();
			else
				tool.alert ('获取支持的诊断服务列表失败',
					function () {
						operationMenuQuit ();
					}
				);
		};


		//遍历数据，获取服务支持项，最后返回正则，以检测显示相应的按钮
		$scope.getServiceSupport = function (varRecvData) {
			var serviceCode = varRecvData.substr (14, 32 * 2);//支持的服务代号(32 B)
			var serviceCount = serviceCode.length / 2;//每个服务代号2位

			if (parseInt (serviceCode) === 0) $scope.hasNotSerList = true;

			var tmpCode = '';
			for (var sid = 0; sid < serviceCount; sid++) {
				tmpCode = serviceCode.substr (sid * 2, 2);

				if (tmpCode != '00') {
					$scope.hasService = true;
					tmpCode = "_0x" + ("" + tmpCode).toUpperCase ();

					//之后就可以根据YhSupportService这个MAP判断支持的服务
					if (YhSupportService[tmpCode]) {
						YhSupportService[tmpCode].value = true;
						var index = $scope.indexInOperationList[tmpCode];
						if (index >= 0) $scope.operationList[index].show = true;
					}
				}
				safeApply (function () {});
			}
		};

		win.devService.Fun710981_pro = function (varRecvData) {
			tool.alert ('尝试与车辆连接失败！<br>请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。',
				function () { operationMenuQuit (); }
			);
		};

		win.devService.Fun710902_pro = function () {
			tool.layout ("ShowOperate", 0);
			tool.loading (0);
			switch (gPrevFormId) {
				case "carType":
					win.moduleEntry.carType (-1);
					break;
				case "carSystem":
					win.moduleEntry.carSystem (-1);
					break;
				case "carConfig":
					win.devService.Fun710971 (-1);
					break;
			}
		};

		win.devService.Fun710982_pro = function () {
			tool.alert (
				"断开OBD系统失败，请直接重启设备",
				function () { win.appService.sendDataToApp (3999, "", ""); }
			)
		};

		function operationMenuQuit () {
			tool.loading ({text: "正在断开OBD系统..."});
			win.devService.sendDataToDev ("310902");    //断开OBD连接
		}

		function bindBottomBtn () {
			tool.bottomBtn ({
				btn1Text: '返回',
				btn1Callback: function () { operationMenuQuit (); }
			})
		}

		//用来记录 “功能列表” 和 所支持的“指令标记” 的键值对
		$scope.indexInOperationList = {
			_0x04: 0,               //电脑版本信息
			_0x05: 1,               //故障码-历史
			_0x06: 1,               //故障码-当前
			_0x14: 1,               //故障码-状态
			_0x07: 2,               //清除故障码
			_0x09: 3,               //动态数据流
			_0x13: 3,               //动态数据流
			_0x1C: 3,               //动态数据流
			_0x0C: 4,               //冻结帧数据
			_0x19: 5,               //氧传感器
			_0x1D: 6,               //通道数据
			_0x20: 7,               //基本调整
			_0x10: 8,               //元件测试
			_0x0F: 8,               //元件测试
			_0x16: 8,               //元件测试
			_0x29: 8,               //元件测试
			_0x2A: 8                //元件测试
		};

		win.RMTClickEvent.operationClick = function (fnName, fnParam) {
			//通道数据和基本调整点击之后 给出弹框，所以不用隐藏功能列表
			if (!fnParam) {
				tool.layout ("ShowOperate", 0);
			}
			win.moduleEntry[fnName] (fnParam);
		};

		win.moduleEntry.backToMenu = function (curTableId) {
			tool.layout (curTableId, 0);
			win.moduleEntry.showOperationMenu ();
		};

		$scope.operationList = [
			{
				text: '读取电脑版本信息',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("funReadComputerVersionInfo");
				}
			},
			{
				text: '读取故障码',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("funReadDTC");
				}
			},
			{
				text: '清除故障码',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("funClearDTC", "dontHide");
				}
			},
			//读取动态数据 --- 读取动态数据 根据索引号按块获取动态数据 读取动态数据及计算位置 任意一个支持时显示
			{
				text: '读取动态数据',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("dynamicData");
				}
			},

			//读取冻结帧数据 --- TCP获取冻结帧数据原始值 支持时显示
			{
				text: '读取冻结帧数据',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("readFreezeFrame");
				}
			},

			//氧传感器测试 --- TCP氧传感器获取测试结果 支持时显示
			{
				text: '氧传感器测试',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("oxygenSensor");
				}
			},

			//读通道数据 --- TCP大众取通道数据流读值 支持时显示
			{
				text: '读通道数据',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("showNumberInputBox", "1D");
				}
			},

			//基本调整 --- TCP大众基本调整 支持时显示
			{
				text: '基本调整',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("showNumberInputBox", "20");
				}
			},

			//元件测试
			{
				text: '元件测试',
				show: false,
				event: function () {
					win.RMTClickEvent.operationClick ("componentTest");
				}
			}
		];
	}]);

}) ();
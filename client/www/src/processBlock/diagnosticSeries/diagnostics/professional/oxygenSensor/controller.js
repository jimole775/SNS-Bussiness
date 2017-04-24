/**
 * 氧传感器测试
 * Created by mapsh on 2015/8/19.
 */
(function () {

	var win = window;
	var showView = false;
	App.controller('OxygenSensorCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
		var safeApply = angularFactory.getScope($scope).safeApply;

		$scope.title = "氧传感器测试";
		$scope.curGroupItemIndex = 0;
		$scope.curGroupItem = {};                   //当前选择的分组
		$scope.groupList = [
			{}
		];                   //分组列表
		$scope.curSupports = [];
		$scope.supportsList = [
			[]
		];                //支持项
		$scope.curSupportsIndex = 0;
		$scope.curName = '';


		$scope.oxygenSensorBtnDisable = false;

		win.moduleEntry.oxygenSensor = function () {

			document.getElementById("Title").innerText = "氧传感器数据列表";
			showView = true;
			$scope.oxygenSensorBtnDisable = false;

			bindBottomBtn();
			tool.layout("showOxygenSensorData", 1);
			if (showView)tool.loading({pos: "body", text: "获取数据..."});

			Fun310917();
		};


		//①CCDP获取氧传感器分组
		function Fun310917() {
			//tool.processBar("正在获取分组信息", true);
			win.devService.sendDataToDev("310917");
		}

		win.devService.Fun710917 = function (varRecvData) {
			var count = tool.hex2dec(varRecvData.substr(6, 4));
			if (!count) {
				tool.alert('无任何传感器组支持',
				           function () {
					           oxygenIsBtnDisable();
				           }
				);
				return;
			}
			var DataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				pids: []
			};

			for (var i = 0; i < count; i++)
				DataPack.pids[i] = varRecvData.substr(10 + i * 8, 8);

			getGroupFromServer(DataPack);

		};

		win.devService.Fun710997 = function (varRecvData) {
			tool.alert('设备数据读取失败',
			           function () {
				           oxygenIsBtnDisable();
			           }
			);
		};

		/**
		 * 获取氧传感器分组
		 * @param dataPack
		 */
		function getGroupFromServer(dataPack) {
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "EGOS_GROUP",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.EGOS_GROUP, [dataPack]),
				[getGroupFromServer, oxygenIsBtnDisable])
			);
		}

		win.serverRequestCallback.EGOS_GROUP = function (responseObject, params) {
			if (!showView)return;
			if (!responseObject.groups.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           oxygenIsBtnDisable();
				           }
				);
				return;
			}
			safeApply(function () {
				$scope.groupList = responseObject.groups;
				$scope.curGroupItem = $scope.groupList[$scope.curGroupItemIndex];
				$scope.curName = $scope.curGroupItem.name;
			});

			FunGetOxygenSensorSupport();
		};

		function FunGetOxygenSensorSupport() {
			if (showView)tool.loading({pos: "body", text: "获取数据..."});
			if (YhSupportService._0x18.value)
				win.devService.sendDataToDev("310918" + $scope.curGroupItem.pid);
			else
				FunGetOxygenSensorSupportFromServer();

		}

		function FunGetOxygenSensorSupportFromServer(varRecvData) {

			var DataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				pids: []
			};

			if (varRecvData) {
				var count = tool.hex2dec(varRecvData.substr(6, 4));
				for (var i = 0; i < count; i++) {
					DataPack.pids[i] = varRecvData.substr(10 + i * 8, 8);
				}
			}
			getSupportsFromServer(DataPack);
		}

		function getSupportsFromServer(dataPack) {
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "EGOS_SUPPORT",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.EGOS_SUPPORT, [dataPack]),
				[getSupportsFromServer, oxygenIsBtnDisable])
			);
		}

		win.serverRequestCallback.EGOS_SUPPORT = function (responseObject, params) {
			if (!showView)return;
			if (!responseObject.supportitems.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           oxygenIsBtnDisable();
				           }
				);
				return;
			}
			safeApply(function () {
				$scope.supportsList[$scope.curGroupItemIndex] = responseObject.supportitems;
				var curItems = $scope.supportsList[$scope.curGroupItemIndex];
				var i = curItems.length;
				while (i--) curItems[i].show = true;
				$scope.curSupports = curItems;
			});

			FunGetOxygenSensorOriginalData();
			tool.layoutTable();
		};


		win.devService.Fun710918 = function (varRecvData) {
			FunGetOxygenSensorSupportFromServer(varRecvData);
		};

		win.devService.Fun710998 = function (varRecvData) {
			tool.alert('设备数据读取失败',
			           function () {
				           oxygenIsBtnDisable();
			           }
			);
		};

		function FunGetOxygenSensorOriginalData() {

			//310919 + 氧传感器组pid + 数据pid
			win.devService.sendDataToDev("310919" + $scope.curGroupItem.pid + $scope.curSupports[$scope.curSupportsIndex].pid);
		}

		win.devService.Fun710919 = function (varRecvData) {

			var supportItem = $scope.curSupports[$scope.curSupportsIndex];
			supportItem.originalCurr = varRecvData.substr(10, 2);
			supportItem.originalMin = varRecvData.substr(12, 2);
			supportItem.originalMax = varRecvData.substr(14, 2);

			//循环读取氧传感器分组数据原始值
			$scope.curSupportsIndex++;

			if ($scope.curSupportsIndex < $scope.curSupports.length) {
				FunGetOxygenSensorOriginalData();
			}
			else {
				FunCalculateOxygenSensorResult();
				//重置
				$scope.curSupportsIndex = 0;
			}
		};

		win.devService.Fun710999 = function (varRecvData) {

			//循环读取氧传感器分组数据原始值
			$scope.curSupportsIndex++;
			if ($scope.curSupportsIndex < $scope.curSupports.length) {
				FunGetOxygenSensorOriginalData();
			}
			else {
				FunCalculateOxygenSensorResult();
				//重置
				$scope.curSupportsIndex = 0;
			}
		};

		function FunCalculateOxygenSensorResult() {

			var DataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				version: "2",
				pids: []
			};

			var curSupports = $scope.curSupports;

			curSupports.forEach(function (support) {

				DataPack.pids.push({
					originalCurr: support.originalCurr,
					originalMin: support.originalMin,
					originalMax: support.originalMax,
					index: support.index
				});
			});

			if (DataPack.pids.length <= 0) {
				// 如果没有原始值则不请求计算，作出相应的提示
				showN_A('无任何原始值信息');
				return;
			}
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "EGOS_RESULT",
					cartype: global.businessInfo.carType
				},
				DataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.EGOS_RESULT, [DataPack]),
				[FunCalculateOxygenSensorResult, oxygenIsBtnDisable])
			);
		}

		win.serverRequestCallback.EGOS_RESULT = function (responseObject, params) {
			if (!showView)return;

			if (!responseObject.items.length) {
				showN_A('无任何信息值');
				return;
			}

			var curSupports = $scope.curSupports;
			responseObject.items.forEach(function (item) {
				var support = _.find(curSupports, function (sup) {
					return (sup.index == item.index);
				});
				if (support) {
					support.max = item.max;
					support.min = item.min;
					support.ans = item.ans;
				}
			});

			safeApply(function () {
				$scope.oxygenSensorBtnDisable = true;
			});
			tool.loading(0);
		};

		function oxygenIsBtnDisable() {
			return safeApply(function () {$scope.oxygenSensorBtnDisable = true});
		}

		$scope.createDropDownList = function () {
			win.RMTClickEvent.createOxygenDropDownList();
		};

		win.RMTClickEvent.createOxygenDropDownList = function () {
			tool.dropDownList({
				dataList: $scope.groupList,
				showProp: "name",
				btnCallback: oxygenChangeGroupItem
			})
		};

		function oxygenChangeGroupItem(item, index) {
			var index_int = parseFloat(index);
			var itemName = item.name;

			if ($scope.curGroupItemIndex == index_int) return;

			safeApply(function () {
				$scope.curName = itemName;
				$scope.oxygenSensorBtnDisable = false;
				tool.layoutTable();
			});

			$scope.curGroupItem = $scope.groupList[index_int];
			$scope.curGroupItemIndex = index_int;
			$scope.curSupports = $scope.supportsList[$scope.curGroupItemIndex] || [];
			$scope.curSupports.length = 0;
			$scope.curSupportsIndex = 0;

			FunGetOxygenSensorSupport();
		}

		function bindBottomBtn() {
			tool.bottomBtn({
				btn1Text: '返回',
				btn1Disable: function () { return $scope.oxygenSensorBtnDisable; },
				btn1Callback: function () { OxygenSensorBack(); }
			})
		}


		function OxygenSensorBack() {
			tool.loading(0);
			safeApply(function () { reset(); });
			tool.layout("showOxygenSensorData", 0);
			win.moduleEntry.showOperationMenu();
		}

		function reset() {
			$scope.curGroupItem = {};
			if ($scope.groupList)$scope.groupList.length = 0;
			if ($scope.supportsList)$scope.supportsList.length = 0;
			if ($scope.curSupports)$scope.curSupports.length = 0;
			$scope.curSupportsIndex = 0;
			showView = false;
		}

		/**
		 * 信息值为空是替换字串为  “N/A”
		 */
		function showN_A(meg) {
			var curData = $scope.curSupports;
			curData.forEach(function () { curData.ans = 'N/A'; });
			safeApply(function () { $scope.oxygenSensorBtnDisable = true; });
			tool.loading(0);
		}
	}]);
})();
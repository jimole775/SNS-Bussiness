/**
 * Created by Andy on 2016/11/3.
 */
(function () {
	//当前模块是否在显示
	var win = window;
	var showView = false;
	App.controller('carSystemCtrl', ['$scope', 'angularFactory', '$element', function ($scope, angularFactory, $element) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		var thisBox = $element;
		var thisBoxId = thisBox.attr("id");
		var gPrevFormId = null;
		$scope.pagesOptionChosenRecord = [];
		$scope.curPageData = [];
		$scope.systemItemNodeaddress = '';
		$scope.hasNextLevelPage = true;

		//入口
		win.moduleEntry.carSystem = function (address, prevFormId) {

			showView = true;
			document.getElementById("Title").innerText = "系统列表";
			$scope.hasNextLevelPage = true;
			bindBottomBtn();
			tool.layout(thisBoxId, 1);
			gPrevFormId = prevFormId;
			//从服务列表那里返回
			if (address === -1) {

				$scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);

				safeApply(function () {
					//重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
					setTimeout(function () {tool.layoutTable();}, 45);
				});
			}
			//从车型菜单那里来
			else {
				reset();
				tool.loading({text: "正在获取系统列表信息..."});
				win.sendDataToDev("310970" + address);
			}
		};


		/**
		 * 下拉列表的回调函数,用于承接远程函数
		 * @item   回调参数；
		 * */
		$scope.handleSelect = function (item) {
			win.RMTClickEvent.systemItemSelect(item);
		};

		win.RMTClickEvent.systemItemSelect = function (item) {
			var RecordLen = $scope.pagesOptionChosenRecord.length;
			win.global.DTCLog.systemName = global.rootCache.carSystem[RecordLen] = item.name;

			safeApply(function () {
				$scope.systemItemNodeaddress = item.nodeaddress;
				$scope.pagesOptionChosenRecord[RecordLen] = item.name;
				$scope.hasNextLevelPage = false;
			});

			outputConfirm();
		};


		/**
		 * 从服务器获取系统信息
		 * @param dataPack
		 */
		function requestData(dataPack) {
			if (showView)win.tool.loading({pos: 'body', text: '获取数据...'});
			//tool.processBar('正在解析系统列表信息', true);
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "SYS",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback.SYS, [dataPack]),
				function (params) {
					safeApply(function () {
						$scope.curPageIndex = 0;
						$scope.pagesOptionChosenRecord.length = 0;
						$scope.curPageData.length = 0;
					});

					tool.alert(['服务器请求超时，请点击重试', '重试', '取消'],
						function () {
							requestData(params);
						},
						function () {
							moduleExit();
						}
					);
				}
			);
		}


		win.serverRequestCallback.SYS = function (responseObject, params) {
			if (!showView)return;
			//if (!status.ok) {
			//	safeApply(function () {
			//		$scope.curPageIndex = 0;
			//		$scope.pagesOptionChosenRecord.length = 0;
			//		$scope.curPageData.length = 0;
			//	});
			//
			//	tool.alert(['服务器请求超时，请点击重试', '重试', '取消'],
			//		function () {
			//			requestData(params);
			//		},
			//		function () {
			//			moduleExit();
			//			//tool.processBar("");
			//		}
			//	);
			//
			//}
			//else if (!responseObject || !responseObject.items) {
			//	tool.alert('无任何车辆系统信息',
			//	           function () {
			//		           moduleExit();
			//		           //tool.processBar("");
			//	           }
			//	);
			//}
			//else {
			//tool.processBar('解析系统列表信息成功');

			if(!responseObject.items.length){
				tool.alert('服务器无任何数据',
				           function () {
					           //tool.processBar("");
					           moduleExit();
				           }
				);
				return;
			}

			safeApply(function () {
				$scope.curPageData = responseObject.items || [];
			});
			tool.loading(0);
			//}
		};

		win.devInterActive.Fun710970 = function (varRecvData) {

			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2));

			var DataPack = {
				parents: [],    //服务器解析名为 parents；
				systemid: []
			};

			for (var i = 0; i < count; i++) {
				DataPack.systemid[i] = varRecvData.substr(win.getIndexByDevIndex(11) + 8 * i, 8);
			}

			requestData(DataPack);
		};

		win.devInterActive.Fun7109F0 = function (varRecvData) {
			tool.loading(0);

			//tool.processBar('车辆连接失败！');
			tool.alert('尝试与车辆连接失败！<br>请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。',
			           function () { moduleExit(); }
			);
		};

		function bindBottomBtn() {
			tool.bottomBtn({
					btn1Text: '返回',
					btn1Callback: function () {
						moduleExit();
					}
				}
			);
		}

		function outputConfirm() {
			//tool.processBar("");
			win.global.businessInfo.operationMenuCache = [$scope.systemItemNodeaddress.replace(/\./g, ""), "carSystem"];
			blockDelegate();
		}

		function blockDelegate() {
			var diagType = global.businessInfo.diagType;  //获取诊断类型;
			var procedureType = global.businessInfo.procedureType;    //获取项目类型
			var operationMenuCache = global.businessInfo.operationMenuCache;    //界面跳转信息

			if (diagType === "simp") {
				win.moduleEntry.searchDTC.apply(null, operationMenuCache);
			}
			else {
				win.moduleEntry.operationList.apply(null, operationMenuCache);
			}

			tool.layout(thisBoxId,0);
		}

		function reset() {
			safeApply(function () {
				$scope.curPageData.length = 0;
				$scope.curPageIndex = 0;
				$scope.pagesOptionChosenRecord.length = 0;
				$scope.systemItemNodeaddress = "";
			});
		}

		function moduleExit() {
			tool.layout(thisBoxId, 0);
			showView = false;
			reset();

			//如果车型支持 '模式三' ,就跳到 '模式三' 界面,
			//只有在 '模式三' 界面退出时,才真正退到 车型选择界面
			if (win.global.businessInfo.connectMode == 3) {
				win.devInterActive.Fun710971();
			}
			else {
				win.moduleEntry.carType(-1);
			}
		}
	}]);

})();
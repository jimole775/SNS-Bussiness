/**
 * Created by Administrator on 2015/8/21.
 */
(function () {

	var win = window;
	var showView = false;
	App.controller('TcpChannelDataCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
		var safeApply = angularFactory.getScope($scope).safeApply;

		$scope.channelDataList = [];
		$scope.stateText = '开始';

		//缓存通道值；
		var cacheChannel = 0;
		//点击开始才去获取原始值，否则获取支持项
		var getOrignal = false;
		var gPidLen = 0;
		/**
		 * 通道数据入口
		 * @param value 通道号
		 */
		win.moduleEntry.channelData = function (value) {
			showView = true;
			getOrignal = false;
			cacheChannel = tool.toHex(value, 8);
			//tool.processBar('正在初始化数据', true);

			win.devService.sendDataToDev('31091D' + cacheChannel);
			document.getElementById("Title").innerText = "TCP大众通道数据读值";
			bindBottomBtn();
			tool.layout("channeldata", 1);
			safeApply(function () {
				$scope.isBtnBackEnable = false;
				$scope.isBtnOkEnable = false;
			});
		};

		win.devService.Fun71099D = function () {
			var i = $scope.channelDataList.length;
			if (i) {

				//如果响应失败，就全部值更新为N/A
				safeApply(function () {
					while (i--) $scope.channelDataList[i].ans = 'N/A';
				});

				//关联“开始”，按钮，如果文本显示为暂停，就继续循环发送；
				if ($scope.stateText === "暂停")
					setTimeout(function () {
						win.devService.sendDataToDev('31091D' + cacheChannel);
					}, 105);

			}
			else {
				//tool.processBar('设备数据读取失败');
				tool.alert(
					"设备数据读取失败",
					function () {
						tcpChannelDataBack();
					}
				)
			}
		};

		win.devService.Fun71091D = function (varRecvData) {
			var count = tool.hex2dec(varRecvData.substr(6, 2));
			var DataPack =
			{
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				version: "2",
				pids: []
			};

			if (getOrignal) {
				for (var i = 0; i < gPidLen; i++)
					DataPack.pids[i] =
					{
						originalX: varRecvData.substr(8 + count * 8 + i * 2, 2),
						originalY: varRecvData.substr(8 + count * 8 + i * 2 + count * 2, 2),
						pid: varRecvData.substr(8 + i * 8, 8)
					};

				DataPack.pids.unDuplicate("pid");
				getValue(angularFactory.replacePidToIndex(DataPack, $scope.channelDataList));

				//通知服务器之后马上请求下一条设备数据，如果等回调回来的时候再请求，会导致连续2次请求设备数据，设备反应不过来，会返回失败指令
				setTimeout(function () {
					if ($scope.stateText == "暂停")win.devService.sendDataToDev('31091D' + cacheChannel);
				}, 105);
			}
			else {
				for (var j = 0; j < count; j++)
					DataPack.pids[j] = varRecvData.substr(8 + j * 8, 8);

				gPidLen = DataPack.pids.length;
				DataPack.pids.unDuplicate();
				getChannelSupport(DataPack);
			}
		};


		function getChannelSupport(dataPack) {
			if (!showView) {
				$scope.isBtnBackEnable = true;
				return;
			}

			//tool.processBar('正在获取支持项', true);
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "CHANNEL_SUPPORT",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.CHANNEL_SUPPORT, [dataPack]),
				[getChannelSupport, tcpChannelDataBack])
			);

		}

		win.serverRequestCallback.CHANNEL_SUPPORT = function (responseObject, params) {

			if (!showView)return;
			if (!responseObject.supportitems.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           tcpChannelDataBack();
					           //tool.processBar("");
				           }
				);
				return;
			}
			var supItems = responseObject.supportitems;
			var i = supItems.length;
			while (i--) supItems[i].show = true;

			$scope.channelDataList = supItems;
			$scope.isBtnOkEnable = true;
			$scope.isBtnBackEnable = true;
			releaseButtonEvent_tcpChannel();
			//tool.processBar('支持项获取成功');
			safeApply(function () {});
			tool.layoutTable();
		};


		function getValue(dataPack) {
			if (!showView) {
				$scope.isBtnBackEnable = true;
				return;
			}

			//tool.processBar('正在读取信息值', true);

			win.server.request(
				global.businessInfo.serverType,
				{
					key: "CHANNEL_DATA",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.CHANNEL_DATA, [dataPack]),
				handleBadRequest)
			);

		}

		function handleBadRequest() {
			var i = $scope.channelDataList.length;
			while (i--) {
				$scope.channelDataList[i].ans = 'N/A';
			}
			safeApply(function () {});
		}

		win.serverRequestCallback.CHANNEL_DATA = function (responseObject, params) {

			if (!showView)return;
			tool.loading(0);
			if (!responseObject.items.length) {
				//如果响应失败，就全部值更新为N/A
				var i = $scope.channelDataList.length;
				while (i--) {
					$scope.channelDataList[i].ans = 'N/A';
				}
			}
			else {

				var data = $scope.channelDataList || [];
				var items = responseObject.items;
				var j = data.length;

				while (j--) {
					var k = items.length;
					while (k--) {
						if (data[j].pid === items[k].pid) {
							//data[j].ans = items[k].ans + Math.floor(Math.random() * 100);
							data[j].ans = items[k].ans;
							break;
						}
					}
				}
			}

			safeApply(function () {});
		};

		function releaseButtonEvent_tcpChannel() {
			safeApply(function () {
				$scope.stateText = "开始";
				$scope.isBtnBackEnable = true;
			})
		}

		function bindBottomBtn() {
			win.tool.bottomBtn({
				btn1Text: function () {
					return $scope.stateText;
				},
				btn2Text: '返回',
				btn1Disable: function () {
					return $scope.isBtnOkEnable;
				},
				btn2Disable: function () {
					return $scope.isBtnBackEnable;
				},
				btn1Callback: function () {
					channelDataConfirm();
				},
				btn2Callback: function () {
					tcpChannelDataBack();
				}

			})

		}


		function tcpChannelDataBack() {
			//tool.processBar("");
			showView = false;
			getOrignal = false;
			$scope.stateText = '开始';
			$scope.channelDataList.length = 0;
			safeApply(function () {});
			win.global.RMTID.dataStream = false;
			win.global.DataStream_CurPageLinesCount = 7;     //动态数据默认每一页数据量为7；
			tool.layout("channeldata", 0);
			win.moduleEntry.showOperationMenu();
		}


		function channelDataConfirm() {
			if ($scope.stateText == '暂停') {
				//tool.processBar("暂停");
				showView = false;
				$scope.stateText = '继续';
				$scope.isBtnBackEnable = true;
				safeApply(function () {});
				return;
			}

			if (global.RMTID.role != 0) {
				win.global.RMTID.dataStream = true;
				win.global.DataStream_CurPageLinesCount = $scope.channelDataList.length;
				if (global.RMTID.role == 2)win.tool.loading({text: "等待远程端数据同步..."});
			}

			safeApply(function () {
				//tool.processBar("正在读取信息值", true);
				getOrignal = true;
				showView = true;
				$scope.stateText = '暂停';
				$scope.isBtnBackEnable = false;
				win.devService.sendDataToDev('31091D' + cacheChannel);
			});
		}

		win.RMTClickEvent.showAllData = function () {
			if ($scope.channelDataList && $scope.channelDataList.length > 0) {
				var i = $scope.channelDataList.length;
				while (i--) $scope.channelDataList[i].show = true;
			}
			$scope.isBtnBackEnable = true;
		};

	}]);

})();
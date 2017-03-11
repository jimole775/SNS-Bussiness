/**
 * Created by mapsh on 2015/8/21.
 */
(function () {

	var win = window;
	var showView = false;

	App.controller('ReadFreezeFrameCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		//选择索引
		$scope.selectedIndex = 0;

		$scope.curDtc = {};
		//故障码列表
		$scope.dtcList = [];

		$scope.curDanwei = '';

		$scope.curName = '';

		$scope.curSupports = [];

		$scope.supportsList = [
			[]
		];

		$scope.pakids = [];

		var pidsCount = 0;

		win.moduleEntry.readFreezeFrame = function () {
			showView = true;
			$scope.freezeBtnDisable = false;
			document.getElementById("Title").innerText = "冻结帧数据列表";
			tool.layout("showFreezeFrameData", 1);
			bindBottomBtn();
			tool.loading({pos: 'body', text: "获取数据..."});
			Fun31090A();
		};


		//①TCP获取车辆导致冻结帧的故障码索引
		function Fun31090A() {
			//tool.processBar('正在获取故障码索引', true);
			win.sendDataToDev("31090A");
		}


		win.devInterActive.Fun71090A = function (varRecvData) {
			var codeCount = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2));

			if (codeCount <= 0) {

				tool.alert('无任何故障码索引信息',
				           function () {
					           releaseButtonEvent();
					           //tool.processBar("");
				           }
				);


			}
			else {
				//②在数据表中查询故障码并显示
				var dataPack = {
					dbfilename: global.businessInfo.dbFilename,
					pub: global.businessInfo.pubFilename,
					type: 1,
					pids: []
				};
				for (var i = 0; i < codeCount; i++)
					dataPack.pids[i] = varRecvData.substr(win.getIndexByDevIndex(11) + 8 * i, 8);

				//tool.processBar('正在获取故障码信息', true);
				getFreezeFrameDtc(dataPack);
			}

		};

		function getFreezeFrameDtc(dataPack) {
			//请求服务器获取故障码描述

			win.server.request(
				global.businessInfo.serverType,
				{
					key: "FREEZE_DTC",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback.FREEZE_DTC, [dataPack]),
				[getFreezeFrameDtc, freezeFrameIsBtnDisable]
			);

		}

		win.serverRequestCallback.FREEZE_DTC = function (responseObject, params) {
			if (!showView)return;
			if(!responseObject.items.length){
				tool.alert('服务器无任何数据',
				           function () {
					           //tool.processBar("");
					           releaseButtonEvent();
				           }
				);
				return;
			}
			responseObject.items.forEach(function (item) {
				if (item.data && item.data.length == 1) $scope.dtcList.push(item.data[0]);
			});

			$scope.curDtc = $scope.dtcList[$scope.selectedIndex];
			$scope.curDanwei = $scope.curDtc.danwei;
			$scope.curName = $scope.curDtc.name;

			safeApply(function () {});

			FunFreezeFrameGetDynamicData();
		};


		win.devInterActive.Fun71098A = function (varRecvData) {
			tool.alert('设备数据读取失败',
			           function () {
				           releaseButtonEvent();
				           //tool.processBar("");
			           }
			);
		};


		//③获取与本条冻结帧相关的动态数据并显示
		function FunFreezeFrameGetDynamicData() {
			if (showView)tool.loading({pos: 'body', text: "获取数据..."});
			//tool.processBar('正在获取相关动态数据', true);

			var curDtc = $scope.curDtc || {};
			var dataPack = {};
			//TCP由库ID取冻结帧支持项 被支持时
			if (YhSupportService._0x1A.value) {
				dataPack = {
					dbfilename: global.businessInfo.dbFilename
				};

				if ($scope.pakids.length > 0)
					Fun31091A();
				else
					getFreezeFramePakid(dataPack);

			}
			//TCP获取车辆冻结帧数据支持项 被支持时
			else if (YhSupportService._0x0B.value) {

				win.sendDataToDev("31090B" + curDtc.pid);
			}
			else {
				//当 以上二条指令都 不被支持时 列出 系统ECU表 内的所有 动态数据记录的 NAME 描述在界面 信息描述 上， DW 描述在界面 单位 上

				dataPack = {
					dbfilename: global.businessInfo.dbFilename,
					pub: global.businessInfo.pubFilename,
					pakids: []
				};
				getFreezeFrameSupport(dataPack);
			}
		}

		function getFreezeFramePakid(dataPack) {
			//请求服务器 获取数据表内所有 TYPE 字段为 4 的记录 PID
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "FREEZE_PAKID",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback.FREEZE_PAKID, [dataPack]),
				[getFreezeFramePakid, freezeFrameIsBtnDisable]
			);
		}

		win.serverRequestCallback.FREEZE_PAKID = function (responseObject, params) {
			if (!showView) return;
			if (!responseObject.pakids.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           releaseButtonEvent();
					           //tool.processBar("");
				           }
				);
				return;
			}
			$scope.pakids = responseObject.pakids;
			Fun31091A();

		};

		function Fun31091A() {

			var sendData = "31091A";
			sendData += tool.toHex($scope.pakids.length, 4);
			for (var i in $scope.pakids)
				if ($scope.pakids.hasOwnProperty(i)) sendData += $scope.pakids[i].pakid;

			win.sendDataToDev(sendData);
		}

		win.devInterActive.Fun71091A = function (varRecvData) {
			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 4));

			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				pakids: []
			};

			for (var i = 0; i < count; i++)
				dataPack.pakids[i] = varRecvData.substr(win.getIndexByDevIndex(12) + i * 8, 8);


			getFreezeFrameSupport(dataPack);
		};

		function getFreezeFrameSupport(dataPack) {
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "FREEZE_SUPPORT",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback.FREEZE_SUPPORT, [dataPack]),
				[getFreezeFrameSupport, freezeFrameIsBtnDisable]
			);
		}

		win.serverRequestCallback.FREEZE_SUPPORT = function (responseObject, params) {
			if (!showView)return;
			if (!responseObject.supportitems.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           releaseButtonEvent();
					           //tool.processBar("");
				           }
				);
				return;
			}

			FunFreezeFrameSupportProcess(responseObject);
			tool.layoutTable();
		};

		win.devInterActive.Fun71099A = function (varRecvData) {
			tool.alert('设备数据读取失败',
			           function () {
				           releaseButtonEvent();
				           //tool.processBar("");
			           }
			);
		};


		win.devInterActive.Fun71090B = function (varRecvData) {

			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 4));

			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				pids: []
			};

			for (var i = 0; i < count; i++)
				dataPack.pids[i] = varRecvData.substr(win.getIndexByDevIndex(12) + i * 8, 8);

			getFreezeFrameSupport(dataPack);
		};

		win.devInterActive.Fun71098B = function (varRecvData) {

			tool.alert('设备数据读取失败',
			           function () {
				           releaseButtonEvent();
				           //tool.processBar("");
			           }
			);
		};

		function FunFreezeFrameSupportProcess(responseObject) {
			safeApply(function () {
				$scope.supportsList[$scope.selectedIndex] = responseObject.supportitems;

				var curItems = $scope.supportsList[$scope.selectedIndex];

				//添加隐藏属性
				var i = curItems.length;
				while (i--) curItems[i].show = true;

				$scope.curSupports = curItems;
			});

			FunFreezeFrameGetOriginalData();
		}

		//④由CCDP获取冻结帧数据原始值
		function FunFreezeFrameGetOriginalData() {
			if (showView)tool.loading({pos: 'body', text: "获取数据..."});
			//tool.processBar('正在获取原始值', true);

			//TCP取一块取冻结帧数据流 被支持时
			if (YhSupportService._0x1B.value) {
				Fun31091B();
			}
			//TCP获取车辆冻结帧数据原始值 被支持时
			else if (YhSupportService._0x0C.value) {

				var curDtc = $scope.curDtc || {};
				var curSupports = $scope.curSupports || [];

				var sendData = "31090C";

				sendData += curDtc.pid;//故障码索引号
				sendData += tool.toHex(curSupports.length, 2);//代表要读取的信息个数

				curSupports.forEach(function (supportItem) {
					sendData += supportItem.pid;//4个字节代表一个信息PID
				});

				win.sendDataToDev(sendData);

			}
			else {

				tool.alert('当前车型不支持原始值读取',
				           function () {
					           releaseButtonEvent();
					           //tool.processBar("");
				           }
				);
			}

		}

		function Fun31091B() {
			var sendData = "31091B";
			var curDtc = $scope.curDtc || {};
			var curSupports = $scope.curSupports || [];
			sendData += curDtc.pid;//故障码索引号
			sendData += tool.toHex(curSupports.length, 4);//动态数据索引个数
			for (var i  in curSupports) {
				if (curSupports.hasOwnProperty(i)) {
					var dataTemp = curSupports[i];
					//每4字节代表一个动态数据索引号，这些索引号对应库记录的 PAKID 字段。
					//每2字节代表一个动态数据计算偏移，这些计算偏移对应库记录的 PAKPOS 字段。
					sendData += tool.toHex(dataTemp.pakid, 8) + tool.toHex(dataTemp.pakpos, 4);
				}
			}

			win.sendDataToDev(sendData);
		}


		win.devInterActive.Fun71091B = function (varRecvData) {

			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				version: "2",
				pids: []
			};

			//所有原始值总长度
			var totalOriginalDataLen =
				tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 4));

			var totalOriginalData =
				varRecvData.substr(win.getIndexByDevIndex(12), totalOriginalDataLen * 2);

			//计算位置个数
			var posDataCount =
				parseInt(varRecvData.substr(win.getIndexByDevIndex(12) + totalOriginalDataLen * 2).length / 4);

			var totalPosData =
				varRecvData.substr(win.getIndexByDevIndex(12) + totalOriginalDataLen * 2, posDataCount * 4);

			var currentSupports = $scope.curSupports || [];

			for (var i = 0; i < posDataCount; i++) {
				var currentPos = tool.hex2dec(totalPosData.substr(i * 4, 4));
				var nextPos = 0;

				if ((i + 1) * 4 + 4 > totalPosData.length)
					nextPos = totalPosData.length / 4;
				else
					nextPos = tool.hex2dec(totalPosData.substr((i + 1) * 4, 4));

				var currentOriginal = '';
				if (nextPos <= 0)
					currentOriginal = totalOriginalData.substr((currentPos - 1) * 2, (totalOriginalDataLen - currentPos) * 2);
				//这里currentPos-1，是因为他们以1开始计数，而我们需要以0开始计数
				else
					currentOriginal = totalOriginalData.substr((currentPos - 1) * 2, (nextPos - currentPos) * 2);


				dataPack.pids.push({
					index: currentSupports[i].index,
					original: currentOriginal
				});

			}

			if (dataPack.pids.length <= 0) {
				tool.alert('无任何故障码索引信息',
				           function () {
					           releaseButtonEvent();
					           //tool.processBar("");
				           }
				);
				return;
			}

			pidsCount = 1;                                  //71091B时只请求一次，所以数据回调也只调一次；

			getFreezeFrameValue(dataPack);
		};

		function getFreezeFrameValue(dataPack) {
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "FREEZE_RESULT",
					cartype: global.businessInfo.carType
				},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback.FREEZE_RESULT, [dataPack]),
				[getFreezeFrameValue, function () {}]
			);
		}

		var pidsCallback = 0;
		win.serverRequestCallback.FREEZE_RESULT = function (responseObject, params) {
			if (!showView)return;

			pidsCallback += responseObject.items.length ? responseObject.items.length : 3;
			if (!responseObject.items.length) {
				//当数据全部刷新完成再去掉限制
				if (pidsCallback >= pidsCount) {
					tool.loading(0);
					//处理一下如果只有一批数据的情况,Fun71091B类型
					//if (pidsCount == 1) {
					//	if (responseObject && responseObject.items && responseObject.items.length <= 0)
					//		tool.alert("无冻结帧数据", function () {});
					//	else
					//		tool.alert(
					//			["服务器响请求超时", "重试", "取消"],
					//			function () { getFreezeFrameValue(params); },
					//			function () { }
					//		);
					//}
					tool.alert("无冻结帧数据", function () {
						$scope.freezeBtnDisable = true;
						pidsCallback = 0;
						safeApply(function () {});
					});
				}
				return;
			}

			var curSupports = $scope.curSupports || [];
			var findSupport;
			curSupports.forEach(function (item) {
				var single = item;
				return (function () {
					findSupport = _.find(responseObject.items, function (support) {
						return (support.index == single.index) && (support.pid == single.pid);
					});
					if (findSupport) single.ans = findSupport.ans;
				})();
			});

			//pidsCallback += responseObject.items.length;     //根据请求时的条数，算出结束时间,如果没有，默认为3

			if (pidsCallback >= pidsCount) {                 //当数据全部刷新完成再去掉限制
				$scope.freezeBtnDisable = true;
				pidsCallback = 0;
				tool.loading(0);
			}
			safeApply(function () { });

		};

		win.devInterActive.Fun71099B = function (varRecvData) {
			//一次性获取所有用户选定的块数据原始值和计算位置
			tool.alert('设备数据读取失败',
			           function () {
				           releaseButtonEvent();
				           //tool.processBar("");
			           }
			);
		};

		win.devInterActive.Fun71090C = function (varRecvData) {

			//计算PID长度;
			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2));
			pidsCount = count;
			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				version: "2",
				pids: []
			};

			var j = 11;
			var valueLen = 0;
			var curSupports = $scope.curSupports || [];

			for (var i = 0; i < count; i++) {

				valueLen = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(j), 2));
				j = j + 1;
				dataPack.pids.push({
					original: varRecvData.substr(win.getIndexByDevIndex(j), valueLen * 2),
					index: curSupports[i].index
				});
				j = j + valueLen;

				//攒够3条再请求服务器，请求完毕之后重置；最后不够3条时，根据count - i 剩余的PID数量而决定。
				if (dataPack.pids.length === 3) {
					getFreezeFrameValue(dataPack);
					dataPack.pids.length = 0;
				}
				else if (3 > count - i && dataPack.pids.length >= 1) {
					getFreezeFrameValue(dataPack);
					dataPack.pids.length = 0;
				}
			}
		};

		win.devInterActive.Fun71098C = function (varRecvData) {
			//依次获取每条动态数据流的原始值。
			tool.alert('设备数据读取失败',
			           function () {
				           releaseButtonEvent();
				           //tool.processBar("");
			           }
			);
		};


		/**
		 * 信息值为空是替换字串为  “N/A”
		 */
		function showN_A(meg) {
			safeApply(function () {
				var curData = $scope.curSupports || [];
				curData.forEach(function () { curData.ans = 'N/A'; });
				tool.loading(0);
				$scope.freezeBtnDisable = true;
				//tool.processBar(meg);
			});
		}


		$scope.createDropDownList = function () {
			RMTClickEvent.CreateFreezeFrameDropDownList();
		};


		win.RMTClickEvent.CreateFreezeFrameDropDownList = function () {
			tool.dropDownList({
				dataList: $scope.dtcList,
				showProp: "danwei",
				btnCallback: FreezeFrameGroupItem
			})
		};

		function FreezeFrameGroupItem(item, index) {
			var itemName = item.name;
			var itemDanwei = item.danwei;
			var index_int = parseFloat(index);
			if ($scope.selectedIndex == index_int) return;

			$scope.selectedIndex = index_int || 0;
			$scope.curDtc = $scope.dtcList[index_int];
			$scope.curSupports = $scope.supportsList[index_int] || [];

			if (showView)tool.loading({pos: 'body', text: "获取数据..."});

			FunFreezeFrameGetDynamicData();

			safeApply(function () {
				$scope.curName = itemName;
				$scope.curDanwei = itemDanwei;
				$scope.freezeBtnDisable = false;
				tool.layoutTable();
			});

		}

		function releaseButtonEvent() {
			safeApply(function () { $scope.freezeBtnDisable = true; });
		}

		/**
		 * 绑定按钮事件
		 */
		function bindBottomBtn() {

			tool.bottomBtn({
				btn1Text: '返回',
				btn1Disable: function () { return $scope.freezeBtnDisable; },
				btn1Callback: function () { freezeFrameBack(); }
			})

		}

		function freezeFrameBack() {
			tool.loading(0);
			safeApply(function () {
				showView = false;
				reset();
			});
			tool.layout('showFreezeFrameData', 0);
			win.moduleEntry.showOperationMenu();
		}

		/**
		 * 退出前重置工作
		 */
		function reset() {
			$scope.selectedIndex = 0;
			$scope.curDtc = {};                     //当前故障码列表
			if ($scope.dtcList)$scope.dtcList.length = 0;              //所有故障码列表
			if ($scope.curSupports)$scope.curSupports.length = 0;          //当前支持项
			if ($scope.supportsList)$scope.supportsList.length = 0;         //所有支持项
		}

		function freezeFrameIsBtnDisable() {
			return $scope.freezeBtnDisable = true;
		}

	}]);

})();
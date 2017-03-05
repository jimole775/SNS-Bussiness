/**
 * Created by mapsh on 2015/8/24.18:00
 *
 */
(function () {

	var win = window;
	var dtcHistory = "history";      //历史故障码
	var dtcCurrent = "current";      //当前故障码
	var dtcWithState = "status";     //带状态故障码
	var cachebadRequestParamArr = [];   //缓存数据请求失败时，重新请求服务器需要的参数
	var showView = false;
	var webViewListIndex = 0;               //用于界面显示的系统的下标；
	App.controller('systemCtrl', ['$scope', 'SystemManager', '$element', 'angularFactory', function ($scope, SystemManager, $element, angularFactory) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		var thisBox = $element;
		var thisBoxId = thisBox.attr("id");
		document.getElementById("Title").innerHTML = "自动诊断";
		$scope.DTCTotal = [];
		$scope.bDoClear = false;                //清除故障码标记
		$scope.scanState = SystemScanState['scanning'];
		//$scope.ContactSystemTotal = "N/A";
		$scope.scanProcess = "初始化扫描进程";
		$scope.clickItemIndex = 0;

		$scope.originalSystemListIndex = SystemManager.index;
		$scope.webViewSystemList_arr = [];                              //*****关键数据，用于webView模板绑定*****
		$scope.originalSystemList_arr = SystemManager.systemList;       //*****关键数据，用于同服务器交互*****

		////车型信息入口
		//$scope.descRecordEntry = function () {
		//	win.sendRMTEventToApp ("moduleEntry.carDescRecordEnter", []);
		//	win.moduleEntry.carDescRecordEnter ();
		//};
		//
		////流程记录入口
		//$scope.devMessagesEnter = function () {
		//	win.sendRMTEventToApp ("moduleEntry.devMessagesEnter", []);
		//	win.moduleEntry.devMessagesEnter ();
		//};

		win.moduleEntry.searchDTC = function (systemList, prevFormId) {
			showView = true;
			//tool.processBar("");
			tool.layout(prevFormId, 0);
			systemBindBottomBtn();
			tool.layout(thisBoxId, 1);
			$scope.originalSystemList_arr.length = 0;
			$scope.webViewSystemList_arr.length = 0;
			systemList.forEach(function (item, index) {
				$scope.originalSystemList_arr.push(new System(item, index));
			});
			modifyScanStateAndConnectNextSys();
		};


		function systemBindBottomBtn() {
			tool.bottomBtn({
				btn1Text: function () {
					return $scope.btnScanText;
				},
				btn2Text: '清除故障',
				btn3Text: '退出',
				btn1Disable: function () {
					return !$scope.isScanBtnDisable();
				},
				btn2Disable: function () {
					return $scope.isClearBtnDisable();
				},
				btn3Disable: function () {
					return $scope.isQuitBtnDisable();
				},
				btn1Callback: function () {
					onClickPauseOrContinue.apply(null, arguments);
				},
				btn2Callback: function () {
					onClickClearErrorCode();
				},
				btn3Callback: function () {
					systemQuitConfirm();
				}
			})
		}

		function systemQuitConfirm() {
			$scope.scanState = SystemScanState.pausing;

			var len = $scope.webViewSystemList_arr.length;
			while (len--) {

				var name = $scope.webViewSystemList_arr[len].name;
				var DTC = $scope.webViewSystemList_arr[len].dtcList;

				win.global.DTCLog.detail.push({
					systemName: name,
					DTC: DTC
				});
			}

			//win.appService.sendDataToApp (1020, JSON.stringify (win.global.DTCLog.detail), "");   //退出之前，把故障信息上传给APP；
			tool.layout(thisBoxId, 0);
			win.moduleEntry.carType(-1);
			reset();

		}

		function reset() {
			$scope.originalSystemListIndex = 0;

			$scope.DTCTotal.length = 0;
			$scope.bDoClear = false;                //清除故障码标记
			$scope.scanState = SystemScanState['scanning'];
			//$scope.ContactSystemTotal = "N/A";
			$scope.scanProcess = "初始化扫描进程";
			$scope.clickItemIndex = 0;

			cachebadRequestParamArr.length = 0;   //缓存数据请求失败时，重新请求服务器需要的参数
			showView = false;
			webViewListIndex = 0;               //用于界面显示的系统的下标；

		}

		//监听扫描状态，以此更新 底部按钮文本
		var scanStateWtach = $scope.$watch('scanState', function () {
			$scope.btnScanText = OperationText[$scope.scanState];

			//#hack for 远程简易诊断 按钮文本无法同步的问题
			win.global.RMTInfo.systemScanState = $scope.scanState;
		});

		$scope.selectedSystemIndex = function () {

			if ($scope.scanState == SystemScanState['complete'] && !$scope.bDoClear) {
				return -1;
			}
			else {
				return $scope.originalSystemListIndex;
			}
		};

		//扫描按钮 禁用
		$scope.isScanBtnDisable = function () {
			return ($scope.scanState == SystemScanState['pausing'] || $scope.bDoClear);
		};

		//清除按钮 禁用
		$scope.isClearBtnDisable = function () {
			return ($scope.scanState == SystemScanState['complete'] && !$scope.bDoClear);
		};

		//退出按钮 禁用
		$scope.isQuitBtnDisable = function () {
			return (($scope.scanState == SystemScanState['undone'] || $scope.scanState == SystemScanState['complete']) && !$scope.bDoClear);
		};

		$scope.onItemClick = function (viewIndex, originalIndex) {
			win.RMTClickEvent.clickIntoDTCTable(viewIndex, originalIndex);
		};

		win.RMTClickEvent.clickIntoDTCTable = function (viewIndex, originalIndex) {
			var viewIndex_int = parseFloat(viewIndex);
			var originalIndex_int = parseFloat(originalIndex);
			var clickSystem = $scope.webViewSystemList_arr[viewIndex_int];


			if (clickSystem.dtcOriginalPids.length > 0) {

				//之前没请求解析到故障码，则需要再次请求解析
				if (clickSystem.dtcList.length <= 0) {
					var txt = $scope.webViewSystemList_arr[viewIndex_int].dtcScanStateText;
					var param = cachebadRequestParamArr[viewIndex_int];

					//防止多次点击，触发多次请求，浪费资源 || 如果服务器连param都没返回，就不需要触发重试请求；
					if (txt === "重新检测..." || !param) return;

					FunSendDTCPid2Server(param.index, param.dtcType, param.dtcPidList);
					$scope.webViewSystemList_arr[viewIndex_int].dtcScanStateText = '重新检测...';
					safeApply(function () {});
					return;
				}

				win.moduleEntry.showDTC(originalIndex_int, systemBindBottomBtn);
			}
			else {
				$scope.scanProcess = '无故障信息';
				$scope.clickItemIndex = viewIndex_int;
			}

			safeApply(function () {});
		};


		//开始或者暂停按钮；
		function onClickPauseOrContinue(RMTScanState) {
			var curScanState = RMTScanState ? RMTScanState : $scope.scanState;
			switch (curScanState) {

				case SystemScanState['scanning']:    //点击之后，如果按钮 文本为 “扫描中”，就执行暂停中的操作；
					$scope.scanState = SystemScanState['pausing'];
					$scope.scanProcess = "暂停中...";
					break;

				case SystemScanState['complete']:    //如果按钮状态为“完成”扫描，就执行重新扫描操作
					$scope.originalSystemList_arr.forEach(function (item) {
						item.reset();
					});

					//重新扫描时，重置车辆信息缓存
					global.rootCache.carSystem = {};
					$scope.DTCTotal.length = 0;
					$scope.webViewSystemList_arr.length = 0;
					$scope.scanState = SystemScanState['scanning'];
					modifyScanStateAndConnectNextSys();
					break;

				case SystemScanState['undone']:     //如果按钮文本为 “继续”, 就继续扫描工作
					modifyScanStateAndConnectNextSys();
					$scope.scanState = SystemScanState['scanning'];
					break;
			}

			safeApply(function () {});
		}


		function onClickClearErrorCode() {
			if ($scope.webViewSystemList_arr.length <= 0) {

				tool.alert('系统未连接，请检查设备状态，或者重新扫描',
				           function () {
					           //tool.processBar("");
				           }
				);

			}
			else {
				if (checkDTCList()) {
					tool.alert(['清除故障码过程中不提供“暂停”功能，运行时间会稍长，是否继续？', '确定', '取消'],
						function () {
							clearErrorCodeConfirm();
						},
						function () {}
					)
				}
				else {
					tool.alert('设备无故障信息',
					           function () {
						           //tool.processBar("");
					           }
					)
				}
			}
		}

		function clearErrorCodeConfirm() {
			$scope.bDoClear = true;
			modifyScanStateAndConnectNextSys();
		}

		function checkDTCList() {
			//判断是否所有连接的系统都有故障码，如果都没有故障码，直接给出弹框，阻止清除故障码行为
			var i = $scope.webViewSystemList_arr.length, flag;
			while (i--) {
				if ($scope.webViewSystemList_arr[i].dtcList.length > 0) {
					flag = true;
					break;
				}
			}
			return flag;
		}


		//连接系统
		function modifyScanStateAndConnectNextSys() {
			//$scope.ContactSystemTotal = $scope.originalSystemList_arr.length;

			//检测到文本为停止中，就刷新为暂停。
			//本来扫描状态都是由$scope.$watch来处理，但是由于逻辑链太长，所以方案改为分段处理；
			if ($scope.scanState == SystemScanState['pausing']) {
				$scope.scanState = SystemScanState['undone'];
				$scope.scanProcess = "暂停";
				safeApply(function () {});
				return;
			}

			$scope.scanProcess = $scope.bDoClear ? '正在清除故障' : '正在扫描模块';
			safeApply(function () {});
			setTimeout(function () {
				tool.layoutTable();
				win.sendDataToDev("310901" + getCurSystemNodeAddress());
			}, 450);
		}


		function scanProcessMonitor() {
			console.log($scope.originalSystemListIndex, $scope.originalSystemList_arr.length);
			//扫描完成后的工作
			if (++$scope.originalSystemListIndex >= $scope.originalSystemList_arr.length - 1) {

				//重置下标
				$scope.originalSystemListIndex = 0;
				webViewListIndex = 0;

				//清除故障码循环结束
				if ($scope.bDoClear) {
					$scope.bDoClear = false;
					$scope.scanProcess = "清除完毕";
				}
				else {
					$scope.scanProcess = "扫描完毕";
				}
				$scope.scanState = SystemScanState['complete'];

				//扫描不到系统
				if ($scope.webViewSystemList_arr.length === 0) $scope.scanProcess = '系统未连接';

				setTimeout(function () { tool.layoutTable();}, 150);
			}
			else {
				modifyScanStateAndConnectNextSys();
			}

			safeApply(function () {});
		}

		//获取当前搜寻系统
		function getCurrentSystem() {
			return $scope.originalSystemList_arr[$scope.originalSystemListIndex];
		}

		function getSystemByIndex(index) {
			return $scope.originalSystemList_arr[index];
		}

		//获取当前搜寻系统的通信地址
		function getCurSystemNodeAddress() {
			return getCurrentSystem()['N']['nodeaddress'].replace(/\./g, "");
		}

		//设置当前系统的状态
		function setCurSystemState(linkable) {
			getCurrentSystem().updataSystemState(linkable ? 'linkable' : 'unlinkable');
			safeApply(function () { });
		}

		win.devInterActive.Fun710901_simp = function (varRecvData) {
			webViewListIndex++;

			//正在清除故障码
			if ($scope.bDoClear) {
				win.sendDataToDev('310907');
				return;
			}

			var curSystem = getCurrentSystem();
			if (curSystem['N']['dbfilename'] == '0' || curSystem['N']['dbfilename'] == '') {
				var byte46 = varRecvData.substr(win.getIndexByDevIndex(46), 2);
				var fileName;
				if (byte46 == '00' || byte46 == '') {//当为 0 时无意义，不为0时与 03 - 06 代表数据表路径+名称 ASCII码
					curSystem['N']['dbfilename'] = varRecvData.substr(win.getIndexByDevIndex(10), 4 * 2);
				}
				else {
					fileName = tool.hex2a(varRecvData.substr(win.getIndexByDevIndex(46)));
					curSystem['N']['dbfilename'] = varRecvData.substr(6, 4 * 2) + "/" + fileName;
				}
			}

			setCurSystemState(1);

			//把处于连接状态的系统信息显示到界面；
			safeApply(function () {
				$scope.webViewSystemList_arr.push(getCurrentSystem());
				var realIndex = webViewListIndex - 1;                                               //webViewListIndex
			                                                                                        //是显示给用户的下标，起始值为1
				global.rootCache.carSystem[realIndex] = $scope.webViewSystemList_arr[realIndex].name;     //缓存系统信息，以便显示给用户
			});
			Fun310905();
		};

		win.devInterActive.Fun710981_simp = function (varRecvData) {
			setCurSystemState(0);
			Fun310902();
		};

		function Fun310902() {
			win.sendDataToDev('310902');
		}

		win.devInterActive.Fun710902_simp = function () {
			if ($scope.scanState == SystemScanState['pausing']) {

			}
			scanProcessMonitor();	//连接下一条ECU
		};

		//读取历史故障码
		function Fun310905() {
			win.sendDataToDev('310905');
		}

		//读取当前故障码
		function Fun310906() {
			win.sendDataToDev('310906');
		}

		//读取带状态故障码
		function Fun310914() {
			win.sendDataToDev('310914');
		}

		var cacheOriginalDataOfDTC = [];
		win.devInterActive.Fun710905_simp = function (varRecvData) {
			var getDtcLen = tool.hex2dec(varRecvData.substr(6, 2));
			if (!getDtcLen) {
				getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
				Fun310906();
				return;
			}
			cacheOriginalDataOfDTC.push({
				webView: webViewListIndex,
				original: $scope.originalSystemListIndex,
				dtcType: dtcCurrent,
				data: varRecvData
			});
			Fun310906();	//读取当前故障码
		};

		win.devInterActive.Fun710985_simp = function (varRecvData) {

			//读取当前故障码
			getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
			Fun310906();
		};

		win.devInterActive.Fun710906_simp = function (varRecvData) {
			var getDtcLen = tool.hex2dec(varRecvData.substr(6, 2));
			if (!getDtcLen) {
				getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
				Fun310914();
				return;
			}

			cacheOriginalDataOfDTC.push({
				webView: webViewListIndex,
				original: $scope.originalSystemListIndex,
				dtcType: dtcHistory,
				data: varRecvData
			});

			//读取带状态故障码
			Fun310914();
		};

		win.devInterActive.Fun710986_simp = function (varRecvData) {

			//读取带状态故障码
			getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
			Fun310914();
		};

		win.devInterActive.Fun710914_simp = function (varRecvData) {

			var getDtcLen = tool.hex2dec(varRecvData.substr(6, 2));
			if (!getDtcLen) {
				getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
				countDTCNull($scope.originalSystemListIndex);
				Fun310902();
				return;
			}

			cacheOriginalDataOfDTC.push({
				webView: webViewListIndex,
				original: $scope.originalSystemListIndex,
				dtcType: dtcWithState,
				data: varRecvData
			});

			cacheDtcPid();
			Fun310902();
		};

		win.devInterActive.Fun710994_simp = function (varRecvData) {
			getSystemByIndex($scope.originalSystemListIndex).devReturnNull.push(true);
			countDTCNull($scope.originalSystemListIndex);
			cacheDtcPid();
			Fun310902();
		};

		win.devInterActive.Fun710907_simp = function (varRecvData) {
			getCurrentSystem().updataDtcClearState('clearSucceed');
			$scope.DTCTotal.shift();
			scanProcessMonitor();
		};

		win.devInterActive.Fun710987_simp = function (varRecvData) {
			getCurrentSystem().updataDtcClearState('clearFailure');
			scanProcessMonitor();
		};

		function countDTCNull(index) {
			var devReturnNull = getSystemByIndex(index).devReturnNull.length;
			if (devReturnNull == 3) {
				getSystemByIndex(index).dtcScanStateText = '无故障';
			}
		}

		function cacheDtcPid() {

			var i = 0;
			var cacheDTCLen = cacheOriginalDataOfDTC.length;
			while (i < cacheDTCLen) {

				var varRecvData = cacheOriginalDataOfDTC[i].data;
				var webViewIndex = cacheOriginalDataOfDTC[i].webView;
				var originalIndex = cacheOriginalDataOfDTC[i].original;
				var dtcType = cacheOriginalDataOfDTC[i].dtcType;

				var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2));

				//带状态故障码每8字节代表一个故障码
				var size = (dtcType == dtcWithState ? 2 : 1);

				var dtcPidList = [];

				var index = {
					webView: webViewIndex,
					original: originalIndex
				};

				for (var j = 0; j < count; j++) {
					dtcPidList[j] = varRecvData.substr(win.getIndexByDevIndex(11) + 8 * size * j, 8 * size);
				}

				//实例化每条故障，并存进PID数据
				getCurrentSystem().addDtcOriginalPids(dtcType, dtcPidList);

				//更新故障检测状态
				getCurrentSystem().updataDtcScanState(getCurrentSystem().dtcOriginalPids.length > 0 ? 'checking' : 'noDtc');
				safeApply(function () {});

				//根据存储的PID，请求服务器解析故障码
				FunSendDTCPid2Server(index, dtcType, dtcPidList);
				i++;
			}

			cacheOriginalDataOfDTC.length = 0;
		}

		/**
		 *
		 * @param index 对应系统列表的下标
		 * @param dtcType 故障码类型：历史、当前、带状态
		 * @param dtcPidList 从设备读取到的故障码pid数组
		 */
		function FunSendDTCPid2Server(index, dtcType, dtcPidList) {

			var DataPack = {
				pub: getCurrentSystem()['N']['publicfilename'],
				dbfilename: getCurrentSystem()['N']['dbfilename'],
				type: dtcType == dtcWithState ? 2 : 1,//带状态故障码类型为2，其他为1
				pids: dtcPidList
			};

			var markParams = {
				webViewIndex: index.webView - 1,
				originalIndex: index.original,
				dtcType: dtcType,
				index: index,
				dtcPidList: dtcPidList
			};
			win.server.request(
				global.businessInfo.serverType,
				{
					key: "DTC",
					cartype: global.businessInfo.carType
				},
				DataPack,
				win.server.addCallbackParam(win.serverRequestCallback.DTC_simple, [markParams]),
				[null,handleBackRequest]
			);
		}

		function handleBackRequest(params){
			cachebadRequestParamArr[params.webViewIndex] = params;
			$scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '数据请求失败(点击重试)';
			safeApply(function () {});
		}

		win.serverRequestCallback.DTC_simple = function (responseObject, params) {
			if (!showView)return;
			if (!responseObject.items.length) {
				$scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '无故障';
				safeApply(function () {});
			}
			else {

				//更新视图
				$scope.webViewSystemList_arr[params.webViewIndex].dtcScanStateText = '故障';
				$scope.DTCTotal[params.webViewIndex] = true;
				safeApply(function () {});

				var items = responseObject.items || [];
				for (var i in items) {
					if (!items.hasOwnProperty(i))continue;
					var item = items[i];
					if (item.data.length == 0) {
						/* getSystemByIndex(params.index).dtcList.push(
						 new Dtc({
						 danwei: item.key,
						 name: "无有效数据",
						 status: ""
						 }));*/
					}

					//如果data的长度只有1，就是历史 或者 当前 故障
					else if (item.data.length == 1 && (params.dtcType == dtcHistory || params.dtcType == dtcCurrent)) {
						getSystemByIndex(params.originalIndex).dtcList.push(
							new Dtc({
								show: true,
								danwei: item.data[0].danwei,
								name: item.data[0].name,
								status: item.data[0].name == '未定义' ? '' : (params.dtcType == dtcHistory ? "历史" : "当前")
							})
						);
					}

					//如果data的长度有2个，就是带状态故障
					else if (item.data.length == 2 && (params.dtcType == dtcWithState)) {

						//有两个data时,name&&danwei取type为2的数据,status取type为9的数据
						var type2 = item.data[0].type == '2' ? 0 : 1;
						var type9 = item.data[0].type == '9' ? 0 : 1;
						getSystemByIndex(params.originalIndex).dtcList.push(
							new Dtc({
								show: true,
								danwei: item.data[type2].danwei,             //name&&danwei取type为2的数据
								name: item.data[type2].name,
								status: item.data[type9].name           //status取type为9的数据
							})
						);
					}

					else if (item.data.length == 1 && (params.dtcType == dtcWithState) && item.data[0].type == '2') {

						//只有一个data时,只取type为2的数据,直接忽略9
						getSystemByIndex(params.originalIndex).dtcList.push(
							new Dtc({
								show: true,
								danwei: item.data[0].danwei,
								name: item.data[0].name,
								status: ''
							})
						);
					}

					//排序
					getSystemByIndex(params.originalIndex).dtcList.sort(function (a, b) {
						if (a.name == "系统无故障码" && b.name != "系统无故障码") {
							return 1;
						}
						else {
							return -1;
						}
					});
				}
			}
		}
	}]).config(
		function ($provide) {
			function randomString() {
				var len = 32;
				var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
				var maxPos = $chars.length;
				var randomString = '';
				for (var i = 0; i < len; i++) {
					randomString += $chars.charAt(Math.floor(Math.random() * maxPos));
				}
				console.log('randomString:', randomString);
				return randomString;
			}

			$provide.factory("SystemManager", function () {
				return {
					index: 0,
					scanRandom: randomString(),//扫描随机数
					systemList: [
						{
							name: "2",
							N: {
								nodeaddress: "",
								dbfilename: "",
								pubfilename: ""
							},
							dtcOriginalPids: [
								{
									type: 'history',
									originalPids: ""
								},
								{
									type: 'current',
									originalPids: ""
								},
								{
									type: 'state',
									originalPids: ""
								}
							],
							dtcList: []
						}
					],

					getCurrentSystem: function () {
						return this.systemList[this.index];
					},

					getSystemByIndex: function (index) {
						return this.systemList[index];
					},

					//更新扫描随机数
					updataScanRandomString: function () {
						scanRandom = randomString();
					}
				};
			});

		}
	);

	function System(attr, index) {

		var self = this;

		self.show = true;
		self.name = attr.name;
		self.N = attr.N;
		self.index = index;
		self.dtcOriginalPids = [];

		self.dtcList = [];

		//添加故障码原始pids
		self.addDtcOriginalPids = function (dtcType, pidList) {
			self.dtcOriginalPids.push(new DtcOriginalPids({
				dtcType: dtcType,
				originalPids: pidList
			}));
		};

		//系统是否可连接
		self.systemLinkable = false;

		//系统状态
		self.systemStateText = SystemState['init'];

		self.updataSystemState = function (status) {
			self.systemStateText = SystemState[status];
			self.systemLinkable = (status == 'linkable');
		};

		self.dtcClearStateText = DtcClearState['init'];

		//清除故障码结果
		self.updataDtcClearState = function (status) {
			self.dtcClearStateText = DtcClearState[status];
			self.dtcStateText();
		};

		self.dtcScanStateText = DtcScanState['init'];
		self.updataDtcScanState = function (status) {
			self.dtcScanStateText = DtcScanState[status];
		};

		self.dtcStateText = function () {
			if (self.systemLinkable) {
				if (self.dtcClearStateText != "" && self.dtcScanStateText == "故障") {
					return self.dtcScanStateText + "/" + self.dtcClearStateText;
				}
				else {
					return self.dtcScanStateText;
				}
			}
			else {
				return self.dtcScanStateText = "";
			}
		};


		self.devReturnNull = [];           //设备返回的带71098X的指令
		//重置
		self.reset = function () {
			self.devReturnNull.length = 0;
			self.dtcOriginalPids.length = 0;
			self.dtcList.length = 0;
			self.systemLinkable = false;
			self.systemStateText = SystemState['init'];
			self.dtcScanStateText = DtcScanState['init'];
			self.dtcClearStateText = DtcClearState['init'];
		}
	}

	function N() {
		this.dbfilename = "";
		this.publicfilename = "";
		this.nodeaddress = "";
	}

	function DtcOriginalPids(attr) {

		attr = attr || {};

		this.dtcType = attr.dtcType;
		this.originalPids = attr.originalPids;
	}

	function Dtc(attr) {

		attr = attr || {};
		this.show = attr.show;
		this.name = attr.name;
		this.danwei = attr.danwei;
		this.pid = attr.pid;
		this.appid = attr.appid;
		this.diagid = attr.diagid;
		this.fomula = attr.fomula;
		this.fomulaname = attr.fomulaname;
		this.status = attr.status;
	}

	var SystemState = {
		init: "",
		linkable: "O",
		unlinkable: "X"
	};

	var DtcClearState = {
		init: "",
		clearSucceed: "已清除",
		clearFailure: "清除失败"
	};

	var DtcScanState = {
		init: "",
		checking: "检测中...",
		hasDtc: "故障",
		noDtc: "无故障"
	};

	var SystemScanState = {
		scanning: 'scanning',
		pausing: 'pausing',
		undone: 'undone',
		complete: 'complete'
	};

	var OperationText = {
		scanning: '暂停',
		pausing: '暂停中',
		undone: '继续',
		complete: '重新扫描'
	};

})();
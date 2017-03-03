/**
 * 动态数据
 * Created by mapsh on 2015/8/24.
 */
(function () {
	var win = window;
	var showView = false;

	App.controller('DynamicDataCtrl', ['$scope', 'angularFactory', 'pagingManager', function ($scope, angularFactory, pagingManager) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		var $ = angular.element;
		//全选按钮
		$scope.isCheck = false;
		$scope.isCheckAll = false;

		//进行翻页处理
		$scope.pagingIndex = 0;

		//是否存在分组
		$scope.hasGroup = false;

		//动态数据当前值计算模式
		$scope.valueCalculationMode = 1;
		$scope.cacheOfCurrentGroup_obj = {};  //缓存当前分组，如果在没有完全退出之前，可以不用再请求服务器；

		/**所有分组的所有支持项{
            * "分组1":{checkBox:false,list:[index1:{},index2:{}]},
            * "分组1":{checkBox:true,list:index1:{},index2:{}]}}
		 **/
		$scope.selectedGroupIndex = 0;       //选择的分组的数组下标
		$scope.DynamicWebView = [];  //当前选择组的所有支持项      !important****关键数据，用于模板绑定*******
		var uncheckItemStore = [];          //当前选择组需要显示的支持项   !important****关键数据，用于模板绑定*******

		$scope.groupList = [];                  //分组列表
		$scope.groupNameList = [];              //分组名称列表
		$scope.currentGroupName = '';           //当前分组名称

		$scope.pakidList = [];
		$scope.currentGroupPakidList = [];
		var cachePidPackForRequestServer = [];  //max 3


		$scope.calculateSupportList = [];       //缓存将要计算当前值的支持项数组  !important****关键数据，用于同服务器交互*******
		$scope.calculateIndex = 0;

		//设备返回8x时的副本
		$scope.devResponse8x = {
			_89: [],
			_93: [],
			_9C: []
		};

		$scope.selectedAll = false;
		$scope.btnConfirmDisable = false;              //开始按钮状态；
		$scope.btnAssistAndBack = false;        //退出按钮状态；

		var State = {
			idle: 'idle',//空闲中
			working: 'working',//工作中
			stopping: 'stopping'//暂停中
		};

		var StateText = {
			idle: "开始",
			working: '停止',
			stopping: '停止中'
		};

		$scope.state = State.idle;
		$scope.stateText = StateText[$scope.state];

		var bodyHeight = 0;
		/**
		 * 入口函数
		 */
		win.moduleEntry.dynamicData = function () {
			cachePidPackForRequestServer.length = 0;
			//tool.layout("ShowOperate", 0);
			document.getElementById("Title").innerText = "动态数据列表";
			showCheckBox();
			$scope.hasGroup = false;
			$scope.currentGroupName = '正在初始化数据';
			$scope.btnConfirmDisable = false;
			$scope.btnAssistAndBack = false;
			showView = true;

			bindingBottomBtn();
			bodyHeight = tool.layout("ShowDynamicData", 1);
			//tool.processBar('正在初始化数据', true);

			if (YhSupportService._0x09.value && YhSupportService._0x13.value)
			//当 310909 和 310913 同时被支持时
				$scope.valueCalculationMode = 4;

			else if (YhSupportService._0x09.value)
			//当 310909 被支持时
				$scope.valueCalculationMode = 1;

			else if (YhSupportService._0x1C.value)
			//当 31091C 被支持时
				$scope.valueCalculationMode = 2;

			else if (YhSupportService._0x13.value)
			//当 310913 被支持时
				$scope.valueCalculationMode = 3;

			FunGetGroup();

		};

		//监视state，动态刷新 ‘开始’ 按钮状态；
		$scope.$watch('state', function (to, from) {
			$scope.stateText = StateText[to];
			$scope.btnConfirmDisable = (to != State.stopping);
			$scope.btnAssistAndBack = (to == State.idle);
		});

		/******************************************
		 获取分组；
		 ******************************************/
		function FunGetGroup() {
			if (showView)tool.loading({pos: "body", text: '获取数据...'});
			//tool.processBar('正在获取分组信息', true);
			var dataPack = {dbfilename: global.businessInfo.dbFilename, pub: global.businessInfo.pubFilename};
			win.server.request(
				global.businessInfo.serverType,
				{
				key: "CALC_ONE_GROUP",
				cartype: global.businessInfo.carType
			},
				dataPack,
				win.server.addCallbackParam (win.serverRequestCallback.CALC_ONE_GROUP, [dataPack]),
			    [FunGetGroup,dynamicBtn_Confirm_Assist_Back]
			);
		}

		win.serverRequestCallback.CALC_ONE_GROUP = function (responseObject) {
			if (!showView)return;
			//if (!status || !responseObject || !status.ok) {
			//	tool.alert(['服务器响应失败，请点击重试', '重试', '取消'],
			//		function () { FunGetGroup(); },
			//		function () {
			//			dynamicBtn_Confirm_Assist_Back();
			//			//tool.processBar("");
			//		}
			//	);
			//
			//}
			//else {
				if (!responseObject.groups || responseObject.groups.length <= 0) {

					safeApply(function () {
						$scope.hasGroup = false;
						$scope.currentGroupName = "无分组信息";
						//tool.processBar('无任何分组信息');
					});

					setTimeout(function () { FunGetPid(); }, 25);

					return;
				}

				var tempGroup = responseObject.groups;
				if (tempGroup[0].group != 0 && tempGroup[0].group != '')
					safeApply(function () {
						$scope.hasGroup = true;
						$scope.currentGroupName = "请选择一个分组";
					});

				//取出所有不重复的group名；
				$scope.groupList = _
					.chain(responseObject.groups)
					.groupBy(function (item) { return ((!item.group) || ("" == item.group.trim())) ? '0' : item.group; }) //空或者空字符串""一律以"0"分组
					.value();
				$scope.groupNameList = _.keys($scope.groupList);

				safeApply(function () {
					$scope.btnConfirmDisable = true;
					$scope.btnAssistAndBack = true;
					//tool.processBar('分组信息获取成功');
				});

				tool.loading(0);
			//}
		};

		/**
		 * 从设备获取动态数据支持项的pid
		 */
		function FunGetPid() {
			if (showView)tool.loading({pos: "body", text: '获取数据...'});
			//tool.processBar('正在获取支持项', true);
			$scope.btnConfirmDisable = false;
			$scope.btnAssistAndBack = false;

			if (YhSupportService._0x08.value)
				Fun310908();
			else if (YhSupportService._0x12.value)
				Fun310912RequstPid();               //当支持310912时，需要先获取PID支持项；
			else
				Fun3109Default();
		}

		//当0x08和0x12都不被支持，pid为空；
		function Fun3109Default() {
			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				group: $scope.hasGroup ? $scope.currentGroupName : '',
				type: 1,
				version: "2",
				pids: []
			};
			FunGetSupportsFromServer(dataPack);
		}

		//08支持时，直接发送指令给设备；
		function Fun310908() {
			win.sendDataToDev("310908");
		}

		//12支持时，先从服务器请求PID，再打包发给设备；
		function Fun310912RequstPid() {
			if ($scope.pakidList.length <= 0){

				var dataPack = {dbfilename: global.businessInfo.dbFilename, pub: global.businessInfo.pubFilename};
			win.server.request(
				global.businessInfo.serverType,
				{
				key: "CALC_ONE_PID",
				cartype: global.businessInfo.carType
			},
				dataPack,
				win.server.addCallbackParam (win.serverRequestCallback.CALC_ONE_PID, [dataPack]),
			    [FunGetPid,dynamicBtn_Assist_Back]
			);

				//win.RequestDataFromServer(
				//	"CALC_ONE_PID", {dbfilename: global.businessInfo.dbFilename, pub: global.businessInfo.pubFilename},
				//	function (responseObject) { serverRequestCallback.CALC_ONE_PID(responseObject) }
				//);
			}else
				Fun310912();
		}

		win.serverRequestCallback.CALC_ONE_PID = function (responseObject) {

			if (!showView)  return;
			//if (!status || !responseObject || !status.ok) {
			//	tool.alert(['服务器响应失败，请点击重试', '重试', '取消'],
			//		function () { FunGetPid(); },
			//		function () {
			//			dynamicBtn_Assist_Back();
			//			//tool.processBar("");
			//		}
			//	);
			//}
			//else {

				//查询结果为零
				//if (!responseObject.pakids || responseObject.pakids.length <= 0) {
				//	tool.alert('无任何支持项信息', function () {
				//		relativeButtonStatus();
				//		//tool.processBar("");
				//	});
				//	return;
				//}
			if (!responseObject.pakids.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           relativeButtonStatus();
					           //tool.processBar("");
				           }
				);
				return;
			}
				//如果有分组，则匹配group，打包group下的PID值
				if ($scope.hasGroup)
					$scope.pakidList =
						_.chain(responseObject.pakids)
							.groupBy(function (item) { return ((!item.group) || ("" == item.group.trim())) ? '0' : item.group; }) //空或者空字符串""一律以"0"分组
							.value();
				else
				//没有分组时，打包所有PID
					responseObject.pakids.forEach(function (item) {
						$scope.pakidList.push(new PakId(item));
					});


				Fun310912();
			//}
		};

		function Fun310912() {
			var count = 0, sendStr = '', i;
			if ($scope.hasGroup) {
				//获取当前分组的表单，抽取所有PID发送到服务器；
				$scope.currentGroupPakidList = $scope.pakidList[$scope.currentGroupName];
				count = $scope.currentGroupPakidList.length;
				for (i = 0; i < count; i++) sendStr += $scope.currentGroupPakidList[i].supid;
			}
			else {
				count = $scope.pakidList.length;
				for (i = 0; i < count; i++) sendStr += $scope.pakidList[i].supid;
			}

			win.sendDataToDev("310912" + tool.toHex(count, 4) + sendStr);
		}

		/***************************
		 设备响应PID请求后的处理；
		 ***************************/
		win.devInterActive.Fun710912 = function (varRecvData) {

			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2 * 2));
			if (count <= 0)
				tool.alert('无任何支持项信息', function () {
					relativeButtonStatus();
					//tool.processBar("");
				});
			else
				wrapPids4GetSupports(count, varRecvData);

		};

		win.devInterActive.Fun710992 = function (varRecvData) {
			tool.alert('设备数据读取失败', function () {
				relativeButtonStatus();
				//tool.processBar("");
			});
		};

		win.devInterActive.Fun710908 = function (varRecvData) {
			var count = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 2 * 2));
			if (count <= 0)
				tool.alert('无任何支持项信息', function () {
					relativeButtonStatus();
					//tool.processBar("");
				});
			else
				wrapPids4GetSupports(count, varRecvData);

		};

		win.devInterActive.Fun710988 = function () {
			tool.alert('设备数据读取失败', function () {
				relativeButtonStatus();
				//tool.processBar("");
			});
		};

		/**
		 * 封装pids从服务器获取支持项
		 * @param count
		 * @param varRecvData
		 */
		function wrapPids4GetSupports(count, varRecvData) {
			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				group: $scope.hasGroup ? $scope.currentGroupName : '',
				type: $scope.valueCalculationMode,
				version: "2",
				pids: []
			};

			for (var i = 0; i < count; i++)
				dataPack.pids[i] = varRecvData.substr(win.getIndexByDevIndex(12) + 8 * i, 8)

			dataPack.pids.unDuplicate();
			FunGetSupportsFromServer(dataPack);
		}

		/**
		 * 从服务器获取动态数据支持项
		 * @param dataPack
		 */
		function FunGetSupportsFromServer(dataPack) {
			//tool.processBar('正在解析支持项', true);
			win.server.request(
				global.businessInfo.serverType,
				{
				key: "CALC_ONE_SUPPORT",
				cartype: global.businessInfo.carType
			},
				dataPack,
				win.server.addCallbackParam (win.serverRequestCallback.CALC_ONE_SUPPORT, [dataPack]),
			    [FunGetSupportsFromServer,dynamicBtn_Confirm_Assist_Back]
			);

			//win.RequestDataFromServer(
			//	"CALC_ONE_SUPPORT", dataPack,
			//	utilAddParams(
			//		function (responseObject, params) {
			//			serverRequestCallback.CALC_ONE_SUPPORT(responseObject, params)
			//		}, dataPack
			//	)
			//);
		}

		win.serverRequestCallback.CALC_ONE_SUPPORT = function (responseObject, params) {
			if (!showView)return;
			//if (!status.ok) {
			//	tool.alert(['服务器响应失败，请点击重试', '重试', '取消'],
			//		function () { FunGetSupportsFromServer(params);},
			//		function () {
			//			dynamicBtn_Confirm_Assist_Back();
			//			//tool.processBar("");
			//		}
			//	);
			//}else if(!responseObject || !responseObject.supportitems.length){
			//	tool.alert('服务器无数据支持',
			//		function () {
			//			dynamicBtn_Confirm_Assist_Back();
			//			//tool.processBar("");
			//		}
			//	);
			//}
			//else {

			if (!responseObject.supportitems.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           dynamicBtn_Confirm_Assist_Back();
					           //tool.processBar("");
				           }
				);
				return;
			}

				var items = responseObject.supportitems || [];
				var itemLen = items.length;
				if (itemLen <= 0) {
					tool.alert('无任何支持项信息', function () {
						relativeButtonStatus();
						//tool.processBar("");
					});
					return;
				}

				if (!$scope.DynamicWebView) $scope.DynamicWebView = [];

				//给所有项都加上check和show属性；
				while (itemLen--) items[itemLen] = new Support(items[itemLen]);

				//按照 分组信息 获取当前支持项列表；
				if ($scope.hasGroup) {
					//取出符合group字段的对象；
					$scope.cacheOfCurrentGroup_obj[$scope.currentGroupName] =
						_.filter(items, function (item) { return item.group == $scope.currentGroupName});
					$scope.DynamicWebView =
						[].concat($scope.cacheOfCurrentGroup_obj[$scope.currentGroupName]);
				}
				else {
					//如果没有分组，就列出所有项
					$scope.DynamicWebView = items;
				}
				tool.loading(0);
				safeApply(function () {
					$scope.btnConfirmDisable = true;
					$scope.btnAssistAndBack = true;
					//tool.processBar('支持项解析成功');
				});
			//}

		};

		/**从设备读取动态数据原始值*/
		function FunGetOriginal() {

			//如果退出表格,或者已经弹出提示框,则阻断数据读取;
			if (!showView || $scope.state == State.idle) return;

			//$scope.calculateSupportList改成二维数组之后，重新计算
			var support = $scope.calculateSupportList[$scope.pagingIndex][$scope.calculateIndex];
			var count = tool.toHex($scope.calculateSupportList[$scope.pagingIndex].length, 4);

			var pakids =
				_.chain($scope.calculateSupportList[$scope.pagingIndex])
					.filter(function (item) { return item.type == '8' })
					.map(function (item) { return item.pakid; })
					.join("").value();

			var pakpos =
				_.chain($scope.calculateSupportList[$scope.pagingIndex])
					.filter(function (item) { return item.type == '8' })
					.map(function (item) { return item.pakpos; })
					.join("").value();

			switch ($scope.valueCalculationMode) {
				case 1:
					win.sendDataToDev('310909' + '01' + support.pid);
					break;
				case 2:
					win.sendDataToDev('31091C' + support.pid + support.diagid.substr(support.diagid.length - 4, 4));
					break;
				case 3://710913，只发送一次PAKID给设备
					win.sendDataToDev('310913' + count + pakids + pakpos);
					break;
				case 4:
					if (support.type == '3') {
						win.sendDataToDev('310909' + '01' + support.pid);
					}
					else if (support.type == '8') {     //710913，只发送一次PAKID给设备
						win.sendDataToDev('310913' + count + pakids + pakpos);
					}
					break;
				default :
					tool.alert("到设备指令未定义", function () {
						//tool.processBar("");
					});
					break;
			}

		}

		/**设备响应原始值请求之后的处理*/
		win.devInterActive.Fun710909 = function (varRecvData) {

			//未停止数据流状态之前退出数据流，会有后续设备指令续传，但是在退出之后， $scope.calculateSupportList已经被置空；
			if (!$scope.calculateSupportList.length) return;

			//1b 的信息长度字节
			var originalLen = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(11), 2));

			var support = $scope.calculateSupportList[$scope.pagingIndex][$scope.calculateIndex];

			wrapOriginalValue4GetShowValue(
				{
					index: support.index,
					original: varRecvData.substr(win.getIndexByDevIndex(12), originalLen * 2),
					pos: ""                 //两字节pos计算位置
				}
			);
			FunGetNextOriginal();
		};

		win.devInterActive.Fun710989 = function (varRecvData) {

			// 如果全部为89,则给出提示，否则不做处理;
			$scope.devResponse8x._89[$scope.calculateIndex] = true;
			checkDevResponse();
			FunGetNextOriginal();
		};

		win.devInterActive.Fun71091C = function (varRecvData) {
			//未停止数据流状态之前退出数据流，会有后续设备指令续传，但是在退出之后， $scope.calculateSupportList已经被置空；
			if (!$scope.calculateSupportList.length) return;

			//2b 的信息长度字节
			var originalLen = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(12), 4));
			var support = $scope.calculateSupportList[$scope.pagingIndex][$scope.calculateIndex];

			wrapOriginalValue4GetShowValue({
				index: support.index,
				original: varRecvData.substr(win.getIndexByDevIndex(12 + 2), originalLen * 2),
				pos: varRecvData.substr(win.getIndexByDevIndex(10), 4)         //两字节pos计算位置

			});//两字节pos计算位置
			FunGetNextOriginal();

		};

		win.devInterActive.Fun71099C = function (varRecvData) {

			// 如果全部为9C,则给出提示，否则不做处理;
			$scope.devResponse8x._9C[$scope.calculateIndex] = true;
			checkDevResponse();
			FunGetNextOriginal();
		};

		win.devInterActive.Fun710913 = function (varRecvData) {
			handle710913Pakid(varRecvData);
		};

		var countPakidFor710913 = 0;

		function handle710913Pakid(varRecvData) {
			//未停止数据流状态之前退出数据流，会有后续设备指令续传，但是在退出之后， $scope.calculateSupportList已经被置空；
			if (!$scope.calculateSupportList.length) return;
			//2b 的信息长度字节
			var originalLen = tool.hex2dec(varRecvData.substr(win.getIndexByDevIndex(10), 4));
			var support = $scope.calculateSupportList[$scope.pagingIndex][$scope.calculateIndex];

			//selectedGroupIndex, index, pid, original, pos,appid,diagid,fomula,fomulaname
			//todo 分页处理获取计算数据
			wrapOriginalValue4GetShowValue({
				index: support.index,
				original: varRecvData.substr(win.getIndexByDevIndex(12), originalLen * 2),
				pos: varRecvData.substr(win.getIndexByDevIndex(12 + originalLen + countPakidFor710913), 4)         //两字节pos计算位置
			});

			countPakidFor710913 += 2;
			FunGetNextOriginal(varRecvData);
		}

		win.devInterActive.Fun710993 = function (varRecvData) {
			// 如果全部为93,则给出提示，否则不做处理;
			$scope.devResponse8x._93[$scope.calculateIndex] = true;
			checkDevResponse();
			FunGetNextOriginal(varRecvData);
		};

		/**取下一条原始值*/
		function FunGetNextOriginal(varRecvData) {

			if ($scope.state == State.stopping) {
				safeApply(function () { $scope.state = State.idle; });
				return;
			}

			if ($scope.state == State.idle) {
				$scope.calculateIndex = 0;//停止了，以后就必须从0开始
				return;
			}

			//如果是710913，则每次轮询统 只发送一次 PAKID 给设备；
			var calculateIndex = ++$scope.calculateIndex;             //防止全局变量被监听时的刷新；
			var calculateSupportListLen = $scope.calculateSupportList[$scope.pagingIndex].length;
			//如果是13，一次性发送所有PAKID给设备
			if (varRecvData && varRecvData.substr(4, 2) == '13' && (calculateIndex < calculateSupportListLen))
				handle710913Pakid(varRecvData);
			else {
				//如果下标 已经大于 数据长度，就进入下一轮计算
				if (calculateIndex >= calculateSupportListLen) {
					$scope.calculateIndex = 0;
					$scope.devResponse8x._89.length = 0;
					$scope.devResponse8x._9C.length = 0;
					$scope.devResponse8x._93.length = 0;
					countPakidFor710913 = 0;                //710913专用计算pos长度；
					countStepFor710913 = 0;               //动态数据滚动到下一轮数据流的时候，重置计步数
				}

				setTimeout(function () { FunGetOriginal(); }, 25);
			}
		}

		/**
		 * 封装原始值，发送到服务器计算显示值
		 * @param pids $scope.valueCalculationMode
		 */
		function wrapOriginalValue4GetShowValue(pids) {

			cachePidPackForRequestServer.push(pids);      //一次请求3个数据项的显示值，不足3个也请求

			if ($scope.state == State.stopping ||
				(($scope.calculateSupportList[$scope.pagingIndex].length < 3) &&
				(cachePidPackForRequestServer.length == $scope.calculateSupportList[$scope.pagingIndex].length)) ||
				(($scope.calculateSupportList[$scope.pagingIndex].length >= 3) &&
				(cachePidPackForRequestServer.length == 3))) {
				getShowValueFromServer(cachePidPackForRequestServer);
				cachePidPackForRequestServer.length = 0;
			}
		}

		function getShowValueFromServer(cachePidPackForRequestServer) {

			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				type: $scope.valueCalculationMode,
				version: "2",
				pids: cachePidPackForRequestServer
			};

			var param = {
				dataPack: dataPack,
				selectedGroupName: $scope.currentGroupName,
				//updatetime: (new Date()).getTime(),
				index: $scope.calculateIndex
			};

			checkDevResponse();
			win.server.request(
				global.businessInfo.serverType, {
				key: "CALC_ONE",
				cartype: global.businessInfo.carType
			},
				dataPack,
				win.server.addCallbackParam (win.serverRequestCallback.CALC_ONE_ANS, [param]),
				handleResponseErr
			)

		}

		/**
		 //动态数据信息值返回无效时，刷新为'N/A'，每次3条
		 */
		function handleResponseErr(params) {
			if (!$scope.DynamicWebView || !params) return;
			var curIndex = params.index;
			var rowsInEachPage = global.RMTInfo.rowsInEachPage || 0;
			safeApply(function () {
                while ((params.index > curIndex - 3) && (params.index >= 0)) {
                    $scope.DynamicWebView[params.index-- + ($scope.pagingIndex * rowsInEachPage)].ans = "N/A";
                }
			});

		}

		var countStepFor710913 = 0;
		win.serverRequestCallback.CALC_ONE_ANS = function (responseObject, params) {
			if (!showView) return;

			if ($scope.state === State.idle) {
				//tool.processBar('暂停');
				return;
			}

			var supListLen = $scope.calculateSupportList[$scope.pagingIndex].length;

			countStepFor710913 += (responseObject && responseObject.items) ? responseObject.items.length : 3;

			if (countStepFor710913 > supListLen) countStepFor710913 = supListLen;

			safeApply(function () {
				//tool.processBar('正在计算信息值' + countStepFor710913 + "/" + supListLen);
			});

			//if (!responseObject.items.length) {
			//	//todo 刷新信息值为“N/A”，每次刷新3条
			//	handleResponseErr(params);
			//}
			//else {
			if(!responseObject.items.length){
				handleResponseErr(params);
				return;
			}
				var supports = $scope.DynamicWebView || [];

				//刷新界面
				safeApply(function () {
					responseObject.items.forEach(function (item) {
						var support = _.find(supports, function (temp) { return temp.index == item.index });
						if (support) support.ans = item.ans;
					});
				});
			//}
		};

		/**
		 * 设备响应失败和服务器计算为空时的处理；
		 */
		function checkDevResponse() {
			/*  var len_8x = $scope.devResponse8x._89.length +
			 $scope.devResponse8x._9C.length +
			 $scope.devResponse8x._93.length;*/

			var indexArray = [];
			if ($scope.devResponse8x._89.length > 0) {
				indexArray = _.filter($scope.devResponse8x._89, function (index) {
					return !(!index);
				});
				showSingle_N_A(indexArray);
			}
			if ($scope.devResponse8x._9C.length > 0) {

				indexArray = _.filter($scope.devResponse8x._9C, function (index) {
					return !(!index);
				});
				showSingle_N_A(indexArray);
			}
			if ($scope.devResponse8x._93.length > 0) {

				indexArray = _.filter($scope.devResponse8x._93, function (index) {
					return !(!index);
				});
				showSingle_N_A(indexArray);
			}

		}

		function showSingle_N_A(devResponse8xIndexArray) {
			console.log("执行一次showSingle_N_A");

			var i = devResponse8xIndexArray.length;
			while (i--) if ($scope.DynamicWebView[i]) $scope.DynamicWebView[i].ans = 'N/A';
			safeApply(function () {});
		}

		/** 动态数据一直请求数据，无数据时显示空白，不做“N/A”替换 */
		function showAll_N_A() {
			if (!showView)return;
			if ($scope.DynamicWebView && $scope.DynamicWebView.length > 0) {
				var i = $scope.DynamicWebView.length;
				while (i--) $scope.DynamicWebView[i].ans = 'N/A';

				//处于数据流阶段，无数据只给出提示，不中断流程；
				//tool.processBar('无任何信息值');
				safeApply(function () {});
			}
		}


		/** 刷新两个按钮 */
		function dynamicBtn_Assist_Back() {
			return $scope.btnAssistAndBack = true;
		}

		/** 刷新三个按钮 */
		function dynamicBtn_Confirm_Assist_Back() {
			return $scope.btnConfirmDisable = $scope.btnAssistAndBack = true;
		}


		function showAllUncheck() {
			if ($scope.DynamicWebView && $scope.DynamicWebView.length > 0) {
				safeApply(function () {
					var i = $scope.DynamicWebView.length;
					while (i--) $scope.DynamicWebView[i].show = true;
					$scope.isCheck = true;
				});
			}
		}

		/** 全选按钮; */
		win.RMTClickEvent.dynamicCheckAllBtn = function () {
			$scope.isCheckAll = true;
			safeApply(function () {
				_.forEach($scope.DynamicWebView, function (support) {
					if (support.show) support.check = !$scope.isCheck;
					if (!support.check) $scope.isCheckAll = false;
				});
			});
			$scope.isCheck = !$scope.isCheck;

		};

		/** 分组切换; */
		$scope.createDropDownList = function () {
			if (!$scope.btnAssistAndBack) return;
			RMTClickEvent.CreateDynamicDropDownList();
		};

		win.RMTClickEvent.CreateDynamicDropDownList = function () {
			tool.dropDownList({
				dataList: $scope.groupNameList,
				showProp: "",
				btnCallback: DynamicChangeGroupItem
			})
		};

		//切换组数据时，修改所有的checkbox为未点击状态
		function resetTheCheckBox() {
			var len = $scope.DynamicWebView.length;
			while (len--) $scope.DynamicWebView[len].check = false;

			//切换分组时，‘选项’按钮 重置；
			$scope.isCheck = false;
			$scope.isCheckAll = false;
		}

		function DynamicChangeGroupItem(item, index) {

			var index_int = parseFloat(index);

			var itemName = item;
			//用户没切换当前分组，则退出
			if ($scope.currentGroupName == itemName) return;

			//修改所有的checkbox为未点击状态
			resetTheCheckBox();

			//每次切换数据分组，都要清楚PID缓存,PID缓存用于发送到服务器匹配相关数据
			cachePidPackForRequestServer.length = 0;

			//点击弹出下拉菜单的时候，隐藏当前显示的数据信息，避免选择其他分组时，提示“无任何分组信息”，造成阅读混乱
			$scope.DynamicWebView.length = 0;

			$scope.currentGroupName = itemName;

			//如果已有缓存数据，则不再请求，直接从缓存里获取当前列表；
			if ($scope.cacheOfCurrentGroup_obj[$scope.currentGroupName]) {
				$scope.DynamicWebView =
					angular.extend([], $scope.cacheOfCurrentGroup_obj[$scope.currentGroupName]);
				return;
			}

			safeApply(function () {
				tool.layoutTable();
				$scope.btnConfirmDisable = false;
				$scope.btnAssistAndBack = false;
			});

			FunGetPid();
		}

		/** 远程协助checkbox点击事件，只通知业务机 刷新页面 */
		$scope.RMTCheckboxClick = function (index, checked) {
			win.sendRMTEventToApp('RMTCheckbox', [index, checked]);
		};

		win.RMTCheckbox = function (index, checked) {
			var _index = parseInt(index);
			var _checked = typeof checked === "string" ? eval(checked) : checked;
			safeApply(function () {
				$scope.DynamicWebView[_index].check = _checked;
			});

			//safeApply(function () {
			//    $scope.DynamicWebView[index].check = checked;
			//});
		};

		function relativeButtonStatus() {
			$scope.state = State.idle;
			$scope.stateText = StateText[$scope.state];
			$scope.btnAssistAndBack = true;
		}

		/** 按钮帮东事件 */
		function bindingBottomBtn() {
			tool.bottomBtn({
				btn1Text: function () { return $scope.stateText; },                 //绑定函数，可以动态抓取 $scope.stateText 的值
				btn2Text: '返回',
				btn1Disable: function () { return $scope.btnConfirmDisable; },
				//btn2Disable: function () { return $scope.btnConfirmDisable; },
				btn1Callback: function () { dynamicConfirm(); },
				btn2Callback: function () { dynamicBack(); }
			})
		}


		function showCheckBox() {
			$(".hack-for-huawei-browser").show();
		}

		function hideCheckBox() {
			$(".hack-for-huawei-browser").hide();
		}

		/********************************************************
		 * 开始按钮;
		 ********************************************************/
		function dynamicConfirm() {
			$scope.devResponse8x._89.length = 0;
			$scope.devResponse8x._9C.length = 0;
			$scope.devResponse8x._93.length = 0;

			//如果在工作中，则阻断流程
			if ($scope.state == State.working) {
				if ($("#pagingButton").length)$("#pagingButton")[0].style.display = "none";   //隐藏翻页按钮
				safeApply(function () {
					$scope.state = State.idle;
					$scope.btnAssistAndBack = true;
					$scope.DynamicWebView = $scope.DynamicWebView.concat(uncheckItemStore);
					//显示所有未选中项
					showAllUncheck();
					//这个标记的意义在于，如果正在进行数据流任务，就把其他不必要的数据丢弃掉，比如：设备数据
					win.global.RMTInfo.dataStream = false;
					showCheckBox();
					//tool.processBar('暂停');
				});
				return;
			}

			if ($scope.calculateSupportList) $scope.calculateSupportList.length = 0;            //被选中数组个数,流程开始后重新计算;
			$scope.calculateIndex = 0;                             //清空相对应的下标
			$scope.pagingIndex = 0;                                //初始化翻页下标

			var checkItemStore = [];                               //存储已选的item，用于界面显示
			uncheckItemStore.length = 0;                           //存储未选的item
			_.forEach($scope.DynamicWebView, function (support) {
				if (support.check)
					checkItemStore.push(support);
				else
					uncheckItemStore.push(support);
			});

			//如果未选中任何选项, 阻断流程;
			if (checkItemStore.length <= 0) {
				tool.alert('未选中任何支持项', function () {
					//tool.processBar("");
				});
				return;
			}

			//tool.processBar('正在加载数据', true);
			hideCheckBox();

			//让远程操控端无法连续点击按钮，第一个数据从业务机返回时，再隐藏加载遮罩
			if (global.RMTInfo.ID != "0") tool.loading({text: "等待远程端数据同步..."});

			//进行分页处理，并创建翻页按钮，返回预处理的二维数组。
			pagingManager.handlePaging(checkItemStore);
		}

		//todo 在远程业务中，如果平板电脑是控制机，普通手机是业务机，
		//todo 则在动态数据分页时，平板电脑的显示项会多于普通手机
		//todo 由于控制机不能同服务器通讯，
		//todo 所以，解决方案为：设置全局变量，由APP进行转发，只取业务机的显示最大数
		win.serverRequestCallback.SetRMTCountRowInScrollTable = function (rowsInEachPage, dataArr) {
			win.global.RMTInfo.rowsInEachPage = parseFloat(rowsInEachPage);
			var $pagingButton = $("#pagingButton");

			//如果dataArr假，或者传入的数组为空，就退出函数
			//退出前，隐藏翻页按钮（如果有的话）
			if (!dataArr || !dataArr.length) {
				if ($pagingButton.length) $pagingButton[0].style.display = "none";
				return;
			}

			$scope.DynamicWebView = dataArr;
			var calcArr = [];
			//计算分页数；
			var countPages = Math.floor($scope.DynamicWebView.length / global.RMTInfo.rowsInEachPage);
			//分页是否整除
			var lastPageRows = $scope.DynamicWebView.length % global.RMTInfo.rowsInEachPage;

			//每一页的数据存一个数组
			for (var i = 0; i < countPages; i++) {
				calcArr[i] = [];
				for (var j = 0; j < global.RMTInfo.rowsInEachPage; j++)
					calcArr[i].push($scope.DynamicWebView[global.RMTInfo.rowsInEachPage * i + j]);
			}

			//判断是否整除，如果不整除，就处理最后一页的数据
			//如果只有一页，也在这里处理
			if (lastPageRows) {
				calcArr[countPages] = [];            //把二维数据变成一维数组；
				for (var n = 0; n < lastPageRows; n++)
					calcArr[countPages].push($scope.DynamicWebView[global.RMTInfo.rowsInEachPage * countPages + n]);
			}

			//存完数据之后，显示第一页；（两个方案，1：实现左右移动；2：修改【显示/隐藏】）
			//方案二，
			// 第一步：先隐藏全部
			var len = calcArr.length;
			for (var k = 0; k < len; k++) {
				var innerLen = calcArr[k].length;
				for (var l = 0; l < innerLen; l++) calcArr[k][l].show = false;
			}

			//显示第一页；
			_.forEach(calcArr[0], function (support) { support.show = true; });

			//显示之后获取第一页的数据量，之后每翻一页就重新获取数据量
			win.global.DataStream_CurPageLinesCount = calcArr[$scope.pagingIndex].length;

			//如果要分组的数组长度小于或等于单页的长度，就不需要进行分页，
			if (dataArr.length <= global.RMTInfo.rowsInEachPage) {
				if ($pagingButton.length) $pagingButton.hide();
			}
			else {
				$(".arrow-left-press").show();
				$(".arrow-right-press").show();
				if ($pagingButton.length) $pagingButton.show();

			}

			safeApply(function () {});
			tool.loading(0);

			//到此，分页工作预处理完毕，接下来扔出去给数据流事件，
			concatButtonEvent(calcArr);
		};

		function concatButtonEvent(calcArr) {
			$scope.calculateSupportList = calcArr || [];

			$scope.state = State.working;       //改变开始按钮状态;
			$scope.btnAssistAndBack = false;    //改变返回按钮状态;

			//隐藏所有未选中项
			_.forEach($scope.DynamicWebView, function (support) {
				if (!support.check) support.show = false;
			});
			safeApply(function () {});

			//这个标记的意义在于，如果正在进行数据流任务，就把其他不必要的数据丢弃掉，比如：设备数据
			win.global.RMTInfo.dataStream = true;
			FunGetOriginal();
		}

		win.RMTClickEvent.handlePageTurn = function (direc) {
			var leftButton_EL = $(".arrow-left-press");
			var rightButton_EL = $(".arrow-right-press");

			var direc_int = parseFloat(direc);
			$scope.pagingIndex += direc_int;

			//如果页数下标小于0，重置为0
			if ($scope.pagingIndex < 0) {
				$scope.pagingIndex = 0;

				//向左翻到最顶页的时候，隐藏左边的翻页按钮
				leftButton_EL.hide();
				return;
			}

			//如果页数下标大于总页数，重置为最大页数
			if ($scope.pagingIndex >= $scope.calculateSupportList.length) {
				$scope.pagingIndex = $scope.calculateSupportList.length - 1;
				//向右翻到最顶页的时候，隐藏右边的翻页按钮
				rightButton_EL.hide();
				return;
			}

			leftButton_EL.show();
			rightButton_EL.show();
			//***以下两个用于计算缓存数组的基础变量***；
			if (!!cachePidPackForRequestServer)cachePidPackForRequestServer.length = 0;          //每次切换，清空缓存的PID数组
			$scope.calculateIndex = 0;                                                           //每次切换，都重新从0开始计算
			win.global.DataStream_CurPageLinesCount = $scope.calculateSupportList[$scope.pagingIndex].length;   //重新计算当前页的数据量,当远程端执行这个全局函数时，也会刷新这个值
			safeApply(function () {
				_.forEach($scope.calculateSupportList[$scope.pagingIndex], function (support) {
					support.show = true;
				});
				_.forEach($scope.calculateSupportList[$scope.pagingIndex - direc_int], function (support) {
					support.show = false;
				});
			});
		};

		//点击切换按钮样式
		win.RMTClickEvent.handleView = function (direc) {
			var direc_int = parseFloat(direc);
			var pagingButton = $("#pagingButton");
			var buttonBox = pagingButton.find(".bottom-bar-button-box");
			var leftButton = $(buttonBox[0].children[0]);
			var rightButton = $(buttonBox[0].children[1]);
			if (direc_int == -1) {
				leftButton.addClass("arrow-left-Press");
				setTimeout(function () { leftButton.removeClass("arrow-left-Press"); }, 100)
			}
			else {
				rightButton.addClass("arrow-right-Press");
				setTimeout(function () { rightButton.removeClass("arrow-right-Press"); }, 100)
			}
		};

		function dynamicBack() {
			if ($("#pagingButton").length) $("#pagingButton").hide();   //隐藏翻页按钮
			reset();
			showView = false;   //当前表格被隐藏后,就阻断所有后续的函数执行;
			safeApply(function () { });
			tool.layout("ShowDynamicData", 0);
			win.moduleEntry.showOperationMenu();
		}

		function reset() {
			//退出之后，把全选框隐藏，避免出现幽灵框体。（ 【华为】 手机），**记得在重新进入之后显示
			hideCheckBox();

			if ($scope.state == State.working) $scope.state = State.idle;

			//现在不需要缓存;点击返回就清空支持项
			if ($scope.calculateSupportList)$scope.calculateSupportList.length = 0;

			//清空当前组的界面信息;
			if ($scope.DynamicWebView)$scope.DynamicWebView.length = 0;

			//清空原始数据值
			if ($scope.pakidList)$scope.pakidList.length = 0;

			//清空分组名字集合；
			if ($scope.groupNameList)$scope.groupNameList.length = 0;

			//清空分组的缓存；
			$scope.cacheOfCurrentGroup_obj = {};

			//每次点击返回，都要清空pid缓存
			cachePidPackForRequestServer.length = 0;

			//每次退出前置空，防止再次进入时，layoutTable函数无法获取到正确的groupNav高度
			$scope.currentGroupName = "";

			//动态数据默认每一页数据量为7；
			win.global.DataStream_CurPageLinesCount = 7;

			//tool.processBar("");

			//全选按钮
			$scope.isCheck = false;
			$scope.isCheckAll = false;

			//取消数据流远程标识
			global.RMTInfo.dataStream = false;
		}

	}])


		//翻页插件
		.factory("pagingManager", function () {
			         var $ = angular.element;

			         return {
				         /**计算每页的数据最大显示数*/
				         countRowInScrollTable: function (boxid, $) {
					         var scrollBody = $("#" + boxid + " .scroll-table-body");
					         var head = scrollBody.find("thead");
					         var bodyTr = scrollBody.find("tr.ng-scope");
					         var len = Math.floor((scrollBody.height() - head.height()) / bodyTr.height()) || 0;

					         //如果计算出现问题，保持默认一页7行
					         return len ? len : 7;
				         },

				         /**处理翻页后的数据计算
				          **/
				         handlePaging: function (dataArr) {

					         //计算每页显示的最大行数，用于分页，控制机通过SetRMTCountRowInScrollTable在远程端获取！
					         if (global.RMTInfo.ID != 2) {
						         var rowsInEachPage = this.countRowInScrollTable("ShowDynamicData", $);
						         win.serverRequestCallback.SetRMTCountRowInScrollTable(rowsInEachPage, dataArr);
					         }

				         }

			         }

		         });

	//支持项
	var Support = function (object) {

		object = object || {};

		this.index = object.index;
		this.appid = object.appid;
		this.type = object.type;
		this.group = object.group;
		this.name = object.name;
		this.danwei = object.danwei;
		this.supid = object.supid;
		this.pid = object.pid;
		this.pakid = object.pakid;
		this.diagid = object.diagid;
		this.pakpos = object.pakpos;
		this.fomula = object.fomula;
		this.fomulaname = object.fomulaname;
		//this.updatetime = 0;//更新时间
		this.ans = "";
		this.check = false;//是否选中
		this.show = true;//是否显示
	};

	var PakId = function (object) {

		object = object || {};
		this.index = object.index;
		this.pid = object.pid;
		this.group = object.group;
		this.pakid = object.pakid;
		this.pakpos = object.pakpos;
		this.supid = object.supid;
	};
})();


/**
 * Created by Andy on 2016/9/21.
 */
(function (win) {

	win.App.controller("ComponentTestCtrl", ["angularFactory", "$scope", function (angularFactory, $scope) {
		var safeApply = angularFactory.getScope($scope).safeApply;

		$scope.groupNameList = [];            //分组名字数组
		$scope.Components = [];               //单元数据列表
		$scope.curGroupName = "请选择";        //当前分组名字，默认为 “请选择”
		$scope.danwei = "请选择";              //弹框描述文本，值是服务器数据“danwei”,所以取名danwei
		$scope.isErr = "";                    //radio为空，或者value为空的时候给出提示
		$scope.popBoxType = {"value": false, checked: false};      //判断弹框类型
		$scope.execButtonSate = "idle";       //测试按钮状态，working | idle
		$scope.execText = "测试";             //测试按钮文本

		var groupItemsStorage = {};           //分组数据缓存，方便在切换分组后，不用再请求服务器
		var gRequestType = "";                //请求服务器数据的时候共用一个数据请求的本地出口，以此区分 回调函数
		var serviceSupportList = win.YhSupportService;          //判断和设备交互指令的支持项
		var gLoop = null;                     //循环和设备进行指令交互，停止 的机制由 $scope.execButtonSate 的值决定

		//单元测试入口
		win.moduleEntry.componentTest = function () {
			//显示数据列表；
			tool.layout("componentTest", 1);
			//绑定底部按钮；
			BindsBottomBtn();
			//检查分组状态；
			getGroup();
		};

		//绑定按钮功能
		function BindsBottomBtn() {
			win.tool.bottomBtn({
				btn1Text: '返回',
				btn1Callback: function () { fnBack(); }
			})
		}

		$scope.$watch("execButtonSate", function () {
			if ($scope.execButtonSate === "working")
				$scope.execText = "测试中...";
			else
				$scope.execText = "测试";

			safeApply(function () {})
		});


		/**
		 DataType    {
			"key": "ORGAN_TEST",
	        "cartype": "maybach"
		}
		 DataPack    {
            "dbfilename": "pub.txt",
            "pub": "pub0001.txt",
            "ecupids": "0000000100000002",
            "groupName": "group-name"
		}
		 * */
		function packingDataPack(ecupids, groupName) {
			return {
				"dbfilename": win.global.businessInfo.dbFilename,
				"pub": win.global.businessInfo.pubFilename,
				"ecupids": ecupids,
				"groupName": groupName
			}
		}

		function getGroup() {
			//检查分组状态
			gRequestType = "ORGAN_GROUP";
			requestData(packingDataPack("", ""), gRequestType);

		}

		//本单元统一请求数据 接口，注意区分业务需求
		function requestData(dataPack, requestType) {
			win.tool.loading({text: "读取数据..."});
			win.server.request(
				global.businessInfo.serverType,
				{key: "ORGAN_TEST", cartype: global.businessInfo.carType},
				dataPack,
				win.server.addCallbackParam(win.serverRequestCallback[requestType], [dataPack,gRequestType]),
			    [requestData,fnBack]
			);
		}

		win.serverRequestCallback.ORGAN_GROUP = function (response, params) {
			win.tool.loading(0);
			//if (!status.ok) {
			//	tool.alert(
			//		["服务器响请求超时", "重试", "取消"],
			//		function () { requestData(params, gRequestType) },
			//		function () { fnBack() }
			//	);
			//}
			if (response.items.length && response.items[0].groupitems.length && response.items[0].groupitems[0].group) {
				response.items.forEach(function (item, index) {
					$scope.groupNameList.push(item.groupName);
				});
			}
			else {
				$scope.curGroupName = "无分组列表";
				getComponents();
			}
			safeApply(function () {});
		};

		//创建下拉列表
		$scope.createDropDownList = function () {
			if ($scope.curGroupName === "无分组列表") return;
			win.RMTClickEvent.CreateComponentTestDropDownList();
		};

		//同步远程端点击功能
		win.RMTClickEvent.CreateComponentTestDropDownList = function () {

			tool.dropDownList({
				dataList: $scope.groupNameList,
				showProp: "",
				btnCallback: ComponentTestChangeGroupItem
			})
		};

		//选择分组事件
		function ComponentTestChangeGroupItem(item, index) {
			if ($scope.curGroupName === item)
				$scope.Components = groupItemsStorage[$scope.curGroupName];
			else {
				$scope.curGroupName = item;
				getComponents();
			}
			safeApply(function () {
				tool.layoutTable();
			});
		}

		function getComponents() {
			gRequestType = "ORGAN_COMPONENTS";

			if (serviceSupportList._0x0F.value)
			//当 31090F 被支持时
			// 发送该指令获取当前哪些版本信息被支持，
			// 将返回的动态数据信息索引号，用匹配算法计算计算 系统ECU表 内的 TYPE 字段为 5 的记录 的 SUPID 字段和返回数据是否匹配，
			// ****（此操作由服务器完成，JS端只需要将获取到的pid发送给服务器，然后将返回的数据遍历 绑定就可以）；
				win.sendDataToDev("31090F");
			else
			//当 31090F 不被支持时
			//将本数据表内 <TYPE> 字段为 5 的记录 <GRUOP> 字段无重复的提取出来，作为分组显示在分组菜单内
			// ****（此操作由服务器完成，JS端只需要将返回的数据遍历 绑定就可以）；
				requestData(packingDataPack("", $scope.curGroupName), gRequestType);

		}

		win.devInterActive.Fun71090F = function (recvData) {
			//检查分组状态
			var curGroupName = ($scope.curGroupName === "无分组列表" || !$scope.curGroupName || $scope.curGroupName === "请选择") ? "" : $scope.curGroupName;

			requestData(packingDataPack(recvData.substr(10), curGroupName), gRequestType);
		};

		win.devInterActive.Fun71098F = function (recvData) {
			tool.alert("设备未支持当前项", function () {});
		};

		win.serverRequestCallback.ORGAN_COMPONENTS = function (response, params) {
			win.tool.loading(0);
			if (!response.items.length) {
				tool.alert(
					"服务器无任何数据!",
					function () { fnBack() }
				);
				return;
			}
			//if (response.items.length && response.items[0].groupitems.length) {

				response.items[0].groupitems.forEach(function (item, index) {
					item.state = "未知状态";
					item.itemIndex = index;
				});
				groupItemsStorage[$scope.curGroupName] = $scope.Components = response.items[0].groupitems;

			//}
			//else {
			//	tool.alert("服务器暂无数据支持", function () {
			//		fnBack()
			//	});
			//}
			safeApply(function () {});


		};

		var gCurPID = "";
		var gFOMULA_INT = "";
		var gCurIndex = 0;
		$scope.rawClick = function (item, index) {
			var danwei = item.danwei;
			var pid = item.pid;
			var fomula = item.fomula;
			var diagid = item.diagid;
			var fomulaname = item.fomulaname;
			win.RMTClickEvent.ComponentsRawClick(danwei, pid, diagid, fomulaname, fomula, index);
		};


		// 切割出fomulaname的指令，用户点击后发送给设备
		// 并添加fomula的值，需要判断是否要隐藏“退出”的开关类型，1，2，3，4都不需要隐藏
		// 判断语句已经写在html模板ngHide里面
		function queryCMDByStep(sources, fomula) {
			var i = 0;
			var step = 1;
			var result = [];
			var len = sources.length;

			if (len === 1) {
				result.push({"name": sources[0], "cmd": sources[0], "fomula": fomula});
			}
			else {
				while ((i * step + i) < len) {
					result.push({
						"name": sources[i * step + i].trim(),
						"cmd": sources[i * step + ++i].trim(),
						"checked": false,
						"fomula": fomula
					});
				}
			}
			return result;
		}

		win.RMTClickEvent.ComponentsRawClick = function (danwei, pid, diagid, fomulaname, fomula, index) {
			$scope.popBoxType.value = false;
			$scope.popBoxType.checked = false;

			//开关型fomulaname的值："关闭;052F17E107000000;打开;052F17E107010000;退出;042F17E100000000;"
			//开关型fomulaname的值："执行;052F17E107010000;"
			//测试值fomulaname的值："052F17E107000000;"
			$scope.fomulaname_Ary = queryCMDByStep(fomulaname.substr(0, fomulaname.length - 1).split(";"), fomula); //先干掉最后一个“;”,然后拼成数组的形式

			var confirm = $("#exeComponentTest");
			var quit = $("#quitComponentTest");

			gCurIndex = parseInt(index);
			gFOMULA_INT = parseInt(fomula);
			gCurPID = pid;

			//由于ng-bind和ng-bind-html无法解决 【\r\n】转义符换行问题，所以使用ng-repeat代替
			if (/\\r\\n/ig.test(danwei))danwei = danwei.replace(/\\r\\n/ig, "\\n");
			if (/\\n\\r/ig.test(danwei))danwei = danwei.replace(/\\n\\r/ig, "\\n");
			if (/\\r/ig.test(danwei))danwei = danwei.replace(/\\r/ig, "\\n");

			$scope.danwei = danwei ? danwei.split("\\n") : ["请选择"];

			//<FOMULA> = 1或3或5或6时为开关型， <FOMULA> = 2或4时为值测试型
			//开关型 直接显示弹框
			//测试型 先从设备获取当前值
			switch (gFOMULA_INT) {
				case 1:
				case 3:
				case 5:
				case 6:
					$scope.popBoxType.checked = true;
					confirm.off().on("click", function () {
						win.RMTClickEvent.exeComponentTest(gCurPID, diagid, $scope.fomulaname_Ary);
					});

					quit.off().on("click", function () {
						win.RMTClickEvent.quitComponentTest($scope.fomulaname_Ary);
					});
					tool.popShow("componentTestPopBox", 1);
					safeApply(function () {});
					break;
				case 2:
				case 4:
					$scope.popBoxType.value = true;
					win.sendDataToDev("31092A" + gCurPID);
					break;
			}

		};

		$scope.ComponentTestPopBoxRMTCheckedHandle = function (index) {
			win.RMTClickEvent.ComponentTestPopBoxRMTCheckedHandle(index);
		};

		win.RMTClickEvent.ComponentTestPopBoxRMTCheckedHandle = function (index) {
			var index_int = parseFloat(index);
			$scope.fomulaname_Ary.forEach(function (item) {
				item.checked = false;
			});
			$scope.fomulaname_Ary[index_int].checked = true;
			safeApply(function () {});
		};

		//获取输入框的初始值
		win.devInterActive.Fun71092A = function (recvData) {
			handlePopBoxValueType(tool.decodeASC(recvData.substr(10), 16));
		};

		win.devInterActive.Fun7109CA = function () {
			handlePopBoxValueType();
		};

		//处理输入框类型弹框的内容
		function handlePopBoxValueType(curValue) {
			$scope.input_value = curValue || "";
			var confirm = $("#exeComponentTest");
			var quit = $("#quitComponentTest");

			confirm.off().on("click", function () {
				win.RMTClickEvent.exeComponentTest(gCurPID, "", $scope.fomulaname_Ary);
			});

			quit.off().on("click", function () {
				win.RMTClickEvent.quitComponentTest($scope.fomulaname_Ary);
			});

			tool.popShow("componentTestPopBox", 1);

			safeApply(function () {});
		}

		$scope.$watchCollection("popBoxType", function () {
			console.log("now the popType:", $scope.popBoxType);
		});

		/**
		 * @param gCurPID
		 * @param diagid
		 * @param fomulaname_Ary
		 *
		 * 传入当前弹出框的 数据，其中 fomulaname_Ary 需要动态检测 开关选项（因为类型 3，4，6需要循环发送fomulaname值）
		 * */
		win.RMTClickEvent.exeComponentTest = function (gCurPID, diagid, fomulaname_Ary) {
			var fomulaname_checked_item =       //获取被选中对象的cmd值和name值
				(function () {
					var curChecked = {};

					//如果弹框类型为输入框，fomulaname_Ary长度只有1，且不会出现选项类型
					if (gFOMULA_INT == "2" || gFOMULA_INT == "4") {
						curChecked = {cmd: fomulaname_Ary[0].cmd, name: fomulaname_Ary[0].name};
					}
					else {
						fomulaname_Ary.forEach(function (item) {
							if (item.checked)
								return curChecked = {cmd: item.cmd, name: item.name};
						});
					}
					return curChecked;
				})();

			//$scope.input_value双向绑定失效，暂时使用jquery ID获取元素值
			var input_value = $("#input_value").val();

			//弹出的是开关类型，且获取不到当前选项
			if (_.isEmpty(fomulaname_checked_item) && $scope.popBoxType.checked) {
				$scope.isErr = "请选择一个选项再进行测试";
				safeApply(function () {});
				return;
			}

			//弹出的是输入类型，且获取不到当前输入值
			if (!input_value && $scope.popBoxType.value) {
				$scope.isErr = "请设置一个范围数值";
				safeApply(function () {});
				return;
			}

			//添加gLoop判断可以让下面的表达式在循环调用当前函数时，只执行一次；
			if (!gLoop) {
				var thisPopBox = $("#componentTestPopBox");
				thisPopBox.css({"opacity": 0.7});
			}

			$scope.execButtonSate = "working";
			$scope.isErr = "";
			var fomulaname_checked_item_cmd = fomulaname_checked_item.cmd ? fomulaname_checked_item.cmd : "";
			var fomulaname_value_asc = tool.toAsc(input_value ? input_value : "", 16);
			var totalLen = fomulaname_value_asc.length / 2 + fomulaname_checked_item_cmd.length / 2 + 1;

			switch (gFOMULA_INT) {
				//开关型========================>：
				//用户点击执行，则根据<FOMULA>类型调用服务，<FOMULA> = 1或者3调用 310916，<FOMULA> = 5或者6调用 310929 。根据<FOMULA>类型执行窗口动作：
				//(①当<FOMULA> = 3或者6时窗口不消失，执行动作不可点击，可以退出，上位机每隔500ms调用310916或者310929，视<FOMULA>类型而定，直到用户点击退出，
				//然后调用 310922 结束本元件测试。如测试过程中返回失败，则显示
				//测试型========================>：
				//调用310910，根据<FOMULA>类型执行窗口动作：
				//①当<FOMULA> = 4时窗口不消失，执行动作不可点击，可以退出，上位机每隔500ms调用310910，视<FOMULA>类型而定，直到用户点击退出
				//然后调用 310922 结束本元件测试。如测试过程中返回失败，则显示
				case 1:
				{
					$scope.popBoxType.checked = true;
					win.sendDataToDev("310916" + gCurPID + fomulaname_checked_item_cmd);
					break;
				}
				case 2:
				{
					$scope.popBoxType.value = true;
					win.sendDataToDev("310910" + gCurPID + totalLen + fomulaname_value_asc + "20" + fomulaname_checked_item_cmd);
					break;
				}
				case 3:
				{
					gLoop = setTimeout(function () {
						if ($scope.execButtonSate == "idle") {
							clearTimeout(gLoop);
							gLoop = null;
							return
						}
						win.sendDataToDev("310916" + gCurPID + fomulaname_checked_item_cmd);
						win.RMTClickEvent.exeComponentTest(gCurPID, diagid, fomulaname_Ary);
					}, 500);
					break;
				}
				case 4:
				{
					gLoop = setTimeout(function () {
						if ($scope.execButtonSate == "idle") {
							clearTimeout(gLoop);
							gLoop = null;
							return
						}
						win.sendDataToDev("310910" + gCurPID + totalLen + fomulaname_value_asc + "20" + fomulaname_checked_item_cmd);
						win.RMTClickEvent.exeComponentTest(gCurPID, diagid, fomulaname_Ary);
					}, 500);
					break;
				}
				case 5:
				{
					$scope.popBoxType.checked = true;
					win.sendDataToDev("310929" + gCurPID + diagid + tool.toHex(fomulaname_checked_item_cmd.length / 2, 4) + fomulaname_checked_item_cmd);
					break;
				}
				case 6:
				{
					gLoop = setTimeout(function () {
						if ($scope.execButtonSate == "idle") {
							clearTimeout(gLoop);
							gLoop = null;
							return
						}
						win.sendDataToDev("310929" + gCurPID + diagid + tool.toHex(fomulaname_checked_item_cmd.length / 2, 4) + fomulaname_checked_item_cmd);
						win.RMTClickEvent.exeComponentTest(gCurPID, diagid, fomulaname_Ary);
					}, 500);
					break;
				}
			}

			safeApply(function () {});
		};

		//添加弹框的半透明属性
		var thisPopBox = $("#componentTestPopBox");
		var timer = null;
		thisPopBox.on({
			"touchstart": function () {
				clearTimeout(timer);
				thisPopBox.css({"opacity": 1});
			},
			"touchend": function () {
				if ($scope.execButtonSate == "working") {
					timer = setTimeout(function () {thisPopBox.animate({"opacity": 0.7}, 300);}, 500)
				}
			}
		});

		//退出的时候,如果类型是5或者6，获取fomulaname最后一个的CMD值，发送给Dev；（一般为退出值）
		win.RMTClickEvent.quitComponentTest = function (fomulaname_Ary) {
			var leastParam = fomulaname_Ary ? fomulaname_Ary[fomulaname_Ary.length - 1].cmd : "00000000";
			var leastParamLen = tool.toHex(leastParam.length / 2, 2);
			tool.popShow("componentTestPopBox", 0);

			//退出弹框的时候重置所有属性
			$("#input_value").val("");
			$scope.execButtonSate = "idle";
			$scope.isErr = "";
			var thisPopBox = $("#componentTestPopBox");
			thisPopBox.css({"opacity": 1});

			var loopStateWatcher = setInterval(function () {
				if (!gLoop) {
					switch (gFOMULA_INT) {
						case 1:
						case 2:
						case 3:
						case 4:
						{
							win.sendDataToDev("310922" + gCurPID);
							break;
						}
						case 5:
						case 6:
						{
							win.sendDataToDev("310922" + gCurPID + leastParamLen + leastParam);
							break;
						}
					}
					clearInterval(loopStateWatcher);
				}
			}, 100);
		};

		//绑定 开关选项 状态值
		function bindSate(state) {

			//gCurIndex 点击数据列表时获取的下标
			$scope.Components[gCurIndex].state =
				(function () {
					var name = "";

					//有value值，首先返回value值
					if ($scope.popBoxType.value) {
						name = state ? state : $("#input_value").val();
					}
					else {
						$scope.fomulaname_Ary
							.forEach(function (item) {
								         if (item.checked)
									         return name = state ? state : item.name
							         });
					}
					return name;
				})();

			//如果是失败指令，只有1，2，5类型才给出提示
			switch (gFOMULA_INT) {
				case 1:
				case 2:
				case 5:

					setTimeout(function () {
						safeApply(function () {
							$scope.execButtonSate = "idle";
							$scope.isErr = "";
							$("#componentTestPopBox").css({"opacity": 1});
						});
					}, 500);

					if (state)tool.alert("元件测试失败！", function () {});
					break;
				case 3:
				case 4:
				case 6:

					break;
			}

		}

		win.devInterActive.Fun710922 = function (recvData) {
			//退出之后无需任何动作
		};

		win.devInterActive.Fun7109C2 = function (recvData) {
			tool.alert("退出元件测试失败！", function () {});
		};

		win.devInterActive.Fun710910 = function (recvData) {

			bindSate();
		};

		win.devInterActive.Fun710990 = function (recvData) {

			bindSate("元件测试失败！");
		};

		win.devInterActive.Fun710929 = function (recvData) {

			bindSate();
		};

		win.devInterActive.Fun7109C9 = function (recvData) {


			bindSate("元件测试失败！");
		};

		win.devInterActive.Fun710916 = function (recvData) {
			bindSate();
		};

		win.devInterActive.Fun710996 = function (recvData) {

			bindSate("元件测试失败！");
		};


		//返回按钮事件
		function fnBack() {
			reset();
			win.moduleEntry.backToMenu("componentTest");
		}

		//重置本页数据
		function reset() {
			$scope.groupNameList.length = 0;
			$scope.Components.length = 0;
			$scope.curGroupName = "请选择";
			$scope.popBoxType.value = false;
			$scope.popBoxType.checked = false;
			$scope.execButtonSate = "idle";
			$scope.execText = "执行";

			groupItemsStorage = {};
			safeApply(function () {})
		}
	}]);
})(window);

/**
 * Created by Andy on 2016/11/3.
 */
(function () {
	var win = window;
	var showView = false;
	App.controller('carConfigCtrl', ['$scope', 'angularFactory', '$element', function ($scope, angularFactory, $element) {
		var safeApply = angularFactory.getScope($scope).safeApply;

		$scope.pagesOptionChosenRecord = [];
		$scope.pagesData = [];
		$scope.pagesDataIndex = 0;
		$scope.carConfigNodeaddress = '';
		$scope.varmkey = '';                                                //使用局部mkey,方便执行清零操作

		var thisBox = $element;
		var thisBoxId = $element.attr("id");

		win.moduleEntry.carConfig = function (address,prevFormId) {               //入口
			reset();
			win.sendDataToDev('310971' + address);
			tool.loading({text: "正在与车辆建立连接..."});
		};

		win.devInterActive.Fun710971 = function (varRecvData) {
			showView = true;
			document.getElementById("Title").innerText = "配置列表";
			//tool.processBar('连接完毕');
			bindBottomBtn();

			//如果没有参数传入，就证明是从其他页面点击 返回 跳到此页面
			if (varRecvData == -1) {
				$scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);
				$scope.pagesDataIndex--;

				safeApply(function () {
					//重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
					setTimeout(function () {tool.layout(thisBoxId, 1);}, 45);
				});
			}
			else {
				win.global.businessInfo.mkey = $scope.varmkey = tool.hex2a(varRecvData.substr(win.getIndexByDevIndex(10)));
				if ($scope.pagesOptionChosenRecord.length <= 0) requestData();
			}

		};


		win.devInterActive.Fun7109F1 = function (varRecvData) {
			//tool.processBar('车辆连接失败！');
			tool.alert('尝试与车辆连接失败！<br>请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。',
			           function () { Fun7109F1Cancel() }
			);

		};


		/**
		 * 下拉列表的回调函数,用于承接远程函数
		 * @item   回调参数；
		 * */
		$scope.handleSelect = function (pageDataIndex, item) {
			win.RMTClickEvent.carConfigHandleSelect(pageDataIndex, item);
		};

		win.RMTClickEvent.carConfigHandleSelect = function (curClickPageIndex, item) {
			//每次翻页都把滚动条置顶
			thisBox.find(".scroll-table-body").scrollTop(0);

			var curClickPageIndex_int = parseFloat(curClickPageIndex);

			//点击之后马上加1，因为如果选择的项目重复，可能不去请求服务器
			$scope.pagesDataIndex = curClickPageIndex_int + 1;

			var recordIndex = $scope.pagesOptionChosenRecord.length;

			//如果选了不重复的项目，则删除 当前下标之后的 选项记录【$scope.pagesOptionChosenRecord】 和页面数据【$scope.pagesData】，通过监视器把 选项记录
			//发到服务器

			//第一种情况：如果重新选择车型，当前页面的下标 小于 选项记录的长度
			if ($scope.pagesDataIndex < recordIndex) {

				//选择了不同项，重新修改选项记录；
				if (item.name !== $scope.pagesOptionChosenRecord[$scope.pagesDataIndex - 1]) {

					$scope.pagesOptionChosenRecord.splice($scope.pagesDataIndex - 1);       //record下标和pages下标有1的差别，需要同步显示的情况下，引用pages的下标的时候必须
				                                                                            // -1；
					$scope.pagesData.splice($scope.pagesDataIndex);                         //record下标和pages下标有1的差别，需要同步显示的情况下，引用record的下标的时候必须
				                                                                            // +1；
					global.rootCache.carConfig[$scope.pagesOptionChosenRecord.length] = item.name;
					$scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
					win.global.DTCLog.systemName = item.name;
					//选择了相同项，直接修改show属性；
				}
				else showPageDataFromClientChoosen($scope.pagesDataIndex);

			}

			//第二种情况：如果重新选择车型，选到了 选项记录的最后一项
			else if ($scope.pagesDataIndex === recordIndex) {

				//选了不同项，直接修改 选项记录；
				if (item.name !== $scope.pagesOptionChosenRecord[recordIndex - 1]) {
					$scope.pagesOptionChosenRecord[recordIndex - 1] = item.name;
				}
				//选择了相同项，直接修改 show属性；
				else {
					showPageDataFromClientChoosen($scope.pagesDataIndex);
				}

			}

			//第三种情况：正常选择，正常添加记录长度，监听器会做后续工作
			else {
				global.rootCache.carConfig[$scope.pagesOptionChosenRecord.length] = item.name;                      //缓存车型选择信息到车辆信息页面
				$scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;          //手动更改parents的值，让$watchCollection监听器生效
				win.global.DTCLog.systemName = item.name;
			}

			safeApply(function () {
				//重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
				setTimeout(function () {tool.layoutTable();}, 45);
			});

		};

		/**
		 * 页面的显示隐藏处理
		 * 方法为--先全部隐藏，然后显示当前需要显示的
		 * */
		function showPageDataFromClientChoosen(pagesDataIndex) {
			//先隐藏所有；
			var j = $scope.pagesData.length;
			while (j--) {
				var k = $scope.pagesData[j].length;
				while (k--) $scope.pagesData[j][k].show = false;
			}

			//再显示当前；
			var n = $scope.pagesData[pagesDataIndex].length;
			while (n--) $scope.pagesData[pagesDataIndex][n].show = true;
		}

		/**
		 * 返回按钮点击事件,分为【上一级】和【退出诊断】两个功能，根据当前页面的Index进行判断
		 * */
		function backToPrvLevel() {

			if ($scope.pagesDataIndex <= 0) {
				moduleExit();
			}
			else {
				win.RMTClickEvent.CarConfigNavSelection({btn: --$scope.pagesDataIndex});
			}

			safeApply(function () {})
		}

		/**
		 * 动态刷新按钮文本
		 * */
		function checkBtnTextBasisCurIndex() {
			return $scope.pagesDataIndex > 0 ? "上一级" : "返回";
		}

		/**
		 * 监听$scope.pagesOptionChosenRecord ， 并计算是否存在 nodeaddress
		 *
		 * */
		$scope.$watchCollection('pagesOptionChosenRecord', function () {

			$scope.carConfigNodeaddress = "";

			//监听器的执行先于其他代码，所以在此堵截，防止报错
			if (!$scope.pagesOptionChosenRecord[0] || "" == $scope.pagesOptionChosenRecord[0]) {
				//tool.processBar('');
				return;
			}

			var curRecordIndex = $scope.pagesOptionChosenRecord.length - 1;

			var itemsSize = $scope.pagesData[curRecordIndex].length;
			if (itemsSize > 0) {
				for (var i = 0; i < itemsSize; i++) {
					var item = $scope.pagesData[curRecordIndex][i];
					if (item.name == $scope.pagesOptionChosenRecord[curRecordIndex] && item['N']) {
						$scope.carConfigNodeaddress = item['N']['nodeaddress'].replace(/\./g, "");
						win.global.businessInfo.dbFilenamePrev = item['N']['dbfilename'];
						win.global.businessInfo.pubFilename = item['N']['publicfilename'];
						safeApply(function () {
							//tool.processBar("车辆配置信息获取成功");
						});
						outputConfirm();
						return;
					}
				}
			}

			requestData();

		});

		$scope.navSelection = function (recordIndex) {
			win.RMTClickEvent.CarConfigNavSelection({nav: recordIndex});
		};

		//有两种形式的参数：obj.record 和 obj.pagesDataIndex；分别代表 nav点击 和 底部按钮点击传入的参数
		win.RMTClickEvent.CarConfigNavSelection = function (obj) {

			//区别从 点击 【导航】 返回 和 点击【上一级】按钮返回
			if (obj.hasOwnProperty("nav")) {
				var record_int = parseFloat(obj.nav);
				$scope.pagesDataIndex = record_int + 1;
				showPageDataFromClientChoosen(record_int + 1);          //record下标和pages下标有1的差别，需要同步显示的情况下，引用record的下标的时候必须+1；
			}
			else {
				showPageDataFromClientChoosen(parseFloat(obj.btn));
			}
			checkBtnTextBasisCurIndex();
		};


		function requestData() {
			if (showView)tool.loading({pos: "body", text: '获取数据...'});
			//根据服务器返回的情况, 执行回调
			getItemsByParents(
				$scope.pagesOptionChosenRecord,
				win.server.addCallbackParam(win.serverRequestCallback.CTYPE_CONFIG_pro, [$scope.pagesOptionChosenRecord]),
				[requestData, backToPrvLevel]
			);
		}

		//打包dataPack请求服务器
		function getItemsByParents(pagesOptionChosenRecord, callback, handleBackRequest) {
			var DataPack = {
				mkey: $scope.varmkey,
				parents: pagesOptionChosenRecord  //服务器解析名为 parents；
			};
			win.server.request(global.businessInfo.serverType, {
				key: "CTYPE",
				cartype: global.businessInfo.carType
			}, DataPack, callback, handleBackRequest);
		}


		win.serverRequestCallback.CTYPE_CONFIG_pro = function (responseObject, params) {
			if (!showView)return;
			//if (!status.ok) {
			//	safeApply(function () {
			//		$scope.pagesOptionChosenRecord.length = 0;
			//		$scope.pagesData.length = 0;
			//	});
			//
			//	tool.alert(['服务器请求超时，请点击重试', '重试', '取消'],
			//		function () { requestData(); },
			//		function () {
			//			backToPrvLevel();
			//			//tool.processBar("");
			//		}
			//	);
			//}
			//else if (!responseObject || responseObject.items.length <= 0) {
			//	tool.alert('无任何配置信息',
			//	           function () {
			//		           backToPrvLevel();
			//		           //tool.processBar("");
			//	           }
			//	);
			//}
			//else {
			if(!responseObject.items.length){
				tool.alert('服务器无任何数据',
				           function () {
					           //tool.processBar("");
					           backToPrvLevel();
				           }
				);
				return;
			}


			//防止多个选择框，选择后面一个没有响应时，又选择了前面一个时，数据错误问题
			if (params.join('') != $scope.pagesOptionChosenRecord.join(''))return;

			//正常点击到下一页时，可固定为隐藏前一页的数据，添加下一页的数据时会初始化show为true;
			if ($scope.pagesOptionChosenRecord.length) {
				var k = $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1].length;
				while (k--) $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1][k].show = false;
			}

			//添加下一页的数据时会初始化show为true;
			var items = responseObject.items;
			var i = items.length;
			while (i--) items[i].show = true;

			safeApply(function () {
				$scope.pagesData[$scope.pagesDataIndex] = responseObject.items;
			});

			//tool.processBar("请选择");
			tool.loading(0);
			//}
			tool.layout('carType', 0);
			tool.layout('CarConfig', 1);
		};

		function bindBottomBtn() {
			tool.bottomBtn(
				{
					btn1Text: function () { return checkBtnTextBasisCurIndex(); },
					btn1Callback: function () { backToPrvLevel(); }
				}
			);
		}

		//连接失败，退出到 车型选择界面
		function Fun7109F1Cancel() {
			win.sendDataToDev("310902");	//真正退出要从车型选择菜单退
			win.moduleEntry.carLogo("back");
		}

		//带上address跳转到模式1;
		function outputConfirm() {
			tool.layout('CarConfig', 0);
			win.global.businessInfo.operationMenuCache = [$scope.carConfigNodeaddress, "carConfig"];

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
			tool.layout(thisBoxId, 0);
		}

		//用户点击 退到车型选择菜单
		function moduleExit() {
			win.moduleEntry.carLogo(-1);
			tool.layout('CarConfig', 0);
			showView = false;
			reset();
		}

		function reset() {
			safeApply(function () {
				$scope.pagesOptionChosenRecord.length = 0;
				$scope.carConfigNodeaddress = '';       //清零行为可以防止下次进入时,开始按钮提前激活
				$scope.pagesData.length = 0;
				$scope.pagesDataIndex = 0;
			});
		}

	}]);

})();
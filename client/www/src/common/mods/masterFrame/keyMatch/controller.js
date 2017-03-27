/**
 * Created by Andy on 2016/11/3.
 */
(function () {
	var win = window;
	var showView = false;
	App.controller('keyMatchController', ['$scope', 'angularFactory', '$element', function ($scope, angularFactory, $element) {
		var safeApply = angularFactory.getScope($scope).safeApply;
		$scope.pagesOptionChosenRecord = [];        //用于存储选择项,并发送给服务器
		$scope.pagesData = [];                      //用于刷新显示内容
		$scope.pagesDataIndex = 0;                  //每次点击导航条或者获取新数据时记录；

		$scope.publicFileName = '';
		$scope.dbFilename = '';
		$scope.helpPopData = [];
		//如果需要使用id（jquery），就直接从这里获取
		var thisBox = $element;
		var thisBoxId = $element.attr("id");

		//入口
		win.moduleEntry.keyMatch = function () {
			showView = true;
			document.getElementById("Title").innerText = "配钥匙";
			bindBottomBtn();

			//isBack代表从车辆配置或者系统菜单返回；
			if (arguments[0] === -1) {
				$scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);

				//只使用一次，pagesOptionChosenRecord只要变化，$scope.isBack就会置为假
				$scope.isBack = true;

				//如果在其他界面返回此界面的时候，页面记录为空，在监听器里面会被拦截一次，
				//isBack不能在第一时间重置为false,会造成第一次点击事件无效的BUG！
				if ($scope.pagesDataIndex-- == 1) $scope.isBack = false;
				//tool.processBar("获取车型系统成功");

			}
			else {    //否则就是重新诊断
				$scope.isBack = false;
				reset();
				requestData($scope.pagesOptionChosenRecord);
			}

			safeApply(function () {
				//重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
				setTimeout(function () {tool.layout(thisBoxId, 1);}, 45)
			});
		};

		/**
		 * 下拉列表的回调函数,用于承接远程函数
		 * @item   回调参数；
		 * */
		$scope.handleSelect = function (parentIndex, item) {
			win.RMTClickEvent.keyMatchHandleSelect(parentIndex, item);
		};

		/**
		 * 正常选择事件
		 * @param curClickPageIndex
		 * @param item
		 * */
		win.RMTClickEvent.keyMatchHandleSelect = function (curClickPageIndex, item) {
			//如果获取到的nodeAddress的首位为0001，就是请求帮助菜单
			if (item["N"] && item["N"]["nodeaddress"].indexOf("0001") === 0) {
				//请求模式1的帮助菜单
				helpInfoRequest(1, item["N"]["dbfilename"], item["N"]["publicfilename"]);
			}
			else {
				handlePageTurning(curClickPageIndex, item);
			}
		};

		function handlePageTurning(curClickPageIndex, item) {
			//每次翻页，都把滚动条置顶
			thisBox.find(".scroll-table-body").scrollTop(0);

			//远程进入函数，所有数字都转换成了字串
			var curClickPageIndex_int = parseFloat(curClickPageIndex);

			//点击之后马上加1，因为如果选择的项目重复，可能不去请求服务器
			$scope.pagesDataIndex = curClickPageIndex_int + 1;

			var recordIndex = $scope.pagesOptionChosenRecord.length;

			//如果选了不重复的项目，则删除 当前下标之后的 选项记录【$scope.pagesOptionChosenRecord】 和页面数据【$scope.pagesData】，通过监视器把 选项记录 发到服务器

			//第一种情况：如果重新选择车型，当前页面的下标 小于 选项记录的长度
			if ($scope.pagesDataIndex < recordIndex) {

				//选择了不同项，重新修改选项记录；
				if (item.name !== $scope.pagesOptionChosenRecord[$scope.pagesDataIndex - 1]) {

					//record下标和pages下标有1的差别，需要同步显示的情况下，引用pages的下标的时候必须 -1；
					//record下标和pages下标有1的差别，需要同步显示的情况下，引用record的下标的时候必须 +1；
					$scope.pagesOptionChosenRecord.splice($scope.pagesDataIndex - 1);
					$scope.pagesData.splice($scope.pagesDataIndex);

					//global.rootCache.carType[$scope.pagesOptionChosenRecord.length] = item.name;
					$scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
					win.global.DTCLog.systemName = item.name;

				}
				else {   //选择了相同项，直接修改show属性；
					showPageDataFromClientChoosen($scope.pagesDataIndex);
				}

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
				//缓存车型选择信息到车辆信息页面
				//global.rootCache.carType[$scope.pagesOptionChosenRecord.length] = item.name;

				//手动更改parents的值，让$watchCollection监听器生效
				$scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
				win.global.DTCLog.systemName = item.name;

			}

			safeApply(function () {
				//重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
				setTimeout(function () {tool.layoutTable();}, 45);
			});
		}

		$scope.navSelection = function (recordIndex) {
			win.RMTClickEvent.keyMatchNavSelection({nav: recordIndex});
		};

		/**
		 * 导航条点击事件
		 * @param obj ;this param's type like {record:index} || {pagesDataIndex:index}
		 * */
		win.RMTClickEvent.keyMatchNavSelection = function (obj) {

			//区别从 点击 【导航】 返回 和 点击【上一级】按钮返回
			if (obj.hasOwnProperty("nav")) {
				var record = parseFloat(obj.nav);                //远程端只支持字串形式的数据
				$scope.pagesDataIndex = record + 1;
				showPageDataFromClientChoosen(record + 1);          //record下标和pages下标有1的差别，需要同步显示的情况下，
				//引用record的下标的时候必须 +1；
			}
			else {
				var pagesDataIndex_int = parseFloat(obj.btn);
				showPageDataFromClientChoosen(pagesDataIndex_int);
			}

			checkBtnTextBasisCurIndex();
			safeApply(function () {});
		};

		//处理帮助二类型的请求；
		$scope.handleHelp = function (dbfilename) {
			//实际的打包信息为dbfilename，但是服务器处理成以picture的返回
			win.RMTClickEvent.handleHelpType2(dbfilename);
		};

		win.RMTClickEvent.handleHelpType2 = function (dbfilename) {
			tool.loading({text: "加载中..."});
			helpInfoRequest(2, "null", dbfilename);
		};

		function helpInfoRequest(requestType, carType, dbfilename) {
			tool.loading({text: "加载中..."});
			var key = requestType === 2 ? "ANTISTEEL_HELP2" : "ANTISTEEL_HELP";
			win.server.request(
				1011,
				{
					"key": key,
					"cartype": carType  //请求模式是1，carType的值为null
				},
				{
					"dbfilename": dbfilename,
					"pub": ""
				},
				win.server.addRetryFn(
					win.server.addCallbackParam(
						win.serverRequestCallback.helpMenu,
						[requestType, carType, dbfilename]
					),
					[helpInfoRequest,backToPrvLevel]
				)
			);
		}

		win.serverRequestCallback.helpMenu = function (responseObject, params) {

			tool.loading(0);
			if (!showView)return;

			if(!responseObject.items.length){
				tool.alert('服务器无任何数据',
				           function () {
					           //tool.processBar("");
					           backToPrvLevel();
				           }
				);
				return;
			}
				$scope.helpPopData = responseObject.items;
				document.getElementById("helpPop").style.display = "block";
		};

		/**
		 * 动态刷新按钮文本
		 * */
		function checkBtnTextBasisCurIndex() {
			return $scope.pagesDataIndex > 0 ? "上一级" : "返回";
		}

		/**
		 * 返回按钮点击事件,分为【上一级】和【退出诊断】两个功能，根据当前页面的Index进行判断
		 * */
		function backToPrvLevel() {

			if ($scope.pagesDataIndex <= 0) {
				moduleExit();
			}
			else {
				win.RMTClickEvent.keyMatchNavSelection({btn: --$scope.pagesDataIndex});
			}

			safeApply(function () {});
		}

		/**
		 * 监听是否存在 nodeaddress
		 * 结合了业务流程
		 * 根据 $scope.pagesOptionChosenRecord 的变化做了相应的处理
		 * */
		$scope.$watchCollection('pagesOptionChosenRecord', function () {
			//监听器的执行先于其他代码，所以在此堵截，防止报错
			if (!$scope.pagesOptionChosenRecord[0] || "" == $scope.pagesOptionChosenRecord[0]) {
				//tool.processBar("");
				return;
			}

			var curRecordIndex = $scope.pagesOptionChosenRecord.length - 1;
			//获取每个列表层级，并循环搜索是否存在nodeaddress；
			var itemLen = $scope.pagesData[curRecordIndex].length;
			if (itemLen > 0) {
				for (var i = 0; i < itemLen; i++) {
					var item = $scope.pagesData[curRecordIndex][i];

					//如果存在，直接跳入下个流程，取消确定按钮
					if (item.name == $scope.pagesOptionChosenRecord[curRecordIndex] && item['N']) {

						$scope.nodeAddress = item['N']['nodeaddress'];
						$scope.dbFilename = item['N']['dbfilename'];
						$scope.publicFileName = item['N']['publicfilename'];

						safeApply(function () {
							//tool.processBar("获取车型系统完成");
						});
						outputPrompt();
						return;
					}
				}
			}

			//从其他界面返回的时候，直接读取缓存数据，不需要请求服务器
			if ($scope.isBack === true) {
				$scope.isBack = false;
				return;
			}

			requestData($scope.pagesOptionChosenRecord);

		});

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
		 * 请求服务器命名封装
		 * @param pagesOptionChosenRecord ;把整个选项记录的数组发送给服务器
		 * */
		function requestData(pagesOptionChosenRecord) {
			if (showView)win.tool.loading({pos: "body", text: '获取数据...'});
			var DataPack = {
				parents: pagesOptionChosenRecord       //服务器解析名为 parents；
			};
			win.server.request(
				global.businessInfo.serverType,
				{
					"key": "ANTISTEEL_LOAD_MENU",
					"cartype": global.businessInfo.carType
				},
				DataPack,
				win.server.addRetryFn(
					win.server.addCallbackParam(win.serverRequestCallback.keyMatch,[pagesOptionChosenRecord]),
					[requestData,backToPrvLevel]
				)
			);
		}

		/**
		 * 请求服务器回调方法
		 * @param responseObject ;JSON数据
		 * @param params ;用于内部运算的参数，通过 server.RequestService.utilAddParams() 方法传入, 远程协助时通过APP传入
		 * */
		win.serverRequestCallback.keyMatch = function (responseObject, params) {
			tool.loading(0);
			if (!showView)return;

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
					while (k--)  $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1][k].show = false;
				}

				//添加下一页的数据时会初始化show为true;
				var items = responseObject.items;
				var i = items.length;
				while (i--) items[i].show = true;

				safeApply(function () {
					bindBottomBtn();
					tool.layout(thisBoxId, 1);
					//tool.processBar('请选择');
					$scope.pagesData[$scope.pagesDataIndex] = items;
				});

			//根据界面需求，必须等需要跳转的页面渲染完毕再进行 显示
			tool.layout(thisBoxId, 1);
		};

		/**
		 * 绑定按钮事件
		 * */
		function bindBottomBtn() {
			win.tool.bottomBtn({
				btn1Text: function () { return checkBtnTextBasisCurIndex(); },
				btn1Callback: function () { backToPrvLevel(); }
			});
		}

		/**
		 * 界面跳转事件，获取并设置业务模式；
		 * 根据业务模式：
		 * 1：直接进入【系统列表】
		 * 2：发送310901XXX后，进入【服务列表】
		 * 3：发送310971XXX后，进入【车型配置】
		 * */
		function outputPrompt() {
			tool.alert(
				["请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。", "确定", "返回"],
				function () { outputConfirm();},
				function () { outputCancel(); }
			);
		}

		function outputConfirm() {
			//防盗匹配的下级模块开始，carType就是当前模块的dbFilename，根据接口模型决定；
			//dbFilename是当前模块的publicfilename，根据接口模型决定；
			win.global.businessInfo.carType = $scope.dbFilename;

			//在此提取业务ID，拼接URL交给APP登录服务器
			win.global.businessInfo.busID = $scope.publicFileName.split("@")[0];
			win.global.businessInfo.nodeAddress = $scope.nodeAddress;
			tool.layout(thisBoxId, 0);
			win.moduleEntry.carType();
		}

		function outputCancel() {
			if ($scope.pagesOptionChosenRecord.length) {
				$scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);
				$scope.pagesDataIndex--;
			}
			else {
				moduleExit();
			}

			safeApply(function () {});
		}

		function moduleExit() {
			showView = false;
			reset();
			tool.layout(thisBoxId, 0);
			win.devService.sendDataToDev("3109FF");    //通知设备复位
			win.moduleEntry.carLogo(-1);
		}

		function reset() {
			safeApply(function () {
				$scope.pagesDataIndex = 0;
				$scope.pagesOptionChosenRecord.length = 0;
				$scope.pagesData.length = 0;
			})
		}

	}]).config(function () {

	}).directive("helpPop", function () {
		var template = [
			'<div id="helpPop" class="help-pop-frame">',
			'   <div class="help-pop-layout table">',
			'       <div class="help-pop-layout-slave table-cell">',

			'           <div  class="help-pop-content-box table">',
			'               <img class="help-pop-close-button" src="images/common/refresh_1.png" onclick="document.getElementById(\'helpPop\').style.display = \'none\';"/>',
			'               <div class="arrow-back-cover arrow-back-cover-left" ng-click="prevPic(curSrc.index)">',
			'                   <span class="table-cell-center"><i class="arrow-left" style="right:1.2rem"></i></span>',
			'               </div>',

			'               <div id="appendForm" class="help-pop-content table-cell">',
			'                   <img ng-src="{{ curSrc.src }}" alt="" ng-click="imgView()" ng-hide="!curSrc.src"/>',
			'						<div class="help-pop-desc">',
			'                   	<p ng-repeat="(index,phrase) in curSrc.name">' +
			'                       	<span ng-bind="phrase">文本内容</span>',
			'                       	<span ng-show="index == curSrc.name.length-1">({{ curSrc.index + 1 }}/{{ helpPopData.length }})</span>',
			'                   	</p>',
			'					</div>',
			'               </div>',
			'               <div class="arrow-back-cover arrow-back-cover-right" ng-click="nextPic(curSrc.index)">',
			'                   <span class="table-cell-center"><i class="arrow-right" style="right:1.2rem"></i></span>',
			'               </div>',
			'           </div>',
			'       </div>',
			'   </div>',
			'   <div class="help-pop-content-background"></div>',
			'</div>'

		].join("");
		return {
			restrict: "ECMA",
			scope: false,
			replace: true,
			template: template,
			link: function (scope) {

				var pswitems = [];
				//var host = "http://192.168.1.37:8091/";
				//var path = "CCDPWebServer/CCDP_Web/zh-cn/carimage/";
				scope.$watch("helpPopData", function () {
					if (scope.helpPopData.length) {
						scope.helpPopData = (function () {
							scope.helpPopData.forEach(function (item, index) {
								item.index = index;
								item.name = item.name.split("\\n");
								item.src = item.fomulaname ? "images/carType/img/" + item.fomulaname : "";
								pswitems.push({
									src: item.src,
									w: 600,
									h: 400
								});
							});
							return scope.helpPopData;
						})();
						scope.curSrc = scope.helpPopData[0];
					}
				});
				var curIndex = 0;
				scope.prevPic = function (index) {
					if (index <= 0)return;
					win.RMTClickEvent.prevPic(index);
				};

				win.RMTClickEvent.prevPic = function (index) {
					curIndex = --index;
					scope.curSrc = scope.helpPopData[index];
				};

				scope.nextPic = function (index) {
					if (index >= scope.helpPopData.length - 1)return;
					win.RMTClickEvent.nextPic(index);
				};

				win.RMTClickEvent.nextPic = function (index) {
					curIndex = ++index;
					scope.curSrc = scope.helpPopData[index];
				};

				var pswpElement = document.querySelectorAll('.pswp')[0];
				scope.imgView = function () {
					var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswitems, {
						index: curIndex, // start at first slide
						x: 0,
						y: 0,
						w: "100%",
						h: "100%"
					});
					gallery.init();
				}
			}
		}
	});

})();
/**
 * Created by Andy on 2016/6/25.
 */
(function () {
	var win = window;

	App.controller("maintainProcessCtrl", ["$scope", "angularFactory", function ($scope, angularFactory) {

		var safeApply = angularFactory.getScope($scope).safeApply;

		$scope.contents_arr = [                                 //正文文本,用于模板绑定,menuItemsValue为读值信息
			//{supid:"",text:"",menuItemsValue:""}
		];

		var $ = angular.element;


		$scope.buttons_arr = [                                  //按钮文本,用于模板绑定
			//{supid:"",text:""}
		];

		$scope.BombBoxType = "00";                              //弹出框类型

		var cmdLen_int;

		var stepCount = 0;                                      //初始程序号为0
		var requestType = "01";                                 //默认为1, 请求类型参考菜单的supid处理类型,因为前端已经补全了所有supid,所以请求类型只有01和03

		var pidCacheFromDev = {                                   //存储提示框或者输入框的supid; 用于搜索服务器返回数据时,区分哪些是按钮内容,哪些是正文内容;
			contents_arr: [],
			buttons_arr: []
		};

		var menuType04 = "";                                    //区分菜单的supid组合类型
		var menuSupid_arr = [];                                 //用于存储菜单的supid;
		var menuItemsValue_arr = [];                            //用于存储读值信息;
		var bindSupidWithValueForMenuType04_obj;                //用于处理带读值菜单的显示值,获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定到html显示;supid类型为03的不用绑定

		var cacheSupidsForbadRequest_arr = [];                  //缓存supids，用于当服务器返回数据失败时重新请求；当服务器数据正常返回时就清除；

		var preCmd = "";

		win.moduleEntry.maintainProcess = function (cmdType) {
			//根据用户选择的保养类型,发送相应的指令到设备;
			preCmd = "3109" + cmdType;
			stepCount = 0;
			var suffix = "00";
			win.sendDataToDev(preCmd + tool.toHex(stepCount++, 2) + suffix);
		};

		win.devInterActive.Fun710951 = function (varRecvData) {
			handleVarRecvData(varRecvData);
		};

		win.devInterActive.Fun710952 = function (varRecvData) {
			handleVarRecvData(varRecvData);
		};

		win.devInterActive.Fun710953 = function (varRecvData) {
			handleVarRecvData(varRecvData);
		};

		win.devInterActive.Fun710950 = function (varRecvData) {
			handleVarRecvData(varRecvData);
		};

		win.devInterActive.Fun7109D0 = function (varRecvData) {
			//todo 设备响应失败
			tool.alert("CCDP设备响应失败", function () {
				win.sendDataToDev("310902");
			});
		};

		win.devInterActive.Fun7109D1 = function (varRecvData) {
			//todo 设备响应失败
			tool.alert("CCDP设备响应失败", function () {
				win.sendDataToDev("310902");
			});
		};

		win.devInterActive.Fun7109D2 = function (varRecvData) {
			//todo 设备响应失败
			tool.alert("CCDP设备响应失败", function () {
				win.sendDataToDev("310902");
			});
		};

		win.devInterActive.Fun7109D3 = function (varRecvData) {
			//todo 设备响应失败
			tool.alert("CCDP设备响应失败", function () {
				win.sendDataToDev("310902");
			});
		};


		function handleVarRecvData(varRecvData) {

			//使用之前先重置；
			pidCacheFromDev.contents_arr.length = 0;                                          //存储内容文本的supid（索引号），用于匹配服务器返回的文本
			pidCacheFromDev.buttons_arr.length = 0;                                           //存储按钮文本的supid（索引号），用于匹配服务器返回的文本
			menuSupid_arr.length = 0;                                                       //用于存储菜单的supid;
			menuItemsValue_arr.length = 0;                                                  //用于存储读值信息;
			$scope.BombBoxType = varRecvData.substr(8, 2);                                  //【B】--弹出框类型
			cmdLen_int = tool.hex2dec(varRecvData.substr(10, 4));                           //【C】--后缀指令长度；
			requestType = "01";                                                             //请求类型为01时，代表datapack会打包所有的supid
			switch ($scope.BombBoxType) {
				case "01":                                                                  //提示框
				case "02":                                                                  //输入框
				{
					pidCacheFromDev.contents_arr.push(varRecvData.substr(14, 8));             //前八位为supid,和菜单有区别
					pidCacheFromDev.buttons_arr =
						tool.cutStringByStep(
							varRecvData,
							tool.hex2dec(varRecvData.substr(22, 2)),
							24,
							8);
				}
					break;
				case "03":                                                                  //普通菜单
				{
					var menuType = varRecvData.substr(14, 2);
					var menuItemsSum = tool.hex2dec(varRecvData.substr(16, 2));
					switch (menuType) {

						case "01":                                                          //当菜单类型为01时，第二字节代表菜单条目数，后每8字节代表一个supid；
						{
							for (var i = 0; i < menuItemsSum; i++) {
								menuSupid_arr.push(varRecvData.substr(18 + i * 8, 8));
							}

						}
							break;

						case "02":                                                          //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
						{
							var startIndex = tool.hex2dec(varRecvData.substr(18, 8));
							var endIndex = tool.hex2dec(varRecvData.substr(26, 8));
							menuItemsSum = endIndex - startIndex + 1;

							for (var j = 0; j < menuItemsSum; j++) {
								menuSupid_arr.push(tool.toHex(endIndex--, 8));
							}

						}
							break;

						case "03":                                                          //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
						{
							menuSupid_arr.push(varRecvData.substr(18, 8));
							requestType = "03";                                             //代表需要解析组数据
						}
							break;

					}
				}
					break;
				case "04":                                                                  //带读值的菜单
				{
					var readValueBindOnSupid = false;                                       //第一,第二种supid解析模式可以对读值进行绑定,将此变量设置为flag,由于第三种要去服务器解组数据,所以暂时忽略
					menuType04 = varRecvData.substr(14, 2);
					var menuItemsSum04 = tool.hex2dec(varRecvData.substr(16, 2));
					var cutStrFinalIncreaseIndex = 18;                                      //由于读值信息最后处理，所以需要截取出来，此变量就是用于计算后续的指令长度,初始值为18,每截取一段指令,就加上相应的位数


					switch (menuType04) {                                                   //计算出读值菜单的菜单提示文本；

						case "01":                                                          //当菜单类型为01时，第二字节代表菜单条目数，后每8字节代表一个supid；
						{
							readValueBindOnSupid = true;
							for (var k = 0; k < menuItemsSum04; k++) {
								menuSupid_arr.push(varRecvData.substr(18 + k * 8, 8));
							}
							cutStrFinalIncreaseIndex += menuItemsSum04 * 8;
						}
							break;

						case "02":                                                          //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
						{
							readValueBindOnSupid = true;
							var startSupid04 = tool.hex2dec(varRecvData.substr(18, 8));
							var endSupid04 = tool.hex2dec(varRecvData.substr(26, 8));
							menuItemsSum04 = endSupid04 - startSupid04 + 1;

							for (var l = 0; l < menuItemsSum04; l++) {                      //补全supid，扔到menuSupid_arr数组里
								menuSupid_arr.push(tool.toHex(endSupid04--, 8));
							}

							cutStrFinalIncreaseIndex += 2 * 8;
						}
							break;

						case "03":                                                          //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
						{
							menuSupid_arr.push(varRecvData.substr(18, 8));
							requestType = "03";
							cutStrFinalIncreaseIndex += 8;
						}
							break;
					}

					/** 指令的样例格式：7109500104001901030011010100110102001101033130300032303000330000
					 *  计算菜单内每条选项的值，全部为asc字符串，以00为一个读值的结束符；
					 *  去掉最后四位的“0000”，可以让split()方法正确分割成非空数组
					 * */
					var lastCmdStrArea_str =
						varRecvData.substring(cutStrFinalIncreaseIndex, varRecvData.length - 4) || '';

					menuItemsValue_arr = lastCmdStrArea_str.split("00");                        //把已经做好处理的ASC字串以“00”为基准，分隔成数组，分别代表每一项的数值

					var arrLen = menuItemsValue_arr.length;                                     //把长度预存起来,防止对数组操作的时候造成死循环

					for (var m = 0; m < arrLen; m++) {
						var tempASC = menuItemsValue_arr[m];
						menuItemsValue_arr[m] = tempASC.append_percent().decodeFromGb2312();    //把字符串每两个字符添加 “%” ，手动变成gbk码，然后再解gbk码；
					}

					//todo menuItemsValue_arr获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定
					if (!!readValueBindOnSupid) {
						bindSupidWithValueForMenuType04_obj =
							tool.contact2ArrToObj(menuSupid_arr, menuItemsValue_arr);
					}

				}
					break;
				default :                                                                   //如果是未知弹框类型，就退到主界面
					win.sendDataToDev("310902");
					return;
					break;
			}
			var temObjFromClone = angular.extend({}, pidCacheFromDev);
			//pidCacheFromDev.contents_arr
			//pidCacheFromDev.buttons_obj

			//把temObjFromClone.buttons_arr里面每个value的值取出来，重新拼成数组；
			var tempButtons_arr = [];
			temObjFromClone.buttons_arr.forEach(function (item) {
				tempButtons_arr.push(item.value);
			});

			//拼接内容的supid和按钮的supid
			var supids = menuSupid_arr.length ?
				menuSupid_arr :
				(temObjFromClone.contents_arr.concat(tempButtons_arr));         //如果是弹出框类型是01或者02,就把它合并成一个数组

			cacheSupidsForbadRequest_arr = [].concat(supids);

			FunGetSupidDataFromServer(supids);
		}

		/**
		 * 从服务器获取supid匹配的内容
		 * @param supids
		 *
		 */
		function FunGetSupidDataFromServer(supids) {

			var dataPack = {
				dbfilename: global.businessInfo.dbFilename,
				pub: global.businessInfo.pubFilename,
				requestDataType: requestType,
				carType: global.businessInfo.carType,
				supids: supids
			};

			win.server.request(
				600,
				0,
				dataPack,
				win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.bindingViewFromServer, [cacheSupidsForbadRequest_arr]),
					[FunGetSupidDataFromServer, global.disconnectOBD])
			);

			dataPack.supids.length = 0;
		}

		win.serverRequestCallback.bindingViewFromServer = function (responseObject, params) {

			//todo 由于存在读秒框体，需要马上计算发送 指令给设备，所以在不能发送之后 马上重置数据
			if (!responseObject.supids.length) {
				tool.alert('服务器无数据支持',
				           function () {
					           global.disconnectOBD();
					           //tool.processBar("");
				           }
				);
				return;
			}
			cacheSupidsForbadRequest_arr.length = 0;                                //如果数据返回成功，就置空cacheSupidsForRequest数组；
			$scope.contents_arr.length = 0;                                         //webview内容文本数据
			$scope.buttons_arr.length = 0;                                          //webview按钮文本数据
			tool.popShow("bombTipBox", 0);
			tool.popShow("bombMenuBox", 0);

			var theDataModel = tool.objToArr(responseObject.supids, "supid", "text");
			switch ($scope.BombBoxType) {
				case "01":                                                              //构造提示框内容或输入框内容
				case "02":
				{
					//1,获取源格式
					//{
					//    "requestDataType": "01/02/03",
					//    "supids": {
					//    "00000001": "点击确认或者取消",
					//    "00000002": "确定"
					//     }
					//}

					//2,转成model需要的格式
					//[
					// {text:"点击确认或者取消",supid:"00000001"},
					// {text:"确定",supid:"0001"},
					// {text:"取消",supid:"0002"}
					// ]

					//3,匹配supid,决定是按钮还是正文文本,下面是supid数据格式
					//    var pidCacheFromDev = {
					//        contents_arr:[],
					//        buttons_arr:[]
					//    };

					//最后再组成webView格式:
					//$scope.tipsDataList_obj = {
					//    contents_arr: [],
					//    buttons_arr: []
					//};
					var i;
					for (i = 0; i < theDataModel.length; i++) {
						var j = pidCacheFromDev.contents_arr.length;
						while (j--) {
							if (theDataModel[i].supid === pidCacheFromDev.contents_arr[j]) {
								$scope.contents_arr.push(theDataModel[i]);
							}
							else {
								//比对supid之后才决定buttons_arr数组的index
								pidCacheFromDev.buttons_arr.forEach(function (item) {
									if (theDataModel[i].supid === item.value)
										$scope.buttons_arr[item.index] = theDataModel[i];
								});
							}
						}
					}

					//由于ng-bind和ng-bind-html无法解决 【\r\n】转义符换行问题，所以使用ng-repeat代替
					// 以 “\N” 换行符作为 基准，把文本转换成数组，逐一绑定给 <p> 标签， 以达到换行的目的
					var temp = $scope.contents_arr[0]['text'];
					if (/\\r\\n/ig.test(temp))$scope.contents_arr[0]['text'] = $scope.contents_arr[0]['text'].replace(/\\r\\n/ig, "\\n");
					if (/\\n\\r/ig.test(temp))$scope.contents_arr[0]['text'] = $scope.contents_arr[0]['text'].replace(/\\n\\r/ig, "\\n");
					if (/\\r/ig.test(temp))$scope.contents_arr[0]['text'] = $scope.contents_arr[0]['text'].replace(/\\r/ig, "\\n");

					$scope.contents_arr[0]['text'] = $scope.contents_arr[0]['text'].split("\\n");

					tool.popShow("bombTipBox", 1);

					/**
					 * 如果没有按钮，就说明是一个倒计时提示框，直接请求下一个提示框,按钮值为00
					 * sendData 属性列表 : buttonIndex :提示框按钮和输入框按钮
					 *                    inputValue :输入框的值
					 *                    menuItemLen :菜单的选项的总长度
					 *                    menuItemWitchWasChecked :菜单的选项的下标
					 * */
					if (!$scope.buttons_arr.length) {
						win.devInterActive.Fun31095x({
							menuItemWitchWasChecked: "",
							menuItemLen: "",
							inputValue: "",
							buttonIndex: "00"
						});
					}
				}
					break;
				case "03":                                                               //构造菜单内容
				{
					$scope.contents_arr = theDataModel;
					$scope.buttons_arr.push({text: "退出"});

					tool.popShow("bombMenuBox", 1);
				}
					break;
				case "04":                                                               //构造读值菜单内容

				{
					// 解成{supid:"00000001",menuItemsValue:"文本内容"}的形式,
					// 再和响应的数据 {supid:"00000001",text:"文本内容"} 进行比对,
					// 最后生成 {supid:"00000001",text:"文本内容",menuItemsValue:"文本内容"} 的数据形式
					var theDataModelLen = theDataModel.length;
					if (menuType04 !== "03") {                                           // 如果不是组数据,就根据绑定的supid,
						var tempArr =
							tool.objToArr(bindSupidWithValueForMenuType04_obj, "supid", "menuItemsValue");

						for (var k = 0; k < theDataModelLen; k++) {
							var tempArrLen = tempArr.length;
							for (var kk = 0; kk < tempArrLen; kk++) {
								if (theDataModel[k].supid === tempArr[kk].supid) {
									theDataModel[k].menuItemsValue = tempArr[kk].menuItemsValue;
									tempArr.splice(kk, 1);                              //比对完毕，就删除当前下标的值
									break;
								}
							}
						}

					}
					else {
						// 如果是组数据,就把截取的所有读值依次填入相应的项,
						// 如果 读值的数量>项的数量, 就忽略后面的读值;
						// 如果 项的数量>读值的数量, 就全部填入0;

						for (k = 0; k < theDataModelLen; k++) {
							theDataModel[k].menuItemsValue =
								!!menuItemsValue_arr[k] ? menuItemsValue_arr[k] : 0;
						}
					}

					$scope.contents_arr = theDataModel;
					$scope.buttons_arr[0] = ({text: "退出"});

					tool.popShow("bombMenuBox", 1);
				}
					break;
			}
			safeApply(function () { });
			//tool.processBar("");

			//}

		};

		$scope.handleBombTipBoxClick = function (contents_arr, index, boxID) {
			win.RMTClickEvent.handleBombTipBoxClick(contents_arr, index, boxID);
		};

		win.RMTClickEvent.handleBombTipBoxClick = function (contents_arr, index, boxID) {

			var buttonIndex = "0" + index;                                  //第一个按钮的下标为 01
			var input_el = $("#" + boxID);
			var inputValue = input_el.val();
			var warningTip_el = $(".warn-text");

			//如果是输入框类型的弹框，并且点击的按钮是确定项,强制用户进行设置
			if (!/(取消)|(返回)|(退出)/g.test(contents_arr[index - 1].text) && $scope.BombBoxType == 2 && inputValue === "") {
				safeApply(function () {
					warningTip_el.html("请设置数值！");
				});
				return;
			}

			tool.loading({text: "等待设备响应..."});                      //一般情况是在发送指令给设备之后再启用加载遮罩，
			//现在的情况是：当设备出现倒计时弹框时，需要马上发送指令给设备，弹框需要停留一定的时间给用户阅读文本
			//所以，按正常流程，点击之后马上加载遮罩
			//而且，为了防止设备数据返回过快，未弹出遮罩，数据已经返回，造成数据发送成功，遮罩依然存在的BUG

			win.devInterActive.Fun31095x({
				menuItemWitchWasChecked: "",
				menuItemLen: "",
				inputValue: inputValue,
				buttonIndex: buttonIndex
			});


			tool.popShow("bombTipBox", 0);                                     //点击之后，隐藏盒子，并重置输入框的提示文本和输入值
			input_el.val("");
			warningTip_el.html("");
		};

		$scope.handleMenuItemClick = function (contents_arr, index) {
			win.RMTClickEvent.handleMenuItemClick(contents_arr, index);
		};

		win.RMTClickEvent.handleMenuItemClick = function (contents_arr, index) {
			var menuItemLen = tool.toHex(contents_arr.length, 2);
			var menuItemWitchWasChecked =
				index === "00" ? "00" : "0" + index;

			win.devInterActive.Fun31095x({
				menuItemWitchWasChecked: menuItemWitchWasChecked,
				menuItemLen: menuItemLen,
				inputValue: "",
				buttonIndex: ""
			});

			tool.loading({text: "等待设备响应..."});                      //一般情况是在发送指令给设备之后再启用加载遮罩，
			//现在的情况是：当设备出现倒计时弹框时，需要马上发送指令给设备，弹框需要停留一定的时间给用户阅读文本
			//所以，按正常流程，点击之后马上加载遮罩
			//而且，为了防止设备数据返回过快，未弹出遮罩，数据已经返回，造成数据发送成功，遮罩依然存在的BUG

			tool.popShow("bombMenuBox", 0);
		};

		/**
		 *sendData 属性列表 : buttonIndex :提示框按钮和输入框按钮
		 *                   inputValue :输入框的值
		 *                   menuItemLen :菜单的选项的总长度
		 *                   menuItemWitchWasChecked :菜单的选项的下标
		 *
		 * */
		win.devInterActive.Fun31095x = function (sendData) {

			var buttonWitchWasCheckedIndex_hex = sendData.buttonIndex;     //如果没有按钮就填入00

			var inputValue2Asc_asc =
				tool.toAsc(sendData.inputValue, 16);                        //转成16进制asc码,以00结尾;

			var menuItemLen_hex = sendData.menuItemLen;                     //sendData.menuItemLen;菜单界面菜单显示的总条目数

			var menuItemWitchWasCheckedIndex_hex =                          //sendData.menuItemWitchWasChecked;菜单界面返回的用户选择，
				sendData.menuItemWitchWasChecked;                           //如02代表用户选择了菜单内的第2个选择，选项从1开始，00代表用户选择了退出菜单。

			var cmdCodeLen_int =                                            //以上指令构造完成之后再计算指令的最后长度
				(buttonWitchWasCheckedIndex_hex +
				inputValue2Asc_asc +
				menuItemLen_hex +
				menuItemWitchWasCheckedIndex_hex + "").length;

			/**    31 09 51  [A]  [B]  [C]  [D]   【A】--流程号；
			 *                                    【B】--后缀指令长度；
			 *                                    【C】--“菜单”-前一字节代表上一个菜单界面菜单显示的【总选项数】，后一个字节代表用户选择的【选项下标】;
			 * “输入框，提示框”-用户点击的按钮下标
			 *                                    【D】--“输入框”-用户输入的值的asc码，“菜单，提示框”-无
			 * */
			var finalCmd = preCmd +                                   //指令前缀 31095X
				tool.toHex(stepCount++, 2) +                                //流程号,发送完一次，流程号就+一次；
				tool.toHex(cmdCodeLen_int / 2, 2) +                         //后缀指令长度
				buttonWitchWasCheckedIndex_hex +                            //选择的按钮下标
				(inputValue2Asc_asc ? inputValue2Asc_asc + "00" : "") +     //输入值,如果有输入值,则在后面加上"00",不算进指令长度
				menuItemLen_hex +                                           //菜单选项的数量
				menuItemWitchWasCheckedIndex_hex;                           //菜单选项被点击的下标

			win.sendDataToDev(finalCmd);
		};

	}]).config(function () {

	});
})();
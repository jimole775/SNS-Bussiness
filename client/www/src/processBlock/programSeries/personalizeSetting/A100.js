/**
 * Created by Andy on 2016/7/18.
 */
(function (win) {

	var gIndexId = "";
	var gModuleInfo = "";
	var gModuleAddress = "";
	var gFileType = ""; 			//文件类型(2B)
	var gFileLen = null;            //文件长度(4B)
	var gFileNameASCII = null;           //文件名,asc类型(32B)
	var gFileMD5 = null;            //MD5值,长度(16B)
	var gFileEncodeType = null;     //加密类型,长度(2B)
	var gUploadTime = 0;            //上传文件校验次数,如果失败3次之后,退出业务
	var BMWF18ServerType = 500;

	//APP交互端口6202推送的文件名数据；
	var gDevFilName = "";

	var isFunctionSet = false;
	var isModuleSelect = false;
	var HEAD_MAP = {
		HWEL: "01",
		HWAP: "02",
		HWFR: "03",
		GWTB: "04",
		CAFD: "05",
		BTLD: "06",
		SWFL: "08",
		SWFF: "09",
		SWPF: "0A",
		ONPS: "0B",
		FAFP: "0E",
		TLRT: "1A",
		TPRG: "1B",
		FLSL: "07",
		IBAD: "0C",
		FCFA: "0F",
		ENTD: "A0",
		NAVD: "A1",
		FCFN: "A2",
		SWIP: "C1",
		SWUP: "C0",
		BLUP: "1C",
		FLUP: "1D",
		Unknown: "00"
	};

	win.moduleEntry.A100 = function () {
		win.sendDataToDev("310614");    //和编程设码的流程相反，应用端需要主动询问设备状态
	};

	win.devInterActive.Fun7106 = function (varData) {
		var cmdIndex4_2 = varData.substr(4, 2);
		var cmdIndex4_4 = varData.substr(4, 4);
		switch (cmdIndex4_2) {
			case "01": //个性化设置参数写入车辆成功,(设备未确定指令为71090F01还是710901)
				tool.alert("个性化设置参数写入车辆成功", function () {
					loopTrigger('functionSet')
				});
				break;
			case "02": //个性化设置参数写入车辆失败,(设备未确定指令为71090F02还是710902)
				tool.alert("个性化设置参数写入车辆失败", function () {
					loopTrigger('functionSet')
				});
				break;
		}
		switch (cmdIndex4_4) {
			case "1401":
				//tool.processBar("设备自检状态正常");
				setTimeout(function () {
					tool.loading({text: '检查车辆通信状态...'});
					//tool.processBar("检查车辆通信状态...");
					win.sendDataToDev("310611");
				}, 25);
				break;
			case "1402":

				tool.alert("设备自检状态异常，点击确定退出业务", function () {
					win.appService.sendDataToApp(3999, "", "");
				});
				break;
			case "1101":
				//tool.processBar("设备与车辆通信成功");
				setTimeout(function () {
					tool.loading({text: '请求个性化设置模块...'});
					//tool.processBar("请求个性化设置模块...");
					win.sendDataToDev("31052C");            //连接成功之后发送“选择个性化设置模块”
					win.appService.sendDataToApp(1011, 0, "");         //标记正在进行宝马F系流程
				}, 1000);
				break;
			case "1102":
				tool.alert("设备与车辆通信失败，点击确定退出业务", function () {
					win.appService.sendDataToApp(3999, "", "")
				});
				break;
			case "2301":
				isFunctionSet = false;
				isModuleSelect = true;
				console.log("isFunctionSet:", isFunctionSet, "isModuleSelect:", isModuleSelect);

				/**读取模块配置信息 成功
				 * 设备应答数据：0x7106+0x23+[01(成功)+文件名ASCII(32B)+文件大小(4B)+MD5值(16B)+加密类型(2B)+文件类型(2B)]/02(失败)/03(数据校验错误)
				 * 截取8位之后的所有字符，传给APP进行处理: 0x2107+文件名ASCII(32B)+文件大小(4B)+MD5值(16B)+加密类型(2B)+文件类型(2B)
				 * */
				//requestUploadFile(varData,"2107");
				break;
			case "2302":        //8、读取模块配置信息 失败 弹出确认框提示“读取模块配置信息失败”，用户点确定后退出流程。
				tool.alert("读取模块配置信息失败,请重试");
				break;
			case "2303":        //8、读取模块配置信息 数据校验失败 弹出确认框提示“模块配置信息签名校验不通过”，用户点确定后退出流程。
				tool.alert("模块配置信息签名校验不通过,请重试");
				break;
			case "0F01":        //个性化设置参数写入车辆成功,(设备未确定指令为71090F01还是710901)
				tool.alert("个性化设置参数写入车辆成功", function () {
					loopTrigger();
				});
				break;
			case "0F02":        //个性化设置参数写入车辆失败,(设备未确定指令为71090F02还是710902)
				tool.alert("个性化设置参数写入车辆失败", function () {
					loopTrigger();
				});
				break;
		}

	};

	var gCarTypeInfo = "";
	win.devInterActive.Fun7105 = function (varRecvData) {

		var carTypeInfo = varRecvData.substr(8);
		var prevStr = varRecvData.substr(6, 2);
		if (prevStr == "01") {
			gCarTypeInfo = carTypeInfo;
			requestSetCodeModule(gCarTypeInfo);
		}
		else {
			tool.alert("获取车辆控制单元列表失败", function () {
				win.sendDataToDev("71052C02");
			});
		}
	};

	function requestSetCodeModule(gCarTypeInfo) {
		//请求设码模块
		win.server.request(
			BMWF18ServerType,
			0,
			gCarTypeInfo,
			win.server.addCallbackParam(win.serverRequestCallback.showPersonalizeModule, [gCarTypeInfo]),
			[requestSetCodeModule, quitBusiness]
		);
	}

	//用于备份数据
	function PersonalizeModuleJson(Data) {
		var oData = Data || {};
		this.dataFileExist = oData.dataFileExist;
		this.configExist = oData.configExist;
		this.code = oData.code;
		this.modelName = oData.modelName;
		this.address = oData.address;
		this.setCodeCount = oData.setCodeCount;
		this.modelInfo = oData.modelInfo;
		this.setCodeInfos = oData.setCodeInfos;
		this.modelNameIndexId = oData.modelNameIndexId;
	}

	/**
	 //        {
        //              "dataFileExist":"true",  //如果这一项为假，就显示红色字体；
        //              "configExist":"true",   //如果“dataFileExist”为真，“configExist”为假，就显示黑色字体；
        //              "code": " 1",
        //              "modelName": " cas3",
        //              "address": "00",
        //              "setCodeCount": "1",
        //              "modelInfo": "CAFD_0000000F_005_021_005",
        //              "setCodeInfos": [
        //                                  {
        //                                      “setCodeInfo”: “37F18102004401”
        //                                  }
        //                              ]
        */
	var setCodeInfosBindOnModelInfo = {};//把setCodeInfos属性和modelInfo属性绑定到一起;
	win.serverRequestCallback.showPersonalizeModule = function (responseData, params) {
		tool.loading(0);

		var jsonData = responseData || [];
		var strHtml = "";
		var TxtColor = "";
		var j = jsonData.length;
		var resultArr = [];
		//把address相同的项都筛选出来,
		//把modelInfo的值用","号合并成一个；
		//并把单个的modelInfo和setCodeInfos数组关联起来
		while (j--) {
			/**在这里元素被倒序了一次*/

			resultArr.push(new PersonalizeModuleJson(jsonData[j]));//resultArr另存一份数据
			var resultArrLastItem = resultArr[resultArr.length - 1];

			resultArrLastItem.modelInfo = formatTheModuleInfo(resultArrLastItem.modelInfo);

			//把CAFD_0000000F005_021_005 转换成 050000000F_005_021_005的格式
			setCodeInfosBindOnModelInfo[resultArrLastItem.modelInfo] = resultArrLastItem.setCodeInfos;

			//循环比对,把address重复的modelInfo项合并
			for (var k = 0; k < j; k++) {
				var singleItem = jsonData[k];

				if (resultArrLastItem.address == singleItem.address) {

					var tempObj = tool.extend({}, singleItem);//把数据临时存到新栈

					var tempModelInfo = formatTheModuleInfo(tempObj.modelInfo);

					jsonData.splice(k, 1);//从后往前删除,每次有重复就删除一个jsonData的数据

					resultArrLastItem.modelInfo = resultArrLastItem.modelInfo + "," + tempModelInfo;

					setCodeInfosBindOnModelInfo[tempModelInfo] = tempObj.setCodeInfos;

					k -= 1;
					j -= 1;     //被删除一次，下标就跳1

					if (j === 0) {break} //防止下标跳动时，越过0，直接跑到负数，造成死循环 或者 读取下标报错
				}
			}

		}


		var tipStr = "";        //绑定由于模块缺陷，导致无法操作的提示文本

		/**承接前面的倒序，最后输出正序数组*/
		//用循环体构造HTML标签
		var len = resultArr.length;
		var serialNumber = 0;
		while (len--) {
			serialNumber++;
			if (resultArr[len].dataFileExist === "true") {
				if (resultArr[len].configExist === "true") {//如果两个为真，就显示蓝色
					TxtColor = "#0070D8";
					tipStr = "";
				}
				else {
					//configExist为假，就显示灰色；
					TxtColor = "#999";
					tipStr = "所选模块无个性化功能设置";
				}
			}
			else {
				//只要dataFileExist为假，就显示红色
				TxtColor = "#FF0000";
				tipStr = "所选模块需要升级数据库";
			}

			var addr = resultArr[len].address || "";
			var moduleNameIndexId = resultArr[len].modelNameIndexId || "";
			var moduleName = resultArr[len].modelName || "";
			var moduleInfo = resultArr[len].modelInfo || "";

			if (/,/.test(moduleInfo)) {
				var tempModuleInfo = moduleInfo.split(",");
				moduleInfo = tempModuleInfo.sort().join(",");
			}

			//如果moduleInfo的值为空，就直接覆盖为黑色
			if (!moduleInfo) {
				TxtColor = "#999";
				tipStr = "所选模块无个性化功能设置";
			}
			//把CAFD_0000000F005_021_005 转换成 050000000F_005_021_005的格式，涉及有多个
			//var SGBMID_HEAD = HEAD_MAP[moduleInfo.substr(0, 4).toUpperCase()];
			//var SGBMID_MIDDLE = moduleInfo.substr(5, 8);
			//var SGBMID_LASTER = moduleInfo.substr(13);

			//var formatModuleInfo = SGBMID_HEAD + SGBMID_MIDDLE + "_" + SGBMID_LASTER;

			//var formatModuleInfo_str = formatTheModuleInfo(moduleInfo);

			strHtml += '<tr rel="checkConfig" id="checkConfig' + len + '">' +
			'<td class="t-center"><span style="color:' + TxtColor + '">' + serialNumber + '</span></td>' +
			'<td class="t-center"><span rel="moduleAddress" style="color:' + TxtColor + '">' + addr + '</span></td>' +
			'<td ><span rel="moduleName" style="color:' + TxtColor + '">' + moduleName + '<i rel="moduleNameIndexId" style="display:none">' + moduleNameIndexId + '</i></span></td>' +
			'<td ><span rel="moduleInfo" style="color:' + TxtColor + '">' + moduleInfo + '<i rel="tipStr" style="display:none">' + tipStr + '</i></span></td>' +
			'</tr>';
		}

		$("#moduleList").html(strHtml);
		tool.bottomBtn({
			btn1Text: "退出",
			btn1Callback: function () {
				quitBusiness();
			}
		});
		tool.layout("module", 1);
		//tool.processBar("请选择编程模块");
		bindTableRowClickEvent();
		resultArr.length = 0;

	};

	function formatTheModuleInfo(moduleInfo) {
		if (!moduleInfo)return "";
		var SGBMID_HEAD = HEAD_MAP[moduleInfo.substr(0, 4).toUpperCase()];
		var SGBMID_MIDDLE = moduleInfo.substr(5, 8);
		var SGBMID_LASTER = moduleInfo.substr(13);
		return SGBMID_HEAD + SGBMID_MIDDLE + "_" + SGBMID_LASTER;
	}

	function bindTableRowClickEvent() {
		//监听用户点击事件
		$("tr[rel='checkConfig']").off().on("click", function (e) {
			var boxid = $(e.currentTarget).prop("id");
			win.RMTClickEvent.handleTableRowClick(boxid);
		});
	}

	win.RMTClickEvent.handleTableRowClick = function (boxid) {
		var curTarget = $("#" + boxid);
		var tipStr = $(curTarget).find("i[rel='tipStr']").text();
		var fullModuleInfo = $(curTarget).find("span[rel='moduleInfo']").text();
		var strColor = $(curTarget).find("span[rel='moduleAddress']").css("color");
		gIndexId = $(curTarget).find("i[rel='moduleNameIndexId']").text();
		gModuleAddress = $(curTarget).find("span[rel='moduleAddress']").text();

		//var str1 = "红色：所选模块需要升级数据库";
		//var str2 = "黑色：所选模块无个性化功能设置";
		//如果tipStr有值，就证明是无效的模块，弹出提示框
		if (tipStr) {
			selectModuleInfo(tipStr, strColor);
		}
		else {
			selectModuleInfo(fullModuleInfo, strColor);
		}
	};


	function selectModuleInfo(moduleInfo, strColor) {
		try {
			var str = "";
			//根据数据形式，如果有逗号，证明有多个，通过for循环拼接起来
			if (moduleInfo.indexOf(",") >= 0) {
				var arr = moduleInfo.split(",");
				for (var i = 0; i < arr.length; i++) {
					str +=
						'<button class="box-btn-vertical" style="border-bottom: 1px #ccc solid;border-top: none;margin:0;padding:1rem" onclick="RMTClickEvent.ConfigFileModuleConfirm(\'' + gIndexId + '\',\'' + arr[i] + '\');return false">' +
						'<span class="item-description item-description-layout-table item-description-single">' +
						'<em class="item-description-layout-cell" style="color:' + strColor + '">' + arr[i] + '</em>' +
						'</span>' +
						'</button>';
				}

			}
			else {
				str =
					'<button class="box-btn-vertical" style="border-bottom: 1px #ccc solid;border-top: none;margin:0;padding:1rem" onclick="RMTClickEvent.ConfigFileModuleConfirm(\'' + gIndexId + '\',\'' + moduleInfo + '\');return false">' +
					'<span class="item-description item-description-layout-table item-description-single">' +
					'<em class="item-description-layout-cell" style="color:' + strColor + '">' + moduleInfo + '</em>' +
					'</span>' +
					'</button>';
			}

			$("#configFileNameList").html(str);
			$("#ConfigFileModule")[0].style.display = "table";
			//阻止冒泡之后，无效模块点击的时候不会隐藏整个框；
			$("#configFileNameList")[0].onclick = function (e) {
				tool.stopPropagation(e);
			}
		} catch (e) {
			tool.alert(e.message, function () {
				win.appService.sendDataToApp(3999, "", "");
			});
		}
	}

	win.RMTClickEvent.ConfigFileModuleConfirm = function (idnexId, moduleInfo) {
		gIndexId = idnexId;
		gModuleInfo = moduleInfo;
		//如果显示内容是 所选模块无个性化功能设置 ，就直接return
		if (/所选模块/.test(moduleInfo)) {
			return;
		}
		$("#ConfigFileModule")[0].style.display = "none";
		tool.loading({text: "正在处理模块信息..."});
		win.devInterActive.Fun2703(gIndexId);
	};

	win.RMTClickEvent.ConfigFileModuleCancel = function () {
		$("#ConfigFileModule")[0].style.display = "none";
	};

	//兼容远程控制机，把点击的单选框框选
	win.RMTClickEvent.ConfigFileModuleCheckRadio = function (index) {
		var index_int = parseFloat(index);
		$("#ConfigFileModule").find("input[type='radio']")[index_int].checked = true;
	};

	win.devInterActive.Fun2703 = function (varRecvData) {
		//索引ID(十六进制字符串)
		//var varSendData = "{'subURL':'" + CONSTANT.SERVER_ADDRESS +
		// "','data':[{'ServerType':'23'},{'DataType':'4'},{'DataPack':'" + data + "'}]}";
		win.server.request(BMWF18ServerType, 4, varRecvData, win.serverRequestCallback.getKey_A100);
	};


	//        var keyboxdemo = [
	//            {"type":"01","code":"xxx...","length":"0200","crc":"9530"},
	//            {"type":"02","code":"xxx...","length":"0200","crc":"8704"},
	//            {"type":"03","code":"xxx...","length":"0400","crc":"76e3"}
	//        ];
	var keyBox;
	//密钥信息  字符串格式：密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]
	//PC应答：0x2703+索引ID(4B)+0x01(LAN密钥)+密钥位数m(2B)+密钥数据(nB)+密钥CRC16校验(2B)
	win.serverRequestCallback.getKey_A100 = function (responseObject, params) {

		keyBox = responseObject;
		handleKeySeries(keyBox, 0);

	};

	//处理并发送密钥到DEV
	function handleKeySeries(keyBox, index) {
		tool.loading({text: "正在处理密钥信息..."});
		var keyArr = keyBox || [];
		var type = keyArr[index].type || "FF";
		var code = keyArr[index].code || "FF";
		var len = keyArr[index].length || "FF";
		var crc = keyArr[index].crc || "FF";
		var command = "2703" + gIndexId + type + len + code + crc;
		win.sendDataToDev(command);
	}


	//分别发送3次密钥成功之后，最后一步把请求信息发送给设备验证，
	//验证成功之后，由APP端处理上传文件模块，
	//当APP处理成功之后，会在APP【端口6202】处返回【设备文件名】，
	//获取文件名之后，发送给服务器解析成菜单数据，由JS进行绑定
	win.devInterActive.Fun6703 = function (varRecvData) {
		var switchStr = varRecvData.substr(4, 4);
		var errText = "";
		try {

			switch (switchStr) {
				case "0101"://传输安全登录汽车密钥
					handleKeySeries(keyBox, 1);
					break;
				case "0201"://获取VCM信息签名密钥
					handleKeySeries(keyBox, 2);
					break;
				case "0301"://获取配置信息签名密钥

					var a = "310623630005000000f9070316083401810200840134008101000801300580000064013004800000640130038000005001300280000078013001800000780130008000007801";
					/**
					 * 8、读取模块配置信息:
					 * 0x3106+0x23(配置信息)+模块地址(1B)+SGBMID(8B)+设码地址数n(1B)+n*[设码地址(2B)+数据组类(1B)+名字(1B)+数据长度(2B)+设码状态(1B)]
					 * @SGBMID(8B) = 050000000F_005_021_005 = 05 0000000F 05 15 05
					 *     //“_005_021_005”这3段都是10进制，转换成16进制2位长度;
					 * @设码地址数n(1B) = hex(1B)
					 * @[设码地址(2B)+数据组类(1B)+名字(1B)+数据长度(2B)+设码状态(1B)] = responseData[setCodeInfo];
					 *
					 **/
					var SGBMID_HEAD = gModuleInfo.substr(0, 2);
					var SGBMID_MIDDLE = gModuleInfo.substr(2, 8);
					var SGBMID_LASTER1 = tool.toHex(parseInt(gModuleInfo.substr(11, 3)), 2);
					var SGBMID_LASTER2 = tool.toHex(parseInt(gModuleInfo.substr(15, 3)), 2);
					var SGBMID_LASTER3 = tool.toHex(parseInt(gModuleInfo.substr(19, 3)), 2);

					var setCodeLen = setCodeInfosBindOnModelInfo[gModuleInfo].length || 0;
					var setCodeStr = (function () {
						var len = setCodeLen;
						var tempStr = "";
						for (var i = 0; i < len; i++) {
							tempStr += setCodeInfosBindOnModelInfo[gModuleInfo][i];
						}
						return tempStr.trim();
					})();

					var cmdStr = "310623" +
						gModuleAddress + //模块地址(1B)
						SGBMID_HEAD + SGBMID_MIDDLE + SGBMID_LASTER1 + SGBMID_LASTER2 + SGBMID_LASTER3 + //SGBMID(8B)
						tool.toHex(setCodeLen, 2) + setCodeStr;  //设码地址数n(1B)+n*[设码地址(2B)+数据组类(1B)+名字(1B)+数据长度(2B)+设码状态(1B)]

					win.sendDataToDev(cmdStr);

					break;
				default ://密钥获取失败
					tool.alert("获取模块密钥失败,点击确定退出业务", function () {
						win.sendDataToDev(3999, "", "");
					});
					break;
			}

		} catch (e) {
			tool.alert(e.message, function () {
				win.appService.sendDataToApp(3999, "", "");
			});
		}
	};

	//把文件名打包发给服务器进行解析
	function SendDevFileNameToServer(dataPack) {

		win.server.request(
			BMWF18ServerType,
			1,
			dataPack,
			win.server.addCallbackParam(win.serverRequestCallback.bindFunctionSetData, [dataPack]),
			[SendDevFileNameToServer, quitBusiness]
		);
	}


	var originCurrentValueRelativeParameter = {};               //数据原型，绑定初始的parameter和currentValue
	win.serverRequestCallback.bindFunctionSetData = function (response, params) {
		tool.loading(0);


		var items = response.functionItems || [];

		var htmlStr = "";
		var name,           //名字属性
			desc,           //描述属性
			type,           //类型分 select和input 两种
			parameter,      //参数属性，以此值区别用户修改了哪个选项，以class的形式绑定在每一个TR标签
			childHtml,      //用于存储拼接 input和select标签
			maxValue,       //input的输入值的限定
			options,        //选项
			currentValue,   //用于匹配option当前的选项（16进制），或者输入框的当前值（转成10进制显示）
			regExp,         //用于匹配option当前的选项
			isSelected,     //用于匹配option当前的选项
			curItemInLoop;

		//第一个层级，绑定TITLE
		for (var i = 0; i < items.length; i++) {
			var infoItemsLen = items[i]["infoItems"].length || 0;

			//第一个层级，绑定TITLE，如果只有一项info，就直接绑定info
			if (infoItemsLen === 1) {
				curItemInLoop = items[i].infoItems[0];
				name = curItemInLoop.name;
				desc = curItemInLoop.description;
				type = curItemInLoop.type;
				parameter = curItemInLoop.parameter;
				maxValue = tool.hex2dec(curItemInLoop.maxValue);                //获取输入框的最大输入上限
				childHtml = "";
				options = curItemInLoop.options;

				currentValue = type === "select" ?
					curItemInLoop.currentValue :                    //如果是选择框类型，就直接取16进制key进行选项匹配，抓取当前显示值
					tool.hex2dec(curItemInLoop.currentValue);       //如果是输入框，就转成10进制；

				//regExp = new RegExp(currentValue);                                                  //用当前的值做匹配，设置option的selected的属性

				//把初始的值和Parameter进行关联；最后筛选出被改变的值，上传给服务器
				originCurrentValueRelativeParameter[parameter] = currentValue;

				switch (type) {
					case "select":
					{

						//如果当前值没有匹配到option的内容，就跳到下一个循环
						if (!checkOptionsValueWasRightOrWrong(options, currentValue))continue;

						//包头字段
						childHtml +=
							'<div class="item-select">' +
							'<label>' +
							'<select id="' + parameter + '" ' +
							'        class="item-select-change"' +
							'        onchange="global.RMTSelected_ForStringContact(this.id)">';

						//第三个层级，绑定options
						for (var k = 0; k < options.length; k++) {
							if (/\(/g.test(options[k].item)) {
								options[k].item = options[k].item.replace(/\(/, "-");
							}
							if (/\)/g.test(options[k].item)) {
								options[k].item = options[k].item.replace(/\)/, "");
							}
							if (/others/.test(options[k].key))continue;                          //当key为others的时候，值是”未定义“，不需要显示
							isSelected = currentValue == options[k].key ? "selected" : "";     //获取当前的选项值
							childHtml +=
								'<option' +
								'        value="' + options[k].key + '" ' + isSelected + '>' +
								options[k].item +
								'</option>';
						}


						//包尾字段
						childHtml += '</select></label></div>';
					}
						break;
					case "input":
						//输入项
					{
						childHtml =
							'<div class="item-input">' +
							'<label for="">' +
							'<input type="text" readonly ' +                //只读输入框，避免弹出键盘
							'       id="' + parameter + '" ' +              //设置ID号
							'       class="item-input-type-text" ' +        //class样式
							'       placeholder="' + maxValue + '" ' +      //预读值
							'       value="' + currentValue + '" >' +       //当前默认值
							'</input>' +
							'</label>' +
							'</div>';
					}
						break;
				}

				htmlStr += '<tr><td width="60%"><p>' + name + '</p><p class="item-notice">' + desc + '</p></td><td width="40%">' + childHtml + '</td></tr>';

			}
			else {
				//第一个层级，绑定TITLE
				var comment = items[i].comment;
				var fatherLevelDesc = items[i].description;

				htmlStr +=
					'<tr>' +
					'   <td colspan="2">' +
					'       <p style="font-size:1.6rem">' + comment + '</p>' +
					'       <p class="item-notice" style="font-size:1.4rem">' + fatherLevelDesc + '</p>' +
					'   </td>' +
					'</tr>';

				//第二个循环，循环绑定所有infoItems的数据
				for (var j = 0; j < infoItemsLen; j++) {
					curItemInLoop = items[i].infoItems[j];

					name = curItemInLoop.name;
					childHtml = "";
					type = curItemInLoop.type;
					parameter = curItemInLoop.parameter;
					desc = curItemInLoop.description;
					maxValue = tool.hex2dec(curItemInLoop.maxValue);
					options = curItemInLoop.options;

					currentValue = type === "select" ?
						curItemInLoop.currentValue :                    //如果是选择框类型，就直接取16进制key进行选项匹配，抓取当前显示值
						tool.hex2dec(curItemInLoop.currentValue);       //如果是输入框，就转成10进制；

					//regExp = new RegExp(currentValue);                              //用当前的值做匹配，设置option的selected的属性


					originCurrentValueRelativeParameter[parameter] = currentValue;  //把初始的值和Parameter进行关联；最后筛选出被【改变】的值，上传给服务器

					switch (type) {
						case "select":
						{


							if (!checkOptionsValueWasRightOrWrong(options, currentValue))continue;  //如果当前值没有匹配到option的内容，就跳到下一个循环

							childHtml +=
								'<div class="item-select">' +
								'<label>' +
								'<select id="' + parameter + '"' +
								'        class="item-select-change"' +
								'        onchange="global.RMTSelected_ForStringContact(this.id)">';

							for (var l = 0; l < options.length; l++) {                              //第三个循环,option
								if (/\(/g.test(options[l].item)) {
									options[l].item = options[l].item.replace(/\(/, "-");
								}
								if (/\)/g.test(options[l].item)) {
									options[l].item = options[l].item.replace(/\)/, "");
								}

								if (/others/.test(options[l].key))continue;                          //当key为others的时候，值是”未定义“，不需要显示
								isSelected = currentValue == options[l].key ? "selected" : "";         //获取当前的选项值
								childHtml +=
									'<option' +
									'        value="' + options[l].key + '" ' + isSelected + '>' +
									options[l].item +
									'</option>';
							}

							childHtml += '</select></label></div>';
						}
							break;

						case "input":
						{
							childHtml =
								'<div class="item-input">' +
								'<label>' +
								'<input type="text" readonly ' +
								'       id="' + parameter + '" ' +
								'       class="item-input-type-text" ' +
								'       placeholder="' + maxValue + '" ' +
								'       value="' + currentValue + '" >' +
								'</input>' +
								'</label>' +
								'</div>';
						}
							break;

					}
					htmlStr +=
						'<tr>' +
						'<td width="60%">' +
						'<p style="padding-left:2rem">' + name + '</p>' +
						'<p style="padding-left:2rem" class="item-notice">' + desc + '</p>' +
						'</td>' +
						'<td width="40%">' + childHtml +
						'</td>' +
						'</tr>'
				}

			}

		}

		$("#moduleInfo_title").html(gModuleInfo);
		$("#functionSetBody").html(htmlStr);
		//tool.processBar("");
		selectChange();
		tool.layout("module", 0);
		tool.bottomBtn({
			btn1Text: "确定",
			btn1Callback: function () {
				handleFunctionSet()
			},
			btn2Text: "返回",
			btn2Callback: function () {
				loopTrigger('functionSet');//传ID
			}
		});

		tool.layout("functionSet", 1);
	};

	//检查option选项有没有匹配到当前值，如果没有，就返回假，如果有，就返回真
	function checkOptionsValueWasRightOrWrong(option_arr, curValue) {
		var flag = false;
		var len = option_arr.length;
		while (len--) {
			if (curValue == option_arr[len].key) {
				flag = true;
				break;
			}
		}
		return flag;
	}

	//监听菜单修改情况，存储到cacheChangeItemByFlagOfParameter和cacheChangeItemByFlagOfParameter；
	var cacheChangeItemByFlagOfParameter = {};
	function selectChange() {
		//不在字串拼接时使用“onchange”事件的原因在于，兼容性的解决太麻烦
		$(".item-select-change").on("change", function (e) {
			var cur = e.currentTarget;
			var parameter = $(cur).prop("id");
			win.RMTClickEvent.handleSelectEvent(parameter);
		});

		$(".item-input-type-text").on("click", function (e) {
			var cur = e.currentTarget;
			var parameter = $(cur).prop("id");
			var val = $(cur).prop("placeholder");
			win.RMTClickEvent.iScrollPluginDigit(parameter, val, function () {
				cacheChangeItemByFlagOfParameter[parameter] = document.getElementById(parameter).value;           //由于INPUT onchange方法不监听脚本操作，所以，只有在插件操作之后添加回调
			});
		});
	}

	win.RMTClickEvent.handleSelectEvent = function (parameter) {
		cacheChangeItemByFlagOfParameter[parameter] = document.getElementById(parameter).value;
	};

	//tips方法已经集成RMT转发事件，如果再使用RMTClickEvent对象，就会造成两次转发；
	function loopTrigger() {
		cacheChangeItemByFlagOfParameter = {};
		tool.layout('functionSet', 0);
		tool.layout("module", 1);
	}

	//给tool.alert绑定回调使用的方法
	function quitBusiness() {
		win.sendDataToDev("3109FF");
	}

	//当菜单页点击确定按钮后，
	//通过tool.objToArr方法把 cacheChangeItemByFlagOfParameter 和 originCurrentValueRelativeParameter 存储的数据，解析成拥有键值对的数组；
	//然后过滤掉重复值，逐个PUSH进dataPack，发给服务器进行计算；
	function handleFunctionSet() {

		var dataPack = {
			address: gModuleAddress,
			devFileName: gDevFilName,
			configFileName: gModuleInfo,
			parameterItems: []
		};

		//cacheChangeItemByFlagOfParameter;
		//originCurrentValueRelativeParameter;
		//遍历两个对象的parameter属性，把值相同的过滤掉；组成
		// {
		//   "parameter": "yyyyyyyy",
		//   "menuValue": "01"
		// }
		// 的形式
		var newChangeItemParameter = tool.objToArr(cacheChangeItemByFlagOfParameter, "parameter", "menuValue");
		var newOriginParameter = tool.objToArr(originCurrentValueRelativeParameter, "parameter", "menuValue");
		var i = newChangeItemParameter.length;
		while (i--) {
			var j = newOriginParameter.length;
			while (j--) {
				if (newChangeItemParameter[i].parameter === newOriginParameter[j].parameter &&
					newChangeItemParameter[i].menuValue !== newOriginParameter[j].menuValue) {
					var decValue = newChangeItemParameter[i].menuValue;
					newChangeItemParameter[i].menuValue = tool.toHex(decValue, 2);
					dataPack.parameterItems.push(newChangeItemParameter[i]);
				}
			}
		}

		tool.loading({text: "正在将个性化设置参数写入车辆，请稍后..."});

		win.server.request(BMWF18ServerType, 2, dataPack, win.serverRequestCallback.moduleModifyResult);

		dataPack.parameterItems.length = 0;
	}

	//获取修改后的文件数据，通过6203端口交给APP进行处理；
	//最后根据设备端口6202反馈的结果，进行应答
	win.serverRequestCallback.moduleModifyResult = function (response, params) {

		var setCodeData = response.setCodeData || "";
		isFunctionSet = true;
		isModuleSelect = false;
		win.appService.sendDataToApp(6203, setCodeData, "hasModify");
		/**请求下载(PC)	0x2108+文件名ASCII(32B)+文件大小(4B)+MD5值(16B)+加密类型(2B)+文件类型(2B)
		 * 服务器已经把修改的数据全部修改成了 [文件名ASCII(32B)+文件大小(4B)+MD5值(16B)+加密类型(2B)+文件类型(2B)] 这种格式
		 */
		//requestUploadFile(setCodeData,"2108");
	};

	function requestUploadFile(data,prevCmd){
		var i = 0;
		i += 8;
		gFileNameASCII = data.substr(i + 32 * 2); 		//文件名,asc类型(32B)
		i += 32 * 2;
		gFileLen = data.substr(i + 4 * 2);         //文件长度(4B)
		i += 4 * 2;
		gFileMD5 = data.substr(i + 16 * 2);        //MD5值,长度(16B)
		i += 16 * 2;
		gFileEncodeType = data.substr(i + 2 * 2);  //加密类型,长度(2B)
		i += 2 * 2;
		gFileType = data.substr(i + 2 * 2);        //文件类型(2B)
		gUploadTime++;
		win.sendDataToDev(prevCmd + gFileNameASCII + gFileLen + gFileMD5 + gFileEncodeType + gFileType);
	}


	//isFunctionSet代表菜单设置后的6202设备应答，
	//isModuleSelect代表模块选择后的6202设备应答
	win.devInterActive.Fun6202 = function (varRecvData) {
		if (varRecvData.substr(4, 2) == "01") {

			//如果是功能设置菜单之后返回的6202，就通知设备设置修改完成
			//0x3106+0x0F(写入参数)+地址(1B)+索引ID[4B]
			if (isFunctionSet && !isModuleSelect) {
				gUploadTime = 0;
				Fun31060F();
			}

			//如果是上传模块配置信息文件返回的6202,就把文件名上传给服务器
			//else{
			//	gDevFilName = tool.decodeASC(gFileNameASCII);
			//	var dataPack = {
			//		address: gModuleAddress,
			//		configFileName: gModuleInfo,
			//		devFileName: gDevFilName
			//	};
			//
			//	SendDevFileNameToServer(dataPack);
			//}
		}
		else {
			//校验文件失败之后,重新上传;
			//if (gUploadTime < 3) {
			//	gUploadTime++;
			//	win.sendDataToDev("2107" + gFileNameASCII + gFileLen + gFileMD5 + gFileEncodeType + gFileType);
			//}
			//else {
			//	tool.alert("上传文件校验失败", function () {
			//		quitBusiness();
			//	})
			//}
		}
	};

	function Fun31060F() {
		var address = gModuleAddress;
		var indexID = gIndexId;
		var pre = "31060F";
		var CMDStr = pre + address + indexID;
		win.sendDataToDev(CMDStr);
	}

	var calcLen = 0;
	//上传模块数据
	//DEV应答：0x6201+[01(成功)+起始地址(4B)+数据长度(4B)+数据(0 ～1024)]/02(失败)
	win.devInterActive.Fun6201 = function (varRecvData) {
		//if (varRecvData.substr(4, 2) == "01") {
		//	var avoidLen = 4 + 2 + 4 * 2 + 4 * 2;
		//	var result = varRecvData.substr(avoidLen);
		//	calcLen += result.length / 2;
		//
		//	//逐步增加返回的数据长度
		//	if (calcLen <= tool.hex2dec(gFileLen)) {
		//		win.sendDataToDev("2201" + tool.toHex(calcLen, 8) + gFileLen);//开始起始位置是8位0,然后根据6201返回的长度,逐一增加
		//	}
		//	else {
		//		/**传输结束(PC)	0x2202+文件名(32B)+文件大小(4B)+MD5值(16B)(为PC计算的MD5值)
		//		 * 注：(1)传输结束后PC需要校验文件的名称/大小/MD5值，失败则PC重新请求上传文件；
		//		 */
		//		calcLen = 0;
		//		win.sendDataToDev("2202" + gFileNameASCII + gFileLen + gFileMD5);
		//	}
		//}
		//else {
		//	tool.alert("上传模块配置数据失败", function () {
		//		quitBusiness();
		//	});
		//}
	};
	win.global.A100GetDevFileName = function(fileName){
			gDevFilName = fileName;
			var dataPack = {
				address: gModuleAddress,
				configFileName: gModuleInfo,
				devFileName: gDevFilName
			};

			SendDevFileNameToServer(dataPack);
	};

	//请求下载模块数据;
	win.devInterActive.Fun6108 = function (varRecvData) {
		//if (varRecvData.substr(4, 2) == "01") {
		//	win.sendDataToDev("2203" + tool.toHex(loopIndex,8) + gFileLen + tool.toHex(1024,8));
		//	loopIndex = loopIndex + 1024;   //固定每次下载1024字节长度
		//}
		//else {
		//	tool.alert("下载模块配置数据失败", function () {
		//		quitBusiness();
		//	});
		//}
	};

	//下载模块数据
	var loopIndex = 0;
	//传输数据(PC)	0x2203+起始地址(4B)+数据长度(4B)+数据(0～1024)
	win.devInterActive.Fun6203 = function (varRecvData) {
		//if (varRecvData.substr(4, 2) == "01") {
		//
		//	//如果循环下标小于总长度,就继续传输数据,否则就代表传输完毕
		//	if(loopIndex < tool.hex2dec(gFileLen)){
		//
		//		//如果循环下标还可以塞下1024的长度,就使用1024长度,否则就使用剩下的长度
		//		if(tool.hex2dec(gFileLen) - loopIndex >= 1024){
		//			win.sendDataToDev("2203" + tool.toHex(loopIndex,8) + gFileLen + tool.toHex(1024,8));
		//			loopIndex = loopIndex + 1024;
		//		}else{
		//			win.sendDataToDev("2203" + tool.toHex(loopIndex,8) + gFileLen + tool.toHex(tool.hex2dec(gFileLen) - loopIndex,8));
		//			loopIndex = tool.hex2dec(gFileLen);
		//		}
		//	}else{
		//		loopIndex = 0;
		//		win.sendDataToDev("2202" + gFileNameASCII + gFileLen + gFileMD5);
		//	}
		//}
		//else {
		//	tool.alert("下载模块配置数据失败", function () {
		//		quitBusiness();
		//	});
		//}
	};

	//传输数据(PC)	0x2201+起始地址(4B)+数据长度(4B)
	win.devInterActive.Fun6107 = function (varRecvData) {

		//if (varRecvData.substr(4, 2) == "01") {
		//	win.sendDataToDev("2201" + "00000000" + gFileLen);//开始起始位置是8位0,然后根据6201返回的长度,逐一增加
		//}
		//else {
		//	tool.alert("上传模块配置数据失败", function () {
		//		quitBusiness();
		//	});
		//}
	};

})(window);
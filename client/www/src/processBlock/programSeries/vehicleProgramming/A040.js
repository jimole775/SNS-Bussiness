/**
 * Created by Andy on 2016/7/20.
 */
(function (win) {
	//初始化------------------------------------------------------start
	var gDatabaseVersion = "";

	var gFileType = "";								//记录文件类型
	var gIndexId = "";								//记录索引ID
	var gCarTypeId = "";							//记录要显示车辆类型的控件ID

	var gProcessName = "";							//打印编程进度开关，名字变化则打印

	var gdownloadFilesName = '';					//缓存编程文件下载到手机端时文件名与文件大小
	var gdownloadFilesNum = 0;						//缓存编程文件下载到手机端时文件数量
	var gdownloadFilesNumHex = '0x00';				//缓存编程文件下载到手机端时文件数量，16进制
	win.global.FileSystemFinalUrl = "";             //缓存当前目录

	var gTypeMap = {"01": "BTLD", "02": "SWFL", "03": "CAFD"};	//编程文件类型

	var gmoduleInfosMap = {};						//缓存模块信息，以模块地址作为key

	//缓存ProcessClass对照表，以模块名称作为key，value为十进制，使用时转为十六进制
	var gProcessClassMap = {
		"HWEL": "1", "HWAP": "2", "HWFR": "3", "GWTB": "4", "CAFD": "5", "BTLD": "6", "SWFL": "8",
		"SWFF": "9", "SWPF": "10", "ONPS": "11", "FAFP": "15", "TLRT": "26", "TPRG": "27", "FLSL": "7",
		"IBAD": "12", "FCFA": "16", "ENTD": "160", "NAVD": "161", "FCFN": "162", "SWIP": "193", "SWUP": "192",
		"BLUP": "28", "FLUP": "29"
	};

	//缓存ProcessClass对照表，以ProcessClass作为key，value为模块名称, 如果不存在，则显示Unknown,限定属性名为大写
	var gModuleNameMap = {
		"01": "HWEL", "02": "HWAP", "03": "HWFR", "04": "GWTB", "05": "CAFD", "06": "BTLD", "08": "SWFL",
		"09": "SWFF", "0A": "SWPF", "0B": "ONPS", "0F": "FAFP", "1A": "TLRT", "1B": "TPRG", "07": "FLSL",
		"0C": "IBAD", "10": "FCFA", "A0": "ENTD", "A1": "NAVD", "A2": "FCFN", "C1": "SWIP", "C0": "SWUP",
		"1C": "BLUP", "1D": "FLUP"
	};

	//显示数据库版本列表
	win.serverRequestCallback.showDatabaseVersion_A040 = function (recvData,params) {
		try {
			var statStr = "选择数据库版本";
			//var varJson = JSON.parse (getBse64Decode (recvData));	//数量（2B）+长度（2B）+数据库版本（LB）
			var strHtml = '';
			tool.loading(0);
			//if (varJson.CODETYPE == 'OK') {

				//var varData = tool.HexUnicodeToString (varJson.CODEDATA);
				//var jsonData = JSON.parse (varData);
				var jsonData = recvData;

				var version = "";
				var isChecked = "";
				for (var i = 0; i < jsonData.length; i++) {
					isChecked = !i ? "checked" : "";         //默认勾选最新版本（第一个）
					version = jsonData[i].dataVersion;
					strHtml +=
						'<tr>' +
						'   <td class="t-center">' +
						'       <label style="display: block">' +
						'           <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'                   type="radio" ' +
						'                   name="dbOption" ' +
						'                   id="dbOption' + i + '" ' +
											isChecked +
						'                   value="' + version + '" />' +
						'       </label>' +
						'   <td >' +
						'   <label style="display: block;" for="dbOption' + i + '">' +
						'       <p class="box-p">' +
									version +
						'       </p>' +
						'   </label>' +
						'   </td>' +
						'</tr>';
				}

				$ ("#dbVersionList").html (strHtml);

				tool.bottomBtn({
					btn1Text:"确定",
					btn1Callback:function(){
						fun710542('01','database');
					},
					btn2Text:"取消",
					btn2Callback:function(){
						fun710542('02','database');
					}
				});

				tool.layout ("database", 1);

				tool.inputStyleModify ("dbVersionList", "radio");
				//tool.processBar (statStr);

			//}
			//else {
			//	tool.alert(varJson.CODEDATA,function(){
			//		win.sendDataToDev("71054202");
			//	});
			//}
		} catch (e) {
			tool.alert("解析数据库版本异常",function(){
				win.sendDataToDev("71054202");
			});
		}
	};

	//[{"code":" 1"  ,  " modelName":" cas3"  ,  ”address”:”00” ,  "modelInfos": [{“modelInfo”:”
	// CAFD_0000000F_005_021_005”} ,…]  },…]
	win.serverRequestCallback.showModules_A040 = function (recvData,params) {
		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));
			//var strHtml = '';
			tool.loading(0);
			//if (varJson.CODETYPE == 'OK') {

				//var varData = tool.HexUnicodeToString (varJson.CODEDATA);

				//var jsonData = JSON.parse (varData);
				var jsonData = recvData;

				var code = '';
				var modelName = '';
				var address = '';

				for (var i = 0; i < jsonData.length; i++) {

					code = jsonData[i].code;
					modelName = jsonData[i].modelName;
					address = jsonData[i].address;

					gmoduleInfosMap[address] = jsonData[i].modelInfos;	//缓存模块信息

					strHtml +=
						'<tr>' +
						'   <td class="t-center"><span class="disable-text">' + code + '</span></td>' +
						'   <td class="t-center"><span class="disable-text">' + address + '</span></td>' +
						'   <td class="menu-hint-pev" onclick="RMTClickEvent.viewVersion(' + "'" + address + "'" + ')">' +
						'       <span id="moduleName' + address + '">' + modelName + '</span>' +
						'       <i class="menu-hint"></i>' +
						'   </td>' +
						'   <td class="t-center">' +
						'       <label style="display:block">' +
						'           <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'                   type="radio" ' +
						'                   style="width:100%;margin:0;" ' +
						'                   name="moduleOption" ' +
						'                   id="moduleOption' + i + '" ' +
						'                   value="' + address + '"/>' +
						'       </label>' +
						'   </td>' +
						'</tr>';
				}


				$ ("#moduleList").html (strHtml);

				tool.bottomBtn({
					btn1Text:"确定",
					btn1Callback:function(){
						fun71052C("01");
					},
					btn2Text:"取消",
					btn2Callback:function(){
						fun71052C("02");
					}
				});
				tool.layout ("module", 1);

				tool.inputStyleModify ("moduleList", "radio");
				//tool.processBar ("");

			//}
			//else {
			//	console.log ('解析模块列表异常:' + varJson.CODEDATA);
			//	tool.processBar ('解析模块列表异常');
				//tool.alert(varJson.CODEDATA,function(){
				//	win.sendDataToDev("71052C02");
				//});
			//}
		} catch (e) {
			console.log ('解析模块列表异常');
			//tool.processBar ('解析模块列表异常');
			tool.alert('解析模块列表异常',function(){
				win.sendDataToDev("71052C02");
			});
		}
	};

	//编辑模块版本
	//[{"SGBMVersion":" CAFD_0000000F_005_021_005"} ,…….]
	win.serverRequestCallback.editModules_A040 = function (recvData,params) {
		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));
			var strHtml = '';
			tool.loading(0);
			//if (varJson.CODETYPE == 'OK') {

				//var varData = tool.HexUnicodeToString (varJson.CODEDATA);
				//var jsonData = JSON.parse (varData);
				var jsonData = recvData;

				var suffix = '';
				var version = '';

				if (!jsonData.length) {
					strHtml += '<p class="box-p">查询不到相关模块版本</p>';
				}
				else {
					for (var i = 0; i < jsonData.length; i++) {
						version = jsonData[i].SGBMVersion;
						var isChecked = ($("#curModuleVersion").text() == version) ? "checked" :"";        //默认勾选当前版本；
						strHtml +=
							'<tr>' +
							'   <td width="80%">' +
							'   <label style="display:block" for="edit' + i + '">' +
							'       <p class="box-p">' +
										version +
							'       </p>' +
							'   </label>' +
							'   </td>' +
							'   <td width="20%">' +
							'       <label style="display:block">' +
							'           <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
							'                  type="radio" ' +
							'                  name="edit" ' +
							'                  id="edit' + i + '" ' +
											   isChecked +
							'                  value="' + version + '"/>' +
							'       </label>' +
							'   </td>' +
							'</tr>'
					}
				}

				$ ("#moduleEditList").html ('<table>' + strHtml + '</table>');

				tool.layout ("moduleSelect", 0);
				tool.bottomBtn({
					btn1Text:"确定",
					btn1Callback:function(){
						funModuleEdit("01");
					},
					btn2Text:"返回",
					btn2Callback:function(){
						funModuleEdit("02");
					}
				});
				tool.layout ("moduleEdit", 1);

				tool.inputStyleModify ("moduleEditList", "radio");
			//}
			//else {
			//	tool.alert (varJson.CODEDATA,function(){
			//		tool.layout ("moduleEdit", 0);
			//		tool.bottomBtn({
			//			btn1Text:"增加",
			//			btn1Callback:function(){
			//				addModuleVersion();
			//			},
			//			btn2Text:"编程",
			//			btn2Callback:function(){
			//				fun710536("01");
			//			},
			//			btn3Text:"编程",
			//			btn3Callback:function(){
			//				fun710536("02");
			//			}
			//		});
			//		tool.layout ("moduleSelect", 1);
			//	});
			//}
		} catch (e) {
			tool.alert ("模块解析异常",function(){
				tool.layout ("moduleEdit", 0);

				tool.bottomBtn({
					btn1Text:"增加",
					btn1Callback:function(){
						addModuleVersion();
					},
					btn2Text:"编程",
					btn2Callback:function(){
						fun710536("01");
					},
					btn3Text:"编程",
					btn3Callback:function(){
						fun710536("02");
					}
				});
				tool.layout ("moduleSelect", 1);
			});
		}
	};

	//检查模块版本回调ID
	win.serverRequestCallback.checkModule_A040 = function (recvData,params) {

		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));

			//if (varJson.CODETYPE == 'OK') {

				//var flag = tool.HexUnicodeToString (varJson.CODEDATA);
				//var flag = recvData;
				//todo 处理不同类型的ajax数据类型
				if (recvData == {blean:"true"}) {
					var input = $ ("#moduleInput").val ().toUpperCase ();

					//将文件插入列表
					var rowHtml =
						'<tr  id="tr_' + input + '">' +
						'   <td class="t-center-cbx" width="15%">' +
						'   <label style="display: block">' +
						'       <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'               type="checkbox"' +
						'               style="padding:8px;" ' +
						'               name="moduleCheckbox" ' +
						'               id="module' + input + '" ' +
						'               value="' + input + '"/>' +
						'   </label>' +
						'   </td>' +
						'   <td  width="55%" id="' + input + '">' +
						'       <label style="display:block" for="module' + input + '">' +
						input +
						'       </label>' +
						'   </td>' +
						'   <td width="15%" onclick="RMTClickEvent.editVersion(\'' + input + '\')">' +
						'       <p class="box-p">编辑</p>' +
						'   </td>' +
						'   <td width="15%" onclick="RMTClickEvent.confirmMsg(null, null, global.delVersion,\'' + input + '\')">' +
						'        <p class="box-p">删除</p>' +
						'   </td>' +
						'</tr>';

					$ ("#moduleInfosSelect").append (rowHtml);
					tool.inputStyleModify ("moduleInfosSelect", "checkbox");
					tool.popShow ("addModule", 0);
				}
				else {
					tool.warnTip ("#moduleInput", "文件不存在");
				}

			//}
			//else {
			//	tool.log ('解析文件检查结果异常:' + varJson.CODEDATA);
			//	tool.alert (varJson.CODEDATA,function(){
			//	});
			//}
		} catch (e) {
			tool.log ('解析文件检查结果异常:[' + e.message + ']');
			tool.alert ("解析文件检查结果异常",function(){
			});
		}
	};

	//编程文件信息回调
	//[{"fileSize":"1024","fileName":"95645.0pd" ,"MD5":"53568996523423512362323654665456"} ,
	// {"fileSize":"1024","fileName":"95645.0pd","MD5":"53568996523423512362323654665456" } , …..]
	// PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
	win.serverRequestCallback.getProgramFiles_A040 = function (recvData,params) {
		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));

			//if (varJson.CODETYPE == 'OK') {

				//var varData = tool.HexUnicodeToString (varJson.CODEDATA);

				if (!recvData.length) {
					tool.log ("查找不到对应的编程文件");
					tool.processBar ("查找不到对应的编程文件");
					win.sendDataToDev ("6106" + gFileType + "02");
					return;
				}

				var jsonData = recvData;

				var files = "";
				var fileName = "";

				for (var i = 0; i < jsonData.length; i++) {

					fileName = jsonData[i].fileName.toLowerCase ();

					files += tool.ascToHexByLen (fileName, 32).substr (0, 64) + tool.toHex (jsonData[i].fileSize, 8) + jsonData[i].MD5.toUpperCase ();
				}

				var command = "6106" + gFileType + "01" + tool.toHex (jsonData.length, 4) + files;

				win.sendDataToDev (command);

			//}
			//else {
			//	console.log ("获取编程文件失败");
				//tool.processBar ("获取编程文件失败");
				//tool.alert(varJson.CODEDATA,function(){
				//	win.sendDataToDev ("6106" + gFileType + "02");
				//});
			//}
		} catch (e) {
			//console.log ('解析编程文件信息异常:' + "[" + e.message + "]");
			//tool.processBar ("获取编程文件失败");
			tool.alert("获取编程文件失败",function(){
				win.sendDataToDev ("6106" + gFileType + "02");
			});
		}
	};

	//密钥信息  字符串格式：                               密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]
	//PC应答：0x6703+索引ID(4B)+{01(成功)+密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]}/02(失败)
	win.serverRequestCallback.getKey_A040 = function (recvData,params) {
		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));

			//if (varJson.CODETYPE == 'OK') {

				var keys = recvData;

				var command = "6703" + gIndexId + "01" + keys;

				win.sendDataToDev (command);

			//}
			//else {
			//	tool.log ('获取密钥信息失败:' + recvData);
			//	tool.processBar ("获取密钥信息失败");
				//tool.alert(varJson.CODEDATA,function(){
				//	win.sendDataToDev ("6703" + gIndexId + "02");
				//});
			//}

		} catch (e) {
			//tool.log ('解析密钥信息异常:' + "[" + e.message + "]");
			//tool.processBar ("解析密钥信息异常");
			tool.alert("解析密钥信息异常",function(){
				win.sendDataToDev ("6703" + gIndexId + "02");
			});
		}
	};


	//获取车辆类型
	win.serverRequestCallback.showCarType_A040 = function (recvData,params) {
		try {
			var targetId = "#" + gCarTypeId;

			//var varJson = JSON.parse (getBse64Decode (recvData));

			//if (varJson.CODETYPE == 'OK') {

				var type = recvData;
				$ (targetId).html ("车辆类型：" + type);

			//}
			//else {
			//	$ (targetId).html ("车辆类型：未知");
			//}

		} catch (e) {
			$ ("#" + gCarTypeId).html ("车辆类型：未知");
		}
	};


	//OBD响应
	win.devInterActive.Fun3105 = function (recvData) {
		var strCommand = recvData.substr (4, 2);

		switch (strCommand) {
			case '42':
				Fun310542 (recvData);		//选择编程数据库
				break;
			case '40':
				tool.loading(0);

				tool.bottomBtn({
					btn1Text:"确定",
					btn1Callback:function(){
						fun710540("01");
					},
					btn2Text:"取消",
					btn2Callback:function(){
						fun710540("02");
					}
				});

				tool.layout ("faSelect", 1);	//获取FA文件
				tool.inputStyleModify ("faSelect", "radio");
				break;
			case '41':
				tool.loading (0);
				//tool.processBar ("");

				tool.bottomBtn({
					btn1Text:"确定",
					btn1Callback:function(){
						fun710541("01");
					},
					btn2Text:"取消",
					btn2Callback:function(){
						fun710541("02");
					}
				});

				tool.layout ("svtSelect", 1);	//获取SVT文件
				tool.inputStyleModify ("svtSelect", "radio");
				break;
			case '2C':
				Fun31052C (recvData);		//选择编程模块
				break;
			case '39':
				Fun310539 (recvData);		//模块信息显示
				break;
			case '36':
				Fun310536 (recvData);		//获取编程版本
				break;
			case '0E':
				Fun31050E (recvData);		//确认继续编程
				break;
		}
	};

	//选择编程数据库	0x3105+0x42(选择数据库)	PC应答：0x7105+42+01(确定)/02(取消)
	function Fun310542 (recvData) {

		//调服务器接口  默认选择版本最新数据库
		//var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"1"},{DataPack:"0"}]});
		//external.RequestDataFromServer (3021, varSendData, getDatabaseCallBack);

		win.server.request(17,1,{DataPack:0},win.serverRequestCallback.showDatabaseVersion_A040)
	}

	function fun710542(option, database) {

		if (option === "02") {
			tool.loading ({text: "正在退出业务..."});
			//tool.processBar ("结束业务");
		}

		var inputs = $ ("#" + database).find ("input");
		var l = inputs.length;
		var isChecked;
		while (l--) {
			if (inputs[l].checked) {                    //首先判断这组radio是否已经有checked选项，避免出现两个checked的样式（虽然不会有两个checked值）
				isChecked = true;
				break;
			}
		}

		if (isChecked) {
			win.sendDataToDev ("710542" + option);
			//tool.processBar ("");
			tool.layout ("database", 0);
		}
		else {

			//tool.processBar ("**请先选择数据库");
		}

	};

	//获取FA文件	0x3105+0x40(获取FA文件)	PC应答：0x7105+40+[01(确定)+01(读取)/02(加载)]/02(取消)
	function fun710540(option) {
		if (option == "01") {

			var input_checked = tool.getCheckedElement ("fa");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");
			var method = input_checked.value;
			var statStr = "";
			if (method == "01") {
				tool.log ("从汽车读取FA文件");
				statStr = "从汽车读取FA文件";
				win.sendDataToDev ("7105400101");
				tool.loading ({text: "从汽车读取FA文件..."})
			}
			if (method == "02") {
				//浏览文件再应答 调APP接口
				$ ("#fileSelectType").html ("FA");
				$("#lastBoxId").html("faSelect");//记录最后一个盒子的ID，到文件系统点击返回时会用到
				tool.log ("从本地加载FA文件");
				statStr = "从本地加载FA文件";
				win.appService.sendDataToApp (3029, '{"ope":0}', win.serverRequestCallback.requestDir);
			}
		}
		if (option == "02") {
			tool.loading ({text: "正在退出业务..."});
			win.sendDataToDev ("71054002");
		}
		tool.layout ("faSelect", 0);
		//tool.processBar (statStr);
	}

	//获取SVT文件	0x3105+0x41(获取SVT文件)	PC应答：0x7105+41+[01(确定)+01(完全)/02(快速)/03(加载)]/02(取消)
	function fun710541(option) {
		if (option == "01") {

			var input_checked = tool.getCheckedElement ("svt");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");
			var method = input_checked.value;
			var statStr = "";
			switch (method) {
				case "01":
					tool.log ('从VCM读取SVT文件');
					statStr = 'VCM文件列表';
					win.sendDataToDev ("7105410101");
					tool.loading ({text: "正在加载SVT文件..."});
					break;
				case "02":
					tool.log ('从ECU读取SVT文件');
					statStr = 'ECU文件列表';
					win.sendDataToDev ("7105410102");
					tool.loading ({text: "正在加载SVT文件..."});
					break;
				case "03":
					//浏览文件再应答 调APP接口
					$ ("#fileSelectType").html ("SVT");
					$("#lastBoxId").html("svtSelect");//记录最后一个盒子的ID，到文件系统点击返回时会用到
					tool.log ('从本地加载SVT文件');
					statStr = '本地文件列表';
					win.appService.sendDataToApp (3029, '{"ope":0}', win.serverRequestCallback.requestDir);
					break;
			}


		}
		else {
			tool.loading ({text: "正在退出业务..."});
			win.sendDataToDev ("71054102");
		}
		tool.layout ("svtSelect", 0);
	}

	//车辆类型解码
	function decodeCarType (carType, carTypeId) {

		gCarTypeId = carTypeId;

		var paramData = getBse64Encode (carType);
		//var param = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'8'},{'DataPack':'" + paramData + "'}]}";
		//var param = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"8"},{DataPack: paramData }]});
		//external.RequestDataFromServer (3021, param, getCarTypeCallBack);
		win.server.request(17,8,{DataPack:paramData},win.serverRequestCallback.showCarType_A040)
	}

	//选择编程模块	0x3105+0x2C(模块选择)+车辆类型ASCII(4B)+车架号ASCII(17B)
	function Fun31052C (recvData) {

		var carType = recvData.substr (6, 4 * 2);
		var carFrameNum = tool.hex2a (recvData.substr (14, 17 * 2));

		//$("#carType").html("车辆类型：" + carType);
		$ ("#carFrameNum").html ("车架号：" + carFrameNum);

		//获取车辆类型
		decodeCarType (carType, "carType");

		//TODO 解析SVT文件  调服务器接口 参数为数据库版本

		var input_checked = tool.getCheckedElement ("dbOption");
		if (!input_checked) {
			//tool.processBar ("请选择一个选项");
			return
		}
		//tool.processBar ("");
		gDatabaseVersion = input_checked.value;

		tool.loading ({text: "获取模块信息..."});
		//tool.processBar ("获取模块信息...");

		var data = getBse64Encode (gDatabaseVersion);

		//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'2'},{'DataPack':'" + data + "'}]}";
		//var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"2"},{DataPack: data }]});
		//external.RequestDataFromServer (3021, varSendData, getModulesCallBack);

		win.server.request(17,2,{DataPack:data},win.serverRequestCallback.showModules_A040)
	}


	//选择编程模块  PC应答：0x7105+2C+[01(确定)地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)]/02(取消)
	win.RMTClickEvent.fun71052C = function (option) {

		if (option == "01") {

			var input_checked = tool.getCheckedElement ("moduleOption");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");
			var address = input_checked.value;

			var moduleInfos = gmoduleInfosMap[address];

			var nSGBMID = versionToSGBMID (moduleInfos);

			var command = "71052C01" + address + tool.toHex (moduleInfos.length, 4) + nSGBMID;

			win.sendDataToDev (command);
		}

		if (option == "02") {
			tool.loading ({text: "正在退出业务..."});
			tool.layout ("module", 0);
			tool.log ("用户取消操作");
			win.sendDataToDev ("71052C02");
		}
	};

	//查看模块信息  版本由SGBMID转换得到，转换方法见“宝马F系单编逆向说明文档.doc”说明。
	win.RMTClickEvent.viewVersion = function (address) {
		var moduleName = $ ("#moduleName" + address).html ();
		$ ("#moduleTitle").html (moduleName + "[" + address + "]模块信息");

		//从缓存取，循环插入
		var moduleInfos = gmoduleInfosMap[address];
		var strHtml = "";

		for (var i = 0; i < moduleInfos.length; i++) {
			strHtml += "<li><p class='box-p'>" + moduleInfos[i].modelInfo.toUpperCase () + "</p></li>";
		}
		$ ("#moduleInfos").html (strHtml);
		tool.popShow ("moduleVersion", 1);

	};

	win.RMTClickEvent.versionReturn = function () {
		tool.popShow ("moduleVersion", 0);
	};


	//模块信息显示
	// 模块信息显示	0x3105+0x39+车辆类型ASCII(4B)+车架号ASCII(17B)+模块ID(4B)+地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)	PC应答：0x7105+39+01(继续)/02(取消)
	function Fun310539 (recvData) {
		tool.loading(0);
		try {
			//var offset = 0;
			var carType = recvData.substr (6, 4 * 2);
			var carFrameNum = tool.hex2a (recvData.substr (14, 17 * 2));
			var address = recvData.substr (56, 2);
			//offset = 58;
			recvData = recvData.substr (58);
			var count = tool.hex2dec (recvData.substr (0, 2 * 2));
			var nSGBMIDs = recvData.substr (4);

			var arr = nSGBMIDToVersion (count, nSGBMIDs);

			var strHtml = "";
			for (var i = 0; i < arr.length; i++) {
				strHtml += "<li>" + arr[i] + "</li>";
			}

			//$("#carTypeConfirm").html("车辆类型：" + carType);
			//获取车辆类型
			decodeCarType (carType, "carTypeConfirm");


			$ ("#carFrameNumConfirm").html (carFrameNum);

			var moduleName = $ ("#moduleName" + address).html ();
			$ ("#moduleTitleConfirm").html ("模块名称：" + moduleName + "[" + address + "]");
			$ ("#moduleInfosConfirm").html (strHtml);

			tool.layout ("module", 0);

			tool.bottomBtn({
				btn1Text:"继续",
				btn1Callback:function(){
					fun710539("01");
				},
				btn2Text:"取消",
				btn2Callback:function(){
					fun710539("02");
				}
			});

			tool.layout ("moduleVersionConfirm", 1);

		} catch (e) {
			tool.log (e.message);
		}
	}

	//是否继续编程
	function fun710539(option) {
		if (option === "02") {
			tool.loading ({text: "正在退出业务..."});
		}
		win.sendDataToDev ("710539" + option);
		tool.layout ("moduleVersionConfirm", 0);
	}

	//获取编程版本	0x3105+0x36+车辆类型ASCII(4B)+车架号ASCII(17B)+模块ID(4B)+地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)
	function Fun310536 (recvData) {
		tool.loading(0);
		var carType = recvData.substr (6, 4 * 2);	//14
		var carFrameNum = tool.hex2a (recvData.substr (14, 17 * 2));	//48
		var address = recvData.substr (56, 2);

		recvData = recvData.substr (58);
		var count = tool.hex2dec (recvData.substr (0, 2 * 2));
		var nSGBMIDs = recvData.substr (4);

		var arr = nSGBMIDToVersion (count, nSGBMIDs);
		var strHtml = "";

		//为每条版本设置version作为ID，方便编辑
		for (var i = 0; i < arr.length; i++) {
			(function (temp_i) {
				var curVersionInLoop = arr[temp_i];

				return strHtml +=
					'<tr id="edit_tr_' + curVersionInLoop + '">' +
					'   <td class="t-center-cbx" width="15%">' +
					'   <label style="display: block">' +
					'       <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
					'              style="padding:8px;" ' +
					'              type="checkbox" ' +
					'              name="moduleCheckbox" ' +
					'              id="edit_input_' + curVersionInLoop + '" ' +
					'              value="' + curVersionInLoop + '"/>' +
					'   </label>' +
					'   </td>' +
					'   <td width="55%" id="edit_view_' + curVersionInLoop + '">' +
					'       <label style="display: block;" for="edit_input_' + curVersionInLoop + '">' +
								curVersionInLoop +
					'       </label>' +
					'   </td>' +
					'   <td width="15%" onclick="RMTClickEvent.editVersion(this.id)" id="edit_' + curVersionInLoop + '">' +
					'       <p class="box-p">编辑</p>' +
					'   </td>' +
					'   <td width="15%" onclick="RMTClickEvent.confirmMsg(null, null, global.delVersion,this.id)" id="del_' + curVersionInLoop + '">' +
					'       <p class="box-p">删除</p>' +
					'   </td>' +
					'</tr>';
			}) (i)
		}
		//console.log("arr val:", arr);
		//获取车辆类型
		decodeCarType (carType, "carTypeSelect");

		$ ("#carFrameNumSelect").html ("车架号：" + carFrameNum);

		var moduleName = $ ("#moduleName" + address).html ();
		$ ("#moduleTitleSelect").html ("模块名称：" + moduleName + "[" + address + "]");
		$ ("#moduleInfosSelect").html (strHtml);

		tool.bottomBtn({
			btn1Text:"增加",
			btn1Callback:function(){
				addModuleVersion();
			},
			btn2Text:"编程",
			btn2Callback:function(){
				fun710536("01");
			},
			btn3Text:"编程",
			btn3Callback:function(){
				fun710536("02");
			}
		});
		tool.layout ("moduleSelect", 1);

		tool.inputStyleModify ("moduleInfosSelect", "checkbox");
	}


	//PC应答：0x7105+36+[01(编程)+SGBMID数n(2B)+n*SGBMID(8B)]/02(取消)
	function fun710536(option) {

		if (option == "01") {

			var count = 0;
			var nSGBMIDs = "";
			var checkboxs =
			$ ("#moduleInfosSelect").find ('input[type="checkbox"]');
			checkboxs.each (function (index) {
				if ($ (this).is (':checked')) {
					nSGBMIDs += versionToSgbmidForOne ($ (this).val ());
					count++;
				}
			});

			if (!count) {
				tool.warnTip (checkboxs, "*请选择要编程的模块");
				tool.layoutTable ();
				return;
			}

			tool.layoutTable ();
			tool.layout ("moduleSelect", 0);
			var command = "71053601" + tool.toHex (count, 4) + nSGBMIDs;
			tool.loading ({text: "获取编程文件..."});
			win.sendDataToDev (command);
		}

		if (option == "02") {
			tool.loading ({text: "正在退出业务..."});
			win.sendDataToDev ("71053602");
		}
	};

	//确认继续编程  0x3105+0x0E(继续编程确认)	PC应答：0x7105+0E+01(继续)/02(取消)
	function Fun31050E (recvData) {
		tool.popShow ("programConfirmWin", 1);
	}

	win.RMTClickEvent.Fun71050E = function (option) {
		if (option === "02") {
			tool.loading ({text: "正在退出业务..."});
		}
		tool.popShow ("programConfirmWin", 0);
		win.sendDataToDev ("71050E" + option);
	};

	//编辑
	win.RMTClickEvent.editVersion = function (versionStr) {

		//调服务器接口查询数据库中的版本号列表，版本号（25B） + 数据库版本
		var input_checked = tool.getCheckedElement ("dbOption");
		if (!input_checked) {
			//tool.processBar ("请选择一个选项");
			return
		}
		//tool.processBar ("");
		gDatabaseVersion = input_checked.value;

		var moduleVersion = versionStr.substr (5);
		var data = getBse64Encode (moduleVersion + gDatabaseVersion);

		//记录当前选的数据，方便回调时替换
		$ ("#curModuleVersion").html (moduleVersion);

		//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'5'},{'DataPack':'" + data + "'}]}";
		//var varSendData = JSON.stringify({subURL: global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"5"},{DataPack: data }]});
		//external.RequestDataFromServer (3021, varSendData, editModuleCallBack);

		win.server.request(17,5,{DataPack:data},win.serverRequestCallback.editModules_A040)
	};

	//编辑：确定/取消
	function funModuleEdit(option) {
		if (option == "01") {
			tool.loading(0);
			var oldVersion = $ ("#curModuleVersion").html ();

			var input_checked = tool.getCheckedElement ("edit");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");
			var newVersion = input_checked.value;
			var edit_tr = $ ("#edit_tr_" + oldVersion)[0];
			var edit_input = $ ("#edit_input_" + oldVersion)[0];
			var edit_view = $ ("#edit_view_" + oldVersion)[0];
			var edit_ = $ ("#edit_" + oldVersion)[0];
			var del_ = $ ("#del_" + oldVersion)[0];

			//替换后，此行的checkbox的id和value要更新，原version的id和html要更新,必须使用原生dom修改，
			// 如果使用JQ之类的命令行，就会出现修改ID之后，原先获取的元素丢失的BUG
			if (newVersion) {
				edit_tr.id = "edit_tr_" + newVersion;

				edit_view.innerText = newVersion;
				edit_view.id = "edit_view_" + newVersion;

				edit_input.value = newVersion;
				edit_input.id = "edit_input_" + newVersion;

				edit_.id = "edit_" + newVersion;
				del_.id = "del_" + newVersion;
			}
		}
		tool.layout ("moduleEdit", 0);

		tool.bottomBtn({
			btn1Text:"增加",
			btn1Callback:function(){
				addModuleVersion();
			},
			btn2Text:"编程",
			btn2Callback:function(){
				fun710536("01");
			},
			btn3Text:"编程",
			btn3Callback:function(){
				fun710536("02");
			}
		});

		tool.layout ("moduleSelect", 1);

	};

	//删除
	win.global.delVersion = function (version) {
		var moduleName = version.substr (4);         //原version 内容 del_XXXXXX;
		$ ("#edit_tr_" + moduleName).remove ();
	};

	//增加
	function addModuleVersion() {
		tool.popShow ("addModule", 1);
	}

	win.RMTClickEvent.addModule = function (option) {
		if (option == "01") {
			//1、验证格式（每一段长度暂时不检查），2、调接口验证是否存在  xxxx_xxxxxxxx_xxx_xxx_xxx
			var input = $ ("#moduleInput").val ();
			if (input.length != 25 || input.split ("_").length != 5) {
				tool.warnTip ("#moduleInput", "输入格式不正确，请检查！");
				return;
			}
			else {
				//检查新增文件是否已存在列表中
				var flag = false;

				$ ("#moduleInfosSelect").find ('input[type="checkbox"]').each (function (index) {
					if (input.toUpperCase () == $ (this).val ()) {
						tool.warnTip ("#moduleInput", "文件已存在");
						flag = true;
						return false;	//只是跳出循环
					}
				});
				if (flag) {
					return;
				}
			}

			var input_checked = tool.getCheckedElement ("dbOption");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");
			gDatabaseVersion = input_checked.value;

			var data = getBse64Encode (input + gDatabaseVersion);

			//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'6'},{'DataPack':'" + data + "'}]}";
			//var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"6"},{DataPack:data }]});
			//external.RequestDataFromServer (3021, varSendData, checkModuleCallBack);

			win.server.request(17,6,{DataPack:data},win.serverRequestCallback.checkModule_A040)
		}
		if (option == "02") {
			tool.popShow ("addModule", 0);
		}
	};


	//OBD响应
	win.devInterActive.Fun3106 = function (recvData) {
		var strCommand = recvData.substr (4, 2);
		switch (strCommand) {
			case '14':
				win.devInterActive.Fun310614 (recvData);	//设备检查
				break;
			case '11':
				win.devInterActive.Fun310611 (recvData);	//车辆通信结果
				break;
			case '17':
				win.devInterActive.Fun310617 (recvData);	//文件校验结果
				break;
			case '0D':
				win.devInterActive.Fun31060D (recvData); //文件编程结果
				break;
			case '0F':
				win.devInterActive.Fun31060F (recvData); //模块编程结果
				break;
		}
	};

	//车辆通信结果 0x3106+0x11(OBD通信状态)+0x01/0x03/0x04/0x05
	win.devInterActive.Fun310611 = function (recvData) {
		var strCommand = recvData.substr (6, 2);

		switch (strCommand) {
			case '01':
				tool.log ("诊断设备与汽车通信失败");
				break;
			case '02':
				tool.log ("诊断设备与汽车通信断开");
				break;
			case '03':
				tool.log ("OBDII-KWP通信成功");
				break;
			case '04':
				tool.log ("KWP-CAN 100Kbps通信成功");
				break;
			case '05':
				tool.log ("KWP-CAN 500Kbps通信成功");
				break;
			case '06':
				tool.log ("TP2.0连接成功");
				break;
			case '07':
				tool.log ("UDP/TCP总线连接成功");
				break;
			default:
				tool.log ("未定义提示");
				break;
		}
	};

	//文件校验结果  0x3106+0x17(文件校验)+01(BTLD文件)+0x01(成功)/0x02(失败)+文件名ASCII(32B)
	//文件校验结果  0x3106+0x17(文件校验)+02(SWFL文件)+0x01(成功)/0x02(失败)+文件名ASCII(32B)
	//文件校验结果  0x3106+0x17(文件校验)+03(CAFD文件)+0x01(成功)/0x02(失败)+文件名ASCII(32B)
	win.devInterActive.Fun310617 = function (recvData) {

		var type = recvData.substr (6, 2);
		var strCommand = recvData.substr (8, 2);
		var fileName = tool.hex2a (recvData.substr (10, 32 * 2)) || "";

		if (strCommand == '01') {
			tool.log ("解析" + fileName + "文件成功");
			//tool.processBar ("正在准备编程文件");
			tool.loading ({text: "解析" + fileName + "文件成功"});
			tool.loading ({text: "正在准备编程文件..."});
		}
		if (strCommand == '02') {
			tool.loading ({text: "解析" + fileName + "文件失败"});
			tool.log ("解析" + fileName + "文件失败");
		}
	};

	//编程结果 0x3106+0x0D(编程校验)+0x01(BTLD程序)/0x02(SWFL程序)/0x03(CAFD程序)+01(成功)/02(失败)
	win.devInterActive.Fun31060D = function (recvData) {

		var type = recvData.substr (6, 2);	//8

		var strCommand = recvData.substr (8, 2) + '';

		var txt = gTypeMap[type] || "";

		switch (strCommand) {
			case '01':
				tool.loading ({text: "校验" + txt + "文件成功"});
				tool.log ("校验" + txt + "文件成功");
				//tool.processBar ("校验文件成功");
				break;
			case '02':
				tool.loading ({text: "校验" + txt + "文件失败"});
				tool.log ("校验" + txt + "文件失败");
				//tool.processBar ("校验文件失败");
				break;
		}
	};

	//编程模块结果	0x3106+0x0F(编程ECU)+模块索引ID[4B]+地址(1B)+0x01(成功)/0x02(失败)	PC不需要应答
	win.devInterActive.Fun31060F = function (recvData) {

		var strCommand = recvData.substr (16, 2) + '';
		//var indexId = recvData.substr(6, 4 * 2);
		var address = recvData.substr (14, 2);

		var moduleName = getModuleFullName (address) || "";

		switch (strCommand) {
			case '01':
				tool.loading ({text: moduleName + '模块编程成功，正在退出业务'});
				tool.log (moduleName + '模块编程成功');
				break;
			case '02':
				tool.loading ({text: '模块编程失败，正在退出业务'});
				tool.log ('模块编程失败');
				break;
		}
		//tool.processBar ("正在结束模块编程操作");
	};

	//获取模块名称
	function getModuleName (address) {
		if (address == "00") {
			return "unknown";
		}
		return $ ("#moduleName" + address).html ();
	}

	function getModuleFullName (address) {
		if ($ ("#moduleName" + address).html () == null) {
			return "";
		}
		return $ ("#moduleName" + address).html () + "[" + address + "]";
	}


	//编程文件信息 0x2106+文件类型(2B)+SGBMID数n(2B)+n*SGBMID(8B)
	//PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
	win.devInterActive.Fun2106 = function (recvData) {
		tool.loading ({text: "正在获取编程文件..."});
		tool.log ("正在获取" + $ ("#moduleTitleSelect").html ().substr (5) + "编程文件...");

		gFileType = recvData.substr (4, 4);	//8

		//调接口获取文件名 SGBMID数n(2B)+n*SGBMID(十六进制字符串) +车架号（17B字符） + 数据库版本	编程文件信息
		var nSGBMIDs = recvData.substr (8);

		var input_checked = tool.getCheckedElement ("dbOption");
		if (!input_checked) {
			//tool.processBar ("请选择一个选项");
			return
		}
		//tool.processBar ("");
		var gDatabaseVersion = input_checked.value;
		var carFrameNum = $ ("#carFrameNumConfirm").html ();

		//TEST
		//tool.log(nSGBMIDs + carFrameNum + databaseVersion);

		var data = getBse64Encode (nSGBMIDs + carFrameNum + gDatabaseVersion);

		//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'3'},{'DataPack':'" + data + "'}]}";
		//var varSendData = JSON.stringify({subURL: global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"3"},{DataPack: data }]});
		//external.RequestDataFromServer (3021, varSendData, getProgramFilesCallBack);

		win.server.request(17,3,{DataPack:data},win.serverRequestCallback.getProgramFiles_A040)
	};

	//获取密钥 0x2703+索引ID(4B)	PC应答：0x6703+索引ID(4B)+{01(成功)+密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]}/02(失败)
	win.devInterActive.Fun2703 = function (recvData) {

		gIndexId = recvData.substr (4, 8);

		var input_checked = tool.getCheckedElement ("dbOption");
		if (!input_checked) {
			//tool.processBar ("请选择一个选项");
			return
		}
		//tool.processBar ("");
		gDatabaseVersion = input_checked.value;

		//索引ID(十六进制字符串)
		var data = getBse64Encode (gIndexId + gDatabaseVersion);

		//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'4'},{'DataPack':'" + data + "'}]}";
		//var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"17"},{DataType:"4"},{DataPack: data }]});
		//external.RequestDataFromServer (3021, varSendData, getKeyCallBack);
		win.server.request(17,4,{DataPack:data},win.serverRequestCallback.getKey_A040)
	};

	//编程文件下载到手机端
	//0x2105+文件数量n(1B)+n*[文件名称(32B)+文件大小(4B)+MD5值(16B)]	PC应答：0x6105+[01(成功)+文件数量n(1B)]/02(失败)
	win.devInterActive.Fun2105 = function (recvData) {
		tool.loading ({text: '正在从服务器下载编程文件...'});
		//循环需要下载的文件名，分别发送指令给APP进行下载，每下载一个提示一次，全部下载后响应设备；
		var count = recvData.substr (4, 2);

		gdownloadFilesNumHex = count;	//数量放入缓存，16进制

		count = tool.hex2dec (count);

		gdownloadFilesNum = count;	//数量放入缓存

		gdownloadFilesName = recvData.substr (6, (32 + 4 + 16) * 2 * count);		//文件信息放入缓存

		//tool.processBar ('正在从服务器下载编程文件...');

		downloadForFun2105 (gdownloadFilesNum, gdownloadFilesName);		//调用下载方法
	};

	//文件下载到手机  PC应答：0x6105+[01(成功)+文件数量n(1B)]/02(失败)
	/*
	 * 算法说明：向手机发送下载请求，参数为下载文件数量+[文件名称(32B)+文件大小(4B)]*N
	 * 一次只下载一个文件，在下载成功的响应处理函数里再调用此方法，调用前要先将数量 减一，并截掉已下载的文件信息
	 * 如果下载失败，则直接将数量置为 -1
	 */
	function downloadForFun2105 (filesNum, filesNameSize) {

		//tool.log('downloadForFun2105: ['+ filesNum + '][' + filesNameSize + ']');

		//下载未完成
		if (filesNum > 0) {

			var fileSize = tool.hex2dec (filesNameSize.substr (32 * 2, 4 * 2));
			var fileName = filesNameSize.substr (0, 32 * 2);

			//TEST
			//tool.log("设备要下载的文件：" + fileName + " MD5: " + filesNameSize.substr(36 * 2, 32 ));

			//去掉补齐的'00'
			for (var i = 0; i < 32; i++) {

				var len = fileName.lastIndexOf ('00');
				if (len > 0) {
					fileName = fileName.substr (0, len);
				}
			}
			fileName = tool.hex2a (fileName);

			//var varSendData = "{'fileName':'" + fileName + "','fileSize':'" + fileSize + "'}";
			var varSendData = JSON.stringify({fileName:fileName ,fileSize:fileSize });

			//external.RequestDataFromServer (3001, varSendData, "3001");	//请求下载
			win.appService.sendDataToApp(3001, varSendData,win.serverRequestCallback.appDownloadEnd_A040);
		}
		if (filesNum == 0 && gdownloadFilesNumHex != '0x00') {

			//tool.log('下载完成：610501'+gdownloadFilesNumHex);
			win.sendDataToDev ('610501' + gdownloadFilesNumHex);
		}
		//下载出现失败
		if (filesNum == -1) {
			win.sendDataToDev ('610502');
		}
	}

	//JS请求APP下载完成后的响应  3001的回调
	win.serverRequestCallback.appDownloadEnd_A040 = function (recvData,params) {
		tool.loading ({text: "正在导入文件到手机..."});

		try {
			//var varJson = JSON.parse (getBse64Decode (recvData));
			//if (varJson.CODETYPE == 'OK') {
				gdownloadFilesNum--;	//下载成功一个减一
				gdownloadFilesName = gdownloadFilesName.substr ((32 + 4 + 16) * 2);	//已下载的截掉

				downloadForFun2105 (gdownloadFilesNum, gdownloadFilesName);	//下载文件到手机

			//}
			//else if (varJson.CODETYPE == "DEBUG") {
			//	tool.log ('下载文件调试信息：' + varJson.CODEDATA);
			//}
			//else {
			//	tool.log ('下载文件失败：' + varJson.CODEDATA);
				//tool.processBar ('下载文件失败');
				//downloadForFun2105 (-1, gdownloadFilesName);
			//}
		} catch (e) {
			//tool.log ('下载文件失败');
			//tool.processBar ('下载文件失败');
			tool.alert("下载文件失败",function(){
				downloadForFun2105 (-1, gdownloadFilesName);
			});
		}
	};


	win.devInterActive.Fun3108 = function (recvData) {

		var strCommand = recvData.substr (4, 2);
		var strShowMsg = '错误的指令信息(3108):' + strCommand;

		switch (strCommand) {
			case '01':
				tool.loading ({text: "正在编程应用程序..."});
				Fun310801 (recvData);		//编程应用程序
				break;
			case '03':
				tool.loading ({text: "正在擦除程序FLASH..."});
				Fun310803 (recvData);		//擦除程序FLASH
				break;
			case '0B':
				tool.loading ({text: "正在校验程序签名..."});
				Fun31080B (recvData);		//校验程序签名
				break;
			case '0A':
				break;				//日志加密进度
			default:
				tool.log (strShowMsg);
		}
	};

	//擦除FLASH	0x3108+0x03(擦除程序)+0x01(BTLD程序)/0x02(SWFL程序) +文件名ASCII(32B)
	function Fun310803 (recvData) {

		var type = recvData.substr (6, 2);
		var fileName = tool.hex2a (recvData.substr (8, 32 * 2));
		tool.log ("正在擦除" + fileName + "程序");
		//tool.processBar ("正在擦除" + fileName + "程序");

	}

	//编程引导程序 0x3108+0x01(写ECU进度)+文件总数(2B)+当前执行文件序号(2B)+文件名ASCII(32B)+编程数据总大小(4B)+完成编程数据大小(4B)
	function Fun310801 (recvData) {
		var total = tool.hex2dec (recvData.substr (6, 2 * 2));			//10
		var currentIndex = tool.hex2dec (recvData.substr (10, 2 * 2));	//14
		var curFileName = tool.hex2a (recvData.substr (14, 32 * 2));		//78
		var totalSize = tool.hex2dec (recvData.substr (78, 4 * 2));		//86
		var currentSize = tool.hex2dec (recvData.substr (86, 4 * 2));	//
		var process = parseInt (currentSize / totalSize * 100);
		process += '%';

		if (gProcessName != curFileName) {
			tool.log ("正在编程" + curFileName + "文件");
			gProcessName = curFileName;
		}

		//编程进度：文件XX(当前文件序号)/XX(文件总数)   XX%(当前文件编程进度)”
		//tool.processBar( curFileName + '编程进度：' + currentIndex + '/' + total + '  ' + process);
		//tool.processBar ('编程进度：' + currentIndex + '/' + total + '  ' + process);
	}

	//校验签名  0x3108+0x0B(校验签名)+0x01(BTLD程序)/0x02(SWFL程序)+文件名ASCII(32B)
	function Fun31080B (recvData) {
		var type = recvData.substr (6, 2);
		var fileName = tool.hex2a (recvData.substr (8, 32 * 2));

		tool.log ('正在校验' + fileName + "签名");
		//tool.processBar ("正在校验签名...");
	}


	//-------------------------  模拟 confirm() start ---------------------------------------------
	//参数说明：标题，内容，回调函数名，回调函数参数
	win.RMTClickEvent.confirmMsg = function (title, content, callback, versionStr) {
		console.log ("confirmMsg params:", versionStr);

		if ($.trim (title) != "" && title != null) {
			$ ("#confirmTitle").html (title);
		}
		if ($.trim (content) != "" && content != null) {
			$ ("#confirmContent").html (content);
		}
		tool.popShow ("confirmDialog", 1);
		confirmOk (callback, versionStr);
		btnConfirmCancel ();
	};

	var confirmOk = function (callback, versionStr) {
		$ ("#btnConfirmOk").off ("click").on ("click", function () {
			RMTClickEvent.confirmOkClickEvent (callback, versionStr);
		});
	};

	win.RMTClickEvent.confirmOkClickEvent = function (callback, versionStr) {
		tool.popShow ("confirmDialog", 0);
		if (typeof (callback) == 'function') {
			callback (versionStr);
		}
	};

	var btnConfirmCancel = function () {
		$ ("#btnConfirmCancel").click (function () {
			win.RMTClickEvent.btnConfirmCancelClickEvent ();
		});
	};

	win.RMTClickEvent.btnConfirmCancelClickEvent = function () {
		tool.popShow ("confirmDialog", 0);
	};

	//-------------------------  模拟 confirm() end ---------------------------------------------

	//单条版本信息转换SGBMID ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
	function versionToSgbmidForOne (moduleInfo) {

		var sgbmid = "";

		var processClass = "";
		var id = "";
		var mainVersion = "";
		var subVersion = "";
		var patchVersion = "";

		arr = moduleInfo.split ("_");
		processClass = tool.toHex (gProcessClassMap[arr[0]], 2);
		id = arr[1];
		mainVersion = tool.toHex (arr[2], 2);
		subVersion = tool.toHex (arr[3], 2);
		patchVersion = tool.toHex (arr[4], 2);
		sgbmid = processClass.toUpperCase () + id + mainVersion + subVersion + patchVersion;

		return sgbmid;
	}

	//版本信息转换SGBMID ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
	//返回n * SGBMID
	function versionToSGBMID (moduleInfos) {

		var arr;	//CAFD_0000000F_005_021_005
		var nSGBMID = "";

		for (var i = 0; i < moduleInfos.length; i++) {

			if (moduleInfos[i].modelInfo.indexOf ("Unknown") >= 0) {
				continue;
			}
			nSGBMID += versionToSgbmidForOne (moduleInfos[i].modelInfo);
		}

		return nSGBMID;
	}

	//SGBMID转换版本信息 ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
	//返回 版本信息 数组
	function nSGBMIDToVersion (count, nSGBMIDs) {

		var arr = [];
		var sgbmid = "";

		var processClass = "";
		var id = "";
		var mainVersion = "";
		var subVersion = "";
		var patchVersion = "";

		var version = "";


		for (var i = 0; i < count; i++) {
			sgbmid = nSGBMIDs.substr (0, 16);
			nSGBMIDs = nSGBMIDs.substr (16);

			processClass = sgbmid.substr (0, 2);
			id = sgbmid.substr (2, 8);
			mainVersion = sgbmid.substr (10, 2);
			subVersion = sgbmid.substr (12, 2);
			patchVersion = sgbmid.substr (14, 2);

			var moduleName = "";

			if (gModuleNameMap[processClass.toUpperCase ()] == undefined || gModuleNameMap[processClass.toUpperCase ()] == null) {
				moduleName = "Unknown";
			}
			else {
				moduleName = gModuleNameMap[processClass.toUpperCase ()];
			}

			version = moduleName + "_" + id + "_" + tool.formatNumber (tool.hex2dec (mainVersion), 3) +
			"_" + tool.formatNumber (tool.hex2dec (subVersion), 3) + "_" + tool.formatNumber (tool.hex2dec (patchVersion), 3);
			arr[i] = version;
		}

		return arr;
	}
}) (window);
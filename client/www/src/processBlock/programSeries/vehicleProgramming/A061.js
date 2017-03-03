/**
 * Created by Andy on 2016/7/20.
 */
(function (win) {
	//初始化---------------------------------- start ----------------------------------------------

	var gdownloadFilesName = '';				//缓存编程文件下载到手机端时文件名与文件大小
	var gdownloadFilesNum = 0;					//缓存编程文件下载到手机端时文件数量
	var gdownloadFilesNumHex = '0x00';			//缓存编程文件下载到手机端时文件数量，16进制
	var typeNameEnum = {"01": "引导程序", "02": "应用程序", "03": "配置程序"};

	var gModuleInfoArray = [];			//模块信息数据

	var gScanFlag = false;	//全车扫描标志，执行则为true
	var gScanType = "";		//全车扫描类型，“01”完全扫描，“02”快速扫描
	var scanNextFlag = true;						//扫描标识，false则停止发送扫描指令

	var gscrollFlag = true;						//控制列表滚动开关，true为滚动

	var gFileType = "";				//缓存0x2106+文件类型(2B)中的文件类型
	var obj0ba = null;	//缓存radio状态
	var obj0pa = null;	//缓存radio状态
	var obj0da = null;	//缓存radio状态

	//初始化---------------------------------- end ----------------------------------------------

	//不支持IE
	$(document).ready(function () {
		//输入转大写
		$("#inputFrameNum_A061").bind("input", function () {
			$(this).val($(this).val().toUpperCase())
		});
	});

	//RADIO，取消选中
	win.RMTClickEvent.toggleChecked = function (id) {
		var obj = $("#" + id);

		if (obj.name == '0BA') {
			if (obj == obj0ba) {
				obj.checked = false;
				obj0ba = null;
			}
			else {
				obj0ba = obj;
			}
		}
		if (obj.name == '0PA') {
			if (obj == obj0pa) {
				obj.checked = false;
				obj0pa = null;
			}
			else {
				obj0pa = obj;
			}
		}
		if (obj.name == '0DA') {
			if (obj == obj0da) {
				obj.checked = false;
				obj0da = null;
			}
			else {
				obj0da = obj;
			}
		}
	};

	//JS请求APP下载完成后的响应
	win.serverRequestCallback.appDownloadEnd_A061 = function (recvData, params) {
		//tool.log('下载响应：'+recvData);

		try{

			gdownloadFilesNum--;	//下载成功一个减一
			gdownloadFilesName = gdownloadFilesName.substr((32 + 4 + 16) * 2);	//已下载的截掉

			downloadForFun2105(gdownloadFilesNum, gdownloadFilesName);	//下载文件到手机
		}catch(e){
			tool.alert("下载文件失败",function(){
				downloadForFun2105(-1, gdownloadFilesName);
			})
		}
		//var varJson = JSON.parse(getBse64Decode(recvData));
		//if (varJson.CODETYPE == 'OK') {

		//}
		//else {
		//	tool.log('下载文件失败：' + varJson.CODEDATA);
		//	downloadForFun2105(-1, gdownloadFilesName);
		//}
	};

	//显示数据库版本列表
	win.serverRequestCallback.showDatabaseVersion_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));	//数量（2B）+长度（2B）+数据库版本（LB）
		var strHtml = '';
		win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {
		//	var varData = tool.HexUnicodeToString(varJson.CODEDATA);
		//	var jsonData = JSON.parse(varData);
			var jsonData = recvData;

			var version = "";
			var isChecked = "";
			for (var i = 0; i < jsonData.length; i++) {
				isChecked = !i ? "checked" : "";
				version = jsonData[i].dataVersion;
				strHtml +=
					'<tr>' +
					'   <td width="30%" class="t-center">' +
					'       <label style="display: block">' +
					'           <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
					'                   type="radio" ' +
					'                   name="dbOption_A061" ' +
					'                   id="dbOption_A061' + i + '" ' +
					isChecked +
					'                   value="' + version + '"/>' +
					'       </label>' +
					'   </td>' +
					'   <td width="70%" class="t-center">' +
					'       <label  style="display:block" for="dbOption_A061' + i + '" >' +
					version +
					'       </label>' +
					'   </td>' +
					'</tr>';
			}

			$("#dbVersionList_A061").html(strHtml);

			tool.layout('ECUSelect_A061', 0);
			tool.bottomBtn({
				btn1Text:"下一步",
				btn1Callback:function(){
					database_A061Next();
				},
				btn2Text:"返回",
				btn2Callback:function(){
					database_A061Return();
				}
			});
			tool.layout("database_A061", 1);

			tool.inputStyleModify("database_A061", "radio");
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		win.sendDataToDev("71054202");
		//	});
		//}
	};

	//显示车型列表
	win.serverRequestCallback.showCarType_A061 = function (recvData, params) {
		//var varJson = JSON.parse(getBse64Decode(recvData));	//数量（2B）+长度（2B）+车型（LB）
		var strHtml = '';
		win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {

			try {
				//var varData = tool.HexUnicodeToString(varJson.CODEDATA);
				var jsonData = recvData;
				//var jsonData = JSON.parse(varData);

				var suffix = '';
				var type = '';
				for (var i = 0; i < jsonData.length; i++) {

					type = jsonData[i].carType;
					if (i == 0) {
						suffix = '" checked /></td></label>';
					}
					else {
						suffix = '" /></td></label>';
					}
					strHtml +=
						'<tr>' +
						'   <td width="30%" class="t-center">' +
						'   <label style="display:block">' +
						'       <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'              type="radio" ' +
						'              name="carOption_A061" ' +
						'              id="carOption_A061' + i + '" ' +
						'              value="' + type + suffix +
						'   <td width="70%" class="t-center">' +
						'       <label for="carOption_A061' + i + '" style="display:block">' +
						type +
						'       </label>' +
						'   </td>';
				}

				strHtml += "</tr>";

				$("#carTypeList_A061").html(strHtml);
				tool.bottomBtn({
					btn1Text:"下一步",
					btn1Callback:function(){
						carTypeNext_A061();
					},
					btn2Text:"返回",
					btn2Callback:function(){
						carTypeReturn_A061();
					}
				});
				tool.layout("carType_A061", 1);

				tool.inputStyleModify("carType_A061", "radio");

			} catch (e) {
				tool.alert(varJson.CODEDATA, function () {
					tool.bottomBtn({
						btn1Text:"下一步",
						btn1Callback:function(){
							database_A061Next();
						},
						btn2Text:"返回",
						btn2Callback:function(){
							database_A061Return();
						}
					});
					tool.layout("database_A061", 1);
				});
			}
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		tool.bottomBtn({
		//			btn1Text:"下一步",
		//			btn1Callback:function(){
		//				database_A061Next();
		//			},
		//			btn2Text:"返回",
		//			btn2Callback:function(){
		//				database_A061Return();
		//			}
		//		});
		//		tool.layout("database_A061", 1);
		//	});
		//}
	};

	//显示模块列表
	win.serverRequestCallback.showModules_A061 = function (recvData, params) {
		//var varJson = JSON.parse(getBse64Decode(recvData));	//数量（2B）+长度（2B）+模块（LB）
		var strHtml = '';
		//win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {
		//	var varData = tool.HexUnicodeToString(varJson.CODEDATA);
			var jsonData = recvData;
		//	var jsonData = JSON.parse(varData);

			var suffix = '';
			var module = '';
			for (var i = 0; i < jsonData.length; i++) {

				module = jsonData[i].modelName;
				if (i == 0) {
					suffix = '" checked /></td></label>';
				}
				else {
					suffix = '" /></td></label>';
				}
				strHtml +=
					'<tr >' +
					'   <td width="30%" class="t-center">' +
					'   <label style="display:block">' +
					'       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
					'               type="radio"' +
					'               name="moduleOption_A061"' +
					'               id="moduleOption_A061' + i + '"' +
					'               value="' + module + suffix +
					'   <td width="70%" class="t-center">' +
					'       <label  style="display:block" for="moduleOption_A061' + i + '">' +
					module +
					'       </label>' +
					'   </td>';
			}
			strHtml += "</tr>";

			$("#moduleList_A061").html(strHtml);

			tool.layout("carType_A061", 0);
			tool.bottomBtn({
				btn1Text:"下一步",
				btn1Callback:function(){
					moduleNext();
				},
				btn2Text:"返回",
				btn2Callback:function(){
					moduleReturn();
				}
			});

			tool.layout("module_A061", 1);
			tool.inputStyleModify("module_A061", "radio");
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		tool.bottomBtn({
		//			btn1Text:"下一步",
		//			btn1Callback:function(){
		//				carTypeNext_A061();
		//			},
		//			btn2Text:"返回",
		//			btn2Callback:function(){
		//				carTypeReturn_A061();
		//			}
		//		});
		//		tool.layout("carType_A061", 1);
		//		tool.layout("module_A061", 0);
		//	});
		//}
	};

	//显示编程版本列表
	win.serverRequestCallback.showProgram_A061 = function (recvData, params) {
		//var varJson = JSON.parse(getBse64Decode(recvData));	//数量（2B）+零件号（7B）
		var strHtml = '';
		win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {
			try {
				//var varData = tool.HexUnicodeToString(varJson.CODEDATA);
				//var jsonData = JSON.parse(varData);
				var jsonData = recvData;

				var suffix = '" /></td></label></tr>';
				var program = '';
				for (var i = 0; i < jsonData.length; i++) {

					program = jsonData[i].zbnr;
					//如果是输入零件号，则默认选中
					if ($("#inputPartNum_A061").val() == program) {
						suffix = '" checked /></td></label>';
					}
					else if (i == 0) {
						suffix = '" checked /></td></label>';
					}
					else {
						suffix = '" /></td></label>';
					}
					strHtml +=
						'<tr >' +
						'   <td width="30%" class="t-center">' +
						'   <label style="display: block;">' +
						'       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'               type="radio" ' +
						'               name="programOption_A061" ' +
						'               id="programOption_A061' + i + '" ' +
						'               value="' + program + suffix +
						'   <td width="70%" class="t-center">' +
						'       <label  style="display:block" for="programOption_A061' + i + '">' +
						program +
						'       </label>' +
						'   </td>';
				}
				strHtml += "</tr>";

				if (jsonData.length > 0) {
					$("#programVersionList_A061").html(strHtml);
					tool.layout("module_A061", 0);
					$("#moduleOprate_A061").hide();
					tool.bottomBtn({
						btn1Text:"下一步",
						btn1Callback:function(){
							programNext();
						},
						btn2Text:"返回",
						btn2Callback:function(){
							programReturn();
						}
					});
					tool.layout("programVersion_A061", 1);
					tool.inputStyleModify("programVersion_A061", "radio");
				}
				else {

					tool.bottomBtn({
						btn1Text:"下一步",
						btn1Callback:function(){
							moduleNext();
						},
						btn2Text:"返回",
						btn2Callback:function(){
							moduleReturn();
						}
					});
					tool.layout("module_A061", 1);
				}
			} catch (e) {
				tool.alert('解析编程版本列表异常', function () {
					Fun310536Fail();	//获取编程版本失败响应
				});
			}
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		Fun310536Fail();	//获取编程版本失败响应
		//	});
		//}
	};

	//获取ECU地址
	win.serverRequestCallback.getECUAddress_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));	//1B通信地址

		//if (varJson.CODETYPE == 'OK') {

			try {
				//var varData = tool.HexUnicodeToString(varJson.CODEDATA);
				var address = recvData;

				//编程模块选择	 PC应答：0x7105+36+[01(成功)+ECU地址HEX(1B)+选择ECU版本ASCII(7B)+用户输入车架号ASCII(17B)]/02(失败)
				var frameNum = $("#inputFrameNum_A061").val();

				var len = frameNum.length;
				if (len < 17) {
					for (var i = 0; i < 17 - len; i++) {
						frameNum += '0';
					}
				}

				var programOption = "0000000";

				var input_checked = tool.getCheckedElement("operate");
				if (!input_checked) {
					//tool.processBar("请选择一个选项");
					return
				}
				//tool.processBar("");
				var val = input_checked.value;

				if (val != "03") {
					input_checked = tool.getCheckedElement("programOption_A061");
					if (!input_checked) {
						//tool.processBar("请选择一个选项");
						return
					}
					//tool.processBar("");
					programOption = input_checked.value;
				}

				if (programOption == undefined || programOption == null || programOption == "") {
					programOption = "0000000";
				}

				var command = '71053601' + address + tool.asc2hex(programOption) + tool.asc2hex(frameNum);
				win.tool.loading({text: "正在获取编程模块信息..."});
				win.sendDataToDev(command);


			} catch (e) {
				tool.alert('解析ECU地址异常', function () {
					Fun310536Fail();	//获取编程版本失败响应
				});
			}
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		Fun310536Fail();	//获取编程版本失败响应
		//	});
		//}
	};

	//请求文件信息  [{"fileSize":"1024","fileName":"95645.0pd" } , {"fileSize":"1024","fileName":"95645.0pd" } ,..]
	//编程文件信息    PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(1B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)] }/02(失败)
	win.serverRequestCallback.getFile_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));	//1B通信地址

		//if (varJson.CODETYPE == 'OK') {
		//	var varData = tool.HexUnicodeToString(varJson.CODEDATA);
		//	var jsonData = JSON.parse(varData);
			var jsonData = recvData;

			var command = '6106' + gFileType + '01';
			var count = tool.toHex(jsonData.length, 2);
			command += count;

			var size = "";
			var name = "";
			var md5 = "";
			for (var i = 0; i < jsonData.length; i++) {

				size = tool.toHex(jsonData[i].fileSize, 8);
				name = jsonData[i].fileName;
				md5 = jsonData[i].MD5;

				command += tool.formateStrWithLen(tool.asc2hex(name), 32) + size + md5;
			}

			win.sendDataToDev(command);
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//		win.sendDataToDev('6106' + gFileType + '02');
		//	});
		//}
	};

	//请求编程密钥信息
	win.serverRequestCallback.getKey_A061 = function (recvData, params) {

		//响应：数据长度 4B  密钥
		//var varJson = JSON.parse(getBse64Decode(recvData));	//1B通信地址

		//if (varJson.CODETYPE == 'OK') {
		//	var varData = tool.HexUnicodeToString(varJson.CODEDATA);
			var key = recvData;

			var len = tool.toHex(key.length, 4);

			//PC应答：0x6703+[01(成功)+密钥长度m(2B)+密钥数据ASCII(mB)]/02(失败)
			var command = '670301' + len + tool.asc2hex(key);

			win.sendDataToDev(command);

			//tool.processBar('正在检查模块的UIF信息');

		//}
		//else {
		//	var module = getModule();
		//	tool.alert('当前数据库查找' + module + '模块密钥数据失败，' + varJson.CODEDATA, function () {
		//		win.sendDataToDev('67030102');
		//	});
		//}
	};

	//请求零件号信息回调
	win.serverRequestCallback.getPart_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));	//1B通信地址
		win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {

			var strHtml = '';
			try {
				//var varData = tool.HexUnicodeToString(varJson.CODEDATA);
				//var jsonData = JSON.parse(varData);
				var jsonData = recvData;

				if (jsonData.length <= 0) {
					tool.warnTip("tipPartNum", "输入的零件号不存在，请检查输入是否正确");
					tool.popShow("partNum_A061", 1);		//查不到则返回
					return;
				}
				var suffix = '';
				var program = '';
				var strDatabase = '';
				var strCarType = '';
				var strModule = '';
				var lenDatabase = '';
				var lenCarType = '';
				var lenModule = '';
				for (var i = 0; i < jsonData.length; i++) {

					program = jsonData[i].zbnr;
					strDatabase = jsonData[i].dataVersion;
					strCarType = jsonData[i].carType;
					strModule = jsonData[i].modelName;

					lenDatabase = tool.toHex(strDatabase.length, 4);
					lenCarType = tool.toHex(strCarType.length, 4);
					lenModule = tool.toHex(strModule.length, 4);

					if (i == 0) {
						suffix = '" checked /></td></label>';
					}
					else {
						suffix = '" /></td></label>';
					}
					strHtml +=
						'<tr >' +
						'   <td class="t-center">' +
						'   <label style="display:block">' +
						'       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
						'               type="radio" ' +
						'               name="moduleOption_A061" ' +
						'               id="moduleOption_A061' + i + '" ' +
						'               value="' + lenDatabase +
						strDatabase +
						lenCarType +
						strCarType +
						lenModule +
						strModule +
						suffix +
						'   <td >' +
						'       <label style="display:block" for="moduleOption_A061' + i + '">' +
						program + '/' +
						strDatabase + '/' +
						strCarType + '/' +
						strModule +
						'       </label>' +
						'   </td>';
				}

				strHtml += "</tr>";

				$("#moduleTitle_A061").html('请根据 数据库/车型/模块，选择正确的编程版本：');
				$("#moduleList_A061").html(strHtml);

				tool.popShow("partNum_A061", 0);

				tool.bottomBtn({
					btn1Text:"下一步",
					btn1Callback:function(){
						moduleNext();
					},
					btn2Text:"返回",
					btn2Callback:function(){
						moduleReturn();
					}
				});
				tool.layout("module_A061", 1);
			} catch (e) {
				tool.alert('解析零件号信息异常', function () {
					Fun310536Fail();	//获取编程版本失败响应
				});
			}
		//}
		//else {
		//	tool.alert('请求零件号信息，' + varJson.CODEDATA, function () {
		//		Fun310536Fail();	//获取编程版本失败响应
		//	});
		//}
	};

	//获取编程文件列表
	win.serverRequestCallback.getProgramFile_A061 = function (recvData, params) {
		//var varJson = JSON.parse(getBse64Decode(recvData));
		win.tool.loading(0);
		//if (varJson.CODETYPE == 'OK') {
		//	var varData = tool.HexUnicodeToString(varJson.CODEDATA);
		//	var jsonData = JSON.parse(varData);
			var jsonData = recvData;

			var name = '';
			var nameFormat = '';
			var md5 = "";
			var len = 0;
			var size = '';
			var format = '';
			var strHtml0ba = '';
			var strHtml0pa = '';
			var strHtml0da = '';

			for (var i = 0; i < jsonData.length; i++) {

				size = tool.toHex(jsonData[i].fileSize, 8);
				name = jsonData[i].fileName;
				md5 = jsonData[i].MD5;

				format = name.substr(name.lastIndexOf('.') + 1);
				nameFormat = tool.formateStrWithLen(tool.asc2hex(name), 32);

				if (format.toUpperCase() == '0BA') {
					strHtml0ba +=
						'<li>' +
						'<input type="radio" ' +
						'       name="0BA" ' +
						'       id="0BA' + i + '" ' +
						'       onclick="RMTClickEvent.toggleChecked(this.id)" ' +
						'       value="' + nameFormat + size + md5 + '" />' +
						'<label for="0BA' + i + '">' + name + '</label>' +
						'</li>';
				}
				if (format.toUpperCase() == '0PA') {
					strHtml0pa +=
						'<li>' +
						'<input type="radio" ' +
						'       name="0PA" id="0PA' + i + '" ' +
						'       onclick="RMTClickEvent.toggleChecked(this.id)" ' +
						'       value="' + nameFormat + size + md5 + '" />' +
						'<label for="0PA' + i + '">' + name + '</label>' +
						'</li>';
				}
				if (format.toUpperCase() == '0DA') {
					strHtml0da +=
						'<li>' +
						'<input type="radio" ' +
						'       name="0DA" ' +
						'       id="0DA' + i + '" ' +
						'       onclick="RMTClickEvent.toggleChecked(this.id)" ' +
						'       value="' + nameFormat + size + md5 + '" />' +
						'<label for="0DA' + i + '">' + name + '</label>' +
						'</li>';
				}
			}
			$("#id0ba_A061").html(strHtml0ba);
			$("#id0pa_A061").html(strHtml0pa);
			$("#id0da_A061").html(strHtml0da);

			if (strHtml0ba != '') {
				$("#id0ba_A061").after("<hr/>");
			}
			if (strHtml0pa != '') {
				$("#id0pa_A061").after("<hr/>");
			}
			if (strHtml0da != '') {
				$("#id0da_A061").after("<hr/>");
			}

			tool.layout("module_A061", 0);

			tool.bottomBtn({
				btn1Text:"确定",
				btn1Callback:function(){
					programFileNext();
				},
				btn2Text:"返回",
				btn2Callback:function(){
					programFileReturn();
				}
			});
			tool.layout('programFile_A061', 1);
		//}
		//else {
		//	tool.alert(varJson.CODEDATA, function () {
		//
		//		tool.bottomBtn({
		//			btn1Text:"下一步",
		//			btn1Callback:function(){
		//				moduleNext();
		//			},
		//			btn2Text:"返回",
		//			btn2Callback:function(){
		//				moduleReturn();
		//			}
		//		});
		//		tool.layout("module_A061", 1);
		//		tool.layout('programFile_A061', 0);
		//	});
		//}
	};

	//TODO 扫描车辆类型信息
	win.serverRequestCallback.getCarCategory_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));
		win.tool.loading(0);
		//var varData = recvData;
		//var varData = tool.HexUnicodeToString(varJson.CODEDATA);

		$("#moduleListTitle_A061").html("扫描（" + recvData + "）全车模块信息");

		var msg = "车辆类型：" + recvData + $("#carInfo_A061").html();
		$("#carInfo_A061").html(msg);
		tool.loading(0);
		tool.bottomBtn({
			btn1Text:"扫描方式",
			btn1Callback:function(){
				Fun310529Ok(1);
			},
			btn2Text:"快速方式",
			btn2Callback:function(){
				Fun310529Ok(2);
			},
			btn3Text:"跳过",
			btn3Callback:function(){
				Fun310529Cancel();
			}
		});

		tool.layout('scanModuleConfirm_A061', 1);

	};

	//TODO 扫描模块名称 "cas"
	win.serverRequestCallback.getModuleName_A061 = function (recvData, params) {

		//var varJson = JSON.parse(getBse64Decode(recvData));
		var strHtml = "";

		//if (varJson.CODETYPE == 'OK') {
			//var recvData = tool.HexUnicodeToString(varJson.CODEDATA);
			if (gModuleInfoArray.length <= 0) {
				//tool.processBar("模块信息缓存失败，请重试");
				Fun31080802();
				return;
			}

			var moduleInfoMap = gModuleInfoArray[gModuleInfoArray.length - 1];		//因为一次只请求一个模块信息，有响应才继续

			moduleInfoMap.modelName = recvData;
			gModuleInfoArray[gModuleInfoArray.length - 1] = moduleInfoMap;		    //把模块名称加入缓存

			strHtml +=
				'<tr onClick="RMTClickEvent.rowClick(' + moduleInfoMap.index + ')">' +
				'   <td class="t-center">' + moduleInfoMap.index + '</td>' +
				'   <td>' + recvData + '</td>' +
				'   <td class="t-center">' + moduleInfoMap.address + '</td>' +
				'</tr>';

			$("#carModuleInfoList").append(strHtml);

			//数据滚动
			if (gscrollFlag) {
				//		   				tool.scrollToBottom("#mainDiv", "#carModuleList_A061", "bottom");
			}

			if (scanNextFlag) Fun31080801();	//继续扫描

		//}
		//else {
		//	tool.alert(varJson.CODEDATA + "，确定之后继续扫描", function () {
		//		Fun31080801();
		//	});
		//}
	};

	//TODO 点击显示详细信息
	win.RMTClickEvent.rowClick = function (index) {
		gscrollFlag = false;
		var index_int = parseFloat(index);
		var obj = gModuleInfoArray[index_int - 1];

		$("#moduleDetailTitle_A061").html(obj.modelName + "模块信息");

		var strHtml =
			'<li style="list-style: none;padding-left: 1.6rem;">模块名称：' + obj.modelName + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">诊断地址：' + obj.address + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">车架号码：' + obj.carNum + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">硬件版本1：' + obj.hardVersion1 + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">硬件版本2：' + obj.hardVersion2 + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">软件版本：' + obj.softVersion + '</li>'
			+ '<li style="list-style: none;padding-left: 1.6rem;">引导版本：' + obj.guideVersion + '</li>';

		$("#moduleDetail_A061").html(strHtml);
		tool.popShow('moduleInfoDetail_A061', 1);
	};

	win.RMTClickEvent.moduleDetailReturn = function () {
		gscrollFlag = true;
		tool.popShow('moduleInfoDetail_A061', 0);
	};

	//请求下载 0x2108+文件名ASCII(32B)+文件大小(4B)+MD5值(16B)+加密类型(2B)+文件类型(2B)	PC应答：成功-0x6108
	win.devInterActive.Fun2108 = function (recvData) {

		//var fileName = tool.hex2a( recvData.substr(4, 32 * 2) );
		var fileName = recvData.substr(4, 32 * 2);


		fileName = tool.subLast(fileName, "00");
		fileName = tool.hex2a(fileName);

		win.appService.sendDataToApp(3026, JSON.stringify({filePath:fileName, pathType: 1 }), 0);
	};


	//流程执行结果  0x1201+[00(成功)]/[01(OBD错误)+错误代码(6B)]/[02(设备错误)+错误代码(4B)]
	win.devInterActive.Fun1201 = function (recvData) {

		var strCommand = recvData.substr(4, 2);
		var strShowMsg = '错误的指令信息:' + recvData;
		switch (strCommand) {
			case '00':
				strShowMsg = '业务操作执行成功';
				break;
			case '01':
				var strTmp = recvData.substr(6, 6 * 2);
				strShowMsg = 'OBD错误，错误码:' + strTmp;
				break;
			case '02':
				var strTmp = recvData.substr(6, 4 * 2);
				strShowMsg = '设备错误，错误码:' + strTmp;
				break;
		}
		tool.alert(strShowMsg, function () {
			win.appService.sendDataToApp(3999, "", "");
		});
	};


	//编程文件信息     0x2106+文件类型(2B)+ECU地址HEX(1B)+硬件版本1 ASCII(7B)+硬件版本2 ASCII(7B)+引导版本ASCII(6B)
	//	 PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(1B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)] }/02(失败)
	win.devInterActive.Fun2106 = function (recvData) {

		gFileType = recvData.substr(4, 2 * 2);	//文件类型(2B)

		var input_checked = tool.getCheckedElement("operate");
		if (!input_checked) {
			//tool.processBar("请选择一个选项");
			return
		}
		//tool.processBar("");
		var seleFlag = input_checked.value;
		//选择编程版本（ZUSB） or 输入编程版本（ZUSB）
		if (seleFlag == '01' || seleFlag == '02') {

			input_checked = tool.getCheckedElement("programOption_A061");
			if (!input_checked) {
				//tool.processBar("请选择一个选项");
				return
			}
			//tool.processBar("");
			var programOption = input_checked.value;

			if (programOption == undefined || programOption == null || programOption == "") {
				programOption = "0000000";
			}
			var data = tool.hex2a(recvData.substr(10, 7 * 2)) +
				tool.hex2a(recvData.substr(24, 7 * 2)) +
				tool.hex2a(recvData.substr(38, 6 * 2)) +
				programOption;

			data = getBse64Encode(data);   //编码

			//var varSendData = "{'subURL':'" + CONSTANT.SERVER_ADDRESS + "','data':[{'ServerType':'15'},{'DataType':'7'},{'DataPack':'" + data + "'}]}";
			//var varSendData = JSON.stringify({subURL: CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"7"},{DataPack: data }]});
			//win.external.RequestDataFromServer(3021, varSendData, getFileCallBack);

			win.server.request(15, 7, {DataPack: data},win.serverRequestCallback.getFile_A061)
		}

		//指定编程文件（慎用）
		if (seleFlag == '03') {

			var command = '';
			var count = 0;
			var val;
			input_checked = tool.getCheckedElement("0BA");
			if (!input_checked) {
				//tool.processBar("请选择一个选项");
				return
			}
			//tool.processBar("");
			val = input_checked.value;

			if (val != null && val != undefined) {

				count++;
				command += val;
			}

			input_checked = tool.getCheckedElement("0PA");
			if (!input_checked) {
				//tool.processBar("请选择一个选项");
				return
			}
			//tool.processBar("");
			val = input_checked.value;

			if (val != null &&
				val != undefined) {

				count++;
				command += val;
			}

			input_checked = tool.getCheckedElement("0DA");
			if (!input_checked) {
				//tool.processBar("请选择一个选项");
				return
			}
			//tool.processBar("");
			val = input_checked.value;

			if (val != null &&
				val != undefined) {

				count++;
				command += val;
			}

			command = '6106' + gFileType + '01' + tool.toHex(count, 2) + command;

			win.sendDataToDev(command);
		}
	};

	//编程密钥信息
	win.devInterActive.Fun2703 = function (recvData) {
		//var varSendData = "{'subURL':'" + CONSTANT.SERVER_ADDRESS + "','data':[{'ServerType':'15'},{'DataType':'8'},{'DataPack':''}]}";
		//var varSendData = JSON.stringify({subURL: CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"8"},{DataPack:""}]});
		//win.external.RequestDataFromServer(3021, varSendData, getKeyCallBack);

		win.server.request(15, 8, {DataPack: ""},win.serverRequestCallback.getKey_A061)
	};

	//编程文件下载到手机端
	//0x2105+文件数量n(1B)+n*[文件名称(32B)+文件大小(4B)+MD5值(16B)]
	win.devInterActive.Fun2105 = function (recvData) {

		//循环需要下载的文件名，分别发送指令给APP进行下载，每下载一个提示一次，全部下载后响应设备；提示需要APP提供新的响应，目前还未定
		var count = recvData.substr(4, 2);

		gdownloadFilesNumHex = count;	//数量放入缓存，16进制

		count = tool.hex2dec(count);

		gdownloadFilesNum = count;	//数量放入缓存

		gdownloadFilesName = recvData.substr(6, (32 + 4 + 16) * 2 * count);		//文件信息放入缓存

		// tool.log('count: '+gdownloadFilesNumHex + ' -- ' + gdownloadFilesNum);
		//tool.log('gdownloadFilesName: '+gdownloadFilesName);

		//tool.processBar('正在从服务器下载编程文件');

		downloadForFun2105(gdownloadFilesNum, gdownloadFilesName);		//调用下载方法
	};

	//文件下载到手机  PC应答：0x6105+[01(成功)+文件数量n(1B)]/02(失败)
	/*
	 * 算法说明：向手机发送下载请求，参数为下载文件数量+[文件名称(32B)+文件大小(4B)]*N
	 * 一次只下载一个文件，在下载成功的响应处理函数里再调用此方法，调用前要先将数量 减一，并截掉已下载的文件信息
	 * 如果下载失败，则直接将数量置为 -1
	 */
	function downloadForFun2105(filesNum, filesNameSize) {

		//tool.log('downloadForFun2105: ['+ filesNum + '][' + filesNameSize + ']');

		//下载未完成
		if (filesNum > 0) {

			var fileSize = tool.hex2dec(filesNameSize.substr(32 * 2, 4 * 2));
			var fileName = filesNameSize.substr(0, 32 * 2);

			//去掉补齐的'00'
			for (var i = 0; i < 32; i++) {

				var len = fileName.lastIndexOf('00');
				if (len > 0) {
					fileName = fileName.substr(0, len);
				}
			}
			fileName = tool.hex2a(fileName);

			var varSendData = JSON.stringify({fileName: fileName, fileSize: fileSize});
			win.appService.sendDataToApp(3001, varSendData,win.serverRequestCallback.appDownloadEnd_A061);
			//win.external.RequestDataFromServer(3001, varSendData, "3001");	//请求下载
		}
		if (filesNum == 0 && gdownloadFilesNumHex != '0x00') {

			//tool.log('下载完成：610501'+gdownloadFilesNumHex);
			win.sendDataToDev('610501' + gdownloadFilesNumHex);
		}
		//下载出现失败
		if (filesNum == -1) {
			win.sendDataToDev('610502');
		}
	}


	//OBD编程相关
	win.devInterActive.Fun3105 = function (recvData) {
		//命令协议
		var strCommand = recvData.substr(4, 2);
		var strShowMsg = '错误的指令信息:' + strCommand;

		switch (strCommand) {
			case '29':
				Fun310529(recvData); 	//全车模块扫描
				break;
			case '37':
				Fun310537(recvData);  	//请求编程确认
				break;
			case '36':
				Fun310536(recvData); 	//编程模块选择
				break;
			case '19':
				Fun310519(recvData); 	//车辆接口选择
				break;
			case '39':
				Fun310539(recvData); 	//模块信息显示
				break;
			case '3A':
				//Fun31053A(recvData); 	//请求文件信息
				break;
			default:
				tool.log(strShowMsg);
		}
	};


	//全车模块扫描   0x3105+0x29(全车模块扫描确认)+车辆类型ASCII(4B)+车架号ASCII(17B)
	function Fun310529(recvData) {

		var type = tool.hex2a(recvData.substr(6, 4 * 2));
		var num = tool.hex2a(recvData.substr(14, 17 * 2));

		var msg = "<br>车架号码：" + num;		//先赋值车架号，回调里再赋值车辆类型
		$("#carInfo_A061").html(msg);

		var data = getBse64Encode(type);   //编码

		//扫描车辆类型信息
		//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"12"},{DataPack:data }]});
		//if(sessionStorage)sessionStorage.setItem("getCarCategory",data);
		//win.external.RequestDataFromServer(3021, varSendData, getCarCategoryCallBack);

		win.server.request(
			15, 12, {DataPack: data},
			win.server.addCallbackParam(win.serverRequestCallback.getCarCategory_A061, [data]),
			[function () {
				win.server.request(
					15, 12, {DataPack: params},
					win.serverRequestCallback.getCarCategory_A061
				)
			},
				function () {
					win.appService.sendDataToApp(3999, "", "");
				}
			]
		)
	}

	//全车模块扫描	0x3105+0x29(全车模块扫描确认)+车辆类型ASCII(4B)+车架号ASCII(17B)	PC应答：0x7105+29+01(完全扫描)/02(快速扫描)/03(跳过扫描)
	//待用户完成数据库/车型选择后再应答DEV。
	function Fun310529Ok(flag) {

		if (flag == 1) {
			gScanType = "01";
		}
		if (flag == 2) {
			gScanType = "02";
		}

		gScanFlag = true;
		tool.layout('scanModuleConfirm_A061', 0);

		//TODO 通过接口查询数据库/车型
		//接口：获取数据版本列表
		//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"1"},{DataPack:""}]});
		//win.external.RequestDataFromServer(3021, varSendData, getDatabaseCallBack);

		win.server.request(15, 1, {DataPack: ""},win.serverRequestCallback.showDatabaseVersion_A061)
	}

	function Fun310529Cancel() {

		gScanFlag = false;

		tool.layout('scanModuleConfirm_A061', 0);

		win.sendDataToDev("71052903");
	}

	//请求编程确认  PC应答：0x7105+37+01(重新扫描)/02(下一步)
	function Fun310537(recvData) {
		win.tool.loading(0);
		$('#stopButton_A061').addClass("event-disable button-disable");
		$('#rescanButton_A061').removeClass("event-disable  button-disable");
		$('#nextStepButton_A061').removeClass("event-disable  button-disable");
	}

	function Fun31053701(recvData) {
		scanNextFlag = true;
		//tool.processBar("正在检索模块信息",true,"scanStatusTip_A061");
		tool.clock("ShowStatusMessage");
		//tool.processBar("-/-","scanState_A061");
		$('#stopButton_A061').removeClass("event-disable  button-disable");
		$('#rescanButton_A061').addClass("event-disable  button-disable");
		$('#nextStepButton_A061').addClass("event-disable  button-disable");
		gModuleInfoArray.length = 0;	//重置模块缓存

		//重置列表
		$("#carModuleInfoList").html('<tr><td class="t-center">编号</td><td class="t-center">模块名称</td><td class="t-center">地址</td></tr>');
		win.sendDataToDev("71053701");
	}

	function Fun31053702(recvData) {
		//tool.processBar("");
		tool.layout('carModuleList_A061', 0);
		win.sendDataToDev("71053702");
	}


	//编程模块选择	0x3105+0x36(模块选择)+车架号ASCII(17B)
	// PC应答：0x7105+36+[01(成功)+ECU地址HEX(1B)+选择ECU版本ASCII(7B)+输入车架号ASCII(17B)]/02(失败)
	function Fun310536(recvData) {
		win.tool.loading(0);
		//TODO
		gScanFlag = false;		//true会当成扫描全车模块
		var carFrameNum = tool.hex2a(recvData.substr(6, 17 * 2));
		$("#inputFrameNum_A061").val(carFrameNum);
		//tool.processBar("");

		tool.bottomBtn({
			btn1Text:"确定",
			btn1Callback:function(){
				Fun310536Ok();
			},
			btn2Text:"取消",
			btn2Callback:function(){
				Fun310536Cancel();
			}
		});

		tool.layout('ECUSelect_A061', 1);
		tool.inputStyleModify("ECUSelect_A061", "radio");
	}

	//选择版本获取方式 下一步 获取数据库版本列表
	function Fun310536Ok() {

		var input_checked = tool.getCheckedElement("operate");
		if (!input_checked) {
			//tool.processBar("请选择一个选项");
			return
		}
		//tool.processBar("");
		tool.layout('ECUSelect_A061', 0);
		var operateValue = input_checked.value;

		//选择编程版本（ZUSB）or 指定编程文件（慎用）
		if (operateValue == '01' || operateValue == '03') {

			//TODO 如果执行了全车模块扫描，就不需要再查数据库及车型

			//接口：获取数据版本列表
			//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"1"},{DataPack:""}]});
			//win.external.RequestDataFromServer(3021, varSendData, getDatabaseCallBack);
			win.server.request(15, 1, {DataPack: ""},win.serverRequestCallback.showDatabaseVersion_A061)
		}

		//输入编程版本（ZUSB）
		if (operateValue == '02') {
			tool.popShow('partNum_A061', 1);
			$("#inputPartNum_A061").focus();
		}
	}

	//取消选择版本获取方式
	function Fun310536Cancel() {
		win.tool.loading({pos: "body", text: "正在退出业务..."});
		tool.layout('ECUSelect_A061', 0);
		var command = '71053602';
		tool.log('用户选择退出');
		win.sendDataToDev(command);
	}

	//获取编程模块失败 PC应答：0x7105+36+02(失败)
	function Fun310536Fail() {
		win.sendDataToDev("71053602");
	}

	//选择数据库版本 下一步，获取车型列表
	function database_A061Next() {
		var input_checked = tool.getCheckedElement("dbOption_A061");

		if (!input_checked) {
			//tool.processBar("请选择一个选项");
			return
		}
		//tool.processBar("");

		var dbVersion = input_checked.value;

		$("#carTypeTitle").html(dbVersion + ' &rarr; 选择车型：');

		tool.layout("database_A061", 0);

		var data = getBse64Encode(dbVersion);   //编码

		//var varSendData = JSON.stringify({subURL: CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:2},{DataPack: data }]});
		//win.external.RequestDataFromServer(3021, varSendData, getCarTypeCallBack);

		win.server.request(15, 2, {DataPack: ""},win.serverRequestCallback.showCarType_A061)
	}

	//选择数据库版本 返回
	function database_A061Return() {
		win.tool.loading(0);
		tool.layout('database_A061', 0);

		//执行全车模块扫描时
		if (gScanFlag) {
			tool.bottomBtn({
				btn1Text:"扫描方式",
				btn1Callback:function(){
					Fun310529Ok(1);
				},
				btn2Text:"快速方式",
				btn2Callback:function(){
					Fun310529Ok(2);
				},
				btn3Text:"跳过",
				btn3Callback:function(){
					Fun310529Cancel();
				}
			});
			tool.layout('scanModuleConfirm_A061', 1);
			return;
		}
		tool.bottomBtn({
			btn1Text:"确定",
			btn1Callback:function(){
				Fun310536Ok();
			},
			btn2Text:"取消",
			btn2Callback:function(){
				Fun310536Cancel();
			}
		});
		tool.layout('ECUSelect_A061', 1);
	}

	//选择车型 下一步，获取模块列表
	function carTypeNext_A061() {
		win.tool.loading({text: "在正获取模块列表..."});
		tool.layout("carType_A061", 0);
		//TODO  如果是执行了全车模块扫描，则选完车就应答DEV
		if (gScanFlag) {
			var msg = "";
			if (gScanType == "01") {
				msg = "执行全车模块完全扫描";
				win.sendDataToDev("71052901");
			}
			if (gScanType == "02") {
				msg = "执行全车模块快速扫描";
				win.sendDataToDev("71052902");
			}
			tool.log(msg);
			win.tool.loading({text: "正在查阅车辆模块信息..."});
			tool.clock("ShowStatusMessage", "carModuleList_A061");
			return;
		}

		var input_checked = tool.getCheckedElement("dbOption_A061");
		var dbVersion = input_checked.value;

		input_checked = tool.getCheckedElement("carOption_A061");
		var type = input_checked.value;

		$("#moduleTitle_A061").html(dbVersion + ' &rarr; ' + type + ' &rarr; ' + '选择模块：');

		var data = getBse64Encode(type);   //编码

		//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"3"},{DataPack:data }]});
		//win.external.RequestDataFromServer(3021, varSendData, getModulesCallBack);

		win.server.request(15, 3, {DataPack: data}, win.serverRequestCallback.showModules_A061)
	}

	//选择车型 返回
	function carTypeReturn_A061() {
		tool.layout('carType_A061', 0);
		tool.bottomBtn({
			btn1Text:"下一步",
			btn1Callback:function(){
				database_A061Next();
			},
			btn2Text:"返回",
			btn2Callback:function(){
				database_A061Return();
			}
		});
		tool.layout('database_A061', 1 ,["下一步",database_A061Next],["返回",database_A061Return]);
	}

	//选择模块 下一步，获取编程版本列表
	function moduleNext() {

		var dbVersion,
			type,
			module,
			data,
			varSendData,
			input_checked;

		input_checked = tool.getCheckedElement("operate");
		if (!input_checked) {
			//tool.processBar("请选择一个选项");
			return
		}

		//tool.processBar("");
		var flag = input_checked.value;
		win.tool.loading({pos: "body", text: "正在获取编程版本列表..."});

		//选择编程版本（ZUSB）时
		if (flag == '01') {
			input_checked = tool.getCheckedElement("dbOption_A061");
			dbVersion = input_checked.value;

			input_checked = tool.getCheckedElement("carOption_A061");
			type = input_checked.value;

			input_checked = tool.getCheckedElement("moduleOption_A061");
			module = input_checked.value;

			$("#programTitle").html(dbVersion + ' &rarr; ' + type + ' &rarr; ' + module + ' &rarr; ' + '选择编程版本：');

			data = getBse64Encode(module);   //编码

			//varSendData = "{'subURL':'" + CONSTANT.SERVER_ADDRESS + "','data':[{'ServerType':'15'},{'DataType':'4'},{'DataPack':'" + data + "'}]}";
			//varSendData = JSON.stringify({subURL: CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"4"},{DataPack:data}]});
			//win.external.RequestDataFromServer(3021, varSendData, getProgramCallBack);
			win.server.request(15, 4, {DataPack: data},win.serverRequestCallback.showProgram_A061)
		}

		//输入编程版本（ZUSB）时
		if (flag == '02') {

			input_checked = tool.getCheckedElement("moduleOption_A061");

			module = input_checked.value;

			data = getBse64Encode(module);   //编码

			var arr = module.split('/');
			$("#programTitle").html(arr[1] + ' &rarr; ' + arr[2] + ' &rarr; ' + arr[3] + ' &rarr; ' + '选择编程版本：');

			//varSendData = "{'subURL':'" + CONSTANT.SERVER_ADDRESS + "','data':[{'ServerType':'15'},{'DataType':'9'},{'DataPack':'" + data + "'}]}";
			//varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"9"},{DataPack:data }]});
			//win.external.RequestDataFromServer(3021, varSendData, getProgramCallBack);
			win.server.request(15, 9, {DataPack: data},win.serverRequestCallback.showProgram_A061)
		}

		//指定编程文件（慎用）
		if (flag == '03') {
			var inputCheck = tool.getCheckedElement("dbOption_A061");

			dbVersion = inputCheck.value;

			inputCheck = tool.getCheckedElement("carOption_A061");

			type = inputCheck.value;

			inputCheck = tool.getCheckedElement("moduleOption_A061");

			module = inputCheck.value;

			$("#programTitle").html(dbVersion + ' &rarr; ' + type + ' &rarr; ' + module + ' &rarr; ' + '请选择编程文件：');

			data = getBse64Encode(module);   //编码

			//varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"10"},{DataPack:data }]});
			//win.external.RequestDataFromServer(3021, varSendData, getProgramFileCallBack);
			win.server.request(15, 10, {DataPack: data},win.serverRequestCallback.getProgramFile_A061)
		}
	}

	//选择模块 返回
	function moduleReturn() {

		var inputCheck = tool.getCheckedElement("operate");

		var flag = inputCheck.value;

		tool.layout('module_A061', 0);

		if (flag == '02') {
			tool.popShow('partNum_A061', 1);
			return;
		}

		tool.bottomBtn({
			btn1Text:"下一步",
			btn1Callback:function(){
				carTypeNext_A061();
			},
			btn2Text:"返回",
			btn2Callback:function(){
				carTypeReturn_A061();
			}
		});

		tool.layout('carType_A061', 1);
	}

	//选择编程版本 下一步，输入车架号
	function programNext() {
		tool.layout('programVersion_A061', 0);
		tool.popShow('frameNum_A061', 1);
		$("#inputFrameNum_A061").focus();
	}

	//选择编程版本 返回
	function programReturn() {
		tool.layout('programVersion_A061', 0);
		tool.bottomBtn({
			btn1Text:"下一步",
			btn1Callback:function(){
				moduleNext();
			},
			btn2Text:"返回",
			btn2Callback:function(){
				moduleReturn();
			}
		});
		tool.layout('module_A061', 1);
	}

	//输入车架号 下一步，发送指令：编程模块选择	 PC应答：0x7105+36+[01(成功)+ECU地址HEX(1B)+选择ECU版本ASCII(7B)+用户输入车架号ASCII(17B)]/02(失败)
	win.RMTClickEvent.frameNumNext = function () {

		tool.popShow('frameNum_A061', 0);
		win.tool.loading({text: "正在获取编程模块信息..."});
		tool.log("正在获取编程模块信息");
		//tool.processBar("正在获取编程模块信息");
		var dbVersion,
			type,
			module,
			data,
			varSendData,
			inputCheck;

		inputCheck = tool.getCheckedElement("operate");
		var flag = inputCheck.value;

		//选择编程版本（ZUSB）
		if (flag == '01' || flag == '03') {
			//请求通信地址，在回调中发送指令；长度（2B）数据库版本+长度（2B）车型+长度（2B）模块
			inputCheck = tool.getCheckedElement("dbOption_A061");

			dbVersion = inputCheck.value;

			inputCheck = tool.getCheckedElement("carOption_A061");

			type = inputCheck.value;

			inputCheck = tool.getCheckedElement("moduleOption_A061");

			module = inputCheck.value;

			data = tool.toHex(dbVersion.length + '', 4) + dbVersion + tool.toHex(type.length + '', 4) + type + tool.toHex(module.length + '', 4) + module;

			data = getBse64Encode(data);   //编码

			//varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"6"},{DataPack:data }]});
			//win.external.RequestDataFromServer(3021, varSendData, getAddressCallBack);
			win.server.request(15, 6, {DataPack: data},win.serverRequestCallback.getECUAddress_A061)
		}

		//输入编程版本（ZUSB）
		if (flag == '02') {

			inputCheck = tool.getCheckedElement("moduleOption_A061");

			module = inputCheck.value;

			data = getBse64Encode(module);   //编码


			//varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"6"},{DataPack:data }]});
			//win.external.RequestDataFromServer(3021, varSendData, getAddressCallBack);
			win.server.request(15, 6, {DataPack: data},win.serverRequestCallback.getECUAddress_A061)
		}
	};

	//输入车架号 返回
	win.RMTClickEvent.frameNumReturn = function () {

		tool.popShow('frameNum_A061', 0);

		var inputCheck = tool.getCheckedElement("operate");

		if (inputCheck.value != "03") {
			tool.bottomBtn({
				btn1Text:"下一步",
				btn1Callback:function(){
					programNext();
				},
				btn2Text:"返回",
				btn2Callback:function(){
					programReturn();
				}
			});
			tool.layout('programVersion_A061', 1);
		}
		else {

			tool.bottomBtn({
				btn1Text:"确定",
				btn1Callback:function(){
					programFileNext();
				},
				btn2Text:"返回",
				btn2Callback:function(){
					programFileReturn();
				}
			});
			tool.layout('programFile_A061', 1);
		}
	};

	//车辆接口选择	0x3105+0x19(选择接口)	PC应答：0x7105+0x19+[0x01(确定)+接口代码(1B)]/0x02(取消)
	//只有自动检测失败才有此消息
	function Fun310519(recvData) {
		win.tool.loading(0);

		tool.bottomBtn({
			btn1Text:"确定",
			btn1Callback:function(){
				Fun310519Ok();
			},
			btn2Text:"退出",
			btn2Callback:function(){
				Fun310519Cancel();
			}
		});
		tool.layout('fun310519', 1);
		tool.inputStyleModify('fun310519', "radio");
	}

	//选择车辆接口确定
	function Fun310519Ok(recvData) {
		tool.layout('fun310519', 0);

		var inputCheck = tool.getCheckedElement("radio310519");

		var command = '71051901' + inputCheck.value;
		win.sendDataToDev(command);
	}

	//选择车辆接口 取消
	function Fun310519Cancel(recvData) {
		win.tool.loading({pos: "body", text: "正在退出业务..."});
		tool.layout('fun310519', 0);
		win.sendDataToDev('71051902');
	}

	//模块信息显示  0x3105+0x39+车架号ASCII(17B)+硬件版本1 ASCII(7B)+硬件版本2
	// ASCII(7B)+软件版本ASCII(9B)+引导程序版本ASCII(6B)+零件号码ASCII(7B)+编程状态(1B) PC应答：0x7105+39+01(继续)/02(取消) 注：编程状态(1B)提示：== 1
	// 提示‘可编程’，== 其它 提示‘不可编程’。
	function Fun310539(recvData) {

		var strHtml = '<li>车架号：' + tool.hex2a(recvData.substr(6, 17 * 2)) + '</li>';
		strHtml += '<li>硬件版本1：' + tool.hex2a(recvData.substr(40, 7 * 2)) + '</li>';
		strHtml += '<li>硬件版本2：' + tool.hex2a(recvData.substr(54, 7 * 2)) + '</li>';
		strHtml += '<li>软件版本：' + tool.hex2a(recvData.substr(68, 9 * 2)) + '</li>';
		strHtml += '<li>引导程序版本：' + tool.hex2a(recvData.substr(86, 6 * 2)) + '</li>';

		//gpartNum = tool.hex2a(recvData.substr(98, 7 * 2));
		//strHtml += '零件号码：'+ gpartNum;

		partNum_A061 = tool.hex2a(recvData.substr(98, 7 * 2));
		strHtml += '<li>零件号码：' + partNum_A061 + '</li>';

		programState = recvData.substr(112, 2);
		programState = programState == "01" ? "可编程" : "不可编程";
		strHtml += '<li>编程状态：' + programState + '</li>';

		$("#moduleInfoPage_A061").html(strHtml);
		win.tool.loading(0);
		//tool.processBar("模块信息获取完毕");
		tool.bottomBtn({
			btn1Text:"确定",
			btn1Callback:function(){
				fun310539Ok();
			},
			btn2Text:"取消",
			btn2Callback:function(){
				fun310539Cancel();
			}
		});

		tool.layout('moduleInfo_A061', 1);
	}

	//模块信息显示 继续
	function fun310539Ok() {
		tool.layout('moduleInfo_A061', 0);

		//TEST
		tool.log("开始" + getModule() + "模块编程流程");
		win.tool.loading({text: "开始" + getModule() + "模块编程流程"});

		win.sendDataToDev('71053901');
	}

	//模块信息显示 取消
	function fun310539Cancel() {
		win.tool.loading({pos: "body", text: "正在退出业务..."});
		tool.layout('moduleInfo_A061', 0);
		win.sendDataToDev('71053902');
	}


	//输入零件号 下一步 获取零件相关信息
	win.RMTClickEvent.partNumNext = function () {

		var data = $("#inputPartNum_A061").val();

		if (data == null || data == undefined || data.length != 7) {
			tool.warnTip("tipPartNum", "请输入7位零件号!");
			return;
		}
		else {
			tool.warnTip("tipPartNum", "");
		}
		data = getBse64Encode(data);   //编码

		//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"5"},{DataPack:data }]});
		//win.external.RequestDataFromServer(3021, varSendData, getPartCallBack);
		win.server.request(15, 5, {DataPack: data},win.serverRequestCallback.getPart_A061)
	};

	//输入零件号 返回
	win.RMTClickEvent.partNumReturn = function () {
		tool.popShow('partNum_A061', 0);

		tool.bottomBtn({
			btn1Text:"确定",
			btn1Callback:function(){
				Fun310536Ok();
			},
			btn2Text:"取消",
			btn2Callback:function(){
				Fun310536Cancel();
			}
		});
		tool.layout('ECUSelect_A061', 1);
	};

	//选择编程文件 下一步 输入车架号
	function programFileNext() {

		var EL_OBA = tool.getCheckedElement("0BA");
		var EL_0PA = tool.getCheckedElement("0PA");
		var EL_0DA = tool.getCheckedElement("0DA");

		if ((EL_OBA.value == null || EL_OBA.value == undefined)
			&&
			(EL_0PA.value == null || EL_0PA.value == undefined)
			&&
			(EL_0DA.value == null || EL_0DA.value == undefined)) {
			return;
		}

		tool.layout('programFile_A061', 0);
		tool.popShow('frameNum_A061', 1);
		$("#inputFrameNum_A061").focus();
	}

	//选择编程文件 返回
	function programFileReturn() {
		tool.layout('programFile_A061', 0);
		tool.bottomBtn({
			btn1Text:"下一步",
			btn1Callback:function(){
				moduleNext();
			},
			btn2Text:"返回",
			btn2Callback:function(){
				moduleReturn();
			}
		});
		tool.layout('module_A061', 1);
	}


	//OBD编程相关
	win.devInterActive.Fun3106 = function (recvData) {

		//命令协议
		var strCommand = recvData.substr(4, 2);
		var strShowMsg = '错误的指令信息:' + strCommand;

		switch (strCommand) {
			case '14':
				win.devInterActive.Fun310614(recvData); 	//设备检查结果
				break;
			case '11':
				win.devInterActive.Fun310611(recvData); 	//车辆通信结果
				break;
			case '0F':
				win.devInterActive.Fun31060F(recvData); 	//模块编程结果
				break;
			case '17':
				win.devInterActive.Fun310617(recvData); 	//文件校验结果
				break;
			case '0D':
				win.devInterActive.Fun31060D(recvData); 		//编程引导结果
				break;
			default:
				tool.log(strShowMsg);
		}
	};

	//0x3106+0x11(OBD通信状态)+0x01/0x03/0x04/0x05
	win.devInterActive.Fun310611 = function (recvData) {
		var strCommand = recvData.substr(6, 2);
		switch (strCommand) {
			case '01':
				tool.log('诊断设备与汽车通信失败');
				//tool.processBar('诊断设备与汽车通信失败');
				break;
			case '03':
				tool.log('OBDII-KWP通信成功');
				//tool.processBar('OBDII-KWP通信成功');
				break;
			case '04':
				tool.log('KWP-CAN 100Kbps通信成功');
				//tool.processBar('KWP-CAN 100Kbps通信成功');
				break;
			case '05':
				tool.log('KWP-CAN 500Kbps通信成功');
				//tool.processBar('KWP-CAN 500Kbps通信成功');
				break;
		}
	};

	//编程模块结果	0x3106+0x0F(编程ECU)+0x01(成功)/0x02(失败)
	win.devInterActive.Fun31060F = function (recvData) {

		var strCommand = recvData.substr(6, 2);
		var module = getModule() || "";
		switch (strCommand) {
			case '01':
				tool.log(module + '模块编程成功');
				//tool.processBar(module + '模块编程成功');
				win.tool.loading({text: module + '模块编程成功,正在结束操作...'});
				break;
			case '02':
				tool.log(module + '模块编程失败');
				//tool.processBar(module + '模块编程失败');
				win.tool.loading({text: module + '模块编程失败,正在结束操作...'});
				break;
		}

	};

	//文件校验结果  0x3106+0x17(文件校验)+0x01(引导程序)+0x01(成功)/0x02(失败)
	win.devInterActive.Fun310617 = function (recvData) {
		var type = recvData.substr(6, 2) + '';
		var strCommand = recvData.substr(8, 2);

		switch (strCommand) {
			case '01':
				tool.log('校验' + typeNameEnum[type] + '文件成功');
				//tool.processBar('正在准备编程' + typeNameEnum[type] + '文件');
				win.tool.loading({text: '正在准备编程' + typeNameEnum[type] + '文件'});
				break;
			case '02':
				tool.log('校验' + typeNameEnum[type] + '文件失败');
				//tool.processBar('校验' + typeNameEnum[type] + '文件失败');
				win.tool.loading(0);
				break;
		}
	};

	//编程引导结果  0x3106+0x0D(编程校验)+0x01(引导程序)+01(成功)/02(失败)
	//	0x3106+0x0D(编程校验)+0x02(应用程序)+01(成功)/02(失败)
	win.devInterActive.Fun31060D = function (recvData) {
		var type = recvData.substr(6, 2) + '';

		var strCommand = recvData.substr(8, 2);
		switch (strCommand) {
			case '01': 	//擦除FLASH
				tool.log('编程' + typeNameEnum[type] + '文件成功');
				//tool.processBar('编程' + typeNameEnum[type] + '文件成功');
				break;
			case '02':
				tool.log('编程' + typeNameEnum[type] + '文件失败');
				//tool.processBar('编程' + typeNameEnum[type] + '文件失败');
				break;
		}
	};


	//硬件响应
	win.devInterActive.Fun3108 = function (recvData) {

		var strCommand = recvData.substr(4, 2);
		var strShowMsg = '错误的指令信息:' + strCommand;

		switch (strCommand) {
			case '08':
				Fun310808(recvData);		//模块扫描信息
				break;
			case '03':
				win.tool.loading({text: "正在擦除FLASH..."});
				Fun310803(recvData);		//擦除FLASH
				break;
			case '01':
				win.tool.loading({text: "正在编程应用程序..."});
				Fun310801(recvData);		//编程应用程序
				break;
			case '0B':
				win.tool.loading({text: "正在校验程序签名..."});
				Fun31080B(recvData);		//校验程序签名
				break;
			case '0A':
				win.tool.loading({text: "正在加密日志..."});
				Fun31080A(recvData);		//日志加密进度
				break;
			default:
				tool.log(strShowMsg);
		}
	};

	//模块扫描信息
	//0x3108+0x08(模块扫描进度)+总模块数(2B)+当前模块(2B)
	//+[01(成功)+编号(1B)+模块地址(1B)+车架号ASCII(17B)+硬件版本1 ASCII(7B)
	//+硬件版本2 ASCII(7B)+软件版本ASCII(9B)+引导程序版本ASCII(6B)+零件号码ASCII(7B)+编程状态(1B)]/02(失败)
	function Fun310808(recvData) {
		win.tool.loading(0);
		tool.clock(0);
		if (!scanNextFlag) {    //点击停止扫描之后，需要下一条设备信息返回时再做处理；
			//tool.processBar("扫描状态已归零，等待下次操作","scanStatusTip_A061");
			$('#stopButton_A061').addClass("event-disable  button-disable");
			$('#rescanButton_A061').removeClass("event-disable  button-disable");
			$('#nextStepButton_A061').removeClass("event-disable  button-disable");
			win.sendDataToDev("71080802");
			return;
		}

		var offset = 6;
		//扫描进度
		var total = tool.hex2dec(recvData.substr(6, 2 * 2));
		var cur = tool.hex2dec(recvData.substr(10, 2 * 2));
		offset = 14;
		//tool.processBar("扫描模块进度","scanStatusTip_A061");
		//tool.processBar(cur + "/" + total,"scanState_A061");
		var successFlag = recvData.substr(offset, 2);
		offset += 2;

		if (successFlag == '02') {
			Fun31080801();	//失败则继续下一条
			return;
		}

		var index = tool.hex2dec(recvData.substr(offset, 2));
		offset += 2;
		var address = recvData.substr(offset, 2);
		offset += 2;

		var carNum = tool.hex2a(recvData.substr(offset, 17 * 2));	//车架号ASCII(17B)
		offset += 34;
		var hardVersion1 = tool.hex2a(recvData.substr(offset, 7 * 2));	//7B 硬件版本1
		offset += 14;
		var hardVersion2 = tool.hex2a(recvData.substr(offset, 7 * 2));	//7B 硬件版本2
		offset += 14;
		var softVersion = tool.hex2a(recvData.substr(offset, 9 * 2));	//软件版本ASCII(9B)
		offset += 18;
		var guideVersion = tool.hex2a(recvData.substr(offset, 6 * 2));	//引导程序版本ASCII(6B)
		offset += 12;
		var partVersion = tool.hex2a(recvData.substr(offset, 7 * 2));	// 零件号码ASCII(7B)
		offset += 14;
		var programState = recvData.substr(offset, 2);					//编程状态(1B)
		programState = programState == "01" ? "可编程" : "不可编程";


		//存储返回的模块信息
		var moduleInfoMap = {};
		moduleInfoMap.index = index;
		moduleInfoMap.address = address;
		moduleInfoMap.carNum = carNum;
		moduleInfoMap.hardVersion1 = hardVersion1;
		moduleInfoMap.hardVersion2 = hardVersion2;
		moduleInfoMap.softVersion = softVersion;
		moduleInfoMap.guideVersion = guideVersion;
		moduleInfoMap.programState = programState;

		gModuleInfoArray.push(moduleInfoMap);

		//1B 数据版本长度  LB 数据版本
		//1B 车型长度      MB 车型
		var data = "";

		var input_Checked = tool.getCheckedElement("dbOption_A061");
		var dbVersion = input_Checked.value;

		input_Checked = tool.getCheckedElement("carOption_A061");
		var type = input_Checked.value;

		//1B 数据版本长度  LB 数据版本  1B 车型长度   MB 车型 7B 硬件版本1  7B 硬件版本2  4B 车辆类型
		data += tool.toHex(dbVersion.length, 2) + dbVersion + tool.toHex(type.length, 2) + type + hardVersion1 + hardVersion2;

		//扫描模块名称
		data = getBse64Encode(data);   //编码


		//var varSendData = JSON.stringify({subURL:CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"15"},{DataType:"11"},{DataPack:data }]});
		//win.external.RequestDataFromServer(3021, varSendData, getModuleNameCallBack);
		win.server.request(15, 11, {DataPack: data},win.serverRequestCallback.getModuleName_A061);
		if (!$("#carModuleList_A061").is(":visible")) {


			tool.bottomBtn({
				btn1Text:"停止",
				btn1Callback:function(){
					Fun31080802();
				},
				btn2Text:"重新扫描",
				btn2Callback:function(){
					Fun31053701();
				},
				btn3Text:"下一步",
				btn3Callback:function(){
					Fun31053702();
				}
			});

			tool.layout('carModuleList_A061', 1);
		}

		$('#stopButton_A061').removeClass("event-disable  button-disable");
		$('#rescanButton_A061').addClass("event-disable  button-disable");
		$('#nextStepButton_A061').addClass("event-disable  button-disable");
	}

	//PC应答：0x7108+08+01(继续)/02(停止)
	function Fun31080801() {
		//TODO 移到回调函数中
		win.sendDataToDev("71080801");
	}

	function Fun31080802() {
		scanNextFlag = false;	//有响应时才可以发送“停止”指令
		//tool.processBar("扫描停止中",true,"scanStatusTip_A061");
		$('#stopButton_A061').addClass("event-disable  button-disable");
		$('#rescanButton_A061').addClass("event-disable  button-disable");
		$('#nextStepButton_A061').addClass("event-disable  button-disable");
		//$('#rescanButton_A061').removeClass("event-disable  button-disable");
		//$('#nextStepButton_A061').removeClass("event-disable  button-disable");
	};

	//擦除FLASH
	function Fun310803(recvData) {
		var type = recvData.substr(6, 2) + '';
		//tool.processBar('正在擦除' + typeNameEnum[type] + 'FLASH');
	}

	//编程引导程序  0x3108+0x01(写ECU进度)+文件总数(2B)+当前执行文件序号(2B)+编程数据总大小(4B)+完成编程数据大小(4B)
	function Fun310801(recvData) {
		var total = tool.hex2dec(recvData.substr(6, 2 * 2));
		var currentIndex = tool.hex2dec(recvData.substr(10, 2 * 2));
		var totalSize = tool.hex2dec(recvData.substr(14, 4 * 2));
		var currentSize = tool.hex2dec(recvData.substr(22, 4 * 2));
		var process = parseInt(currentSize / totalSize * 100);
		process += '%';

		//编程进度：文件XX(当前文件序号)/XX(文件总数)   XX%(当前文件编程进度)”
		//tool.processBar('编程进度：' + currentIndex + '/' + total + '  ' + process);
	}

	//校验程序签名 0x3108+0x0B(校验程序签名)+0x01(引导程序)  0x3108+0x0B(校验程序签名)+0x02(应用程序)
	function Fun31080B(recvData) {
		var type = recvData.substr(6, 2);
		var strType = '';
		if (type == '01') {
			strType = '引导程序';
		}
		if (type == '02') {
			strType = '应用程序';
		}
		tool.log('正在校验' + strType + '签名');
	}

	//日志加密进度  0x3108+0x0A(日志加密进度)+完成加密数据(4B)+加密数据总量(4B)   APP有处理
	function Fun31080A(recvData) {

		//var currentSize = tool.hex2dec( recvData.substr(6, 4 * 2) );
		//var totalSize = tool.hex2dec( recvData.substr(10, 4 * 2) );
		//var process = parseInt (currentSize / totalSize * 100);
		//process += '%';

		//编程进度：文件XX(当前文件序号)/XX(文件总数)   XX%(当前文件编程进度)”
		//tool.processBar('正在准备日志：' + process);
	}


	//获取模块名
	function getModule() {
		var module = '';

		var input_checked = tool.getCheckedElement("operate");
		if (!input_checked) {
			//tool.processBar("请选择一个选项");
			return
		}
		//tool.processBar("");
		var flag = input_checked.value;

		//选择编程版本（ZUSB）
		input_checked = tool.getCheckedElement("moduleOption_A061");
		if (flag == '01' || flag == '03') {
			module = input_checked.value;
		}
		if (flag == '02') {
			var modulePath = $(input_checked).parent().prev().text();
			module = modulePath.substr(modulePath.lastIndexOf("/") + 1);
		}
		return module;
	}


})(window);
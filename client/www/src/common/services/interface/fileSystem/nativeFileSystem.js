/**
 * Created by Andy on 2016/8/19.
 */
(function () {
	document.getElementById("processBlock").innerHTML += [
		'<div id="fileSelect" class="data-box">',
		'   <header class="scroll-table-header">',
		'       <h1 class="box-title" style="text-indent: 0"><span id="fileSelectType">FA/SVT</span>文件选择 <em style="display:none" id="lastBoxId"></em></h1>',
		'       <p class="box-p" id="navDir">',
		'           <span>文件目录:</span>',
		'       </p>',
		'       <p style="display: none" id="fileTip"></p>',
		'       <p style="display: none" id="fileNameTip"></p>',
		'   </header>',
		'   <div class="scroll-table-body">',
		'       <div id="fileList">',
		'       </div>',
		'   </div>',
		'   <footer class="scroll-table-footer">',
		'       <p class="bottom-bar-button-box">',
		'           <button type="button" ' +
		'                   class="bottom-bar-button bottom-bar-button1" ' +
		'                   id="FileSelectBackButton" ' +
		'                   onclick="win.RMTClickEvent.bindFileSelectTableButton()">',
		'                   返回',
		'           </button>',
		'       </p>',
		'   </footer>',
		'</div>'
	].join ("");

	var win = window;
	var fileSelectButtonText_watcher = null;
	var gCurDirPrev_String = "/storage/emulated/0/";
	var gCurDirIndex_int = -1;
	var gNavDirName_Array = [];
	var selectedFileName = "";
	var gCurDir_String = "";
	var validateFileCallBack = "VALIDATE";			//验证编程文件回调ID

	//验证编程文件
	win.serverRequestCallback.validateFile = function (responseObject, params) {
		tool.loading (0);
		try {
			var varJson = responseObject;
			if (varJson.CODETYPE == 'OK') {
				var flag = tool.hex2a (varJson.CODEDATA);
				console.log("validateFile:flag -",flag);
				if (flag == "true") {
					var type = $ ("#fileSelectType").html ();
					var inputChecked, faValue, svtValue;
					if (type == "FA") {
						inputChecked = tool.getCheckedElement ("fa");
						faValue = inputChecked.value;

						//PC应答：0x7105+40+[01(确定)+01(读取)/02(加载)]/02(取消)
						win.sendDataToDev ("71054001" + faValue);
					}
					if (type == "SVT") {
						inputChecked = tool.getCheckedElement ("svt");
						svtValue = inputChecked.value;

						//PC应答：0x7105+41+[01(确定)+01(扫描)/02(快速)/03(加载)]/02(取消)
						win.sendDataToDev ("71054001" + svtValue);
					}
					tool.warnTip ("fileNameTip", "");
					$ ("#fileList").html ("");	//清空文件列表

				}
				else {
					tool.warnTip ("fileNameTip", "文件验证失败，请重新选择");
					tool.layout ("fileSelect", 1);
					fileSelectBtnWatcherSwitch ();
				}

			}
			else {
				tool.warnTip ("fileNameTip", "文件验证失败，请重新选择");
				tool.layout ("fileSelect", 1);
				fileSelectBtnWatcherSwitch ();
			}
		} catch (e) {
			tool.warnTip ("fileNameTip", "文件验证失败，请重新选择");
			tool.layout ("fileSelect", 1);
			fileSelectBtnWatcherSwitch ();
			console.log (e.message)
		}
	};


	win.global.handleAppCallback3028 = function (varJson) {
		tool.loading (0);
		if (varJson.CodeType == 'OK') {
			var param = "";
			var arr = varJson.CodeData.md5s;
			for (var i = 0; i < arr.length; i++) {
				param += '{"index":' + i + ',"pathType": 0,"filePath":"' + arr[i].Data + '","fileType": 1},';
				global.md5Map[arr[i].Data] = arr[i].md5;
			}
			param = {arrays: [param.substr (0, param.length - 1)]};
			win.appService.sendDataToApp (3026, JSON.stringify(param), 0);

			//选择设码方式	0x3105+0x1F	PC应答：0x7105+1F+[01(确定)+方式代码(1B)]/02(取消)
			var input_checked = tool.getCheckedElement ("codeRaido");
			if (!input_checked) {
				//tool.processBar ("请选择一个选项");
				return
			}
			//tool.processBar ("");

			var code = input_checked.value;
			win.sendDataToDev ("71051F01" + code);

		}
		else {
			tool.warnTip ("fileNameTip", "计算所选文件MD5失败!");
			win.global.md5Map = {}; //重置
			//返回文件选择列表
			tool.layout ('FileInfo', 1);
		}
	};

	win.serverRequestCallback.uploadFile = function (varJson) {
		tool.loading (0);
		if (varJson.CodeType == 'OK') {
			tool.warnTip ("fileNameTip", "");
			var type = $ ("#fileSelectType").html ();
			if (type == "FA") type = "01";
			if (type == "SVT") type = "02";

			//调服务器接口验证文件是否正确
			var data = getBse64Encode (type + selectedFileName);
			//var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'17'},{'DataType':'7'},{'DataPack':'" + data + "'}]}";
			win.server.request(17,7,{DataPack:data},win.serverRequestCallback.validateFile);
			//external.RequestDataFromServer (3021, varSendData, validateFileCallBack);
		}
		else {
			//上传失败提示
			tool.warnTip ("fileNameTip", "文件上传失败，请重试");
			tool.layout ("fileSelect", 1);
		}
	};

	win.serverRequestCallback.requestDir = function (varJson) {
		tool.loading (0);
		if (varJson.CodeType == 'OK') {
			var originDir = varJson.CodeData.curdir;	                    //缓存当前目录
			var curDir = originDir.replace (/\./, "·");	                    //替换 .符号 为 中文符号· 避免以此文本为id号时，无法获取，最后发送dir串 给APP时再转换回来
			var fileList = varJson.CodeData.files;                          //fileList里面也会有 .符号，在创建标签的时候再进行处理
			var sortedList = [],i;
			for (i = 0; i < fileList.length; i++) sortedList.push (fileList[i].file);

			var nav_curDirName = (function () {                             //从当前url中截取最后的文件夹名字；
				var url = curDir.split ("/");
				return url[url.length - 1];
			}) ();

			var isTableExist = TagCoverChecking (nav_curDirName);           //隐藏所有table,并判断当前文件夹的table是否已经存在

			if (isTableExist) $ ("#table_" + nav_curDirName).show ();       //如果table已经存在，就直接显示
			else {                                                          //如果不存在，就刷新界面；
				handleNavElement (nav_curDirName);
				handleTableElement (nav_curDirName, sortedList, fileList);
			}

			tool.layoutTable ();
			//tool.processBar ("");
		}
		else {
			//tool.processBar ("搜索文件失败" + varJson.CodeType);
		}
	};

	/**
	 * 监听手机文件系统的按钮，如果是最上层目录，就显示“返回”，否则全部显示“上一级”；
	 * 1，文本替换以 当前nav菜单的下标为基准；
	 * 2，监听器的开关以整个页面的“显示”或“隐藏”为基准
	 * */
	var $FileSelectBackButton = $ ("#FileSelectBackButton");

	function fileSelectBtnWatcherSwitch () {
		clearInterval (fileSelectButtonText_watcher);
		return fileSelectButtonText_watcher = setInterval (
			function () {
				var flag = $FileSelectBackButton.is (":visible");
				if (flag) {
					if (gCurDirIndex_int <= 0)
						$FileSelectBackButton.text ("返回");
					else
						$FileSelectBackButton.text ("上一级");
				}
				else
					clearInterval (fileSelectButtonText_watcher);
			}, 105);
	}


	RMTClickEvent.chooseFileConfirm = function (fileName) {
		tool.alert (
			"点击确定之后读取文件" + fileName,
			function () { fun3029 ("01", fileName); },
			function () { }
		);
	};


	function TagCoverChecking (nav_curDirName) {
		var isTableExist = false;
		var file_tables = $ ("#fileList").find ("table");                                 //遍历所有table,如果有的话，首先隐藏所有table,顺便获取当前的已经存在的table的ID号；
		var len = file_tables.length;

		while (len--) {
			file_tables[len].style.display = "none";
			if (file_tables[file_tables.length - 1].id === "table_" + nav_curDirName)    //判断是否已经存在了table,以ID号为判断标准
				isTableExist = true;
		}
		return isTableExist;
	}


	function handleNavElement (nav_curDirName) {
		gNavDirName_Array.push (nav_curDirName);                                            //把导航的所有文件夹的名字存起来；
		gCurDirIndex_int++;                                                                 //存一次，当前导航条的下标就+1；

		$ ("#navDir").find ("em").removeClass ("href-text").addClass ("disable-text");      //首先刷新导航条字体颜色为灰色；
		var navStrHtml =                                                                    //创建拼接字串；
			'<span id="nav_' + nav_curDirName + '">' +
			'   <i class="auxiliary-mark">/&nbsp;</i>' +
			'   <em class="href-text" ' +
			'       onclick="RMTClickEvent.navDirController(\'' + nav_curDirName + '\')">' +
					nav_curDirName.replace(/·/,"\.") + '&nbsp;' +                           //显示的时候还是使用英文.符号；
			'   </em>' +
			'</span>';

		$ ("#navDir").append (navStrHtml);                                                  //往navDir 后面塞；
	}

	function handleTableElement (nav_curDirName, sortedList, fileList) {
		var i, fileProsHtml = "",filesHtml = "";
		for (i = 0; i < fileList.length; i++) {
			var fileUrl = /\.dev/ig.test (sortedList[i]) ? "images/DevFile.png" : "images/NormFile.png";    //区分dev文件和其他类型文件
			var queryID = sortedList[i].replace(/\./,"·");                          //由于HTML元素的ID名无法识别点符号“.”，所以全部转换成中文点符号"·",在转发URL给APP之前，再替换回来;

			if (fileList[i].isdir)
				fileProsHtml +=
					'<tr>' +
					'   <td class="t-center" width="20%">' +
					'       <img width="50px" height="50px" src="images/FilePro.png" id="img_' + queryID + '"/>' +
					'   </td>' +
					'   <td width="80%" onclick="RMTClickEvent.nextLevel(' + "'" + queryID + "'" + ')">' +
							sortedList[i] +
					'   </td>' +
					'</tr>';
			else
				filesHtml +=
						'<tr>' +
						'   <td class="t-center" width="20%">' +
						'       <img width="50px" height="50px" src="' + fileUrl + '"/>' +
						'   </td>' +
						'   <td width="80%" onclick="RMTClickEvent.chooseFileConfirm(\'' + queryID + '\')">' +
						'       <p class="box-p">' + sortedList[i] + '</p>' +
						'   </td>' +
						'</tr>';

		}

		//确保界面的显示顺序是从上到下：文件夹-->文件；
		$ ("#fileList").append ("<table id='table_" + nav_curDirName + "'>" + fileProsHtml + filesHtml + "</table>");
		tool.loading (0);
		tool.layout ("fileSelect", 1);
		fileSelectBtnWatcherSwitch ();
		tool.inputStyleModify ("fileList", "radio");
	}

	win.RMTClickEvent.navDirController = function (navID) {
		navDirController (navID);
	};


	function navDirController (navID) {
		var navName_Array = $ ("#navDir").find ("em");
		var curNavName = $ ("#nav_" + navID).children ("em");
		navName_Array.removeClass ("href-text").addClass ("disable-text");
		curNavName.removeClass ("disable-text").addClass ("href-text");

		var file_tables = $ ("#fileList").find ("table");
		var len = file_tables.length;
		while (len--) file_tables[len].style.display = "none";

		gCurDirIndex_int = navName_Array.index (curNavName);         //返回键和导航条事件共用一个方法,但是导航条获取
		$ ("#table_" + navID).show ();
	}

	//打开下一级文件夹
	win.RMTClickEvent.nextLevel = function (curDir) {
		$ ("#img_" + curDir).attr ("src", "images/FilePro_open.png");     //点击过后,就把 "闭合的" 文件夹图片替换成 "打开的" 文件夹图片
		var reg = new RegExp (curDir, "g");

		//如果打开的新目录已经存在，就执行导航事件，直接读取缓存，不用再次从APP获取；
		if (reg.test (gNavDirName_Array.join (",")))
			navDirController (curDir);
		else {
			var curNavIndex = (function () {
				var navName_arr = $ ("#navDir").find ("em");
				var len = navName_arr.length;
				var i = 0;
				var index;
				while (i < len) {
					if (navName_arr[i].className === "href-text") {
						index = i;
						break;
					}
					i++;
				}
				return index;
			}) ();
			gNavDirName_Array.splice (curNavIndex + 1);
			gCurDirIndex_int = gNavDirName_Array.length - 1;

			//todo 获取当前的class为href-text的下标，然后把后面的数组元素都删除掉
			removeElement (curNavIndex);

			gCurDir_String = gCurDirPrev_String + gNavDirName_Array.join ("/") + "/" + curDir;
			win.appService.sendDataToApp (3029, '{"curdir":"' + gCurDir_String.replace (/·/, "\.") + '", "ope":0}', win.serverRequestCallback.requestDir);
		}
	};

	function removeElement (delIndex) {
		var el_arr = $ ("#navDir").find ("span"), len = el_arr.length;
		while (len--)
			if (len > (delIndex + 1)) el_arr[len].remove ();                       //循环删除比当前下标大的元素
	}

	win.RMTClickEvent.bindFileSelectTableButton = function () {
		if (gCurDirIndex_int <= 0) {
			gCurDirIndex_int--;
			gNavDirName_Array.length = 0;
			gCurDir_String = "";
			removeElement (-1);
			fun3029 ("02");
		}
		else {
			gCurDirIndex_int--;
			navDirController (gNavDirName_Array[gCurDirIndex_int]);
			console.log ("当前目录下标：", gCurDirIndex_int);
		}
	};

	//选择文件确定/返回
	function fun3029 (option, fileName) {
		var type = $ ("#fileSelectType").html ();
		var lastBoxId = $ ("#lastBoxId").html ();
		if (option == "01") {
			var text = "正在上传[" + type + "]文件";
			tool.loading ({text: text});
			tool.log (text);
			//tool.processBar (text);

			selectedFileName = fileName.replace (/·/, "\.");
			var url = gCurDir_String + "/" + selectedFileName;                      //把文件名发给APP，然后上传到服务器，回调里响应设备

			//添加延迟，防止APP回馈信息过快，导致loading层隐藏事件快于显示事件
			setTimeout (function () {
				win.appService.sendDataToApp (
					3032,                                                           //数据源，FFFF(客户端软件日志),0000(预留),0001(日志文件),0002(防盗数据文件),
					JSON.stringify({file:url, type:"0006"}),                        // 0003(EEPROM文件),0004(FLASH文件),0005(设码数据文件),0006(编程文件)
					win.serverRequestCallback.uploadFile
				);
			}, 500);
		}

		if (option == "02") {
			setTimeout (function () {
				tool.layout (lastBoxId, 1);
			}, 105);
			$ ("#fileList").html ("");	//返回后清空
		}

		tool.layout ("fileSelect", 0);
		tool.warnTip ("fileTip", "");
		tool.warnTip ("fileNameTip", "");
	}
	/*function fun3029(option) {
		try {
			var type = "[" + $("#fileSelectType").html() + "]";
			var code = $("input[name='codeRaido']:checked").val();
			var fileName = null;
			if (option == "01") {
				if (type == "[FA]" || type == "[SVT]") {
					var fileInfo = $("input[name='fileRadio']:checked").val();
					if (fileInfo == undefined || fileInfo == null) {
						tool.showTip("fileNameTip", "请选择对应的" + type + "文件");
						return;
					} else {
						tool.showTip("fileNameTip", "");
					}
					fileName = fileInfo.split(",")[0];
					if (fileName == undefined || fileName == null) {
						tool.showTip("fileNameTip", "请选择对应的" + type + "文件");
						return;
					} else {
						tool.showTip("fileNameTip", "");
					}
				}
				//恢复设码的处理，计算MD5，然后调用APP接口缓存文件名
				if (code == "04") {
					gFileNameSizeMap = {}; //每次选择前重置
					//调用接口计算MD5
					//tool.SendDataToApp(3028, '{"Data":"'+fileName+'", "Type":"file"}', "3028");
					var key = "";
					var paramArr = "";
					try {
						$("#fileList").find('input[name="fileRadio"]:checked').each(function (index) {
							paramArr += '{"Data":"' + gCurdir + "/" + $(this).val().split(",")[0] + '","Type":"file"},';
							//TEST
							gFileNameSizeMap[gCurdir + "/" + $(this).val().split(",")[0]] = tool.toHex($(this).val().split(",")[1], 8);
						});
					} catch (e) {
						tool.showTip("fileNameTip", "请选择对应的" + type + "文件");
						return;
					}
					if (paramArr == "") {
						tool.showTip("fileNameTip", "请选择对应的" + type + "文件");
						return;
					} else {
						tool.showTip("fileNameTip", "");
					}
					paramArr = '[' + paramArr.substr(0, paramArr.length - 1) + ']';
					//批量计算MD5
					tool.SendDataToApp(3028, '{"Data":"","Type":"","arrays":' + paramArr + '}', "3028");
					tool.ShowOrHide("fileSelect", 0);
					return;
				}
				//把文件名发给APP，然后上传到服务器，回调里响应设备
				fileName = gCurdir + "/" + fileName;
				//数据源，FFFF(客户端软件日志),0000(预留),0001(日志文件),0002(防盗数据文件),0003(EEPROM文件),0004(FLASH文件),0005(设码数据文件),0006(编程文件)
				tool.SendDataToApp(3032, '{"file":"' + fileName + '", "type":"0006"}', "3032");
				tool.log("正在上传" + type + "文件");
				tool.processBar("正在上传" + type + "文件");
			}
			if (option == "02") {
				tool.showTip("fileNameTip", "");
				//恢复设码
				if (code == "04") {
					tool.ShowOrHide("fileSelect", 0);
					tool.ShowOrHide("codeType", 1);
					return;
				}
				if (type == "[FA]") {
					tool.popShow("faSelect", 1);
				}
				if (type == "[SVT]") {
					tool.popShow("svtSelect", 1);
				}
				$("#fileList").html(""); //返回后清空
			}
			tool.ShowOrHide("fileSelect", 0);
		} catch (e) {
			//alert(e.message);
		}
	}*/
}) ();
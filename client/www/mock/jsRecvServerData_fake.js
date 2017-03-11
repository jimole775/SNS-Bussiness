/**
 * Created by Andy on 2017/1/17.
 */
(function () {
	var callbackFlag = {};
	var win = window;
	callbackFlag.getDatabase = "DATABASE";
	callbackFlag.showModules = "MODULES";
	callbackFlag.editModule = "EDIT";
	callbackFlag.checkModule = "CHECK";
	callbackFlag.getProgramFiles = "FILES";
	callbackFlag.getKey = "KEY";
	callbackFlag.validateFile = "VALIDATE";
	callbackFlag.getCarType = "CARTYPE";
	callbackFlag.getProgram = "PROGRAM";
	callbackFlag.getAddress = "ECUADDRESS";
	callbackFlag.getFile = "FILE";
	callbackFlag.getPart = "PART";
	callbackFlag.getProgramFile = "PROGRAMFILE";
	callbackFlag.getModuleName = "MODULENAME";
	callbackFlag.getCarCategory = "CARCATEGORY";
	callbackFlag.getVersions = "VERSIONS";
	callbackFlag.getCodeInfo = "CODEDETAIL";
	callbackFlag.editCode = "CODEEDIT";

	//这种数据都是缓存在APP底层，通过请求APP获取的！
	win.jsRecvServerData_program = function (varAction, varRecvData, varCallbackId) {

		if (varAction == '2') {
			var jsonBase64 = getBse64Encode (varRecvData);

			switch (varCallbackId) {
				case callbackFlag.getDatabase:		//获取数据库版本列表回调ID
					win.serverRequestCallback.showDatabaseVersion (jsonBase64);
					break;
				case callbackFlag.showModules:		//解析SVT模块信息回调ID
					tool.loading (0);
					win.serverRequestCallback.showModules (jsonBase64);
					break;
				case callbackFlag.editModule:		//编辑模块版本回调ID
					win.serverRequestCallback.editModules (jsonBase64);
					break;
				case callbackFlag.checkModule:		//检查模块版本回调ID
					win.serverRequestCallback.checkModule (jsonBase64);
					break;
				case callbackFlag.getProgram:		//获取编程版本列表回调ID
					win.tool.loading (0);
					win.serverRequestCallback.showProgram (jsonBase64);
					break;
				case callbackFlag.getAddress:		//获取ECU地址回调ID
					win.serverRequestCallback.getECUAddress (jsonBase64);
					break;
				case callbackFlag.getPart:			//请求零件号信息回调ID
					win.serverRequestCallback.getPart (jsonBase64);
					break;
				case callbackFlag.getProgramFile:	//获取编程文件列表回调ID
					win.tool.loading (0);
					win.serverRequestCallback.getProgramFile (jsonBase64);
					break;
				case callbackFlag.getModuleName:		//扫描车辆模块信息
					win.serverRequestCallback.getModuleName (jsonBase64);
					break;
				case callbackFlag.getCarCategory:	//扫描车辆类型信息
					win.serverRequestCallback.getCarCategory (jsonBase64);
					break;
				case callbackFlag.getCarType: //获取车辆类型回调ID
					win.serverRequestCallback.getCarType (jsonBase64);
					break;
				case callbackFlag.getVersions: //获取版本列表回调ID
					tool.loading (0);
					win.serverRequestCallback.getVersions (jsonBase64);
					break;
				case callbackFlag.getProgramFiles: //编程文件信息回调ID
					win.serverRequestCallback.getProgramFiles (jsonBase64);
					break;
				case callbackFlag.getKey: //密钥信息回调ID
					win.serverRequestCallback.getKey (jsonBase64);
					break;
				case callbackFlag.validateFile: //验证编程文件回调ID
					win.serverRequestCallback.validateFile (jsonBase64);
					break;
				case callbackFlag.getCodeInfo: //获取设码信息回调ID
					win.serverRequestCallback.getCodeInfo (jsonBase64);
					break;
				case callbackFlag.editCode: //修改设码信息回调ID
					win.serverRequestCallback.editCode (jsonBase64);
					break;
				case '3001': //JS请求APP下载完成后的响应
					//win.serverRequestCallback.appDownloadEnd (jsonBase64);
					break;
				case callbackFlag.getFile: 		//请求文件信息回调ID
					win.serverRequestCallback.getFile (jsonBase64);
					break;
			}
		}
	};
}) ();

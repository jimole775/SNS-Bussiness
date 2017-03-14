/**
 * Created by Andy on 2016/3/7.
 */
$(document).ready(function () {

	var win = window;
	/**
	 *硬件指令：A5 5A 00 07 C0 00 00 31 09 01 00 00 00 00 00 01 00 02
	 *转成：                         31 09 01 00 00 00 00 00 01 00
	 *通过硬件文档中指令的索引下标，找到对应我们的下标
	 *
	 * */
	win.getIndexByDevIndex = function (index) {
		return index <= 7 ? 0 : (index - 7) * 2;            //我们这里都是以字符来操作，2个字符对应一个字节
	};


	/**
	 * 发送数据到设备
	 * */
	win.sendDataToDev = function (varSendData) {
		if (global.RMTID.role == 2) return;                    //如果是控制机，和设备无交互行为
		external.SendJsDataToDev(varSendData);
		console.log('发送命令到 DEV: ' + varSendData);
	};

	/**
	 * 接收来至设备的数据
	 * @params varAction
	 * @params varRecvData
	 * */
	win.jsRecvDeviceData = function (varAction, varRecvData) {
		switch (parseInt(varAction)) {
			case 1:
				deviceData((varRecvData || "").toString());
				break;
		}
	};

	/**
	 *解析设备数据
	 * Fun009B(varRecvData);         //读取硬件版本应答
	 * Fun5104(varRecvData);         //启动OBD应答
	 * Fun7109(varRecvData);         //业务流程
	 ***/
	function deviceData(varRecvData) {
		var funcStr = 'Fun' + varRecvData.substr(0, 4);
		var func = win.devInterActive[funcStr];
		if (func instanceof Function)func(varRecvData);

		console.log("设备数据：" + varRecvData);
	}

	/**
	 *解析设备数据
	 * Fun009B(varRecvData);         //读取硬件版本应答
	 * Fun5104(varRecvData);         //启动OBD应答
	 * Fun7109(varRecvData);         //业务流程
	 ***/
	win.devInterActive.Fun009B = function (varRecvData) {
		var strDEVID = varRecvData.substr(4, 16 * 2);    //'硬件ID:'
		var strVersion = varRecvData.substr(4 + 16 * 2, 6 * 2);    //'程序版本:'

		win.sendDataToDev("110401");	                                        //发送启动OBD诊断指令
		//tool.processBar('正在启动设备');
	};


	//启动OBDII诊断应答(PC)，0x5104+0x01（成功）
	win.devInterActive.Fun5104 = function (varRecvData) {
		var strCommand = varRecvData.substr(4, 2);
		if (strCommand == '01') {
			tool.log('设备启动成功');
			tool.processBar('设备启动成功');
			document.getElementById("ShowMessage").style.display = "none";
			blockDelegate();
		}
	};

	function blockDelegate() {
		var diagType = global.businessInfo.diagType;  //获取诊断类型;
		var procedureType = global.businessInfo.procedureType;    //获取项目类型
		var operationMenuCache = global.businessInfo.operationMenuCache;    //界面跳转信息
		var connectMode = global.businessInfo.connectMode;  //连接类型，如果有，就是诊断类项目，如果没有，就是编程类项目；

		switch (connectMode) {
			case 1: //模式一需要进入系统列表
				win.moduleEntry.carSystem.apply(null, operationMenuCache);
				break;
			case 2://模式二直接进入诊断功能列表
				if (diagType === "simp") {
					win.moduleEntry.searchDTC.apply(null, operationMenuCache);
				}
				else {
					win.moduleEntry.operationList.apply(null, operationMenuCache);
				}
				break;
			case 3://模式三需要进入配置列表
				win.moduleEntry.carConfig.apply(null, operationMenuCache);
				break;
			default : //没有模式，就是编程项目
				switch (procedureType) {
					case "个性化设置":
						win.moduleEntry.A100();
						break;
					case "设码配置":
					case "模块编程":
						//编程设码项目不需要入口函数，业务功能会由设备主动推送 310542 指令发起；
						//win.moduleEntry[programId + "Enter"]();
						break;
				}
				break;
		}
	}

	//诊断项目指令集和 7109xx;
	win.devInterActive.Fun7109 = function (varRecvData) {
		var cmdStr = varRecvData.substr(0, 6);
		var _func = "";
		switch (cmdStr) {
			case "710901":
			case "710905":
			case "710906":
			case "710914":
			case "710981":
			case "710985":
			case "710986":
			case "710994":
			case "710902":
			case "710982":
			case "710907":
			case "710987":  //诊断的指令区分:710901_pro 710901_simp
				if (global.businessInfo.diagType) {_func = "Fun" + cmdStr + "_" + global.businessInfo.diagType;}
				else { _func = "Fun" + cmdStr }
				break;
			default :
				_func = "Fun" + cmdStr;
				break;
		}

		var func = win.devInterActive[_func];

		if (func instanceof Function) func(varRecvData);
	};

	//执行退出指令
	win.devInterActive.Fun7109FF = function (varRecvData) {
		console.log("退出指令", varRecvData);
	};

	//设备检查结果	0x3106+0x14(安全卡检查)+01(成功)/02(失败),只执行结果，不需要回应设备
	win.devInterActive.Fun310614 = function (varRecvData) {
		var strCommand = varRecvData.substr(6, 2);
		var strShowMsg = '';

		if (strCommand == '01') {
			tool.loading({text: "设备正在尝试连接汽车..."});
			strShowMsg = '设备检查成功';
			document.getElementById("ShowMessage").style.display = "none";
		}
		else if (strCommand == '02') {
			tool.loading(0);
			strShowMsg = '设备检查失败';
		}

		tool.log(strShowMsg);
	};

	win.devInterActive.Fun2107 = function (varRecvData) {
		console.log("上传文件", varRecvData);
	}
});
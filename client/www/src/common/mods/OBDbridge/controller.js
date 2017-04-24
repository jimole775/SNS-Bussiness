/**
 * Created by Andy on 2016/4/20.
 */
(function () {
	var win = window;

	App.controller ("devMessagesCtrl", ["$scope", function ($scope) {

		//显示设备信息，就是 ShowMessage 的信息
		win.moduleEntry.devMessages = function () {
			document.getElementById ("Title").innerText = "流程记录";
			document.getElementById ("ShowMessage").style.display = "block";
			devMessagesBindBtn ();
		};

		function devMessagesBindBtn () {
			tool.bottomBtn ({
				btn1Text: '返回',
				btn1Callback: function () {
					//devMessagesBackEvent ();
				}
			});
		}

		//function devMessagesBackEvent () {
		//	document.getElementById ("ShowMessage").style.display = "none";
		//	win.moduleEntry.navPage ();
		//}

	}]).config(function(){
		win.global.blockDelegate = function() {
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
	})



}) ();
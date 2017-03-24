/**
 * Created by Andy on 2016/5/18.
 */
	//根据url的描述,动态加载相应的业务模块
(function () {
	var win = window;
	var doc = document;
	var diagnosticScript = {};
	diagnosticScript["公共"] = [
		"src/common/mods/slaveFrame/carConfig/template.js",
		"src/common/mods/slaveFrame/carConfig/controller.js",
		"src/common/mods/slaveFrame/carSystem/template.js",
		"src/common/mods/slaveFrame/carSystem/controller.js"
	];

	diagnosticScript["诊断"] = [

		"src/processBlock/diagnosticSeries/diagnostics/professional/baseAdjuster/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/baseAdjuster/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/channelData/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/channelData/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/componentTest/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/componentTest/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/computerVersionInfo/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/computerVersionInfo/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/DTC/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/DTC/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/dynamicData/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/dynamicData/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/freezeFrame/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/freezeFrame/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/inputBox/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/inputBox/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/operationMenu/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/operationMenu/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/professional/oxygenSensor/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/professional/oxygenSensor/controller.js",

		"src/processBlock/diagnosticSeries/diagnostics/simple/DTC/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/simple/DTC/controller.js",
		"src/processBlock/diagnosticSeries/diagnostics/simple/systemScan/template.js",
		"src/processBlock/diagnosticSeries/diagnostics/simple/systemScan/controller.js"
	];

	diagnosticScript["特殊"] = [
		"src/processBlock/diagnosticSeries/specialFunction/operationMenu/template.js",
		"src/processBlock/diagnosticSeries/specialFunction/operationMenu/controller.js",
		"src/processBlock/diagnosticSeries/specialFunction/operationProcess/template.js",
		"src/processBlock/diagnosticSeries/specialFunction/operationProcess/controller.js"
	];

	diagnosticScript["保养"] = [
		"src/processBlock/diagnosticSeries/vehicleMaintain/operationMenu/template.js",
		"src/processBlock/diagnosticSeries/vehicleMaintain/operationMenu/controller.js",
		"src/processBlock/diagnosticSeries/vehicleMaintain/operationProcess/template.js",
		"src/processBlock/diagnosticSeries/vehicleMaintain/operationProcess/controller.js"
	];

	diagnosticScript["防盗"] = [
		"src/processBlock/diagnosticSeries/antiTheft/operationMenu/template.js",
		"src/processBlock/diagnosticSeries/antiTheft/operationMenu/controller.js",
		"src/processBlock/diagnosticSeries/antiTheft/operationProcess/template.js",
		"src/processBlock/diagnosticSeries/antiTheft/operationProcess/controller.js"
	];

	var programScripts = {};
	programScripts["_公共"] = [
		//"src/common/interface/fileSystem/nativeFileSystem.js"
	];

	programScripts["_编程"] = [
		"src/processBlock/programSeries/vehicleProgramming/A040-template.js",
		"src/processBlock/programSeries/vehicleProgramming/A040.js",
		"src/processBlock/programSeries/vehicleProgramming/A061-template.js",
		"src/processBlock/programSeries/vehicleProgramming/A061.js"
	];

	programScripts["_设码"] = [
		"src/processBlock/programSeries/encodeSetting/A05C-template.js",
		"src/processBlock/programSeries/encodeSetting/A05C.js",
		"src/processBlock/programSeries/encodeSetting/A08D-template.js",
		"src/processBlock/programSeries/encodeSetting/A08D.js"
	];

	programScripts["_个性"] = [
		"src/processBlock/programSeries/personalizeSetting/template.js",
		"src/processBlock/programSeries/personalizeSetting/A100.js"
	];

	var businessMap = ["车辆诊断", "保养灯归零,刹车片归零,节气门匹配,胎压报警灯归零", "特殊功能", "防盗匹配", "模块编程", "设码配置", "个性化设置"];
	var typeMap = ["诊断", "保养", "特殊", "防盗", "_编程", "_设码", "_个性"];
	if (window.location.href.split("#").length <= 1)location.href += "#车辆诊断"; //如果获取不到项目类型,就设置一个默认值
	var analyzeUrl = window.location.href.split("#");

	//开始业务的时候，url split出来的第二个数据就是业务类型
	var procedureType = decodeURIComponent(analyzeUrl[1]);
	businessMap.forEach(function (item, index) {
		var scripts = null;
		if ((new RegExp(procedureType)).test(item)) {
			window.location.href = analyzeUrl[0] + "#" + procedureType;  //重新拼以下url，避免出现“#车型诊断?pid=1”这种情况！
			if (/_/.test(typeMap[index])) { //有下划线的就是编程项目
				scripts = programScripts["_公共"].concat(programScripts[typeMap[index]]);
			}
			else {
				scripts = diagnosticScript["公共"].concat(diagnosticScript[typeMap[index]]);
			}
			injectScript(scripts);
		}
	});

	function injectScript(scripts) {
		scripts.forEach(function (item, index) {
			var tag = doc.createElement("script");
			tag.src = item;
			doc.body.appendChild(tag);
			if (index >= scripts.length - 1) {

				setTimeout(function () {
					angular.bootstrap(document.body, ["app"]);

					var watcher = setInterval(function () {
						if (win.external.SendToApp && win.RecvRMTEventFromApp && win.moduleEntry.carLogo) {

							clearInterval(watcher);
							jsRecvAppDataExtend(); //统一改造和App通信的端口；
							jsRecvDeviceDataExtend();  //统一改造和Dev通信的端口
							servicePortExtend(); //统一改造和server通信的端口
							clickEventExtend(); //统一改造点击事件

							setTimeout(function () {
								win.moduleEntry.carLogo();
								external.SendToApp(1000, "JSReady", "");   //所有工作准备完毕，发送1000给APP，可以调用jsRecvAppData进行业务
								console.log("ready:",(new Date()).getTime());
							}, 200);                                 //预留200毫秒给上面两个扩展函数运行
						}
					}, 100);

				}, 1000);    //预留1000毫秒给angular.bootstrap，并初始化所有controller控制器，win.moduleEntry对象在初始化过程中逐一被赋值！
							//问题在于，并不能准确的判断controller初始化需要多少时间，这个时间间隔受到系统CPU和模块数量的影响，
							//如果需要准确无误的判断，只能监听angular的queue队列数量，和moduleEntry的入口数量，通过手动记录对应的数量，相等之后才通过判断式
							//这样的后果就是，每次新增模块都需要手动调整一次模块数量
							//当然，能使用webpack就好了
			}
		})
	}

	/**
	 * 程序链断层有2种事件，只要补全这两种事件，就可以达到程序同步执行
	 * 1，点击事件   RMTClickEvent
	 * 2，服务器回调 serverRequestCallback
	 */
	function servicePortExtend() {
		if (win.serverRequestCallback) {
			//循环所有的属性，然后添加预处理语句，把所有参数和函数名转成字符串的形式，发送一份给远程端；
			for (var prop in win.serverRequestCallback) {
				if (win.serverRequestCallback.hasOwnProperty(prop)) {
					var old = win.serverRequestCallback[prop];
					win.serverRequestCallback[prop] = (function (old, prop) {
						var funName = "serverRequestCallback." + prop;
						return function () {
							var params_stringJson = [];

								var arguments_fst = arguments[0] || "{}";       //serverRequestCallback所有函数参数都固定为3个;
								var arguments_sec = arguments[1] || "{}";       //serverRequestCallback所有函数参数都固定为3个;
								var arguments_thd = arguments[2] || "{}";       //serverRequestCallback所有函数参数都固定为3个;


								params_stringJson[0] = typeof arguments_fst !== "string" ?JSON.stringify(arguments_fst) : arguments_fst;    //确保结果为 字串json
								params_stringJson[1] = typeof arguments_sec !== "string" ?JSON.stringify(arguments_sec): arguments_sec;    //确保结果为 字串json
								params_stringJson[2] = typeof arguments_thd !== "string" ?JSON.stringify(arguments_thd) : arguments_thd;    //确保结果为 字串json

							/**所有协议数据必须保证以字串的形式传输
							 * 理论上,即使是function类型也可以使用obj.toString()方法进行强制转换,
							 * 但是,在接受方必须要以eval或者new Function的方式解析,
							 * 这样就触及安全隐患,
							 * 所以,以3个字串类型的参数进行数据传输是最稳妥的方式;
							 * (
							 * 底部按钮或者alert的集成,是由于双方程序在执行时,都在执行同一个流程,绑定了同一个回调,所以,在同步的时候,只需要通知执行主函数就OK了,他们的回调都已经更换成相同的函数.
							 * 但是,在做服务器请求的时候,这个工作只有业务端在做,控制端基本不可能知道哪个才是回调,所以根本不可能同步到,只能把回调暴露到全局环境,自己被执行的时候,自动把函数名通知对方
							 * )
							 *
							 * */
							win.sendRMTEventToApp(funName,
							                      params_stringJson[0] + "_|_" +                    //加上"_|_",方便区分参数个数
							                      params_stringJson[1] + "_|_" +                    //加上"_|_",方便区分参数个数
							                      params_stringJson[2]
							);

							var params_local = [], i = 0, len = params_stringJson.length;
							while (i < len) {
								params_local[i] = /[\{\[]/.test(params_stringJson[i].substr(0, 2)) ?    //判断并且解析数据格式,
									JSON.parse(params_stringJson[i++]) : params_stringJson[i++];
							}       //1,如果字串里面包含"{[",就可以进行JSON.parse(),转成对象;

							old.apply(win, [params_local[0], params_local[1], params_local[2]]);    //本地执行
						}
					})(old, prop);
				}
			}
		}
	}

	function clickEventExtend() {
		if (win.RMTClickEvent) {
			win.RMTClickEvent.inputCheck = function (id, val) {
				win.RMTClickEvent.iScrollPluginDigit(id, val)
			};
			for (var prop in win.RMTClickEvent) {
				if (win.RMTClickEvent.hasOwnProperty(prop)) {
					var old = win.RMTClickEvent[prop];
					win.RMTClickEvent[prop] = (function (old, prop) {
						var funName = "RMTClickEvent." + prop;
						return function () {
							var temp = [], RMT_params = "";
							var len = arguments.length, i = 0;

							/**将所有参数处理成字串，（每个参数之间添加“_|_”符号）*/
							while (i < len) {
								temp[i] = typeof arguments[i] === "string" ? arguments[i] : JSON.stringify(arguments[i]);
								if (i === len - 1) RMT_params += temp[i++];                      //如果 是最后一个,就不用加"_|_" 符号
								else RMT_params += temp[i++] + "_|_";       //处理传给远程业务的参数!,全部转成字串,以"_|_"为分隔符!
							}
							win.sendRMTEventToApp(funName, RMT_params);

							/**处理本地执行的参数，把arguments拼成数组，然后使用apply进行调用*/
							var local_params = [];                                              //直接获取本地函数的执行参数
							var local_len = arguments.length, k = 0;                            //直接获取本地函数的执行参数
							while (k < local_len) local_params[k] = arguments[k++];             //直接获取本地函数的执行参数
						                                                                        //直接获取本地函数的执行参数
							old.apply(win, local_params);
						}
					})(old, prop);
				}
			}
		}
	}

	//扩展一下jsRecvAppData方法,使得远程业务中,从APP收到的数据自动转发
	function jsRecvAppDataExtend() {
		var old = win.jsRecvAppData;
		win.jsRecvAppData = (function (old) {
			return function () {
				var params_stringJson = [];
				var arguments_fst = arguments[0] || "string";                                      //serverRequestCallback所有函数参数都固定为3个;
				var arguments_sec = arguments[1] || "string";                                      //serverRequestCallback所有函数参数都固定为3个;
				var arguments_thd = arguments[2] || "string";                                      //serverRequestCallback所有函数参数都固定为3个;

				params_stringJson[0] = typeof arguments_fst !== "string" ? JSON.stringify(arguments_fst) : arguments_fst;    //确保结果为
				// 字串json
				params_stringJson[1] = typeof arguments_sec !== "string" ? JSON.stringify(arguments_sec) : arguments_sec;    //确保结果为
				// 字串json
				params_stringJson[2] = typeof arguments_thd !== "string" ? JSON.stringify(arguments_thd) : arguments_thd;    //确保结果为
				// 字串json
				/********************************************以下是远程数据处理************************************************/
				if (global.RMTID.role == 1) {
					var action_int = parseInt(params_stringJson[0]);
					switch (action_int) {
						case win.CONSTANT.APP_TO_JS.RECEIVE_STATUS_MESSAGE:
						{

						}
							break;
						case win.CONSTANT.APP_TO_JS.RECEIVE_LOG_MESSAGE:

							win.sendRMTEventToApp("jsRecvAppData",
							                      params_stringJson[0] + "_|_" +
							                      params_stringJson[1] + "_|_" +
							                      params_stringJson[2]);
							break;
						case win.CONSTANT.APP_TO_JS.RECEIVE_PROGRESS_INCREMENT:     //如果是进度增量,就不进行转发
						case win.CONSTANT.APP_TO_JS.RECEIVE_SCREEN_INFO:            //如果是设备屏幕物理尺寸,就不转发
						case win.CONSTANT.APP_TO_JS.RECEIVE_KEYBOARD_INFO:          //如果是设备屏幕键盘尺寸,就不转发
							//console.log ("RECEIVE_LOG_MESSAGE:", win.CONSTANT.APP_TO_JS.RECEIVE_LOG_MESSAGE);
							//console.log ("RECEIVE_SCREEN_INFO:", win.CONSTANT.APP_TO_JS.RECEIVE_SCREEN_INFO);
							//console.log ("RECEIVE_PROGRESS_INCREMENT:", win.CONSTANT.APP_TO_JS.RECEIVE_PROGRESS_INCREMENT);
							break;
						default :
							win.sendRMTEventToApp("jsRecvAppData",                                              //发送到远程端
							                      params_stringJson[0] + "_|_" +                           //加上"_|_",方便区分参数个数
							                      params_stringJson[1] + "_|_" +                           //加上"_|_",方便区分参数个数
							                      params_stringJson[2]);                                                              //最后一个不加"_|_",
							break;
					}
				}

				//正常业务处理;
				var params_local = [], i = 0, len = params_stringJson.length;
				while (i < len) {

					params_local[i] = /[\{\[]/.test(params_stringJson[i].substr(0, 2)) ?
						JSON.parse(params_stringJson[i++]) : params_stringJson[i++];
				}

				old.apply(win, params_local);
			}
		})(old);
	}

	//扩展一下jsRecvDeviceData方法,使得远程业务中,从DEV收到的数据自动转发
	function jsRecvDeviceDataExtend() {
		var old = win.jsRecvDeviceData;
		win.jsRecvDeviceData = (function (old) {
			return function () {
				//如果设备正在运行数据流，就不转发设备数据
				if (global.RMTID.role == 1 && !global.RMTID.dataStream) {
					win.sendRMTEventToApp("jsRecvDeviceData",                                       //发送到远程端
					                      arguments[0] + "_|_" +                           //加上"_|_",方便区分参数个数
					                      arguments[1]);                                                          //最后一个不加"_|_",
					console.log("转发的设备数据", arguments[0], arguments[1]);
				}
				old.apply(win, [arguments[0], arguments[1]]);
			}
		})(old);
	}

})();

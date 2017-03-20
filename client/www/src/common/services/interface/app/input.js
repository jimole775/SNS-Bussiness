/**
 * Created by Andy on 2017/2/13.
 */
$ (document).ready (function () {

	var win = window;
	var callbackMap = {};
	win.appService = win.appService ? win.appService : {};

	//传入回调函数，绑定随机ID，ID号通过服务器转发
	win.appService.generateCallbackId = function (callback) {
		var callbackFunc = callback || function () {};
		var randomID = "callbackId" + parseInt((Math.random() * 1000000).toFixed(), 10);
		callbackMap[randomID] = callbackFunc;       //以randomID为键，绑定回调函数
		return randomID;
	};

	//通过服务器传送回来ID号，匹配callbackMap里的回调函数；
	win.appService.getCallbackById = function (callbackId) {
		var callback = callbackMap[callbackId];
		callbackMap[callbackId] = null;
		return callback;
	};

	var interActiveState = {};
	interActiveState.init = {};
	interActiveState.process = {};
	interActiveState.end = {};
	interActiveState.event = {};        //通过事件进行动态交互;

	win.jsRecvAppData = function (action, recvData, callbackId)                    //业务开始入口，由APP调用发起；
	{
		//如果callbackId匹配到相应的callbackId字串，就是JS主动请求信息，直接调用回调就OK
		//否则，都是APP主动推送信息
		//不过需要注意的是，不能在远程机器上运行这个代码
		if(callbackId.match(/callbackId/) && global.RMTID.role != 2){
			win.appService.getCallbackById(callbackId)(recvData);
			return;
		}
		
		switch (parseFloat (action)) {
			case win.CONSTANT.APP_TO_JS.RECEIVE_SCREEN_INFO:                                //获取屏幕尺寸,改变相应的字体大小
				interActiveState.init.appInfo (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_KEYBOARD_INFO:                              //获取键盘尺寸信息,调整input框位置,APP会监听,实时推送
				interActiveState.init.getKeyboardInfo (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_LOG_MESSAGE:                                //打印一条记录
				interActiveState.process.log (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_STATUS_MESSAGE:                             //状态消息
				interActiveState.process.statusMsg (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_DEV_INIT_STATUS:                            //设备准备就绪，接下来发送C09B给设备,开始业务了
				interActiveState.process.startBusiness ();
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_SIGN_FOR_CLOSE_UI:                          //直接关闭窗口
				interActiveState.end.close ();
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_APP_ERR_MSG:                                //处理异常，执行退出流程
			case win.CONSTANT.APP_TO_JS.RECEIVE_DEV_CONNECT_FAIL:                           //设备连接失败
				interActiveState.end.err (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_serverHost:                                      //获取车型图片URL
				interActiveState.init.getServerHost (recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_QUIT_SIGN_AFTER_DTC_LOG:                    //APP处理完上传故障码日志之后，通过此端口执行3109FF退出操作；
			case win.CONSTANT.APP_TO_JS.RECEIVE_QUIT_SIGN_NORMAL:                           //退出业务之前，先通知APP其他线程的收尾工作，再通过此端口执行3109FF退出操作；
				interActiveState.end.quit ();
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_DEV_FILE_AT_A100:                           //处理A100个性设码6202指令成功时，接收来自APP解析出来的DEV文件名；
				interActiveState.event.handleA100Program(recvData);
				break;
			case win.CONSTANT.APP_TO_JS.RECEIVE_CALC_MD5_RESULT:                            //编程设码项目 A040,A05C,A08D项目通过APP端口来执行处理回调；
			case win.CONSTANT.APP_TO_JS.RECEIVE_DIR_ALL_FILES:                              //编程设码项目 A040,A05C,A08D项目通过APP端口来执行处理回调；
			case win.CONSTANT.APP_TO_JS.RECEIVE_UPLOAD_FILE_FROM_SERVER:                    //编程设码项目 A040,A05C,A08D项目通过APP端口来执行处理回调；
				interActiveState.event.handleProgramSeriesEvent(recvData, callbackId);
				break;
		}
	};
	interActiveState.init.getServerHost = function(recvData){
		win.global.businessInfo.serverHost = recvData;
	};

	interActiveState.end.quit = function () {
		win.devService.sendDataToDev ("3109FF");
	};
	interActiveState.end.close = function () {
		win.appService.sendDataToApp (3999, "", "");
	};
	interActiveState.end.err = function (recvData) {
		var msg = recvData + "，点击确定之后退出";
		$ ("#RMTCover").hide ();
		tool.alert (msg, function () {
			tool.loading ({text: "正在退出业务..."});
			//加延迟：用于解决3999强制退出时，JS停止运行导致画面假死的问题
			setTimeout (function () {
				win.appService.sendDataToApp (3999, "", "");
			}, 150);

		});
	};

	interActiveState.process.log = function (recvData) {
		var logstatus = document.getElementById("ShowMessage").style.display;
		if(logstatus === "none"){
			$ ("#Title").html (win.global.businessInfo.procedureType);
			$ ("#vehicleType").html ("【" + win.global.businessInfo.carName_cn + "(" + win.global.businessInfo.carType + ")】");

			$ ("#businessType").html ((function(){
				var carTypeRoot = "";
				for(var item in win.global.rootCache.carType){
					if(win.global.rootCache.carType.hasOwnProperty(item)){
						carTypeRoot += win.global.rootCache.carType[item] + "/";
					}
				}
				return carTypeRoot.substring(0,carTypeRoot.length-1);   //去掉最后一个"/"
			})());

			document.getElementById("ShowMessage").style.display = "block";
			tool.bottomBtn(0);
		}

		if (/主程序版本/g.test (recvData)) {                                         //截取主程序版本信息；
			var startIndex = recvData.indexOf (":");
			$ ("#appVersion").html (recvData.substring (startIndex + 1, recvData.length));
		}
		else if (/服务器名称/g.test (recvData)) {                                    //截取服务器信息；
			var startIndex = recvData.indexOf (":");
			$ ("#serverType").html (recvData.substring (startIndex + 1, recvData.length));
		}
		else {
			tool.log (recvData);
		}
	};

	interActiveState.process.statusMsg = function (recvData) {
		tool.processBar (recvData);
	};

	interActiveState.process.startBusiness = function () {
		win.devService.sendDataToDev ("C09B");
	};


	/**
	 * 激活业务机的遮罩,不确定库文件加载的情况，所以使用原生写法
	 * */
	function activeRMTCover() {
		var RMTCover = document.createElement("div");
		RMTCover.id = "RMTCover";
		RMTCover.style.width = "100%";
		RMTCover.style.height = "100%";
		RMTCover.style.opacity = 0;
		RMTCover.style.position = "absolute";
		RMTCover.style.top = 0;
		RMTCover.style.left = 0;
		RMTCover.style.background = "#000";
		RMTCover.style.zIndex = 999;
		RMTCover.style.display = "block";
		document.body.appendChild(RMTCover);
	}
	/**
	 * 根据APP计算的屏幕物理尺寸，修改文本大小
	 * @param recvData = {screenInfo:{
	 *                              screenSize:inch,    //屏幕尺寸
	 *                              headHeight:px,      //头部高度,html页面需要和APP首页的布局一致;
	 *                              footHeight:px,      //脚部高度,html页面需要和APP首页的布局一致;
	 *                              windowHeight:px,    //窗口高度,如果能从这里获取,就可以安全的解决兼容性问题
	 *                              windowWidth:px}     //窗口宽度
						 serverHost:"http://xxxxx:80",  //服务器主机地址
						 businessRole:0                 //业务身份,0代表 单机模式,1代表 远程协助模式的业务机,2代表 控制机
						}
	 * */
	interActiveState.init.appInfo = function (recvData) {
		var json = typeof recvData === "string" ? JSON.parse(recvData) : recvData;
		win.global.RMTID.role = json.businessRole;
		win.global.businessInfo.serverHost = json.serverHost;

		//如果在远程业务下,就在业务机创建遮罩层
		if(win.global.RMTID.role == 1)activeRMTCover();

		var docEl = document.documentElement;
		var screenSize = json.screenInfo.screenSize;
		if (screenSize >= 7) docEl.style.fontSize = '90%';
		else if (screenSize > 4.4 && screenSize < 7) docEl.style.fontSize = '70%';
		else docEl.style.fontSize = '50%';

		//根据项目需求，头部和脚部高度需要和APP首页相同
		document.getElementById("headBar").style.height = json.screenInfo.headHeight + "px";
		document.getElementById("footer").style.height = json.screenInfo.footHeight + "px";
		document.getElementById("bottomButton").style.height = json.screenInfo.footHeight + "px";

		setTimeout(function(){
			tool.layoutTable(); //重新计算页面的布局,会导致页面重绘
		},210);  //这个延迟取决于页面重绘的速度!
	};

	interActiveState.init.getKeyboardInfo = function (keyboardHeight) {
		win.global.keyBoardHeight = parseFloat (keyboardHeight);
	};

	interActiveState.event.handleProgramSeriesEvent = function(action, recvData){
		tool.loading (0);
		var json = typeof recvData === "string" ?
			( /[\{\[]/.test (recvData.substr (0, 5)) ? JSON.parse (recvData) : recvData ) : recvData;
		var FunPrev = "handleAppCallback" + action;
		var func = win.global[FunPrev];
		if (func && typeof func === "function") func (json);
		console.log ("programming:", recvData);
	};

	interActiveState.event.handleA100Program = function(recvData){
		if (global.A100GetDevFileName)global.A100GetDevFileName (recvData);
		console.log ("设备文件名：", recvData);
	};


});
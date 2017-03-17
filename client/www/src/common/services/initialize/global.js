/**
 * Created by Andy on 2016/5/3.
 */
(function () {

	var win = window;
	var doc = document;
	win.App = angular.module('app', []);
	win.serverRequestCallback = {}; //初始化远程协助回调对象；
	win.badRequest = {};    //初始化远程协助回调对象；
	win.RMTClickEvent = win.RMTClickEvent || {};    //初始化远程协助点击对象；

	win.devInterActive = {};    //初始化设备交互指令对象；
	win.moduleEntry = {};   //初始化模块入口对象；

	//数组去重方案
	Array.prototype.unDuplicate = function (condition) {
		var result = [];
		var len = this.length;
		result.push(this[0]);
		for (var i = 1; i < len; i++) {
			var cur = condition ? this[i - 1][condition] : this[i - 1];
			var next = condition ? this[i][condition] : this[i];
			if (cur !== next) {
				result.push(this[i]);
			}
		}
		return result;
	};

	//扩展Date的format方法
	Date.prototype.format = function (format) {
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(),
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		};
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (!o.hasOwnProperty(k))continue;
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	};

	win.global = {};
	win.global.md5Map = {}; //文件系统处理md5校验值的；
	win.global.keyBoardHeight = 0;  //键盘高度，会通过APP交互端口8888号实时获取

	win.global.DTCLog = {}; //存储诊断信息
	win.global.DTCLog.systemName = "";  //选择的系统，用于在专业诊断中拼组数据，数据格式｛systemName:[json]｝
	win.global.DTCLog.detail = [];  //数据细节

	win.global.rootCache = {}; //存储选择路径信息
	win.global.rootCache.carType = {}; //缓存车型选择列表项
	win.global.rootCache.carConfig = {};    //缓存车辆配置列表项
	win.global.rootCache.carSystem = {};    //缓存系统选择列表项

	win.global.RMTID = {};
	win.global.RMTID.role = 0;  //远程协助信号   0：正常业务， 1：业务机， 2：远程控制机
	win.global.RMTID.systemScanState = "";    //简易诊断扫描状态存储,避免扫描状态不同步时,收到按钮点击事件
	win.global.RMTID.userName = "CCDP用户";
	win.global.RMTID.dataStream = false;  //数据流标记，远程协助在运行数据流情况下，不转发包括设备指令和APP通知等数据
	win.global.RMTID.rowsInEachPage = 0;  //动态数据分页的每页数据量；设为全局变量的原因为，远程协助存在 “两个机型屏幕宽度不一”，会造成数据读取错误，所以远程端的每页数据量必须以业务机为准
	win.global.RMTID.DataStream_JsonString = "";  //动态数据流时，用来存储回调数据，存够一整页，再转发到控制机，以此来削减数据流时的延迟

	win.global.businessInfo = {};
	win.global.businessInfo.busID = "A000";
	win.global.businessInfo.special_pid = '';   //特殊功能项目存储pid用于发送310961请求,需要跨越两个文件，所以设置成全局变量
	win.global.businessInfo.connectMode = 0;    //车型选完之后的连接模式,1模式跳转到系统选择列表；2模式直接进入功能菜单；3模式跳转到配置选择列表
	win.global.businessInfo.operationMenuCache = [/*nodeAddress,prevPageId*/]; //存储nodeAddress,和上一个页面的ID,用服务列表的入口函数直接apply调用
	win.global.businessInfo.serverType = '102'; //诊断模式; 100,101：自动诊断， 102：半自动，103：手动诊断
	win.global.businessInfo.carType = '';   //车型类型,例：nissan、audi
	win.global.businessInfo.carName_cn = '';    //车辆类型的中文形式（仅用于页面显示）；
	win.global.businessInfo.link = '';  //需要拼接一个完整的URL信息给APP底层；
	win.global.businessInfo.diagType = '';  //诊断类型，只有【车辆诊断】项目使用到
	win.global.businessInfo.serverHost = 'http://112.124.26.243:8090';   //从APP获取服务器IP，
	win.global.businessInfo.serverDst = 'CCDP2Server.aspx';   //服务器数据地址(默认)
	win.global.businessInfo.procedureType = '车辆诊断'; //业务类型：（'保养灯归零'、'BMW编程'、'BMW设码'、'标致调用控制单元功能'、'标致全车故障检测'、'特殊功能'）
													   //业务类型通过APP输出的URL获取，在appInterActive.js模块 AppInitEnd方法
	win.global.businessInfo.mkey = '';
	win.global.businessInfo.dbFilename = '';    //缓存表名来源，作为服务接口参数
	win.global.businessInfo.dbFilenamePrev = '';    //优先获取cartxt文件的表名，如果此值为0或者空，再从310901里面重新获取
	win.global.businessInfo.pubFilename = '';   //专业诊断专用

	win.CONSTANT = {};
	win.CONSTANT.WINDOW_HEIGHT = doc.body.clientHeight;
	win.CONSTANT.WINDOW_WIDTH = doc.body.clientWidth;
	win.CONSTANT.EVENT_TYPE = {};
	win.CONSTANT.EVENT_TYPE.START = "ontouchstart" in window ? "touchstart" : "mousedown";
	win.CONSTANT.EVENT_TYPE.MOVE = "ontouchmove" in window ? "touchmove" : "mousemove";
	win.CONSTANT.EVENT_TYPE.END = "ontouchend" in window ? "touchend" : "mouseup";

	win.CONSTANT.APP_TO_JS = {};
	win.CONSTANT.APP_TO_JS.RECEIVE_LOG_MESSAGE = 1001;  //APP端向JS端打印LOG的端口；
	win.CONSTANT.APP_TO_JS.RECEIVE_STATUS_MESSAGE = 1002;   //APP端向JS端打印状态信息的端口；
	win.CONSTANT.APP_TO_JS.RECEIVE_PROGRESS_INCREMENT = 1004;   //APP端向JS端修改进程增量的端口；
	win.CONSTANT.APP_TO_JS.RECEIVE_SIGN_FOR_CLOSE_UI = 1000;    //直接关闭业务，此端口被调用，就发送“3999”给APP关掉整个业务；
	win.CONSTANT.APP_TO_JS.RECEIVE_APP_INIT_STATUS = 1003;  //APP初始化完毕之后，通过此端口，推送URL信息到JS
	win.CONSTANT.APP_TO_JS.RECEIVE_DEV_INIT_STATUS = 1005;  //DEV初始化完毕之后，通过此端口，APP通知JS发送“C09B”，开始业务进程
	win.CONSTANT.APP_TO_JS.RECEIVE_DEV_ID = 1006;   //APP端推送设备ID，安全卡给JS；
	win.CONSTANT.APP_TO_JS.RECEIVE_APP_ERR_MSG = 1007;  //APP底层发生程序异常，通过此端口，把异常信息推送到JS端

	win.CONSTANT.APP_TO_JS.RECEIVE_BUSINESS_URL = 1011; //获取业务的URL信息
	win.CONSTANT.APP_TO_JS.RECEIVE_DEV_CONNECT_FAIL = 1012; //特地为连接失败设置的端口,和1007的操作一致;

	win.CONSTANT.APP_TO_JS.RECEIVE_QUIT_SIGN_AFTER_DTC_LOG = 1020;  //APP处理完故障日志之后的响应；
	win.CONSTANT.APP_TO_JS.RECEIVE_QUIT_SIGN_NORMAL = 1024; //普通退出响应

	win.CONSTANT.APP_TO_JS.RECEIVE_RMT_TIMEOUT = 5001;  //当WIFI断开时,APP通知客户端;

	win.CONSTANT.APP_TO_JS.RECEIVE_DEV_FILE_AT_A100 = 6202; //处理A100个性设码6202指令成功时，接收来自APP解析出来的DEV文件名；

	win.CONSTANT.APP_TO_JS.RECEIVE_SCREEN_INFO = 1000;  //获取APP计算的手机屏幕的物理尺寸
	win.CONSTANT.APP_TO_JS.RECEIVE_KEYBOARD_INFO = 8888;    //获取APP计算的键盘的高度
	win.CONSTANT.APP_TO_JS.RECEIVE_serverHost = 3027; //JS请求登录服务器
	win.CONSTANT.APP_TO_JS.RECEIVE_CALC_MD5_RESULT = 3028;  //JS请求计算MD5值
	win.CONSTANT.APP_TO_JS.RECEIVE_DIR_ALL_FILES = 3029;    //JS请求罗列路径下的所有文件
	win.CONSTANT.APP_TO_JS.RECEIVE_UPLOAD_FILE_FROM_SERVER = 3032;  //JS请求上传文件到服务器
	win.CONSTANT.APP_TO_JS.RECEIVE_REGULAR_LOG_SIGN = 4011; //JS接收手机菜单按键的信号

	win.CONSTANT.JS_TO_APP = {};
	win.CONSTANT.JS_TO_APP.REQUEST_DOWNLOAD_FILES = 3001;   //JS请求下载文件；
	win.CONSTANT.JS_TO_APP.REQUEST_UPLOAD_FILES = 3011; //JS请求上传文件；
	win.CONSTANT.JS_TO_APP.REQUEST_SERVER = 3021;   //JS请求服务器计算数据
	win.CONSTANT.JS_TO_APP.REQUEST_CLIENT_LOG = 3022;   //js请求客户操作记录界面日志
	win.CONSTANT.JS_TO_APP.REQUEST_DEBUG_LOG = 3023;    //js请求技术分析记录日志
	win.CONSTANT.JS_TO_APP.REQUEST_END_LOG = 3024;  //js特殊情况下，JS业务可以直接调用结束流程，之后会走上传日志流程
	win.CONSTANT.JS_TO_APP.REQUEST_SEARCH_FILE = 3025;  //JS请求搜索文件
	win.CONSTANT.JS_TO_APP.REQUEST_SAVE_FILE = 3026;    //JS请求保存文件
	win.CONSTANT.JS_TO_APP.REQUEST_LOGIN_SERVER = 3027; //JS请求登录服务器
	win.CONSTANT.JS_TO_APP.REQUEST_CALC_MD5 = 3028; //JS请求计算MD5值
	win.CONSTANT.JS_TO_APP.REQUEST_DIR_ALL_FILES = 3029;    //JS请求罗列路径下的所有文件
	win.CONSTANT.JS_TO_APP.REQUEST_SET_HTTP_TIMEOUT = 3030; //JS请求设置HTTP的超时时间
	win.CONSTANT.JS_TO_APP.REQUEST_OPEN_DEBUG = 3031;   //JS控制打印信息
	win.CONSTANT.JS_TO_APP.REQUEST_UPLOAD_FILE_TO_SERVER = 3032;    //JS请求上传文件到服务器
	win.CONSTANT.JS_TO_APP.REQUEST_OPEN_HELP_PAGE = 3033;   //JS请求加载帮助页面
	win.CONSTANT.JS_TO_APP.REQUEST_QUIT = 3999; //JS请求关闭UI界面
	win.CONSTANT.JS_TO_APP.SEND_JS_INIT_READY_SIGN = 1000;  //JS通知APP，JS端已就绪，可以往JS推送数据
	win.CONSTANT.JS_TO_APP.LET_APP_KNOW_JS_RUNNING_BMW = 1011;  //JS通知APP，正在跑宝马个性设码业务
	win.CONSTANT.JS_TO_APP.SEND_PRO_DTC_INFO = 1020;    //发送专业诊断的故障信息给APP进行记录
	win.CONSTANT.JS_TO_APP.INFORM_APP_IS_TIMEOUT = 5001;    //业务端通知APP断开远程业务


})();

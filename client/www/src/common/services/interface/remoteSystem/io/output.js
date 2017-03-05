/**
 * Created by Andy on 2017/2/13.
 */
(function ($) {
	var win = window;
	var body = $("body");
	var clockStart = false;
	var clocker = 0;

	var split_mark_outer = "_!_";
	var split_mark_inner = "_|_";
	var mouseEvent = {};                           //存储鼠标信息
	mouseEvent.index = -1;
	mouseEvent.type = "none";
	mouseEvent.coord = {};
	mouseEvent.coord.X = 0;
	mouseEvent.coord.Y = 0;
	/**
	 * 远程协助中，遥控机通知业务机进行同步操作；
	 * @param varFuncName 函数名，统一为字串形式，并且是全局函数；
	 * @param varParams 执行函数时需要的参数， 统一转成 "stringJSON_|_stringJSON_|_stringJSON" 的形式发送给远程机
	 *                                      动态数据流则转成
	 *                                      "stringJSON_|_stringJSON_|_stringJSON_!_stringJSON_|_stringJSON_|_stringJSON"的形式
	 * */
	win.sendRMTEventToApp = function (varFuncName, varParams) {
		var strParams, len = 0, i = 0, result = "",
			funcName, RMTClickAnimationData;

		//如果是滚动事件，就拒绝发送触屏（鼠标）事件的所有参数，远程端就不会执行点击动画
		//原因：：：触屏（鼠标）事件 的参数都是从 touchstart 获取的，滚动事件必定必定触发 touchstart，所以，在这里拦截处理滚动事件
		if (/scroll/i.test(varFuncName)) {
			RMTClickAnimationData = "";
		}
		else {
			RMTClickAnimationData = mouseEvent.coord.X + split_mark_outer + mouseEvent.coord.Y + "," +
			global.phoneScreenSize + "," +
			mouseEvent.type + split_mark_outer + mouseEvent.index + "," +
			mouseEvent.hasScrollBar;
		}

		funcName = (varFuncName || 'String') + split_mark_inner + RMTClickAnimationData;

		mouseEvent.coord.X = 0;        //每次有数据发送都会带上这个数值，所以，发完一次就重置一次，
		mouseEvent.coord.Y = 0;        //在非0状态下再执行 点击动画

		mouseEvent.index = -1;
		mouseEvent.type = "none";
		mouseEvent.hasScrollBar = false;

		if (global.RMTInfo.ID == "0") return;                                                 //正常业务不转发
		else if (/tool/.test(funcName) && global.RMTInfo.ID == 1) return;                    //业务机不转发弹框事件
		else if (/moduleEntry/.test(funcName) && global.RMTInfo.ID == 1) return;             //业务机不转发入口事件
		else if (/RMTClickEvent/.test(funcName) && global.RMTInfo.ID == 1) return;           //业务机不转发点击事件
		else if (/jsRecvAppData/.test(funcName) && global.RMTInfo.ID == 2) return;           //控制机不转发服务器数据
		else if (/serverRequestCallback/.test(funcName) && global.RMTInfo.ID == 2) return;   //控制机不转发服务器回调事件

		switch (typeof varParams) {
			case "string":
				strParams = varParams ? varParams : "[]";
				break;
			case "object":  //如果是对象（数组或者对象下面再进行区分），就进行解构拼接

				//数组形式的数据，分解成 (元素 + "_|_" + 元素) 的字串形式
				//分解的原因为：单个参数的函数，不是对象就是字串，多参数的函数必须是数组形式，以方便apply调用
				if (varParams instanceof Array) {
					len = varParams.length;
					while (i < len) {
						result += (typeof varParams[i] === "object" ? JSON.stringify(varParams[i++]) : varParams[i++])
						+ split_mark_inner;
					}

					strParams = result.substring(0, result.length - 3);   //干掉最后一个分隔符
				}
				else {
					strParams = JSON.stringify(varParams);
				}
				break;
		}
		console.log("转发业务数据:", global.RMTInfo.ID, "funcName:", funcName, typeof strParams + ":", strParams);

		var queryJson = getBse64Encode(strParams);

		/**
		 * 【动态数据】【通道数据】数据流形式
		 * 存够一页再进行转发，并且屏蔽设备指令转发
		 * 当前页数据量实时刷新**/
		if (/CALC_ONE_ANS/i.test(funcName) ||
			/CHANNEL_DATA/i.test(funcName)) {
			win.global.RMTInfo.DataStream_JsonString += queryJson + split_mark_outer;                                  //以"_!_"为分隔符,区别"_|_"
			var tempStore_str = global.RMTInfo.DataStream_JsonString.substring(0, global.RMTInfo.DataStream_JsonString.length - 3);     //截掉最后一个分隔符
			var tempArr = tempStore_str.split(split_mark_outer);                                              //解出字串组，判断数量

			var rowsInEachPage = global.DataStream_CurPageLinesCount;       //动态计算每页的数据量

			if (tempArr.length >= rowsInEachPage) {
				external.SendRMTEventToApp(global.RMTInfo.ID, funcName, tempStore_str);
				win.global.RMTInfo.DataStream_JsonString = "";
			}
		}

		/**【简易诊断】，【冻结帧】
		 * 方案为：
		 * 1秒钟发一帧，
		 * 或者数据长度大于50K的时候也发，然后清除定时器**/
		else if (/DTC_simple/i.test(funcName) ||
			/FREEZE_RESULT/i.test(funcName)) {
			win.global.RMTInfo.DataStream_JsonString += queryJson + split_mark_outer;

			if (global.RMTInfo.DataStream_JsonString.length >= 50000) { //如果数据长度大于50K，就一次性发送出去，否则，就进入1秒倒计时
				clearTimeout(clocker);
				external.SendRMTEventToApp(global.RMTInfo.ID, funcName,
				                           win.global.RMTInfo.DataStream_JsonString.substring(0, global.RMTInfo.DataStream_JsonString.length - 3));
				win.global.RMTInfo.DataStream_JsonString = "";

			}
			else {

				if (!clockStart) {        //定时器如果没开启，就进入setTimeout
					clockStart = true;
					clocker = setTimeout(function () {
						clockStart = false;

						if (global.RMTInfo.DataStream_JsonString) {
							external.SendRMTEventToApp(global.RMTInfo.ID, funcName,
							                           win.global.RMTInfo.DataStream_JsonString.substring(0, global.RMTInfo.DataStream_JsonString.length - 3));
							win.global.RMTInfo.DataStream_JsonString = "";
						}

					}, 1000);
				}
			}
		}

		/**其他项目就是正常请求一次，发送一帧**/
		else {
			external.SendRMTEventToApp(global.RMTInfo.ID, funcName, queryJson);
		}
	};

	/**
	 *全局点击事件的代理方法；
	*区别远程滚动事件的交互模式：
	*点击动画必须在 远程点击事件执行之前运行，所以不能生产独立帧数据，
	*把点击坐标拼接在 sendRMTEventToApp 方法的第一个参数后面，以“_|_”为标识
	 * */
	body.ready(function () {

		body.delegate("button", "touchstart", function (e) {
			mouseEvent.coord.X = e.originalEvent.changedTouches[0].pageX / win.CONSTANT.WINDOW_WIDTH;
			mouseEvent.coord.Y = e.originalEvent.changedTouches[0].pageY / win.CONSTANT.WINDOW_HEIGHT;
			var curTarget = e.currentTarget;
			mouseEvent.type = "button";
			mouseEvent.index = $("body").find("button").index(curTarget);

			var scrollBody = $(curTarget).parents(".scroll-table-body");
			if (scrollBody.length) {
				if (scrollBody[0].scrollHeight - scrollBody.height() > 0) {
					mouseEvent.hasScrollBar = true;
				}
			}
		});

		body.delegate("input", "touchstart", function (e) {
			mouseEvent.coord.X = e.originalEvent.changedTouches[0].pageX / win.CONSTANT.WINDOW_WIDTH;
			mouseEvent.coord.Y = e.originalEvent.changedTouches[0].pageY / win.CONSTANT.WINDOW_HEIGHT;
			var curTarget = e.currentTarget;
			mouseEvent.type = "input";
			mouseEvent.index = $("body").find("input").index(curTarget);

			var scrollBody = $(curTarget).parents(".scroll-table-body");
			if (scrollBody.length) {
				if (scrollBody[0].scrollHeight - scrollBody.height() > 0) {
					mouseEvent.hasScrollBar = true;
				}
			}
		});
	});
})(jQuery);
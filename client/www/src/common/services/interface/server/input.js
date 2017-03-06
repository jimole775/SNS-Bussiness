/**
 * Created by Andy on 2017/2/13.
 */
(function () {
	var win = window;
	win.server = win.server ? win.server : {};

	/**
	 * APP从服务器获取到数据，转发给Js
	 * @param action str
	 * @param response obj
	 * @param callback str
	 * @param handleBackRequest array or function
	 * */
	win.server.jsRecvServerData = function (action, response, callback, handleBackRequest) {
		if (global.RMTID.role == 2) return;                           //控制机不需要有服务器交互行为


		switch (action) {
			case "success":
				this.successHandle(response, callback, handleBackRequest[1]);
				break;
			case "timeout":
			case "error"://涵盖有服务器繁忙
				win.serverRequestCallback.refreshHandle(response, callback.params, handleBackRequest);
				break;
		}
	};

	win.server.successHandle = function (response, callback, backRequestCancel) {
		var jsonData = null;

		//如果CODETYPE == 0，就是数据查询成功，如果是1，就是数据查询失败！
		if (response.CODETYPE == '0') {
			/**先从CODEDATA里面拿出数据，
			 * 转成asc码，然后再解base64，解出来的是字串，
			 * 然后再判断是否是json类型，
			 * */
			jsonData = getBse64Decode(tool.hex2a(response.CODEDATA));
			jsonData = typeof jsonData === "string" && jsonData.match(/^[\{\[]/) ? JSON.parse(jsonData) : jsonData;

			//统一使用apply调用，所以先把params整合成数组形式
			var params = callback.params || [];
			Array.prototype.unshift.call(params, jsonData);

			callback.apply(null, params);
			//console.log("接收数据：",JSON.stringify(jsonData));
		}
		
		//如果服务器查询失败，就不必再给用户请求的机会！
		else {
			tool.alert("服务器响应失败:"+response.CODEDATA,function(){
				backRequestCancel.apply(null, callback.params);
			});
		}
	};

	win.serverRequestCallback.refreshHandle = function (response, callbackParams, handleBackRequest) {
		/**超时回调处理：
		 * 如果回调参数传过来的是数组，就是两个函数实体
		 * 如果回调参数穿过来的是函数，就是一个函数，直接调用
		 * */

		if (handleBackRequest[0]) {
			tool.alert([response, "重试", "取消"],
				function () {
					handleBackRequest[0].apply(null, callbackParams);
				},
				function () {
					handleBackRequest[1].apply(null, callbackParams);
				}
			);
		}

		/**单个一般就是一个函数实体，主要是为了以闭包的形式暴露内部变量
		 * 例如：function(){ $scope.getResponse = response;}
		 * 在这里直接调用的时候，就可以对$scope.getResponse进行修改！！！
		 * */
		else{
			handleBackRequest[1].apply(null, callbackParams);
		}
	};

})();
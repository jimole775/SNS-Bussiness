/**
 * Created by Andy on 2017/2/13.
 */

//win.appService = win.appService ? win.appService : {};

(function (win) {
	//兼容IOS设备数据交互，只有存在webkit对象的情况下才这样做
	if (win.webkit) {
		var commandCache = ['JSInitReady', 'SendToApp', 'SendJsDataToDev', 'RequestDataFromServer', 'SendRMTEventToApp'];
		var i = commandCache.length;
		win.external = {};

		while (i--) {
			var curCommand = commandCache[i];
			win.external[curCommand] = (function () {
				var old = win.webkit.messageHandlers[curCommand];
				return function () {
					var j = arguments.length;
					var argCache = [];
					while (j--) {
						argCache[j] = arguments[j];
					}

					old.postMessage.apply (old, [argCache]);
				}

			} ());
		}
	}

}) (window);

(function (win) {
	win.appService = win.appService || {};
	win.appService.sendDataToApp = function (varAction, varSendData, callback) {
	var varCallbackID = this.generateCallbackId(callback);
	external.SendToApp (varAction, varSendData, varCallbackID);                      //发送数据到APP
};
}) (window);
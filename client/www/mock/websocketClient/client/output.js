/**
 * Created by Andy on 2017/3/9.
 */
(function (WebSocket) {

	var userName = win.global.RMTID.userName;
	var send = WebSocket.prototype.send;

	WebSocket.prototype.send = function () {
		var formatData = null;
		switch (arguments[0]) {
			case 0:
				formatData = {
					status: 0,
					uid: userName
				};
				break;
			case 1:   //协助通道的询问
				formatData = {
					status: 1,
					uid: userName,
					items: {
						helperUid: arguments[1],
						askerUid: arguments[2],
						RMTRequest: arguments[3]
					}
				};
				break;
			case 2:   //协助通道的应答
				formatData = {
					status: 2,
					uid: userName,
					items: {
						helperUid: arguments[1],
						askerUid: arguments[2],
						RMTResponse: arguments[3]
					}
				};
				break;
			case 3:   //远程协助交互通道
				formatData = {
					status: 3,
					uid: userName,
					items: {
						remoteRole: arguments[1],
						funcName: arguments[2],
						expression: arguments[3]
					}
				};
				break;
			case 4:   //断开协助通道
				break;
			case 5:   //关闭ws
				formatData = {
					status: 5,
					uid: userName
				};
				break;
			case 6:
				break;
			case 7:
				break;
			default :
				break;
		}

		var data = new Blob([JSON.stringify(formatData)], {type: "text/plain"});
		send.call(this, data);
	};

	WebSocket.prototype.tool = {
		decodeBlob: function (data, callback) {
			if (data instanceof Blob) {
				var reader = new FileReader();
				reader.readAsText(data, "utf8");
				reader.onload = function (e) {
					var result = /^[\{\[]/.test(reader.result.substr(0, 1)) ? JSON.parse(reader.result) : reader.result;
					callback(result);
				};
			}
			else {
				var result = /^[\{\[]/.test(data.substr(0, 1)) ? JSON.parse(data) : data;
				callback(result);
			}
		}

	};


})(WebSocket ? WebSocket : function WebSocket() {});
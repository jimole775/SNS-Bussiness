/**
 * Created by Andy on 2017/3/9.
 */
(function (WebSocket) {

	var userName = win.global.RMTID.userName;
	var send = WebSocket.prototype.send;

	WebSocket.prototype.send = function () {
		var formatData = null;
		switch (arguments[0]) {
			case 0x00:
				formatData = {
					status: 0x00,
					uid: userName
				};
				break;
			case 0x01:   //协助通道的询问
				formatData = {
					status: 0x01,
					uid: userName,
					items: {
						helperUid: arguments[1],
						askerUid: arguments[2],
						RMTRequest: arguments[3]
					}
				};
				break;
			case 0x02:   //协助通道的应答
				formatData = {
					status: 0x02,
					uid: userName,
					items: {
						helperUid: arguments[1],
						askerUid: arguments[2],
						RMTResponse: arguments[3]
					}
				};
				break;
			case 0x03:   //远程协助交互通道
				formatData = {
					status: 0x03,
					uid: userName,
					items: {
						remoteRole: arguments[1],
						funcName: arguments[2],
						expression: arguments[3]
					}
				};
				break;
			case 0x04:   //断开协助通道
				break;
			case 0x05:   //关闭ws
				formatData = {
					status: 0x05,
					uid: userName
				};
				break;
			case 0x06:
				break;
			case 0x07:
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
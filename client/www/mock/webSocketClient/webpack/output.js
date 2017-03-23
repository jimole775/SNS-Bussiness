/**
 * Created by Andy on 2017/3/9.
 */
(function (WebSocket) {

	var send = WebSocket.prototype.send;

	var getUserName = function () {
		return win.global.RMTID.userName
	};

	WebSocket.prototype.send = function () {
		var formatData = null;
		switch (arguments[0]) {
			case 0x00://连接之前，通知服务器下发一份当前在线的用户列表
				formatData = {
					status: arguments[0],
					uid: ""
				};
				break;
			case 0x01:	//发送用户名，让服务器刷新用户列表
				formatData = {
					status: arguments[0],
					uid: getUserName()
				};
				break;
			case 0x02:	//协助通道的询问
			case 0x03:  //协助通道的应答
			case 0x04:	//
				formatData = {
					status: arguments[0],
					uid: getUserName(),
					items: {
						helperUid: arguments[1],
						askerUid: arguments[2],
						RMTRequest: arguments[3]
					}
				};
				break;
			case 0x05:   //远程协助交互通道
				formatData = {
					status: arguments[0],
					uid: getUserName(),
					items: {
						remoteRole: arguments[1],
						funcName: arguments[2],
						expression: arguments[3]
					}
				};
				break;
			case 0x06:
				break;
			case 0x07:
				break;
			case 0xFF:  //断开协助通道
				formatData = {
					status: arguments[0],
					uid: getUserName()
				};
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


//模拟APP交互端口;
	win.external.SendRMTEventToApp = function (localID, funcName, expression) {

		global.ws.send(0x05, global.RMTID.role, funcName, expression);

	};

})(WebSocket ? WebSocket : function WebSocket() {});

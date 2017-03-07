/**
 * Created by Andy on 2017/1/23.
 */
(function () {
	var crypto = require('crypto');
	var key;
	var mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	var clients = [];
	var namesMap = [];
	var original = "";

	function WebSocket() {}

	WebSocket.prototype.init = function () {

	};

	WebSocket.prototype.run = function () {
		var that = this;
		require('net').createServer(function (socket) {
			console.log("服务器net会话：", socket);
			socket.on("connect", function (sock) {
				console.log("connect:", sock);
			});
			socket.on('error', function (sock) {
				console.log("error：", sock);
			});
			socket.on('lookup', function (sock) {
				console.log("lookup：", sock);
			});
			socket.on('timeout', function (sock) {
				console.log("timeout：", sock);
			});
			//socket.on('drain',function(sock){
			//	console.log("drain：",sock);
			//});
			socket.on('data', function (e) {
				var frame = decodeDataFrame(e);
				console.log("一共接收了多少次数据：",frame);
				//第一次握手
				if (frame.FIN === 0) {
					that.handshake(socket, e);
				}
				//数据交互
				else {
					switch (frame.Opcode) {
						case 8:
							console.log("会话已经结束:", socket, frame.PayloadData);
							break;
						default :
							console.log("服务器接收的帧数据：", frame);
							that.opcode = frame.Opcode;
							var data = JSON.parse(frame.PayloadData.toString()) || "";

							if (data.close) {
								//删除断线的用户，重新推送到客户端
								clients.forEach(function (item, index) {
									if (item.uid === data.uid) {
										clients[index].session.destroy();
										console.log("删除对象：", clients[index]);
										clients.splice(index, 1);
										namesMap.splice(index, 1);
									}
								});

								clients.forEach(function (item, index) {
									item.session.write(
										encodeDataFrame({
											FIN: 1,
											Opcode: that.opcode,
											PayloadData: that.opcode == 1 ? JSON.stringify({userList: namesMap.join(",")}) : new Buffer(JSON.stringify({userList: namesMap.join(",")}))

										})
									);
								});
								return;
							}

							//如果map里面没有此用户，就存储session，并绑定用户名
							if (!namesMap.join(",").match(new RegExp(data.uid, "g"))) {
								clients.push({
									uid: data.uid,
									session: socket
								});
								namesMap.push(data.uid);

								//向所有的用户推送用户名
								clients.forEach(function (item, index) {
									item.session.write(
										encodeDataFrame({
											FIN: 1,

											Opcode: that.opcode,
											PayloadData: that.opcode == 1 ? JSON.stringify({userList: namesMap.join(",")}) : new Buffer(JSON.stringify({userList: namesMap.join(",")}))

										})
									);
								});
							}

							if (data.rmtuid) {
								that.openChanel(data)
							}
							else if (data.RMTInterActive) {
								that.RMTInterActive(data)
							}
							break;
					}
				}
			});

		}).listen(81, function () {});
	};

	WebSocket.prototype.handshake = function (socket, e) {
		original = e.toString().match(/Sec-WebSocket-Key: (.+)/)[1];
		key = crypto.createHash("sha1").update(original + mask).digest("base64");
		socket.write("HTTP/1.1 101 Switching Protocols\r\n");
		socket.write("Upgrade:Websocket\r\n");
		socket.write("Connection:Upgrade\r\n");
		socket.write("Sec-WebSocket-Accept:" + key + "\r\n");
		socket.write("\r\n");
	};

	WebSocket.prototype.openChanel = function (data) {
		var that = this;
		that.asker = that.getSession(data.uid, clients);
		that.assistant = that.getSession(data.rmtuid, clients);
		var decideAsker = JSON.stringify({remoteRole: 1});
		var decideAssistant = JSON.stringify({remoteRole: 2});

		that.asker.write(
			encodeDataFrame({
				FIN: 1,
				Opcode: that.opcode,
				PayloadData: that.opcode == 1 ? decideAsker : new Buffer(decideAsker)
			}));
		that.assistant.write(
			encodeDataFrame({
				FIN: 1,
				Opcode: that.opcode,
				PayloadData: that.opcode == 1 ? decideAssistant : new Buffer(decideAssistant)
			}));
	};

	WebSocket.prototype.RMTInterActive = function (data) {
		var that = this;
		var msg = JSON.stringify({RMTInterActive: data.RMTInterActive});
		var emitFrame = encodeDataFrame({
			FIN: 1,
			Opcode: that.opcode,
			PayloadData: that.opcode == 1 ? msg : new Buffer(msg)
		});

		if (data.RMTInterActive.remoteRole == 1) {
			that.assistant.write(emitFrame);
		}
		else if (data.RMTInterActive.remoteRole == 2) {
			that.asker.write(emitFrame);
		}
	};

	WebSocket.prototype.getSession = function (uid, store) {
		var i = store.length;
		while (i--) {
			if (store[i].uid === uid) {
				return store[i].session;
			}
		}
	};

	WebSocket.prototype.closeChanel = function(){

	};

	//websocket数据的加解密工作
	function decodeDataFrame(e) {
		global.inputBuffer = e;
		var i = 0, j, s, frame = {
			//解析前两个字节的基本数据
			FIN: e[i] >> 7, Opcode: e[i++] & 15, Mask: e[i] >> 7,
			PayloadLength: e[i++] & 0x7F
		};
		//处理特殊长度126和127
		if (frame.PayloadLength == 126) {
			frame.PayloadLength = (e[i++] << 8) + e[i++];
		}
		if (frame.PayloadLength == 127) {
			i += 4; //长度一般用四字节的整型，前四个字节通常为长整形留空的
			frame.PayloadLength = (e[i++] << 24) + (e[i++] << 16) + (e[i++] << 8) + e[i++];
		}//判断是否使用掩码
		if (frame.Mask) {
			//获取掩码实体
			frame.MaskingKey = [e[i++], e[i++], e[i++], e[i++]];
			//对数据和掩码做异或运算
			for (j = 0, s = []; j < frame.PayloadLength; j++)
				s.push(e[i + j] ^ frame.MaskingKey[j % 4]);
		}
		else s = e.slice(i, frame.PayloadLength); //否则直接使用数据
		//数组转换成缓冲区来使用
		s = new Buffer(s);
		//如果有必要则把缓冲区转换成字符串来使用
		if (frame.Opcode == 1)s = s.toString();
		//设置上数据部分
		frame.PayloadData = s;
		//返回数据帧
		return frame;
	}

	function encodeDataFrame(e) {
		var s = [], o = new Buffer(e.PayloadData), l = o.length;
		//输入第一个字节
		s.push((e.FIN << 7) + e.Opcode);
		//输入第二个字节，判断它的长度并放入相应的后续长度消息
		//永远不使用掩码
		if (l < 126)s.push(l);
		else if (l < 0x10000)s.push(126, (l & 0xFF00) >> 8, l & 0xFF);
		else s.push(
				127, 0, 0, 0, 0, //8字节数据，前4字节一般没用留空
				(l & 0xFF000000) >> 24, (l & 0xFF0000) >> 16, (l & 0xFF00) >> 8, l & 0xFF
			);
		//返回头部分和数据部分的合并缓冲区
		var result = Buffer.concat([new Buffer(s), o]);
		global.outputBuffer = result;
		return result;
	}

	module.exports = new WebSocket();

})();
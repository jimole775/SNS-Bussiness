/**
 * Created by Andy on 2017/2/6.
 */
var win = window;

(function () {
	win.global.RMTID.userName = win.prompt("输入一个用户名，用于远程交互！");
	var ws = new WebSocket("ws://127.0.0.1:81");

	var _drag = new Drag();

	ws.onopen = function (res) {
		console.log(res);
		console.log("握手成功");
		ws.send({uid: win.global.RMTID.userName});

	};

	ws.onerror = function (e) {
		console.log(e, "进行错误重连！");
		//win.ws = new WebSocket("ws://127.0.0.1:81");
	};

	ws.onclose = function (e) {
		console.log(e, "进行关闭重连！");
		//win.ws = new WebSocket("ws://127.0.0.1:81");
	};

	win.onbeforeunload = function () {
		ws.send({uid: win.global.RMTID.userName, close: true});
	};

	ws.onmessage = function (res) {
		this.tool.decodeBlob(res.data, function (data) {

			if (!data) return;
			if (data.userList) {
				addFriend(data.userList);
			}
			else if (data.remoteRole) {
				distributeRemoteRole(data.remoteRole);
			}
			else if (data.RMTInterActive) {
				win.RecvRMTEventFromApp(data.RMTInterActive.remoteRole, data.RMTInterActive.funcName, data.RMTInterActive.expression);
			}
			else if (data.disconnect) {

				$("#RMTCover").hide();
				win.global.RMTID.role = 0;
				tool.alert("对方已经断开连接!", function () {
				});

			}
		});

	};

	function distributeRemoteRole(remoteRole) {
		win.jsRecvAppData(1000, {
			screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
			serverHost: "http://112.124.26.243:8090",
			businessRole: remoteRole
		}, "");
	}

	function encodeBlob() {

	}

	function addFriend(names) {
		//当有多个用户名的时候
		_drag.bindEvent("friendListHeader", "friendFrame", "friendListExtend");
		var friendList = document.getElementById("friendList");
		if (/,/g.test(names)) {
			document.getElementById("friendList").innerHTML = "";

			names.split(",").forEach(function (newName) {
				if (win.global.RMTID.userName === newName) return;
				var li = document.createElement("li");
				li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + newName + '</button>';
				friendList.appendChild(li);
			});

		}
		else {
			//当只有一个用户名的时候
			document.getElementById("friendList").innerHTML = "";
			if (win.global.RMTID.userName === names) return;
			var li = document.createElement("li");
			li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + names + '</button>';
			friendList.appendChild(li);

		}

		setTimeout(function () {
			var lis = friendList.children;
			Array.prototype.forEach.call(lis, function (item) {
				item.onclick = function () {
					tool.alert("是否请求【" + item.innerText + "】的协助！确定之后将失去控制权，直到你选择退出！",
					           function () {
						           ws.send({
							           uid: win.global.RMTID.userName,
							           oppositeUid: item.innerText,
							           connectAsk: true
						           });
					           }, function () {
						})
				}
			})
		}, 45);
	}

	//win.test_1 = function (assistantName) {
	//	tool.alert("是否请求【" + assistantName + "】的协助！确定之后将失去控制权，直到你选择退出！",
	//	           function () {
	//		           ws.send({
	//			           uid: win.global.RMTID.userName,
	//			           oppositeUid: assistantName,
	//			           connectAsk: true
	//		           });
	//	           }, function () {
	//		})
	//};

	win.external.SendRMTEventToApp = function (localID, funcName, expression) {
		var msg = {
			uid: win.global.RMTID.userName,
			RMTInterActive: {
				remoteRole: global.RMTID.role,
				funcName: funcName,
				expression: expression
			}
		};

		ws.send(msg);

	};

})();

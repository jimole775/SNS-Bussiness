/**
 * Created by Andy on 2017/2/6.
 */
var win = window;

(function () {
	win.global.RMTID.userName = win.prompt("输入一个用户名，用于远程交互！");
	win.ws = new WebSocket("ws://127.0.0.1:81");

	ws.onopen = function (res) {
		console.log(res);
		console.log("握手成功");
		ws.send(JSON.stringify({uid: win.global.RMTID.userName}));
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
		ws.send(JSON.stringify({uid: win.global.RMTID.userName, close: true}));
	};
	//console.log("background:url(https://2.gravatar.com/avatar/e43425aad4de30d628ad5c89e7c57a8a?r=x&s=150); background-repeat:no-repeat; font-size:0; line-height:30px; padding-top:150px;padding-left:150px;");

	ws.onmessage = function (res) {
		decodeBlob(res.data, function (data) {
			console.log("数据票据：",data);
			if (!data) return;
			if (data.userList) {
				addFriend(data.userList);
			}
			else if (data.remoteRole) {
				distributeRemoteId(data.remoteRole);
			}
			else if (data.RMTInterActive) {
				win.RecvRMTEventFromApp(data.RMTInterActive.remoteRole, data.RMTInterActive.funcName, data.RMTInterActive.expression);
			}
		});

	};

	function distributeRemoteId(remoteRole) {
		win.RecvRMTEventFromApp(remoteRole, win.global.RMTID.userName, "");
	}

	function decodeBlob(data, callback) {
		if (data instanceof Blob) {
			var reader = new FileReader();
			reader.readAsText(data, "utf8");	//如果是中文直接压制的，就用readAsText方法读取，如果通过后台传出的buffer呢？
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

	function encodeBlob() {

	}

	function addFriend(names) {
		//当有多个用户名的时候
		if (/,/g.test(names)) {
			document.getElementById("friendList").innerHTML = "";

			names.split(",").forEach(function (newName) {
				if (win.global.RMTID.userName === newName) return;
				var li = document.createElement("li");
				li.innerHTML = '<button class="item-button"  onclick="test_1(\'' + newName + '\')" style="height:3.6rem;">' + newName + '</button>';
				document.getElementById("friendList").appendChild(li);
			});

		}
		else {
			//当只有一个用户名的时候
			document.getElementById("friendList").innerHTML = "";
			if (win.global.RMTID.userName === names) return;
			var li = document.createElement("li");
			li.innerHTML = '<button class="item-button" onclick="test_1(\'' + names + '\')" style="height:3.6rem;">' + names + '</button>';
			document.getElementById("friendList").appendChild(li);
		}

	}

	win.test_1 = function (assistantName) {
		tool.alert("是否请求【" + assistantName + "】的协助！确定之后将失去控制权，直到你选择退出！",
		           function () {
			           new Blob([ws.send(JSON.stringify({
				           uid: win.global.RMTID.userName,
				           rmtuid: assistantName
			           }))],{type:"text/plain"});
		           }, function () {
			})
	};


	win.external.SendRMTEventToApp = function (localID, funcName, expression) {
		win.ws.send(
			new Blob([JSON.stringify({
				uid: win.global.RMTID.userName,
				RMTInterActive: {
					remoteRole: global.RMTID.role,
					funcName: funcName,
					expression: expression
				}
			})],{type:"text/plain"})
		)

	};


})();
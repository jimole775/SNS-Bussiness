/**
 * Created by Andy on 2017/2/6.
 */
var win = window;
(function () {
	var div = document.createElement("div");
	div.style.width = "40%";
	div.style.height = "30%";
	div.style.outline = "1px solid #949494";
	div.style.borderRight = "1px solid rgba(250,250,250,0.7)";
	div.style.position = "fixed";
	div.style.right = "1rem";
	div.style.top = "1rem";
	div.style.zIndex = "990";
	div.style.background = "rgba(250,250,250,0.7)";
	div.style.boxShadow = "3px 3px 3px rgba(0,0,0,.7)";
	div.id = "friendFrame";
	div.innerHTML += '<h2 style="height:3rem;line-height:200%;text-align:center;background:#008eff;color:#fff">基友列表(在线)</h2><ul id="friendList" style="width:100%;height:100%;position: absolute;padding-top:3rem;box-sizing: border-box;top:0;left:0"></ul>';
	document.body.appendChild(div);
}());

(function () {
	win.global.RMTInfo.userName = win.prompt("输入一个用户名，用于远程交互！");
	win.ws = new WebSocket("ws://127.0.0.1:81");

	ws.onopen = function (res) {
		console.log(res);
		console.log("握手成功");
		ws.send(JSON.stringify({uid: win.global.RMTInfo.userName}));
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
		ws.send(JSON.stringify({uid: win.global.RMTInfo.userName, close: true}));
	};
	//console.log("background:url(https://2.gravatar.com/avatar/e43425aad4de30d628ad5c89e7c57a8a?r=x&s=150); background-repeat:no-repeat; font-size:0; line-height:30px; padding-top:150px;padding-left:150px;");

	ws.onmessage = function (res) {
		decodeBlob(res.data, function (data) {
			console.log("数据票据：",data);
			if (!data) return;
			if (data.userList) {
				addFriend(data.userList);
			}
			else if (data.rmtid) {
				distributeRemoteId(data.rmtid);
			}
			else if (data.RMTInterActive) {
				win.RecvRMTEventFromApp(data.RMTInterActive.RMTID, data.RMTInterActive.funcName, data.RMTInterActive.expression);
			}
		});

	};

	function distributeRemoteId(rmtid) {
		win.RecvRMTEventFromApp(rmtid, win.global.RMTInfo.userName, "");
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
				if (win.global.RMTInfo.userName === newName) return;
				var li = document.createElement("li");
				li.innerHTML = '<button class="item-button"  onclick="test_1(\'' + newName + '\')" style="height:3.6rem;">' + newName + '</button>';
				document.getElementById("friendList").appendChild(li);
			});

		}
		else {
			//当只有一个用户名的时候
			document.getElementById("friendList").innerHTML = "";
			if (win.global.RMTInfo.userName === names) return;
			var li = document.createElement("li");
			li.innerHTML = '<button class="item-button" onclick="test_1(\'' + names + '\')" style="height:3.6rem;">' + names + '</button>';
			document.getElementById("friendList").appendChild(li);
		}

	}

	win.test_1 = function (assistantName) {
		tool.alert("是否请求【" + assistantName + "】的协助！确定之后将失去控制权，直到你选择退出！",
		           function () {
			           new Blob([ws.send(JSON.stringify({
				           uid: win.global.RMTInfo.userName,
				           rmtuid: assistantName
			           }))],{type:"text/plain"});
		           }, function () {
			})
	};


	win.external.SendRMTEventToApp = function (localID, funcName, expression) {
		win.ws.send(
			new Blob([JSON.stringify({
				uid: win.global.RMTInfo.userName,
				RMTInterActive: {
					RMTID: global.RMTInfo.ID,
					funcName: funcName,
					expression: expression
				}
			})],{type:"text/plain"})
		)

	};


})();
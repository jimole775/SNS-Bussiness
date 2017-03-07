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
		ws.send(JSON.stringify({askUid: win.global.RMTID.userName}));
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
			console.log("数据票据：", data);
			if (!data) return;
			if (data.userList) {

				//var _drag = new Drag();
				//_drag.bindEvent("friendListHeader","friendFrame","");
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
				tool.alert("对方已经断开连接!", function () {});

			}
		});

	};

	function distributeRemoteRole(remoteRole) {
		//win.RecvRMTEventFromApp(remoteRole, win.global.RMTID.userName, "");
		win.jsRecvAppData(1000, {
			screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
			serverHost: "http://112.124.26.243:8090",
			businessRole: remoteRole
		}, "");
	}

	function decodeBlob(data, callback) {
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
				           askUid: win.global.RMTID.userName,
				           asstUid: assistantName
			           }))], {type: "text/plain"});
		           }, function () {
			})
	};


	win.external.SendRMTEventToApp = function (localID, funcName, expression) {
		var msg = {
				uid: win.global.RMTID.userName,
				RMTInterActive: {
					remoteRole: global.RMTID.role,
					funcName: funcName,
					expression: expression
				}
			};

		ws.send(new Blob([JSON.stringify(msg)], {type: "text/plain"}));

	};

})();

function Drag() {
	/***************
	 * 绑定拖拽事件 *
	 **************/
	var $ = jQuery;
	this.init = function (dragTagId, bodyId, extendTagId) {
		this.dragTag = $("#" + dragTagId);
		this.extendTag = $("#" + extendTagId);
		this.body = $("#" + bodyId);
		this.startX = 0;
		this.startY = 0;
		this.moveX = 0;
		this.moveY = 0;
		this.differenceX = 0;
		this.differenceY = 0;
		this.box_originX = 0;
		this.box_originY = 0;
		this.box_originWidth = this.body.width();
		this.box_originHeight = this.body.height();
		this.touchMinHeightSizeFlag = false;
		this.touchMinWidthSizeFlag = false;
	};
	this.bindEvent = function (dragTagId, bodyId, extendTagId) {
		var that = this;
		that.init(dragTagId, bodyId,extendTagId);
		that.dragTag.on({
			touchstart: function (e) {
				that.startX = e.originalEvent.targetTouches[0].clientX;                        //获取点击点的X坐标
				that.startY = e.originalEvent.targetTouches[0].clientY;                        //获取点击点的Y坐标
				that.box_originX = that.body.offset().left;                                  //相对于当前窗口X轴的偏移量
				that.box_originY = that.body.offset().top;                                   //相对于当前窗口Y轴的偏移量
				that.differenceX = that.startX - that.box_originX;                                       //鼠标所能移动的最左端是当前鼠标距div左边距的位置
				that.differenceY = that.startY - that.box_originY;
			},
			touchmove: function (e) {
				e.preventDefault();
				that.moveX = e.originalEvent.targetTouches[0].clientX;                         //移动过程中X轴的坐标
				that.moveY = e.originalEvent.targetTouches[0].clientY;                         //移动过程中Y轴的坐标
				if (that.moveX + (that.box_originWidth - that.differenceX) > win.CONSTANT.WINDOW_WIDTH) {
					that.moveX = win.CONSTANT.WINDOW_WIDTH;
					that.differenceX = that.box_originWidth;
				}
				if (that.moveY + (that.box_originHeight - that.differenceY) > win.CONSTANT.WINDOW_HEIGHT) {
					that.moveY = win.CONSTANT.WINDOW_HEIGHT;
					that.differenceY = that.box_originHeight;
				}
				if (that.moveX < that.differenceX) {
					that.moveX = that.differenceX = 0
				}
				if (that.moveY < that.differenceY) {
					that.moveY = that.differenceY = 0
				}
				that.body.css({
					"left": that.moveX - that.differenceX,
					"top": that.moveY - that.differenceY
				})
			}
		});

		/*******************
		 * 绑定窗体拉伸事件 *
		 *****************/
		that.extendTag.on({
			touchstart: function (e) {
				that.startX = e.originalEvent.targetTouches[0].clientX;                        //获取点击点的X坐标
				that.startY = e.originalEvent.targetTouches[0].clientY;                        //获取点击点的Y坐标
				that.box_originX = that.body.offset().left;                                //相对于当前窗口X轴的偏移量
				that.box_originY = that.body.offset().top;                                 //相对于当前窗口Y轴的偏移量
				that.differenceX = that.startX - that.box_originX;                                     //鼠标所能移动的最左端是当前鼠标距div左边距的位置
				that.differenceY = that.startY - that.box_originY;
			},
			touchmove: function (e) {
				e.preventDefault();
				that.moveX = e.originalEvent.targetTouches[0].clientX;                         //移动过程中X轴的坐标
				that.moveY = e.originalEvent.targetTouches[0].clientY;                         //移动过程中Y轴的坐标
				if (that.body.height() < 200) {
					that.touchMinHeightSizeFlag = true;
					return;
				}
				if (that.body.width() < 200) {
					that.touchMinWidthSizeFlag = true;
					return;
				}
				if (that.moveX >= win.CONSTANT.WINDOW_WIDTH) {
					that.moveX = win.CONSTANT.WINDOW_WIDTH - 10
				}
				if (that.moveX <= 0) {
					that.moveX = 0
				}
				if (that.moveY >= win.CONSTANT.WINDOW_HEIGHT) {
					that.moveY = win.CONSTANT.WINDOW_HEIGHT - 10
				}
				if (that.moveY <= 0) {
					that.moveY = 0
				}

				that.body.css({
					"width": that.box_originWidth + (that.moveX - that.differenceX - that.box_originX),
					"height": that.box_originHeight + (that.moveY - that.differenceY - that.box_originY)
				});
				//resizeHoverButton();
			},
			touchend: function (e) {
				e.preventDefault();
				if (that.touchMinHeightSizeFlag) {
					that.body.height(200);
					that.touchMinHeightSizeFlag = false;
				}
				if (that.touchMinWidthSizeFlag) {
					that.body.width(200);
					that.touchMinWidthSizeFlag = false;
				}
				that.box_originWidth = that.body.width();                                        //触摸事件完成后，获取盒子的最后高宽，下次再次触摸时，以这个值为初始值；
				that.box_originHeight = that.body.height();
			}
		});
	};

}
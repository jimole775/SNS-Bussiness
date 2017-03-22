/**
 * Created by Andy on 2017/2/6.
 */
(function () {
    var win = window;
    var getUserName = function () {
        return win.global.RMTID.userName
    };
    var ws = null;
    setTimeout(function () {
        $("#carLogo")[0].style.filter = "blur(3px)";
        $("#userNameBtn").on("click", function () {
            var input = $("#userName");
            if (input.val()) {
                win.global.RMTID.userName = input.val();
                $("#userNameFrame").hide();
                input[0].placeholder = "取个牛逼点的名字！";
                $("#carLogo")[0].style.filter = "blur(0)";
                ws = new WebSocket("ws://127.0.0.1:81");

                ws.onopen = function (res) {
                    console.log(res);
                    console.log("握手成功");
                    if (getUserName()) {
                        ws.send(0x00);
                    }
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
                    console.log("关闭窗口");
                    ws.send(0x05);
                };

                win.onunload = function () {
                    console.log("刷新窗口");
                    ws.send(0x05);
                };

                ws.onmessage = function (res) {
                    this.tool.decodeBlob(res.data, function (data) {

                        if (!data) return;

                        switch (data.status) {
                            case 0x00:
                                addFriend(data.items);
                                break;
                            case 0x01:   //协助通道的询问
                                tool.alert(
                                    ["【" + data.items.asker + "】请求您协助，请做出回应！", "确定", "取消"],
                                    function () {
                                        ws.send(0x02, data.items.helper, data.items.asker, true);
                                    },
                                    function () {
                                        ws.send(0x02, data.items.helper, data.items.asker, false);
                                    });
                                break;
                            case 0x02: //接受远程协助，并开辟通道
                                openchanal(data.items);
                                break;
                            case 0x03: //拒绝远程协助
                                rejectRemoteConnect();
                                break;
                            case 0x04:   //远程协助交互通道
                                win.RecvRMTEventFromApp(data.items.remoteRole, data.items.funcName, data.items.expression);
                                break;
                            case 0x05:   //断开协助通道
                                $("#RMTCover").hide();
                                win.global.RMTID.role = 0;
                                tool.alert("对方已经断开连接!", function () {
                                });
                                break;
                            case 0x06://关闭ws
                                break;
                            case 0x07:
                                break;
                            default :
                                break;
                        }
                    });

                };

                function openchanal(items) {

                    tool.loading(0);
                    win.jsRecvAppData(1000, {
                        screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
                        serverHost: "http://112.124.26.243:8090",
                        businessRole: items.remoteRole
                    }, "");
                }
            } else {
                tool.warnTip("#userName", "不支持黑户");
                input[0].placeholder = "请先取一个名字！";
            }
        });


        function rejectRemoteConnect(items) {
            tool.alert("对方正在忙碌,无法给予协助!", function () {
            });
        }

        function addFriend(items) {
            //当有多个用户名的时候
            var friendList = document.getElementById("friendList");
            if (/,/g.test(items.userList)) {
                document.getElementById("friendList").innerHTML = "";

                items.userList.split(",").forEach(function (newName) {
                    if (getUserName() === newName) return;
                    var li = document.createElement("li");
                    li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + newName + '</button>';
                    friendList.appendChild(li);
                });

            }
            else {
                //当只有一个用户名的时候
                document.getElementById("friendList").innerHTML = "";
                if (getUserName() === items.userList) return;
                var li = document.createElement("li");
                li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + items.userList + '</button>';
                friendList.appendChild(li);
            }

            //绑定点击事件
            setTimeout(function () {
                var lis = friendList.children;
                Array.prototype.forEach.call(lis, function (item) {
                    item.onclick = function () {
                        tool.alert("是否请求【" + item.innerText + "】的协助！确定之后将失去控制权，直到你选择退出！",
                            function () {
                                tool.loading({text: "等待对方响应..."});
                                ws.send(0x01, item.innerText, getUserName(), true);
                            },
                            function () {
                            })
                    }
                })
            }, 45);
        }


        //模拟APP交互端口;
        win.external.SendRMTEventToApp = function (localID, funcName, expression) {

            ws.send(0x04, global.RMTID.role, funcName, expression);

        };
    }, 500);
})();

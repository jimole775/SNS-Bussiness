/**
 * Created by Andy on 2017/2/6.
 */
(function () {
    var win = window;
    var getUserName = function () {
        return win.global.RMTID.userName
    };

    win.global.ws = new WebSocket("ws://127.0.0.1:81");

    global.ws.onopen = function (res) {
        console.log(res);
        console.log("握手成功");
    };

    global.ws.onerror = function (e) {
        console.log(e, "进行错误重连！");
        //win.ws = new WebSocket("ws://127.0.0.1:81");
    };

    global.ws.onclose = function (e) {
        console.log(e, "进行关闭重连！");
        //win.ws = new WebSocket("ws://127.0.0.1:81");
    };

    win.onbeforeunload = function () {
        console.log("关闭窗口");
        global.ws.send(0x05);
    };

    win.onunload = function () {
        console.log("刷新窗口");
        global.ws.send(0x05);
    };

    global.ws.onmessage = function (res) {
        this.tool.decodeBlob(res.data, function (data) {

            if (!data) return;

            switch (data.status) {
                case 0x00:
                    addFriend(data.items);
                    break;
                case 0x01:
                    addFriend(data.items);
                    break;
                case 0x02:  //协助通道的询问
                    remoteSniff(data.items);
                    break;
                case 0x03:  //接受远程协助，并开辟通道
                    acceptRemoteConnect(data.items);
                    break;
                case 0x04:  //拒绝远程协助
                    rejectRemoteConnect();
                    break;
                case 0x05: //远程协助交互通道

                    win.RecvRMTEventFromApp(data.items.remoteRole, data.items.funcName, data.items.expression);
                    break;
                case 0x06:
                    break;
                case 0x07:

                    break;
                case 0xFF:  //断开协助通道//关闭ws
                    $("#RMTCover").hide();
                    win.global.RMTID.role = 0;
                    tool.alert("对方已经断开连接!", function () {
                    });
                    break;
                default :
                    break;
            }
        });

    };

    function remoteSniff(items) {
        tool.alert(
            ["【" + items.asker + "】请求您协助，请做出回应！", "确定", "取消"],
            function () {
                global.ws.send(0x02, items.helper, items.asker, true);
            },
            function () {
                global.ws.send(0x02, items.helper, items.asker, false);
            });
    }

    function acceptRemoteConnect(items) {

        tool.loading(0);
        win.jsRecvAppData(1000, {
            screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
            serverHost: "http://112.124.26.243:8090",
            businessRole: items.remoteRole
        }, "");
    }

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
                            global.ws.send(0x01, item.innerText, getUserName(), true);
                        },
                        function () {
                        })
                }
            })
        }, 45);
    }


    //模拟APP交互端口;
    win.external.SendRMTEventToApp = function (localID, funcName, expression) {

        global.ws.send(0x04, global.RMTID.role, funcName, expression);

    };
})();

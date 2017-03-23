/**
 * Created by Andy on 2017/3/23.
 */
(function () {
    var getUserName = function () {
        return win.global.RMTID.userName
    };

    WebSocket.prototype.remoteSniff = function(items) {
        tool.alert(
            ["【" + items.asker + "】请求您协助，请做出回应！", "确定", "取消"],
            function () {
                global.ws.send(0x03, items.helperUid, items.askerUid, true);
            },
            function () {
                global.ws.send(0x04, items.helperUid, items.askerUid, false);
            });
    };

    WebSocket.prototype.acceptRemoteConnect = function(items) {

        tool.loading(0);
        win.jsRecvAppData(1000, {
            screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
            serverHost: "http://112.124.26.243:8090",
            businessRole: items.remoteRole
        }, "");
    };

    WebSocket.prototype.rejectRemoteConnect = function(items) {
        tool.alert("对方正在忙碌,无法给予协助!", function () {
        });
    };

    WebSocket.prototype.addFriend = function(items) {
        //当有多个用户名的时候
        var friendList = document.getElementById("friendList");
        if (/-/g.test(items.namesMap)) {
            document.getElementById("friendList").innerHTML = "";

            items.namesMap.split("-").forEach(function (newName) {
                if (getUserName() === newName) return;
                var li = document.createElement("li");
                li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + newName + '</button>';
                friendList.appendChild(li);
            });

        }
        else {
            //当只有一个用户名的时候
            document.getElementById("friendList").innerHTML = "";
            if (getUserName() === items.namesMap) return;
            var li = document.createElement("li");
            li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + items.namesMap + '</button>';
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
                            global.ws.send(0x02, item.innerText, getUserName(), true);
                        },
                        function () {
                        })
                }
            })
        }, 45);
    }


})();
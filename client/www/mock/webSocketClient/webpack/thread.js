/**
 * Created by Andy on 2017/3/23.
 */
(function () {

    //被询问 请求协助，只有被询问方执行
    WebSocket.prototype.remoteSniff = function (items) {
        var that = this;

        this.tool.getAskerName(items.remoteUid.askerUid);
        this.tool.getHelperName(items.remoteUid.helperUid);

        tool.alert(
            ["【" + items.remoteUid.askerUid + "】请求您的协助！", "确定", "取消"],
            function () {
                that.send(0x03, true);
            },
            function () {
                that.send(0x04, false);
            });
    };

    //接受远程的响应，由服务器分别推送给两个客户端（也就是说两边客户端同时执行）
    WebSocket.prototype.acceptRemoteConnect = function (items) {

        tool.loading(0);
        win.jsRecvAppData(1000, {
            screenInfo: {screenSize: 5.5, headHeight: 60, footHeight: 60},
            serverHost: "http://112.124.26.243:8090",
            businessRole: items.remoteRole
        }, "");
    };

    WebSocket.prototype.rejectRemoteConnect = function (items) {
        tool.alert("对方拒绝了您的请求!", function () {
        });
    };

    WebSocket.prototype.addFriend = function (items) {
        var that = this;
        var friendList = document.getElementById("friendList");
        if (/-/g.test(items.namesMap)) {
            document.getElementById("friendList").innerHTML = "";

            items.namesMap.split("-").forEach(function (newName) {
                if (that.tool.getUserName() === newName) return;
                var li = document.createElement("li");
                li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + newName + '</button>';
                friendList.appendChild(li);
            });

        }
        else {
            document.getElementById("friendList").innerHTML = "";
            if (that.tool.getUserName() === items.namesMap) return;
            var li = document.createElement("li");
            li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + items.namesMap + '</button>';
            friendList.appendChild(li);
        }

        setTimeout(function () {
            var lis = friendList.children;
            Array.prototype.forEach.call(lis, function (item) {
                item.onclick = function () {
                    that.tool.getAskerName(that.tool.getUserName());
                    that.tool.getHelperName(item.innerText);
                    tool.alert("是否请求【" + item.innerText + "】的帮助？",
                        function () {
                            tool.loading({text: "等待对方应答..."});
                            that.send(0x02, true);
                        },
                        function () {})
                }
            })
        }, 45);
    };

})();
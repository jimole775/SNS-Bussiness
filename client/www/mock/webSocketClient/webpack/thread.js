/**
 * Created by Andy on 2017/3/23.
 */
(function () {
    var getUserName = function () {
        return win.global.RMTID.userName
    };

    WebSocket.prototype.remoteSniff = function(items) {
        tool.alert(
            ["��" + items.asker + "��������Э������������Ӧ��", "ȷ��", "ȡ��"],
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
        tool.alert("�Է�����æµ,�޷�����Э��!", function () {
        });
    };

    WebSocket.prototype.addFriend = function(items) {
        //���ж���û�����ʱ��
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
            //��ֻ��һ���û�����ʱ��
            document.getElementById("friendList").innerHTML = "";
            if (getUserName() === items.namesMap) return;
            var li = document.createElement("li");
            li.innerHTML = '<button class="item-button" style="height:3.6rem;">' + items.namesMap + '</button>';
            friendList.appendChild(li);
        }

        //�󶨵���¼�
        setTimeout(function () {
            var lis = friendList.children;
            Array.prototype.forEach.call(lis, function (item) {
                item.onclick = function () {
                    tool.alert("�Ƿ�����" + item.innerText + "����Э����ȷ��֮��ʧȥ����Ȩ��ֱ����ѡ���˳���",
                        function () {
                            tool.loading({text: "�ȴ��Է���Ӧ..."});
                            global.ws.send(0x02, item.innerText, getUserName(), true);
                        },
                        function () {
                        })
                }
            })
        }, 45);
    }


})();
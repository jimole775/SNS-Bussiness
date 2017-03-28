/**
 * Created by Andy on 2017/2/6.
 */
(function () {
    var win = window;

    if (!win.global.ws)win.global.ws = new WebSocket("ws://127.0.0.1:81");

    global.ws.onopen = function (res) {
        console.log(res);
        console.log("握手成功");

        var loop = setInterval(function () {
            if (global.ws.readyState === 1 && global.ws.send) {
                global.ws.send(0x00);
                clearInterval(loop);
            }
        }, 300);
    };

    global.ws.onerror = function (e) {
        console.log(e, "ws错误信号！");
        close();
    };

    //处理服务器的主动断开请求
    global.ws.onclose = function (e) {
        console.log(e, "ws关闭信号！");
        $("#RMTCover").hide();
        if (win.global.RMTID.role != 0) {
            win.global.RMTID.role = 0;
        }
        close();
    };

    win.onbeforeunload = function () {
        console.log("关闭或者刷新窗口");
        close();
    };

    //win.onunload = function () {
    //    console.log("刷新窗口");
    //    close();
    //};

    function close() {
        var PayloadData = {};
        PayloadData.uid = global.ws.tool.getUserName();
        PayloadData.items = {};
        PayloadData.items.remoteRole = global.RMTID.role;
        PayloadData.items.remoteUid = {};
        if (global.RMTID.role != 0) {
            PayloadData.items.remoteUid.askerUid = global.ws.tool.getAskerName();
            PayloadData.items.remoteUid.helperUid = global.ws.tool.getHelperName();
        }

        //alert("关闭链接："+global.ws.tool.getAskerName()+global.ws.tool.getHelperName());
        global.ws.close(1000, JSON.stringify(PayloadData)); //关闭TCP连接
    }

    global.ws.onmessage = function (res) {
        var that = this;
        this.tool.decodeBlob(res.data, function (data) {

            if (!data) return;

            switch (data.status) {
                case 0x00:  //刷新用户列表
                case 0x01:
                    that.addFriend(data.items);
                    break;
                case 0x02:  //协助通道的询问
                    that.remoteSniff(data.items);
                    break;
                case 0x03:  //接受远程协助，并开辟通道
                    that.acceptRemoteConnect(data.items);
                    break;
                case 0x04:  //拒绝远程协助
                    that.rejectRemoteConnect();
                    break;
                case 0x05: //远程协助交互通道
                    win.RecvRMTEventFromApp(data.items.remoteRole, data.items.funcName, data.items.expression);
                    break;
                case 0x06:
                    break;
                case 0x07:

                    break;
                case 0xFE:  //刷新用户列表
                    that.reduceUserName(data.items);
                    break;
                case 0xFF:  //断开协助通道通知
                    $("#RMTCover").hide();
                    tool.alert("对方已经断开连接", function () {
                        $("#friendList").find("button").each(function (index, item) {
                                $(item).find("em.light-text").remove();
                            $(item).removeClass("event-disable button-disable-state");

                        });
                        global.RMTID.role = 0;
                        //需要删除聊天泡泡
                    });
                    break;
                default :
                    break;
            }
        });

    };

    //模拟APP交互端口;
    win.external.SendRMTEventToApp = function (localID, funcName, expression) {
        global.ws.send(0x05, global.RMTID.role, funcName, expression);
    };

})();

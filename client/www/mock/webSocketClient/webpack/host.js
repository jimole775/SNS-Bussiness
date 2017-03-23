/**
 * Created by Andy on 2017/2/6.
 */
(function () {
    var win = window;

    if(!win.global.ws)win.global.ws = new WebSocket("ws://127.0.0.1:81");

    global.ws.onopen = function (res) {
        console.log(res);
        console.log("握手成功");

        var loop = setInterval(function(){
            if(global.ws.readyState === 1 && global.ws.send){
                global.ws.send(0x00);
                clearInterval(loop);
            }
        },300);
    };

    global.ws.onerror = function (e) {
        console.log(e, "ws错误信号！");
        global.ws.close(); //关闭TCP连接
    };

    global.ws.onclose = function (e) {
        console.log(e, "ws关闭信号！");
        $("#RMTCover").hide();
        if(win.global.RMTID.role != 0){
            win.global.RMTID.role = 0;
            tool.alert("对方已经断开连接!", function () {
            });
        }
        global.ws.close(); //关闭TCP连接
    };

    win.onbeforeunload = function () {
        console.log("关闭窗口");
        global.ws.close(); //关闭TCP连接
    };

    win.onunload = function () {
        console.log("刷新窗口");
        global.ws.close(); //关闭TCP连接
    };

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
                case 0xFF:  //断开协助通道//关闭ws
                    break;
                default :
                    break;
            }
        });

    };

})();

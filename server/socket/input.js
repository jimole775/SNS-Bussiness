/**
 * Created by Andy on 2017/3/14.
 */
(function () {
    const tool = require("./tools.js");
    var key;
    const mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    function WebSocket() {}
    WebSocket.prototype.run = function () {
        var that = this;
        require('net').createServer(function (socket) {
            socket.on('error',function(e){
                console.log(e);
            });
            socket.on('data', function (e) {
                var frame = tool.decodeDataFrame(e);
                //第一次握手
                if (frame.FIN === 0) {
                    console.log("握手");
                    that.handshake(e, socket);
                }
                //数据交互
                else {
                    that.dataHost(frame, socket);
                }
            });

        }).listen(81, function () {
        });
    };

    WebSocket.prototype.dataHost = function (frame, socket) {
        var that = this;
        switch (frame.Opcode) {
            case 8:
                var msg = frame.PayloadData.slice(2).toString();
                console.log("会话已经结束:", socket, msg);
                socket.end();
                if(msg)if(/^[\{\[]/.test(msg))that.close(JSON.parse(msg), socket);
                break;
            default :
                that.opcode = frame.Opcode;
                var data = JSON.parse(frame.PayloadData.toString()) || "";
                switch (data.status) {
                    case 0x00:
                        that.pushNameMap(data, socket);
                        break;
                    case 0x01:
                        //如果map里面没有此用户，就存储session，并绑定用户名
                        that.distributeUid(data, socket);
                        break;
                    case 0x02:    //协助通道的询问
                        that.remoteConnectAsk(data, socket);
                        break;
                    case 0x03:  //协助通道的应答
                        that.remoteConnectAccept(data, socket);
                        break;
                    case 0x04:
                        that.remoteConnectReject(data, socket);
                        break;
                    case 0x05:    //远程协助交互通道
                        that.RMTInterActive(data);
                        break;
                    case 0x06:
                        break;
                    case 0x07:
                        break;

                    case 0xFF: //断开协助通道//关闭ws
                        //that.close(data);
                        //console.log("中断远程用户");
                        break;
                    default :
                        break;
                }
                break;
        }
    };

    var crypto = require('crypto');
    //单个用户的握手实例;
    WebSocket.prototype.handshake = function (e, socket) {
        var original = e.toString().match(/Sec-WebSocket-Key: (.+)/)[1];
        key = crypto.createHash("sha1").update(original + mask).digest("base64");
        socket.write("HTTP/1.1 101 Switching Protocols\r\n");
        socket.write("Upgrade:Websocket\r\n");
        socket.write("Connection:Upgrade\r\n");
        socket.write("Sec-WebSocket-Accept:" + key + "\r\n");
        socket.write("\r\n");
    };

    module.exports = WebSocket;
})();
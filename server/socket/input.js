/**
 * Created by Andy on 2017/3/14.
 */
(function () {
    var WebSocket = require("./init.js");
    var key;
    var mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    WebSocket.prototype.run = function () {
        var that = this;
        require('net').createServer(function (socket) {
            console.log("服务器net会话：", socket);
            socket.on("connect", function (sock) {
                console.log("connect:", sock);
            });
            socket.on('error', function (sock) {
                console.log("error：", sock);
            });
            socket.on('lookup', function (sock) {
                console.log("lookup：", sock);
            });
            socket.on('timeout', function (sock) {
                console.log("timeout：", sock);
            });
            //socket.on('drain',function(sock){
            //	console.log("drain：",sock);
            //});
            socket.on('data', function (e) {
                var frame = that.tool.decodeDataFrame(e);
                //第一次握手
                if (frame.FIN === 0) {
                    that.handshake(socket, e);
                }
                //数据交互
                else {
                    that.dataHost(socket, frame);
                }
            });

        }).listen(81, function () {
        });
    };

    WebSocket.prototype.dataHost = function (socket, frame) {
        var that = this;
        switch (frame.Opcode) {
            case 8:
                console.log("会话已经结束:", socket, frame.PayloadData);
                break;
            default :
                that.opcode = frame.Opcode;
                var data = JSON.parse(frame.PayloadData.toString()) || "";
                switch (data.status) {
                    case 0x00:   //连接,绑定用户名
                        //如果map里面没有此用户，就存储session，并绑定用户名
                        that.distributeUid(data, socket);
                        break;
                    case 0x01:   //协助通道的询问
                        that.remoteConnectAsk(data, socket);
                        break;
                    case 0x02:   //协助通道的应答
                        that.remoteConnectAnswer(data, socket);
                        break;
                    case 0x03:   //远程协助交互通道
                        that.RMTInterActive(data);
                        break;
                    case 0x04:   //断开协助通道

                        break;
                    case 0x05:   //关闭ws
                        that.close(data);
                        break;
                    case 0x06:
                        break;
                    case 0x07:
                        break;
                    default :
                        break;
                }
                break;
        }
    };

    var crypto = require('crypto');
    //单个用户的握手实例;
    WebSocket.prototype.handshake = function (socket, e) {
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
/**
 * Created by Andy on 2017/3/14.
 */
(function () {
    var WebSocket = require("./init.js");
    var key;
    var mask = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    WebSocket.prototype.dataHost = function (socket, frame) {
        var that = this;
        switch (frame.Opcode) {
            case 8:
                console.log("�Ự�Ѿ�����:", socket, frame.PayloadData);
                break;
            default :
                that.opcode = frame.Opcode;
                var data = JSON.parse(frame.PayloadData.toString()) || "";
                switch (data.status) {
                    case 0:   //����,���û���
                        //���map����û�д��û����ʹ洢session�������û���
                        that.distributeUid(data, socket);
                        break;
                    case 1:   //Э��ͨ����ѯ��
                        that.handleRMTRequest(data, socket);
                        break;
                    case 2:   //Э��ͨ����Ӧ��
                        that.handleRMTResponse(data, socket);
                        break;
                    case 3:   //Զ��Э������ͨ��
                        that.RMTInterActive(data);
                        break;
                    case 4:   //�Ͽ�Э��ͨ��

                        break;
                    case 5:   //�ر�ws
                        that.close(data);
                        break;
                    case 6:
                        break;
                    case 7:
                        break;
                    default :
                        break;
                }
                break;
        }
    };


    var crypto = require('crypto');
    //�����û�������ʵ��;
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
/**
 * Created by Andy on 2017/3/23.
 */

var tool = require("./tool.js");
var send = function (status, data, socket) {
    var that = this;
    var emitProtocolMap = {
        status: status,
        items: data
    };

    var PayloadData = that.opcode == 1 ? JSON.stringify(emitProtocolMap) : new Buffer(JSON.stringify(emitProtocolMap));
    var fin = status === 0xFF ? 8 : 1;
    socket.write(
        tool.encodeDataFrame({
            FIN: fin,
            Opcode: that.opcode,
            PayloadData: PayloadData
        })
    );
};

module.exports = send;
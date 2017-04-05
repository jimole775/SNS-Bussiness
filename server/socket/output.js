/**
 * Created by Andy on 2017/3/23.
 */

const tool = require("./tools.js");
const WebSocket = require("./input.js");
WebSocket.prototype.send = function (status, data, socket) {
    var that = this;
    var emitProtocolMap = {
        status: status,
        items: data
    };

    var PayloadData = that.opcode == 1 ? JSON.stringify(emitProtocolMap) : new Buffer(JSON.stringify(emitProtocolMap));

    socket.write(
        tool.encodeDataFrame({
            FIN: 1,
            Opcode: that.opcode,
            PayloadData: PayloadData
        })
    );
};

module.exports = WebSocket;
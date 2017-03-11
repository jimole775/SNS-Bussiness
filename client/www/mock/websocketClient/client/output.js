/**
 * Created by Andy on 2017/3/9.
 */
(function (WebSocket) {
    var emitProtocolMap = {
        status:0,
        uid: win.global.businessInfo.userName,
        RMTInterActive: null,
        oppositeUid: null,
        close: false,
        connectAsk: false,
        disconnect: false
    };

    var send = WebSocket.prototype.send;
    WebSocket.prototype.send = function (freshData) {
        var msg = this.tool.extend(emitProtocolMap, freshData);
        var data = new Blob([JSON.stringify(msg)], {type: "text/plain"});
        send.call(this,data);
    };

    WebSocket.prototype.tool = {
        extend: function (_old, _new) {
            var result = {};
            for (var oldItem in _old) {
                for (var newItem in _new) {
                    if (newItem === oldItem) {
                        if (_new.hasOwnProperty(newItem))result[newItem] = _new[newItem];
                    }
                    else {
                        if (_old.hasOwnProperty(oldItem))result[oldItem] = _old[oldItem];
                    }
                }
            }
            return result;
        },

        decodeBlob: function (data, callback) {
            if (data instanceof Blob) {
                var reader = new FileReader();
                reader.readAsText(data, "utf8");
                reader.onload = function (e) {
                    var result = /^[\{\[]/.test(reader.result.substr(0, 1)) ? JSON.parse(reader.result) : reader.result;
                    callback(result);
                };
            }
            else {
                var result = /^[\{\[]/.test(data.substr(0, 1)) ? JSON.parse(data) : data;
                callback(result);
            }
        }

    };


})(WebSocket ? WebSocket : function WebSocket() {});
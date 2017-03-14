/**
 * Created by Andy on 2017/3/14.
 */
//var WebSocket = require("./server/socket/socket.js");

//module.exports = WebSocket;
var WebSocket = global.WebSocket;
WebSocket.prototype.console = function(){
	console.log("OK");
};
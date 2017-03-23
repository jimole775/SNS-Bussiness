/**
 * Created by Andy on 2017/1/23.
 */
(function () {
    var WebSocket = require("./output.js");
    var tool = require("./tool.js");
    var clients = {};

    //所有以创建连接的用户以{asker:session,assiant:session}的方式存储
    var chanelMap = [];

    WebSocket.prototype.namesMap = [];

    //远程链接询问，把询问信息推给协助者
    WebSocket.prototype.remoteConnectAsk = function (data, socket) {
        var helper = clients[data.items.helperUid];
        this.send(0x02,
            {
                asker: data.items.askerUid,
                helper: data.items.helperUid,
                RMTResponse: data.items.RMTResponse
            },
            helper
        );
    };

    WebSocket.prototype.remoteConnectAccept = function (data, socket) {
        var that = this;
        var asker = clients[data.items.askerUid];
        var helper = clients[data.items.helperUid];

        //存储远程对话通道
        chanelMap.push({
            asker: {uid: data.items.askerUid, session: asker},
            helper: {uid: data.items.helperUid, session: helper}
        });

        that.send(0x03, {remoteRole: 1}, asker);
        that.send(0x03, {remoteRole: 2}, helper);
    };

    //远程链接,把应答消息推给询问者
    WebSocket.prototype.remoteConnectReject = function (data, socket) {
        var asker = clients[data.items.askerUid];
        that.send(
            0x04,
            {},
            asker
        );
    };

    //开始远程交互
    WebSocket.prototype.RMTInterActive = function (data) {
        var that = this;
        var map = tool.getChanelSession(chanelMap, data.uid);
        if (data.items.remoteRole == 1) {
            that.send(0x04, data.items, map.helper);
        }
        else if (data.items.remoteRole == 2) {
            that.send(0x05, data.items, map.asker);
        }
    };

    //用户关闭socket链接
    WebSocket.prototype.close = function (data) {
        this.refreshUserList(data);
        this.disconnectChanel(data);
    };

    WebSocket.prototype.disconnectChanel = function (data) {
        //如果是协助者的断开讯号,
        var that = this;
        var asker = null;
        var helper = null;
        chanelMap.forEach(function (item,index) {
            if (item.asker.uid == data.uid || item.helper.uid == data.uid) {
                asker = item.asker.session;
                helper = item.helper.session;
                that.send(0xFE, {disconnect: true}, asker);
                that.send(0xFE, {disconnect: true}, helper);
                chanelMap.splice(index, 1);   //删除远程会话通道
            }
        });
    };
    //刷新好友列表
    WebSocket.prototype.refreshUserList = function (data) {
        var that = this;

        //删除断线的session，
        clients[data.uid].destroy();
        delete clients[data.uid];

        //删除断线的用户名，
        var index = that.namesMap.indexOf(data.uid);
        that.namesMap.splice(index, 1);

        //刷新用户列表到客户端
        that.namesMap.forEach(function (item,index) {
            that.send(0x01, {namesMap: that.namesMap.join("-")}, clients[item]);
        });
    };

    //绑定用户信息
    WebSocket.prototype.distributeUid = function (data, socket) {
        var that = this;
        socket.uid = data.uid;

        if (that.namesMap.indexOf(data.uid) < 0) {
            that.namesMap.push(data.uid);
        }

        clients[data.uid] = socket;

        //向所有的用户推送用户名
        that.namesMap.forEach(function (item,index) {
            that.send(0x01, {namesMap: that.namesMap.join("-")}, clients[item]);
        });
    };

    WebSocket.prototype.pushNameMap = function (data, socket) {
        var that = this;
        that.send(0x00, {namesMap: that.namesMap.join("-")}, socket);
    };

    module.exports = WebSocket;

})();
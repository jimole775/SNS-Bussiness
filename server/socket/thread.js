/**
 * Created by Andy on 2017/1/23.
 */
(function () {
    var WebSocket = require("./output.js");
    var tool = require("./tools.js");
    var clients = {};

    //所有以创建连接的用户以{asker:session,assiant:session}的方式存储
    //var chanelMap = [];

    WebSocket.prototype.namesMap = [];

    //远程链接询问，把询问信息推给协助者
    WebSocket.prototype.remoteConnectAsk = function (data, socket) {
        var helper = clients[data.items.remoteUid.helperUid];
        this.send(
            0x02,
            {
                remoteUid: {
                    askerUid: data.items.remoteUid.askerUid,
                    helperUid: data.items.remoteUid.helperUid
                },
                RMTResponse: data.items.RMTResponse
            },
            helper
        );
    };

    WebSocket.prototype.remoteConnectAccept = function (data, socket) {
        var that = this;
        var asker = clients[data.items.remoteUid.askerUid];
        var helper = clients[data.items.remoteUid.helperUid];

        //存储远程对话通道
        //chanelMap.push({
        //    asker: {uid: data.items.remoteUid.askerUid, session: asker},
        //    helper: {uid: data.items.remoteUid.helperUid, session: helper}
        //});

        that.send(0x03, {remoteRole: 1}, asker);
        that.send(0x03, {remoteRole: 2}, helper);
    };

    //远程链接,把应答消息推给询问者
    WebSocket.prototype.remoteConnectReject = function (data, socket) {
        var asker = clients[data.items.remoteUid.askerUid];
        that.send(
            0x04,
            {},
            asker
        );
    };

    //开始远程交互
    WebSocket.prototype.RMTInterActive = function (data) {
        var that = this;
        //var map = tool.getChanelSession(chanelMap, data.uid);
        var asker = clients[data.items.remoteUid.askerUid];
        var helper = clients[data.items.remoteUid.helperUid];
        if (data.items.activeData.remoteRole == 1) {
            that.send(0x05, data.items.activeData, helper);
        }
        else if (data.items.activeData.remoteRole == 2) {
            that.send(0x05, data.items.activeData, asker);
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
        if (data.items.remoteRole == 1) {
            var helper = clients[data.items.remoteUid.helperUid];
            that.send(0xFF, {disconnect: true}, helper);
        }else if(data.items.remoteRole == 2){
            var asker = clients[data.items.remoteUid.askerUid];
            that.send(0xFF, {disconnect: true}, asker);
        }
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
        that.namesMap.forEach(function (item, index) {
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
        that.namesMap.forEach(function (item, index) {
            that.send(0x01, {namesMap: that.namesMap.join("-")}, clients[item]);
        });
    };

    WebSocket.prototype.pushNameMap = function (data, socket) {
        var that = this;
        that.send(0x00, {namesMap: that.namesMap.join("-")}, socket);
    };

    module.exports = WebSocket;

})();
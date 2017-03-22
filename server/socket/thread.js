/**
 * Created by Andy on 2017/1/23.
 */
(function () {
    var WebSocket = require("./host.js");

    var clients = [];

    //所有以创建连接的用户以{asker:session,assiant:session}的方式存储
    var chanelMap = [];


    WebSocket.prototype.namesMap = [];

    WebSocket.prototype.send = function (socket, status, data) {
        var that = this;
        var emitProtocolMap = {
            status: status,
            items: data
        };

        var PayloadData = that.opcode == 1 ? JSON.stringify(emitProtocolMap) : new Buffer(JSON.stringify(emitProtocolMap));

        socket.write(
            that.tool.encodeDataFrame({
                FIN: 1,
                Opcode: that.opcode,
                PayloadData: PayloadData
            })
        );
    };

    WebSocket.prototype.disconnectChanel = function (data) {
        //如果是协助者的断开讯号,
        var that = this;
        var asker = null;
        var helper = null;
        chanelMap.forEach(function (item, index) {
            if (item.asker.uid == data.uid || item.helper.uid == data.uid) {
                asker = item.asker.session;
                helper = item.helper.session;
                that.send(asker, 0xFF, {disconnect: true});
                that.send(helper, 0xFF, {disconnect: true});
                chanelMap.splice(index, 1);   //删除远程会话通道
            }
        });
    };

    //两个用户的对接
    WebSocket.prototype.openChanel = function (data) {
        var that = this;
        var asker = that.tool.getSession(data.items.askerUid, clients);
        var helper = that.tool.getSession(data.items.helperUid, clients);

        //存储远程对话通道
        chanelMap.push({
            asker: {uid: data.items.askerUid, session: asker},
            helper: {uid: data.items.helperUid, session: helper}
        });

        that.send(asker, 0x02, {remoteRole: 1});
        that.send(helper, 0x02, {remoteRole: 2});
    };

    //远程链接询问，把询问信息推给协助者
    WebSocket.prototype.remoteConnectAsk = function (data, socket) {
        var helper = this.tool.getSession(data.items.helperUid, clients);
        this.send(
            helper,
            0x01,
            {
                asker:data.items.askerUid,
                helper: data.items.helperUid,
                RMTResponse: data.items.RMTResponse
            }
        );
    };

    //远程链接,把应答消息推给询问者
    WebSocket.prototype.remoteConnectAnswer = function (data, socket) {

        //积极应答，就直接开通协助通道
        if (data.items.RMTResponse) {
            this.openChanel(data);
        }

        //消极应答，直接发03通知询问方
        else {
            var asker = this.tool.getSession(data.items.askerUid, clients);
            this.send(
                asker,
                0x03,
                {

                }
            );
        }
    };

    //开始远程交互
    WebSocket.prototype.RMTInterActive = function (data) {
        var that = this;
        var map = that.tool.getChanelSession(chanelMap,data.uid);
        if (data.items.remoteRole == 1) {
            that.send(map.helper, 0x04, data.items);
        }
        else if (data.items.remoteRole == 2) {
            that.send(map.asker, 0x04, data.items);
        }
    };

    //用户关闭socket链接
    WebSocket.prototype.close = function (data) {
        this.refreshUserList(data);
        this.disconnectChanel(data);
    };

    //刷新好友列表
    WebSocket.prototype.refreshUserList = function (data) {
        var that = this;
        //删除断线的用户，重新推送到客户端
        clients.forEach(function (item, index) {
            if (item.uid === data.uid) {
                clients[index].session.destroy();
                console.log("删除对象：", clients[index]);
                clients.splice(index, 1);
                that.namesMap.splice(index, 1);
            }
        });

        clients.forEach(function (item, index) {
            that.send(item.session, 0x00, {userList: that.namesMap.join(",")});
        });
    };

    //绑定用户信息
    WebSocket.prototype.distributeUid = function (data, socket) {
        var that = this;
        if (!that.namesMap.join(",").match(new RegExp(data.uid, "g"))) {
            clients.push({
                uid: data.uid,
                session: socket
            });
            that.namesMap.push(data.uid);

            //向所有的用户推送用户名
            clients.forEach(function (item, index) {
                that.send(item.session, 0x01, {userList: that.namesMap.join(",")});
            });
        }
    };


    module.exports = WebSocket;

})();
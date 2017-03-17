/**
 * Created by Andy on 2017/1/23.
 */
(function () {
    var WebSocket = require("./input.js");

    var clients = [];
    var namesMap = [];

    //�����Դ������ӵ��û���{asker:session,assiant:session}�ķ�ʽ�洢
    var chanelMap = [];
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
        //�����Э���ߵĶϿ�Ѷ��,
        var that = this;
        var asker = null;
        var helper = null;
        chanelMap.forEach(function (item, index) {
            if (item.asker.uid == data.uid || item.helper.uid == data.uid) {
                asker = item.asker.session;
                helper = item.helper.session;
                that.send(asker, 4, {disconnect: true});
                that.send(helper, 4, {disconnect: true});
                chanelMap.splice(index, 1);   //ɾ��Զ�̻Ựͨ��
            }
        });

    };

    //�����û��ĶԽ�
    WebSocket.prototype.openChanel = function (data) {
        var that = this;
        var asker = that.tool.getSession(data.uid, clients);
        var helper = that.tool.getSession(data.items.helper, clients);

        //�洢Զ�̶Ի�ͨ��
        chanelMap.push({
            asker: {uid: data.uid, session: asker},
            helper: {uid: data.items.helper, session: helper}
        });

        that.send(asker, 2, {remoteRole: 1});
        that.send(helper, 2, {remoteRole: 2});
    };

    WebSocket.prototype.RMTInterActive = function (data) {
        var that = this;
        var map = that.tool.getChanelSession(chanelMap,data.uid);
        if (data.items.remoteRole == 1) {
            that.send(map.helper, 3, data.items);
        }
        else if (data.items.remoteRole == 2) {
            that.send(map.asker, 3, data.items);
        }
    };

    WebSocket.prototype.close = function (data) {
        this.refreshUserList(data);
        this.disconnectChanel(data);
    };

    WebSocket.prototype.refreshUserList = function (data) {
        var that = this;
        //ɾ�����ߵ��û����������͵��ͻ���
        clients.forEach(function (item, index) {
            if (item.uid === data.uid) {
                clients[index].session.destroy();
                console.log("ɾ������", clients[index]);
                clients.splice(index, 1);
                namesMap.splice(index, 1);
            }
        });

        clients.forEach(function (item, index) {
            that.send(item.session, 0, {userList: namesMap.join(",")});
        });
    };

    WebSocket.prototype.distributeUid = function (data, socket) {

        if (!namesMap.join(",").match(new RegExp(data.uid, "g"))) {

            var that = this;
            clients.push({
                uid: data.uid,
                session: socket
            });
            namesMap.push(data.uid);

            //�����е��û������û���
            clients.forEach(function (item, index) {
                that.send(item.session, 0, {userList: namesMap.join(",")});
            });

        }
    };

    WebSocket.prototype.handleRMTRequest = function (data, socket) {
        var helper = this.tool.getSession(data.items.helperUid, clients);
        this.send(
            helper,
            1,
            {
                helper: data.items.helperUid,
                RMTResponse: data.items.RMTResponse
            }
        );
    };

    WebSocket.prototype.handleRMTResponse = function (data, socket) {

        if (data.items.RMTResponse) {
            this.openChanel(data);
        }
        else {
            var asker = this.tool.getSession(data.uid, clients);
            this.send(
                asker,
                2,
                {
                    RMTResponse: data.items.RMTResponse
                }
            );
        }
    };
    module.exports = WebSocket;

})();
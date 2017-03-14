/**
 * Created by Andy on 2017/3/14.
 */
(function(){

function WebSocket() {}
WebSocket.prototype.tool = {
    getChanelSession: function (chanelMap,uid) {
        var result = {};
        chanelMap.forEach(function (item, index) {
            if (item.asker.uid == uid || item.helper.uid == uid) {
                result = {
                    asker: item.asker.session,
                    helper: item.helper.session
                };
            }
        });
        return result;
    },
    getSession: function (uid, store) {
        var i = store.length;
        while (i--) {
            if (store[i].uid === uid) {
                return store[i].session;
            }
        }
    },

//websocket���ݵļӽ��ܹ���
    decodeDataFrame:function(e){
        var i = 0, j, s, frame = {
            //����ǰ�����ֽڵĻ�������
            FIN: e[i] >> 7, Opcode: e[i++] & 15, Mask: e[i] >> 7,
            PayloadLength: e[i++] & 0x7F
        };
        //�������ⳤ��126��127
        if (frame.PayloadLength == 126) {
            frame.PayloadLength = (e[i++] << 8) + e[i++];
        }
        if (frame.PayloadLength == 127) {
            i += 4; //����һ�������ֽڵ����ͣ�ǰ�ĸ��ֽ�ͨ��Ϊ���������յ�
            frame.PayloadLength = (e[i++] << 24) + (e[i++] << 16) + (e[i++] << 8) + e[i++];
        }//�ж��Ƿ�ʹ������
        if (frame.Mask) {
            //��ȡ����ʵ��
            frame.MaskingKey = [e[i++], e[i++], e[i++], e[i++]];
            //�����ݺ��������������
            for (j = 0, s = []; j < frame.PayloadLength; j++)
                s.push(e[i + j] ^ frame.MaskingKey[j % 4]);
        }
        else s = e.slice(i, frame.PayloadLength); //����ֱ��ʹ������
        //����ת���ɻ�������ʹ��
        s = new Buffer(s);
        //����б�Ҫ��ѻ�����ת�����ַ�����ʹ��
        if (frame.Opcode == 1)s = s.toString();
        //���������ݲ���
        frame.PayloadData = s;
        //��������֡
        return frame;
    },
    encodeDataFrame : function(e){
        var s = [], o = new Buffer(e.PayloadData), l = o.length;
        //�����һ���ֽ�
        s.push((e.FIN << 7) + e.Opcode);
        //����ڶ����ֽڣ��ж����ĳ��Ȳ�������Ӧ�ĺ���������Ϣ
        //��Զ��ʹ������
        if (l < 126)s.push(l);
        else if (l < 0x10000)s.push(126, (l & 0xFF00) >> 8, l & 0xFF);
        else s.push(
                127, 0, 0, 0, 0, //8�ֽ����ݣ�ǰ4�ֽ�һ��û������
                (l & 0xFF000000) >> 24, (l & 0xFF0000) >> 16, (l & 0xFF00) >> 8, l & 0xFF
            );
        //����ͷ���ֺ����ݲ��ֵĺϲ�������
        return Buffer.concat([new Buffer(s), o]);
    }

};

WebSocket.prototype.init = function () {

};

module.exports = WebSocket;
})();
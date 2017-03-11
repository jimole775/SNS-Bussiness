/**
 * Created by Andy on 2016/7/20.
 */
(function (win) {
    var gFileType = ""; 			//缓存0x2106+文件类型(2B)中的文件类型

    //显示数据库版本列表
    win.serverRequestCallback.showDatabaseVersion_A08D = function(recvData,params) {

        //var varJson = JSON.parse(getBse64Decode(recvData)); //数量（2B）+长度（2B）+数据库版本（LB）
        var strHtml = '';
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                //var jsonData = JSON.parse(varData);
                var jsonData = recvData;
                var suffix = '';
                var version = '';
                for (var i = 0; i < jsonData.length; i++) {

                    version = jsonData[i].dataVersion;
                    if (i == 0) {
                        suffix = '" checked /></label></td>';
                    } else {
                        suffix = '" /></label></td>';
                    }
                    strHtml +=
                        '<tr>' +
                        '   <td width="22%" class="t-center">' +
                        '   <label style="display:block">' +
                        '       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                        '               type="radio" ' +
                        '               name="dbOption" ' +
                        '               id="dbOption' + i + '" ' +
                        '               value="' + version + suffix +
                        '   <td width="78%" class="t-center">' +
                        '       <label  for="dbOption' + i + '" style="display:block">' +
                                        version +
                        '       </label>' +
                        '   </td>'+
                        '</tr>';
                }

                $("#dbVersionList_A08D").html(strHtml);
                tool.bottomBtn({
                    btn1Text:"下一步",
                    btn1Callback:function(){
                        database_A08DNext();
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        database_A08DReturn();
                    }
                });
                tool.layout("database_A08D", 1);
                tool.inputStyleModify("database_A08D","radio");
            } catch (e) {
                tool.alert('解析数据库版本列表异常',function(){
                    win.sendDataToDev('71054202');
                });
            }
        //} else {
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev('71054202');
        //    });
        //}
    };

    //显示车型列表
    win.serverRequestCallback.showCarType_A08D = function(recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData)); //数量（2B）+长度（2B）+车型（LB）
        var strHtml = '';
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {

            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                //var jsonData = JSON.parse(varData);
                var jsonData = recvData;

                var suffix = '';
                var type = '';
                for (var i = 0; i < jsonData.length; i++) {

                    type = jsonData[i].carType;
                    if (i == 0) {
                        suffix = '" checked /></label></td>';
                    } else {
                        suffix = '" /></label></td>';
                    }
                    strHtml +=
                        '<tr>'+
                        '   <td width="22%" class="t-center">' +
                        '   <label  style="display:block">' +
                        '       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                        '               type="radio" ' +
                        '               name="carOption_A08D" ' +
                        '               id="carOption_A08D' + i + '" ' +
                        '               value="' + type + suffix +
                        '   <td width="78%" class="t-center">' +
                        '       <label  for="carOption_A08D' + i + '" style="display:block">' +
                                        type +
                        '       </label>' +
                        '   </td>'+
                        '</tr>';
                }

                $("#carTypeList_A08D").html(strHtml);

                tool.layout('database_A08D', 0);
                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        carType_A08DNext();
                    },
                    btn2Text:"返回",
                    btn2Callback:function(){
                        carType_A08DReturn();
                    }
                });

                tool.layout("carType_A08D", 1);

                tool.inputStyleModify("carType_A08D", "radio");

            } catch (e) {
                //tool.log('解析车型列表异常:' + recvData);
                tool.alert('解析车型列表异常',function(){
                    win.sendDataToDev('71054202');
                    tool.layout("database_A08D", 0);
                });
            }
        //} else {
        //    tool.log(varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev('71054202');
        //        tool.layout("database_A08D", 0);
        //    });
        //}
    };

    //显示模块列表
    win.serverRequestCallback.showModules_A08D = function(recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData)); //数量（2B）+长度（2B）+模块（LB）
        var strHtml = '';
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                //var jsonData = JSON.parse(varData);
                var jsonData = recvData;

                var suffix = '';
                var module_A08D = '';
                var addr = "";
                // <tr><td >编号</td><td >模块名称</td><td >地址</td><td class="t-center"><input type="radio"
                // name="module_A08DOption" value="01" checked/></td></tr>
                for (var i = 0; i < jsonData.length; i++) {

                    module_A08D = jsonData[i].modelName;
                    addr = jsonData[i].addr;
                    if (i == 0) {
                        suffix = '" checked /></td></label></tr>';
                    } else {
                        suffix = '" /></td></label></tr>';
                    }
                    strHtml +=
                        '<tr >' +
                        '   <td >' +
                        '       <label for="module_A08DOption' + i + '" style="display:block">' +
                                       (i + 1) +
                        '       </label>' +
                        '   </td>' +
                        '   <td >' +
                        '       <label for="module_A08DOption' + i + '" style="display:block">0x' +
                                     addr +
                        '       </label>' +
                        '   </td>' +
                        '   <td >' +
                        '       <label for="module_A08DOption' + i + '"style="display:block">' +
                                       module_A08D +
                        '       </label>' +
                        '   </td>' +
                        '   <td  class="t-center">' +
                        '   <label style="display:block">' +
                        '       <input onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                        '              type="radio" ' +
                        '              name="module_A08DOption" ' +
                        '              id="module_A08DOption' + i + '" ' +
                        '              value="' + addr + tool.asc2hex(module_A08D) + suffix;
                }

                $("#module_A08DList").html(strHtml);
                tool.bottomBtn({
                    btn1Text:"恢复设码",
                    btn1Callback:function(){
                        module_A08DSetCode("01");
                    },
                    btn2Text:"设码",
                    btn2Callback:function(){
                        module_A08DSetCode("02");
                    },
                    btn3Text:"取消",
                    btn3Callback:function(){
                        module_A08DCancel();
                    }
                });
                tool.layout("module_A08D", 1);

            } catch (e) {
                tool.log('解析模块列表异常:' + recvData);
                tool.alert('解析模块列表异常',function(){
                    win.sendDataToDev('71052C03');
                });

            }
        //} else {
        //    tool.log('解析模块列表异常:' + varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev('71052C03');
        //    });
        //}
    };

    //请求文件信息  [{"fileSize":"1024","fileName":"95645.0pd" } , {"fileSize":"1024","fileName":"95645.0pd" } ,..]
    //编程文件信息    PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
    win.serverRequestCallback.getFile_A08D = function(recvData,params) {

        //var varJson = JSON.parse(getBse64Decode(recvData)); //1B通信地址

        //if (varJson.CODETYPE == 'OK') {
            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                //var jsonData = JSON.parse(varData);
                var jsonData = recvData;

                var command = '6106' + gFileType + '01';
                var count = tool.toHex(jsonData.length, 2 * 2);
                command += count;

                var size = "";
                var name = "";
                var md5 = "";
                for (var i = 0; i < jsonData.length; i++) {

                    size = tool.toHex(jsonData[i].fileSize, 8);
                    name = jsonData[i].fileName;
                    md5 = jsonData[i].MD5;
                    command += tool.formateStrWithLen(tool.asc2hex(name), 32) + size + md5;
                }

                win.sendDataToDev(command);

            } catch (e) {
                tool.log('解析模块列表异常:' + recvData);
                tool.alert('解析文件信息异常',function(){
                    win.sendDataToDev('6106' + gFileType + '02');
                });
            }
        //} else {
        //    tool.log('解析模块列表异常:' + varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev('6106' + gFileType + '02');
        //    });
        //}
    };

    //OBDII程序执行 业务操作执行成功（失败）
    win.devInterActive.Fun1201 = function (recvData) {
        try {
            //OBDII程序执行成功	0x1201+00 (成功)
            //OBDII程序执行失败	0x1201+ 01(OBD失败)+错误码(6B)
            //OBDII程序执行失败	0x1201+ 02(设备失败)+错误码(4B)
            var strCommand = recvData.substr(4, 2);
            var strShowMsg = '错误的指令信息:' + recvData;
            var strTmp;
            switch (strCommand) {
                case '00':
                {
                    strShowMsg = '业务操作执行成功';
                    win.sendDataToDev('1101');
                }
                    break;
                case '01':
                {
                    strTmp = recvData.substr(6, 6);
                    strShowMsg = '业务操作执行失败，错误码:' + strTmp;
                    win.sendDataToDev('1101');
                }
                    break;
                case '02':
                {
                    strTmp = recvData.substr(6, 6);
                    strShowMsg = '业务操作执行失败，错误码:' + strTmp;
                    win.sendDataToDev('1101');
                }
                    break;
            }
            //tool.processBar(strShowMsg);
        }
        catch (e) {
            tool.log("异常：" + e.message);
        }
    };

    win.devInterActive.Fun3105 = function (recvData) {
        try {
            var strCommand = recvData.substr(4, 2);
            var strShowMsg = '错误的指令信息:' + recvData;
            switch (strCommand) {
                case '19':
                    Fun310519(recvData); 	//车辆接口选择
                    break;
                case '42':
                    Fun310542(recvData);
                    break;
                case '2C':
                    Fun31052C(recvData);
                    break;
                default:
                    tool.log(strShowMsg);
                    tool.log(strShowMsg);
                    break;
            }
        }
        catch (e) {
            tool.log("异常：" + e.message);
            //tool.alert("异常：" + e.message,function(){});
        }
    };


    //车辆接口选择	0x7105+0x19(OBD接口选择)+ 0x01(OBDII-KWP)/0x02(KWP CAN Bus 100Kbps)/0x03(KWP CAN Bus 500Kbps)
    //只有自动检测失败才有此消息
    function Fun310519(recvData) {
        tool.loading(0);
        tool.bottomBtn({
            btn1Text:"确定",
            btn1Callback:function(){
                Fun310519Ok();
            },
            btn2Text:"退出",
            btn2Callback:function(){
                Fun310519Cancel();
            }
        });
        tool.layout('fun310519', 1);
    }

    //选择车辆接口确定
    function Fun310519Ok(recvData) {

        var input_checked = tool.getCheckedElement("radio310519");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var val = input_checked.value;
        tool.layout('fun310519', 0);
        var command = '71051901' + val;
        win.sendDataToDev(command);
    }

    //选择车辆接口 取消
    function Fun310519Cancel(recvData) {
        tool.layout('fun310519', 0);
        win.sendDataToDev('71051902');
    }

    //设码信息选择
    function Fun310542(recvData) {
        tool.loading();
        //var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'44'},{'DataType':'1'},{'DataPack':''}]}";
        //var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst,data:[{ServerType:"44"},{DataType:"1"},{DataPack:""}]});
        //external.RequestDataFromServer(3021, varSendData, getDatabaseCallBack);

        win.server.request(44,1,{DataPack:""},win.serverRequestCallback.showDatabaseVersion_A08D)
    }


    //选择数据库版本 下一步，获取车型列表
    function database_A08DNext() {

        var input_checked = tool.getCheckedElement("dbOption_A08D");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }

        //tool.processBar("");
        var dbVersion = input_checked.value;
        tool.log("数据版本：" + dbVersion);

        $("#carTypeTitle").html(dbVersion + ' &rarr; 选择车型：');

        var data = getBse64Encode(dbVersion);   //编码

        //var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'44'},{'DataType':'2'},{'DataPack':'" + data + "'}]}";
        //var varSendData = JSON.stringify({subURL: global.businessInfo.serverDst ,data:[{ServerType:"44"},{DataType:"2"},{DataPack:data }]});
        tool.loading({text:"正在获取车型列表..."});
        //external.RequestDataFromServer(3021, varSendData, getCarTypeCallBack);
        win.server.request(44,2,{DataPack:data},win.serverRequestCallback.showCarType_A08D)
    }

    //选择数据库版本 返回
    function database_A08DReturn() {

        tool.layout('database_A08D', 0);
        win.sendDataToDev("71054202");

    }

    //选择车型 下一步，获取模块列表
    function carType_A08DNext() {
        var input_checked = tool.getCheckedElement("carOption_A08D");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var carType = input_checked.value;

        tool.log("底盘：" + carType);

        tool.layout("carType_A08D", 0);
        win.sendDataToDev("71054201");
    }

    //选择车型 返回
     function carType_A08DReturn() {
        tool.layout("carType_A08D", 0);

        tool.layout('database_A08D', 1);
        //sendDataToDev("71054202");
    }

    //读取模块信息
    function Fun31052C(recvData) {
        var vin = recvData.substr(6, 17 * 2);
        vin = tool.hex2a(vin);

        $("#vinId").html(vin);
        var input_checked = tool.getCheckedElement("carOption_A08D");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var carType = input_checked.value;

        var data = vin + carType;
        data = getBse64Encode(data);

        //var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'44'},{'DataType':'3'},{'DataPack':'" + data + "'}]}";
        //var varSendData = JSON.stringify({subURL: global.businessInfo.serverDst,data:[{ServerType:"44"},{DataType:"3"},{DataPack: data}]});
        tool.loading({text:"正在读取模块信息..."});
        //external.RequestDataFromServer(3021, varSendData, getModulesCallBack);
        win.server.request(44,3,{DataPack:data},win.serverRequestCallback.showModules_A08D)
    }

    var setCodeT = "01";
    function module_A08DSetCode(varData) {
        setCodeT = varData;
        var input_checked = tool.getCheckedElement("module_A08DOption");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var tmp = input_checked.value;

        var data = "71052C" + varData + tmp;
        input_checked = tool.getCheckedElement("module_A08DOption");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var module_A08D = input_checked.value.substr(2);
        tool.log("模块：" + module_A08D);

        tool.layout("module_A08D", 0);
        win.sendDataToDev(data);
    }

    function module_A08DCancel() {
        tool.layout("module_A08D", 0);
        win.sendDataToDev("71052C03");
    }

    win.devInterActive.Fun2106 = function (recvData) {
        gFileType = recvData.substr(4, 2 * 2);
        if (setCodeT == "01") {
            $("#fileSelectType").html("设码");  //些值判断时有用
            $("#lastBoxId").html("module_A08D");  //记录最后一个盒子的ID，到文件系统点击返回时会用到

            win.appService.sendDataToApp(3029, '{"ope":0}', win.serverRequestCallback.requestDir);
            tool.layout("module_A08D", 0);
            return;
        }

        //tool.processBar("正在设码...");
        var module_A08DIndex = recvData.substr(8, 2);
        var hour = recvData.substr(10, 2 * 2);
        var vin = $("#vinId").html();

        var input_checked = tool.getCheckedElement("module_A08DOption");
        if(!input_checked){
            //tool.processBar("请选择一个选项");
            return
        }
        //tool.processBar("");
        var module_A08D = input_checked.value.substr(2);

        module_A08D = tool.hex2a(module_A08D);
        var data = vin + module_A08DIndex + hour + module_A08D;

        data = getBse64Encode(data);
        //接口：获取数据版本列表
        //var varSendData = "{'subURL':'" + global.businessInfo.serverDst + "','data':[{'ServerType':'44'},{'DataType':'4'},{'DataPack':'" + data + "'}]}";
        //var varSendData = JSON.stringify({subURL:global.businessInfo.serverDst ,data:[{ServerType:"44"},{DataType:"4"},{DataPack: data }]});
        //external.RequestDataFromServer(3021, varSendData, getFileCallBack);
        win.server.request(44,4,{DataPack:data},win.serverRequestCallback.getFile_A08D)
    };

    win.devInterActive.Fun2105 = function (recvData) {
        var count = recvData.substr(4, 2);
        tool.loading({text:"正在设码..."});
        //tool.processBar("正在设码...");
        win.sendDataToDev("610501" + count);
    };

    //安全卡进行检查
    win.devInterActive.Fun3106 = function (recvData) {
        try {
            var strCommand = recvData.substr(4, 2);
            var strShowMsg = '错误的指令信息:' + strCommand;
            var nTmp = 0;
            switch (strCommand) {
                case '14': //0x3106 + 14(安全卡检查)+01(成功)
                {
                    win.devInterActive.Fun310614(recvData);
                }
                    break;
                case '11': //三、车辆接口检测：0x3106+0x11(OBD连接状态)+ 0x01(连接失败)/0x02(连接断开)/0x03(OBDII-KWP连接成功)/0x04(KWP CAN Bus 100Kbps连接成功)
           // /0x05(KWP CAN Bus 500Kbps连接成功)
                {
                    tool.loading(0);
                    //tool.processBar("");
                    nTmp = 1;
                    strCommand = recvData.substr(6, 2);
                    switch (strCommand) {
                        case '01':
                        {
                            tool.log('OBD连接失败，请检查车辆接口');
                            //tool.processBar('OBD连接失败，请检查车辆接口');
                        }
                            break;
                        case '02':
                        {
                            tool.log('OBD连接断开');
                            //tool.processBar('OBD连接断开');
                        }
                            break;
                        case '03':
                        {
                            tool.log('OBDII-KWP连接成功');
                            //tool.processBar('OBDII-KWP连接成功');
                        }
                            break;
                        case '04':
                        {
                            tool.log('KWP-CAN 100kbps连接成功');
                            //tool.processBar('KWP-CAN 100kbps连接成功');
                        }
                            break;
                        case '05':
                        {
                            tool.log('KWP-CAN 500kbps连接成功');
                            //tool.processBar('KWP-CAN 500kbps连接成功');
                        }
                            break;
                    }
                }
                    break;
                case '27': //0x3106+0x27(设码结果)+ 0x01(成功)/0x02(失败)
                {
                    nTmp = 1;
                    strCommand = recvData.substr(6, 2);


                    if (strCommand == '01') {
                        strShowMsg = '设码成功';
                        tool.log('设码成功');
                    }
                    else if (strCommand == '02') {
                        strShowMsg = '设码失败';
                        tool.log('设码失败');
                    }
                    //tool.processBar(strShowMsg);
                    tool.loading({text:strShowMsg + "，正在退出操作..."});
                }
                    break;
            }
            if (nTmp == 0) {
                tool.log(strShowMsg);
            }
        }
        catch (e) {
            tool.log("异常：" + e.message);
        }
    };

})(window);
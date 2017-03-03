/**
 * Created by Andy on 2016/7/15.
 */
(function (win) {
    //初始化------------------------------------------------------start
    var getDatabaseCallBack = "DATABASE"; //获取数据库版本列表回调ID
    var getModulesCallBack = "MODULE"; //解析SVT模块信息回调ID
    var getCarTypeCallBack = "CARTYPE"; //获取车辆类型回调ID
    var getVersionsCallBack = "VERSIONS"; //获取版本列表回调ID
    var getProgramFilesCallBack = "FILES"; //编程文件信息回调ID
    var getKeyCallBack = "KEY"; //密钥信息回调ID
    var validateFileCallBack = "VALIDATE"; //验证编程文件回调ID
    var getCodeInfoCallBack = "CODEDETAIL"; //获取设码信息明细回调ID
    var editCodeCallBack = "CODEEDIT"; //修改设码信息回调ID
    var gCarTypeId = ""; //记录要显示车辆类型的控件ID
    var gFileType = ""; //记录文件类型
    var gVersionArray = null; //缓存3105+0x36上传的版本号数组
    var gVersionArrayIndex = 0; //缓存gVersionArray当前下标
    var gTypeMap = {
        "01": "BTLD",
        "02": "SWFL",
        "03": "CAFD"
    }; //编程文件类型
    var gdownloadFilesName = ''; //缓存编程文件下载到手机端时文件名与文件大小
    var gdownloadFilesNum = 0; //缓存编程文件下载到手机端时文件数量
    var gdownloadFilesNumHex = '0x00'; //缓存编程文件下载到手机端时文件数量，16进制
    var gCurdir = ""; //缓存当前目录
    var gFileNameSizeMap = {}; //缓存选中的文件完整路径，MD5回调中赋值
    win.gFunctions = {}; //循环设置函数缓存
    win.gFileNameArray = []; //缓存用户选择的版本对应文件
    win.gDetails = {}; //循环设置明细缓存
    win.gEditDatas = {}; //修改过的数据缓存
    win.gEditDataId = {}; //修改过的数据ID缓存

    var gIndexId = "";
    var gmoduleInfosMap = {}; //缓存模块信息，以模块地址作为key
    var gProcessName = ""; //打印编程进度开关，名字变化则打印
    //缓存ProcessClass对照表，以模块名称作为key，value为十进制，使用时转为十六进制
    var gProcessClassMap = {
        "HWEL": "1",
        "HWAP": "2",
        "HWFR": "3",
        "GWTB": "4",
        "CAFD": "5",
        "BTLD": "6",
        "SWFL": "8",
        "SWFF": "9",
        "SWPF": "10",
        "ONPS": "11",
        "FAFP": "15",
        "TLRT": "26",
        "TPRG": "27",
        "FLSL": "7",
        "IBAD": "12",
        "FCFA": "16",
        "ENTD": "160",
        "NAVD": "161",
        "FCFN": "162",
        "SWIP": "193",
        "SWUP": "192",
        "BLUP": "28",
        "FLUP": "29"
    };
    //缓存ProcessClass对照表，以ProcessClass作为key，value为模块名称, 如果不存在，则显示Unknown
    var gModuleNameMap = {
        "01": "HWEL",
        "02": "HWAP",
        "03": "HWFR",
        "04": "GWTB",
        "05": "CAFD",
        "06": "BTLD",
        "08": "SWFL",
        "09": "SWFF",
        "0a": "SWPF",
        "0b": "ONPS",
        "0f": "FAFP",
        "1a": "TLRT",
        "1b": "TPRG",
        "07": "FLSL",
        "0c": "IBAD",
        "10": "FCFA",
        "a0": "ENTD",
        "a1": "NAVD",
        "a2": "FCFN",
        "c1": "SWIP",
        "c0": "SWUP",
        "1c": "BLUP",
        "1d": "FLUP"
    };


    //显示数据库版本列表
    win.serverRequestCallback.showDatabaseVersion_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData)); //数量（2B）+长度（2B）+数据库版本（LB）
        var strHtml = '';
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {
            try {
        //        var varData = tool.HexUnicodeToString(varJson.CODEDATA);
        //        var jsonData = JSON.parse(varData);
                var suffix = '';
                var version = '';
                for (var i = 0; i < recvData.length; i++) {
                    version = recvData[i].recvData;
                    if (i == 0) {
                        suffix = '" checked /></label></td>';
                    } else {
                        suffix = '" /></label></td>';
                    }
                    strHtml +=
                        '<tr>' +
                        '   <td width="22%" class="t-center">' +
                        '   <label  style="display:block">' +
                        '       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                        '               type="radio" ' +
                        '               name="dbOption" ' +
                        '               id="dbOption' + i + '" ' +
                        '               value="' + version + suffix +
                        '   <td width="78%" class="t-center">' +
                        '       <label  style="display:block" for="dbOption' + i + '">' +
                        version +
                        '       </label>' +
                        '   </td>' +
                        '</tr>';
                }
                $("#dbVersionList").html(strHtml);
                tool.bottomBtn({
                    btn1Text:"",
                    btn1Callback:function(){
                        fun710542("01");
                    },
                    btn2Text:"",
                    btn2Callback:function(){
                        fun710542("02");
                    }
                });
                tool.layout("database", 1);
                tool.inputStyleModify("database", "radio");
            } catch (e) {
                console.log('解析数据库版本列表异常:' + recvData);
                tool.log('解析数据库版本列表异常:' + recvData);
                tool.alert("解析数据库版本列表异常",function(){
                    win.sendDataToDev("71054202");
                });
            }
        //} else {
        //    console.log(varJson.CODEDATA);
        //    tool.log(varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("71054202");
        //    });
        //}
    };

    //解析SVT模块信息回调ID
    //[{"code":" 1"  ,  " modelName":" cas3"  ,  ”address”:”00” ,  "modelInfos": [{“modelInfo”:”
    // CAFD_0000000F_005_021_005”} ,…]  },…]
    win.serverRequestCallback.showModules_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        var strHtml = '';
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                var jsonData = recvData;
                var suffix = '';
                var code = '';
                var modelName = '';
                var address = '';
                for (var i = 0; i < jsonData.length; i++) {
                    code = jsonData[i].code;
                    modelName = jsonData[i].modelName;
                    address = jsonData[i].address;
                    gmoduleInfosMap[address] = jsonData[i].modelInfos; //缓存模块信息
                    if (i == 0) {
                        suffix = '" checked /></label></td>';
                    } else {
                        suffix = '" /></label></td>';
                    }
                    strHtml +=
                        '<tr>' +
                        '   <td class="t-center"><span class="disable-text">' + code + '</span></td>' +
                        '   <td class="t-center"><span class="disable-text">' + address + '</span></td>' +
                        '   <td class="menu-hint-pev" onclick="RMTClickEvent.viewVersion(' + "'" + address + "'" + ')">' +
                                   '<span  id="moduleName' + address + '">' + modelName + '</span>' +
                        '           <i class="menu-hint"></i>' +
                        '   </td>' +
                        '   <td class="t-center">' +
                        '   <label style="display:block">' +
                        '       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                        '               type="radio"' +
                        '               name="moduleOption"' +
                        '               id="moduleOption' + i + '"' +
                        '               value="' + address + suffix +
                        '</tr>';
                }

                $("#moduleList").html(strHtml);
                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        fun71052C("01");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        fun71052C("02");
                    }
                });
                tool.layout("module", 1);

                tool.inputStyleModify("module", "radio");
                //tool.processBar("");
            } catch (e) {
                //console.log('解析模块列表异常:' + e.message);
                //tool.log('解析模块列表异常:' + e.message);
                //TODO PC应答：0x7105+41+[01(确定)+01(读取)/02(加载)]/02(取消)
                tool.alert('解析模块列表异常',function(){
                    win.sendDataToDev("71054102");
                })
            }
        //} else {
        //    console.log('获取模块列表异常:' + varJson.CODEDATA);
        //    tool.log('获取模块列表异常:' + varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("71054102");
        //    })
        //}
    };

    //获取车辆类型
    win.serverRequestCallback.getCarType_A05C = function (recvData,params) {
        var targetId = "#" + gCarTypeId;
        //var varJson = JSON.parse(getBse64Decode(recvData));
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var type = tool.hex2a(varJson.CODEDATA);
                $(targetId).html("车辆类型：" + recvData);
            } catch (e) {
                $(targetId).html("车辆类型：未知");
            } finally {
            }
        //} else {
        //    $(targetId).html("车辆类型：未知");
        //}
    };

    //获取版本列表回调
    //[{"fileSize":"1024","fileName":"95645.0pd" ,"MD5":"53568996523423512362323654665456"} ,
    // {"fileSize":"1024","fileName":"95645.0pd","MD5":"53568996523423512362323654665456" } , …..]
    win.serverRequestCallback.getVersions_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {

            //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
            //var jsonData = recvData;
            var strOptions = createOptions(recvData);

            var strHtml =
                '<tr>' +
                '   <td width="80%">' +
                '       <div class="item-select">' +
                '           <label>' +
                '               <select class="item-select-change">' +
                                    strOptions +
                '               </select>' +
                '           </label>' +
                '       </div>' +
                '   </td> ' +
                '   <td width="20%">' +
                '   <label style="display: block">' +
                '       <input  onchange="RMTClickEvent.RMTChecked_ForStringContact(this.id,this.checked)"' +
                '               id="getVersionsCheckbox"' +
                '               type="checkbox" checked/>' +
                '   </label>' +
                '   </td>' +
                '</tr>';

            $("#moduleInfosSelect").append(strHtml);
            gVersionArrayIndex++; //查询成功则下标加1，从0起
            if (gVersionArrayIndex < gVersionArray.length) {
                queryVersions(gVersionArrayIndex);
            }
            if (gVersionArrayIndex == gVersionArray.length) {
                if ($("#moduleInfosSelect").html().length == 0) {
                    $("#moduleInfosSelect").html("无相关设码版本");
                }

                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        fun710536("01");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        fun710536("02");
                    }
                });
                
                tool.layout("moduleSelect", 1);

                tool.inputStyleModify("moduleSelect", "checkbox");
            }
        //} else {
        //    tool.log('获取模块版本列表异常:' + varJson.CODEDATA);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("71053602");
        //    });
        //}
    };

    function createOptions(jsonData){
        var version = "";
        var strOption = "";
        var selFlag = "";
        if (jsonData.length) {
            for (var i = 0; i < jsonData.length; i++) {
                version = jsonData[i].SGBMVersion;
                if (version == gVersionArray[gVersionArrayIndex]) {
                    selFlag = '" selected>';
                } else {
                    selFlag = '">';
                }
                strOption +=
                    '<option id="option1' + i + '" ' +
                    '        onclick="global.RMTSelected_ForStringContact(this.id)" ' +
                    '        value="' + version + selFlag + version +
                    '</option>';
            }
        }

        return strOption;
    }


    //编程文件信息回调
    //[{"fileSize":"1024","fileName":"95645.0pd" ,"MD5":"53568996523423512362323654665456"} ,
    // {"fileSize":"1024","fileName":"95645.0pd","MD5":"53568996523423512362323654665456" } , …..]
    // PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
    win.serverRequestCallback.getProgramFiles_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var varData = tool.HexUnicodeToString(varJson.CODEDATA);
                //if (varData == "[]") {
                //    tool.log("查找不到对应的编程文件");
                //    tool.processBar("查找不到对应的编程文件");
                    //win.sendDataToDev("6106" + gFileType + "02");
                    //return;
                //}
                //var jsonData = JSON.parse(varData);
                var files = "";
                var fileName = "";
                //test
                //console.log("test");
                for (var i = 0; i < recvData.length; i++) {
                    fileName = recvData[i].fileName.toLowerCase();
                    files += tool.ascToHexByLen(fileName, 32).substr(0, 64) + tool.toHex(recvData[i].fileSize, 8) + recvData[i].MD5.toUpperCase();
                    //test
                    //console.log(fileName+"   "+jsonData[i].fileSize+"   "+jsonData[i].MD5);
                }
                var command = "6106" + gFileType + "01" + tool.toHex(recvData.length, 4) + files;
                win.sendDataToDev(command);
            } catch (e) {
                //tool.log('解析编程文件信息异常:' + "[" + e.message + "]" + varJson.CODEDATA);
                tool.alert("解析编程文件信息异常",function(){
                    win.sendDataToDev("6106" + gFileType + "02");
                });
            } finally {

            }
        //} else {
        //    console.log("解析编程文件信息异常:" + varJson.CODEDATA);
        //    tool.log("获取编程文件失败");
        //    //tool.processBar("获取编程文件失败");
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("6106" + gFileType + "02");
        //    });
        //}
    };

    //密钥信息  字符串格式：                               密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]
    //PC应答：0x6703+索引ID(4B)+{01(成功)+密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]}/02(失败)
    win.serverRequestCallback.getKey = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var keys = tool.HexUnicodeToString(varJson.CODEDATA);
                var keys = recvData;
                var command = "6703" + gIndexId + "01" + keys;
                //test
                //tool.log(command);
                win.sendDataToDev(command);
            } catch (e) {
                //console.log('解析密钥信息异常:' + "[" + e.message + "]" + recvData);
                //tool.log('解析密钥信息异常:' + "[" + e.message + "]" + recvData);
                tool.alert("解析密钥信息异常",function(){
                    win.sendDataToDev("6703" + gIndexId + "02");
                });
            } finally {
            }
        //} else {
        //    console.log('获取密钥信息失败:' + recvData);
        //    tool.log('获取密钥信息失败:' + recvData);
        //    tool.processBar("获取密钥信息失败");
            //tool.alert(varJson.CODEDATA,function(){
            //    win.sendDataToDev("6703" + gIndexId + "02");
            //});
        //}
    };

    win.serverRequestCallback.getCodeInfo_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        tool.loading(0);
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var jsonData = tool.HexUnicodeToString(varJson.CODEDATA);
                var versions = recvData;
                var strHtml = "";
                var key = "";
                var detailKey = "";
                //循环显示功能，函数及其明细放入缓存，点击时取值，多个版本都放一起，通过key取值
                for (var vKey in versions) {
                    if(!versions.hasOwnProperty(vKey))continue;
                    gFileNameArray[gFileNameArray.length] = vKey;
                    //strHtml += "<tr><td><b>" + vKey + "</b></td></tr>";
                    var tmpSGBM = vKey.substr(27, 16);
                    var SGBMTmp = nSGBMIDToVersion(1, tmpSGBM);
                    $("#funsListTitle").html(SGBMTmp);
                    for (var i = 0; i < versions[vKey].length; i++) {
                        key = vKey + "," +
                        versions[vKey][i].datagroup + "," +
                        versions[vKey][i].name + "," +
                        versions[vKey][i].size;

                        strHtml +=
                            '<tr>' +
                            '   <td id="versions' + i + '"' +
                            '       onclick="RMTClickEvent.showFunction(this.id, ' + "'" + key + "'" + ')">' +
                            versions[vKey][i].datagroup + ',' +
                            versions[vKey][i].name + ',' +
                            versions[vKey][i].size +
                            '   </td>' +
                            '</tr>';

                        //循环设置函数缓存
                        gFunctions[key] = versions[vKey][i].functions;
                        //循环设置明细缓存
                        for (var j = 0; j < versions[vKey][i].functions.length; j++) {
                            //+ versions[vKey][i].functions[j].name
                            detailKey = key + "," +
                            versions[vKey][i].functions[j].start + "," +
                            versions[vKey][i].functions[j].end + "," +
                            versions[vKey][i].functions[j].mask;
                            gDetails[detailKey] = versions[vKey][i].functions[j].datas;
                        }
                    }
                }
                $("#funsList").html(strHtml);
                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        postEdit("confirm");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        postEdit("cancel");
                    }
                });
                tool.layout("functionList", 1);

            } catch (e) {
                //tool.log('解析设码文件信息异常:' + "[" + e.message + "]");
                tool.alert("解析设码文件信息异常",function(){
                    win.sendDataToDev("71053A02");
                });
            }
        //} else {
        //    tool.log('获取设码文件信息失败:' + recvData);
        //    console.log('获取设码文件信息失败:' + recvData);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("71053A02");
        //    });
        //}
    };

    //修改设码信息
    //修改文件信息 PC应答：0x7105+3A+{01(确定)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(取消)
    //[{"fileSize":"1024","fileName":"95645.0pd" ,"MD5":"53568996523423512362323654665456"},……]
    win.serverRequestCallback.editCode_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        //if (varJson.CODETYPE == 'OK') {
            try {
                //var jsonData = tool.HexUnicodeToString(varJson.CODEDATA);
                //var file = eval('(' + jsonData + ')');
                var file = recvData;
                var command = "71053A01" + tool.toHex(file.length, 4);
                for (var i = 0; i < file.length; i++) {
                    command += tool.ascToHexByLen(file[i].fileName, 32).substr(0, 64) +
                    tool.toHex(file[i].fileSize, 8) + file[i].MD5;
                }
                win.sendDataToDev(command);
            } catch (e) {
                //tool.log('编辑设码文件信息异常:' + "[" + e.message + "]" + recvData);
                //console.log('编辑设码文件信息异常:' + "[" + e.message + "]" + recvData);
                //win.sendDataToDev("71053A02");
                    tool.alert("编辑设码文件信息异常",function(){
                        win.sendDataToDev("71053A02");
                    });
            } finally {
            }
        //} else {
        //    tool.log('编辑设码文件信息失败:' + recvData);
        //    console.log('获取设码文件信息失败:' + recvData);
        //    tool.alert(varJson.CODEDATA,function(){
        //        win.sendDataToDev("71053A02");
        //    });
        //}
    };

    win.devInterActive.Fun3105 = function (recvData) {
        var strCommand = recvData.substr(4, 2);
        //tool.processBar("");
        tool.loading(0);
        switch (strCommand) {
            case '42':
                Fun310542(recvData); //选择编程数据库
                break;
            case '40':
                tool.loading(0);

                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        fun710540("01");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        fun710540("02");
                    }
                });
                tool.layout("faSelect", 1); //获取FA文件
                tool.inputStyleModify("faSelect", "radio");
                break;
            case '41':
                tool.loading(0);

                tool.bottomBtn({
                    btn1Text:"确定",
                    btn1Callback:function(){
                        fun710541("01");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        fun710541("02");
                    }
                });
                tool.layout("svtSelect", 1); //获取SVT文件
                tool.inputStyleModify("svtSelect", "radio");
                break;
            case '2C':
                Fun31052C(recvData); //选择设码模块
                break;
            case '39':
                Fun310539(recvData); //模块信息显示
                break;
            case '1F':
                tool.loading(0);
                tool.bottomBtn({
                    btn1Text:"继续",
                    btn1Callback:function(){
                        fun71051F("01");
                    },
                    btn2Text:"取消",
                    btn2Callback:function(){
                        fun71051F("02");
                    }
                });
                tool.layout("codeType", 1); //选择设码方式
                tool.inputStyleModify("codeType", "radio");
                break;
            case '36':
                Fun310536(recvData); //获取设码版本
                break;
            case '3A':
                Fun31053A(recvData); //编辑设码信息
                break;
        }
    };

    //选择编程数据库	0x3105+0x42(选择数据库)	PC应答：0x7105+42+01(确定)/02(取消)
    function Fun310542(recvData) {
        //调服务器接口  默认选择版本最新数据库

        //var varSendData = JSON.stringify({subURL: CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"23"},{DataType:"1"},{DataPack:""}]});
        //win.external.RequestDataFromServer(3021, varSendData, getDatabaseCallBack);
        win.server.request(23,1,{DataPack:""},
            win.serverRequestCallback.showDatabaseVersion_A05C);

    }

    function fun710542(option) {
        tool.layout("database", 0);
        win.sendDataToDev("710542" + option);
    }

    //获取FA文件	0x3105+0x40(获取FA文件)	PC应答：0x7105+40+[01(确定)+01(读取)/02(加载)]/02(取消)
    function fun710540(option) {

        if (option == "01") {
            var inputChecked = tool.getCheckedElement("fa");
            var method = inputChecked.value;

            if (method == "01") {
                tool.log("从汽车读取FA文件");
                //tool.processBar("从汽车读取FA文件");
                win.sendDataToDev("7105400101");
                tool.layout("faSelect", 0);
                tool.loading({text: "正在上传FA文件..."});
            }
            else if(method == "02") {
                //浏览文件再应答 调APP接口
                tool.layout("faSelect", 0);
                $("#fileSelectType").html("FA");
                $("#lastBoxId").html("faSelect");//记录最后一个盒子的ID，到文件系统点击返回时会用到
                tool.log("从本地加载FA文件");
                //tool.processBar("从本地加载FA文件");
                win.appService.sendDataToApp(3029, JSON.stringify({"ope":0}), win.serverRequestCallback.requestDir);
            }
            else{
                //tool.processBar("*至少选择一个选项");
            }
        }
        if (option == "02") {
            tool.loading({text: "操作完成，正在退出业务..."});
            win.sendDataToDev("71054002");
        }
    }

    //获取SVT文件	0x3105+0x41(获取SVT文件)	PC应答：0x7105+41+[01(确定)+01(完全)/02(快速)/03(加载)]/02(取消)
    function fun710541(option) {
        tool.layout("svtSelect", 0);
        if (option == "01") {

            var inputChecked = tool.getCheckedElement("svt");

            var method = inputChecked.value;

            switch (method) {
                case "01":
                    tool.log("从VCM读取SVT文件");
                    //tool.processBar("从VCM读取SVT文件");
                    win.sendDataToDev("7105410101");
                    tool.loading({text: "正在读取SVT文件..."});
                    break;
                case "02":
                    tool.log("从ECU读取SVT文件");
                    //tool.processBar("从ECU读取SVT文件");
                    win.sendDataToDev("7105410102");
                    tool.loading({text: "正在读取SVT文件..."});
                    break;
                case "03":
                    //浏览文件再应答 调APP接口
                    $("#fileSelectType").html("SVT");
                    $("#lastBoxId").html("svtSelect");//记录最后一个盒子的ID，到文件系统点击返回时会用到

                    tool.log("从本地加载SVT文件");
                    //tool.processBar("从本地加载SVT文件");
                    //tool.loading({text: "正在加载SVT文件..."});
                    //打开上次访问目录
                    win.appService.sendDataToApp(3029, JSON.stringify({"curdir":gCurdir, "ope":0}), win.serverRequestCallback.requestDir);
                    break;
            }


        }
        if (option == "02") {
            tool.loading({text: "操作完成，正在退出业务..."});
            win.sendDataToDev("71054102");
        }
    }

    //车辆类型解码
    function decodeCarType(carType, carTypeId) {
        gCarTypeId = carTypeId;
        var paramData = getBse64Encode(carType);
        //var param = JSON.stringify({subURL:win.CONSTANT.SERVER_ADDRESS,data:[{ServerType:"23"},{DataType:"8"},{DataPack:paramData}]});
        //win.external.RequestDataFromServer(3021, param, getCarTypeCallBack);
        win.server.request(23,8,{DataPack:paramData},win.serverRequestCallback.getCarType_A05C)
    }

    //选择编程模块	0x3105+0x2C(模块选择)+车辆类型ASCII(4B)+车架号ASCII(17B)
    function Fun31052C(recvData) {
        var carType = recvData.substr(6, 4 * 2);
        var carFrameNum = tool.hex2a(recvData.substr(14, 17 * 2));
        //$("#carType").html("车辆类型：" + carType);
        $("#carFrameNum").html("车架号：" + carFrameNum);
        //获取车辆类型
        decodeCarType(carType, "carType");
        //解析SVT文件  调服务器接口 参数为数据库版本

        var inputChecked = tool.getCheckedElement("dbOption");

        var databaseVersion = inputChecked.value;
        //var databaseVersion = $("input[name='dbOption']:checked").val();
        //tool.processBar("获取模块信息...");
        var data = getBse64Encode(databaseVersion);
        //var varSendData = JSON.stringify({subURL:win.CONSTANT.SERVER_ADDRESS,data:[{ServerType:"23"},{DataType:"2"},{DataPack:data}]});
        //win.external.RequestDataFromServer(3021, varSendData, getModulesCallBack);

        win.server.request(23,2,{DataPack:data},win.serverRequestCallback.showModules_A05C);
        tool.loading({text: "正在获取设码模块信息..."});
    }

    //选择编程模块  PC应答：0x7105+2C+[01(确定)地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)]/02(取消)
    function fun71052C(option) {
        try {
            if (option == "01") {

                var inputChecked = tool.getCheckedElement("moduleOption");

                var address = inputChecked.value;
                //var address = $("input[name='moduleOption']:checked").val();
                var moduleInfos = gmoduleInfosMap[address];
                var nSGBMID = versionToSGBMID(moduleInfos);
                var command = "71052C01" + address + tool.toHex(moduleInfos.length, 4) + nSGBMID;
                win.sendDataToDev(command);
            }
        } catch (e) {
            console.log(e.message);
        }
        if (option == "02") {
            tool.layout("module", 0);
            tool.log("用户取消操作");
            win.sendDataToDev("71052C02");
        }
    }

    //查看模块信息  版本由SGBMID转换得到，转换方法见“宝马F系单编逆向说明文档.doc”说明。
    win.RMTClickEvent.viewVersion = function (address) {

        var moduleName = getModuleName(address);
        $("#moduleTitle").html(moduleName + "[" + address + "]模块信息");
        //从缓存取，循环插入
        var moduleInfos = gmoduleInfosMap[address];
        var strHtml = "";
        for (var i = 0; i < moduleInfos.length; i++) {
            strHtml += "<li><p class='box-p'>" + moduleInfos[i].modelInfo.toUpperCase() + "</p></li>";
        }
        $("#moduleInfos").html(strHtml);
        tool.bottomBtn({
            btn1Text:"返回",
            btn1Callback:function(){
                versionReturn();
            }
        });
        tool.popShow("moduleVersion", 1);
    };

    function versionReturn() {
        tool.popShow("moduleVersion", 0);
    }

    //模块信息显示	0x3105+0x39+车辆类型ASCII(4B)+车架号ASCII(17B)+模块ID(4B)+地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)	PC应答：0x7105+39+01(继续)/02(取消)
    function Fun310539(recvData) {
        tool.layout("module", 0);
        tool.loading(0);
        //var offset = 0;
        var carType = recvData.substr(6, 4 * 2);
        var carFrameNum = tool.hex2a(recvData.substr(14, 17 * 2));
        var address = recvData.substr(56, 2);
        //offset = 58;
        var newVarRecvData = recvData.substr(58);
        var count = tool.hex2dec(newVarRecvData.substr(0, 2 * 2));
        var nSGBMIDs = newVarRecvData.substr(4);

        if(!count || !nSGBMIDs){
            tool.alert("所选模块设码功能未被支持，点击确定之后退出",
                function(){
                    win.sendDataToDev("71053902");
                });

            return;
        }

        var arr = nSGBMIDToVersion(count, nSGBMIDs);
        var strHtml = "";
        for (var i = 0; i < arr.length; i++) {
            strHtml += "<li><p class='box-p'>" + arr[i] + "</p></li>";
        }
        //获取车辆类型
        decodeCarType(carType, "carTypeConfirm");
        $("#carFrameNumConfirm").html(carFrameNum);
        var moduleName = getModuleName(address);
        $("#moduleTitleConfirm").html("模块名称：" + moduleName + "[" + address + "]");
        $("#moduleInfosConfirm").html(strHtml);
        tool.bottomBtn({
            btn1Text:"继续",
            btn1Callback:function(){
                fun710539("01");
            },
            btn2Text:"取消",
            btn2Callback:function(){
                fun710539("02");
            }
        });
        tool.layout("moduleVersionConfirm", 1);

    }

    //是否继续编程
    function fun710539(option) {
        tool.layout("moduleVersionConfirm", 0);
        win.sendDataToDev("710539" + option);
    }

    //选择设码方式 0x3105+0x1F	PC应答：0x7105+1F+[01(确定)+方式代码(1B)]/02(取消)
    function fun71051F(option) {

        if (option == "01") {

            var inputChecked = tool.getCheckedElement("codeRadio");

            var code = inputChecked.value;
            //var code = $("input[name='codeRadio']:checked").val();
            if (code == undefined || code == null) {
                tool.warnTip("codeTypeTip", "*请选择设码方式");
                return;
            } else {
                tool.warnTip("codeTypeTip", "");
            }
            var t = {
                "01": "原车设码",
                "02": "默认设码",
                "03": "编辑设码",
                "04": "恢复设码"
            };
            tool.loading({text: "正在进行" + t[code] + "..."});
            tool.log("用户选择: " + t[code]);
            //如果是恢复设码，则弹出文件选择窗口
            if (code == "04") {
                tool.layout("codeType", 0);
                $("#fileSelectType").html("设码"); //些值判断时有用
                $("#lastBoxId").html("codeType"); //记录最后一个盒子的ID，到文件系统点击返回时会用到

                win.appService.sendDataToApp(3029, JSON.stringify({"ope":0}), win.serverRequestCallback.requestDir);
                return;
            }
            tool.layout("codeType", 0);
            win.sendDataToDev("71051F01" + code);
        }
        if (option == "02") {
            tool.layout("codeType", 0);
            win.sendDataToDev("71051F02");
        }
    }

    //获取设码版本   0x3105+0x36+车辆类型ASCII(4B)+车架号ASCII(17B)+模块ID(4B)+地址(1B)+SGBMID数n(2B)+n*SGBMID(8B)
    function Fun310536(recvData) {
        //tool.loading(0);
        //原车版本是设备响应，选择列表为调接口查询；
        try {
            var carType = recvData.substr(6, 4 * 2); //14
            var carFrameNum = tool.hex2a(recvData.substr(14, 17 * 2)); //48
            var id = recvData.substr(48, 4 * 2); //56
            var address = recvData.substr(56, 2); //58
            var newVarRecvData = recvData.substr(58);
            var count = tool.hex2dec(newVarRecvData.substr(0, 2 * 2));
            var nSGBMIDs = newVarRecvData.substr(4);

            if(!count || !nSGBMIDs){
                tool.alert("所选模块设码功能未被支持，点击确定之后退出",
                    function(){
                        win.sendDataToDev("71053602");
                    });

                return;
            }

            var arr = nSGBMIDToVersion(count, nSGBMIDs);
            var oriVersions = "";
            //为每条版本设置version作为ID，方便编辑
            for (var i = 0; i < arr.length; i++) {
                oriVersions += arr[i] + "<br/>";
            }
            //获取车辆类型
            decodeCarType(carType, "carTypeSelect");
            $("#carFrameNumSelect").html("车架号：" + carFrameNum);
            var moduleName = getModuleName(address);
            $("#moduleTitleSelect").html("模块名称：" + moduleName + "[" + address + "]");
            $("#oriCodeVersion").html("原车版本：" + oriVersions);
            //调服务器接口查询数据库中的版本号列表，版本号（25B） + 数据库版本	;如果有多个版本号，则在回调函数中继续调用
            gVersionArray = arr;
            $("#moduleInfosSelect").html(""); //初始化表格
            queryVersions(0);
        } catch (e) {
            console.log(e.message);
        }
    }

    //查询相关的版本号列表，依次在回调函数中查询下一个版本号的相关版本，完成后显示表单
    function queryVersions(index) {
        try {

            var inputChecked = tool.getCheckedElement("dbOption");

            var databaseVersion = inputChecked.value;
            //var databaseVersion = $("input[name='dbOption']:checked").val();
            var data = getBse64Encode(gVersionArray[index] + databaseVersion);
            //var varSendData = JSON.stringify({subURL:win.CONSTANT.SERVER_ADDRESS,data:[{ServerType:"23"},{DataType:"5"},{DataPack: data}]});
            //win.external.RequestDataFromServer(3021, varSendData, getVersionsCallBack);
            win.server.request(23,5,{DataPack:data},
                win.serverRequestCallback.getVersions_A05C);
            tool.loading({text: "正在获取版本列表..."});
        } catch (e) {
            console.log(e.message);
        }
    }

    //PC应答：0x7105+36+[01(确定)+SGBMID数n(2B)+n*SGBMID(8B)]/02(取消)
    function fun710536(option) {

        if (option == "01") {
            var count = 0;
            var nSGBMIDs = "";

            var checkboxs = $("#moduleInfosSelect").find('input[type="checkbox"]');

            var len = checkboxs.length;
            while (count < len) {
                nSGBMIDs += versionToSgbmidForOne($(checkboxs[count]).parents("tr").find('select :selected').val());

                count++;
            }

            if (!count) {
                tool.warnTip("programTip", "*请选择要编程的模块");
                tool.layoutTable();
                return;
            }

            tool.layout("moduleSelect", 0);
            tool.warnTip("programTip", "");
            tool.layoutTable();

            tool.loading({text: "数据交互中..."});
            var command = "71053601" + tool.toHex(count, 4) + nSGBMIDs;
            win.sendDataToDev(command);
        }
        if (option == "02") {
            win.sendDataToDev("71053602");
            tool.loading({text: "操作完成，正在退出业务..."});
        }
    };

    //编辑设码信息  0x3105+0x3A(修改文件信息)+SGBMID数n(2B)+n*SGBMID(8B)	对应三个接口
    //PC应答：0x7105+3A+{01(确定)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(取消)
    function Fun31053A(recvData) {
        //SGBMID数n(2B)+n*SGBMID(十六进制字符串) +车架号（17B字符） + 数据库版本
        var nSGBMIDs = recvData.substr(6);
        var carFrameNum = $("#carFrameNumConfirm").html();

        var inputChecked = tool.getCheckedElement("dbOption");

        var databaseVersion = inputChecked.value;
        //var databaseVersion = $("input[name='dbOption']:checked").val();
        //TEST 暂时只处理只有一个SGBMID的情况
        //nSGBMIDs = nSGBMIDs.substr(4);
        var data = getBse64Encode(nSGBMIDs + carFrameNum + databaseVersion);
        //var varSendData = JSON.stringify({subURL: win.CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"23"},{DataType:"10"},{DataPack: data }]});
        //win.external.RequestDataFromServer(3021, varSendData, getCodeInfoCallBack);
        win.server.request(23,10,{DataPack:data},
            win.serverRequestCallback.getCodeInfo_A05C);
    }

    //显示函数列表
    win.RMTClickEvent.showFunction = function (id, key) {
        try {
            tool.loading(0);
            $("#functionDetailTitle").html($("#" + id).innerHTML);
            var strHtml = "";
            for (var i = 0; i < gFunctions[key].length; i++) {
                strHtml +=
                    '<tr>' +
                    '<td onclick="RMTClickEvent.showFunctionDetail(' + "'" + key + "'," + "'" + i + "'" + ')">' + gFunctions[key][i].name + '</td>' +
                    '</tr>';
            }
            $("#detailList").html(strHtml);
            tool.layout("functionList", 0);

            tool.bottomBtn({
                btn1Text:"返回",
                btn1Callback:function(){
                    postEdit("funReturn");
                }
            });

            tool.layout("functionDetail", 1);

        } catch (e) {
            console.log(e.message);
        }
    };

    //显示函数明细
    win.RMTClickEvent.showFunctionDetail = function (key, index) {
        try {
            tool.loading(0);
            tool.layout("functionDetail",0);
            $("#functionEditTitle").html(gFunctions[key][index].name);
            //设置最大值与最小值，编辑时用
            $("#maxValue").html(gFunctions[key][index].max);
            $("#minValue").html(gFunctions[key][index].min);
            $("#start").html(gFunctions[key][index].start);
            $("#end").html(gFunctions[key][index].end);
            $("#mask").html(gFunctions[key][index].mask);
            $("#Kommentar").html("Kommentar: " + gFunctions[key][index].Kommentar); //注释
            //用于区分对应文件
            $("#curFileName").val(key);
            var options = "";
            var selectedValue = "";
            var subfix = "";
            var editedKey = "";
            var value = "";
            var detailKey = key + "," + gFunctions[key][index].start + "," + gFunctions[key][index].end + "," + gFunctions[key][index].mask;
            editedKey = detailKey + "," + $("#functionEditTitle").html();
            for (var i = 0; i < gDetails[detailKey].length; i++) {
                //TEST  如果是编辑过的，则再修改为缓存中的值  gEditDatas[ key ]
                value = gDetails[detailKey][i].value;
                if (gDetails[detailKey][i].check == "true") {
                    subfix = '" selected >';
                    selectedValue = value;
                } else {
                    subfix = '">';
                }
                options +=
                    '<option id="option2' + i + '" ' +
                    '        onclick="global.RMTSelected_ForStringContact(this.id)" ' +
                    '        value="' + value + subfix + gDetails[detailKey][i].name +
                    '</option>';
            }
            $("#funSelect").html(options);
            if (gEditDatas[editedKey] != undefined && gEditDatas[editedKey] != null)
                $("#funInput").val(gEditDatas[editedKey]);
            else
                $("#funInput").val(selectedValue);


            tool.bottomBtn({
                btn1Text:"修改",
                btn1Callback:function(){
                    editConfirm("01");
                },
                btn2Text:"取消",
                btn2Callback:function(){
                    editConfirm("02");
                }
            });
            tool.layout("functionEdit", 1);

        } catch (e) {
            console.log(e.message);
        }
    };

    //确认修改
    function editConfirm(option) {
        if (option == "01") {
            var min = parseInt(tool.hex2dec($("#minValue").html()), 10);
            var max = parseInt(tool.hex2dec($("#maxValue").html()), 10);
            //var newVal = parseInt(tool.hex2dec( $("#funInput").val() ), 10);
            var flag = true;
            //TEST  对于  e1,00,...类型的数据，需要循环判断
            //tool.log( "min: " + $("#minValue").html() + " newVal: " + $("#funInput").val() + " max: " +
            // $("#maxValue").html());
            var arr = $("#funInput").val().split(",");
            for (var i = 0; i < arr.length; i++) {
                newVal = parseInt(tool.hex2dec(arr[i]), 10);
                //TEST  对于  e1,00,...类型的数据，需要循环判断
                //tool.log( "min: " + min + " newVal: " + newVal + " max: " + max);
                if (newVal < min || newVal > max) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                var keyDetails = $("#curFileName").val() + "," + $("#start").html() + "," + $("#end").html() + "," + $("#mask").html();
                var key = keyDetails + "," + $("#functionEditTitle").html();
                gEditDatas[key] = $("#funInput").val();
                gEditDataId[key] = '"start":"' + $("#start").html() + '","end":"' + $("#end").html() + '","mask":"' + $("#mask").html() + '"';
                tool.warnTip("funInputTip", "");
                //修改选项跟着改变
                var selectIndex = $('#funSelect option').index($('#funSelect option:selected')); //$('#funSelect').prop('selectedIndex');//$('#funSelect').find('option:selected').selectedIndex;
                if (gDetails[keyDetails][selectIndex].check != "true") {
                    for (var i = 0; i < gDetails[keyDetails].length; i++) {
                        if (gDetails[keyDetails][i].check == "true") {
                            gDetails[keyDetails][i].check = "false";
                        }
                    }
                }
                gDetails[keyDetails][selectIndex].check = "true";
            } else {
                tool.warnTip("funInputTip", "请输入范围内的值");
                return;
            }

            //确认提交
            postEdit("confirm");
        }
        if (option == "02") {
            tool.layout("functionEdit", 0);
            tool.bottomBtn({
                btn1Text:"返回",
                btn1Callback:function(){
                    postEdit("funReturn");
                }
            });
            tool.layout("functionDetail",1);
        }
    }

    //提交修改
    function postEdit(option) {

        //打开编辑窗
        if (option == "confirm") {
            tool.alert("确认修改设码文件吗？", function(){
                postEdit(null)
            },function(){

            });
            return;
        }

        //关闭编辑窗
        //if (option == "return") {
        //    tool.popShow("postEditConfirm", 0);
        //    return;
        //}

        //返回编辑主页面
        if (option == "funReturn") {
            tool.layout("functionDetail", 0);
            tool.bottomBtn({
                btn1Text:"确定",
                btn1Callback:function(){
                    postEdit("confirm");
                },
                btn2Text:"取消",
                btn2Callback:function(){
                    postEdit("cancel");
                }
            });
            tool.layout("functionList", 1);
            tool.loading(0);
            return;
        }

        //取消编辑
        if (option == "cancel") {
            tool.layout("functionList", 0);
            tool.log("用户取消编辑");
            win.sendDataToDev("71053A02");
            return;
        }

        //提交修改
        //tool.popShow("postEditConfirm", 0);
        tool.layout("functionList", 0);
        tool.log("正在提交设码修改...");

        try {
            var postFileNameMap = {};
            var fileNameKey = "";
            for (var key in gEditDatas) {
                if(!gEditDatas.hasOwnProperty(key))continue;
                fileNameKey = key.split(",")[0];
                if (postFileNameMap[fileNameKey] == undefined) {
                    postFileNameMap[fileNameKey] = '{' + gEditDataId[key] + ',"data":"' + gEditDatas[key] + '"}';
                } else {
                    postFileNameMap[fileNameKey] = postFileNameMap[fileNameKey] + ',{' + gEditDataId[key] + ',"data":"' + gEditDatas[key] + '"}';
                }
            }
            var data = "";
            for (var i = 0; i < gFileNameArray.length; i++) {
                if (postFileNameMap[gFileNameArray[i]] == undefined) {
                    data += '"' + gFileNameArray[i] + '":[],';
                } else {
                    data += '"' + gFileNameArray[i] + '":[' + postFileNameMap[gFileNameArray[i]] + '],';
                }
            }
            data = '{' + data.substr(0, data.length - 1) + '}';
            data = getBse64Encode(data);
            //var varSendData = JSON.stringify({subURL: win.CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"23"},{DataType:"11"},{DataPack: data }]});
            //win.external.RequestDataFromServer(3021, varSendData, editCodeCallBack);
            win.server.request(23,11,{DataPack:data},
                win.serverRequestCallback.editCode_A05C);
        } catch (e) {
            console.log(e.message);
        }
    };

    //选择时赋值
    win.RMTClickEvent.optionChange = function (id) {
        $("#funInput").val($("#" + id).val());
    };

    var fileNames6106 = {};
    //编程文件信息  0x2106+文件类型(2B)+设码方式(1B)+SGBMID数n(2B)+n*SGBMID(8B)
    //PC应答：0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
    win.devInterActive.Fun2106 = function (recvData) {

        var inputChecked = tool.getCheckedElement("codeRadio");

        var code = inputChecked.value;
        if (code != "04") {
            tool.log("正在获取" + $("#moduleTitleConfirm").html().substr(5) + "模块设码文件...");
        } else {
            tool.log("正在加载" + $("#moduleTitleConfirm").html().substr(5) + "模块设码文件...");
        }

        gFileType = recvData.substr(4, 4); //8
        //调接口获取文件名 SGBMID数n(2B)+n*SGBMID(十六进制字符串) +车架号（17B字符） + 数据库版本	编程文件信息
        var nSGBMIDs = recvData.substr(10);

        inputChecked = tool.getCheckedElement("dbOption");

        var databaseVersion = inputChecked.value;
        var carFrameNum = $("#carFrameNumConfirm").html();
        var data = getBse64Encode(nSGBMIDs + carFrameNum + databaseVersion);

        //默认设码
        if (code == "02") {
            //var varSendData = JSON.stringify({subURL: win.CONSTANT.SERVER_ADDRESS,data:[{ServerType:"23"},{DataType:"9"},{DataPack: data }]});
            //win.external.RequestDataFromServer(3021, varSendData, getProgramFilesCallBack);
            win.server.request(23,9,{DataPack:data},win.serverRequestCallback.getProgramFiles_A05C);
            return;
        }

        //恢复设码,md5在选择文件时计算
        if (code == "04") {
            //TEST 恢复暂时只支持一个文件	0x6106+文件类型(2B)+{01(成功)+文件数量n(2B)+文件信息n*[名称(32B)+大小(4B)+MD5值(16B)]}/02(失败)
            var command = "";
            var count = 0;
            //TEST  传编号给DEV  与3026中的index对应
            for (var key in global.md5Map) {
                if(!global.md5Map.hasOwnProperty(key))continue;
                var fileNameTmps = key.split("/");
                var fileName = fileNameTmps[fileNameTmps.length - 1];
                var tmp = tool.ascToHexByLen((count + ""), 32).substr(0, 64);
                fileNames6106[tmp] = fileName;
                command += tmp + gFileNameSizeMap[key] + global.md5Map[key];
                count++;
            }
            command = "6106" + gFileType + "01" + tool.toHex(count, 4) + command;
            win.sendDataToDev(command);
            return;
        }

        //var varSendData = JSON.stringify({subURL: win.CONSTANT.SERVER_ADDRESS ,data:[{ServerType:"23"},{DataType:"3"},{DataPack: data }]});
        //win.external.RequestDataFromServer(3021, varSendData, getProgramFilesCallBack);

        win.server.request(23,3,{DataPack:data},
            win.serverRequestCallback.getProgramFiles_A05C);
    };

    //获取密钥 0x2703+索引ID(4B)	PC应答：0x6703+索引ID(4B)+{01(成功)+密钥数n(1B)+n*密钥信息[密钥类型(1B)+密钥位数m(2B)+密钥校验(2B)+密钥数据(nB)]}/02(失败)
    win.devInterActive.Fun2703 = function (recvData) {
        gIndexId = recvData.substr(4, 8);

        var inputChecked = tool.getCheckedElement("dbOption");

        var databaseVersion = inputChecked.value;
        //索引ID(十六进制字符串)
        var data = getBse64Encode(gIndexId + databaseVersion);
        //var varSendData = JSON.stringify({subURL: win.CONSTANT.SERVER_ADDRESS,data:[{ServerType:"23"},{DataType:"4"},{DataPack:data}]});
        //win.external.RequestDataFromServer(3021, varSendData, getKeyCallBack);


    };

    //设码文件下载到手机端  0x2105+文件数量n(1B)+n*[文件名称(32B)+文件大小(4B)+MD5值(16B)]	PC应答：0x6105+[01(成功)+文件数量n(1B)]/02(失败)
    win.devInterActive.Fun2105 = function (recvData) {
        //循环需要下载的文件名，分别发送指令给APP进行下载，每下载一个提示一次，全部下载后响应设备；
        var count = recvData.substr(4, 2);
        //如果是恢复设码，则直接响应

        var inputChecked = tool.getCheckedElement("codeRadio");

        var code = inputChecked.value;

        if (code == "04") {
            win.sendDataToDev("610501" + count);
            return;
        }
        gdownloadFilesNumHex = count; //数量放入缓存，16进制
        count = tool.hex2dec(count);
        gdownloadFilesNum = count; //数量放入缓存
        gdownloadFilesName = recvData.substr(6, (32 + 4 + 16) * 2 * count); //文件信息放入缓存

        tool.loading('正在从服务器下载编程文件...');
        //tool.processBar('正在下载编程文件...');
        downloadForFun2105(gdownloadFilesNum, gdownloadFilesName); //调用下载方法
    };

    //文件下载到手机  PC应答：0x6105+[01(成功)+文件数量n(1B)]/02(失败)
    /**
     * 算法说明：向手机发送下载请求，参数为下载文件数量+[文件名称(32B)+文件大小(4B)]*N
     * 一次只下载一个文件，在下载成功的响应处理函数里再调用此方法，调用前要先将数量 减一，并截掉已下载的文件信息
     * 如果下载失败，则直接将数量置为 -1
     */
    function downloadForFun2105(filesNum, filesNameSize) {
        //下载未完成
        if (filesNum > 0) {
            var fileSize = tool.hex2dec(filesNameSize.substr(32 * 2, 4 * 2));
            var fileName = filesNameSize.substr(0, 32 * 2);
            //去掉补齐的'00'
            for (var i = 0; i < 32; i++) {
                var len = fileName.lastIndexOf('00');
                if (len > 0) {
                    fileName = fileName.substr(0, len);
                }
            }
            fileName = tool.hex2a(fileName);
            var varSendData = JSON.stringify({fileName:fileName ,fileSize: fileSize});
            //win.external.RequestDataFromServer(3001, varSendData, "3001"); //请求下载
            win.appService.sendDataToApp(3001, varSendData,win.serverRequestCallback.appDownloadEnd_A05C);
        }

        if (filesNum == 0 && gdownloadFilesNumHex != '0x00') {
            win.sendDataToDev('610501' + gdownloadFilesNumHex);
        }

        //下载出现失败
        if (filesNum == -1) {
            win.sendDataToDev('610502');
        }
    }

    //JS请求APP下载完成后的响应  3001的回调
    win.serverRequestCallback.appDownloadEnd_A05C = function (recvData,params) {
        //var varJson = JSON.parse(getBse64Decode(recvData));
        //if (varJson.CODETYPE == 'OK') {
            gdownloadFilesNum--; //下载成功一个减一
            gdownloadFilesName = gdownloadFilesName.substr((32 + 4 + 16) * 2); //已下载的截掉
            downloadForFun2105(gdownloadFilesNum, gdownloadFilesName); //下载文件到手机
        //} else if (varJson.CODETYPE == "DEBUG") {
        //    tool.log('下载文件调试信息：' + varJson.CODEDATA);
        //} else {
        //    tool.log('下载文件失败：' + varJson.CODEDATA);
        //    downloadForFun2105(-1, gdownloadFilesName);
        //}
    };

    //OBD响应
    win.devInterActive.Fun3106 = function (recvData) {
        var strCommand = recvData.substr(4, 2);
        switch (strCommand) {
            case '14':
                win.devInterActive.Fun310614(recvData); //安全卡检查
                break;
            case '11':
                win.devInterActive.Fun310611(recvData); //车辆通信结果
                break;
            case '17':
                win.devInterActive.Fun310617(recvData); //校验设码文件
                break;
            case '25':
                win.devInterActive.Fun310625(recvData); //计算签名结果
                break;
            case '0D':
                win.devInterActive.Fun31060D(recvData); //文件编程结果
                break;
            case '0F':
                win.devInterActive.Fun31060F(recvData); //模块编程结果
                break;
        }
    };

    //车辆通信结果
    //        0x01	诊断设备与汽车通信失败
    //        0x02	诊断设备与汽车通信断开
    //        0x03	OBDII-KWP通信成功
    //        0x04	KWP-CAN 100Kbps通信成功
    //        0x05	KWP-CAN 500Kbps通信成功
    //        0x06	TP2.0连接成功
    //        0x07	UDP/TCP总线连接成功
    //        其它	未定义提示
    win.devInterActive.Fun310611 = function (recvData) {
        var tipsMap = {
            "01": "诊断设备与汽车通信失败",
            "02": "诊断设备与汽车通信断开",
            "03": "OBDII-KWP通信成功",
            "04": "KWP-CAN 100Kbps通信成功",
            "05": "KWP-CAN 500Kbps通信成功",
            "06": "TP2.0连接成功",
            "07": "UDP/TCP总线连接成功"
        };

        var strCommand = recvData.substr(6, 2);
        tool.log(tipsMap[strCommand]);
        //tool.processBar(tipsMap[strCommand]);
        tool.loading({text: "正在导入数据库..."});
    };

    //文件校验结果 0x3106+0x17(文件校验)+03(CAFD文件)+文件名ASCII(32B)+0x01(成功)/0x02(失败)	PC不需要应答
    win.devInterActive.Fun310617 = function (recvData) {
        var type = recvData.substr(6, 2);
        var fileName = tool.hex2a(recvData.substr(8, 32 * 2));
        var strCommand = recvData.substr(70, 2);
        if (strCommand == '01') {
            tool.log("校验[" + gTypeMap[type] + "]" + fileName + "文件成功");
            //tool.processBar("正在读取原车[" + gTypeMap[type] + "]" + fileName + "文件");
        }
        if (strCommand == '02') {
            tool.log("校验[" + gTypeMap[type] + "]" + fileName + "文件失败");
        }
    };

    //计算签名结果
    win.devInterActive.Fun310625 = function (recvData) {
        //            tool.progressBar(5);
        var flag = recvData.substr(6, 2);
        if (flag == '01') {
            tool.log("生成设码文件签名成功");
            //tool.processBar("生成设码文件签名成功");
            tool.loading({text: "正在准备进行设码..."});
        }
        if (flag == '02') {
            tool.log("生成设码文件签名失败");
            //tool.processBar("生成设码文件签名失败");
        }

    };

    //编程结果 0x3106+0x0D(编程校验)+0x01(BTLD程序)/0x02(SWFL程序)/0x03(CAFD程序)+01(成功)/02(失败)
    win.devInterActive.Fun31060D = function (recvData) {
        var type = recvData.substr(6, 2); //8
        var strCommand = recvData.substr(72, 2) + '';
        switch (strCommand) {
            case '01':
                tool.log("设码[" + gTypeMap[type] + "]文件成功");
                break;
            case '02':
                tool.log("设码[" + gTypeMap[type] + "]文件失败");
                break;
        }
    };

    //编程模块结果  0x3106+0x0F(编程ECU)+模块索引ID[4B]+地址(1B)+0x01(成功)/0x02(失败)	PC不需要应答
    win.devInterActive.Fun31060F = function (recvData) {
        try {
            var strCommand = recvData.substr(16, 2) + '';
            var address = recvData.substr(14, 2);
            var moduleName = getModuleFullName(address);
            var text = "";
            switch (strCommand) {
                case '01':
                    tool.log(moduleName + '模块设码成功');
                    text = moduleName + '模块设码成功';
                    break;
                case '02':
                    tool.log(moduleName + '模块设码失败');
                    text = moduleName + '模块设码失败';
                    break;
            }
            tool.loading({text: text + "，正在结束设码操作"});
            //tool.processBar(text);
        } catch (e) {
            console.log(e.message);
        }
    };

    win.devInterActive.Fun3108 = function (recvData) {
        var flag = recvData.substr(4, 2);
        switch (flag) {
            case '01':
                Fun310801(recvData); //编程应用程序
                break;
            case '0A':
                break; //日志加密进度
            default:
                tool.log('错误的指令信息(3108):' + recvData);
        }
    };

    //编程引导程序  0x3108+0x01(写ECU进度)+文件总数(2B)+当前执行文件序号(2B)+设码数据总大小(4B)+完成设码数据大小(4B)+文件名ASCII(32B)
    function Fun310801(recvData) {
        var total = tool.hex2dec(recvData.substr(6, 2 * 2)); //10
        var currentIndex = tool.hex2dec(recvData.substr(10, 2 * 2)); //14
        var totalSize = tool.hex2dec(recvData.substr(14, 4 * 2)); //22
        var currentSize = tool.hex2dec(recvData.substr(22, 4 * 2)); //30
        var curFile = recvData.substr(30, 32 * 2);
        var curFileName = tool.hex2a(curFile);
        var process = parseInt(currentSize / totalSize * 100);
        process += '%';
        var programFileName = "";
        if (gProcessName != curFileName) {

            var inputChecked = tool.getCheckedElement("codeRadio");

            var code = inputChecked.value;
            if (code == '04') {
                tool.log("正在编程" + fileNames6106[curFile] + "文件");
                programFileName = fileNames6106[curFile];

            } else {
                tool.log("正在编程" + curFileName + "文件");
                programFileName = curFileName;

            }
            gProcessName = curFileName;
        }

        tool.loading({text: "正在编程" + programFileName + "..."});
        //编程进度：文件XX(当前文件序号)/XX(文件总数)   XX%(当前文件编程进度)”
        //tool.processBar('编程进度：' + currentIndex + '/' + total + '  ' + process);

        var processWatcher = setInterval(function () {
            if (currentIndex == total && process == "100%") {
                clearInterval(processWatcher);
                tool.loading({text: programFileName + "编程完成，正在确认设码结果..."});
            }
        }, 105);
    }

    //单条版本信息转换SGBMID ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
    function versionToSgbmidForOne(moduleInfo) {
        var sgbmid = "";
        var processClass = "";
        var id = "";
        var mainVersion = "";
        var subVersion = "";
        var patchVersion = "";
        try {
            arr = moduleInfo.split("_");
            processClass = tool.toHex(gProcessClassMap[arr[0]], 2);
            id = arr[1];
            mainVersion = tool.toHex(arr[2], 2);
            subVersion = tool.toHex(arr[3], 2);
            patchVersion = tool.toHex(arr[4], 2);
            sgbmid = processClass + id + mainVersion + subVersion + patchVersion;
        } catch (e) {
            console.log("模块版本信息错误: " + e.message);
        }
        return sgbmid;
    }

    //版本信息转换SGBMID ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
    //返回n * SGBMID
    function versionToSGBMID(moduleInfos) {
        var arr; //CAFD_0000000F_005_021_005
        var nSGBMID = "";
        for (var i = 0; i < moduleInfos.length; i++) {
            if (moduleInfos[i].modelInfo.indexOf("Unknown") >= 0) {
                continue;
            }
            nSGBMID += versionToSgbmidForOne(moduleInfos[i].modelInfo);
        }
        return nSGBMID;
    }

    //SGBMID转换版本信息 ProcessClass(1B)+ID(4B)+MainVersion(1B)+SubVersion(1B)+PatchVersion(1B)
    //返回 版本信息 数组
    function nSGBMIDToVersion(count, nSGBMIDs) {
        var arr = [];
        var sgbmid = "";
        var processClass = "";
        var id = "";
        var mainVersion = "";
        var subVersion = "";
        var patchVersion = "";
        var version = "";

        for (var i = 0; i < count; i++) {
            sgbmid = nSGBMIDs.substr(0, 16);
            nSGBMIDs = nSGBMIDs.substr(16);
            processClass = sgbmid.substr(0, 2);
            id = sgbmid.substr(2, 8);
            mainVersion = sgbmid.substr(10, 2);
            subVersion = sgbmid.substr(12, 2);
            patchVersion = sgbmid.substr(14, 2);
            var moduleName = "";
            if (gModuleNameMap[processClass] == undefined || gModuleNameMap[processClass] == null) {
                moduleName = "";
            } else {
                moduleName = gModuleNameMap[processClass];
            }
            version = moduleName + "_" + id + "_" + tool.formatNumber(tool.hex2dec(mainVersion), 3) +
            "_" + tool.formatNumber(tool.hex2dec(subVersion), 3) + "_" + tool.formatNumber(tool.hex2dec(patchVersion), 3);
            arr[i] = version;
        }

        return arr;
    }

    //获取模块名称
    function getModuleName(address) {
        if ($("#moduleName" + address).html() == null) {
            return "";
        }
        return $("#moduleName" + address).html();
    }

    function getModuleFullName(address) {
        if ($("#moduleName" + address).html() == null) {
            return "";
        }
        return $("#moduleName" + address).html() + "[" + address + "]";
    }

})(window);
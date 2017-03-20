/**
 * Created by Andy on 2016/8/19.
 */
(function () {
    var win = window;
    var gCurDirPrev_String = "/storage/emulated/0/";
    var gCurDirIndex_int = -1;
    var gNavDirName_Array = [];
    var selectedFileName = "";
    var gCurDir_String = "";

    //验证编程文件
    //todo 现在文件上传验证的工作已经取消
    win.serverRequestCallback.validateFile = function (responseObject, params) {
        tool.loading(0);
        try {
            var varJson = responseObject;
            if (varJson.CODETYPE == 'OK') {
                var flag = tool.hex2a(varJson.CODEDATA);
                console.log("validateFile:flag -", flag);
                if (flag == "true") {
                    var type = $("#fileSelectType").html();
                    var inputChecked, faValue, svtValue;
                    if (type == "FA") {
                        inputChecked = tool.getCheckedElement("fa");
                        faValue = inputChecked.value;

                        //PC应答：0x7105+40+[01(确定)+01(读取)/02(加载)]/02(取消)
                        win.devService.sendDataToDev("71054001" + faValue);
                    }
                    if (type == "SVT") {
                        inputChecked = tool.getCheckedElement("svt");
                        svtValue = inputChecked.value;

                        //PC应答：0x7105+41+[01(确定)+01(扫描)/02(快速)/03(加载)]/02(取消)
                        win.devService.sendDataToDev("71054001" + svtValue);
                    }
                    $("#fileList").html("");	//清空文件列表

                }
                else {
                    tool.warnTip("#fileList", "文件验证失败，请重新选择");
                    tool.layout("fileSelect", 1);
                }

            }
            else {
                tool.warnTip("#fileList", "文件验证失败，请重新选择");
                tool.layout("fileSelect", 1);
            }
        } catch (e) {
            tool.warnTip("#fileList", "文件验证失败，请重新选择");
            tool.layout("fileSelect", 1);
            console.log(e.message)
        }
    };

    win.global.handleAppCallback3028 = function (varJson) {
        tool.loading(0);
        if (varJson.CodeType == 'OK') {
            var param = "";
            var arr = varJson.CodeData.md5s;
            for (var i = 0; i < arr.length; i++) {
                param += '{"index":' + i + ',"pathType": 0,"filePath":"' + arr[i].Data + '","fileType": 1},';
                global.md5Map[arr[i].Data] = arr[i].md5;
            }
            param = {arrays: [param.substr(0, param.length - 1)]};
            win.appService.sendDataToApp(3026, JSON.stringify(param), 0);

            //选择设码方式	0x3105+0x1F	PC应答：0x7105+1F+[01(确定)+方式代码(1B)]/02(取消)
            var input_checked = tool.getCheckedElement("codeRaido");
            if (!input_checked) {
                //tool.processBar ("请选择一个选项");
                return
            }

            var code = input_checked.value;
            win.devService.sendDataToDev("71051F01" + code);

        }
        else {
            tool.warnTip("#fileList", "计算所选文件MD5失败!");
            win.global.md5Map = {}; //重置
            //返回文件选择列表
            tool.layout('FileInfo', 1);
        }
    };

    //todo 现在文件上传验证的工作已经取消
    win.serverRequestCallback.uploadFile = function (varJson) {
        tool.loading(0);
        if (varJson.CodeType == 'OK') {
            var type = $("#fileSelectType").html();
            if (type == "FA") type = "01";
            if (type == "SVT") type = "02";

            //调服务器接口验证文件是否正确
            var data = getBse64Encode(type + selectedFileName);
            win.server.request(17, 7, {DataPack: data}, win.serverRequestCallback.validateFile);
        }
        else {
            //上传失败提示
            tool.warnTip("#fileList", "文件上传失败，请重试");
            tool.layout("fileSelect", 1);
        }
    };


    win.serverRequestCallback.requestDir = function (varJson) {
        tool.loading(0);
        tool.bottomBtn(
            {
                btn1Text: function () {
                    return gCurDirIndex_int <= 0 ? "返回" : "上一级";
                },
                btn1Callback: function () {
                    win.RMTClickEvent.bindFileSelectTableButton();
                }
            }
        );

        if (varJson.CodeType == 'OK') {
            var originDir = varJson.CodeData.curdir;    //缓存当前目录
            var curDir = originDir.replace(/\./, "·");  //替换 .符号 为 中文符号· 避免以此文本为id号时，无法获取，最后发送dir串 给APP时再转换回来
            var fileList = varJson.CodeData.files;  //fileList里面也会有 .符号，在创建标签的时候再进行处理
            var sortedList = [], i;
            for (i = 0; i < fileList.length; i++) sortedList.push(fileList[i].file);

            var nav_curDirName = (function () { //从当前url中截取最后的文件夹名字；
                var url = curDir.split("/");
                return url[url.length - 1];
            })();

            var isTableExist = TagCoverChecking(nav_curDirName);    //隐藏所有table,并判断当前文件夹的table是否已经存在

            if (isTableExist){
                $("#table_" + nav_curDirName).show();
                tool.layout("fileSelect",1);
            }//如果table已经存在，就直接显示
            else {  //如果不存在，就刷新界面；
                handleNavElement(nav_curDirName);
                handleTableElement(nav_curDirName, sortedList, fileList);
            }

            tool.layoutTable();
        }
        else {
        }
    };

    win.RMTClickEvent.chooseFileConfirm = function (fileName) {
        tool.alert(
            "点击确定之后读取文件" + fileName,
            function () {
                selectEnd(fileName);
            },
            function () {
            }
        );
    };


    function TagCoverChecking(nav_curDirName) {
        var isTableExist = false;
        var file_tables = $("#fileList").find("table"); //遍历所有table,如果有的话，首先隐藏所有table,顺便获取当前的已经存在的table的ID号；
        var len = file_tables.length;

        while (len--) {
            file_tables[len].style.display = "none";
            if (file_tables[file_tables.length - 1].id === "table_" + nav_curDirName)   //判断是否已经存在了table,以ID号为判断标准
                isTableExist = true;
        }
        return isTableExist;
    }


    function handleNavElement(nav_curDirName) {
        gNavDirName_Array.push(nav_curDirName); //把导航的所有文件夹的名字存起来；
        gCurDirIndex_int++; //存一次，当前导航条的下标就+1；

        $("#navDir").find("em").removeClass("href-text").addClass("disable-text");  //首先刷新导航条字体颜色为灰色；
        var navStrHtml =    //创建拼接字串；
            '<span id="nav_' + nav_curDirName + '">' +
            '   <i class="auxiliary-mark">/&nbsp;</i>' +
            '   <em class="href-text" ' +
            '       onclick="RMTClickEvent.navDirController(\'' + nav_curDirName + '\')">' +
            nav_curDirName.replace(/·/, "\.") + '&nbsp;' +  //显示的时候还是使用英文.符号；
            '   </em>' +
            '</span>';

        $("#navDir").append(navStrHtml);    //往navDir 后面塞；
    }

    function handleTableElement(nav_curDirName, sortedList, fileList) {
        var i, fileProsHtml = "", filesHtml = "";
        for (i = 0; i < fileList.length; i++) {
            var fileUrl = /\.dev/ig.test(sortedList[i]) ? "images/DevFile.png" : "images/NormFile.png"; //区分dev文件和其他类型文件
            var queryID = sortedList[i].replace(/\./, "·"); //由于HTML元素的ID名无法识别点符号“.”，所以全部转换成中文点符号"·",在转发URL给APP之前，再替换回来;

            if (fileList[i].isdir)
                fileProsHtml +=
                    '<tr>' +
                    '   <td class="t-center" width="20%">' +
                    '       <img width="50px" height="50px" src="images/FilePro.png" id="img_' + queryID + '"/>' +
                    '   </td>' +
                    '   <td width="80%" onclick="RMTClickEvent.nextLevel(' + "'" + queryID + "'" + ')">' +
                    sortedList[i] +
                    '   </td>' +
                    '</tr>';
            else
                filesHtml +=
                    '<tr>' +
                    '   <td class="t-center" width="20%">' +
                    '       <img width="50px" height="50px" src="' + fileUrl + '"/>' +
                    '   </td>' +
                    '   <td width="80%" onclick="RMTClickEvent.chooseFileConfirm(\'' + queryID + '\')">' +
                    '       <p class="box-p">' + sortedList[i] + '</p>' +
                    '   </td>' +
                    '</tr>';

        }

        //确保界面的显示顺序是从上到下：文件夹-->文件；
        $("#fileList").append("<table id='table_" + nav_curDirName + "'>" + fileProsHtml + filesHtml + "</table>");
        tool.loading(0);
        tool.layout("fileSelect", 1);
        tool.inputStyleModify("fileList", "radio");
    }

    win.RMTClickEvent.navDirController = function (navID) {
        navDirController(navID);
    };


    function navDirController(navID) {
        var navName_Array = $("#navDir").find("em");
        var curNavName = $("#nav_" + navID).children("em");
        navName_Array.removeClass("href-text").addClass("disable-text");
        curNavName.removeClass("disable-text").addClass("href-text");

        var file_tables = $("#fileList").find("table");
        var len = file_tables.length;
        while (len--) file_tables[len].style.display = "none";

        gCurDirIndex_int = navName_Array.index(curNavName); //返回键和导航条事件共用一个方法,但是导航条获取
        $("#table_" + navID).show();
    }

    //打开下一级文件夹
    win.RMTClickEvent.nextLevel = function (curDir) {
        $("#img_" + curDir).attr("src", "images/FilePro_open.png"); //点击过后,就把 "闭合的" 文件夹图片替换成 "打开的" 文件夹图片
        var reg = new RegExp(curDir, "g");

        //如果打开的新目录已经存在，就执行导航事件，直接读取缓存，不用再次从APP获取；
        if (reg.test(gNavDirName_Array.join(",")))
            navDirController(curDir);
        else {
            var curNavIndex = (function () {
                var navName_arr = $("#navDir").find("em");
                var len = navName_arr.length;
                var i = 0;
                var index;
                while (i < len) {
                    if (navName_arr[i].className === "href-text") {
                        index = i;
                        break;
                    }
                    i++;
                }
                return index;
            })();
            gNavDirName_Array.splice(curNavIndex + 1);
            gCurDirIndex_int = gNavDirName_Array.length - 1;

            //todo 获取当前的class为href-text的下标，然后把后面的数组元素都删除掉
            resetNavList(curNavIndex);

            gCurDir_String = gCurDirPrev_String + gNavDirName_Array.join("/") + "/" + curDir;
            win.appService.sendDataToApp(3029, '{"curdir":"' + gCurDir_String.replace(/·/, "\.") + '", "ope":0}', win.serverRequestCallback.requestDir);
        }
    };

    function resetNavList(delIndex) {
        var el_arr = $("#navDir").find("span"), len = el_arr.length;
        while (len--) {
            if (len > (delIndex + 1)) el_arr[len].remove(); //循环删除比当前下标的元素
        }
    }

    win.RMTClickEvent.bindFileSelectTableButton = function () {
        //如果翻页下标小于等于0，就执行退出操作
        if (gCurDirIndex_int <= 0) {
            gCurDirIndex_int--;
            gNavDirName_Array.length = 0;
            gCurDir_String = "";
            resetNavList(-1);  //重置nav列表
            tool.layout("fileSelect", 0);
            tool.bottomBtn(0);

            var callback = $("#callback_sp").text();   //如果有特殊行为，就绑定一个全局函数，这里直接调用
            if(callback)win[callback]();    //进入文件系统之前，会把消极选择的回调帮到 #callback_sp 标签上
        }
        else {
            gCurDirIndex_int--;
            navDirController(gNavDirName_Array[gCurDirIndex_int]);
            console.log("当前目录下标：", gCurDirIndex_int);
        }
    };

    //选择文件确定/返回
    function selectEnd(fileName) {

        var type = $("#fileSelectType").text(); //请求选择文件时，需要手动绑定选择文件的类型，默认为SVT文件
        var lastBoxId = $("#lastBoxId").text(); //绑定上一个盒子的ID号，在这里从新获取，以便文件选择结束的时候返回
        var behavior = $("#fileBehavior").text();   //确定上传到服务器还是写入到DEV
        var procedureInfo = JSON.parse($("#procedureInfo").text());   //跳转到文件选择页面之前绑定的信息，发给APP使用

        selectedFileName = fileName.replace(/·/, "\.");
        var url = gCurDir_String + "/" + selectedFileName;  //把文件名发给APP，然后上传到服务器，回调里响应设备

        //上传到服务器使用APP端口3032
        switch(behavior){
            case "toServer":{
                tool.loading({text: "正在上传文件"});

                //添加延迟，防止APP回馈信息过快，导致loading层隐藏事件快于显示事件
                setTimeout(function () {
                    win.appService.sendDataToApp(
                        3032,   //数据源，FFFF(客户端软件日志),0000(预留),0001(日志文件),0002(防盗数据文件),
                        '{"file":"' + url + '", "type":"0006"}',    // 0003(EEPROM文件),0004(FLASH文件),0005(设码数据文件),0006(编程文件)
                        "3032"
                    );
                }, 500);
            } break;
            case "toDev":{
                //写入到DEV使用APP端口3109
                tool.loading({text: "正在写入文件"});
                procedureInfo.fileName = url;   // {"fileName":"文件路径","businessId":"当前的业务ID","processId":"流程号"}

                //添加延迟，防止APP回馈信息过快，导致loading层隐藏事件快于显示事件
                setTimeout(function () {
                    win.appService.sendDataToApp(
                        3109,
                        JSON.stringify(procedureInfo),
                        "3109"
                    );
                }, 500);
            } break;
            default :
                tool.alert("未定义文件处理模式！", function () {
                    win.appService.sendDataToApp(3999,"","");
                });
                break;
        }
        
        resetNavList(-1);  //重置nav列表
        tool.layout("fileSelect", 0);
        if(lastBoxId)tool.layout(lastBoxId, 1);
        tool.bottomBtn(0);
    }
})();
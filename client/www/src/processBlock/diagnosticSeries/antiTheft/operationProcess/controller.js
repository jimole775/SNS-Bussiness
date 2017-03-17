/**
 * Created by Andy on 2016/6/25.
 */
(function () {
    var win = window;

    App.controller("specialProcessCtrl", ["$scope", "angularFactory", function ($scope, angularFactory) {

        var safeApply = angularFactory.getScope($scope).safeApply;

        var $ = angular.element;

        $scope.contents_arr = [ //正文文本,用于模板绑定,menuItemsValue为读值信息
            //{supid:"",name:"",menuItemsValue:""}
        ];

        $scope.radios_arr = [ //正文文本,用于模板绑定,menuItemsValue为读值信息
            //{supid:"",name:"",menuItemsValue:"",disabled:"false"}
        ];

        $scope.items_arr = [ //正文文本,用于模板绑定,menuItemsValue为读值信息
            //{supid:"",name:"",menuItemsValue:""}
        ];

        $scope.buttons_arr = [  //按钮文本,用于模板绑定
            //{supid:"",name:""}
        ];

        $scope.BombBoxType = "00";  //弹出框类型

        var cmdLen_int;

        var stepCount = 0;  //【A】--指令流程号，操作一次加一；
        var requestType = "01"; //默认为1,
                                // 请求类型参考菜单的supid处理类型,因为前端已经补全了所有supid,所以请求类型只有01和03

        var pidCacheFromDev = { //存储提示框或者输入框的supid; 用于搜索服务器返回数据时,区分哪些是按钮内容,哪些是正文内容;
            contents_arr: [],
            buttons_arr: [],
            radios_arr: [],
            items_arr: []
        };

        var menuType04 = "";    //区分菜单的supid组合类型
        //var pidCacheFromDev.items_arr = []; //用于存储菜单的supid;
        var menuItemsValue_arr = [];    //用于存储读值信息;
        var bindsupidWithValueForMenuType04_obj;    //用于处理带读值菜单的显示值,获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定到html显示;supid类型为03的不用绑定

        var preCmd = "";
        var gSupidWithDisableState = {
            //supid:state       //把supid和选项的状态绑定，服务器获取完数据之后再筛选，把选项状态反应到视图模板
        };
        win.moduleEntry.antiTheftProcess = function () {
            stepCount = 0;  //每次重新进入流程，就重置流程号
            tool.bottomBtn(0);  //当前流程模块全部都是弹框显示，无底部按钮需求，在此隐藏
            var firstContactDev = "0000";
            win.sendDataToDev("310960" + firstContactDev);
        };

        win.devInterActive.Fun710960 = function (varRecvData) {

            //根据设备回复的流程号来记录，因为APP在处理文件的时候，自行和设备交互，如果在JS端自加，流程号会有断层
            stepCount = parseInt(varRecvData.substr(6,2)) + 1;

            handleVarRecvData(varRecvData);
        };

        win.devInterActive.Fun7109D0 = function (varRecvData) {
            //todo 设备响应失败
            tool.alert("CCDP设备响应失败", function () {
                win.sendDataToDev("310902");
            });
        };

        function handleVarRecvData(varRecvData) {

            try {
                //使用之前先重置；
                pidCacheFromDev.contents_arr.length = 0;    //存储内容文本的supid（索引号），用于匹配服务器返回的文本
                pidCacheFromDev.buttons_arr.length = 0; //存储按钮文本的supid（索引号），用于匹配服务器返回的文本
                pidCacheFromDev.radios_arr.length = 0; //存储按钮文本的supid（索引号），用于匹配服务器返回的文本
                pidCacheFromDev.items_arr.length = 0; //存储按钮文本的supid（索引号），用于匹配服务器返回的文本
                menuItemsValue_arr.length = 0;  //用于存储读值信息;

                preCmd = varRecvData.substr(1, 5);
                $scope.BombBoxType = varRecvData.substr(8, 2);  //【B】--弹出框类型
                cmdLen_int = tool.hex2dec(varRecvData.substr(10, 4));   //【C】--后缀指令长度；
                requestType = "01"; //请求类型为01时，代表datapack会打包所有的supid
                switch ($scope.BombBoxType) {
                    case "00":
                        global.disconnectOBD();
                        return;
                        break;
                    case "01":  //提示框
                    case "02":  //输入框
                    {
                        pidCacheFromDev.contents_arr.push(varRecvData.substr(14, 8)); //前八位为supid,和菜单有区别

                        /**
                         * 会把supid绑定成下面的形式
                         * [{
						 *  index : x,
						 *  value : supid
						 *  }]
                         * */
                        pidCacheFromDev.buttons_arr =
                            tool.cutStringByStep(   //分割指定的数据，输出为一个数组；
                                varRecvData,    //原始数据
                                tool.hex2dec(varRecvData.substr(22, 2)),    //分割的数量
                                24, //起始位置
                                8); //步进数值
                    }
                        break;
                    case "03":  //普通菜单
                    {
                        var menuType = varRecvData.substr(14, 2);
                        var menuItemsSum = tool.hex2dec(varRecvData.substr(16, 2));
                        switch (menuType) {

                            case "01":  //当菜单类型为01时，第二字节代表菜单条目数，后每8字节代表一个supid；
                            {
                                for (var i = 0; i < menuItemsSum; i++) {
                                    pidCacheFromDev.items_arr.push(varRecvData.substr(18 + i * 8, 8));
                                }
                            }
                                break;

                            case "02":  //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
                            {
                                var startIndex = tool.hex2dec(varRecvData.substr(18, 8));
                                var endIndex = tool.hex2dec(varRecvData.substr(26, 8));
                                menuItemsSum = endIndex - startIndex + 1;

                                for (var j = 0; j < menuItemsSum; j++) {
                                    pidCacheFromDev.items_arr.push(tool.toHex(endIndex--, 8));
                                }
                            }
                                break;

                            case "03":  //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
                            {
                                pidCacheFromDev.items_arr.push(varRecvData.substr(18, 8));
                                requestType = "03"; //代表需要解析组数据
                            }
                                break;
                        }
                    }
                        break;

                    case "04":  //带读值的菜单
                    {
                        var readValueBindOnsupid = false;   //第一,第二种supid解析模式可以对读值进行绑定,将此变量设置为flag,由于第三种要去服务器解组数据,所以暂时忽略
                        menuType04 = varRecvData.substr(14, 2);
                        var menuItemsSum04 = tool.hex2dec(varRecvData.substr(16, 2));
                        var stepCount04 = 18; //由于读值信息最后处理，所以需要截取出来，此变量就是用于计算后续的指令长度,初始值为18,每截取一段指令,就加上相应的位数

                        switch (menuType04) {   //计算出读值菜单的菜单提示文本；

                            case "01":  //当菜单类型为01时，第二字节代表菜单条目数，后每8字节代表一个supid；
                            {
                                readValueBindOnsupid = true;
                                for (var k = 0; k < menuItemsSum04; k++) {
                                    pidCacheFromDev.items_arr.push(varRecvData.substr(18 + k * 8, 8));
                                }
                                stepCount04 += menuItemsSum04 * 8;
                            }
                                break;

                            case "02":  //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
                            {
                                readValueBindOnsupid = true;
                                var startsupid04 = tool.hex2dec(varRecvData.substr(18, 8));
                                var endsupid04 = tool.hex2dec(varRecvData.substr(26, 8));
                                menuItemsSum04 = endsupid04 - startsupid04 + 1;

                                for (var l = 0; l < menuItemsSum04; l++)    //补全supid，扔到pidCacheFromDev.items_arr数组里
                                    pidCacheFromDev.items_arr.push(tool.toHex(endsupid04--, 8));

                                stepCount04 += 2 * 8;
                            }
                                break;

                            case "03":  //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
                            {
                                pidCacheFromDev.items_arr.push(varRecvData.substr(18, 8));
                                requestType = "03";
                                stepCount04 += 8;
                            }
                                break;
                        }

                        /****************************************************************
                         *  指令的样例格式：7109500104001901030011010100110102001101033130300032303000330000
                         *  计算菜单内每条选项的值，全部为asc字符串，以00为一个读值的结束符；
                         *  去掉最后四位的“0000”，可以让split()方法正确分割成非空数组
                         ****************************************************************/
                        var lastCmdStrArea_str =
                            varRecvData.substring(stepCount04, varRecvData.length - 4) || '';

                        var temp_str = tool.addSplitMarkInStringEachStep(lastCmdStrArea_str, ',', 2);   //每两个字串添加一个逗号，防止在分割“00”的时候遇到“3000”这样的情况

                        menuItemsValue_arr = temp_str.split("00");  //把已经做好处理的字串以“00”为基准，分割成数组

                        var arrLen = menuItemsValue_arr.length; //把长度预存起来,防止对数组操作的时候造成死循环

                        for (var m = 0; m < arrLen; m++) {

                            var eachDigit_str = "";
                            var tempArrItem = menuItemsValue_arr[0].split(",").join("");    //把逗号去掉之后再拼成字串

                            for (var step = 0; step < tempArrItem.length;) {
                                var tempAsc = tool.hex2dec(tempArrItem.substr(step, 2));    //每次提取两位字符，转成10进制
                                eachDigit_str += String.fromCharCode(tempAsc);  //再把asc码解出来
                                step += 2;
                            }

                            menuItemsValue_arr.shift(); //循环完毕之后删除第一项
                            menuItemsValue_arr.push(eachDigit_str); //把计算出来的10进制字符串Push到数组最后一位;
                        }

                        //todo menuItemsValue_arr获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定
                        if (!!readValueBindOnsupid) {
                            bindsupidWithValueForMenuType04_obj =
                                tool.contact2ArrToObj(pidCacheFromDev.items_arr, menuItemsValue_arr);
                        }
                    }
                        break;

                    case "05":  //设备请求上传,下载文件
                    {
                        handleFiles(varRecvData);
                        return;
                    }
                        break;

                    case "06":  //构造带读值带按钮菜单
                    {

                        var btnAmount = varRecvData.substr(14, 2);
                        var stepCount06 = 16;
                        for (var p = 0; p < btnAmount; p++) {
                            pidCacheFromDev.buttons_arr =
                                tool.cutStringByStep(   //分割指定的数据，输出为一个数组；
                                    varRecvData,    //原始数据
                                    btnAmount,    //分割的数量
                                    16, //起始位置
                                    8); //步进数值
                            stepCount06 += 8;
                        }

                        menuType04 = varRecvData.substr(stepCount06, 2);
                        stepCount06 += 2;
                        var menuItemsSum06 = tool.hex2dec(varRecvData.substr(stepCount06, 2));
                        stepCount06 += 2;
                        switch (menuType04) {   //计算出读值菜单的菜单提示文本；

                            case "01":  //当菜单类型为01时，第二字节代表菜单条目数，后每8字节代表一个supid；
                            {
                                readValueBindOnsupid = true;
                                for (var k = 0; k < menuItemsSum06; k++) {
                                    pidCacheFromDev.items_arr.push(varRecvData.substr(stepCount06, 8));
                                    stepCount06 += 8;
                                }
                            }
                                break;

                            case "02":  //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
                            {
                                readValueBindOnsupid = true;
                                var startsupid06 = tool.hex2dec(varRecvData.substr(stepCount06, 8));
                                stepCount06 += 8;
                                var endsupid06 = tool.hex2dec(varRecvData.substr(stepCount06, 8));
                                stepCount06 += 8;
                                menuItemsSum06 = endsupid06 - startsupid06 + 1;

                                for (var l = 0; l < menuItemsSum06; l++)    //补全supid，扔到pidCacheFromDev.items_arr数组里
                                    pidCacheFromDev.items_arr.push(tool.toHex(endsupid06--, 8));
                            }
                                break;

                            case "03":  //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
                            {
                                pidCacheFromDev.items_arr.push(varRecvData.substr(stepCount06, 8));
                                requestType = "03";
                                stepCount06 += 8;
                            }
                                break;
                        }

                        /****************************************************************
                         *  指令的样例格式：7109500104001901030011010100110102001101033130300032303000330000
                         *  计算菜单内每条选项的值，全部为asc字符串，以00为一个读值的结束符；
                         *  去掉最后四位的“0000”，可以让split()方法正确分割成非空数组
                         ****************************************************************/
                        var lastCmdStrArea_str06 =
                            varRecvData.substring(stepCount06, varRecvData.length - 2) || '';

                        var temp_str06 = tool.addSplitMarkInStringEachStep(lastCmdStrArea_str06, ',', 2);   //每两个字串添加一个逗号，防止在分割“00”的时候遇到“3000”这样的情况

                        menuItemsValue_arr = temp_str06.split("00");  //把已经做好处理的字串以“00”为基准，分割成数组

                        var arrLen06 = menuItemsValue_arr.length; //把长度预存起来,防止对数组操作的时候造成死循环

                        for (var m = 0; m < arrLen06; m++) {

                            var eachDigit_str06 = "";
                            var tempArrItem06 = menuItemsValue_arr[0].split(",").join("");  //把逗号去掉之后再拼成字串

                            for (var step06 = 0; step06 < tempArrItem06.length;) {
                                var tempAsc06 = tool.hex2dec(tempArrItem06.substr(step06, 2));    //每次提取两位字符，转成10进制
                                eachDigit_str06 += String.fromCharCode(tempAsc06);  //再把asc码解出来
                                step06 += 2;
                            }

                            menuItemsValue_arr.shift(); //循环完毕之后删除第一项
                            menuItemsValue_arr.push(eachDigit_str06);   //把计算出来的10进制字符串Push到数组最后一位;
                        }

                        //todo menuItemsValue_arr获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定
                        if (!!readValueBindOnsupid) {
                            bindsupidWithValueForMenuType04_obj =
                                tool.contact2ArrToObj(pidCacheFromDev.items_arr, menuItemsValue_arr);
                        }

                    }
                        break;
                    case "07":  //构造带读值带radio带按钮菜单
                    {
                        var stepCount07 = 14;
                        pidCacheFromDev.contents_arr.push(varRecvData.substr(stepCount07, 8));
                        stepCount07 += 8;
                        var btnAmount07 = varRecvData.substr(stepCount07, 2);
                        stepCount07 += 2;

                        for (var p = 0; p < btnAmount07; p++) {
                            pidCacheFromDev.buttons_arr =
                                tool.cutStringByStep(   //分割指定的数据，输出为一个数组；
                                    varRecvData,    //原始数据
                                    btnAmount07,    //分割的数量
                                    24, //起始位置
                                    8); //步进数值

                            //pidCacheFromDev.buttons_arr.push(varRecvData.substr(stepCount07, 8));
                            stepCount07 += 8;
                        }

                        menuType04 = varRecvData.substr(stepCount07, 2);
                        stepCount07 += 2;
                        var menuItemsSum07 = tool.hex2dec(varRecvData.substr(stepCount07, 2));
                        stepCount07 += 2;
                        switch (menuType04) {   //计算出读值菜单的菜单提示文本；

                            case "01":  //当菜单类型为01时，第二字节代表菜单条目数，后每4字节代表一个supid,后1字节代表选项状态（00：选项可选，01，选项不可选）；
                            {
                                readValueBindOnsupid = true;
                                for (var k = 0; k < menuItemsSum07; k++) {
                                    var supid = varRecvData.substr(stepCount07, 8);
                                    stepCount07 += 8;
                                    var state = varRecvData.substr(stepCount07, 2);
                                    stepCount07 += 2;
                                    pidCacheFromDev.radios_arr.push(supid);
                                    gSupidWithDisableState[supid] = state;
                                }
                            }
                                break;

                            case "02":  //当菜单类型为02时，前4字节代表菜单条目的起始，后4字节代表菜单条目的结束索引
                            {
                                readValueBindOnsupid = true;
                                var startsupid07 = tool.hex2dec(varRecvData.substr(stepCount07, 8));
                                stepCount06 += 8;
                                var endsupid07 = tool.hex2dec(varRecvData.substr(stepCount07, 8));
                                stepCount07 += 8;
                                menuItemsSum07 = endsupid07 - startsupid07 + 1;

                                for (var l = 0; l < menuItemsSum07; l++)    //补全supid，扔到pidCacheFromDev.items_arr数组里
                                    pidCacheFromDev.items_arr.push(tool.toHex(endsupid07--, 8));

                            }
                                break;

                            case "03":  //当菜单类型为03时，4字节代表分组号，如00000001代表取GROUP字段为 00000001 的所有分组显示出来。
                            {
                                pidCacheFromDev.items_arr.push(varRecvData.substr(stepCount07, 8));
                                requestType = "03";
                                stepCount07 += 8;
                            }
                                break;
                        }

                        /****************************************************************
                         *  指令的样例格式：7109500104001901030011010100110102001101033130300032303000330000
                         *  计算菜单内每条选项的值，全部为asc字符串，以00为一个读值的结束符；
                         *  去掉最后四位的“0000”，可以让split()方法正确分割成非空数组
                         ****************************************************************/
                        var lastCmdStrArea_str07 =
                            varRecvData.substring(stepCount07, varRecvData.length - 2) || '';

                        var temp_str07 = tool.addSplitMarkInStringEachStep(lastCmdStrArea_str07, ',', 2);   //每两个字串添加一个逗号，防止在分割“00”的时候遇到“3000”这样的情况

                        menuItemsValue_arr = temp_str07.split("00");  //把已经做好处理的字串以“00”为基准，分割成数组

                        var arrLen07 = menuItemsValue_arr.length; //把长度预存起来,防止对数组操作的时候造成死循环

                        for (var m = 0; m < arrLen07; m++) {

                            var eachDigit_str07 = "";
                            var tempArrItem07 = menuItemsValue_arr[0].split(",").join("");  //把逗号去掉之后再拼成字串

                            for (var step07 = 0; step07 < tempArrItem07.length;) {
                                var tempAsc07 = tool.hex2dec(tempArrItem07.substr(step07, 2));    //每次提取两位字符，转成10进制
                                eachDigit_str07 += String.fromCharCode(tempAsc07);  //再把asc码解出来
                                step07 += 2;
                            }

                            menuItemsValue_arr.shift(); //循环完毕之后删除第一项
                            menuItemsValue_arr.push(eachDigit_str07);   //把计算出来的10进制字符串Push到数组最后一位;
                        }

                        //07形态的数据，可能出现items和radios两种类型都有读值信息，所以在这里把两个数组的supid进行合并
                        var hybridItems = pidCacheFromDev.items_arr.concat(pidCacheFromDev.radios_arr);

                        //todo menuItemsValue_arr获取到所有的值之后，转换成数字，然后跟前面的supid配对绑定
                        //配对方式只是根据数组的下标，从做到右一次配对
                        if (!!readValueBindOnsupid) {
                            bindsupidWithValueForMenuType04_obj =
                                tool.contact2ArrToObj(hybridItems, menuItemsValue_arr);
                        }
                    }
                        break;
                    default :   //如果是未知弹框类型，就退到主界面
                        tool.alert("未知响应类型！", function () {
                            global.disconnectOBD();
                        });
                        return;
                        break;
                }
                var supids = [];
                var temObjFromClone = angular.extend({}, pidCacheFromDev);

                temObjFromClone.contents_arr.forEach(function (item) {
                    supids.push(item);
                });

                //把temObjFromClone.buttons_arr里面每个value的值取出来，重新拼成数组；
                var temps_arr = [];
                temObjFromClone.buttons_arr.forEach(function (item) {
                    temps_arr.push(item.value);//弹出框类型是01或者02才会生成value值
                });

                temObjFromClone.radios_arr.forEach(function (item) {
                    temps_arr.push(item);
                });

                temObjFromClone.items_arr.forEach(function (item) {
                    temps_arr.push(item);
                });

                FunGetsupidDataFromServer(supids.concat(temps_arr));

            } catch (e) {
                tool.alert("程序执行失败，点击确定退出", function () {
                    console.log(e.message);
                    global.disconnectOBD();
                });
            }
        }

        function handleFiles(varRecvData) {
            //功能ID：
            //00: 回应PC
            //01: 对PC发送数据
            //02: 申请从手机拿文件数据下传
            //03: 申请从服务器拿文件数据下传
            //04: 申请数据文件上传到PC(收到这个后，在传输数据前要弹出让用户选择文件存储路径并可以重命名（默认名字由设备传上来）的对话框)
            //05: 申请数据文件上传到服务器
            //FF: 出错。7109600205000102
            var processType = varRecvData.substr(14, 2);
            switch (processType) {
                case "00":
                    //tool.alert("数据传输完成!", function () {
                    //    win.sendDataToDev("310960" + tool.toHex(stepCount++,2) + "01" +  "00");
                    //});
                    break;
                case "01":

                    break;
                case "02":
                    //sendFileToDevFromApp();
                    //从APP选择文件，由APP写入到DEV
                    //var type = $("#fileSelectType").html(); //请求选择文件时，需要手动绑定选择文件的类型，默认为SVT文件
                    //var lastBoxId = $("#lastBoxId").html(); //绑定上一个盒子的ID号，在这里从新获取，以便文件选择结束的时候返回
                    //var behavior = $("#fileBehavior").html();   //确定上传到服务器还是写入到DEV
                    //var procedureInfo = $("#procedureInfo").html();   //跳转到文件选择页面之前绑定的信息，发给APP使用

                    $("#fileSelectType").html("dev");
                    $("#lastBoxId").html("carType");
                    $("#fileBehavior").html("toDev");
                    $("#procedureInfo").html(
                        JSON.stringify({"fileName":"文件路径","businessId":parseInt(60,16),"processId":parseInt(stepCount,16)})
                    );
                    // {"fileName":"文件名","businessId":"当前的业务ID","processId":"流程号"}
                    win.appService.sendDataToApp(3029, JSON.stringify({"ope": 0}), win.serverRequestCallback.requestDir);
                    break;
                case "03":
                    //sendFileToDevFromServer();
                    //从服务器下载文件，由APP写入到DEV，直接由APP自己处理

                    break;
                case "04":
                    //sendFileToAppFromDev();
                    //DEV发送文件给APP，由APP自己处理
                    break;
                case "05":
                    //sendFileToServerFromDev();
                    //DEV把文件交给APP，APP再上传到服务器，由APP自己处理
                    break;
                case "FF":
                    tool.alert("数据解析出错!", function () {
                        win.sendDataToDev("310902");
                    });
                    break;
            }
        }

        /****************************************************************
         * 从服务器获取supid匹配的内容
         * @param supids
         ****************************************************************/
        function FunGetsupidDataFromServer(supids) {

            var dataPack = {
                dbfilename: global.businessInfo.dbFilename,
                pub: global.businessInfo.pubFilename,
                requestDataType: requestType,
                //carType: global.businessInfo.carType,
                type: 2,     //1代表C类型2代表F类型
                supids: supids
            };

            win.server.request(
                1011,
                {
                    "key": "ANTISTEEL_SUPID",
                    "cartype": global.businessInfo.carType
                },
                dataPack,
                win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.bindingATViewFromServer, [supids]),
                    [FunGetsupidDataFromServer, global.disconnectOBD])
            );

            dataPack.supids.length = 0;
        }

        win.serverRequestCallback.bindingATViewFromServer = function (responseObject, params) {
            tool.loading(0);
            try {
                if (!responseObject.items.length) {
                    tool.alert('服务器无任何数据',
                        function () {
                            global.disconnectOBD();
                        }
                    );
                    return;
                }

                //todo 由于存在读秒框体，需要马上计算发送 指令给设备，所以在不能发送之后 马上重置数据
                $scope.contents_arr.length = 0; //webview内容文本数据
                $scope.buttons_arr.length = 0;  //webview按钮文本数据
                $scope.radios_arr.length = 0;  //webview按钮文本数据
                $scope.items_arr.length = 0;  //webview按钮文本数据
                tool.popShow("bombTipBox", 0);
                tool.popShow("bombMenuBox", 0);
                tool.popShow("spMenuBox", 0);

                //var theDataModel = tool.objToArr (responseObject.items, "supid", "name");
                var theDataModel = responseObject.items;
                switch ($scope.BombBoxType) {
                    case "01":  //构造提示框内容或输入框内容
                    case "02":
                    {
                        //1,获取源格式
                        //{
                        //    "requestDataType": "01/02/03",
                        //    "supids": {
                        //    "00000001": "点击确认或者取消",
                        //    "00000002": "确定"
                        //     }
                        //}

                        //2,转成model需要的格式
                        //[
                        // {name:"点击确认或者取消",supid:"00000001"},
                        // {name:"确定",supid:"0001"},
                        // {name:"取消",supid:"0002"}
                        // ]

                        //3,匹配supid,决定是按钮还是正文文本,下面是supid数据格式
                        //    var pidCacheFromDev = {
                        //        contents_arr:[],
                        //        buttons_arr:[]
                        //    };

                        //最后再组成webView格式:
                        //$scope.tipsDataList_obj = {
                        //    contents_arr: [],
                        //    buttons_arr: []
                        //};
                        var i;
                        for (i = 0; i < theDataModel.length; i++) {
                            var j = pidCacheFromDev.contents_arr.length;
                            while (j--) {
                                if (theDataModel[i].supid === pidCacheFromDev.contents_arr[j]) {
                                    $scope.contents_arr.push(theDataModel[i]);
                                }
                                else {
                                    //比对supid之后才决定buttons_arr数组的index
                                    pidCacheFromDev.buttons_arr.forEach(function (item) {
                                        if (theDataModel[i].supid === item.value)
                                            $scope.buttons_arr[item.index] = theDataModel[i];
                                    });
                                }
                            }
                        }

                        //由于ng-bind和ng-bind-html无法解决 【\r\n】转义符换行问题，所以使用ng-repeat代替
                        // 以 “\N” 换行符作为 基准，把文本转换成数组，逐一绑定给 <p> 标签， 以达到换行的目的
                        if ($scope.contents_arr.length) {
                            var temp = $scope.contents_arr[0]['name'];
                            if (/\\r\\n/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\r\\n/ig, "\\n");
                            if (/\\n\\r/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\n\\r/ig, "\\n");
                            if (/\\r/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\r/ig, "\\n");

                            $scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].split("\\n");
                        }
                        tool.popShow("bombTipBox", 1);

                        /****************************************************************
                         * 如果没有按钮，就说明是一个倒计时提示框，直接请求下一个提示框,按钮值为00
                         * sendData 属性列表 : buttonIndex :提示框按钮和输入框按钮
                         *                    inputValue :输入框的值
                         *                    menuItemLen :菜单的选项的总长度
                         *                    menuItemCheckedIndex :菜单的选项的下标
                         ****************************************************************/
                        if (!$scope.buttons_arr.length) {
                            win.devInterActive.Fun31096x({
                                menuItemCheckedIndex: "",
                                menuItemLen: "",
                                radioCheckedIndex: "",
                                inputValue: "",
                                buttonIndex: "00"
                            });
                        }
                    }
                        break;
                    case "03":  //构造菜单内容
                    {
                        $scope.contents_arr = theDataModel;
                        $scope.buttons_arr.push({name: "退出"});
                        tool.popShow("bombMenuBox", 1);
                    }
                        break;
                    case "04":  //构造读值菜单内容
                    {

                        /****************************************************************
                         *  解成{supid:"00000001",menuItemsValue:"文本内容"}的形式,
                         *  再和响应的数据 {supid:"00000001",name:"文本内容"} 进行比对,
                         *  最后生成 {supid:"00000001",name:"文本内容",menuItemsValue:"文本内容"} 的数据形式
                         ****************************************************************/
                        var theDataModelLen = theDataModel.length;
                        if (menuType04 !== "03") {  // 如果不是组数据,就根据绑定的supid,
                            var tempArr = tool.objToArr(bindsupidWithValueForMenuType04_obj, "supid", "menuItemsValue");

                            for (var k = 0; k < theDataModelLen; k++) {
                                var tempArrLen = tempArr.length;
                                for (var kk = 0; kk < tempArrLen; kk++) {
                                    if (theDataModel[k].supid === tempArr[kk].supid) {
                                        theDataModel[k].menuItemsValue = tempArr[kk].menuItemsValue;
                                        tempArr.splice(kk, 1);  //比对完毕，就删除当前下标的值
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            /****************************************************************
                             *  如果是组数据,就把截取的所有读值依次填入相应的项,
                             *  如果 读值的数量>项的数量, 就忽略后面的读值;
                             *  如果 项的数量>读值的数量, 就全部填入0;
                             ****************************************************************/
                            for (k = 0; k < theDataModelLen; k++) {
                                theDataModel[k].menuItemsValue =
                                    !!menuItemsValue_arr[k] ? menuItemsValue_arr[k] : 0;
                            }
                        }

                        $scope.items_arr = theDataModel;
                        $scope.buttons_arr[0] = ({name: "退出"});

                        tool.popShow("bombMenuBox", 1);

                    }
                        break;

                    case "06":  //构造带读值带按钮菜单
                    case "07":  //构造带读值带radio带按钮菜单
                    {

                        var theDataModelLen07 = theDataModel.length;
                        if (menuType04 !== "03") {  // 如果不是组数据,就根据绑定的supid,
                            var tempArr07 = tool.objToArr(bindsupidWithValueForMenuType04_obj, "supid", "menuItemsValue");
                            for (var k = 0; k < theDataModelLen07; k++) {
                                var tempArrLen07 = tempArr07.length;
                                for (var kk = 0; kk < tempArrLen07; kk++) {
                                    if (theDataModel[k].supid === tempArr07[kk].supid) {
                                        theDataModel[k].menuItemsValue = tempArr07[kk].menuItemsValue;
                                        tempArr07.splice(kk, 1);  //比对完毕，就删除当前下标的值
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            /****************************************************************
                             *  如果是组数据,就把截取的所有读值依次填入相应的项,
                             *  如果 读值的数量>项的数量, 就忽略后面的读值;
                             *  如果 项的数量>读值的数量, 就全部填入0;
                             ****************************************************************/
                            for (k = 0; k < theDataModelLen07; k++) {
                                theDataModel[k].menuItemsValue =
                                    !!menuItemsValue_arr[k] ? menuItemsValue_arr[k] : 0;
                            }
                        }

                        //绑定input-radio的disble状态；
                        if(pidCacheFromDev.radios_arr.length){
                            var tempArr07 = tool.objToArr(gSupidWithDisableState, "supid", "disabled");
                            for (var k = 0; k < theDataModelLen07; k++) {
                                var tempArrLen07 = tempArr07.length;
                                for (var kk = 0; kk < tempArrLen07; kk++) {
                                    if (theDataModel[k].supid === tempArr07[kk].supid) {
                                        theDataModel[k].disabled = tempArr07[kk].disabled;
                                        tempArr07.splice(kk, 1);  //比对完毕，就删除当前下标的值
                                        break;
                                    }
                                }
                            }
                        }

                        pidCacheFromDev.contents_arr.forEach(function (item, index) {
                            theDataModel.forEach(function (_item, _index) {
                                if (_item.supid === item) {
                                    $scope.contents_arr.push(_item);
                                    theDataModel.splice(_index, 1);
                                }
                            });
                        });

                        pidCacheFromDev.radios_arr.forEach(function (item, index) {
                            theDataModel.forEach(function (_item, _index) {
                                if (_item.supid === item) {
                                    $scope.radios_arr.push(_item);
                                    theDataModel.splice(_index, 1);
                                }
                            });
                        });

                        //button的拥有特殊键：index,value; index存储的是发送给设备用的
                        pidCacheFromDev.buttons_arr.forEach(function (item, index) {
                            theDataModel.forEach(function (_item, _index) {
                                if (_item.supid === item.value) {
                                    $scope.buttons_arr.push(_item);
                                    theDataModel.splice(_index, 1);
                                }
                            });
                        });

                        // 剩下的都是items数据
                        // items的拥有特殊键：menuItemsValue，就是设备发送上来选项值
                        theDataModel.forEach(function (_item, _index) {
                            $scope.items_arr.push(_item);
                        });

                        //由于ng-bind和ng-bind-html无法解决 【\r\n】转义符换行问题，所以使用ng-repeat代替
                        // 以 “\N” 换行符作为 基准，把文本转换成数组，逐一绑定给 <p> 标签， 以达到换行的目的
                        if ($scope.contents_arr.length) {
                            var temp = $scope.contents_arr[0]['name'];
                            if (/\\r\\n/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\r\\n/ig, "\\n");
                            if (/\\n\\r/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\n\\r/ig, "\\n");
                            if (/\\r/ig.test(temp))$scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].replace(/\\r/ig, "\\n");

                            $scope.contents_arr[0]['name'] = $scope.contents_arr[0]['name'].split("\\n");
                        }
                        tool.popShow("spMenuBox", 1);
                    }
                        break;
                    case "05":  //处理文件请求
                        break;
                    default :
                        tool.alert("未知的响应类型！", function () {
                            global.disconnectOBD();
                        });
                        break;
                }
                safeApply(function () {
                });
            } catch (e) {
                console.log(e);
                tool.alert('服务器数据解析出错，业务无法继续！',
                    function () {
                        global.disconnectOBD();
                    }
                );
            }
        };

        $scope.handleBombTipBoxClick = function (buttons_arr, index, boxID) {
            var input_el = $("#" + boxID);
            var inputValue = input_el.val() || "";

            //如果是输入框类型的弹框，并且点击的按钮是确定项,强制用户进行设置
            if (!/(取消)|(返回)|(退出)/g.test(buttons_arr[index - 1].name) && $scope.BombBoxType == 2 && inputValue === "") {
                tool.warnTip("#" + boxID,"请设置数值");
                return;
            }
            input_el.val("");
            win.RMTClickEvent.handleATBombTipBoxClick(buttons_arr, index, inputValue);
        };

        win.RMTClickEvent.handleATBombTipBoxClick = function (buttons_arr, index, inputValue) {

            var buttonIndex = "0" + index;

            tool.loading({text: "等待设备响应..."});  //一般情况是在发送指令给设备之后再启用加载遮罩，
            //现在的情况是：当设备出现倒计时弹框时，需要马上发送指令给设备，弹框需要停留一定的时间给用户阅读文本
            //所以，按正常流程，点击之后马上加载遮罩
            //而且，为了防止设备数据返回过快，未弹出遮罩，数据已经返回，造成数据发送成功，遮罩依然存在的BUG

            win.devInterActive.Fun31096x({
                menuItemCheckedIndex: "",
                menuItemLen: "",
                radioCheckedIndex: "",
                inputValue: inputValue,
                buttonIndex: buttonIndex
            });

            tool.popShow("bombTipBox", 0);  //点击之后，隐藏盒子，并重置输入框的提示文本和输入值
        };

        $scope.handleMenuItemClick = function (items_arr, index) {
            win.RMTClickEvent.handleATMenuItemClick(items_arr, index);
        };

        win.RMTClickEvent.handleATMenuItemClick = function (items_arr, index) {
            var menuItemLen = tool.toHex(items_arr.length, 2);
            var menuItemCheckedIndex =
                index === "00" ? "00" : "0" + index;

            win.devInterActive.Fun31096x({
                menuItemCheckedIndex: menuItemCheckedIndex,
                menuItemLen: menuItemLen,
                radioCheckedIndex: "",
                inputValue: "",
                buttonIndex: ""
            });

            tool.loading({text: "等待设备响应..."});  //一般情况是在发送指令给设备之后再启用加载遮罩，
            //现在的情况是：当设备出现倒计时弹框时，需要马上发送指令给设备，弹框需要停留一定的时间给用户阅读文本
            //所以，按正常流程，点击之后马上加载遮罩
            //而且，为了防止设备数据返回过快，未弹出遮罩，数据已经返回，造成数据发送成功，遮罩依然存在的BUG

            tool.popShow("bombMenuBox", 0);
        };

        $scope.handleMenuItemClick_sp = function (buttons_arr, index) {

            //先判断radio选择情况，再发送执行远程函数
            var radioCheckedIndex = (function () {
                var result = "";
                $("input[name='radio_ant']").each(function (index, el) {
                        if (el.checked) {
                            result = index;
                        }
                    }
                );
                return result === "" ? result : tool.toHex(result + 1, 2);
            })();

            if(!/(取消)|(返回)|(退出)/g.test(buttons_arr[index - 1].name) && $scope.radios_arr.length && radioCheckedIndex === ""){
                tool.warnTip("input[name='radio_ant']","请选择一个选项");
                return;
            }

            win.RMTClickEvent.handleATMenuItemClick_sp(buttons_arr, index, radioCheckedIndex);

        };

        win.RMTClickEvent.handleATMenuItemClick_sp = function (buttons_arr, index, radioCheckedIndex) {

            var buttonIndex = "0" + index;
            var menuItemLen = tool.toHex($scope.items_arr.length + $scope.radios_arr.length, 2);

            tool.loading({text: "等待设备响应..."});  //一般情况是在发送指令给设备之后再启用加载遮罩，
            //现在的情况是：当设备出现倒计时弹框时，需要马上发送指令给设备，弹框需要停留一定的时间给用户阅读文本
            //所以，按正常流程，点击之后马上加载遮罩
            //而且，为了防止设备数据返回过快，未弹出遮罩，数据已经返回，造成数据发送成功，遮罩依然存在的BUG

            win.devInterActive.Fun31096x({
                menuItemCheckedIndex: "",
                menuItemLen: menuItemLen,
                radioCheckedIndex: radioCheckedIndex,
                inputValue: "",
                buttonIndex: buttonIndex
            });

            tool.popShow("spMenuBox", 0);  //点击之后，隐藏盒子，并重置输入框的提示文本和输入值
        };
        /****************************************************************
         *sendData 属性列表 : buttonIndex :提示框按钮和输入框按钮
         *                   inputValue :输入框的值
         *                   menuItemLen :菜单的选项的总长度
         *                   menuItemCheckedIndex :菜单的选项的下标
         ****************************************************************/
        win.devInterActive.Fun31096x = function (sendData) {

            var buttonWitchWasCheckedIndex_hex = sendData.buttonIndex;  //如果没有按钮就填入00

            var inputValue2Asc_asc = tool.toAsc(sendData.inputValue, 16);   //转成16进制asc码,以00结尾;

            var menuItemLen_hex = sendData.menuItemLen; //sendData.menuItemLen;菜单界面菜单显示的总条目数

            var menuItemCheckedIndexIndex_hex =  //sendData.menuItemCheckedIndex;菜单界面返回的用户选择，
                sendData.menuItemCheckedIndex;   // 如02代表用户选择了菜单内的第2个选择，选项从1开始，00代表用户选择了退出菜单。
            var radioCheckedIndex = sendData.radioCheckedIndex;
            var cmdCodeLen_int =    //以上指令构造完成之后再计算指令的最后长度
                (buttonWitchWasCheckedIndex_hex +
                inputValue2Asc_asc +
                (($scope.BombBoxType == "06") ? "" : menuItemLen_hex) +
                (($scope.BombBoxType == "06") ? "" : menuItemCheckedIndexIndex_hex) +
                (($scope.BombBoxType == "06") ? "" : radioCheckedIndex) + "").length;

            /****************************************************************
             *    31 09 51  [A]  [B]  [C]  [D]    【A】--流程号；
             *                                    【B】--后缀指令长度；
             *                                    【C】--“菜单”-前一字节代表上一个菜单界面菜单显示的【总选项数】，后一个字节代表用户选择的【选项下标】;
             *    “输入框，提示框”-用户点击的按钮下标
             *                                    【D】--“输入框”-用户输入的值的asc码，“菜单，提示框”-无
             ****************************************************************/
            var finalCmd =
                "310960" +
                tool.toHex(stepCount, 2) +    //流程号
                tool.toHex(cmdCodeLen_int / 2, 2) + //后缀指令长度
                buttonWitchWasCheckedIndex_hex +    //选择的按钮下标
                (inputValue2Asc_asc ? inputValue2Asc_asc + "00" : "") + //输入值,如果有输入值,则在后面加上"00",不算进指令长度
                (($scope.BombBoxType == "06") ? "" : menuItemLen_hex) +   //菜单选项的数量
                (($scope.BombBoxType == "06") ? "" : menuItemCheckedIndexIndex_hex) +   //菜单选项被点击的下标
                (($scope.BombBoxType == "06") ? "" : radioCheckedIndex);

            win.sendDataToDev(finalCmd);
        };

    }]).config(function () {

    });
})();
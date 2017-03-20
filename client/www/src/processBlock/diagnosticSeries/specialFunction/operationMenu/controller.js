/**
 * Created by Andy on 2015/8/28.
 */
(function () {

    var showView = false;
    var win = window;

    win.App.controller('operateMenuCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
        var safeApply = angularFactory.getScope($scope).safeApply;

        $scope.hasService = false;
        $scope.serviceList = [];
        var is62Supported = false;

        /**
         * 从设备获取支持的服务列表项，
         * @param address 通信地址
         * @param prevFormId 上一个表单的类型
         */
        win.moduleEntry.operationList = function (address, prevFormId) {
            showView = true;
            win.devService.sendDataToDev("310901" + address);
            win.tool.loading({pos: "body", text: "正在获取服务列表..."});
        };

        /**
         * 显示服务菜单选项，入口
         */
        win.moduleEntry.showServiceMenu = function () {
            //tool.processBar("");
            //延时执行 解决因 键盘弹出时 直接退到 服务列表界面；导致无法居中的问题
            setTimeout(function(){
                bindBottomBtn();
                tool.layout('ShowOperate', 1);
            },50);

            document.getElementById("Title").innerText = "特殊功能列表";
        };

        function bindBottomBtn(){
            tool.bottomBtn({
                btn1Text: '返回',
                btn1Callback: function () {
                    global.disconnectOBD();
                }
            })
        }


        //连接ECU  DEV应答：0x7109+0x01（成功）/0x11(失败)+数据表文件名称(4B)+支持的服务代号(30 B)
        win.devService.Fun710901 = function (varRecvData) {

            //如果在服务器的car.xml里面读取到的dbfilename的值为0或者空，就需要在 710901 里面从新读取，否则就直接使用car.xml的dbfilename
            if (global.businessInfo.dbFilenamePrev == '0' || global.businessInfo.dbFilenamePrev.trim() == '') {
                var byte46 = varRecvData.substr(78, 2);
                var fileName,path;

                //46位的值为00时，只要获取path路路径给服务器就行
                if (byte46 == '00') {
                    path = varRecvData.substr(6, 4 * 2);
                    win.global.businessInfo.dbFilename = path;
                }

                //如果46位的值不为00，需要获取path路径和文件名给服务器
                else {
                    path = varRecvData.substr(6, 4 * 2);
                    fileName = tool.hex2a(varRecvData.substr(78));
                    win.global.businessInfo.dbFilename = path + "/" + fileName;
                }
            }else{
                win.global.businessInfo.dbFilename = global.businessInfo.dbFilenamePrev;
            }

            var DataPack = {
                "dbfilename":global.businessInfo.dbFilename,
                "pub":"PUB.txt",
                "carType":global.businessInfo.carType,
                "type":1,           //1代表C类型2代表F类型,C型获取服务列表，F型获取操作提示弹框
                "supids":[]
            };

            var supportServicesCMD = varRecvData.substr(14,64);
            var servicesTotal = supportServicesCMD.length/2;
            var step = 0;
            var singleService = "";
            while(servicesTotal--){
                singleService = supportServicesCMD.substr(step,2);
                if(singleService == "62"){
                    //win.global.businessInfo.specialType = singleService;
                    is62Supported = true;
                    break;
                }
                step +=2;
            }
            //DataPack.supids = singleService == "62" ? (global.special_pid ? [global.special_pid] : []) : [];    //如果62被支持,就上传pid,如果不支持，就不上传

            PIDsRequest(DataPack);
        };


        /**
         * 从服务器获取服务列表
         * @param dataPack
         */
         function PIDsRequest(dataPack) {
            win.server.request(
                "601",
                0,
                dataPack,
                win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.specialPIDs,[dataPack]),
                [PIDsRequest,global.disconnectOBD])
            );
        }

        win.serverRequestCallback.specialPIDs = function(responseObject, params){
            if (!showView) return;
            win.tool.loading(0);
            if(!responseObject.items.length){
                tool.alert('服务器无任何数据',
                           function () {
                               //tool.processBar("");
                               global.disconnectOBD();
                           }
                );
                return;
            }
                //如果支持62指令，就把返回的所有supid拼接，发送给设备，再根据返回的710962返回的supid，匹配对应的服务项展示在页面上；
                if(is62Supported){
                    var supidstr =
                        (function () {
                            var result = "";
                            responseObject.items.forEach (function (item) {
                                result += item.supid;
                            });
                            return result;
                        }) ();
                    win.devService.sendDataToDev("310962" + tool.toHex(responseObject.items.length, 2) + supidstr + "00");
                }else{
                    //如果不支持62，就直接列出所有返回的服务项
                    //特殊功能服务列表文本会出现\\n换行符，需要转切成数组形式，通过ng-repeat绑定
                    $scope.serviceList = responseObject.items;
                    var i = $scope.serviceList.length;
                    while(i--) $scope.serviceList[i].name = $scope.serviceList[i].name.split("\\n");
                    safeApply(function(){});
                    win.moduleEntry.showServiceMenu();
                }
        };


        $scope.menuJump = function(pid){
            win.RMTClickEvent.menuJump(pid);
        };

        win.RMTClickEvent.menuJump = function(pid){
            tool.layout("ShowOperate",0);
            win.moduleEntry.specialProcess(pid);
        };

        //获取服务列表的支持情况
        win.devService.Fun710962 = function (varRecvData) {
            var pidLen = tool.hex2dec(varRecvData.substr(6,2));
            var pidstack = varRecvData.substr(8);
            var i = 0;
            var supids = (function(){
                var result = [];
                while(pidLen--){
                    result.push(pidstack.substr(i++ * 8,8));
                }
                return result;
            })();

            var DataPack = {
                "dbfilename":win.global.businessInfo.dbFilename,
                "pub":"PUB.txt",
                "carType":win.global.businessInfo.carType,
                "type":1,           //1代表C类型2代表F类型,C型获取服务列表，F型获取操作提示弹框
                "supids":supids
            };

            serviceListRequest(DataPack);
        };

        win.devService.Fun7109D2 = function (varRecvData) {
            //tool.processBar("设备数据读取失败");
            tool.alert("设备数据读取失败", function () {
                win.SendJsDataToDev("710902");
            })
        };

        function serviceListRequest(dataPack) {
            win.server.request(
                "601",
                0,
                dataPack,
                win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.specialServiceList,[dataPack]),
                [serviceListRequest,global.disconnectOBD])
            );
        }

        win.serverRequestCallback.specialServiceList = function(responseObject, params){
            if (!showView) return;
            win.tool.loading(0);
            if (!responseObject.items.length) {
                tool.alert('服务器无数据支持',
                           function () {
                               global.disconnectOBD();
                               //tool.processBar("");
                           }
                );
                return;
            }


                //特殊功能服务列表文本会出现\\n换行符，需要转切成数组形式，通过ng-repeat绑定
                $scope.serviceList = responseObject.items;
                var i = $scope.serviceList.length;
                while(i--) $scope.serviceList[i].name = $scope.serviceList[i].name.split("\\n");
                safeApply(function(){});
                win.moduleEntry.showServiceMenu();

        };


        win.devService.Fun710981 = function (varRecvData) {
            //tool.processBar("获取服务列表失败");

            tool.alert('CCDP设备尝试与车辆连接失败！<br>请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。',
                function () {
                    global.disconnectOBD();
                }
            );

        };

        //退到前一个菜单
        win.devService.Fun710902 = function () {
            tool.layout("ShowOperate", 0);
            win.tool.loading(0);
            setTimeout(function(){
                win.moduleEntry.carType(-1);
            },500);
        };

        win.devService.Fun710982 = function () {
            //断开连接异常，就直接强制退出业务；
            tool.alert("断开OBD系统失败，请直接重启设备",function(){
                win.appService.sendDataToApp(3999,"","");
            });
        };

        win.global.disconnectOBD = function() {
            win.tool.loading({text:"正在断开OBD系统..."});
            win.devService.sendDataToDev("310902");    //断开OBD连接
        }

    }]);

})();



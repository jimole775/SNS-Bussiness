/**
 * Created by Andy on 2015/8/28.
 */
(function () {

    var showView = false;
    var win = window;

    App.controller('operateJumpCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
        var safeApply = angularFactory.getScope($scope).safeApply;

        $scope.hasService = false;
        $scope.hasNotSerList = false;
        /**
         * 从设备获取支持的服务列表项，
         * @param address 通信地址
         * @param prevFormId 上个表单的ID
         */
        win.moduleEntry.operationList = function (address, prevFormId) {
            showView = true;
            win.devService.sendDataToDev("310901" + address);
            tool.loading({pos: "body", text: "与设备通信中..."});
        };

        //连接ECU  DEV应答：0x7109+0x01（成功）/0x11(失败)+数据表文件名称(4B)+支持的服务代号(30 B)
        win.devService.Fun710901 = function (varRecvData) {
            //varRecvData = 710901000000005000000000000000000000000000000000000000000000000000000000000000
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

            //保养业务流程入口；参数为保养类型指令
            //保养类型50:保养灯,51:节气阀,52:刹车片,53:胎压报警,通过App反馈
            win.moduleEntry.maintainProcess(varRecvData.substr(14,2));
        };


        //遍历数据，获取服务支持项，最后返回正则，以检测显示相应的按钮
        $scope.getServiceSupport = function (varRecvData) {
            var serviceCode = varRecvData.substr(14, 32 * 2);//支持的服务代号(32 B)
            var serviceCount = serviceCode.length / 2;//每个服务代号2位

            if (parseInt(serviceCode) === 0) {
                $scope.hasNotSerList = true;

            }
            var tmpCode = '';

            for (var sid = 0; sid < serviceCount; sid++) {
                tmpCode = serviceCode.substr(sid * 2, 2);

                if (tmpCode != '00') {
                    $scope.hasService = true;
                    tmpCode = "_0x" + ("" + tmpCode).toUpperCase();

                    if (YhSupportService[tmpCode]) {
                        YhSupportService[tmpCode].value = true;
                        var index = $scope.indexInOperationList[tmpCode];
                        if (index >= 0) {
                            $scope.operationList[index].show = true;
                        }
                    }
                }

                safeApply(function () {

                });
            }
        };

        win.devService.Fun710981 = function (varRecvData) {

            tool.alert('CCDP设备尝试与车辆连接失败！<br>请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。',
                function () {
                    global.disconnectOBD();
                }
            );

        };

        //退到前一个菜单
        win.devService.Fun710902 = function () {
            tool.layout("ShowOperate", 0);
            tool.loading(0);

            setTimeout(function(){
                win.moduleEntry.carType(-1);
            },500);
        };

        win.devService.Fun710982 = function ()
        {
            tool.alert("断开OBD系统失败，请直接重启设备",function() //断开连接异常，就直接强制退出业务；
            {
                win.appService.sendDataToApp(3999,"","");
            });
        };

        win.global.disconnectOBD = function()
        {
            tool.loading({text:"正在断开OBD系统..."});
            win.devService.sendDataToDev("310902");                        //断开OBD连接
        }

    }]);

})();
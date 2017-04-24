/**
 * 读取电脑版本信息
 * Created by mapsh on 2015/8/17.
 */
(function () {

    var win = window;
    var showView = false;
    App.controller('ReadComputerVersionInfoCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
        var safeApply = angularFactory.getScope($scope).safeApply;
        var gPIDs = [];
        $scope.curIndex = 0;
        $scope.versionInfos = [];

        //入口
        win.moduleEntry.funReadComputerVersionInfo = function () {
            showView = true;
            if (gDataPack.pids)gDataPack.pids.length = 0;
            if (gPIDs)gPIDs.length = 0;
            document.getElementById("Title").innerText = "电脑版本信息";
            bindingBottomBtn();
            tool.layout("showComputerVersionInfo", 1);
            tool.loading({pos: "body", text: '获取数据...'});
            FunReadComputerVersionInfoSurpport();
        };

        function bindingBottomBtn() {
            tool.bottomBtn({
                btn1Text: '返回',
                btn1Callback: function () { computerVerBack(); }
            })
        }

        function computerVerBack() {
            showView = false;
            safeApply(function () { $scope.versionInfos.length = 0; });
            tool.layout("showComputerVersionInfo", 0);
            win.moduleEntry.showOperationMenu();
        }

        function FunReadComputerVersionInfoSurpport() {

            //当 读取版本信息支持项 被支持时
            if (YhSupportService._0x03.value)
                win.devService.sendDataToDev("310903");
            else {
                var DataPack = {
                    dbfilename: global.businessInfo.dbFilename,
                    pub: global.businessInfo.pubFilename,
                    type: "1",
                    version: "2",
                    pids: []
                };

                getVersionInfoSurpports(DataPack);
            }
        }


        win.devService.Fun710903 = function (varRecvData) {
            var count = tool.hex2dec(varRecvData.substr(6, 4));

            if (count <= 0) {
                tool.alert('无任何支持项信息',
                    function () {
                    }
                );
                return;
            }

            safeApply(function () { $scope.versionInfos.length = 0; });

            var DataPack = {
                dbfilename: global.businessInfo.dbFilename,
                pub: global.businessInfo.pubFilename,
                type: "1",
                version: "2",
                pids: []
            };

            for (var i = 0; i < count; i++)
                DataPack.pids.push({
                    original: '',
                    pid: varRecvData.substr(10 + 8 * i, 8)
                });

            getVersionInfoSurpports(DataPack);

        };

        win.devService.Fun710983 = function (varRecvData) {
            tool.alert('设备数据读取失败',function () {
            });
        };

        function getVersionInfoSurpports(dataPack) {
            win.server.request(
                global.businessInfo.serverType, {
                key: "CALC_VER_SUPPORT",
                cartype: global.businessInfo.carType
            },
                dataPack,
                win.server.addRetryFn(win.server.addCallbackParam (win.serverRequestCallback.CALC_VER_SUPPORT,[dataPack]),
                [getVersionInfoSurpports,computerVerBack])
            );
        }

        win.serverRequestCallback.CALC_VER_SUPPORT = function (responseObject, params) {

            if (!showView)return;

            if(!responseObject.items.length){
                tool.alert('服务器无数据支持',
                           function () {
                               computerVerBack();
                           }
                );
                return;
            }

                var dataItems = responseObject.items || [];
                safeApply(function () {
                    _.forEach(dataItems, function (item) {
                        item.show = true;
                        gPIDs.push({
                            "pid": item.pid,
                            "index":item.index
                        })
                    });
                    $scope.versionInfos = dataItems;

                });

                FunReadComputerVersionInfoOriginalValue();
        };

        function FunReadComputerVersionInfoOriginalValue() {
            $scope.curIndex = 0;
            Fun310904();
        }

        function Fun310904() {
            if ($scope.curIndex > gPIDs.length - 1) return;
            win.devService.sendDataToDev('31090401' + gPIDs[$scope.curIndex].pid);
        }

        var gDataPack = {                                   //定义gDataPack全局变量，以解决定义在内部时，dbfilename和pub为空的问题
            dbfilename: '',
            pub: '',
            type: "1",
            version: "2",
            pids: []
        };
        /**
         * 使用指令 310904 +　系统ECU表　的　PID　字段　依次获取每条版本信息的 原始值，并将这些 原始值 依次发送到服务器计算　
         * */
        win.devService.Fun710904 = function (varRecvData) {
            gDataPack.dbfilename = global.businessInfo.dbFilename;
            gDataPack.pub = global.businessInfo.pubFilename;

            var index = $scope.curIndex ++;
            if (!$scope.versionInfos[index]) return;

            gDataPack.pids.push({
                "original": varRecvData.substr(10),
                "index":gPIDs[index].index
            });

            if (index === $scope.versionInfos.length - 1) {
                getVersionInfoValue(gDataPack);
                return;
            }

            Fun310904();
        };

        win.devService.Fun710984 = function () {
            tool.alert('设备数据读取失败',function () {
            });
        };


        function getVersionInfoValue(dataPack) {
            win.server.request(
                global.businessInfo.serverType, {
                key: "CALC_VER",
                cartype: global.businessInfo.carType
            },
                dataPack,
                win.server.addRetryFn(win.server.addCallbackParam (win.serverRequestCallback.CALC_VER, [dataPack]),
                [getVersionInfoValue,computerVerBack])
            );
        }

        win.serverRequestCallback.CALC_VER = function (responseObject, params) {
            if (!showView) {
                tool.loading(0);
                return;
            }
            if(!responseObject.items.length){
                tool.alert('服务器无数据支持',
                           function () {
                               computerVerBack();
                           }
                );
                return;
            }
                var curData = $scope.versionInfos || [];
                var dataItems = responseObject.items || [];
                if (dataItems.length <= 0) {

                    //如果已经获取到了系统名称， 数据返回失败时，则全赋值为  “N/A”
                    if (curData && curData.length > 0)
                        safeApply(function () {
                            _.forEach(curData, function (item) { item.ans = "N/A"; });
                        });

                    if (!curData)
                        tool.alert('版本信息获取失败',function () {
                        });
                    tool.loading(0);
                    return;
                }

                safeApply(function () {
                    _.forEach(dataItems, function (item, index) {
                        $scope.versionInfos[index].ans = item.ans === "" ? "N/A" : item.ans;
                        item.show = true;
                    });
                });

                tool.loading(0);
        };
    }]);
})();
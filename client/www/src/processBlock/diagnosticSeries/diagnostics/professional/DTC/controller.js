/**
 * Created by mapsh on 2015/8/21.
 */
(function () {

    var win = window;
    var showView = false;
    var readDTCCommand = [];
    var dtcHistory = 'dtcHistory';
    var dtcCurrent = 'dtcCurrent';
    var dtcState = 'dtcState';
    //不需要解码或者已经请求解码成功
    var bHistory = false;
    var bCurrent = false;
    var bState = false;
    var devSupportState = [];       //设备支持的故障状态
    var devReturn8x = [];           //设备返回的带71098X的指令
    var devReturn0x00 = [];         //设备返回的带71090X00的指令，00表示无故障码个数
    App.controller('DTCCtrl', ['$scope', 'angularFactory', function ($scope, angularFactory) {
        var safeApply = angularFactory.getScope($scope).safeApply;
        $scope.dtcList = [];

        //读取故障码
        win.moduleEntry.funReadDTC = function () {
            //tool.layout("ShowOperate", 0);
            showView = true;
            document.getElementById("Title").innerText = "故障码信息";

            bindingBottomBtn();
            tool.layout("ShowDTCInfo", 1);
            tool.loading({pos: "body", text: '检测故障...'});

            //支持并且为请求成功
            readDTCCommand.length = 0;
            safeApply(function () { $scope.dtcList.length = 0; });

            if (YhSupportService._0x14.value) {

                readDTCCommand.push("310914");
                bState = false;
                devSupportState.push("14");
            }
            if (YhSupportService._0x06.value) {

                readDTCCommand.push("310906");
                bCurrent = false;
                devSupportState.push("06");
            }
            if (YhSupportService._0x05.value) {
                readDTCCommand.push("310905");
                bHistory = false;
                devSupportState.push("05");
            }
            if (readDTCCommand.length > 0) {
                //tool.processBar('正在读取故障码', true);
                FunReadNextDTC();
            } else
                tool.alert('设备不支持故障码读取',function () {
                    //tool.processBar("无故障码信息");
                });

        };

        //读取下一种类型的故障码
        function FunReadNextDTC() {

            if (readDTCCommand.length > 0)
                win.devService.sendDataToDev(readDTCCommand.pop());
            else {

                var supStateLen = devSupportState.length;       //支持的状态码；
                var dev8xLen = devReturn8x.length;              //设备返回71098x，意为：设备支持读取，但是返回失败；
                var dev0x00Len = devReturn0x00.length;          //设备返回71090x00,意为：设备支持读取，读取成功，但是返回的故障码个数为0；

                /**
                 * 在这里做支持读取，但是无故障码信息的判断
                 */
                switch (supStateLen) {
                    case 1: //当支持1个故障状态时
                        if (dev8xLen == 1 || dev0x00Len == 1) {
                            tool.alert('设备无故障码信息',function () {
                                //tool.processBar("");
                            });
                        }
                        break;

                    case 2://当支持2个故障状态时
                        if (dev8xLen == 2 ||
                            dev0x00Len == 2 ||
                            (dev8xLen == 1 && dev0x00Len == 1)) {
                            tool.alert('当前车型无故障码信息',function () {
                                //tool.processBar("");
                            });
                        }
                        break;
                    case 3:    //当支持3个故障状态时
                        if (dev8xLen == 3 ||
                            dev0x00Len == 3 ||
                            (dev8xLen == 1 && dev0x00Len == 2) ||
                            (dev8xLen == 2 && dev0x00Len == 1)) {
                            tool.alert('当前车型无故障码信息',function () {
                                //tool.processBar("");
                            });
                        }
                        break;
                }
            }
        }

        win.devService.Fun710905_pro = function (varRecvData) {
            FunReadNextDTC();
            FunSendDTCPid2Server(dtcHistory, varRecvData);
        };

        win.devService.Fun710985_pro = function (varRecvData) {
            devReturn8x.push("85");
            FunReadNextDTC();
        };

        win.devService.Fun710906_pro = function (varRecvData) {
            FunReadNextDTC();
            FunSendDTCPid2Server(dtcCurrent, varRecvData);
        };

        win.devService.Fun710986_pro = function (varRecvData) {
            devReturn8x.push("86");
            FunReadNextDTC();
        };

        win.devService.Fun710914_pro = function (varRecvData) {
            FunReadNextDTC();
            FunSendDTCPid2Server(dtcState, varRecvData);
        };

        win.devService.Fun710994_pro = function (varRecvData) {
            devReturn8x.push("94");
            FunReadNextDTC();
        };


        var requestTimes = 0;
        //发送故障码pid到服务器运算
        function FunSendDTCPid2Server(varType, varRecvData) {
            var cmdNum = tool.hex2dec(varRecvData.substr(4, 2));
            var count = tool.hex2dec(varRecvData.substr(6, 2));

            if (count <= 0) {
                devReturn0x00.push(cmdNum);
                FunReadNextDTC();
                return;
            }

            var DataPack = {
                pub: global.businessInfo.pubFilename,
                dbfilename: global.businessInfo.dbFilename,
                type: varType == dtcState ? 2 : 1,//带状态故障码类型为2，其他为1
                pids: []
            };

            for (var i = 0; i < count; i++)
                //带状态故障码类型为8字节，其他为4字节
                DataPack.pids[i] = varRecvData.substr(8 + 8 * i * DataPack.type, 8 * DataPack.type);
            win.server.request(
                global.businessInfo.serverType,
                {
                key: "DTC",
                cartype: global.businessInfo.carType
            },
                DataPack,
                win.server.addRetryFn(win.server.addCallbackParam (win.serverRequestCallback.DTC_pro, [varType]),
                [win.moduleEntry.funReadDTC,function(){}])
            );

            requestTimes ++;
        }

        var ansTimes = 0;
        win.serverRequestCallback.DTC_pro = function (responseObject, params) {
            if (!showView) return;
            if(!responseObject.items.length){
                tool.alert('服务器无任何数据',
                    function () {
                        //tool.processBar("");
                    }
                );
                return;
            }
                switch (params) {
                    case dtcHistory:
                        bHistory = true;
                        break;
                    case dtcCurrent:
                        bCurrent = true;
                        break;
                    case dtcState:
                        bState = true;
                        break;
                }

                safeApply(function () {
                    for (var i in responseObject.items) {
                        if(!responseObject.items.hasOwnProperty(i))continue;
                        var item = responseObject.items[i];
                        var itemDataLen = item.data.length;
                        if (itemDataLen == 0) {
                            /*$scope.dtcList.push({
                             danwei: item.key,
                             name: "无有效数据",
                             status: ""
                             });*/
                        } else if (itemDataLen == 1 && (params == dtcHistory || params == dtcCurrent)) {
                            $scope.dtcList.push({
                                show: true,
                                danwei: item.data[0].danwei,
                                name: item.data[0].name,
                                status: item.data[0].name == '未定义' ? '' : (params == dtcHistory ? "历史" : "当前")
                            });
                        } else if (itemDataLen == 2 && (params == dtcState)) {

                            //有两个data时,name&&danwei取type为2的数据,status取type为9的数据
                            var type2 = item.data[0].type == '2' ? 0 : 1;
                            var type9 = item.data[0].type == '9' ? 0 : 1;
                            $scope.dtcList.push({
                                show: true,
                                danwei: item.data[type2].danwei,             //name&&danwei取type为2的数据
                                name: item.data[type2].name,
                                status: item.data[type9].name           //status取type为9的数据
                            });
                        } else if (itemDataLen == 1 && (params == dtcState) && item.data[0].type == '2') {

                            //只有一个data时,只取type为2的数据
                            $scope.dtcList.push({
                                show: true,
                                danwei: item.data[0].danwei,
                                name: item.data[0].name,
                                status: ''
                            });
                        }
                    }

                    if ($scope.dtcList.length == 0) {
                        tool.alert('设备无故障码信息',function () {
                            //tool.processBar("");
                        });
                        return;
                    }
                    $scope.dtcList.sort();
                });


                if (++ansTimes >= requestTimes) {
                    if (bHistory || bCurrent || bState)
                    tool.loading (0);
                }

        };

        //清除故障码
        win.moduleEntry.funClearDTC = function () {
            showView = true;
            tool.loading({text: '故障码清除中...'});
            //tool.processBar('正在清除故障码', true);
            win.devService.sendDataToDev("310907");
        };

        win.devService.Fun710907_pro = function () {
            //tool.processBar('清除故障完成');
            tool.loading(0);
            tool.alert('清除故障完成',function () { DTCBack(); });
        };

        win.devService.Fun710987_pro = function () {
            tool.loading(0);
            tool.alert('清除故障失败',function () { DTCBack(); });
            //tool.processBar('清除故障失败');
        };


        function DTCBack() {
            //添加故障码日志信息，在退出诊断的时候通过SendToApp方法上传给APP进行保存
            win.global.DTCLog.detail.push({
                systemName: global.DTCLog.systemName,
                DTC: _.toArray(tool.extend({}, $scope.dtcList))
            });

            tool.layout("ShowDTCInfo", 0);
            reset();
            win.moduleEntry.showOperationMenu();
        }

        function bindingBottomBtn() {
            tool.bottomBtn({
                btn1Text: '返回',
                btn1Callback: function () { DTCBack(); }
            })
        }

        function reset() {
            showView = false;
            devReturn8x.length = 0;
            devSupportState.length = 0;
            devReturn0x00.length = 0;
            $scope.dtcList.length = 0;
            safeApply(function () {});
        }
    }]);
})();
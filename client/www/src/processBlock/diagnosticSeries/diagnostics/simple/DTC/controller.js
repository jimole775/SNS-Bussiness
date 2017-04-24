/**
 * Created by Andy on 2016/2/25.
 */
(function(){


    var win = window;
        App.controller('DtcCtrl', ['$scope', 'SystemManager', function ($scope, SystemManager) {
            $scope.originalSystemList = SystemManager.systemList;

            $scope.currentSystem = {};
            $scope.baseLimitData = 100;
            $scope.currentSystemDtcList = [];
            function DTCBack(callback) {
                callback(); //重新绑定底部按钮事件
                tool.layout("showSystem",1);
                tool.layout("showDtc", 0);
                document.getElementById("Title").innerHTML = "自动诊断";
            }

            //显示选择系统的故障码
            win.moduleEntry.showDTC = function (index,callback) {
                $scope.currentSystem = $scope.originalSystemList[index];
                $scope.currentSystemDtcList = $scope.currentSystem.dtcList;
                var tempScanText = $scope.currentSystem.dtcScanStateText;

                if ($scope.currentSystemDtcList.length == 0) {
                    if (tempScanText == DtcScanState['checking']) {
                        //tool.processBar("故障状态检测中");
                    } else {
                        //tool.processBar("服务器返回数据为空");
                    }
                } else if (tempScanText !== DtcScanState['hasDtc'] && $scope.currentSystemDtcList.length > 0) {
                    //tool.processBar("服务器返回数据异常，请重新扫描");
                } else {
                    tool.layout("showSystem",0);
                    bindBottomBtn(callback);
                    tool.layout("showDtc", 1);
                    document.getElementById("Title").innerHTML = $scope.currentSystem.name;
                    //tool.processBar("故障详情");
                }
            };

            function bindBottomBtn(callback){
                tool.bottomBtn({
                    btn1Text:'返回',
                    btn1Callback:function(){
                        DTCBack(callback);
                    }
                })
            }

            var DtcScanState = {
                init: "",
                checking: "检测中...",
                hasDtc: "故障",
                noDtc: "无故障"
            };

        }]);

})();


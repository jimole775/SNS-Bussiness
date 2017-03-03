/**
 * Created by Andy on 2016/2/25.
 */
(function(){


    var win = window;
    //angular.module('app')
        App.controller('DtcCtrl', ['$scope', 'SystemManager', function ($scope, SystemManager) {
            $scope.originalSystemList = SystemManager.systemList;

            $scope.currentSystem = {};
            $scope.baseLimitData = 100;
            $scope.currentSystemDtcList = [];

            // $scope.updateDataList(100,$scope.currentSystemDtcList);
            /* $scope.updateDataList = function (step) {
                $scope.baseLimitData += step;            //默认步进5;
                var j = $scope.baseLimitData;         //创建副本
                var k = $scope.baseLimitData % step;         //如果%5为0, 则进行运算
                var i = j - step * 3;                        //当增加了'第三队'数据的时候, 再去操作'第一队'数据;

                if (j >= $scope.currentSystemDtcList.length) {
                    return $scope.baseLimitData = $scope.currentSystemDtcList.length;
                }

                if (!k && i >= 0) {
                    for (i; i < j - step * 2; i++) {
                        $scope.currentSystemDtcList[i].show = false;
                    }
                }
            };

            $scope.downgradeDataList = function (step) {
                var j = $scope.baseLimitData;
                var k = $scope.baseLimitData % step;
                var i = j - step * 2 - k;
                if (!i) return;
                if (j == $scope.currentSystemDtcList.length) {
                    $scope.baseLimitData -= k;
                    return;
                }

                if (j >= step * 2) {
                    for (i; i >= j - step * 3 - k; i--) {
                        $scope.currentSystemDtcList[i].show = true;
                    }
                    $scope.baseLimitData -= step;
                }

            };
            */

            /*$scope.onReturn = function () {
                sendRMTEventToApp('simpleDTCListBackToSystemList', '');
                simpleDTCListBackToSystemList();
            };*/

            function DTCBack(callback) {
                callback(); //重新绑定底部按钮事件
                tool.layout("showSystem",1);
                tool.layout("showDtc", 0);
                document.getElementById("Title").innerHTML = "自动诊断";
                //tool.processBar("系统列表");

            }


            /*function filterListener() {
                $scope.filterKey = "";
                //控制机 监听INPUT的输入值变化， 顺便通知 业务机 进行相同操作；
                $scope.filterWatch = $scope.$watch('filterKey', function () {
                    filterSearch($scope.filterKey, $scope.currentSystemDtcList);
                });

            }*/


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

            var SystemScanState = {
                scanning: 'scanning',
                pausing: 'pausing',
                undone: 'undone',
                complete: 'complete'
            };

            var OperationText = {
                scanning: '暂停',
                pausing: '暂停中',
                undone: '继续',
                complete: '重新扫描'
            }


        }]);

})();


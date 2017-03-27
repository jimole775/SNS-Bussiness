/**
 * Created by Andy on 2016/2/24.
 */
(function () {
    var win = window;

    App.controller('navPageCtrl', ['$scope', 'angularFactory', '$element',function ($scope, angularFactory, $element) {
        var safeApply = angularFactory.getScope($scope).safeApply;
        var thisBox = $element;
        var thisBoxId = thisBox.attr("id");
        win.moduleEntry.navPage = function () {
            document.getElementById("Title").innerText = "日志信息";
            bindMainDivBottomBtn();
            tool.layout(thisBoxId, 1);
            //tool.processBar('');
        };

        //车型信息入口
        $scope.descRecord = function(){
            win.sendRMTEventToApp("moduleEntry.carDescRecord",[]);
            win.moduleEntry.carDescRecord();
        };

        //流程记录入口
        $scope.devMessagesEntry = function(){
            win.sendRMTEventToApp("moduleEntry.devMessages",[]);
            win.moduleEntry.devMessages();
        };


        /**
         * 绑定主页底部按钮；
         * **/
        function bindMainDivBottomBtn() {
            tool.bottomBtn({
                btn1Text: '开始诊断',
                btn2Text: '退出业务',
                btn1Callback: function () { RESETEntry(); },
                btn2Callback: function () { navPageQuit() }
            })
        }

        function RESETEntry() {
            //重新诊断的时候，就重置 选择项的缓存 ，以区别在 车辆配置 或者 系统信息 页面的返回键效果
            /*  if(!RESETEntryFlag){
             window.RESETEntryFlag = 1;
             }*/
            //win.global.rootCache.carType = {};
            //win.global.rootCache.carConfig = {};
            //win.global.rootCache.carSystem = {};

            win.moduleEntry.carLogo();
        }

        /**
         * 主页退出按钮 确认框；
         * **/
        function navPageQuit() {
            tool.alert(["是否退出业务？",'确定','取消'],
                function () { navPageQuitConfirm(); },
                function () { }
            );
        }

        /**
         * 通知设备退出业务；
         * **/
        function navPageQuitConfirm() {
            /* win.global.DTCLog.detail = [                  //专业诊断日志缓存,发送给APP；
                {
                 systemName: "",                        //系统名在选择车型，系统和配置模块生成；
                     DTC: [{                            //故障码在读取故障信息模块生成
                         name: "",
                         danwei: "",
                         status: ""
                         }
                     }]，
                 {
                 systemName:  "",
                     DTC: [{
                         name: "",
                         danwei: "",
                         status: ""
                     }]
                 }

            ];*/

            win.appService.sendDataToApp(1020,JSON.stringify(win.global.DTCLog.detail),"");   //手动诊断，上传故障日志；
            console.log("专业诊断故障日志：",win.global.DTCLog.detail);
            tool.loading({text:"正在退出业务..."});
            tool.log('退出业务');
        }
    }]);
})();
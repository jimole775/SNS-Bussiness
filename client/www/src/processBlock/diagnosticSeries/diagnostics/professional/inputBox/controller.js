/**
 * Created by mapsh on 2015/8/28.
 */

(function(){

    App.controller('InputBoxController',  ['$scope', 'angularFactory',function ($scope,angularFactory) {
        var safeApply = angularFactory.getScope($scope).safeApply;
        var win         = window;
        var $           = angular.element;
        var $input      = $("#numberInput");
        var jumpType    = "";
        var regNum      = /[\w\W]+(\.)+/i;

        win.moduleEntry.showNumberInputBox = function (_jumpType) {
            tool.popShow('numberInputBox', 1);
            $scope.errorMsg = "";
            $input.val("");      //兼容远程业务，因为远程业务中，$scope.value的值由input标签决定，但是，必须是键盘输入的形式，直接由JS修改的话，是监听不到的
            jumpType = _jumpType;
        };


        $scope.inputBoxCommit = function(){
            var inputVal = $input.val();
            win.RMTClickEvent.inputBoxCommit(inputVal);
        };

        win.RMTClickEvent.inputBoxCommit = function(val){
            var channel_number = parseInt(val);
            if (isNaN(channel_number) || regNum.test(channel_number) || channel_number > 255 || channel_number < 0) {
                safeApply(function(){
                $scope.errorMsg = "请输入0~255之间的整数";
                });
                return;
            }

            tool.popShow("numberInputBox", 0);
            tool.layout("ShowOperate", 0);
            switch (jumpType) {
                case '20':
                    win.moduleEntry.adjuster(parseInt(channel_number));
                    break;
                case '1D':
                    win.moduleEntry.channelData(parseInt(channel_number));
                    break;
            }
        };

        $scope.inputBoxCancel = function(){
            win.RMTClickEvent.inputBoxCancel();
        };

        win.RMTClickEvent.inputBoxCancel = function () {
            tool.popShow("numberInputBox", 0);
        }

    }]);

})();
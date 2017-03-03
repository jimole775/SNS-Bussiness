/**
 * Created by Andy on 2016/2/24.
 */

(function(){
    var win = window;

    function layoutRecord(recordModelId){

        var titleHeight = tool.realHeight("#Title") || 0;
        var footerHeight = tool.realHeight("#footer") || 0;
        $("#"+ recordModelId).css({
            overflow:'auto',
            position:'fixed',
            width:'100%',
            top:titleHeight,
            bottom:footerHeight,
            display:'block'
        });
        tool.layoutBottomBtn(recordModelId);
    }

    App.controller('carDescriptionRecordCtrl', ['$scope', 'angularFactory',function ($scope,angularFactory) {

            var safeApply = angularFactory.getScope($scope).safeApply;

        win.moduleEntry.carDescRecord = function(){


                bindBottomBtn();
                layoutRecord('carDescriptionRecord');

                safeApply(function(){
                    $scope.CacheCarTypeSelected = global.rootCache.carType;
                    $scope.CacheCarConfigSelected = global.rootCache.carConfig;
                    $scope.CacheCarSystemSelected = global.rootCache.carSystem;
                    $scope.hasCarTypeSelect = _.size($scope.CacheCarTypeSelected) > 0;
                    $scope.hasCarConfigSelect = _.size($scope.CacheCarConfigSelected) > 0;
                    $scope.hasCarSystemSelect = _.size($scope.CacheCarSystemSelected) > 0;
                    //console.log( $scope.hasCarTypeSelect,$scope.hasCarConfigSelect,$scope.hasCarSystemSelect);
                    //console.log( $scope.CacheCarTypeSelected,$scope.CacheCarConfigSelected,$scope.CacheCarSystemSelected);

                });
            };

            function bindBottomBtn (){
                tool.bottomBtn({
                    btn1Text:'返回',
                    btn1Callback:function(){ carDescriptionRecordBackEvent(); }
                });
            }

            function carDescriptionRecordBackEvent(){
                //tool.layout('carDescriptionRecord',0);
                document.getElementById ('carDescriptionRecord').style.display = "none";
                win.moduleEntry.navPage();
            }

        }]);

})();


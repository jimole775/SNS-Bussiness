/**
 * Created by Andy on 2016/2/25.
 */
(function () {
    document.body.innerHTML += [
        '<div id="DropDownBox" ng-click="bindClick(null,-1)" ng-controller="CreateDropDownListCtrl" style="position:absolute;left:0;top:0;width:100%;height:100%;display:none;z-index:200;background:rgba(0,0,0,0.4)">',
        '<div style="display:table-cell;vertical-align: middle">',
        '<div id="CreateDropDownList" style="height:auto;width:72%;margin:0 auto;overflow: auto;box-shadow: 1px 2px 3px #3F3F3F;">',
        '<button class="box-btn-vertical" ng-repeat="(index,item) in dataList" ng-click="bindClick(item,index)" >',
        '<span class="item-description item-description-layout-table item-description-single">',
        '<em class="item-description-layout-cell" ng-bind="bindText(item)"></em>',
        '</span>',
        '</button>',
        '</div></div></div>'
    ].join('');

    var win = window;
    App.controller('CreateDropDownListCtrl', ['$scope', '$element', function ($scope, $element) {
        var curElement = $element[0];

        var CreateDropDownList = document.getElementById("CreateDropDownList");

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $scope.bindClick = function (item,index) {
            RMTClickEvent.dropDownClick(item,index);
        };

        win.RMTClickEvent.dropDownClick = function(item, index){         //兼容远程机同步关闭
            var index_int = parseFloat(index);
            curElement.style.display = "none";

            if(index_int === -1){ return; }                             //点击空白处，直接隐藏弹框

            setTimeout(function () {
                tool.layoutTable();                                     //当选则的内容文本换行时，需要从新计算滚动盒子的高度
            }, 50);

            if ($scope.btnCallback instanceof Function) {
                $scope.btnCallback(item, index_int);
            }

        };

        $scope.bindText = function (item) {
            return $scope.showProp ? item[$scope.showProp] : item
        };

        CommonTool.prototype.dropDownList = function (object) {

            $scope.safeApply(function () {

                object = object || {};

                $scope.dataList = object.dataList || [];

                $scope.showProp = object.showProp;

                $scope.btnCallback = object.btnCallback;

            });

            //加个延时防止弹出框的时候，长宽计算错误，影响居中
            setTimeout(function () {
                if ($scope.dataList.length) {
                    curElement.style.display = "table";

                    var height = (function(){
                        var ary = CreateDropDownList.children;
                        return $(ary[0]).height()*ary.length;
                    })();

                    if (height >= win.CONSTANT.WINDOW_HEIGHT * 0.8) {
                        CreateDropDownList.style.height = "80%";
                    }else{
                        CreateDropDownList.style.height = "auto";
                    }
                }
            }, 50);
        };

    }]);

}());


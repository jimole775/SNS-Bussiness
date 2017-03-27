/**
 * Created by Andy on 2017/3/27.
 */
App.directive("helpPop", function () {
    var template = [
        '<div class="help-pop-frame">',
        '   <div class="help-pop-layout table">',
        '       <div class="help-pop-layout-slave table-cell">',

        '           <div  class="help-pop-content-box table">',
        '               <img class="help-pop-close-button" src="images/common/refresh_1.png" ng-click="close()"/>',
        '               <div class="arrow-back-cover arrow-back-cover-left" ng-click="prevPic(curSrc.index)">',
        '                   <span class="table-cell-center"><i class="arrow-left" style="right:1.2rem"></i></span>',
        '               </div>',

        '               <div id="appendForm" class="help-pop-content table-cell">',
        '                   <img ng-src="{{ curSrc.src }}" alt="" ng-click="imgView()" ng-hide="!curSrc.src"/>',
        '						<div class="help-pop-desc">',
        '                   	<p ng-repeat="(index,phrase) in curSrc.name">' +
        '                       	<span ng-bind="phrase">文本内容</span>',
        '                       	<span ng-show="index == curSrc.name.length-1">({{ curSrc.index + 1 }}/{{ helpPopData.length }})</span>',
        '                   	</p>',
        '					</div>',
        '               </div>',
        '               <div class="arrow-back-cover arrow-back-cover-right" ng-click="nextPic(curSrc.index)">',
        '                   <span class="table-cell-center"><i class="arrow-right" style="right:1.2rem"></i></span>',
        '               </div>',
        '           </div>',
        '       </div>',
        '   </div>',
        '   <div class="help-pop-content-background"></div>',
        '</div>'

    ].join("");
    return {
        restrict: "ECMA",
        replace: true,
        template: template,
        link: function (scope,element) {
            var win = window;
            var pswitems = [];

            scope.helpPopData = [];

            win.RMTClickEvent.handleHelpType = function (requestType, carType, dbfilename) {
                tool.loading({text: "加载中..."});
                helpInfoRequest(requestType, carType, dbfilename);
            };

            function helpInfoRequest(requestType, carType, dbfilename) {
                tool.loading({text: "加载中..."});
                var key = requestType === 2 ? "ANTISTEEL_HELP2" : "ANTISTEEL_HELP";
                win.server.request(
                    1011,
                    {
                        "key": key,
                        "cartype": carType  //请求模式是2，carType的值为null
                    },
                    {
                        "dbfilename": dbfilename,
                        "pub": ""
                    },
                    win.server.addRetryFn(
                        win.server.addCallbackParam(
                            win.serverRequestCallback.antCarTypeHelpMenu,
                            [requestType, carType, dbfilename]
                        ),
                        [helpInfoRequest, function(){}]
                    )
                );
            }

            win.serverRequestCallback.antCarTypeHelpMenu = function (responseObject, params) {

                tool.loading(0);
                if (!responseObject.items.length) {
                    tool.alert('服务器无任何数据',
                        function () {
                        }
                    );
                    return;
                }
                scope.helpPopData = responseObject.items;
                //document.getElementById("helpPop").style.display = "block";
                element.show();
            };

            scope.$watch("helpPopData", function () {
                if (scope.helpPopData.length) {
                    scope.helpPopData = (function () {
                        scope.helpPopData.forEach(function (item, index) {
                            item.index = index;
                            item.name = item.name.split("\\n");
                            item.src = item.fomulaname ? "images/carType/img/" + item.fomulaname.split("/").pop() : "";
                            pswitems.push({
                                src: item.src,
                                w: 600,
                                h: 400
                            });
                        });
                        return scope.helpPopData;
                    })();
                    scope.curSrc = scope.helpPopData[0];
                }
            });
            var curIndex = 0;
            scope.prevPic = function (index) {
                if (index <= 0)return;
                win.RMTClickEvent.prevPic(index);
            };

            win.RMTClickEvent.prevPic = function (index) {
                curIndex = --index;
                scope.curSrc = scope.helpPopData[index];
            };

            scope.nextPic = function (index) {
                if (index >= scope.helpPopData.length - 1)return;
                win.RMTClickEvent.nextPic(index);
            };

            win.RMTClickEvent.nextPic = function (index) {
                curIndex = ++index;
                scope.curSrc = scope.helpPopData[index];
            };

            scope.close = function(){
                win.RMTClickEvent.helpPopClose();
            };

            win.RMTClickEvent.helpPopClose = function(){
                element.hide();
            };

            var pswpElement = document.querySelectorAll('.pswp')[0];
            scope.imgView = function () {
                var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, pswitems, {
                    index: curIndex, // start at first slide
                    x: 0,
                    y: 0,
                    w: "100%",
                    h: "100%"
                });
                gallery.init();
            };

        }
    }
});
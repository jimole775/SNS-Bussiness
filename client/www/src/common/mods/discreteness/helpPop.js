/**
 * Created by Andy on 2017/3/27.
 */
App.directive("helpPop", function () {
    var template = [
        '<div id="helpPop" class="help-pop-frame">',
        '   <div class="help-pop-layout table">',
        '       <div class="help-pop-layout-slave table-cell">',

        '           <div  class="help-pop-content-box table">',
        '               <img class="help-pop-close-button" src="images/common/refresh_1.png" onclick="document.getElementById(\'helpPop\').style.display = \'none\';"/>',
        '               <div class="arrow-back-cover arrow-back-cover-left" ng-click="prevPic(curSrc.index)">',
        '                   <span class="table-cell-center"><i class="arrow-left" style="right:1.2rem"></i></span>',
        '               </div>',

        '               <div id="appendForm" class="help-pop-content table-cell">',
        '                   <img ng-src="{{ curSrc.src }}" alt="" ng-click="imgView()" ng-hide="!curSrc.src"/>',
        '						<div class="help-pop-desc">',
        '                   	<p ng-repeat="(index,phrase) in curSrc.name">' +
        '                       	<span ng-bind="phrase">ÎÄ±¾ÄÚÈÝ</span>',
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
        scope: {

        },
        replace: true,
        template: template,
        link: function (scope) {

            var pswitems = [];
            //var host = "http://192.168.1.37:8091/";
            //var path = "CCDPWebServer/CCDP_Web/zh-cn/carimage/";
            scope.$watch("helpPopData", function () {
                if (scope.helpPopData.length) {
                    scope.helpPopData = (function () {
                        scope.helpPopData.forEach(function (item, index) {
                            item.index = index;
                            item.name = item.name.split("\\n");
                            item.src = item.fomulaname ? "images/carType/img/" + item.fomulaname : "";
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
            }
        }
    }
});
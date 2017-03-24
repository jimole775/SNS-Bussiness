/**
 * Created by Andy on 2016/11/3.
 */
(function () {
    var win = window;
    var showView = false;
    App.controller('carTypeController', ['$scope', 'angularFactory', '$element', function ($scope, angularFactory, $element) {
        var safeApply = angularFactory.getScope($scope).safeApply;
        $scope.pagesOptionChosenRecord = [];        //用于存储选择项,并发送给服务器
        $scope.pagesData = [];                      //用于刷新显示内容
        $scope.pagesDataIndex = 0;                  //每次点击导航条或者获取新数据时记录；

        $scope.publicfilename = '';
        $scope.dbFilename = '';

        //如果需要使用id（jquery），就直接从这里获取
        var thisBox = $element;
        var thisBoxId = $element.attr("id");

        //入口
        win.moduleEntry.carType = function () {
            showView = true;
            document.getElementById("Title").innerText = "车型列表";
            bindBottomBtn();

            //isBack代表从车辆配置或者系统菜单返回；
            if (arguments[0] === -1) {
                $scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);

                //只使用一次，pagesOptionChosenRecord只要变化，$scope.isBack就会置为假
                $scope.isBack = true;

                //如果在其他界面返回此界面的时候，页面记录为空，在监听器里面会被拦截一次，
                //isBack不能在第一时间重置为false,会造成第一次点击事件无效的BUG！
                if ($scope.pagesDataIndex-- == 1) $scope.isBack = false;
                //tool.processBar("获取车型系统成功");

            }
            else {    //否则就是重新诊断
                $scope.isBack = false;
                reset();
                requestData($scope.pagesOptionChosenRecord, arguments);
            }

            safeApply(function () {
                //重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
                setTimeout(function () {
                    tool.layout(thisBoxId, 1);
                }, 45);
            });
        };

        /**
         * 下拉列表的回调函数,用于承接远程函数
         * @item   回调参数；
         * */
        $scope.handleSelect = function (parentIndex, item) {
            win.RMTClickEvent.carTypeHandleSelect(parentIndex, item);
        };

        /**
         * 正常选择事件
         * @param curClickPageIndex
         * @param item
         * */
        win.RMTClickEvent.carTypeHandleSelect = function (curClickPageIndex, item) {
            //每次翻页，都把滚动条置顶
            thisBox.find(".scroll-table-body").scrollTop(0);

            //远程进入函数，所有数字都转换成了字串
            var curClickPageIndex_int = parseFloat(curClickPageIndex);

            //点击之后马上加1，因为如果选择的项目重复，可能不去请求服务器
            $scope.pagesDataIndex = curClickPageIndex_int + 1;

            var recordIndex = $scope.pagesOptionChosenRecord.length;

            //如果选了不重复的项目，则删除 当前下标之后的 选项记录【$scope.pagesOptionChosenRecord】 和页面数据【$scope.pagesData】，通过监视器把 选项记录 发到服务器

            //第一种情况：如果重新选择车型，当前页面的下标 小于 选项记录的长度
            if ($scope.pagesDataIndex < recordIndex) {

                //选择了不同项，重新修改选项记录；
                if (item.name !== $scope.pagesOptionChosenRecord[$scope.pagesDataIndex - 1]) {

                    //record下标和pages下标有1的差别，需要同步显示的情况下，引用pages的下标的时候必须 -1；
                    //record下标和pages下标有1的差别，需要同步显示的情况下，引用record的下标的时候必须 +1；
                    $scope.pagesOptionChosenRecord.splice($scope.pagesDataIndex - 1);
                    $scope.pagesData.splice($scope.pagesDataIndex);

                    global.rootCache.carType[$scope.pagesOptionChosenRecord.length] = item.name;
                    $scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
                    win.global.DTCLog.systemName = item.name;

                }
                else {   //选择了相同项，直接修改show属性；
                    showPageDataFromClientChoosen($scope.pagesDataIndex);
                }

            }

            //第二种情况：如果重新选择车型，选到了 选项记录的最后一项
            else if ($scope.pagesDataIndex === recordIndex) {

                //选了不同项，直接修改 选项记录；
                if (item.name !== $scope.pagesOptionChosenRecord[recordIndex - 1]) {
                    $scope.pagesOptionChosenRecord[recordIndex - 1] = item.name;
                }
                //选择了相同项，直接修改 show属性；
                else {
                    showPageDataFromClientChoosen($scope.pagesDataIndex);
                }

            }

            //第三种情况：正常选择，正常添加记录长度，监听器会做后续工作
            else {
                //缓存车型选择信息到车辆信息页面
                global.rootCache.carType[$scope.pagesOptionChosenRecord.length] = item.name;

                //手动更改parents的值，让$watchCollection监听器生效
                $scope.pagesOptionChosenRecord[$scope.pagesOptionChosenRecord.length] = item.name;
                win.global.DTCLog.systemName = item.name;
            }

            safeApply(function () {
                //重新布局需要延后，等待nav列表渲染完毕再进行，否则无法准确计算nav高度
                setTimeout(function () {
                    tool.layoutTable();
                }, 45);
            });
        };

        $scope.navSelection = function (recordIndex) {
            win.RMTClickEvent.carTypeNavSelection({nav: recordIndex});
        };

        /**
         * 导航条点击事件
         * @param obj ;this param's type like {record:index} || {pagesDataIndex:index}
         * */
        win.RMTClickEvent.carTypeNavSelection = function (obj) {

            //区别从 点击 【导航】 返回 和 点击【上一级】按钮返回
            if (obj.hasOwnProperty("nav")) {
                var record = parseFloat(obj.nav);                //远程端只支持字串形式的数据
                $scope.pagesDataIndex = record + 1;
                showPageDataFromClientChoosen(record + 1);          //record下标和pages下标有1的差别，需要同步显示的情况下，
                //引用record的下标的时候必须 +1；
            }
            else {
                var pagesDataIndex_int = parseFloat(obj.btn);
                showPageDataFromClientChoosen(pagesDataIndex_int);
            }

            checkBtnTextBasisCurIndex();
            safeApply(function () {
            });
        };

        /**
         * 动态刷新按钮文本
         * */
        function checkBtnTextBasisCurIndex() {
            return $scope.pagesDataIndex > 0 ? "上一级" : "返回";
        }

        /**
         * 返回按钮点击事件,分为【上一级】和【退出诊断】两个功能，根据当前页面的Index进行判断
         * */
        function backToPrvLevel() {

            if ($scope.pagesDataIndex <= 0) {
                quit();
            }
            else {
                win.RMTClickEvent.carTypeNavSelection({btn: --$scope.pagesDataIndex});
            }
            safeApply(function () {
            });
        }

        /**
         * 请求车型图片方法
         * @param boxId ；当前模块的最顶层ID，方便向下查找子元素
         * @param picName ；当前选项的显示文本，提交给APP（APP已经做好了文本和文件名的绑定）
         * @param parentIndex ；当前页的下标
         * @param curIndex  ；当前选项的下标
         * */
        //$scope.requestPicUrl = function (boxId, picName, parentIndex, curIndex) {
        //    var appDataPack = {
        //        name: picName,
        //        param: {
        //            boxId: boxId,
        //            parentIndex: parentIndex,
        //            curIndex: curIndex
        //        }
        //    };
        //    win.appService.sendDataToApp(1009, JSON.stringify(appDataPack), "");
        //};


        /**
         * 监听是否存在 nodeaddress
         * 结合了业务流程
         * 根据 $scope.pagesOptionChosenRecord 的变化做了相应的处理
         * */
        $scope.$watchCollection('pagesOptionChosenRecord', function () {

            //$scope.nodeaddress = "";

            //监听器的执行先于其他代码，所以在此堵截，防止报错
            if (!$scope.pagesOptionChosenRecord[0] || "" == $scope.pagesOptionChosenRecord[0]) {
                //tool.processBar("");
                return;
            }

            var curRecordIndex = $scope.pagesOptionChosenRecord.length - 1;
            //获取每个列表层级，并循环搜索是否存在nodeaddress；
            var itemLen = $scope.pagesData[curRecordIndex].length;
            if (itemLen > 0) {
                for (var i = 0; i < itemLen; i++) {
                    var item = $scope.pagesData[curRecordIndex][i];

                    //如果存在，直接跳入下个流程，取消确定按钮
                    if (item.name == $scope.pagesOptionChosenRecord[curRecordIndex] && item['N']) {

                        $scope.dbFilename = item['N']['dbfilename'];
                        $scope.publicfilename = item['N']['publicfilename'];

                        safeApply(function () {
                            //tool.processBar("获取车型系统完成");
                        });
                        outputPrompt(item['N']['nodeaddress']);
                        return;
                    }
                }
            }

            //从其他界面返回的时候，直接读取缓存数据，不需要请求服务器
            if ($scope.isBack === true) {
                $scope.isBack = false;
                return;
            }

            requestData($scope.pagesOptionChosenRecord);

        });

        /**
         * 页面的显示隐藏处理
         * 方法为--先全部隐藏，然后显示当前需要显示的
         * */
        function showPageDataFromClientChoosen(pagesDataIndex) {
            //先隐藏所有；
            var j = $scope.pagesData.length;
            while (j--) {
                var k = $scope.pagesData[j].length;
                while (k--) {
                    $scope.pagesData[j][k].show = false;
                    $scope.pagesData[j][k].imgShow = false;
                }
            }

            //再显示当前；
            var n = $scope.pagesData[pagesDataIndex].length;
            while (n--) $scope.pagesData[pagesDataIndex][n].show = true;
        }

        /**
         * 请求服务器命名封装
         * @param pagesOptionChosenRecord ;把整个选项记录的数组发送给服务器
         * */
        function requestData(pagesOptionChosenRecord) {
            if (showView)win.tool.loading({pos: "body", text: '获取数据...'});
            getItemsByParents(
                pagesOptionChosenRecord,
                win.server.addRetryFn(win.server.addCallbackParam(win.serverRequestCallback.CTYPE, [pagesOptionChosenRecord]),
                [requestData, backToPrvLevel])
            );
        }

        /**
         * 请求服务器初始化数据封装
         * @param pagesOptionChosenRecord ;选项记录
         * @param callback ;数据请求回调
         * */
        function getItemsByParents(pagesOptionChosenRecord, callback) {

            var callbackFunc = callback || function () {
                };
            var DataPack = {
                mkey: '',
                parents: pagesOptionChosenRecord       //服务器解析名为 parents；
            };

            var dataKey = global.businessInfo.procedureType === "防盗匹配" ? "ANTISTEEL_CTYPE" : "CTYPE";

            win.server.request(
                global.businessInfo.serverType,
                {
                    key: dataKey,
                    cartype: global.businessInfo.carType
                },
                DataPack,
                win.server.addCallbackParam(callbackFunc, [pagesOptionChosenRecord]),
                [requestData, backToPrvLevel]
            );
        }


        /**
         * 请求服务器回调方法
         * @param responseObject ;JSON数据
         * @param params ;用于内部运算的参数，通过 server.RequestService.utilAddParams() 方法传入, 远程协助时通过APP传入
         * */
        win.serverRequestCallback.CTYPE = function (responseObject, params) {
            win.tool.loading(0);
            if (!showView)return;
            if (!responseObject.items.length) {
                tool.alert('服务器无任何数据',
                    function () {
                        //tool.processBar("");
                        backToPrvLevel();
                    }
                );
                return;
            }
            //防止多个选择框，选择后面一个没有响应时，又选择了前面一个时，数据错误问题
            if (params.join('') != $scope.pagesOptionChosenRecord.join(''))return;

            //正常点击到下一页时，可固定为隐藏前一页的数据，添加下一页的数据时会初始化show为true;
            if ($scope.pagesOptionChosenRecord.length) {
                var k = $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1].length;
                while (k--) {
                    $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1][k].show = false;
                    $scope.pagesData[$scope.pagesOptionChosenRecord.length - 1][k].imgShow = false;
                }
            }
            responseObject.items.forEach(function (item) {
                item.imgShow = false;
            });
            //添加下一页的数据时会初始化show为true;
            var items = responseObject.items;
            var i = items.length;
            while (i--) items[i].show = true;

            safeApply(function () {
                //如果第一个子集存在"N"集,直接进入系统扫描【简易诊断】
                if (items[0]['N'] && (global.businessInfo.serverType == "100" || global.businessInfo.serverType == "101")) {
                    $scope.pagesData[$scope.pagesDataIndex] = items;
                    $scope.dbFilename = items[0]['N']['dbfilename'];
                    $scope.publicfilename = items[0]['N']['publicfilename'];
                    outputPrompt(items[0]['N']['nodeaddress']);
                    //tool.processBar('获取车型和系统菜单完成');
                }
                else {
                    bindBottomBtn();
                    tool.layout(thisBoxId, 1);
                    //tool.processBar('请选择');
                    $scope.pagesData[$scope.pagesDataIndex] = items;
                }
            });

            //tool.processBar("请选择");
            //}

            //根据界面需求，必须等需要跳转的页面渲染完毕再进行 显示
            tool.layout(thisBoxId, 1);
        };


        /**
         * 绑定按钮事件
         * */
        function bindBottomBtn() {
            win.tool.bottomBtn({
                btn1Text: function () {
                    return checkBtnTextBasisCurIndex();
                },
                btn1Callback: function () {
                    backToPrvLevel();
                }
            });
        }

        /**
         * 界面跳转事件，获取并设置业务模式；
         * 根据业务模式：
         * 1：直接进入【系统列表】
         * 2：发送310901XXX后，进入【服务列表】
         * 3：发送310971XXX后，进入【车型配置】
         * */
        function outputPrompt(nodeAddress) {
            win.global.businessInfo.dbFilenamePrev = $scope.dbFilename;
            win.global.businessInfo.pubFilename = $scope.publicfilename;

            if (!/(模块编程)|(设码配置)|(个性化设置)/.test(global.businessInfo.procedureType)) {

                //从最后一层车型列表获取的通讯地址0000.0000.0000.0001
                //获取第二段的字节，根据下面的判断式得出连接系统的模式：
                //0002 时 则连接时进入模式一连接，
                //0003 时 则连接时进入模式三连接
                //否则为模式二连接：
                switch (nodeAddress.substr(5, 4)) {
                    case '0002':
                        win.global.businessInfo.connectMode = 1;
                        break;
                    case '0003':
                        win.global.businessInfo.connectMode = 3;
                        break;
                    default :
                        win.global.businessInfo.connectMode = 2;
                        break;
                }
            }

            if (/(防盗匹配)/.test(global.businessInfo.procedureType)) {
                tool.layout(thisBoxId, 0);
                //防盗匹配只有在这里才能获取到完整的URL，和其他的项目不一样，需要区别对待！
                win.global.businessInfo.operationMenuCache = [nodeAddress.replace(/\./g, ""), "carType"];

                //重新组拼link字段；因为业务ID必须从keyMatch模块选取，服务器无法判断；
                //"empty.htm#ID=&INDEX=1&PROCEDURE=防盗匹配&TLMAX=&CARCODE=&ServerType=&CarType=ATmatch/bmw&DiagnoseType=&RunMode=online&FunctionID="
                var _split = global.businessInfo.link.split("ID=");
                var link = _split[0] + "ID=" + global.businessInfo.busID + _split[1];
                win.appService.sendDataToApp(win.CONSTANT.JS_TO_APP.REQUEST_LOGIN_SERVER, link, "3027");

            } else {
                tool.alert(
                    ["请确认：<br>1.OBD16接口已经连接稳定。<br>2.汽车点火已经处于ON状态且引擎未打开。", "确定", "返回"],
                    function () {
                        outputConfirm(nodeAddress);
                    },
                    function () {
                        outputCancel();
                    }
                );
            }
        }


        function outputConfirm(nodeAddress) {
            tool.layout(thisBoxId, 0);
            //编程和设码比较特殊
            if (/(模块编程)|(设码配置)|(个性化设置)/.test(global.businessInfo.procedureType)) {

                /**
                 * 普通项目是通过选择LOGO的时候获取的链接，但是编程类项目需要在车型列表选择完（多了一个车系的选择）之后才有完整的link
                 * */
                global.businessInfo.link = nodeAddress;

                win.appService.sendDataToApp(win.CONSTANT.JS_TO_APP.REQUEST_LOGIN_SERVER, global.businessInfo.link, "3027");
                return;
            }

            //简易诊断和(专业诊断,保养,特殊功能)最后抛出的数据不同,(专业诊断,保养,特殊功能)只抛出nodeAddress,简易诊断需要抛出含有nodeAddress的Json
            if (global.businessInfo.diagType === "simp") {

                if (!$scope.pagesOptionChosenRecord.length) {
                    win.global.businessInfo.operationMenuCache = [$scope.pagesData[0], "carType"];
                }
                else {
                    win.global.businessInfo.operationMenuCache = [$scope.pagesData[$scope.pagesData.length - 1], "carType"];
                }

                //发送3027登入服务器,下一个入口在src/common/services/interActivePorts/devService.js
                win.appService.sendDataToApp(win.CONSTANT.JS_TO_APP.REQUEST_LOGIN_SERVER, global.businessInfo.link, "3027");
            }
            else {
                win.global.businessInfo.operationMenuCache = [nodeAddress.replace(/\./g, ""), "carType"];

                //发送3027登入服务器,下一个入口在src/common/services/interActivePorts/devService.js
                win.appService.sendDataToApp(win.CONSTANT.JS_TO_APP.REQUEST_LOGIN_SERVER, global.businessInfo.link, "3027");
            }
        }

        function outputCancel() {
            if ($scope.pagesOptionChosenRecord.length) {
                $scope.pagesOptionChosenRecord.splice($scope.pagesOptionChosenRecord.length - 1);
                $scope.pagesDataIndex--;
            }
            else {
                quit();
            }

            safeApply(function () {
            });
        }

        function quit() {
            showView = false;
            tool.layout(thisBoxId, 0);
            reset();
            if (global.businessInfo.diagType) {
                win.moduleEntry.diagType(-1);
            }
            else {
                win.moduleEntry.carLogo(-1);
            }
        }

        function reset() {
            safeApply(function () {
                $scope.pagesDataIndex = 0;
                $scope.pagesOptionChosenRecord.length = 0;
                $scope.pagesData.length = 0;
            })
        }

        $scope.showImg = function (parentIndex, itemIndex, flag) {
            win.RMTClickEvent.showImg(parentIndex, itemIndex, flag);
        };


        win.RMTClickEvent.showImg = function (parentIndex, itemIndex, flag) {
            safeApply(function () {
                $scope.pagesData[parentIndex][itemIndex].imgShow = !flag;
            });
        };

    }]).config(function () {

    });

})();
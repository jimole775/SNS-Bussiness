(function (jq)
{
    var $ = jq;
    var win = window;
    var doc = document;

    var link = doc.createElement('link');
    link.href="css/iScroll_plugin.css";
    link.rel="stylesheet";
    link.type="text/css";

    var script = doc.createElement('script');
    script.src="lib/iscroll.js";
    script.type="text/javascript";

    doc.body.appendChild(link);
    doc.body.appendChild(script);

    win.RMTClickEvent.iScrollPluginDigit = function (boxId, bits, callback, options)
    {
        //插件默认选项
        var that = doc.getElementById(boxId);
        that.setAttribute("readonly", "readonly");              //把输入框设置只读，防止弹出手机键盘
        var docType = that.nodeName === 'INPUT';    //输出元素的类型，如果是input就使用value属性，其他就用html
        var lineHeight = 50;                        //获取每行的行高，初始化为50，此属性直接影响到 滚动停止时能不能获取到 值
        var cacheIScrollCallBack = [];              //iScroll回调函数存储
        var indexArr = [];                          //用于循环初始化回调数组用
        var limitValueToArr = bits ? bits.toString().split('').reverse() : [9, 9, 9, 9, 9, 9];          //获取最大值，并分割成数组
        var limitMaxValue = parseInt(limitValueToArr[limitValueToArr.length - 1]);                      //获取最大值的最高位，并分割成数组]
        var body = doc.body;
        //var maxLine = $body.height() > 720 ? 5 : 3;              //最大显示，小寸屏显示3个，大平板显示5个。
        var maxLine = 5;                                           //最大显示，小寸屏显示3个，大平板显示5个。
        //var spaceTagInPerHead = $body.height() > 720 ? 2 : 1;         //每列的头部空白标签，小寸屏显示1个，大平板显示2个。
        var spaceTagInPerHead = 2;                                      //每列的头部空白标签，小寸屏显示1个，大平板显示2个。

        var dataTable = doc.getElementsByClassName("scroll-table-body");

        var css = {
            markStyle: {
                "color": "#155FB7",
                "font-size": "1.8rem",
                "font-weight": "600",
                "transform": "rotateX(0deg)"
            },
            defaultStyle: {
                "color": "#4593F3",
                "font-size": "1.5rem",
                "font-weight": "normal",
                "transform": "rotateX(0deg)"
            }
        };

        var element =
        {
            dateShadow: null,
            datePage: null,
            dateConfirm: null,
            dateCancel: null
        };

        var iScrollInstance = {iS1: null, iS2: null, iS3: null, iS4: null, iS5: null, iS6: null};    //初始化iScroll实例；
        var getInputValueIndex = [0, 0, 0, 0, 0, 0];       //初始化每行的默认停留位置，0就是显示第一个数字

        var defaultOptions =
        {
            beginValue: 0,                     //默认每排渲染的第一个数值
            endValue: 9,                       //默认每排渲染的最后一个数值
            mode: null,                        //操作模式（滑动模式）
            event: "click",                    //打开日期插件默认方式为点击后后弹出日期
            show: true
        };

        //用户选项覆盖插件默认选项
        var opts = extend(defaultOptions, options);

        win.RMTClickEvent.refreshDate = function (RMTiScrollInstanceIndex, RMTiScrollValueIndex)
        {
            resetInitDate();
            if (RMTiScrollInstanceIndex)
            {
                var RMTiScrollInstanceIndex_int = parseFloat(RMTiScrollValueIndex);
                var str = "iS" + RMTiScrollInstanceIndex;       //下标第一个为1
                iScrollInstance[str] = new iScroll("wrapper" + RMTiScrollInstanceIndex, cacheIScrollCallBack[RMTiScrollInstanceIndex_int]);
                iScrollInstance[str].refresh();
                iScrollInstance[str].scrollTo(0, RMTiScrollInstanceIndex_int * lineHeight, 100, true);
            } else {
                iScrollInstance.iS1.scrollTo(0, parseInt(getInputValueIndex[0]) * lineHeight, 100, true);
                iScrollInstance.iS2.scrollTo(0, parseInt(getInputValueIndex[1]) * lineHeight, 100, true);
                iScrollInstance.iS3.scrollTo(0, parseInt(getInputValueIndex[2]) * lineHeight, 100, true);
                iScrollInstance.iS4.scrollTo(0, parseInt(getInputValueIndex[3]) * lineHeight, 100, true);
                iScrollInstance.iS5.scrollTo(0, parseInt(getInputValueIndex[4]) * lineHeight, 100, true);
                iScrollInstance.iS6.scrollTo(0, parseInt(getInputValueIndex[5]) * lineHeight, 100, true);
            }
        };

        CreateDataUI();
        CreateUL();                 //动态生成控件显示的日期
        calcPluginSize();
        init_iScroll_event();       //初始化iscroll事件
        bind_iScroll_value();       //绑定iscroll事件
        extendOptions();            //显示控件
        RMTClickEvent.refreshDate();              //每次show出插件时，重新获取上次的数值，并滚动到指定位置
        bindButton();               //绑定按钮事件

        function init_iScroll_event()
        {
            if (limitValueToArr.length)
            {
                return (function ()
                {
                    var idName = [];    //ID名
                    var params = [];    //需要的iScroll参数
                    for (var i = 1; i <= limitValueToArr.length; i++)
                    {
                        idName[i] = ("wrapper" + i);
                        params[i] = function (n)
                        {
                            return cacheIScrollCallBack[n] =
                            {
                                snap: "li",
                                vScrollbar: false,
                                hScrollbar: false,
                                checkDOMChanges: true,
                                hScroll: false,
                                onBeforeScrollStart: function (e)
                                {
                                    e.preventDefault();   //兼容手机端move事件
                                },
                                onScrollMove: function ()
                                {
                                    resetStyle(idName[n]);
                                },
                                onScrollEnd: function ()
                                {
                                    var that = this;
                                    indexArr[n] = (that.y / lineHeight) * (-1) + spaceTagInPerHead;         //决定起始位置，前后都有2个空格，所以+2；
                                    var curScroll = document.getElementById(idName[n]);
                                    if (curScroll)                                                          //防止点击确定后，元素删除而找不到指定ID的 报错
                                    {
                                        var lis = curScroll.getElementsByTagName("li");
                                        lis[indexArr[n] - 1].style.transform = "rotateX(30deg)";
                                        lis[indexArr[n] - 2].style.transform = "rotateX(15deg)";
                                        setStyle(lis[indexArr[n]], css.markStyle);
                                        lis[indexArr[n] + 1].style.transform = "rotateX(-15deg)";
                                        lis[indexArr[n] + 2].style.transform = "rotateX(-30deg)";

                                        if (typeof(win.sendRMTEventToApp) === "function")
                                        {
                                            win.sendRMTEventToApp('RMTClickEvent.refreshDate', [n, indexArr[n] - 2]);
                                        }
                                        return indexArr;
                                    }
                                }
                            }
                        }(i)
                    }
                })();
            }
        }

        function bind_iScroll_value()
        {
            iScrollInstance.iS1 = new iScroll("wrapper1", cacheIScrollCallBack[1]);
            iScrollInstance.iS2 = new iScroll("wrapper2", cacheIScrollCallBack[2]);
            iScrollInstance.iS3 = new iScroll("wrapper3", cacheIScrollCallBack[3]);
            iScrollInstance.iS4 = new iScroll("wrapper4", cacheIScrollCallBack[4]);
            iScrollInstance.iS5 = new iScroll("wrapper5", cacheIScrollCallBack[5]);
            iScrollInstance.iS6 = new iScroll("wrapper6", cacheIScrollCallBack[6]);
        }

        function resetInitDate()
        {
            var val = "";
            //重新获取数值
            if (docType)
            {
                val = that.value.trim();
            }
            else
            {
                val = that.innerText.trim();
            }
            if (val === "")
            {
                return false
            }

            var getIntV = val.toString();
            var getVal = getIntV;
            //补全6位数
            for (var j = 0; j < (6 - getIntV.length); j++)
            {
                getVal = "0" + getVal;
            }

            getInputValueIndex[0] = getVal.substr(getVal.length - 1, 1);
            getInputValueIndex[1] = getVal.substr(getVal.length - 2, 1);
            getInputValueIndex[2] = getVal.substr(getVal.length - 3, 1);
            getInputValueIndex[3] = getVal.substr(getVal.length - 4, 1);
            getInputValueIndex[4] = getVal.substr(getVal.length - 5, 1);
            getInputValueIndex[5] = getVal.substr(getVal.length - 6, 1);
        }


        win.RMTClickEvent.dateConfirmClickEvent = function ()
        {
            var value = {};
            var i = 6;
            while (i >= 1)
            {
                element["scroll" + i] = document.getElementById("wrapper" + i).getElementsByTagName("ul")[0].getElementsByTagName("li")[indexArr[i]];
                var temp_element = element["scroll" + i];
                value[i] = temp_element ? temp_element.innerText : 0;
                i--;
            }

            var inputValue = parseInt((value[6] + value[5] + value[4] + value[3] + value[2] + value[1]).trim());
            value.length = 0;       //用完后重置

            if (docType)
            {
                that.value = inputValue > bits ? bits : inputValue;
            }
            else
            {
                that.innerText = inputValue > bits ? bits : inputValue;
            }

            var dateShadow = element.dateShadow;
            var datePage = element.datePage;
            dateShadow.parentNode.removeChild(dateShadow);
            datePage.parentNode.removeChild(datePage);

            if(typeof callback === "function")callback(boxId);

            var j = dataTable.length;
            while(j--)
            {
                dataTable[j].style.overflow = "auto";
            }
        };

        //点击取消后删除元素
        win.RMTClickEvent.dateCancelClickEvent = function ()
        {
            var dateShadow = element.dateShadow;
            var datePage = element.datePage;
            dateShadow.parentNode.removeChild(dateShadow);
            datePage.parentNode.removeChild(datePage);
            var i = dataTable.length;
            while(i--)
            {
                dataTable[i].style.overflow = "auto";
            }
        };


        function bindButton()
        {
            element.dateConfirm.onclick = function ()
            {
                win.sendRMTEventToApp('RMTClickEvent.dateConfirmClickEvent',[]);
                win.RMTClickEvent.dateConfirmClickEvent();
            };
            element.dateCancel.onclick = function ()
            {
                win.sendRMTEventToApp('RMTClickEvent.dateCancelClickEvent',[]);
                win.RMTClickEvent.dateCancelClickEvent();
            };
        }


        function extendOptions()
        {
            element.dateShadow.style.display = "block";
            element.datePage.style.display = "block";
            var i = dataTable.length;
            while(i--)
            {
                dataTable[i].style.overflow = "hidden";
            }
        }


        function CreateUL()
        {
            element.dateShadow = doc.getElementById("dateShadow");
            element.datePage = doc.getElementById("datePage");
            element.dateConfirm = doc.getElementById("dateConfirm");
            element.dateCancel = doc.getElementById("dateCancel");

            element.dateScroll = doc.getElementById("dateScroll");
            element.dateTitle = doc.getElementById("dateTitle");
            element.setCancel = doc.getElementById("setCancel");
            element.middleMark = doc.getElementById("middleMark");
            element.topMark = doc.getElementById("topMark");
            element.bottomMark = doc.getElementById("bottomMark");

            //渲染所有列表
            for (var i = 1; i <= 6; i++)
            {
                element["scroll" + i] = doc.getElementById("wrapper" + i).getElementsByTagName("ul")[0];
                element["scroll" + i].innerHTML = create_UL(9);
            }

            //以最大值重新渲染首位列表
            element["scroll" + limitValueToArr.length].innerHTML = create_UL(limitMaxValue);

            //从后隐藏大于最大位数的列表
            for (var j = 6; j > limitValueToArr.length; j--)
            {
                element["scroll" + j].style.display = "none";
            }

        }

        function calcPluginSize()
        {
            //标签创建之后，获取每一个行的行高；
            lineHeight = element.dateScroll.getElementsByTagName('ul')[5].getElementsByTagName('li')[0].offsetHeight;
            //设置mark高度；
            $(element.middleMark).css({height:lineHeight + 6,top:lineHeight * spaceTagInPerHead - 3});
            $(element.topMark).css("height",lineHeight - 3);
            $(element.bottomMark).css("height",lineHeight - 3);

            //设置滚动盒子窗体的高度
            $(element.dateScroll).css("height",lineHeight * maxLine);

            //整页的高宽
            $(element.datePage).css({
                height:element.dateTitle.offsetHeight + element.dateScroll.offsetHeight + element.setCancel.offsetHeight,
                width: Math.floor(body.offsetWidth * 0.8)
            });

            //处理垂直居中
            $(element.datePage).css("top",(body.offsetHeight - element.datePage.offsetHeight) / 2);
        }

        function CreateDataUI()
        {
            var str = '' +
                    //'<div id="dateShadow"></div>' +
                    //'<div id="datePage" class="page">' +
                '<div id="dateTitle"><h1>请选择数值</h1></div>' +
                '<div id="dateScroll">' +
                '<div id="topMark"></div>' +
                '<div id="middleMark"></div>' +
                '<div id="bottomMark"></div>' +
                '<div id="wrapper6">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="wrapper5">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="wrapper4">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="wrapper3">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="wrapper2">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="wrapper1">' +
                '<ul></ul>' +
                '</div>' +
                '</div>' +
                '<div id="setCancel">' +
                '<button id="dateConfirm">确定</button>' +
                '<button id="dateCancel">取消</button>' +
                    //'</div>' +
                '</div>';

            if (!doc.getElementById("dateShadow"))
            {
                var datePage = doc.createElement("div");
                datePage.id = "datePage";
                datePage.className = "page";
                datePage.innerHTML = str;

                body.appendChild(datePage);

                var dateShadow = doc.createElement("div");
                dateShadow.id = "dateShadow";
                body.appendChild(dateShadow);
            }
        }

        function calcHeadSpaceTag()
        {

            var headTag = '';
            if (spaceTagInPerHead == 1)
            {
                headTag = "<li>&nbsp;</li>";
            }
            else
            {
                headTag = "<li>&nbsp;</li><li>&nbsp;</li>";
            }
            return headTag;
        }

        //创建 列表
        function create_UL(value)
        {
            var str = calcHeadSpaceTag();
            for (var i = opts.beginValue; i <= value; i++)
            {
                str += '<li>' + i + '</li>';
            }
            return str + calcHeadSpaceTag();
        }

        function resetStyle(id)
        {
            var curScroll = doc.getElementById(id);
            var lis = curScroll.getElementsByTagName('li');
            var i = lis.length;
            while (i--)
            {
                setStyle(lis[i], css.defaultStyle);
            }
        }

        function extend(des, src)
        {
            for (var j in src)
            {
                if (src.hasOwnProperty(j))
                {
                    des[j] = src[j];
                }
            }
            return des;
        }

        function setStyle(element, obj)
        {
            for (var prop in obj)
            {
                if (obj.hasOwnProperty(prop))
                {
                    element.style[prop] = obj[prop];
                }
            }
        }
    }

})(jQuery);

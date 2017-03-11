(function ()
{
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

    win.RMTClickEvent.iScrollPluginDate = function (boxID, dateType, options)
    {
        //插件默认选项
        var that = doc.getElementById(boxID);
        that.setAttribute("readonly", "readonly");              //把输入框设置只读，防止弹出手机键盘
        var docType = that.nodeName === 'INPUT';                //输出元素的类型，如果是input就使用value属性，其他就用html
        var timeType = dateType ? dateType : "ymd";             //如果不指定日期格式，默认为年月日全显示
        var lineHeight = 50;                                    //获取每行的行高，初始化为50，此属性直接影响到 滚动停止时能不能获取到 值
        var nowDate = new Date();                               //获取当前时间
        var initY = parseInt((nowDate.getFullYear() + "").substr(2, 2));            //获取当前年份
        var initM = parseInt(nowDate.getMonth() + "") + 1;                          //获取当前月份
        var initD = parseInt(nowDate.getDate() + "");                               //获取当前日期

        var body = doc.body;
        //var maxLine = body.height() > 720 ? 5 : 3;              //最大显示，小寸屏显示3个，大平板显示5个。
        var maxLine = 5;                                          //最大显示，小寸屏显示3个，大平板显示5个。
        //var spaceTagInPerHead = body.height() > 720 ? 2 : 1;         //每列的头部空白标签，小寸屏显示1个，大平板显示2个。
        var spaceTagInPerHead = 2;                                     //每列的头部空白标签，小寸屏显示1个，大平板显示2个。

        var iScroll_instance_name = ["yearWrapper", "monthWrapper", "dayWrapper"];
        var iScroll_instance_index = [0, 0, 0];
        var iScroll_instance = {yearWrapper: null, monthWrapper: null, dayWrapper: null};
        var cache_iScroll_callback = [];


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
            year_ul: null,
            month_ul: null,
            day_ul: null,
            dateShadow: null,
            datePage: null,
            dateConfirm: null,
            dateCancel: null
        };

        var defaultOptions =
        {
            beginyear: 2000,                 //日期--年--份开始
            endyear: 2099,                   //日期--年--份结束
            beginmonth: 1,                   //日期--月--份结束
            endmonth: 12,                    //日期--月--份结束
            beginday: 1,                     //日期--日--份结束
            endday: 31,                      //日期--日--份结束
            curdate: true,                   //打开日期是否定位到当前日期
            mode: null,                      //操作模式（滑动模式）
            event: "click",                  //打开日期插件默认方式为点击后后弹出日期
            show: true
        };

        //用户选项覆盖插件默认选项
        var opts = extend(defaultOptions, options);

        win.RMTClickEvent.refreshDate = function (iScrollId, iScrollIndex)
        {
            resetInitDate();
            if (iScrollId)              //如果没有iScrollId传入，则是正常业务，否则就是远程业务。
            {
                var iScrollIndex_int = parseFloat(iScrollIndex);
                switch (iScrollId)
                {
                    case "yearWrapper":
                        iScroll_instance.yearWrapper = new iScroll("yearWrapper", cache_iScroll_callback[0]);
                        iScroll_instance.yearWrapper.refresh();
                        iScroll_instance.yearWrapper.scrollTo(0, iScrollIndex_int * lineHeight, 100, true);       //由于年份有0的值，所以年份下标可以从0开始
                        break;
                    case "monthWrapper":
                        iScroll_instance.monthWrapper = new iScroll("monthWrapper", cache_iScroll_callback[1]);
                        iScroll_instance.monthWrapper.refresh();
                        iScroll_instance.monthWrapper.scrollTo(0, iScrollIndex_int * lineHeight, 100, true);      //远程调用中的下标和原业务中的不一样，远程下标从0开始
                        break;
                    case "dayWrapper":
                        iScroll_instance.dayWrapper = new iScroll("dayWrapper", cache_iScroll_callback[2]);
                        iScroll_instance.dayWrapper.refresh();
                        iScroll_instance.dayWrapper.scrollTo(0, iScrollIndex_int * lineHeight, 100, true);        //远程调用中的下标和原业务中的不一样，远程下标从0开始
                        break;

                }

            }
            else {
                iScroll_instance.yearWrapper.scrollTo(0, parseInt(initY) * lineHeight, 100, true);
                if (/m/.test(timeType))iScroll_instance.monthWrapper.scrollTo(0, parseInt(initM) * lineHeight - lineHeight, 100, true); //原业务中的下标从1开始；
                if (/d/.test(timeType))iScroll_instance.dayWrapper.scrollTo(0, parseInt(initD) * lineHeight - lineHeight, 100, true);   //原业务中的下标从1开始；
            }
        };

        CreateDateUI();
        CreateUL();
        calcPluginSize();
        init_iScroll_instance();              //初始化iscrll
        bind_iScroll_instance();              //绑定iscroll对象
        extendOptions();                      //显示控件
        RMTClickEvent.refreshDate(); //每次show出插件时，重新获取上次的数值，并滚动到指定位置
        bindButton();                         //绑定按钮事件

        function resetInitDate()
        {
            var val = "";
            if(docType)
            {
                val = that.value;
            }
            else
            {
                val = that.innerText;
            }

            if (!opts.curdate)
            {
                return false;
            }

            else if (val === "")
            {
                return false;
            }
            var getVal = val.toString();

            //匹配最后2个数，如果包含"-"就返回真，不包含就返回假；
            var arrVal = getVal.split('-');
            initY = arrVal[0].substr(2, 2);
            initM = arrVal[1];
            initD = arrVal[2];

        }

        function bindButton()
        {
            element.dateConfirm.onclick = function ()
            {
                RMTClickEvent.dateConfirmClickEvent();
                win.sendRMTEventToApp('RMTClickEvent.dateConfirmClickEvent', "");
            };
            element.dateCancel.onclick = function ()
            {
                RMTClickEvent.dateCancelClickEvent();
                win.sendRMTEventToApp('RMTClickEvent.dateCancelClickEvent', "");
            };
        }

        win.RMTClickEvent.dateCancelClickEvent = function ()
        {
            var dateShadow = element.dateShadow;
            var datePage = element.datePage;
            dateShadow.parentNode.removeChild(dateShadow);
            datePage.parentNode.removeChild(datePage);
        };

        win.RMTClickEvent.dateConfirmClickEvent = function ()
        {
            var indexY = element.year_ul.getElementsByTagName("li")[iScroll_instance_index[0]];
            var yearStr = indexY ? indexY.innerText.substr(0, indexY.innerText.length - 1) : null;

            if (/m/.test(timeType))
            {
                var indexM = element.month_ul.getElementsByTagName("li")[iScroll_instance_index[1]];
                var monthStr = indexM ? indexM.innerText.substr(0, indexM.innerText.length - 1) : null;
            }

            if (/d/.test(timeType))
            {
                var indexD = element.day_ul.getElementsByTagName("li")[iScroll_instance_index[2]];
                var dayStr = indexD ? indexD.innerText.substr(0, indexD.innerText.length - 1) : null;
            }

            var dateStr = yearStr + "-" + monthStr + "-" + dayStr;

            if (docType) {
                switch (timeType)
                {
                    case 'y':
                        that.value = yearStr;
                        break;
                    case 'm':
                        that.value = monthStr;
                        break;
                    case 'd':
                        that.value = dayStr;
                        break;
                    case 'ym':
                        that.value = yearStr + '-' + monthStr;
                        break;
                    case 'md':
                        that.value = monthStr + '-' + dayStr;
                        break;
                    default :
                        that.value = dateStr.trim();
                        break;
                }
            }
            else
            {
                switch (timeType)
                {
                    case 'y':
                        that.innerText = yearStr;
                        break;
                    case 'm':
                        that.innerText = monthStr;
                        break;
                    case 'd':
                        that.innerText = dayStr;
                        break;
                    case 'ym':
                        that.innerText = yearStr + '-' + monthStr;
                        break;
                    case 'md':
                        that.innerText = monthStr + '-' + dayStr;
                        break;
                    default :
                        that.innerText = dateStr.trim();
                        break;
                }
            }

            var dateShadow = element.dateShadow;
            var datePage = element.datePage;
            dateShadow.parentNode.removeChild(dateShadow);
            datePage.parentNode.removeChild(datePage);
        };

        function extendOptions()
        {
            element.dateShadow.style.display = "block";
            element.datePage.style.display = "block";
        }

        //日期滑动
        function init_iScroll_instance()
        {
            var instanceLen = timeType.length;
            for (var i = 0; i < instanceLen; i++)
            {
                cache_iScroll_callback[i] = (function (j)
                {
                    return {
                        snap: "li",
                        vScrollbar: false,
                        hScrollbar: false,
                        checkDOMChanges: true,
                        hScroll: false,
                        onBeforeScrollStart: function (e)
                        {
                            e.preventDefault();
                        },
                        onScrollMove: function ()
                        {
                            resetStyle(iScroll_instance_name[j]);
                        },
                        onScrollEnd: function ()
                        {
                            iScroll_instance_index[j] = (this.y / lineHeight) * (-1) + spaceTagInPerHead;
                            var curScroll = document.getElementById(iScroll_instance_name[j]);
                            if (curScroll)              //防止点击确定后，元素删除而找不到指定ID的 报错
                            {
                                var lis = curScroll.getElementsByTagName("li");
                                lis[iScroll_instance_index[j] - 2].style.transform = "rotateX(30deg)";
                                lis[iScroll_instance_index[j] - 1].style.transform = "rotateX(15deg)";
                                setStyle(lis[iScroll_instance_index[j]], css.markStyle);
                                lis[iScroll_instance_index[j] + 1].style.transform = "rotateX(-15deg)";
                                lis[iScroll_instance_index[j] + 2].style.transform = "rotateX(-30deg)";
                                win.sendRMTEventToApp("RMTClickEvent.refreshDate", [iScroll_instance_name[j], iScroll_instance_index[j] - 2]);
                            }
                        }
                    }
                }(i));
            }
        }

        function bind_iScroll_instance()
        {
            iScroll_instance.yearWrapper = new iScroll("yearWrapper", cache_iScroll_callback[0]);
            if (/m/.test(timeType))
            {
                iScroll_instance.monthWrapper = new iScroll("monthWrapper", cache_iScroll_callback[1]);
            }
            if (/d/.test(timeType))
            {
                iScroll_instance.dayWrapper = new iScroll("dayWrapper", cache_iScroll_callback[2])
            }
        }

        function CreateUL()
        {
            element.year_ul = doc.getElementById("yearWrapper").getElementsByTagName("ul")[0];
            element.month_ul = doc.getElementById("monthWrapper").getElementsByTagName("ul")[0];
            element.day_ul = doc.getElementById("dayWrapper").getElementsByTagName("ul")[0];
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

            if (timeType)
            {
                switch (timeType)
                {
                    case 'y':
                        element.year_ul.innerHTML = createYEAR_UL();
                        break;
                    case 'm':
                        element.month_ul.innerHTML = createMONTH_UL();
                        break;
                    case 'd':
                        element.day_ul.innerHTML = createDAY_UL();
                        break;
                    case 'ym':
                        element.year_ul.innerHTML = createYEAR_UL();
                        element.month_ul.innerHTML = createMONTH_UL();
                        break;
                    case 'md':
                        element.month_ul.innerHTML = createMONTH_UL();
                        element.day_ul.innerHTML = createDAY_UL();
                        break;
                    default :
                        element.year_ul.innerHTML = createYEAR_UL();
                        element.month_ul.innerHTML = createMONTH_UL();
                        element.day_ul.innerHTML = createDAY_UL();
                        break;
                }
            }
        }

        function calcPluginSize()
        {
            //标签创建之后，获取每一个行的行高；
            lineHeight = element.dateScroll.getElementsByTagName('ul')[0].getElementsByTagName('li')[0].offsetHeight;

            //设置mark高度；
            setStyle(element.middleMark, {
                height: lineHeight + 6,
                top: lineHeight * spaceTagInPerHead - 3
            });
            setStyle(element.topMark, {
                height: lineHeight - 3
            });
            setStyle(element.bottomMark, {
                height: lineHeight - 3
            });
            setStyle(element.dateScroll, {
                height: lineHeight * maxLine
            });
            setStyle(element.datePage, {
                height: element.dateTitle.offsetHeight + element.dateScroll.offsetHeight + element.setCancel.offsetHeight,
                width: Math.floor(body.offsetWidth * 0.8)
            });
            setStyle(element.datePage, {
                top: (body.offsetHeight - element.datePage.offsetHeight) / 2
            });

        }


        function CreateDateUI()
        {
            var str = '' +
                    //'<div id="dateshadow"></div>' +
                    //'<div id="datePage" class="page">' +
                '<div id="dateTitle"><h1>请选择日期</h1></div>' +
                '<div id="dateScroll">' +
                '<div id="topMark"></div>' +
                '<div id="middleMark"></div>' +
                '<div id="bottomMark"></div>' +
                '<div id="yearWrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="monthWrapper">' +
                '<ul></ul>' +
                '</div>' +
                '<div id="dayWrapper">' +
                '<ul></ul>' +
                '</div>' +
                '</div>' +
                '<div id="setCancel">' +
                '<button id="dateConfirm">确定</button>' +
                '<button id="dateCancel">取消</button>' +
                '</div>';
            //'</div>';
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


        //创建 --年-- 列表
        function createYEAR_UL()
        {
            var str = calcHeadSpaceTag();
            for (var i = opts.beginyear; i <= opts.endyear; i++)
                str += '<li>' + i + '年</li>';

            return str + calcHeadSpaceTag();
        }

        //创建 --月-- 列表
        function createMONTH_UL()
        {
            var str = calcHeadSpaceTag();
            for (var i = opts.beginmonth; i <= opts.endmonth; i++)
                str += '<li>' + i + '月</li>';

            return str + calcHeadSpaceTag();

        }

        //创建 --日-- 列表
        function createDAY_UL()
        {
            var str = calcHeadSpaceTag();
            for (var i = opts.beginday; i <= opts.endday; i++)
                str += '<li>' + i + '日</li>';

            return str + calcHeadSpaceTag();
        }


        function resetStyle(id)
        {
            var curScroll = doc.getElementById(id);
            var lis = curScroll.getElementsByTagName('li');
            var i = lis.length;
            while (i--) setStyle(lis[i], css.defaultStyle);
        }


        function calcHeadSpaceTag()
        {
            var headTag = '';
            if (spaceTagInPerHead == 1)
                headTag = "<li>&nbsp;</li>";
            else
                headTag = "<li>&nbsp;</li><li>&nbsp;</li>";

            return headTag;
        }

        function extend(des, src)
        {
            for (var j in src) {
                if (src.hasOwnProperty(j)) des[j] = src[j];
            }
            return des;
        }

        function setStyle(element, obj)
        {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) element.style[prop] = obj[prop];
            }
        }
    }
})();

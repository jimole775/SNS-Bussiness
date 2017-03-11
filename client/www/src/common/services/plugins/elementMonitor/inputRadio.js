/**
 * Created by Andy on 2016/8/18.
 */
(function () {

    /*************************************************************
     * 修改radio或者checkbox的样式；通过tool，输入父级ID和修改类型调用
     * 拼接字串类型专用，
     *************************************************************/
    CommonTool.prototype.inputStyleModify = function (boxid, type)
    {
        var inputs, len, i, curLabel;

        inputs = $("#" + boxid).find("input");
        len    = inputs.length;
        i      = 0;

        while (i < len)
        {
            curLabel = $(inputs[i]).parents("label");
            curLabel.addClass("checkbox");

            //避免每次调用函数都添加i标签
            if (!$(inputs[i]).next("i").length) curLabel.append("<i></i>");

            if(inputs[i].checked === true)
                $(inputs[i]).parents("label").removeClass("checkbox").addClass("checkbox-new");

            $(inputs[i]).on('change', function (event)
            {
                var curInput = event.currentTarget;
                var $curInput = $(curInput);
                var inputName = $curInput.prop("name");
                var $label = $curInput.parents("label");
                if (type === "radio")           //radio类型每次点击, 就重置所有input为unchecked
                {
                    $("input[name='" + inputName + "']").each(function (index, item) {
                        var eachLabel = $(item).parents("label");
                        eachLabel.removeClass("checkbox-new").addClass("checkbox");
                    });

                    if (curInput.checked) $label.removeClass("checkbox").addClass("checkbox-new");
                }
                if (type === "checkbox")
                {
                    if (curInput.checked)
                        $label.removeClass("checkbox").addClass("checkbox-new");
                    else                        //点击的时候，反置input的checked值
                        $label.removeClass("checkbox-new").addClass("checkbox");
                }
            });
            i++;
        }
    };

    var win = window;
    var selectHandler = null;
    var radioHandler = null;
    var checkboxHandler = null;
    /*************************************************************
     * 预定义函数方法；body加载完成之后再逐一调用
     *************************************************************/
    $(document).ready(function ()
    {
        /*************************************************************
         套接字类型的调用函数,监听事件绑在 select 标签上
         *************************************************************/
        selectHandler = function() {
            var $oSelectbox = $("select");
            $oSelectbox.each(function (index, select) {

                $(select).on("change", function (event)
                {
                    var $currentTarget = $(event.currentTarget);
                    var selectID = $currentTarget.prop("id");
                    global.RMTSelected_ForStringContact(selectID);
                });

            });

            win.global.RMTSelected_ForStringContact = function (selectId)
            {
                var options = $("#" + selectId).find("option");
                var selectedOption = (function () {
                    var el, i = options.length;
                    while (i--)
                        if (options[i].selected === true) {
                            el = options[i];
                            break;
                        }
                    return el;
                })();

                var selectedOptionIndex = $(options).index(selectedOption);               //计算被选择的值的下标;
                var params = [selectId, selectedOptionIndex];
                win.sendRMTEventToApp("RMTClickEvent.RMTOption_ClickEvent", params);          //发送ID和点击的元素的下标
            };

            win.RMTClickEvent.RMTOption_ClickEvent = function (selectId, selectedOptionIndex)
            {
                var selectedOptionIndex_int = parseFloat(selectedOptionIndex);
                var options = $("#" + selectId).find("option");
                options[selectedOptionIndex_int].selected = true;
            }

        };

        
        /*************************************************************
         
         *************************************************************/
        radioHandler = function()
        {
            var $oRadios = $("input[type='radio']");
            $oRadios.each(function (index, radio) {
                var $radio  = $(radio);
                var inputid = $radio.prop("id");                                        //如果标签上已经有了ID,就不用添加ID,防止其他地方引用错误;
                if (!inputid) radio.id = "oRadioID" + index;

                $radio.on("change", function (event)
                {
                    var curTag = event.currentTarget;
                    win.RMTClickEvent.RMTRadio_ClickEvent(curTag.id);
                });
            });

            win.RMTClickEvent.RMTRadio_ClickEvent = function (ipnutid)
            {
                var checkRadio = $("#" + ipnutid);
                if(global.RMTID.role == "1") checkRadio.click();
            };

        };

        
        /*************************************************************
         
         *************************************************************/
        checkboxHandler = function() {
            var $oCheckbox = $("input[type='checkbox']");
            $oCheckbox.each(function (index, checkbox){
                var $checkbox = $(checkbox);
                var inputid   = $checkbox.prop("id");                              //如果标签上已经有了ID,就不用添加ID,防止其他地方引用错误;
                if (!inputid) checkbox.id = "oCheckID" + index;

                $checkbox.on("change", function (event){
                    var curTag = event.currentTarget;
                    win.RMTClickEvent.RMTChecked_ClickEvent(curTag.id);
                });
            });

            win.RMTClickEvent.RMTChecked_ClickEvent = function (ipnutid) {
                var checkRadio = $("#" + ipnutid);
                if(global.RMTID.role == "1") checkRadio.click();                       //只有业务机才执行click()方法，如果本地也执行，那么就会触发2次点击；
            };

        };


        /*************************************************************
         以下两个方法是补充给拼接字串元素的，因为他们诞生的事件不确定，只能在
         在拼接字串里面手动补全事件；
         执行逻辑为：---本地事件触发，把当前 input ID号和checked状态 发送给
         远程端，当远程端收到并执行时，比对当前的checked值状态，如果不相同，
         立即执行一次click()事件；
         触发规则：---由于有时可能需要使用label点击修改checked，所以，使用
         onchange事件对input元素进行监听；
         *************************************************************/
        win.RMTClickEvent.RMTChecked_ForStringContact = function (tagid,checkStatus)
        {
            if(global.RMTID.role == "1"){
                var _checkStatus = typeof checkStatus === "string" ? eval(checkStatus) : checkStatus;
                var $tag = $("#" + tagid);
                if($tag[0].checked != _checkStatus) $tag.click();
            }
        };
    });

    /*************************************************************
     * 预定义函数方法；body加载完成之后再逐一调用
     *************************************************************/
    $("body").ready(function (){
        selectHandler();
        radioHandler();
        checkboxHandler();
    });

})();
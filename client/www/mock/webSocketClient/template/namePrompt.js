/**
 * Created by Andy on 2017/3/21.
 */
(function ($) {
    var win = window;
    var doc = document;

    var template = [
        '<div id="userNameFrame" class="user-name-frame">' +
        '<div class="table-cell-center">' +
        '<label for=""><input type="text" id="userName" style="text-align:center; font-size: 1.6rem" placeholder="取个牛逼点的名字" class="disable-plugin"/></label>' +
        '<label for=""><input type="button" style="width: 6rem;text-align: center;margin-left: 1rem;" id="userNameBtn" class="item-button disable-plugin" value="确定"></label>' +
        '</div>' +
        '</div>'
    ].join("");

    $("body").append(template);
    $("#bodyInit").text("");

    setTimeout(function () {
        $("#carLogo")[0].style.filter = "blur(3px)";
        $("#userNameBtn").on("click", function () {
            var input = $("#userName");

            if (!win.global.ws)win.global.ws = new WebSocket("ws://127.0.0.1:81");

            if (input.val()) {
                if (getUserList().indexOf(input.val()) >= 0) {
                    tool.warnTip("#userName", "那么帅气的名字已经被抢了");
                    return;
                }
                $("#userNameFrame").hide();
                $("#carLogo")[0].style.filter = "blur(0)";
                global.ws.tool.getUserName(input.val());
                global.ws.send(0x01);
            } else {
                tool.warnTip("#userName", "不支持黑户");
                input[0].placeholder = "请先取一个名字！";
            }
        });
    }, 500);

     function getUserList() {
        var result = [];
        $("#friendList").find("li").each(function (index, item) {
            if (item.children.length && !item.innerText) {
                if (item.children.length > 1 && !item.children.innerText) {
                    Array.prototype.forEach.call(item.children, function (_index, _item) {
                        if (_item.innerText)result.push(_item.innerText);
                    });
                } else {
                    result.push(item.children.innerText);
                }
            } else {
                result.push(item.innerText);
            }
        });

        return result;
    }

})(jQuery);
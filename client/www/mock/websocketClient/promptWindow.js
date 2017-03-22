/**
 * Created by Andy on 2017/3/21.
 */
(function ($) {
    var win = window;
    var doc = document;

    var template = [
        '<div id="userNameFrame" class="user-name-frame">' +
        '<div class="table-cell-center">' +
        '<label for=""><input type="text" id="userName" style="font-size: 1.6rem" placeholder="取个牛逼点的名字" class="disable-plugin"/></label>' +
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
            if (input.val()) {
                if (getUserList().indexOf(input.val()) >= 0) {
                    input[0].placeholder = "那么优秀的名字已经被抢了！";
                    return;
                }
                win.global.RMTID.userName = input.val();
                $("#userNameFrame").hide();
                $("#carLogo")[0].style.filter = "blur(0)";

                global.ws.send(0x00);
            } else {
                tool.warnTip("#userName", "不支持黑户");
                input[0].placeholder = "请先取一个名字！";
            }
        });
    }, 500);


    function getUserList() {
        var result = [];
        $("#friendList").find("li").each(function (index,item) {
            if (item.children.length && !item.innerText) {
                result.push(item.children.innerText);
            } else {
                result.push(item.innerText);
            }
        });

        return result;
    }

})(jQuery);
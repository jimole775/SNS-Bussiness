/**
 * Created by Andy on 2017/3/21.
 */
(function ($) {
    var win = window;
    var doc = document;

    var template = [
        '<div id="userNameFrame" style="position: absolute;top:0;left:0;display: table;width:100%;height:100%;background-color: rgba(100,100,100,.5);z-index:10000;">' +
        '<div style="display: table-cell;vertical-align: middle;text-align: center;font-size: 20px">' +
        '<label for=""><input type="text" id="userName" placeholder="取个牛逼点的名字" class="disable-plugin"/></label><input type="button" id="userNameBtn" class="item-button disable-plugin" value="确定"></div>' +
        '</div>'
    ].join("");

    $("body").append(template);
    setTimeout(function () {
        $("#userNameBtn").on("click", function () {
            var input =  $("#userName");
            if (input.val()) {
                win.global.RMTID.userName = input.val();
                $("#userNameFrame").hide();
                input[0].placeholder = "取个牛逼点的名字！";
            }else{
                tool.warnTip("#userName","不支持黑户");
                input[0].placeholder = "请先取一个名字！";
            }
        });
    }, 500);
})(jQuery);
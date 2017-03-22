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
})(jQuery);
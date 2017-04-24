/**
 * Created by Andy on 2017/2/13.
 */
(function () {
    var win = window;
    win.server = win.server ? win.server : {};

    /**
     * APP从服务器获取到数据，转发给Js
     * @param status str
     * @param response obj
     * @param callback str
     * */
    var cacheCallback = null;
    win.server.jsRecvServerData = function (status, response, callback) {
        cacheCallback = callback;    //在远程机子可以运行的情况下，先缓存好callback到内存，
        if (global.RMTID.role == 2) return;
        switch (status) {
            case "success":
                this.successHandle(response);
                break;
            case "timeout":
            case "error"://涵盖有服务器繁忙
                win.serverRequestCallback.refreshHandle(response);
                break;
        }
    };


    win.server.successHandle = function (response) {
        var jsonData = null;
        //如果CODETYPE == 0，就是数据查询成功，如果是1，就是数据查询失败！
        if (response.CODETYPE == '0') {
            /**先从CODEDATA里面拿出数据，
             * 转成asc码，然后再解base64，解出来的是字串，
             * 然后再判断是否是json类型，
             * */
            jsonData = getBse64Decode(tool.hex2a(response.CODEDATA));
            jsonData = typeof jsonData === "string" && jsonData.match(/^[\{\[]/) ? JSON.parse(jsonData) : jsonData;

            //统一使用apply调用，所以先把params整合成数组形式
            var params = cacheCallback.params || [];
            Array.prototype.unshift.call(params, jsonData);

            cacheCallback.apply(null, params);

            console.log("服务器数据：", JSON.stringify(jsonData), "服务器回调:", params);
        }

        //如果服务器查询失败，就绑定消极回调，如果未定义消极回调，就简单给出提示
        else {
            tool.alert("服务器响应失败:" + response.CODEDATA, function () {
                cacheCallback.retryFn[1] ? cacheCallback.retryFn[1].apply(null, cacheCallback.params) : "";
            });
        }
    };

    win.serverRequestCallback.refreshHandle = function (response) {
        /**超时回调处理：
         * 如果回调参数传过来的是数组，就是两个函数实体
         * 如果回调参数穿过来的是函数，就是一个函数，直接调用
         * */
        var callbackParams = cacheCallback.params || [];
        var retryFn = cacheCallback.retryFn || [];
        if (retryFn instanceof Array) {
            switch (retryFn.length) {
                case 0:
                    break;
                case 1:
                    tool.alert(response,
                        function () {
                            retryFn[0].apply(null, callbackParams);
                        }
                    );
                    break;
                case 2:
                    tool.alert([response, "重试", "取消"],
                        function () {
                            retryFn[0].apply(null, callbackParams);
                        },
                        function () {
                            retryFn[1].apply(null, callbackParams);
                        }
                    );
                    break;

            }
        }else if(retryFn instanceof Function){
            retryFn.apply(null, callbackParams);
        }
    };

})();
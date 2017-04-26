
/**
 * 服务器数据出口，
 * @serverType string :根据服务端需求定义
 * @dataType obj :根据服务端需求定义
 * @dataPack obj :根据服务端需求定义,一般这个参数需要动态计算
 * @callback function :回调函数，可以通过server.addRetryFn和server.addCallbackParam两个方法添加需要的东西
 * */
win.server.request = function(serverType, dataType, dataPack, callback){};

/**
 * 服务器数据出口样例
 * */
win.server.request(
    "102",
    {
        key: "CHANNEL_SUPPORT",
        cartype: "honda"
    },
    {pid:["00000001","00000002"]},

    //addRetryFn，添加请求超时的之后的行为，参数以数组的形式传入，运行完毕之后 return 第一个参数，第二个参数会作为第一个参数的属性,属性名【retryfn】
    win.server.addRetryFn(

        //addCallbackParam，运行完毕之后最终会return 第一个参数，第二个参数会作为第一个参数的属性,属性名【params】
        win.server.addCallbackParam(
            win.serverRequestCallback.CHANNEL_SUPPORT,
            []
        ),

        //第一个是【重试】按钮的事件，第二个是【取消】按钮的事件,由tool.alert()方法进行绑定
        [function(){}, function(){}]
    )
);



/**
 * 服务器数据入口，
 * @status string :有三种状态 - 1，success(成功) 2，timeout(超时) 3, error(错误)
 * @response obj :服务器返回的数据，固定格式为：{CODETYPE:"0/1",CODEDATA:"base64"}
 * @callback function :回调函数,
 *                    :如果在数据出口处,使用了server.addCallbackParam（），这时候callback会有一个属性params
 *                    :如果在数据出口处,使用了server.retryFn（），这时候callback会有一个属性retryFn
 * */
win.server.jsRecvServerData = function (status, response, callback){};

/**
 * Created by Andy on 2017/3/20.
 */
(function(){
    /**
     * 发送数据到设备
     * */
    win.devService.sendDataToDev = function (varSendData) {
        if (global.RMTID.role == 2) return;                    //如果是控制机，和设备无交互行为
        external.SendJsDataToDev(varSendData);
        console.log('发送命令到 DEV: ' + varSendData);
    };

})();
/**
 * Created by Andy on 2017/3/20.
 */
/**
 * Created by Andy on 2016/3/7.
 */
(function () {

    var win = window;

    /**
     * 接收来至设备的数据
     * @params varAction
     * @params varRecvData
     * */
    win.jsRecvDeviceData = function (varAction, varRecvData) {
        switch (parseInt(varAction)) {
            case 1:
                deviceData((varRecvData || "").toString());
                break;
        }
    };

    /**
     *解析设备数据
     * Fun009B(varRecvData);         //读取硬件版本应答
     * Fun5104(varRecvData);         //启动OBD应答
     * Fun7109(varRecvData);         //业务流程
     ***/
    function deviceData(varRecvData) {
        var funcStr = 'Fun' + varRecvData.substr(0, 4);
        var func = win.devService[funcStr];
        if (func instanceof Function)func(varRecvData);

        console.log("设备数据：" + varRecvData);
    }

    /**
     *解析设备数据
     * Fun009B(varRecvData);         //读取硬件版本应答
     * Fun5104(varRecvData);         //启动OBD应答
     * Fun7109(varRecvData);         //业务流程
     ***/
    win.devService.Fun009B = function (varRecvData) {
        var strDEVID = varRecvData.substr(4, 16 * 2);    //'硬件ID:'
        var strVersion = varRecvData.substr(4 + 16 * 2, 6 * 2);    //'程序版本:'

        win.devService.sendDataToDev("110401");	                                        //发送启动OBD诊断指令
        //tool.processBar('正在启动设备');
    };

    //诊断项目指令集和 7109xx;
    win.devService.Fun7109 = function (varRecvData) {
        var cmdStr = varRecvData.substr(0, 6);
        var _func = "";
        switch (cmdStr) {
            case "710901": 	//连接OBD系统
            case "710905":	//故障码
            case "710906":	//故障码
            case "710914":	//故障码
            case "710981":	//连接OBD失败
            case "710985":	//故障码失败
            case "710986":	//故障码失败
            case "710994":	//故障码失败
            case "710902":	//断开OBD系统
            case "710982":	//断开失败
            case "710907":	//车辆系统模块细节
            case "710987":  //诊断的指令区分:710901_pro 710901_simp
                if (global.businessInfo.diagType) {_func = "Fun" + cmdStr + "_" + global.businessInfo.diagType;}
                else { _func = "Fun" + cmdStr }
                break;
            default :
                _func = "Fun" + cmdStr;
                break;
        }

        var func = win.devService[_func];

        if (func instanceof Function) func(varRecvData);
    };

    //执行退出指令
    win.devService.Fun7109FF = function (varRecvData) {
        console.log("退出指令", varRecvData);
    };

    //设备检查结果	0x3106+0x14(安全卡检查)+01(成功)/02(失败),只执行结果，不需要回应设备
    win.devService.Fun310614 = function (varRecvData) {
        var strCommand = varRecvData.substr(6, 2);
        var strShowMsg = '';

        if (strCommand == '01') {
            tool.loading({text: "设备正在尝试连接汽车..."});
            strShowMsg = '设备检查成功';
            document.getElementById("ShowMessage").style.display = "none";
        }
        else if (strCommand == '02') {
            tool.loading(0);
            strShowMsg = '设备检查失败';
        }

        tool.log(strShowMsg);
    };

    win.devService.Fun2107 = function (varRecvData) {
        console.log("上传文件", varRecvData);
    }
})();
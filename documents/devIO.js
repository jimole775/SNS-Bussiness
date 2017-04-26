/**
 * 设备指令入口，由APP端进行推送
 * @varAction number :端口号，现阶段没有什么意义，无需留意
 * @varRecvData number :数字类型的字符串，代表16进制
 *                     :一般收到的指令类型有 009B开头， 5104开头， 7109开头
 *                     :收到设备端指令之后，会截取前4位，然后组成 【Fun7109】 的形式，
 *                     :通过 win.devService["Fun7109"] 的形式调用已经定义好的函数，然后再进行具体的业务分派
 * */
win.jsRecvDeviceData = function (varAction, varRecvData) {};

/**
 * 业务分派样例：
 * 7109类型指令的分派逻辑
 * 最后分派的函数类似于 window.devService.Fun710901() ,
 * 这些函数已经在业务分区里面定义好，
 * 现在的操作相当于把设备指令当成一个触发器
 * */
win.devService.Fun7109 = function (varRecvData) {
    var cmdStr = varRecvData.substr(0, 6);
    var _func = "";
    switch (cmdStr) {
        case "710901": 	//连接OBD系统
        case "710981":	//连接OBD失败

        case "710905":	//历史故障码
        case "710906":	//当前故障码
        case "710914":	//带状态的故障码

        case "710985":	//没有历史故障码
        case "710986":	//没有当前故障码
        case "710994":	//没有带状态的故障码

        case "710902":	//断开OBD系统成功
        case "710982":	//断开OBD系统失败

        case "710907":	//清除故障码成功
        case "710987":  //清除故障码失败

            //需要注意的是，如果是诊断业务，需要区分手动（专业），还是自动（简易）类型
            //也就是在【Fun710901】后面加上一个标识【_pro】 【_simp】
            //手动（专业）诊断：Fun710901_pro
            //自动（简易）诊断：Fun710901_simp
            if (global.businessInfo.diagType) {_func = "Fun" + cmdStr + "_" + global.businessInfo.diagType;}
            else { _func = "Fun" + cmdStr }
            break;
        default :
            _func = "Fun" + cmdStr;
            break;
    }

    //最后拼装函数
    var func = win.devService[_func];

    if (func instanceof Function) func(varRecvData);
};
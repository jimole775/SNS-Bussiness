/**
 * Created by tapes on 2015/7/7.
 */


(function () {

    var win = window;
    win.external = win.external ? win.external : {};
    win.external.RequestDataFromServer = function (command, sendDataStr, callbackId, paramFromRMT) {
            var sendData = JSON.parse(sendDataStr);
            var paramsObj = sendData.data;
            var ServerType = paramsObj[0].ServerType;
            var DataType = paramsObj[1].DataType;
            var DataPackSTr = getBse64Decode(paramsObj[2].DataPack);
            var DataPack = JSON.parse(DataPackSTr);

            var resultObj;

            //如果是600类型,就是新保养复位解析supid项目;
            /*var dataPack = {
             dbfilename: global.businessInfo.dbFilename,
             pub: global.businessInfo.pubFilename,
             requestDataType: requestType,//01,02,03构造的数据不相同,01代表所有的supid依次罗列,02代表只有开始和结束的一个区间,03代表组,只有1个8位的字符
             carType: global.businessInfo.carType,
             supids: supids
             };*/
            if (ServerType == "600") {
                if (DataPack.requestDataType == "03") {
                //构造组数据
                    resultObj = {};
                    var groupContext = {
                        "00000001": {
                            "00000000": "组1_随便内容0",
                            "00000006": "组1_随便内容6",
                            "00000007": "组1_随便内容7",
                            "00000008": "组1_随便内容8",
                            "00000001": "组1_随便内容1",
                            "00000002": "组1_随便内容2",
                            "00000003": "组1_随便内容3",
                            "00000004": "组1_随便内容4",
                            "00000005": "组1_随便内容5",
                            "00000009": "组1_随便内容9"
                        },
                        "00000002": {
                            "00000000": "组2_随便内容0",
                            "00000001": "组2_随便内容1",
                            "00000002": "组2_随便内容2",
                            "00000004": "组2_随便内容4",
                            "00000005": "组2_随便内容5",
                            "00000006": "组2_随便内容6",
                            "00000003": "组2_随便内容3",
                            "00000007": "组2_随便内容7"
                        },
                        "00000003": {
                            "00000000": "组3_随便内容0",
                            "00000002": "组3_随便内容2",
                            "00000003": "组3_随便内容3",
                            "00000001": "组3_随便内容1",
                            "00000004": "组3_随便内容4"
                        }
                    };
                    resultObj.supids = groupContext[DataPack.supids];
                } else {
                    //构造普通提示框,输入框数据

                    var serviceSupidMap = ["00000011", "00000022", "00000033", "00000001","00000002","00000003","00000004", "00000005", "00000006", "00000007", "00000008", "00000009", "0000000a"];
                    var supidCorrespondTextMap = [
                        "按钮1",
                        "按钮2",
                        "按钮3",
                        "随便内容1\\r\\n上大声答道随便asd内容11\\r\\n上大声答道随asd便内容1\\r\\n上大声答道随便aw内容1\\r\\n上大声答道q23随便内容1\\r\\n上大声答道234随便内容1\\r\\n上大声答道随便sf内容1\\r\\n上大声答道随asd内容1\\r上大声答道grh随便w内容1\\r上大声答道随便qwe内容1\\r上大声答fh道随便3内容1\\r上大声答道随便daw内容1\\r上大声答道df随f便内容1\\r上大声答道g随gh便内容1\\r上大声答道随wsad便内容1\\n上大声答道gsd随12便内容1\\n上大声答3道gf随便内容1\\n上大声答gsd道随便sad内容1\\n上大声答 道",
                        //"随便内容1",
                        "随便内容6",
                        "随便内容7",
                        "随便内容8",
                        "随便内容9",
                        "随便内容a"
                    ];
                    var supidArr = DataPack.supids || [];
                    var len = supidArr.length;
                    resultObj = {};
                    resultObj.supids = {};
                    for (var i = 0; i < len; i++) {

                        for (var j = 0; j < serviceSupidMap.length; j++) {
                            if (supidArr[i] === serviceSupidMap[j]) {
                                resultObj.supids[serviceSupidMap[j]] = supidCorrespondTextMap[j];  //输出格式为:{supids:{"00000001":"按钮1"}}
                            }
                        }
                    }
                }
            }

            if (ServerType == "601") {
                resultObj = getSpecFunPid();
            }
            if (ServerType == "1001"){
                resultObj = getCarBand(DataPack);
            }
            if (DataType.key) {
                switch (DataType.key) {
                    case 'CTYPE':
                        resultObj = getCTYPE(DataPack);
                        break;
                    case 'SYS':
                        resultObj = getSystem();
                        break;
                    case 'CALC_VER_SUPPORT':
                        resultObj = getCALC_VER_SUPPORT(DataPack);
                        break;
                    case 'CALC_VER':
                        resultObj = getCALC_VER(DataPack);
                        break;
                    case 'DTC':
                        resultObj = getDTC(DataPack);
                        break;
                    case 'FREEZE_DTC':
                        resultObj = getFreezeDTC(DataPack);
                        break;
                    case 'FREEZE_SUPPORT':
                        if (DataPack.pids) {
                            resultObj = getFreezeSupport_Pid();
                        } else if (DataPack.pakids) {
                            resultObj = getFreezeSupport_Pakid();
                        }
                        break;
                    case 'FREEZE_RESULT':
                        resultObj = getFreezeResult();
                        break;
                    case 'FREEZE_PAKID':
                        resultObj = getFreezePid();
                        break;
                    case 'EGOS_GROUP':
                        resultObj = getEGOS_GROUP();
                        break;
                    case 'EGOS_SUPPORT':
                        resultObj = getEGOS_SUPPORT();
                        break;
                    case 'EGOS_RESULT':
                        resultObj = getEGOS_RESULT();
                        break;
                    case 'CALC_ONE_GROUP':
                        resultObj = getCALC_ONE_GROUP();
                        break;
                    case 'CALC_ONE_SUPPORT':
                        resultObj = getCALC_ONE_SUPPORT();
                        break;
                    case 'BASE_ADJUST_SUPPORT':
                        resultObj = getBASE_ADJUST_SUPPORT();
                        break;
                    case 'CHANNEL_SUPPORT':
                        resultObj = getCHANNEL_SUPPORT();
                        break;

                    case 'CHANNEL_DATA':
                        resultObj = getCHANNEL_DATA();
                        break;
                    case 'BASE_ADJUST':
                        resultObj = getBASE_ADJUST();
                        break;
                    case 'CALC_ONE':
                        resultObj = getCALC_ONE();
                        break;
                    case 'ORGAN_TEST':
                            if(!DataType.groupName)
                            resultObj = getORGAN_TEST_GROUP();

                            else
                            resultObj = getORGAN_TEST();
                        break;
                    default :
                        console.log("未模拟的服务器指令:" + DataType.key + "," + paramsObj);
                        return;
                }
            }
            setTimeout(function () {
                window.jsRecvServerData('2', JSON.stringify({
                    'CODETYPE': 'OK',
                    'CODEDATA': tool.asc2hex(getBse64Encode(JSON.stringify(resultObj)))
                }), callbackId, paramFromRMT);
            }, 1000);

        };

    win.external.SendRMTEventToApp = function(action, msg, params){};

    function getORGAN_TEST(){
        return {
            "from": "txt",
            "key": "ORGAN_TEST",
            "level": "1.2",
            "ecupids": 1,
            "groupName": "A",
            "itemcount": 1,
            "items": [
            {
                "groupName": "A",
                "groupitems": [
                    {
                        "index": "000048",
                        "appid": "",
                        "type": "5",
                        "group": "A",
                        "name": "废气再循环阀步进马达位置",
                        "danwei": "打开点火",
                        "supid": "00000001",
                        "pid": "00000005",
                        "pakid": "00000000",
                        "diagid": "000006",
                        "pakpos": "0000",
                        "fomula": "0005",
                        "fomulaname": "+;2B062FE92F07000000;-;2D062FE92F07000000;退出;042FE92F00000000"
                    },
                    {
                        "index": "000049",
                        "appid": "",
                        "type": "5",
                        "group": "A",
                        "name": "TEN端子(数据线接头)",
                        "danwei": "打开点火",
                        "supid": "00000002",
                        "pid": "00000000",
                        "pakid": "00000000",
                        "diagid": "000000",
                        "pakpos": "0000",
                        "fomula": "0005",
                        "fomulaname": "关闭;052F17E107000000;打开;052F17E107010000;退出;042F17E100000000"
                    }
                ]
            }
        ]
        }
    }

    function getORGAN_TEST_GROUP(){
        return {
    "from": "txt",
    "key": "ORGAN_TEST",
    "level": "1.2",
    "ecupids": 0,
    "groupName": "",
    "itemcount": 3,
    "items": [
        {
            "groupName": "",
            "groupitems": [
                {
                    "index": "00003A",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "空调压缩机循环开关",
                    "danwei": "打开点火\\n打死打伤单位达",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0001",
                    "fomulaname": "关闭;052F17C607000000;打开;052F17C607010000;退出;042F17C600000000;"
                },
                {
                    "index": "00003B",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "发电机磁场电流控制占空比信号",
                    "danwei": "打开点火\\r大苏打奥万大啊",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0002",
                    "fomulaname": "062F16E807000000;"
                },
                {
                    "index": "00003C",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "额定转速(RPM)",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "000007D0",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0003",
                    "fomulaname": "+;2B062F096E07000000;-;2D062F096E07000000;退出;042F096E00000000;"
                },
                {
                    "index": "00003D",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "碳罐净化阀负荷",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000CCD",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0004",
                    "fomulaname": "2B062FE90907000000;"
                },
                {
                    "index": "00003E",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "燃油泵",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "关闭;052FE90607000000;打开;052FE90607010000;退出;042FE90600000000;"
                },
                {
                    "index": "00003F",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "燃油脉冲宽度 #1",
                    "danwei": "打开点火@%",
                    "supid": "00000000",
                    "pid": "0000001A",
                    "pakid": "00000000",
                    "diagid": "000005",
                    "pakpos": "0000",
                    "fomula": "0006",
                    "fomulaname": "+;2B052F17E007800000;-;2D052F17E007800000;退出;042F17E000000000;"
                },
                {
                    "index": "000040",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "发电机期望电压",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000400",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "+;2B062F097C07000000;-;2D062F097C07000000;退出;042F097C00000000"
                },
                {
                    "index": "000041",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "加热式废气氧传感器加热器(缸组1，传感器2)",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "关闭;052FE91A07000000;打开;052FE91A07010000;退出;042FE91A00000000"
                },
                {
                    "index": "000042",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "怠速空气控制",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000CCD",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "+;2B062FE90007000000;-;2D062FE90007000000;退出;042FE90000000000"
                },
                {
                    "index": "000043",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "进气管调节阀",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "关闭;052FE92507000000;打开;052FE92507010000;退出;042FE92500000000"
                },
                {
                    "index": "000044",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "喷油嘴1",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "活跃;062FE91E07000200;退出;042FE91E00000000"
                },
                {
                    "index": "000045",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "喷油嘴2",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "活跃;062FE91E07000400;退出;042FE91E00000000"
                },
                {
                    "index": "000046",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "喷油嘴3",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "活跃;062FE91E07000800;退出;042FE91E00000000"
                },
                {
                    "index": "000047",
                    "appid": "",
                    "type": "5",
                    "group": "",
                    "name": "喷油嘴4",
                    "danwei": "打开点火",
                    "supid": "00000000",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "活跃;062FE91E07001000;退出;042FE91E00000000"
                }
            ]
        },
        {
            "groupName": "A",
            "groupitems": [
                {
                    "index": "000048",
                    "appid": "",
                    "type": "5",
                    "group": "A",
                    "name": "废气再循环阀步进马达位置",
                    "danwei": "打开点火",
                    "supid": "00000001",
                    "pid": "00000005",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "+;2B062FE92F07000000;-;2D062FE92F07000000;退出;042FE92F00000000"
                },
                {
                    "index": "000049",
                    "appid": "",
                    "type": "5",
                    "group": "A",
                    "name": "TEN端子(数据线接头)",
                    "danwei": "打开点火",
                    "supid": "00000002",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "关闭;052F17E107000000;打开;052F17E107010000;退出;042F17E100000000"
                }
            ]
        },
        {
            "groupName": "B",
            "groupitems": [
                {
                    "index": "00004A",
                    "appid": "",
                    "type": "5",
                    "group": "B",
                    "name": "可变风扇负荷率",
                    "danwei": "打开点火@%",
                    "supid": "00000001",
                    "pid": "00000CCD",
                    "pakid": "00000000",
                    "diagid": "000006",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "+;2B062F091F07000000;-;2D062F091F07000000;退出;042F091F00000000"
                },
                {
                    "index": "00004B",
                    "appid": "",
                    "type": "5",
                    "group": "B",
                    "name": "进气歧管通路控制",
                    "danwei": "打开点火",
                    "supid": "00000002",
                    "pid": "00000000",
                    "pakid": "00000000",
                    "diagid": "000000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "关闭;052FE91507000000;打开;052FE91507010000;退出;042FE91500000000"
                }
            ]
        }
    ]
}
    }

    function getCHANNEL_SUPPORT() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "supportitems": [{
                "index": "000330-PUB",
                "appid ": " 0",
                "type": "3",
                "group": "000320",
                "name": "绝对节气门位置 B",
                "danwei": "百分比",
                "pid": "00004700",
                "pakid": "00000000",
                "diagid": "00000000",
                "pakpos": "0000",
                "fomula": "xxxxxx",
                "fomulaname": "xxxxxx"
            },{
                "index": "000331-PUB",
                "appid ": " 0",
                "type": "3",
                "group": "000320",
                "name": "绝对节气门位置 B",
                "danwei": "百分比",
                "pid": "00004700",
                "pakid": "00000000",
                "diagid": "00000000",
                "pakpos": "0000",
                "fomula": "xxxxxx",
                "fomulaname": "xxxxxx"
            },
                {
                    "index": "000332-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": "000320",
                    "name": "绝对节气门位置 B",
                    "danwei": "百分比",
                    "pid": "00004700",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"
                },
                {
                    "index": "000333-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "节气门执行器控制（TAC）指令",
                    "danwei": "百分比",
                    "pid": "00004c00",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"
                },
                {
                    "index": "000334-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                }, {
                    "index": "000335-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000336-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000337-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000338-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000339-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000340-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000341-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000342-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000343-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000344-PUB",
                    "appid ": " 0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },

                {
                    "index": "000345-PUB",
                    "appid ": " 0",
                    "type": "8",
                    "group": " 000320",
                    "name": "短期辅助氧传感器燃油修正－B4",
                    "danwei": "百分比",
                    "pid": "00005701",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                }
            ]

        }
    }

    function getCALC_ONE() {

        return {items:[{
            "index": "000330-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000331-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000332-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000333-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000334-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000335-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            ,  {
            "index": "000336-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000337-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            ,  {
            "index": "000338-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000339-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000340-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            , {
            "index": "000341-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            ,{
            "index": "000342-PUB",
            "name": "CCDP",
            "type": "1",
            "danwei": "L",
            "appid": "0001",
            "pid": "P0002",
            "diagid": "000003",
            "formula": "2",
            "formulaname": "abc",
            "ans": randomString(5)
        }
            ,
            {
                "index": "000343-PUB",
                "name": "CCDP",
                "type": "1",
                "danwei": "L",
                "appid": "0001",
                "pid": "P0002",
                "diagid": "000003",
                "formula": "2",
                "formulaname": "abc",
                "ans": randomString(5)
            }
            , {
                "index": "000344-PUB",
                "name": "CCDP",
                "type": "1",
                "danwei": "L",
                "appid": "0001",
                "pid": "P0002",
                "diagid": "000003",
                "formula": "2",
                "formulaname": "abc",
                "ans": randomString(5)
            },
            {
                "index": "000345-PUB",
                "name": "CCDP",
                "type": "1",
                "danwei": "L",
                "appid": "0001",
                "pid": "P0002",
                "diagid": "000003",
                "formula": "2",
                "formulaname": "abc",
                "ans": randomString(5)
            }
        ]}


    }

    function getCALC_VER(DataPack) {
        if (DataPack.pids && DataPack.pids.length > 0 && DataPack.pids[0].original) {
            return [
                {
                    "name": " ECU PART  NUMBER1",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "result"
                },
                {
                    "name": " ECU PART  NUMBER2",
                    "pid": "P0003",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "5"
                },
                {
                    "name": " ECU PART  NUMBER3",
                    "pid": "P0004",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "77"
                }
            ]
        }
        else {
            return [
                {
                    "name": " ECU PART  NUMBER1",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF"
                },
                {
                    "name": " ECU PART  NUMBER2",
                    "pid": "P0003",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF"
                },
                {
                    "name": " ECU PART  NUMBER3",
                    "pid": "P0004",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF"
                }
            ]
        }


    }

    function getCALC_VER_SUPPORT(DataPack) {


        //if (DataPack.pids && DataPack.pids.length > 0 && DataPack.pids[0].original) {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": "3",
            "items": [
                {
                    "name": " ECU PART  NUMBER1",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "result"
                },
                {
                    "name": " ECU PART  NUMBER2",
                    "pid": "P0003",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "5"
                },
                {
                    "name": " ECU PART  NUMBER3",
                    "pid": "P0004",
                    "diagid": "000003",
                    "formulaid": "2",
                    "formula": "abc",
                    "ecudata": "EB90FF",
                    "ans": "77"
                }
            ]
        };


    }

    function randomString(len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
        for (var i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function getDTC(DataPack) {

        var randomStr = randomString(5);

        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": "3",
            "items": [
                {
                    "key": "00010002",
                    "data": [
                        {
                            "name": "增压压力传感器电路异常",
                            "danwei": "P0001",
                            "pid": "0001",
                            "diagid": "0",
                            "fomula": "0",
                            "fomulaname": "0"
                        },
                        {
                            "name": "状态",
                            "danwei": "P0001",
                            "pid": "0002",
                            "diagid": "0",
                            "fomula": "0",
                            "fomulaname": "0"
                        }
                    ]
                },
                {
                    "key": "0003",
                    "data": [
                        {
                            "name": "直流马达异常" + randomStr,
                            "danwei": "P0002",
                            "pid": "0003",
                            "diagid": "0",
                            "fomula": "0",
                            "fomulaname": "0"
                        }
                    ]
                },
                {
                    "key": "P0003",
                    "data": []
                }
            ]
        }
    }

    function getFreezeDTC() {
        return [
            {
                "index": "00002",
                "name": "sdfsdfsds",
                "pid": "00002101",
                "danwei": "U1000"
            },
            {
                "index ": "00003",
                "name": "fsdfgdg",
                "pid": "00002102",
                "danwei": "U1001"
            }

        ];

    }

    function getFreezeSupport_Pid() {
        return {
            "from": "txt",
            "key": "FREEZE_SUPPORT",
            "level": "1.2",
            "itemcount": 190,
            "supportitems": [
                {
                    "index": "000001-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障码状态",
                    "danwei": "",
                    "supid": "00000001",
                    "pid": "00000001",
                    "pakid": "00000001",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%01d%01d%01d%01d%01d%01d%01d%01d\",(x1&0x80)>>7,(x1&0x40)>>6,(x1&0x20)>>5,(x1&0x10)>>4,(x1&0x08)>>3,(x1&0x04)>>2,(x1&0x02)>>1,x1&0x01);"
                },
                {
                    "index": "000002-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障码优先权",
                    "danwei": "",
                    "supid": "00000002",
                    "pid": "00000002",
                    "pakid": "00000002",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1;"
                },
                {
                    "index": "000003-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障频率",
                    "danwei": "",
                    "supid": "00000003",
                    "pid": "00000003",
                    "pakid": "00000003",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "Y = x;"
                },
                {
                    "index": "000004-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "复位计数器",
                    "danwei": "",
                    "supid": "00000004",
                    "pid": "00000004",
                    "pakid": "00000004",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "Y = x;"
                },
                {
                    "index": "000005-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "里程",
                    "danwei": "KM",
                    "supid": "00000005",
                    "pid": "00000005",
                    "pakid": "00000005",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1*256*256+x2*256+x3;"
                },
                {
                    "index": "000006-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "时间指示",
                    "danwei": "",
                    "supid": "00000006",
                    "pid": "00000006",
                    "pakid": "00000006",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1&0x0f;"
                },
                {
                    "index": "000007-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "日期",
                    "danwei": "",
                    "supid": "00000007",
                    "pid": "00000007",
                    "pakid": "00000007",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "y=ASCII(X);"
                },
                {
                    "index": "000008-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "时间",
                    "danwei": "",
                    "supid": "00000008",
                    "pid": "00000008",
                    "pakid": "00000008",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "y=ASCII(X);"
                },
                {
                    "index": "000009-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "原始存储格式",
                    "danwei": "",
                    "supid": "24000000",
                    "pid": "24000000",
                    "pakid": "24000000",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x1+x2);"
                },
                {
                    "index": "00000A-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "转速",
                    "danwei": "/min",
                    "supid": "24000001",
                    "pid": "24000001",
                    "pakid": "24000001",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.2);"
                },
                {
                    "index": "00000B-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "负荷",
                    "danwei": "%",
                    "supid": "24000002",
                    "pid": "24000002",
                    "pakid": "24000002",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.002);"
                },
                {
                    "index": "00000C-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "节气门开度",
                    "danwei": "<°",
                    "supid": "24000003",
                    "pid": "24000003",
                    "pakid": "24000003",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.002);"
                },
                {
                    "index": "00000D-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "点火正时角度",
                    "danwei": "°ATDC",
                    "supid": "24000004",
                    "pid": "24000004",
                    "pakid": "24000004",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y=((x2-127)*x1*0.01);"
                },
                {
                    "index": "00000E-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "温度",
                    "danwei": "℃",
                    "supid": "24000005",
                    "pid": "24000005",
                    "pakid": "24000005",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "if(x2<100) y=(x2-100)*x1*0.1%100; else y=(x2-100)*x1*0.1%1000 ;"
                },
                {
                    "index": "00000F-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "电压",
                    "danwei": "V",
                    "supid": "24000006",
                    "pid": "24000006",
                    "pakid": "24000006",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",x2*x1*0.001);"
                },
                {
                    "index": "000010-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "车速",
                    "danwei": "km/h",
                    "supid": "24000007",
                    "pid": "24000007",
                    "pakid": "24000007",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.01);"
                },
                {
                    "index": "000011-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "无单位",
                    "danwei": "",
                    "supid": "24000008",
                    "pid": "24000008",
                    "pakid": "24000008",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.1);"
                },
                {
                    "index": "000012-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "转向角",
                    "danwei": "<°",
                    "supid": "24000009",
                    "pid": "24000009",
                    "pakid": "24000009",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",(x2-127)*x1*0.02);"
                },
                {
                    "index": "000013-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "冷暖",
                    "danwei": "",
                    "supid": "2400000A",
                    "pid": "2400000A",
                    "pakid": "2400000A",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "if(x1<=x2) y=warm; else y=kalt;"
                },
                {
                    "index": "000014-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "氧传感器系数",
                    "danwei": "",
                    "supid": "2400000B",
                    "pid": "2400000B",
                    "pakid": "2400000B",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.2f\",1+(x2-128)*x1*0.0001);"
                },
                {
                    "index": "000015-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "电阻",
                    "danwei": "ohm",
                    "supid": "2400000C",
                    "pid": "2400000C",
                    "pakid": "2400000C",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",x2*x1*0.001);"
                },
                {
                    "index": "000016-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "距离",
                    "danwei": "mm",
                    "supid": "2400000D",
                    "pid": "2400000D",
                    "pakid": "2400000D",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",(x2-127)*x1*0.001);"
                },
                {
                    "index": "000017-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "绝对压力",
                    "danwei": "bar",
                    "supid": "2400000E",
                    "pid": "2400000E",
                    "pakid": "2400000E",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.005);"
                }
            ]
        };
    }

    function getFreezeSupport_Pakid() {
        return {
            "from": "txt",
            "key": "FREEZE_SUPPORT",
            "level": "1.2",
            "itemcount": 190,
            "supportitems": [
                {
                    "index": "000001-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障码状态",
                    "danwei": "",
                    "supid": "00000001",
                    "pid": "00000001",
                    "pakid": "00000001",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%01d%01d%01d%01d%01d%01d%01d%01d\",(x1&0x80)>>7,(x1&0x40)>>6,(x1&0x20)>>5,(x1&0x10)>>4,(x1&0x08)>>3,(x1&0x04)>>2,(x1&0x02)>>1,x1&0x01);"
                },
                {
                    "index": "000002-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障码优先权",
                    "danwei": "",
                    "supid": "00000002",
                    "pid": "00000002",
                    "pakid": "00000002",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1;"
                },
                {
                    "index": "000003-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "故障频率",
                    "danwei": "",
                    "supid": "00000003",
                    "pid": "00000003",
                    "pakid": "00000003",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "Y = x;"
                },
                {
                    "index": "000004-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "复位计数器",
                    "danwei": "",
                    "supid": "00000004",
                    "pid": "00000004",
                    "pakid": "00000004",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "Y = x;"
                },
                {
                    "index": "000005-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "里程",
                    "danwei": "KM",
                    "supid": "00000005",
                    "pid": "00000005",
                    "pakid": "00000005",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1*256*256+x2*256+x3;"
                },
                {
                    "index": "000006-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "时间指示",
                    "danwei": "",
                    "supid": "00000006",
                    "pid": "00000006",
                    "pakid": "00000006",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y = x1&0x0f;"
                },
                {
                    "index": "000007-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "日期",
                    "danwei": "",
                    "supid": "00000007",
                    "pid": "00000007",
                    "pakid": "00000007",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "y=ASCII(X);"
                },
                {
                    "index": "000008-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "时间",
                    "danwei": "",
                    "supid": "00000008",
                    "pid": "00000008",
                    "pakid": "00000008",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0005",
                    "fomulaname": "y=ASCII(X);"
                },
                {
                    "index": "000009-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "原始存储格式",
                    "danwei": "",
                    "supid": "24000000",
                    "pid": "24000000",
                    "pakid": "24000000",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x1+x2);"
                },
                {
                    "index": "00000A-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "转速",
                    "danwei": "/min",
                    "supid": "24000001",
                    "pid": "24000001",
                    "pakid": "24000001",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.2);"
                },
                {
                    "index": "00000B-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "负荷",
                    "danwei": "%",
                    "supid": "24000002",
                    "pid": "24000002",
                    "pakid": "24000002",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.002);"
                },
                {
                    "index": "00000C-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "节气门开度",
                    "danwei": "<°",
                    "supid": "24000003",
                    "pid": "24000003",
                    "pakid": "24000003",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.002);"
                },
                {
                    "index": "00000D-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "点火正时角度",
                    "danwei": "°ATDC",
                    "supid": "24000004",
                    "pid": "24000004",
                    "pakid": "24000004",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "y=((x2-127)*x1*0.01);"
                },
                {
                    "index": "00000E-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "温度",
                    "danwei": "℃",
                    "supid": "24000005",
                    "pid": "24000005",
                    "pakid": "24000005",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "if(x2<100) y=(x2-100)*x1*0.1%100; else y=(x2-100)*x1*0.1%1000 ;"
                },
                {
                    "index": "00000F-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "电压",
                    "danwei": "V",
                    "supid": "24000006",
                    "pid": "24000006",
                    "pakid": "24000006",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",x2*x1*0.001);"
                },
                {
                    "index": "000010-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "车速",
                    "danwei": "km/h",
                    "supid": "24000007",
                    "pid": "24000007",
                    "pakid": "24000007",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.01);"
                },
                {
                    "index": "000011-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "无单位",
                    "danwei": "",
                    "supid": "24000008",
                    "pid": "24000008",
                    "pakid": "24000008",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.1);"
                },
                {
                    "index": "000012-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "转向角",
                    "danwei": "<°",
                    "supid": "24000009",
                    "pid": "24000009",
                    "pakid": "24000009",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",(x2-127)*x1*0.02);"
                },
                {
                    "index": "000013-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "冷暖",
                    "danwei": "",
                    "supid": "2400000A",
                    "pid": "2400000A",
                    "pakid": "2400000A",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "if(x1<=x2) y=warm; else y=kalt;"
                },
                {
                    "index": "000014-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "氧传感器系数",
                    "danwei": "",
                    "supid": "2400000B",
                    "pid": "2400000B",
                    "pakid": "2400000B",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.2f\",1+(x2-128)*x1*0.0001);"
                },
                {
                    "index": "000015-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "电阻",
                    "danwei": "ohm",
                    "supid": "2400000C",
                    "pid": "2400000C",
                    "pakid": "2400000C",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",x2*x1*0.001);"
                },
                {
                    "index": "000016-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "距离",
                    "danwei": "mm",
                    "supid": "2400000D",
                    "pid": "2400000D",
                    "pakid": "2400000D",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%.1f\",(x2-127)*x1*0.001);"
                },
                {
                    "index": "000017-PUB",
                    "appid": "",
                    "type": "4",
                    "group": "",
                    "name": "绝对压力",
                    "danwei": "bar",
                    "supid": "2400000E",
                    "pid": "2400000E",
                    "pakid": "2400000E",
                    "diagid": "070000",
                    "pakpos": "0000",
                    "fomula": "0000",
                    "fomulaname": "sprintf(\"%d\",x2*x1*0.005);"
                }
            ]
        };
    }

    function getFreezeResult() {
        /*{
            "dbfilename":"01000003",
            "pub":"PUB.txt",
            "version":"2",
            "pids":[
                {"pid":"2400009A","original":"","index":"0000A3-PUB","appid":"","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%d\",x2*x1);"},
                {"pid":"2400009B","original":"","index":"0000A4-PUB","appid":"","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%.5f\",x1*x2*0.01-90);"},
                {"pid":"2400009C","original":"","index":"0000A5-PUB","appid":"","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%d\",x1*256+x2);"}]
        }*/
        return {
            "from":"txt",
            "key":"FREEZE_RESULT",
            "level":"1.2","itemcount":3,
            "items":[
                {"appid":"","pid":"2400009A","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%d\",x2*x1);","index":"0000A3-PUB","ans":""},
                {"appid":"","pid":"2400009B","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%.5f\",x1*x2*0.01-90);","index":"0000A4-PUB","ans":""},
                {"appid":"","pid":"2400009C","diagid":"070000","fomula":"0000","fomulaname":"sprintf(\"%d\",x1*256+x2);","index":"0000A5-PUB","ans":""}]
        };
    }

    function getFreezePid() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 308,
            "pakids": [
                {
                    "index": "000192",
                    "pid": "00000500",
                    "pakid": "00000001",
                    "pakpos": "0001"
                },
                {
                    "index": "000193",
                    "pid": "00000C00",
                    "pakid": "00000002",
                    "pakpos": "0002"
                },
                {
                    "index": "000194",
                    "pid": "00000D00",
                    "pakid": "00000003",
                    "pakpos": "0003"
                }
            ]
        }


    }

    function getEGOS_GROUP() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 8,
            "groups": [
                {
                    "index": "000346",
                    "name": "缸组1- 传感器1",
                    "pid": "00000011"
                },
                {
                    "index": "000347",
                    "name": "缸组1- 传感器2",
                    "pid": "00000012"
                },
                {
                    "index": "000348",
                    "name": "缸组1- 传感器3",
                    "pid": "00000013"
                },
                {
                    "index": "000349",
                    "name": "缸组1- 传感器4",
                    "pid": "00000014"
                }
            ]
        }

    }

    function getEGOS_SUPPORT() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "supportitems": [
                {
                    "index": " 000358",
                    "name": "浓到稀传感器阈值电压(常量)",
                    "danwei": "伏",
                    "pid": "00000001",
                    "ans": ""
                },
                {
                    "index": " 000359",
                    "name": "稀到浓传感器阈值电压(常量)",
                    "danwei": "伏",
                    "pid": "00000002"
                },
                {
                    "index": " 000360",
                    "name": "转换时间内传感器低电压(常量)",
                    "danwei": "伏",
                    "pid": "00000003"
                },
                {
                    "index": " 000361",
                    "name": "转换时间内传感器高电压(常量)",
                    "danwei": "伏",
                    "pid": "00000004"
                }
            ]
        }

    }

    function getEGOS_RESULT() {
        return [
            {
                "index": "000085",
                pid: "00000001",//冻结帧动态数据pid
                name: "浓到稀传感器阀值电压（常量）",//信息描述
                ans: "0.50",//当前信息值
                danwei: "伏",//单位
                max: "N/A",//极大值
                min: "0.10"//极小值
            },
            {
                "index": "000086",
                pid: "00000002",//冻结帧动态数据pid
                name: "稀到浓传感器阀值电压（常量）",//信息描述
                ans: "0.40",//当前信息值
                danwei: "伏",//单位
                max: "N/A",//极大值
                min: "0.10"//极小值
            },
            {
                "index": "000087",
                pid: "00000003",//冻结帧动态数据pid
                name: "转换时间内传感器低电压（常量）",//信息描述
                ans: "0.30",//当前信息值
                danwei: "伏",//单位
                max: "N/A",//极大值
                min: "0.10"//极小值
            },
            {
                "index": "000088",
                pid: "00000004",//冻结帧动态数据pid
                name: "转换时间内传感器高电压（常量）",//信息描述
                ans: "0.20",//当前信息值
                danwei: "伏",//单位
                max: "N/A",//极大值
                min: "0.10"//极小值
            },
            {
                "index": "000089",
                pid: "00000005",//冻结帧动态数据pid
                name: "浓到稀传感器转换时间（计算值）",//信息描述
                ans: "0.05",//当前信息值
                danwei: "秒",//单位
                max: "0.04",//极大值
                min: "0.08"//极小值
            },
            {
                "index": "000090",
                pid: "00000006",//冻结帧动态数据pid
                name: "稀到浓传感器转换时间（计算值）",//信息描述
                ans: "0.03",//当前信息值
                danwei: "秒",//单位
                max: "0.04",//极大值
                min: "0.08"//极小值
            },
            {
                "index": "000091",
                pid: "00000007",//冻结帧动态数据pid
                name: "测试周期内传感器最低电压（计算值）",//信息描述
                ans: "0.02",//当前信息值
                danwei: "秒",//单位
                max: "0.10",//极大值
                min: "0.05"//极小值
            },
            {
                "index": "000092",
                pid: "00000008",//冻结帧动态数据pid
                name: "测试周期内传感器最高电压（计算值）",//信息描述
                ans: "1",//当前信息值
                danwei: "秒",//单位
                max: "0.10",//极大值
                min: "0.05"//极小值
            }
        ]

    }

    function getCTYPE(dataPack) {

        var returnData;

        switch (dataPack.parents.length) {
            case 0:
                returnData = {
                    "from": "xml",
                    "level": "1.2",
                    "parents": [
                        "America",
                        "North America"
                    ],
                    "itemcount": "4",
                    "items": [
                        {
                            "name": "大问答控制等等"
                            //"N": {
                            //                            "dbfilename": "000003.txt",
                            //                            "publicfilename": "pub.txt",
                            //                            "nodeaddress": "0000.0003.0002.0003"
                            //                        }
                        }
                    ]
                };
                break;
            case 1:
                returnData = {
                    "from": "xml",
                    "level": "1.2",
                    "parents": [
                        "America",
                        "North America"
                    ],
                    "itemcount": "2",
                    "items": [
                        {
                            "name": "我斯达实打实的w"

                        },
                        {
                            "name": "啊大伟的控德萨达a"

                        }
                    ]
                };
                break;
            case 2:
                returnData = {
                    "from": "xml",
                    "level": "1.2",
                    "parents": [
                        "America",
                        "North America"
                    ],
                    "itemcount": "2",
                    "items": [
                        {
                            "name": "是德萨达答w"

                        }, {
                            "name": "蹬蹬大大问答燃的d’"

                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }, {
                            "name": "东方色法a"
                        }
                    ]
                };
                break;
            case 3:
                returnData = {
                    "from": "xml",
                    "level": "1.2",
                    "parents": [
                        "America",
                        "North America"
                    ],
                    "itemcount": "2",
                    "items": [
                        {
                            "name": "wdawdw’",
                            "N": {
                                "dbfilename": "000001.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0001.0002.0001"
                            }
                        },
                        {
                            "name": "waaaaasdadadawdawdadawdadawdawdawdasdadwdasdzdsd asdddwdawdawdawdawdawdawdawdaw adawdawdadssa",
                            "N": {
                                "dbfilename": "000002.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0002.0002.0002"
                            }
                        },
                        {
                            "name": "wdasdadwdasdzdsd asdddwdawdawdawdawdawdawdawdaw adawdawdawdawdawdawdawdawdaw adawdawdawdawdawdawdawdaw adawda",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "waaaaasdadadawdawdadawdadawdawdawdasdadwdasdzdsdwdawdawdawdawdawdaw adawda",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "waaaaasdadawdawdawdawdawdawdaw adawdadawdwdawdawdawdawdawdaw adawdaawda",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaqwdawdawdawdawdawdaw adawdaweewdawdawdawdawdawdaw adawdaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        },
                        {
                            "name": "aaa",
                            "N": {
                                "dbfilename": "000003.txt",
                                "publicfilename": "pub.txt",
                                "nodeaddress": "0000.0003.0002.0003"
                            }
                        }
                    ]
                };
                break;
        }

        return returnData;
        /*{
         "from": "xml",
         "level": "1.2",
         "parents": [
         "America",
         "North America"
         ],
         "itemcount": "3",
         "items": [
         {
         "name": "350Z",
         "N": {
         "dbfilename": "000001.txt",
         "publicfilename": "pub.txt",
         "nodeaddress": "0000.0002.0002.0001"
         }
         }, {
         "name": "350Z1",
         "N": {
         "dbfilename": "000001.txt",
         "publicfilename": "pub.txt",
         "nodeaddress": "0000.0002.0002.0002"
         }
         },
         {
         "name": "350Z2",
         "N": {
         "dbfilename": "000001.txt",
         "publicfilename": "pub.txt",
         "nodeaddress": "0000.0002.0002.0003"
         }
         }
         ]
         }*/

    }

    function getSystem() {
        return {
            "from": "xml",
            "level": "1.2",
            "parents": [],
            "itemcount": "2",
            "items": [
                {
                    "name": "引擎系统",
                    "index": "000001",
                    "nodeaddress": "0000.0001.0002.0001",
                    "systemid": "00000002"
                }/*,
                 {
                 "name": "变速器系统",
                 "index": "000002",
                 "nodeaddress": "0000.0000.0002.0001",
                 "systemid": "00000002"
                 }*/
            ]
        }

    }

    function getCALC_ONE_GROUP() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "groups": [
                {
                    "index": "000346",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "动力",
                    "pid": "00000011"
                },
                {
                    "index": "000347",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "动力",
                    "pid": "00000012"
                },
                {
                    "index": "000348",
                    "group": "bbb",
                    "name": "底盘",
                    "pid": "00000013"
                },
                {
                    "index": "000349",
                    "group": "bbb",
                    "name": "底盘",
                    "pid": "00000014"
                }
            ]
        }

    }

    function getCALC_ONE_SUPPORT() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "supportitems": [
                {
                    "index": "000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "绝对节气门位置 B",
                    "danwei": "百分比",
                    "pid": "00004700",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                },
                {
                    "index": "000325-ECU",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "节气门执行器控制（TAC）指令",
                    "danwei": "百分比",
                    "pid": "00004c00",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                },
                {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }, {
                    "index": " 000334-PUB",
                    "type": "3",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                },
                {
                    "index": " 000337-PUB",
                    "type": "8",
                    "group": "000000021300000002121123124234863548263548263546734",
                    "name": "短期辅助氧传感器燃油修正－B4",
                    "danwei": "百分比",
                    "pid": "00005701",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000"
                }
            ]
        }
    }

    function getCHANNEL_DATA() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "items": [
                {
                    "index": "000001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": ""
                },
                {
                    "index": "000001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": ""
                },
                {
                    "index": "000001-PUB",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": ""
                }
            ]
        }
    }

    function getBASE_ADJUST_SUPPORT() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "supportitems": [
                {
                    "index": "0030001-ECU",
                    "appid ": "0",
                    "type": "3",
                    "group": "000320",
                    "name": "绝对节气门位置 B",
                    "danwei": "百分比",
                    "pid": "00004700",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"
                },
                {
                    "index": "0010001-ECU",
                    "appid ": "0",
                    "type": "3",
                    "group": " 000320",
                    "name": "节气门执行器控制（TAC）指令",
                    "danwei": "百分比",
                    "pid": "00004c00",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"
                },
                {
                    "index": "0500001-ECU",
                    "appid ": "0",
                    "type": "3",
                    "group": " 000320",
                    "name": "长期辅助氧传感器燃油修正－B1",
                    "danwei": "百分比",
                    "pid": "00005600",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                },
                {
                    "index": "000001-PUB",
                    "appid ": "0",
                    "type": "8",
                    "group": " 000320",
                    "name": "短期辅助氧传感器燃油修正－B4",
                    "danwei": "百分比",
                    "pid": "00005701",
                    "pakid": "00000000",
                    "diagid": "00000000",
                    "pakpos": "0000",
                    "fomula": "xxxxxx",
                    "fomulaname": "xxxxxx"

                }
            ]
        }
    }

    function getBASE_ADJUST() {
        return {
            "from": "txt",
            "level": "1.2",
            "itemcount": 4,
            "items": [
                {
                    "index": "0030001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "6468.24"
                },
                {
                    "index": "0010001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "65.24"
                }, {
                    "index": "0500001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "623.24"
                },
                {
                    "index": "0400001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "61238.24"
                },
                {
                    "index": "0002001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "658.24"
                },
                {
                    "index": "00031-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "68134.24"
                },
                {
                    "index": "000001-ECU",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "6348.24"
                },
                {
                    "index": "000001-PUB",
                    "name": "CCDP",
                    "danwei": "L",
                    "appid": "0001",
                    "pid": "P0002",
                    "diagid": "000003",
                    "formula": "2",
                    "formulaname": "abc",
                    "ans": "6238.24"
                }
            ]
        }

    }

    function getSpecFunPid(){

        var json = "{\"supids\":{\"03000001\":\"序列号\",\"03000002\":\"识别号\",\"03000003\":\"修订版本\",\"03000004\":\"日期\",\"03000005\":\"制造商号码\",\"03000006\":\"测试台号\",\"03000007\":\"编程尝试\",\"03000008\":\"尝试成功\",\"03000009\":\"编程状态\",\"03000010\":\"请求条件\",\"03000011\":\"闪存工具码\",\"03000012\":\"闪存日期\",\"03000013\":\"软件代码\",\"03000014\":\"硬件号\",\"03000015\":\"防盗系统IV请求\",\"03000016\":\"底盘号\",\"03000101\":\"正在读取数据\",\"03000102\":\"无支持的数据\",\"03000103\":\"确定\",\"04008000\":\"在做任何修改前请先记下原始数据。\\\\n不正确的编码会使控制模块无此功能！\",\"04001000\":\"确定\",\"04002000\":\"取消\",\"04000010\":\"所选择功能不支持\",\"04000001\":\"软件编码\",\"04000002\":\"车间代码\",\"04000003\":\"IMP\",\"04000004\":\"部件\",\"04000005\":\"设置编码\",\"04080011\":\"软件编码长度不正确，请按照提示输入正确长度\",\"04080012\":\"软件编码格式不正确，输入值应为十六进制\",\"04080013\":\"无数值输入\",\"04080021\":\"车间代码应由数字组成\",\"04080022\":\"车间代码数值超出范围\",\"04080031\":\"IMP号应由数字组成\",\"04080032\":\"IMP号数值超出范围\",\"04080041\":\"部件号应由数字组成\",\"04080042\":\"部件号数值超出范围\",\"04003000\":\"编码操作失败，汽车ECU不支持\\\\n请检查诊断接头是否接好，并打开点火开关\",\"04004000\":\"编码操作成功\",\"04080200\":\"请输入车间代码(0 ~ 131071)\",\"04080300\":\"请输入IMP(0 ~ 16383)\",\"04080400\":\"请输入部件(0 ~ 2097151)\",\"04080101\":\"请输入软件编码(1个字节十六进制数)\",\"04080102\":\"请输入软件编码(2个字节十六进制数)\",\"04080103\":\"请输入软件编码(3个字节十六进制数)\",\"04080104\":\"请输入软件编码(4个字节十六进制数)\",\"04080105\":\"请输入软件编码(5个字节十六进制数)\",\"04080106\":\"请输入软件编码(6个字节十六进制数)\",\"04080107\":\"请输入软件编码(7个字节十六进制数)\",\"04080108\":\"请输入软件编码(8个字节十六进制数)\",\"04080109\":\"请输入软件编码(9个字节十六进制数)\",\"0408010A\":\"请输入软件编码(10个字节十六进制数)\",\"0408010B\":\"请输入软件编码(11个字节十六进制数)\",\"0408010C\":\"请输入软件编码(12个字节十六进制数)\",\"0408010D\":\"请输入软件编码(13个字节十六进制数)\",\"0408010E\":\"请输入软件编码(14个字节十六进制数)\",\"0408010F\":\"请输入软件编码(15个字节十六进制数)\",\"04080110\":\"请输入软件编码(16个字节十六进制数)\",\"04080111\":\"请输入软件编码(17个字节十六进制数)\",\"04080112\":\"请输入软件编码(18个字节十六进制数)\",\"04080113\":\"请输入软件编码(19个字节十六进制数)\",\"04080114\":\"请输入软件编码(20个字节十六进制数)\",\"04080115\":\"请输入软件编码(21个字节十六进制数)\",\"04080116\":\"请输入软件编码(22个字节十六进制数)\",\"04080117\":\"请输入软件编码(23个字节十六进制数)\",\"04080118\":\"请输入软件编码(24个字节十六进制数)\",\"04080119\":\"请输入软件编码(25个字节十六进制数)\",\"0408011A\":\"请输入软件编码(26个字节十六进制数)\",\"0408011B\":\"请输入软件编码(27个字节十六进制数)\",\"0408011C\":\"请输入软件编码(28个字节十六进制数)\",\"0408011D\":\"请输入软件编码(29个字节十六进制数)\",\"0408011E\":\"请输入软件编码(30个字节十六进制数)\",\"0408011F\":\"请输入软件编码(31个字节十六进制数)\",\"04080120\":\"请输入软件编码(32个字节十六进制数)\",\"04080121\":\"请输入软件编码(33个字节十六进制数)\",\"04080122\":\"请输入软件编码(34个字节十六进制数)\",\"04080123\":\"请输入软件编码(35个字节十六进制数)\",\"04080124\":\"请输入软件编码(36个字节十六进制数)\",\"04080125\":\"请输入软件编码(37个字节十六进制数)\",\"04080126\":\"请输入软件编码(38个字节十六进制数)\",\"04080127\":\"请输入软件编码(39个字节十六进制数)\",\"04080128\":\"请输入软件编码(40个字节十六进制数)\",\"04080129\":\"请输入软件编码(41个字节十六进制数)\",\"0408012A\":\"请输入软件编码(42个字节十六进制数)\",\"0408012B\":\"请输入软件编码(43个字节十六进制数)\",\"0408012C\":\"请输入软件编码(44个字节十六进制数)\",\"0408012D\":\"请输入软件编码(45个字节十六进制数)\",\"0408012E\":\"请输入软件编码(46个字节十六进制数)\",\"0408012F\":\"请输入软件编码(47个字节十六进制数)\",\"04080130\":\"请输入软件编码(48个字节十六进制数)\",\"04080131\":\"请输入软件编码(49个字节十六进制数)\",\"04080132\":\"请输入软件编码(50个字节十六进制数)\",\"04080133\":\"请输入软件编码(51个字节十六进制数)\",\"04080134\":\"请输入软件编码(52个字节十六进制数)\",\"04080135\":\"请输入软件编码(53个字节十六进制数)\",\"04080136\":\"请输入软件编码(54个字节十六进制数)\",\"04080137\":\"请输入软件编码(55个字节十六进制数)\",\"04080138\":\"请输入软件编码(56个字节十六进制数)\",\"04080139\":\"请输入软件编码(57个字节十六进制数)\",\"0408013A\":\"请输入软件编码(58个字节十六进制数)\",\"0408013B\":\"请输入软件编码(59个字节十六进制数)\",\"0408013C\":\"请输入软件编码(60个字节十六进制数)\",\"06000020\":\"继续\",\"06000010\":\"取消\",\"06000001\":\"1.确定电压 > 12V;\\\\n2.电子手刹松开(按钮小灯不亮);\\\\n3.在执行下个工作步骤前，必须等待该程序结束，如果对此不加注意，则可能导致系统损坏。\",\"06000101\":\"1.打开驻车制动\",\"06000102\":\"2.关闭驻车制动\",\"06000103\":\"3.驻车制动测试\",\"06000110\":\"正在执行操作\",\"06001001\":\"打开驻车制动失败\",\"06001002\":\"关闭驻车制动失败\",\"06001003\":\"驻车制动测试失败\",\"06002001\":\"打开驻车制动成功\",\"06002002\":\"关闭驻车制动成功\",\"06002003\":\"驻车制动测试成功\",\"06000030\":\"确定\",\"07000020\":\"继续\",\"07000010\":\"取消\",\"07000030\":\"写入底盘号(17位数长度)：\",\"07000031\":\"请输入底盘号\",\"07000032\":\"底盘号长度不够，请重新输入\",\"07000033\":\"底盘号格式错误，请重新输入\",\"07000034\":\"正在进行操作，请勿中断\",\"07000035\":\"操作失败，汽车ECU不支持\\\\n请检查诊断接头是否接好，并打开点火开关\",\"07000036\":\"操作失败，所选择的功能不支持\",\"07000037\":\"传送底盘号完毕\",\"01000020\":\"确定\",\"01000010\":\"取消\",\"01000101\":\"输入通道号(1~255)\",\"01000102\":\"输入通道号(1~99)\",\"01000030\":\"通道号错误，输入的应该为全数字\",\"01000040\":\"通道号超出范围\",\"01000050\":\"正在读取数据\",\"01000060\":\"读取数据失败，汽车ECU不支持\\\\n请检查诊断接头是否接好，并打开点火开关\",\"01000070\":\"无数值输入，请重新输入\",\"01000080\":\"无汽车ECU所支持的数据\",\"01000090\":\"请输入新值(0~65535)：\",\"010000A0\":\"数值错误，输入的应该为全数字\",\"010000B0\":\"输入的新值超出范围，请重新输入\",\"010000C0\":\"车辆通讯失败\\\\n请检查诊断接头是否接好，并打开点火开关\",\"010000D0\":\"设置失败，请求被汽车ECU拒绝\",\"010000E0\":\"设置成功\",\"02000020\":\"确定\",\"02000010\":\"取消\",\"02000101\":\"输入通道号(1~254)\",\"02000102\":\"输入通道号(0~255)\",\"02000030\":\"通道号错误，输入应该为全数字\",\"02000040\":\"通道号超出范围\",\"02000050\":\"正在读取数据\",\"02000060\":\"读取数据失败，汽车ECU不支持\\\\n请检查诊断接头是否接好，并打开点火开关\",\"02000070\":\"无数值输入，请重新输入通道号\",\"02000080\":\"无汽车ECU所支持的数据\",\"02000090\":\"当前状态：关\",\"020000A0\":\"当前状态：开\",\"020000B0\":\"上一个通道\",\"020000C0\":\"下一个通道\",\"020000D0\":\"设置调整(开/关)\",\"020000E0\":\"设置调整失败，汽车ECU不支持\\\\n请检查诊断接头是否接好，并打开点火开关\",\"020000F0\":\"设置调整成功\",\"01800801\":\"上一个通道\",\"01800802\":\"下一个通道\",\"01800803\":\"设置新值\",\"01800100\":\"存储\",\"01800000\":\"原始，索引/关键字错误\",\"01800001\":\"转速(/min)\",\"01800002\":\"负载(%)\",\"01800003\":\"开度(>)\",\"01800004\":\"角度(°ATDC)\",\"01800005\":\"温度(℃）\",\"01800006\":\"电压(V)\",\"01800007\":\"速度(Km/H)\",\"01800008\":\"无单位\",\"01800009\":\"转向角(°)\",\"0180000A\":\"热或者冷\",\"0180000B\":\"Lambda因子\",\"0180000C\":\"电阻(Ohm)\",\"0180000D\":\"距离(mm)\",\"0180000E\":\"绝对压力(bar)\",\"0180000F\":\"喷油开启时间(ms)\",\"01800011\":\"ASCII字符\",\"01800012\":\"绝对压力(mbar)\",\"01800013\":\"燃油箱容积，(升)(L)\",\"01800014\":\"空气过量系数积分器(%)\",\"01800015\":\"电压(V)\",\"01800016\":\"喷射时间(ms)\",\"01800017\":\"占空比(%)\",\"01800018\":\"电流(A)\",\"01800019\":\"质量流量(克/秒)\",\"0180001A\":\"温度(℃)\",\"0180001B\":\"点火正时角度(°ATDC)\",\"0180001C\":\"无单位\",\"0180001D\":\"进气歧管绝对压力号码\",\"0180001E\":\"爆震调节深度(KW)\",\"0180001F\":\"无单位\",\"01800020\":\"无单位\",\"01800021\":\"负载(%)\",\"01800022\":\"数字怠速稳定装置(KW)\",\"01800023\":\"燃油消耗量(L/H)\",\"01800024\":\"里程(Km)\",\"01800025\":\"原始，索引/关键字错误\",\"01800026\":\"部分修正值(KW)\",\"01800027\":\"喷注量(mg/str)\",\"01800028\":\"驱动器电流(A)\",\"01800029\":\"充电(AH)\",\"0180002A\":\"电源(KW)\",\"0180002B\":\"电瓶电压(V)\",\"0180002C\":\"时间(h)\",\"0180002D\":\"燃油消耗量(L/Km)\",\"0180002E\":\"部分修正值(KW)\",\"0180002F\":\"时间修正值(mS)\",\"01800030\":\"无单位\",\"01800031\":\"每冲程的控制流量(mg/str)\",\"01800032\":\"压力(mbar)\",\"01800033\":\"喷注量(mg/str)\",\"01800034\":\"扭矩(Nm)\",\"01800035\":\"质量流量(克/秒)\",\"01800036\":\"计数器\",\"01800037\":\"时间(s)\",\"01800038\":\"维修厂代码\",\"01800039\":\"维修厂代码\",\"0180003A\":\"失火(/S)\",\"0180003B\":\"无单位\",\"0180003C\":\"时间量化(s)\",\"0180003D\":\"差速器\",\"0180003E\":\"时间(s)\",\"01800040\":\"电阻(Ohms)\",\"01800041\":\"距离(mm)\",\"01800042\":\"电压(V)\",\"01800043\":\"转向角(°)\",\"01800044\":\"旋转速率\",\"01800045\":\"压力(bar)\",\"01800046\":\"横向加速度(m/s2)\",\"01800047\":\"距离(cm)\",\"01800048\":\"电压(V)\",\"01800049\":\"电阻(Ohms)\",\"0180004A\":\"时间(月)\",\"0180004B\":\"错误代码\",\"0180004C\":\"电阻(kOhm)\",\"0180004D\":\"电压(V)\",\"0180004E\":\"失火\",\"0180004F\":\"通道号\",\"01800050\":\"电阻(kOhm)\",\"01800051\":\"转向角(°)\",\"01800052\":\"横向加速度(m/S2)\",\"01800053\":\"压力(bar)\",\"01800054\":\"加速度(m/s^2)\",\"01800055\":\"旋转速率(°/S)\",\"01800056\":\"电流(A)\",\"01800057\":\"旋转速率(°/S)\",\"01800058\":\"电阻(kOhm)\",\"01800059\":\"准时(H)\",\"0180005A\":\"质量/重量(kg)\",\"0180005B\":\"转向角(°)\",\"0180005C\":\"里程(km)\",\"0180005D\":\"扭矩(Nm)\",\"0180005E\":\"扭矩(Nm)\",\"01800060\":\"压力(mbar)\",\"01800061\":\"催化剂温度(℃)\",\"01800062\":\"脉冲(/km)\",\"01800063\":\"无单位\",\"01800064\":\"压力(bar)\",\"01800065\":\"IG.授权(L/mm)\",\"01800066\":\"内容(mm)\",\"01800067\":\"电压(V)\",\"01800068\":\"毫升(mL)\",\"01800069\":\"距离(m)\",\"0180006A\":\"速度(Km/H)\",\"0180006B\":\"十六进制值\",\"0180006C\":\"未处理形式不适用\",\"0180006D\":\"未处理形式不适用\",\"0180006E\":\"修理厂识别号\",\"0180006F\":\"里程(km)\",\"01800070\":\"角度\",\"01800071\":\"无单位\",\"01800072\":\"高度(m)\",\"01800073\":\"输出(W)\",\"01800074\":\"转速(/min)\",\"01800075\":\"温度(°)\",\"01800076\":\"无文本\",\"01800077\":\"无文本(%)\",\"01800078\":\"角度\",\"01800079\":\"无文本\",\"0180007A\":\"无文本\",\"0180007B\":\"无文本\",\"0180007C\":\"电流(mA)\",\"0180007D\":\"衰减(DB)\",\"0180007E\":\"无文本\",\"0180007F\":\"日期\",\"01800080\":\"转速(/min)\",\"01800081\":\"负载(%)\",\"01800082\":\"电流(A)\",\"01800083\":\"点火正时角度(°ATDC)\",\"01800084\":\"节气门角(°)\",\"01800085\":\"电压(V)\",\"01800086\":\"速度(km/h)\",\"01800087\":\"无单位\",\"01800088\":\"开关位置\",\"01800089\":\"喷油开启时间(ms)\",\"0180008A\":\"爆震传感器电压(V)\",\"0180008B\":\"转速(/min)\",\"0180008C\":\"温度(℃)\",\"0180008D\":\"ASCII(美国信息交换标准代码)字符串\",\"0180008E\":\"ASCII(美国信息交换标准代码)字符\",\"0180008F\":\"点火正时角度(°ATDC)\",\"01800090\":\"燃油消耗量(L/H)\",\"01800091\":\"燃油消耗量(L/100)\",\"01800092\":\"Lambda因子\",\"01800093\":\"倾角(%)\",\"01800094\":\"滑动速度\",\"01800095\":\"温度(°)\",\"01800096\":\"质量流量(克/秒)\",\"01800097\":\"怠速稳定性(KW)\",\"01800098\":\"质量空气/循环(mg/str)\",\"01800099\":\"喷注量(mg/str)\",\"0180009A\":\"角度\",\"0180009B\":\"角度\",\"0180009C\":\"距离(cm)\",\"0180009D\":\"距离(cm)\",\"0180009E\":\"速度(Km/H)\",\"0180009F\":\"温度(℃)\",\"018000A0\":\"无文本\",\"018000A1\":\"位\",\"018000A2\":\"角度\",\"018000A3\":\"时钟(H)\",\"018000A4\":\"无文本(%)\",\"018000A5\":\"电流(mA)\",\"018000A6\":\"旋转速率(°/S)\",\"018000A7\":\"电阻(mOhm)\",\"018000A8\":\"原始，索引/关键字错误(%)\",\"018000A9\":\"原始，索引/关键字错误(mV)\",\"018000AA\":\"原始，索引/关键字错误(g)\",\"018000AB\":\"原始，索引/关键字错误(g)\",\"018000AC\":\"原始，索引/关键字错误(mg/km)\",\"018000AD\":\"原始，索引/关键字错误(mg/s)\",\"018000AE\":\"原始，索引/关键字错误(L/1000km)\",\"018000AF\":\"原始，索引/关键字错误(bar)\",\"018000B0\":\"原始，索引/关键字错误(ppm)\",\"018000B1\":\"原始，索引/关键字错误(Nm)\",\"018000B2\":\"原始，索引/关键字错误\",\"018000B3\":\"原始，索引/关键字错误\",\"018000B4\":\"原始，索引/关键字错误(kg/h)\",\"018000B5\":\"原始，索引/关键字错误(mg/s)\",\"018000B6\":\"原始，索引/关键字错误\",\"018000B7\":\"原始，索引/关键字错误\",\"018000B8\":\"原始，索引/关键字错误\",\"018000B9\":\"原始，索引/关键字错误\",\"018000BA\":\"原始，索引/关键字错误\",\"018000BB\":\"原始，索引/关键字错误\",\"018000BC\":\"原始，索引/关键字错误\",\"018000BD\":\"原始，索引/关键字错误\",\"018000BE\":\"原始，索引/关键字错误\",\"018000BF\":\"原始，索引/关键字错误\",\"018000C0\":\"原始，索引/关键字错误\",\"018000C1\":\"原始，索引/关键字错误\",\"018000C2\":\"原始，索引/关键字错误\",\"018000C3\":\"原始，索引/关键字错误\",\"018000C4\":\"原始，索引/关键字错误\",\"018000C5\":\"原始，索引/关键字错误\",\"018000C6\":\"原始，索引/关键字错误\",\"018000C7\":\"原始，索引/关键字错误\",\"018000C8\":\"原始，索引/关键字错误\",\"018000C9\":\"原始，索引/关键字错误\",\"018000CA\":\"原始，索引/关键字错误\",\"018000CB\":\"原始，索引/关键字错误\",\"018000CC\":\"原始，索引/关键字错误\",\"018000CD\":\"原始，索引/关键字错误\",\"018000CE\":\"原始，索引/关键字错误\",\"018000CF\":\"原始，索引/关键字错误\",\"018000D0\":\"原始，索引/关键字错误\",\"018000D1\":\"原始，索引/关键字错误\",\"018000D2\":\"原始，索引/关键字错误\",\"018000D3\":\"原始，索引/关键字错误\",\"018000D4\":\"原始，索引/关键字错误\",\"018000D5\":\"原始，索引/关键字错误\",\"018000D6\":\"原始，索引/关键字错误\",\"018000D7\":\"原始，索引/关键字错误\",\"018000D8\":\"原始，索引/关键字错误\",\"018000D9\":\"原始，索引/关键字错误\",\"018000DA\":\"原始，索引/关键字错误\",\"018000DB\":\"原始，索引/关键字错误\",\"018000DC\":\"原始，索引/关键字错误\",\"018000DD\":\"原始，索引/关键字错误\",\"018000DE\":\"原始，索引/关键字错误\",\"018000DF\":\"原始，索引/关键字错误\",\"018000E0\":\"原始，索引/关键字错误\",\"018000E1\":\"原始，索引/关键字错误\",\"018000E2\":\"原始，索引/关键字错误\",\"018000E3\":\"原始，索引/关键字错误\",\"018000E4\":\"原始，索引/关键字错误\",\"018000E5\":\"原始，索引/关键字错误\",\"018000E6\":\"原始，索引/关键字错误\",\"018000E7\":\"原始，索引/关键字错误\",\"018000E8\":\"原始，索引/关键字错误\",\"018000E9\":\"原始，索引/关键字错误\",\"018000EA\":\"原始，索引/关键字错误\",\"018000EB\":\"原始，索引/关键字错误\",\"018000EC\":\"原始，索引/关键字错误\",\"018000ED\":\"原始，索引/关键字错误\",\"018000EE\":\"原始，索引/关键字错误\",\"018000EF\":\"原始，索引/关键字错误\",\"018000F0\":\"原始，索引/关键字错误\",\"018000F1\":\"原始，索引/关键字错误\",\"018000F2\":\"原始，索引/关键字错误\",\"018000F3\":\"原始，索引/关键字错误\",\"018000F4\":\"原始，索引/关键字错误\",\"018000F5\":\"原始，索引/关键字错误\",\"018000F6\":\"原始，索引/关键字错误\",\"018000F7\":\"原始，索引/关键字错误\",\"018000F8\":\"原始，索引/关键字错误\",\"018000F9\":\"原始，索引/关键字错误\",\"018000FA\":\"原始，索引/关键字错误\",\"018000FB\":\"原始，索引/关键字错误\",\"018000FC\":\"原始，索引/关键字错误\",\"018000FD\":\"原始，索引/关键字错误\",\"018000FE\":\"原始，索引/关键字错误\",\"018000FF\":\"原始，索引/关键字错误\",\"02800101\":\"发动机转速，(G28)\",\"02800102\":\"冷却液，温度(G62)\",\"02800103\":\"空燃比控制，气缸列1\",\"02800104\":\"空燃比控制，气缸列2\",\"02800201\":\"发动机转速，(G28)\",\"02800202\":\"发动机负载\",\"02800203\":\"喷射定时\",\"02800204\":\"质量空气流量，传感器(G70)\",\"02800301\":\"发动机转速，(G28)\",\"02800302\":\"质量空气流量，传感器(G70)\",\"02800303\":\"节气门阀角度\",\"02800304\":\"点火，定时角度\",\"02800401\":\"发动机转速，(G28)\",\"02800402\":\"电池电压，(接线端30)\",\"02800403\":\"冷却液，温度(G62)\",\"02800404\":\"进气空气，温度(G42)\",\"02800501\":\"发动机转速，(G28)\",\"02800502\":\"发动机负载\",\"02800503\":\"车辆速度\",\"02800504\":\"负载状态\",\"02800601\":\"发动机转速，(G28)\",\"02800602\":\"发动机负载\",\"02800603\":\"进气空气，温度(G42)\",\"02800604\":\"高度，修正系数\",\"02800801\":\"制动踏板，状态\",\"02800803\":\"制动助力器，压力\",\"02800901\":\"机油油位\",\"02800902\":\"机油告警，极限\",\"02800903\":\"燃油消耗，信号\",\"02800904\":\"燃油消耗，相当\",\"02800A01\":\"发动机转速，(G28)\",\"02800A02\":\"冷却液，温度(G62)\",\"02800A03\":\"进气空气，温度(G42)\",\"02800A04\":\"点火，定时角度\",\"02800B01\":\"发动机转速，(G28)\",\"02800B02\":\"冷却液，温度(G62)\",\"02800B03\":\"进气空气，温度(G42)\",\"02800B04\":\"点火，定时角度\",\"02800E01\":\"发动机转速，(G28)\",\"02800E02\":\"发动机负载\",\"02800E03\":\"断火计数器\",\"02800E04\":\"断火，识别\",\"02800F01\":\"断火计数器，气缸1\",\"02800F02\":\"断火计数器，气缸2\",\"02800F03\":\"断火计数器，气缸3\",\"02800F04\":\"断火，识别\",\"02801001\":\"断火计数器，气缸4\",\"02801002\":\"断火计数器，气缸5\",\"02801003\":\"断火计数器，气缸6\",\"02801004\":\"断火，识别\",\"02801101\":\"断火计数器，气缸7\",\"02801102\":\"断火计数器，气缸8\",\"02801104\":\"断火，识别\",\"02801201\":\"下，RPM阻碍\",\"02801202\":\"上，RPM阻碍\",\"02801203\":\"下，负载阻碍\",\"02801204\":\"上，负载阻碍\",\"02801401\":\"定时延迟，气缸1\",\"02801402\":\"定时延迟，气缸2\",\"02801403\":\"定时延迟，气缸3\",\"02801404\":\"定时延迟，气缸4\",\"02801501\":\"定时延迟，气缸5\",\"02801502\":\"定时延迟，气缸6\",\"02801503\":\"定时延迟，气缸7\",\"02801504\":\"定时延迟，气缸8\",\"02801601\":\"发动机转速，(G28)\",\"02801602\":\"发动机负载\",\"02801603\":\"定时延迟，气缸1\",\"02801604\":\"定时延迟，气缸2\",\"02801701\":\"发动机转速，(G28)\",\"02801702\":\"发动机负载\",\"02801703\":\"定时延迟，气缸3\",\"02801704\":\"定时延迟，气缸4\",\"02801801\":\"发动机转速，(G28)\",\"02801802\":\"发动机负载\",\"02801803\":\"定时延迟，气缸5\",\"02801804\":\"定时延迟，气缸6\",\"02801901\":\"发动机转速，(G28)\",\"02801902\":\"发动机负载\",\"02801903\":\"定时延迟，气缸7\",\"02801904\":\"定时延迟，气缸8\",\"02801A01\":\"爆震传感器，电压气缸1\",\"02801A02\":\"爆震传感器，电压气缸2\",\"02801A03\":\"爆震传感器，电压气缸3\",\"02801A04\":\"爆震传感器，电压气缸4\",\"02801B01\":\"爆震传感器，电压气缸5\",\"02801B02\":\"爆震传感器，电压气缸6\",\"02801B03\":\"爆震传感器，电压气缸7\",\"02801B04\":\"爆震传感器，电压气缸8\",\"02801C01\":\"发动机转速，(G28)\",\"02801C02\":\"发动机负载\",\"02801C03\":\"冷却液，温度(G62)\",\"02801C04\":\"爆震传感，测试结果\",\"02801E01\":\"气缸列1，传感器1\",\"02801E02\":\"气缸列1，传感器2\",\"02801E03\":\"气缸列2，传感器1\",\"02801E04\":\"气缸列2，传感器2\",\"02801F01\":\"空燃比控制，气缸1(实际)\",\"02801F02\":\"空燃比控制，气缸1(规定)\",\"02801F03\":\"空燃比控制，气缸2(实际)\",\"02801F04\":\"空燃比控制，气缸2(规定)\",\"02802001\":\"匹配(怠速)，气缸列1传感器1\",\"02802002\":\"匹配(部分)，气缸列1传感器1\",\"02802003\":\"匹配(怠速)，气缸列2传感器1\",\"02802004\":\"匹配(部分)，气缸列2传感器1\",\"02802101\":\"空燃比控制，气缸列1传感器1\",\"02802102\":\"传感器电压，气缸列1传感器1\",\"02802103\":\"空燃比控制，气缸列2传感器1\",\"02802104\":\"传感器电压，气缸列2传感器1\",\"02802201\":\"发动机转速，(G28)\",\"02802202\":\"催化转换器，气缸列1温度\",\"02802203\":\"动态系数，气缸列1传感器1\",\"02802204\":\"结果，氧传感器老化\",\"02802301\":\"发动机转速，(G28)\",\"02802302\":\"催化转换器，气缸列2温度\",\"02802303\":\"动态系数，气缸列2传感器1\",\"02802304\":\"结果，氧传感器老化\",\"02802401\":\"传感器电压，气缸列1传感器2\",\"02802402\":\"结果，空燃比有效性\",\"02802403\":\"传感器电压，气缸列2传感器2\",\"02802404\":\"结果，空燃比有效性\",\"02802501\":\"发动机负载\",\"02802502\":\"传感器电压，气缸列1传感器2\",\"02802503\":\"空燃比差，气缸列1传感器2\",\"02802504\":\"结果，空燃比差 B1\",\"02802601\":\"发动机负载\",\"02802602\":\"传感器电压，气缸列2传感器2\",\"02802603\":\"空燃比差，气缸列2传感器2\",\"02802604\":\"结果，空燃比差 B2\",\"02802701\":\"质量空气流量，传感器(G70)\",\"02802702\":\"传感器电压，气缸列1传感器2\",\"02802703\":\"传感器电压，气缸列2传感器2\",\"02802704\":\"结果，传感器交换\",\"02802901\":\"电阻，气缸列1传感器1\",\"02802902\":\"加热器状态\",\"02802903\":\"电阻，气缸列1传感器2\",\"02802904\":\"加热器状态\",\"02802A01\":\"电阻，气缸列2传感器1\",\"02802A02\":\"加热器状态\",\"02802A03\":\"电阻，气缸列2传感器2\",\"02802A04\":\"加热器状态\",\"02802B01\":\"发动机转速，(G28)\",\"02802B02\":\"催化转换器，气缸列1温度\",\"02802B03\":\"空燃比电压，气缸列1传感器2\",\"02802B04\":\"氧传感器，老化测试 B1S2\",\"02802C01\":\"发动机转速，(G28)\",\"02802C02\":\"催化转换器，气缸列2温度\",\"02802C03\":\"空燃比电压，气缸列2传感器2\",\"02802C04\":\"氧传感器，老化测试 B2S2\",\"02802E01\":\"发动机转速，(G28)\",\"02802E02\":\"催化转换器，气缸列1温度\",\"02802E03\":\"催化，转换气缸列1\",\"02802E04\":\"催化转换，测试气缸列1\",\"02802F01\":\"发动机转速，(G28)\",\"02802F02\":\"催化转换器，气缸列2温度\",\"02802F03\":\"催化，转换气缸列2\",\"02802F04\":\"催化转换，测试气缸列2\",\"02803201\":\"发动机转速，(实际)\",\"02803202\":\"发动机转速，(规定)\",\"02803203\":\"空调准备就绪\",\"02803204\":\"空调压缩机\",\"02803301\":\"发动机转速，(实际)\",\"02803302\":\"发动机转速，(规定)\",\"02803303\":\"选择档\",\"02803304\":\"电池电压，(接线端30)\",\"02803501\":\"发动机转速，(实际)\",\"02803502\":\"发动机转速，(规定)\",\"02803503\":\"电池电压，(接线端30)\",\"02803504\":\"发动机负载\",\"02803601\":\"发动机转速，(G28)\",\"02803602\":\"负载状态\",\"02803603\":\"加速踏板位置，传感器1(G79)\",\"02803604\":\"节气门阀角度\",\"02803701\":\"发动机转速，(G28)\",\"02803702\":\"怠速调节器\",\"02803703\":\"怠速稳定，自-匹配\",\"02803704\":\"操作，状态\",\"02803801\":\"发动机转速，(实际)\",\"02803802\":\"发动机转速，(规定)\",\"02803803\":\"怠速调节器\",\"02803804\":\"操作，状态\",\"02803901\":\"发动机转速，(实际)\",\"02803902\":\"发动机转速，(规定)\",\"02803903\":\"空调压缩机\",\"02803904\":\"A/C制冷剂，压力\",\"02803A01\":\"发动机转速，(G28)\",\"02803A02\":\"发动机负载\",\"02803A03\":\"发动机支承，右\",\"02803A04\":\"发动机支承，左\",\"02803C01\":\"节气门阀，传感器1(G187)\",\"02803C02\":\"节气门阀，传感器2(G188)\",\"02803C03\":\"节气门匹配，步阶计数器\",\"02803C04\":\"节气门体，校正状态\",\"02803D01\":\"发动机转速，(G28)\",\"02803D02\":\"电池电压，(接线端30)\",\"02803D03\":\"节气门阀角度\",\"02803D04\":\"操作，状态\",\"02803E01\":\"节气门阀，传感器1(G187)\",\"02803E02\":\"节气门阀，传感器2(G188)\",\"02803E03\":\"加速踏板位置，传感器1(G79)\",\"02803E04\":\"加速踏板位置，传感器2(G185)\",\"02803F01\":\"加速踏板位置，传感器1(G79)\",\"02803F02\":\"换低档，校正状态\",\"02803F03\":\"换低档，开关\",\"02803F04\":\"换低档，校正状态\",\"02804001\":\"下匹配，传感器1(G187)\",\"02804002\":\"下匹配，传感器2(G188)\",\"02804003\":\"紧急空气隙，传感器1(G187)\",\"02804004\":\"紧急空气隙，传感器2(G188)\",\"02804201\":\"车辆速度，(当前)\",\"02804202\":\"开关位置I\",\"02804203\":\"车辆速度，(规定)\",\"02804204\":\"开关位置II\",\"02804601\":\"蒸汽排放，电磁阀(打开)\",\"02804602\":\"空燃比控制\",\"02804603\":\"蒸汽排放，电磁阀(流量)\",\"02804604\":\"EVAP阀，测试\",\"02804D01\":\"发动机转速，(G28)\",\"02804D02\":\"质量控制流量，传感器(G70)\",\"02804D03\":\"空气质量，二次空气喷射气缸列1\",\"02804D04\":\"二次空气，喷射测试B1\",\"02804E01\":\"发动机转速，(G28)\",\"02804E02\":\"质量控制流量，传感器(G70)\",\"02804E03\":\"空气质量，二次空气喷射气缸列2\",\"02804E04\":\"二次空气，喷射测试B2\",\"02805001\":\"高级，识别I\",\"02805101\":\"车辆识别号(VIN)\",\"02805102\":\"防启动锁，识别(IMMO-ID)\",\"02805201\":\"高级，识别III\",\"02805601\":\"准备就绪位\",\"02805602\":\"周期标识 I\",\"02805603\":\"周期标识 II，'-1\",\"02805604\":\"周期标识 II，'-2\",\"02805701\":\"准备就绪位\",\"02805702\":\"错误标识 I\",\"02805703\":\"周期标识 II，'-1\",\"02805704\":\"周期标识 II，'-2\",\"02805801\":\"周期标识 I\",\"02805802\":\"周期标识 II\",\"02805803\":\"周期标识 III\",\"02805901\":\"驾驶里程，当MIL打开\",\"02805902\":\"油箱状态\",\"02805A01\":\"发动机转速，(G28)\",\"02805A02\":\"凸轮调节，进气状态\",\"02805A03\":\"凸轮调节，进气气缸列1(实际)\",\"02805A04\":\"凸轮调节，进气气缸列2(实际)\",\"02805B01\":\"发动机转速，(G28)\",\"02805B02\":\"发动机负载\",\"02805B03\":\"凸轮调节，进气状态\",\"02805B04\":\"凸轮调节，进气气缸列1(实际)\",\"02805C01\":\"发动机转速，(G28)\",\"02805C02\":\"发动机负载\",\"02805C03\":\"凸轮调节，进气状态\",\"02805C04\":\"凸轮调节，进气气缸列2(实际)\",\"02805D01\":\"发动机转速，(G28)\",\"02805D02\":\"发动机负载\",\"02805D03\":\"相位位置，气缸列1进入\",\"02805D04\":\"相位位置，气缸列2进入\",\"02805E01\":\"发动机转速，(G28)\",\"02805E02\":\"凸轮调节，进气状态\",\"02805E03\":\"凸轮调节测试，气缸列1进入\",\"02805E04\":\"凸轮调节测试，气缸列2进入\",\"02805F01\":\"发动机转速，(G28)\",\"02805F02\":\"发动机负载\",\"02805F03\":\"冷却液，温度(G62)\",\"02805F04\":\"进气歧管，转换\",\"02806101\":\"发动机转速，(G28)\",\"02806102\":\"发动机负载\",\"02806103\":\"冷却液，温度(G62)\",\"02806104\":\"进气空气风口，转换\",\"02806301\":\"发动机转速，(G28)\",\"02806302\":\"冷却液，温度(G62)\",\"02806303\":\"空燃比控制\",\"02806304\":\"空燃比控制，状态\",\"02806401\":\"准备就绪位\",\"02806402\":\"冷却液，温度(G62)\",\"02806403\":\"时间，上次启动发动机以来\",\"02806404\":\"OBD-状态\",\"02806501\":\"发动机转速，(G28)\",\"02806502\":\"发动机负载\",\"02806503\":\"喷射定时\",\"02806504\":\"质量空气流量，传感器(G70)\",\"02806601\":\"发动机转速，(G28)\",\"02806602\":\"冷却液，温度(G62)\",\"02806603\":\"进气空气，温度(G42)\",\"02806604\":\"喷射定时\",\"02806801\":\"上次启动发动机以来，温度\",\"02806802\":\"温度，匹配系数1\",\"02806803\":\"温度，匹配系数2\",\"02806804\":\"温度，匹配系数3\",\"02806A02\":\"电动燃油，泵1/2\",\"02806A03\":\"电动燃油，泵3/4\",\"02806A04\":\"燃油泵，关闭时间\",\"02806B01\":\"发动机转速，(G28)\",\"02806B02\":\"空燃比控制，气缸列1\",\"02806B03\":\"空燃比控制，气缸列2\",\"02806B04\":\"结果，空燃比控制\",\"02806E01\":\"发动机转速，(G28)\",\"02806E02\":\"冷却液，温度(G62)\",\"02806E03\":\"喷射定时\",\"02806E04\":\"节气门阀角度\",\"02807101\":\"发动机转速，(G28)\",\"02807102\":\"发动机负载\",\"02807103\":\"节气门阀角度\",\"02807104\":\"大气，压力\",\"02807801\":\"发动机转速，(G28)\",\"02807802\":\"扭矩规定，ASR\",\"02807803\":\"发动机扭矩，(实际)\",\"02807804\":\"牵引控制，状态\",\"02807A01\":\"发动机转速，(G28)\",\"02807A02\":\"扭矩规定，ASR\",\"02807A03\":\"发动机扭矩，(实际)\",\"02807A04\":\"状态\",\"02807D01\":\"传动系统，电子系统(J217)\",\"02807D02\":\"制动电子系统，(J104)\",\"02807D03\":\"仪表板，(J285)\",\"02807D04\":\"加热/空气，状态(J255)\",\"02807E02\":\"转向角，传感器(G85)\",\"02807E03\":\"安全气囊，(J234)\",\"02807F03\":\"方向盘，电子系统(J527)\",\"02808101\":\"电池，管理\",\"02808102\":\"机油油位，传感器\",\"02808404\":\"冷却状态\",\"02808601\":\"机油温度\",\"02808602\":\"环境，温度\",\"02808603\":\"进气空气，温度(G42)\",\"02808604\":\"发动机出口，温度\",\"02808702\":\"风扇1激活，占空比\",\"02808703\":\"风扇2激活，占空比\",\"02808804\":\"启动后风扇\",\"02808901\":\"空调准备就绪\",\"02808902\":\"空调压缩机\",\"02808903\":\"A/C制冷剂，压力\",\"02808904\":\"风扇请求，来自空调-系统\",\"0280AA01\":\"启动器数据，(接线端50)\",\"0280AA02\":\"启动器输入，(接线端50R)\",\"0280AA03\":\"启动器继电器1\",\"0280AA04\":\"启动器继电器2\",\"01900001\":\"当前通道号：1\",\"01900002\":\"当前通道号：2\",\"01900003\":\"当前通道号：3\",\"01900004\":\"当前通道号：4\",\"01900005\":\"当前通道号：5\",\"01900006\":\"当前通道号：6\",\"01900007\":\"当前通道号：7\",\"01900008\":\"当前通道号：8\",\"01900009\":\"当前通道号：9\",\"0190000A\":\"当前通道号：10\",\"0190000B\":\"当前通道号：11\",\"0190000C\":\"当前通道号：12\",\"0190000D\":\"当前通道号：13\",\"0190000E\":\"当前通道号：14\",\"0190000F\":\"当前通道号：15\",\"01900010\":\"当前通道号：16\",\"01900011\":\"当前通道号：17\",\"01900012\":\"当前通道号：18\",\"01900013\":\"当前通道号：19\",\"01900014\":\"当前通道号：20\",\"01900015\":\"当前通道号：21\",\"01900016\":\"当前通道号：22\",\"01900017\":\"当前通道号：23\",\"01900018\":\"当前通道号：24\",\"01900019\":\"当前通道号：25\",\"0190001A\":\"当前通道号：26\",\"0190001B\":\"当前通道号：27\",\"0190001C\":\"当前通道号：28\",\"0190001D\":\"当前通道号：29\",\"0190001E\":\"当前通道号：30\",\"0190001F\":\"当前通道号：31\",\"01900020\":\"当前通道号：32\",\"01900021\":\"当前通道号：33\",\"01900022\":\"当前通道号：34\",\"01900023\":\"当前通道号：35\",\"01900024\":\"当前通道号：36\",\"01900025\":\"当前通道号：37\",\"01900026\":\"当前通道号：38\",\"01900027\":\"当前通道号：39\",\"01900028\":\"当前通道号：40\",\"01900029\":\"当前通道号：41\",\"0190002A\":\"当前通道号：42\",\"0190002B\":\"当前通道号：43\",\"0190002C\":\"当前通道号：44\",\"0190002D\":\"当前通道号：45\",\"0190002E\":\"当前通道号：46\",\"0190002F\":\"当前通道号：47\",\"01900030\":\"当前通道号：48\",\"01900031\":\"当前通道号：49\",\"01900032\":\"当前通道号：50\",\"01900033\":\"当前通道号：51\",\"01900034\":\"当前通道号：52\",\"01900035\":\"当前通道号：53\",\"01900036\":\"当前通道号：54\",\"01900037\":\"当前通道号：55\",\"01900038\":\"当前通道号：56\",\"01900039\":\"当前通道号：57\",\"0190003A\":\"当前通道号：58\",\"0190003B\":\"当前通道号：59\",\"0190003C\":\"当前通道号：60\",\"0190003D\":\"当前通道号：61\",\"0190003E\":\"当前通道号：62\",\"0190003F\":\"当前通道号：63\",\"01900040\":\"当前通道号：64\",\"01900041\":\"当前通道号：65\",\"01900042\":\"当前通道号：66\",\"01900043\":\"当前通道号：67\",\"01900044\":\"当前通道号：68\",\"01900045\":\"当前通道号：69\",\"01900046\":\"当前通道号：70\",\"01900047\":\"当前通道号：71\",\"01900048\":\"当前通道号：72\",\"01900049\":\"当前通道号：73\",\"0190004A\":\"当前通道号：74\",\"0190004B\":\"当前通道号：75\",\"0190004C\":\"当前通道号：76\",\"0190004D\":\"当前通道号：77\",\"0190004E\":\"当前通道号：78\",\"0190004F\":\"当前通道号：79\",\"01900050\":\"当前通道号：80\",\"01900051\":\"当前通道号：81\",\"01900052\":\"当前通道号：82\",\"01900053\":\"当前通道号：83\",\"01900054\":\"当前通道号：84\",\"01900055\":\"当前通道号：85\",\"01900056\":\"当前通道号：86\",\"01900057\":\"当前通道号：87\",\"01900058\":\"当前通道号：88\",\"01900059\":\"当前通道号：89\",\"0190005A\":\"当前通道号：90\",\"0190005B\":\"当前通道号：91\",\"0190005C\":\"当前通道号：92\",\"0190005D\":\"当前通道号：93\",\"0190005E\":\"当前通道号：94\",\"0190005F\":\"当前通道号：95\",\"01900060\":\"当前通道号：96\",\"01900061\":\"当前通道号：97\",\"01900062\":\"当前通道号：98\",\"01900063\":\"当前通道号：99\",\"01900064\":\"当前通道号：100\",\"01900065\":\"当前通道号：101\",\"01900066\":\"当前通道号：102\",\"01900067\":\"当前通道号：103\",\"01900068\":\"当前通道号：104\",\"01900069\":\"当前通道号：105\",\"0190006A\":\"当前通道号：106\",\"0190006B\":\"当前通道号：107\",\"0190006C\":\"当前通道号：108\",\"0190006D\":\"当前通道号：109\",\"0190006E\":\"当前通道号：110\",\"0190006F\":\"当前通道号：111\",\"01900070\":\"当前通道号：112\",\"01900071\":\"当前通道号：113\",\"01900072\":\"当前通道号：114\",\"01900073\":\"当前通道号：115\",\"01900074\":\"当前通道号：116\",\"01900075\":\"当前通道号：117\",\"01900076\":\"当前通道号：118\",\"01900077\":\"当前通道号：119\",\"01900078\":\"当前通道号：120\",\"01900079\":\"当前通道号：121\",\"0190007A\":\"当前通道号：122\",\"0190007B\":\"当前通道号：123\",\"0190007C\":\"当前通道号：124\",\"0190007D\":\"当前通道号：125\",\"0190007E\":\"当前通道号：126\",\"0190007F\":\"当前通道号：127\",\"01900080\":\"当前通道号：128\",\"01900081\":\"当前通道号：129\",\"01900082\":\"当前通道号：130\",\"01900083\":\"当前通道号：131\",\"01900084\":\"当前通道号：132\",\"01900085\":\"当前通道号：133\",\"01900086\":\"当前通道号：134\",\"01900087\":\"当前通道号：135\",\"01900088\":\"当前通道号：136\",\"01900089\":\"当前通道号：137\",\"0190008A\":\"当前通道号：138\",\"0190008B\":\"当前通道号：139\",\"0190008C\":\"当前通道号：140\",\"0190008D\":\"当前通道号：141\",\"0190008E\":\"当前通道号：142\",\"0190008F\":\"当前通道号：143\",\"01900090\":\"当前通道号：144\",\"01900091\":\"当前通道号：145\",\"01900092\":\"当前通道号：146\",\"01900093\":\"当前通道号：147\",\"01900094\":\"当前通道号：148\",\"01900095\":\"当前通道号：149\",\"01900096\":\"当前通道号：150\",\"01900097\":\"当前通道号：151\",\"01900098\":\"当前通道号：152\",\"01900099\":\"当前通道号：153\",\"0190009A\":\"当前通道号：154\",\"0190009B\":\"当前通道号：155\",\"0190009C\":\"当前通道号：156\",\"0190009D\":\"当前通道号：157\",\"0190009E\":\"当前通道号：158\",\"0190009F\":\"当前通道号：159\",\"019000A0\":\"当前通道号：160\",\"019000A1\":\"当前通道号：161\",\"019000A2\":\"当前通道号：162\",\"019000A3\":\"当前通道号：163\",\"019000A4\":\"当前通道号：164\",\"019000A5\":\"当前通道号：165\",\"019000A6\":\"当前通道号：166\",\"019000A7\":\"当前通道号：167\",\"019000A8\":\"当前通道号：168\",\"019000A9\":\"当前通道号：169\",\"019000AA\":\"当前通道号：170\",\"019000AB\":\"当前通道号：171\",\"019000AC\":\"当前通道号：172\",\"019000AD\":\"当前通道号：173\",\"019000AE\":\"当前通道号：174\",\"019000AF\":\"当前通道号：175\",\"019000B0\":\"当前通道号：176\",\"019000B1\":\"当前通道号：177\",\"019000B2\":\"当前通道号：178\",\"019000B3\":\"当前通道号：179\",\"019000B4\":\"当前通道号：180\",\"019000B5\":\"当前通道号：181\",\"019000B6\":\"当前通道号：182\",\"019000B7\":\"当前通道号：183\",\"019000B8\":\"当前通道号：184\",\"019000B9\":\"当前通道号：185\",\"019000BA\":\"当前通道号：186\",\"019000BB\":\"当前通道号：187\",\"019000BC\":\"当前通道号：188\",\"019000BD\":\"当前通道号：189\",\"019000BE\":\"当前通道号：190\",\"019000BF\":\"当前通道号：191\",\"019000C0\":\"当前通道号：192\",\"019000C1\":\"当前通道号：193\",\"019000C2\":\"当前通道号：194\",\"019000C3\":\"当前通道号：195\",\"019000C4\":\"当前通道号：196\",\"019000C5\":\"当前通道号：197\",\"019000C6\":\"当前通道号：198\",\"019000C7\":\"当前通道号：199\",\"019000C8\":\"当前通道号：200\",\"019000C9\":\"当前通道号：201\",\"019000CA\":\"当前通道号：202\",\"019000CB\":\"当前通道号：203\",\"019000CC\":\"当前通道号：204\",\"019000CD\":\"当前通道号：205\",\"019000CE\":\"当前通道号：206\",\"019000CF\":\"当前通道号：207\",\"019000D0\":\"当前通道号：208\",\"019000D1\":\"当前通道号：209\",\"019000D2\":\"当前通道号：210\",\"019000D3\":\"当前通道号：211\",\"019000D4\":\"当前通道号：212\",\"019000D5\":\"当前通道号：213\",\"019000D6\":\"当前通道号：214\",\"019000D7\":\"当前通道号：215\",\"019000D8\":\"当前通道号：216\",\"019000D9\":\"当前通道号：217\",\"019000DA\":\"当前通道号：218\",\"019000DB\":\"当前通道号：219\",\"019000DC\":\"当前通道号：220\",\"019000DD\":\"当前通道号：221\",\"019000DE\":\"当前通道号：222\",\"019000DF\":\"当前通道号：223\",\"019000E0\":\"当前通道号：224\",\"019000E1\":\"当前通道号：225\",\"019000E2\":\"当前通道号：226\",\"019000E3\":\"当前通道号：227\",\"019000E4\":\"当前通道号：228\",\"019000E5\":\"当前通道号：229\",\"019000E6\":\"当前通道号：230\",\"019000E7\":\"当前通道号：231\",\"019000E8\":\"当前通道号：232\",\"019000E9\":\"当前通道号：233\",\"019000EA\":\"当前通道号：234\",\"019000EB\":\"当前通道号：235\",\"019000EC\":\"当前通道号：236\",\"019000ED\":\"当前通道号：237\",\"019000EE\":\"当前通道号：238\",\"019000EF\":\"当前通道号：239\",\"019000F0\":\"当前通道号：240\",\"019000F1\":\"当前通道号：241\",\"019000F2\":\"当前通道号：242\",\"019000F3\":\"当前通道号：243\",\"019000F4\":\"当前通道号：244\",\"019000F5\":\"当前通道号：245\",\"019000F6\":\"当前通道号：246\",\"019000F7\":\"当前通道号：247\",\"019000F8\":\"当前通道号：248\",\"019000F9\":\"当前通道号：249\",\"019000FA\":\"当前通道号：250\",\"019000FB\":\"当前通道号：251\",\"019000FC\":\"当前通道号：252\",\"019000FD\":\"当前通道号：253\",\"019000FE\":\"当前通道号：254\",\"019000FF\":\"当前通道号：255\"}}"

        return JSON.parse(json);
    }

    function getCarBand(datapack){
        var data = [
            {
                "name": "车辆诊断",
                "carList": [
                    {
                        "where": "亚洲车系",
                        "cars": [
                            {
                                "cn": "OBD",
                                "pic": "obd.png",
                                "type": "obd",
                                "support": [
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A06A&INDEX=1&PROCEDURE='OBD单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=OBD&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "本田",
                                "pic": "honda.png",
                                "en": "Honda",
                                "type": "honda",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A08E&INDEX=1&PROCEDURE='本田全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=honda&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A08E&INDEX=1&PROCEDURE='本田单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=honda&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html）"
                                    }
                                ]
                            },
                            {
                                "cn": "比亚迪",
                                "pic": "byd.png",
                                "en": "BYD",
                                "type": "byd",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C2&INDEX=1&PROCEDURE='比亚迪手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=byd&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "长安",
                                "pic": "changan.png",
                                "en": "ChangAn",
                                "type": "changan",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C3&INDEX=1&PROCEDURE='长安手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=changan&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "长城",
                                "pic": "greatwall.png",
                                "en": "Greatwall",
                                "type": "greatwall",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C5&INDEX=1&PROCEDURE='长城汽车手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=greatwall&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "丰田",
                                "pic": "toyota.png",
                                "en": "Toyota",
                                "type": "toyota",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A058&INDEX=1&PROCEDURE='丰田全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=toyota&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A058&INDEX=1&PROCEDURE='丰田单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=toyota&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "吉利",
                                "pic": "geely.png",
                                "en": "geely",
                                "type": "jili",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C7&INDEX=1&PROCEDURE='吉利手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=jili&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "江淮",
                                "pic": "jh.png",
                                "en": "JAC",
                                "type": "jianghuai",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C6&INDEX=1&PROCEDURE='江淮手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=jianghuai&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷克萨斯",
                                "pic": "ll.png",
                                "en": "LEXUS",
                                "type": "toyota",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A058&INDEX=1&PROCEDURE='雷克萨斯全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=toyota&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A058&INDEX=1&PROCEDURE='雷克萨斯单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=toyota&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "铃木",
                                "pic": "suzuki.png",
                                "en": "SUZUKI",
                                "type": "suzuki",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AD&INDEX=1&PROCEDURE='铃木手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=suzuki&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "马自达",
                                "pic": "mazda.png",
                                "en": "Mazda",
                                "type": "mazda",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A088&INDEX=1&PROCEDURE='马自达全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=mazda&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A088&INDEX=1&PROCEDURE='马自达单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=mazda&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "讴歌",
                                "pic": "acura.png",
                                "en": "Acura",
                                "type": "honda",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A08E&INDEX=1&PROCEDURE='讴歌全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=honda&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A08E&INDEX=1&PROCEDURE='讴歌单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=honda&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奇瑞",
                                "pic": "chery.png",
                                "en": "chery",
                                "type": "chery",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C4&INDEX=1&PROCEDURE='奇瑞手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=chery&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "起亚",
                                "pic": "kia.png",
                                "en": "KIA",
                                "type": "kia",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0A6&INDEX=1&PROCEDURE='起亚全车模块故障扫描（自动检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=kia&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0A6&INDEX=1&PROCEDURE='起亚手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=kia&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "日产",
                                "pic": "nissan.png",
                                "en": "Nissan",
                                "type": "nissan",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A069&INDEX=1&PROCEDURE='日产全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=nissan&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A069&INDEX=1&PROCEDURE='日产单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=nissan&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "三菱",
                                "pic": "mitsubishi.png",
                                "en": "Mitsubishi",
                                "type": "mitsubishi",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A08A&INDEX=1&PROCEDURE='三菱全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=mitsubishi&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A08A&INDEX=1&PROCEDURE='三菱单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=mitsubishi&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A08A&INDEX=1&PROCEDURE='三菱手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=mitsubishi&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "上海通用",
                                "pic": "saic.png",
                                "en": "SAIC-GM",
                                "type": "GMCH",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AB&INDEX=1&PROCEDURE='上海通用手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=GMCH&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "斯巴鲁",
                                "pic": "sibalu.png",
                                "en": "Subaru",
                                "type": "subaru",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0A2&INDEX=1&PROCEDURE='斯巴鲁全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=subaru&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A0A2&INDEX=1&PROCEDURE='斯巴鲁单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=subaru&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "五十铃",
                                "pic": "isuzu.png",
                                "en": "ISUZU",
                                "type": "ISUZU",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0B9&INDEX=1&PROCEDURE='五十铃手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=ISUZU&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "现代",
                                "pic": "xiandai.png",
                                "en": "HYUNDAI",
                                "type": "hyundai",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0A4&INDEX=1&PROCEDURE='现代全车模块故障扫描（自动检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=hyundai&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0A4&INDEX=1&PROCEDURE='现代手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=hyundai&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "英菲尼迪",
                                "pic": "infiniti.png",
                                "en": "INFINITI",
                                "type": "infiniti",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A069&INDEX=1&PROCEDURE='英菲尼迪全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=infiniti&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A069&INDEX=1&PROCEDURE='英菲尼迪单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=infiniti&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A069&INDEX=1&PROCEDURE='英菲尼迪手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=infiniti&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "OBD",
                                "pic": "obd.png",
                                "type": "OBD",
                                "support": [
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A06A&INDEX=1&PROCEDURE='OBD单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=OBD&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奥迪",
                                "pic": "audi.png",
                                "en": "Audi",
                                "type": "volkswagen",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='奥迪全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='奥迪手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "BMW",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0B7&INDEX=1&PROCEDURE='宝马全全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=BMW&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0B7&INDEX=1&PROCEDURE='宝马手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=BMW&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "保时捷",
                                "pic": "porsche.png",
                                "en": "Porsche",
                                "type": "porsche",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0B1&INDEX=1&PROCEDURE='保时捷全车模块故障扫描（自动检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=porsche&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0B1&INDEX=1&PROCEDURE='保时捷手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=porsche&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奔驰",
                                "pic": "benz.png",
                                "en": "Benz",
                                "type": "benz",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0B5&INDEX=1&PROCEDURE='奔驰全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=benz&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A0B5&INDEX=1&PROCEDURE='奔驰单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=benz&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "标致",
                                "pic": "biaozhi.png",
                                "en": "PEUGEOT",
                                "type": "peugeot",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0B4&INDEX=1&PROCEDURE='标致全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=peugeot&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0B4&INDEX=1&PROCEDURE='标致手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=peugeot&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大众",
                                "pic": "vw.png",
                                "en": "VW",
                                "type": "volkswagen",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='大众全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='大众手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "菲亚特",
                                "pic": "fiat.png",
                                "en": "FIAT",
                                "type": "fiat",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0BA&INDEX=1&PROCEDURE='菲亚特手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=fiat&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "福特",
                                "pic": "ford.png",
                                "en": "Ford",
                                "type": "ford",
                                "support": [
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A0BB&INDEX=1&PROCEDURE='福特单模块故障扫描（半自动检测功能）\r\n’&TLMAX=5&CARCODE=01&ServerType=-1&CarType=ford&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "克莱斯勒",
                                "pic": "chrysler.png",
                                "en": "Chrysler",
                                "type": "chrysler",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0BC&INDEX=1&PROCEDURE='克莱斯勒手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=chrysler&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A0BC&INDEX=1&PROCEDURE='克莱斯勒单模块故障扫描（半自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=chrysler&DiagnoseType=1&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷诺",
                                "pic": "renault.png",
                                "en": "RENAULT",
                                "type": "renault",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C0&INDEX=1&PROCEDURE='雷诺手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=renault&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "路虎",
                                "pic": "landrover.png",
                                "en": "LANDROVER",
                                "type": "landrover",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0C1&INDEX=1&PROCEDURE='路虎全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=landrover&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0C1&INDEX=1&PROCEDURE='路虎手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=landrover&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "欧宝",
                                "pic": "opel.png",
                                "en": "OPEL",
                                "type": "opel",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0BF&INDEX=1&PROCEDURE='欧宝手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=opel&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "斯柯达",
                                "pic": "skoda.png",
                                "en": "SKODA",
                                "type": "volkswagen",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='斯柯达全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='斯柯达手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "通用",
                                "pic": "gm.png",
                                "en": "GM",
                                "type": "GM",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0A8&INDEX=1&PROCEDURE='进口通用全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=GM&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0A8&INDEX=1&PROCEDURE='进口通用手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=GM&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "西雅特",
                                "pic": "seat.png",
                                "en": "SEAT",
                                "type": "volkswagen",
                                "support": [
                                    {
                                        "name": "全车模块故障扫描（自动检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='西雅特全车模块故障扫描（自动检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    },
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0AE&INDEX=1&PROCEDURE='西雅特手动单模块检测（专家检测功能）'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=volkswagen&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雪铁龙",
                                "pic": "citroen.png",
                                "en": "Citroen",
                                "type": "citroen",
                                "support": [
                                    {
                                        "name": "手动单模块检测（专家检测功能）",
                                        "link": "empty.htm#ID=A0BE&INDEX=1&PROCEDURE='雪铁龙手动单模块检测（专家检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=citroen&DiagnoseType=2&FunctionID=CCDP_Web/zh-cn/Business/ProfessionalDiagnostics.html"
                                    },
                                    {
                                        "name": "单模块故障扫描（半自动检测功能）",
                                        "link": "empty.htm#ID=A0BE&INDEX=1&PROCEDURE='雪铁龙单模块故障扫描（半自动检测功能）\r\n'&TLMAX=5&CARCODE=01&ServerType=-1&CarType=citroen&FunctionID=CCDP_Web/zh-cn/Business/SimpleDiagnostics.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "模块编程",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "zother/program/bmw",
                                "support": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "设码配置",
                "carList": [
                    {
                        "where": "欧美车型",
                        "cars": [
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "zother/setcode/bmw",
                                "support": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "保养灯归零",
                "carList": [
                    {
                        "where": "亚洲车系",
                        "cars": [
                            {
                                "cn": "讴歌",
                                "pic": "acura.png",
                                "en": "Acura",
                                "type": "MaintenanceReset/ACURA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ACURA&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "北汽",
                                "pic": "baic.png",
                                "en": "BAIC",
                                "type": "MaintenanceReset/BAIC",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BAIC&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "一汽奔腾",
                                "pic": "besturn.png",
                                "en": "Besturn",
                                "type": "MaintenanceReset/BESTURN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BESTURN&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "比亚迪",
                                "pic": "byd.png",
                                "en": "BYD",
                                "type": "MaintenanceReset/BYD",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BYD&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奇瑞",
                                "pic": "chery.png\n",
                                "en": "Chery",
                                "type": "MaintenanceReset/CHERY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/CHERY&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大宇",
                                "pic": "daewoo.png",
                                "en": "DAEWOO",
                                "type": "MaintenanceReset/DAEWOO",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/DAEWOO&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "长城",
                                "pic": "greatwall.png",
                                "en": "GREATWALL",
                                "type": "MaintenanceReset/GREATWALL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/GREATWALL&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "本田",
                                "pic": "honda.png",
                                "en": "HONDA",
                                "type": "MaintenanceReset/HONDA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/HONDA&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "现代",
                                "pic": "xiandai.png",
                                "en": "HYUNDAI",
                                "type": "MaintenanceReset/HYUNDAI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/HYUNDAI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "五十铃",
                                "pic": "isuzu.png",
                                "en": "ISUZU",
                                "type": "MaintenanceReset/ISUZU",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ISUZU&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "起亚",
                                "pic": "kia.png",
                                "en": "KIA",
                                "type": "MaintenanceReset/KIA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/KIA&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷克萨斯",
                                "pic": "ll.png",
                                "en": "LEXUS",
                                "type": "MaintenanceReset/LEXUS",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/LEXUS&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "名爵",
                                "pic": "mg.png",
                                "en": "MG",
                                "type": "MaintenanceReset/MG",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/MG&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "三菱",
                                "pic": "mitsubishi.png",
                                "en": "Mitsubishi",
                                "type": "MaintenanceReset/MITSUBISHI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/MITSUBISHI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "日产",
                                "pic": "nissan.png",
                                "en": "NISSAN",
                                "type": "MaintenanceReset/NISSAN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/NISSAN&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "荣威",
                                "pic": "roewe.png",
                                "en": "ROEWE",
                                "type": "MaintenanceReset/ROEWE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ROEWE&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "铃木",
                                "pic": "suzuki.png",
                                "en": "SUZUKI",
                                "type": "MaintenanceReset/SUZUKI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SUZUKI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "斯巴鲁",
                                "pic": "sibalu.png",
                                "en": "Subaru",
                                "type": "MaintenanceReset/SUBARU",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SUBARU&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "丰田",
                                "pic": "toyota.png",
                                "en": "Toyota",
                                "type": "MaintenanceReset/TOYOTA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/TOYOTA&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "开瑞",
                                "pic": "karry.png",
                                "en": "KARRY",
                                "type": "MaintenanceReset/KARRY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/KARRY&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "瑞麟",
                                "pic": "riich.png",
                                "en": "RIICH",
                                "type": "MaintenanceReset/RIICH",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/RIICH&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "威麟",
                                "pic": "rely.png",
                                "en": "RELY",
                                "type": "MaintenanceReset/RELY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/RELY&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "阿尔法罗密欧",
                                "pic": "alfa.png",
                                "en": "Alfa Romeo",
                                "type": "MaintenanceReset/ALFAROMEO",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ALFAROMEO&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奥迪",
                                "pic": "audi.png",
                                "en": "Audi",
                                "type": "MaintenanceReset/AUDI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/AUDI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宾利",
                                "pic": "bentley.png",
                                "en": "BENTLEY",
                                "type": "MaintenanceReset/BENTLEY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BENTLEY&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奔驰",
                                "pic": "benz.png",
                                "en": "BENZ",
                                "type": "MaintenanceReset/BENZ",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BENZ&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "MaintenanceReset/BMW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BMW&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "别克",
                                "pic": "buick.png",
                                "en": "Buick",
                                "type": "MaintenanceReset/BUICK",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/BUICK&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "凯迪拉克",
                                "pic": "cadillac.png",
                                "en": "Cadillac",
                                "type": "MaintenanceReset/CADILLAC",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/CADILLAC&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雪佛兰",
                                "pic": "chevrolet.png",
                                "en": "Chevrolet",
                                "type": "MaintenanceReset/CHEVROLET",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/CHEVROLET&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "克莱斯勒",
                                "pic": "chrysler.png",
                                "en": "Chrysler",
                                "type": "MaintenanceReset/CHRYSLER/CHRYSLER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/CHRYSLER/CHRYSLER&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雪铁龙",
                                "pic": "citroen.png",
                                "en": "CITROEN",
                                "type": "MaintenanceReset/CITROEN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/CITROEN&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "道奇",
                                "pic": "dodge.png",
                                "en": "Dodge",
                                "type": "MaintenanceReset/ODOGE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ODOGE&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "菲亚特",
                                "pic": "fiat.png",
                                "en": "FIAT",
                                "type": "MaintenanceReset/FIAT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/FIAT&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "福特",
                                "pic": "ford.png",
                                "en": "FORD",
                                "type": "MaintenanceReset/FORD",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/FORD&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "商务之星",
                                "pic": "gmc.png",
                                "en": "GMC",
                                "type": "MaintenanceReset/GMC",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/GMC&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "悍马",
                                "pic": "hummeer.png",
                                "en": "HUMMER",
                                "type": "MaintenanceReset/HUMMER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/HUMMER&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "捷豹",
                                "pic": "jagyar.png",
                                "en": "JAGUAR",
                                "type": "MaintenanceReset/JAGUAR",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/JAGUAR&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "吉普",
                                "pic": "jeep.png",
                                "en": "JEEP",
                                "type": "MaintenanceReset/JEEP",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/JEEP&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "路虎",
                                "pic": "landrover.png",
                                "en": "LANDROVER",
                                "type": "MaintenanceReset/LANDROVER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/LANDROVER&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "林肯",
                                "pic": "lincoln.png",
                                "en": "LINCOLN",
                                "type": "MaintenanceReset/LINCOLN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/LINCOLN&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "玛莎拉蒂",
                                "pic": "masaladi.png",
                                "en": "MASERATI",
                                "type": "MaintenanceReset/MASERATI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/MASERATI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奥茨莫比尔",
                                "pic": "oldsmobile.png",
                                "en": "OLDSMOBILE",
                                "type": "MaintenanceReset/OLDSMOBILE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/OLDSMOBILE&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "欧宝",
                                "pic": "opel.png",
                                "en": "OPEL",
                                "type": "MaintenanceReset/OPEL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/OPEL&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "庞蒂克",
                                "pic": "pontiac.png",
                                "en": "PONTIAC",
                                "type": "MaintenanceReset/PONTIAC",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/PONTIAC&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "标致",
                                "pic": "biaozhi.png",
                                "en": "PEUGEOT",
                                "type": "MaintenanceReset/PEUGEOT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/PEUGEOT&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "保时捷",
                                "pic": "porsche.png",
                                "en": "Porsche",
                                "type": "MaintenanceReset/PORSCHE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/PORSCHE&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷诺",
                                "pic": "renault.png",
                                "en": "RENAULT",
                                "type": "MaintenanceReset/RENAULT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/RENAULT&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "劳斯莱斯",
                                "pic": "rolls.png",
                                "en": "Rolls-Royce",
                                "type": "MaintenanceReset/ROLLS-ROYCE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/ROLLS-ROYCE&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "萨博",
                                "pic": "saab.png",
                                "en": "SAAB",
                                "type": "MaintenanceReset/SAAB",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SAAB&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "土星",
                                "pic": "saturn.png",
                                "en": "Saturn",
                                "type": "MaintenanceReset/SATURN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SATURN&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "塞恩",
                                "pic": "scion.png",
                                "en": "Scion",
                                "type": "MaintenanceReset/SCION",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SCION&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "斯柯达",
                                "pic": "skoda.png",
                                "en": "SKODA",
                                "type": "MaintenanceReset/SKODA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SKODA&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "西雅特",
                                "pic": "seat.png",
                                "en": "SEAT",
                                "type": "MaintenanceReset/SEAT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SEAT&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "精灵",
                                "pic": "smart.png",
                                "en": "SMART",
                                "type": "MaintenanceReset/SMART",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/SMART&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大众",
                                "pic": "vw.png",
                                "en": "VW",
                                "type": "MaintenanceReset/VW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/VW&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "沃克斯豪尔",
                                "pic": "vauxhall.png",
                                "en": "Vauxhall",
                                "type": "MaintenanceReset/VAUXHALL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/VAUXHALL&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "法拉利",
                                "pic": "ferrari.png",
                                "en": "FERRARI",
                                "type": "MaintenanceReset/FERRARI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/FERRARI&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "通用",
                                "pic": "gm.png",
                                "en": "GM",
                                "type": "MaintenanceReset/GM",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='保养灯归零'&TLMAX=5&CARCODE=0C&CarType=MaintenanceReset/GM&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "刹车片归零",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "奥迪",
                                "pic": "audi.png",
                                "en": "Audi",
                                "type": "Maintenancebreakereset/AUDI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/AUDI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奔驰",
                                "pic": "benz.png",
                                "en": "BENZ",
                                "type": "Maintenancebreakereset/BENZ",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/BENZ&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "Maintenancebreakereset/BMW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/BMW&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "捷豹",
                                "pic": "jagyar.png",
                                "en": "Jagyar",
                                "type": "Maintenancebreakereset/JAGUAR",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/JAGUAR&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "通用",
                                "pic": "gm.png",
                                "en": "GM",
                                "type": "Maintenancebreakereset/GM",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/GM&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "欧宝",
                                "pic": "opel.png",
                                "en": "OPEL",
                                "type": "Maintenancebreakereset/OPEL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/OPEL&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "萨博",
                                "pic": "saab.png",
                                "en": "SAAB",
                                "type": "Maintenancebreakereset/SAAB",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/SAAB&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "西雅特",
                                "pic": "seat.png",
                                "en": "SEAT",
                                "type": "Maintenancebreakereset/SEAT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/SEAT&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "斯柯达",
                                "pic": "skoda.png",
                                "en": "SKODA",
                                "type": "Maintenancebreakereset/SKODA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/SKODA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "沃尔沃",
                                "pic": "volvo.png",
                                "en": "VOLVO",
                                "type": "Maintenancebreakereset/VOLVO",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/VOLVO&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大众",
                                "pic": "vw.png",
                                "en": "VW",
                                "type": "Maintenancebreakereset/VW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/VW&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雪铁龙",
                                "pic": "citroen.png",
                                "en": "CITROEN",
                                "type": "Maintenancebreakereset/CITROEN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/CITROEN&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "菲亚特",
                                "pic": "fiat.png",
                                "en": "FIAT",
                                "type": "Maintenancebreakereset/FIAT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/FIAT&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "标致",
                                "pic": "biaozhi.png",
                                "en": "PEUGEOT",
                                "type": "Maintenancebreakereset/PEUGEOT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/PEUGEOT&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "塞恩",
                                "pic": "scion.png",
                                "en": "Scion",
                                "type": "Maintenancebreakereset/SCION",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/SCION&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "沃克斯豪尔",
                                "pic": "vauxhall.png",
                                "en": "Vauxhall",
                                "type": "Maintenancebreakereset/VAUXHALL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/VAUXHALL&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": " 欧美车系",
                        "cars": [
                            {
                                "cn": "路虎",
                                "pic": "landrover.png",
                                "en": "LANDROVER",
                                "type": "Maintenancebreakereset/LANDROVER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/LANDROVER&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": "亚洲车系",
                        "cars": [
                            {
                                "cn": "荣威",
                                "pic": "roewe.png",
                                "en": "ROEWE",
                                "type": "Maintenancebreakereset/ROEWE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/ROEWE&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大宇",
                                "pic": "daewoo.png",
                                "en": "DAEWOO",
                                "type": "Maintenancebreakereset/DAEWOO",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/DAEWOO&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "起亚",
                                "pic": "kia.png",
                                "en": "KIA",
                                "type": "Maintenancebreakereset/KIA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/KIA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "蓝旗亚",
                                "pic": "lancia.png",
                                "en": "LANCIA",
                                "type": "Maintenancebreakereset/LANCIA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/LANCIA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷克萨斯",
                                "pic": "ll.png",
                                "en": "LEXUS",
                                "type": "Maintenancebreakereset/LEXUS",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/LEXUS&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "丰田",
                                "pic": "toyota.png",
                                "en": "Toyota",
                                "type": "Maintenancebreakereset/TOYOTA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='刹车片归零'&TLMAX=5&CARCODE=22&ServerType=-1&CarType=Maintenancebreakereset/TOYOTA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "节气门匹配",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "奥迪",
                                "pic": "audi.png",
                                "en": "Audi",
                                "type": "MaintenanceTmartch/AUDI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/AUDI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "MaintenanceTmartch/BMW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/BMW&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "福特",
                                "pic": "ford.png",
                                "en": "FORD",
                                "type": "MaintenanceTmartch/FORD",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/FORD&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "通用",
                                "pic": "gm.png",
                                "en": "GM",
                                "type": "MaintenanceTmartch/GM",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/GM&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "路虎",
                                "pic": "landrover.png",
                                "en": "LANDROVER",
                                "type": "MaintenanceTmartch/LANDROVER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/LANDROVER&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "林肯",
                                "pic": "lincoln.png",
                                "en": "LINCOLN",
                                "type": "MaintenanceTmartch/LINCOLN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/LINCOLN&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "欧宝",
                                "pic": "opel.png",
                                "en": "OPEL",
                                "type": "MaintenanceTmartch/OPEL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/OPEL&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "萨博",
                                "pic": "saab.png",
                                "en": "SAAB",
                                "type": "MaintenanceTmartch/SAAB",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/SAAB&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "克莱斯勒",
                                "pic": "chrysler.png",
                                "en": "Chrysler",
                                "type": "MaintenanceTmartch/CHRYSLER",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/CHRYSLER&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "菲亚特",
                                "pic": "fiat.png",
                                "en": "FIAT",
                                "type": "MaintenanceTmartch/FIAT",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/FIAT&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "捷豹",
                                "pic": "jagyar.png",
                                "en": "Jagyar",
                                "type": "MaintenanceTmartch/JAGUAR",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/JAGUAR&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": "亚洲车系",
                        "cars": [
                            {
                                "cn": "讴歌",
                                "pic": "acura.png",
                                "en": "ACURA",
                                "type": "MaintenanceTmartch/ACURA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/ACURA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "华晨",
                                "pic": "brillance.png",
                                "en": "Brilliance",
                                "type": "MaintenanceTmartch/BRILLIANCE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/BRILLIANCE&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "比亚迪",
                                "pic": "byd.png",
                                "en": "BYD",
                                "type": "MaintenanceTmartch/BYD",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/BYD&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "长安",
                                "pic": "ca.png",
                                "en": "CHANGAN",
                                "type": "MaintenanceTmartch/CHANGAN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/CHANGAN&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "奇瑞",
                                "pic": "chery.png",
                                "en": "chery",
                                "type": "MaintenanceTmartch/CHERY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/CHERY&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "大宇",
                                "pic": "daewoo.png",
                                "en": "DAEWOO",
                                "type": "MaintenanceTmartch/DAEWOO",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/DAEWOO&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "吉利",
                                "pic": "geely.png",
                                "en": "GEELY",
                                "type": "MaintenanceTmartch/GEELY",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/GEELY&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "长城",
                                "pic": "greatwall.png",
                                "en": "Greatwall",
                                "type": "MaintenanceTmartch/GREATWALL",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/GREATWALL&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "现代",
                                "pic": "xiandai.png",
                                "en": "HYUNDAI",
                                "type": "MaintenanceTmartch/HYUNDAI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/HYUNDAI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "海南马自达",
                                "pic": "mazda.png",
                                "en": "HN Mazda",
                                "type": "MaintenanceTmartch/HNMAZDA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/HNMAZDA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "本田",
                                "pic": "honda.png",
                                "en": "HONDA",
                                "type": "MaintenanceTmartch/HONDA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/HONDA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "汇众汽车",
                                "pic": "huizhong.png",
                                "en": "HUIZHONG",
                                "type": "MaintenanceTmartch/HUIZHONG",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/HUIZHONG&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "英菲尼迪",
                                "pic": "infiniti.png",
                                "en": "INFINITI",
                                "type": "MaintenanceTmartch/INFINITI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/INFINITI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "江淮轿车",
                                "pic": "jh.png",
                                "en": "JAC",
                                "type": "MaintenanceTmartch/JAC",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/JAC&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "起亚",
                                "pic": "kia.png",
                                "en": "KIA",
                                "type": "MaintenanceTmartch/KIA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/KIA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "雷克萨斯",
                                "pic": "ll.png",
                                "en": "LEXUS",
                                "type": "MaintenanceTmartch/LEXUS",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/LEXUS&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "力帆",
                                "pic": "lifan.png",
                                "en": "LIFAN",
                                "type": "MaintenanceTmartch/LIFAN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/LIFAN&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "名爵",
                                "pic": "mg.png",
                                "en": "MG",
                                "type": "MaintenanceTmartch/MG",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/MG&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "三菱",
                                "pic": "mitsubishi.png",
                                "en": "Mitsubishi",
                                "type": "MaintenanceTmartch/MITSUBISHI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/MITSUBISHI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "日产",
                                "pic": "nissan.png",
                                "en": "NISSAN",
                                "type": "MaintenanceTmartch/NISSA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/NISSA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "荣威",
                                "pic": "roewe.png",
                                "en": "ROEWE",
                                "type": "MaintenanceTmartch/ROEWE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/ROEWE&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "青年莲花",
                                "pic": "qnlotus.png",
                                "en": "QNLOTUS",
                                "type": "MaintenanceTmartch/QNLOTUS",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/QNLOTUS&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "丰田",
                                "pic": "toyota.png",
                                "en": "Toyota",
                                "type": "MaintenanceTmartch/TOYOTA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/TOYOTA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "柳州五菱",
                                "pic": "wuling.png",
                                "en": "WULING",
                                "type": "MaintenanceTmartch/WULING",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/WULING&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "郑州日产",
                                "pic": "nissan.png",
                                "en": "ZZNISSAN",
                                "type": "MaintenanceTmartch/ZZNISSAN",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/ZZNISSAN&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "郑州海马",
                                "pic": "haima.png",
                                "en": "Haima",
                                "type": "MaintenanceTmartch/ZZMAZDA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/ZZMAZDA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "铃木",
                                "pic": "suzuki.png",
                                "en": "SUZUKI",
                                "type": "MaintenanceTmartch/SUZUKI",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/SUZUKI&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "中国一汽",
                                "pic": "faw.png",
                                "en": "FAW",
                                "type": "MaintenanceTmartch/FAW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/FAW&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "一汽丰田",
                                "pic": "toyota.png",
                                "en": "FAWTOYOTA",
                                "type": "MaintenanceTmartch/FAWTOYOTA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/FAWTOYOTA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "东风悦达起亚",
                                "pic": "kia.png",
                                "en": "DFYKIA",
                                "type": "MaintenanceTmartch/DFYDKIA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='节气门匹配'&TLMAX=5&CARCODE=0E&ServerType=-1&CarType=MaintenanceTmartch/DFYDKIA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "胎压报警灯归零",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "保时捷",
                                "pic": "porsche.png",
                                "en": "Porsche",
                                "type": "Maintenancetplamp/PORSCHE",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='胎压报警灯归零'&TLMAX=5&CARCODE=02&ServerType=-1&CarType=Maintenancetplamp/PORSCHE&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "Maintenancetplamp/BMW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='胎压报警灯归零'&TLMAX=5&CARCODE=02&ServerType=-1&CarType=Maintenancetplamp/BMW&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            },
                            {
                                "cn": "通用",
                                "pic": "gm.png",
                                "en": "GM",
                                "type": "Maintenancetplamp/GM",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='胎压报警灯归零'&TLMAX=5&CARCODE=02&ServerType=-1&CarType=Maintenancetplamp/GM&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "where": "亚洲车系",
                        "cars": [
                            {
                                "cn": "丰田",
                                "pic": "toyota.png",
                                "en": "Toyota",
                                "type": "Maintenancetplamp/TOYOTA",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A200&INDEX=1&PROCEDURE='胎压报警灯归零'&TLMAX=5&CARCODE=02&ServerType=-1&CarType=Maintenancetplamp/TOYOTA&FunctionID=CCDP_Web/zh-cn/Business/A200.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "name": "个性化设置",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "zother/personalset/bmw",
                                "support": []
                            }
                        ]
                    }
                ]
            },
            {
                "name": "特殊功能",
                "carList": [
                    {
                        "where": "欧美车系",
                        "cars": [
                            {
                                "cn": "大众",
                                "pic": "vw.png",
                                "en": "VW",
                                "type": "spfun/VW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A302&INDEX=1&PROCEDURE='特殊功能'&TLMAX=5&CARCODE=0C&CarType=spfun/VW&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A302.html"
                                    }
                                ]
                            },
                            {
                                "cn": "宝马",
                                "pic": "bmw.png",
                                "en": "BMW",
                                "type": "spfun/BMW",
                                "support": [
                                    {
                                        "name": "",
                                        "link": "empty.htm#ID=A301&INDEX=1&PROCEDURE='特殊功能'&TLMAX=5&CARCODE=0C&CarType=spfun/BMW&ServerType=-1&FunctionID=CCDP_Web/zh-cn/Business/A302.html"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
        var result = null;
        data.forEach(function(item){
            if(datapack.function === item.name){
                return result = item.carList;
            }
        });
        return result;
    }
})();
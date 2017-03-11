/**
 * Created by tapes on 2015/7/7.
 */


(function () {

	var win = window;
	win.external = win.external ? win.external : {};
	win.external.RequestDataFromServer = function (command, sendDataStr, callbackId, paramFromRMT) {
		var sendData = JSON.parse (sendDataStr);
		var paramsObj = sendData.data;
		var ServerType = paramsObj[0].ServerType;
		var DataType = paramsObj[1].DataType;
		var DataPackSTr = getBse64Decode (paramsObj[2].DataPack);
		var DataPack = JSON.parse (DataPackSTr);

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
						"00000001": "组1_随便内容1",
						"00000002": "组1_随便内容2",
						"00000003": "组1_随便内容3",
						"00000004": "组1_随便内容4",
						"00000005": "组1_随便内容5",
						"00000006": "组1_随便内容6",
						"00000007": "组1_随便内容7",
						"00000008": "组1_随便内容8",
						"00000009": "组1_随便内容9"
					},
					"00000002": {
						"00000000": "组2_随便内容0",
						"00000001": "组2_随便内容1",
						"00000002": "组2_随便内容2",
						"00000003": "组2_随便内容3",
						"00000004": "组2_随便内容4",
						"00000005": "组2_随便内容5",
						"00000006": "组2_随便内容6",
						"00000007": "组2_随便内容7"
					},
					"00000003": {
						"00000000": "组3_随便内容0",
						"00000001": "组3_随便内容1",
						"00000002": "组3_随便内容2",
						"00000003": "组3_随便内容3",
						"00000004": "组3_随便内容4"
					}
				};
				resultObj.supids = groupContext[DataPack.supids];
			}
			else {
				//构造普通提示框,输入框数据

				var serviceSupidMap = ["00000011", "00000022", "00000033", "00000001", "00000002", "00000003", "00000004", "00000005", "00000006", "00000007", "00000008", "00000009", "0000000a"];
				var supidCorrespondTextMap = [
					"按钮1",
					"按钮2",
					"按钮3",
					"随便内容1\\n上大声答道随便asd内容11\\n上大声答道随asd便内容1\\n上大声答道随便aw内容1\\n上大声答道q23随便内容1\\n上大声答道234随便内容1\\n上大声答道随便sf内容1\\n上大声答道随asd内容1\\n上大声答道grh随便w内容1\\n上大声答道随便qwe内容1\\n上大声答fh道随便3内容1\\n上大声答道随便daw内容1\\n上大声答道df随f便内容1\\n上大声答道g随gh便内容1\\n上大声答道随wsad便内容1\\n上大声答道gsd随12便内容1\\n上大声答3道gf随便内容1\\n上大声答gsd道随便sad内容1\\n上大声答 道",
					//"随便内容1",
					"随便内容2",
					"随便内容3\\n上大声答道随便asd内容11\\n上大声答道随asd便内容1\\n上大声答道随便aw内容1\\n上大声答道q23随便内容1\\n\\n上大声答道grh随便w内容1\\n上大声答道随便qwe内容1\\n上大声答fh道随便3内容1\\n上大声答道随便daw内容1\\n上大声答道df随f便内容1\\n上大声答道g随gh便内容1\\n上大声答道随wsad便内容1\\n上大声答道gsd随12便内容1\\n上大声答3道gf随便内容1\\n上大声答gsd道随便sad内容1\\n上大声答 道",
					//"随便内容3",
					"随便内容4",
					"随便内容6\\n上大声答道随便asd内容11\\n上大声答道随asd便内容1\\n上大声答道随便aw内容1\\n上大声答道q23随便内容1\\n\\n上大声答道grh随便w内容1\\n上大声答道随便qwe内容1\\n上大声答fh道随便3内容1\\n上大声答道随便daw内容1\\n上大声答道df随f便内容1\\n上大声答道g随gh便内容1\\n上大声答道随wsad便内容1\\n上大声答道gsd随12便内容1\\n上大声答3道gf随便内容1\\n上大声答gsd道随便sad内容1\\n上大声答 道",
					//"随便内容3",
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

		if (DataType.key) {
			switch (DataType.key) {
				case 'CTYPE':
					resultObj = getCTYPE (DataPack);
					break;
				case 'SYS':
					resultObj = getSystem ();
					break;
				case 'CALC_VER_SUPPORT':
					resultObj = getCALC_VER_SUPPORT (DataPack);
					break;
				case 'CALC_VER':
					resultObj = getCALC_VER (DataPack);
					break;
				case 'DTC':
					resultObj = getDTC (DataPack);
					break;
				case 'FREEZE_DTC':
					resultObj = getFreezeDTC (DataPack);
					break;
				case 'FREEZE_SUPPORT':
					if (DataPack.pids) {
						resultObj = getFreezeSupport_Pid ();
					}
					else if (DataPack.pakids) {
						resultObj = getFreezeSupport_Pakid ();
					}
					break;
				case 'FREEZE_RESULT':
					resultObj = getFreezeResult ();
					break;
				case 'FREEZE_PAKID':
					resultObj = getFreezePid ();
					break;
				case 'EGOS_GROUP':
					resultObj = getEGOS_GROUP ();
					break;
				case 'EGOS_SUPPORT':
					resultObj = getEGOS_SUPPORT ();
					break;
				case 'EGOS_RESULT':
					resultObj = getEGOS_RESULT ();
					break;
				case 'CALC_ONE_GROUP':
					resultObj = getCALC_ONE_GROUP ();
					break;
				case 'CALC_ONE_SUPPORT':
					resultObj = getCALC_ONE_SUPPORT ();
					break;
				case 'BASE_ADJUST_SUPPORT':
					resultObj = getBASE_ADJUST_SUPPORT ();
					break;
				case 'CHANNEL_SUPPORT':
					resultObj = getCHANNEL_SUPPORT ();
					break;

				case 'CHANNEL_DATA':
					resultObj = getCHANNEL_DATA ();
					break;
				case 'BASE_ADJUST':
					resultObj = getBASE_ADJUST ();
					break;
				case 'CALC_ONE':
					resultObj = getCALC_ONE ();
					break;
				default :
					console.log ("未模拟的服务器指令:" + DataType.key + "," + paramsObj);
					return;
			}
		}
		setTimeout (function () {
			window.jsRecvServerData ('2', JSON.stringify ({
				'CODETYPE': 'OK',
				'CODEDATA': tool.asc2hex (getBse64Encode (JSON.stringify (resultObj)))
			}), callbackId, paramFromRMT);
		}, 1000);

	};
	win.external.SendToApp = function (action, msg) { if (action === 1009) {jsRecvAppData ("1009", JSON.stringify (["./images/2016.png", JSON.parse (msg).param]))}};
	win.external.SendRMTEventToApp = function (action, msg, params) {};

	function getCHANNEL_SUPPORT () {
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
			}, {
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

	function getCALC_ONE () {

		return {
			items: [{
				"index": "000330-PUB",
				"name": "CCDP",
				"type": "1",
				"danwei": "L",
				"appid": "0001",
				"pid": "P0002",
				"diagid": "000003",
				"formula": "2",
				"formulaname": "abc",
				"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
				}
				, {
					"index": "000336-PUB",
					"name": "CCDP",
					"type": "1",
					"danwei": "L",
					"appid": "0001",
					"pid": "P0002",
					"diagid": "000003",
					"formula": "2",
					"formulaname": "abc",
					"ans": randomString (5)
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
					"ans": randomString (5)
				}
				, {
					"index": "000338-PUB",
					"name": "CCDP",
					"type": "1",
					"danwei": "L",
					"appid": "0001",
					"pid": "P0002",
					"diagid": "000003",
					"formula": "2",
					"formulaname": "abc",
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
				}
				, {
					"index": "000342-PUB",
					"name": "CCDP",
					"type": "1",
					"danwei": "L",
					"appid": "0001",
					"pid": "P0002",
					"diagid": "000003",
					"formula": "2",
					"formulaname": "abc",
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
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
					"ans": randomString (5)
				}
			]
		}


	}

	function getCALC_VER (DataPack) {
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

	function getCALC_VER_SUPPORT (DataPack) {


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

	function randomString (len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = '';
		for (var i = 0; i < len; i++) {
			pwd += $chars.charAt (Math.floor (Math.random () * maxPos));
		}
		return pwd;
	}

	function getDTC (DataPack) {

		var randomStr = randomString (5);

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

	function getFreezeDTC () {
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

	function getFreezeSupport_Pid () {
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
					"fomula": "0002",
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
					"fomula": "0002",
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

	function getFreezeSupport_Pakid () {
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
					"fomula": "0002",
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
					"fomula": "0002",
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

	function getFreezeResult () {
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
			"from": "txt",
			"key": "FREEZE_RESULT",
			"level": "1.2", "itemcount": 3,
			"items": [
				{
					"appid": "",
					"pid": "2400009A",
					"diagid": "070000",
					"fomula": "0000",
					"fomulaname": "sprintf(\"%d\",x2*x1);",
					"index": "0000A3-PUB",
					"ans": ""
				},
				{
					"appid": "",
					"pid": "2400009B",
					"diagid": "070000",
					"fomula": "0000",
					"fomulaname": "sprintf(\"%.5f\",x1*x2*0.01-90);",
					"index": "0000A4-PUB",
					"ans": ""
				},
				{
					"appid": "",
					"pid": "2400009C",
					"diagid": "070000",
					"fomula": "0000",
					"fomulaname": "sprintf(\"%d\",x1*256+x2);",
					"index": "0000A5-PUB",
					"ans": ""
				}]
		};
	}

	function getFreezePid () {
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

	function getEGOS_GROUP () {
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

	function getEGOS_SUPPORT () {
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

	function getEGOS_RESULT () {
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

	function getCTYPE (dataPack) {

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
							"name": "大问答控制等等",
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
							"name": "waaaa",
							"N": {
								"dbfilename": "000002.txt",
								"publicfilename": "pub.txt",
								"nodeaddress": "0000.0002.0002.0002"
							}
						},
						{
							"name": "adaa",
							"N": {
								"dbfilename": "000003.txt",
								"publicfilename": "pub.txt",
								"nodeaddress": "0000.0003.0002.0003"
							}
						},
						{
							"name": "adaaa",
							"N": {
								"dbfilename": "000003.txt",
								"publicfilename": "pub.txt",
								"nodeaddress": "0000.0003.0002.0003"
							}
						},
						{
							"name": "adawaa",
							"N": {
								"dbfilename": "000003.txt",
								"publicfilename": "pub.txt",
								"nodeaddress": "0000.0003.0002.0003"
							}
						},
						{
							"name": "aaqweea",
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

	function getSystem () {
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

	function getCALC_ONE_GROUP () {
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

	function getCALC_ONE_SUPPORT () {
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

	function getCHANNEL_DATA () {
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

	function getBASE_ADJUST_SUPPORT () {
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

	function getBASE_ADJUST () {
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

}) ();
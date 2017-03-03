//JavaScript Document
//工具类
var CommonTool = function () {

	//十六进制UNICODE编码转换字符串
	this.HexUnicodeToString = function (varData) {
		varData = varData.replace (/[ ]/g, "");
		var varOutMessage = '';
		var strTmp = '';
		//\u40FA\u3030\uBACC.....
		for (var i = 0, len = varData.length; i < len; i = i + 4) {
			strTmp = strTmp + "\\u" + this.ChangByteSort (varData.substr (i, 4));
		}
		varOutMessage = varOutMessage + eval ("'" + strTmp + "'");
		return varOutMessage;
	};
	//交换字节序
	//varData:输入数据==FF0ABC12  交换后：12BC0AFF
	this.ChangByteSort = function (varData) {
		var varRet = '';
		for (var i = 0, len = varData.length; i < len; i = i + 2) {
			varRet = varRet + varData[varData.length - i - 2] + varData[varData.length - i - 1];
		}
		return varRet;
	};

	//添加进度条:varData=添加范围0-100  varCtrlId=进度条控件ID
	this.AddBar = function (varData, varCtrlId) {

		var varBar = document.getElementById (varCtrlId);
		var JinDuZong = parseInt (varBar.style.width) + parseInt (varData);

		if (parseInt (JinDuZong) > 100) {
			JinDuZong = 100;
		}
		varBar.style.width = JinDuZong + "%";
	};

	//打印日志:varRecvData=数据   varCtrlId=日志控件ID
	this.LogPrintf = function (varRecvData, varCtrlId) {
		var msgBox = document.getElementById (varCtrlId);
		msgBox.innerHTML = msgBox.innerHTML + '<li><p style="line-height: 175%;padding: 0 3%;width: 100%;box-sizing: border-box;color: #626262;font-size:1.4rem">' + varRecvData + '</p></li>';
		//将消息打印到手机端让其帮保存
		var varSendData = "{'message':'" + varRecvData + "'}";
		try {
			external.SendToApp (3022, varSendData, "3022");
		}
		catch (err) {
			this.ErrorPrintf ("LogPrintf:" + err);
		}
	};

	this.DebugLogPrintf = function (varRecvData) {
		//将调试消息打印到手机端让其帮保存
		var varSendData = "{'message':'" + varRecvData + "'}";
		try {
			external.SendToApp (3023, varSendData, "3023");
		}
		catch (err) {
			this.ErrorPrintf ("DebugLogPrintf:" + err);
		}
	};
	//异常打印
	this.ErrorPrintf = function (varRecvData) {
		var element = document.getElementById ('MessageBox');
		element.innerHTML = element.innerHTML + '<li>' + varRecvData;
		element.scrollTop = element.scrollHeight;
	};

	//强制关闭:varType=1中文 0英语
	this.CloseFun = function (varType) {
		try {
			external.SendToApp (3999, '', "3999");
		}
		catch (err) {
			this.ErrorPrintf ("CloseFun:" + err);
		}
	};

	//打印消息
	this.log = function (msg) {
		this.LogPrintf (msg, 'MessageBox');
	};

	/*
	 * 格式化为指定的字节数
	 * 方法为在后边补'0x00'
	 */
	this.formateStrWithLen = function (str, length) {

		var len = str.length / 2;

		if (len < length) {

			var suffix = '';
			for (var i = 0; i < (length - len); i++) {
				suffix += '00'
			}
			str += suffix;
		}
		return str;
	};

	this.warnTip = function (divId, msg) {
		var box = document.getElementById (divId);
		if (msg) {
			box.style.display = "block";
			box.innerHTML = "<span class='box-p warn-text'>" + msg + "</span>";
		}
		else {
			box.style.display = "none";
		}
		this.layoutTable ();
	};

	/**
	 *转换日期对象为日期字符串
	 * @param date long值
	 * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
	 * @return 符合要求的日期字符串
	 */
	this.getFormatDate = function (date, pattern) {
		if (date == undefined) {
			date = new Date ();
		}
		if (pattern == undefined) {
			pattern = "yyyy-MM-dd hh:mm:ss";
		}
		return date.format (pattern);
	};

	/**
	 *转换日期对象为日期字符串
	 * @param date 日期对象
	 * @param isFull 是否为完整的日期数据,
	 *   为true时, 格式如"2000-03-05 01:05:04"
	 *   为false时, 格式如 "2000-03-05"
	 * @return 符合要求的日期字符串
	 */
	this.getSmpFormatDate = function (date, isFull) {
		var pattern = "";
		if (isFull == true || isFull == undefined) {
			pattern = "yyyy-MM-dd hh:mm:ss";
		}
		else {
			pattern = "yyyy-MM-dd";
		}
		return this.getFormatDate (date, pattern);
	};

	//模拟JQ方法
	this.extend = function (des, src) {
		for (var j in src) {
			if (src.hasOwnProperty (j)) {
				des[j] = src[j];
			}
		}
		return des;
	};

	this.getStyle = function (element, name) {
		var computedStyle;
		try {
			computedStyle = document.defaultView.getComputedStyle (element, null);
		} catch (e) {
			computedStyle = element.currentStyle;
		}
		if (name != "float") {
			return computedStyle[name];
		}
		else {
			return computedStyle["cssFloat"] || computedStyle["styleFloat"];
		}
	};

	this.setStyle = function (elment, obj) {
		for (var prop in obj) {
			if (obj.hasOwnProperty (prop)) {
				elment.style[prop] = obj[prop];
			}
		}
	};


	/**
	 * @param select 计算元素真实高宽，包括 边框 和内外 边距
	 */
	this.realHeight = function (select) {
		var el;
		if (typeof select === 'string' && select !== '') {
			el = $ (select);
		}
		else if (typeof select === 'object' && select) {
			el = select;
		}
		else {
			return;
		}

		var padding = parseInt (el.css ('padding-top')) + parseInt (el.css ('padding-bottom')) || 0;
		var margin = parseInt (el.css ('margin-top')) + parseInt (el.css ('margin-bottom')) || 0;
		var border = parseInt (el.css ('border-top')) + parseInt (el.css ('border-bottom')) || 0;
		return (el.height () ? el.height () : 0) + padding + margin + border;

	};

	/**
	 * @param select 计算元素真实高宽，包括 边框 和内外 边距
	 */
	this.realWidth = function (select) {
		var el;
		if (typeof select === 'string' && select !== '') {
			el = $ (select);
		}
		else if (typeof select === 'object' && select) {
			el = select;
		}
		else {
			return;
		}
		var padding = parseInt (el.css ('padding-left')) + parseInt (el.css ('padding-right')) || 0;
		var margin = parseInt (el.css ('margin-left')) + parseInt (el.css ('margin-right')) || 0;
		var border = parseInt (el.css ('border-left')) + parseInt (el.css ('border-right')) || 0;
		return (el.width () ? el.width () : 0) + padding + margin + border;

	};

	//ascii转十六进制，并以（00）为分隔符
	this.ascToHexByLen = function (input, length) {

		var hexStr = this.asc2hex (input);
		var len = hexStr.length / 2;

		if (len < length) {
			var suffix = '';
			for (var i = 0; i < (length - len); i++) {
				suffix += '00'
			}
			hexStr += suffix;
		}
		return hexStr;
	};

	//后面往前截取符合的所有字符
	this.subLast = function (str, sbuFlag) {
		while (true) {
			if (str.lastIndexOf (sbuFlag) >= 0) {
				str = str.substr (0, str.length - sbuFlag.length);
			}
			else {
				break;
			}
		}
		return str;
	};

	//格式化数字为指定长度，前边加0
	this.formatNumber = function (num, len) {
		var str = num + "";
		var size = len - str.length;
		if (size > 0) {
			for (var i = 0; i < size; i++) {
				str = "0" + str;
			}
		}
		return str;
	};

	//获取URL参数
	this.GetRequest = function (url) {
		//var url = location.search; //获取url中"?"符后的字串
		var theRequest = {};
		if (url.indexOf ("#") != -1) {
			var str = url.substr (url.indexOf ("#") + 1);
			var strs = str.split ("&");
			for (var i = 0; i < strs.length; i++) {
				theRequest[strs[i].split ("=")[0]] = unescape (strs[i].split ("=")[1]);
			}
		}
		return theRequest;
	};

	/**
	 * //搜索框 过滤方法；
	 * @params keyword    关键词
	 * @params data       需要显示的数据
	 * */
	this.filterSearch = function (keyword, data) {

		var filterStr = keyword || '';
		var dataList = data || [];

		if (dataList && dataList.length > 0) {

			var regExp = new RegExp (filterStr, 'i');

			var i = dataList.length;
			while (i) {
				i--;
				var testStr = "" +
					(dataList[i].danwei ? dataList[i].danwei : '') +
					(dataList[i].name ? dataList[i].name : '') +
					(dataList[i].status ? dataList[i].status : '') +
					(dataList[i].ans ? dataList[i].ans : '') +
					(dataList[i].dtcScanStateText ? dataList[i].dtcScanStateText : '');
				console.log (testStr);
				dataList[i].show = regExp.test (testStr);

			}
		}
	};

	this.countDown = function (param) {
		var that = this;
		var defaultSet = {
			time: 30,
			boxID: "",
			startText: "",
			endText: ""
		};
		var paramSet = $.extend (defaultSet, param);
		var $box = $ ("#" + paramSet.boxID);
		var buttonArr = $box.find ("button");
		var confirmButton;

		var i = buttonArr.length;                           //禁止所有按钮事件，获取确定按钮，方面填充数字
		while (i--) {
			$ (buttonArr[i]).prop ("disabled", true);
			if (buttonArr[i].innerText === "确定") {
				confirmButton = buttonArr[i];
				confirmButton.innerText = paramSet.time;
			}
		}

		if (paramSet.startText) {                           //设置开始文本，如果有的话
			that.statuBar (paramSet.startText);
		}

		var time = paramSet.time;

		var timerRun = setInterval (function () {
			time--;
			confirmButton.innerText = time;
			if (time <= 0) {

				//设置结束文本，如果有的话；
				if (paramSet.endText)that.statuBar (paramSet.endText);

				//释放所有按钮事件；
				var i = buttonArr.length;
				while (i--) {
					$ (buttonArr[i]).prop ("disabled", false);
				}

				//确定按钮文本
				confirmButton.innerText = "确定";
				clearInterval (timerRun);
			}

		}, 1000);

	};

	//获取随机数
	this.randomNumber = function (bit) {
		var temp = [];
		var i = bit;
		while (i--) {
			temp.push (Math.floor (Math.random () * 10));
		}
		return temp.join ("");
	};

	//获取随机的01，02；用于模拟数据
	this.roundNumb01or02 = function () {
		return "0" + (Math.round (Math.random ()) + 1);
	};

	//将指定数字转成10或者16进制的asc码字符串;如果digit没有值,默认为10进制
	this.toAsc = function (dec, digit) {
		var result = "";
		var len = dec.toString ().length;
		var i = 0;
		if (digit == 16) {
			while (i < len) {
				result += (dec.toString ().charCodeAt (i)).toString (16);
				i++;
			}
		}
		else {
			while (i < len) {
				result += dec.toString ().charCodeAt (i);
				i++;
			}
		}
		return result;
	};

	//asc码解码，如果是16进制就设置步进值为2(默认值)，否则就是3（10进制：如果需要解10进制，那必须规定每个ASC码为3位，如：001 002 003，否则无法判断）
	this.decodeASC = function (Asc, numType) {
		var step = numType == "16" ? 2 : 3;
		var len = Asc.length / step;
		var i = 0;
		var result = [];

		while(i < len){
			var temp = Asc.substr((i++)*step,step);
			result.push(String.fromCharCode(parseInt(temp,numType)));
		}

		return new String(result.join(""));
	};

	/**
	 * ASC字符转十进制
	 */
	this.asc2dec = function (input) {
		var output = '';
		var inputStr = input + '';
		var len = inputStr.length;
		for (var pos = 0; pos < len; pos++) {
			output += inputStr.charCodeAt (pos);
			if (pos != (inputStr.length - 1)) {
				output += ",";
			}
		}
		return output;
	};
	/**
	 * 十进制转十六进制
	 */
	this.dec2hex = function (input) {
		input = input.split (',');
		var output = '';
		for (var pos = 0, len = input.length; pos < len; pos++) {
			output += parseInt (input[pos], 10).toString (16);
		}
		return output;
	};
	/**
	 * ASCII字符转十六进制
	 * param input String 输入字符
	 * 示例：alertasc2hex("</a>"))*
	 */
	this.asc2hex = function (input) {
		output = this.asc2dec (input);
		output = this.dec2hex (output);
		return output;
	};
	/**
	 * 十六进制转ASCII字符
	 * param input String 输入字符
	 * 示例：alertasc2hex("</a>"))*
	 */
	this.hex2a = function (input) {
		var output = '';
		for (var i = 0, len = input.length; i < len; i = i + 2) {
			output += String.fromCharCode (parseInt (input.substr (i, 2), 16));
		}
		return output;
	};

	//十六进制转十进制
	this.hex2dec = function (input) {
		return parseInt (input, 16);
	};

	//2014年9月4日，转到特定长度十六进制，str转换字符串，intSize转换后的十六进制长度
	this.toHex = function (str, intSize) {
		str += '';
		var outStr = this.dec2hex (str);
		var temp = "";
		for (var i = 0; i < intSize - outStr.length; i++) {
			temp = temp + "0";
		}
		outStr = temp + outStr;
		return outStr;
	};

	//随机输出指定数组的某一个项;
	this.randomSingleMap = function (Arr) {
		var index = Math.floor (Math.random () * Arr.length);
		return Arr[index];
	};

	//随机输出指定数组的某个区间N个项相加的字串;
	this.randomUnlimitMap = function (Arr, setLimit) {

		var newArr = [].concat (Arr);
		var max = Math.floor (Math.random () * Arr.length);
		if (!max && setLimit)max = 1;
		var preContactArr = [];
		for (var i = 0; i < max; i++) {
			var index = Math.floor (Math.random () * newArr.length);
			preContactArr.push (newArr[index]);
			newArr.splice (index, 1);
		}
		return preContactArr.join ("");
	};


	//随机输出指定位数的10进制数,不包括0字符
	this.randomDecByLimitBit = function (bit) {
		var that = this;
		var tempArr = [];
		while (bit--) {
			tempArr.push (that.randomSingleMap ([1, 2, 3, 4, 5, 6, 7, 8, 9]));
		}
		return tempArr.join ("");
	};


	/**根据步进截取字串
	 * @param resources   数据源
	 * @param times_int     截取的次数
	 * @param start_int     开始的位置
	 * @param step_int      步进值
	 * @returns {ary}     输出数组
	 */
	this.cutStringByStep = function (resources, times_int, start_int, step_int) {
		var result = [];
		for (var i = 0; i < times_int; i++) {
			result.push({
				index : i,
				value : resources.substr (start_int + i * step_int, step_int)
			})
		}
		return result;
	};

	/**根据步进截取字串
	 * @param obj           数据源
	 * @param keyName       键
	 * @param valueName     值
	 * @returns {Array}     输出数组
	 *
	 * 把｛key:value｝转换成
	 * [｛keyName：key,valueName:value｝]
	 *
	 */
	this.objToArr = function (obj, keyName, valueName) {
		var result_arr = [
			//{
			//key : "",
			//value : ""
			//}
		];

		for (var prop in obj) {
			if (!obj.hasOwnProperty (prop))continue;
			var tempObj = {};
			tempObj[keyName] = prop;
			tempObj[valueName] = obj[prop];
			result_arr.push (tempObj);
		}
		return result_arr;
	};


	this.contact2ArrToObj = function (arr1, arr2) {
		var obj = {};
		for (var i = 0; i < arr1.length; i++) {
			obj[arr1[i]] = arr2[i];
		}
		return obj;
	};

	//根据指定的步进值，给字串添加分隔符号
	this.addSplitMarkInStringEachStep = function (source, mark, step) {
		var temp = "";
		var i, len = source.length;
		for (i = 0; i < len;) {
			temp += source.substring (i, i + step) + mark;
			i += step
		}
		return temp;
	};

	//检测checked的元素，判断根据每个子元素 name 值
	this.getCheckedElement = function (name) {
		var result = [];
		var inputs = $ ("input[name='" + name + "']");
		var i = inputs.length;
		var count = 0;
		while (i--) {
			var curInput = inputs[i];
			if (curInput.checked) {
				result.push (curInput);
				count++;
			}
		}
		return result.length ? (count > 1 ? result : result[0]) : {};      //如果搜索到2个以上checked,就返回整个数组，否则只返回第一个
	};


	/**
	 * @runBoxId 运行在哪个盒子，就写哪个盒子的ID
	 * @breakOffBoxId 关闭clock的开关，当指定的盒子显示时，就关闭clock
	 * */
	this.clock = function (runBoxId, breakOffBoxId) {
		var tool = this;
		var $runBox = $ ("#" + runBoxId);
		var $breakOffBox = $ ("#" + breakOffBoxId);
		var htmlStr = "耐心等待 ";
		var minTen = "0";
		var minDit = "0";
		var secTen = "0";
		var secDit = "0";

		//手动关闭，或者指定某个表弹出后关闭；
		if (!runBoxId || $breakOffBox.is (":visible")) {
			clearInterval (tool.clockWatcher);
			$ ("#" + tool.clockBoxId).html ("");
			tool.clockBoxId = "";
			return;
		}

		tool.clockBoxId = runBoxId;
		$runBox.html (htmlStr + minTen + minDit + ":" + secTen + secDit);
		tool.clockWatcher = setInterval (function () {
			secDit++;

			if (secDit > 9) {                 //当个位数 大于9，就重置为0，十位进1；
				secDit = 0;
				secTen++;
			}

			if (secTen > 5) {                 //当十位数 大于5，代表分钟 的个位 进1；
				secTen = 0;
				minDit++;
			}

			if (minDit > 9) {                 //当分钟 的个位 大于9，十位进1
				minDit = 0;
				minTen++;
			}

			$runBox.html (htmlStr + minTen + "" + minDit + ":" + secTen + "" + secDit);

		}, 1000);

	};

	this.stopPropagation = function(e) {
		e = e || window.event;
		if(e.stopPropagation) { //W3C阻止冒泡方法
			e.stopPropagation();
		} else {
			e.cancelBubble = true; //IE阻止冒泡方法
		}
	};

};

(function () {
	window.tool = new CommonTool ();
}) ();










/**
 * Created by Andy on 2017/2/13.
 */

$(document).ready(function () {
	var win = window;
	win.server = win.server ? win.server : {};
	win.server.request = function (serverType, dataType, dataPack, callback, handleBackRequest) {
		if (global.RMTID.role == 2) return;   //控制机不需要有服务器交互行为
		var that = this;

		var paramsObj = [
			{
				'ServerType': serverType
			},
			{
				'DataType': dataType
			},
			{
				'DataPack': getBse64Encode((typeof dataPack === "object") ? JSON.stringify(dataPack) : dataPack)
			}
		];

		var sendDataStr = JSON.stringify({
			'subURL': win.global.businessInfo.serverDst,
			'data': paramsObj
		});

		//var data = {ServerType:1001,DataType:0,DataPack:getBse64Encode(JSON.stringify({"function":"防盗匹配"}))};
		var data = (function () {
			var result = {};
			var _data = JSON.parse(sendDataStr).data || [];
			_data.forEach(function (item) {
				//处理sendDataStr里面的属性类型，转换成服务器需要的格式
				for (var i in item) {
					if (item.hasOwnProperty(i)) {
						if ("DataType" == i) {
							if (item[i] instanceof Object) {item[i] = JSON.stringify(item[i])}  //DataType的值是字串Json，而不是对象Json
						}
						if (!isNaN(Number(item[i]))) {item[i] = Number(item[i])} //把字串类型的数字，转成数字类型
						result[i] = item[i];
					}
				}
			});
			return result;
		})();

		that.ajaxHandle(data, callback, handleBackRequest);

		console.log('toServer：serverType：', serverType, 'dataType：', dataType, 'dataPack：', JSON.stringify(dataPack));
	};

	//把参数添加到回调的属性上
	win.server.addCallbackParam = function (func, params) {
		func.params = JSON.parse(JSON.stringify(params));
		return func;
	};

	win.server.ajaxHandle = function (data, callback, handleBackRequest) {
		var that = this;
		var ajaxInstance = $.ajax({
			type: "POST",
			async: true,
			timeout: 10000, //超时时间设置，单位毫秒
			url: global.businessInfo.serverHost + "/CCDPWebServer/" + global.businessInfo.serverDst,
			dataType: "xml",
			data: data,
			complete: function (XMLHttpRequest, status) {
				switch (status) {
					case "success":
						var xml = XMLHttpRequest.responseXML;

						//CodeData的值在服务器端被转了2次base64,APP底层的工作就解一次base64，并把内容再转成16进制，在此模拟APP的工作
						xml.getElementsByTagName("CodeData")[0].textContent = tool.asc2hex(getBse64Decode(xml.getElementsByTagName("CodeData")[0].textContent));

						var jsonData = JSON.parse(tool.xml2json(xml.childNodes[0], "").toUpperCase()).ROOT;

						that.jsRecvServerData("success", jsonData, callback, handleBackRequest);
						break;
					case "timeout":
						ajaxInstance.abort();
						that.jsRecvServerData("timeout", "服务器请求超时", callback, handleBackRequest);
						break;
					case "error":
						that.jsRecvServerData("error", "服务器请求失败", callback, handleBackRequest);
						console.log('http请求失败:', XMLHttpRequest);
						break;
				}
			}

		});
	};
});
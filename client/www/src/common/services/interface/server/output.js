/**
 * Created by Andy on 2017/2/13.
 */
$(document).ready(function () {
	var win = window;
	win.server = win.server ? win.server : {};
	win.server.request = function (serverType, dataType, dataPack, callback, handleBadRequest) {
		if (global.RMTID.role == 2) return;   //控制机不需要有服务器交互行为
		var that = this;
		var sendDataStr = JSON.stringify({
			subURL: win.global.businessInfo.serverDst,
			data: [
				{
					ServerType: serverType
				},
				{
					DataType: dataType
				},
				{
					DataPack: getBse64Encode((typeof dataPack === "object") ? JSON.stringify(dataPack) : dataPack)
				}
			]
		});

		var pack = (function () {
			var result = {};
			var _data = JSON.parse(sendDataStr).data || [];
			_data.forEach(function (item) {
				//处理sendDataStr里面的属性类型，转换成服务器需要的格式
				for (var i in item) {
					if (item.hasOwnProperty(i)) {
						if ("DataType" == i) {
							if (item[i] instanceof Object) {
								item[i] = JSON.stringify(item[i])
							}  //DataType的值是字串Json，而不是对象Json
						}
						if (!isNaN(Number(item[i]))) {
							item[i] = Number(item[i])
						} //把字串类型的数字，转成数字类型
						result[i] = item[i];
					}
				}
			});
			return result;
		})();

		var link = global.businessInfo.link;
		//在线模式,使用AJAX请求服务器;
		if (link.indexOf("=online&") >= 0) {
			that.ajaxHandle(pack, callback, handleBadRequest);
		}
		else {
			//离线版本的服务器数据走这个通道;
			win.external.RequestDataFromServer(3021, JSON.stringify(pack), "");

			//并且同时创建一个全局函数接受APP推送的数据,第三个参数暂时用不到!
			if (!win.jsRecvServerData) {

				//走离线的时候,APP反馈的是json数据
				win.jsRecvServerData = function (status, json, abandonParam) {
					var _json = /^[\{\[]/.test(json) ? JSON.parse(json) : json;
					that.jsRecvServerData(status, _json, callback, handleBadRequest);
				};
			}
		}

		console.log('toServer：serverType：', serverType, 'dataType：', dataType, 'dataPack：', JSON.stringify(dataPack));
	};


	win.server.analyzeXml = function (xml) {
		var _xml = null;

		//如果输入是一个string,就转成document类型
		if(typeof xml === "string"){
			_xml = win.xmlTool.string2xml(xml);
		}else{
			_xml = xml;
		}

		//CodeData的值在服务器端被转了2次base64,APP底层的工作就解一次base64，并把内容再转成16进制，在此模拟APP的工作
		_xml.getElementsByTagName("CodeData")[0].textContent = tool.asc2hex(getBse64Decode(_xml.getElementsByTagName("CodeData")[0].textContent));

		//最后输出ROOT的内容
		return JSON.parse(win.xmlTool.xml2json(_xml.childNodes[0], "").toUpperCase()).ROOT;
	};

	//把参数添加到回调的属性上
	win.server.addCallbackParam = function (func, params) {
		func.params = JSON.parse(JSON.stringify(params));
		return func;
	};

	win.server.ajaxHandle = function (pack, callback, handleBadRequest) {
		var that = this;
		var ajaxInstance = $.ajax({
			type: "POST",
			async: true,
			timeout: 10000, //超时时间设置，单位毫秒
			url: global.businessInfo.serverHost + "/CCDPWebServer/" + global.businessInfo.serverDst,
			dataType: "xml",
			data: pack,
			complete: function (XMLHttpRequest, status) {
				switch (status) {
					case "success":
						var xml = XMLHttpRequest.responseXML;
						that.jsRecvServerData("success", that.analyzeXml(xml), callback, handleBadRequest);
						break;
					case "timeout":
						ajaxInstance.abort();
						that.jsRecvServerData("timeout", "服务器请求超时", callback, handleBadRequest);
						break;
					case "error":
						that.jsRecvServerData("error", "服务器请求失败", callback, handleBadRequest);
						console.log('http请求失败:', XMLHttpRequest);
						break;
				}
			}
		});
	};
});
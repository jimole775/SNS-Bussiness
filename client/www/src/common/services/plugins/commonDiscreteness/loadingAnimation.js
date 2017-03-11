/**
 * Created by Andy on 2016/4/22.
 */
(function () {

	var win = window;
	var doc = document;
	doc.body.innerHTML += [
		'<!-- 中心加载动画 -->',
		'<div id="bodyLoading" style="display: none;height: 100%;width: 100%;z-index: 998;position: absolute;top: 0;left: 0;">',
		'<div style="display: table-cell;vertical-align:middle;position: relative;z-index:998">',
		'<div id="bodyLoadingIconBox" style="display: table;border-radius: 5px;background: rgba(0, 0, 0, .6);width: 52%;height: 22%;z-index: 997;margin:0 auto">',
		'<div id="bodyLoadingIconLayout" style="z-index: 101;display: table-cell;vertical-align: middle;text-align: center;color: #fff;font-size: 1.8rem;padding:1.6rem;position: relative;">',
		//'<img src="images/common/refresh_1.png"',
		//'     style="background:rgba(250,250,250,.3);border-radius:3px;position: absolute;right: 0;top: 0;opacity: .7;z-index: 998;display: none;width: 1.7rem;box-sizing: border-box;padding:0.3rem"',
		//'     id="loadingClose" onclick="tool.loading(0)"/>',

		'<img src="images/common/iconfont-loading.png" id="loading-img-spin" alt="" style="position: relative;margin: 1.0rem auto;display: block;width: 5.0rem;"/>',

		'<p style="margin-top:1rem"><span id="loadingText">数据初始化...</span><span id="timerText"></span></p>',
		'</div>',
		'</div>',
		'</div>',

		'<div id="bodyLoadingCover" style="text-align: center;position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 996;background: rgba(0, 0, 0, .2);"></div>',
		'</div>'

	].join ('');

	/**
	 * 数据请求等待动画，分为头部和中间两个
	 * @params object.pos: "head"  "body";
	 * @params object.text: "";
	 * @params object: 0 如果object等于0，就隐藏
	 * */
	CommonTool.prototype.loading = function (object) {

		var self = arguments.callee;
		if (!self.status)self.status = {};
		if (self.spinner)clearInterval (self.spinner);

		var bodyLoading      = doc.getElementById ("bodyLoading");
		var spinImg          = doc.getElementById ("loading-img-spin");
		var loadingText      = doc.getElementById ("loadingText");
		var bodyLoadingCover = doc.getElementById ("bodyLoadingCover");
		//var loadingClose     = doc.getElementById ("loadingClose");

		//监听loading的显示状态
		self.loadingStatusWatcher = setInterval (function () {
			var status = self.status.display = bodyLoading.style.display;
			if (status === "none") {
				self.status.display = false;
				clearInterval (self.loadingStatusWatcher);
			}
		}, 500);

		if (object === 0) {
			// 如果遮罩层已经在【远程异常4】的抓取状态（抓取之后会隐藏遮罩），
			// 再次接到关闭遮罩的指令，就重置文本的缓存，使得 【远程异常4】 的遮罩返还能力失效，
			// 这样可以避免点击【继续等待】之后，远程再次建立链接，遮罩层仍然存在！
			// 【远程异常4】返还遮罩的条件 ：if (loadingTxt && tool.loading.status.text)   //文本缓存和当前文本的值都为真
			if(bodyLoading.style.display === "none" && tool.alert.status && tool.alert.status.display) self.status.text = "";

			bodyLoading.style.display = "none";
			//clearTimeout(self.loadingCloseBtnWatcher);
			//clearTimeout(self.loadingCloseWatcher);
			return;
		}


		//clearTimeout(self.loadingCloseBtnWatcher);
		//clearTimeout(self.loadingCloseWatcher);
		//loadingClose.style.display = "none";

		//10秒之后，给出关闭功能
		//self.loadingCloseBtnWatcher = setTimeout(function(){
		//	loadingClose.style.display = "block";
		//
		//	//再过5秒不管如何都关闭loading窗体；
		//	self.loadingCloseWatcher = setTimeout(function(){
		//		bodyLoading.style.display = "none";
		//	},5000);
		//
		//},10000);

		var defaultOption = {
			    pos    : 'body',        //废弃属性
			    text   : '数据初始化...',
			    cover  : 1,             //建议改成true  false
			    type   : "spin",
			    display: false
		};

		var pluginOption  = extend (defaultOption, object);
		self.status = extend (self.status, pluginOption);
		switch (pluginOption.type) {
			case "spin":
				spin ();
				layoutBodyLoading ();
				break;
		}

		//旋转事件
		function spin () {
			//首选animationCSS动画方法；
			if (supportCss3 ("animation")) {
				spinImg.style.animation       = ".75s rotate 0s normal none infinite";
				spinImg.style.webkitAnimation = ".75s rotate 0s normal none infinite";
				return;
			}
			//次选transformCSS旋转方法；
			if (supportCss3 ("transform")) {
				var speed    = 12;
				var step     = 360 / speed - 1;
				var i        = 0;
				self.spinner = setInterval (function () {
					spinImg.style.mozTransform    = "rotate(" + speed * i + "deg)";
					spinImg.style.oTransform      = "rotate(" + speed * i + "deg)";
					spinImg.style.webkitTransform = "rotate(" + speed * i + "deg)";
					spinImg.style.transform       = "rotate(" + speed * i + "deg)";
					spinImg.style.filter          = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + speed * i / 90 + ")";
					if (i++ === step) i = 0;
				}, 25);
				return;
			}
			//如果CSS3都不支持，就以GIF动画代替，考虑flash
			spinImg.src = "images/common/iconfont-loading.gif";
		}

		function layoutBodyLoading () {
			var bodyLoadingIconBox = doc.getElementById ("bodyLoadingIconBox");

			//判断需不需要文本修改
			if (pluginOption.text) loadingText.innerText = pluginOption.text;

			//给出一个阻止遮罩层的开关；只抓取status数据，不显示遮罩；
			if (self.status && self.status.disable) return;

			bodyLoading.style.display = "table";

			//判断需不需要遮罩层
			setTimeout(function(){
				if (!pluginOption.cover)
					bodyLoadingCover.style.display = "none";
				else
					bodyLoadingCover.style.display = "block";
			},45);
		}


		//模拟JQ方法
		function extend (desc, src) {
			for (var j in src)
				if (src.hasOwnProperty (j)) desc[j] = src[j];
			return desc;
		}

		//判断CSS3支持情况
		function supportCss3 (cssProp) {
			var prefix    = ['-webkit-', '-Moz-', '-ms-', '-o-'],
			    htmlStyle = doc.documentElement.style,
			    result    = false,
			    prop      = [],
			    i         = prefix.length;

			while (i--) prop[i] = prefix[i] + cssProp;
			prop[prefix.length] = cssProp;
			var j = prop.length;
			while (j--)
				if (prop[j] in htmlStyle) {
					result = true;
					break;
				}

			return result;
		}
	};

}) ();
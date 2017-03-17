/**
 * Created by Andy on 2017/1/18.
 */
(function () {
	CommonTool.prototype.alert = function (contents, callbackConfirm, callbackCancel) {
		var content_ary;
		var tool = this;

		var self = arguments.callee;
		var win = window;
		if (!self.status)self.status = {};
		var $el = $("#alertBox");

		if (contents == "0") {
			if ($el.length && $el.is(":visible"))tool.popShow("alertBox", 0);
			return;
		}
		else if (typeof contents === "string") {
			content_ary = [contents, "确定", "取消"];
		}
		else {
			content_ary = contents;
		}

		if (!$el.length) {
			var alertBox = [
				'<div class="box tip-box-wide alert-box" id="alertBox">',
				'<h1 class="box-title">提示</h1>',
				'<div>',
				'<p class="box-p" id="alertBoxContent">消息</p>',
				'</div>',

				'<div class="bottom-bar-button-box">',
				'<button type="button" class="bottom-bar-button bottom-bar-button1" id="alertConfirm">确认</button>',
				'<button type="button" class="bottom-bar-button" style="display: none" id="alertCancel">取消</button>',
				'</div>',
				'</div>'
			].join('');
			$("body").append(alertBox);
		}

		var btnConfirm = $("#alertConfirm");
		var btnCancel = $("#alertCancel");
		$("#alertBoxContent").html(content_ary[0]);
		btnConfirm.html(content_ary[1]);
		btnCancel.html(content_ary[2] ? content_ary[2] : "取消");
		win.tool.loading(0);
		tool.popShow("alertBox", 1);
		self.status.display = true;
		self.status.params = [contents, callbackConfirm, callbackCancel];

		btnConfirm.removeClass("bottom-bar-button2").addClass("bottom-bar-button1");           //当弹框连续弹出时，必须保证初始化时只有一个按钮，且样式正确
		btnCancel.hide();                                                                     //这样的目的在于,
		// 即使第三个回调参数不做任何声明，随意调用，都可以保证正常运行
		btnConfirm.off().on("click", function () {
			win.global.handleAlertConfirm();
			win.sendRMTEventToApp("global.handleAlertConfirm", "");
		});

		win.global.handleAlertConfirm = function () {
			tool.popShow("alertBox", 0);
			if (typeof callbackConfirm === "function")callbackConfirm();
			self.status.display = false;
			self.status.params = [];
		};

		/**
		 * 当且只有第三个参数被声明了，第二个按钮才会显示
		 * */
		if (callbackCancel !== undefined) {
			btnConfirm.removeClass("bottom-bar-button1").addClass("bottom-bar-button2");
			btnCancel.removeClass("bottom-bar-button1").addClass("bottom-bar-button2").show();

			btnCancel.off().on("click", function () {
				win.global.handleAlertCancel();
				win.sendRMTEventToApp("global.handleAlertCancel", "");
			});

			win.global.handleAlertCancel = function () {
				tool.popShow("alertBox", 0);
				if (typeof callbackCancel === "function")callbackCancel();
				self.status.display = false;
				self.status.params = [];
			};
		}

	};


	//显示 or 隐藏弹出框
	CommonTool.prototype.popShow = function (boxId, flag) {
		var $box = $("#" + boxId);
		var isShow = $box.is(":visible");
		if (!isShow && flag) this.popBox(boxId);
		if (isShow && !flag) this.closeBox(boxId);
	};

	/**
	 * 弹出框显示
	 * @param boxID
	 */
	CommonTool.prototype.popBox = function (boxID) {
		this.loading(0);

		var that = this;
		var objBox = $("#" + boxID);
		var body = $("body");
		var win = window;
		var htmlWidth = win.CONSTANT.WINDOW_WIDTH;
		var htmlHeight = win.CONSTANT.WINDOW_HEIGHT;

		/**
		 * 创建半透明遮罩，为了防止连续的弹框，造成遮罩颜色加深，
		 * 需要做个判断，如果存在遮罩，就直接显示，
		 * 不过不存在，就重新创建
		 * */
		var over = $(".over");
		if (over.length) {
			over.css("opacity", "0.5");
			over.show();
		}
		else {
			var overDiv = document.createElement("div");
			body.append($(overDiv));
			$(overDiv).attr("class", "over");
		}

		var maxHeight = Math.floor(htmlHeight * 0.8);
		var maxWidth = Math.floor(htmlWidth * 0.9);

		$.fn.calcAlertBoxHeight = function () {

			var title = objBox.children(":first");                        //3层盒子的第一个盒子
			var contentBox = title.next();                                //3层盒子的第二个盒子
			var bottomBtn = objBox.find(".bottom-bar-button-box");        //3层盒子的第三个盒子

			var _p = $(contentBox).find("p");
			if (!_p.length) _p = $(contentBox).find("li");                           //如果没有P元素，直接获取li元素，以解决第二层盒子是ul元素

			var _pHeightsAmount = (function () {
				var len = _p.length;
				var result = 0;
				while (len--) {
					result += that.realHeight($(_p[len]));
				}

				return result;               //计算第一个的高度，整个盒子的高度以整个为基准，
			})();

			var titleHeight = that.realHeight(title);
			var bottomHeight = that.realHeight(bottomBtn);

			if ((titleHeight + bottomHeight + _pHeightsAmount) >= maxHeight) {                //如果盒子高度大于屏幕高度的80%，就重新设定样式

				objBox.css({
					"height": maxHeight
				});

				title.css({"height": "auto"});

				bottomBtn.css({"bottom": "0"});

				contentBox.css({
					"height": maxHeight - titleHeight - bottomHeight,
					"overflow-y": "auto",
					"display": "block",
					"margin": 0,
					"padding": 0
				}).scrollTop(0);                //如果框体高度大于80%，重复的内容弹框会记录滚动高度，所以，每次弹出之前，把滚动条顶置

			}
			else {
				contentBox.css({                //因为有可能会重复使用同一个div，
					"height": "auto",           //所以，当内容文本高度小于窗口高度的80%时，重新设置高度为“auto”
					"display": "block",
					"margin": 0,
					"padding": 0
				});
			}

		};

		objBox.css({
			"width": maxWidth,
			"margin": 0,
			"padding": 0,
			"display": "block",             //必须先显示才能正确 计算 高宽
			"overflow": "hidden"
		});

		setTimeout(function () {

			objBox.calcAlertBoxHeight();          //如果高度大于窗口的80%，就重新计算

			objBox.css({                        //计算完成再设置样式
				'left': (htmlWidth - objBox.width()) / 2,
				'top': (htmlHeight - objBox.height()) / 2.5,
				"opacity": 1
			});

		}, 50);

	};

	/**
	 *   //关闭弹出框
	 * @param boxID
	 */
	CommonTool.prototype.closeBox = function (boxID) {
		$(".scroll-table-body").css({
			"overflow-y": "auto"
		});
		$("#" + boxID).css({"opacity": 0, "display": "none", "height": "auto"});
		$(".over").css({"opacity": 0, "display": "none"});
	};
})();
/**
 * Created by Andy on 2017/3/2.
 */
(function () {
	/**
	 * 布局方法，一般把窗口 分为3个部分，
	 *
	 * 头部（包括 #title ，.groupNav , .scroll-table-header）
	 * 中间可滚动部分 （.scroll-table-body）
	 * 脚部（#footer，#bottomBtn，.scroll-table-footer）
	 *
	 *@params flag:init  重置克隆的元素
	 * */
	CommonTool.prototype.layout = function (boxId, flag, btn1Param, btn2Param, btn3Param) {
		var that = this;
		var box = $("#" + boxId);
		var $curContentBody = $(box.find(".scroll-table-body"));
		if (!box.length)return;                         //如果找不到元素，退出；
		if (box.is(":visible") && flag === 1)return;     //如果已经显示，还执行显示操作，退出；
		if (box.is(":hidden") && flag === 0)return;      //如果已经隐藏，还执行隐藏操作，退出；

		if (flag == 1) {
			that.showTable(box);
			that.layoutBottomBtn(1, btn1Param, btn2Param, btn3Param);

			//打开页面【后】，探索当前页有没有存储有滚动条记录
			var curScrollTop = parseFloat(sessionStorage.getItem(boxId));
			if (curScrollTop != undefined && curScrollTop != null) {
				$curContentBody.scrollTop(curScrollTop);
			}
		}
		else {
			//关闭页面【前】，存储当前页的滚动条高度
			sessionStorage.setItem(boxId, $curContentBody.scrollTop());
			that.hideTable(box);
		}
	};

	CommonTool.prototype.showTable = function (box) {

		var boxChildren = box.children();
		var that = this;
		/**
		 * 1，由于angular渲染元素在原生JS之后，获取不到相应的元素
		 * 所以 在angular框架下，必须 把布局写在 html 里面
		 *
		 * 2，在非angular框架下，必须限制是 3个盒子
		 */
		//如果css类名为data-box,并且找不到.scroll-table-body，就依次为盒子添加3个布局；
		if (!box.find(".scroll-table-body").length) {
			var header = "<div class='scroll-table-header'></div>";
			var body = "<div class='scroll-table-body'></div>";
			var footer = "<div class='scroll-table-footer'></div>";
			var title = boxChildren.eq(0);
			var content = boxChildren.eq(1);
			var footerBtn = boxChildren.eq(2);
			box.append(header, body, footer);
			title.appendTo(box.find(".scroll-table-header"));
			content.appendTo(box.find(".scroll-table-body"));
			footerBtn.appendTo(box.find(".scroll-table-footer"));
		}
		box.removeClass().addClass("data-box");

		box.show();
		that.layoutTable();
	};

	CommonTool.prototype.hideTable = function (box) {

		//var diagnoseFooter = $("#bottomButton");
		//var curFooter = box.find(".scroll-table-footer");
		box.hide();

	};

	/**
	 * 布局方法，一般把窗口 分为3个部分，
	 *
	 * 头部（包括 #title ，.groupNav , .scroll-table-header）
	 * 中间可滚动部分 （.scroll-table-body）
	 * 脚部（#footer，#bottomBtn，.scroll-table-footer）
	 *
	 *@params flag:init  重置克隆的元素
	 * */
	CommonTool.prototype.layoutTable = function (flag) {

		var curFrame = _.find($(".data-box"), function (el) {
			return $(el).is(':visible');
		});
		if (!curFrame) {
			return;
		}
		//打开页面【后】，探索当前页有没有存储有滚动条记录

		var frameHeader = $(curFrame).find('.scroll-table-header');
		var frameBody = $(curFrame).find('.scroll-table-body');
		var footer = $("#footer");
		var frameHeaderHeight = 0;
		var thead_cloneHeight = 0;              //如果body有table元素，就克隆头部，并计算高度
		var jinDuBarHeight = 0;
		var thead_cloneWidth = 0;
		var groupNav = $(curFrame).find('.groupNav');
		if (groupNav.length > 0) {
			groupNav.css({
				"margin-bottom": "10px"
			});
			frameHeader.css({
				"background": "#EFEFEF"
			});
		}

		if (flag === 'init') {          //退出前重置 克隆的头部元素，避免重新进入时出现两个元素重叠
			if (frameBody.find('thead').length > 0) {
				$(frameBody.find('thead')).remove();
			}
		}
		else {
			if (frameBody.find('table').length > 0) {     //处理table滚动元素的布局；

				var bodyThead = frameBody.find('thead');
				thead_cloneHeight = bodyThead.height();


				if (!frameHeader.find('table').length && bodyThead.length) {       		//避免重复克隆，而且有些盒子是没有thead的，就不需要克隆
					frameHeader.append('<table></table>');
					frameHeader.find('table').append(bodyThead.clone());
				}

				var buttonElement = document.getElementById("topNavButton");

				if (buttonElement) {
					thead_cloneWidth = document.getElementById("topNav").offsetWidth;
					this.setStyle(buttonElement, {
						width: thead_cloneWidth,
						top: groupNav.height() + 10 +       //10px为自由裁度量
						(thead_cloneHeight - buttonElement.offsetHeight) / 2,
						right: 0,
						height: thead_cloneHeight
					})
				}

			}

			var titleHeight = $("#Title").height() || 0;
			frameHeaderHeight = frameHeader.height() || 0;
			jinDuBarHeight = footer.is(':visible') ? footer.height() : 0;

			frameHeader.css({
				'top': titleHeight
			});
			frameBody.css({
				'height': CONSTANT.WINDOW_HEIGHT - titleHeight - frameHeaderHeight - jinDuBarHeight + thead_cloneHeight,
				'top': frameHeaderHeight - thead_cloneHeight + titleHeight
			});

			frameBody.height();
		}
	};

	/**
	 * 底部按钮实例
	 *@params flag 0，标示隐藏底部按钮；1标示显示按钮，并且根据后续参数个数实例化相应的按钮
	 *@params btn1Param 第一个按钮的参数 [text,disableState,callback]
	 *@params btn2Param 第二个按钮的参数 [text,disableState,callback]
	 *@params btn3Param 第三个按钮的参数 [text,disableState,callback]
	 * */
	CommonTool.prototype.layoutBottomBtn = function (flag, btn1Param, btn2Param, btn3Param) {
		var jinduBar = $("#footer");
		var boxFooter = $("#bottomButton");
		var that = this;
		if (flag) {
			boxFooter.height(jinduBar.height());
			jinduBar.width("0%");
			boxFooter.width("100%");
		}
		else {
			jinduBar.width("100%");
			boxFooter.width("0%");
		}

		if (btn1Param || btn2Param || btn3Param) {
			/**
			 * 因为参数的个数不固定，所以先在这里过滤掉 undefined 的参数
			 * 使得在被that.bindBottomBtn调用的时候就可以判断参数个数了
			 * */
			var _args = [btn1Param, btn2Param, btn3Param];
			var result = [];
			_args.forEach(function (item) {
				if (item)result.push(item);
			});

			that.bindBottomBtn.apply(that, result);
		}

	};

	//参数个数不固定
	CommonTool.prototype.bindBottomBtn = function () {

		Array.prototype.forEach.call(arguments, function (item, index) {

			//在这里调整每个参数的位置
			item.forEach(function (_item) {

				//如果元素个数小于3，就代表第二个参数是callback(text和callback是必选参数)
				if (_item.length < 3) {
					_item[2] = _item[1];
					_item[1] = undefined;
				}
			});
		});

		this.bottomBtn({
			btn1Text: arguments[0][0],
			btn1Disable: arguments[0][1],
			btn1Callback: arguments[0][2],
			btn2Text: arguments[1] ? arguments[1][0] : undefined,
			btn2Disable: arguments[1] ? arguments[1][1] : undefined,
			btn2Callback: arguments[1] ? arguments[1][2] : undefined,
			btn3Text: arguments[2] ? arguments[2][0] : undefined,
			btn3Disable: arguments[2] ? arguments[2][1] : undefined,
			btn3Callback: arguments[2] ? arguments[2][2] : undefined
		});
	}
})();

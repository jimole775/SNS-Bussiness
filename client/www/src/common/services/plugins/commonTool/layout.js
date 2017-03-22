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
	CommonTool.prototype.layout = function (boxId, flag) {
		var that = this;
		var box = $("#" + boxId);
		var $curContentBody = $(box.find(".scroll-table-body"));
		if (!box.length)return;                         //如果找不到元素，退出；
		if (box.is(":visible") && flag === 1)return;     //如果已经显示，还执行显示操作，退出；
		if (box.is(":hidden") && flag === 0)return;      //如果已经隐藏，还执行隐藏操作，退出；

		if (flag == 1) {
			that.showTable(box);

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
					buttonElement.style.width = thead_cloneWidth;
					buttonElement.style.top = groupNav.height() + 10 + (thead_cloneHeight - buttonElement.offsetHeight) / 2;
					buttonElement.style.right = 0;
					buttonElement.style.height = thead_cloneHeight;
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

})();

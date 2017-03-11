/**
 * Created by Andy on 2017/1/23.
 */

/**
 * 添加JQ事件 scrollstart 和 scrollstop
 * 用于在远程协助功能下,滚动停止之后计算高度发送给对方进行同步
 * 原jq版本是没有这两个事件的!
 * */
(function () {

	var special = jQuery.event.special,
		handle = jQuery.event.handle ? jQuery.event.handle : jQuery.event.dispatch,//兼容1.9之后jQuery.event.handle为undefined的BUG
		uid1 = 'D' + (+new Date ()),
		uid2 = 'D' + (+new Date () + 1);

	special.scrollStart = {
		setup: function () {

			var timer,
				handler = function (evt) {

					var _self = this,
						_args = arguments;

					if (timer) {
						clearTimeout (timer);
					}
					else {
						evt.type = 'scrollStart';
						handle.apply (_self, _args);
					}

					timer = setTimeout (function () {
						timer = null;
					}, special.scrollStop.latency);

				};

			jQuery (this).bind ('scroll', handler).data (uid1, handler);

		},
		teardown: function () {
			jQuery (this).unbind ('scroll', jQuery (this).data (uid1));
		}
	};

	special.scrollStop = {
		latency: 300,
		setup: function () {

			var timer,
				handler = function (evt) {

					var _self = this,
						_args = arguments;

					if (timer) {
						clearTimeout (timer);
					}

					timer = setTimeout (function () {

						timer = null;
						evt.type = 'scrollStop';
						handle.apply (_self, _args);

					}, special.scrollStop.latency);

				};

			jQuery (this).bind ('scroll', handler).data (uid2, handler);

		},
		teardown: function () {
			jQuery (this).unbind ('scroll', jQuery (this).data (uid2));
		}
	};


	//win.global.RMTSlider = {
	//	getScrollTop: (function () {
	//		var watcher = null;
	//		var pageHeight = 0;
	//		var scrollHeight = 0;
	//		var max_scrollTop = 0;
	//		var cacheScrollTop = [];
	//		var body = $ ("body");
	//		var time = {
	//			start: 0,
	//			end: 0
	//		};
	//		var coord = {
	//			start: {
	//				X: 0,
	//				Y: 0
	//			},
	//			end: {
	//				X: 0,
	//				Y: 0
	//			}
	//
	//		};
	//		var startTarget = null;
	//		var endTarget = null;
	//		var curButton = null;
	//		var scrollBody = null;
	//		//body.delegate (".scroll-table-body",
	//		body.on (
	//			{
	//				touchstart: function (e) {
	//					clearInterval (watcher);
	//
	//					startTarget = $(e.target);
	//					scrollBody = startTarget.parents(".scroll-table-body");
	//
	//					//计算滚动条的高度（备用）
	//					if(scrollBody.length){
	//						pageHeight = scrollBody.height ();
	//						scrollHeight = scrollBody[0].scrollHeight;
	//						max_scrollTop = scrollHeight - pageHeight;
	//					}
	//
	//					time.start = e.timeStamp;
	//					coord.start.X = e.originalEvent.changedTouches[0].pageX;
	//					coord.start.Y = e.originalEvent.changedTouches[0].pageY;
	//
	//					event.preventDefault();
	//				},
	//				touchend: function (e) {
	//					time.end = e.timeStamp;
	//					endTarget = $(e.target);
	//
	//					coord.end.X = e.originalEvent.changedTouches[0].pageX;
	//					coord.end.Y = e.originalEvent.changedTouches[0].pageY;
	//					var scrollX = Math.abs(coord.end.X - coord.start.X);
	//					var scrollY = Math.abs(coord.end.Y - coord.start.Y);
	//
	//					//如果当前页面有滚动条 而且为滚动事件，就进行转发；否则都视为点击事件（不管有无滚动条）
	//					if(max_scrollTop > 0 && scrollX >= 20 && scrollY >= 20){
	//						watcher = setInterval (function () {
	//							cacheScrollTop.push (scrollBody[0].scrollTop);
	//							var prevTop = cacheScrollTop[cacheScrollTop.length - 1];
	//							var curTop = cacheScrollTop[cacheScrollTop.length - 2];
	//
	//							if (cacheScrollTop.length >= 2 && ( prevTop === curTop )) {
	//								clearInterval (watcher);
	//								cacheScrollTop.length = 0;
	//								win.sendRMTEventToApp ("global.RMTSlider.setScrollTop", [scrollBody.parent(".data-box").attr("id"), curTop/max_scrollTop]);
	//								console.log(scrollBody.parent(".data-box").attr("id"), curTop/max_scrollTop);
	//							}
	//
	//						}, 105);
	//					}
	//
	//					//判断是否是点击事件，如果是，就获取点击元素 的下标，和 点击的坐标，等待 点击事件转发的时候一起打包出去
	//					//是否告知转发的事件类型？？？？不需要，可以根据global.mouseEvent任意一个值来进行判断
	//					//是否告知远程端有无滚动条？？？？不需要，可以根据
	//					else {
	//
	//						if(scrollX <= 10 && scrollY <= 10){
	//							//获取当前点击的元素下标，通知远程端同步执行点击动画
	//							console.log("点击事件");
	//							curButton = endTarget.parents("button");
	//							if(!curButton.length) curButton = endTarget.parents("input");
	//							if(curButton.length){
	//								win.global.mouseEvent.coord.X = coord.end.X;
	//								win.global.mouseEvent.coord.Y = coord.end.Y;
	//
	//								if(curButton[0].tagName === "BUTTON"){
	//									global.mouseEvent.type = "button";
	//									global.mouseEvent.index = $("body").find("button").index(curButton[0]);
	//									global.mouseEvent.hasScrollBar = max_scrollTop ? true : false;
	//								}
	//								else if(curButton[0].tagName === "INPUT"){
	//									if(curButton[0].type === "button"){
	//										global.mouseEvent.type = "input";
	//										global.mouseEvent.index = $("body").find("button").index(curButton[0]);
	//									}
	//								}
	//							}
	//
	//						}
	//						//	win.sendRMTEventToApp ("global.RMTSlider.setScrollTop", [scrollBody.parents(".data-box").attr("id"), "noScroll"]);
	//						//	console.log(scrollBody.parents(".data-box").attr("id"), "noScroll");
	//					}
	//				}
	//			}
	//		);
	//	})(),
	//
	//	setScrollTop: function (boxid, curScrollTopPercent) {
	//		var ele = $ ("#" + boxid + " .scroll-table-body");
	//		var pageHeight = ele.height ();
	//		var scrollHeight = ele[0].scrollHeight;
	//		var max_scrollTop = scrollHeight - pageHeight;
	//
	//		//本地页面 有滚动条
	//		if(max_scrollTop) {
	//
	//			// 并且 传输过来的是数字
	//			if(typeof curScrollTopPercent === "number"){
	//				ele.animate ({scrollTop: max_scrollTop * curScrollTopPercent}, 500);
	//			}
	//
	//			//如果传输过来的是 字串 “noScroll”,就代表对方没有滚动条，而本地有，如果需要实现同步观看，
	//			//应该实现的【方案】 ：如果对方点击某个项，先滚动到那个项之后，再执行点击动画
	//			else{
	//
	//			}
	//		}
	//
	//		//本地页面 没有滚动条 （什么都不用干）
	//		else{
	//
	//		}
	//
	//	}
	//
	//};
	var win =window;
	win.global.RMTSlider = {
		getScrollTop: (function () {
			var _watcher = setInterval (function () {
				if ($ (".scroll-table-body").length) {clearInterval (_watcher)}
				var pageHeight = 1, scrollHeight = 1, max_scrollTop = 1;
				$ (".scroll-table-body").on ("scrollStart", function (e) {
					e.stopPropagation ();
				});
				$ (".scroll-table-body").on ("scrollStop", function () {
					var ele = $ (this);
					scrollHeight = ele[0].scrollHeight;
					pageHeight = ele.height ();
					max_scrollTop = scrollHeight - pageHeight;
					var curTop = ele.scrollTop ();
					if (max_scrollTop > 0 && global.RMTID.role == 2) {     //如果当前页面没有滚动条，最大滚动高度就为零，作为运算式的分母，为0的时候，除运算结果为 “NAN”,所以没必要进行转发
						win.sendRMTEventToApp ("global.RMTSlider.setScrollTop", [ele.parents (".data-box").attr ("id"), curTop / max_scrollTop]);
					}
				});
			}, 100);
		}) (),

		setScrollTop: function (boxid, curScrollTopPercent) {
			var ele = $ ("#" + boxid + " .scroll-table-body");
			var pageHeight = ele.height ();
			var scrollHeight = ele[0].scrollHeight;
			var max_scrollTop = scrollHeight - pageHeight;
			ele.animate ({scrollTop: max_scrollTop * curScrollTopPercent}, 500);
		}
	};

}) ();
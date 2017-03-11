/**
 * Created by Andy on 2017/1/23.
 */

/**
 * ���JQ�¼� scrollstart �� scrollstop
 * ������Զ��Э��������,����ֹ֮ͣ�����߶ȷ��͸��Է�����ͬ��
 * ԭjq�汾��û���������¼���!
 * */
(function () {

	var special = jQuery.event.special,
		handle = jQuery.event.handle ? jQuery.event.handle : jQuery.event.dispatch,//����1.9֮��jQuery.event.handleΪundefined��BUG
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
	//					//����������ĸ߶ȣ����ã�
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
	//					//�����ǰҳ���й����� ����Ϊ�����¼����ͽ���ת����������Ϊ����¼����������޹�������
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
	//					//�ж��Ƿ��ǵ���¼�������ǣ��ͻ�ȡ���Ԫ�� ���±꣬�� ��������꣬�ȴ� ����¼�ת����ʱ��һ������ȥ
	//					//�Ƿ��֪ת�����¼����ͣ�����������Ҫ�����Ը���global.mouseEvent����һ��ֵ�������ж�
	//					//�Ƿ��֪Զ�̶����޹�����������������Ҫ�����Ը���
	//					else {
	//
	//						if(scrollX <= 10 && scrollY <= 10){
	//							//��ȡ��ǰ�����Ԫ���±֪꣬ͨԶ�̶�ͬ��ִ�е������
	//							console.log("����¼�");
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
	//		//����ҳ�� �й�����
	//		if(max_scrollTop) {
	//
	//			// ���� ���������������
	//			if(typeof curScrollTopPercent === "number"){
	//				ele.animate ({scrollTop: max_scrollTop * curScrollTopPercent}, 500);
	//			}
	//
	//			//�������������� �ִ� ��noScroll��,�ʹ���Է�û�й��������������У������Ҫʵ��ͬ���ۿ���
	//			//Ӧ��ʵ�ֵġ������� ������Է����ĳ����ȹ������Ǹ���֮����ִ�е������
	//			else{
	//
	//			}
	//		}
	//
	//		//����ҳ�� û�й����� ��ʲô�����øɣ�
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
					if (max_scrollTop > 0 && global.RMTID.role == 2) {     //�����ǰҳ��û�й��������������߶Ⱦ�Ϊ�㣬��Ϊ����ʽ�ķ�ĸ��Ϊ0��ʱ�򣬳�������Ϊ ��NAN��,����û��Ҫ����ת��
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
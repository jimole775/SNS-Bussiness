/**
 * Created by Andy on 2017/3/8.
 */

function Drag() {

	/***************
	 * 绑定拖拽事件 *
	 **************/
	var $ = jQuery;
	this.init = function (dragTagId, bodyId, extendTagId) {
		this.dragTag = $("#" + dragTagId);
		this.extendTag = $("#" + extendTagId);
		this.body = $("#" + bodyId);
		this.startX = 0;
		this.startY = 0;
		this.moveX = 0;
		this.moveY = 0;
		this.differenceX = 0;
		this.differenceY = 0;
		this.box_originX = 0;
		this.box_originY = 0;
		this.box_originWidth = this.body.width();
		this.box_originHeight = this.body.height();

		this.head_width = this.dragTag.width();
		this.head_height = this.dragTag.height();
		this.touchMinHeightSizeFlag = false;
		this.touchMinWidthSizeFlag = false;
		this.mouseEnvent = {};
		this.mouseEnvent.dragStart = false;
		this.mouseEnvent.extendStart = false;
		this.EVENT_TYPE = {};
		this.EVENT_TYPE.START = "ontouchstart" in window ? "touchstart" : "mousedown";
		this.EVENT_TYPE.MOVE = "ontouchmove" in window ? "touchmove" : "mousemove";
		this.EVENT_TYPE.END = "ontouchend" in window ? "touchend" : "mouseup";
	};
	this.bindEvent = function (dragTagId, bodyId, extendTagId) {
		var that = this;
		that.init(dragTagId, bodyId, extendTagId);
		that.dragTag.on(
			that.EVENT_TYPE.START, function (e) {
				that.mouseEnvent.dragStart = true;
				var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				that.startX = target.clientX;                        //获取点击点的X坐标
				that.startY = target.clientY;                        //获取点击点的Y坐标
				that.box_originX = that.body.offset().left;                                  //相对于当前窗口X轴的偏移量
				that.box_originY = that.body.offset().top;                                   //相对于当前窗口Y轴的偏移量
				that.differenceX = that.startX - that.box_originX;                                       //鼠标所能移动的最左端是当前鼠标距div左边距的位置
				that.differenceY = that.startY - that.box_originY;
			});
		that.dragTag.on(
			that.EVENT_TYPE.MOVE, function (e) {
				e.preventDefault();
				if (!that.mouseEnvent.dragStart) return;

				var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				that.moveX = target.clientX;                         //移动过程中X轴的坐标
				that.moveY = target.clientY;                         //移动过程中Y轴的坐标
				if (that.moveX + (that.box_originWidth - that.differenceX) > win.CONSTANT.WINDOW_WIDTH) {
					that.body.css({
						"left": win.CONSTANT.WINDOW_WIDTH - that.box_originWidth,
						"top": that.moveY - that.differenceY
					});
					return;
				}
				if (that.moveY + (that.box_originHeight - that.differenceY) > win.CONSTANT.WINDOW_HEIGHT) {
					that.body.css({
						"left": that.moveX - that.differenceX,
						"top": win.CONSTANT.WINDOW_HEIGHT - that.box_originHeight
					});
					return;
				}
				if (that.moveX < that.differenceX) {
					that.body.css({
						"left": 0,
						"top": that.moveY - that.differenceY
					});
					return;
				}
				if (that.moveY < that.differenceY) {
					that.body.css({
						"left": that.moveX - that.differenceX,
						"top": 0
					});
					return;
				}

				that.body.css({
					"left": that.moveX - that.differenceX,
					"top": that.moveY - that.differenceY
				});

			}
		);

		that.dragTag.on(
			that.EVENT_TYPE.END, function (e) {
				that.mouseEnvent.dragStart = false;
				var bodyLeft = that.body.offset().left;
				var bodyTop = that.body.offset().top;

				var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				that.endX = target.clientX;                         //移动过程中X轴的坐标
				that.endY = target.clientY;                         //移动过程中Y轴的坐标

				if (bodyTop < 0) {
					that.body.css({
						"top": 0
					});
				}
				else if (bodyTop > win.CONSTANT.WINDOW_HEIGHT - that.box_originHeight) {
					that.body.css({
						"top": win.CONSTANT.WINDOW_HEIGHT - that.box_originHeight
					});
				}

				console.log(bodyLeft, bodyTop);
			}
		);

		/*******************
		 * 绑定窗体拉伸事件 *
		 *****************/
		that.extendTag.on(
			that.EVENT_TYPE.START, function (e) {
				that.mouseEnvent.extendStart = true;
				var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
				that.startX = target.clientX;                        //获取点击点的X坐标
				that.startY = target.clientY;                        //获取点击点的Y坐标
				that.box_originX = that.body.offset().left;                                //相对于当前窗口X轴的偏移量
				that.box_originY = that.body.offset().top;                                 //相对于当前窗口Y轴的偏移量
				that.differenceX = that.startX - that.box_originX;                                     //鼠标所能移动的最左端是当前鼠标距div左边距的位置
				that.differenceY = that.startY - that.box_originY;
			});
		that.extendTag.on(that.EVENT_TYPE.MOVE, function (e) {
			if (!that.mouseEnvent.extendStart)return;
			e.preventDefault();
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			that.moveX = target.clientX;                         //移动过程中X轴的坐标
			that.moveY = target.clientY;                         //移动过程中Y轴的坐标
			if (that.body.height() < 200) {
				that.touchMinHeightSizeFlag = true;
			}
			if (that.body.width() < 200) {
				that.touchMinWidthSizeFlag = true;
			}
			if (that.moveX >= win.CONSTANT.WINDOW_WIDTH) {
				that.moveX = win.CONSTANT.WINDOW_WIDTH - 10
			}
			if (that.moveX <= 0) {
				that.moveX = 0
			}
			if (that.moveY >= win.CONSTANT.WINDOW_HEIGHT) {
				that.moveY = win.CONSTANT.WINDOW_HEIGHT - 10
			}
			if (that.moveY <= 0) {
				that.moveY = 0
			}

			that.body.css({
				"width": that.box_originWidth + (that.moveX - that.differenceX - that.box_originX),
				"height": that.box_originHeight + (that.moveY - that.differenceY - that.box_originY)
			});
			//resizeHoverButton();
		});
		that.extendTag.on(that.EVENT_TYPE.END, function (e) {
			that.mouseEnvent.extendStart = false;
			e.preventDefault();
			if (that.touchMinHeightSizeFlag) {
				that.body.height(200);
				that.touchMinHeightSizeFlag = false;
			}
			if (that.touchMinWidthSizeFlag) {
				that.body.width(200);
				that.touchMinWidthSizeFlag = false;
			}
			that.box_originWidth = that.body.width();                                        //触摸事件完成后，获取盒子的最后高宽，下次再次触摸时，以这个值为初始值；
			that.box_originHeight = that.body.height();
		});
	};

}
/**
 * Created by Andy on 2017/3/8.
 */

function Drag() {

	/***************
	 * 绑定拖拽事件 *
	 **************/
	var $ = jQuery;
	this.init = function (dragTagId, bodyId, extendTagId) {
		this.body = $("#" + bodyId)[0];
		this.windowHeight = win.CONSTANT.WINDOW_HEIGHT;
		this.windowWidth = win.CONSTANT.WINDOW_WIDTH;
		this.mouseEnvent = {};
		this.EVENT_TYPE = {};
		this.EVENT_TYPE.START = "ontouchstart" in window ? "touchstart" : "mousedown";
		this.EVENT_TYPE.MOVE = "ontouchmove" in window ? "touchmove" : "mousemove";
		this.EVENT_TYPE.END = "ontouchend" in window ? "touchend" : "mouseup";
		this.initDrag(dragTagId);
		if (extendTagId)this.initExtend(extendTagId);
	};

	this.initDrag = function (dragTagId) {

		this.dragEvent = {};
		this.dragTag = $("#" + dragTagId);
		this.mouseEnvent.dragStart = false;
		this.box_originX = 0;
		this.box_originY = 0;
		this.dragEvent.distanceX = 0;
		this.dragEvent.distanceY = 0;
	};

	this.initExtend = function (extendTagId) {
		this.extendTag = $("#" + extendTagId);
		this.box_originWidth = $(this.body).width();
		this.box_originHeight = $(this.body).height();
		this.mouseEnvent.extendStart = false;
		this.extendEvent = {};
		this.extendEvent.distanceX = 0;
		this.extendEvent.distanceY = 0;
	};

	this.bindEvent = function (dragTagId, bodyId, extendTagId) {
		this.init(dragTagId, bodyId, extendTagId);
		this.bindDrag();
		if (extendTagId)this.bindExtend();

	};

	this.bindDrag = function () {
		var that = this;

		that.dragTag.on(that.EVENT_TYPE.START, function (e) {
			that.mouseEnvent.dragStart = true;
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			var startX = target.clientX;                        //获取点击点的X坐标
			var startY = target.clientY;                        //获取点击点的Y坐标
			that.box_originX = $(that.body).offset().left;                                  //相对于当前窗口X轴的偏移量
			that.box_originY =  $(that.body).offset().top;                                   //相对于当前窗口Y轴的偏移量
			that.dragEvent.distanceX = startX - that.box_originX;                                       //鼠标所能移动的最左端是当前鼠标距div左边距的位置
			that.dragEvent.distanceY = startY - that.box_originY;
		});

		that.dragTag.on(that.EVENT_TYPE.MOVE, function (e) {
			e.preventDefault();
			if (!that.mouseEnvent.dragStart) return;
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			var moveX = target.clientX;                         //移动过程中X轴的坐标
			var moveY = target.clientY;                         //移动过程中Y轴的坐标
			if (moveX + (that.box_originWidth - that.dragEvent.distanceX) > that.windowWidth) {
				that.body.style.left = (that.windowWidth - that.box_originWidth) + "px";
				that.body.style.top = (moveY - that.dragEvent.distanceY) + "px";
				return;
			}
			if (moveY + (that.box_originHeight - that.dragEvent.distanceY) > that.windowHeight) {
				that.body.style.left = (moveX - that.dragEvent.distanceX) + "px";
				that.body.style.top = (that.windowHeight - that.box_originHeight) + "px";
				return;
			}
			if (moveX < that.dragEvent.distanceX) {
				that.body.style.left = 0;
				that.body.style.top = (moveY - that.dragEvent.distanceY) + "px";
				return;
			}
			if (moveY < that.dragEvent.distanceY) {
				that.body.style.left = (moveX - that.dragEvent.distanceX) + "px";
				that.body.style.top = 0;
				return;
			}

			that.body.style.left = (moveX - that.dragEvent.distanceX) + "px";
			that.body.style.top = (moveY - that.dragEvent.distanceY) + "px";

		});

		that.dragTag.on(that.EVENT_TYPE.END, function (e) {
			that.mouseEnvent.dragStart = false;
			var bodyLeft = $(that.body).offset().left;
			var bodyTop = $(that.body).offset().top;

			if (bodyTop < 0) {
				that.body.style.top = 0;
			}
			else if (bodyTop > that.windowHeight - that.box_originHeight) {
				that.body.style.top = (that.windowHeight - that.box_originHeight) + "px";
			}

			if (bodyLeft < 0) {
				that.body.style.left = 0;
			}
			else if (bodyLeft > that.windowWidth - that.box_originWidth) {
				that.body.style.top = (that.windowWidth - that.box_originWidth) + "px";
			}

			console.log(bodyLeft, bodyTop);
		});
	};

	this.bindExtend = function () {
		/*******************
		 * 绑定窗体拉伸事件 *
		 *****************/
		var that = this;
		that.extendTag.on(that.EVENT_TYPE.START, function (e) {
			that.mouseEnvent.extendStart = true;
			clearTimeout(that.mouseOutMonitor);
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			var startX = target.clientX;                        //获取点击点的X坐标
			var startY = target.clientY;                        //获取点击点的Y坐标
			that.box_originX = $(that.body).offset().left;                                //相对于当前窗口X轴的偏移量
			that.box_originY = $(that.body).offset().top;                                 //相对于当前窗口Y轴的偏移量
			that.extendEvent.distanceX = startX - that.box_originX;                                     //鼠标所能移动的最左端是当前鼠标距div左边距的位置
			that.extendEvent.distanceY = startY - that.box_originY;
		});

		that.extendTag.on(that.EVENT_TYPE.MOVE, function (e) {
			clearTimeout(that.mouseOutMonitor);
			if (!that.mouseEnvent.extendStart)return;
			e.preventDefault();
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			var moveX = target.clientX;                         //移动过程中X轴的坐标
			var moveY = target.clientY;                         //移动过程中Y轴的坐标

			if (moveX >= that.windowWidth) {
				moveX = that.windowWidth - 10
			}
			if (moveX <= 0) {
				moveX = 0
			}
			if (moveY >= that.windowHeight) {
				moveY = that.windowHeight - 10
			}
			if (moveY <= 0) {
				moveY = 0
			}

			that.body.style.width = (that.box_originWidth + (moveX - that.extendEvent.distanceX - that.box_originX)) + "px";
			that.body.style.height = (that.box_originHeight + (moveY - that.extendEvent.distanceY - that.box_originY)) + "px";
		});


		//扩展事件的监听器,监听由于在PC端测试时,快速拖拽和点击造成的END的事件无法触发引发的坐标混乱问题
		that.mouseOutMonitor = null;
		that.extendTag.on("mouseout", function (e) {
			if(!that.mouseEnvent.extendStart)return;
			that.mouseOutMonitor = setTimeout(function(){
				that.mouseEnvent.extendStart = false;
				that.box_originWidth = parseFloat(that.body.style.width);                                        //触摸事件完成后，获取盒子的最后高宽，下次再次触摸时，以这个值为初始值；
				that.box_originHeight = parseFloat(that.body.style.height);
			},500);
		});

		that.extendTag.on(that.EVENT_TYPE.END, function (e) {

			clearTimeout(that.mouseOutMonitor);
			that.mouseEnvent.extendStart = false;
			var target = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent;
			var endX = target.clientX;                         //移动过程中X轴的坐标
			var endY = target.clientY;                         //移动过程中Y轴的坐标

			that.body.style.width = (that.box_originWidth + (endX - that.extendEvent.distanceX - that.box_originX)) + "px";
			that.body.style.height = (that.box_originHeight + (endY - that.extendEvent.distanceY - that.box_originY)) + "px";
			var endWidth = parseFloat(that.body.style.width);
			var endHeight = parseFloat(that.body.style.height);
			if (endWidth < 200) {
				that.body.style.width = "200px";
			}
			if (endHeight < 200) {
				that.body.style.height = "200px";
			}
			if (endWidth >= that.windowWidth){
				that.body.style.width = that.windowWidth - 20 + "px";
			}
			if (endHeight >= that.windowHeight) {
				that.body.style.height = that.windowHeight - 20 + "px";
			}

			that.box_originWidth = parseFloat(that.body.style.width);                                        //触摸事件完成后，获取盒子的最后高宽，下次再次触摸时，以这个值为初始值；
			that.box_originHeight = parseFloat(that.body.style.height);
		});
	};


}
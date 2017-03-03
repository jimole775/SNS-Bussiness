/**
 * Created by Andy on 2016/12/19.
 */
(function () {


	App.controller("charHoverButtonController",["$scope","$element","$rootScope",function($scope, $element, $rootScope){

		//监听远程协助的身份，global.RMTID默认为0（正常业务），APP推送身份信息的时候是有延迟的！
		$scope.isRMT = 0;
		var watcher = setInterval(function(){
			if(global.RMTInfo.ID != 0){
				$scope.$apply(function(){
					$scope.isRMT = global.RMTInfo.ID;
				});
				clearInterval(watcher);
			}
		},100);


		$scope.charSate = {};
		$scope.charSate.charFormState = false;
		$scope.charSate.phraseFormState = false;
		$scope.charSate.newSentenceAmount = 0;
		$scope.charSate.contentsTyped = "";
		$scope.charSate.charWith = "远程对象";
		$scope.clickTrigger = function(){
			$scope.charSate.charFormState = !$scope.charSate.charFormState;
			$scope.charSate.newSentenceAmount = 0;
			$scope.$emit("charSate");

			//预留45毫秒时间用来渲染，然后再把滚动条拉到底部（使用jq方法或者angular_jqLite）
			setTimeout (function () {
				angular.element(".charBody").animate ({scrollTop: angular.element(".charBody")[0].scrollHeight}, 300);
			}, 105);
		};

		//charSate对象只在聊天系统下使用
		$rootScope.$on("charSate",function(scope){
			$scope.charSate = scope.targetScope[scope.name];
		});

	}])

	.config(['$provide', function($provide){
		(function dragMgr (boxid) {
				"use strict";
				/***************
				 * 绑定拖拽事件 *
				 **************/
				var box = angular.element ("#" + boxid);
				var startX, startY, moveX, moveY, innerPointX, innerPointY;
				var box_originX = 0;
				var box_originY = 0;
				var box_originWidth = 0;
				var box_originHeight = 0;
				var adjust_x = null;
				var adjust_y = null;
				box.on ({
					touchstart: function (e) {
						box_originWidth = box.width();
						box_originHeight = box.height();
						startX = e.originalEvent.changedTouches[0].clientX;                        //获取点击点的X坐标
						startY = e.originalEvent.changedTouches[0].clientY;                        //获取点击点的Y坐标
						box_originX = box.offset ().left;                                  //相对于当前窗口X轴的偏移量
						box_originY = box.offset ().top;                                   //相对于当前窗口Y轴的偏移量
						innerPointX = startX - box_originX;                                       //鼠标所能移动的最左端是当前鼠标距div左边距的位置
						innerPointY = startY - box_originY;
					},
					touchmove: function (e) {
						moveX = e.originalEvent.changedTouches[0].clientX;                         //移动过程中X轴的坐标
						moveY = e.originalEvent.changedTouches[0].clientY;                         //移动过程中Y轴的坐标
						adjust_x = null;
						adjust_y = null;
						if (moveX + (box_originWidth - innerPointX) > window.CONSTANT.WINDOW_WIDTH) {
							adjust_x = CONSTANT.WINDOW_WIDTH - box_originWidth;
						}
						if (moveY + (box_originHeight - innerPointY) > window.CONSTANT.WINDOW_HEIGHT) {
							adjust_y = CONSTANT.WINDOW_HEIGHT - box_originHeight;
						}
						if (moveX < innerPointX) {
							adjust_x = 0;
						}
						if (moveY < innerPointY) {
							adjust_y = 0;
						}
						box.css ({
							"left": adjust_x === null ? moveX - innerPointX : adjust_x,
							"top": adjust_y === null ? moveY - innerPointY : adjust_y
						})
					}
				});
			}) ("charHoverButton");

	}]);


}) ();




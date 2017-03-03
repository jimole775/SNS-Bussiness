/**
 * Created by Andy on 2016/4/20.
 */
(function () {
	var win = window;

	App.controller ("devMessagesCtrl", ["$scope", function ($scope) {

		//显示设备信息，就是 ShowMessage 的信息
		win.moduleEntry.devMessages = function () {
			document.getElementById ("Title").innerText = "流程记录";
			document.getElementById ("ShowMessage").style.display = "block";
			devMessagesBindBtn ();
			tool.layoutBottomBtn("ShowMessage");
		};


		function devMessagesBindBtn () {
			tool.bottomBtn ({
				btn1Text: '返回',
				btn1Callback: function () {
					devMessagesBackEvent ();
				}
			});
		}


		function devMessagesBackEvent () {
			document.getElementById ("ShowMessage").style.display = "none";
			win.moduleEntry.navPage ();
		}

	}]);

}) ();
/**
 * Created by Andy on 2016/5/4.
 */
(function () {
	var win = window;
	win.App.factory("angularFactory", function () {
		var $scope = "";
		return {
			getScope: function (scope) {
				$scope = scope;
				return this;
			},
			safeApply: function (fn) {
				var phase = $scope.$root.$$phase;
				if (phase == '$apply' || phase == '$digest') {
					if (fn && (typeof(fn) === 'function')) {
						fn();
					}
				}
				else {
					$scope.$apply(fn);
				}
			},
			replacePidToIndex: function (dataPack, dataList) {
				var len = dataPack.pids.length;
				var i = len;
				while (i--) {
					var j = len;
					while (j--) {
						if (dataPack.pids[i] && dataList[j] && (dataPack.pids[i].pid == dataList[j].pid)) {
							dataPack.pids[i].index = dataList[j].index;
							break;
						}
					}
				}

				return dataPack;
			}

		}
	})

})();
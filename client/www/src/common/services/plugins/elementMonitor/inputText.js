/**
 * Created by Andy on 2016/4/1.
 */

(function () {

	$("body").ready(function(){

		RMTClickEvent.inputRefresh = function (curId) {
			$ ("#" + curId).val ("");
		};

		RMTClickEvent.RMTInput_ClickEvent = function (id, value) {
			if (global.RMTID.role == 1)$ ("#" + id).val (value);
		};

		var win = window;
		var doc = document;
		var valueWatcher = null;
		var valueWatcherSwitch_on = null;
		var valueWatcherSwitch_off = null;
		var imgClickEvent = null;
		var inputStyleModify = null;

		/*************************************************************
		 * 预定义函数方法；body加载完成之后再逐一调用
		 *************************************************************/
			/*************************************************************
			 监听输入框值的变化，然后把值发送给远程端
			 *************************************************************/
			valueWatcherSwitch_on = function (curTag) {
				var $curTag = $ (curTag);
				var value = $curTag.val ();

				valueWatcher = setInterval (function () {
					var inputValueLoop = $curTag.val ();
					if (value !== inputValueLoop) {
						value = inputValueLoop;
						win.RMTClickEvent.RMTInput_ClickEvent (curTag.id, value);            //发送ID和点击的元素的下标
					}
				}, 500)
			};

			valueWatcherSwitch_off = function (curTag) {
				clearInterval (valueWatcher);
				win.RMTClickEvent.RMTInput_ClickEvent (curTag.id, $ (curTag).val ());
			};

			/*************************************************************
			 修改输入框样式，添加重置按钮，并且绑定按钮事件
			 *************************************************************/
			inputStyleModify = function ($input) {
				var $inputLabel = $input.parent ("label");
				var $inputLabelParent = $inputLabel.parent ();

				var $inputPrev = $inputLabel.prev ("span");      //计算$input的siblings的宽度的总和;

				$input.prop ({"placeholder": "点击设置"});        //给input设置placeholder

				$inputLabelParent.css ({                         //给p元素添加relative，使子元素absolute属性生效；
					"position": "relative"
				});

				$inputPrev.css ({       //如果input有前置的描述性元素，就添加样式
					"display": "block",
					"position": "absolute",
					"left": "0",
					"top": "0",
					"line-height": "2.6rem",
					"font-size": "1.3rem"
				});

				$inputLabel.css ({      //如果有label，就添加label样式；
					"width": "100%",
					"display": "table",
					"height": "2.6rem"
				});

				$input.css ({
					"background": "none",
					"border": "none",
					"border-bottom": "1px solid rgb(183,183,183)",
					"text-align": "center",
					"width": "100%",
					"display": "table-cell",
					"vertical-align": "middle",
					"height": "100%",
					"outline": "none"
				});
			};

			imgClickEvent = function ($input, imgStr) {
				var $inputLabel = $input.parent ("label");
				var $inputLabelParent = $inputLabel.parent ();
				$ (imgStr).appendTo ($inputLabelParent);          //添加img元素，并且绑定事件；
				var $imgParent = $inputLabelParent.find ("img").parent ();

				$imgParent.on ("click", function (event)         //添加清空按钮事件
				{
					var $currentTarget = $ (event.currentTarget);
					var curId = $currentTarget.parents (".box-p").find ("input").attr ("id");
					win.RMTClickEvent.inputRefresh (curId);
				});
			};



		/*************************************************************
		 * 预处理所有元素，包括input输入框的img重置按钮，文本输入框
		 *************************************************************/

			var $oInput_text = $ ("input[type='text']") || [];
			var $oInput_number = $ ("input[type='number']") || [];
			var $oInput = $.merge ($oInput_text, $oInput_number);

			var imgStr =
				'<span style="display: block;position: absolute;right: 0;top: 0;width: 4.6rem;text-align: center;">' +
				'<img src="images/common/refresh_2.png" style="width:2.6rem;">' +
				'</span>';

			$oInput.each (function (index, input) {
				if (/disable-plugin/.test (input.className)) return;

				var $input = $ (input);

				var inputid = $input.prop ("id");                        //尝试获取当前input的id号；

				if (!inputid) input.id = "oInputID" + index;            //如果获取不到，就自动添加

				$input.off ().on ({
					focus: function (event) {                            //input被焦点时，缓存当前的top值，然后再设置top值为title的高度
						if ($input.prop ("readonly")) {return}           //如果有readonly属性，就不会弹出手机键盘，所以不用执行下面的代码
						var curTag = event.currentTarget;
						valueWatcherSwitch_on (curTag);
					},
					blur: function (event) {
						var curTag = event.currentTarget;
						valueWatcherSwitch_off (curTag);
					}
				});

				inputStyleModify ($input);
				imgClickEvent ($input, imgStr);
			});

		/**监听手机键盘高度(由APP推送),global.keyBoardHeight有值的时候,就让拥有.alter-box的窗体紧贴键盘,
		 * 如果键盘高度改变为0(由APP推送),就设置居中**/
		var _setTimes = 0;
		var keyBoardHeightMonitor = setInterval(function(){
			if (global.keyBoardHeight){
				$(".alert-box").css("top", win.CONSTANT.WINDOW_HEIGHT - ($(".alert-box").height() + global.keyBoardHeight));
				_setTimes = 0;
			}
			else{
				if(_setTimes === 0){
					$(".alert-box").css("top", (win.CONSTANT.WINDOW_HEIGHT - $(".alert-box").height())/2.5);
					_setTimes ++
				}
			}
		},300);

	})
}) ();
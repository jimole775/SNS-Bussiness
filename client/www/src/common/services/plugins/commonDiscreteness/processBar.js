/**
 * Created by Andy on 2017/3/2.
 */
(function() {
	var jinDuTpl = [
		'<section class="bottom" id="footer">',
		'    <div class="cur-text">',
		'       <!--状态信息显示-->',
		'       <p class="status" id="ShowStatusMessage"></p>',
		'    </div>',
		'</section>'
	].join('');
	document.write(jinDuTpl);

	//嵌入文本
	CommonTool.prototype.processBar = function (message, active, boxid) {

		if (typeof active === "string") {                 //处理只有两个参数时的情况
			boxid = active;
			active = null;
		}

		var tool = this;
		var logCount = 0;
		var id = boxid || "ShowStatusMessage";
		var box = document.getElementById (id);
		var isDucBoxid = false;

		if (!message) {                                   //如果手动置空文本，就连定时器也干掉；
			clearInterval (tool.timer);
			box.innerText = "";
			tool.timer = null;
			return;
		}

		if(!tool.statuBarBoxids)tool.statuBarBoxids = [];
		var len = tool.statuBarBoxids.length;
		while (len--) {
			if (boxid === tool.statuBarBoxids[len]) {
				isDucBoxid = true;
				tool.statuBarBoxids.splice (len);
				break;
			}
		}
		tool.statuBarBoxids.push (boxid);


		//一般有以下情况需要注意：
		// 1，statuBar方法会在多处地方使用，如果以active的真假来处理定时器，必须要添加一个条件，就是必须处在相同的盒子中的时候再处理；
		//      如果直接判断，会导致只有最后一个使用statuBar方法的地方生效；
		// 2，想到再说...
		if(isDucBoxid && !active){
			clearInterval (tool.timer);
		}

		box.innerText = message;
		logCount = 0;
		if (active) {
			clearInterval (tool.timer);                 //避免出现两个定时器；
			tool.timer = setInterval (function () {
				var mod = logCount % 4;
				var suffixMessage = '';
				for (var i = 0; i < mod; i++) {
					suffixMessage += '.';
				}
				box.innerText = message + suffixMessage;
				logCount++;
			}, 450);
		}
	};

})();
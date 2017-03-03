/**
 * Created by Andy on 2017/3/2.
 */
(function () {

	//优先加载模板,减少首屏白屏时间;
	var headTpl = [
		'<header class="title">',
		'<button style="width: 15%;height: 100%;float: left;border: none;background: none;display: none" disabled>',
		'   <p style="margin:0 auto;width: 4rem;max-width:90%;display: block;height: 70%;border: 1px solid #1A3755;border-radius: 4px;border-bottom: 1px solid #2C4A6B;">',
		'       <span style="border:none;border-top:1px solid #52657a;border-bottom:1px solid #1A3755;box-sizing: border-box;border-radius: 4px;display: block;width:100%;height:100%;"></span>',
		'   </p>',
		'</button>',
		'<button id="Title" style="width: 70%;height: 100%;float: left;border: none;background: none;font-size: 2rem;position: relative;left: 15%;box-sizing: border-box;" disabled>云端服务器服务模式</button>',
		'<button style="width: 15%;height: 100%;float: right;border: none;background: none;" disabled>',
		//'   <p style="margin:0 auto;width: 3.6rem;display: block;height: 3.6rem;border: 1px solid #1A3755;border-radius: 4px;border-bottom: 1px solid #2C4A6B;">',
		//'       <span style="background:url(./images/common/dev_connected.png) center center no-repeat;background-size:50%;border:none;border-top:1px solid #52657a;border-bottom:1px solid #1A3755;box-sizing: border-box;border-radius: 4px;display: block;width:100%;height:100%;"></span>',
		//'   </p>',
		'</button>',
		'</header>'
	].join('');

	document.write(headTpl);
})();
/**
 * Created by Andy on 2017/3/2.
 */
(function () {

	//优先加载模板,减少首屏白屏时间;
	var headTpl = [
		'<header id="headBar" class="title">',
		'<button id="headBarLeft" class="head-bar-left" disabled>',
		'   <p class="head-bar-left-inner" style="">',
		'       <span class="head-bar-left-text"></span>',
		'   </p>',
		'</button>',
		'<button id="Title" class="head-bar-title" disabled>CCDP</button>',
		'<div id="headBarRight" class="head-bar-right">',
		'<div class="table-cell-center">',
		'   <button class="head-bar-right-button">',
		'       <i></i>',
		'   </button>',
		'</div>',
		'</div>',
		'</header>'
	].join('');

	document.write(headTpl);
})();
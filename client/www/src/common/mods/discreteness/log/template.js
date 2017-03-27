/**
 * Created by Andy on 2017/1/5.
 */
//这个控制器只是简单的显示和隐藏ShowMessage这个盒子而已
(function() {
	//document.body.innerHTML += '<div ng-controller="DevMessagesCtrl"></div>';
	document.body.innerHTML += ['<div ng-controller="devMessagesCtrl">',
		'<div id="ShowMessage" style="display:none;position:absolute;padding: 5rem 0;width:100%;height:100%;top:0;left:0;overflow: auto;z-index:98;box-sizing: border-box;">',
		'<div id="MessageLayoutTier" style="height:98%;width:94%;margin:1% 3%;box-shadow: 0 0 6px rgba(33,33,33,.3);background: #fff;border-radius: 4px;box-sizing: border-box;position: relative;overflow: hidden;">',
		'   <div id="MessageHead" style="position:relative;z-index:101;width:100%;">',
		'       <button class="item-button message-desc-header" disabled>',
		'           <p id="vehicleType" style="text-align: center">车辆类型</p>',
		'           <p id="businessType" style="text-align: center">业务类型</p>',
		'       </button>',
		'       <button class="item-button message-desc-footer" disabled>',
		'           <span class="item-description">主程序版本</span>',
		'           <span id="appVersion" class="item-value"></span>',
		'       </button>',
		'       <button class="item-button message-desc-footer" disabled>',
		'           <span class="item-description">服务器类型</span>',
		'           <span id="serverType" class="item-value"></span>',
		'       </button>',
		'   </div>',
		'   <ul id="MessageBox" >',
		'   <li><p style="font-size: 1.5rem;line-height: 175%;margin: 0 3%;word-wrap: break-word;">任务记录：</p></li>',
		'   </ul>',
		'</div>',
		'</div>'
	].join("");
})();

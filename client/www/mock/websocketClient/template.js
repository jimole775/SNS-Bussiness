/**
 * Created by Andy on 2017/3/4.
 */
(function () {
	var innerHtml = [
	'<h2 id="friendListHeader" style="height:3rem;line-height:200%;text-align:center;background:#008eff;color:#fff;position: absolute;width: 100%;left: 0;top: 0;z-index: 2;display: block;">基友列表(在线)</h2>' +
	'<ul id="friendList" style="width:100%;height:100%;position: absolute;padding-top:3rem;box-sizing: border-box;top:0;left:0;z-index: 1;"></ul>',
	'<button id="friendListClose" style="z-index:3;" class="button-init triangle-icon-basic">' +
	'<i class="triangle-icon"></i>' +
	'</button>',
	'<button style="z-index:3;" id="friendListExtend" class="button-init extend-icon-basic">',
	'<i class="extend-icon"></i>',
	'</button>'
	].join("");

	var div = document.createElement("div");
	div.style.width = "40%";
	div.style.height = "30%";
	div.style.outline = "1px solid #949494";
	div.style.borderRight = "1px solid rgba(250,250,250,0.7)";
	div.style.borderBottom = "1px solid rgba(250,250,250,0.7)";
	div.style.position = "fixed";
	div.style.right = "1rem";
	div.style.top = "1rem";
	div.style.zIndex = "990";
	div.style.background = "rgba(250,250,250,0.7)";
	div.style.boxShadow = "3px 3px 3px rgba(0,0,0,.7)";
	div.id = "friendFrame";
	div.innerHTML += innerHtml;
	document.body.appendChild(div);

}());
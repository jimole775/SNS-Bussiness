/**
 * Created by Andy on 2017/1/12.
 */
var win = window;

//如果窗口的大小改变,就重载资源(主要为了在PC端测试时使用)
window.onresize = function(){
	location.reload();
};

win.external = win.external ? win.external : {};
win.devLoaded = false;
win.external.SendToApp = function (action, msg) {
	switch(action){
		//case 1021:
		//	if(!devLoaded){
		//		devLoaded = true;
		//		win.jsRecvAppData(1003,"","");
		//	}else{
		//		win.jsRecvAppData(1021,"","");
		//	}
		//
		//	break;
		case 3027:
			//if(!devLoaded){
			//	devLoaded = true;
				win.jsRecvAppData(1005,"","");
			//}else{
			//	win.jsRecvAppData(1021,"","");
			//}
			break;
		case 1000:
			win.jsRecvAppData(1000,{screenInfo:{screenSize:5.5,headHeight:40,footHeight:40},serverHost:"http://112.124.26.243:8090",businessRole:0},"");
			break;
		}

};
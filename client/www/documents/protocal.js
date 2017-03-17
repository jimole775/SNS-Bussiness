/**
 * Created by Andy on 2017/3/15.
 */
/**加载动画（遮罩）
 * 路径：src/common/services/plugins/commonDiscreteness/loadingAnimation.js
 * 使用方法：
 * tool.loading({text:"加载数据中"});//指定文本
 * tool.loading();  //使用默认文本
 * tool.loading(0); //关闭
 * */
tool.loading();

/**页面布局函数，每翻转一个页面，就会执行一次
 * 路径：src/common/services/plugins/commonTool/layout.js
 * 使用方法：
 * tool.loading(boxId,1);   //对指定ID的盒子进行布局
 * tool.loading(boxId,0);   //关闭
 * */
tool.layout();

/**弹窗函数
 * 路径：src/common/services/plugins/commonDiscreteness/alertBox.js
 * 使用方法：
 * tool.alert("提示文本",function(){}); //一个回调就是一个按钮
 * tool.alert(["提示文本","确定","取消"],function(){},function(){});    //两个回调就是两个按钮
 * tool.alert(0)    //关闭
 * */
tool.alert();

/**绑定底部按钮回调
 * 路径：src/common/services/plugins/commonDiscreteness/bottomButton.js
 * 使用方法：（目前最大绑定数为3）
 * tool.bottomBtn({
 *  btn1Text:"按钮1", //指定按钮文本
 *  btn1Disable:true/false,   //按钮控制，可以给一个判断式，动态控制按钮的点击状态
 *  btn1Callback:function(){}   //回调事件
 * });
 * */
tool.bottomBtn();
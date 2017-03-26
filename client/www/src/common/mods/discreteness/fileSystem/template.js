/**
 * Created by Andy on 2017/3/17.
 */
document.body.innerHTML += [
    //var type = $("#fileSelectType").html(); //请求选择文件时，需要手动绑定选择文件的类型，默认为SVT文件
    //var lastBoxId = $("#lastBoxId").html(); //绑定上一个盒子的ID号，在这里从新获取，以便文件选择结束的时候返回
    //var behavior = $("#fileBehavior").html();   //确定上传到服务器还是写入到DEV
    //var procedureInfo = $("#procedureInfo").html();   //跳转到文件选择页面之前绑定的信息，发给APP使用
    '<div id="fileSelect" class="data-box">',
    '   <header class="scroll-table-header">',
    '       <h1 class="box-title" style="text-indent: 0"><span id="fileSelectType">FA/SVT</span>文件选择</h1>',
    '       <p style="display:none"><em id="lastBoxId"></em><em id="fileBehavior"></em><em id="procedureInfo"></em><em id="callback_sp"></p>',
    '       <p class="box-p" id="navDir">',
    '           <span>文件目录:</span>',
    '       </p>',
    '       <p style="display: none" id="fileTip"></p>',
    '   </header>',
    '   <div class="scroll-table-body">',
    '       <div id="fileList">',
    '       </div>',
    '   </div>',
    '</div>'
].join("");
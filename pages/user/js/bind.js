//获取URl上的参数
var businessServerUrl = Window.Config.ServerUrl;
var urlParam = [];
var urlpname , urlpvalue;
var urlpstr = window.location.href;
var urlpnum = urlpstr.indexOf("?")
urlpstr = urlpstr.substr(urlpnum + 1);
var urlparr = urlpstr.split("&");
for(var i = 0 ; i < urlparr.length ; i++) {
    urlpnum = urlparr[i].indexOf("=");
    if(urlpnum > 0){
        urlpname = urlparr[i].substring(0 , urlpnum);
        urlpvalue = urlparr[i].substr(urlpnum + 1);
        urlParam[urlpname] = urlpvalue;
    }
}
//获取url带的参数

var openId = urlParam["openId"];
var AuthDB = urlParam["AuthDB"];
var userguid = "";

judgeIsBind();
//判断用户是否绑定  如果没有绑定的话  跳转绑定页面
function judgeIsBind(){
    //ajax请求下拉刷新数据
    var requestData = {
        "LoginID": "",
        "PassWord": "",
        "OpenID": openId
    };
    $.ajax({
        url: businessServerUrl + '/UserLogin/Login.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                //表示已绑定
                window.YDUI.dialog.toast('用户已绑定', 'success', 1000);
                var username = data.UserArea[0].Alias;
                var mobile = data.UserArea[0].Phone;
                $("#username").text(username);
                $("#mobile").text(mobile);
                userguid = data.UserArea[0].UserGuid;
            } else {
                //表示未绑定
                window.YDUI.dialog.toast('未绑定，请进行用户绑定', 'error', 1000);
                window.location.href = "./unbind.html?redirect=1&openId="+openId + "&AuthDB=" + AuthDB;
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}






$("#button").click(function(){
    window.YDUI.dialog.confirm('', '是否确认取消绑定？', function () {
        confirmSubmit();
    });
});

function confirmSubmit(){
    //ajax请求下拉刷新数据
    var requestData = {
        "UserGuid": userguid
    };
    $.ajax({
        url: businessServerUrl + '/UserLogin/JCBangDing.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                
                window.YDUI.dialog.toast('解除用户绑定成功', 'success', 1000);

                setTimeout(function(){
                    window.location.href = "./unbind.html?openId="+openId + "&AuthDB=" + AuthDB;
                } , 900);

            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
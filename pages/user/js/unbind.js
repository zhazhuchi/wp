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

$("#button").click(function(){
    var username = $("#un").val();
    var password = $("#pass").val();
    if(username == ""){
        window.YDUI.dialog.alert('用户名不能为空！');
        return;
    }
    if(password == ""){
        window.YDUI.dialog.alert('密码不能为空！');
        return;
    }
    window.YDUI.dialog.confirm('', '是否确认绑定？', function () {
        confirmSubmit(username , password);
    });
});

function confirmSubmit(username , password){
    //ajax请求下拉刷新数据
    var requestData = {
        "LoginID": username,
        "PassWord": password,
        "OpenID": openId
    };
    $.ajax({
        url: businessServerUrl + '/UserLogin/Login.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                
                window.YDUI.dialog.toast('绑定成功', 'success', 1000);

                setTimeout(function(){
                    f_close();
                } , 900);

            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

function f_close(){
    if(typeof(WeixinJSBridge)!="undefined"){
        WeixinJSBridge.call('closeWindow');
    }else{
        if (navigator.userAgent.indexOf("MSIE") > 0) {  
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
                window.opener = null; window.close();  
            } else {  
                window.open('', '_top'); window.top.close();  
            }  
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {  
            window.location.href = 'about:blank ';  
        } else {  
            window.opener = null;   
            window.open('', '_self', '');  
            window.close();  
        }
    }
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
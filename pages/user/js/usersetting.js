!function ($) {
    var $tab = $('#J_Tab');
    var useroldchoose = "";
    var IStartYiChang = "";
    var WeChatBZ = "";

    $tab.tab({
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    });

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
    var noAuthDBJump = urlParam["noAuthDBJump"];
    if(noAuthDBJump == "")
        window.YDUI.dialog.alert('您还未设置访问数据库类型，请设置后再操作');

    getUserInfo();
    //判断用户是否绑定  如果没有绑定的话  跳转绑定页面
    function getUserInfo(){
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
                    var AuthStartYiChang = data.UserArea[0].AuthStartYiChang;
                    useroldchoose = data.UserArea[0].AuthDB;
                    if(AuthStartYiChang != "1"){
                        $(".secondItem").hide();
                    }
                    IStartYiChang = data.UserArea[0].IStartYiChang;
                    WeChatBZ = data.UserArea[0].WeChatBZ;
                    if(IStartYiChang == "1"){
                        $("#startIStartYiChang").addClass("mui-active");
                    } else {
                        $("#startIStartYiChang").removeClass("mui-active");
                    }
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }




    //ajax请求下拉刷新数据
    var requestData = {};
    $.ajax({
        url: businessServerUrl + '/UserLogin/DataBeaseList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                var DutyItemTmpl = $('#windItemTmpl').html();
                Mustache.parse(DutyItemTmpl);
                var JCXMrendered = Mustache.render(DutyItemTmpl, {item : data.UserArea});
                $('#radios').empty();
                $('#radios').html(JCXMrendered);

                var asd = $(".asd");
                for(var index = 0 ; index < asd.length ; index++){
                    if($(asd[index]).val() == useroldchoose){
                        $(asd[index]).prop("checked" , true);
                    }
                }


                $(".asd").click(function(){
                    //$(this)[0].value

                    change($(this)[0].value);

                });

            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });



    function change(key){

        var requestData = {
            "WeChatBZ":WeChatBZ,
            "WindID":key
        };
        $.ajax({
            url: businessServerUrl + '/UserLogin/ChangDataBease.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){

                    window.YDUI.dialog.toast('切换成功', 'success', 1000);

                    f_close();

                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });

    }



    $(".mui-switch").on('toggle', function(event) {
        if($(this).hasClass("mui-active")){
            changeIsStart("1");
        } else {
            changeIsStart("0");
        }
    });




    function changeIsStart(state){

        var requestData = {
            "DataBeaseID":AuthDB,
            "IsStart":state
        };
        $.ajax({
            url: businessServerUrl + '/UserLogin/StartYiChang.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){

                    mui.toast(data.ReturnInfo[0].Description);

                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
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
}(jQuery);


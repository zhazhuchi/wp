window.YDUI.dialog.loading.open('加载中…');

var businessServerUrl = Window.Config.ServerUrl;

!function ($) {
    
    var JCXMStr = "";
    var JCYQStr = "";
    var JCBWStr = "";
    var YCTSStr = "";
    var RWTSStr = "";

    var ribaoORzhoubao = "";
    var xxtsrbsj = "";
    var xxtszbzhouji = "";
    var xxtszbsj = "";


    var bgts_r_z_y_n = "";
    var bgts_r_time = "";
    var bgts_z_zhouji = "";
    var bgts_z_time = "";
    var bgts_y_time = "";
    var bgts_y_which = "";
    var bgts_n_time = "";
    var bgts_month_time = "";


    var rwts_r_z_y_n = "";
    var rwts_r_time = "";
    var rwts_z_zhouji = "";
    var rwts_z_time = "";
    var rwts_y_time = "";
    var rwts_y_which = "";
    var rwts_n_time = "";
    var rwts_month_time = "";

    //获取URl上的参数
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
    var userguid = urlParam["userguid"];
    var AuthDB = urlParam["AuthDB"];
    var AuthDingYueRead = "";
    var MsgID = ""; 

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
                    MsgID = data.UserArea[0].MsgID;
                    AuthDingYueRead = data.UserArea[0].AuthDingYueRead;
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    var $tab = $('#J_Tab');
    var chooseShow = false;
    $tab.tab({
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    });

    $(".xxts1").click(function(){
        $(".xxts1").find("img").attr("src","./img/langou.png");
        $(".xxts1").find("div.infoSubOneGou").css("border","1px solid #517FF3");
        $(".xxts2").find("img").attr("src","./img/baigou.png");
        $(".xxts2").find("div.infoSubOneGou").css("border","1px solid #bbb");
        ribaoORzhoubao = "rb";
    });

    $(".xxts2").click(function(){
        $(".xxts2").find("img").attr("src","./img/langou.png");
        $(".xxts2").find("div.infoSubOneGou").css("border","1px solid #517FF3");
        $(".xxts1").find("img").attr("src","./img/baigou.png");
        $(".xxts1").find("div.infoSubOneGou").css("border","1px solid #bbb");
        ribaoORzhoubao = "zb";
    });

    $("#xxtsrbsj").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            xxtsrbsj = rs.text;
            $("#xxtsrbsj").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });

    var userPicker = new mui.PopPicker();
    userPicker.setData([{
        value: 'z1',
        text: '周一'
    }, {
        value: 'z2',
        text: '周二'
    }, {
        value: 'z3',
        text: '周三'
    }, {
        value: 'z4',
        text: '周四'
    }, {
        value: 'z5',
        text: '周五'
    }, {
        value: 'z6',
        text: '周六'
    }, {
        value: 'z7',
        text: '周日'
    }]);

    var userPicker2 = new mui.PopPicker();
    userPicker2.setData([
        {value: '1',text: '1号'},
        {value: '2',text: '2号'},
        {value: '3',text: '3号'},
        {value: '4',text: '4号'},
        {value: '5',text: '5号'},
        {value: '6',text: '6号'},
        {value: '7',text: '7号'},
        {value: '8',text: '8号'},
        {value: '9',text: '9号'},
        {value: '10',text: '10号'},
        {value: '11',text: '11号'},
        {value: '12',text: '12号'},
        {value: '13',text: '13号'},
        {value: '14',text: '14号'},
        {value: '15',text: '15号'},
        {value: '16',text: '16号'},
        {value: '17',text: '17号'},
        {value: '18',text: '18号'},
        {value: '19',text: '19号'},
        {value: '20',text: '20号'},
        {value: '21',text: '21号'},
        {value: '22',text: '22号'},
        {value: '23',text: '23号'},
        {value: '24',text: '24号'},
        {value: '25',text: '25号'},
        {value: '26',text: '26号'},
        {value: '27',text: '27号'},
        {value: '28',text: '28号'},
        {value: '29',text: '29号'},
        {value: '30',text: '30号'}
    ]);







    var userPicker5 = new mui.PopPicker();
    userPicker5.setData([
        {value: '1',text: '一月'},
        {value: '2',text: '二月'},
        {value: '3',text: '三月'},
        {value: '4',text: '四月'},
        {value: '5',text: '五月'},
        {value: '6',text: '六月'},
        {value: '7',text: '七月'},
        {value: '8',text: '八月'},
        {value: '9',text: '九月'},
        {value: '10',text: '十月'},
        {value: '11',text: '十一月'},
        {value: '12',text: '十二月'}
    ]);


    $("#xxtszbzhouji").click(function(){
        userPicker.show(function(items) {
            $("#xxtszbzhouji").find("div.infoSubThreeValue").text(items[0].text);
            xxtszbzhouji = items[0].text.value;
        });
    });

    $("#xxtszbsj").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            xxtszbsj = rs.text;
            $("#xxtszbsj").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });


















    $("#bgts_r_z_y_n_1").click(function(){
        $("#bgts_r_z_y_n_1").find("img").attr("src","./img/langou.png");
        $("#bgts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#bgts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        bgts_r_z_y_n = "rb";
    });

    $("#bgts_r_z_y_n_2").click(function(){
        $("#bgts_r_z_y_n_2").find("img").attr("src","./img/langou.png");
        $("#bgts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#bgts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        bgts_r_z_y_n = "zb";
    });

    $("#bgts_r_z_y_n_3").click(function(){
        $("#bgts_r_z_y_n_3").find("img").attr("src","./img/langou.png");
        $("#bgts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#bgts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        bgts_r_z_y_n = "yb";
    });

    $("#bgts_r_z_y_n_4").click(function(){
        $("#bgts_r_z_y_n_4").find("img").attr("src","./img/langou.png");
        $("#bgts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#bgts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#bgts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#bgts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        bgts_r_z_y_n = "nb";
    });

    $("#bgts_r").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            bgts_r_time = rs.text;
            $("#bgts_r").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });

    $("#bgts_month_time").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            bgts_month_time = rs.text;
            $("#bgts_month_time").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });



    $("#bgts_z1").click(function(){
        userPicker.show(function(items) {
            $("#bgts_z1").find("div.infoSubThreeValue").text(items[0].text);
            bgts_z_zhouji = items[0].text.value;
        });
    });

    $("#bgts_z2").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            bgts_z_time = rs.text;
            $("#bgts_z2").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });

    $("#bgts_y").click(function(){
        userPicker2.show(function(items) {
            bgts_y_time = items[0].text.value;
            $("#bgts_y").find("div.infoSubThreeValue").text(items[0].text);

            $("#bgts_y").siblings("div.yumochoose").find("div.container").addClass("nochooseborder");
            $("#bgts_y").siblings("div.yumochoose").find("div.chooseTxt").addClass("nochooseColor");
            $("#bgts_y").siblings("div.yumochoose").find("div.inner-triangle").addClass("nochoose");
            $("#bgts_y").siblings("div.yumochoose").find("div.outer-triangle").addClass("nochoose");

        });
    });

    // $("#bgts_n").click(function(){
    //     var _self = this;
    //     var options = {};
    //     _self.picker = new mui.DtPicker(options);
    //     _self.picker.show(function(rs) {
    //         bgts_n_time = rs.text;
    //         $("#bgts_n").find("div.infoSubThreeValue").text(rs.text);
    //         _self.picker.dispose();
    //         _self.picker = null;
    //     });
    // });








    $(".yumochoose").click(function(){
        if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").removeClass("nochooseborder");
            $(this).find("div.chooseTxt").removeClass("nochooseColor");
            $(this).find("div.inner-triangle").removeClass("nochoose");
            $(this).find("div.outer-triangle").removeClass("nochoose");

            bgts_y_which = $(this).attr("id");

            $("#bgts_y").find("div.infoSubThreeValue").text("请选择日期");

        } else {
            bgts_y_which = "";

            $(this).find("div.container").addClass("nochooseborder");
            $(this).find("div.chooseTxt").addClass("nochooseColor");
            $(this).find("div.inner-triangle").addClass("nochoose");
            $(this).find("div.outer-triangle").addClass("nochoose");

            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");
        }
    })











    $("#rwts_r_z_y_n_1").click(function(){
        $("#rwts_r_z_y_n_1").find("img").attr("src","./img/langou.png");
        $("#rwts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#rwts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        rwts_r_z_y_n = "rb";
    });

    $("#rwts_r_z_y_n_2").click(function(){
        $("#rwts_r_z_y_n_2").find("img").attr("src","./img/langou.png");
        $("#rwts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#rwts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        rwts_r_z_y_n = "zb";
    });

    $("#rwts_r_z_y_n_3").click(function(){
        $("#rwts_r_z_y_n_3").find("img").attr("src","./img/langou.png");
        $("#rwts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#rwts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_4").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #bbb");

        rwts_r_z_y_n = "yb";
    });

    $("#rwts_r_z_y_n_4").click(function(){
        $("#rwts_r_z_y_n_4").find("img").attr("src","./img/langou.png");
        $("#rwts_r_z_y_n_4").find("div.infoSubOneGou").css("border","1px solid #517FF3");

        $("#rwts_r_z_y_n_2").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_2").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_3").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_3").find("div.infoSubOneGou").css("border","1px solid #bbb");

        $("#rwts_r_z_y_n_1").find("img").attr("src","./img/baigou.png");
        $("#rwts_r_z_y_n_1").find("div.infoSubOneGou").css("border","1px solid #bbb");

        rwts_r_z_y_n = "nb";
    });

    $("#rwts_r").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            rwts_r_time = rs.text;
            $("#rwts_r").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });


    $("#rwts_month_time").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            rwts_month_time = rs.text;
            $("#rwts_month_time").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });

    $("#rwts_z1").click(function(){
        userPicker.show(function(items) {
            $("#rwts_z1").find("div.infoSubThreeValue").text(items[0].text);
            rwts_z_zhouji = items[0].text.value;
        });
    });

    $("#rwts_z2").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            rwts_z_time = rs.text;
            $("#rwts_z2").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });

    $("#rwts_y").click(function(){
        userPicker2.show(function(items) {
            rwts_y_time = items[0].text.value;
            $("#rwts_y").find("div.infoSubThreeValue").text(items[0].text);

            $("#rwts_y").siblings("div.yomochoose2").find("div.container").addClass("nochooseborder");
            $("#rwts_y").siblings("div.yomochoose2").find("div.chooseTxt").addClass("nochooseColor");
            $("#rwts_y").siblings("div.yomochoose2").find("div.inner-triangle").addClass("nochoose");
            $("#rwts_y").siblings("div.yomochoose2").find("div.outer-triangle").addClass("nochoose");

        });
    });

    // $("#rwts_n").click(function(){
    //     var _self = this;
    //     var options = {};
    //     _self.picker = new mui.DtPicker(options);
    //     _self.picker.show(function(rs) {
    //         rwts_n_time = rs.text;
    //         $("#rwts_n").find("div.infoSubThreeValue").text(rs.text);
    //         _self.picker.dispose();
    //         _self.picker = null;
    //     });
    // });

    $(".yomochoose2").click(function(){
        if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").removeClass("nochooseborder");
            $(this).find("div.chooseTxt").removeClass("nochooseColor");
            $(this).find("div.inner-triangle").removeClass("nochoose");
            $(this).find("div.outer-triangle").removeClass("nochoose");

            rwts_y_which = $(this).attr("id");

            $("#rwts_y").find("div.infoSubThreeValue").text("请选择日期");
        } else {
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").addClass("nochooseborder");
            $(this).find("div.chooseTxt").addClass("nochooseColor");
            $(this).find("div.inner-triangle").addClass("nochoose");
            $(this).find("div.outer-triangle").addClass("nochoose");

            rwts_y_which = "";
        }
    });









    
    //后加的
    var bgts_n_y = "";
    var bgts_n_r = "";
    var bgts_n_r_which = "";
    var bgts_n_month_time = "";
    $("#bgts_n_y").click(function(){
        userPicker5.show(function(items) {
            bgts_n_y = items[0].text.value;
            $("#bgts_n_y").find("div.infoSubThreeValue").text(items[0].text);
        });
    });
    $("#bgts_n_r").click(function(){
        userPicker2.show(function(items) {
            bgts_n_r = items[0].text.value;
            $("#bgts_n_r").find("div.infoSubThreeValue").text(items[0].text);

            $("#bgts_n_r").siblings("div.yumochoose5").find("div.container").addClass("nochooseborder");
            $("#bgts_n_r").siblings("div.yumochoose5").find("div.chooseTxt").addClass("nochooseColor");
            $("#bgts_n_r").siblings("div.yumochoose5").find("div.inner-triangle").addClass("nochoose");
            $("#bgts_n_r").siblings("div.yumochoose5").find("div.outer-triangle").addClass("nochoose");

        });
    });
    $(".yumochoose5").click(function(){
        if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").removeClass("nochooseborder");
            $(this).find("div.chooseTxt").removeClass("nochooseColor");
            $(this).find("div.inner-triangle").removeClass("nochoose");
            $(this).find("div.outer-triangle").removeClass("nochoose");

            bgts_n_r_which = $(this).attr("id");

            $("#bgts_n_r").find("div.infoSubThreeValue").text("请选择日期");
        } else {
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").addClass("nochooseborder");
            $(this).find("div.chooseTxt").addClass("nochooseColor");
            $(this).find("div.inner-triangle").addClass("nochoose");
            $(this).find("div.outer-triangle").addClass("nochoose");

            bgts_n_r_which = "";
        }
    });
    $("#bgts_n_month_time").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            bgts_n_month_time = rs.text;
            $("#bgts_n_month_time").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });







    //后加的
    var rwts_n_y = "";
    var rwts_n_r = "";
    var rwts_n_r_which = "";
    var rwts_n_month_time = "";
    $("#rwts_n_y").click(function(){
        userPicker5.show(function(items) {
            rwts_n_y = items[0].text.value;
            $("#rwts_n_y").find("div.infoSubThreeValue").text(items[0].text);
        });
    });
    $("#rwts_n_r").click(function(){
        userPicker2.show(function(items) {
            rwts_n_r = items[0].text.value;
            $("#rwts_n_r").find("div.infoSubThreeValue").text(items[0].text);

            $("#rwts_n_r").siblings("div.yumochoose10").find("div.container").addClass("nochooseborder");
            $("#rwts_n_r").siblings("div.yumochoose10").find("div.chooseTxt").addClass("nochooseColor");
            $("#rwts_n_r").siblings("div.yumochoose10").find("div.inner-triangle").addClass("nochoose");
            $("#rwts_n_r").siblings("div.yumochoose10").find("div.outer-triangle").addClass("nochoose");

        });
    });
    $(".yumochoose10").click(function(){
        if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").removeClass("nochooseborder");
            $(this).find("div.chooseTxt").removeClass("nochooseColor");
            $(this).find("div.inner-triangle").removeClass("nochoose");
            $(this).find("div.outer-triangle").removeClass("nochoose");

            rwts_n_r_which = $(this).attr("id");

            $("#rwts_n_r").find("div.infoSubThreeValue").text("请选择日期");
        } else {
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");

            $(this).find("div.container").addClass("nochooseborder");
            $(this).find("div.chooseTxt").addClass("nochooseColor");
            $(this).find("div.inner-triangle").addClass("nochoose");
            $(this).find("div.outer-triangle").addClass("nochoose");

            rwts_n_r_which = "";
        }
    });
    $("#rwts_n_month_time").click(function(){
        var _self = this;
        var options = {"type":"time"};
        _self.picker = new mui.DtPicker(options);
        _self.picker.show(function(rs) {
            rwts_n_month_time = rs.text;
            $("#rwts_n_month_time").find("div.infoSubThreeValue").text(rs.text);
            _self.picker.dispose();
            _self.picker = null;
        });
    });













    //ajax请求筛选条件
    var requestData = {
        "DataBeaseID":AuthDB,
    };
    $.ajax({
        url: businessServerUrl + '/MsgFit/MsgSearchType.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                var JCXMItemTmpl = $('#JCXMItemTmpl').html();
                Mustache.parse(JCXMItemTmpl);
                var JCXMrendered = Mustache.render(JCXMItemTmpl, {item : data.UserAreaCheckProject});
                $('#topChoose1').html(JCXMrendered);

                var JCYQItemTmpl = $('#JCYQItemTmpl').html();
                Mustache.parse(JCYQItemTmpl);
                var YQLXrendered = Mustache.render(JCYQItemTmpl, {item : data.UserAreaInstrumentType});
                $('#topChoose2').html(YQLXrendered);

                var JCBWItemTmpl = $('#JCBWItemTmpl').html();
                Mustache.parse(JCBWItemTmpl);
                var JCBWrendered = Mustache.render(JCBWItemTmpl, {item : data.UserAreaMonitoringSite});
                $('#topChoose3').html(JCBWrendered);

                var YCTUISONGItemTmpl = $('#YCTUISONGItemTmpl').html();
                Mustache.parse(YCTUISONGItemTmpl);
                var YCTUISONGrendered = Mustache.render(YCTUISONGItemTmpl, {item : data.UserAreaLevel});
                $('#YCTUISONGcontent').html(YCTUISONGrendered);

                var RENWUTSItemTmpl = $('#RENWUTSItemTmpl').html();
                Mustache.parse(RENWUTSItemTmpl);
                var RENWUTSrendered = Mustache.render(RENWUTSItemTmpl, {item : data.UserAreaDuty});
                $('#rwtscontentborder').html(RENWUTSrendered);

                var tmpList = $('#topChoose1 > .dytsborder');
                for(var i = 0 ; i < tmpList.length ; i++){
                    if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28)
                        $(tmpList[i]).addClass("dytsneedmargin");
                }

                var tmpList = $('#topChoose2 > .dytsborder');
                for(var i = 0 ; i < tmpList.length ; i++){
                    if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28)
                        $(tmpList[i]).addClass("dytsneedmargin");
                }

                var tmpList = $('#topChoose3 > .dytsborder');
                for(var i = 0 ; i < tmpList.length ; i++){
                    if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28)
                        $(tmpList[i]).addClass("dytsneedmargin");
                }

                var tmpList = $('#YCTUISONGcontent > .dytsborder');
                for(var i = 0 ; i < tmpList.length ; i++){
                    if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28)
                        $(tmpList[i]).addClass("dytsneedmargin");
                }
                //注册点击事件
                registerShijian();
                if(MsgID != ""){
                    getSubDetail();
                } else {
                    window.YDUI.dialog.loading.close();
                }
            } else {
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });

    // var JCXMStr = "";
    // var JCYQStr = "";
    // var JCBWStr = "";
    // var YCTSStr = "";

    function addIntoStr(whichStr , str){
        if(whichStr == "1")
            JCXMStr = JCXMStr + str + ";";
        if(whichStr == "2")
            JCYQStr = JCYQStr + str + ";"
        if(whichStr == "3")
            JCBWStr = JCBWStr + str + ";"
        if(whichStr == "4")
            YCTSStr = YCTSStr + str + ";"
    }
    function removeFromStr(whichStr , str){
        var reg = new RegExp(str + ";" , "g");
        if(whichStr == "1")
            JCXMStr = JCXMStr.replace(reg , "");
        if(whichStr == "2")
            JCYQStr = JCYQStr.replace(reg , "");
        if(whichStr == "3")
            JCBWStr = JCBWStr.replace(reg , "");
        if(whichStr == "4")
            YCTSStr = YCTSStr.replace(reg , "");
    }
    function removeAllStr(whichStr){
        if(whichStr == "1")
            JCXMStr = "";
        if(whichStr == "2")
            JCYQStr = "";
        if(whichStr == "3")
            JCBWStr = "";
        if(whichStr == "4")
            YCTSStr = "";
    }






    function registerShijian(){

        $(".JCXMborder").click(function(){

            if($(this).hasClass("JCXMall")){
                //点全部按钮
                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    //如果点的时候没选中
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    $(this).siblings().find("div.container").addClass("nochooseborder");
                    $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
                    $(this).siblings().find("div.inner-triangle").addClass("nochoose");
                    $(this).siblings().find("div.outer-triangle").addClass("nochoose");
                } else {
                    //如果点的时候已经选中了
                    //那么不做任何操作
                }

                //------------------------------------
                removeAllStr("1");

            } else {    //点击不是全部按钮的按钮

                //全部按钮干掉选中
                $(".JCXMall").find("div.container").addClass("nochooseborder");
                $(".JCXMall").find("div.chooseTxt").addClass("nochooseColor");
                $(".JCXMall").find("div.inner-triangle").addClass("nochoose");
                $(".JCXMall").find("div.outer-triangle").addClass("nochoose");

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    //选中
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    addIntoStr("1" , str);

                } else {
                    //取消选中
                    $(this).find("div.container").addClass("nochooseborder");
                    $(this).find("div.chooseTxt").addClass("nochooseColor");
                    $(this).find("div.inner-triangle").addClass("nochoose");
                    $(this).find("div.outer-triangle").addClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    removeFromStr("1" , str);
                }
            }
        });



        $(".JCYQborder").click(function(){

            if($(this).hasClass("JCYQall")){//点全部按钮

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    //如果点的时候没选中
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    $(this).siblings().find("div.container").addClass("nochooseborder");
                    $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
                    $(this).siblings().find("div.inner-triangle").addClass("nochoose");
                    $(this).siblings().find("div.outer-triangle").addClass("nochoose");
                } else {
                    //如果点的时候已经选中了
                    //那么不做任何操作
                }

                //------------------------------------
                removeAllStr("2");

            } else {    //点击不是全部按钮的按钮

                //全部按钮干掉选中
                $(".JCYQall").find("div.container").addClass("nochooseborder");
                $(".JCYQall").find("div.chooseTxt").addClass("nochooseColor");
                $(".JCYQall").find("div.inner-triangle").addClass("nochoose");
                $(".JCYQall").find("div.outer-triangle").addClass("nochoose");

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    addIntoStr("2" , str);

                } else {
                    $(this).find("div.container").addClass("nochooseborder");
                    $(this).find("div.chooseTxt").addClass("nochooseColor");
                    $(this).find("div.inner-triangle").addClass("nochoose");
                    $(this).find("div.outer-triangle").addClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    removeFromStr("2" , str);
                }
            }
        });



        $(".JCBWborder").click(function(){

            if($(this).hasClass("JCBWall")){//点全部按钮

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    //如果点的时候没选中
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    $(this).siblings().find("div.container").addClass("nochooseborder");
                    $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
                    $(this).siblings().find("div.inner-triangle").addClass("nochoose");
                    $(this).siblings().find("div.outer-triangle").addClass("nochoose");
                } else {
                    //如果点的时候已经选中了
                    //那么不做任何操作
                }

                //------------------------------------
                removeAllStr("3");

            } else {    //点击不是全部按钮的按钮

                //全部按钮干掉选中
                $(".JCBWall").find("div.container").addClass("nochooseborder");
                $(".JCBWall").find("div.chooseTxt").addClass("nochooseColor");
                $(".JCBWall").find("div.inner-triangle").addClass("nochoose");
                $(".JCBWall").find("div.outer-triangle").addClass("nochoose");

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    addIntoStr("3" , str);

                } else {
                    $(this).find("div.container").addClass("nochooseborder");
                    $(this).find("div.chooseTxt").addClass("nochooseColor");
                    $(this).find("div.inner-triangle").addClass("nochoose");
                    $(this).find("div.outer-triangle").addClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    removeFromStr("3" , str);
                }
            }
        });


        $(".YCTUISONGborder").click(function(){

            if($(this).hasClass("YCTUISONGall")){//点全部按钮

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    //如果点的时候没选中
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    $(this).siblings().find("div.container").addClass("nochooseborder");
                    $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
                    $(this).siblings().find("div.inner-triangle").addClass("nochoose");
                    $(this).siblings().find("div.outer-triangle").addClass("nochoose");
                } else {
                    //如果点的时候已经选中了
                    //那么不做任何操作
                }

                //------------------------------------
                removeAllStr("4");

            } else {    //点击不是全部按钮的按钮

                //全部按钮干掉选中
                $(".YCTUISONGall").find("div.container").addClass("nochooseborder");
                $(".YCTUISONGall").find("div.chooseTxt").addClass("nochooseColor");
                $(".YCTUISONGall").find("div.inner-triangle").addClass("nochoose");
                $(".YCTUISONGall").find("div.outer-triangle").addClass("nochoose");

                if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                    $(this).find("div.container").removeClass("nochooseborder");
                    $(this).find("div.chooseTxt").removeClass("nochooseColor");
                    $(this).find("div.inner-triangle").removeClass("nochoose");
                    $(this).find("div.outer-triangle").removeClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    addIntoStr("4" , str);

                } else {
                    $(this).find("div.container").addClass("nochooseborder");
                    $(this).find("div.chooseTxt").addClass("nochooseColor");
                    $(this).find("div.inner-triangle").addClass("nochoose");
                    $(this).find("div.outer-triangle").addClass("nochoose");

                    //------------------------------------
                    var str = $(this).attr("id");
                    removeFromStr("4" , str);
                }
            }
        });


        $(".RENWUTSborder").click(function(){
            if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
                $(this).siblings().find("div.container").addClass("nochooseborder");
                $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
                $(this).siblings().find("div.inner-triangle").addClass("nochoose");
                $(this).siblings().find("div.outer-triangle").addClass("nochoose");

                $(this).find("div.container").removeClass("nochooseborder");
                $(this).find("div.chooseTxt").removeClass("nochooseColor");
                $(this).find("div.inner-triangle").removeClass("nochoose");
                $(this).find("div.outer-triangle").removeClass("nochoose");

                RWTSStr = $(this).attr("id");
            }
        });
    }



    function getSubDetail(){
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID": AuthDB,
            "ID": MsgID
        };
        $.ajax({
            url: businessServerUrl + '/MsgFit/MsgDetail.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    var datas = data.UserArea[0];

                    var ProjectID = datas.ProjectID;
                    var InstrumentTypeID = datas.InstrumentTypeID;
                    var MonitoringSiteID = datas.MonitoringSiteID;
                    var LevelID = datas.LevelID;
                    var MsgType = datas.MsgType;
                    var ReportType = datas.ReportType;
                    var DutyType = datas.DutyType;

                    if(datas.ProjectID == "all"){
                        $(".JCXMall").click();
                    } else {
                        var tmp1 = $(".JCXMborder");
                        var tmp1tmp = ProjectID.split(";");
                        for(var index = 0 ; index < tmp1.length ; index++){
                            if($.inArray( $(tmp1[index]).attr("id") , tmp1tmp ) >= 0)
                                $(tmp1[index]).click();
                        }
                    }
                    
                    if(datas.InstrumentTypeID == "all"){
                        $(".JCYQall").click();
                    } else {
                        var tmp2 = $(".JCYQborder");
                        var tmp2tmp = InstrumentTypeID.split(";");
                        for(var index = 0 ; index < tmp2.length ; index++){
                            if($.inArray( $(tmp2[index]).attr("id") , tmp2tmp ) >= 0)
                                $(tmp2[index]).click();
                        }
                    }
                    

                    if(datas.ProjectID == "all"){
                        $(".JCBWall").click();
                    } else {
                        var tmp3 = $(".JCBWborder");
                        var tmp3tmp = MonitoringSiteID.split(";");
                        for(var index = 0 ; index < tmp3.length ; index++){
                            if($.inArray( $(tmp3[index]).attr("id") , tmp3tmp ) >= 0)
                                $(tmp3[index]).click();
                        }
                    }
                   

                    if(datas.LevelID == "all"){
                        $(".YCTUISONGall").click();
                    } else {
                        var tmp4 = $(".YCTUISONGborder");
                        var tmp4tmp = LevelID.split(";");
                        for(var index = 0 ; index < tmp4.length ; index++){
                            if($.inArray( $(tmp4[index]).attr("id") , tmp4tmp ) >= 0)
                                $(tmp4[index]).click();
                        }
                    }
                    






                    if(MsgType.split(";")[0] == "day"){
                        $(".xxts1").click();
                        $("#xxtsrbsj").find("div.infoSubThreeValue").text(MsgType.split(";")[1]);
                    } else if (MsgType.split(";")[0] == "week"){
                        $(".xxts2").click();
                        $("#xxtszbzhouji").find("div.infoSubThreeValue").text(formatWeekReverse(MsgType.split(";")[1]));
                        $("#xxtszbsj").find("div.infoSubThreeValue").text(MsgType.split(";")[2]);
                    }








                    if(ReportType.split(";")[0] == "day"){
                        $("#bgts_r_z_y_n_1").click();
                        $("#bgts_r").find("div.infoSubThreeValue").text(ReportType.split(";")[1]);
                    } else if (ReportType.split(";")[0] == "week"){
                        $("#bgts_r_z_y_n_2").click();
                        $("#bgts_z1").find("div.infoSubThreeValue").text(formatWeekReverse(ReportType.split(";")[1]));
                        $("#bgts_z2").find("div.infoSubThreeValue").text(ReportType.split(";")[2]);
                    } else if (ReportType.split(";")[0] == "month"){
                        $("#bgts_r_z_y_n_3").click();
                        
                        if(isNumber(ReportType.split(";")[1])){
                            $("#bgts_y").find("div.infoSubThreeValue").text(ReportType.split(";")[1] + "号");
                        } else {
                            if(ReportType.split(";")[1] == "lastday"){
                                $("#bgts_month1").click();
                            } else if(ReportType.split(";")[1] == "lastsecondday"){
                                $("#bgts_month2").click();
                            } else if(ReportType.split(";")[1] == "lastthirdday"){
                                $("#bgts_month3").click();
                            }
                        }
                        $("#bgts_month_time").find("div.infoSubThreeValue").text(DutyType.split(";")[3]);
                    } else if (ReportType.split(";")[0] == "year"){
                        $("#bgts_r_z_y_n_4").click();

                        $("#bgts_n_y").find("div.infoSubThreeValue").text(formatMonthReverse(ReportType.split(";")[1]));

                        var tmp = ReportType.split(";")[2];
                        if(isNumber(tmp)){
                            $("#bgts_n_r").find("div.infoSubThreeValue").text(tmp + "号");
                        } else {
                            if(tmp == "lastday"){
                                $("#bgts_n_r_month1").click();
                            } else if(tmp == "lastsecondday"){
                                $("#bgts_n_r_month2").click();
                            } else if(tmp == "lastthirdday"){
                                $("#bgts_n_r_month3").click();
                            }
                        }
                        $("#bgts_n_month_time").find("div.infoSubThreeValue").text(ReportType.split(";")[3]);
                    }







                    var tmptmptmp = $(".RENWUTSborder");
                    var tmptmptmptmp = DutyType.split(";");

                    for(var index = 0 ; index < tmptmptmp.length ; index++){
                        if(tmptmptmptmp[0] == $(tmptmptmp[index]).attr("id")){
                            $(tmptmptmp[index]).click();
                            break;
                        }
                    }
                    
                    if(DutyType.split(";")[1] == "day"){
                        $("#rwts_r_z_y_n_1").click();
                        $("#rwts_r").find("div.infoSubThreeValue").text(DutyType.split(";")[2]);
                    } else if (DutyType.split(";")[1] == "week"){
                        $("#rwts_r_z_y_n_2").click();
                        $("#rwts_z1").find("div.infoSubThreeValue").text(formatWeekReverse(DutyType.split(";")[2]));
                        $("#rwts_z2").find("div.infoSubThreeValue").text(DutyType.split(";")[3]);
                    } else if (DutyType.split(";")[1] == "month"){
                        $("#rwts_r_z_y_n_3").click();
                        
                        if(isNumber(DutyType.split(";")[2])){
                            $("#rwts_y").find("div.infoSubThreeValue").text(DutyType.split(";")[2] + "号");
                        } else {
                            if(DutyType.split(";")[2] == "lastday"){
                                $("#rwts_month1").click();
                            } else if(DutyType.split(";")[2] == "lastsecondday"){
                                $("#rwts_month2").click();
                            } else if(DutyType.split(";")[2] == "lastthirdday"){
                                $("#rwts_month3").click();
                            }
                        }

                        $("#rwts_month_time").find("div.infoSubThreeValue").text(DutyType.split(";")[3]);
                    } else if (DutyType.split(";")[1] == "year"){
                        $("#rwts_r_z_y_n_4").click();
                        
                        $("#rwts_n_y").find("div.infoSubThreeValue").text(formatMonthReverse(DutyType.split(";")[2]));

                        var tmp = DutyType.split(";")[3];
                        if(isNumber(tmp)){
                            $("#rwts_n_r").find("div.infoSubThreeValue").text(tmp + "号");
                        } else {
                            if(tmp == "lastday"){
                                $("#rwts_n_r_month1").click();
                            } else if(tmp == "lastsecondday"){
                                $("#rwts_n_r_month2").click();
                            } else if(tmp == "lastthirdday"){
                                $("#rwts_n_r_month3").click();
                            }
                        }
                        $("#rwts_n_month_time").find("div.infoSubThreeValue").text(DutyType.split(";")[4]);
                    }



                    if(AuthDingYueRead != "1"){
                        window.YDUI.dialog.toast('您对该页面无操作权限', 'error', 1500);
                        $("div").unbind();
                        $("span").unbind();
                        $("#saveSetting").hide();
                    }
                    
                    window.YDUI.dialog.loading.close();

                } else {
                    window.YDUI.dialog.loading.close();
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    function isNumber(val){
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val))
            return true;
        else
            return false;
    }

    $("#saveSetting").click(function(){

        if(bgts_r_z_y_n == "yb"){
            if(
                $("#bgts_month1").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_month2").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_month3").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_y").find("div.infoSubThreeValue").text() == "请选择日期"
            ){
                window.YDUI.dialog.toast('请选择报告推送中的月报时间', 'error', 1000);
                return;
            }
        }

        if(bgts_r_z_y_n == "nb"){
            if(
                $("#bgts_n_r_month1").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_n_r_month2").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_n_r_month3").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#bgts_n_r").find("div.infoSubThreeValue").text() == "请选择日期"
            ){
                window.YDUI.dialog.toast('请选择报告推送中的年报时间', 'error', 1000);
                return;
            }
        }

        if(rwts_r_z_y_n == "yb"){
            if(
                $("#rwts_month1").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_month2").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_month3").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_y").find("div.infoSubThreeValue").text() == "请选择日期"
            ){
                window.YDUI.dialog.toast('请选择任务推送中的月报时间', 'error', 1000);
                return;
            }
        }

        if(rwts_r_z_y_n == "nb"){
            if(
                $("#rwts_n_r_month1").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_n_r_month2").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_n_r_month3").find("div.nochooseborder").hasClass("nochooseborder") && 
                $("#rwts_n_r").find("div.infoSubThreeValue").text() == "请选择日期"
            ){
                window.YDUI.dialog.toast('请选择任务推送中的年报时间', 'error', 1000);
                return;
            }
        }

        if(MsgID == "")
            window.YDUI.dialog.confirm('', '确认新增', function () {confirm();});
        else 
            window.YDUI.dialog.confirm('', '确认修改', function () {confirm2();});
    });

    function confirm(){
        window.YDUI.dialog.loading.open('加载中…');
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID":      AuthDB,
            "UserGuid":         userguid,
            "ProjectID":        getJCXM(),
            "InstrumentTypeID": getJCYQ(),
            "MonitoringSiteID": getJCBW(),
            "LevelID":          getYCTS(),
            "MsgType":          getXXTS(),
            "ReportType":       getBGTS(),
            "DutyType":         getRWTS()
        };

        $.ajax({
            url: businessServerUrl + '/MsgFit/AddMsg.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                window.YDUI.dialog.loading.close();
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    window.YDUI.dialog.toast('新增订阅成功', 'success', 1000);
                    setTimeout(function(){
                        f_close();
                    } , 900);
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    function confirm2(){
        window.YDUI.dialog.loading.open('加载中…');
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID":      AuthDB,
            "ID":               MsgID,
            "ProjectID":        getJCXM(),
            "InstrumentTypeID": getJCYQ(),
            "MonitoringSiteID": getJCBW(),
            "LevelID":          getYCTS(),
            "MsgType":          getXXTS(),
            "ReportType":       getBGTS(),
            "DutyType":         getRWTS()
        };

        $.ajax({
            url: businessServerUrl + '/MsgFit/UpdateMsg.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                window.YDUI.dialog.loading.close();
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    window.YDUI.dialog.toast('更新订阅成功', 'success', 1000);
                    setTimeout(function(){
                        f_close();
                    } , 900);
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    function getJCXM(){
        //获取监测项目ID
        var returnLists = "";
        if($(".JCXMall").find("div.container").hasClass("nochooseborder")){
            var tmpDomList = $("#topChoose1").find("div.dytsborder");
            for(var index = 0 ; index < tmpDomList.length ; index++){
                if(!$(tmpDomList[index]).find("div.container").hasClass("nochooseborder"))
                    returnLists = returnLists + $(tmpDomList[index]).attr("id") + ";";
            }
            return returnLists;
        } else {
            return "all";
        }
    }
    function getJCYQ(){
        //获取监测仪器ID
        var returnLists = "";
        if($(".JCYQall").find("div.container").hasClass("nochooseborder")){
            var tmpDomList = $("#topChoose2").find("div.dytsborder");
            for(var index = 0 ; index < tmpDomList.length ; index++){
                if(!$(tmpDomList[index]).find("div.container").hasClass("nochooseborder"))
                    returnLists = returnLists + $(tmpDomList[index]).attr("id") + ";";
            }
            return returnLists;
        } else {
            return "all";
        }
    }
    function getJCBW(){
        //获取监测部位ID
        var returnLists = "";
        if($(".JCBWall").find("div.container").hasClass("nochooseborder")){
            var tmpDomList = $("#topChoose3").find("div.dytsborder");
            for(var index = 0 ; index < tmpDomList.length ; index++){
                if(!$(tmpDomList[index]).find("div.container").hasClass("nochooseborder"))
                    returnLists = returnLists + $(tmpDomList[index]).attr("id") + ";";
            }
            return returnLists;
        } else {
            return "all";
        }
    }
    function getYCTS(){
        //获取异常推送等级ID
        var returnLists = "";
        if($(".YCTUISONGall").find("div.container").hasClass("nochooseborder")){
            var tmpDomList = $("#YCTUISONGcontent").find("div.dytsborder");
            for(var index = 0 ; index < tmpDomList.length ; index++){
                if(!$(tmpDomList[index]).find("div.container").hasClass("nochooseborder"))
                    returnLists = returnLists + $(tmpDomList[index]).attr("id") + ";";
            }
            return returnLists;
        } else {
            return "all";
        }
    }
    function getXXTS(){
        //获取信息推送
        var returnValue = "";
        if(ribaoORzhoubao == "rb"){
            returnValue = $("#xxtsrbsj").find("div.infoSubThreeValue").text();
            returnValue = "day;" + returnValue;
            return returnValue;
        } else if (ribaoORzhoubao == "zb"){
            returnValue = formatWeek($("#xxtszbzhouji").find("div.infoSubThreeValue").text());
            returnValue = returnValue + ";" + $("#xxtszbsj").find("div.infoSubThreeValue").text();
            returnValue = "week;" + returnValue;
            return returnValue;
        } else {
            return "";
        }
    }
    function getBGTS(){
        //获取报告推送
        var returnValue = "";
        if(bgts_r_z_y_n == "rb"){
            returnValue = $("#bgts_r").find("div.infoSubThreeValue").text();
            returnValue = "day;" + returnValue;
            return returnValue;
        } else if(bgts_r_z_y_n == "zb"){
            returnValue = formatWeek($("#bgts_z1").find("div.infoSubThreeValue").text());
            returnValue = returnValue + ";" + $("#bgts_z2").find("div.infoSubThreeValue").text();
            returnValue = "week;" + returnValue;
            return returnValue;
        } else if(bgts_r_z_y_n == "yb"){
            returnValue = returnValue + "month;";

            if(!$("#bgts_month1").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastday;";
            else if(!$("#bgts_month2").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastsecondday;";
            else if(!$("#bgts_month3").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastthirdday;";
            else
                returnValue = returnValue + $("#bgts_y").find("div.infoSubThreeValue").text().replace("号" , "") + ";";

            returnValue = returnValue + $("#bgts_month_time").find("div.infoSubThreeValue").text();
            return returnValue;
        } else if(bgts_r_z_y_n == "nb"){

            returnValue = "year;" + returnValue;

            returnValue = returnValue + formatMonth($("#bgts_n_y").find("div.infoSubThreeValue").text()) + ";";

            if(!$("#bgts_n_r_month1").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastday;";
            else if(!$("#bgts_n_r_month2").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastsecondday;";
            else if(!$("#bgts_n_r_month3").find("div.nochooseborder").hasClass("nochooseborder"))
                returnValue = returnValue + "lastthirdday;";
            else
                returnValue = returnValue + $("#bgts_n_r").find("div.infoSubThreeValue").text().replace("号" , "") + ";";

            returnValue = returnValue + $("#bgts_n_month_time").find("div.infoSubThreeValue").text();
            
            return returnValue;
        } else {
            return "";
        }
    }
    function getRWTS(){
        //获取任务推送
        var returnValue = "";
        var returnLists = "";
        var tmpDomList = $(".RENWUTSborder");
        for(var index = 0 ; index < tmpDomList.length ; index++){
            if(!$(tmpDomList[index]).find("div.container").hasClass("nochooseborder")){
                returnLists = $(tmpDomList[index]).attr("id");
                break;
            }
        }
        if(returnLists == ""){
            return "";
        } else {
            returnValue = returnLists + ";";
            if(rwts_r_z_y_n == "rb"){
                returnValue = returnValue + "day;";
                returnValue = returnValue + $("#rwts_r").find("div.infoSubThreeValue").text();
                return returnValue;
            } else if(rwts_r_z_y_n == "zb"){
                returnValue = returnValue + "week;";
                returnValue = returnValue + formatWeek($("#rwts_z1").find("div.infoSubThreeValue").text()) + ";";
                returnValue = returnValue + $("#rwts_z2").find("div.infoSubThreeValue").text();
                return returnValue;
            } else if(rwts_r_z_y_n == "yb"){
                returnValue = returnValue + "month;";
    
                if(!$("#rwts_month1").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastday;";
                else if(!$("#rwts_month2").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastsecondday;";
                else if(!$("#rwts_month3").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastthirdday;";
                else
                    returnValue = returnValue + $("#rwts_y").find("div.infoSubThreeValue").text().replace("号" , "") + ";";
    
                returnValue = returnValue + $("#rwts_month_time").find("div.infoSubThreeValue").text();
                return returnValue;
            } else if(rwts_r_z_y_n == "nb"){

                returnValue = returnValue + "year;";

                returnValue = returnValue + formatMonth($("#rwts_n_y").find("div.infoSubThreeValue").text()) + ";";

                if(!$("#rwts_n_r_month1").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastday;";
                else if(!$("#rwts_n_r_month2").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastsecondday;";
                else if(!$("#rwts_n_r_month3").find("div.nochooseborder").hasClass("nochooseborder"))
                    returnValue = returnValue + "lastthirdday;";
                else
                    returnValue = returnValue + $("#rwts_n_r").find("div.infoSubThreeValue").text().replace("号" , "") + ";";

                returnValue = returnValue + $("#rwts_n_month_time").find("div.infoSubThreeValue").text();
                
                return returnValue;

            } else {
                return "";
            }
        }
    }

    var showVConsole = Window.Config.showVConsole;
    if(showVConsole){
        document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
    }    





    

    function formatWeek(week){
        if(week == "周一"){
            return "1";
        } else if(week == "周二"){
            return "2";
        } else if(week == "周三"){
            return "3";
        } else if(week == "周四"){
            return "4";
        } else if(week == "周五"){
            return "5";
        } else if(week == "周六"){
            return "6";
        } else if(week == "周日"){
            return "7";
        }
    }

    function formatWeekReverse(week){
        if(week == "1"){
            return "周一";
        } else if(week == "2"){
            return "周二";
        } else if(week == "3"){
            return "周三";
        } else if(week == "4"){
            return "周四";
        } else if(week == "5"){
            return "周五";
        } else if(week == "6"){
            return "周六";
        } else if(week == "7"){
            return "周日";
        }
    }

    function formatMonth(mon){
        if(mon == "一月"){
            return "1";
        } else if(mon == "二月"){
            return "2";
        } else if(mon == "三月"){
            return "3";
        } else if(mon == "四月"){
            return "4";
        } else if(mon == "五月"){
            return "5";
        } else if(mon == "六月"){
            return "6";
        } else if(mon == "七月"){
            return "7";
        } else if(mon == "八月"){
            return "8";
        } else if(mon == "九月"){
            return "9";
        } else if(mon == "十月"){
            return "10";
        } else if(mon == "十一月"){
            return "11";
        } else if(mon == "十二月"){
            return "12";
        }
    }

    function formatMonthReverse(mon){
        if(mon == "1"){
            return "一月";
        } else if(mon == "2"){
            return "二月";
        } else if(mon == "3"){
            return "三月";
        } else if(mon == "4"){
            return "四月";
        } else if(mon == "5"){
            return "五月";
        } else if(mon == "6"){
            return "六月";
        } else if(mon == "7"){
            return "七月";
        } else if(mon == "8"){
            return "八月";
        } else if(mon == "9"){
            return "九月";
        } else if(mon == "10"){
            return "十月";
        } else if(mon == "11"){
            return "十一月";
        } else if(mon == "12"){
            return "十二月";
        }
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
}(jQuery);
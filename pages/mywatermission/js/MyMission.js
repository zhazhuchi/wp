window.YDUI.dialog.loading.open('加载中…');

var businessServerUrl = Window.Config.ServerUrl;
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
var AuthMoreShuiDian = "";
var state = "all";

!function ($) {
    var changestate = "";
    var oldstate = "";
    var whichState = "";
    var statedutyRowGuid = "";
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
                    userguid = data.UserArea[0].UserGuid;
                    AuthMoreShuiDian = data.UserArea[0].AuthMoreShuiDian;
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }





    var self = this;
    // 初始化日历

    var calendar = new Calendar({
        // swiper滑动容器
        container: "#calendar",
        // 上一月节点
        pre: ".pre",
        // 下一月节点
        next: ".next",
        // 回到今天
        backToToday: ".backToday",
        // 业务数据改变
        dataRequest: function(currdate, callback, _this) {
            // 无日程安排
            var data = [{
                "date": "2018-04-18"
            }, {
                "date": "2018-04-17"
            }, {
                "date": "2018-04-16"
            }];
            callback && callback(data);
        },
        // 点击日期事件
        onItemClick: function(item) {
            var defaultDate = item.date;
            // 设置标题
            setTitle(defaultDate);
        },
        // 滑动回调
        swipeCallback: function(item) {
            var defaultDate = item.date;
            // 设置标题
            setTitle(defaultDate);
        },
        // 调试
        isDebug: false
    });

    
    // 设置标题
    var titleNode = document.querySelector('.mid span');

    function setTitle(date) {
        titleNode.innerText = date;
    }



    state = "all";

    var $tab = $('#J_Tab');
    var chooseShow = false;

    $tab.tab({
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    });

    $tab.find('.tab-nav-item').on('opened.ydui.tab', function (e) {

        window.YDUI.dialog.loading.open('加载中…');

        mui('#pullrefresh').pullRefresh().pulldownLoading();

        if(e.index == 0){
            state = "all";
            calendar.refresh();
        }
        if(e.index == 1){
            state = "异常";
            calendar.refresh();
        }
        if(e.index == 2){
            state = "待办";
            calendar.refresh();
        }
        if(e.index == 3){
            state = "已完成";
            calendar.refresh();
        }
    });

    $("#chooseShowTxt").click(function(){
        if(chooseShow){
            chooseShow = false;
            $("#chooseShowTxt>.downIcon").show();
            $("#chooseShowTxt>.upIcon").hide();
            $("#chooseShowTxt").css("color","#585858");
            $("#chooseShowItemsBorder").slideUp("fast");

        } else {
            chooseShow = true;
            $("#chooseShowTxt>.downIcon").hide();
            $("#chooseShowTxt>.upIcon").show();
            $("#chooseShowTxt").css("color","#517FF3");
            $("#chooseShowItemsBorder").slideDown("fast");
        }
    });

    $(".chooseShowItem").click(function(){
        $(this).addClass("chooseShowItemActive").siblings(".chooseShowItem").removeClass("chooseShowItemActive");
        if($(this).text() == "我的日历"){
            $("#item1Border").removeClass("hid");
            $("#item2Border").addClass("hid");
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("我的日历");
        } else {
            $("#item1Border").addClass("hid");
            $("#item2Border").removeClass("hid");
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("我的列表");
        }
        $("#chooseShowTxt").css("color","#585858");
        $("#chooseShowTxt>.downIcon").show();
        $("#chooseShowTxt>.upIcon").hide();
        chooseShow = false;
    });

    //下拉刷新-上拉加载-请求数据
    var count = 1;
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                style: 'circle',
                callback: pulldownRefresh
            },
            up: {
                auto: true,
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });
    //下拉刷新
    function pulldownRefresh() {
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID":AuthDB,
            "UserGuid":userguid,
            "CurrPage":1,
            "PageSize":10,
            "TypeStatus":state,
            "KeyWord":"",
            "AuthMoreShuiDian":AuthMoreShuiDian
        };
        $.ajax({
            url: businessServerUrl + '/WaterDutyDeal/WaterDutyDealList.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    var datas = data.UserArea;
                    for(var index = 0 ; index < datas.length ; index++){
                        if(datas[index].Status == "异常")
                            datas[index].bgcolor = "#F17C7C";
                        if(datas[index].Status == "待办")
                            datas[index].bgcolor = "#E9B11A";
                        if(datas[index].Status == "已完成")
                            datas[index].bgcolor = "#6DC16D";
                    }

                    var template = $('#dataListItemTmpl').html();
                    Mustache.parse(template);
                    var rendered = Mustache.render(template, {item: datas});
                    $('#datalist').html(rendered);

                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
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
    //上拉加载
    function pullupRefresh() {
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID":  AuthDB,
            "UserGuid":     userguid,
            "CurrPage":     count,
            "PageSize":     15,
            "TypeStatus":   "all",
            "KeyWord":      "",
            "AuthMoreShuiDian":AuthMoreShuiDian
        };
        $.ajax({
            url: businessServerUrl + '/WaterDutyDeal/WaterDutyDealList.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    if(data.UserArea.length > 0){

                        count++;

                        //参数为true代表没有更多数据了。
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); 
                        var datas = data.UserArea;

                        for(var index = 0 ; index < datas.length ; index++){
                            if(datas[index].Status == "异常")
                                datas[index].bgcolor = "#F17C7C";
                            if(datas[index].Status == "待办")
                                datas[index].bgcolor = "#E9B11A";
                            if(datas[index].Status == "已完成")
                                datas[index].bgcolor = "#6DC16D";
                        }

                        var template = $('#dataListItemTmpl').html();
                        Mustache.parse(template);
                        var rendered = Mustache.render(template, {item: datas});
                        $('#datalist').append(rendered);
                    } else {
                        //参数为true代表没有更多数据了。
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); 
                    }
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }


    mui("#datalist").on("tap","div.listleftitem",function(){
        var rowguid = $(this).attr("id");
        // 逻辑代码，例如跳转详情页、ajax
        window.location.href = "./missionDetail.html?missionguid=" + rowguid + 
        "&userguid=" + userguid + 
        "&openId=" + openId + 
        "&AuthDB=" + AuthDB
        ;
    });

    mui("#datalist").on("tap","a.DeleteChoseTask",function(){
        var id = $(this).attr("id");
        window.YDUI.dialog.confirm('', '确认删除记录？', function () {
            confirmDelete(id);
        });
    });

    function confirmDelete(id){
        //先调详情接口获取详情
        var requestData = {
            "DataBeaseID":AuthDB,
            "WaterDutyID": id
        };
        $.ajax({
            url: businessServerUrl + '/WaterDuty/DeleteWaterDuty.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    window.YDUI.dialog.toast('删除成功', 'success', 1000);
                    mui('#pullrefresh').pullRefresh().pulldownLoading();
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    mui("#datalist").on("tap","div.listrightitem",function(){
        var rowguid = $(this).attr("id");

        $("#tc_yctx").fadeIn("fast");
        $(".allmask").show();
        oldstate = $(this).text();
        whichState = $(this).attr("id");

        //先调详情接口获取详情
        var requestData = {
            "DataBeaseID":AuthDB,
            "WaterDutyID": rowguid
        };
        $.ajax({
            url: businessServerUrl + '/WaterDutyDeal/InitWaterStatus.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    
                    $("#tc_yctx").find("div.container").addClass("nochooseborder");
                    $("#tc_yctx").find("div.chooseTxt").addClass("nochooseColor");
                    $("#tc_yctx").find("div.inner-triangle").addClass("nochoose");
                    $("#tc_yctx").find("div.outer-triangle").addClass("nochoose");

                    if(data.Data[0]){
                        if(data.Data[0].NewSatus == "异常"){
                            $("#tc_yctx1").find("div.container").removeClass("nochooseborder");
                            $("#tc_yctx1").find("div.chooseTxt").removeClass("nochooseColor");
                            $("#tc_yctx1").find("div.inner-triangle").removeClass("nochoose");
                            $("#tc_yctx1").find("div.outer-triangle").removeClass("nochoose");
                        }
    
                        if(data.Data[0].NewSatus == "待办"){
                            $("#tc_yctx2").find("div.container").removeClass("nochooseborder");
                            $("#tc_yctx2").find("div.chooseTxt").removeClass("nochooseColor");
                            $("#tc_yctx2").find("div.inner-triangle").removeClass("nochoose");
                            $("#tc_yctx2").find("div.outer-triangle").removeClass("nochoose");
                        }
    
                        if(data.Data[0].NewSatus == "已完成"){
                            $("#tc_yctx3").find("div.container").removeClass("nochooseborder");
                            $("#tc_yctx3").find("div.chooseTxt").removeClass("nochooseColor");
                            $("#tc_yctx3").find("div.inner-triangle").removeClass("nochoose");
                            $("#tc_yctx3").find("div.outer-triangle").removeClass("nochoose");
                        }
                    }
                    if(data.Data[0]){
                        $("#yc_reason").find("textarea").val(data.Data[0].Remark);
                    }
                    statedutyRowGuid = data.Data[0].RowGuid;
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    });

    function changeListState(){
        //ajax任务状态初始化
        var requestData = {
            "DataBeaseID":      AuthDB,
            "OldStatus":        oldstate.trim(),
            "WaterDutyID":      whichState,
            "NewStatus":        changestate,
            "Remark":           $("#resonreson").val(),
            "ChangeUserGuid":   userguid,
            "RowGuid":          statedutyRowGuid
        };
        $.ajax({
            url: businessServerUrl + '/WaterDutyDeal/ChangeWaterStatus.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    mui.toast("修改成功");
                    $("#tc_yctx").fadeOut("fast");
                    $(".allmask").hide();

                    mui('#pullrefresh').pullRefresh().pulldownLoading();

                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }

    $("#no_tc_yctx_btn").click(function(){
        $("#tc_yctx").fadeOut("fast");
        $(".allmask").hide();
    });

    $("#have_tc_yctx_btn").click(function(){
        changeListState();
    });

    $(".allmask").click(function(){
        $("#tc_yctx").fadeOut("fast");
        $(".allmask").hide();
    });

    $(".everystateb").click(function(){
        if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
            $(this).siblings().find("div.container").addClass("nochooseborder");
            $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
            $(this).siblings().find("div.inner-triangle").addClass("nochoose");
            $(this).siblings().find("div.outer-triangle").addClass("nochoose");
            $(this).find("div.container").removeClass("nochooseborder");
            $(this).find("div.chooseTxt").removeClass("nochooseColor");
            $(this).find("div.inner-triangle").removeClass("nochoose");
            $(this).find("div.outer-triangle").removeClass("nochoose");
            changestate = $(this).find("div.chooseTxt").text();
        }
    });

    document.getElementById('AllMask').ontouchstart = function(e){
        e.preventDefault();
    }

    var showVConsole = Window.Config.showVConsole;
    if(showVConsole){
        document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
    }

}(jQuery);
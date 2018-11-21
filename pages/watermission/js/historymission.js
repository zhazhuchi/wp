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
var userguid = "";
var process = urlParam["process"];
var AuthDB = urlParam["AuthDB"];

if(process == "add"){
    $("#iconback").show();
    $("#newXunjian").hide();
    $("#iconback").click(function(){
        window.history.go(-1);
    });
}

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
                userguid = data.UserArea[0].UserGuid;
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}


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
        "CurrPage":1,
        "PageSize":10,
        "KeyWord":$("#searchInput").val(),
        "UserGuid":userguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/WaterDutyList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                var datas = data.UserArea;
                var template = $('#dataListItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: datas});
                $('#datalist').html(rendered);

                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}
//上拉加载
function pullupRefresh() {
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":AuthDB,
        "CurrPage":count,
        "PageSize":10,
        "KeyWord":$("#searchInput").val(),
        "UserGuid":userguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/WaterDutyList.ashx',
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



//修改
mui("#datalist").on("tap","div.mui-slider-handle",function(e){
    var id = $(this).attr("id");
    if(process == "add"){
        window.location.href = "./addMission.html?taskguid=" + id + "&openId=" + openId + "&userguid=" + userguid + "&AuthDB=" + AuthDB;
    } else {
        window.location.href = "./missionEdit.html?taskguid=" + id + "&openId=" + openId + "&userguid=" + userguid + "&AuthDB=" + AuthDB;
    }
});

mui("#datalist").on("tap","a",function(e){
    var dom = $(this).parents("li");
    var rowguid = $(this).attr("rowguid");
    window.YDUI.dialog.confirm('', '确认删除', function () {confirmdelete(dom , rowguid);});
});

function confirmdelete(dom , rowguid){
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":AuthDB,
        "rowguid":rowguid,
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/DeleteWaterDuty.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('操作成功', 'success', 1000);
                dom.remove();
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

//新增
$(".editState").click(function(){
    window.location.href = "./addMission.html?openId=" + openId + "&userguid=" + userguid + "&AuthDB=" + AuthDB;
});


$("#searchIcon").click(function(){
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
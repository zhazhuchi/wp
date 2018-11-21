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
var ReportID = urlParam["ReportID"];
var AuthDB = urlParam["AuthDB"];
var openId = urlParam["openId"];
var userguid = urlParam["userguid"];

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
        "ReportID":ReportID
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/WaterDutyReportDealList.ashx',
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
        "ReportID":ReportID
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/WaterDutyReportDealList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            if(data.ReturnInfo[0].Code == '1'){
                count++;
                if(data.UserArea.length > 0){
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

mui("#datalist").on("tap","div.mui-slider-handle",function(){
    var rowguid = $(this).attr("rowguid");
    // 逻辑代码，例如跳转详情页、ajax
    window.location.href = "./detail.html?rowguid=" + rowguid + "&AuthDB=" + AuthDB;
});

mui("#datalist").on("tap","a",function(){
    var rowguid = $(this).attr("rowguid");
    var dom = $(this).parents('li.mui-table-view-cell');
    
    window.YDUI.dialog.confirm('', '确认删除？', function () {
        //ajax请求下拉刷新数据
        var requestData = {
            "DataBeaseID":AuthDB,
            "RowGuid":rowguid
        };
        $.ajax({
            url: businessServerUrl + '/WaterDutyDeal/DeleteDutyReportDeal.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                if(data.ReturnInfo[0].Code == '1'){
                    dom.remove();
                    window.YDUI.dialog.toast('删除成功', 'success', 1000);
                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    });
});


$("#backicon").click(function(){
    window.history.go(-1);
});

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}

$("#xiugaizhuangtai").click(function(){
    window.location.href = "./yichangchuli.html?" + 
        "ReportID=" + ReportID + 
        "&openId=" + openId + 
        "&userguid=" + userguid + 
        "&froEdit=add" +  
        "&AuthDB=" + AuthDB;
});
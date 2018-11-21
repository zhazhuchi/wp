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
var AuthDB = urlParam["AuthDB"];
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
        "PageSize":20,
        "KeyWord":"",
        "UserGuid":""
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
        "KeyWord":"",
        "UserGuid":"32423432545"
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/WaterDutyAuthList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
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




var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
window.YDUI.dialog.loading.open('加载中…');

var jiancexiangmu = "";
var yiqileixing = "";
var jiancebuwei = "";

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

//最顶端过滤器
var whichFilterUse = '0';
$('#f1').click(function(){
    if(whichFilterUse == '1'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideDown("fast");
        $('#YQLX_Filter').slideUp("fast");
        $('#JCBW_Filter').slideUp("fast");
        whichFilterUse = '1';
    }
});
$('#f2').click(function(){
    if(whichFilterUse == '2'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideUp("fast");
        $('#YQLX_Filter').slideDown("fast");
        $('#JCBW_Filter').slideUp("fast");
        whichFilterUse = '2';
    }
});
$('#f3').click(function(){
    if(whichFilterUse == '3'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideUp("fast");
        $('#YQLX_Filter').slideUp("fast");
        $('#JCBW_Filter').slideDown("fast");
        whichFilterUse = '3';
    }
});
$('#AllMask').click(function(){
    hideFilter();
});
$('.cancleBtn').click(function(){
    hideFilter();
});
function hideFilter(){
    $('#AllMask').hide();
    $('#JCXM_Filter').slideUp("fast");
    $('#YQLX_Filter').slideUp("fast");
    $('#JCBW_Filter').slideUp("fast");
    whichFilterUse = '0';
}


$("#JCXMConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});
$("#YQLXConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});
$("#JCBWConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});
$("#searchIcon").click(function(){
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});



//ajax请求筛选条件
var requestData = {
    "DataBeaseID":AuthDB,
};
$.ajax({
    url: businessServerUrl + '/HistoryQuery/SearchType.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){
            var JCXMItemTmpl = $('#JCXMItemTmpl').html();
            Mustache.parse(JCXMItemTmpl);
            var JCXMrendered = Mustache.render(JCXMItemTmpl, {item : data.UserAreaCheckProject});
            $('#JCXM_FilterContent').html(JCXMrendered);
            var YQLXItemTmpl = $('#YQLXItemTmpl').html();
            Mustache.parse(YQLXItemTmpl);
            var YQLXrendered = Mustache.render(YQLXItemTmpl, {item : data.UserAreaInstrumentType});
            $('#YQLX_FilterContent').html(YQLXrendered);
            var JCBWItemTmpl = $('#JCBWItemTmpl').html();
            Mustache.parse(JCBWItemTmpl);
            var JCBWrendered = Mustache.render(JCBWItemTmpl, {item : data.UserAreaMonitoringSite});
            $('#JCBW_FilterContent').html(JCBWrendered);
            var tmpList = $('.JCXMborder');
            for(var i = 0 ; i < tmpList.length ; i++){
                if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28){
                    $(tmpList[i]).addClass("JCXMneedmargin");
                }
            }

            var tmpList = $('.YQLXborder');
            for(var i = 0 ; i < tmpList.length ; i++){
                if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28){
                    $(tmpList[i]).addClass("YQLXneedmargin");
                }
            }

            var tmpList = $('.JCBWborder');
            for(var i = 0 ; i < tmpList.length ; i++){
                if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28){
                    $(tmpList[i]).addClass("JCBWneedmargin");
                }
            }
            //注册点击事件
            registerShijian();
            window.YDUI.dialog.loading.close();
        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
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
    var searchvalue = $("#searchInput").val() != "" ? $("#searchInput").val() : "";
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":      AuthDB,
        "CurrPage":         1,
        "PageSize":         10,
        "EquipmentNameID":  yiqileixing,
        "ItemID":           jiancexiangmu,
        "PositionID":       jiancebuwei,
        "KeyWord":          searchvalue
    };
    $.ajax({
        url: businessServerUrl + '/HistoryQuery/PointList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                $('#datalist').empty();
                var datas = data.UserArea;
                var template = $('#dataListItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: datas});
                $('#datalist').html(rendered);

                count = 0;
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

    var searchvalue = $("#searchInput").val() != "" ? $("#searchInput").val() : "";

    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":      AuthDB,
        "CurrPage":         count,
        "PageSize":         10,
        "EquipmentNameID":  yiqileixing,
        "ItemID":           jiancexiangmu,
        "PositionID":       jiancebuwei,
        "KeyWord":          searchvalue
    };
    $.ajax({
        url: businessServerUrl + '/HistoryQuery/PointList.ashx',
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
mui("#datalist").on("tap","li",function(e){
    var id = $(this).attr("id");
    var name1 = $(this).find("div.listTitle").text();
    var name2 = $(this).find("span.listinfovalue1").text();
    var name3 = $(this).find("span.listinfovalue2").text();
    var name4 = $(this).find("span.listinfovalue3").text();
    var totalInfo = name1 + "/" + name2 + "/" + name3 + "/" + name4;
    totalInfo = encodeURIComponent(totalInfo);
    totalInfo = encodeURIComponent(totalInfo);
    window.location.href = "./historygrid.html?rowguid=" + id + "&totalInfo=" + totalInfo + "&AuthDB=" + AuthDB;
});

function addIntoStr(whichStr , str){
    if(whichStr == "1")
        jiancexiangmu = jiancexiangmu + str + ";";
    if(whichStr == "2")
        yiqileixing = yiqileixing + str + ";"
    if(whichStr == "3")
        jiancebuwei = jiancebuwei + str + ";"
}
function removeFromStr(whichStr , str){
    var reg = new RegExp(str + ";" , "g");
    if(whichStr == "1")
        jiancexiangmu = jiancexiangmu.replace(reg , "");
    if(whichStr == "2")
        yiqileixing = yiqileixing.replace(reg , "");
    if(whichStr == "3")
        jiancebuwei = jiancebuwei.replace(reg , "");
}
function removeAllStr(whichStr){
    if(whichStr == "1")
        jiancexiangmu = "";
    if(whichStr == "2")
        yiqileixing = "";
    if(whichStr == "3")
        jiancebuwei = "";
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

    $(".YQLXborder").click(function(){

        if($(this).hasClass("YQLXall")){//点全部按钮

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
            $(".YQLXall").find("div.container").addClass("nochooseborder");
            $(".YQLXall").find("div.chooseTxt").addClass("nochooseColor");
            $(".YQLXall").find("div.inner-triangle").addClass("nochoose");
            $(".YQLXall").find("div.outer-triangle").addClass("nochoose");

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
}

document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
window.YDUI.dialog.loading.open('加载中…');

var businessServerUrl = Window.Config.ServerUrl;

var startDate = "";
var endDate = "";
var jiancexiangmu = "";
var zhuangtaishaixuan = "";
var guanjianzi = "";
var nowUseStartDate = "";
var nowUseEndDate = "";
var nowUseJiancexiangmu = "";
var nowUseZhuangtaishaixuan = "";
var nowUseGuanjianzi = "";
var noweditwhich = "";

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
//获取url带的参数console.log(urlParam["asd"]);
var openId = urlParam["openId"];
var whichbtn = '';
var OriginalDataID = "";
var ID = "";
var TableName = "";
var userguid = urlParam["userguid"];
var AuthDB = urlParam["AuthDB"];

$("#searchIcon").click(function(){
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});

//最顶端过滤器
var whichFilterUse = '0';
$('#f1').click(function(){
    if(whichFilterUse == '1'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideDown("fast");
        $('#SJXZ_Filter').slideUp("fast");
        $('#ZTSX_Filter').slideUp("fast");
        whichFilterUse = '1';
    }
});
$('#f2').click(function(){
    if(whichFilterUse == '2'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideUp("fast");
        $('#SJXZ_Filter').slideDown("fast");
        $('#ZTSX_Filter').slideUp("fast");
        whichFilterUse = '2';
    }
});
$('#f3').click(function(){
    if(whichFilterUse == '3'){
        hideFilter();
    } else {
        $('#AllMask').show();
        $('#JCXM_Filter').slideUp("fast");
        $('#SJXZ_Filter').slideUp("fast");
        $('#ZTSX_Filter').slideDown("fast");
        whichFilterUse = '3';
    }
});

$('.cancleBtn').click(function(){
    hideFilter();
});
function hideFilter(){
    $('#AllMask').hide();
    $('#JCXM_Filter').slideUp("fast");
    $('#SJXZ_Filter').slideUp("fast");
    $('#ZTSX_Filter').slideUp("fast");
    whichFilterUse = '0';
}



$("#JCXMConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});
$("#SJXZConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
});
$("#ZTSXConfirm").click(function(){
    hideFilter();
    mui('#pullrefresh').pullRefresh().pulldownLoading();
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
        "DataBeaseID":AuthDB,
        "CurrPage":1,
        "PageSize":10,
        "ItemID":jiancexiangmu,
        "KeyWord": searchvalue,
        "Status":zhuangtaishaixuan,
        "StartDate": startDate,
        "EndDate": endDate
    };
    $.ajax({
        url: businessServerUrl + '/YiChang/YiChangList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                $('#datalist').empty();
                var datas = data.UserArea;
                //控制丝带显隐
                for(var index = 0 ; index < datas.length ; index++){
                    if(datas[index].Status == ""){
                        datas[index].bgc = "#F17C7C";
                        datas[index].yichuli = "";
                        datas[index].yihulue = "";
                    } else if(datas[index].Status == "已忽略"){
                        datas[index].bgc = "#ddd";
                        datas[index].yichuli = "";
                        datas[index].yihulue = "1";
                    } else if(datas[index].Status == "已处理"){
                        datas[index].bgc = "#ddd";
                        datas[index].yichuli = "1";
                        datas[index].yihulue = "";
                    }
                }

                var template = $('#dataListItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, { item: datas });
                $('#datalist').append(rendered);
                count = 0;
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
            } else {
                //mui.toast("刷新失败，接口报错");
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            //mui.toast('接口请求失败');
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}
//上拉加载
function pullupRefresh() {

    var searchvalue = $("#searchInput").val() != "" ? $("#searchInput").val() : "";

    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID": AuthDB,
        "CurrPage": count,
        "PageSize": 10,
        "ItemID": jiancexiangmu,
        "KeyWord": searchvalue,
        "Status": zhuangtaishaixuan,
        "StartDate": startDate,
        "EndDate": endDate
    };
    $.ajax({
        url: businessServerUrl + '/YiChang/YiChangList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                ++count;
                if(data.UserArea.length > 0){
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); 

                    //控制丝带显隐
                    var datas = data.UserArea;
                    for(var index = 0 ; index < datas.length ; index++){
                        if(datas[index].Status == ""){
                            datas[index].bgc = "#F17C7C";
                            datas[index].yichuli = "";
                            datas[index].yihulue = "";
                        } else if(datas[index].Status == "已忽略"){
                            datas[index].bgc = "#ddd";
                            datas[index].yichuli = "";
                            datas[index].yihulue = "1";
                        } else if(datas[index].Status == "已处理"){
                            datas[index].bgc = "#ddd";
                            datas[index].yichuli = "1";
                            datas[index].yihulue = "";
                        }
                    }
                    var template = $('#dataListItemTmpl').html();
                    Mustache.parse(template);
                    var rendered = Mustache.render(template, { item: datas });
                    $('#datalist').append(rendered);
                } else {
                    //参数为true代表没有更多数据了。
                    mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); 
                }
            } else {
                //mui.toast("刷新失败，接口报错！");
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            //mui.toast('接口请求失败');
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}



mui("#datalist").on("tap","div.leftitem",function(e){
    var id = $(this).attr("rowguid");
    var pointdes = $(this).attr("pointdes")
    pointdes = encodeURIComponent(pointdes);
    
    window.location.href = "./historygrid.html?rowguid=" + id + "&totalInfo=" + pointdes + "&AuthDB=" + AuthDB;
});




mui("#datalist").on("tap","div.rightBorder",function(e){
    var stat = $(this).find("span.sidai").text().trim();
    OriginalDataID = $(this).attr("OriginalDataID");
    ID = $(this).attr("ID");
    TableName = $(this).attr("TableName");

    if(stat == "已处理"){
        //mui.toast("该检查已处理！");
        window.YDUI.dialog.toast('该检查已处理！', 'error', 1000);
    } else if(stat == "已忽略"){
        //mui.toast("该检查已忽略！");
        window.YDUI.dialog.toast('该检查已忽略！', 'error', 1000);
    } else {
        $("#tanchuan").fadeIn();
        $("#AllMask").fadeIn();
    }

});



$("#no_yc_btn").click(function(){
    whichbtn = "忽略";
    $("#tanchuan").fadeOut();
    $("#AllMask").fadeIn();
    $("#tanchuan2").fadeIn();
});

$("#have_yc_btn").click(function(){
    whichbtn = "已处理";
    $("#tanchuan").fadeOut();
    $("#AllMask").fadeIn();
    $("#tanchuan2").fadeIn();
    changestate();
});

$("#have_tc_yctx_btn").click(function(){
    changestate();
});

$("#no_tc_yctx_btn").click(function(){
    $("#tanchuan").fadeOut();
    $("#AllMask").fadeOut();
    $("#tanchuan2").fadeOut();
});

$('#AllMask').click(function(){
    hideFilter();
    $("#tanchuan").fadeOut();
    $("#AllMask").fadeOut();
    $("#tanchuan2").fadeOut();
});

$("#closeIcon").click(function(){
    hideFilter();
    $("#tanchuan").fadeOut();
    $("#AllMask").fadeOut();
    $("#tanchuan2").fadeOut();
});

function changestate(){
    var requestData = {
        "DataBeaseID":AuthDB,
        "ID":ID,
        "orginalID":OriginalDataID,
        "TableName":TableName,
        "Status":whichbtn,
        "Remark":$("#reasonn").val(),
        "username":userguid
    };
    $.ajax({
        url: businessServerUrl + '/YiChang/YiChangDeal.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
    
                window.YDUI.dialog.toast('操作成功', 'success', 1000);
                $("#tanchuan").fadeOut();
                $("#AllMask").fadeOut();
                $("#tanchuan2").fadeOut();

                mui('#pullrefresh').pullRefresh().pulldownLoading();
    
            } else {
                //mui.toast("刷新失败，接口报错.");
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            //mui.toast('接口请求失败');
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}




//ajax请求筛选条件
var requestData = {
    "DataBeaseID":AuthDB,
};
$.ajax({
    url:  businessServerUrl + '/YiChang/SearchYiChangType.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){

            var JCXMItemTmpl = $('#JCBWItemTmpl').html();
            Mustache.parse(JCXMItemTmpl);
            var JCXMrendered = Mustache.render(JCXMItemTmpl, {item : data.UserAreaCheckProject});
            $('#JCXM_FilterContent').html(JCXMrendered);

            var JCBWItemTmpl = $('#ZTSXItemTmpl').html();
            Mustache.parse(JCBWItemTmpl);
            var JCBWrendered = Mustache.render(JCBWItemTmpl, {item : data.UserAreaStatus});
            $('#ZTSX_FilterContent').html(JCBWrendered);

            var tmpList = $('.JCXMborder');
            for(var i = 0 ; i < tmpList.length ; i++){
                if(i==1 || i==4 || i==7 || i==10 || i==13 || i==16 || i==19 || i==22 || i==25 || i==28)
                    $(tmpList[i]).addClass("JCXMneedmargin");
            }

            //注册点击事件
            registerShijian();

            window.YDUI.dialog.loading.close();
            
        } else {
            mui.toast("刷新失败，接口报错.");
        }
    },
    error: function() {
        mui.toast('接口请求失败');
    }
});

function addIntoStr(whichStr , str){
    if(whichStr == "1")
        jiancexiangmu = jiancexiangmu + str + ";";
    if(whichStr == "2")
        zhuangtaishaixuan = zhuangtaishaixuan + str + ";"
}
function removeFromStr(whichStr , str){
    var reg = new RegExp(str + ";" , "g");
    if(whichStr == "1")
        jiancexiangmu = jiancexiangmu.replace(reg , "");
    if(whichStr == "2")
        zhuangtaishaixuan = zhuangtaishaixuan.replace(reg , "");
}
function removeAllStr(whichStr){
    if(whichStr == "1")
        jiancexiangmu = "";
    if(whichStr == "2")
        zhuangtaishaixuan = "";
}
function registerShijian(){
    $(".JCXMborder").click(function(){

        if($(this).hasClass("JCBWall")){
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
            removeAllStr("1");

        } else {    //点击不是全部按钮的按钮

            //全部按钮干掉选中
            $(".JCBWall").find("div.container").addClass("nochooseborder");
            $(".JCBWall").find("div.chooseTxt").addClass("nochooseColor");
            $(".JCBWall").find("div.inner-triangle").addClass("nochoose");
            $(".JCBWall").find("div.outer-triangle").addClass("nochoose");

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
    $(".ZTSXborder").click(function(){

        if($(this).hasClass("ZTSXall")){//点全部按钮

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
            $(".ZTSXall").find("div.container").addClass("nochooseborder");
            $(".ZTSXall").find("div.chooseTxt").addClass("nochooseColor");
            $(".ZTSXall").find("div.inner-triangle").addClass("nochoose");
            $(".ZTSXall").find("div.outer-triangle").addClass("nochoose");

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
}

$("#choosefromtime").click(function(){
    var _self = this;
    var options = {
        "value": getPreMonth(getNowFormatDate()) + " 00:00"
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        startDate = rs.text;
        $("#chooseTime1").text(startDate);
        _self.picker.dispose();
        _self.picker = null;
    });
});
$("#choosetotime").click(function(){
    var _self = this;
    var options = {
        "value": getNowFormatDate() + " 00:00"
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        endDate = rs.text;
        $("#chooseTime2").text(endDate);
        _self.picker.dispose();
        _self.picker = null;
    });
});
$("#chooseTime1").text(getPreMonth(getNowFormatDate()) + " 00:00");
$("#chooseTime2").text(getNowFormatDate() + " 00:00");
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
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
var rowguid = urlParam["rowguid"];
var AuthDB = urlParam["AuthDB"];
var ZhuanDongLevel = "";
var HuangDongLevel = "";

$("#backicon").click(function(){
    window.history.go(-1);
});

var swiper = new Swiper('.swiper-container');
var state1Width = $('#state1').width();
var state1Height = $('#state1').height();
var FJCenterX = state1Width/2;
var FJCenterY = state1Height * 0.32;

PhotoSingleFanDetail();
function PhotoSingleFanDetail(){
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":  AuthDB,
        "ID":           rowguid
    };
    $.ajax({
        url: businessServerUrl + '/SingleFan/PhotoSingleFanDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                ZhuanDongLevel = data.ReturnInfo[0].ZhuanDongLevel;
                HuangDongLevel = data.ReturnInfo[0].HuangDongLevel;

                var tmplist = data.FengJiData;
                for(var index = 0 ; index < tmplist.length ; index++){
                    var asd = "<li><span class=\"state1_see_key\">"+ tmplist[index].Name +"：</span><span class=\"state1_see_value\">"+tmplist[index].Type+"</span></li>";
                    $("#ullist").append(asd);
                }

                var tmpDataList = data.DataList;
                for(var index = 0 ; index < tmpDataList.length ; index++){
                    var otherCenterXY = tmpDataList[index].ORIGONLOC;
                    var otherCenterX = otherCenterXY.split(";")[0];
                    var otherCenterY = otherCenterXY.split(";")[1];

                    var otherPointXY = tmpDataList[index].LOC1;
                    var otherPointX = otherPointXY.split(";")[0];
                    var otherPointY = otherPointXY.split(";")[1];

                    var otherPointRealX = otherCenterX - otherPointX;
                    var otherPointRealY = otherCenterY - otherPointY;

                    var positionX = otherPointRealX * FJCenterX / otherCenterX - 80;
                    var positionY = otherPointRealY * FJCenterY / otherCenterY;
                    var tmpdom = "<div class='pointInfo' style='top:" + positionY + "px;right:" + positionX + "px'><div class='point'></div><div class='pointTxt'><div>"+tmpDataList[index].MONITORName+"</div><div>"+tmpDataList[index].result+"</div></div></div>";
                    $("#state1").append(tmpdom);
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


SingleFanDetail();
function SingleFanDetail(){
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":AuthDB,
        "key":"10da4d439eb846e788cc78f33024098c",
        "ID":rowguid
    };
    $.ajax({
        url: businessServerUrl + '/SingleFan/SingleFanDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                var value1 = data.FanData[0].stationname;
                var value2 = data.FanData[0].lon;
                var value3 = data.FanData[0].lat;
                var value4 = data.FanData[0].Status;
                var value5 = data.WeatherData[0].tmp;
                var value6 = data.WeatherData[0].cond_txt;
                var value7 = data.WeatherData[0].wind_drec;
                var value8 = data.WeatherData[0].wind_spd;
                $("#value1").text(value1);
                $("#value2").text(value2);
                $("#value3").text(value3);
                $("#value4").text(value4);
                $("#value5").text(value8);
                $("#value6").text(value7);
                $("#value7").text(value5);
                $("#value8").text(value6);
                var datas = data.DataList;
                var template = $('#monitItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, { item: datas });
                $('#datalist').append(rendered);
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}   

var chooseShow = false;
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
    $("#animatefy").css("animation","");
    $("#animatezhuzi").css("animation","");
    $("#animatebluebo").css("animation","");
    $("#animatewhitebo").css("animation","");
    if($(this).text() == "静止"){
        $(".pointInfo").show();
        $("#chooseShowItemsBorder").slideUp("fast");
        $(".downuptxt").text("静止");
    } else if($(this).text() == "转动"){
        $(".pointInfo").hide();
        setTimeout(function(){
            $("#animatefy").css("animation","rotation 4s linear infinite");
            $("#animatezhuzi").css("animation","");
            $("#animatebluebo").css("animation","moveX 2s linear infinite");
            $("#animatewhitebo").css("animation","moveXX 2s linear infinite");
    
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("转动");
        } , 1);
    } else if($(this).text() == "晃动"){
        $(".pointInfo").hide();
        setTimeout(function(){
            $("#animatefy").css("animation","fy_huangdong_stop 4s linear infinite");
            $("#animatezhuzi").css("animation","huangdong 4s linear infinite");
            $("#animatebluebo").css("animation","moveX 2s linear infinite");
            $("#animatewhitebo").css("animation","moveXX 2s linear infinite");
    
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("晃动");
        } , 1);
    } else if($(this).text() == "转动晃动"){
        $(".pointInfo").hide();
        setTimeout(function(){
            $("#animatefy").css("animation","fy_huangdong_rotate 4s linear infinite");
            $("#animatezhuzi").css("animation","huangdong 4s linear infinite");
            $("#animatebluebo").css("animation","moveX 2s linear infinite");
            $("#animatewhitebo").css("animation","moveXX 2s linear infinite");
    
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("转动晃动");
        } , 1);
    }
    $("#chooseShowTxt").css("color","#585858");
    $("#chooseShowTxt>.downIcon").show();
    $("#chooseShowTxt>.upIcon").hide();
    chooseShow = false;
});

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
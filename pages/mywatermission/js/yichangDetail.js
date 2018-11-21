window.YDUI.dialog.loading.open('加载中…');

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
var userguid = urlParam["userguid"];
var openId = urlParam["openId"];
var missionguid = urlParam["missionguid"];
var checkIntemGuid = urlParam["checkIntemGuid"];
var AuthDB = urlParam["AuthDB"];
var text1 = "";
var text2 = "";

//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID":AuthDB,
    "RowGuid": rowguid
};
$.ajax({
    url: businessServerUrl + '/WaterDutyDeal/NoNormalReportDetail.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){

            if(data.ReportArea[0]){
                var rwms = data.ReportArea[0].ItemText + "<br>" + data.ReportArea[0].FullText;
                var ycms = data.ReportArea[0].NoNomarlRemark;
                var yhms = data.ReportArea[0].HTroubleRemark;
                var dcjy = data.ReportArea[0].advise;
    
                text1 = data.ReportArea[0].ItemText;
                text2 = data.ReportArea[0].FullText;
    
                $("#RWMS").html(rwms);
                $("#YCMS").text(ycms);
                $("#YHMS").text(yhms);
                $("#DCJY").text(dcjy);
            }

            for(var index = 0 ; index < data.PhotoArea.length ; index++){
                $("#attachList").append("<div class=\"SCTPBorder\"><img src=\""+data.PhotoArea[index].PhotoUrl+"\"></div>");
            }

            window.YDUI.dialog.loading.close();

        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});








var chooseShow = false;
$("#chooseShowTxt").click(function(){
    if(chooseShow){
        chooseShow = false;
        $("#chooseShowTxt>.downIcon").show();
        $("#chooseShowTxt>.upIcon").hide();
        $("#chooseShowTxt").css("color","#585858");
        $("#chooseShowItemsBorder").hide();

    } else {
        chooseShow = true;
        $("#chooseShowTxt>.downIcon").hide();
        $("#chooseShowTxt>.upIcon").show();
        $("#chooseShowTxt").css("color","#517FF3");
        $("#chooseShowItemsBorder").show();
    }
});

$(".chooseShowItem").click(function(){
    $(this).addClass("chooseShowItemActive").siblings(".chooseShowItem").removeClass("chooseShowItemActive");
    if($(this).text() == "异常处理"){
        $("#gridBorder").removeClass("hid");
        $("#mapBorder").addClass("hid");
        $("#chooseShowItemsBorder").hide();
        $(".downuptxt").text("异常处理");
    } else {
        $("#gridBorder").addClass("hid");
        $("#mapBorder").removeClass("hid");
        $("#chooseShowItemsBorder").hide();
        $(".downuptxt").text("异常更新");
    }
    $("#chooseShowTxt").css("color","#585858");
    $("#chooseShowTxt>.downIcon").show();
    $("#chooseShowTxt>.upIcon").hide();
    chooseShow = false;
});


$("#yichangbtn1").click(function(){
    window.location.href = "./processHistory.html?ReportID=" + rowguid + 
    "&fromhistory=1" + 
    "&AuthDB=" + AuthDB + 
    "&userguid=" + userguid + 
    "&openId=" + openId;
});

$("#yichangbtn2").click(function(){
    window.location.href = "./yichangshangbao.html?userguid=" + userguid + 
    "&openId=" + openId + 
    "&checkIntemGuid=" + checkIntemGuid + 
    "&fullpath=" + text2 + 
    "&notfullpath=" + text1 + 
    "&missionguid=" + missionguid + 
    "&rowguid=" + rowguid + 
    "&AuthDB=" + AuthDB
    ;
});






$("#backicon").click(function(){
    window.history.go(-1);
});

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
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
var username = urlParam["username"];
var userguid = urlParam["userguid"];
var missionguid = urlParam["missionguid"];
var rowguid = urlParam["rowguid"];
var fjid = urlParam["fjid"];
var PhotoID = urlParam["PhotoID"];

var AuthDB = urlParam["AuthDB"];

//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID":AuthDB,
    "WinpowerCheckID":rowguid,
    "AttachGuid":PhotoID,
    "UserGuid":userguid,
    "WinpowerDutyID":missionguid
};
$.ajax({
    url: businessServerUrl + '/WinPowerDuty/WinPowerCheckDetail.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){
            var datas = data.UserArea;
            allStationInfo = datas;

            var tmpInfo = null;

            for(var index = 0 ; index < allStationInfo.length ; index++){
                if(allStationInfo[index].StationInfo.ID == fjid){
                    tmpInfo = allStationInfo[index].AllData;
                    $(".checkPlaceValue").text(allStationInfo[index].StationInfo.Stationname);
                    break;
                }
            }

            for(var index = 0 ; index < tmpInfo.length ; index++){
                var tmptmp = tmpInfo[index].Data;
                for(var flag = 0 ; flag < tmptmp.length ; flag++){
                    if(tmptmp[flag].ChoseStatus == "异常")
                        tmpInfo[index].Data[flag].colorstate = "fjErr";
                    if(tmptmp[flag].ChoseStatus == "正常")
                        tmpInfo[index].Data[flag].colorstate = "fjSuc";
                }
            }



            var normalErrItemTmpl = $('#normalErrItemTmpl').html();
            Mustache.parse(normalErrItemTmpl);
            var JCXMrendered = Mustache.render(normalErrItemTmpl, {item : tmpInfo});
            $('#stationInfos').empty();
            $('#stationInfos').html(JCXMrendered);

            var ycms = "";
            var bzsm = "";
            var clzt = "";
            ycms = data.MainData.NonormalRemark ? data.MainData.NonormalRemark : "";
            bzsm = data.MainData.Remark ? data.MainData.Remark : "";
            clzt = data.MainData.Status ? data.MainData.Status : "异常上报";
            $("#YCMS").text(ycms);
            $("#BZSM").text(bzsm);
            $("#showState").text(clzt);

            $("#ImgBorder").empty();
            for(var index = 0 ; index < data.PhotoData.length ; index++){
                $("#ImgBorder").append("<div class=\"SCTPBorder\"><img src=\""+data.PhotoData[index].PhotoUrl+"\"></div>");
            }
        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});


$("#backicon").click(function(){
    window.history.go(-1);
});


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
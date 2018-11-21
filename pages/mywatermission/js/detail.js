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
var ReportID = urlParam["ReportID"];

var AuthDB = urlParam["AuthDB"];

//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID":  AuthDB,
    "RowGuid":      rowguid
};
$.ajax({
    url: businessServerUrl + '/WaterDutyDeal/ReportDealDetail.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){
            var datas = data.ReportDealArea[0];
            var clfa = datas.DealScheme;
            var clhxg = datas.Effect;
            var clzt = datas.Status;

            $("#CLFA").html(clfa);
            $("#CLHXG").html(clhxg);
            $("#processState").html(clzt);

            for(var i = 0 ; i < data.PhotoArea.length ; i++){
                $("#imageLists").append("<div class=\"SCTPBorder\"><img src=\""+data.PhotoArea[i].PhotoUrl+"\"></div>");
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
})

$(".editState").click(function(){
    window.location.href = "./yichangchuli.html?froEdit=" + rowguid + 
    "&openId=" + openId + 
    "&userguid=" + userguid + 
    "&ReportID=" + ReportID + 
    "&AuthDB=" + AuthDB
    ;
});

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
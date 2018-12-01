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
var userguid = urlParam["userguid"];
var AuthDB = urlParam["AuthDB"];

var process = urlParam["process"];
var taskname = urlParam["taskname"];
var adduserguid = urlParam["adduserguid"];
var addusername = urlParam["addusername"];
addusername = decodeURIComponent(addusername);
var xjsj = urlParam["xjsj"];

var missionguid = urlParam["missionguid"];

var finalChooseUserguids = "";
var finalChooseUsernames = "";
var adduserguidArray = [];
var choosePeopleTotalCount = 0;


if(adduserguid != "" && adduserguid != undefined && adduserguid != "undefined"){

    if(adduserguid.indexOf(";") > 0){
        var choosePeopleTotalCount = adduserguid.split(";").length - 1;
        adduserguidArray = adduserguid.split(";");
        $("#peoplecount").text(choosePeopleTotalCount);
        finalChooseUserguids = adduserguid;
    } else {
        var choosePeopleTotalCount = adduserguid.split(";").length;
        adduserguidArray = adduserguid.split(";");
        $("#peoplecount").text(choosePeopleTotalCount);
        finalChooseUserguids = adduserguid + ";";
    }
}

if(addusername != "" && addusername != undefined && addusername != "undefined"){
    if(addusername.indexOf(";") > 0){
        finalChooseUsernames = addusername;
    } else {
        finalChooseUsernames = addusername + ";";
    }
}

//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID":AuthDB,
    "UseDataBese":"daminfo_test"
};
$.ajax({
    url: businessServerUrl + '/WaterDuty/UserNameList.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    contentType: 'application/x-www-form-urlencoded',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){
            var datas = data.UserArea;
            for(var index = 0 ; index < datas.length ; index++){
                if(adduserguid != ""){
                    var finds = false;
                    for(var i = 0 ; i < adduserguidArray.length ; i++){
                        if(datas[index].UserGuid == adduserguidArray[i]){
                            datas[index].checked = "checked";
                            finds = true;
                            break;
                        }
                    }
                    if(finds)
                        continue;
                    else
                        datas[index].checked = "";
                }
            }
            var template = $('#dataListItemTmpl').html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {item: datas});
            $('#datalist').append(rendered);
        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});

mui('#datalist').on('change', 'input', function() {
    var value = this.checked ? true : false ;
    var userguid = $(this).attr("userguid");
    var username = $(this).attr("username");
    if(value){
        ++choosePeopleTotalCount;
        finalChooseUserguids = finalChooseUserguids + userguid + ";";
        finalChooseUsernames = finalChooseUsernames + username + ";";
    } else {
        --choosePeopleTotalCount;

        var reg = new RegExp(userguid + ";" , "g");
        finalChooseUserguids = finalChooseUserguids.replace(reg , "");

        var reg1 = new RegExp(username + ";" , "g");
        finalChooseUsernames = finalChooseUsernames.replace(reg1 , "");
    }
    $("#peoplecount").text(choosePeopleTotalCount);
});


$(".editState").click(function(){
    if(process == "add"){
        window.location.href = "./addMission.html?" + 
        "openId=" + openId + 
        "&userguid=" + userguid + 
        "&taskname=" + taskname + 
        "&xjsj=" + xjsj + 
        "&adduserguid=" + finalChooseUserguids + 
        "&username=" + finalChooseUsernames + 
        "&AuthDB=" + AuthDB
        ;
    }
    if(process == "update"){
        window.location.href = "./editMission.html?" + 
        "openId=" + openId + 
        "&userguid=" + userguid + 
        "&taskname=" + taskname + 
        "&xjsj=" + xjsj + 
        "&adduserguid=" + finalChooseUserguids + 
        "&username=" + finalChooseUsernames + 
        "&AuthDB=" + AuthDB + 
        "&missionguid=" + missionguid
        ;
    }
});
$("#iconback").click(function(){
    window.history.go(-1);
});
var showVConsole = Window.Config.showVConsole;
if(showVConsole)
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
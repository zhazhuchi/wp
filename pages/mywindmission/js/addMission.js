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
var AuthDB = urlParam["AuthDB"];
var isadd = urlParam["isadd"];
username = decodeURIComponent(username);

var taskname = urlParam["taskname"];
var xjsj = urlParam["xjsj"];
xjsj = decodeURIComponent(xjsj);
var adduserguid = urlParam["adduserguid"];
taskname = decodeURIComponent(taskname);

if(taskname != "" && taskname != undefined && taskname != "undefined"){
    $("#taskname").val(taskname);
}

if(xjsj != "" && xjsj != undefined && xjsj != "undefined"){
    $("#chooseXJDate").text(xjsj);
} else {
    var nowdate = getNowFormatDate();
    $("#chooseXJDate").text(nowdate);
}

if(username != "" && username != undefined && username != "undefined"){
    $("#xjry").text(username);
} else {
    $("#xjry").text("请选择巡检人员");
}


var InitLon = "";
var InitLat = "";
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
                InitLon = data.UserArea[0].InitLon;
                InitLat = data.UserArea[0].InitLat;

                aauserguid = data.UserArea[0].UserGuid;
                aausername = data.UserArea[0].Alias;
                if(isadd != "" && isadd != undefined && isadd != "undefined"){
                    $("#xjry").text(aausername + ";");
                    adduserguid = aauserguid + ";"
                }

            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}


function ComplexCustomOverlay(point , guid , whichIcon) {
    this._point = point;
    this._guid = guid;
    this._whihIcon = whichIcon;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.height = "40px";
    div.style.width = "40px";
    div.id = this._guid;
    var arrow = this._arrow = document.createElement("img");

    if(this._whihIcon == "0"){
        arrow.src = "./img/greenfj.png";
    } else if(this._whihIcon == "1"){
        arrow.src = "./img/yellowfj.png";
    } else if(this._whihIcon == "2"){
        arrow.src = "./img/redfj.png";
    } else {
        arrow.src = "./img/greenfj.png";
    }

    arrow.style.width = "40px";
    arrow.style.height = "40px";
    arrow.style.top = "0px";
    arrow.style.left = "0px";
    div.appendChild(arrow);

    div.addEventListener("touchstart", function () {
        //showTcWindow(this._guid);
    });

    mp.getPanes().labelPane.appendChild(div);
    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
}


$("#confirmSubmitCheck").click(function(){

    if($("#taskname").val() == ""){
        window.YDUI.dialog.toast('请先填写任务名称', 'error', 1000);
        return;
    }

    var uuuuid = uuid();
    var requestData = {
        "DataBeaseID":AuthDB,
        "InspectorID":adduserguid,
        "taskname":$("#taskname").val(),
        "InspectionTime":$("#chooseXJDate").text(),
        "Status":"待办",
        "WinpowerDutyID":uuuuid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/AddDuty.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                setTimeout(function(){
                    window.location.href = "./addCheck.html?missionguid=" + uuuuid + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&username=" + username + 
                    "&AuthDB=" + AuthDB
                    ;
                } , 900)
                
            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'none', 1000);
        }
    });
});

$("#chooseXJDateBorder").click(function(){
    var _self = this;
    var options = {
        "value": getNowFormatDate() + "00:00"
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        $("#chooseXJDate").text(rs.text);
        _self.picker.dispose();
        _self.picker = null;
    });
});

var el = document.getElementById('allGrid');
var sortable = Sortable.create(el,{
    animation: 150,
    handle: ".moveicon",
});






//点击完成按钮调用提交ajax
$("#finishEdit").click(function(){

    if($("#taskname").val() == ""){
        mui.toast("请先填写任务名称");
        return;
    }
    window.YDUI.dialog.confirm('', '确认提交？', function () {
        confirmSubmit();
    });
});
function confirmSubmit(){
    var uuuuid = uuid();
    var requestData = {
        "DataBeaseID":AuthDB,
        "InspectorID":userguid,
        "taskname":$("#taskname").val(),
        "InspectionTime":$("#chooseXJDate").text(),
        "Status":"待办",
        "WinpowerDutyID":uuuuid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/AddDuty.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('新增成功', 'success', 1000);

                setTimeout(function(){
                    window.location.href = "./editMission.html?missionguid=" + uuuuid + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&username=" + username + 
                    "&AuthDB=" + AuthDB;
                } , 900)
                
            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}







// 百度地图API功能
var mp = new BMap.Map("map_border",{mapType:BMAP_HYBRID_MAP});//创建地图实例
var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});

mp.addControl(top_left_control); 

mp.centerAndZoom(new BMap.Point(InitLon, InitLat), 6);
////地图初始化，设置中心点坐标和地图级别。地图必须经过初始化才可以执行其他操作
mp.enableScrollWheelZoom();





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
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}






function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++)
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}



$("#backicon").click(function(){
    window.history.go(-1);
})

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}

$("#addpeople").click(function(){
    var asd = $("#xjry").text();
    if(asd == "请选择巡检人员"){
        asd = "";
    }
    window.location.href = "./choosePeople.html?" + 
        "openId=" + openId + 
        "&userguid=" + userguid + 
        "&taskname=" + $("#taskname").val() + 
        "&xjsj=" + $("#chooseXJDate").text() + 
        "&adduserguid=" + adduserguid + 
        "&addusername=" + asd + 
        "&AuthDB=" + AuthDB + 
        "&process=add"
        ;
});
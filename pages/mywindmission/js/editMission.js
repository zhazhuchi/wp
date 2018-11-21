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

var openId = urlParam["openId"];
var userguid = urlParam["userguid"];
var missionguid = urlParam["missionguid"];

var AuthDB = urlParam["AuthDB"];


var pretime = "";
var posttime = "";

var mapBorder = null;
var standp = [];
var userp = [];

var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});


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

    // div.addEventListener("touchstart", function () {
    //     //showTcWindow(this._guid);
    // });

    mapBorder.getPanes().labelPane.appendChild(div);
    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
    this._div.style.top = pixel.y - 30 + "px";
}

$("#confirmSubmit").click(function(){
    window.location.href = "./addCheck.html?missionguid=" + missionguid + 
    "&userguid=" + userguid + 
    "&openId=" + openId + 
    "&AuthDB=" + AuthDB
    ;
});

$("#chtimeb").click(function(){
    var _self = this;
    var options = {
        "value": getNowFormatDate()
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        $("#chooseXJDate").text(rs.text);
        posttime = rs.text;
        _self.picker.dispose();
        _self.picker = null;
    });
});

var el = document.getElementById('allGrid');
var sortable = Sortable.create(el,{
    animation: 150,
    handle: ".moveicon",
    constraint: "vertical",
    onUpdate: function (evt){ //拖拽更新节点位置发生该事件
        adjustOrderNum();
    }
});

function adjustOrderNum(){
    var tmp = $(".needOrder");
    var ids = "";
    for(var index = 0 ; index < tmp.length ; index++)
        ids = ids + $(tmp[index]).attr("id") + ";";

    var requestData = {
        "DataBeaseID":AuthDB,
        "IDList":ids,
        "WinpowerDutyID":missionguid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/UpdateOrderNum.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('排序成功', 'success', 1000);
            } else {
                window.YDUI.dialog.toast('删除失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}








getDetail();
function getDetail(){
    var requestData = {
        "DataBeaseID":AuthDB,
        "WinpowerDutyID":missionguid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/WinPowerDutyCheckDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                
                var datas = data.ReturnInfo.list;

                var rwmc = data.DutyArea[0].taskname;
                var xjry = data.DutyArea[0].DisplayName;
                var xjsj = data.DutyArea[0].InspectionTime;

                pretime = data.DutyArea[0].InspectionTime;
                posttime = data.DutyArea[0].InspectionTime;
    
                if(xjry == "")
                    xjry = "暂无巡检人员";
    
                $("#taskname").val(rwmc);
                $("#xjry").text(xjry);
                $("#chooseXJDate").text(xjsj);
    
                var tmpDutyList = data.AreaCheckList;

                if(tmpDutyList.length > 0){
                    for(var index = 0 ; index < tmpDutyList.length ; index++){
                        if(tmpDutyList[index].lon == "" && tmpDutyList[index].lat == ""){
                            tmpDutyList[index].showpaixu = "1";
                            tmpDutyList[index].hidepaixu = "";
                        } else {
                            tmpDutyList[index].showpaixu = "";
                            tmpDutyList[index].hidepaixu = "1";
                        }
                    }

                    var DutyItemTmpl = $('#dataListItemTmpl').html();
                    Mustache.parse(DutyItemTmpl);
                    var JCXMrendered = Mustache.render(DutyItemTmpl, {item : tmpDutyList});
                    $('#allGrid').append(JCXMrendered);
                }

                var initlon = "";
                var initlat = "";

                initlon = data.ReturnInfo[0].InitLon;
                initlat = data.ReturnInfo[0].InitLat;

                var tmpgcj = coordtransform.wgs84togcj02(initlon , initlat);
                var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);

                initlon = tmpbd[0];
                initlat = tmpbd[1];

                // 初始化展示作用的百度地图
                // 百度地图API功能     用来展示的
                mapBorder = new BMap.Map("map_border",{mapType:BMAP_HYBRID_MAP});//创建地图实例
                mapBorder.addControl(top_left_control);   
                mapBorder.centerAndZoom(new BMap.Point(initlon, initlat), 6);
                ////地图初始化，设置中心点坐标和地图级别。地图必须经过初始化才可以执行其他操作
                mapBorder.enableScrollWheelZoom();

                standp = data.AreaFenJiList;
                userp = data.AreaCheckList;

                drawStandLuxian();
                //drawUserLuxian();

                window.YDUI.dialog.loading.close();

            } else {
                window.YDUI.dialog.toast('删除失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });

}









$("#allGrid").on("tap" , "div.listItem" , function(ev){
    var rowguid = $(this).attr("rowguid");
    var fjid = $(this).attr("fjid");
    var PhotoID = $(this).attr("PhotoID");
    window.location.href = "./fengjiDetail.html?rowguid=" + rowguid + 
    "&missionguid=" + missionguid + 
    "&userguid=" + userguid + 
    "&openId=" + openId + 
    "&fjid=" + fjid + 
    "&AuthDB=" + AuthDB + 
    "&PhotoID=" + PhotoID
    ;
})

$("#allGrid").on("tap" , "span.edit" , function(ev){
    var rowguid = $(this).attr("rowguid");
    var fjid = $(this).attr("fjid");
    var PhotoID = $(this).attr("PhotoID");
    window.location.href = "./editCheck.html?rowguid=" + rowguid + 
    "&missionguid=" + missionguid + 
    "&userguid=" + userguid + 
    "&openId=" + openId + 
    "&fjid=" + fjid + 
    "&AuthDB=" + AuthDB + 
    "&PhotoID=" + PhotoID
    ;
})
$("#allGrid").on("tap" , "span.del" , function(ev){
    var rowguid = $(this).attr("rowguid");
    var tmpdom = $(this).parents("li");
    window.YDUI.dialog.confirm('', '确认删除？', function () {
        confirmdelete(rowguid , tmpdom);
    });
})

function confirmdelete(rowguid , tmpdom){
    var requestData = {
        "DataBeaseID":AuthDB,
        "UserGuid":userguid,
        "WinpowerCheckID":rowguid,
        "AttachGuid":"",
        "WinpowerDutyID":missionguid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/DeleteWinPowerCheck.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                tmpdom.remove();
                window.YDUI.dialog.toast('删除成功', 'success', 1000);
            } else {
                window.YDUI.dialog.toast('删除失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}






//点击完成按钮调用提交ajax
$("#finishEdit").click(function(){
    window.YDUI.dialog.confirm('', '确认提交更新？', function () {
        confirmSubmit();
    });
});
function confirmSubmit(){
    var requestData = {
        "DataBeaseID":AuthDB,
        "InspectorID":userguid,
        "taskname":$("#taskname").val(),
        "OldInspectionTime":pretime,
        "NewInspectionTime":posttime,
        "Status":"待办",
        "WinpowerDutyID":missionguid
    };
    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/EditDuty.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('更新成功', 'success', 1000);

                setTimeout(function(){
                    window.location.href = "./missionDetail.html?rowguid=" + missionguid + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&AuthDB=" + AuthDB;
                } , 900);

            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}








function drawStandLuxian(){
    var drawLine = [];
    for(var index = 0 ; index < standp.length ; index++){
        var lon = standp[index].lon;
        var lat = standp[index].lat;

        var tmpgcj = coordtransform.wgs84togcj02(lon , lat);
        var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);
        lon = tmpbd[0];
        lat = tmpbd[1];

        var rowguid = standp[index].id;
        var state = "";

        if(standp[index].Color == "#FFC1C1"){
            state = "2";
        } else {
            state = "0";
        }

        var tmpPoint = new BMap.Point(lon, lat);

        var myMachine = new ComplexCustomOverlay(tmpPoint , rowguid , state);
        //将标注添加到地图中
        mapBorder.addOverlay(myMachine);

        drawLine.push(tmpPoint);
    }
    
    //画轨迹线
    var curve = new BMapLib.CurveLine(drawLine, {strokeColor:"blue", strokeWeight:4, strokeOpacity:0.9}); //创建
    mapBorder.addOverlay(curve);

}


function drawUserLuxian(){
    var drawLineuser = [];
    for(var index = 0 ; index < userp.length ; index++){
        var lon = userp[index].lon;
        var lat = userp[index].lat;

        var tmpgcj = coordtransform.wgs84togcj02(lon , lat);
        var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);
        
        lon = tmpbd[0];
        lat = tmpbd[1];

        var rowguid = userp[index].RowGuid;
        var state = "";

        if(userp[index].Color == "#FFC1C1"){
            state = "1";
        } else {
            state = "1";
        }

        var tmpPoint = new BMap.Point(lon, lat);
        var myMachine = new ComplexCustomOverlay(tmpPoint , rowguid , state);
        //将标注添加到地图中
        mapBorder.addOverlay(myMachine);
        drawLineuser.push(tmpPoint);

    }

    //画轨迹线
    var curve = new BMapLib.CurveLine(drawLineuser, {strokeColor:"white", strokeWeight:4, strokeOpacity:0.9, strokeStyle:"dashed"}); //创建
    mapBorder.addOverlay(curve);
}

var showtwo = false;
$("#map_contoller").click(function () {
    var tmpdom = $(this).find("div.chooseInnerB");
    if (showtwo) {
        tmpdom.removeClass("choosedInner");
        showtwo = false;
        hideUserLine();
    } else {
        tmpdom.addClass("choosedInner");
        showtwo = true;
        showUserLine();
    }
});


function hideUserLine(){
    //先将地图上的所有控件全部删除
    mapBorder.clearOverlays();
    drawStandLuxian();
}

function showUserLine(){
    //先将地图上的所有控件全部删除
    mapBorder.clearOverlays();
    drawStandLuxian();
    drawUserLuxian();
}








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
    var currentdate = date.getYear() + seperator1 + month + seperator1 + strDate
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




$("#xjryOuterBorder").click(function(){
    window.YDUI.dialog.toast('巡检人员不允许修改', 'error', 1000);
});



$("#backicon").click(function(){
    window.history.go(-1);
})


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
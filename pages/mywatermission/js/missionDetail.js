window.YDUI.dialog.loading.open('加载中…');

//获取URl上的参数
var businessServerUrl = Window.Config.ServerUrl;
var jssdkUrl = Window.Config.JssdkUrl;
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
var userguid = urlParam["userguid"];
var openId = urlParam["openId"];
var missionguid = urlParam["missionguid"];
var AuthDB = urlParam["AuthDB"];
var whichMissionItemGuid = "";
var statedutyRowGuid = "";
var oldstate = "";
var changestate = "";
var fullpath = "";
var notfullpath = "";
var mapBorder = null;
var standp = [];
var userp = [];

var whichBtn = "";
var jssdklat = "";
var jssdklon = "";

var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});

// 百度地图API功能     用来定位的
var mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});//创建地图实例
mp.disableDragging(); 



confirmLocation("0");
function confirmLocation(needshow){
    //调用jssdk
    var jssdkdata = {
        pageUrl: window.location.href
    }
    $.ajax({
        type: 'POST',
        url: jssdkUrl,
        data: jssdkdata,
        dataType: 'json',
        success: function(data){
            if(data.code == "1"){

                var ticket = data.ticket;
                var signature = data.signature;
                var appId = data.appId;
                var nonceStr = data.nonceStr;
                var timestamp = data.timestamp;

                wx.config({
                    debug:      false,
                    appId:      appId, 
                    timestamp:  timestamp,
                    nonceStr:   nonceStr,
                    signature:  signature,
                    jsApiList:  ['getLocation']
                });
                
                wx.ready(function(){
                    wx.getLocation({
                        type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            jssdklat = res.latitude;
                            jssdklon = res.longitude; 
                            if(needshow == "1"){
                                $("#tc_map").show();
                                $(".allmask").show();
                                var gcj02tobd09 = coordtransform.gcj02tobd09(jssdklon, jssdklat);
                                mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});
                                var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
                                mp.centerAndZoom(point,14);
                                mp.panTo(point);
                            }
                            window.YDUI.dialog.loading.close();
                        },
                        fail: function(){
                            window.YDUI.dialog.loading.close();
                            window.YDUI.dialog.toast('微信定位失败', 'error', 1000);
                            jssdkerrortoBaiduLocation(needshow);
                        }
                    });
                });

                wx.error(function(res){
                    window.YDUI.dialog.loading.close();
                    window.YDUI.dialog.toast('jssdk签名认证失败', 'error', 1000);
                    jssdkerrortoBaiduLocation(needshow);
                });

            } else {
                window.YDUI.dialog.loading.close();
                //window.YDUI.dialog.toast('jssdk接口报错', 'error', 1000);
                jssdkerrortoBaiduLocation(needshow);
            }
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            //window.YDUI.dialog.toast('jssdk接口报错！', 'error', 1000);
            jssdkerrortoBaiduLocation(needshow);
        }
    });
}
function jssdkerrortoBaiduLocation(needshow){
    window.YDUI.dialog.loading.open('正在切换浏览器定位');
                            
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){

            //alert('您的位置：'+r.point.lng+','+r.point.lat);
            var baidugcjtmp = coordtransform.bd09togcj02(r.point.lng , r.point.lat);
            jssdklon = baidugcjtmp[0];
            jssdklat = baidugcjtmp[1];

            if(needshow == "1"){
                $("#tc_map").show();
                $(".allmask").show();
                mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});
                var point = new BMap.Point(r.point.lng , r.point.lat);
                mp.centerAndZoom(point,14);
                mp.panTo(point);
            }
            window.YDUI.dialog.loading.close();
            
        } else {
            //alert('failed'+this.getStatus());
            window.YDUI.dialog.loading.close(); 
            window.YDUI.dialog.toast('定位失败', 'error', 1000);
        } 
    },{enableHighAccuracy: true})
}








// 百度地图API功能     用来展示的
function ComplexCustomOverlay(point , guid , whichIcon , color , pointname) {
    this._point = point;
    this._guid = guid;
    this._whihIcon = whichIcon;
    this._color = color;
    this._pointname = pointname;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;
    var div = this._div = document.createElement("div");
    div.style.position = "absolute";
    div.style.backgroundColor = this._color;
    div.style.borderRadius = "50%";
    div.style.zIndex = "99999999999999999999999";
    div.style.height = "15px";
    div.style.width = "16px";
    div.id = this._guid;
    var divtxt = document.createElement("div");
    divtxt.style.position = "absolute";
    divtxt.style.width = "200px";
    divtxt.style.fontSize = "14px"
    divtxt.style.fontWeight = "bolb";
    divtxt.style.color = "yellow";
    divtxt.style.top = "4px";
    divtxt.style.left = "15px";
    var pText = document.createTextNode(this._pointname);
    divtxt.appendChild(pText);
    
    div.appendChild(divtxt);

    mapBorder.getPanes().labelPane.appendChild(div);
    return div;
}
ComplexCustomOverlay.prototype.draw = function () {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x -8 + "px";
    this._div.style.top = pixel.y - 8 + "px";
}

//请求整个页面上的数据
var requestData = {
    "DataBeaseID":AuthDB,
    "WaterDutyID": missionguid
};
$.ajax({
    url: businessServerUrl + '/WaterDutyDeal/WaterDutyTaskDetail.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    success: function(data) {
        console.log(JSON.stringify(data));
        if(data.ReturnInfo[0].Code == '1'){
            var datas = data.AreaSignList;

            $('#AllInfoValue1').text(data.DutyArea[0].taskname);
            $('#AllInfoValue2').text(data.DutyArea[0].InspectionTime);
            $('#AllInfoValue3').text(data.DutyArea[0].DisplayName);
            $('#AllInfoValue4').text(data.DutyArea[0].Status);

            $('#shixiangList').empty();
            var template = $('#dataListItemTmpl').html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, {item: datas});
            $('#shixiangList').html(rendered);

            $(".mui-table-cell").css("width",$(window).width());

            var initlon = data.ReturnInfo[0].InitLon;
            var initlat = data.ReturnInfo[0].InitLat;

            initlon = initlon ? initlon : data.AreaTaskList[0].lon;
            initlat = initlat ? initlat : data.AreaTaskList[0].lat;

            var tmpgcj = coordtransform.wgs84togcj02(initlon , initlat);
            var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);

            // 初始化展示作用的百度地图
            // 百度地图API功能     用来展示的
            mapBorder = new BMap.Map("mapBorder",{mapType:BMAP_HYBRID_MAP});//创建地图实例
            var point = new BMap.Point(tmpbd[0], tmpbd[1]);
            mapBorder.centerAndZoom(point , 13);
            mapBorder.panTo(point);
            mapBorder.addControl(top_left_control);   

            standp = data.AreaTaskList;
            userp = data.AreaSignList;

            drawStandLuxian();
            window.YDUI.dialog.loading.close();
        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});


//点击某一个事项 弹签到窗口
$("#shixiangList").on("click" , "div.mui-slider-handle" , function(){

    fullpath = $(this).find("span.shixiangLujingTxt").text().trim() + $(this).find("span.shixiangLujingValue").text().trim();
    notfullpath = $(this).find("div.shixiangName").text().trim();

    var ReportID = $(this).attr("ReportID");
    whichMissionItemGuid = $(this).attr("rowguid");

    if($(this).attr("statecolor") == "#C1FFC1" || $(this).attr("statecolor") == "#228B22"){
        window.YDUI.dialog.toast('该事项为正常状态，请勿重复操作', 'error', 1000);
        return;
    }

    var issign = $(this).attr("issign");

    if(issign == "1"){
        //已签到
        if(ReportID == ""){
            window.YDUI.dialog.toast('您已签到但未上报异常', 'error', 1000);

            setTimeout(function(){
                window.location.href = "./yichangshangbao.html?missionguid=" + missionguid + 
                "&userguid=" + userguid + 
                "&openId=" + openId + 
                "&checkIntemGuid=" + whichMissionItemGuid + 
                "&fullpath=" + fullpath + 
                "&notfullpath=" + notfullpath + 
                "&rowguid=add" + 
                "&AuthDB=" + AuthDB
                ;
            } , 900);

            return;

        } else {
            window.YDUI.dialog.toast('您已签到', 'error', 1000);

            setTimeout(function(){
                window.location.href = "./yichangDetail.html?missionguid=" + missionguid + 
                "&userguid=" + userguid + 
                "&openId=" + openId + 
                "&checkIntemGuid=" + whichMissionItemGuid + 
                "&rowguid=" + ReportID + 
                "&AuthDB=" + AuthDB;
            } , 1200);
            return;
        }
        
    }
    whichBtn = "0";
    if(jssdklon == "" || jssdklat == ""){
        window.YDUI.dialog.loading.open('定位中…');
        confirmLocation("1");
    } else {

        $("#tc_map").show();
        $(".allmask").show();

        var gcj02tobd09 = coordtransform.gcj02tobd09(jssdklon, jssdklat);

        mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});
        var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
        mp.centerAndZoom(point,14);
        mp.panTo(point);
        mp.disableDragging(); 

        
    }
});

$("#shixiangList").on("click" , ".zcbtn" , function(){

    whichMissionItemGuid = $(this).attr("rowguid");
    if($(this).attr("statecolor") == "#C1FFC1" || $(this).attr("statecolor") == "#228B22"){
        window.YDUI.dialog.toast('该事项为正常状态，请勿重复操作', 'success', 1000);
        return;
    }
    if($(this).attr("lon") != "" && $(this).attr("lat") != ""){
        AddORUpdateSignStatus("status" , "正常");
    } else {
        whichBtn = "1";
        if(jssdklon == "" || jssdklat == ""){
            window.YDUI.dialog.loading.open('定位中…');
            confirmLocation("1");
        } else {

            $("#tc_map").show();
            $(".allmask").show();

            var gcj02tobd09 = coordtransform.gcj02tobd09(jssdklon, jssdklat);

            mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});
            var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
            mp.centerAndZoom(point,14);
            mp.panTo(point);
            mp.disableDragging(); 

        }
    }
})

$("#shixiangList").on("click" , ".ycsbbtn" , function(){

    fullpath = $(this).parents("li.shixiangListItem").find("span.shixiangLujingTxt").text().trim() + $(this).parents("li.shixiangListItem").find("span.shixiangLujingValue").text().trim();
    notfullpath = $(this).parents("li.shixiangListItem").find("div.shixiangName").text().trim();

    whichMissionItemGuid = $(this).attr("rowguid");

    var ReportID = $(this).parents("li.shixiangListItem").attr("ReportID");
    var missionItemGuid = $(this).attr("rowguid");

    if(ReportID == ""){
        var issign = $(this).attr("issign");

        if(issign == "1"){
            AddORUpdateSignStatus("status" , "异常");
        } else {
            whichBtn = "2";
            if(jssdklon == "" || jssdklat == ""){
                window.YDUI.dialog.loading.open('定位中…');
                confirmLocation("1");
            } else {
                $("#tc_map").show();
                $(".allmask").show();
                var gcj02tobd09 = coordtransform.gcj02tobd09(jssdklon, jssdklat);
                mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});
                var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
                mp.centerAndZoom(point,14);
                mp.panTo(point);
                mp.disableDragging(); 
            }
        }
        return;
    } else {
        window.YDUI.dialog.confirm('', '异常上报已完成，进入异常上报详情页面', function () {
            window.location.href = "./yichangDetail.html?missionguid=" + missionguid + 
            "&userguid=" + userguid + 
            "&openId=" + openId + 
            "&checkIntemGuid=" + missionItemGuid + 
            "&rowguid=" + ReportID + 
            "&AuthDB=" + AuthDB
            ;
        })
    }
});
$("#shixiangList").on("click" , ".ycclbtn" , function(){

    if($(this).attr("statecolor") == "#C1FFC1" || $(this).attr("statecolor") == "#228B22"){
        window.YDUI.dialog.toast('该事项为正常状态，无法异常处理', 'success', 1000);
        return;
    }

    var ReportID = $(this).parents("li.shixiangListItem").attr("ReportID");

    if(ReportID == ""){
        window.YDUI.dialog.toast('该事项还未异常上报，请先进行异常上报', 'success', 1000);
    } else {
        window.location.href = "./processHistory.html?" + 
        "ReportID=" + ReportID + 
        "&fromhistory=1" + 
        "&userguid=" + userguid + 
        "&openId=" + openId + 
        "&AuthDB=" + AuthDB;
    }
});


//点击地图上的两个按钮 一个确认   一个取消
$("#have_map_btn").click(function(){
    if(whichBtn == "0"){
        $("#tc_map").fadeOut("fast");
        $("#tc_ycsb").fadeIn("fast");
        $(".allmask").show();

        AddORUpdateSignStatus("sign" , "");
    } else if (whichBtn == "1"){
        $("#tc_map").fadeOut("fast");
        $("#tc_ycsb").fadeOut("fast");
        $(".allmask").hide();

        AddORUpdateSignStatus("status" , "正常");
        window.location.reload();
    } else if (whichBtn == "2"){
        $("#tc_map").fadeOut("fast");
        $("#tc_ycsb").fadeOut("fast");
        $(".allmask").hide();

        AddORUpdateSignStatus("status" , "正常");
        window.location.href = "./yichangshangbao.html?missionguid=" + missionguid + 
        "&userguid=" + userguid + 
        "&openId=" + openId + 
        "&checkIntemGuid=" + whichMissionItemGuid + 
        "&fullpath=" + fullpath + 
        "&notfullpath=" + notfullpath + 
        "&rowguid=add" + 
        "&AuthDB=" + AuthDB
        ;
    }
    
});
$("#no_map_btn").click(function(){
    $("#tc_map").fadeOut("fast");
    $("#tc_ycsb").fadeOut("fast");
    $(".allmask").hide();
});
//点击异常上报下面的两个按钮
$("#have_yc_btn").click(function(){
    $("#tc_map").fadeOut("fast");
    $("#tc_ycsb").fadeOut("fast");
    $(".allmask").hide();
    AddORUpdateSignStatus("status" , "异常");
});
$("#no_yc_btn").click(function(){
    $("#tc_map").fadeOut("fast");
    $("#tc_ycsb").fadeOut("fast");
    $(".allmask").hide();
    AddORUpdateSignStatus("status" , "正常");
    window.location.reload();
});
$(".allmask").click(function(){
    $("#tc_map").fadeOut("fast");
    $("#tc_ycsb").fadeOut("fast");
    $("#tc_yctx").fadeOut("fast");
    $(".allmask").hide();
});
function AddORUpdateSignStatus(type , st){

    var lon = "";
    var lat = "";
    if(type == "sign"){
        var tmpwgs = coordtransform.gcj02towgs84(jssdklon , jssdklat);
        lon = tmpwgs[0];
        lat = tmpwgs[1];
    }

    var requestData = {
        "DataBeaseID": AuthDB,
        "Type": type,
        "lon": lon,
        "lat": lat,
        "Status": st,
        "ChoseTaskID": whichMissionItemGuid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/AddORUpdateSignStatus.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                if(type == "sign")
                    window.YDUI.dialog.toast('签到成功', 'success', 1000);
                if(type == "status" && st == "异常"){
                    window.YDUI.dialog.toast('上报成功,填写详细异常信息', 'success', 1000);
                    setTimeout(function(){
                        window.location.href = "./yichangshangbao.html?missionguid=" + missionguid + 
                        "&userguid=" + userguid + 
                        "&openId=" + openId + 
                        "&checkIntemGuid=" + whichMissionItemGuid + 
                        "&fullpath=" + fullpath + 
                        "&notfullpath=" + notfullpath + 
                        "&rowguid=add" + 
                        "&AuthDB=" + AuthDB
                        ;
                    } , 900);
                }

                if(type == "status" && st == "正常"){
                    window.YDUI.dialog.toast('上报成功', 'success', 1000);
                    window.location.reload();
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













//右上角修改状态的时候先获取一下详情
$("#xiugaizhuangtai").click(function(){
    $("#tc_yctx").fadeIn("fast");
    $(".allmask").show();

    //先调详情接口获取详情
    var requestData = {
        "DataBeaseID": AuthDB,
        "WaterDutyID": missionguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/InitWaterStatus.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                $("#tc_yctx").find("div.container").addClass("nochooseborder");
                $("#tc_yctx").find("div.chooseTxt").addClass("nochooseColor");
                $("#tc_yctx").find("div.inner-triangle").addClass("nochoose");
                $("#tc_yctx").find("div.outer-triangle").addClass("nochoose");

                if(data.Data[0]){
                    if(data.Data[0].NewSatus == "异常"){
                        $("#tc_yctx1").find("div.container").removeClass("nochooseborder");
                        $("#tc_yctx1").find("div.chooseTxt").removeClass("nochooseColor");
                        $("#tc_yctx1").find("div.inner-triangle").removeClass("nochoose");
                        $("#tc_yctx1").find("div.outer-triangle").removeClass("nochoose");
                    }

                    if(data.Data[0].NewSatus == "待办"){
                        $("#tc_yctx2").find("div.container").removeClass("nochooseborder");
                        $("#tc_yctx2").find("div.chooseTxt").removeClass("nochooseColor");
                        $("#tc_yctx2").find("div.inner-triangle").removeClass("nochoose");
                        $("#tc_yctx2").find("div.outer-triangle").removeClass("nochoose");
                    }

                    if(data.Data[0].NewSatus == "已完成"){
                        $("#tc_yctx3").find("div.container").removeClass("nochooseborder");
                        $("#tc_yctx3").find("div.chooseTxt").removeClass("nochooseColor");
                        $("#tc_yctx3").find("div.inner-triangle").removeClass("nochoose");
                        $("#tc_yctx3").find("div.outer-triangle").removeClass("nochoose");
                    }
                    $("#yc_reason").find("textarea").val(decodeURIComponent(data.Data[0].Remark));
                    statedutyRowGuid = data.Data[0].RowGuid;
                    oldstate = data.Data[0].NewSatus;
                }
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
});
function changeListState(){
    //ajax任务状态初始化
    var requestData = {
        "DataBeaseID":      AuthDB,
        "OldStatus":        oldstate,
        "WaterDutyID":      missionguid,
        "NewStatus":        changestate,
        "Remark":           $("#ycnr").val(),
        "ChangeUserGuid":   userguid,
        "RowGuid":          statedutyRowGuid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/ChangeWaterStatus.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            if(data.ReturnInfo[0].Code == '1'){

                window.YDUI.dialog.toast('修改成功', 'success', 1000);
                $("#tc_yctx").hide();
                $(".allmask").hide();
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}
$("#have_tc_yctx_btn").click(function(){
    changeListState();
});
$("#no_tc_yctx_btn").click(function(){
    $("#tc_yctx").fadeOut("fast");
    $(".allmask").hide();
});






$(".everystateb").click(function(){
    if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
        $(this).siblings().find("div.container").addClass("nochooseborder");
        $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
        $(this).siblings().find("div.inner-triangle").addClass("nochoose");
        $(this).siblings().find("div.outer-triangle").addClass("nochoose");

        $(this).find("div.container").removeClass("nochooseborder");
        $(this).find("div.chooseTxt").removeClass("nochooseColor");
        $(this).find("div.inner-triangle").removeClass("nochoose");
        $(this).find("div.outer-triangle").removeClass("nochoose");

        changestate = $(this).find("div.chooseTxt").text();
    }
});




function drawStandLuxian(){
    var drawLine = [];
    for(var index = 0 ; index < standp.length ; index++){
        var lon = standp[index].lon;
        var lat = standp[index].lat;

        var tmpgcj02 = coordtransform.wgs84togcj02(lon , lat);
        var tmpbd09 = coordtransform.gcj02tobd09(tmpgcj02[0] , tmpgcj02[1]);

        var rowguid = standp[index].id;
        var color = standp[index].Color;
        var state = "";
        var pointName = standp[index].name;

        if(standp[index].Color == "#FFC1C1"){
            state = "2";
        } else {
            state = "0";
        }

        var tmpPoint = new BMap.Point(tmpbd09[0], tmpbd09[1]);
        var myMachine = new ComplexCustomOverlay(tmpPoint , rowguid , state , color , pointName);
        //将标注添加到地图中
        mapBorder.addOverlay(myMachine);
        drawLine.push(tmpPoint);
    }

    //画轨迹线
    var curve = new BMapLib.CurveLine(drawLine, {strokeColor:"blue", strokeWeight:4, strokeOpacity:0.9}); //创建
    mapBorder.addOverlay(curve);
}


function drawUserLuxian(){
    var drawLine = [];
    for(var index = 0 ; index < userp.length ; index++){
        var lon = userp[index].lon;
        var lat = userp[index].lat;

        var tmpgcj02 = coordtransform.wgs84togcj02(lon , lat);
        var tmpbd09 = coordtransform.gcj02tobd09(tmpgcj02[0] , tmpgcj02[1]);

        var rowguid = userp[index].RowGuid;
        var color = userp[index].Color;
        var state = "";

        var pointName = userp[index].name;

        if(userp[index].Color == "#FFC1C1"){
            state = "2";
        } else {
            state = "0";
        }

        var tmpPoint = new BMap.Point(tmpbd09[0], tmpbd09[1]);
        var myMachine = new ComplexCustomOverlay(tmpPoint , rowguid , state , color , pointName);
        //将标注添加到地图中
        mapBorder.addOverlay(myMachine);
        drawLine.push(tmpPoint);
    }

    //画轨迹线
    var curve = new BMapLib.CurveLine(drawLine, {strokeColor:"white", strokeWeight:4, strokeOpacity:0.9, strokeStyle:"dashed"}); //创建
    mapBorder.addOverlay(curve);
}



$("#backicon").click(function(){
    window.history.go(-1);
})


var showtwo = false;
$("#changexunjianshitu").click(function () {
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



document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
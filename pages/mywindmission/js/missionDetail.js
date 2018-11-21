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

var AuthDB = urlParam["AuthDB"];


var mapBorder = null;
var standp = [];
var userp = [];

var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});



// 百度地图API功能
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


$(".editStateTxt").click(function(){
    window.location.href = "./editMission.html?missionguid=" + rowguid + 
    "&userguid=" + userguid + 
    "&openId=" + openId + 
    "&AuthDB=" + AuthDB;
});



//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID": AuthDB,
    "WinpowerDutyID": rowguid
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

            if(xjry == ""){
                xjry = "暂无巡检人员";
            }

            $("#RWMC").text(rwmc);
            $("#XJRY").text(xjry);
            $("#XJSJ").text(xjsj);



            var tmpDutyList = data.AreaCheckList;

            var DutyItemTmpl = $('#DutyItemTmpl').html();
            Mustache.parse(DutyItemTmpl);
            var JCXMrendered = Mustache.render(DutyItemTmpl, {item : tmpDutyList});
            $('#allGrid').empty();
            $('#allGrid').html(JCXMrendered);


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
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});















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




$("#backicon").click(function(){
    window.history.go(-1);
})


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
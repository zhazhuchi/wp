window.YDUI.dialog.loading.open('加载中…');

var allTCInfo = [];
var initlon = "";
var initlat = "";
var detailidid = "";
var mp = null;
var WINDName = "";

//获取URl上的参数
var businessServerUrl = Window.Config.ServerUrl;
var urlParam = [];
var urlpname, urlpvalue;
var urlpstr = window.location.href;
var urlpnum = urlpstr.indexOf("?")
urlpstr = urlpstr.substr(urlpnum + 1);
var urlparr = urlpstr.split("&");
for (var i = 0; i < urlparr.length; i++) {
    urlpnum = urlparr[i].indexOf("=");
    if (urlpnum > 0) {
        urlpname = urlparr[i].substring(0, urlpnum);
        urlpvalue = urlparr[i].substr(urlpnum + 1);
        urlParam[urlpname] = urlpvalue;
    }
}
//获取url带的参数
var openId = urlParam["openId"];
var AuthDB = urlParam["AuthDB"];

getUserInfo();
//判断用户是否绑定  如果没有绑定的话  跳转绑定页面
function getUserInfo(){
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
                WINDName = data.UserArea[0].WIND;
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

function ComplexCustomOverlay(point, guid, whichIcon , idid , runorstop , machineName) {
    this._point = point;
    this._guid = guid;
    this._whihIcon = whichIcon;
    this._idid = idid;
    this._runorstop = runorstop;
    this._machineName = machineName;
}
ComplexCustomOverlay.prototype = new BMap.Overlay();
ComplexCustomOverlay.prototype.initialize = function (map) {
    this._map = map;

    if(this._machineName == "风机"){
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.height = "40px";
        div.style.width = "40px";
        div.id = this._guid;
        $(div).attr("rowguid",this._idid);
        var arrow = this._arrow = document.createElement("img");
        if (this._whihIcon == "0")
            arrow.src = "./img/greenfan.png";
        else if (this._whihIcon == "1")
            arrow.src = "./img/yellowfan.png";
        else if (this._whihIcon == "2")
            arrow.src = "./img/redfan.png";
        else
            arrow.src = "./img/greenfan.png";
        arrow.style.width = "32px";
        arrow.style.height = "32px";
        arrow.style.position = "absolute";
        arrow.style.top = "0px";
        arrow.style.left = "15px";
        if(this._runorstop == "0")
            $(arrow).addClass("rotate_animate_normal");
        else
            $(arrow).removeClass("rotate_animate_normal");
        div.appendChild(arrow);
        var bottom = this._bottom = document.createElement("img");
        if (this._whihIcon == "0") {
            bottom.src = "./img/greenbottom.png";
        } else if (this._whihIcon == "1") {
            bottom.src = "./img/yellowbottom.png";
        } else if (this._whihIcon == "2") {
            bottom.src = "./img/redbottom.png";
        } else {
            bottom.src = "./img/greenbottom.png";
        }
        bottom.style.height = "15px";
        bottom.style.position = "absolute";
        bottom.style.top = "19px";
        bottom.style.left = "28px";
        div.appendChild(bottom);
    } else {
        var div = this._div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.height = "40px";
        div.style.width = "40px";
        div.id = this._guid;
        $(div).attr("rowguid",this._idid);
        var arrow = this._arrow = document.createElement("img");
        if (this._whihIcon == "0")
            arrow.src = "./img/"+this._machineName+".png";
        else if (this._whihIcon == "1")
            arrow.src = "./img/"+this._machineName+".png";
        else if (this._whihIcon == "2")
            arrow.src = "./img/"+this._machineName+".png";
        else
            arrow.src = "./img/"+this._machineName+".png";
        div.appendChild(arrow);
    }


    div.addEventListener("touchstart", function () {
        showTcWindow($(this).attr("id") , $(this).attr("rowguid"));
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

//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID": AuthDB,
    "key": "10da4d439eb846e788cc78f33024098c"
};
$.ajax({
    url: businessServerUrl + '/ElectronMap/AccentWeather.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    async: false,
    success: function (data) {
        console.log(JSON.stringify(data));
        if (data.State == '1') {
            var datas = data.UserArea[0];
            var icon = datas.icon;
            var cond_txt = datas.cond_txt;
            var tmp = datas.tmp;
            var tmp_max = datas.tmp_max;
            var tmp_min = datas.tmp_min;
            var wind_drec = datas.wind_drec;
            var wind_spd = datas.wind_spd;
            var DesCount = datas.DesCount;
            var InitLon = datas.InitLon;
            var InitLat = datas.InitLat;

            $("#weathertianqiimg img").attr("src", "./img/icon/" + icon);
            $("#weathertianqitxt").text(cond_txt);
            $("#dawendutxt").text(tmp);
            $("#wendufromvalue").text(tmp_min);
            $("#wendutovalue").text(tmp_max);
            $("#fengji").text(wind_drec);
            $("#fengsu").text(wind_spd);

            DesCount = DesCount.replace(/\+/g , " ");
            DesCount = decodeURIComponent(DesCount);
            DesCount = DesCount.replace(/\,/g , "，");
            DesCount = DesCount.replace(/\;/g , "；");

            $("#asd").html(DesCount);
            initlon = InitLon;
            initlat = InitLat;

            var tmpgcj = coordtransform.wgs84togcj02(initlon , initlat);
            var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);

            initlon = tmpbd[0];
            initlat = tmpbd[1];

            // 百度地图API功能
            mp = new BMap.Map("mapBorder",{mapType:BMAP_HYBRID_MAP});//创建地图实例
            var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});
            mp.addControl(top_left_control);  
            mp.centerAndZoom(new BMap.Point(initlon, initlat), 6);
            // 地图初始化，设置中心点坐标和地图级别。地图必须经过初始化才可以执行其他操作
            mp.enableScrollWheelZoom();

        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function () {
        window.YDUI.dialog.toast('接口请求失败111！', 'error', 1000);
    }
});

function IntervalRefresh() {
    var requestData = {
        "DataBeaseID": AuthDB
    };
    $.ajax({
        url: businessServerUrl + '/ElectronMap/MapDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function (data) {
            console.log(JSON.stringify(data));
            if (data.ReturnInfo[0].Code == '1') {

                var ting = data.YunXinData.ting;
                var run = data.YunXinData.run;
                var strinfo = data.YunXinData.strinfo;
                var TypeDataList = data.TypeData;

                var template = $('#mapItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, { item: TypeDataList });
                $('#machineItemList').append(rendered);

                registerEvent();

                strinfo = strinfo.replace(/\+/g , " ");
                strinfo = decodeURIComponent(strinfo);

                strinfo = strinfo.replace(/\,/g , "，");
                strinfo = strinfo.replace(/\;/g , "；");

                var asd = Number(run) + Number(ting);
                $("#allcountValue").text(asd);

                $("#windname").text(WINDName);
                $("#allrunnum").text(run);
                $("#allrunnum2").text(ting);

                if(strinfo != ""){
                    strinfo = "；" + strinfo;
                }

                $("#allerrInfo").html(strinfo);

                var v1 = data.YunXinData.CountYDSTATUS;
                var v2 = data.YunXinData.CountCJSTATUS;
                var v3 = data.YunXinData.CountYLSTATUS;
                var v4 = data.YunXinData.CountPHSTATUS;
                var v5 = data.YunXinData.CountZDSTATUS;
                var v6 = data.YunXinData.CountWZSTATUS;
                var v7 = data.YunXinData.CountQXSTATUS;
                var v8 = data.YunXinData.CountFSSTATUS;
                var v9 = data.YunXinData.CountCSSTATUS;
                var v0 = data.YunXinData.CountQTSTATUS;

                changeColor(v1, v2, v3, v4, v5, v6, v7, v8, v9, v0);
                allTCInfo = data.MapThingData;
                addMapPoint();
                window.YDUI.dialog.loading.close();

                $("#weatherborder").show();
                $("#mapposition").show();
                $("#fengjiInfoBorder").show();
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function () {
            window.YDUI.dialog.toast('接口请求失败222！', 'error', 1000);
        }
    });
}
IntervalRefresh();


function registerEvent(){
    $(".machineListItem").click(function () {
        var tmpdom = $(this).find("div.chooseInnerB");
        if (tmpdom.hasClass("choosedInner")) {
            tmpdom.removeClass("choosedInner");
        } else {
            tmpdom.addClass("choosedInner");
        }
        addMapPoint();
    });
}

function addMapPoint() {
    //获取需要展示的东西列表
    var items = getNeedShowItemList();

    //先将地图上的所有控件全部删除
    mp.clearOverlays();
    //删除所有覆盖物之后再添加覆盖物
    for (var index = 0; index < allTCInfo.length; index++) {
        var find = false;
        for(var i = 0 ; i < items.length ; i++){
            if(items[i] == allTCInfo[index].StationInfo.type){
                find = true;
            }
        }
        if(!find){
            continue;
        }

        var lon = allTCInfo[index].StationInfo.lon;
        var lat = allTCInfo[index].StationInfo.lat;
        var idid = allTCInfo[index].StationInfo.ID;
        var rowguid = allTCInfo[index].DataDetail.stationname;
        var state = allTCInfo[index].StationInfo.num;

        var runorstop = allTCInfo[index].StationInfo.Status;

        var tmpgcj = coordtransform.wgs84togcj02(lon , lat);
        var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);

        lon = tmpbd[0];
        lat = tmpbd[1];

        var myMachine = new ComplexCustomOverlay(new BMap.Point(lon, lat), rowguid, state , idid , runorstop , allTCInfo[index].StationInfo.type);
        myMachine.windPowerCanHide = "1";
        //将标注添加到地图中
        mp.addOverlay(myMachine);
    }
}

function getNeedShowItemList(){
    var asd = $(".chooseInnerB");
    var bsd = [];
    for(var index = 0 ; index < asd.length ; index++){
        if($(asd[index]).hasClass("choosedInner")){
            bsd.push($(asd[index]).parents("li.machineListItem").find("div.machineTxt").text());
        }
    }
    return bsd;
}

function showTcWindow(guid , idid) {

    detailidid = idid;
    $("#nowStateText").empty();
    $("#mainJiance").empty();
    //从本地取数据
    if (allTCInfo.length > 0) {
        for (var index = 0; index < allTCInfo.length; index++) {
            if (allTCInfo[index].DataDetail.stationname == guid) {
                var tmp1 = allTCInfo[index].DesData;
                var tmp2 = allTCInfo[index].ImportantData;

                //给风机编号
                $("#tanchuanTitleNum").text(guid);

                if (tmp1.length > 0) {
                    for (var i = 0; i < tmp1.length; i++)
                        $("#nowStateText").append("<div class='tccontentcontent'>" + tmp1[i].Des + "</div>");
                } else {
                    $("#nowStateText").append("<div class='tccontentcontent'>暂无状态</div>");
                }

                if (tmp2.length > 0) {
                    for (var i = 0; i < tmp2.length; i++)
                        $("#mainJiance").append("<div class='tccontentcontent'>" + tmp2[i].importantDes + "</div>");
                } else {
                    $("#mainJiance").append("<div class='tccontentcontent'>暂无重点监测项目</div>");
                }
                break;
            }
        }
    } else {
        $("#nowStateText").append("<div class='tccontentcontent'>暂无状态</div>");
        $("#mainJiance").append("<div class='tccontentcontent'>暂无重点监测项目</div>");
    }
    //拿到了数据之后再展示弹窗
    $(".allmask").show();
    $("#tanchuan").fadeIn();
}

$("#lofffordetail").click(function(){
    window.location.href = "../windrunstat/singleFan.html?rowguid=" + detailidid + "&AuthDB=" + AuthDB;
});

$("#closeIcon").click(function () {
    $(".allmask").hide();
    $("#tanchuan").fadeOut();
});

$(".allmask").click(function () {
    $(".allmask").hide();
    $("#tanchuan").fadeOut();
});

//地图上的操作
$("#fullPageIcon").click(function () {
    $("#mapposition").css("height", "100%");
    $("#mapposition").css("weight", "100%");
    $("#mapBorder").css("height", "100%");
    $("#mapBorder").css("weight", "100%");

    $("#outFullPageIcon").fadeIn();
    $("#weatherborder").fadeOut();
    $("#fengjiInfoBorder").fadeOut();
    $("#fullPageIcon").fadeOut();
    $("#statesList").fadeOut();
});

$("#outFullPageIcon").click(function () {
    $("#mapposition").css("height", "300px");
    $("#mapposition").css("weight", "100%");
    $("#mapBorder").css("height", "300px");
    $("#mapBorder").css("weight", "100%");

    $("#outFullPageIcon").fadeOut();
    $("#weatherborder").fadeIn();
    $("#fengjiInfoBorder").fadeIn();
    $("#fullPageIcon").fadeIn();
    $("#statesList").fadeIn();
});

function changeColor(v1, v2, v3, v4, v5, v6, v7, v8, v9, v0) {
    if (v1 == "0")
        $("#zhishi1").css("background-color", "#6DC16D");
    else if (v1 == "1")
        $("#zhishi1").css("background-color", "#F17C7C");
    else if (v1 == "2")
        $("#zhishi1").css("background-color", "#E9B11A");
    if (v2 == "0")
        $("#zhishi2").css("background-color", "#6DC16D");
    else if (v2 == "1")
        $("#zhishi2").css("background-color", "#F17C7C");
    else if (v2 == "2")
        $("#zhishi2").css("background-color", "#E9B11A");
    if (v3 == "0")
        $("#zhishi3").css("background-color", "#6DC16D");
    else if (v3 == "1")
        $("#zhishi3").css("background-color", "#F17C7C");
    else if (v3 == "2")
        $("#zhishi3").css("background-color", "#E9B11A");
    if (v4 == "0")
        $("#zhishi4").css("background-color", "#6DC16D");
    else if (v4 == "1")
        $("#zhishi4").css("background-color", "#F17C7C");
    else if (v4 == "2")
        $("#zhishi4").css("background-color", "#E9B11A");
    if (v5 == "0")
        $("#zhishi5").css("background-color", "#6DC16D");
    else if (v5 == "1")
        $("#zhishi5").css("background-color", "#F17C7C");
    else if (v5 == "2")
        $("#zhishi5").css("background-color", "#E9B11A");
    if (v6 == "0")
        $("#zhishi6").css("background-color", "#6DC16D");
    else if (v6 == "1")
        $("#zhishi6").css("background-color", "#F17C7C");
    else if (v6 == "2")
        $("#zhishi6").css("background-color", "#E9B11A");
    if (v7 == "0")
        $("#zhishi7").css("background-color", "#6DC16D");
    else if (v7 == "1")
        $("#zhishi7").css("background-color", "#F17C7C");
    else if (v7 == "2")
        $("#zhishi7").css("background-color", "#E9B11A");
    if (v8 == "0")
        $("#zhishi8").css("background-color", "#6DC16D");
    else if (v8 == "1")
        $("#zhishi8").css("background-color", "#F17C7C");
    else if (v8 == "2")
        $("#zhishi8").css("background-color", "#E9B11A");
    if (v9 == "0")
        $("#zhishi9").css("background-color", "#6DC16D");
    else if (v9 == "1")
        $("#zhishi9").css("background-color", "#F17C7C");
    else if (v9 == "2")
        $("#zhishi9").css("background-color", "#E9B11A");
    if (v0 == "0")
        $("#zhishi0").css("background-color", "#6DC16D");
    else if (v0 == "1")
        $("#zhishi0").css("background-color", "#F17C7C");
    else if (v0 == "2")
        $("#zhishi0").css("background-color", "#E9B11A");
}

document.getElementById('mask').ontouchstart = function(e){
    e.preventDefault();
}

// var showVConsole = Window.Config.showVConsole;
// if(showVConsole){
//     document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
// }
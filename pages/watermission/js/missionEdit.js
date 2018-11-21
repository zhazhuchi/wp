//获取URl上的参数

window.YDUI.dialog.loading.open('加载中…');

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

var taskguid = urlParam["taskguid"];
var openId = urlParam["openId"];
var userguid = urlParam["userguid"];
var AuthDB = urlParam["AuthDB"];
var olddutytime = "";
var nowrowguid = "";
var nowitemcode = "";

var jssdklat = "";
var jssdklon = "";
var initlat = "";
var initlon = "";

var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});


// 百度地图API功能
var mp = new BMap.Map("tc_baidu_map");//创建地图实例

mp.addControl(top_left_control);  

confirmLocation();
function confirmLocation(){
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
                            window.YDUI.dialog.loading.close();
                            jssdklat = res.latitude;
                            jssdklon = res.longitude; 

                            if(taskguid != "")
                                getDetail();
                        },
                        fail: function(){
                            window.YDUI.dialog.loading.close();
                            window.YDUI.dialog.toast('微信定位失败', 'error', 1000);
                            jssdkerrortoBaiduLocation();
                        }
                    });
                });

                wx.error(function(res){
                    window.YDUI.dialog.loading.close();
                    window.YDUI.dialog.toast('jssdk签名认证失败', 'error', 1000);
                    jssdkerrortoBaiduLocation();
                });

                window.YDUI.dialog.loading.close();

            } else {
                window.YDUI.dialog.loading.close();
                //window.YDUI.dialog.toast('jssdk接口报错', 'error', 1000);
                jssdkerrortoBaiduLocation();
            }
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            //window.YDUI.dialog.toast('jssdk接口报错！', 'error', 1000);
            jssdkerrortoBaiduLocation();
        }
    });
}
function jssdkerrortoBaiduLocation(){
    window.YDUI.dialog.loading.open('正在切换浏览器定位');
                            
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(this.getStatus() == BMAP_STATUS_SUCCESS){

            //alert('您的位置：'+r.point.lng+','+r.point.lat);
            var baidugcjtmp = coordtransform.bd09togcj02(r.point.lng , r.point.lat);
            jssdklon = baidugcjtmp[0];
            jssdklat = baidugcjtmp[1];

            if(taskguid != "")
                getDetail();
                
            window.YDUI.dialog.loading.close();
            
        } else {
            //alert('failed'+this.getStatus());
            window.YDUI.dialog.loading.close(); 
            window.YDUI.dialog.toast('定位失败', 'error', 1000);
        } 
    },{enableHighAccuracy: true})
}







var el = document.getElementById('missionList');
var sortable = Sortable.create(el,{
    animation: 150,
    handle: ".moveIcon",
    onUpdate: function (evt){ //拖拽更新节点位置发生该事件
        adjustOrderNum();
    }
});

function adjustOrderNum(){
    var tmp = $(".missionListItem");
    var ids = "";
    for(var index = 0 ; index < tmp.length ; index++)
        ids = ids + $(tmp[index]).attr("id") + ";";

    var requestData = {
        "DataBeaseID":AuthDB,
        "IDList":ids,
        "WaterDutyID":taskguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/UpdateTaskOrderNum.ashx',
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


var translateCallback = function (data){
    if(data.status === 0) {
        console.log(data.points[0]);
        mp.centerAndZoom(new BMap.Point(data.points[0].lng, data.points[0].lat), 15);
        $("#tc_map").fadeIn();
        $(".allmask").show();
    }
}

//ajax获取详情
function getDetail(){
    var requestData = {
        "DataBeaseID":AuthDB,
        "WaterDutyID":taskguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/DutyPlanDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                var datas = data.AreaChoseTaskList;
                var rwmc = data.MainList[0].taskname;
                var xjry = data.MainList[0].displayname;
                var xjsj = data.MainList[0].InspectionTime;
                $("#rwmcTxt").val(rwmc);
                $("#xjryTxt").html(xjry);
                $("#xjsjTxt").html(xjsj);
                olddutytime = xjsj;
                for(var index = 0 ; index < datas.length ; index++){
                    if(datas[index].lat == "" || datas[index].lon == "" ){
                        datas[index].havelonlat = "";
                        datas[index].nolonlat = "1";
                    } else {
                        datas[index].havelonlat = "1";
                        datas[index].nolonlat = "";
                    }
                }

                //列表模版嵌套
                var template = $('#dataListItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: datas});

                $('#missionList').html(rendered);
                //注册事件
                $(".locationIcon").click(function(){

                    nowrowguid = $(this).attr("nowrowguid");
                    nowitemcode = $(this).attr("nowitemcode");

                    if(nowrowguid == "" && nowitemcode == ""){
                        window.YDUI.dialog.toast('该检查事项已定位', 'success', 1000);
                        return;
                    }

                    $("#tc_map").fadeIn();
                    $(".allmask").show();
                    var gcj02tobd09 = coordtransform.gcj02tobd09(jssdklon, jssdklat);

                    mp = new BMap.Map("tc_baidu_map");
                    var point = new BMap.Point(gcj02tobd09[0], gcj02tobd09[1]);
                    mp.centerAndZoom(point,12);
                    mp.panTo(point);
                });
                $("#have_map_btn").click(function(){
                    $("#tc_map").fadeOut();
                    $(".allmask").hide();
                });
                $("#no_map_btn").click(function(){
                    $("#tc_map").fadeOut();
                    $(".allmask").hide();
                });
                window.YDUI.dialog.loading.close();
            } else {
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}





//修改任务
$("#deliverCheck").click(function(){

    if($("#rwmcTxt").val() == ""){
        window.YDUI.dialog.toast('任务名称不能为空', 'error', 1000);
        return;
    }

    if($("#xjsjTxt").text() == ""){
        window.YDUI.dialog.toast('巡检时间不能为空', 'error', 1000);
        return;
    }

    var locationDom = $(".locationIcon");
    if(locationDom.length == 0){
        window.YDUI.dialog.toast('检查事项不能为空', 'error', 1000);
        return;
    }

    window.YDUI.dialog.confirm('', '确认更新巡检名称？', function () {
        confirmSubmit();
    });
});
function confirmSubmit(){
    var requestData = {
        "DataBeaseID":      AuthDB,
        "WaterDutyID":      taskguid,
        "taskname":         $("#rwmcTxt").val(),
        "dutytime":         $("#xjsjTxt").text(),
        "olddutytime":      olddutytime
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/EditDutyPlan.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('更新巡检任务成功', 'success', 1000);

                setTimeout(function(){
                    window.location.href = "./historymission.html?openId=" + openId + 
                    "&userguid=" + userguid + "&AuthDB=" + AuthDB;
                } ,900);

            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}


//左滑删除
$("#missionList").on("click","a",function(ev){
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    var id = $(target).attr("id");

    var thisdom = $(this).parents("li");

    window.YDUI.dialog.confirm('', '确认删除？', function () {
        DeleteChoseTask(id , thisdom);
    });
})
function DeleteChoseTask(id , thisdom){
    var requestData = {
        "DataBeaseID":AuthDB,
        "RowGuid": id
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/DeleteChoseTask.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('删除事项成功', 'success', 1000);
                thisdom.remove();
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}






$(".allmask").click(function(){
    $("#tc_map").fadeOut();
    $(".allmask").hide();
});
$("#iconback").click(function(){
    window.history.go(-1);
});
$("#newshixiang").click(function(){

    //动态计算已选事项
    var tmp = $(".missionListItem");
    var tmplist = [];
    for(var i = 0 ; i < tmp.length ; i++){
        var str1 = $(tmp[i]).find("a.mui-btn").attr("missionid");
        var str2 = $(tmp[i]).find("div.shixiangName").text();
        var str3 = $(tmp[i]).find("span.luj").text();
        tmplist.push(str1 + ";" + str2 + ";" + str3); 
    }
    var tmpstr = "";
    for(var i = 0 ; i < tmplist.length ; i++){
        tmpstr = tmpstr + encodeURIComponent(tmplist[i]) + "@";
    }

    window.location.href = "./chooseMission.html?"+
    "openId=" + openId + 
    "&userguid=" + userguid + 
    "&process=update" + 
    "&taskguid=" + taskguid + 
    "&shixiangList=" + tmpstr + 
    "&AuthDB=" + AuthDB
    ;
});


function baiduLocation(){

    var baiduLocationPoint = new BMap.Point();
    baiduLocationPoint = mp.getCenter();

    var tmpgcj02 = coordtransform.bd09togcj02(baiduLocationPoint.lng , baiduLocationPoint.lat);
    var tmpwgs = coordtransform.gcj02towgs84(tmpgcj02[0] , tmpgcj02[1]);

    var lon = tmpwgs[0];
    var lat = tmpwgs[1];

    var requestData = {
        "DataBeaseID":  AuthDB,
        "Lon":          lon,
        "Lat":          lat,
        "rowguid":      nowrowguid,
        "ItemCode":     nowitemcode
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/UpdateTaskLonLat.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast("定位成功", 'success', 1000);
                $("#tc_map").fadeOut();
                $(".allmask").hide();
                setTimeout(function(){
                    window.location.reload();
                } , 600);
            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败', 'error', 1000);
        }
    });
}
$("#have_map_btn").click(function(){
    baiduLocation();
});
$("#no_map_btn").click(function(){
    $("#tc_map").fadeOut();
    $(".allmask").hide();
});

$("#SJXZ").click(function(){
    var _self = this;
    var options = {};
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        bgts_n_time = rs.text;
        $("#xjsjTxt").text(rs.text);
        _self.picker.dispose();
        _self.picker = null;
    });
});

document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

// var showVConsole = Window.Config.showVConsole;
// if(showVConsole){
//     document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
// }
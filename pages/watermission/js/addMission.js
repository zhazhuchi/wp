//获取URl上的参数
var businessServerUrl = Window.Config.ServerUrl;
var urlParam = [];
var urlpname , urlpvalue;
var urlpstr = window.location.href;
var urlpnum = urlpstr.indexOf("?")
urlpstr = urlpstr.substr(urlpnum + 1);
var urlparr = urlpstr.split("&");

var editDom = null;

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
var taskname = urlParam["taskname"];
var xjsj = urlParam["xjsj"];
var adduserguid = urlParam["adduserguid"];
var addusername = urlParam["addusername"];
var shixiangList = urlParam["shixiangList"];  //["123;234;345","456;567;678"]

taskname = decodeURIComponent(taskname);
addusername = decodeURIComponent(addusername);
xjsj = decodeURIComponent(xjsj);

if(shixiangList){
    shixiangList = decodeURIComponent(shixiangList);
    shixiangList = shixiangList.split("@");
    shixiangList = clear_arr_trim(shixiangList);
} else {
    shixiangList = [];
}

var el = document.getElementById('missionList');
var sortable = Sortable.create(el,{
    animation: 150,
    handle: ".moveIcon",
});

// 百度地图API功能
var mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});//创建地图实例
var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});

mp.addControl(top_left_control);

if(taskguid != "" && taskguid != undefined && taskguid != "undefined"){
    getDetail();
} else {
    if(taskname != "" && taskname != undefined && taskname != "undefined"){
        $("#rwmcTxt").val(taskname);
    }

    if(addusername != "" && addusername != undefined && addusername != "undefined"){
        $("#xjryTxt").html(addusername);
    }
    
    if(xjsj != "" && xjsj != undefined && xjsj != "undefined"){
        $("#xjsjTxt").html(xjsj);
    }
    
    var tmplist = [];
    for(var index = 0 ; index < shixiangList.length ; index++){
        var tmp = {
            "ItemText":shixiangList[index].split(";")[1],
            "FullText":shixiangList[index].split(";")[2],
            "ItemCode":shixiangList[index].split(";")[0],
            "lon":shixiangList[index].split(";")[3],
            "lat":shixiangList[index].split(";")[4]
        }

        if(shixiangList[index].split(";")[3] == "" || shixiangList[index].split(";")[4] == ""){
            tmp.loc = "";
            tmp.noloc = "1";
        } else {
            tmp.loc = "1";
            tmp.noloc = "";
        }

        tmplist.push(tmp);
    }

    var template = $('#dataListItemTmpl').html();
    Mustache.parse(template);
    var rendered = Mustache.render(template, {item: tmplist});
    $('#missionList').html(rendered);
}
//ajax获取详情
function getDetail(){
    shixiangList = [];
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

                if(data.MainList.length == 0){
                    return;
                }

                var rwmc = data.MainList[0].taskname;
                var xjry = data.MainList[0].displayname;
                var xjsj = data.MainList[0].InspectionTime;
                $("#rwmcTxt").val(rwmc);
                $("#xjryTxt").html(xjry);
                $("#xjsjTxt").html(xjsj);

                adduserguid = data.MainList[0].InspectorID;
                addusername = data.MainList[0].displayname;

                if(datas.legth == 0)
                    return;

                for(var index = 0 ; index < datas.length ; index++){
                    if(datas[index].lon == "" || datas[index].lat == ""){
                        datas[index].loc = "";
                        datas[index].noloc = "1";
                    } else {
                        datas[index].loc = "1";
                        datas[index].noloc = "";
                    }

                    var tmp = datas[index].ItemCode + ";" + datas[index].ItemText + ";" + datas[index].FullText + ";" + datas[index].lon + ";" + datas[index].lat;
                    shixiangList.push(tmp);
                }

                //列表模版嵌套
                var template = $('#dataListItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: datas});
                $('#missionList').html(rendered);

            } else {
                mui.toast(data.ReturnInfo[0].Description);
            }
        },
        error: function() {
            mui.toast('接口请求失败');
        }
    });
}

$("#missionList").on("click" , "div.locationIcon" , function(){

    $("#tc_map").fadeIn("fast");
    $(".allmask").show();

    mp = new BMap.Map("tc_baidu_map",{mapType:BMAP_HYBRID_MAP});

    //获取经纬度
    editDom = $(this);

    var wgslon = $(this).attr("lon");
    var wgslat = $(this).attr("lat");

    var tmpgcj02 = coordtransform.wgs84togcj02(wgslon , wgslat);
    var tmpbd09 = coordtransform.gcj02tobd09(tmpgcj02[0] , tmpgcj02[1]);
    var point = new BMap.Point(tmpbd09[0], tmpbd09[1]);
    mp.centerAndZoom(point , 14);
    mp.panTo(point);
});
$("#have_map_btn").click(function(){
    var baiduLocationPoint = new BMap.Point();
    baiduLocationPoint = mp.getCenter();

    var tmpgcj02 = coordtransform.bd09togcj02(baiduLocationPoint.lng , baiduLocationPoint.lat);
    var tmpwgs = coordtransform.gcj02towgs84(tmpgcj02[0] , tmpgcj02[1]);

    editDom.attr("lon" , tmpwgs[0]);
    editDom.attr("lat", tmpwgs[1]);
});
$("#no_map_btn").click(function(){
    $("#tc_map").fadeOut("fast");
    $(".allmask").hide();
});

//生成巡检
$("#deliverCheck").click(function(){

    if($("#rwmcTxt").val() == ""){
        window.YDUI.dialog.toast('任务名称不能为空', 'error', 1000);
        return;
    }


    if($("#xjsjTxt").text() == ""){
        window.YDUI.dialog.toast('巡检时间不能为空', 'error', 1000);
        return;
    }


    if(adduserguid == ""){
        window.YDUI.dialog.toast('巡检人员不能为空', 'error', 1000);
        return;
    }

    var locationDom = $(".locationIcon");
    if(locationDom.length == 0){
        window.YDUI.dialog.toast('检查事项不能为空', 'error', 1000);
        return;
    }

    window.YDUI.dialog.confirm('', '确认生成巡检？', function () {
        confirmSubmit();
    });
});
function confirmSubmit(){
    var uuuuid = uuid();
    var requestData = {
        "DataBeaseID":      AuthDB,
        "taskname":         $("#rwmcTxt").val(),
        "InspectorID":      adduserguid,
        "InspectionTime":   $("#xjsjTxt").text(),
        "AddUserGuid":      userguid,
        "rowguid":          uuuuid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/AddWaterDuty.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                //加完基本信息加 事项信息
                addShiXiangInfo(uuuuid);
            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}
function addShiXiangInfo(uuuuid){
    //["123;234;345","456;567;678"]
    var asd = $(".locationIcon");
    var tmpshixiangId = "";
    console.log(shixiangList);
    for(var index = 0 ; index < shixiangList.length ; index++){
        var guiguid = shixiangList[index].split(";")[0];
        var lon = "";
        var lat = "";
        for(var i = 0 ; i < asd.length ; i++){
            if($(asd[i]).attr("itemcode") == guiguid){
                lon = $(asd[i]).attr("lon");
                lat = $(asd[i]).attr("lat");
                break;
            }
        }
        
        guiguid = guiguid + "/" + lon + "/" + lat;
        tmpshixiangId = tmpshixiangId + guiguid + ";";
    }

    var requestData = {
        "DataBeaseID":      AuthDB,
        "itemCodeList":     tmpshixiangId,
        "WaterDutyGuid":    uuuuid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/AddChoseTask.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                mui.toast("生成巡检任务成功");
                setTimeout(function(){
                    
                    window.location.href = "./historymission.html?openId=" + openId + "&userguid=" + userguid + "&AuthDB=" + AuthDB;

                }, 900);
            } else {
                window.YDUI.dialog.toast(data.ReturnInfo[0].Description, 'error', 1000);
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
    for(var index = 0 ; index < shixiangList.length ; index++){
        if(shixiangList[index].trim().indexOf(id) == 0)
            shixiangList.splice(index, 1); 
    }
    thisdom.remove();
}




$("#moreIcon").click(function(){
    window.location.href = "./historymission.html?openId=" + openId + "&userguid=" + userguid + "&process=add" + "&AuthDB=" + AuthDB;
});
$("#addIcon").click(function(){

    //动态计算已选事项
    var tmp = $(".missionListItem");
    var tmplist = [];
    for(var i = 0 ; i < tmp.length ; i++){
        var str1 = $(tmp[i]).find("a.mui-btn").attr("id");
        var str2 = $(tmp[i]).find("div.shixiangName").text();
        var str3 = $(tmp[i]).find("span.luj").text();
        tmplist.push(str1 + ";" + str2 + ";" + str3); 
    }
    var tmpstr = "";
    for(var i = 0 ; i < tmplist.length ; i++){
        tmpstr = tmpstr + encodeURIComponent(tmplist[i]) + "@";
    }

    window.location.href = "./choosePeople.html?" + 
    "process=add" + 
    "&openId=" + openId + 
    "&userguid=" + userguid + 
    "&taskname=" + $("#rwmcTxt").val() + 
    "&adduserguid=" + adduserguid + 
    "&xjsj=" + $("#xjsjTxt").text() + 
    "&shixiangList=" + tmpstr + 
    "&AuthDB=" + AuthDB;
});
$("#newshixiang").click(function(){

    //动态计算已选事项
    var tmp = $(".missionListItem");
    var tmplist = [];
    for(var i = 0 ; i < tmp.length ; i++){
        var str1 = $(tmp[i]).find("a.mui-btn").attr("id");
        var str2 = $(tmp[i]).find("div.shixiangName").text();
        var str3 = $(tmp[i]).find("span.luj").text();
        tmplist.push(str1 + ";" + str2 + ";" + str3); 
    }
    var tmpstr = "";
    for(var i = 0 ; i < tmplist.length ; i++){
        tmpstr = tmpstr + encodeURIComponent(tmplist[i]) + "@";
    }

    window.location.href = "./chooseMission.html?" + 
    "process=add" +
    "&openId=" + openId + 
    "&userguid=" + userguid + 
    "&taskname=" + $("#rwmcTxt").val() + 
    "&adduserguid=" + adduserguid + 
    "&addusername=" + addusername + 
    "&xjsj=" + $("#xjsjTxt").text() + 
    "&shixiangList=" + tmpstr + 
    "&AuthDB=" + AuthDB;
});
$(".allmask").click(function(){
    $("#tc_map").fadeOut("fast");
    $(".allmask").hide();
});
$("#iconback").click(function(){
    window.history.go(-1);
});


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
$("#XJSJ").click(function(){
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
function clear_arr_trim(array1) {
    for(var i = 0 ;i<array1.length;i++) {
        if(array1[i] == "" || typeof(array1[i]) == "undefined") {
            array1.splice(i,1);
            i= i-1;
        }
    }
    return array1;
}

document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
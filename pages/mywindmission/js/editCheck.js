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
var openId = urlParam["openId"];
var username = urlParam["username"];
var userguid = urlParam["userguid"];
var missionguid = urlParam["missionguid"];
var rowguid = urlParam["rowguid"];
var fjid = urlParam["fjid"];
var PhotoID = urlParam["PhotoID"];
var AuthDB = urlParam["AuthDB"];
var processEnd = "";
var whichFenji = '';
var StationID = "";
var allStationInfo = null;
var AttachGuid = "";
//图片上传相关 索引
var realuploadimg = [];
var realuploadimgIndex = [];
var dizengUploadimgIndex = 0;
var needDeluploadimgGuids = "";
var jssdklon = "";
var jssdklat = "";

var photocount = 0;

window.YDUI.dialog.confirm('是否定位', '若您为补录信息，那么请选择取消按钮', function () {
    confirmLocation();
});

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
                        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                        success: function (res) {
                            window.YDUI.dialog.loading.close();
                            jssdklat = res.latitude;
                            jssdklon = res.longitude; 
                        },
                        fail: function(){
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
            window.YDUI.dialog.loading.close();
        } else {
            //alert('failed'+this.getStatus());
            window.YDUI.dialog.loading.close(); 
            window.YDUI.dialog.toast('定位失败', 'error', 1000);
        } 
    },{enableHighAccuracy: true})
}


//ajax请求下拉刷新数据
var requestData = {
    "DataBeaseID":      AuthDB,
    "WinpowerCheckID":  rowguid,
    "AttachGuid":       PhotoID,
    "UserGuid":         userguid,
    "WinpowerDutyID":   missionguid
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

            var tmpInfo = [];

            for(var index = 0 ; index < allStationInfo.length ; index++){
                if(allStationInfo[index].StationInfo.ID == fjid){
                    tmpInfo = allStationInfo[index].AllData;
                    $(".checkPlaceValue").text(allStationInfo[index].StationInfo.Stationname);
                    StationID = allStationInfo[index].StationInfo.ID;
                    break;
                }
            }

            for(var index = 0 ; index < tmpInfo.length ; index++){
                var tmptmp = tmpInfo[index].Data;
                for(var flag = 0 ; flag < tmptmp.length ; flag++){
                    if(tmptmp[flag].ChoseStatus == "异常"){
                        tmpInfo[index].Data[flag].fjErr = "fjErr";
                        tmpInfo[index].Data[flag].fjSuc = "";
                    }
                    if(tmptmp[flag].ChoseStatus == "正常"){
                        tmpInfo[index].Data[flag].fjErr = "";
                        tmpInfo[index].Data[flag].fjSuc = "fjSuc";
                    }
                }
            }

            $("#ycms").val(data.MainData.NonormalRemark);
            $("#bzsm").val(data.MainData.Remark);

            AttachGuid = data.MainData.AttachGuid;

            if( data.MainData.Status == "异常上报"){
                $(".fail").find("div.container").removeClass("nochooseborder");
                $(".fail").find("div.chooseTxt").removeClass("nochooseColor");
                $(".fail").find("div.inner-triangle").removeClass("nochoose");
                $(".fail").find("div.outer-triangle").removeClass("nochoose");
            } else if ( data.MainData.Status == "正常完成"){
                $(".success").find("div.container").removeClass("nochooseborder");
                $(".success").find("div.chooseTxt").removeClass("nochooseColor");
                $(".success").find("div.inner-triangle").removeClass("nochoose");
                $(".success").find("div.outer-triangle").removeClass("nochoose");
            } else {
                $(".fail").find("div.container").removeClass("nochooseborder");
                $(".fail").find("div.chooseTxt").removeClass("nochooseColor");
                $(".fail").find("div.inner-triangle").removeClass("nochoose");
                $(".fail").find("div.outer-triangle").removeClass("nochoose");
            }

            var normalErrItemTmpl = $('#normalErrItemTmpl').html();
            Mustache.parse(normalErrItemTmpl);
            var JCXMrendered = Mustache.render(normalErrItemTmpl, {item : tmpInfo});
            $('#stationInfos').empty();
            $('#stationInfos').html(JCXMrendered);




            //加载图片
            var tmpphoto = [];
            tmpphoto = data.PhotoData;
            var imageItemTmpl = $('#imageItemTmpl').html();
            Mustache.parse(imageItemTmpl);
            var photorendered = Mustache.render(imageItemTmpl, {item : tmpphoto});
            $(photorendered).insertBefore('.addSCTPBorder');


            photocount = data.PhotoData.length;

        } else {
            window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
        }
    },
    error: function() {
        window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
    }
});










$("#imageLists").on("click" , "div.deleteImg" , function() {
    var deleteImgGuid = $(this).attr("deleteImgGuid");
    var tmpdom = $(this).parents("div.SCTPBorder");
    var flag = $(this).attr("inputIndex");
    window.YDUI.dialog.confirm('', '确认删除图片？', function () {
        if(deleteImgGuid == ""){
            //表示删除需要上传的
            for(var index = 0 ; index < realuploadimgIndex.length ; index++){
                if(realuploadimgIndex[index] == flag){
                    tmpdom.remove();
                    realuploadimgIndex[index] = -1;
                    break;
                }
            }
        } else {
            //表示删除已经上传的 
            needDeluploadimgGuids = needDeluploadimgGuids + deleteImgGuid + ";";
            tmpdom.remove();
        }
    });
});
$("#myfile").on("change" , function(event){
    var files = event.target.files;
    for(var i = 0 ; i < files.length ; i++){
        if(files[i].size / 1024 > 6144){
            window.YDUI.dialog.toast('第' + (i + 1) + '张图片大小超过6M，上传失败', 'error', 1000);
        } else {
            readerImage(files[i]);
        }
    }
});
function readerImage(fil){
    var reader = new FileReader();
    reader.readAsDataURL(fil);
    reader.onload = function(){
        realuploadimgIndex.push(dizengUploadimgIndex);
        realuploadimg.push(fil);

        var datas = [];
        datas.push({
            "PhotoUrl":     reader.result,
            "rowguid":      "",
            "inputIndex":   dizengUploadimgIndex
        });
        var template = $('#imageItemTmpl').html();
        Mustache.parse(template);
        var rendered = Mustache.render(template, { item: datas });
        $(rendered).insertBefore(".addSCTPBorder");

        ++dizengUploadimgIndex;
    };
}




$("#confirmSubmit").click(function(){

    var tmplist = $(".HBtns");
    for(var index = 0 ; index < tmplist.length ; index++){
        var hasfjSuc = $(tmplist[index]).find("div.succState").hasClass("fjSuc");
        var hasfjErr = $(tmplist[index]).find("div.failState").hasClass("fjErr");
        if(!hasfjSuc && !hasfjErr){
            window.YDUI.dialog.toast('风机信息中必须全部选择相应状态', 'error', 1200);
            return;
        }
    }

    if($("#ycms").val() == ""){
        window.YDUI.dialog.toast('请填写异常描述', 'error', 1000);
        return;
    }

    if($("#bzsm").val() == ""){
        window.YDUI.dialog.toast('请填写备注说明', 'error', 1000);
        return;
    }

    if(photocount - needDeluploadimgGuids.split(";") + 1 + realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    window.YDUI.dialog.confirm('', '确认更新巡检信息？', function () {
        confirmSubmit("1");
    });
});


$("#confirmSubmit2").click(function(){

    var tmplist = $(".HBtns");
    for(var index = 0 ; index < tmplist.length ; index++){
        var hasfjSuc = $(tmplist[index]).find("div.succState").hasClass("fjSuc");
        var hasfjErr = $(tmplist[index]).find("div.failState").hasClass("fjErr");
        if(!hasfjSuc && !hasfjErr){
            window.YDUI.dialog.toast('风机信息中必须全部选择相应状态', 'error', 1200);
            return;
        }
    }

    if($("#ycms").val() == ""){
        window.YDUI.dialog.toast('请填写异常描述', 'error', 1000);
        return;
    }

    if($("#bzsm").val() == ""){
        window.YDUI.dialog.toast('请填写备注说明', 'error', 1000);
        return;
    }

    if(photocount - needDeluploadimgGuids.split(";") + 1 + realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    window.YDUI.dialog.confirm('', '确认暂存巡检信息？', function () {
        confirmSubmit("0");
    });
});

//更新风电检查
function confirmSubmit(needTmpStorage){

    var succDomList = $("div.fjSuc");
    var failDomList = $("div.fjErr");
    var tmpstr = "";
    for(var index = 0 ; index < succDomList.length ; index++){
        tmpstr = tmpstr + $(succDomList[index]).attr("id") + ",正常;";
    }
    for(var index = 0 ; index < failDomList.length ; index++){
        tmpstr = tmpstr + $(failDomList[index]).attr("id") + ",异常;";
    }
    var formdata = new FormData();
    formdata.append("DataBeaseID",      AuthDB);
    formdata.append("StationID",        StationID);
    formdata.append("FengJiInfo",       tmpstr);
    formdata.append("NonormalRemark",   $("#ycms").val());
    formdata.append("Remark",           $("#bzsm").val());
    formdata.append("lon",              jssdklon);
    formdata.append("lat",              jssdklat);
    formdata.append("Status",           processEnd);
    formdata.append("WinpowerCheckID",  rowguid);
    formdata.append("AttachGuid",       AttachGuid);
    formdata.append("UserGuid",         userguid);
    formdata.append("DelPhotoID",       needDeluploadimgGuids);
    formdata.append("checkstatus",      needTmpStorage);

    for(var index = 0 ; index < realuploadimg.length ; index++){
        if(realuploadimgIndex[index] >= 0)
            formdata.append("file" + uuid() , realuploadimg[index]);
    }

    $.ajax({
        url: businessServerUrl + '/WinPowerDuty/UpdateWinPowerCheck.ashx',
        type: 'POST',
        cache: false,
        data: formdata,
        timeout: 30000,
        processData: false,
        contentType: false,
        xhrFields: {
            withCredentials: false
        },
        success: function(data) {
            data = JSON.parse(data);
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('更新成功', 'success', 1000);
                setTimeout(function(){
                    window.location.href = "./editMission.html?missionguid=" + missionguid + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&username=" + 
                    "&AuthDB=" + AuthDB;
                } , 900);
            } else {
                window.YDUI.dialog.toast('接口错误！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

$("#stationInfos").on("click" , "div.succState" , function(){
    $(this).siblings().removeClass("fjSuc");
    $(this).siblings().removeClass("fjErr");
    $(this).addClass("fjSuc");
});

$("#stationInfos").on("click" , "div.failState" , function(){
    $(this).siblings().removeClass("fjSuc");
    $(this).siblings().removeClass("fjErr");
    $(this).addClass("fjErr");
});




$(".CLZTborder").click(function(){
    if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
        $(this).siblings().find("div.container").addClass("nochooseborder");
        $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
        $(this).siblings().find("div.inner-triangle").addClass("nochoose");
        $(this).siblings().find("div.outer-triangle").addClass("nochoose");

        $(this).find("div.container").removeClass("nochooseborder");
        $(this).find("div.chooseTxt").removeClass("nochooseColor");
        $(this).find("div.inner-triangle").removeClass("nochoose");
        $(this).find("div.outer-triangle").removeClass("nochoose");

        if($(this).hasClass("fail"))
            processEnd = "异常上报";

        if($(this).hasClass("success"))
            processEnd = "正常完成";
    }
})




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

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
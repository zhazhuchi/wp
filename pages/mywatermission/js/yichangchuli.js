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
var userguid = urlParam["userguid"];
var openId = urlParam["openId"];
var ReportID = urlParam["ReportID"];
var froEdit = urlParam["froEdit"];
var AuthDB = urlParam["AuthDB"];
var AttachGuid = "";

var photocount = 0;

//图片上传相关 索引
var realuploadimg = [];
var realuploadimgIndex = [];
var dizengUploadimgIndex = 0;
var needDeluploadimgGuids = "";
var state = "通过";

if(froEdit == "add"){
    var storage = window.localStorage;
    var key = "add" + ReportID;
    var store = storage[key];
    if(store != "" && store != "undefined" && store != undefined && store != null){
        store = JSON.parse(store);
        $("#chulifangan").val(store.v1);
        $("#chulifangan").val(store.v2);
        state = store.v3;

        if(state == "通过"){
            $("#b1").find("div.container").addClass("nochooseborder");
            $("#b1").find("div.chooseTxt").addClass("nochooseColor");
            $("#b1").find("div.inner-triangle").addClass("nochoose");
            $("#b1").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").addClass("nochooseborder");
            $("#b2").find("div.chooseTxt").addClass("nochooseColor");
            $("#b2").find("div.inner-triangle").addClass("nochoose");
            $("#b2").find("div.outer-triangle").addClass("nochoose");

            $("#b1").find("div.container").removeClass("nochooseborder");
            $("#b1").find("div.chooseTxt").removeClass("nochooseColor");
            $("#b1").find("div.inner-triangle").removeClass("nochoose");
            $("#b1").find("div.outer-triangle").removeClass("nochoose");
        }

        if(state == "不通过"){
            $("#b1").find("div.container").addClass("nochooseborder");
            $("#b1").find("div.chooseTxt").addClass("nochooseColor");
            $("#b1").find("div.inner-triangle").addClass("nochoose");
            $("#b1").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").addClass("nochooseborder");
            $("#b2").find("div.chooseTxt").addClass("nochooseColor");
            $("#b2").find("div.inner-triangle").addClass("nochoose");
            $("#b2").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").removeClass("nochooseborder");
            $("#b2").find("div.chooseTxt").removeClass("nochooseColor");
            $("#b2").find("div.inner-triangle").removeClass("nochoose");
            $("#b2").find("div.outer-triangle").removeClass("nochoose");
        }

    }
    
} else {
    getDetail();
}

function getDetail(){
    //获取详情
    //ajax请求下拉刷新数据
    var requestData = {
        "DataBeaseID":AuthDB,
        "RowGuid":froEdit
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/ReportDealDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){

                if(data.ReportDealArea.length == 0){
                    return;
                }
                var datas = data.ReportDealArea[0];
                var clfa = datas.DealScheme;
                var clhxg = datas.Effect;
                var clzt = datas.Status;

                state = datas.Status;

                $("#chulifangan").val(clfa);
                $("#chulihouxiaoguo").val(clhxg);

                var template = $('#imageItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, { item: data.PhotoArea });
                $(rendered).insertBefore(".addSCTPBorder");

                photocount = data.PhotoArea.length;

                if(state == "通过"){
                    $("#b1").find("div.container").addClass("nochooseborder");
                    $("#b1").find("div.chooseTxt").addClass("nochooseColor");
                    $("#b1").find("div.inner-triangle").addClass("nochoose");
                    $("#b1").find("div.outer-triangle").addClass("nochoose");

                    $("#b2").find("div.container").addClass("nochooseborder");
                    $("#b2").find("div.chooseTxt").addClass("nochooseColor");
                    $("#b2").find("div.inner-triangle").addClass("nochoose");
                    $("#b2").find("div.outer-triangle").addClass("nochoose");

                    $("#b1").find("div.container").removeClass("nochooseborder");
                    $("#b1").find("div.chooseTxt").removeClass("nochooseColor");
                    $("#b1").find("div.inner-triangle").removeClass("nochoose");
                    $("#b1").find("div.outer-triangle").removeClass("nochoose");
                }

                if(state == "不通过"){
                    $("#b1").find("div.container").addClass("nochooseborder");
                    $("#b1").find("div.chooseTxt").addClass("nochooseColor");
                    $("#b1").find("div.inner-triangle").addClass("nochoose");
                    $("#b1").find("div.outer-triangle").addClass("nochoose");

                    $("#b2").find("div.container").addClass("nochooseborder");
                    $("#b2").find("div.chooseTxt").addClass("nochooseColor");
                    $("#b2").find("div.inner-triangle").addClass("nochoose");
                    $("#b2").find("div.outer-triangle").addClass("nochoose");

                    $("#b2").find("div.container").removeClass("nochooseborder");
                    $("#b2").find("div.chooseTxt").removeClass("nochooseColor");
                    $("#b2").find("div.inner-triangle").removeClass("nochoose");
                    $("#b2").find("div.outer-triangle").removeClass("nochoose");
                }

                getLocalstorage();


                AttachGuid = data.ReportDealArea[0].AttachGuid;

            } else {
                window.YDUI.dialog.toast('接口错误！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

function getLocalstorage(){
    var storage = window.localStorage;
    var key = "update" + froEdit;
    var store = storage[key];
    if(store != "" && store != "undefined" && store != undefined && store != null){
        store = JSON.parse(store);
        $("#chulifangan").val(store.v1);
        $("#chulifangan").val(store.v2);
        state = store.v3;

        if(state == "通过"){
            $("#b1").find("div.container").addClass("nochooseborder");
            $("#b1").find("div.chooseTxt").addClass("nochooseColor");
            $("#b1").find("div.inner-triangle").addClass("nochoose");
            $("#b1").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").addClass("nochooseborder");
            $("#b2").find("div.chooseTxt").addClass("nochooseColor");
            $("#b2").find("div.inner-triangle").addClass("nochoose");
            $("#b2").find("div.outer-triangle").addClass("nochoose");

            $("#b1").find("div.container").removeClass("nochooseborder");
            $("#b1").find("div.chooseTxt").removeClass("nochooseColor");
            $("#b1").find("div.inner-triangle").removeClass("nochoose");
            $("#b1").find("div.outer-triangle").removeClass("nochoose");
        }

        if(state == "不通过"){
            $("#b1").find("div.container").addClass("nochooseborder");
            $("#b1").find("div.chooseTxt").addClass("nochooseColor");
            $("#b1").find("div.inner-triangle").addClass("nochoose");
            $("#b1").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").addClass("nochooseborder");
            $("#b2").find("div.chooseTxt").addClass("nochooseColor");
            $("#b2").find("div.inner-triangle").addClass("nochoose");
            $("#b2").find("div.outer-triangle").addClass("nochoose");

            $("#b2").find("div.container").removeClass("nochooseborder");
            $("#b2").find("div.chooseTxt").removeClass("nochooseColor");
            $("#b2").find("div.inner-triangle").removeClass("nochoose");
            $("#b2").find("div.outer-triangle").removeClass("nochoose");
        }

    }
}

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

    if($("#chulifangan").val() == ""){
        window.YDUI.dialog.toast('处理方案不能为空', 'error', 1000);
        return;
    }

    if($("#chulihouxiaoguo").val() == ""){
        window.YDUI.dialog.toast('处理效果不能为空', 'error', 1000);
        return;
    }


    if(froEdit == "add"){
        window.YDUI.dialog.confirm('', '确认提交新增？', function () {
            confirmSubmit1();
        });
    } else {
        window.YDUI.dialog.confirm('', '确认提交更新？', function () {
            confirmSubmit2();
        });
    }
})
function confirmSubmit1(){

    if(realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    window.YDUI.dialog.loading.open('上报中…');

    var rrguid = uuid();
    var formdata = new FormData();
    formdata.append("DataBeaseID",  AuthDB);
    formdata.append("DealScheme",   $("#chulifangan").val());
    formdata.append("Effect",       $("#chulihouxiaoguo").val());
    formdata.append("Status",       state);
    formdata.append("ReportID",     ReportID);
    formdata.append("UserGuid",     userguid);
    formdata.append("rowguid",      rrguid);

    for(var index = 0 ; index < realuploadimg.length ; index++){
        if(realuploadimgIndex[index] >= 0)
            formdata.append("file" + uuid() , realuploadimg[index]);
    }

    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/AddReportDeal.ashx',
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
            window.YDUI.dialog.loading.close();
            if(data.ReturnInfo[0].Code == '1'){
                window.YDUI.dialog.toast('提交成功', 'success', 1000);

                var storage = window.localStorage;
                var key = "add" + ReportID;
                storage.removeItem(key);

                setTimeout(function(){
                    window.location.href = "./detail.html?rowguid=" + rrguid + 
                    "&openId=" + openId + 
                    "&userguid=" + userguid + 
                    "&ReportID=" + ReportID + 
                    "&AuthDB=" + AuthDB
                    ;
                }, 900);
            } else {
                window.YDUI.dialog.toast('接口错误！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

function confirmSubmit2(){

    if(photocount - needDeluploadimgGuids.split(";") + 1 + realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    window.YDUI.dialog.loading.open('上报中…');

    var formdata = new FormData();
    formdata.append("DataBeaseID",  AuthDB);
    formdata.append("RowGuid",      froEdit);
    formdata.append("DealScheme",   $("#chulifangan").val());
    formdata.append("Effect",       $("#chulihouxiaoguo").val());
    formdata.append("Status",       state);
    formdata.append("AttachGuid",   AttachGuid);
    formdata.append("UserGuid",     userguid);
    formdata.append("DelPhotoID",   needDeluploadimgGuids);
    
    for(var index = 0 ; index < realuploadimg.length ; index++){
        if(realuploadimgIndex[index] >= 0)
            formdata.append("file" + uuid() , realuploadimg[index]);
    }

    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/UpdateReportDeal.ashx',
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
            window.YDUI.dialog.loading.close();
            data = JSON.parse(data);
            window.YDUI.dialog.toast('更新成功', 'success', 1000);

            var storage=window.localStorage;
            var key = "update" + froEdit;
            storage.removeItem(key);

            setTimeout(function(){
                window.location.href = "./detail.html?rowguid=" + froEdit + 
                "&openId=" + openId + 
                "&userguid=" + userguid + 
                "&ReportID=" + ReportID + 
                "&AuthDB=" + AuthDB
                ;
            }, 900);
        },
        error: function() {
            window.YDUI.dialog.loading.close();
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

$("#backicon").click(function(){
    window.history.go(-1);
});

$("#processhis").click(function(){
    window.location.href = "./processHistory.html?ReportID=" + ReportID + 
    "&fromhistory=1" + 
    "&AuthDB=" + AuthDB + 
    "&userguid=" + userguid + 
    "&openId=" + openId;
});

$(".RWTSborder").click(function(){
    if($(this).find("div.chooseTxt").hasClass("nochooseColor")){
        $(this).siblings().find("div.container").addClass("nochooseborder");
        $(this).siblings().find("div.chooseTxt").addClass("nochooseColor");
        $(this).siblings().find("div.inner-triangle").addClass("nochoose");
        $(this).siblings().find("div.outer-triangle").addClass("nochoose");

        $(this).find("div.container").removeClass("nochooseborder");
        $(this).find("div.chooseTxt").removeClass("nochooseColor");
        $(this).find("div.inner-triangle").removeClass("nochoose");
        $(this).find("div.outer-triangle").removeClass("nochoose");

        state = $(this).find("div.chooseTxt").text().trim();
    }
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





$("#confirmStorge").click(function(){
    if(!window.localStorage){
        window.YDUI.dialog.toast('您的微信版本不支持暂存功能，请直接提交', 'error', 1000);
        return false;
    }

    window.YDUI.dialog.confirm('', '确认暂存数据', function () {
        tmpstore();
    });
});

function tmpstore(){
    var storage = window.localStorage;

    if(froEdit == "add"){
        var key = "add" + ReportID;
        var store = {
            "v1":$("#chulifangan").val(),
            "v2":$("#chulifangan").val(),
            "v3":state
        }
        store = JSON.stringify(store);
        storage[key] = store;

        window.YDUI.dialog.toast('存储成功', 'success', 900);

        setTimeout(function(){
            window.location.href = "./MyMission.html?openId=" + openId + "&AuthDB=" + AuthDB;
        }, 900);
        
    } else {
        var key = "update" + froEdit;
        var store = {
            "v1":$("#chulifangan").val(),
            "v2":$("#chulifangan").val(),
            "v3":state
        }
        store = JSON.stringify(store);
        storage[key] = store;

        window.YDUI.dialog.toast('存储成功', 'success', 900);

        setTimeout(function(){
            window.location.href = "./MyMission.html?openId=" + openId + "&AuthDB=" + AuthDB;
        }, 900);
    }


}


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
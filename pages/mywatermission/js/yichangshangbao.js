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

var AuthDB = urlParam["AuthDB"];
var userguid = urlParam["userguid"];
var openId = urlParam["openId"];
var missionguid = urlParam["missionguid"];
var checkIntemGuid = urlParam["checkIntemGuid"];
var fullpath = urlParam["fullpath"];
var notfullpath = urlParam["notfullpath"];
var forEditRowguid = urlParam["rowguid"];

//图片上传相关 索引
var realuploadimg = [];
var realuploadimgIndex = [];
var dizengUploadimgIndex = 0;
var needDeluploadimgGuids = "";
var AttachGuid = "";

var photocount = 0;

fullpath = decodeURIComponent(fullpath);
notfullpath = decodeURIComponent(notfullpath);

$("#RWMS").html(notfullpath + "<br>" + fullpath);
if(forEditRowguid == "add"){

} else {
    var requestData = {
        "DataBeaseID":AuthDB,
        "RowGuid": forEditRowguid
    };
    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/NoNormalReportDetail.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                var ycms = data.ReportArea[0].NoNomarlRemark;
                var yhms = data.ReportArea[0].HTroubleRemark;
                var dcjy = data.ReportArea[0].advise;

                $("#yichangmiaoshu").val(ycms);
                $("#yinghuanmiaoshu").val(yhms);
                $("#duicejianyi").val(dcjy);

                var template = $('#imageItemTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, { item: data.PhotoArea });
                $(rendered).insertBefore(".addSCTPBorder");

                AttachGuid = data.ReportArea[0].AttachGuid;

                photocount = data.PhotoArea.length;
    
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
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

$("#lastBtn").click(function(){

    if($("#yichangmiaoshu").val() == ""){
        window.YDUI.dialog.toast('异常描述不能为空', 'error', 1000);
        return;
    }

    if($("#yinghuanmiaoshu").val() == ""){
        window.YDUI.dialog.toast('隐患描述不能为空', 'error', 1000);
        return;
    }

    if($("#duicejianyi").val() == ""){
        window.YDUI.dialog.toast('对策建议不能为空', 'error', 1000);
        return;
    }

    window.YDUI.dialog.loading.open('上报中…');
    if(forEditRowguid == "add"){
        window.YDUI.dialog.confirm('', '确认提交？', function () {
            confirmSubmit();
        });
    } else {
        window.YDUI.dialog.confirm('', '确认更新异常信息？', function () {
            confirmSubmit2(forEditRowguid);
        });
    }
});

function confirmSubmit(){

    if(realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    var rowguidd = uuid();
    var formdata = new FormData();
    formdata.append("DataBeaseID",      AuthDB);
    formdata.append("NoNomarlRemark",   $("#yichangmiaoshu").val());
    formdata.append("HTroubleRemark",   $("#yinghuanmiaoshu").val());
    formdata.append("advise",           $("#duicejianyi").val());
    formdata.append("chosetaskID",      checkIntemGuid);
    formdata.append("UserGuid",         userguid);
    formdata.append("rowguid",          rowguidd);

    for(var index = 0 ; index < realuploadimg.length ; index++){
        if(realuploadimgIndex[index] >= 0)
            formdata.append("file" + uuid() , realuploadimg[index]);
    }

    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/AddNoNormalReport.ashx',
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
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast("提交成功");
                setTimeout(function(){
                    window.location.href = "./yichangDetail.html?rowguid=" + rowguidd + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&checkIntemGuid=" + checkIntemGuid + 
                    "&missionguid=" + missionguid + 
                    "&AuthDB=" + AuthDB
                    ;
                }, 900);
            } else {
                window.YDUI.dialog.toast('接口错误！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

function confirmSubmit2(rowguid){

    if(photocount - needDeluploadimgGuids.split(";") + 1 + realuploadimg.length > 5){
        window.YDUI.dialog.toast('最多只能上传五张图片', 'error', 1000);
        return;
    }

    var formdata = new FormData();
    formdata.append("DataBeaseID",      AuthDB);
    formdata.append("RowGuid",          rowguid);
    formdata.append("NoNomarlRemark",   $("#yichangmiaoshu").val());
    formdata.append("HTroubleRemark",   $("#yinghuanmiaoshu").val());
    formdata.append("advise",           $("#duicejianyi").val());
    formdata.append("AttachGuid",       AttachGuid);
    formdata.append("UserGuid",         userguid);
    formdata.append("DelPhotoID",       needDeluploadimgGuids);

    for(var index = 0 ; index < realuploadimg.length ; index++){
        if(realuploadimgIndex[index] >= 0)
            formdata.append("file" + uuid() , realuploadimg[index]);
    }

    $.ajax({
        url: businessServerUrl + '/WaterDutyDeal/UpdateNoNormalReport.ashx',
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
                window.YDUI.dialog.loading.close();
                window.YDUI.dialog.toast('更新成功', 'success', 1000);

                setTimeout(function(){
                    window.location.href = "./yichangDetail.html?rowguid=" + rowguid + 
                    "&userguid=" + userguid + 
                    "&openId=" + openId + 
                    "&checkIntemGuid=" + checkIntemGuid + 
                    "&missionguid=" + missionguid + 
                    "&AuthDB=" + AuthDB
                    ;
                }, 900);
            } else {
                window.YDUI.dialog.toast('接口错误！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
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
});


var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
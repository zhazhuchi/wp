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
var taskguid = urlParam["taskguid"];
var AuthDB = urlParam["AuthDB"];
var taskname = urlParam["taskname"];
var xjsj = urlParam["xjsj"];
var adduserguid = urlParam["adduserguid"];
var addusername = urlParam["addusername"];
var shixiangList = urlParam["shixiangList"];  //["123;234;345","456;567;678"]
var process = urlParam["process"];
var storageshixiangList = [];

if(shixiangList != "" && shixiangList != undefined && shixiangList != "undefined"){
    shixiangList = decodeURIComponent(shixiangList);
    shixiangList = shixiangList.split("@");
    shixiangList = clear_arr_trim(shixiangList);
} else {
    shixiangList = [];
}
storageshixiangList = shixiangList;
if(process == "update"){
    shixiangList = [];
}

var totalMissionCount = shixiangList.length;
$("#confirmCount").text(totalMissionCount);

var duizhan = [];
duizhan.push("");

getShowListData("");
function getShowListData(code){
    var requestData = {
        "DataBeaseID":AuthDB,
        "Level": code
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/TaskCodeList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                var datas = data.UserArea;
                var nonext = [];
                var hasnext = [];

                for(var i = 0 ; i < datas.length ; i++){
                    if(datas[i].IsChengJi == 'N')
                        nonext.push(datas[i]);
                    if(datas[i].IsChengJi == 'Y')
                        hasnext.push(datas[i]);
                }

                $('#cengjiList').empty();
                //列表模版嵌套
                var template = $('#hasNextTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: hasnext});
                $('#cengjiList').append(rendered);

                for(var index = 0 ; index < nonext.length ; index++){
                    var finds = false;
                    for(var i = 0 ; i < storageshixiangList.length ; i++){
                        if(storageshixiangList[i].split(";")[0] == nonext[index].ItemCode){
                            nonext[index] = {};
                            finds = true;
                            break;
                        }
                    }
                    if(finds){
                        continue;
                    } else {
                        nonext[index].checked = "";
                    }
                }

                nonext = clear_arr_trim(nonext);
                for(var index = 0 ; index < nonext.length ; index++){
                    if(nonext[index].IsShowBlue == "N"){
                        nonext[index].showLocation = "";
                        nonext[index].hideLocation = "1";
                    } else {
                        nonext[index].showLocation = "1";
                        nonext[index].hideLocation = "";
                    }
                }
                var template = $('#noNextTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: nonext});
                $('#cengjiList').append(rendered);
                
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}

mui('#cengjiList').on('tap', 'a', function() {
    var id = $(this).attr("id");
    getShowListData(id);
    duizhan.push(id);
});

mui('#cengjiList').on('change', 'input', function() {
    var value = this.checked ? true : false ;
    var ItemCode = $(this).attr("ItemCode");
    var ItemText = $(this).attr("ItemText");
    var FullText = $(this).attr("FullText");
    var Lon = $(this).attr("Lon");
    var Lat = $(this).attr("Lat");

    ItemText = ItemText.replace(/<\/?.+?>/g,"");
    FullText = FullText.replace(/<\/?.+?>/g,"");
    if(value){
        ++totalMissionCount;
        shixiangList.push(ItemCode + ";" + ItemText + ";" + FullText + ";" + Lon + ";" + Lat);
    } else {
        --totalMissionCount;
        for(var index = 0 ; index < shixiangList.length ; index++){
            if(shixiangList[index].split(";")[0] == ItemCode){
                shixiangList.splice(index, 1); 
                break;
            }
        }
    }
    $("#confirmCount").text(totalMissionCount);
});

$("#searchIcon").click(function(){
    var keyword = $("#searchInput").val();
    if(keyword == ""){
        getShowListData("001");
    } else {
        searchList($("#searchInput").val());
    }
});

function searchList(keykey){
    var requestData = {
        "DataBeaseID":AuthDB,
        "KeyWord": keykey
    };
    $.ajax({
        url: businessServerUrl + '/WaterDuty/TaskCodeGoList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            if(data.ReturnInfo[0].Code == '1'){
                var datas = data.UserArea;
                $('#cengjiList').empty();
                var template = $('#noNextTmpl').html();
                Mustache.parse(template);
                var rendered = Mustache.render(template, {item: datas});
                $('#cengjiList').append(rendered);
            } else {
                window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
            }
        },
        error: function() {
            window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
        }
    });
}




$("#AddChoseTask").click(function(){

    var tmpstr = "";
    for(var i = 0 ; i < shixiangList.length ; i++){
        tmpstr = tmpstr + encodeURIComponent(shixiangList[i]) + "@";
    }
    
    if(process == "add"){
        window.location.href = "addMission.html?" + 
        "openId=" + openId + 
        "&userguid=" + userguid + 
        "&taskname=" + taskname + 
        "&xjsj=" + xjsj + 
        "&shixiangList=" + tmpstr + 
        "&adduserguid=" + adduserguid + 
        "&addusername=" + addusername + 
        "&AuthDB=" + AuthDB
        ;
    } else {

        var tmpstr = "";
        for(var i = 0 ; i < shixiangList.length ; i++){
            var tmpshixiang = shixiangList[i].split(";");
            tmpstr = tmpstr + tmpshixiang[0] + "/" + tmpshixiang[3] + "/" + tmpshixiang[4] + ";";
        }
            
        var requestData = {
            "DataBeaseID":AuthDB,
            "itemCodeList": tmpstr,
            "WaterDutyGuid": taskguid
        };
        $.ajax({
            url: businessServerUrl + '/WaterDuty/AddChoseTask.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){ 
                    window.YDUI.dialog.toast('添加成功', 'success', 1000);

                    window.location.href = "missionEdit.html?" + 
                    "openId=" + openId + 
                    "&userguid=" + userguid + 
                    "&taskguid=" + taskguid + 
                    "&AuthDB=" + AuthDB
                    ;

                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });
    }
});



$("#iconback").click(function(){
    window.history.go(-1);
});






$("#SYJ").click(function(){
    if(duizhan.length == 1){

    } else {
        duizhan.pop();
        getShowListData(duizhan[duizhan.length-1]);
    }
});

$("#QX").click(function(){
    var tmp = $("input[name='checkbox']");
    for(var index = 0; index < tmp.length ; index++){
        var value = tmp[index].checked ? true : false ;
        if(value){
            
        } else {
            $(tmp[index]).prop('checked',true);
            ++totalMissionCount;
            $("#confirmCount").text(totalMissionCount);

            var ItemCode = $(tmp[index]).attr("ItemCode");
            var ItemText = $(tmp[index]).attr("ItemText");
            var FullText = $(tmp[index]).attr("FullText");
            var Lon = $(tmp[index]).attr("Lon");
            var Lat = $(tmp[index]).attr("Lat");
            shixiangList.push(ItemCode + ";" + ItemText + ";" + FullText + ";" + Lon + ";" + Lat);
        }
    }
});



$("#QK").click(function(){
    var tmp = $("input[name='checkbox']");
    for(var index = 0; index < tmp.length ; index++){
        var value = tmp[index].checked ? true : false ;
        if(value){
            $(tmp[index]).prop('checked',false);
            --totalMissionCount;
            $("#confirmCount").text(totalMissionCount);
            
            var ItemCode = $(tmp[index]).attr("ItemCode");

            for(var i = 0 ; i < shixiangList.length ; i++){
                if(shixiangList[i].split(";")[0] == ItemCode){
                    shixiangList.splice(i, 1);
                    break;
                }
            }
        }
    }
});




function clear_arr_trim(array1) {
    for(var i = 0 ; i < array1.length ; i++){
        if(array1[i] == "" || typeof(array1[i]) == "undefined" || JSON.stringify(array1[i]) == "{}"){
            array1.splice(i,1);
            i= i-1;
        }
    }
    return array1;
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
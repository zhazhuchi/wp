var startDate = "";
var endDate = "";
var whichDateBase = "";
var allDateInfo = [];
var allgridInfo = [];
var allType = [];
var pointID = "";
var firstTime = true;

var haveDate = true;

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

pointID = urlParam["rowguid"];
var AuthDB = urlParam["AuthDB"];

var totalInfo = urlParam["totalInfo"];
totalInfo = decodeURIComponent(totalInfo);
totalInfo = decodeURIComponent(totalInfo);
$("#totalTxt").text(totalInfo);

$("#backicon").click(function(){
    window.history.go(-1);
});

mui.init({
    swipeBack: false
});

$("#shujubiao").click(function(){
    $("#shujubiao").addClass("chooseActive");
    $("#guochengxian").removeClass("chooseActive");
    $("#EchartBorder").css("visibility" , "hidden");

    if(haveDate){
        $("#dataGrid").show();
        $("#Echart").hide();
    } else {
        $("#dataGrid").hide();
        $("#Echart").hide();
        $("#dataGrid").css("visibility" , "hidden");
        $("#EchartBorder").css("visibility" , "hidden");
    }
    
    
    $("#advance_filter").slideUp("fast");
    $("#AllMask").hide();
    showAdvanceFilter = false;
});
$("#guochengxian").click(function(){
    $("#shujubiao").removeClass("chooseActive");
    $("#guochengxian").addClass("chooseActive");
    $("#EchartBorder").css("visibility" , "visible");

    if(haveDate){
        $("#dataGrid").hide();
        $("#Echart").show();
    } else {
        $("#dataGrid").hide();
        $("#Echart").hide();
        $("#dataGrid").css("visibility" , "hidden");
        $("#EchartBorder").css("visibility" , "hidden");
    }

    
    $("#advance_filter").slideUp("fast");
    $("#AllMask").hide();
    showAdvanceFilter = false;
});


var EchartContent = document.getElementById("EchartContent");
var Echart = echarts.init(EchartContent);

function beginshowGrid(tmp1 , tmp2){
    var option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: tmp1,
            axisLine: {
                lineStyle: {
                    color: '#888'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#888'
                }
            },
            scale: true
        },
        series: [{
            data: tmp2,
            type: 'line',
            areaStyle: {
                color: [
                    'rgba(168,197,243,0.3)'
                ]
            },
            itemStyle : {  
                normal : {  
                    color:'rgba(168,197,243,0.3)', 
                    lineStyle:{  
                        color:'rgba(168,197,243,0.3)'  
                    }  
                }  
            }
        }]
    };
    if (option && typeof option === "object") {
        Echart.setOption(option, true);
    }
}

//筛选
var showAdvanceFilter = false;
$("#filterIcon").click(function(){

    if(showAdvanceFilter){
        $("#advance_filter").slideUp("fast");
        $("#AllMask").hide();
        showAdvanceFilter = false;
    } else {
        $("#advance_filter").slideDown("fast");
        $("#AllMask").show();
        showAdvanceFilter = true;
    }

});
$("#AllMask").click(function(){
    $("#advance_filter").slideUp("fast");
    $("#AllMask").hide();
    showAdvanceFilter = false;
}); 

$(".cancleBtn").click(function(){
    $("#advance_filter").slideUp("fast");
    $("#AllMask").hide();
    showAdvanceFilter = false;
})


//ajax请求
var requestData = {};
$.ajax({
    url: businessServerUrl + '/HistoryQuery/SearchTable.ashx',
    type: 'post',
    data: requestData,
    dataType: 'json',
    async: false, 
    success: function(data) {
        if(data.ReturnInfo[0].Code == '1'){
            var datas = data.UserArea;
            var ItemTmpl = $('#SJYItemTmpl').html();
            Mustache.parse(ItemTmpl);
            var rendered = Mustache.render(ItemTmpl, {item : datas});
            $('#SJYBorder').append(rendered);

            $($(".SJY_Choose_input")[0]).prop('checked','true');

            whichDateBase = datas[0].TableName;

            $(".SJY_Choose_input").change(function() {
                var id = $("input[name='radio1']:checked").val();
                whichDateBase = id;
            });

        } else {
            mui.toast("刷新失败，接口报错！");
        }
    },
    error: function() {
        mui.toast('接口请求失败');
    }
});


$("#chooseBeginTime").click(function(){
    var _self = this;
    var options = {
        "type":"date",
        "value": getPreMonth(getNowFormatDate())
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        startDate = rs.text;
        $("#starttime").text(startDate);
        $("#echartStartTime").text(startDate);
        _self.picker.dispose();
        _self.picker = null;
    });
});

$("#chooseEndTime").click(function(){
    var _self = this;
    var options = {
        "type":"date",
        "value":getNowFormatDate()
    };
    _self.picker = new mui.DtPicker(options);
    _self.picker.show(function(rs) {
        endDate = rs.text;
        $("#endtime").text(endDate);
        $("#echartEndTime").text(endDate);
        _self.picker.dispose();
        _self.picker = null;
    });
});


function ajaxGridData(){
    //ajax请求滑动列表数据
    var requestData = {
        "DataBeaseID":AuthDB,
        "StartDate":startDate,
        "EndDate":endDate,
        "TableName": whichDateBase,
        "PointID": pointID
    };
    $.ajax({
        url: businessServerUrl + '/HistoryQuery/PointDataList.ashx',
        type: 'post',
        data: requestData,
        dataType: 'json',
        success: function(data) {
            if(data.ReturnInfo[0].Code == '1'){

                $("#dateLists").empty();
                for(var i = 0 ; i < data.UserAreaData.length ; i++){
                    if(data.UserAreaList[i].flag == "True"){
                        $("#dateLists").append("<tr class='needbs controlWidth'><td>"+data.UserAreaData[i].mTime+"</td></tr>");
                    }
                    if(data.UserAreaList[i].flag == "False"){
                        $("#dateLists").append("<tr class='needbs controlWidth'><td style='color:#F17C7C'>"+data.UserAreaData[i].mTime+"</td></tr>");
                    }
                }

                $("#thLists").empty();
                for(var i = 0 ; i < data.UserAreaName.length ; i++)
                    $("#thLists").append("<th>"+data.UserAreaName[i].DataName+"</th>");

                $("#trueDateList").empty();
                
                var resultDom = "";
                for(var i = 0 ; i < data.UserAreaList.length ; i++){

                    if(data.UserAreaList[i].flag == "True"){
                        resultDom = resultDom + "<tr class='needbs'>";
                        for(var j = 0 ; j < data.UserAreaName.length ; j++)
                            resultDom = resultDom + "<td>" + data.UserAreaList[i][data.UserAreaName[j].DataName] + "</td>";
                        resultDom = resultDom + "</tr>";
                    }
                    if(data.UserAreaList[i].flag == "False"){
                        resultDom = resultDom + "<tr class='needbs'>";
                        for(var j = 0 ; j < data.UserAreaName.length ; j++)
                            resultDom = resultDom + "<td style='color:#F17C7C'>" + data.UserAreaList[i][data.UserAreaName[j].DataName] + "</td>";
                        resultDom = resultDom + "</tr>";
                    }
                }
                $("#trueDateList").html(resultDom);

                allgridInfo = data.UserAreaList;
                allType = data.UserAreaName;
                allDateInfo = data.UserAreaData;

                if(data.UserAreaData.length != 0){
                    endDate = data.UserAreaData[0].mTime.split(" ")[0];
                    startDate = data.UserAreaData[data.UserAreaData.length -1].mTime.split(" ")[0];
                    $("#echartStartTime").text(startDate);
                    $("#echartEndTime").text(endDate);

                    if(firstTime){
                        var defaultEndTime = getNowFormatDate();
                        var defaultStartTime = getPreMonth(defaultEndTime);
                        $("#starttime").text(defaultStartTime);
                        $("#endtime").text(defaultEndTime);
                        firstTime = false;
                    } else {
                        $("#starttime").text(startDate);
                        $("#endtime").text(endDate);
                    }

                    
                } else {
                    mui.toast("数据为空！");
                }

                if(data.UserAreaName.length != 0){
                    //选取第一列作为初始化的列全部日期作为天剑
                    initEchart();
                } else {
                    mui.toast("列表为空！");
                }
                
                var win = $(window),
                scrollAreaEl = $('.t_r_content'),
                leftFreezeEl = $('.t_l_freeze'),
                leftTableEl = leftFreezeEl.find('table'),
                rightTableEl = $('.t_r_t table');

                //动态计算容器最大高度
                function adjustHeight() {
                    var winHeight = win.height(),
                        tableHeight = winHeight - 140;
                    leftFreezeEl.height(tableHeight);
                    scrollAreaEl.height(tableHeight);
                }

                adjustHeight();
                win.on('resize', adjustHeight);

                //设置iscroll
                var myScroll = new IScroll('.t_r_content', {
                    scrollX: true,
                    scrollY: true,
                    probeType: 3
                });

                //阻止默认滚动
                scrollAreaEl.on('touchmove mousewheel', function(e) {
                    e.preventDefault();
                });

                //固定上左表头的滚动
                myScroll.on('scroll', updatePosition);
                myScroll.on('scrollEnd', updatePosition);

                function updatePosition() {
                    var a = this.y;
                    var b = this.x;
                    leftTableEl.css('transform', 'translate(0px, ' + a + 'px) translateZ(0px)');
                    rightTableEl.css('transform', 'translate(' + b + 'px, 0px) translateZ(0px)');
                }
                if(data.UserAreaData.length > 0){
                    haveDate = true;
                    $("#dataGrid").css("visibility" , "visible");
                    $("#EchartBorder").css("visibility" , "visible");
                    $("#nodata").hide();
                } else {
                    $("#starttime").text(getPreMonth(getNowFormatDate()));
                    $("#endtime").text(getNowFormatDate());
                    haveDate = false;
                    $("#nodata").show();
                }

                $("#YDUI_LOADING").hide();
            } else {
                haveDate = false;
                $("#nodata").show();
                $("#starttime").text(getPreMonth(getNowFormatDate()));
                $("#endtime").text(getNowFormatDate());
                mui.toast("刷新失败，接口报错！");
                $("#YDUI_LOADING").hide();
            }
        },
        error: function() {
            haveDate = false;
            $("#nodata").show();
            $("#starttime").text(getPreMonth(getNowFormatDate()));
            $("#endtime").text(getNowFormatDate());
            mui.toast('接口请求失败');
            $("#YDUI_LOADING").hide();
        }
    });
}
ajaxGridData();


function initEchart(){
    var index = 0;
    var tmp1 = [];
    var tmp2 = [];
    var whichType = allType[index].DataName;
    $("#echartTitle").text(whichType);

    for(var index = 0 ; index < allDateInfo.length ; index++)
        tmp1.push(allDateInfo[index].mTime);

    for(var index = 0 ; index < allgridInfo.length ; index++)
        tmp2.push(allgridInfo[index][whichType]);
    
    beginshowGrid(tmp1 , tmp2);
}

$("#trueDateList").on("tap","td",function(e){

    var index = $(this).index();
    var tmp1 = [];
    var tmp2 = [];
    var whichType = allType[index].DataName;
    $("#echartTitle").text(whichType);

    for(var index = 0 ; index < allDateInfo.length ; index++)
        tmp1.push(allDateInfo[index].mTime);

    for(var index = 0 ; index < allgridInfo.length ; index++)
        tmp2.push(allgridInfo[index][whichType]);

    $("#guochengxian").click();
    beginshowGrid(tmp1 , tmp2);
});




//点击筛选确定按钮
$(".confirmBtn").click(function(){
    $("#YDUI_LOADING").show();
    var time1 = $("#starttime").text().trim();
    var time2 = $("#endtime").text().trim();
    var righttime = dateValid(time1 , time2);
    if(!righttime){
        mui.toast("开始时间要小于结束时间");
        return ;
    }
    ajaxGridData();
    $("#advance_filter").hide();
    $("#AllMask").hide();
    showAdvanceFilter = false;
});

function dateValid(time1 , time2){
    var beginDate =  new Date(time1.replace(/-/g,"/"));
    var endDate = new Date(time2.replace(/-/g,"/"));
    if(beginDate > endDate)
        return false;
    else
        return true;
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var day = arr[2]; //获取当前日期的日
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

document.getElementById('AllMask').ontouchstart = function(e){
    e.preventDefault();
}

var showVConsole = Window.Config.showVConsole;
if(showVConsole){
    document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
}
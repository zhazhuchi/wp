!function ($) {
    window.YDUI.dialog.loading.open('加载中…');
    var allDateInfo = [];
    var allgridInfo = [];
    var showWhichTc = "";
    var mp = null;
    var initlon = "";
    var initlat = "";

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
    var AuthDB = urlParam["AuthDB"];
    
    //先控制地图高度
    var mapheight = $(window).height() - 42;
    $("#mapBorder").css("height",mapheight);

    var top_left_control = new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL});


    // 百度地图API功能
    function ComplexCustomOverlay(point , guid , whichIcon , runorstop) {
        this._point = point;
        this._guid = guid;
        this._whihIcon = whichIcon;
        this._runorstop = runorstop;
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
        $(div).attr("rowguid",this._idid);

        var arrow = this._arrow = document.createElement("img");
        if (this._whihIcon == "0") {
            arrow.src = "./img/greenfan.png";
        } else if (this._whihIcon == "1") {
            arrow.src = "./img/yellowfan.png";
        } else if (this._whihIcon == "2") {
            arrow.src = "./img/redfan.png";
        } else {
            arrow.src = "./img/greenfan.png";
        }

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
        div.addEventListener("touchstart", function () {
            showTcWindow($(this).attr("id"));
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


    var $tab = $('#J_Tab');
    var chooseShow = false;

    $tab.tab({
        nav: '.tab-nav-item',
        panel: '.tab-panel-item',
        activeClass: 'tab-active'
    });

    $tab.find('.tab-nav-item').on('open.ydui.tab', function (e) {
    });

    $tab.find('.tab-nav-item').on('opened.ydui.tab', function (e) {
        window.YDUI.dialog.loading.open('加载中…');
        if(e.index == "0"){
            getAllGridData("");
            $("#show1").show();
            $("#show2").show();
            $("#show3").show();
        } else if(e.index == "1"){
            getAllGridData("异常");
            $("#show1").hide();
            $("#show2").hide();
            $("#show3").show();
        } else if(e.index == "2"){
            getAllGridData("缺测");
            $("#show1").hide();
            $("#show2").show();
            $("#show3").hide();
        } else if(e.index == "3"){
            getAllGridData("正常");
            $("#show1").show();
            $("#show2").hide();
            $("#show3").hide();
        } else {
            getAllGridData("");
        }
    });

    $("#chooseShowTxt").click(function(){
        if(chooseShow){
            chooseShow = false;
            $("#chooseShowTxt>.downIcon").show();
            $("#chooseShowTxt>.upIcon").hide();
            $("#chooseShowTxt").css("color","#585858");
            $("#chooseShowItemsBorder").slideUp("fast");

        } else {
            chooseShow = true;
            $("#chooseShowTxt>.downIcon").hide();
            $("#chooseShowTxt>.upIcon").show();
            $("#chooseShowTxt").css("color","#517FF3");
            $("#chooseShowItemsBorder").slideDown("fast");
        }
    });

    $(".chooseShowItem").click(function(){
        $(this).addClass("chooseShowItemActive").siblings(".chooseShowItem").removeClass("chooseShowItemActive");
        if($(this).text() == "列表展示"){
            $("#gridBorder").removeClass("hid");
            $("#mapBorder").addClass("hid");
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("列表展示");
        } else {
            $("#gridBorder").addClass("hid");
            $("#mapBorder").removeClass("hid");
            $("#chooseShowItemsBorder").slideUp("fast");
            $(".downuptxt").text("图形展示");
        }
        $("#chooseShowTxt").css("color","#585858");
        $("#chooseShowTxt>.downIcon").show();
        $("#chooseShowTxt>.upIcon").hide();
        chooseShow = false;
    });


    var lineTitle = ["运行","沉降","应力","偏航","振动","倾斜","腐蚀","基础冲刷","完整性","其他"];
    var lineTitleEn = ["YDSTATUS","CJSTATUS","YLSTATUS","PHSTATUS","ZDSTATUS","QXSTATUS","FSSTATUS","CSSTATUS","WZSTATUS","QTSTATUS"];


    function getAllGridData(state){
        //ajax请求滑动列表数据
        var requestData = {
            "DataBeaseID":AuthDB,
            "status":state
        };
        $.ajax({
            url: businessServerUrl + '/RunMode/WinPowerModeList.ashx',
            type: 'post',
            data: requestData,
            dataType: 'json',
            success: function(data) {
                console.log(JSON.stringify(data));
                if(data.ReturnInfo[0].Code == '1'){
                    //第一列
                    $("#dateLists").empty();

                    if(data.UserAreaData.length == 0){
                        $("#nodata").show();
                    } else {
                        $("#nodata").hide();
                    }

                    for(var i = 0 ; i < data.UserAreaData.length ; i++){

                        var count0 = 0;
                        var count1 = 0;
                        var count2 = 0;
                        for(var index = 0 ; index < lineTitleEn.length ; index++){
                            if(data.UserArea[i][lineTitleEn[index]] == "0"){
                                ++count0;
                            } else if(data.UserArea[i][lineTitleEn[index]] == "1"){
                                ++count1;
                            } else if(data.UserArea[i][lineTitleEn[index]] == "2"){
                                ++count2;
                            }
                        }

                        if(count2 > 0){
                            $("#dateLists").append("<tr><td style='color:#F17C7C'>"+data.UserAreaData[i].STATIONNAME+"</td></tr>");
                        } else if (count1 > 0) {
                            $("#dateLists").append("<tr><td style='color:#E9B11A'>"+data.UserAreaData[i].STATIONNAME+"</td></tr>");
                        } else if (count0 > 0) {
                            $("#dateLists").append("<tr><td>"+data.UserAreaData[i].STATIONNAME+"</td></tr>");
                        }

                        
                    }

                    //第一行
                    $("#thLists").empty();
                    for(var i = 0 ; i < lineTitle.length ; i++)
                        $("#thLists").append("<th>"+lineTitle[i]+"</th>");

                    //真实数据
                    $("#trueDateList").empty();
                    var resultDom = "";
                    for(var i = 0 ; i < data.UserArea.length ; i++){
                        resultDom = resultDom + "<tr>";
                        for(var index = 0 ; index < lineTitleEn.length ; index++){
                            if(data.UserArea[i][lineTitleEn[index]] == "0"){
                                resultDom = resultDom + "<td><div class=\"listItem\"><img src=\"./img/normal.png\"></div></td>";
                            } else if(data.UserArea[i][lineTitleEn[index]] == "1"){
                                resultDom = resultDom + "<td><div class=\"listItem\"><img src=\"./img/error.png\"></div></td>";
                            } else if(data.UserArea[i][lineTitleEn[index]] == "2"){
                                resultDom = resultDom + "<td><div class=\"listItem\"><img src=\"./img/stop.png\"></div></td>";
                            } else {

                            }
                        }
                        resultDom = resultDom + "</tr>";
                    }
                    $("#trueDateList").html(resultDom);

                    allDateInfo = data.UserAreaData;
                    allgridInfo = data.UserArea;

                    initlon = data.ReturnInfo[0].InitLon;
                    initlat = data.ReturnInfo[0].InitLat;

                    var tmpgcj = coordtransform.wgs84togcj02(initlon , initlat);
                    var tmpbd = coordtransform.gcj02tobd09(tmpgcj[0] , tmpgcj[1]);
                    initlon = tmpbd[0];
                    initlat = tmpbd[1];
                    
                    mp = new BMap.Map("mapBorder",{mapType:BMAP_HYBRID_MAP});//创建地图实例

                    mp.addControl(top_left_control);   

                    mp.centerAndZoom(new BMap.Point(initlon, initlat), 6);
                    //地图初始化，设置中心点坐标和地图级别。地图必须经过初始化才可以执行其他操作
                    mp.enableScrollWheelZoom();

                    //地图上加点
                    addMapPoint();

                    //-------------------------------固定操作-------------------------------
                    var win = $(window),
                    scrollAreaEl = $('.t_r_content'),
                    leftFreezeEl = $('.t_l_freeze'),
                    leftTableEl = leftFreezeEl.find('table'),
                    rightTableEl = $('.t_r_t table');

                    //动态计算容器最大高度
                    function adjustHeight() {
                        var winHeight = win.height(),
                            tableHeight = winHeight - 130;
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

                    window.YDUI.dialog.loading.close();

                } else {
                    window.YDUI.dialog.toast('刷新失败，接口报错！', 'error', 1000);
                }
            },
            error: function() {
                window.YDUI.dialog.toast('接口请求失败！', 'error', 1000);
            }
        });  
    }

    getAllGridData("all");


    function addMapPoint() {
        //先将地图上的所有控件全部删除
        mp.clearOverlays();

        for(var index = 0 ; index < allgridInfo.length ; index++){
            var lon = allgridInfo[index].lon;
            var lat = allgridInfo[index].lat;
            var rowguid = allgridInfo[index].ID;
            var state = allgridInfo[index].YDSTATUS;

            var runorstop = allgridInfo[index].YDSTATUS;

            //------------------------------------------GPS转百度------------------------------------------
            var tmpll = oldconvertWGStoBD(lon , lat);
            lon = tmpll[0];
            lat = tmpll[1];
            //------------------------------------------GPS转百度------------------------------------------

            var myMachine = new ComplexCustomOverlay(new BMap.Point(lon, lat) , rowguid , state , runorstop);
            //将标注添加到地图中
            mp.addOverlay(myMachine);
        }
    }

    function showTcWindow(rowguid){
        showWhichTc = rowguid;
        if(rowguid == "111" || rowguid == "222" || rowguid == "333"){
            rowguid = "1";
        }
        var tmpdom = "";
        for(var index = 0 ; index < allgridInfo.length ; index++){
            if(allgridInfo[index].ID == rowguid){
                for(var i = 0 ; i < lineTitleEn.length ; i++){
                    if(allgridInfo[index][lineTitleEn[i]] == "0"){
                        tmpdom = tmpdom + "<div class='tcContentItem'>"+lineTitle[i]+"状态：<span class='tcSuccess'>正常</span></div>";
                    } else if(allgridInfo[index][lineTitleEn[i]] == "1"){
                        tmpdom = tmpdom + "<div class='tcContentItem'>"+lineTitle[i]+"状态：<span class='tcError'>错误</span></div>";
                    } else if(allgridInfo[index][lineTitleEn[i]] == "2"){
                        tmpdom = tmpdom + "<div class='tcContentItem'>"+lineTitle[i]+"状态：<span class='tcStop'>缺测</span></div>";
                    }
                }
                break;
            }
        }
        $("#tanchuanContent").empty();
        $("#tanchuanContent").html(tmpdom);
        $("#AllMask").fadeIn();
        $("#tanchuan").fadeIn();
    }

    $("#lookforInfoBtn").click(function(){
        window.location.href = "./singleFan.html?rowguid="+showWhichTc + "&AuthDB=" + AuthDB;
    });
    
    $("#AllMask").click(function(){
        $("#AllMask").fadeOut();
        $("#tanchuan").fadeOut();
    });

    $("#closeIcon").click(function(){
        $("#AllMask").fadeOut();
        $("#tanchuan").fadeOut();
    });

    document.getElementById('AllMask').ontouchstart = function(e){
        e.preventDefault();
    }

    var showVConsole = Window.Config.showVConsole;
    if(showVConsole){
        document.write("<script src='../../js/libs/vconsole.min.js'><\/script>");
    }
    
}(jQuery);
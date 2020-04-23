// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    var $yyyymmdd = $ ( '.yyyymmdd' );
    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );
    var $startDatetimePicker = $ ( '#startDatetimePicker' );
    var $endDatetimePicker = $ ( '#endDatetimePicker' );

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDD, false, false );
    $yyyymmddFromDate.val ( localFromTodate.fromDate );
    $yyyymmddToDate.val ( localFromTodate.toDate );

    homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddFromDate, $yyyymmddToDate );

    $yyyymmdd.datetimepicker ().on (
            'changeDate',
            function ( event )
            {
                homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddFromDate,
                        $yyyymmddToDate );
            } );
}

// form element customize
function customizeForm ()
{
    // 조회기간
    var $dateType = $ ( '.customize_select2_type01' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    // 설비 요소 선택
    $ ( '#box1_equipment, #box2_equipment' ).select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var selectFlag1 = true;
    var selectFlag2 = true;

    // select event
    $ ( '#box1_equipment' ).on ( 'select2:open', function ( e )
    {
        if ( selectFlag1 )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            selectFlag1 = false;
        }
    } );

    $ ( '#box2_equipment' ).on ( 'select2:open', function ( e )
    {
        if ( selectFlag2 )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            selectFlag2 = false;
        }
    } );
}

// scroll customize
function customizeScroll ()
{
    // TODO 왜 사용하는지 확인 필요 - 정혜윤주임

    // custom scroll
    $ ( '.add_sel_list' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// init highcharts
function renderHighcharts ( series, yAxis, graphNum )
{
    if ( graphNum == 1 )
    {
        homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

        var yyyymmddFromDate = $ ( '#yyyymmdd_from_date' ).val ().replace ( /[-:\s]/g, '' );
        var yyyymmddToDate = $ ( '#yyyymmdd_to_date' ).val ().replace ( /[-:\s]/g, '' );

        var minDate = new Date ( parseInt ( yyyymmddFromDate.substring ( 0, 4 ), 10 ), parseInt ( yyyymmddFromDate
                .substring ( 4, 6 ), 10 ) - 1, parseInt ( yyyymmddFromDate.substring ( 6, 8 ), 10 ), 0, 0, 0 );
        var maxDate = new Date ( parseInt ( yyyymmddToDate.substring ( 0, 4 ), 10 ), parseInt ( yyyymmddToDate
                .substring ( 4, 6 ), 10 ) - 1, parseInt ( yyyymmddToDate.substring ( 6, 8 ), 10 ), 23, 59, 59 );

        // 그래프
        var chartOption = {
            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
            chart : {
                marginTop : 50,
                zoomType : 'x',
                panning : true,
                panKey : 'shift'
            },
            title : {
                text : '',
                style : {
                    display : 'none',
                }
            },
            subtitle : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            exporting : {
                enabled : false
            },
            credits : {
                enabled : false
            },
            xAxis : {
                type : 'datetime',
                // tickInterval : 24 * 3600 * 1000,
                labels : {
                    style : {
                        color : '#3c3c3c'
                    },
                    formatter : function ()
                    {
                        var date = homUtil.convertDateLongToString ( this.value, homUtil.dateFormat.convertHHMM );

                        return date;
                    }
                },
                min : minDate.getTime (),
                max : maxDate.getTime ()
            },
            yAxis : yAxis,
            tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM, staticVariable.decimalPoint ),
            plotOptions : {
                column : {
                    pointPadding : 0,
                    borderWidth : 0
                },
                line : {
                    marker : {
                        enabled : false
                    }
                }
            },
            series : series
        };

        $ ( '#graph1' ).highcharts ( chartOption );

    } else if ( graphNum == 2 )
    {
        homUtil.clearHighcharts ( [ $ ( '#graph2' ).highcharts () ] );

        var yyyymmddFromDate = $ ( '#yyyymmdd_from_date' ).val ().replace ( /[-:\s]/g, '' );
        var yyyymmddToDate = $ ( '#yyyymmdd_to_date' ).val ().replace ( /[-:\s]/g, '' );

        var minDate = new Date ( parseInt ( yyyymmddFromDate.substring ( 0, 4 ), 10 ), parseInt ( yyyymmddFromDate
                .substring ( 4, 6 ), 10 ) - 1, parseInt ( yyyymmddFromDate.substring ( 6, 8 ), 10 ), 0, 0, 0 );
        var maxDate = new Date ( parseInt ( yyyymmddToDate.substring ( 0, 4 ), 10 ), parseInt ( yyyymmddToDate
                .substring ( 4, 6 ), 10 ) - 1, parseInt ( yyyymmddToDate.substring ( 6, 8 ), 10 ), 23, 59, 59 );

        // 그래프2
        var chartOption = {
            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
            chart : {
                marginTop : 50,
                zoomType : 'x',
                panning : true,
                panKey : 'shift'
            },
            title : {
                text : '',
                style : {
                    display : 'none',
                }
            },
            subtitle : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            exporting : {
                enabled : false
            },
            credits : {
                enabled : false
            },
            xAxis : {
                type : 'datetime',
                // tickInterval : 24 * 3600 * 1000,
                labels : {
                    style : {
                        color : '#3c3c3c'
                    },
                    formatter : function ()
                    {
                        var date = homUtil.convertDateLongToString ( this.value, homUtil.dateFormat.convertHHMM );

                        return date;
                    }
                },
                min : minDate.getTime (),
                max : maxDate.getTime ()
            },
            yAxis : yAxis,
            tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM, staticVariable.decimalPoint ),
            plotOptions : {
                column : {
                    pointPadding : 0,
                    borderWidth : 0
                },
                line : {
                    marker : {
                        enabled : false
                    }
                }
            },
            series : series
        };

        $ ( '#graph2' ).highcharts ( chartOption );

    }

}

// 설비 Select 이벤트 초기화
function initEquipmentSelect ()
{
    var tpl = getTemplate ( templates.paramtrInfoOption );

    var $box1Parameter = $ ( '#box1_parameter' );
    $ ( '#box1_equipment' ).change ( function ( event )
    {
        var params = {
            eqmtId : $ ( ':selected', $ ( this ) ).val ()
        };
        getParamtrInfoList ( params, $box1Parameter, tpl );

        if ( $box1Parameter.find ( 'option' ).length > 1 )
        {
            $box1Parameter.find ( 'option' ).eq ( 0 ).prop ( "selected", "selected" ).trigger ( 'change' );
        } else
        {
            $box1Parameter.val ( '' ).trigger ( 'change' );
        }
    } );

    var $box2Parameter = $ ( '#box2_parameter' );
    $ ( '#box2_equipment' ).change ( function ( event )
    {
        var params = {
            eqmtId : $ ( ':selected', $ ( this ) ).val ()
        };

        getParamtrInfoList ( params, $box2Parameter, tpl );

        if ( $box2Parameter.find ( 'option' ).length > 1 )
        {
            $box2Parameter.find ( 'option' ).eq ( 0 ).prop ( "selected", "selected" ).trigger ( 'change' );
        } else
        {
            $box2Parameter.val ( '' ).trigger ( 'change' );
        }
    } );
}

// 파라미터 정보 가져오기
function getParamtrInfoList ( params, $selectParamtr, tpl )
{
    $.ajax ( {
        url : contextPath + '/hom/operation/trend/selectParameterList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_selection,
                        tagStdrInfoVOList : json.data
                    } );

                    $selectParamtr.empty ().html ( html );
                    // $selectParamtr.prop ( "selectedIndex", 1 ).trigger ( 'change' );
                }
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
}

// 설비/항목 추가 버튼 초기화
function initItemAddButton ()
{
    var tpl = getTemplate ( templates.itemInfoLi );

    $ ( '#btn_add_item01' ).on ( 'click', function ()
    {
        var $ulSelList = $ ( '#itemList1' );
        var $liSelList = $ulSelList.find ( 'li' );

        var searchArray = [];

        $liSelList.each ( function ()
        {
            var $this = $ ( this );

            searchArray.push ( $this.find ( '.tagIds' ).data ( 'tag-unit' ) );
        } );

        searchArray = _.uniq ( searchArray );

        if ( searchArray.length < 4 )
        {
            var addFlag = false;
            _.each ( $liSelList, function ( li )
            {
                if ( $ ( li ).find ( '.tagIds' ).val () === $ ( ':selected', $ ( '#box1_parameter' ) ).val () )
                {
                    $locationLi = $ ( li );
                    addFlag = true;
                    return true;
                }
            } );

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertDataExists,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                if ( tpl !== null )
                {
                    var $box1Equipment = $ ( '#box1_equipment option:selected' );
                    var $box1Parameter = $ ( '#box1_parameter option:selected' );

                    var template = _.template ( tpl );
                    var html = template ( {
                        eqmtNm : $box1Equipment.html (),
                        paramtrNm : $box1Parameter.html (),
                        tagId : $box1Parameter.val (),
                        tagUnit : $box1Parameter.data ( 'tag-unit' )
                    } );
                    $ulSelList.append ( html );
                }
            }
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertCanNotAdd,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }

    } );

    $ ( '#btn_add_item02' ).on ( 'click', function ()
    {
        var $ulSelList = $ ( '#itemList2' );
        var $liSelList = $ulSelList.find ( 'li' );

        var searchArray = [];

        $liSelList.each ( function ()
        {
            var $this = $ ( this );

            searchArray.push ( $this.find ( '.tagIds' ).data ( 'tag-unit' ) );
        } );

        searchArray = _.uniq ( searchArray );

        if ( searchArray.length < 4 )
        {
            var addFlag = false;
            _.each ( $liSelList, function ( li )
            {
                if ( $ ( li ).find ( '.tagIds' ).val () === $ ( ':selected', $ ( '#box2_parameter' ) ).val () )
                {
                    $locationLi = $ ( li );
                    addFlag = true;
                    return true;
                }
            } );

            // 이미 등록되어 있는 경우 처리
            if ( addFlag )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertDataExists,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                if ( tpl !== null )
                {
                    var $box2Equipment = $ ( '#box2_equipment option:selected' );
                    var $box2Parameter = $ ( '#box2_parameter option:selected' );

                    var template = _.template ( tpl );
                    var html = template ( {
                        eqmtNm : $box2Equipment.html (),
                        paramtrNm : $box2Parameter.html (),
                        tagId : $box2Parameter.val (),
                        tagUnit : $box2Parameter.data ( 'tag-unit' )
                    } );
                    $ulSelList.append ( html );
                }
            }
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertCanNotAdd,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }

    } );
}

// 삭제 버튼
function initDeleteButton ()
{
    $ ( document ).on ( 'click', '.del_item', function ()
    {
        $ ( this ).closest ( 'li' ).remove ();
    } );
}

// Trend 조회
function searchTrend ()
{
    $ ( '#btn_search' ).on ( 'click', function ()
    {
        var tagIdArray = [];
        $ ( "#itemList1" ).find ( "input[name=tagIds]" ).each ( function ()
        {
            tagIdArray.push ( $ ( this ).val () );
        } );
        searchData ( tagIdArray, 1 );

        var $secondaryChart = $ ( '.gph_add_wrap .search_scont' );

        if ( !$secondaryChart.hasClass ( 'dnone' ) )
        {
            var tagIdArray2 = [];
            $ ( "#itemList2" ).find ( "input[name=tagIds]" ).each ( function ()
            {
                tagIdArray2.push ( $ ( this ).val () );
            } );

            $ ( '#graph2Title' ).show ();
            $ ( '#graph2' ).parent ().show ();
            $ ( '#graph2NoData' ).hide ();

            searchData ( tagIdArray2, 2 );

            $ ( "#graph1" ).parent ().removeClass ( 'full' );

        } else
        {
            $ ( "#graph1" ).parent ().addClass ( 'full' );
            $ ( '#graph2Title' ).hide ();
            $ ( '#graph2' ).parent ().hide ();
            // $ ( '#graph2NoData' ).hide ();
        }
    } );
}

// 그래프 데이터 조회
function searchData ( tagIdArray, graphNum )
{
    var yyyymmddFromDate = $ ( '#yyyymmdd_from_date' ).val ();
    var yyyymmddToDate = $ ( '#yyyymmdd_to_date' ).val ();

    var tagParam = new Object ();
    tagParam.tagIds = tagIdArray;

    var params = {
        fromDate : yyyymmddFromDate + ' 00:00:00',
        toDate : yyyymmddToDate + ' 23:59:59',
        jsonData : JSON.stringify ( tagParam )
    };

    $.ajax ( {
        url : contextPath + '/hom/operation/trend/selectGraphData.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var searchInterval = yyyymmddFromDate + "~" + yyyymmddToDate;
                $ ( "#searchIntervalResult1" ).html ( searchInterval );
                $ ( "#searchIntervalResult2" ).html ( searchInterval );

                var series = [];
                var yAxis = [];
                var chkData = 0;

                var tagUnitValUniq = _.uniq ( _.pluck ( json.data, 'tagUnitVal' ) );
                var tagUnitValMap = new Map ();
                _.each ( tagUnitValUniq, function ( val, i )
                {
                    if ( val === null || val === '' )
                    {
                        val = '-';
                    }
                    var valInfo = {
                        index : i,
                        flag : false
                    // yAxis에 쓰여졌는지 여부
                    };
                    tagUnitValMap.put ( val, valInfo );
                } );

                _.each ( json.data, function ( seiresData, i )
                {
                    var tagUnitVal = seiresData.tagUnitVal;
                    if ( tagUnitVal === null || tagUnitVal === '' )
                    {
                        tagUnitVal = '-';
                    }

                    var valInfo = tagUnitValMap.get ( tagUnitVal );
                    if ( !valInfo.flag )
                    {
                        yAxis.push ( {
                            opposite : valInfo.index != 0,
                            title : {
                                text : seiresData.paramtrVal + '(' + tagUnitVal + ')'
                            }
                        } );
                        valInfo.flag = true;
                    } else
                    {
                        var title = yAxis[valInfo.index].title.text.split ( '(' )[0];

                        if ( title !== seiresData.paramtrVal )
                        {
                            yAxis[valInfo.index].title = {
                                text : title + ', ' + seiresData.paramtrVal + '(' + tagUnitVal + ')'
                            };
                        }
                    }

                    var data = [];
                    _.each ( seiresData.eqmtTrendValues, function ( eqmtTrendValue, i )
                    {
                        data.push ( [ homUtil.convertDateStringToLong ( eqmtTrendValue.occrrncDt ),
                                homUtil.mathRoundChart ( eqmtTrendValue.tagVal, staticVariable.decimalPoint ) ] );
                        chkData++;
                    } );

                    series.push ( {
                        type : 'line',
                        yAxis : valInfo.index,
                        name : seiresData.eqmtNm + seiresData.paramtrVal,
                        data : data
                    } );
                } );

                if ( graphNum == 1 )
                {
                    if ( chkData > 0 )
                    {
                        $ ( '#graph1' ).show ();
                        $ ( '#graph1NoData' ).hide ();
                        renderHighcharts ( series, yAxis, graphNum );
                    } else
                    {
                        $ ( '#graph1' ).hide ();
                        $ ( '#graph1NoData' ).show ();

                    }
                } else if ( graphNum == 2 )
                {
                    if ( chkData > 0 )
                    {
                        $ ( '#graph2' ).show ().parent ().show ();
                        $ ( '#graph2NoData' ).hide ();
                        renderHighcharts ( series, yAxis, graphNum );
                    } else
                    {
                        $ ( '#graph2' ).hide ().parent ().show ();
                        $ ( '#graph2NoData' ).show ();
                    }
                }

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        },
        error : function ( xhr, textStatus, error )
        {
            // abort error not show(user request cancel or aborted)
            if ( !(xhr.status === 0 || xhr.readyState === 0) )
            {
                if ( xhr.status === homConstants.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else if ( xhr.status === homConstants.statusNoPermission )
                {
                    location.href = contextPath + '/page/forbidden.do';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
            }
        }
    } );
}

// 그래프 추가 버튼 초기화
function initGraphToggleButton ()
{
    $ ( '#btn_graph_toggle' ).on ( 'click', function ()
    {
        var $this = $ ( this );
        var $searchScontDiv = $this.parent ().find ( 'div.search_scont' );
        if ( $searchScontDiv.hasClass ( 'dnone' ) )
        {
            $this.addClass ( 'selected' );
            $this.html ( i18nMessage.msg_graphClose + "<i class='icon_add02'></i>" );

            $searchScontDiv.removeClass ( 'dnone' )

        } else
        {
            $this.removeClass ( 'selected' );
            $this.html ( i18nMessage.msg_graphAdd + "<i class='icon_add02'></i>" );

            $searchScontDiv.addClass ( 'dnone' )
        }

    } );
}

// trend 엑셀 다운로드
function downloadTrendExcel ()
{
    // 엑셀 다운로드 버튼 이벤트
    $ ( '#btn_excel1' ).click ( function ()
    {
        // var optionsStr = JSON.stringify ( chartOption );
        var optionsStr = JSON.stringify ( $ ( '#graph1' ).highcharts ().userOptions );
        var $graph = $ ( '#graph' );
        // var dataString = encodeURI ( 'async=true&type=png&width=' + $graph.width () + '&options=' + optionsStr );
        var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

        var tagIdArray = [];
        $ ( "#itemList1" ).find ( "input[name=tagIds]" ).each ( function ()
        {
            tagIdArray.push ( $ ( this ).val () );
        } );

        var yyyymmddFromDate = $ ( '#yyyymmdd_from_date' ).val () + ' 00:00:00';
        var yyyymmddToDate = $ ( '#yyyymmdd_to_date' ).val () + ' 23:59:59';

        $.ajax ( {
            type : 'POST',
            data : dataString,
            url : staticVariable.exportUrl,
            success : function ( data )
            {
                // 엑셀 다운로드 함수 호출
                downloadExcel ( staticVariable.exportUrl + data, yyyymmddFromDate, yyyymmddToDate, tagIdArray );
            },
            error : function ( xhr, textStatus, error )
            {
                // abort error not show(user request cancel or aborted)
                if ( !(xhr.status === 0 || xhr.readyState === 0) )
                {
                    if ( xhr.status === homConstants.statusUnapproved )
                    {
                        location.href = contextPath + '/login.do?session=true';
                    } else if ( xhr.status === homConstants.statusNoPermission )
                    {
                        location.href = contextPath + '/page/forbidden.do';
                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertServerError,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }
                }
            }
        } );
    } );

    // 엑셀 다운로드 버튼 클릭 이벤트
    $ ( '#btn_excel2' ).click ( function ()
    {
        // var optionsStr = JSON.stringify ( chartOption );
        var optionsStr = JSON.stringify ( $ ( '#graph2' ).highcharts ().userOptions );
        var $graph = $ ( '#graph' );
        // var dataString = encodeURI ( 'async=true&type=png&width=' + $graph.width () + '&options=' + optionsStr );
        var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

        var tagIdArray = [];
        $ ( "#itemList2" ).find ( "input[name=tagIds]" ).each ( function ()
        {
            tagIdArray.push ( $ ( this ).val () );
        } );

        var yyyymmddFromDate = $ ( '#yyyymmdd_from_date' ).val () + ' 00:00:00';
        var yyyymmddToDate = $ ( '#yyyymmdd_to_date' ).val () + ' 23:59:59';

        $.ajax ( {
            type : 'POST',
            data : dataString,
            url : staticVariable.exportUrl,
            success : function ( data )
            {
                // 엑셀 다운로드 함수 호출
                downloadExcel ( staticVariable.exportUrl + data, yyyymmddFromDate, yyyymmddToDate, tagIdArray );
            },
            error : function ( xhr, textStatus, error )
            {
                // abort error not show(user request cancel or aborted)
                if ( !(xhr.status === 0 || xhr.readyState === 0) )
                {
                    if ( xhr.status === homConstants.statusUnapproved )
                    {
                        location.href = contextPath + '/login.do?session=true';
                    } else if ( xhr.status === homConstants.statusNoPermission )
                    {
                        location.href = contextPath + '/page/forbidden.do';
                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertServerError,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }
                }
            }
        } );
    } );

    // 엑셀 다운로드 요청
    function downloadExcel ( url, fromDate, toDate, tagIdArray )
    {
        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        $ (
                '<form action="' + contextPath
                        + '/hom/excel/opertn/trend/download.do" method="post"><input type="hidden" name="url" value="'
                        + url + '" /><input type="hidden" name="fromDate" value="' + fromDate
                        + '" /><input type="hidden" name="toDate" value="' + toDate
                        + '" /><input type="hidden" name="tagIds" value="' + tagIdArray.toString () + '" />'
                        + '<input type="hidden" name="menuName" value="' + menuName + '" /></form>' )
                .appendTo ( 'body' ).submit ().remove ();
    }
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    customizeScroll ();
    initEquipmentSelect ();
    initItemAddButton ();
    initDeleteButton ();
    initGraphToggleButton ();
    searchTrend ();
    downloadTrendExcel ();
} );
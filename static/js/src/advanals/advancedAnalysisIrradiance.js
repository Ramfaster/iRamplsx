var analysisIrradiance = null;
var columnChartListMap;
var chartImgInfoMap;
// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    $ ( '#search_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    $selectDateType.on ( 'change', function ()
    {
        var selectedDateType = $ ( this ).val ();
        var className = null;

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
}

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0y'
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0m'
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        endDate : '+0d'
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.irradiation_scrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 일사량 조회
function searchRdtn ()
{
    var $gridList1 = $ ( '#gridList1' );
    var $gridList2 = $ ( '#gridList2' );
    var $searchPeriod = $ ( '#search_period' );
    var $pageType = $ ( '#pageType' );

    if ( $pageType.val () == staticVariable.pagetypePowerStation )
    {
        // 발전소(powerstation) 선택 시
        $ ( '#rankPcName' ).val ( 'P1' );
        $ ( '#rdtnPcName' ).val ( 'P2' );
        $ ( '#radio1' ).prop ( 'checked', true ).trigger ( 'change' );
        $ ( '#radio2' ).prop ( 'checked', false ).trigger ( 'change' );
    } else
    {
        // 국가 선택시(nation)
        $ ( '#rankPcName' ).val ( 'P3' );
        $ ( '#rdtnPcName' ).val ( 'P4' );
        $ ( '#radio1' ).prop ( 'checked', false ).trigger ( 'change' );
        $ ( '#radio2' ).prop ( 'checked', true ).trigger ( 'change' );
    }

    var tpl = getTemplate ( templates.noData );
    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var retrieveTypeValue = $ ( "#search_type" ).val ();

        if ( $pageType.val () != retrieveTypeValue )
        {

            var url = contextPath + '/hom/advancedanalysis/radiation/list.do';
            var param = '?pageType=' + retrieveTypeValue;
            location.href = url + param;

        } else
        {
            var selectDateType = $ ( '#select_date_type' ).val ();
            var className = null;

            if ( selectDateType === homConstants.dateTypeYYYYMMDD )
            {
                className = staticVariable.formatYYYYMMDD;
            } else if ( selectDateType === homConstants.dateTypeYYYYMM )
            {
                className = staticVariable.formatYYYYMM;
            } else if ( selectDateType === homConstants.dateTypeYYYY )
            {
                className = staticVariable.formatYYYY;
            }

            var fromDate = $ ( '#' + className + '_from_date' ).val ();
            var toDate = $ ( '#' + className + '_to_date' ).val ();
            var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
            var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

            if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
            {
                return;
            }
            setSearchParameter ( pureFromDate, pureToDate );

            // 일사량 차트 조회
            if ( $pageType.val () == staticVariable.pagetypePowerStation )
            {
                // 발전소 선택시 - 차트, 그리드 조회
                //TODO
                //searchRdtnPvChart ();

                // 일사량 Grid 조회
                if ( initFlag )
                {
                    searchRdtnPvJqgrid1 ( $gridList1, tpl );
                    searchRdtnPvJqgrid2 ( $gridList2, tpl );
                } else
                {
                    reloadRdtnPvJqgrid1 ( $gridList1 );
                    reloadRdtnPvJqgrid2 ( $gridList2 );
                }
            } else
            {
                // 국가 선택시 - 차트, 그리드 조회
                //TODO 그리드 데이터 이용.
                //searchRdtnNationChart ();

                // 일사량 Grid 조회
                if ( initFlag )
                {
                    searchRdtnNationJqgrid1 ( $gridList1, tpl );
                    searchRdtnNationJqgrid2 ( $gridList2, tpl );
                } else
                {
                    reloadRdtnNationJqgrid1 ( $gridList1 );
                    reloadRdtnNationJqgrid2 ( $gridList2 );
                }
            }
        }
    } );
}

// 발전소별 목표 일사량 비율  차트  - 발전소 기준(기간별) : SP_RDTN_ANALS_ADVAN_P1_ACNTID 이용.
function searchRdtnPvChart (data)
{
   
    
    var $graph1 = $ ( '#graph1' );
    var $graph2 = $ ( '#graph2' );
    var $graph3 = $ ( '#graph3' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid1 = $ ( '#btn_all_jqgrid1' );
    var $btnAllJqgrid2 = $ ( '#btn_all_jqgrid2' );
    var $unitBox = $ ( '#unit_box' );
    
    // 기존 차트 삭제
    homUtil.clearHighcharts ( [ $graph2.highcharts () ] );
    
    

                if ( data.records > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid1.show ();
                    $btnAllJqgrid2.show ();
                    $unitBox.show ();

                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    // Chart 데이터 : 발전소별 목표 일사량 비율 파이 Chart
                    var seriesArray = [];

                    $.each ( data.rows, function ( index, item )
                    {
                        var pvId = item.pvId;
                        // 막대(Column)차트로 발전소 별 실적일사량 비율 생성
                        /*
                        if ( pvId )
                        {
                            //searchRdtnColumnPvChart ( pvId, json.data.length );
                        }
                        */
                        var rdtnSeris = {
                            name : item.pvNm,
                            y : homUtil.mathFloor ( item.goalRatio, staticVariable.decimalPoint )
                            //y : homUtil.mathFloor ( item.acmsltRatio, staticVariable.decimalPoint )
                        };
                        seriesArray.push ( rdtnSeris );                            

                    } );

                    $graph2
                            .highcharts ( {
                                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                                chart : {
                                    plotBackgroundColor : null,
                                    plotBorderWidth : null,
                                    plotShadow : false,
                                    type : 'pie'
                                },
                                legend : {
                                    align : 'right',
                                    verticalAlign : 'middle',
                                    layout : 'vertical',
                                    x : 0,
                                    y : 0
                                },
                                credits : {
                                    enabled : false
                                },
                                tooltip : {
                                    formatter : function ()
                                    {
                                        return '<span style="color:'
                                                + this.color
                                                + '">\u25CF</span> '
                                                + this.key
                                                + ' : '
                                                + homUtil
                                                        .mathFloorComma ( this.percentage, staticVariable.decimalPoint )
                                                + '%';
                                    }
                                },
                                title : {
                                    text : '',
                                    style : {
                                        display : 'none'
                                    }
                                },
                                plotOptions : {
                                    pie : {
                                        size : '80%',
                                        borderWidth : 0,
                                        allowPointSelect : true,
                                        cursor : 'pointer',
                                        dataLabels : {
                                            enabled : false
                                        },
                                        showInLegend : true
                                    }
                                },
                                series : [ {
                                    name : i18nMessage.msg_electricPowerStationRadiationTotalRate,
                                    colorByPoint : true,
                                    data : seriesArray
                                } ]
                            } );
                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                    $graph2.html ( noDataMsg );
                    $graph3.html ( noDataMsg );
                }

}

// 국가별  일사량 차트(rank) : $graph2
function searchRdtnNationChart (data)
{
    var $graph1 = $ ( '#graph1' );
    var $graph2 = $ ( '#graph2' );
    var $graph3 = $ ( '#graph3' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid1 = $ ( '#btn_all_jqgrid1' );
    var $btnAllJqgrid2 = $ ( '#btn_all_jqgrid2' );
    var $unitBox = $ ( '#unit_box' );

                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph2.highcharts () ] );

                if ( data.records > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid1.show ();
                    $btnAllJqgrid2.show ();
                    $unitBox.show ();

                    // Chart 데이터
                    var seriesArray = [];

                    $.each ( data.rows, function ( index, item )
                    {
                        // 막대(Column)차트로 국가 별 실적일사량 비율 생성
                        var nationId = item.nationId;
                        var nationNm = item.nationNm;

                        var rdtnSeris = {
                            name : item.nationNm,
                            y : homUtil.mathFloor ( item.acmsltRatio, staticVariable.decimalPoint )
                        };
                        seriesArray.push ( rdtnSeris );
                    } );

                    $graph2
                            .highcharts ( {
                                chart : {
                                    plotBackgroundColor : null,
                                    plotBorderWidth : null,
                                    plotShadow : false,
                                    type : 'pie'
                                },
                                legend : {
                                    align : 'right',
                                    verticalAlign : 'middle',
                                    layout : 'vertical',
                                    x : 0,
                                    y : 0
                                },
                                credits : {
                                    enabled : false
                                },
                                tooltip : {
                                    formatter : function ()
                                    {
                                        return '<span style="color:'
                                                + this.color
                                                + '">\u25CF</span> '
                                                + this.key
                                                + ' : '
                                                + homUtil
                                                        .mathFloorComma ( this.percentage, staticVariable.decimalPoint )
                                                + '%';
                                    }
                                },
                                title : {
                                    text : '',
                                    style : {
                                        display : 'none'
                                    }
                                },
                                plotOptions : {
                                    pie : {
                                        size : '80%',
                                        borderWidth : 0,
                                        allowPointSelect : true,
                                        cursor : 'pointer',
                                        dataLabels : {
                                            enabled : false
                                        },
                                        showInLegend : true
                                    }
                                },
                                series : [ {
                                    name : i18nMessage.msg_radiationNationRadiationTotalRate,
                                    colorByPoint : true,
                                    data : seriesArray
                                } ]
                            } );
                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                    $graph2.html ( noDataMsg );
                    $graph3.html ( noDataMsg );
                }
}

// 기간별 발전소 별 컬럼 차트
function searchRdtnColumnPvChart ( data )
{
    var $graph1 = $ ( '#graph1' );
    var $graph3 = $ ( '#graph3' );

    homUtil.clearHighcharts ( [ $graph1.highcharts () ] );
    homUtil.clearHighcharts ( [ $graph3.highcharts () ] );
    
                if ( data.records > 0 )
                {
                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }
                    
                    var acmsltRatioArray = [];
                    var acmsltRatioMinArray = [];
                    var seriesArray = [];
                    
                    // 라인그래프
                    var seriesLineArray = [];  
                    // 라인그래프  UnitNm
                    var lineRdtnUnitNm;
                    var acmsltValMinArray = [];                    

                    $.each ( data.rows, function ( index, item )
                    {
                        if ( index == 0 )
                        {
                            lineRdtnUnitNm = item.rdtnUnitNm;
                        }

                        
                        acmsltRatioMinArray.push ( item.acmsltRatio );

                        acmsltRatioArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            acmsltRatio : homUtil.mathFloor ( item.acmsltRatio ),
                            acmsltVal : item.acmsltVal,                            
                            pvId : item.pvId,
                            pvNm : item.pvNm
                        } );
                    } );

                    var pvIdArray = _.uniq ( _.pluck ( acmsltRatioArray, 'pvId' ) );

                    _.each ( pvIdArray, function ( pvId )
                    {
                        var plantRatioArray = _.where ( acmsltRatioArray, {
                            pvId : pvId
                        } );

                        var dataArray = [];
                        var dataArray_graph3 = [];
                        
                        var seriesName = '';

                        if ( plantRatioArray != null && plantRatioArray.length > 0 )
                        {
                            seriesName = plantRatioArray[0].pvNm;
                        }

                        _.each ( plantRatioArray, function ( plantRatio )
                        {
                            dataArray.push ( [ plantRatio.targetDate, plantRatio.acmsltRatio ] );
                            
                            dataArray_graph3.push ( [ plantRatio.targetDate, plantRatio.acmsltVal ] );                            
                        } );
                        

                        seriesArray.push ( {
                            type : 'column',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray
                        } );
                        
                        seriesLineArray.push ( {
                            type : 'line',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray_graph3
                        } );

                        
                    } );
                          

                    var yAxis = {
                            title : {
                                text : i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' )
                            }
                        }
                    
                    var rdtnLineYaxis = {
                            title : {
                                text : i18nMessage.msg_rdtn
                                        + homUtil.wrapWord ( lineRdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' )
                            }
                        };
                    

                    if ( _.min ( acmsltRatioMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }
                    
                    //라인그래프
                    var yAxisLineArray = [];
                    yAxisLineArray.push ( rdtnLineYaxis );
                    

                        $graph1.highcharts ( {
                            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                            chart : {
                                marginTop : 30,
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
                                labels : {
                                    style : {
                                        color : '#3c3c3c'
                                    },
                                    formatter : function ()
                                    {
                                        var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                        dateXAxis = dateXAxis.replace ( / /g, '<br />' );

                                        return dateXAxis;
                                    }
                                }
                            },
                            yAxis : yAxis,
                            tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                            legend : {
                                align : 'right',
                                verticalAlign : 'top',
                                layout : 'vertical',
                                x : 0,
                                y : 15
                            },
                            plotOptions : {
                                column : {
                                    pointPadding : 0.25,
                                    borderWidth : 0,
                                    stacking : 'normal'
                                }
                            },
                            series : seriesArray
                        } );

                        // 일사량 현황 - 실적 일사량 (라인 차트)

                        $graph3.highcharts ( {
                            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                            chart : {
                                marginTop : 30,
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
                                labels : {
                                    style : {
                                        color : '#3c3c3c'
                                    },
                                    formatter : function ()
                                    {
                                        var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                        dateXAxis = dateXAxis.replace ( / /g, '<br />' );

                                        return dateXAxis;
                                    }
                                }
                            },
                            yAxis : yAxisLineArray,
                            tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                            plotOptions : {
                                line : {
                                    pointPadding : 0,
                                    borderWidth : 0,
                                    lineWidth : 1,
                                    marker : {
                                        enabled : false
                                    }
                                },
                                column : {
                                    pointPadding : 0.4
                                }
                            },
                            legend : {
                                align : 'right',
                                verticalAlign : 'top',
                                layout : 'vertical',
                                x : 0,
                                y : 15
                            },
                            
                            series : seriesLineArray
                        } );

                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                    $graph3.html ( noDataMsg );
                }
}


//기간별 국가 별 컬럼 차트
function searchRdtnColumnNationChart ( data )
{
    var $graph1 = $ ( '#graph1' );
    var $graph3 = $ ( '#graph3' );

    homUtil.clearHighcharts ( [ $graph1.highcharts () ] );
    homUtil.clearHighcharts ( [ $graph3.highcharts () ] );
    
                if ( data.records > 0 )
                {
                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }
                    
                    var acmsltRatioArray = [];
                    var acmsltRatioMinArray = [];
                    var seriesArray = [];
                    
                    // 라인그래프
                    var seriesLineArray = [];  
                    // 라인그래프  UnitNm
                    var lineRdtnUnitNm;
                    var acmsltValMinArray = [];                    

                    $.each ( data.rows, function ( index, item )
                    {
                        if ( index == 0 )
                        {
                            lineRdtnUnitNm = item.rdtnUnitNm;
                        }

                        
                        acmsltRatioMinArray.push ( item.acmsltRatio );

                        acmsltRatioArray.push ( {
                            targetDate : homUtil.convertDateStringToLong ( item.pureDate ),
                            acmsltRatio : homUtil.mathFloor ( item.acmsltRatio ),
                            acmsltVal : item.acmsltVal,                            
                            nationId : item.nationId,
                            nationNm : item.nationNm
                        } );
                    } );

                    var nationIdArray = _.uniq ( _.pluck ( acmsltRatioArray, 'nationId' ) );

                    _.each ( nationIdArray, function ( nationId )
                    {
                        var nationRatioArray = _.where ( acmsltRatioArray, {
                            nationId : nationId
                        } );

                        var dataArray = [];
                        var dataArray_graph3 = [];
                        
                        var seriesName = '';

                        if ( nationRatioArray != null && nationRatioArray.length > 0 )
                        {
                            seriesName = nationRatioArray[0].nationNm;
                        }

                        _.each ( nationRatioArray, function ( plantRatio )
                        {
                            dataArray.push ( [ plantRatio.targetDate, plantRatio.acmsltRatio ] );
                            
                            dataArray_graph3.push ( [ plantRatio.targetDate, plantRatio.acmsltVal ] );                            
                        } );
                        

                        seriesArray.push ( {
                            type : 'column',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray
                        } );
                        
                        seriesLineArray.push ( {
                            type : 'line',
                            yAxis : 0,
                            name : seriesName,
                            data : dataArray_graph3
                        } );

                        
                    } );
                          

                    var yAxis = {
                            title : {
                                text : i18nMessage.msg_ratio + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' )
                            }
                        }
                    
                    var rdtnLineYaxis = {
                            title : {
                                text : i18nMessage.msg_rdtn
                                        + homUtil.wrapWord ( lineRdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' )
                            }
                        };
                    

                    if ( _.min ( acmsltRatioMinArray ) > 0 )
                    {
                        yAxis.min = 0;
                    }
                    
                    //라인그래프
                    var yAxisLineArray = [];
                    yAxisLineArray.push ( rdtnLineYaxis );
                    

                        $graph1.highcharts ( {
                            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                            chart : {
                                marginTop : 30,
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
                                labels : {
                                    style : {
                                        color : '#3c3c3c'
                                    },
                                    formatter : function ()
                                    {
                                        var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                        dateXAxis = dateXAxis.replace ( / /g, '<br />' );

                                        return dateXAxis;
                                    }
                                }
                            },
                            yAxis : yAxis,
                            tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                            legend : {
                                align : 'right',
                                verticalAlign : 'top',
                                layout : 'vertical',
                                x : 0,
                                y : 15
                            },
                            plotOptions : {
                                column : {
                                    pointPadding : 0.25,
                                    borderWidth : 0,
                                    stacking : 'normal'
                                }
                            },
                            series : seriesArray
                        } );

                        // 일사량 현황 - 실적 일사량 (라인 차트)

                        $graph3.highcharts ( {
                            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                            chart : {
                                marginTop : 30,
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
                                labels : {
                                    style : {
                                        color : '#3c3c3c'
                                    },
                                    formatter : function ()
                                    {
                                        var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                                        dateXAxis = dateXAxis.replace ( / /g, '<br />' );

                                        return dateXAxis;
                                    }
                                }
                            },
                            yAxis : yAxisLineArray,
                            tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                            plotOptions : {
                                line : {
                                    pointPadding : 0,
                                    borderWidth : 0,
                                    lineWidth : 1,
                                    marker : {
                                        enabled : false
                                    }
                                },
                                column : {
                                    pointPadding : 0.4
                                }
                            },
                            legend : {
                                align : 'right',
                                verticalAlign : 'top',
                                layout : 'vertical',
                                x : 0,
                                y : 15
                            },
                            
                            series : seriesLineArray
                        } );

                } else
                {
                    var noDataMsg = '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>';
                    $graph1.html ( noDataMsg );
                    $graph3.html ( noDataMsg );
                }
}



// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회
function searchRdtnPvJqgrid1 ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();

    var noDataId = 'rdtn_pv_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnPvRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_pvName, i18nMessage.msg_area,
                i18nMessage.msg_targetRadiation, i18nMessage.msg_targetRadiationRate + '(%)',
                i18nMessage.msg_radiation, i18nMessage.msg_radiationRate + '(%)', i18nMessage.msg_gap + '(%)',
                'rdtnUnitNm' ],
        colModel : [
                {
                    name : 'rank',
                    align : 'center',
                    width : '50',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'pvNm',
                    align : 'left',
                    width : '275',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'areaNm',
                    align : 'left',
                    width : '160',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalRdtn',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'goalRatio',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltRdtn',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltRatio',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'diffVal',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                } ],
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount1' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }
            updateJqgridPvHeader1 ( $gridList, dateType );
            
            //TODO
            searchRdtnPvChart(data);
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnPvJqgrid1 ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();
    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridPvHeader1 ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        var goalRdtn = i18nMessage.msg_targetRadiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_radiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );

        $ ( '#gridList1_goalRdtn' ).html ( goalRdtn );
        $ ( '#gridList1_acmsltRdtn' ).html ( acmsltRdtn );
    }

    var rank = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        $gridList.jqGrid ( 'setCell', ids[i], 'rank', rank++ );
    }
}

// 일사량 (합, 실적, 비율) jqgrid 조회(초기 세팅 및 조회) : 기간별 일사량 그리드 . SP_RDTN_ANALS_ADVAN_P2_ACNTID 이용.
function searchRdtnPvJqgrid2 ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnPvDailyList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_area, i18nMessage.msg_sum,
                i18nMessage.msg_acmslt, i18nMessage.msg_rate, 'rdtnUnitNm' ],
        colModel : [ {
            name : 'statsDt',
            align : 'center',
            width : '155',
            fixed : true,
            sortable : false
        }, {
            name : 'pvNm',
            align : 'left',
            width : '335',
            fixed : true,
            sortable : false
        }, {
            name : 'areaNm',
            align : 'left',
            width : '160',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '180',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        } ],
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount2' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridPvHeader2 ( $gridList, dateType );
            
            //TODO
            //기간별 발전소별 일사량 비율 파이 챠트. graph1
            searchRdtnColumnPvChart(data);
            
        },
        gridComplete : function ()
        {
            console.log ( 'gridComplete' );
            $gridList.rowspan ( 1, 1 );
            $gridList.rowspan ( 3, 3 );
            $gridList.rowspan ( 4, 4 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );
        $gridList.parent ().append ( html );
    }

    mergeJqgridPvHeader2 ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnPvJqgrid2 ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridPvHeader2 ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        $ ( '#gridList2_areaNm' ).next ().text (
                i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' ) );
    }
}

// 헤더 병합
function mergeJqgridPvHeader2 ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_radiation
        } ]
    } );
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회
function searchRdtnNationJqgrid1 ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();

    var noDataId = 'radiation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnNationRankList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_rank, i18nMessage.msg_nation, i18nMessage.msg_pvCount,
                i18nMessage.msg_targetRadiation, i18nMessage.msg_targetRadiationRate + '(%)',
                i18nMessage.msg_radiation, i18nMessage.msg_radiationRate + '(%)', i18nMessage.msg_gap + '(%)',
                'rdtnUnitNm' ],
        colModel : [
                {
                    name : 'rank',
                    align : 'center',
                    width : '50',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'nationNm',
                    align : 'center',
                    width : '275',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'pvCnt',
                    align : 'center',
                    width : '160',
                    fixed : true,
                    sortable : false
                },
                {
                    name : 'goalRdtn',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'goalRatio',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltRdtn',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltRatio',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'diffVal',
                    align : 'right',
                    width : '150',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject, staticVariable.decimalPoint );                        
                    }
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                } ],
        rownumbers : false,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount1' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridNationHeader1 ( $gridList, dateType );
            
            //graph2 chart
            searchRdtnNationChart(data);
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 (순위, 일사량, 일사량 비율 등) jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnNationJqgrid1 ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rankPcName' ).val ();
    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridNationHeader1 ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        var goalRdtn = i18nMessage.msg_targetRadiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_radiation + '<br/>'
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );

        $ ( '#gridList1_goalRdtn' ).html ( goalRdtn );
        $ ( '#gridList1_acmsltRdtn' ).html ( acmsltRdtn );
    }

    var rank = 1;
    for ( var i = 0; i < ids.length; i++ )
    {
        $gridList.jqGrid ( 'setCell', ids[i], 'rank', rank++ );
    }
}

// 일사량 (합, 실적, 비율) jqgrid 조회(초기 세팅 및 조회)
function searchRdtnNationJqgrid2 ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();
    var noDataId = 'rdtn_nation_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/advancedanalysis/radiation/selectAdvRdtnNationDailyList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        },
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum, i18nMessage.msg_acmslt,
                i18nMessage.msg_rate, 'rdtnUnitNm' ],
        colModel : [ {
            name : 'statsDt',
            align : 'center',
            width : '165',
            fixed : true,
            sortable : false
        }, {
            name : 'nationNm',
            align : 'center',
            width : '345',
            fixed : true,
            sortable : false
        }, {
            name : 'acmsltTotal',
            align : 'right',
            width : '210',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltVal',
            align : 'right',
            width : '210',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltRatio',
            align : 'right',
            width : '210',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        } ],
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow99999,
        scroll : true,
        viewrecords : true,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#totalRowCount2' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }

            updateJqgridNationHeader2 ( $gridList, dateType );
            
            //국가별 기간별 일사량 차트 
            searchRdtnColumnNationChart(data);
            
        },
        gridComplete : function ()
        {
            $gridList.rowspan ( 1, 1 );
            $gridList.rowspan ( 2, 2 );
            $gridList.rowspan ( 3, 3 );
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    mergeJqgridNationHeader2 ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadRdtnNationJqgrid2 ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var unit = $ ( '#unit' ).val ();
    var pcName = $ ( '#rdtnPcName' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : unit,
            pcName : pcName
        }
    } ).trigger ( 'reloadGrid' );
}

// 헤더명 변경
function updateJqgridNationHeader2 ( $gridList, dateType )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var rdtnUnitNm = rowData.rdtnUnitNm;

    if ( rdtnUnitNm )
    {
        var sumRdtn = i18nMessage.msg_sum + homUtil.wrapWord ( rdtnUnitNm + dateType.toLowerCase (), '(', ')' );
        var acmsltRdtn = i18nMessage.msg_acmslt
                + homUtil.wrapWord ( rdtnUnitNm + '/' + dateType.toLowerCase (), '(', ')' );
        var ratioRdtn = i18nMessage.msg_rate;

        $ ( '#gridList2_acmsltTotal' ).html ( sumRdtn );
        $ ( '#gridList2_acmsltVal' ).html ( acmsltRdtn );
        $ ( '#gridList2_acmsltRatio' ).html ( ratioRdtn );
    }
}

// 헤더 병합
function mergeJqgridNationHeader2 ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'acmsltTotal',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_radiation
        } ]
    } );
}

// Parameter 셋팅
function setSearchParameter ( pureFromDate, pureToDate )
{
    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    setPeriodTitle ();
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;
    var dateFormat = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#search_period' ).text ( fromDate + ' ~ ' + toDate );
}

function highChartImgRetrieve ( dataString, urlId, urlName )
{
    $.ajax ( {
        type : 'POST',
        data : dataString,
        url : staticVariable.exportUrl,
        success : function ( data )
        {
            var $excelUrl = $ ( '<input />', {
                type : 'hidden',
                id : urlId,
                name : urlName,
                value : staticVariable.exportUrl + data
            } );
            chartImgInfoMap.put ( urlId, $excelUrl );

            if ( chartImgInfoMap.size () == 3 )
            {
                var $excelUrl1 = chartImgInfoMap.get ( 'excelUrl1' );
                var $excelUrl2 = chartImgInfoMap.get ( 'excelUrl2' );
                var $excelUrl3 = chartImgInfoMap.get ( 'excelUrl3' );

                console.log ( '*** highChart URL ' );
                console.log ( $excelUrl1 );
                console.log ( $excelUrl2 );
                console.log ( $excelUrl3 );
                if ( $excelUrl1 && $excelUrl2 && $excelUrl3 )
                {
                    $ ( 'form' ).prepend ( $excelUrl1, $excelUrl2, $excelUrl3 ).prop ( 'action',
                            contextPath + '/hom/excel/advancedanalysis/radiation/download.do' ).submit ();
                    $excelUrl1.remove ();
                    $excelUrl2.remove ();
                    $excelUrl3.remove ();
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_highchartDownloadError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                }
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
/**
 * 엑셀 다운로드
 */
function downloadExcel ()
{
    var $btnExcel = $ ( '#btnExcel' );

    $btnExcel.click ( function ()
    {
        for ( var i = 1; i <= 3; i++ )
        {
            var $graph = $ ( '#graph' + i );
            var optionsStr = JSON.stringify ( $graph.highcharts ().userOptions );
            var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
            var id = 'excelUrl' + i;
            var name = 'url' + i;

            highChartImgRetrieve ( dataString, id, name );
        }

    } );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;
    var dateFormat = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#select_date_type' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );

}

// 그리드 전체보기 팝업 호출
function initViewAllPopup ()
{

    var $btnAllJqgrid1 = $ ( '#btn_all_jqgrid1' );
    var $btnAllJqgrid2 = $ ( '#btn_all_jqgrid2' );

    $btnAllJqgrid1.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
                setSearchedParamaeter ();
            }
        }
    } );

    $btnAllJqgrid2.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
                setSearchedParamaeter ();
            }
        }
    } );
}

// 단위 변경 버튼 클릭
function initUnit ()
{
    var $unitSelect = $ ( '.unit_select' );
    var $unit = $ ( '#unit' );
    var $btnSubmit = $ ( '#btnSubmit' );

    $ ( '.unit_select' ).on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $unit.val ( valueUnit );

        setSearchedParamaeter ();

        $btnSubmit.trigger ( 'click' );
    } );
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    //TODO : 호출하는 이유는??
    /*
    analysisIrradiance = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };
    */
    analysisIrradiance = {
            pvAcmsltRateList : {

            }
        };
    $ ( '#btnSubmit' ).trigger ( 'click', true );

}

$ ( function ()
{
    // 실적일사량 비율 막대 차트 정보
    columnChartListMap = new Map ();

    // highChart 이미지 URL 정보
    chartImgInfoMap = new Map ();

    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    initUnit ();
    initViewAllPopup ();
    searchRdtn ();
    initPage ();
    downloadExcel ();
} );
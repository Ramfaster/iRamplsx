// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $selType = $ ( '#sel_type, #sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    $ ( '#gridList' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/analysis/energy/selectCodEnergyGridList.ajax',
                        mtype : 'POST',
                        datatype : 'json',
                        height : 204,
                        autowidth : true,
                        shrinkToFit : false,
                        rowNum : 10,
                        sortname : "No",
                        sortorder : "asc",
                        page : 1,
                        scroll : true,
                        viewrecords : true,
                        emptyrecords : i18nMessage.msg_sentenceGridNoData,
                        colNames : [ i18nMessage.msg_yearDo, "1" + i18nMessage.msg_month, "2" + i18nMessage.msg_month,
                                "3" + i18nMessage.msg_month, "4" + i18nMessage.msg_month, "5" + i18nMessage.msg_month,
                                "6" + i18nMessage.msg_month, "7" + i18nMessage.msg_month, "8" + i18nMessage.msg_month,
                                "9" + i18nMessage.msg_month, "10" + i18nMessage.msg_month,
                                "11" + i18nMessage.msg_month, "12" + i18nMessage.msg_month, i18nMessage.msg_subtotal ],
                        colModel : [ {
                            name : 'stdrYear',
                            align : 'center',
                            width : '85'
                        }, {
                            name : 'janData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'febData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'marData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'aprData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'mayData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'junData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'julData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'augData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'sepData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'otbData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'novData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'dcbData',
                            align : 'right',
                            width : '90'
                        }, {
                            name : 'subTotal',
                            align : 'right',
                            width : '90',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        } ],
                        loadComplete : function ( data )
                        {
                            var $gqNodata = $ ( '.gq_nodata' );

                            if ( data.records === 0 )
                            {
                                $gqNodata.show ();
                            } else
                            {
                                $gqNodata.hide ();

                                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
                            }

                            // 조회결과 타이틀
                            var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                                    + data.records + i18nMessage.msg_count;
                            $ ( "#totalRowCount" ).text ( resultText );
                        },
                        gridComplete : function ()
                        {
                            var ids = $ ( '#gridList' ).jqGrid ( 'getDataIDs' );
                            var rows = $ ( '#gridList' ).jqGrid ( 'getRowData' );
                            var reverseRows = _.sortBy ( rows, 'stdrYear' ).reverse ();
                            var monthRangeKeys = _.keys ( reverseRows[0] ).slice ( 1, 13 );

                            for ( var i = 0; i < ids.length; i++ )
                            {
                                var id = ids[i];
                                var subtractionArray = [];
                                var customDataArray = [];
                                var rowValues1 = _.toArray ( reverseRows[i] ).slice ( 1, 13 ).map ( function ( item )
                                {
                                    return homUtil.mathFloor ( item, staticVariable.decimalPoint );
                                } );
                                var customData;

                                if ( i < ids.length - 1 )
                                {
                                    var rowValues2 = _.toArray ( reverseRows[i + 1] ).slice ( 1, 13 ).map (
                                            function ( item )
                                            {
                                                return homUtil.mathFloor ( item, staticVariable.decimalPoint );
                                            } );

                                    for ( var j = 0; j < rowValues1.length; j++ )
                                    {
                                        var subtractionValue = rowValues1[j] - rowValues2[j];
                                        subtractionArray.push ( subtractionValue );
                                    }

                                    for ( var k = 0; k < subtractionArray.length; k++ )
                                    {
                                        if ( subtractionArray[k] > 0 )
                                        {
                                            customData = '<span class="t_org">(<i class="icon_up"></i> '
                                                    + homUtil.mathFloorComma ( subtractionArray[k],
                                                            staticVariable.decimalPoint )
                                                    + ')</span>'
                                                    + homUtil.mathFloorComma ( rowValues1[k],
                                                            staticVariable.decimalPoint );
                                        } else if ( subtractionArray[k] < 0 )
                                        {
                                            customData = '<span class="t_blue">(<i class="icon_down"></i> '
                                                    + homUtil.mathAbsFloorComma ( subtractionArray[k],
                                                            staticVariable.decimalPoint )
                                                    + ')</span>'
                                                    + homUtil.mathFloorComma ( rowValues1[k],
                                                            staticVariable.decimalPoint );
                                        } else
                                        {
                                            customData = '(-)'
                                                    + homUtil.mathFloorComma ( rowValues1[k],
                                                            staticVariable.decimalPoint );
                                        }
                                        customDataArray.push ( customData );
                                    }

                                    $ ( '#gridList' ).jqGrid ( 'setRowData', id,
                                            _.object ( monthRangeKeys, customDataArray ) );
                                } else
                                {
                                    for ( var y = 0; y < rowValues1.length; y++ )
                                    {
                                        customData = '(-)'
                                                + homUtil.mathFloorComma ( rowValues1[y], staticVariable.decimalPoint );
                                        customDataArray.push ( customData );
                                    }

                                    $ ( '#gridList' ).jqGrid ( 'setRowData', id,
                                            _.object ( monthRangeKeys, customDataArray ) );
                                }
                            }
                        }
                    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
}

function getFormattedCellValue ( cellValue )
{
    var prefix = '';
    if ( cellValue > 0 )
    {
        prefix = '(<i class="icon_up"></i>)';
    } else if ( cellValue < 0 )
    {
        prefix = '(<i class="icon_down"></i>)';
    } else
    {
        prefix = '(<i>-</i>)';
    }
    return prefix + homUtil.mathAbsFloorComma ( cellValue, staticVariable.decimalPoint );
}

// jqgird customize
function customizeJqgrid ()
{
    jqGridBasic ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

/**
 * 기간 타이틀을 설정한다.
 * 
 * @param fromDate
 *            조회 시작
 * @param toDate
 *            조회 종료
 */
function setPeriodTitle ( fromDate, toDate )
{
    // COD 기준 발전량 차트 타이틀
    $ ( '#period' ).text ( fromDate + " ~ " + i18nMessage.msg_mntrToday + " : " + toDate );
}

/*
 * COD 발전량 차트 목록 조회
 */
function getEnergyCodChartList ()
{
    $.ajax ( {
        url : contextPath + '/hom/analysis/energy/selectCodEnergyChartList.ajax',
        type : 'POST',
        dataType : 'json',
        // data : $ ( "form" ).serialize (),
        data : {
            unit : $ ( '#hidUnit' ).val ()
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log ( json.data );

                if ( json.data.length > 0 )
                {
                    // 상업운전 타이틀 설정
                    setPeriodTitle ( json.data[0].cod, json.data[0].toDay );

                    $ ( '#graph1' ).show ();
                    $ ( '#graph1NoData' ).hide ();

                    homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

                    var series = [];
                    $.each ( json.data, function ( index, item )
                    {
                        // 차트 데이터 설정
                        var chartData = [];
                        chartData.push ( item.janData );
                        chartData.push ( item.febData );
                        chartData.push ( item.marData );
                        chartData.push ( item.aprData );
                        chartData.push ( item.mayData );
                        chartData.push ( item.junData );
                        chartData.push ( item.julData );
                        chartData.push ( item.augData );
                        chartData.push ( item.sepData );
                        chartData.push ( item.otbData );
                        chartData.push ( item.novData );
                        chartData.push ( item.dcbData );

                        series.push ( {
                            name : item.stdrYear,
                            type : "line",
                            yAxis : 0,
                            data : chartData
                        } );
                    } );

                    $ ( '#graph1' ).highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50
                        },
                        title : {
                            text : '',
                            style : {
                                display : 'none'
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
                            categories : [ '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12' ],
                            crosshair : true
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_energy + '(' + json.data[0].energyUnitNm + ')'
                            }
                        } ],
                        tooltip : homUtil.generateLabelTooltip ( staticVariable.decimalPoint ),
                        plotOptions : {
                            line : {
                                pointPadding : 0,
                                borderWidth : 0,
                                lineWidth : 1,
                                marker : {
                                    enabled : false
                                }
                            }
                        },
                        series : series
                    } );
                } else
                {
                    $ ( '#graph1' ).hide ();
                    $ ( '#graph1NoData' ).show ();
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

/**
 * 발전량 조회
 */
function searchEnergy ()
{
    $ ( '#btnSubmit' ).click ( function ()
    {
        getEnergyCodChartList ();
        reloadJqgrid ( $ ( '#gridList' ) );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{
    $gridList.setGridParam ( {
        postData : {
            unit : $ ( '#hidUnit' ).val ()
        }
    } ).trigger ( 'reloadGrid' );
}

/**
 * 팝업을 보여준다.
 */
function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

/**
 * 엑셀 다운로드
 */
function downloadExcel ()
{
    $ ( '#btnExcel' ).click (
            function ()
            {
                var $graph = $ ( '#graph1' );
                var optionsStr = JSON.stringify ( $graph.highcharts ().userOptions );
                var exportUrl = 'http://export.highcharts.com/';
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : exportUrl,
                    success : function ( data )
                    {
                        var periodValue = $ ( '#period' ).text ();
                        var cod = periodValue.substring ( 0, 10 );
                        var toDay = periodValue.substring ( 18 );

                        $ ( 'form' ).prop ( 'action', contextPath + '/hom/excel/anals/coddvlp/download.do' );
                        $ ( 'form' ).prepend (
                                '<input type="hidden" name="url" value="' + exportUrl + data
                                        + '" /><input type="hidden" name="cod" value="' + cod
                                        + '" /><input type="hidden" name="toDay" value="' + toDay + '" />' );

                        $ ( 'form' ).submit ();

                        $ ( 'input[name=url]' ).remove ();
                        $ ( 'input[name=cod]' ).remove ();
                        $ ( 'input[name=toDay]' ).remove ();
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
}

/**
 * 조회 기준에 의한 화면을 보여준다.
 */
function showPageByRetrieveType ()
{
    $ ( 'input[name=retrieveType]' ).change ( function ()
    {
        var retrieveType = $ ( this ).val ();

        // 기간 조회
        if ( retrieveType === "period" )
        {
            location.href = contextPath + '/hom/analysis/energy/list.do?pageType=period';
        } else
        // COD 기준 조회
        {
            location.href = contextPath + '/hom/analysis/energy/list.do?pageType=cod';
        }
    } );
}

// 단위 변경 버튼 클릭
function initUnit ()
{
    // 기본 단위 클릭
    $ ( ".DEFAULTunit" ).click ( function ()
    {
        $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );

        $ ( ".DEFAULTunit" ).addClass ( 'on' );
        valueUnit = 'Default';

        $ ( '#hidUnit' ).val ( valueUnit );

        // 데이터 조회
        $ ( '#btnSubmit' ).trigger ( 'click' );
    } );

    // KW 단위 클릭
    $ ( ".Kunit" ).click ( function ()
    {
        $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Kunit" ).addClass ( 'on' );
        valueUnit = 'K';

        $ ( '#hidUnit' ).val ( valueUnit );

        // 데이터 조회
        $ ( '#btnSubmit' ).trigger ( 'click' );
    } );

    // MW 단위 클릭
    $ ( ".Munit" ).click ( function ()
    {
        $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Munit" ).addClass ( 'on' );
        valueUnit = 'M';

        $ ( '#hidUnit' ).val ( valueUnit );

        // 데이터 조회
        $ ( '#btnSubmit' ).trigger ( 'click' );
    } );

    // GW 단위 클릭
    $ ( ".Gunit" ).click ( function ()
    {
        $unitSelect = $ ( '.unit_select' );
        $unitSelect.removeClass ( 'on' );
        $ ( ".Gunit" ).addClass ( 'on' );
        valueUnit = 'G';

        $ ( '#hidUnit' ).val ( valueUnit );

        // 데이터 조회
        $ ( '#btnSubmit' ).trigger ( 'click' );
    } );
}

$ ( function ()
{
    customizeForm ();
    initUnit ();
    customizeJqgrid ();
    getEnergyCodChartList ();
    searchEnergy ();
    showPopup ();
    downloadExcel ();
    showPageByRetrieveType ();
} );
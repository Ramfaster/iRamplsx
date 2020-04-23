var alarmAnalsr = null;
// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type1' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $selType = $ ( '#sel_alarm_type, #sel_eqmt_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

function initViewAllPopup ()
{

    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );

    $btnAllJqgrid.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
    } );
}

function searchCodChart ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btnExcel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );
    $.ajax ( {
        url : contextPath + '/hom/analysis/alarmstats/selectCodAlarmList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $graph1.highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    var seriesArray = [];
                    var lastIndex = json.data.length - 1;
                    $.each ( json.data, function ( index, item )
                    {
                        if ( index == 0 )
                        {
                            $ ( '#search_period' ).text ( item.fromDate + ' ~ ' + item.toDate );
                        }

                        var year = item.years;
                        var type = 'line';

                        if ( lastIndex == index )
                        {
                            type = 'column';
                        }

                        var chartArray = [];
                        chartArray.push ( item.january );
                        chartArray.push ( item.febuary );
                        chartArray.push ( item.march );
                        chartArray.push ( item.april );
                        chartArray.push ( item.may );
                        chartArray.push ( item.june );
                        chartArray.push ( item.july );
                        chartArray.push ( item.august );
                        chartArray.push ( item.september );
                        chartArray.push ( item.october );
                        chartArray.push ( item.november );
                        chartArray.push ( item.december );

                        var series = {
                            name : year,
                            type : type,
                            yAxis : 0,
                            data : chartArray
                        };

                        if ( lastIndex === index )
                        {
                            seriesArray.splice ( 0, 0, series );
                        } else
                        {
                            seriesArray.push ( series );
                        }
                    } );

                    $graph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                        chart : {
                            marginTop : 50
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
                            categories : [ i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                                    i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                                    i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                                    i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober,
                                    i18nMessage.msg_shortNovember, i18nMessage.msg_shortDecember ],
                            crosshair : true
                        },
                        yAxis : [ {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_occurCount + '(' + i18nMessage.msg_count + ')'
                            }
                        } ],
                        tooltip : homUtil.generateLabelTooltip ( 0 ),
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
                        series : seriesArray
                    } );
                } else
                {
                    $btnAllJqgrid.hide ();
                    $btnExcel.hide ();
                    $graph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
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

// COD jqgrid 조회(초기 세팅 및 조회)
function searchCodJqgrid ( $gridList, tpl )
{
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    var noDataId = 'alarm_jqgrid_nodata';

    $gridList.jqGrid ( { // /hom/analysis/alarmstats
        url : contextPath + '/hom/analysis/alarmstats/selectCodAlarmGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            eqmtGrpCd : eqmtGrpCd,
            alarmGrpCd : alarmGrpCd
        },
        colNames : [ i18nMessage.msg_division, i18nMessage.msg_shortJanuary, i18nMessage.msg_shortFebuary,
                i18nMessage.msg_shortMarch, i18nMessage.msg_shortApril, i18nMessage.msg_shortMay,
                i18nMessage.msg_shortJune, i18nMessage.msg_shortJuly, i18nMessage.msg_shortAugust,
                i18nMessage.msg_shortSeptember, i18nMessage.msg_shortOctober, i18nMessage.msg_shortNovember,
                i18nMessage.msg_shortDecember, i18nMessage.msg_wordYearTotal ],
        colModel : [ {
            name : 'years',
            align : 'center',
            width : '75',
            fixed : true,
            sortable : false
        }, {
            name : 'january',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'febuary',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'march',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'april',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'may',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'june',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'july',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'august',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'september',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'october',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'november',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'december',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        }, {
            name : 'totalAlarmCount',
            align : 'right',
            width : '85',
            fixed : true,
            sortable : false
        } ],
        sortname : 'years',
        sortorder : 'asc',
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

            var dataSize = 0;
            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#gridList' );
                var ids = $gridList.jqGrid ( "getDataIDs" );
                if ( ids.length > 0 )
                {
                    dataSize = ids.length;
                    var lastRowCl = ids[ids.length - 1];
                    var lastRowData = $gridList.getRowData ( lastRowCl );

                    for ( var i = 0, length = ids.length - 1; i < length; i++ )
                    {
                        var cl = ids[i];
                        var rowData = $gridList.getRowData ( cl );

                        // gap setting(1월 ~ 12월, 년평균)
                        rowData.january = jqgridPercentAbsGapFormatter ( lastRowData.january, rowData.january,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.febuary = jqgridPercentAbsGapFormatter ( lastRowData.febuary, rowData.febuary,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.march = jqgridPercentAbsGapFormatter ( lastRowData.march, rowData.march,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.april = jqgridPercentAbsGapFormatter ( lastRowData.april, rowData.april,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.may = jqgridPercentAbsGapFormatter ( lastRowData.may, rowData.may,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.june = jqgridPercentAbsGapFormatter ( lastRowData.june, rowData.june,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.july = jqgridPercentAbsGapFormatter ( lastRowData.july, rowData.july,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.august = jqgridPercentAbsGapFormatter ( lastRowData.august, rowData.august,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.september = jqgridPercentAbsGapFormatter ( lastRowData.september, rowData.september,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.october = jqgridPercentAbsGapFormatter ( lastRowData.october, rowData.october,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.november = jqgridPercentAbsGapFormatter ( lastRowData.november, rowData.november,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.december = jqgridPercentAbsGapFormatter ( lastRowData.december, rowData.december,
                                alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );
                        rowData.totalAlarmCount = jqgridPercentAbsGapFormatter ( lastRowData.totalAlarmCount,
                                rowData.totalAlarmCount, alarmAnalsr.pvAcmsltRateList, staticVariable.decimalPoint );

                        $gridList.jqGrid ( 'setRowData', cl, rowData );
                    }

                    // 월평균 및 년평균의 평균 셋팅
                    lastRowData.january = numberFloorComma ( lastRowData.january, staticVariable.decimalPoint );
                    lastRowData.febuary = numberFloorComma ( lastRowData.febuary, staticVariable.decimalPoint );
                    lastRowData.march = numberFloorComma ( lastRowData.march, staticVariable.decimalPoint );
                    lastRowData.april = numberFloorComma ( lastRowData.april, staticVariable.decimalPoint );
                    lastRowData.may = numberFloorComma ( lastRowData.may, staticVariable.decimalPoint );
                    lastRowData.june = numberFloorComma ( lastRowData.june, staticVariable.decimalPoint );
                    lastRowData.july = numberFloorComma ( lastRowData.july, staticVariable.decimalPoint );
                    lastRowData.august = numberFloorComma ( lastRowData.august, staticVariable.decimalPoint );
                    lastRowData.september = numberFloorComma ( lastRowData.september, staticVariable.decimalPoint );
                    lastRowData.october = numberFloorComma ( lastRowData.october, staticVariable.decimalPoint );
                    lastRowData.november = numberFloorComma ( lastRowData.november, staticVariable.decimalPoint );
                    lastRowData.december = numberFloorComma ( lastRowData.december, staticVariable.decimalPoint );
                    lastRowData.totalAlarmCount = numberFloorComma ( lastRowData.totalAlarmCount,
                            staticVariable.decimalPoint );
                    $gridList.jqGrid ( 'setRowData', lastRowCl, lastRowData );
                } else
                {
                    $gqNodata.show ();
                }
            }

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( dataSize ) + i18nMessage.msg_count;
            $ ( '#totalRowCount' ).text ( resultText );
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

// 일사량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadCodJqgrid ( $gridList )
{
    var eqmtGrpCd = $ ( '#eqmtGrpCd' ).val ();
    var alarmGrpCd = $ ( '#alarmGrpCd' ).val ();

    $gridList.setGridParam ( {
        postData : {
            eqmtGrpCd : eqmtGrpCd,
            alarmGrpCd : alarmGrpCd
        }
    } ).trigger ( 'reloadGrid' );
}

// COD 알람 조회 초기 셋팅
function searchAlarmCod ()
{
    var $gridList = $ ( '#gridList' );
    var $searchPeriod = $ ( '#search_period' );

    var tpl = getTemplate ( templates.noData );

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var retrieveTypeValue = $ ( ':radio[name=retrieveType]:checked' ).val ();

        if ( retrieveTypeValue == staticVariable.pagetypePeriod )
        {
            var url = contextPath + '/hom/analysis/alarmstats/list.do';
            var param = '?pageType=' + staticVariable.pagetypePeriod;
            location.href = url + param;
        } else
        {
            // COD 차트 조회
            searchCodChart ();

            // COD Grid 조회
            if ( initFlag )
            {
                searchCodJqgrid ( $gridList, tpl );
            } else
            {
                reloadCodJqgrid ( $gridList );
            }
        }
    } );

    // 설비구분 Combobox Change Event
    var $eqmtGrpCd = $ ( '#sel_eqmt_type' );
    $eqmtGrpCd.on ( 'change', function ()
    {
        $ ( '#eqmtGrpCd' ).val ( $ ( this ).val () );
    } );

    // 알람그룹 Combobox Change Event
    var $alarmGrpCd = $ ( '#sel_alarm_type' );
    $alarmGrpCd.on ( 'change', function ()
    {
        $ ( '#alarmGrpCd' ).val ( $ ( this ).val () );
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
        var $graph1 = $ ( '#graph1' );
        var optionsStr = JSON.stringify ( $graph1.highcharts ().userOptions );
        var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

        $.ajax ( {
            type : 'POST',
            data : dataString,
            url : staticVariable.exportUrl,
            success : function ( data )
            {
                var $excelUrl = $ ( '<input />', {
                    type : 'hidden',
                    id : 'excelUrl',
                    name : 'url',
                    value : staticVariable.exportUrl + data
                } );

                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

                var $menuName = $ ( '<input />', {
                    type : 'hidden',
                    id : 'menuName',
                    name : 'menuName',
                    value : menuName
                } );

                $ ( 'form' ).prepend ( $excelUrl, $menuName ).prop ( 'action',
                        contextPath + '/hom/excel/analysis/alarmcodstats/download.do' ).submit ();

                $excelUrl.remove ();
                $menuName.remove ();
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

// 페이지 로드 완료 시 처리
function initPage ()
{
    var eqmtTypeValue = $ ( '#sel_eqmt_type option:selected' ).val ();
    $ ( '#eqmtGrpCd' ).val ( eqmtTypeValue );

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    alarmAnalsr = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    customizeForm ();
    initViewAllPopup ();
    searchAlarmCod ();
    initPage ();
    downloadExcel ();
} );
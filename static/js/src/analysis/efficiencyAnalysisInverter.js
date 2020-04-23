// 기간 조회 & 인버터 조회
function searchEfficiencyInverter ( initFlag )
{
    var tpl = getTemplate ( templates.noData );
    var $inverterGridList = $ ( '#inverterGridList' );

    if ( initFlag )
    {
        initInverterViewAllPopup ();

        searchInverterJqgrid ( $inverterGridList, tpl );
    } else
    {
        reloadInverterJqgrid ( $inverterGridList );
    }

    searchInverterChart ();
}

// 엑셀 버튼 분석 > 인버터
function setAnalsrInverterExcelBtn ()
{
    var $btnInverterExcel = $ ( '#btn_inverter_excel' );
    $btnInverterExcel.on ( 'click', function ()
    {
        var graphChart = $ ( '#inverter_graph1' ).highcharts ();
        var dataString = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( graphChart.userOptions ) );

        $.ajax ( {
            url : staticVariable.exportUrl,
            type : 'POST',
            data : dataString,
            success : function ( data )
            {
                var $excelUrl = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_excelUrl',
                    name : 'url',
                    value : staticVariable.exportUrl + data
                } );

                var $dateType = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_dateType',
                    name : 'excelDateType',
                    value : $ ( '#dateType' ).val ()
                } );

                var $fromDate = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_fromDate',
                    name : 'excelFromDate',
                    value : $ ( '#fromDate' ).val ()
                } );

                var $toDate = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_toDate',
                    name : 'excelToDate',
                    value : $ ( '#toDate' ).val ()
                } );

                var $eqmtGrpCd = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtGrpCd',
                    name : 'excelEqmtGrpCd',
                    value : $ ( '#eqmtGrpCd' ).val ()
                } );

                var $eqmtId = $ ( '<input />', {
                    type : 'hidden',
                    id : 'form_eqmtId',
                    name : 'excelEqmtId',
                    value : $ ( '#inverterEqmtId' ).val ()
                } );

                var menuName = '';
                $ ( '.lnb' ).find ( 'span' ).each ( function ()
                {
                    menuName += ($ ( this ).text () + '_');
                } );

                menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

                var $menuName = $ ( '<input />', {
                    type : 'hidden',
                    id : 'menuName',
                    name : 'menuName',
                    value : menuName
                } );

                $ ( 'form' ).prepend ( $excelUrl, $dateType, $fromDate, $toDate, $eqmtGrpCd, $eqmtId, $menuName ).prop (
                        'action', contextPath + '/hom/excel/analysis/effectiveness/inverterDownload.do' ).submit ();

                $excelUrl.remove ();
                $dateType.remove ();
                $fromDate.remove ();
                $toDate.remove ();
                $eqmtGrpCd.remove ();
                $eqmtId.remove ();
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

        return false;
    } );
}
// 인버터 효율 그리드 전체보기 팝업 호출
function initInverterViewAllPopup ()
{
    $ ( '#btn_all_inverter_jqgrid' ).magnificPopup ( {
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

// 인버터 효율 jqgrid 조회(초기 세팅 및 조회)
function searchInverterJqgrid ( $inverterGridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var inverterEqmtId = $ ( '#inverterEqmtId' ).val ();

    var noDataId = 'inverter_jqgrid_nodata';

    $inverterGridList
            .jqGrid ( {
                url : contextPath + '/hom/analysis/effectiveness/selectInverterGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    inverterEqmtId : inverterEqmtId
                },
                height : 204,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ i18nMessage.msg_division,
                        i18nMessage.msg_averageEfficiency + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' ),
                        'eqmtId' ],
                colModel : [ {
                    name : 'eqmtNm',
                    align : 'left',
                    width : '260',
                    fixed : true,
                    sortable : false
                }, {
                    name : 'efficiencyAvg',
                    align : 'right',
                    width : '1000',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'eqmtId',
                    hidden : true
                } ],
                sortname : 'eqmtNm',
                sortorder : 'asc',
                rownumbers : false,
                rowwidth : 25,
                multiselect : false,
                multiboxonly : false,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '#' + noDataId );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
                    $ ( '#totalInverterRowCount' ).text ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
                    }
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $inverterGridList.parent ().append ( html );
    }

    $ ( '#inverterGridList1_wrap div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 인버터 효율 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadInverterJqgrid ( $inverterGridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var inverterEqmtId = $ ( '#inverterEqmtId' ).val ();

    $inverterGridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            inverterEqmtId : inverterEqmtId
        }
    } ).trigger ( 'reloadGrid' );
}

// 인버터 효율 차트 조회
function searchInverterChart ()
{
    var $inverterGraph1 = $ ( '#inverter_graph1' );
    var $btnAllInverterJqgrid = $ ( '#btn_all_inverter_jqgrid' );
    var $btnInverterExcel = $ ( '#btn_inverter_excel' );

    var $dateType = $ ( '#dateType' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    var $inverterEqmtId = $ ( '#inverterEqmtId' );

    $.ajax ( {
        url : contextPath + '/hom/analysis/effectiveness/selectInverterChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#inverter_graph1' ).highcharts () ] );

                if ( json.data !== null && json.data.length > 0 )
                {
                    $btnAllInverterJqgrid.show ();
                    $btnInverterExcel.show ();

                    var inverterGroupList = _.groupBy ( json.data, function ( item )
                    {
                        return item.eqmtId;
                    } );

                    var series = [];
                    // 설비 별 그룹 list 반복
                    var inverterGroupKeyLength = _.keys ( inverterGroupList ).length;
                    var indexCount = 0;
                    var size5 = homUtil.highchartsColorInfo.colorSet5.length;
                    var size8 = homUtil.highchartsColorInfo.colorSet8.length;
                    _.each ( inverterGroupList, function ( inverterList )
                    {
                        var regressionDataArray = [];
                        var dataArray = [];
                        $.each ( inverterList, function ( index, item )
                        {
                            dataArray.push ( [
                                    homUtil.mathFloor ( item.irradiationPlane, staticVariable.decimalPoint ),
                                    homUtil.mathFloor ( item.efficiency, staticVariable.decimalPoint ) ] );
                        } );

                        var minInfo = _.min ( dataArray, function ( data )
                        {
                            return data[0];
                        } );
                        var maxInfo = _.max ( dataArray, function ( data )
                        {
                            return data[0];
                        } );

                        var min = parseFloat ( minInfo[0] );
                        var max = parseFloat ( maxInfo[0] );

                        // y = ax + b
                        var gradient = parseFloat ( inverterList[0].gradient );
                        var yIntercept = parseFloat ( inverterList[0].yIntercept );

                        // 회귀 분석 식 데이터 셋팅
                        regressionDataArray.push ( [ homUtil.mathFloor ( min, staticVariable.decimalPoint ),
                                homUtil.mathFloor ( gradient * min + yIntercept, staticVariable.decimalPoint ) ] );
                        regressionDataArray.push ( [ homUtil.mathFloor ( max, staticVariable.decimalPoint ),
                                homUtil.mathFloor ( gradient * max + yIntercept, staticVariable.decimalPoint ) ] );

                        // series 셋팅
                        var scatterSeries = {
                            type : 'scatter',
                            name : i18nMessage.msg_irradiationToEfficiency
                                    + homUtil.wrapWord ( inverterList[0].eqmtNm, '(', ')' ),
                            data : dataArray,
                            zIndex : 1,
                            marker : {
                                symbol : 'circle'
                            }
                        };
                        var lineSeries = {
                            type : 'line',
                            yAxis : 0,
                            name : i18nMessage.msg_averageEfficiency
                                    + homUtil.wrapWord ( inverterList[0].eqmtNm, '(', ')' ),
                            data : regressionDataArray,
                            zIndex : 2
                        };

                        if ( inverterGroupKeyLength === 1 )
                        {
                            scatterSeries.color = 'rgba(95, 124, 146, .5)';
                            lineSeries.color = '#ff6702';
                        } else
                        {
                            // 색 index 설정
                            var colorIndex = indexCount * 2;
                            if ( colorIndex > size8 || colorIndex > size5 )
                            {
                                colorIndex = indexCount * 2 + 1;
                            }

                            scatterSeries.color = homUtil.highchartsColorInfo.colorSet8[colorIndex % size8];
                            lineSeries.color = homUtil.highchartsColorInfo.colorSet5[colorIndex % size5];
                        }

                        series.push ( lineSeries );
                        series.push ( scatterSeries );
                        indexCount++;
                    } );

                    $inverterGraph1.highcharts ( {
                        colors : homUtil.getHighchartsColors (),
                        chart : {
                            marginTop : 50,
                            type : 'scatter',
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
                            min : 0,
                            title : {
                                text : i18nMessage.msg_inPlaneRdth
                                        + homUtil.wrapWord ( homConstants.unitSirs, '(', ')' )
                            },
                            startOnTick : true,
                            endOnTick : true,
                            showLastLabel : true,
                            labels : {
                                style : {
                                    color : '#3c3c3c'
                                }
                            }
                        },
                        yAxis : {
                            min : 0,
                            title : {
                                text : i18nMessage.msg_inverterEfficiency
                                        + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' )
                            }
                        },
                        tooltip : {
                            formatter : function ()
                            {
                                var tooltip = '<span style="color:' + this.color + '">\u25CF</span> <strong>'
                                        + this.series.name + '</strong><br />' + this.series.xAxis.axisTitle.textStr
                                        + ' : ' + this.x + '<br />' + this.series.yAxis.axisTitle.textStr + ' : '
                                        + this.y;

                                return tooltip;
                            }
                        },
                        legend : {
                            align : 'right',
                            verticalAlign : 'top',
                            layout : 'vertical',
                            x : 0,
                            y : 15
                        },
                        plotOptions : {
                            line : {
                                marker : {
                                    enabled : false
                                }
                            },
                            scatter : {
                                marker : {
                                    radius : 5,
                                    states : {
                                        hover : {
                                            enabled : true,
                                            lineColor : '#646464'
                                        }
                                    }
                                },
                            }
                        },
                        series : series.reverse ()
                    } );

                } else
                {
                    $btnAllInverterJqgrid.hide ();
                    $btnInverterExcel.hide ();

                    $inverterGraph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
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
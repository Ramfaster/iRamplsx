function fnRptAmPlantCurrentPowerLoad ( divHtmlId,
                                        callbackfn,
                                        rptSeq,
                                        rptMbySectn,
                                        rptMbyId,
                                        rptTyCd,
                                        rptCycleCd,
                                        stdrYm )
{

    var tpl = getTemplate ( templates.reportAmMonthlyPlantCur );
    var amtIndictUnitCd1 = null;
    if ( $ ( "#amtIndictUnitCd1" ) != 'undefined' )
    {
        amtIndictUnitCd1 = $ ( 'input:radio[name=amtIndictUnitCd1]:checked' ).val ();
    }
    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm,
        amtIndictUnitCd1 : amtIndictUnitCd1
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportAmMonthlyPlantList.ajax',
        type : 'GET',
        async : false,
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            paramRunOmRptAjax01 = false;

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = []
                    msgslist = {
                        msg_monthPower : i18nMessage.msg_monthPower,
                        msg_yearAccumulation : i18nMessage.msg_yearAccumulation,
                        msg_reportPower : i18nMessage.msg_reportPower,
                        msg_expenseStatus : i18nMessage.msg_expenseStatus,
                        msg_unit : i18nMessage.msg_unit,
                        msg_item : i18nMessage.msg_item,
                        msg_spotMonth : i18nMessage.msg_spotMonth,
                        msg_accumulation : i18nMessage.msg_accumulation,
                        msg_plan : i18nMessage.msg_plan,
                        msg_acmslt : i18nMessage.msg_acmslt,
                        msg_contrast : i18nMessage.msg_contrast,
                        msg_rate : i18nMessage.msg_rate,
                        msg_note : i18nMessage.msg_note,
                        msg_reportPowerImportStatus : i18nMessage.msg_reportPowerImportStatus,
                        msg_plan : i18nMessage.msg_plan,
                        msg_acmslt : i18nMessage.msg_acmslt,
                        msg_contrast : i18nMessage.msg_contrast,
                        msg_notes : i18nMessage.msg_notes,
                        msg_operationalStatus : i18nMessage.msg_operationalStatus
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        msg_selection : i18nMessage.msg_selection,
                        dataSize01 : Object.keys ( json.data.childList01 ).length,
                        dataSize02 : Object.keys ( json.data.childList02 ).length,
                        dataSize03 : Object.keys ( json.data.childList03 ).length,
                        dataSize04 : Object.keys ( json.data.childList04 ).length,
                        dataSize05 : Object.keys ( json.data.childList05 ).length,
                        rptDataList : json.data
                    } );
                    if ( divHtmlId != 'undefined' )
                    {
                        divHtmlId.addClass ( 'on' );
                        divHtmlId.empty ().html ( html );
                        divHtmlId.parent ().trigger ( 'change' );
                    } else
                    {
                    }
                    if ( callbackfn != null )
                    {
                        callbackfn ();
                    }
                    fnRptAmPlantCurrentPowerHighcharts ( json.data );
                    customizeForm ();
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
            paramRunOmRptAjax01 = false;
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

function fnRptAmPlantCurrentPowerHighcharts ( data )
{
    var digit = staticVariable.decimalPoint;
    var varxxCategories = [];
    var varxxData01 = [];// 
    var varxxData02 = [];// 
    var j = 0;
    var i = 0;
    var listSize = 0;
    var xxplotBands = parseInt ( data.stdrYm.substr ( 4, 2 ) );

    var varxxPlanColor = [ '#bababa', '#a09f9f', '#828282' ];
    var varxxAcmsltColor = [ '#ea5b30', '#ff8921', '#ffbe21' ];
    var varxxGapColor = [ '#5086c3', '#41bdcc', '#2bdc8b' ];
    var varxxSeries = [];
    var varxxSeriesYear = [];

    listSize = Object.keys ( data.childList01 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        i = 1;
        var xxparntId = null;
        var xxdata001 = [];// 계획
        var xxdata002 = [];// 실적
        var xxdata003 = [];// 차이
        var xxcorprOmNm = '';
        var xxcorprAmNm = '';
        var xxcorprEpcNm = '';

        var currentPowerGroup = _.groupBy ( data.childList01, function ( value )
        {
            return value.parntsItemId;
        } );

        _.each ( currentPowerGroup, function ( currentPowerList )
        {
            xxdata001 = [];
            xxdata002 = [];
            xxdata003 = [];

            xxcorprOmNm = currentPowerList[0].corprOmNm; // 계획
            xxcorprAmNm = currentPowerList[0].corprAmNm; // 실적
            xxcorprEpcNm = currentPowerList[0].corprEpcNm; // 차이

            // date 및 데이터 셋팅
            _.each ( currentPowerList, function ( value )
            {
                varxxCategories.push ( value.statsDtFormat );

                xxdata001.push ( [ value.statsDtFormat, value.totalPlanSum ] );
                xxdata002.push ( [ value.statsDtFormat, value.totalAcmsltSum ] );
                xxdata003.push ( [ value.statsDtFormat, value.totalDif ] );
            } );

            varxxSeries.push ( {
                type : 'column',
                yAxis : 0,
                name : xxcorprOmNm,
                data : xxdata001
            } );
            varxxSeries.push ( {
                type : 'column',
                yAxis : 0,
                name : xxcorprAmNm,
                data : xxdata002
            } );
            varxxSeries.push ( {
                type : 'column',
                yAxis : 0,
                name : xxcorprEpcNm,
                data : xxdata003
            } );
        } );
    }

    // 그래프1
    $ ( '#rptGraph1' ).highcharts (
            {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 10,
                    spacingBottom : 0,
                    type : 'column',
                    zoomType : 'x',
                    panning : true,
                    panKey : 'shift'
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
                legend : {
                    align : 'center',
                    verticalAlign : 'bottom',
                    floating : false,
                    symbolWidth : 8,
                    symbolHeight : 8
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    categories : varxxCategories,
                    crosshair : true,
                    labels : {
                        step : 2
                    },
                    tickmarkPlacement : 'on',
                    plotBands : [ {
                        from : xxplotBands - 1.5,
                        to : xxplotBands - 0.5,
                        color : 'rgba(68, 170, 213, .2)'
                    } ]
                },
                yAxis : [ {
                    title : {
                        text : '',
                        style : {
                            display : 'none'
                        }
                    }
                } ],
                plotOptions : {
                    column : {
                        pointPadding : 0,
                        borderWidth : 0
                    }
                },
                tooltip : {
                    useHTML : true,
                    style : {
                        zIndex : 300
                    },
                    shared : true,
                    formatter : function ()
                    {
                        var tooltip = '';

                        $.each ( this.points, function ( i, point )
                        {

                            tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                    + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit ) + '<br />';
                        } );

                        return '<strong>20' + this.x + '</strong><br />' + tooltip;
                    }
                },
                series : varxxSeries
            } );

    listSize = Object.keys ( data.childList02 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        $.each ( data.childList02, function ( key, value )
        {
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                name : value.corprOmNm,
                data : [ value.totalPlanSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                name : value.corprAmNm,
                data : [ value.totalAcmsltSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                name : value.corprEpcNm,
                data : [ value.totalDif ]
            } );

            if ( j > 2 )
            {
                j = 0;
            }
            j++;

        } );
    }

    $ ( '#rptGraph11' ).highcharts (
            {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 10,
                    spacingBottom : 30,
                    type : 'column'
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
                legend : {
                    align : 'center',
                    verticalAlign : 'bottom',
                    floating : false,
                    symbolWidth : 8,
                    symbolHeight : 8,
                    enabled : false
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    categories : [ i18nMessage.msg_accumulation ],
                    crosshair : true,
                    labels : {
                        align : 'center',
                        x : 0,
                        y : 40
                    },
                    tickmarkPlacement : 'on'
                },
                yAxis : [ {
                    title : {
                        text : '',
                        style : {
                            display : 'none'
                        }
                    }
                } ],
                plotOptions : {
                    column : {
                        pointPadding : 0,
                        borderWidth : 0
                    }
                },
                tooltip : {
                    useHTML : true,
                    style : {
                        zIndex : 300
                    },
                    shared : true,
                    formatter : function ()
                    {
                        var tooltip = '';

                        $.each ( this.points, function ( i, point )
                        {

                            tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                    + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit ) + '<br />';
                        } );

                        return '<strong>' + this.x + '</strong><br />' + tooltip;
                    }
                },

                series : varxxSeriesYear
            } );

}

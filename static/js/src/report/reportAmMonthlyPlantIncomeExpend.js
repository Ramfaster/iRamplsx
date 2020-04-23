function fnRptAmPlantInExLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{

    var tpl = getTemplate ( templates.reportAmMonthlyPlantInEx );
    var amtIndictUnitCd2 = null;
    if ( $ ( "#amtIndictUnitCd2" ) != 'undefined' )
    {
        amtIndictUnitCd2 = $ ( 'input:radio[name=amtIndictUnitCd2]:checked' ).val ();
    }
    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm,
        amtIndictUnitCd2 : amtIndictUnitCd2
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportAmMonthlyPlant2List.ajax',
        type : 'GET',
        async : false,
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            paramRunOmRptAjax02 = false;

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = []
                    msgslist = {
                        msg_importExpense : i18nMessage.msg_importExpense,
                        msg_monthImportExpense : i18nMessage.msg_monthImportExpense,
                        msg_monthImportStatus : i18nMessage.msg_monthImportStatus,
                        msg_monthExpenseStatus : i18nMessage.msg_monthExpenseStatus,
                        msg_yearAccumulation : i18nMessage.msg_yearAccumulation,
                        msg_importStatus : i18nMessage.msg_importStatus,
                        msg_expenseStatus : i18nMessage.msg_expenseStatus,
                        msg_month : i18nMessage.msg_month,
                        msg_unit : i18nMessage.msg_unit,
                        msg_operationCostComposition : i18nMessage.msg_operationCostComposition,
                        msg_notes : i18nMessage.msg_notes,
                        msg_expenseStatus : i18nMessage.msg_expenseStatus,
                        msg_selection : i18nMessage.msg_selection,
                        msg_amountUnit : i18nMessage.msg_amountUnit
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
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
                        divHtmlId.empty ().html ( html ).trigger ( 'create' );
                        // divHtmlId.parent ().trigger ( 'create' );
                    } else
                    {
                    }
                    if ( callbackfn != null )
                    {
                        callbackfn ();
                    }
                    fnRptAmPlantInExHighcharts ( json.data );
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

function fnRptAmPlantInExHighcharts ( data )
{
    var digit = staticVariable.decimalPoint;

    var varxxCategories = [ '16-01', '16-02', '16-03', '16-04', '16-05', '16-06', '16-07' ];
    var varxxData01 = [];// 
    var varxxData02 = [];// 
    // var i=0;
    varxxCategories = [];
    var j = 0;
    var i = 0;
    var listSize = 0;
    // for ( i = 0; i < 12; i++ )
    // {
    // if ( i < 9 )
    // {
    // varxxCategories.push ( data.stdrYear.substr ( 2, 2 ) + '-0' + (i + 1) );
    // } else
    // {
    // varxxCategories.push ( data.stdrYear.substr ( 2, 2 ) + '-' + (i + 1) );
    // }
    //
    // }

    var xxplotBands = parseInt ( data.stdrYm.substr ( 4, 2 ) );

    var varxxPlanColor = [ '#bababa', '#a09f9f', '#828282' ];
    var varxxAcmsltColor = [ '#ea5b30', '#ff8921', '#ffbe21' ];
    var varxxGapColor = [ '#5086c3', '#41bdcc', '#2bdc8b' ];
    var varxxSeries = [];
    var varxxSeriesYear = [];
    // getChildList04

    varxxSeries = [];
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
        $.each ( data.childList01, function ( key, value )
        {
            varxxCategories.push ( value.statsDtFormat );

            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#ea762c',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#ea762c',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
            }
            i++;
        } );
        // $.each ( data.childList01, function ( key, value )
        // {
        // if ( i < listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_import,
        // data : [ value.janPlanTotal, value.febPlanTotal, value.marPlanTotal, value.aprPlanTotal,
        // value.mayPlanTotal, value.junPlanTotal, value.julyPlanTotal, value.augPlanTotal,
        // value.sepPlanTotal, value.octPlanTotal, value.novPlanTotal, value.decPlanTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#558bdc',
        // name : i18nMessage.msg_expense,
        // data : [ value.janAcmsltTotal, value.febAcmsltTotal, value.marAcmsltTotal, value.aprAcmsltTotal,
        // value.mayAcmsltTotal, value.junAcmsltTotal, value.julyAcmsltTotal, value.augAcmsltTotal,
        // value.sepAcmsltTotal, value.octAcmsltTotal, value.novAcmsltTotal, value.decAcmsltTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.janDif, value.febDif, value.marDif, value.aprDif, value.mayDif, value.junDif,
        // value.julyDif, value.augDif, value.sepDif, value.octDif, value.novDif, value.decDif ]
        // } );
        // }
        // i++;
        // } );
    }

    $ ( '#rptGraph2' ).highcharts (
            {
                chart : {
                    marginTop : 50,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 556
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
                    align : 'right',
                    verticalAlign : 'top',
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

    varxxSeries = [];
    varxxSeriesYear = [];
    listSize = Object.keys ( data.childList02 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        $.each ( data.childList02, function ( key, value )
        {
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#ea762c',
                name : value.corprOmNm,
                data : [ value.totalPlanSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#558bdc',
                name : value.corprAmNm,
                data : [ value.totalAcmsltSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#8f8f92',
                name : value.corprEpcNm,
                data : [ value.totalDif ]
            } );

            if ( j > 2 )
            {
                j = 0;
            }
            j++;

        } );
        // $.each ( data.childList01, function ( key, value )
        // {
        // if ( i == listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#d0d0d1',
        // name : i18nMessage.msg_plan,
        // data : [ value.totalPlanSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_acmslt,
        // data : [ value.totalAcmsltSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.totalDif ]
        // } );
        // }
        // i++;
        // } );
    }

    $ ( '#rptGraph21' ).highcharts (
            {
                chart : {
                    marginTop : 20,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 156
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
                        y : 20
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

    varxxSeries = [];
    listSize = Object.keys ( data.childList03 ).length;
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
        $.each ( data.childList03, function ( key, value )
        {

            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#ea762c',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#ea762c',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
            }
            i++;
        } );
        // $.each ( data.childList02, function ( key, value )
        // {
        // if ( i < listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#d0d0d1',
        // name : i18nMessage.msg_plan,
        // data : [ value.janPlanTotal, value.febPlanTotal, value.marPlanTotal, value.aprPlanTotal,
        // value.mayPlanTotal, value.junPlanTotal, value.julyPlanTotal, value.augPlanTotal,
        // value.sepPlanTotal, value.octPlanTotal, value.novPlanTotal, value.decPlanTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_acmslt,
        // data : [ value.janAcmsltTotal, value.febAcmsltTotal, value.marAcmsltTotal, value.aprAcmsltTotal,
        // value.mayAcmsltTotal, value.junAcmsltTotal, value.julyAcmsltTotal, value.augAcmsltTotal,
        // value.sepAcmsltTotal, value.octAcmsltTotal, value.novAcmsltTotal, value.decAcmsltTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.janDif, value.febDif, value.marDif, value.aprDif, value.mayDif, value.junDif,
        // value.julyDif, value.augDif, value.sepDif, value.octDif, value.novDif, value.decDif ]
        // } );
        // }
        // i++;
        // } );
    }

    // 그래프3
    $ ( '#rptGraph3' ).highcharts (
            {
                chart : {
                    marginTop : 50,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 556
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
                    align : 'right',
                    verticalAlign : 'top',
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

    varxxSeries = [];
    varxxSeriesYear = [];
    listSize = Object.keys ( data.childList04 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        $.each ( data.childList04, function ( key, value )
        {
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#d0d0d1',
                name : value.corprOmNm,
                data : [ value.totalPlanSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#ea762c',
                name : value.corprAmNm,
                data : [ value.totalAcmsltSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#8f8f92',
                name : value.corprEpcNm,
                data : [ value.totalDif ]
            } );

            if ( j > 2 )
            {
                j = 0;
            }
            j++;

        } );
        // $.each ( data.childList02, function ( key, value )
        // {
        // if ( i == listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#d0d0d1',
        // name : i18nMessage.msg_plan,
        // data : [ value.totalPlanSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_acmslt,
        // data : [ value.totalAcmsltSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.totalDif ]
        // } );
        // }
        // i++;
        // } );
    }
    $ ( '#rptGraph31' ).highcharts (
            {
                chart : {
                    marginTop : 20,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 156
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
                        y : 20
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

    varxxSeries = [];
    listSize = Object.keys ( data.childList05 ).length;
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
        $.each ( data.childList05, function ( key, value )
        {

            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {
                // alert ( xxparntId + ' ' + value.parntsItemId );
                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );
            }
            i++;
        } );
        // $.each ( data.childList03, function ( key, value )
        // {
        // if ( i < listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#d0d0d1',
        // name : i18nMessage.msg_plan,
        // data : [ value.janPlanTotal, value.febPlanTotal, value.marPlanTotal, value.aprPlanTotal,
        // value.mayPlanTotal, value.junPlanTotal, value.julyPlanTotal, value.augPlanTotal,
        // value.sepPlanTotal, value.octPlanTotal, value.novPlanTotal, value.decPlanTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_acmslt,
        // data : [ value.janAcmsltTotal, value.febAcmsltTotal, value.marAcmsltTotal, value.aprAcmsltTotal,
        // value.mayAcmsltTotal, value.junAcmsltTotal, value.julyAcmsltTotal, value.augAcmsltTotal,
        // value.sepAcmsltTotal, value.octAcmsltTotal, value.novAcmsltTotal, value.decAcmsltTotal ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.janDif, value.febDif, value.marDif, value.aprDif, value.mayDif, value.junDif,
        // value.julyDif, value.augDif, value.sepDif, value.octDif, value.novDif, value.decDif ]
        // } );
        // }
        // i++;
        // } );
    }

    // 그래프4
    $ ( '#rptGraph4' ).highcharts (
            {
                chart : {
                    marginTop : 50,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 556
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
                    align : 'right',
                    verticalAlign : 'top',
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

    varxxSeries = [];
    varxxSeriesYear = [];
    listSize = Object.keys ( data.childList06 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        $.each ( data.childList06, function ( key, value )
        {
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#d0d0d1',
                name : value.corprOmNm,
                data : [ value.totalPlanSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#558bdc',
                name : value.corprAmNm,
                data : [ value.totalAcmsltSum ]
            } );
            varxxSeriesYear.push ( {
                type : 'column',
                yAxis : 0,
                color : '#8f8f92',
                name : value.corprEpcNm,
                data : [ value.totalDif ]
            } );

            if ( j > 2 )
            {
                j = 0;
            }
            j++;

        } );
        // $.each ( data.childList03, function ( key, value )
        // {
        // if ( i == listSize )
        // {
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#d0d0d1',
        // name : i18nMessage.msg_plan,
        // data : [ value.totalPlanSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#ea762c',
        // name : i18nMessage.msg_acmslt,
        // data : [ value.totalAcmsltSum ]
        // } );
        // varxxSeries.push ( {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : [ value.totalDif ]
        // } );
        // }
        // i++;
        // } );
    }

    $ ( '#rptGraph41' ).highcharts (
            {
                chart : {
                    marginTop : 20,
                    spacingBottom : 10,
                    marginBottom : 30,
                    type : 'column',
                    width : 156
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
                        y : 20
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

    // '#bababa', '#f4bc1d', '#8f8f92', '#ea5b2f', '#4f86c3'
    varxxData01 = [];
    varxxAcmsltColor = [];
    varxxPlanColor = [ '#bababa', '#f4bc1d', '#8f8f92', '#ea5b2f', '#4f86c3' ];

    j = 0;
    if ( data.childList07 != null )
    {
        $.each ( data.childList07, function ( key, value )
        {
            varxxData01.push ( {
                name : value.parntsItemIdNm,
                y : value.totalRate,
                y_label : value.totalAcmsltSum
            } );
            varxxAcmsltColor.push ( varxxPlanColor[j] );
            if ( j > 4 )
            {
                j = 0;
            }
            j++;
        } );
    }

    // [ {
    // 'name' : '인건비',
    // 'y' : 60,
    // 'y_label' : '657,000'
    // }

    // 그래프5
    $ ( '#rptGraph5' ).highcharts ( {
        chart : {
            events : {
                // 디자인만 참고하시고 맞는 설정으로 적용해주세요
                load : function ()
                {
                    var label = this.renderer.label ( '' ).add ();
                    label.align ( Highcharts.extend ( label.getBBox (), {
                        align : 'left',
                        x : 90, // offset
                        verticalAlign : 'middle',
                        y : 0
                    // offset
                    } ), null, 'spacingBox' );
                }
            },
            height : 247,
            width : 400,
            marginBottom : 30,
            marginTop : 0,
            type : 'pie'
        },
        legend : {
            labelFormatter : function ()
            {
                return '<div>' + this.name + '</div>';
            },
            align : 'center',
            verticalAlign : 'bottom',
            layout : 'horizontal',
            itemMarginBottom : 0,
            floating : true,
            symbolWidth : 8,
            symbolHeight : 8,
            symbolRadius : 10,
            y : 10
        },
        credits : {
            enabled : false
        },
        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
        tooltip : {
            pointFormat : '{series.name}: <b>{point.percentage:.1f} %</b>'
        },
        title : {
            text : '',
            style : {
                display : 'none'
            }
        },
        plotOptions : {
            pie : {
                shadow : false,
                size : '100%',
                innerSize : '60%',
                dataLabels : {
                    enabled : false
                },
                showInLegend : true
            }
        },
        series : [ {
            type : 'pie',
            name : i18nMessage.msg_operationCost,
            data : varxxData01
        } ]
    } );
}

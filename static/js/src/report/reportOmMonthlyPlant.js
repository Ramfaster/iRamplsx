function fnRptOmMonthlyPlantInit ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{
    fnRptOmMonthlyPlantLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm );
}

function fnRptOmMonthlyPlantLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{

    var tpl = getTemplate ( templates.reportOmMonthlyPlantStatus );

    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportOmMonthlyPlantList.ajax',
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
                    var msgslist = {
                        msg_reportEnergyCurrentStatus : i18nMessage.msg_reportEnergyCurrentStatus,
                        msg_unitKwh : i18nMessage.msg_unitKwh,
                        msg_plan : i18nMessage.msg_plan,
                        msg_acmslt : i18nMessage.msg_acmslt,
                        msg_contrast : i18nMessage.msg_contrast,
                        msg_state : i18nMessage.msg_state,
                        msg_statusGood : i18nMessage.msg_statusGood,
                        msg_statusBad : i18nMessage.msg_statusBad,
                        msg_statusNormal : i18nMessage.msg_statusNormal,
                        msg_planOver : i18nMessage.msg_planOver,
                        msg_planAgainstDown : i18nMessage.msg_planAgainstDown,
                        msg_planAgainstExceed : i18nMessage.msg_planAgainstExceed,
                        msg_operationalOverview : i18nMessage.msg_operationalOverview,
                        msg_notes : i18nMessage.msg_notes,
                        msg_yearAccumulatationUnit : i18nMessage.msg_yearAccumulatationUnit,
                        msg_spotMonth : i18nMessage.msg_spotMonth,
                        msg_energyPr : i18nMessage.msg_energyPr,
                        msg_energyRdtn : i18nMessage.msg_energyRdtn
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        msg_selection : i18nMessage.msg_selection,
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
                    fnRptOmMonthlyPlantHighcharts ( json.data );
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
function fnRptOmMonthlyPlantWarnLoad ( divHtmlId,
                                       callbackfn,
                                       rptSeq,
                                       rptMbySectn,
                                       rptMbyId,
                                       rptTyCd,
                                       rptCycleCd,
                                       stdrYm )
{

    var tpl = getTemplate ( templates.reportOmMonthlyPlantWarn );

    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportOmMonthlyPlantWarnList.ajax',
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
                    var msgslist = {
                        msg_terminateDate : i18nMessage.msg_terminateDate,
                        msg_notes : i18nMessage.msg_notes,
                        msg_incidentList : i18nMessage.msg_incidentList,
                        msg_createDate : i18nMessage.msg_createDate,
                        msg_faultTime : i18nMessage.msg_faultTime,
                        msg_content : i18nMessage.msg_content,
                        msg_internalExternal : i18nMessage.msg_internalExternal,
                        msg_powerLossMwh : i18nMessage.msg_powerLossMwh,
                        msg_note : i18nMessage.msg_note,
                        msg_selection : i18nMessage.msg_selection,
                        msg_noData : i18nMessage.msg_sentenceGridNoData
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        dataSize : Object.keys ( json.data.childAcdntRstprtList ).length,
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
function fnRptOmMonthlyPlantTotalLoad ( divHtmlId,
                                        callbackfn,
                                        rptSeq,
                                        rptMbySectn,
                                        rptMbyId,
                                        rptTyCd,
                                        rptCycleCd,
                                        stdrYm )
{

    var tpl = getTemplate ( templates.reportOmMonthlyPlantTotal );

    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportOmMonthlyPlantTotalList.ajax',
        type : 'GET',
        async : false,
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            paramRunOmRptAjax03 = false;

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = {
                        msg_notes : i18nMessage.msg_notes,
                        msg_maintenanceList : i18nMessage.msg_maintenanceList,
                        msg_no2 : i18nMessage.msg_no2,
                        msg_enforcementDate : i18nMessage.msg_enforcementDate,
                        msg_terminateDate : i18nMessage.msg_terminateDate,
                        msg_repairItem : i18nMessage.msg_repairItem,
                        msg_repairResult : i18nMessage.msg_repairResult,
                        msg_lossMwh : i18nMessage.msg_lossMwh,
                        msg_worker : i18nMessage.msg_worker,
                        msg_workPicture : i18nMessage.msg_workPicture,
                        msg_workBefore : i18nMessage.msg_workBefore,
                        msg_workAfter : i18nMessage.msg_workAfter,
                        msg_selection : i18nMessage.msg_selection,
                        msg_noData : i18nMessage.msg_sentenceGridNoData
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        dataSize01 : Object.keys ( json.data.childBrrercoRstprtList ).length,
                        dataSize02 : Object.keys ( json.data.childFileDetlInfoList ).length,
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

function fnRptOmMonthlyPlantHighcharts ( data )
{
    var digit = staticVariable.decimalPoint;

    var varxxCategories = [ '16-01', '16-02', '16-03', '16-04', '16-05', '16-06', '16-07' ];
    var varxxData01 = [];// 계획
    var varxxData02 = [];// 실적
    var varxxData03 = [];// 차이
    var varxxData04 = [];// PR
    var varxxData05 = [];// 일사량

    var xxplotBands = 0;

    // statsDtFormat
    if ( data.childList02 != null )
    {
        if ( Object.keys ( data.childList02 ).length > 0 )
        {
            varxxCategories = [];
            $.each ( data.childList02, function ( key, value )
            {
                // alert ( key + ' ' + value.statsDtFormat );
                varxxCategories.push ( value.statsDtFormat );
                varxxData01.push ( value.goalGeneqty );
                // varxxData01.push ( value.goalGeneqtyPct );
                // varxxData02.push ( value.statsValTodayPct );
                varxxData02.push ( value.statsVal );
                varxxData03.push ( value.statsValDiffPct );
                varxxData04.push ( value.statsValSumPct );

            } );
        }
        xxplotBands = Object.keys ( data.childList02 ).length;
    }
    // if ( data.childList04 != null )
    // {
    // if ( Object.keys ( data.childList04 ).length > 0 )
    // {
    // $.each ( data.childList04, function ( key, value )
    // {
    // varxxData04.push ( value.statsVal );
    // } );
    // }
    // }
    // 그래프1
    $ ( '#rptGraph7' ).highcharts ( {
        chart : {
            marginTop : 50,
            marginLeft : 70,
            marginRight : 50,
            marginBottom : 42,
            spacingLeft : 0,
            spacingBottom : 0,
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
            align : 'right',
            verticalAlign : 'top',
            floating : true,
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
                text : i18nMessage.msg_energyXWh,
                style : {},
                margin : 10,
            },
            labels : {
                x : -10
            }
        }, {
            opposite : true,
            min : 0,
            // max : 100,
            title : {
                text : i18nMessage.msg_pr,
                style : {},
                margin : 30,
            },
            labels : {
                align : 'right',
                x : 24
            }

        } ],
        plotOptions : {
            column : {
                pointPadding : 0,
                borderWidth : 0
            }
        },
        tooltip : {
            shared : true
        },
        series : [ {
            type : 'column',
            yAxis : 0,
            color : '#bababa',
            name : i18nMessage.msg_plan,
            data : varxxData01
        }, {
            type : 'column',
            yAxis : 0,
            color : '#ea5b30',
            name : i18nMessage.msg_acmslt,
            data : varxxData02
        }
        // , {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : varxxData03
        // }
        , {
            type : 'line',
            yAxis : 1,
            color : '#95c623',
            name : i18nMessage.msg_pr,
            data : varxxData04
        } ]
    } );

    varxxData01 = [];// 계획
    varxxData02 = [];// 실적
    varxxData03 = [];// 차이
    varxxData04 = [];// PR
    varxxData05 = [];// 일사량

    // statsDtFormat
    if ( data.childList03 != null )
    {
        if ( Object.keys ( data.childList03 ).length > 0 )
        {
            // varxxCategories = [];
            $.each ( data.childList03, function ( key, value )
            {
                varxxData01.push ( value.goalGeneqtyToday );
                varxxData02.push ( value.statsVal );
                varxxData03.push ( value.statsValTodayDiff );
                varxxData05.push ( value.statsValTodayPct );
            } );
        }
    }
    // if ( data.childList03 != null )
    // {
    // if ( Object.keys ( data.childList03 ).length > 0 )
    // {
    // $.each ( data.childList02, function ( key, value )
    // {
    // varxxData05.push ( value.statsVal );
    // } );
    // }
    // }

    $ ( '#rptGraph71' ).highcharts ( {
        chart : {
            marginTop : 50,
            marginLeft : 60,
            marginRight : 60,
            marginBottom : 42,
            spacingLeft : 0,
            spacingBottom : 0,
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
            align : 'right',
            verticalAlign : 'top',
            floating : true,
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
                text : i18nMessage.msg_energyXWh,
                style : {},
                margin : 10,
            },
            labels : {
                x : -10
            }
        }, {
            opposite : true,
            min : 0,
            title : {
                text : i18nMessage.msg_radiationkWhMonthly,
                style : {},
                margin : 30,
            },
            labels : {
                align : 'right',
                x : 24
            }

        } ],
        plotOptions : {
            column : {
                pointPadding : 0,
                borderWidth : 0
            }
        },
        tooltip : {
            shared : true
        },
        series : [ {
            type : 'column',
            yAxis : 0,
            color : '#bababa',
            name : i18nMessage.msg_plan,
            data : varxxData01
        }, {
            type : 'column',
            yAxis : 0,
            color : '#ea5b30',
            name : i18nMessage.msg_acmslt,
            data : varxxData02
        }
        // , {
        // type : 'column',
        // yAxis : 0,
        // color : '#8f8f92',
        // name : i18nMessage.msg_contrast,
        // data : varxxData03
        // }
        , {
            type : 'line',
            yAxis : 1,
            color : '#105eaa',
            name : i18nMessage.msg_rdtn,
            data : varxxData05
        } ]
    } );

}

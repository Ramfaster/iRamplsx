function fnRptOmDailyPlantInit ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{
    fnRptOmDailyPlantLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm );
}

function fnRptOmDailyPlantLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{

    var tpl = getTemplate ( templates.reportOmDailySpc );

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
        url : contextPath + '/hom/reportmgt/selectReportOmDailyPlantList.ajax',
        type : 'GET',
        async : true,
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
                        msg_reportToday : i18nMessage.msg_reportToday,
                        msg_monthAccumulatationUnit : i18nMessage.msg_monthAccumulatationUnit,
                        msg_selection : i18nMessage.msg_selection,
                        msg_pr : i18nMessage.msg_pr,
                        msg_pvName : i18nMessage.msg_pvName

                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
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
                    fnRptOmDailyPlantHighcharts ( json.data );
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

function fnRptOmDailyPlantHighcharts ( data )
{
    var digit = staticVariable.decimalPoint;

    var varxxCategories = [ '16-01', '16-02', '16-03', '16-04', '16-05', '16-06', '16-07' ];
    var varxxData01 = [];// 계획
    var varxxData02 = [];// 실적
    var varxxData03 = [];// 차이
    var varxxData04 = [];// PR
    var varxxData05 = [];// 일사량

    // statsDtFormat
    if ( data.childList04 != null )
    {
        if ( Object.keys ( data.childList04 ).length > 0 )
        {
            varxxCategories = [];
            $.each ( data.childList04, function ( key, value )
            {
                // alert ( key + ' ' + value.statsDtFormat );
                varxxCategories.push ( value.pvIdNm );
                // varxxData01.push ( value.goalGeneqtyToday );
                varxxData01.push ( value.goalGeneqtyPct );
                varxxData02.push ( value.statsValTodayPct );
                varxxData03.push ( value.statsValDiffPct );
                varxxData05.push ( value.statsValTodayDiff );
                varxxData04.push ( value.statsVal );
            } );
        }
    }
    // if ( data.childList03 != null )
    // {
    // if ( Object.keys ( data.childList03 ).length > 0 )
    // {
    // $.each ( data.childList03, function ( key, value )
    // {
    // varxxData05.push ( value.statsValTodayPct );
    // } );
    // }
    // }
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
    $ ( '#rptGraph1' ).highcharts ( {
        chart : {
            marginTop : 50,
            marginLeft : 80,
            marginRight : 100,
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

            }
        },
        yAxis : [ {
            min : 0,
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
                text : i18nMessage.msg_radiationkWhDaily,
                style : {},
                margin : 50,
            },
            labels : {
                align : 'right',
                x : 24
            }
        }
        // , {
        // opposite : true,
        // min : 0,
        // // max : 100,
        // title : {
        // text : i18nMessage.msg_pr,
        // style : {},
        // margin : 30,
        // },
        // labels : {
        // align : 'right',
        // x : 24
        // }
        // }
        ],
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
        // , {
        // type : 'line',
        // yAxis : 1,
        // color : '#95c623',
        // name : i18nMessage.msg_pr,
        // data : varxxData04
        // }
        , {
            type : 'line',
            yAxis : 1,
            color : '#0068b7',
            name : i18nMessage.msg_rdtn,
            data : varxxData05
        } ]
    } );
    $ ( '#rptGraph11' ).highcharts ( {
        chart : {
            marginTop : 50,
            marginLeft : 80,
            marginRight : 100,
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

            }
        },
        yAxis : [ {
            min : 0,
            title : {
                text : i18nMessage.msg_energyXWh,
                style : {},
                margin : 10,
            },
            labels : {
                x : -10
            }
        }
        // , {
        // opposite : true,
        // min : 0,
        // title : {
        // text : i18nMessage.msg_radiationkWhDaily,
        // style : {},
        // margin : 30,
        // },
        // labels : {
        // align : 'right',
        // x : 24
        // }
        // }
        , {
            opposite : true,
            min : 0,
            // max : 100,
            title : {
                text : i18nMessage.msg_pr,
                style : {},
                margin : 50,
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
        }
        // , {
        // type : 'line',
        // yAxis : 1,
        // color : '#0068b7',
        // name : i18nMessage.msg_rdtn,
        // data : varxxData05
        // }
        ]
    } );

}

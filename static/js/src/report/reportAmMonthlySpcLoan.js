// 대출금 상황 탭
function fnRptAmSpcLoanLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{

    var tpl = getTemplate ( templates.reportAmMonthlySpcLoan );

    var amtIndictUnitCd3 = null;
    if ( $ ( "#amtIndictUnitCd3" ) != 'undefined' )
    {
        amtIndictUnitCd3 = $ ( 'input:radio[name=amtIndictUnitCd3]:checked' ).val ();
    }
    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        spcId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm,
        amtIndictUnitCd3 : amtIndictUnitCd3
    };

    var messages = {
        select : i18nMessage.msg_selection,
        msg : i18nMessage.msg_reportPower
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportAmMonthlySpcLoanInfoList.ajax',
        type : 'GET',
        async : false,
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = []
                    msgslist = {
                        msg_amountUnit : i18nMessage.msg_amountUnit,
                        msg_loanRepayStatus : i18nMessage.msg_loanRepayStatus,
                        msg_assetLoanWithdraw : i18nMessage.msg_assetLoanWithdraw,
                        msg_loanAmount : i18nMessage.msg_loanAmount,
                        msg_disparity : i18nMessage.msg_disparity,
                        msg_repayDate : i18nMessage.msg_repayDate,
                        msg_amount : i18nMessage.msg_amount,
                        msg_lender : i18nMessage.msg_lender,
                        msg_note : i18nMessage.msg_note,
                        msg_repayAccumulation : i18nMessage.msg_repayAccumulation,
                        msg_loanBalance : i18nMessage.msg_loanBalance,
                        msg_notes : i18nMessage.msg_notes

                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        msg_selection : messages,
                        loanInfo : json.data
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

                    fnRptAmSpcLoanHighcharts ( json );

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

// 대출금상황 차트
function fnRptAmSpcLoanHighcharts ( json )
{
    var digit = staticVariable.decimalPoint;

    if ( Object.keys ( json.data.childList01 ).length > 0 )
    {
        $ ( '#rptGraph6' ).show ();
        // $ ( '#graph11NoData' ).hide ();

        var data1 = [];
        var data2 = [];
        var categories = [];
        var total = 0;

        $.each ( json.data.childList01, function ( key, item )
        {

            categories.push ( item.odrSeq + i18nMessage.msg_assetCount );

            total += item.repyAmount;
            data1.push ( item.lonTotAmt - total );
            data2.push ( total );
        } );

        // homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

        $ ( '#rptGraph6' )
                .highcharts (
                        {
                            chart : {
                                marginTop : 40,
                                spacingBottom : 10,
                                marginBottom : 30,
                                type : 'column',
                                width : 738
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
                                symbolHeight : 8,
                                y : -5
                            },
                            exporting : {
                                enabled : false
                            },
                            credits : {
                                enabled : false
                            },
                            xAxis : {
                                categories : categories,
                                crosshair : true,
                            },
                            yAxis : [ {
                                min : 0,
                                title : {
                                    text : i18nMessage.msg_amount + '( /'
                                            + homUtil.mathFloorComma ( json.data.amtIndictUnitCdVal3, 0 ) + ' )',
                                    style : {}
                                }
                            } ],
                            tooltip : {
                                pointFormat : '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                                shared : true
                            },
                            plotOptions : {
                                column : {
                                    stacking : 'percent'
                                }
                            },
                            series : [ {
                                type : 'column',
                                yAxis : 0,
                                color : '#bababa',
                                name : i18nMessage.msg_amountLoan,
                                data : data1
                            }, {
                                type : 'column',
                                yAxis : 0,
                                color : '#ea5b30',
                                name : i18nMessage.msg_amountRepay,
                                data : data2
                            } ]
                        } );
    } else
    {
        $ ( '#rptGraph6' ).hide ();
        // $ ( '#graph1NoData' ).show ();
    }

}

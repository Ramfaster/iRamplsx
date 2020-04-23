function fnRptAmSpcFinanceLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{

    var tpl = getTemplate ( templates.reportAmMonthlySpcFin );
    var amtIndictUnitCd4 = null;
    if ( $ ( "#amtIndictUnitCd4" ) != 'undefined' )
    {
        amtIndictUnitCd4 = $ ( 'input:radio[name=amtIndictUnitCd4]:checked' ).val ();
    }
    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm,
        amtIndictUnitCd4 : amtIndictUnitCd4
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportAmMonthlyPlantFinList.ajax',
        type : 'GET',
        async : false,
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            paramRunOmRptAjax04 = false;

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = []
                    msgslist = {
                        msg_amountUnit : i18nMessage.msg_amountUnit,
                        msg_incomeStatement : i18nMessage.msg_incomeStatement,
                        msg_expenseStatus : i18nMessage.msg_expenseStatus,
                        msg_division : i18nMessage.msg_division,
                        msg_current : i18nMessage.msg_current,
                        msg_former : i18nMessage.msg_former,
                        msg_note : i18nMessage.msg_note,
                        msg_statementPosition : i18nMessage.msg_statementPosition,
                        msg_cashFlow2 : i18nMessage.msg_cashFlow2,
                        msg_notes : i18nMessage.msg_notes,
                        msg_selection : i18nMessage.msg_selection,
                        msg_unit : i18nMessage.msg_unit,
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

                        // if ( Object.keys ( json.data.childBrrercoRstprtList ).length > 0 ){ // {
                        $ ( ".tdGubunPvIdNm04" ).each ( function ()
                        {
                            var rows = $ ( ".tdGubunPvIdNm04:contains('" + $ ( this ).text () + "')" );
                            // alert ( rows.length + ' ' + $ ( this ).text () );
                            if ( rows.length > 1 )
                            {
                                rows.eq ( 0 ).attr ( "rowspan", rows.length );
                                rows.not ( ":eq(0)" ).remove ();
                            }
                        } );
                        // }}

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

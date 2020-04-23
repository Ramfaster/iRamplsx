function fnRptAmPlantLoanLoad ( divHtmlId, callbackfn, rptSeq, rptMbySectn, rptMbyId, rptTyCd, rptCycleCd, stdrYm )
{
    var tpl = getTemplate ( templates.reportAmMonthlyPlantLoan );
    var amtIndictUnitCd3 = null;
    if ( $ ( "#amtIndictUnitCd3" ) != 'undefined' )
    {
        amtIndictUnitCd3 = $ ( 'input:radio[name=amtIndictUnitCd3]:checked' ).val ();
    }
    var params = {
        rptSeq : rptSeq,
        rptMbySectn : rptMbySectn,
        rptMbyId : rptMbyId,
        rptTyCd : rptTyCd,
        rptCycleCd : rptCycleCd,
        stdrYm : stdrYm,
        amtIndictUnitCd3 : amtIndictUnitCd3
    };

    divHtmlId.removeClass ( 'on' );
    $.ajax ( {
        url : contextPath + '/hom/reportmgt/selectReportAmMonthlyPlantInsurList.ajax',
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

                    var msgslist = []
                    msgslist = {
                        msg_amountUnit : i18nMessage.msg_amountUnit,
                        msg_reportInsuranceStatus : i18nMessage.msg_reportInsuranceStatus,
                        msg_disparity : i18nMessage.msg_disparity,
                        msg_joinDate : i18nMessage.msg_joinDate,
                        msg_premium : i18nMessage.msg_premium,
                        msg_InsurerName : i18nMessage.msg_InsurerName,
                        msg_annual : i18nMessage.msg_annual,
                        msg_note : i18nMessage.msg_note,
                        msg_notes : i18nMessage.msg_notes,
                        msg_selection : i18nMessage.msg_selection
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

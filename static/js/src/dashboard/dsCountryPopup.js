function customizeScroll ()
{
	$('.intbl_scrl').perfectScrollbar();
}

function initData()
{
	var tpl = getTemplate ( templates.dsCountryPopupTr );
	
	//기존 정보 삭제
	$ ( '#popupTable tr' ).remove();
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/selectTotalPvDtInfo.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var siteRepInfoList = json.data;
            	var template;
            	template = _.template ( tpl );   		
        		var html = template ( {
        			dsGroupPopupMap : json.data
                 } ); 
            	console.log(json.data);
            	$ ( '#popupTable' ).append ( html );
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
    });
}

$ ( function ()
{
	customizeScroll ();
	initData();
} );
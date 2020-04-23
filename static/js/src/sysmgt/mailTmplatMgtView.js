// set contents
function setConts ()
{
    // TODO 나중에 contextPath를 빼고 절대경로로 바꾸기
    $.ajax ( {
        url : templates.mailTmplatConts,
        type : 'GET',
        async : false,
        success : function ( template )
        {
            var template = _.template ( template );
            html = template ( {
                contextPath : contextPath,
                marginAuto : false,
                conts : mailTmplatConts
            } );

            $ ( '.preview_cont' ).html ( html );
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

$ ( function ()
{
    setConts ();
} );
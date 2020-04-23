// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

// scroll customize
function customizeScroll ()
{
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_intbl_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// copy 체크
function checkCopy ()
{
    var $btnCopy = $ ( '#btn_copy' );

    $btnCopy.on ( 'click', function ()
    {
        var $that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertAuthorityCopyConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                location.href = $that.attr ( 'href' );
            }
        } );

        return false;
    } );
}

// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.on ( 'click', function ()
    {
        var $that = $ ( this );

        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                location.href = $that.attr ( 'href' );
            }
        } );

        return false;
    } );
}

// treemenu customize
function customizeTree ()
{
    var setting = {
        view : {
            showIcon : false
        },
        data : {
            simpleData : {
                enable : true
            }
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/menu/selectMenuInfoTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            authGrpId : authGrpId,
            enableRoot : false,
            chkDisabled : true
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
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

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    customizeTree ();
    checkCopy ();
    checkDelete ();
} );
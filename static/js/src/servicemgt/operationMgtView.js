var popupUrl = contextPath + '/hom/servicemgt/operation/operationMgtPopup.do';

function initialization ()
{

    var $btnDelete = $ ( '#btnDelete' );
    var $btnUpdate = $ ( '#btnUpdate' );

    var opertPlanMastrId = $ ( '#opertPlanMastrId' ).val ();
    var opertPlanSeq = $ ( '#opertPlanSeq' ).val ();
    var occrrncId = $ ( '#occrrncId' ).val ();
    var $btnPopup = $ ( '.btn_popup' );

    $btnDelete.click ( function ()
    {
        if ( confirm ( i18nMessage.msg_alertDeleteConfirm ) )
        {
            deleteOperationPlanInfo ( opertPlanMastrId, opertPlanSeq );
        }
    } );

    $btnUpdate.click ( function ()
    {
        $.when ( $btnPopup.magnificPopup ( 'close' ) ).done (
                function ()
                {
                    console.log ( 'magnificPopup close' );
                    var params = '?'
                            + encodeURI ( 'opertPlanSeq=' + opertPlanSeq + '&occrrncId=' + occrrncId + '&selectPvId='
                                    + viewSelectedPvId );

                    console.log ( "update href : " + popupUrl );

                    $ ( '.btn_popup_hidden' ).prop ( 'href', popupUrl + params );

                    console.log ( "btn_popup_hidden : " + $ ( '.btn_popup_hidden' ).prop ( 'href' ) );

                    // $ ( '.btn_popup' ).trigger ( 'click' );
                    /* TODO : trigger 함수가 바로 호출되지 않는 이유? */
                    setTimeout ( "$ ( '.btn_popup_hidden' ).trigger ( 'click' )", 1000 * 1 );
                } );

        // updateFlag = true;

        // $btnPopup.magnificPopup ( 'close' );
    } );
}

function updateLayerPopupOpen ()
{
    var opertPlanMastrId = $ ( '#opertPlanMastrId' ).val ();
    var opertPlanSeq = $ ( '#opertPlanSeq' ).val ();
    var occrrncId = $ ( '#occrrncId' ).val ();

    var params = '?' + encodeURI ( 'opertPlanSeq=' + opertPlanSeq + '&occrrncId=' + occrrncId );

    console.log ( "update href : " + popupUrl );

    $ ( '.btn_popup_hidden' ).prop ( 'href', popupUrl + params );

    console.log ( "btn_popup_hidden : " + $ ( '.btn_popup_hidden' ).prop ( 'href' ) );

    $ ( '.btn_popup_hidden' ).trigger ( 'click' );

    // updateFlag = false;
}

// 운영일정관리(작업 계획 정보) 삭제 처리
function deleteOperationPlanInfo ( opertPlanMastrId, opertPlanSeq )
{
    var params = {
        opertPlanMastrId : opertPlanMastrId,
        opertPlanSeq : opertPlanSeq
    };

    var $btnPopup = $ ( '.btn_popup' );

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/operation/deleteOperationPlanInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alertMsg = i18nMessage.msg_alertDelete;
                alert ( alertMsg );

                $btnPopup.magnificPopup ( 'close' );

                $ ( '#calendar' ).fullCalendar ( 'refetchEvents' );
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
    initialization ();
} );
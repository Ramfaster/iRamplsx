function btncopyitemcheck ()
{
    if ( typeof $ ( "#btn_copy_popup_exec" ) !== 'undefined' )
    {
        $ ( "#btn_copy_popup_exec" ).on ( 'click', function ()
        {
            var params = {
                popupCopyPvId1 : $ ( ':selected', $ ( '#popupCopyPvId1' ) ).val (),
                popupCopyPvId2 : $ ( ':selected', $ ( '#popupCopyPvId2' ) ).val ()
            };

            $.ajax ( {
                url : contextPath + '/hom/asset/plantCostItem/copyItemPopup.ajax',
                type : 'GET',
                data : params,
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( Object.keys ( json.data ).length > 0 )
                        {
                            if ( json.data[0].isExistData > 0 )
                            {
                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : i18nMessage.msg_sentenceAssetCopyCantCause,
                                    checkText : i18nMessage.msg_ok,
                                    cancelText : i18nMessage.msg_cancel,
                                    type : staticVariable.dialogTypeInfo
                                } );
                            } else
                            {
                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : i18nMessage.msg_sentenceAssetCopyCantCompletion,
                                    checkText : i18nMessage.msg_ok,
                                    cancelText : i18nMessage.msg_cancel,
                                    type : staticVariable.dialogTypeInfo
                                } );
                                customizeTree ();
                                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                                var treeNode = zTree.getSelectedNodes ();

                                // alert ( treeNode );

                                var postData = null;
                                // alert ( treeNode.pId + ' ' + treeNode.spcId );
                                // paramSpcId = treeNode.mdlPid;

                                postData = {
                                    itemId : treeNode.id,
                                    spcId : treeNode.mdlPid
                                };
                                // paramItemId = treeNode.id;

                                $ ( '#gridList' ).setGridParam ( {
                                    postData : postData
                                } ).trigger ( 'reloadGrid' );
                            }
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
        } );
    }
}
// form element customize
function customizeForm ()
{
    var $dateType1 = $ ( '#popupCopyPvId1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
    var $dateType1 = $ ( '#popupCopyPvId2' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    $ ( "#popupCopyPvId1" ).on ( 'change', fnPopupCopyTextValue );
    $ ( "#popupCopyPvId2" ).on ( 'change', fnPopupCopyTextValue );
}

function fnPopupCopyTextValue ()
{
    $ ( "#div_pop_subtxt01" ).text (
            $ ( ':selected', $ ( '#popupCopyPvId1' ) ).text () + ' > '
                    + $ ( ':selected', $ ( '#popupCopyPvId2' ) ).text () + ' ' + i18nMessage.msg_sentenceAssetCopy );
}

function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

$ ( function ()
{
    customizeForm ();
    btncopyitemcheck ();
    fnPopupCopyTextValue ();
} );
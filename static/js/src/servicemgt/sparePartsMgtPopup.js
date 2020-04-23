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

            if ( params.popupCopyPvId1 === params.popupCopyPvId2 )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertSelectedPvEqual,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

            } else
            {
                $.ajax ( {
                    url : contextPath + '/hom/servicemgt/spare/copyItemPopup.ajax',
                    type : 'POST',
                    data : params,
                    dataType : 'json',
                    success : function ( json )
                    {
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            if ( json.data )
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
                                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                                var treeNodes = zTree.getNodes ();

                                var pvTreeNode = null;
                                _.each ( treeNodes, function ( treeNode )
                                {
                                    var children = treeNode.children;
                                    pvTreeNode = _.find ( treeNode.children, function ( node )
                                    {
                                        return params.popupCopyPvId2 == node.id;
                                    } );
                                } );

                                if ( pvTreeNode != null )
                                {
                                    zTree.checkNode ( pvTreeNode, true, true );
                                    zTree.selectNode ( pvTreeNode, false, true );

                                    sparePartsMgt.pvId = pvTreeNode.id;
                                    sparePartsMgt.preparprdClCd = '';
                                    sparePartsMgt.preparprdItemCd = '';

                                    sparePartsMgt.pvChangeFlag = true;
                                    reloadPartsTypeJqgrid ();
                                }

                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : i18nMessage.msg_sentenceAssetCopyCantCompletion,
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
            }
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

    $ ( '#popupCopyPvId1' ).on ( 'change', fnPopupCopyTextValue );
    $ ( '#popupCopyPvId2' ).on ( 'change', fnPopupCopyTextValue );
}

function fnPopupCopyTextValue ()
{
    $ ( "#div_pop_subtxt01" ).text (
            $ ( ':selected', $ ( '#popupCopyPvId1' ) ).text () + ' > '
                    + $ ( ':selected', $ ( '#popupCopyPvId2' ) ).text () + ' ' + i18nMessage.msg_preparprdPartsCopy );
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
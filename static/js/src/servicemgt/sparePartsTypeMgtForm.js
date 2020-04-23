var sparePartsMgt = null;

// form element customize
function customizeForm ()
{
    var $searchType2 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

/**
 * 트리 초기화
 */
function initTreeList ()
{
    var setting = {
        view : {
            showIcon : false
        },
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all',
            chkDisabled : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {
            beforeClick : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getSelectedNodes ();
                if ( selectedNodes.length > 0 && selectedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( treeNode.chkDisabled )
                    {
                        return false;
                    } else
                    {
                        zTree.checkNode ( treeNode, true, true );
                        showTreeLocation ( zTree, treeNode );
                    }

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );
                    showTreeLocation ( zTree, treeNode );
                    $.jgrid.gridUnload ( '#gridList' );

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
                }
            }
        }
    };

    var params = {
        treeType : staticVariable.treeTypeNationPv
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( paramPvId !== '' )
                {
                    $.each ( json.data, function ( index, data )
                    {
                        if ( data.id === paramPvId )
                        {
                            data.checked = true;
                        }
                    } );
                }

                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                // chkDisabled가 true 되어 있는 상태에서는 node정보를 가져올 수 없으므로 false, true 처리
                setAllTreeNodeChkDisabled ( zTree, nodes, false );

                var checkedNodes = zTree.getCheckedNodes ( true );

                setAllTreeNodeChkDisabled ( zTree, nodes, true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                    setAllTreeNodeChkDisabled ( zTree, nodes, true );
                } else if ( checkedNodes.length === 0 )
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.id == paramPvId )
                        {
                            node.checked = true;
                            sparePartsMgt.pvId = node.id;

                            zTree.refresh ();
                            checkedNode = node;
                            return false;
                        }
                    } );

                }

                customizeScroll ();

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

// 트리 location 표시
function showTreeLocation ( zTree, treeNode )
{
    var separateChar = '<i class="icon_gt"></i>';
    var nodeName = getHierarchyTreeNodeName ( zTree, treeNode, separateChar );
    var cdNm = separateChar;
    if ( paramPreparprdClCdNm !== null && paramPreparprdClCdNm !== '' && paramPreparprdItemCdNm !== null
            && paramPreparprdItemCdNm !== '' )
    {
        cdNm += paramPreparprdClCdNm + separateChar + paramPreparprdItemCdNm;
    } else
    {
        cdNm += i18nMessage.msg_newRegister;
    }

    if ( nodeName !== null )
    {
        nodeName += separateChar + treeNode.name + cdNm;
    } else
    {
        nodeName = treeNode.name + cdNm;
    }
    $ ( '#tree_location' ).html ( nodeName );
}

// 트리 계층 노드 이름 조회
function getHierarchyTreeNodeName ( zTree, treeNode, separateChar )
{
    var node = zTree.getNodeByParam ( 'id', treeNode.pId );

    if ( node !== null && node.pId !== null )
    {
        return getHierarchyTreeNodeName ( zTree, node, separateChar ) + separateChar + node.name;
    } else if ( node !== null && node.pId === null )
    {
        return node.name;
    } else
    {
        return null;
    }

}

// 모든 트리 노드 enable/disable 처리
function setAllTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        zTree.setChkDisabled ( nodes[i], disabled );
    }
}

// 예비품 유형에 따른 품명 조회
function getPreparprdItemList ( isKorean )
{
    var $selPreparprdClCd = $ ( '#sel_preparprdClCd' );

    var tpl = getTemplate ( templates.preparprdInfoSelect );

    $selPreparprdClCd.on ( 'change', function ()
    {
        getPreparprdItemListAjax ( isKorean, $selPreparprdClCd, tpl );
    } );
}

// 예비품 유형에 따라 품명 조회 ajax
function getPreparprdItemListAjax ( isKorean, $selPreparprdClCd, tpl )
{
    var $selPreparprdItemCd = $ ( '#sel_preparprdItemCd' );

    var params = {
        cdId : $selPreparprdClCd.val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/spare/selectPreparprdItemList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        message : i18nMessage.msg_preparprdItemCd,
                        isKorean : isKorean,
                        cmmnCdList : json.data
                    } );

                    $selPreparprdItemCd.empty ().html ( html ).trigger ( 'change' );
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

function spareTypeValidate ()
{
    $ ( '#sparePartsTypeForm' ).validate (
            {
                rules : {
                    preparprdClCd : {
                        selectRequired : true
                    },
                    preparprdItemCd : {
                        selectRequired : true
                    },
                    proprtQty : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );
                                return true;
                            }
                        },
                        number : true
                    }
                },
                messages : {
                    preparprdClCd : {
                        selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredPreparprdClcd )
                    },
                    preparprdItemCd : {
                        selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredPreparprdItemCd )
                    },
                    proprtQty : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredProprtQty ),
                        number : makeValidateMessage ( i18nMessage.msg_validNumberProprtQty )
                    }
                },
                submitHandler : function ( form )
                {
                    var duplFlag = null;
                    var pvId = paramPvId;
                    var preparprdClCd = $ ( '#sel_preparprdClCd' ).val ();
                    var preparprdItemCd = $ ( '#sel_preparprdItemCd' ).val ();

                    if ( method === staticVariable.methodInsert )
                    {
                        duplFlag = checkDuplicateItemCd ( pvId, preparprdClCd, preparprdItemCd );
                    }

                    if ( duplFlag )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertDuplicateSpareItem,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        return;
                    }

                    $.when (
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : method === staticVariable.methodInsert ? i18nMessage.msg_alertCreateConfirm
                                        : i18nMessage.msg_alertUpdateConfirm,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeConfirm
                            } ) ).then ( function ( confirm )
                    {
                        if ( confirm )
                        {
                            form.submit ();
                        }
                    } );

                }
            } );
}

function checkDuplicateItemCd ( pvId, preparprdClCd, preparprdItemCd )
{
    var flag = false;
    var params = {
        pvId : pvId,
        preparprdClCd : preparprdClCd,
        preparprdItemCd : preparprdItemCd
    };

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/spare/checkDuplicateItemCd.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                flag = json.data;
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

    return flag;
}

function btnClick ()
{
    var $btnList = $ ( '#btnList' );

    $btnList.on ( 'click', function ()
    {
        var params = {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : paramPreparprdClCd,
            preparprdItemCd : paramPreparprdItemCd,
            searchPreparprdClCd : paramSearchPreparprdClCd,
            searchPreparprdItemCd : paramSearchPreparprdItemCd
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
}

// 기준 항목 초기화(등록 화면)
function spareTypeInitialization ()
{
    $ ( '#btnReset' ).click ( function ()
    {

        $ ( 'form' ).each ( function ()
        {
            this.reset ();
            $ ( 'input[type=text]:enabled, textarea:enabled, select:enabled' ).not ( ':input[readonly]' ).val ( '' );

        } );

        $ ( 'label.error' ).remove ();
        $ ( '.frm_type' ).removeClass ( 'error' );
        $ ( '.customize_radio' ).trigger ( 'change' );

        if ( method === staticVariable.methodInsert )
        {
            $ ( '#sel_preparprdClCd, #sel_preparprdItemCd' ).trigger ( 'change' );
        }
    } );

}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    sparePartsMgt = {
        pvId : paramPvId,
        preparprdClCd : paramPreparprdClCd,
        preparprdItemCd : paramPreparprdItemCd
    }
    customizeForm ();
    customizeScroll ();
    getPreparprdItemList ( isKorean );
    initTreeList ();
    spareTypeValidate ();
    btnClick ();
    spareTypeInitialization ();
} );
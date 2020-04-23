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
}

// treemenu customize
function customizeTree ()
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
                }
            }
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/cmmncd/selectCmmnCdTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            clCd : paramClCd,
            cdId : paramCdId,
            enableRoot : true,
            chkDisabled : false
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // console.log ( json.data );

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
                    var node = zTree.getNodeByParam ( 'id', paramClCd );

                    zTree.selectNode ( node );
                    zTree.checkNode ( node, true, true );
                    showTreeLocation ( zTree, node );
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

    $ ( '#tree_location' ).html ( nodeName !== null ? nodeName + separateChar + treeNode.name : treeNode.name );

}

// 트리 계층 노드 이름 조회
function getHierarchyTreeNodeName ( zTree, treeNode, separateChar )
{
    var node = zTree.getNodeByParam ( 'id', treeNode.pId );
    if ( node !== null && node.pId !== null )
    {
        clCd = node.id;
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
// 버튼 그룹 switch
function clickEditButton ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

    var $btnEdit01 = $ ( '#btn_edit01' );
    $btnEdit01.click ( function ()
    {

        var templateClCd = $ ( '#templateClCd' ).html ();

        if ( paramTreeLevel <= 1 )
        {
            level = 0;
            if ( paramTreeLevel === 1 )
            {
                var level = paramTreeLevel - 1;
            }
            location.href = contextPath + '/hom/sysmgt/cmmncd/form.do?clCd=' + paramClCd + '&treeLevel=' + level
                    + '&method=update';
        } else
        {
            location.href = contextPath + '/hom/sysmgt/cmmncd/form.do?cdId=' + paramCdId + '&parntsCdId='
                    + paramParntsCdId + '&treeLevel=' + paramTreeLevel + '&clCd=' + paramClCd + '&method=update';
        }

    } );

}

// 항목 삭제 버튼 클릭
function clickDeleteButton ()
{

    var btnDelete = $ ( '#btn_delete' );

    btnDelete.click ( function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var treeNode = zTree.getCheckedNodes ( true );

        var templateClCd = $ ( '#templateClCd' ).html ();

        if ( treeNode[0].level <= 1 )
        {
            if ( treeNode[0].children != null )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validExistChildCode,
                    checkText : i18nMessage.msg_ok,
                    type : staticVariable.dialogTypeInfo
                } );

            } else
            {
                $.when ( $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertDeleteConfirm,
                    checkText : i18nMessage.msg_ok,
                    type : staticVariable.dialogTypeConfirm
                } ) ).then ( function ( confirm )
                {
                    if ( confirm )
                    {
                        location.href = contextPath + '/hom/sysmgt/cmmncd/delete.do?clCd=' + treeNode[0].id;
                    }
                } );

            }

        } else
        {
            if ( treeNode[0].children != null )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validExistChildCode,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

            } else
            {
                $.when ( $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertDeleteConfirm,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeConfirm
                } ) ).then (
                        function ( confirm )
                        {
                            if ( confirm )
                            {
                                location.href = contextPath + '/hom/sysmgt/cmmncd/delete.do?cdId=' + treeNode[0].id
                                        + '&clCd=' + treeNode[0].cmmnClCd;
                            }
                        } );

            }

        }

    } );
}

// 항목 추가 버튼 클릭
function clickAddButton ()
{
    var $btnAdd01 = $ ( '#btn_Add01' );

    $btnAdd01.click ( function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var treeNode = zTree.getCheckedNodes ( true );

        var templateClCd = $ ( '#templateClCd' ).html ();

        if ( treeNode[0].level === 0 )
        {
            location.href = contextPath + '/hom/sysmgt/cmmncd/form.do?clCd=' + treeNode[0].id + '&treeLevel='
                    + treeNode[0].level + '&method=insert';
        } else
        {
            if ( treeNode[0].level === 1 )
            {
                location.href = contextPath + '/hom/sysmgt/cmmncd/form.do?parntsCdId=' + treeNode[0].pId
                        + '&treeLevel=' + treeNode[0].level + '&clCd=' + treeNode[0].id + '&method=insert';
            } else
            {
                location.href = contextPath + '/hom/sysmgt/cmmncd/form.do?cdId=' + treeNode[0].id + '&parntsCdId='
                        + treeNode[0].id + '&treeLevel=' + treeNode[0].level + '&clCd=' + treeNode[0].cmmnClCd
                        + '&method=insert';
            }
        }

    } );
}
$ ( function ()
{
    customizeTree ();

    clickEditButton ();
    clickDeleteButton ();
    clickAddButton ();
} );
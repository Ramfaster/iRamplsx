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
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
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
                        if ( typeof $ ( "#paramDelete" ) !== 'undefined' )
                        {
                            zTree.checkNode ( treeNode, true, true );

                            showTreeLocation ( zTree, treeNode );
                            reloadJqgrid ( treeNode );
                        }
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( typeof $ ( "#paramDelete" ) !== 'undefined' )
                    {
                        zTree.selectNode ( treeNode );

                        showTreeLocation ( zTree, treeNode );
                        reloadJqgrid ( treeNode );
                    }
                }
            }
        }
    };

    $.ajax ( {
        url : contextPath + '/hom/asset/companyCostItem/selectItemInfoTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            method : paramMethod,
            itemId : paramItemId,
            enableRoot : true,
            chkDisabled : paramChkDisabled
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );
                // alert ( checkedNodes.length );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                    paramItemId = checkedNodes[0].id;
                    paramSpcId = checkedNodes[0].mdlPid;
                    paramParntsItemCd = checkedNodes[0].pId;
                } else if ( checkedNodes.length === 0 )
                {
                    var node = zTree.getNodeByParam ( 'id', paramItemId );

                    zTree.selectNode ( node );
                    zTree.checkNode ( node, true, true );
                    showTreeLocation ( zTree, node );
                    paramItemId = node.id;
                    paramSpcId = node.mdlPid;
                    paramParntsItemCd = node.pId;
                }

                setTreeNodeChkDisabled ( zTree, nodes );

                customizeScroll ();
                customizeJqgrid ();
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

// 프로그램이 있는 트리 노드 및 level - 5 트리 노드 enable/disable 처리
function setTreeNodeChkDisabled ( zTree, nodes )
{
    // for ( var i = 0, length = nodes.length; i < length; i++ )
    // {
    // if ( (nodes[i].progrmUrl !== 'javascript:;' && nodes[i].id.indexOf ( '_VIRTUAL_' ) === -1)
    // || nodes[i].level === 5 )
    // {
    // zTree.setChkDisabled ( nodes[i], true );
    // }
    // }
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
        return getHierarchyTreeNodeName ( zTree, node, separateChar ) + separateChar + node.name;
    } else if ( node !== null && node.pId === null )
    {
        return node.name;
    } else
    {
        return null;
    }

}

function showAllAssetCopyPopup ()
{
    var btnPopup = $ ( "#all_asset_copy_popup" ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

function customFormat ( cellValue, options, rowdata, action )
{
    // return homUtil.addNumberComma ( cellValue );
    return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

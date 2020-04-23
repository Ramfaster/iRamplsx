var mntrcItmMgt = null;

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
function getItmList ()
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

    if ( parmUriPath === staticVariable.aplctnSectnCdInspectionUri )
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdInspection
    } else if ( parmUriPath === staticVariable.aplctnSectnCdRepairUri )
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdRepair
    } else
    {
        mntrcItmMgt.aplctnSectnCd = staticVariable.aplctnSectnCdIncident
    }

    var params = {
        treeType : staticVariable.treeTypeStandartItem,
        eqmtId : mntrcItmMgt.itemId,
        pvId : mntrcItmMgt.pvId,
        aplctnSectnCd : mntrcItmMgt.aplctnSectnCd
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
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
        itemId = node.id;
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

function btnClick ()
{
    var $btnList = $ ( '#btnList' );
    var $btnUpdate = $ ( '#btnUpdate' );

    $btnList.on ( 'click', function ()
    {
        var params = {

            pvId : paramPvId,
            itemId : paramPitemId
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );

    $btnUpdate.on ( 'click', function ()
    {
        var params = {
            method : method,
            pvId : paramPvId,
            itemId : paramItemId,
            parntsItemId : paramPitemId,
            treeLevel : paramTreeLevel
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );

}

// 삭제 체크
function checkBtnLinks ()
{
    var $btnDelete = $ ( '#btn_delete' );

    if ( typeof $btnDelete !== 'undefined' )
    {
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
}

$ ( function ()
{
    mntrcItmMgt = {
        pvId : paramPvId,
        itemId : paramItemId,
        aplctnSectnCd : null
    };
    customizeScroll ();
    getItmList ();
    btnClick ();
    checkBtnLinks ();
} );
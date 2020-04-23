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

    $ ( '.scroll' ).mCustomScrollbar ( {
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
function initTree ( data )
{
    // 트리메뉴
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
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                zTree.selectNode ( treeNode );

                moveListPage ( treeNode );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

/**
 * 트리 초기화
 */
function initTree2 ( data )
{
    // 트리메뉴
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
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                zTree.checkNode ( treeNode, true, true );

                moveListPage ( treeNode );
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                zTree.selectNode ( treeNode );

                moveListPage ( treeNode );
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList2' ), setting, data );
}

/**
 * 발전소 설비 목록
 */
function getEqmtTreeList ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ()
    var params = {
        eqmtId : eqmtId,
        chkDisabled : false,
        treeType : staticVariable.treeTypeEqmtInfo
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
                var node = _.find ( json.data, function ( node )
                {
                    return node.id === eqmtId;
                } );

                if ( node !== null && typeof node !== 'undefined' )
                {
                    node.checked = true;
                }

                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                }

                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );
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

/**
 * 발전소 설비 목록
 */
function getEqmtTreeList2 ()
{
    var eqmtId = $ ( "input[name=eqmtId]" ).val ()
    var params = {
        eqmtId : eqmtId,
        chkDisabled : false,
        treeType : staticVariable.treeTypeEssEqmtInfo
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
                var node = _.find ( json.data, function ( node )
                {
                    return node.id === eqmtId;
                } );

                if ( node !== null && typeof node !== 'undefined' )
                {
                    node.checked = true;
                }

                initTree2 ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList2" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                }

                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );
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

// 해당 리스트 페이지로 이동
function moveListPage ( treeNode )
{
    var children = treeNode.children;
    var param = null;
    if ( ((typeof children !== 'undefined' && children.length != 0) || treeNode.pId === staticVariable.eqmtTreeRoot)
            && treeNode.id !== staticVariable.eqmtTreeRoot )
    {
        location.href = contextPath + '/hom/masterdata/equipment/list.do?eqmtId=' + treeNode.id + '&eqmtGrpCd='
                + treeNode.eqmtGrpCd;
    }
}

// 자식이 없는 트리 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        var children = nodes[i].children;
        if ( nodes[i].id.indexOf ( 'STR' ) < 0
                && nodes[i].id.indexOf ( 'TRR' ) < 0
                && (((typeof children === 'undefined' || children.length == 0) && nodes[i].pId !== staticVariable.eqmtTreeRoot) || nodes[i].id === staticVariable.eqmtTreeRoot) )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
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
    var node = null;
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

$ ( function ()
{
    getEqmtTreeList ();
    getEqmtTreeList2 ();
    customizeScroll ();
} );
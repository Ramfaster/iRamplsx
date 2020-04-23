var sparePartsMgt = null;

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

                            zTree.selectNode ( checkedNode );
                            showTreeLocation ( zTree, checkedNode );
                            setAllTreeNodeChkDisabled ( zTree, nodes, true );
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
    if ( nodeName !== null )
    {
        nodeName += separateChar + treeNode.name + separateChar + paramPreparprdClCdNm + separateChar
                + paramPreparprdItemCdNm;
    } else
    {
        nodeName = treeNode.name + separateChar + paramPreparprdClCdNm + separateChar + paramPreparprdItemCdNm;
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

// 모든 트리 노드 enable/disable 처리
function setAllTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        zTree.setChkDisabled ( nodes[i], disabled );
    }
}

// 삭제 체크
function checkBtnLinks ()
{
    var $btnDelete = $ ( '#btn_delete' );
    var $btnList = $ ( '#btn_list' );

    var menuIdArray = [];
    var menuRelateCountArray = [];

    if ( typeof $btnDelete !== 'undefined' )
    {
        $btnDelete.on ( 'click', function ()
        {
            var $that = $ ( this );
            var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
            var node = null;
            var childFlag = true;
            var relateFlag = true;

            for ( var i = 0, length = menuIdArray.length; i < length; i++ )
            {
                node = zTree.getNodeByParam ( 'id', menuIdArray[i] );

                var childNodes = $.fn.zTree.getZTreeObj ( 'treeList' ).getNodesByFilter ( function ()
                {
                    return true;
                }, false, node );

                var childLength = childNodes.length;
                if ( childLength > 0 )
                {
                    for ( var j = 0, childLength = childNodes.length; j < childLength; j++ )
                    {
                        if ( childNodes[j].id !== '' )
                        {
                            childFlag = false;
                            break;
                        }
                    }
                }
            }

            for ( var i = 0, length = menuRelateCountArray.length; i < length; i++ )
            {
                if ( $.isNumeric ( menuRelateCountArray[i] ) )
                {
                    var menuRelateCount = parseInt ( menuRelateCountArray[i], 10 );

                    if ( menuRelateCount > 0 )
                    {
                        relateFlag = false;
                        break;
                    }
                }
            }

            // if ( childFlag && relateFlag )
            // {
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
            // } else
            // {
            // $.customizeDialog ( {
            // template : templates.dialog,
            // message : i18nMessage.msg_validExistChildMenu,
            // checkText : i18nMessage.msg_ok,
            // cancelText : i18nMessage.msg_cancel,
            // type : staticVariable.dialogTypeInfo
            // } );
            // }
            return false;
        } );
    }

    if ( typeof $btnList !== 'undefined' )
    {
        $btnList.on ( 'click', function ()
        {
            location.href = $ ( this ).attr ( 'href' ) + '&itemId=' + paramParntsItemId + '' + '&searchKey='
                    + paramSearchKey + '&searchKeyword=' + paramSearchKeyword;
            return false;
        } );
    }
    // location.href = $ ( this ).attr ( 'href' ) + '&spcId=' + paramSpcId + '&parntsItemId=' + paramItemId;
}

$ ( function ()
{
    sparePartsMgt = {
        pvId : paramPvId,
        preparprdClCd : paramPreparprdClCd,
        preparprdItemCd : paramPreparprdItemCd
    }
    initTreeList ();
    customizeScroll ();
    btnClick ();
    checkBtnLinks ();
} );
var mntrcItmMgt = null;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
    $ ( '#file1' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : '파일 등록',
        buttonSpriteClass : 'btn_file01',
        buttonTextColor : '#4c4743',
        buttonWidth : 90,
        textWidth : 280,
        height : 25
    } );

    // 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
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
}

function mntrcItmJqgrid ()
{
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;

    if ( lang === locale.korea || lang === locale.korean )
    {
        colNames = [ i18nMessage.msg_itemId, "발전소아이디", "부모 아이디", i18nMessage.msg_mntrcItmName,
                i18nMessage.msg_inspectionType, i18nMessage.msg_inspectionContents ];
        colModel = [ {
            name : 'itemId',
            align : 'center',
            hidden : true
        }, {
            name : 'pvId',
            align : 'center',
            hidden : true
        }, {
            name : 'parntsItemId',
            align : 'center',
            hidden : true
        }, {
            name : 'itemKorNm',
            width : 410,
            align : 'left'
        }, {
            name : 'chckTy',
            width : 400,
            align : 'left'
        }, {
            name : 'chckConts',
            width : 400,
            align : 'left',
            fixed : true
        } ];
    } else
    {
        colNames = [ i18nMessage.msg_itemId, "발전소아이디", "부모 아이디", i18nMessage.msg_mntrcItmName,
                i18nMessage.msg_inspectionType, i18nMessage.msg_inspectionContents ];
        colModel = [ {
            name : 'itemId',
            align : 'center',
            hidden : true
        }, {
            name : 'pvId',
            align : 'center',
            hidden : true
        }, {
            name : 'parntsItemId',
            align : 'center',
            hidden : true
        }, {
            name : 'itemEngNm',
            width : 410,
            align : 'left'
        }, {
            name : 'chckTy',
            width : 400,
            align : 'left'
        }, {
            name : 'chckConts',
            width : 400,
            align : 'left',
            fixed : true
        } ];
    }

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + parmUriPath + '/selectMntrcItmGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                datatype : 'json',
                postData : {
                    pvId : mntrcItmMgt.pvId,
                    itemId : mntrcItmMgt.itemId === '' ? ' ' : mntrcItmMgt.itemId,
                    aplctnSectnCd : mntrcItmMgt.aplctnSectnCd
                },
                height : 642,
                colNames : colNames,
                colModel : colModel,
                sortname : 'itemId',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );
                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        for ( var i = 0, length = ids.length; i < length; i++ )
                        {
                            var id = ids[i];
                            var rowData = $gridList.getRowData ( id );

                            $gridList.jqGrid ( 'setRowData', id, rowData );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'itemId',
                                value : rowData.itemId
                            } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'itemIds' );
                        }

                    }

                    if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                    {
                        enableJqgridCheckbox ( $gridList, $checkboxs )
                    } else
                    {
                        disableJqgridCheckbox ( $gridList, $checkboxs )
                    }

                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowData = $gridList.getRowData ( rowId );

                    location.href = contextPath + parmUriPath + '/view.do?pvId=' + rowData.pvId + '&itemId='
                            + rowData.itemId + '&parntsItemId=' + rowData.parntsItemId + '&treeLevel='
                            + mntrcItmMgt.level;
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

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
                        $.jgrid.gridUnload ( '#gridList' );

                        if ( treeNode.level == 1 )
                        {
                            mntrcItmMgt.pvId = treeNode.id;
                            mntrcItmMgt.itemId = ' ';
                        } else
                        {
                            var nodeIds = treeNode.id.split ( '_' );
                            if ( nodeIds.length > 1 )
                            {
                                mntrcItmMgt.itemId = nodeIds[1];
                            } else
                            {
                                mntrcItmMgt.itemId = treeNode.id;
                            }
                            mntrcItmMgt.pvId = treeNode.pvId;
                            mntrcItmMgt.level = treeNode.level;

                        }
                        mntrcItmJqgrid ();
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

                    mntrcItmMgt.pvId = treeNode.pvId;

                    if ( treeNode.level == 1 )
                    {
                        mntrcItmMgt.pvId = treeNode.id;
                        mntrcItmMgt.itemId = ' ';

                    } else
                    {
                        var nodeIds = treeNode.id.split ( '_' );
                        if ( nodeIds.length > 1 )
                        {
                            mntrcItmMgt.itemId = nodeIds[1];
                        } else
                        {
                            mntrcItmMgt.itemId = treeNode.id;
                        }
                        mntrcItmMgt.pvId = treeNode.pvId;
                        mntrcItmMgt.level = treeNode.level;

                    }
                    mntrcItmJqgrid ();

                    $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
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
        aplctnSectnCd : mntrcItmMgt.aplctnSectnCd
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

                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                    
                    mntrcItmMgt.level = checkedNodes[0].level;
                } else if ( checkedNodes.length === 0 )
                {
                    if ( paramItemId !== '' )
                    {
                    	var splitId = paramItemId.split('_');
                    	
                    	var checkNodeId;
                    	if(splitId.length > 1 )
                    	{
                    		checkNodeId = paramItemId;
                    		mntrcItmMgt.itemId = splitId[1];
                    	}else
                    	{
                    		checkNodeId = paramPvId + '_' + paramItemId;
                    		mntrcItmMgt.itemId = paramItemId;
                    	}
                    	
                        var node = zTree.getNodeByParam ( 'id', checkNodeId );
//                        var node = zTree.getNodeByParam ( 'id', paramItemId );

                        zTree.selectNode ( node );
                        zTree.checkNode ( node, true, true );
                        showTreeLocation ( zTree, node );
                        
                        mntrcItmMgt.level = node.level;
                    } else
                    {
                        if ( paramPvId !== '' )
                        {
                            var node = zTree.getNodeByParam ( 'id', paramPvId );

                            zTree.selectNode ( node );
                            zTree.checkNode ( node, true, true );
                            showTreeLocation ( zTree, node );
                            
                            mntrcItmMgt.level = node.level;

                        } else
                        {
                            // check노드가 없을 경우 check 설정
                            $.each ( nodes, function ( i, node )
                            {
                                if ( node.level == 1 )
                                {
                                    node.checked = true;
                                    mntrcItmMgt.pvId = node.id;
                                    mntrcItmMgt.itemId = ' '
                                    zTree.refresh ();
                                    checkedNode = node;
                                    return false;
                                }
                            } );
                        }
                    }
                }
                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );
                mntrcItmJqgrid ();
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
        return getHierarchyTreeNodeName ( zTree, node, separateChar ) + separateChar + node.name;
    } else if ( node !== null && node.pId === null )
    {
        return node.name;
    } else
    {
        return null;
    }
}

// 제일 상위 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( nodes[i].pId == null )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }

        if ( parmUriPath === staticVariable.aplctnSectnCdInspectionUri )
        {
            if ( nodes[i].level == 5 )
            {
                zTree.setChkDisabled ( nodes[i], true );
            }
        } else
        {
            if ( nodes[i].level == 4 )
            {
                zTree.setChkDisabled ( nodes[i], true );
            }
        }
    }
}

function btnClick ()
{
    var $btnAdd = $ ( '#btnAdd' );

    $btnAdd.on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var treeNode = zTree.getCheckedNodes ( true );

        var params = {
            pvId : treeNode[0].level === 1 ? treeNode[0].id : treeNode[0].pvId,
            parntsItemId : treeNode[0].level === 1 ? '' : treeNode[0].id,
            treeLevel : treeNode[0].level,
            flag : paramFlag
        };

        location.href = $ ( this ).attr ( 'href' ) + "&" + $.param ( params );
        return false;
    } );

}

function showAllAssetCopyPopup ()
{
    var btnPopup = $ ( "#all_mntrc_copy_popup" ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );
}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( 'setGridParam', {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );
}

// jqgrid 편집 disable 처리
function disableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'showCol', [ 'rn' ] );
    $gridList.jqGrid ( 'hideCol', [ 'cb' ] );

    // onSelectRow event 적용
    $gridList.jqGrid ( 'setGridParam', {
        beforeSelectRow : function ( rowId, e )
        {
            return true;
        }
    } );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit = $ ( '#btn_edit' );
    var $btnCancel = $ ( '#btn_cancel' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    $btnEdit.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        enableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', true );
    } );

    $btnCancel.on ( 'click', function ()
    {
        var $gridList = $ ( '#gridList' );
        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        disableJqgridCheckbox ( $gridList, $checkboxs );
        $gridList.jqGrid ( 'sortableRows', false );
    } );
}

// 삭제 체크
function checkBtnDelete ()
{
    $ ( '#btn_delete' ).on (
            'click',
            function ()
            {
                var itemIdArray = [];
                var $that = $ ( this );

                $ ( '.itemIds' ).each ( function ()
                {
                    if ( $ ( this ).prop ( 'checked' ) )
                    {
                        itemIdArray.push ( $ ( this ).val () );
                    }
                } );

                if ( itemIdArray.length === 0 )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertNoSelectedDeleteItem,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else
                {
                    var $gridList = $ ( '#gridList' );
                    var ids = $gridList.jqGrid ( 'getDataIDs' );
                    var deletePvId = null;
                    var deleteParntsItemId = null;
                    for ( var i = 0, length = ids.length; i <= length; i++ )
                    {
                        var rowData = $gridList.getRowData ( ids[i] );

                        deletePvId = rowData.pvId;
                        deleteParntsItemId = rowData.parntsItemId;

                        break;
                    }
                    
                    var treeObj = $.fn.zTree.getZTreeObj("treeList");
                    
                    var nodes;
                    for(var i =0, length = itemIdArray.length; i < length; i++ )
                    {
                    	var nodeId;
//                    	if(deleteParntsItemId !== '')
//                    	{
//                    		nodeId = deletePvId+'_'+itemIdArray[i]
//                    	}else
//                    	{
//                    		nodeId = itemIdArray[i];
//                    	}
                    	nodeId = deletePvId+'_'+itemIdArray[i];
                    	var deleteNode = treeObj.getNodeByParam ( 'id', nodeId);
                    	if(typeof deleteNode !== 'undefined' && deleteNode !== null)
                    	{
                    		nodes = deleteNode.children;
                        	
                        	if( typeof nodes !== 'undefined' && nodes !== null&& nodes.length > 0)
                        	{
                        		break;
                        	}
                    	}
                    	
                    }
                    if ( typeof nodes !== 'undefined' && nodes !== null && nodes.length > 0 )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validExistChildCode,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                        
                        return false;
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
	                                    location.href = $that.attr ( 'href' ) + '?pvId=' + deletePvId + '&itemIdArray='
	                                            + itemIdArray.toString () + '&parntsItemId=' + deleteParntsItemId
	                                            + '&treeLevel=' + mntrcItmMgt.level + '&flag=' + paramFlag;
	                                }
	                            } );
	                 }
                }

                return false;
            } );
}

// 메시지 체크
function checkMessage ()
{
    if ( paramDelete )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDelete,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }
}

$ ( function ()
{
    mntrcItmMgt = {
        pvId : paramPvId,
        itemId : paramItemId,
        parntsItemId : paramPitemId,
        level : 1,
        aplctnSectnCd : null
    };
       
    customizeForm ();
    customizeScroll ();

    getItmList ();
    btnClick ();
    showAllAssetCopyPopup ();
    switchButtonGroup ();
    checkBtnDelete ();
    checkMessage ();
} );
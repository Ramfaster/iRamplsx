var sparePartsMgt = null;

// form element customize
function customizeForm ()
{
    var $selType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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

                        sparePartsMgt.pvId = treeNode.id;
                        sparePartsMgt.preparprdClCd = '';
                        sparePartsMgt.preparprdItemCd = '';

                        sparePartsMgt.pvChangeFlag = true;
                        reloadPartsTypeJqgrid ();

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

                    sparePartsMgt.pvId = treeNode.id;
                    sparePartsMgt.preparprdClCd = '';
                    sparePartsMgt.preparprdItemCd = '';

                    sparePartsMgt.pvChangeFlag = true;
                    reloadPartsTypeJqgrid ();

                }
                $ ( '.tree_wrap' ).mCustomScrollbar ( 'update' );
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

                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                    showTreeLocation ( zTree, checkedNodes[0] );
                } else if ( checkedNodes.length === 0 )
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.level == 1 && paramPvId === '' )
                        {
                            node.checked = true;
                            sparePartsMgt.pvId = node.id;
                            zTree.refresh ();
                            checkedNode = node;
                            return false;
                        } else if ( node.id == paramPvId && paramPvId !== '' )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;
                        }
                    } );
                }
                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );
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
function sparePartsTypeJqGrid ()
{
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    var noDataId = 'spareType_jqgrid_nodata';

    colNames = [ 'pvId', 'preparprdClCd', i18nMessage.msg_preparprdClcd, 'preparprdItemCd',
            i18nMessage.msg_preparprdItemCd, i18nMessage.msg_proprtQty, i18nMessage.msg_holdQty,
            i18nMessage.msg_presentQty, i18nMessage.msg_detailView ];
    colModel = [
            {
                name : 'pvId',
                align : 'center',
                hidden : true
            },
            {
                name : 'preparprdClCd',
                align : 'center',
                hidden : true
            },
            {
                name : 'preparprdClCdNm',
                width : 330,
                align : 'left'
            },
            {
                name : 'preparprdItemCd',
                align : 'left',
                hidden : true
            },
            {
                name : 'preparprdItemCdNm',
                width : 244,
                align : 'left'
            },
            {
                name : 'proprtQty',
                width : 160,
                align : 'right'
            },
            {
                name : 'holdQty',
                width : 160,
                align : 'right'
            },
            {
                name : 'presentQty',
                width : 160,
                align : 'right'
            },
            {
                name : 'preparprdView',
                width : 160,
                align : 'center',
                fixed : true,
                formatter : function ( cellValue, options, rowObject )
                {
                    return '<a href="javascript:;" class="btn_jqgrid" id="btn_' + options.rowId + '">'
                            + i18nMessage.msg_detailView + '</a>';
                }
            } ];

    $ ( '#gridList' ).jqGrid ( {
        url : contextPath + '/hom/servicemgt/spare/selectSparePartsTypeGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 240,
        autowidth : true,
        async : false,
        shrinkToFit : false,
        datatype : 'json',
        postData : {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : sparePartsMgt.preparprdClCd,
            preparprdItemCd : sparePartsMgt.preparprdItemCd
        },
        colNames : colNames,
        colModel : colModel,
        sortname : 'preparprdClCd',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gridList = $ ( '#gridList' );
            var $gqNodata = $ ( '#' + noDataId );
            if ( data.records === 0 )
            {
                $gqNodata.show ();

                if ( sparePartsMgt.initFlag || sparePartsMgt.searchFlag || sparePartsMgt.pvChangeFlag )
                {
                    sparePartsMgt.preparprdClCd = '';
                    sparePartsMgt.preparprdItemCd = '';

                    if ( sparePartsMgt.initFlag )
                    {
                        sparePartsJqGrid ();
                    } else if ( sparePartsMgt.searchFlag || sparePartsMgt.pvChangeFlag )
                    {
                        reloadPartsJqgrid ();
                    }
                    sparePartsMgt.initFlag = false;
                    sparePartsMgt.searchFlag = false;
                    sparePartsMgt.pvChangeFlag = false;
                }

            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $gridList.jqGrid ( "getDataIDs" );
                var selectedData = null;
                for ( var i = 0, length = ids.length; i < length; i++ )
                {
                    var id = ids[i];
                    var rowData = $gridList.getRowData ( id );

                    $gridList.jqGrid ( 'setRowData', id, rowData );

                    if ( sparePartsMgt.initFlag || sparePartsMgt.searchFlag || sparePartsMgt.pvChangeFlag )
                    {
                        sparePartsMgt.pvId = rowData.pvId;
                        sparePartsMgt.preparprdClCd = rowData.preparprdClCd;
                        sparePartsMgt.preparprdItemCd = rowData.preparprdItemCd;

                        if ( sparePartsMgt.initFlag )
                        {
                            sparePartsJqGrid ();
                        } else if ( sparePartsMgt.searchFlag || sparePartsMgt.pvChangeFlag )
                        {
                            reloadPartsJqgrid ();
                        }
                        sparePartsMgt.initFlag = false;
                        sparePartsMgt.searchFlag = false;
                        sparePartsMgt.pvChangeFlag = false;

                    }

                }

            }
            preparprdItemView ();

        },

        onSelectRow : function ( rowId, status )
        {
            var $gridList = $ ( '#gridList' );
            var rowData = $gridList.getRowData ( rowId );

            sparePartsMgt.preparprdClCd = rowData.preparprdClCd;
            sparePartsMgt.preparprdItemCd = rowData.preparprdItemCd;

            reloadPartsJqgrid ();
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData,
            id : noDataId
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

}

function sparePartsJqGrid ()
{

    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    var noDataId = 'spare_jqgrid_nodata';

    colNames = [ 'mgtSeq', 'pvId', 'preparprdClCd', i18nMessage.msg_preparprdClcd, 'preparprdItemCd',
            i18nMessage.msg_preparprdItemCd, i18nMessage.msg_manufacturer, i18nMessage.msg_model,
            i18nMessage.msg_serialNum, i18nMessage.msg_useAvailability, i18nMessage.msg_stockedDate,
            i18nMessage.msg_usgDate ];

    colModel = [ {
        name : 'mgtSeq',
        align : 'center',
        hidden : true
    }, {
        name : 'pvId',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdClCd',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdClCdNm',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdItemCd',
        align : 'left',
        hidden : true
    }, {
        name : 'preparprdItemCdNm',
        width : 172,
        align : 'left'
    }, {
        name : 'corprNm',
        width : 172,
        align : 'left'
    }, {
        name : 'modlNm',
        width : 172,
        align : 'left'
    }, {
        name : 'sn',
        width : 172,
        align : 'left'
    }, {
        name : 'usgAt',
        width : 171,
        align : 'center'
    }, {
        name : 'purchsDt',
        width : 171,
        align : 'center'
    }, {
        name : 'usgDt',
        width : 171,
        align : 'center'
    } ];

    var preparprdClCd = 'all';
    var preparprdItemCd = 'all';
    if ( paramPreparprdClCd !== '' )
    {
        preparprdClCd = paramPreparprdClCd;
    } else if ( sparePartsMgt.preparprdClCd !== '' )
    {
        preparprdClCd = sparePartsMgt.preparprdClCd
    }

    if ( paramPreparprdItemCd !== '' )
    {
        preparprdItemCd = paramPreparprdItemCd;
    } else if ( sparePartsMgt.preparprdItemCd !== '' )
    {
        preparprdItemCd = sparePartsMgt.preparprdItemCd
    }

    $ ( '#gridList2' ).jqGrid ( {
        url : contextPath + '/hom/servicemgt/spare/selectSparePartsGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 240,
        autowidth : true,
        async : false,
        shrinkToFit : false,
        datatype : 'json',
        postData : {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : preparprdClCd,
            preparprdItemCd : preparprdItemCd
        },
        colNames : colNames,
        colModel : colModel,
        sortname : 'preparprdClCd',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gridList = $ ( '#gridList2' );
            var $gqNodata = $ ( '#' + noDataId );
            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $gridList.jqGrid ( 'getDataIDs' );
                for ( var i = 0, length = ids.length; i < length; i++ )
                {
                    var id = ids[i];
                    var rowData = $gridList.getRowData ( id );

                    // 사용 여부(사용/입고) alias
                    if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                    {
                        rowData.usgAt = i18nMessage.msg_use;
                    } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                    {
                        rowData.usgAt = i18nMessage.msg_stocked;
                    }

                    $gridList.jqGrid ( 'setRowData', id, rowData );

                }

            }

        },
        onSelectRow : function ( rowId, status )
        {
            var $gridList = $ ( '#gridList2' );
            var rowData = $gridList.getRowData ( rowId );

            var $searchPreparprdClCd = $ ( '#sel_preparprdClCd' );
            var $searchPreparprdItemCd = $ ( '#sel_preparprdItemCd' );

            var params = {
                pvId : rowData.pvId,
                preparprdClCd : rowData.preparprdClCd,
                preparprdItemCd : rowData.preparprdItemCd,
                mgtSeq : rowData.mgtSeq,
                searchPreparprdClCd : $searchPreparprdClCd.val (),
                searchPreparprdItemCd : $searchPreparprdItemCd.val ()
            };

            location.href = contextPath + '/hom/servicemgt/spare/sparePartsView.do?' + $.param ( params );
        }

    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData,
            id : noDataId
        } );

        $ ( '#gridList2' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

}

// jqgrid reload
function reloadPartsJqgrid ()
{
    var $gridList = $ ( '#gridList2' );

    $gridList.setGridParam ( {
        postData : {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : sparePartsMgt.preparprdClCd === '' ? 'all' : sparePartsMgt.preparprdClCd,
            preparprdItemCd : sparePartsMgt.preparprdItemCd === '' ? 'all' : sparePartsMgt.preparprdItemCd
        }
    } ).trigger ( 'reloadGrid' );
}

// 예비품 관리 대장 jqgrid reload
function reloadPartsTypeJqgrid ()
{
    var $gridList = $ ( '#gridList' );

    $gridList.setGridParam ( {
        postData : {
            pvId : sparePartsMgt.pvId,
            preparprdClCd : sparePartsMgt.preparprdClCd,
            preparprdItemCd : sparePartsMgt.preparprdItemCd
        }
    } ).trigger ( 'reloadGrid' );
}

// 예비품 항목 정보 jqgrid reload
function searchPartsTypeJqgrid ()
{
    var $gridList = $ ( '#gridList' );
    var $btn_search = $ ( '#btn_search' );

    $btn_search.on ( 'click', function ()
    {
        sparePartsMgt.preparprdClCd = $ ( '#sel_preparprdClCd' ).val ();
        sparePartsMgt.preparprdItemCd = $ ( '#sel_preparprdItemCd' ).val ();
        reloadPartsTypeJqgrid ();
        reloadPartsJqgrid ();
        sparePartsMgt.searchFlag = true;
    } );

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
    if ( sparePartsMgt.initFlag )
    {
        $selPreparprdClCd.trigger ( 'change' );
    }
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
                        message : i18nMessage.msg_all,
                        isKorean : isKorean,
                        cmmnCdList : json.data
                    } );

                    $selPreparprdItemCd.empty ().html ( html );

                    if ( sparePartsMgt.initFlag )
                    {
                        $selPreparprdItemCd.val ( paramSearchPreparprdItemCd ).trigger ( 'change' );
                    } else
                    {
                        $selPreparprdItemCd.trigger ( 'change' );
                    }
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

// 예비품 항목 정보 상세보기
function preparprdItemView ()
{
    var $gridList = $ ( '#gridList' );
    var $searchPreparprdClCd = $ ( '#sel_preparprdClCd' );
    var $searchPreparprdItemCd = $ ( '#sel_preparprdItemCd' );

    $ ( '.btn_jqgrid' ).on ( 'click', function ()
    {
        var btnId = $ ( this ).attr ( 'id' );
        var id = btnId.substring ( 4, btnId.length );
        var rowData = $gridList.getRowData ( id );

        var params = {
            pvId : rowData.pvId,
            preparprdClCd : rowData.preparprdClCd,
            preparprdItemCd : rowData.preparprdItemCd,
            searchPreparprdClCd : $searchPreparprdClCd.val (),
            searchPreparprdItemCd : $searchPreparprdItemCd.val ()
        };

        location.href = contextPath + '/hom/servicemgt/spare/sparePartsTypeView.do?' + $.param ( params );
    } );
}

// 등록 버튼 클릭 이벤트
function btnClick ()
{
    var $btnTypeRegister = $ ( '#btnTypeRegister' );
    var $btnRegister = $ ( '#btnRegister' );
    var $searchPreparprdClCd = $ ( '#sel_preparprdClCd' );
    var $searchPreparprdItemCd = $ ( '#sel_preparprdItemCd' );

    // 예비품 항목 정보 등록 버튼 클릭 이벤트
    $btnTypeRegister.on ( 'click', function ()
    {
        var params = {
            pvId : sparePartsMgt.pvId,
            searchPreparprdClCd : $searchPreparprdClCd.val (),
            searchPreparprdItemCd : $searchPreparprdItemCd.val ()
        };

        location.href = $ ( this ).attr ( 'href' ) + "&" + $.param ( params );
        return false;
    } );

    // 예비품 관리 대장 등록 버튼 클릭 이벤트
    $btnRegister.on ( 'click', function ()
    {

        if ( sparePartsMgt.preparprdClCd === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertRegisterPreparprdPartsType,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        } else
        {
            var params = {
                pvId : sparePartsMgt.pvId,
                preparprdClCd : sparePartsMgt.preparprdClCd,
                preparprdItemCd : sparePartsMgt.preparprdItemCd,
                mgtSeq : 0,
                searchPreparprdClCd : $searchPreparprdClCd.val (),
                searchPreparprdItemCd : $searchPreparprdItemCd.val ()
            };
            location.href = $ ( this ).attr ( 'href' ) + "&" + $.param ( params );
            return false;

        }

    } );

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
    }
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

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    sparePartsMgt = {
        pvId : paramPvId,
        preparprdClCd : $ ( '#sel_preparprdClCd' ).val (),
        preparprdItemCd : paramSearchPreparprdItemCd,
        initFlag : true,
        searchFlag : false,
        pvChangeFlag : false
    };

    customizeForm ();
    initTreeList ();
    customizeScroll ();
    getPreparprdItemList ( isKorean );
    sparePartsTypeJqGrid ();
    searchPartsTypeJqgrid ();
    btnClick ();
    showAllAssetCopyPopup ();
} );
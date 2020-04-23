var cntrctMgtAcmslt = null;
// form element customize
function customizeForm ()
{
    var $dateType2 = $ ( '.customize_select_m' ).customizeSelect ( {
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
}

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );

    if ( paramSearchFromDate !== '' && paramSearchToDate !== '' )
    {
        $yyyymmddFromDate.val ( homUtil.convertDateStringToFormat ( paramSearchFromDate,
                homUtil.dateFormat.formatYYYYMMDD ) );
        $yyyymmddToDate
                .val ( homUtil.convertDateStringToFormat ( paramSearchToDate, homUtil.dateFormat.formatYYYYMMDD ) );
    } else
    {
        var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDD, false, false );
        $yyyymmddFromDate.val ( localFromTodate.fromDate );
        $yyyymmddToDate.val ( localFromTodate.toDate );
    }

}

// treemenu customize
function customizeTree ()
{
    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            treeType : staticVariable.treeTypeNationPv
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNode = null;
                if ( paramPvId !== '' )
                {
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.id === paramPvId )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                } else
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( !node.isParent )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                }

                if ( checkedNode !== null )
                {
                    // initJqgrid
                    customizeJqgrid ( checkedNode.id );
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

function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            // addHoverDom : addHoverDom,
            // removeHoverDom : removeHoverDom,
            selectedMulti : false
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
        view : {
            showIcon : false
        },
        callback : {
            beforeClick : function beforeClick ( treeId, treeNode )
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

                        reloadJqgridWithPvId ( treeNode.id );
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

                    reloadJqgridWithPvId ( treeNode.id );
                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

// 제일 상위 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( nodes[i].pId == null || typeof nodes[i].pId === 'undefined' )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
}

// / jqgrid start
function setColModel ()
{
    var colModel = [ {
        name : 'acmsltSeq',
        hidden : true
    }, {
        name : 'pvId',
        hidden : true
    }, {
        name : 'cnsgnCorprId',
        hidden : true
    }, {
        name : 'cntrctTyCd',
        hidden : true
    }, {
        name : 'cntrctTyCdNm',
        index : '',
        align : 'center',
        width : '300',
    }, {
        name : 'cnsgnCorprNm',
        index : '',
        align : 'center',
        width : '300'
    }, {
        name : 'acmsltConts',
        index : '',
        align : 'center',
        width : '326',

    }, {
        name : 'regDt',
        index : '',
        align : 'center',
        width : '290'
    } ];

    return colModel;
}

function jqGridBasic ( pvId, cntrctTyCd, fromDate, toDate )
{
    var colModel = setColModel ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/contract/listAcmslt.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    pvId : pvId,
                    cntrctTyCd : cntrctTyCd,
                    fromDate : fromDate,
                    toDate : toDate
                },
                height : 572,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ '', '', '', '', i18nMessage.msg_contractType, i18nMessage.msg_consignor,
                        i18nMessage.msg_content, i18nMessage.msg_registrationDate ],
                colModel : colModel,
                sortname : 'cntrctTyCdNm',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '.gq_nodata' );
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();
                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        // 계약기간 정의
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                name : 'acmsltSeq',
                                value : rowData.acmsltSeq
                            } ).data ( 'menu-relate-count', rowData.menuRelateCount ).addClass ( 'acmsltSeqs' );
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
                    var $fromDate = $ ( '#yyyymmdd_from_date' );
                    var $toDate = $ ( '#yyyymmdd_to_date' );
                    var $searchType = $ ( '#cntrctTyCd' );

                    location.href = contextPath + '/hom/servicemgt/contract/viewAcmslt.do?pvId=' + rowData.pvId
                            + '&cnsgnCorprId=' + rowData.cnsgnCorprId + '&cntrctTyCd=' + rowData.cntrctTyCd
                            + '&acmsltSeq=' + rowData.acmsltSeq + '&searchType=' + $searchType.val ()
                            + '&searchFromDate=' + homUtil.convertDateStringToPureFormat ( $fromDate.val () )
                            + '&searchToDate=' + homUtil.convertDateStringToPureFormat ( $toDate.val () );
                }
            } );
}

// jqgird customize
function customizeJqgrid ( pvId )
{
    // jqgrid
    var $cntrctTyCd = $ ( '#cntrctTyCd' );
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );

    jqGridBasic ( pvId, $cntrctTyCd.val (), $fromDate.val (), $toDate.val () );
    if ( cntrctMgtAcmslt.templates.noData !== null )
    {
        var template = _.template ( cntrctMgtAcmslt.templates.noData );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgridWithPvId ( pvId )
{
    $ ( '#gridList' ).setGridParam ( {
        postData : {
            pvId : pvId,
        }
    } ).trigger ( 'reloadGrid' );
}

// 검색
function searchJqgrid ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $cntrctTyCd = $ ( '#cntrctTyCd' );
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $cntrctTyCd, $fromDate, $toDate );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $cntrctTyCd, $fromDate, $toDate )
{
    searchCondition = {
        cntrctTyCd : $ ( ":selected", $cntrctTyCd ).val (),
        fromDate : $fromDate.val (),
        toDate : $toDate.val ()
    };

    $gridList.setGridParam ( {
        postData : {
            cntrctTyCd : searchCondition.cntrctTyCd,
            fromDate : searchCondition.fromDate,
            toDate : searchCondition.toDate
        }
    } ).trigger ( 'reloadGrid' );
}

// jqgrid end

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

// 등록 버튼 눌렀을시에 현재 트리에서 선택한 발전소를 붙여서 보내야함
function setRegBtn ()
{
    var $btnReg = $ ( '#btn_reg' );
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );
    var $searchType = $ ( '#cntrctTyCd' );

    $btnReg.on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var checkedNodes = zTree.getCheckedNodes ( true );

        if ( checkedNodes.length > 0 )
        {
            var href = $ ( this ).attr ( 'href' );

            location.href = href + '&pvId=' + checkedNodes[0].id + '&searchType=' + $searchType.val ()
                    + '&searchFromDate=' + homUtil.convertDateStringToPureFormat ( $fromDate.val () )
                    + '&searchToDate=' + homUtil.convertDateStringToPureFormat ( $toDate.val () );
        }

        return false;
    } );
}

// 탭 전환시 pvId 유지...
function setTabBtn ()
{
    var $cntrctMgtBtn = $ ( '#cntrct_mgt_btn' );
    $cntrctMgtBtn.on ( 'click', function ()
    {
        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var checkedNodes = zTree.getCheckedNodes ( true );

        if ( checkedNodes.length > 0 )
        {
            var href = $ ( this ).attr ( 'href' );

            location.href = href + '?pvId=' + checkedNodes[0].id;

            return false;
        }
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

// 삭제 체크
function checkBtnDelete ()
{
    var $fromDate = $ ( '#yyyymmdd_from_date' );
    var $toDate = $ ( '#yyyymmdd_to_date' );
    var $searchType = $ ( '#cntrctTyCd' );

    $ ( '#btn_delete' ).on (
            'click',
            function ()
            {
                var $that = $ ( this );
                var acmsltSeqArr = [];

                $ ( '.acmsltSeqs' ).each ( function ()
                {
                    if ( $ ( this ).prop ( 'checked' ) )
                    {
                        acmsltSeqArr.push ( $ ( this ).val () );
                    }
                } );

                if ( acmsltSeqArr.length === 0 )
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
                    var deletePvId = $gridList.getRowData ( ids[0] ).pvId;

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
                                    location.href = $that.attr ( 'href' ) + '?pvId=' + deletePvId + '&acmsltSeqArr='
                                            + acmsltSeqArr.toString () + '&searchType=' + $searchType.val ()
                                            + '&searchFromDate='
                                            + homUtil.convertDateStringToPureFormat ( $fromDate.val () )
                                            + '&searchToDate='
                                            + homUtil.convertDateStringToPureFormat ( $toDate.val () );
                                }
                            } );
                }

                return false;
            } );
}

$ ( function ()
{
    cntrctMgtAcmslt = {
        templates : {
            noData : getTemplate ( templates.noData )
        }
    };

    initDatetimepicker ();
    customizeForm ();
    customizeTree ();
    customizeScroll ();
    showPopup ();
    setRegBtn ();
    searchJqgrid ();
    setTabBtn ();

    switchButtonGroup ();
    checkMessage ();
    checkBtnDelete ();
} );
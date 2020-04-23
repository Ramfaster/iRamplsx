var kpiCalculateMgt = null;
// init datetimepicker
function initDatetimepicker ()
{
    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    // 기간 설정(처음 한번)
    var dateType = homConstants.dateTypeYYYYMM;
    var localFromTodate = homUtil.getLocalFromToDate ( date, dateType, false, false );
    $yyyymmFromDate.val ( localFromTodate.fromDate );
    $yyyymmToDate.val ( localFromTodate.toDate );

    // 처음 한번 설정
    $ ( '#dateType' ).val ( dateType );
    $ ( '#fromDate' ).val ( homUtil.convertDateStringToPureFormat ( localFromTodate.fromDate ) );
    $ ( '#toDate' ).val ( homUtil.convertDateStringToPureFormat ( localFromTodate.toDate ) );
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

                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNode = null;
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

                if ( checkedNode !== null )
                {
                    // initHighchart
                    // kpiChart ( checkedNode.id );

                    // initJqgrid
                    customizeJqGrid ( checkedNode.id );

                    setHeadText ( $ ( '#period' ), $ ( '#yyyymm_from_date' ).val (), $ ( '#yyyymm_to_date' ).val (),
                            checkedNode.name );
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
        callback : {
            beforeClick : function beforeClick ( treeId, treeNode )
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
                        zTree.checkNode ( treeNode, true, true );
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
                    zTree.selectNode ( treeNode );
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

// 조회 버튼 선택
function clickBtnSubmit ()
{
    var $btnSubmit = $ ( '#btnSubmit' );
    var $dateType = $ ( '#dateType' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );
    var $pvId = $ ( '#pvId' );
    var $period = $ ( '#period' );
    $btnSubmit.on ( 'click', function ( event )
    {
        var pureFromDate = homUtil.convertDateStringToPureFormat ( $yyyymmFromDate.val () );
        var pureToDate = homUtil.convertDateStringToPureFormat ( $yyyymmToDate.val () );
        if ( !homUtil.fromToDateValidate ( $yyyymmFromDate.val (), $yyyymmToDate.val (), $dateType.val () ) )
        {
            return;
        }

        setSearchParameter ( pureFromDate, pureToDate );

        // init highcharts
        // kpiChart ( $pvId.val () );

        // reload jqgrid
        reloadJqGrid ( $pvId.val () );

        // header setting
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );
        var checkedNode = null;
        if ( checkedNodes != null && checkedNodes.length > 0 )
        {
            checkedNode = checkedNodes[0];
        }

        setHeadText ( $period, $yyyymmFromDate.val (), $yyyymmToDate.val (), checkedNode.name );
    } );
}

function setHeadText ( $period, fromDate, toDate, name )
{
    $period.text ( fromDate + ' ~ ' + toDate ).next ( '#pv_name' ).text ( name );
}

function setSearchParameter ( fromDate, toDate )
{
    $ ( '#fromDate' ).val ( fromDate );
    $ ( '#toDate' ).val ( toDate );

    var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
    var checkedNodes = zTree.getCheckedNodes ( true );
    if ( checkedNodes !== null && checkedNodes.length > 0 )
    {
        $ ( '#pvId' ).val ( checkedNodes[0].id );
    }
}

// init highcharts
function kpiChart ()
{
    var $graph = $ ( '#graph1' );
    var $btnExcel = $ ( '.btn_excel' );
    var $gridList = $ ( '#kpi_gridList' );

    // 기존 차트 삭제
    homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

    var ids = $gridList.jqGrid ( 'getDataIDs' );
    if ( ids != null && ids.length > 0 )
    {
        $btnExcel.show ();

        var rowDatas = $gridList.jqGrid ( 'getRowData' );

        var goalPrArray = [];
        var goalAvatyArray = [];
        var acmsltPrArray = [];
        var acmsltAvatyArray = [];
        for ( var i = 0, size = ids.length - 1; i < size; i++ )
        {
            var cl = ids[i];
            var rowData = $gridList.getRowData ( cl );

            var targetDate = homUtil.convertDateStringToLong ( rowData.pureDate );

            goalPrArray.push ( [ targetDate,
                    homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.goalPr ), staticVariable.decimalPoint ) ] );
            goalAvatyArray
                    .push ( [
                            targetDate,
                            homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.goalAvaty ),
                                    staticVariable.decimalPoint ) ] );
            acmsltPrArray.push ( [
                    targetDate,
                    homUtil
                            .mathFloor ( homUtil.removeNumberComma ( rowData.calcAcmsltPr ),
                                    staticVariable.decimalPoint ) ] );
            acmsltAvatyArray.push ( [
                    targetDate,
                    homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.calcAcmsltAvaty ),
                            staticVariable.decimalPoint ) ] );
        }

        var minArray = [];
        minArray.push ( _.min ( _.pluck ( goalPrArray, [ 1 ] ) ) );
        minArray.push ( _.min ( _.pluck ( goalAvatyArray, [ 1 ] ) ) );
        minArray.push ( _.min ( _.pluck ( acmsltPrArray, [ 1 ] ) ) );
        minArray.push ( _.min ( _.pluck ( acmsltAvatyArray, [ 1 ] ) ) );

        var yAxisArray = [];
        var yaxis = {
            max : 200,
            title : {
                text : 'PR,AVA' + homUtil.wrapWord ( homConstants.unitPercent, '(', ')' )
            }
        };
        if ( _.min ( minArray ) > 0 )
        {
            yaxis.min = 0;
        }
        yAxisArray.push ( yaxis );

        renderHighcharts ( $graph, yAxisArray, homConstants.unitPercent, goalPrArray, goalAvatyArray, acmsltPrArray,
                acmsltAvatyArray );
    } else
    {
        setHighchartNoData ();
    }
}

// render highcharts
function renderHighcharts ( $graph,
                            yAxisArray,
                            percentUnitNm,
                            goalPrArray,
                            goalAvatyArray,
                            acmsltPrArray,
                            acmsltAvatyArray )
{
    var dateType = $ ( '#dateType' ).val ();
    var dateFormat = null;
    var tooltipDateFormat = null;
    if ( dateType === homConstants.dateTypeYYYYMM )
    {
        dateFormat = homUtil.dateFormat.convertYYYYMM;
        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
    }

    // 그래프
    $graph.highcharts ( {
        chart : {
            marginTop : 30,
            height : 343,
            zoomType : 'x',
            panning : true,
            panKey : 'shift'
        },
        title : {
            text : '',
            style : {
                display : 'none',
            }
        },
        subtitle : {
            text : '',
            style : {
                display : 'none'
            }
        },
        exporting : {
            enabled : false
        },
        credits : {
            enabled : false
        },
        xAxis : {
            type : 'datetime',
            labels : {
                style : {
                    color : '#3c3c3c'
                },
                formatter : function ()
                {
                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                    return dateXAxis;
                }
            }
        },
        yAxis : yAxisArray,
        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
        plotOptions : {
            column : {
                pointPadding : 0,
                borderWidth : 0
            }
        },
        series : [ {
            type : 'column',
            yAxis : 0,
            color : '#d0d0d1',
            name : i18nMessage.msg_prGoal,
            data : goalPrArray
        }, {
            type : 'column',
            yAxis : 0,
            color : '#003e5b',
            name : i18nMessage.msg_prCalc,
            data : acmsltPrArray
        }, {
            type : 'column',
            yAxis : 0,
            color : '#8f8f92',
            name : i18nMessage.msg_avatyGoal,
            data : goalAvatyArray
        }, {
            type : 'column',
            yAxis : 0,
            color : '#fc5d2a',
            name : i18nMessage.msg_avaCalc,
            data : acmsltAvatyArray
        } ]
    } );
}

// jqgrid start
function customizeJqGrid ( pvId )
{
    var noDataId = 'jqgrid_nodata';

    jqGridBasic ( pvId, noDataId );
    var $gridList = $ ( '#kpi_gridList' );
    if ( kpiCalculateMgt.templates.noData != null )
    {
        var template = _.template ( kpiCalculateMgt.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }
    addGroupHeader ( $gridList );
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function addGroupHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_pr2 + homUtil.wrapWord ( '%', '(', ')' )
        }, {
            startColumnName : 'goalAvaty',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_ava + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

function jqGridBasic ( pvId, noDataId )
{
    var $gridList = $ ( '#kpi_gridList' );
    $gridList.jqGrid ( {
        url : contextPath + '/hom/asset/kpi/list.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            pvId : pvId,
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val ()
        },
        height : 260,
        autowidth : true,
        shrinkToFit : false,
        // 내부,외부 손실량 단위는 고정으로 감
        colNames : [ '', i18nMessage.msg_period, i18nMessage.msg_energy, i18nMessage.msg_radiation,
                i18nMessage.msg_internalLossqy, i18nMessage.msg_externalLossqy, i18nMessage.msg_goal,
                i18nMessage.msg_forml, i18nMessage.msg_acmslt, i18nMessage.msg_goal, i18nMessage.msg_forml,
                i18nMessage.msg_acmslt, '', '', '', '', '' ],
        colModel : [ {
            name : 'pureDate',
            hidden : true
        }, {
            name : 'stdrDate',
            align : 'center',
            width : '113'
        }, {
            name : 'geneQty',
            align : 'right',
            width : '133',
            fixed : true,
            sortable : false
        }, {
            name : 'rdtn',
            align : 'right',
            width : '133',
            fixed : true,
            sortable : false
        }, {
            name : 'intLossqy',
            align : 'right',
            width : '133',
            fixed : true,
            sortable : false
        }, {
            name : 'extLossqy',
            align : 'right',
            width : '133',
            fixed : true,
            sortable : false
        }, {
            name : 'goalPr',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'calcAcmsltPr',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltPr',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'goalAvaty',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'calcAcmsltAvaty',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'acmsltAvaty',
            align : 'right',
            width : '91',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'fcltyCpcty',
            hidden : true
        }, {
            name : 'stdrRdtn',
            hidden : true
        }, {
            name : 'hssrs',
            hidden : true
        }, {
            name : 'geneQtyUnitNm',
            hidden : true
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        } ],
        sortname : 'stdrDate',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#kpi_gridList' );
                // set input boxes
                setInputBoxes ( $gridList );

                var ids = $gridList.jqGrid ( 'getDataIDs' );
                var rowData = $gridList.getRowData ( ids[0] );

                jqgridHeaderLabelUpdate ( $ ( '#jqgh_kpi_gridList_geneQty' ), i18nMessage.msg_energy + '<br />'
                        + homUtil.wrapWord ( rowData.geneQtyUnitNm, '(', ')' ) );
                jqgridHeaderLabelUpdate ( $ ( '#jqgh_kpi_gridList_rdtn' ), i18nMessage.msg_radiation
                        + '<br />'
                        + homUtil.wrapWord ( rowData.rdtnUnitNm + '/' + homConstants.dateTypeYYYYMM.toLowerCase (),
                                '(', ')' ) );
                jqgridHeaderLabelUpdate ( $ ( '#jqgh_kpi_gridList_intLossqy' ), i18nMessage.msg_internalLossqy
                        + '<br />' + homUtil.wrapWord ( rowData.geneQtyUnitNm, '(', ')' ) );
                jqgridHeaderLabelUpdate ( $ ( '#jqgh_kpi_gridList_extLossqy' ), i18nMessage.msg_externalLossqy
                        + '<br />' + homUtil.wrapWord ( rowData.geneQtyUnitNm, '(', ')' ) );

                setInputBoxesFormat ();
            }

            $ ( '#calculate_btn' ).trigger ( 'click' );
        }
    } );
}

// 그리드 input의 숫자 콤마처리를 적용...(포커스 아웃시) 다시 클릭하였을때는 콤마 제거
function setInputBoxesFormat ()
{
    var $gridListInput = $ ( '#kpi_gridList' ).find ( 'input' );
    $.each ( $gridListInput, function ( index, input )
    {
        var $input = $ ( input );
        var data = $input.val ();
        $input.val ( homUtil.addNumberComma ( data ) );
    } );

    $gridListInput.on ( 'blur', function ()
    {
        var $that = $ ( this );
        var data = $that.val ();

        if ( $.isNumeric ( data ) )
        {
            data = homUtil.addNumberComma ( data );
            $that.val ( data );
        } else
        {
            $that.val ( 0 );
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertOnlyNumber,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } ).on ( 'focus', function ()
    {
        var $that = $ ( this );
        var data = homUtil.removeNumberComma ( $that.val () );

        if ( $.isNumeric ( data ) )
        {
            $that.val ( data );
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertOnlyNumber,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

function reloadJqGrid ( pvId )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();

    $ ( '#kpi_gridList' ).setGridParam ( {
        postData : {
            pvId : pvId,
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate
        }
    } ).trigger ( 'reloadGrid' );
}

function setInputBoxes ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );
    var inputStr = null;
    var customVal = 0;

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );

    for ( var i = 0, size = ids.length - 1; i < size; i++ )
    {
        var cl = ids[i];
        var rowData = $gridList.getRowData ( cl );

        customVal = homUtil.removeNumberComma ( rowData.geneQty );
        setInputMarkup ( $gridList, 'geneQty', cl, customVal );

        customVal = homUtil.removeNumberComma ( rowData.rdtn );
        setInputMarkup ( $gridList, 'rdtn', cl, customVal );

        customVal = homUtil.removeNumberComma ( rowData.intLossqy );
        setInputMarkup ( $gridList, 'intLossqy', cl, customVal );

        customVal = homUtil.removeNumberComma ( rowData.extLossqy );
        setInputMarkup ( $gridList, 'extLossqy', cl, customVal );
    }
    var lastCl = ids[ids.length - 1];
    var lastRowData = $gridList.getRowData ( lastCl );
    lastRowData.geneQty = numberFloorComma ( lastRowData.geneQty, staticVariable.decimalPoint );
    lastRowData.rdtn = numberFloorComma ( lastRowData.rdtn, staticVariable.decimalPoint );
    lastRowData.intLossqy = numberFloorComma ( lastRowData.intLossqy, staticVariable.decimalPoint );
    lastRowData.extLossqy = numberFloorComma ( lastRowData.extLossqy, staticVariable.decimalPoint );
    $gridList.jqGrid ( 'setRowData', lastCl, lastRowData );
}

function setInputMarkup ( $gridList, classNm, cl, customVal )
{
    var inputStr = '<div class="full_input_box"><input class="al_right ' + classNm + '" id="' + cl + '_' + classNm
            + '" type="text" value="' + customVal + '" /></div>';
    $gridList.jqGrid ( 'setCell', cl, classNm, inputStr );
}
// jqgrid end

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

// 계산 버튼
function setCalculateBtn ()
{
    var $calculateBtn = $ ( '#calculate_btn' );
    $calculateBtn.on ( 'click', function ()
    {
        var $gridList = $ ( '#kpi_gridList' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );
        var rowDatas = $gridList.jqGrid ( 'getRowData' );

        if ( ids.length > 0 )
        {
            var calcAcmsltPrArray = [];
            var calcAcmsltAvatArray = [];
            var sumGeneQty = 0;
            var sumRdtn = 0;
            var sumIntLossqy = 0;
            var sumExtLossqy = 0;
            var sumFcltyCpcty = 0;
            var sumHssrs = 0;
            var sumAcmsltPr = 0;

            for ( var i = 0, size = ids.length - 1; i < size; i++ )
            {
                var cl = ids[i];
                var rowData = $gridList.getRowData ( cl );
                var geneQty = homUtil.removeNumberComma ( $ ( '#' + cl + '_geneQty' ).val () );
                var rdtn = homUtil.removeNumberComma ( $ ( '#' + cl + '_rdtn' ).val () );
                var intLossqy = homUtil.removeNumberComma ( $ ( '#' + cl + '_intLossqy' ).val () );
                var extLossqy = homUtil.removeNumberComma ( $ ( '#' + cl + '_extLossqy' ).val () );

                if ( $.isNumeric ( geneQty ) && $.isNumeric ( rdtn ) && $.isNumeric ( intLossqy )
                        && $.isNumeric ( extLossqy ) && $.isNumeric ( rowData.fcltyCpcty )
                        && $.isNumeric ( rowData.stdrRdtn ) && $.isNumeric ( rowData.hssrs ) )
                {
                    sumGeneQty += parseFloat ( geneQty );
                    sumRdtn += parseFloat ( rdtn );
                    sumIntLossqy += parseFloat ( intLossqy );
                    sumExtLossqy += parseFloat ( extLossqy );
                    sumFcltyCpcty += parseFloat ( rowData.fcltyCpcty );
                    sumHssrs += parseFloat ( rowData.hssrs );
                    sumAcmsltPr += parseFloat ( rowData.acmsltPr );

                    var result = calcAcmsltPr ( geneQty, rowData.fcltyCpcty, rdtn, extLossqy, rowData.stdrRdtn,
                            rowData.acmsltPr );
                    if ( !result.flag )
                    {
                        setHighchartNoData ();
                        return false;
                    }
                    calcAcmsltPrArray.push ( result.result );
                    result = calcAcmsltAvat ( intLossqy, rowData.fcltyCpcty, rowData.hssrs )
                    if ( !result.flag )
                    {
                        setHighchartNoData ();
                        return false;
                    }
                    calcAcmsltAvatArray.push ( result.result );
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validValuesInvalidExist,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    return false;
                }
            }

            // 계산 결과 표시
            var lastCl = ids[ids.length - 1];
            var lastRowData = $gridList.getRowData ( lastCl );
            for ( var i = 0, size = ids.length - 1; i < size; i++ )
            {
                var cl = ids[i];

                $gridList.jqGrid ( 'setCell', cl, 'calcAcmsltPr', calcAcmsltPrArray[i] );
                $gridList.jqGrid ( 'setCell', cl, 'calcAcmsltAvaty', calcAcmsltAvatArray[i] );
            }

            // 마지막 row 계산 설정
            lastRowData.geneQty = numberFloorComma ( sumGeneQty, staticVariable.decimalPoint );
            lastRowData.rdtn = numberFloorComma ( sumRdtn, staticVariable.decimalPoint );
            lastRowData.intLossqy = numberFloorComma ( sumIntLossqy, staticVariable.decimalPoint );
            lastRowData.extLossqy = numberFloorComma ( sumExtLossqy, staticVariable.decimalPoint );

            var result = calcAcmsltPr ( sumGeneQty, sumFcltyCpcty, sumRdtn, sumExtLossqy, lastRowData.stdrRdtn,
                    sumAcmsltPr );
            if ( !result.flag )
            {
                setHighchartNoData ();
                return;
            }
            lastRowData.calcAcmsltPr = result.result;
            result = calcAcmsltAvat ( sumIntLossqy, sumFcltyCpcty, sumHssrs );
            if ( !result.flag )
            {
                setHighchartNoData ();
                return;
            }
            lastRowData.calcAcmsltAvaty = result.result;
            $gridList.jqGrid ( 'setRowData', lastCl, lastRowData );

            // render highcharts
            kpiChart ();
        } else
        {
            setHighchartNoData ();
        }

        return false;
    } );
}

function setHighchartNoData ()
{
    $ ( '.btn_excel' ).hide ();
    $ ( '#graph1' ).html (
            '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
}

// 계산값으로 하이차트 갱신..
function renderHichartsCalcData ()
{
    var $gridList = $ ( '#kpi_gridList' );
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );

    var goalPrArray = [];
    var goalAvatyArray = [];
    var acmsltPrArray = [];
    var acmsltAvatyArray = [];
    for ( var i = 0, size = ids.length - 1; i < size; i++ )
    {
        var cl = ids[i];
        var rowData = $gridList.getRowData ( cl );

        var targetDate = homUtil.convertDateStringToLong ( rowData.pureDate );

        goalPrArray.push ( [ targetDate,
                homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.goalPr ), staticVariable.decimalPoint ) ] );
        goalAvatyArray.push ( [ targetDate,
                homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.goalAvaty ), staticVariable.decimalPoint ) ] );
        acmsltPrArray
                .push ( [
                        targetDate,
                        homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.calcAcmsltPr ),
                                staticVariable.decimalPoint ) ] );
        acmsltAvatyArray
                .push ( [
                        targetDate,
                        homUtil.mathFloor ( homUtil.removeNumberComma ( rowData.calcAcmsltAvaty ),
                                staticVariable.decimalPoint ) ] );
    }
}

// 실적 성능비 계산
// 성능비 계산 = ( 발전량 / 설치 용량 ) / (( 일사량 - 외부 손실량 ) / 기준 일사량 ) * 100
// 성능비 계산 = ( 발전량 / 설치 용량 ) / (( 일사량 - (외부 손실량 * 기준 일사량 / 설치 용량 / 성능비 실적 ) ) / 기준 일사량 ) * 100
function calcAcmsltPr ( geneQty, fcltyCpcty, rdtn, extLossqy, stdrRdtn, acmsltPr )
{
    var result = null;
    var paramGeneQty = parseFloat ( geneQty );
    var paramFcltyCpcty = parseFloat ( fcltyCpcty );
    var paramRdtn = parseFloat ( rdtn );
    var paramExtLossqy = parseFloat ( extLossqy );
    var paramStdrRdtn = parseFloat ( stdrRdtn );
    var paramAcmsltPr = parseFloat ( acmsltPr );
    var flag = true;

    if ( paramFcltyCpcty != 0 && paramStdrRdtn != 0 && paramAcmsltPr != 0 )
    {
        // var subResult = (paramRdtn - paramExtLossqy) / paramStdrRdtn;
        var subResult = (paramRdtn - (paramExtLossqy * paramStdrRdtn / paramFcltyCpcty / paramAcmsltPr))
                / paramStdrRdtn;
        if ( subResult != 0 )
        {
            result = (paramGeneQty / paramFcltyCpcty) / subResult * 100;
        }
    } else if ( paramFcltyCpcty === 0 )
    {
        flag = false;
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertNoDataItemFacilityCapacity,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } else if ( paramStdrRdtn === 0 )
    {
        flag = false;
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertNoDataItemStdrRdtn,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }

    return {
        result : result,
        flag : flag
    };
}

// 실적 가동률 계산
// 가동률 계산 = 100 - 100 * ( 내부 손실량 / ( 설치용량 * 100 Wh/㎡ 이상 일사량 시간 ) ) * 100
function calcAcmsltAvat ( intLossqy, fcltyCpcty, hssrs )
{
    var result = null;
    var paramIntLossqy = parseFloat ( intLossqy );
    var paramFcltyCpcty = parseFloat ( fcltyCpcty );
    var paramHssrs = parseFloat ( hssrs );
    var flag = true;

    if ( paramFcltyCpcty != 0 && paramHssrs != 0 )
    {
        result = 100 - 100 * (paramIntLossqy / (paramFcltyCpcty * paramHssrs)) * 100;
    } else if ( paramFcltyCpcty === 0 )
    {
        flag = false;
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertNoDataItemFacilityCapacity,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } else
    {
        result = 100;
    }

    return {
        result : result,
        flag : flag
    };
}

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );
    var $pvName = $ ( '#pv_name' );
    var $fromDate = $ ( '#fromDate' );
    var $toDate = $ ( '#toDate' );
    $btnExcel.on ( 'click', function ()
    {
        var grpahChart = $ ( '#graph1' ).highcharts ();
        var dataString = encodeURI ( 'async=true&type=png&width=600&options='
                + JSON.stringify ( grpahChart.userOptions ) );
        var imgUrl = getHighchartsImg ( dataString )

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

        var params = {
            url : staticVariable.exportUrl + imgUrl,
            prAvatyInfoList : makeDataList (),
            pvNm : encodeURIComponent ( $pvName.text () ),
            fromDate : $fromDate.val (),
            toDate : $toDate.val (),
            menuName : menuName,
            geneQtyTitle : encodeURIComponent ( $ ( '#jqgh_kpi_gridList_geneQty' ).text () ),
            rdtnTitle : encodeURIComponent ( $ ( '#jqgh_kpi_gridList_rdtn' ).text () ),
            intLossqyTitle : encodeURIComponent ( $ ( '#jqgh_kpi_gridList_intLossqy' ).text () ),
            extLossqyTitle : encodeURIComponent ( $ ( '#jqgh_kpi_gridList_extLossqy' ).text () )
        };

        $.ajax ( {
            url : contextPath + '/hom/excel/asset/kpi/excelUuid.ajax',
            type : 'POST',
            dataType : 'json',
            contentType : 'application/json; charset=utf-8',
            data : JSON.stringify ( params ),
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    var excelUuid = json.data;
                    if ( excelUuid != null )
                    {
                        var href = contextPath + '/hom/excel/asset/kpi/download.do?excelUuid=' + excelUuid;

                        location.href = href;
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

        return false;
    } );
}

// jqgrid에 있는 데이터로 list데이터로 만들어 반환한다.
function makeDataList ()
{
    var list = [];

    var $gridList = $ ( '#kpi_gridList' );
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );

    for ( var i = 0, size = ids.length - 1; i < size; i++ )
    {
        var cl = ids[i];
        var rowData = $gridList.getRowData ( cl );

        list.push ( {
            stdrDate : rowData.stdrDate,
            geneQtyStr : homUtil.removeNumberCommaDash ( $ ( '#' + cl + '_geneQty' ).val () ),
            rdtnStr : homUtil.removeNumberCommaDash ( $ ( '#' + cl + '_rdtn' ).val () ),
            intLossqyStr : homUtil.removeNumberCommaDash ( $ ( '#' + cl + '_intLossqy' ).val () ),
            extLossqyStr : homUtil.removeNumberCommaDash ( $ ( '#' + cl + '_extLossqy' ).val () ),
            goalPr : homUtil.removeNumberCommaDash ( rowData.goalPr ),
            calcAcmsltPr : homUtil.removeNumberCommaDash ( rowData.calcAcmsltPr ),
            acmsltPr : homUtil.removeNumberCommaDash ( rowData.acmsltPr ),
            goalAvaty : homUtil.removeNumberCommaDash ( rowData.goalAvaty ),
            calcAcmsltAvaty : homUtil.removeNumberCommaDash ( rowData.calcAcmsltAvaty ),
            acmsltAvaty : homUtil.removeNumberCommaDash ( rowData.acmsltAvaty )
        } );
    }

    var lastCl = ids[ids.length - 1];
    var lastRowData = $gridList.getRowData ( lastCl );

    list.push ( {
        stdrDate : lastRowData.stdrDate,
        geneQtyStr : homUtil.removeNumberCommaDash ( lastRowData.geneQty ),
        rdtnStr : homUtil.removeNumberCommaDash ( lastRowData.rdtn ),
        intLossqyStr : homUtil.removeNumberCommaDash ( lastRowData.intLossqy ),
        extLossqyStr : homUtil.removeNumberCommaDash ( lastRowData.extLossqy ),
        goalPr : homUtil.removeNumberCommaDash ( lastRowData.goalPr ),
        calcAcmsltPr : homUtil.removeNumberCommaDash ( lastRowData.calcAcmsltPr ),
        acmsltPr : homUtil.removeNumberCommaDash ( lastRowData.acmsltPr ),
        goalAvaty : homUtil.removeNumberCommaDash ( lastRowData.goalAvaty ),
        calcAcmsltAvaty : homUtil.removeNumberCommaDash ( lastRowData.calcAcmsltAvaty ),
        acmsltAvaty : homUtil.removeNumberCommaDash ( lastRowData.acmsltAvaty )
    } );

    return list;
}

function getHighchartsImg ( dataString )
{
    var imgUrl = null;
    $.ajax ( {
        url : staticVariable.exportUrl,
        type : 'POST',
        data : dataString,
        async : false,
        success : function ( data )
        {
            imgUrl = data;
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
    return imgUrl;
}

$ ( function ()
{
    kpiCalculateMgt = {
        // 템플릿 정의
        templates : {
            noData : getTemplate ( templates.noData )
        }
    };

    initDatetimepicker ();
    customizeScroll ();
    customizeTree ();

    clickBtnSubmit ();
    clickBtnExcel ();
    setCalculateBtn ();
} );
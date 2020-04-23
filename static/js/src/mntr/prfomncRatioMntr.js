var prfomncRatioMntr = null;

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정(일/월/년)
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );
}

// form element customize
function customizeForm ()
{
    // 조회기간
    var $selectDateType = $ ( '#select_date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    $selectDateType.on ( 'change', function ()
    {
        var selectedDateType = $ ( this ).val ();
        var className = null;

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedDateType, false, false );
        var $dateBox = $ ( '.' + className );

        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate )
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $selectDateType.trigger ( 'change' );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료, 설비 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#dateType' ).val ();
    var className = null;
    var dateFormat = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#select_date_type' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );

    var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
    var treeNode = zTree.getNodeByParam ( 'id', $ ( '#eqmtId' ).val () );

    if ( typeof treeNode !== 'undefined' && treeNode !== null )
    {
        zTree.selectNode ( treeNode );
        zTree.checkNode ( treeNode, true, true );
    }
}

// 그리드 전체보기 팝업 호출
function initViewAllPopup ()
{
    $ ( '#btn_all_jqgrid' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            beforeOpen : function ()
            {
                setSearchedParamaeter ();
            }
        }
    } );
}

// 설비 트리 초기화
function initEquipmentTree ()
{
    // 트리메뉴
    var setting = {
        view : {
            showIcon : false
        },
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all'
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
                if ( selectedNodes.length > 0 )
                {
                    if ( selectedNodes[0].id === treeNode.id )
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
                if ( checkedNodes.length > 0 )
                {
                    if ( checkedNodes[0].id === treeNode.id )
                    {
                        return false;
                    } else
                    {
                        zTree.selectNode ( treeNode );
                    }
                }
            }
        }
    };

    var params = {
        treeType : staticVariable.treeTypePr
    };

    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var zTree = $.fn.zTree.init ( $ ( '#treeList' ), setting, json.data );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var selectedNodes = zTree.getSelectedNodes ();
                var checkedNodes = zTree.getCheckedNodes ( true );
                if ( checkedNodes.length > 0 )
                {
                    zTree.selectNode ( checkedNodes[0] );
                } else
                {
                    // TODO 첫번째 노드가 disable일 경우 다음 자식 노드 선택 필요
                    // 기본 ROOT 노드 선택 및 체크
                    zTree.selectNode ( nodes[0] );
                    zTree.checkNode ( nodes[0], true, true );
                }

                customizeTreeScroll ();
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

// scroll customize
function customizeTreeScroll ()
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

// 성능비 조회
function searchPr ()
{
    var $gridList = $ ( '#gridList' );
    var $codMonitoringInfoPeriod = $ ( '#cod_monitoring_info_period' );
    var $searchPeriod = $ ( '#search_period' );

    var tpl = getTemplate ( templates.noData );

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );
        var selectDateType = $ ( '#select_date_type' ).val ();
        var className = null;

        if ( selectDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, selectDateType ) )
        {
            return;
        }

        if ( checkedNodes.length <= 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validSelectEquipment,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );

            return;
        }

        setSearchParameter ( pureFromDate, pureToDate, zTree );
        setPeriodTitle ( $codMonitoringInfoPeriod, $searchPeriod, fromDate, toDate );
        searchCodMonitoringInfo ();
        searchPrChart ();

        if ( initFlag )
        {
            searchPrJqgrid ( $gridList, tpl );
        } else
        {
            reloadPrJqgrid ( $gridList );
        }
    } );
}

// 검색을 위한 파라미터 세팅(시작/종료, 설비아이디, 부모설비아이디, 설비그룹여부)
function setSearchParameter ( pureFromDate, pureToDate, zTree )
{
    var checkedNodes = zTree.getCheckedNodes ( true );
    var treeNode = null;

    if ( checkedNodes.length > 0 )
    {
        treeNode = checkedNodes[0];
    }

    var $eqmtId = $ ( '#eqmtId' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );
    var $isEqmtGrp = $ ( '#isEqmtGrp' );
    var eqmtId = treeNode.id;

    // 조회 조건, 시작, 종료일자 세팅
    $ ( '#dateType' ).val ( $ ( '#select_date_type' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );

    // 설비 아이디 설정
    $eqmtId.val ( eqmtId );

    // 스트링일 경우 부모설비 아이디 설정
    if ( (eqmtId.indexOf ( homConstants.eqmtPrefixString ) > -1) )
    {
        var parentNode = treeNode.getParentNode ();
        $parntsEqmtId.val ( parentNode.id );
    } else
    {
        $parntsEqmtId.val ( '' );
    }

    if ( typeof treeNode.children !== 'undefined' )
    {
        if ( treeNode.pId !== homConstants.eqmtTopGrpJun )
        {
            $isEqmtGrp.val ( homConstants.dateTypeYYYY );
        } else
        {
            $isEqmtGrp.val ( homConstants.checkN );
        }
    } else
    {
        $isEqmtGrp.val ( homConstants.checkN );
    }
}

// 조회 조건에 해당하는 타이틀 세팅
function setPeriodTitle ( $codMonitoringInfoPeriod, $searchPeriod, fromDate, toDate )
{
    $codMonitoringInfoPeriod.text ( i18nMessage.msg_cod + ' ~ ' + i18nMessage.msg_end
            + homUtil.wrapWord ( toDate, '(', ')' ) );
    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

// 모니터링 > 성능비 상단 COD - 종료일 정보 조회
function searchCodMonitoringInfo ()
{
    var params = {
        dateType : $ ( '#dateType' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $.ajax ( {
        url : contextPath + '/hom/monitoring/pr/selectCodMonitoringInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $ ( '#goalPr' ).text ( homUtil.mathFloorComma ( json.data.goalPr, staticVariable.decimalPoint ) );
                $ ( '#acmsltPr' ).text ( homUtil.mathFloorComma ( json.data.acmsltPr, staticVariable.decimalPoint ) );
                $ ( '#acmsltRdtn' )
                        .text ( homUtil.mathFloorComma ( json.data.acmsltRdtn, staticVariable.decimalPoint ) );

                $ ( '#rateUnit' ).text ( homUtil.wrapWord ( json.data.rateUnit, '(', ')' ) );
                $ ( '#acmsltRdtnUnit' ).text ( homUtil.wrapWord ( json.data.acmsltRdtnUnit, '(', ')' ) );
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

// 성능비 차트 조회
function searchPrChart ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/pr/selectPrChartList.ajax',
        type : 'POST',
        dataType : 'json',
        data : $ ( 'form' ).serialize (),
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 기존 차트 삭제
                homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

                if ( json.data.length > 0 )
                {
                    $btnExcel.show ();
                    $btnAllJqgrid.show ();

                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDD )
                    {
                        dateFormat = homUtil.dateFormat.convertMMDD;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
                    } else if ( dateType === homConstants.dateTypeYYYYMM )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYYMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
                    } else if ( dateType === homConstants.dateTypeYYYY )
                    {
                        dateFormat = homUtil.dateFormat.convertYYYY;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
                    }

                    // 목표 성능비, 전년 성능비, 실적 성능비, 일사량, 온도
                    var goalPrArray = [];
                    var beforeYearPrArray = [];
                    var acmsltPrArray = [];
                    var rdtnArray = [];
                    var temprtArray = [];

                    // 성능비, 일사량, 온도 단위
                    var prUnitNm = json.data[0].prUnitNm;
                    var rdtnUnitNm = json.data[0].rdtnUnitNm;
                    var atmpsUnitNm = json.data[0].atmpsUnitNm;

                    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
                    {
                        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
                    }

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                goalPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.goalPr, staticVariable.decimalPoint ) ] );
                                beforeYearPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.beforeYearPr, staticVariable.decimalPoint ) ] );
                                acmsltPrArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.acmsltPr, staticVariable.decimalPoint ) ] );
                                rdtnArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                temprtArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.temprt, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var prMinArray = [];
                    prMinArray.push ( _.min ( _.pluck ( goalPrArray, [ 1 ] ) ) );
                    prMinArray.push ( _.min ( _.pluck ( beforeYearPrArray, [ 1 ] ) ) );
                    prMinArray.push ( _.min ( _.pluck ( acmsltPrArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var prYaxis = {
                        max : 200,
                        title : {
                            text : i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' )
                        }
                    };
                    var rdtnYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };
                    var atmpsYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( prMinArray ) > 0 )
                    {
                        prYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( rdtnArray, [ 1 ] ) ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( temprtArray, [ 1 ] ) ) > 0 )
                    {
                        atmpsYaxis.min = 0;
                    }

                    yAxisArray.push ( prYaxis );
                    yAxisArray.push ( rdtnYaxis );
                    yAxisArray.push ( atmpsYaxis );

                    $ ( '#graph1' ).highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type4 ),
                        chart : {
                            marginTop : 50,
                            height : 373,
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
                            },
                            line : {
                                marker : {
                                    enabled : false
                                }
                            }
                        },
                        series : [ {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_goal + ' ' + i18nMessage.msg_prfomncRatio,
                            data : goalPrArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_beforeYear + ' ' + i18nMessage.msg_prfomncRatio,
                            data : beforeYearPrArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_acmslt + ' ' + i18nMessage.msg_prfomncRatio,
                            data : acmsltPrArray
                        }, {
                            type : 'line',
                            yAxis : 1,
                            name : i18nMessage.msg_rdtn,
                            data : rdtnArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 2,
                            name : i18nMessage.msg_temperature,
                            data : temprtArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();

                    $graph1.html ( '<div class="bg_nodata"><i class="icon_nodata"></i>'
                            + i18nMessage.msg_sentenceGridNoData + '</div>' );
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

// 성능비 jqgrid 조회(초기 세팅 및 조회)
function searchPrJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    var noDataId = 'pr_jqgrid_nodata';

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/monitoring/pr/selectPrGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 175,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    eqmtId : eqmtId,
                    isEqmtGrp : isEqmtGrp,
                    parntsEqmtId : parntsEqmtId
                },
                colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_acmslt,
                        i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_goal, i18nMessage.msg_acmslt,
                        i18nMessage.msg_temperature, 'prUnitNm', 'rdtnUnit', 'atmpsUnitNm' ],
                colModel : [
                        {
                            name : 'stdrDate',
                            align : 'center',
                            width : '120',
                            fixed : true,
                            sortable : false
                        },
                        {
                            name : 'goalPr',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'beforeYearPr',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'acmsltPr',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'goalGap',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridAbsGapFormatter ( cellvalue, options, rowObject,
                                        prfomncRatioMntr.pvAcmsltRateList, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'beforeYearGap',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridAbsGapFormatter ( cellvalue, options, rowObject,
                                        prfomncRatioMntr.pvAcmsltRateList, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'goalRdtn',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'rdtn',
                            align : 'right',
                            width : '130',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'temprt',
                            align : 'right',
                            width : '170',
                            fixed : true,
                            sortable : false,
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'prUnitNm',
                            hidden : true
                        }, {
                            name : 'rdtnUnitNm',
                            hidden : true
                        }, {
                            name : 'atmpsUnitNm',
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
                loadComplete : function ( data )
                {
                    var $gqNodata = $ ( '#' + noDataId );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
                    $ ( '#totalRowCount' ).text ( resultText );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        updateJqgridPrHeader ( $gridList );
                    }
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    mergeJqgridPrHeader ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridPrHeader ( $gridList )
{
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalPr',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_prfomncRatio
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        }, {
            startColumnName : 'goalRdtn',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_rdtn
        } ]
    } );
}

// 헤더명 변경
function updateJqgridPrHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var prUnitNm = rowData.prUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더 명 변경
    $gridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
    $ ( '#gridList_stdrDate' ).next ( 'th' ).html (
            i18nMessage.msg_prfomncRatio + homUtil.wrapWord ( prUnitNm, '(', ')' ) );
    $ ( '#gridList_temprt' ).prev ( 'th' ).html ( i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' ) );
    $ ( '#jqgh_gridList_temprt' ).html ( i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}

// 성능비 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadPrJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId
        }
    } ).trigger ( 'reloadGrid' );
}

// 성능비 엑셀 다운로드
function downloadPrExcel ()
{
    $ ( '#btn_excel' ).on (
            'click',
            function ()
            {
                var optionsStr = JSON.stringify ( $ ( '#graph1' ).highcharts ().userOptions );
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var checkedNodes = zTree.getCheckedNodes ( true );
                var eqmtNm = '';
                if ( checkedNodes.length === 0 )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validSelectEquipment,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    return;
                } else
                {
                    eqmtNm = checkedNodes[0].name;
                }

                setSearchedParamaeter ();

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : staticVariable.exportUrl,
                    success : function ( data )
                    {
                        var $excelUrl = $ ( '<input />', {
                            type : 'hidden',
                            id : 'excelUrl',
                            name : 'url',
                            value : staticVariable.exportUrl + data
                        } );

                        var $eqmtNm = $ ( '<input />', {
                            type : 'hidden',
                            id : 'eqmtNm',
                            name : 'eqmtNm',
                            value : eqmtNm
                        } );

                        var menuName = '';
                        $ ( '.lnb' ).find ( 'span' ).each ( function ()
                        {
                            menuName += ($ ( this ).text () + '_');
                        } );

                        menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

                        var $menuName = $ ( '<input />', {
                            type : 'hidden',
                            id : 'menuName',
                            name : 'menuName',
                            value : menuName
                        } );

                        $ ( 'form' ).prepend ( $excelUrl, $eqmtNm, $menuName ).prop ( 'action',
                                contextPath + '/hom/excel/monitoring/pr/download.do' ).submit ();

                        $excelUrl.remove ();
                        $eqmtNm.remove ();
                        $menuName.remove ();
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

            } );
}

// 페이지 로드 완료 시 처리
function initPage ()
{
    prfomncRatioMntr = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    initViewAllPopup ();

    $.when ( initEquipmentTree () ).done ( function ()
    {
        searchPr ();
        downloadPrExcel ();
        initPage ();
    } );

} );
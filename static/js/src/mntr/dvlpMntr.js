// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정(yyyymmddhh)
    var $yyyymmddhh = $ ( '.yyyymmddhh' );
    $yyyymmddhh.datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        initialDate : date,
        endDate : date
    } );

    var $yyyymmddhhFromDate = $ ( '#yyyymmddhh_from_date' );
    var $yyyymmddhhToDate = $ ( '#yyyymmddhh_to_date' );
    var $startDatetimePicker = $ ( '#startDatetimePicker' );
    var $endDatetimePicker = $ ( '#endDatetimePicker' );

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYYMMDDHH, false, false );
    $yyyymmddhhFromDate.val ( localFromTodate.fromDate );
    $yyyymmddhhToDate.val ( localFromTodate.toDate );

    homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddhhFromDate,
            $yyyymmddhhToDate );

    $yyyymmddhh.datetimepicker ().on (
            'changeDate',
            function ( event )
            {
                homUtil.setStartEndDatetimepicker ( $startDatetimePicker, $endDatetimePicker, $yyyymmddhhFromDate,
                        $yyyymmddhhToDate );
            } );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(시작, 종료, 설비 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateFormat = homUtil.dateFormat.formatYYYYMMDDHHMM;
    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    $ ( '#yyyymmddhh_from_date' ).val ( fromDate );
    $ ( '#yyyymmddhh_to_date' ).val ( toDate );

    var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
    var treeNode = zTree.getNodeByParam ( 'id', $ ( '#eqmtId' ).val () );

    if ( typeof treeNode !== 'undefined' && treeNode !== null )
    {
        zTree.selectNode ( treeNode );
        zTree.checkNode ( treeNode, true, true );
    }
}
http:
// heis.hanwha.com:8010
// 단위 변경 버튼 클릭
function initUnit ()
{
    var $unitSelect = $ ( '.unit_select' );
    var $unit = $ ( '#unit' );
    var $btnSubmit = $ ( '#btnSubmit' );

    $ ( '.unit_select' ).on ( 'click', function ()
    {
        var valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( this ).addClass ( 'on' );

        $unit.val ( valueUnit );

        setSearchedParamaeter ();

        $btnSubmit.trigger ( 'click' );
    } );
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

    var params = {
        treeType : staticVariable.treeTypeDvlp
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

// tree scroll customize
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

// 발전출력 조회
function searchPower ()
{
    var $gridList = $ ( '#gridList' );
    var $searchPeriod = $ ( '#search_period' );

    var tpl = getTemplate ( templates.noData );

    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkedNodes = zTree.getCheckedNodes ( true );
        var dateType = homConstants.dateTypeYYYYMMDDHHMI;
        var fromDate = $ ( '#yyyymmddhh_from_date' ).val ();
        var toDate = $ ( '#yyyymmddhh_to_date' ).val ();
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
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
        setPeriodTitle ( $searchPeriod, fromDate, toDate );
        searchPowerChart ();

        if ( initFlag )
        {
            searchPowerJqgrid ( $gridList, tpl );
        } else
        {
            reloadPowerJqgrid ( $gridList );
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

    // 시작, 종료일자 세팅
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
function setPeriodTitle ( $searchPeriod, fromDate, toDate )
{
    $searchPeriod.text ( fromDate + ' ~ ' + toDate );
}

// 발전출력 jqgrid 조회(초기 세팅 및 조회)
function searchPowerJqgrid ( $gridList, tpl )
{
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    $gridList.jqGrid ( {
        url : contextPath + '/hom/monitoring/energy/selectPowerGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 204,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        },
        colNames : [ i18nMessage.msg_date, i18nMessage.msg_power, i18nMessage.msg_inPlaneRdtn,
                i18nMessage.msg_airTemperature, i18nMessage.msg_moduleTemperature, 'powerUnitNm', 'rdtnUnitNm',
                'atmpsUnitNm', 'mtmpsUnitNm' ],
        colModel : [ {
            name : 'stdrDate',
            align : 'center',
            width : '180',
            fixed : true,
            sortable : false
        }, {
            name : 'genePower',
            align : 'right',
            width : '270',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'rdtn',
            align : 'right',
            width : '270',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'temprt',
            align : 'right',
            width : '250',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'mtmps',
            align : 'right',
            width : '250',
            fixed : true,
            sortable : false,
            formatter : function ( cellvalue, options, rowObject )
            {
                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
            }
        }, {
            name : 'powerUnitNm',
            hidden : true
        }, {
            name : 'rdtnUnitNm',
            hidden : true
        }, {
            name : 'atmpsUnitNm',
            hidden : true
        }, {
            name : 'mtmpsUnitNm',
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
            var $gqNodata = $ ( '.gq_nodata' );

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

                updateJqgridPowerHeader ( $gridList );
            }
        }
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $gridList.parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더명 변경
function updateJqgridPowerHeader ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );

    var powerUnitNm = rowData.powerUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;
    var mtmpsUnitNm = rowData.mtmpsUnitNm;

    // 헤더 명 변경
    $gridList.jqGrid ( 'setLabel', 'genePower', i18nMessage.msg_power + homUtil.wrapWord ( powerUnitNm, '(', ')' ) );
    $gridList.jqGrid ( 'setLabel', 'rdtn', i18nMessage.msg_inPlaneRdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' ) );
    $gridList
            .jqGrid ( 'setLabel', 'temprt', i18nMessage.msg_airTemperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
    $gridList.jqGrid ( 'setLabel', 'mtmps', i18nMessage.msg_moduleTemperature
            + homUtil.wrapWord ( mtmpsUnitNm, '(', ')' ) );
}

// 발전출력 차트 조회
function searchPowerChart ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );
    var $unitBox = $ ( '#unit_box' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/energy/selectPowerChartList.ajax',
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
                    $unitBox.show ();

                    // 발전출력, 일사강도, 외기온도, 모듈온도
                    var genePowerArray = [];
                    var rdtnArray = [];
                    var temprtArray = [];
                    var mtmpsArray = [];

                    // 발전량, 일사강도 단위
                    var powerUnitNm = json.data[0].powerUnitNm;
                    var rdtnUnitNm = json.data[0].rdtnUnitNm;
                    var atmpsUnitNm = json.data[0].atmpsUnitNm;
                    var mtmpsUnitNm = json.data[0].mtmpsUnitNm;

                    $.each ( json.data,
                            function ( index, item )
                            {
                                var targetDate = homUtil.convertDateStringToLong ( item.pureDate );

                                genePowerArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.genePower, staticVariable.decimalPoint ) ] );
                                rdtnArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                temprtArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.temprt, staticVariable.decimalPoint ) ] );
                                mtmpsArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.mtmps, staticVariable.decimalPoint ) ] );
                            } );

                    var tempMinArray = [];
                    tempMinArray.push ( _.min ( _.pluck ( temprtArray, [ 1 ] ) ) );
                    tempMinArray.push ( _.min ( _.pluck ( mtmpsArray, [ 1 ] ) ) );

                    var yAxisArray = [];

                    var rdtnYaxis = {
                        title : {
                            text : i18nMessage.msg_inPlaneRdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        },
                        min : 0
                    };
                    var genePowerYaxis = {
                        title : {
                            text : i18nMessage.msg_power + homUtil.wrapWord ( powerUnitNm, '(', ')' )
                        },
                        min : 0
                    };
                    var temprtYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' )
                        }
                    }

                    // 일사강도, 발전출력은 무조건 min 0 수정
                    // if ( _.min ( _.pluck ( rdtnArray, [ 1 ] ) ) > 0 )
                    // {
                    // rdtnYaxis.min = 0;
                    // }

                    // if ( _.min ( _.pluck ( genePowerArray, [ 1 ] ) ) > 0 )
                    // {
                    // genePowerYaxis.min = 0;
                    // }

                    if ( _.min ( tempMinArray ) > 0 )
                    {
                        temprtYaxis.min = 0;
                    }

                    yAxisArray.push ( rdtnYaxis );
                    yAxisArray.push ( genePowerYaxis );
                    yAxisArray.push ( temprtYaxis );

                    $graph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type2 ),
                        chart : {
                            marginTop : 50,
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
                                    var xAxisLabel = homUtil.convertDateLongToString ( this.value,
                                            homUtil.dateFormat.convertHHMM );

                                    return xAxisLabel;
                                }
                            }
                        },
                        yAxis : yAxisArray,
                        tooltip : homUtil.generateTooltip ( homUtil.dateFormat.convertYYYYMMDDHHMM,
                                staticVariable.decimalPoint ),
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
                            yAxis : 1,
                            name : i18nMessage.msg_power,
                            data : genePowerArray
                        }, {
                            type : 'column',
                            yAxis : 0,
                            name : i18nMessage.msg_inPlaneRdtn,
                            data : rdtnArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 2,
                            name : i18nMessage.msg_airTemperature,
                            data : temprtArray
                        }, {
                            type : 'line',
                            yAxis : 2,
                            name : i18nMessage.msg_moduleTemperature,
                            data : mtmpsArray
                        } ]
                    } );
                } else
                {
                    $btnExcel.hide ();
                    $btnAllJqgrid.hide ();
                    $unitBox.hide ();

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

// 발전출력 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadPowerJqgrid ( $gridList )
{
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    $gridList.setGridParam ( {
        postData : {
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 발전출력 엑셀 다운로드
function downloadPowerExcel ()
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

                        menuName += ($ ( '.lnb' ).find ( 'strong' ).text () + '_' + $ ( '.tree_tab_wrap' ).find (
                                '.selected' ).text ());

                        var $menuName = $ ( '<input />', {
                            type : 'hidden',
                            id : 'menuName',
                            name : 'menuName',
                            value : menuName
                        } );

                        $ ( 'form' ).prepend ( $excelUrl, $eqmtNm, $menuName ).prop ( 'action',
                                contextPath + '/hom/excel/mntr/dvlp/download.do' ).submit ();

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
    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    initDatetimepicker ();
    initUnit ();
    initViewAllPopup ();

    $.when ( initEquipmentTree () ).done ( function ()
    {
        searchPower ();
        downloadPowerExcel ();
        initPage ();
    } );
} );
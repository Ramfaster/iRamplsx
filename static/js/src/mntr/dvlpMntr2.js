var dvlpMntr2 = null;

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

    var $yyyymmddhh = $ ( '.yyyymmddhh' );
    var $startYYYYMMDDHH = $ ( '#start_yyyymmddhh' );
    var $endYYYYMMDDHH = $ ( '#end_yyyymmddhh' );
    var $yyyymmddhhFromDate = $ ( '#yyyymmddhh_from_date' );
    var $yyyymmddhhToDate = $ ( '#yyyymmddhh_to_date' );

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

    $yyyymmddhh.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDDHH, $endYYYYMMDDHH, $yyyymmddhhFromDate, $yyyymmddhhToDate );
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

        if ( selectedDateType === homConstants.dateTypeYYYYMMDDHH )
        {
            className = staticVariable.formatYYYYMMDDHH;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
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

    if ( dateType === homConstants.dateTypeYYYYMMDDHH )
    {
        className = staticVariable.formatYYYYMMDDHH;
        dateFormat = homUtil.dateFormat.formatYYYYMMDDHHMM;

    } else if ( dateType === homConstants.dateTypeYYYYMMDD )
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

// 발전량 조회
function searchEnergy ()
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

        if ( selectDateType === homConstants.dateTypeYYYYMMDDHH )
        {
            className = staticVariable.formatYYYYMMDDHH;
        } else if ( selectDateType === homConstants.dateTypeYYYYMMDD )
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
        searchEnergyChart ();

        if ( initFlag )
        {
            searchEnergyJqgrid ( $gridList, tpl );
        } else
        {
            reloadEnergyJqgrid ( $gridList );
        }

        /*
         * if ( dateType === homConstants.dateTypeYYYYMMDDHH ) { $gridList.jqGrid ( 'hideCol', [ "goalEnergy",
         * "expectedEnergy", "goalGap", "expectedGap", "avgEnergyYield" ] ); } else { $gridList.jqGrid ( 'showCol', [
         * "goalEnergy", "expectedEnergy", "goalGap", "expectedGap", "avgEnergyYield" ] ); }
         */

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

// 모니터링 > 발전량 상단 COD - 종료일 정보 조회
function searchCodMonitoringInfo ()
{
    var params = {
        dateType : $ ( '#dateType' ).val (),
        toDate : $ ( '#toDate' ).val ()
    };

    $
            .ajax ( {
                url : contextPath + '/hom/monitoring/energy/selectCodMonitoringInfo.ajax',
                type : 'POST',
                dataType : 'json',
                data : params,
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        $ ( '#goalGeneqty' ).text (
                                homUtil.mathFloorComma ( json.data.goalGeneqty, staticVariable.decimalPoint ) );
                        $ ( '#expectedGeneqty' ).text (
                                homUtil.mathFloorComma ( json.data.expectedGeneqty, staticVariable.decimalPoint ) );
                        $ ( '#acmsltGeneqty' ).text (
                                homUtil.mathFloorComma ( json.data.acmsltGeneqty, staticVariable.decimalPoint ) );
                        $ ( '#co2Reduction' ).text (
                                homUtil.mathFloorComma ( json.data.co2Reduction, staticVariable.decimalPoint ) );
                        $ ( '#acmsltRdtn' ).text (
                                homUtil.mathFloorComma ( json.data.acmsltRdtn, staticVariable.decimalPoint ) );
                        $ ( '#avgGeneTm' ).text (
                                homUtil.mathFloorComma ( json.data.avgGeneTm, staticVariable.decimalPoint ) );

                        $ ( '#geneqtyUnit' ).text ( homUtil.wrapWord ( json.data.geneqtyUnit, '(', ')' ) );
                        $ ( '#acmsltRdtnUnit' ).text ( homUtil.wrapWord ( json.data.acmsltRdtnUnit, '(', ')' ) );
                        $ ( '#avgGeneTmUnit' ).text ( homUtil.wrapWord ( json.data.avgGeneTmUnit, '(', ')' ) );
                        $ ( '#co2ReductionUnit' ).text ( homUtil.wrapWord ( json.data.co2ReductionUnit, '(', ')' ) );

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

// 발전량 차트 조회
function searchEnergyChart ()
{
    var $graph1 = $ ( '#graph1' );
    var $btnExcel = $ ( '#btn_excel' );
    var $btnAllJqgrid = $ ( '#btn_all_jqgrid' );
    var $unitBox = $ ( '#unit_box' );

    $.ajax ( {
        url : contextPath + '/hom/monitoring/energy/selectEnergyChartList.ajax',
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

                    var dateType = $ ( '#dateType' ).val ();
                    var dateFormat = null;
                    var tooltipDateFormat = null;

                    if ( dateType === homConstants.dateTypeYYYYMMDDHH )
                    {
                        dateFormat = homUtil.dateFormat.convertHHMM;
                        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDDHHMM;
                    } else if ( dateType === homConstants.dateTypeYYYYMMDD )
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

                    // 목표 발전량, 전년 발전량, 예상 발전량, 실적 발전량, 평균발전시간, 일사량, 온도
                    var goalEnergyArray = [];
                    var beforeYearEnergyArray = [];
                    var expectedEnergyArray = [];
                    var acmsltEnergyArray = [];
                    var avgEnergyYieldArray = [];
                    var rdtnArray = [];
                    var temprtArray = [];

                    // 발전량, 평균발전시간, 일사량, 온도 단위
                    var energyUnitNm = json.data[0].energyUnitNm;
                    var avgEnergyYieldUnitNm = json.data[0].avgEnergyYieldUnitNm;
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

                                goalEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.goalEnergy, staticVariable.decimalPoint ) ] );
                                beforeYearEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.beforeYearEnergy, staticVariable.decimalPoint ) ] );
                                expectedEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.expectedEnergy, staticVariable.decimalPoint ) ] );
                                acmsltEnergyArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.acmsltEnergy, staticVariable.decimalPoint ) ] );
                                avgEnergyYieldArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.avgEnergyYield, staticVariable.decimalPoint ) ] );
                                rdtnArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.rdtn, staticVariable.decimalPoint ) ] );
                                temprtArray.push ( [ targetDate,
                                        homUtil.mathFloor ( item.temprt, staticVariable.decimalPoint ) ] );
                            } );

                    // 최소값 판단을 통해 min 값 세팅
                    var energyMinArray = [];
                    energyMinArray.push ( _.min ( _.pluck ( goalEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( beforeYearEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( expectedEnergyArray, [ 1 ] ) ) );
                    energyMinArray.push ( _.min ( _.pluck ( acmsltEnergyArray, [ 1 ] ) ) );

                    var yAxisArray = [];
                    var rdtnYaxis = {
                        title : {
                            text : i18nMessage.msg_rdtn + homUtil.wrapWord ( rdtnUnitNm, '(', ')' )
                        }
                    };
                    var energyYaxis = {
                        title : {
                            text : i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' )
                        }
                    };
                    var avgEnergyYieldYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_averageEnergyYield
                                    + homUtil.wrapWord ( avgEnergyYieldUnitNm, '(', ')' )
                        }
                    };
                    var atmpsYaxis = {
                        opposite : true,
                        title : {
                            text : i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' )
                        }
                    };

                    if ( _.min ( _.pluck ( rdtnArray, [ 1 ] ) ) > 0 )
                    {
                        rdtnYaxis.min = 0;
                    }
                    if ( _.min ( energyMinArray ) > 0 )
                    {
                        energyYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( avgEnergyYieldArray, [ 1 ] ) ) > 0 )
                    {
                        avgEnergyYieldYaxis.min = 0;
                    }
                    if ( _.min ( _.pluck ( temprtArray, [ 1 ] ) ) > 0 )
                    {
                        atmpsYaxis.min = 0;
                    }

                    yAxisArray.push ( rdtnYaxis );
                    yAxisArray.push ( energyYaxis );
                    yAxisArray.push ( avgEnergyYieldYaxis );
                    yAxisArray.push ( atmpsYaxis );

                    $graph1.highcharts ( {
                        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type3 ),
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

                                    dateXAxis = dateXAxis.replace ( / /g, '<br />' );

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
                            yAxis : 1,
                            name : i18nMessage.msg_targetEnergy,
                            data : goalEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_lastYearEnergy,
                            data : beforeYearEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_expectedEnergy,
                            data : expectedEnergyArray
                        }, {
                            type : 'column',
                            yAxis : 1,
                            name : i18nMessage.msg_actualEnergy,
                            data : acmsltEnergyArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 2,
                            name : i18nMessage.msg_averageEnergyYield,
                            data : avgEnergyYieldArray
                        }, {
                            type : 'line',
                            yAxis : 0,
                            name : i18nMessage.msg_rdtn,
                            data : rdtnArray
                        }, {
                            type : 'line',
                            dashStyle : 'shortdot',
                            yAxis : 3,
                            name : i18nMessage.msg_temperature,
                            data : temprtArray
                        } ]
                    } );

                    if ( dateType === homConstants.dateTypeYYYYMMDDHH )
                    {
                        var chart = $ ( '#graph1' ).highcharts ();

                        chart.series[0].hide (); // 목표발전량
                        chart.series[1].hide (); // 예상발전량
                        chart.series[2].hide (); // 발전시간

                        // chart.yAxis[2].remove (); // 발전시간 yAxis 삭제
                    }
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

// 발전량 jqgrid 조회(초기 세팅 및 조회)
function searchEnergyJqgrid ( $gridList, tpl )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    var noDataId = 'energy_jqgrid_nodata';

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    $gridList.jqGrid ( {
        url : contextPath + '/hom/monitoring/energy/selectEnergyGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 173,
        autowidth : true,
        shrinkToFit : false,
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        },
        colNames : [ dateTypeText, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_acmslt, i18nMessage.msg_goal, i18nMessage.msg_beforeYear, i18nMessage.msg_expected,
                i18nMessage.msg_averageEnergyYield, i18nMessage.msg_rdtn, i18nMessage.msg_temperature, 'energyUnitNm',
                'rdtnUnitNm', 'avgEnergyYieldUnitNm', 'atmpsUnitNm' ],
        colModel : [
                {
                    name : 'stdrDate',
                    align : 'center',
                    width : '100',
                    fixed : true,
                    sortable : false,
                    editable : true
                },
                {
                    name : 'goalEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedEnergy',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'acmsltEnergy',
                    align : 'right',
                    width : '110',
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
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'beforeYearGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                },
                {
                    name : 'expectedGap',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return jqgridAbsGapFormatter ( cellvalue, options, rowObject, dvlpMntr2.pvAcmsltRateList,
                                staticVariable.decimalPoint );
                    }
                }, {
                    name : 'avgEnergyYield',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'rdtn',
                    align : 'right',
                    width : '110',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'temprt',
                    align : 'right',
                    width : '100',
                    fixed : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyUnitNm',
                    hidden : true
                }, {
                    name : 'rdtnUnitNm',
                    hidden : true
                }, {
                    name : 'avgEnergyYieldUnitNm',
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
            var tabColWidths;

            if ( $ ( '#dateType' ).val () === homConstants.dateTypeYYYYMMDDHH )
            {
                $gridList.jqGrid ( 'hideCol', [ "goalEnergy", "expectedEnergy", "goalGap", "expectedGap",
                        "avgEnergyYield" ] );

                tabColWidths = '35px|100px|0px|223px|0px|223px|0px|223px|0px|0px|223px|223px';

            } else
            {
                $gridList.jqGrid ( 'showCol', [ "goalEnergy", "expectedEnergy", "goalGap", "expectedGap",
                        "avgEnergyYield" ] );

                tabColWidths = '35px|100px|110px|100px|110px|110px|110px|110px|110px|110px|110px|100px';

            }

            if ( tabColWidths !== "" )
            {
                var widthsArr = tabColWidths.split ( '|' );

                for ( var j = 0; j < widthsArr.length; j++ )
                {
                    $ ( '.ui-state-default' ).find ( 'th:eq(' + j + ')' ).each ( function ()
                    {
                        $ ( this ).css ( 'width', widthsArr[j] );
                    } )
                    $ ( '#gridList tr' ).find ( 'td:eq(' + j + ')' ).each ( function ()
                    {
                        $ ( this ).css ( 'width', widthsArr[j] );
                    } )
                }
            }

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

                updateJqgridEnergyHeader ( $gridList );
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

    mergeJqgridEnergyHeader ( $gridList );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 헤더 병합
function mergeJqgridEnergyHeader ( $gridList )
{
    // 헤더 병합
    $gridList.jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalEnergy',
            numberOfColumns : 4,
            titleText : i18nMessage.msg_energy
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_gap + homUtil.wrapWord ( '%', '(', ')' )
        } ]
    } );
}

// 헤더명 변경
function updateJqgridEnergyHeader ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var cl = ids[0];
    var rowData = $gridList.getRowData ( cl );
    var energyUnitNm = rowData.energyUnitNm;
    var avgEnergyYieldUnitNm = rowData.avgEnergyYieldUnitNm;
    var rdtnUnitNm = rowData.rdtnUnitNm;
    var atmpsUnitNm = rowData.atmpsUnitNm;

    if ( typeof rdtnUnitNm !== 'undefined' && rdtnUnitNm !== null )
    {
        rdtnUnitNm = rdtnUnitNm + '/' + dateType.toLowerCase ();
    }

    avgEnergyYieldUnitNm = homUtil.wrapWord ( avgEnergyYieldUnitNm, '(', ')' );
    if ( avgEnergyYieldUnitNm !== '' )
    {
        avgEnergyYieldUnitNm = '<br />' + avgEnergyYieldUnitNm;
    }

    rdtnUnitNm = homUtil.wrapWord ( rdtnUnitNm, '(', ')' );
    if ( rdtnUnitNm !== '' )
    {
        rdtnUnitNm = '<br />' + rdtnUnitNm;
    }

    var $selectedDateType = $ ( '#select_date_type option[value="' + dateType + '"]' );
    var dateTypeText = i18nMessage.msg_date;
    if ( $selectedDateType.size () > 0 )
    {
        dateTypeText = $.trim ( $selectedDateType.text () );
    }

    // 헤더명 변경(발전량, 평균발전시간, 일사량, 온도 with 단위)
    $gridList.jqGrid ( 'setLabel', 'stdrDate', dateTypeText );
    $ ( '#gridList_stdrDate' ).next ( 'th' )
            .html ( i18nMessage.msg_energy + homUtil.wrapWord ( energyUnitNm, '(', ')' ) );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_gridList_avgEnergyYield' ), i18nMessage.msg_averageEnergyYield
            + avgEnergyYieldUnitNm );
    jqgridHeaderLabelUpdate ( $ ( '#jqgh_gridList_rdtn' ), i18nMessage.msg_rdtn + rdtnUnitNm );
    $ ( '#jqgh_gridList_temprt' ).text ( i18nMessage.msg_temperature + homUtil.wrapWord ( atmpsUnitNm, '(', ')' ) );
}

// 발전량 jqgrid 조회(초기 세팅 이후 데이터 갱신 조회)
function reloadEnergyJqgrid ( $gridList )
{
    // 231
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#fromDate' ).val ();
    var toDate = $ ( '#toDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var parntsEqmtId = $ ( '#parntsEqmtId' ).val ();
    var unit = $ ( '#unit' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            eqmtId : eqmtId,
            isEqmtGrp : isEqmtGrp,
            parntsEqmtId : parntsEqmtId,
            unit : unit
        }
    } ).trigger ( 'reloadGrid' );
}

// 발전량 엑셀 다운로드
function downloadEnergyExcel ()
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
    dvlpMntr2 = {
        pvAcmsltRateList : getPvAcmsltRateInfo ()
    };

    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeForm ();
    initUnit ();
    initViewAllPopup ();

    $.when ( initEquipmentTree () ).done ( function ()
    {
        searchEnergy ();
        downloadEnergyExcel ();
        initPage ();
    } );

} );
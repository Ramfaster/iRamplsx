// form element customize
function customizeForm ()
{
    // 검색 조건
    var $dateType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );

    // 알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : '#f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#6c7176',
        selectedBorderColor : '#6c7176'
    } );
    var checkOption5 = $.extend ( {}, defaultOption, {
        width : 118,
        selectedColor : '#c3a279',
        selectedBorderColor : '#c3a279'
    } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#warning' ).customizeCheckbox ( checkOption2 );
    $ ( '#fault' ).customizeCheckbox ( checkOption3 );
    $ ( '#disconnect' ).customizeCheckbox ( checkOption4 );
    $ ( '#system, #equipment' ).customizeCheckbox ( checkOption5 );

    // 알람유형, 알람등급 이벤트
    $ ( 'input:checkbox' ).on ( 'click', function ()
    {
        $id = $ ( this );
        ckbox ( $id );
        search ();
    } );

    // 필터링 결과내 검색
    $ ( "#btn_RstSearch" ).click ( function ()
    {
        search ();
    } );
    
    // 알람 해제구분
    var $releaseType = $ ( '#release_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } ).on ( 'change', function ()
    {
        

        var selectedReleaseType = $ ( this ).val ();

        var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
        var nodes = zTree.transformToArray ( zTree.getNodes () );
        zTree.selectNode ( nodes[0] );


        switch ( selectedReleaseType )
        {
            case 'all':
                $ ( "#date_type, input[id$='_date']" ).prop ( 'disabled', false ).trigger ( 'change' );
                zTree.checkNode ( nodes[0], false, true );
                break;

            case 'r1':
                $ ( "#date_type, input[id$='_date']" ).prop ( 'disabled', true ).trigger ( 'change' );
                //node 중에서 부모가 아닌 1번째 node 에 check.
                $.each ( nodes, function ( i, node )
                {
                    if ( i>0 && node.isParent == false )                        
                    {
                        zTree.checkNode ( node, true, true );                                               
                        return false;
                    }
                } );
                
                break;

            case 'r2':
                $ ( "#date_type, input[id$='_date']" ).prop ( 'disabled', false ).trigger ( 'change' );
                zTree.checkNode ( nodes[0], false, true );
                break;

        }
        makeSelectedEqmtData ();

    } );
    

// 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } )

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    $dateType.on ( 'change', function ()
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
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate );
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    var $hidDateType = $ ( '#hidDateType' );
    if ( $hidDateType.val () !== '' )
    {
        var selectedDateType = $hidDateType.val ();
        var className = null; 
        var dateFormat = null;

        if ( selectedDateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
            dateFormat = homUtil.dateFormat.formatYYYYMMDD;
        } else if ( selectedDateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
            dateFormat = homUtil.dateFormat.formatYYYYMM;
        } else if ( selectedDateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
            dateFormat = homUtil.dateFormat.formatYYYY;
        }
        $date.addClass ( 'dnone' );
        var $dateBox = $ ( '.' + className );
        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val (
                homUtil.convertDateStringToFormat ( $ ( '#hidFromDate' ).val (), dateFormat ) );
        $ ( '#' + className + '_to_date' ).val (
                homUtil.convertDateStringToFormat ( $ ( '#hidToDate' ).val (), dateFormat ) );
    } else
    {
        $dateType.trigger ( 'change' );
    }
}

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

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
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
        pickerPosition : "bottom-right",
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
}

/*
 * 날짜변환 함수
 * '2019-01-01 => 20190101
 * ji.lee 
 */
function strDateToYMD(argDate){

    var tmp = '';

    if(argDate !== undefined){

        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;

        tmp = String(argDate).replace(/(^\s*)|(\s*$)/gi, '').replace(regExp, ''); // 공백 및 특수문자 제거

    }

    return tmp;

}


/**
 * 검색 조건 초기화 및 검색.
 */
function initCndSearch ()
{
    refreshCkbox ( $ ( '#notice' ) );
    refreshCkbox ( $ ( '#warning' ) );
    refreshCkbox ( $ ( '#fault' ) );
    refreshCkbox ( $ ( '#disconnect' ) );
    refreshCkbox ( $ ( '#system' ) );
    refreshCkbox ( $ ( '#equipment' ) );
}

/**
 * @returns {Boolean}
 */
function searchAlarmList ()
{
    var selectedEqmtId = $ ( '#arrayId' ).val ();
    if ( !selectedEqmtId )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertEquipmentNoSelected,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );

        return false;
    }

    var dateType = $ ( '#date_type' ).val ();
    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();
    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
    {
        return;
    }

    // ji.lee 추가
    if (fromDate.length > 8) {
        fromDate    = strDateToYMD(fromDate);
        toDate      = strDateToYMD(toDate);
    }
    
    $ ( "#hidFromDate" ).val ( pureFromDate );
    $ ( "#hidToDate" ).val ( pureToDate );
    $ ( "#hidDateType" ).val ( dateType );

    // 현재 조회 조건 설정. 추후 엑셀 다운 받기를 위하여.
    currentSearchConditionSetting ();
    
    console.log("fromDate::",fromDate);
    console.log("toDate::",toDate);
    console.log("alarm type system={0}, equipment={1}".format($( '#system' ).val (), $( '#equipment' ).val ()));    
    
    reloadJqgrid ();

    // 조치율

    getRate ();

}

function initSearch ()
{
 
    var dateType = $ ( '#date_type' ).val ();
    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();
    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
    {
        return;
    }

    // ji.lee 추가
    if (fromDate.length > 8) {
        fromDate    = strDateToYMD(fromDate);
        toDate      = strDateToYMD(toDate);
    }
    
   
    $ ( "#hidFromDate" ).val ( fromDate );
    $ ( "#hidToDate" ).val ( toDate );    
    $ ( "#hidDateType" ).val ( dateType );

    // 현재 조회 조건 설정. 추후 엑셀 다운 받기를 위하여.
    currentSearchConditionSetting ();
}

// 현재 그리드에 표출된 조회 조건 설정.
function currentSearchConditionSetting ()
{
    $ ( '#currentSearchDateType' ).val ( $ ( '#hidDateType' ).val () );
    $ ( '#currentSearchFromDate' ).val ( $ ( '#hidFromDate' ).val () );
    $ ( '#currentSearchToDate' ).val ( $ ( '#hidToDate' ).val () );
    $ ( '#currentSearchEqmtId' ).val ( $ ( '#arrayId' ).val () );
    $ ( '#currentSearchNotice' ).val ( $ ( '#notice' ).val () );
    $ ( '#currentSearchWarning' ).val ( $ ( '#warning' ).val () );
    $ ( '#currentSearchFault' ).val ( $ ( '#fault' ).val () );
    $ ( '#currentSearchDisconnect' ).val ( $ ( '#disconnect' ).val () );
    $ ( '#currentSearchSystem' ).val ( $ ( '#system' ).val () );
    $ ( '#currentSearchEquipment' ).val ( $ ( '#equipment' ).val () );
    $ ( '#currentSearchSearchType' ).val ( $ ( '#search_type' ).val () );
    $ ( '#currentSearchSearchKeyword' ).val ( $ ( '#searchValue' ).val () );
    
    $ ( '#currentReleaseType' ).val ( $ ( '#release_type' ).val () );   

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
            enable : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        callback : {

            onCheck : function ( e, treeId, treeNode )
            {
                makeSelectedEqmtData ();
            },

            beforeClick : function ( treeId, treeNode )
            {

                var zTree = $.fn.zTree.getZTreeObj ( "treeList" );
                var selectedNodes = zTree.getCheckedNodes ();

                var selected = true;

                $.each ( selectedNodes, function ( i, node )
                {
                    if ( node.id === treeNode.id )
                    {
                        selected = false;
                        return false;
                    }
                } );


                zTree.checkNode ( treeNode, selected, true );

                makeSelectedEqmtData ();
            }
        }

    };

    /** 검색해야 할 설비 아이디 목록이 있을 경우. * */
    var selectedEqmtIds = $ ( '#arrayId' ).val ();
    if ( selectedEqmtIds )
    {
        var selectedEqmtIdArray = selectedEqmtIds.split ( ',' );
        for ( var index in selectedEqmtIdArray )
        {
            $.each ( data, function ( i, node )
            {
                // 앞에서 선택하지 않은 노드는 FALSE로 셋팅
                if ( selectedEqmtIdArray[index] == node.id )
                {
                    node.checked = true;
                    return;
                }
            } );
        }
    }

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
    var $arrayId = $ ( '#arrayId' );
    var nodeArray = [];

    // 선택된 노드가 없을 경우.
    if ( !selectedEqmtIds )
    {
        var treeObj = $.fn.zTree.getZTreeObj ( 'treeList' );
        var checkNodes = treeObj.getCheckedNodes ( true );
        if ( checkNodes.length > 0 )
        {
            $.each ( checkNodes, function ( i, node )
            {
                nodeArray.push ( node.id );
            } );
        } else
        {
            var nodes = treeObj.transformToArray ( treeObj.getNodes () );

            //node 중에서 부모가 아닌 1번째 node 에 check.
            $.each ( nodes, function ( i, node )
            {
                if ( node.isParent == false )
                {
                    node.checked = true;
                    nodeArray.push ( node.id );
                    treeObj.refresh ();
                    return false;
                }
            } );
        }
        $arrayId.val ( nodeArray.toString () );
    }
    
    var releaseType = $ ( "#releaseType" ).val ();

    if ( releaseType == "r1" )
    {
        $ ( '#release_type' ).val ( releaseType ).trigger ( 'change' );
    }

    // 그리드 초기화.
    initJqgrid ( $arrayId.val () );
    currentSearchConditionSetting ();

}

// 조회해야할 설비 데이터 생성
function makeSelectedEqmtData ()
{

    var treeObj = $.fn.zTree.getZTreeObj ( "treeList" );
    var nodes = treeObj.getCheckedNodes ( true );

    // 체크 된 설비아이디
    var arrayId = "";
    $.each ( nodes, function ( i, node )
    {
        var isParent = node.isParent;

        // if ( isParent == false )
        // {
        arrayId += node.id + ",";
        // }

    } );

    $ ( '#arrayId' ).val ( arrayId );
}

/**
 * 발전소 설비 목록
 */
function getEqmtList ()
{
    var deferred = $.Deferred ();

    var params = {
        treeType : staticVariable.treeTypeAlarm
    };

    console.log("getEqmtList() treeTypeAlarm ::",staticVariable.treeTypeAlarm);
    
    
    $.ajax ( {
        url : contextPath + '/hom/common/selectEssEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                console.log("ESS 발전소 설비목록::",json.data);
                initTree ( json.data );
                deferred.resolve ();
            } else
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

    return deferred.promise ();
}

// 조치율
function getRate ()
{
    $ ( '#eqmtId' ).val ( $ ( '#arrayId' ).val () );
    $ ( '#searchKey' ).val ( $ ( '#search_type' ).val () );
    $ ( '#searchKeyword' ).val ( $ ( '#searchValue' ).val () );
    $ ( '#releaseType' ).val ( $ ( '#release_type' ).val () );  
    
    var params = $ ( '#frmSearch' ).serialize ();

    $.ajax ( {
        //url : contextPath + '/hom/operation/alarm/getRate.ajax',
        url : contextPath + '/hom/operation/alarm/ess/getRate.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                
                console.log("조치율 ::", json.data);
                
                // 조치율 조치율 66%(100/150)
                if ( json.data.alarmManagtTotal != null )
                {
                    $ ( '#spAlarmManagtTotal' ).text (
                            i18nMessage.msg_retrieveAlarm + " " + json.data.alarmManagtTotal
                                    + i18nMessage.msg_pAlarmCountUnit );
                }
                if ( json.data.alarmManagtRate != null )
                {
                    $ ( '#spAlarmManagtRate' ).text (
                            i18nMessage.msg_actionRatio + " " + json.data.alarmManagtRate + "%" + " ("
                                    + json.data.alarmManagt + "/" + json.data.alarmManagtTotal + ")" );
                }
                if ( json.data.alarmFaultTotal != null )
                {
                    $ ( '#spAlarmFaultTotal' ).text (
                            i18nMessage.msg_alarmLisFault + " " + json.data.alarmFaultTotal
                                    + i18nMessage.msg_pAlarmCountUnit );

                }
                if ( json.data.alarmFaultTotal != null )
                {
                    $ ( '#spAlarmFaultRate' ).text (
                            i18nMessage.msg_actionRatio + json.data.alarmFaultRate + "%" + " (" + json.data.alarmFault
                                    + "/" + json.data.alarmFaultTotal + ")" );
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

        },// success
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

// 알람확인
function updateDt ( occrrncId, tagId, occrrncDt, alarmGradCd )
{

    var params = {
        occrrncId : occrrncId,
        tagId : tagId,
        occrrncDt : occrrncDt,
        alarmGradCd : alarmGradCd
    };

    $.ajax ( {
        //url : contextPath + '/hom/operation/alarm/updateDt.ajax',
        url : contextPath + '/hom/operation/alarm/ess/updateDt.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                console.log("updateDt ::");
                searchAlarmList ();
            }// if
            else if ( json.status === staticVariable.jsonStatusError )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : json.message,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        },// success
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

// 필터링 검색
function search ()
{
    currentSearchConditionSetting ();

    reloadJqgrid ();

    // 조치율
    getRate ();
}

// 체크박스 on/off
function ckbox ( $id )
{
    var isChecked = $ ( $id ).is ( ":checked" );

    if ( isChecked == false )
    {
        $ ( $id ).val ( "off" );

    } else if ( isChecked == true )
    {
        $ ( $id ).val ( "on" );
    }
}

// 체크 박스 리프레쉬.
function refreshCkbox ( $id )
{
    var isChecked = $ ( $id ).is ( ':checked' );

    if ( isChecked == true )
    {
        $ ( $id ).val ( 'on' );
        $ ( $id ).prop ( 'checked', true ).trigger ( 'change' );

    } else
    {
        $ ( $id ).val ( 'off' );
        $ ( $id ).prop ( 'checked', false ).trigger ( 'change' );
    }
}

// 검색 알람 모두 확인.
function searchAlarmAllAck ()
{
    $ ( '#alarmAllAck' ).on ( 'click', function ()
    {
        var params = {
            dateType : $ ( '#currentSearchDateType' ).val (),
            fromDate : $ ( '#currentSearchFromDate' ).val (),
            toDate : $ ( '#currentSearchToDate' ).val (),
            notice : $ ( '#currentSearchNotice' ).val (),
            warning : $ ( '#currentSearchWarning' ).val (),
            fault : $ ( '#currentSearchFault' ).val (),
            disconnect : $ ( '#currentSearchDisconnect' ).val (),
            system : $ ( '#currentSearchSystem' ).val (),
            equipment : $ ( '#currentSearchEquipment' ).val (),
            eqmtId : $ ( '#currentSearchEqmtId' ).val (),
            searchKey : $ ( '#currentSearchSearchType' ).val (),
            searchKeyword : $ ( '#currentSearchSearchKeyword' ).val ()
        };

        console.log("searchAlarmAllAck ::");
        
        setSearchedParameter ( params );

        $.ajax ( {
            //url : contextPath + '/hom/operation/alarm/searchAlarmAllAck.ajax',
            url : contextPath + '/hom/operation/alarm/ess/searchAlarmAllAck.ajax',
            type : 'POST',
            dataType : 'json',
            data : params,
            async : false,
            success : function ( json )
            {                
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    console.log("searchAlarmAllAck ::", json.data);
                    reloadJqgrid ();
                } else
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

    } );

}

// jqgrid 검색
function searchJqgrid ()
{
    var $btnSearch = $ ( '#btn_search' );
    var $searchValue = $ ( '#searchValue' );
    

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            console.log("searchJqgrid():: event enter key");
            //searchAlarmList ();
            
            // 기존코드
            currentSearchConditionSetting ();
            reloadJqgrid ();
            // 조치율
            getRate ();
        }
    } );


    $btnSearch.on ( 'click', function ()
    {
        console.log("searchJqgrid():: event click");
        searchAlarmList ();
    } );
}

// jqgrid reload
function reloadJqgrid ()
{
    console.log("reloadJqgrid() :: fromDate={0}, toDate={1}".format(
            $ ( '#currentSearchFromDate' ).val (),
            $ ( '#currentSearchToDate' ).val ()));
    
    $ ( '#gridList' ).setGridParam ( {
        postData : {
            eqmtId : $ ( '#currentSearchEqmtId' ).val (),
            dateType : $ ( '#currentSearchDateType' ).val (),
            fromDate : $ ( '#currentSearchFromDate' ).val (),
            toDate : $ ( '#currentSearchToDate' ).val (),
            notice : $ ( '#notice' ).val (),
            warning : $ ( '#warning' ).val (),
            fault : $ ( '#fault' ).val (),
            disconnect : $ ( '#disconnect' ).val (),
            system : $ ( '#system' ).val (),
            equipment : $ ( '#equipment' ).val (),
            searchKey : $ ( '#currentSearchSearchType' ).val (),
            searchKeyword : $ ( '#currentSearchSearchKeyword' ).val (),
            releaseType : $ ( '#release_type' ).val ()          
        }
    } ).trigger ( 'reloadGrid' );
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

// jqgird customize
function initJqgrid ( eqmtId )
{
    var tpl = getTemplate ( templates.noData );

    var korean = true;
    var english = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        korean = false;
        english = true;
    }

    console.log("initJqgrid():: eqmtId={0}, DateType={1}, fromDate={2}, toDate={3}".format(
            eqmtId,
            $ ( '#hidDateType' ).val (),
            $ ( '#hidFromDate' ).val (),
            $ ( '#hidToDate' ).val ()            
            ));
    
    // ji.lee 추가
    // 날짜 셋팅이 안되어 있을 경우 
    // 서버에 요청전에 셋팅 처리해야 한다.
    if ($('#hidDateType').val().length <= 0) {
        initDatetimepicker ();
   
        var dateType = $ ( '#date_type' ).val ();
        var className = null;

        if ( dateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( dateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( dateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }        
        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();
        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
        {
            return;
        }

        // ji.lee 추가
        if (fromDate.length > 8) {
            fromDate    = strDateToYMD(fromDate);
            toDate      = strDateToYMD(toDate);
        }
        
       
        $ ( "#hidFromDate" ).val ( fromDate );
        $ ( "#hidToDate" ).val ( toDate );    
        $ ( "#hidDateType" ).val ( dateType );
       
        console.log("fromDate::",fromDate);
        console.log("toDate::",toDate);        
        console.log("DateType::",toDate);
           
    }
    
    
    // jqgrid
    $ ( '#gridList' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/operation/alarm/ess/essSelectAlarmMgt.ajax',
                        mtype : 'POST',
                        datatype : 'json',
                        height : 632,
                        autowidth : true,
                        shrinkToFit : false,
                        async : false,
                        sortname : '',
                        sortorder : 'desc',
                        multiselect : false,
                        multiboxonly : false,
                        rownumbers : true,
                        rowwidth : 25,
                        page : 1,
                        rowNum : staticVariable.gridRow30,
                        scroll : true,
                        viewrecords : true,
                        postData : {
                            eqmtId : eqmtId,
                            dateType : $ ( '#hidDateType' ).val (),
                            fromDate : $ ( '#hidFromDate' ).val (),
                            toDate : $ ( '#hidToDate' ).val (),
                            notice : $ ( '#notice' ).val (),
                            warning : $ ( '#warning' ).val (),
                            fault : $ ( '#fault' ).val (),
                            disconnect : $ ( '#disconnect' ).val (),
                            system : $ ( '#system' ).val (),
                            equipment : $ ( '#equipment' ).val (),
                            searchKey : $ ( '#search_type' ).val (),
                            searchKeyword : $ ( '#searchValue' ).val (),
                            releaseType : $ ( '#release_type' ).val (),                 
                        },
                        colNames : [ i18nMessage.msg_pAlarmOccurId, i18nMessage.msg_pAlarmEqmtId,
                                     i18nMessage.msg_pAlarmTagId, i18nMessage.msg_pAlarmCreatetime,
                                     i18nMessage.msg_pAlarmAcktime, 
                                     i18nMessage.msg_pAlarmNormaltime,
                                     //i18nMessage.msg_pAlarmTerminatetime, 
                                     i18nMessage.msg_pAlarmEqmtName,
                                     i18nMessage.msg_pAlarmEqmtName, i18nMessage.msg_pAlarmGrade,
                                     i18nMessage.msg_pAlarmGradeCode, i18nMessage.msg_alarmType, i18nMessage.msg_alarmType,
                                     i18nMessage.msg_pAlarmGradeDivisionCode, 
                                     i18nMessage.msg_alarmDescription,
                                     i18nMessage.msg_alarmDescription],

                             colModel : [
                                     {
                                         name : 'occrrncId',
                                         index : 'occrrncId',
                                         align : 'center',
                                         width : '50',
                                         hidden : true
                                     },
                                     {
                                         name : 'eqmtId',
                                         index : 'eqmtId',
                                         align : 'center',
                                         width : '50',
                                         hidden : true
                                     },

                                     {
                                         name : 'tagId',
                                         index : 'tagId.',
                                         align : 'center',
                                         width : '200',
                                         hidden : true
                                     },

                                     {
                                         name : 'occrrncDt',
                                         index : 'occrrncDt',
                                         width : '160',
                                         align : "center"
                                     },
                                     {
                                         name : 'confmDt',
                                         index : 'confmDt',
                                         align : 'center',
                                         width : '160'
                                     },
                                     {
                                         name : 'releaseDt',
                                         index : 'releaseDt',
                                         align : 'center',
                                         width : '160'
                                     },
                                     /*
                                     {
                                         name : 'trmnatDt',
                                         index : 'trmnatDt',
                                         align : 'center',
                                         width : '136'
                                     },
                                     */
                                     {
                                         name : 'eqmtKorNm',
                                         index : 'eqmtKorNm',
                                         align : 'center',
                                         width : '180',
                                         hidden : korean
                                     },
                                     {
                                         name : 'eqmtEngNm',
                                         index : 'eqmtEngNm',
                                         align : 'center',
                                         width : '180',
                                         hidden : english
                                     },

                                     {
                                         name : 'cdKorNm',
                                         index : 'alarmGradCd',
                                         align : 'center',
                                         width : '120',
                                         formatter : function ( cellValue, options, rowObject1 )
                                         {
                                             if ( rowObject1.alarmGradCd == "ALVL01" )
                                             {
                                                 return '</i> <span class="t_green">' + i18nMessage.msg_alarmGradeNotice
                                                         + '</span>';
                                             } else if ( rowObject1.alarmGradCd == "ALVL02" )
                                             {
                                                 return '</i> <span class="t_yellow">' + i18nMessage.msg_alarmGradeWarning
                                                         + '</span> ';
                                             } else if ( rowObject1.alarmGradCd == "ALVL03" )
                                             {
                                                 return '<i class="icon_fault02"></i> <span class="t_red">'
                                                         + i18nMessage.msg_alarmGradeFault + '</span>';
                                             } else if ( rowObject1.alarmGradCd == "ALVL04" )
                                             {
                                                 return '</i> <span class="t_gray">' + i18nMessage.msg_alarmGradeDisconnect
                                                         + '</span>';
                                             }
                                         }
                                     },

                                     {
                                         name : 'alarmGradCd',
                                         index : 'alarmGradCd',
                                         align : 'center',
                                         width : '74',
                                         hidden : true
                                     },

                                     {
                                         name : 'alarmGrpKorNm',
                                         index : 'alarmGrpKorNm',
                                         align : 'center',
                                         width : '120',
                                         hidden : korean
                                     },
                                     {
                                         name : 'alarmGrpEngNm',
                                         index : 'alarmGrpEngNm',
                                         align : 'center',
                                         width : '120',
                                         hidden : english
                                     },
                                     {
                                         name : 'alarmGrpCd',
                                         index : 'alarmGrpCd',
                                         align : 'center',
                                         width : '120',
                                         hidden : true
                                     },
                                     {
                                         name : 'alarmKorNm',
                                         index : 'alarmKorNm',
                                         align : 'left',
                                         width : 300,//'347',
                                         hidden : korean
                                     },
                                     {
                                         name : 'alarmEngNm',
                                         index : 'alarmEngNm',
                                         align : 'left',
                                         width :  300,//'347', // 265
                                         hidden : english
                                     }
                                     /*,
                                     {
                                         name : 'change',
                                         index : 'confmDt',
                                         align : 'center',
                                         width : '82',
                                         hidden : true,
                                         sortable : false,
                                         formatter : function ( cellValue, options, rowObject )
                                         {
                                             if ( rowObject.confmDt )
                                             {
                                                 return '<a href="javascript:;" class="btn_cfrm link selected"><i class="icon_check"></i>'
                                                         + i18nMessage.msg_confirm + '</a>';

                                             } else
                                             {
                                                 return '<a href="javascript:updateDt(\'' + rowObject.occrrncId + '\' , \''
                                                         + rowObject.tagId + '\' , \'' + rowObject.occrrncDt + '\', \''
                                                         + rowObject.alarmGradCd
                                                         + '\');"class="btn_cfrm link"><i class="icon_check" ></i>'
                                                         + i18nMessage.msg_confirm + '</a>';
                                             }

                                         }
                                     } */],
                        loadComplete : function ( data )
                        {
                            console.log("grid data ::", data);

                            var $gqNodata = $ ( '.gq_nodata' );

                            if ( data.records === 0 )
                            {
                                $gqNodata.show ();

                            } else
                            {
                                $gqNodata.hide ();

                                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
                                var $gridList = $ ( '#gridList' );

                                var ids = $gridList.jqGrid ( "getDataIDs" );
                                for ( var i = 0, length = ids.length; i <= length; i++ )
                                {
                                    var cl = ids[i];

                                    var rowData = $gridList.getRowData ( cl );

                                    $gridList.jqGrid ( 'setRowData', cl, rowData );

                                }

                            }

                        },
                        onCellSelect : function ( rowId, icol, status )
                        {
                            var $gridList = $ ( '#gridList' );
                            var rowData = $gridList.getRowData ( rowId );

                            var row = $gridList.jqGrid ( 'getInd', rowId );

                            var searchDateType = $ ( '#currentSearchDateType' ).val ();
                            var searchFromDate = $ ( '#currentSearchFromDate' ).val ();
                            var searchToDate = $ ( '#currentSearchToDate' ).val ();
                            var searchEqmtId = $ ( '#currentSearchEqmtId' ).val ();

                            var searchNotice = $ ( '#notice' ).val ();
                            var searchWarning = $ ( '#warning' ).val ();
                            var searchFault = $ ( '#fault' ).val ();
                            var searchDisconnect = $ ( '#disconnect' ).val ();
                            var searchSystem = $ ( '#system' ).val ();
                            var searchEquipment = $ ( '#equipment' ).val ();
                            var searchSearchType = $ ( '#currentSearchSearchType' ).val ();
                            var searchSearchValue = $ ( '#currentSearchSearchKeyword' ).val ();

//                            location.href = contextPath + '/hom/operation/alarm/ess/view.do?tagId='
//                                    + Base64.URLEncode ( rowData.tagId ) + '&eqmtId=' + rowData.eqmtId + '&occrrncDt='
//                                    + rowData.occrrncDt + '&confmDt=' + rowData.confmDt + '&trmnatDt='
//                                    + rowData.trmnatDt + '&rowCount=' + row + '&occrrncId=' + rowData.occrrncId
//                                    + '&searchDateType=' + searchDateType + '&searchFromDate=' + searchFromDate
//                                    + '&searchToDate=' + searchToDate + '&searchEqmtId=' + searchEqmtId + '&notice='
//                                    + searchNotice + '&warning=' + searchWarning + '&fault=' + searchFault
//                                    + '&disconnect=' + searchDisconnect + '&system=' + searchSystem + '&equipment='
//                                    + searchEquipment + '&searchType=' + searchSearchType + '&alarmGradCd='
//                                    + rowData.alarmGradCd + '&searchValue='
//                                    + encodeURI ( encodeURIComponent ( searchSearchValue ) );

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

// 엑셀 다운로드
function clickBtnExcel ()
{
    $ ( '#btn_excel' ).on ( 'click', function ()
    {
        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());
        
        if (menuName.length <= 0) menuName = '운영관리_ESS 알람 관리';

        var params = {
            dateType : $ ( '#currentSearchDateType' ).val (),
            fromDate : $ ( '#currentSearchFromDate' ).val (),
            toDate : $ ( '#currentSearchToDate' ).val (),
            notice : $ ( '#currentSearchNotice' ).val (),
            warning : $ ( '#currentSearchWarning' ).val (),
            fault : $ ( '#currentSearchFault' ).val (),
            disconnect : $ ( '#currentSearchDisconnect' ).val (),
            system : $ ( '#currentSearchSystem' ).val (),
            equipment : $ ( '#currentSearchEquipment' ).val (),
            eqmtId : $ ( '#currentSearchEqmtId' ).val (),
            searchKey : $ ( '#currentSearchSearchType' ).val (),
            searchKeyword : $ ( '#currentSearchSearchKeyword' ).val (),
            menuName : menuName
        };
                
        

        console.log("ess excel download menuName ::" + menuName);
        
        // 조건 셋팅
        setSearchedParameter ( params );

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료, 검색어, 검색조건, 설비)을 바꾼 후 조회버튼이나 검색 버튼을 누르지 않고 알람확인, 엑셀다운로드, 알람 상세화면 전환 진행 시 원래 조회했던 조건으로 화면을
 * 세팅
 */
function setSearchedParameter ( params )
{
    var dateType = params.dateType;
    className = null;   //ji.lee
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

    var fromDate = homUtil.convertDateStringToFormat ( params.fromDate, dateFormat );
    var toDate = homUtil.convertDateStringToFormat ( params.toDate, dateFormat );

    $ ( '#date_type' ).val ( dateType ).trigger ( 'change' );
    $ ( '#' + className + '_from_date' ).val ( fromDate );
    $ ( '#' + className + '_to_date' ).val ( toDate );

    $ ( '#search_type' ).val ( params.searchKey ).trigger ( 'change' );
    $ ( '#searchValue' ).val ( params.searchKeyword );

    var treeObj = $.fn.zTree.getZTreeObj ( 'treeList' );
    var nodes = treeObj.transformToArray ( treeObj.getNodes () );

    var eqmtIdArray = params.eqmtId.split ( ',' );
    $.each ( nodes, function ( i, node )
    {
        node.checked = false;
        $.each ( eqmtIdArray, function ( j, eqmtId )
        {
            if ( eqmtId !== '' && eqmtId == node.id )
            {
                node.checked = true;
                return false;
            }
        } );
    } );
    treeObj.refresh ();
}

function initPage ()
{
    $ ( '#btn_search' ).trigger ( 'click', true );
}


/**
 * 브라우저 onLoad evet
 * function() event 다음에 실행된다.
 */
$(window).on("load", function(){
    console.log("onload::");

    
});


function makeStringPrototype() {

    if (!String.prototype.format) {
        String.prototype.format = function() {
          var args = arguments;
          return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
          });
        }
    }
    console.log("StringPrototype make::");
    
}



$ ( function ()
{
    makeStringPrototype();
    initDatetimepicker ();
    customizeForm ();
    customizeScroll ();

    // 트리 구성
    var promise = getEqmtList ();
    promise.done ( function ()
    {
        console.log("getEqmtList() promise.done()");
        // 조회 조건 설정 및 검색.
        initCndSearch ();
        // 그리드 이벤트 설정
        searchJqgrid ();
        // 조치율
        //getRate ();
        // 엑셀 이벤트 설정.
        clickBtnExcel ();
        // 검색 알람 전체 확인.
        searchAlarmAllAck ();

        initPage ();
    } );

} );
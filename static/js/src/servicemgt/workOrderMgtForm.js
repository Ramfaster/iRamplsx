function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $dateType = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $selType2 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    var $selType3 = $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    $ ( '.sel_type_file2' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

    $ ( '#file1, #file7' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : '찾기',
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );

    $ ( '#file2, #file3, #file4, #file5, #file6' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : '찾기',
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 230,
        height : 25
    } );
}

/**
 * 셀렉트 박스 customize
 */
function customizeSelect ()
{
    var $dateType1 = $ ( '#attrbCd, #cmmnClCdList, #cmmnCdList, .grnt_type, #eqmtItemCdList' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );
}

function fileCustomizeForm ()
{
    // custom form
    $ ( '.files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25,
        enableInitButton : true,
        initButtonBackgroundImage : contextPath + '/css/lib/customizeForm/img/img_close_btn01.png'
    } );

    $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

}

function fileCustomizeScroll ()
{
    // custom scroll
    $ ( '.scroll_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

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

    var $yyyymmddhhmi = $ ( '.yyyymmddhhmi' );
    var $startYYYYMMDDHHMI = $ ( '#start_yyyymmddhhmi' );
    var $endYYYYMMDDHHMI = $ ( '#end_yyyymmdd' );
    var $YYYYMMDDHHMIFromDate = $ ( '#yyyymmdd_from_date' );
    var $YYYYMMDDHHMIToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정(일/월/년)
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : 'bottom-right',
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmddhhmi.datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmddhhmi.datetimepicker ().on ( 'changeDate', function ( event )
    {
        // homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );

        var occrrncDt = $ ( '#occrrncDt' ).val ();
        var trmnatDt = $ ( '#trmnatDt' ).val ();

        if ( occrrncDt != '' && trmnatDt != '' )
        {
            var msecPerMinute = 1000 * 60; // 분
            var msecPerHour = msecPerMinute * 60; // 시간
            var msecPerDay = msecPerHour * 24; // 일

            var fromDate = new Date ( $ ( '#occrrncDt' ).val () );
            var toDate = new Date ( $ ( '#trmnatDt' ).val () );

            var interval = toDate.getTime () - fromDate.getTime ();
            var hours = interval / msecPerHour;

            var minutes = Math.floor ( interval / msecPerMinute );

            $ ( '#defectTime' ).val ( hours.toFixed ( 1 ) );

        }
    } );

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

/**
 * 입력된 항목 초기화
 */
function resetRegForm ()
{
    $ ( '#btnReset' ).on ( 'click', function ()
    {
        $ ( 'form' ).each ( function ()
        {
            // this.reset ();
            $ ( this ).find ( 'input[type=text], textarea' ).val ( '' );
            $ ( this ).find ( 'select' ).find ( 'option:eq(0)' ).prop ( "selected", "selected" ).trigger ( 'change' );
        } );

        $ ( '.grnt_type' ).find ( 'option:eq(0)' ).prop ( "selected", "selected" ).trigger ( 'change' );
        $ ( '.sel_type_file' ).find ( 'option:eq(0)' ).prop ( "selected", "selected" ).trigger ( 'change' );

        $ ( ".delete_file" ).each ( function ()
        {
            $ ( this ).closest ( 'li' ).remove ();
        } );

        // 첨부파일 선택 초기화
        $ ( "#file1" ).val ( "" ).trigger ( "change" );
    } );
}

// 이벤트 설정
function setEvent ()
{
    // 업무 구분 Select Box Event
    $ ( '#selAplctnSectnCd' ).change ( function ()
    {
        var aplctnSectnCd = $ ( this ).val ();
        var selectInitTextFormat = '<option value="">' + i18nMessage.msg_all + '</option>';
        var selectInitTextFormat2 = '<option value="">' + i18nMessage.msg_selection + '</option>';

        switch ( aplctnSectnCd )
        {
            case 'all':
                $ ( '#selAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', false ).trigger ( 'change' );
                break;
            case 'WCHK01': // 점검
                selectAplctnStleCd ( aplctnSectnCd );
                // 업무 형태 콤보 박스 활성화
                $ ( '#selAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );

                // 대상 설비 비활성화
                $ ( '#selItem' ).html ( selectInitTextFormat2 ).prop ( 'disabled', true ).trigger ( 'change' );

                break;
            case 'WCHK09': // 보수
                selectAplctnStleCd ( aplctnSectnCd );
                // 업무 형태 콤보 박스 활성화
                $ ( '#selAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );

                // 대상 설비 활성화
                $ ( '#selItem' ).html ( selectInitTextFormat ).prop ( 'disabled', false ).trigger ( 'change' );
                selectEqmtInfoList ( "" );

                break;
            case 'WCHK12': // 정전
                // 업무 형태 콤보 박스 비활성화
                $ ( '#selAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );

                // 대상 설비 비활성화
                $ ( '#selItem' ).html ( selectInitTextFormat2 ).prop ( 'disabled', true ).trigger ( 'change' );

                break;
            case 'WCHK13': // 사고
                // 업무 형태 콤보 박스 비활성화
                $ ( '#selAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );

                // 대상 설비 활성화
                $ ( '#selItem' ).html ( selectInitTextFormat ).prop ( 'disabled', false ).trigger ( 'change' );
                selectEqmtInfoList ( "" );

                break;
        }

        // 템플릿 변경
        templateChange ();
    } );

    // 대상 Select Box Event
    $ ( '#selItem' ).change ( function ()
    {
        var $selEqmt = $ ( '#selEqmt' );
        var $selComp = $ ( '#selComp' );

        var selEqmtVal = $ ( '#selItem' ).val ();
        var selEqmtText = $ ( '#selItem option:selected' ).text ();

        if ( $selEqmt.length > 0 )
        {
            var selectInitTextFormat = '<option value="' + selEqmtVal + '">' + selEqmtText + '</option>';
            $ ( '#selEqmt' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger ( 'change' );
        }

        if ( $selComp.length > 0 )
        {
            var selEqmtVal = $ ( '#selItem' ).val ();

            var datas = selectEqmtInfoList ( selEqmtVal );

            if ( datas !== null && datas.length > 0 )
            {
                $selComp.empty ();

                _.each ( datas, function ( item )
                {
                    if ( lang == locale.korea || lang == locale.korean )
                    {
                        $selComp.append ( '<option value="' + item.itemId + '">' + item.itemKorNm + '</option>' );
                    } else
                    {
                        $selComp.append ( '<option value="' + item.itemId + '">' + item.itemEngNm + '</option>' );
                    }
                } );
                $selComp.trigger ( 'change' );
                // deferred.resolve ();
            }

        }
    } );

    // 항목 초기화
    $ ( '#btnItemMgtInfoReset' ).click ( function ()
    {
        switch ( aplctnSectnCd )
        {
            case 'WCHK09': // 보수
                $ ( '#btnReset' ).trigger ( "click" );
                break;

            case 'WCHK13': // 사고
                $ ( '#selComp option:eq(0)' ).prop ( 'selected', 'selected' ).trigger ( 'change' );
                $ ( '#occrrncDt, #trmnatDt, #defectTime, #dvlpLossqy, #rm' ).val ( '' );
                break;

            default:
                break;
        }
    } );

    $ ( '#btn_list' ).click (
            function ()
            {
                var searchPvIdList = $ ( "#searchPvIdList" ).val ();
                var searchFromDate = $ ( "#searchFromDate" ).val ();
                var searchToDate = $ ( "#searchToDate" ).val ();
                var searchAplctnSectnCd = $ ( "#searchAplctnSectnCd" ).val ();
                var searchAplctnStleCd = $ ( "#searchAplctnStleCd" ).val ();

                var searchKeyWord = 'searchPvIdList=' + searchPvIdList + '&searchFromDate=' + searchFromDate
                        + '&searchToDate=' + searchToDate + '&searchAplctnSectnCd=' + searchAplctnSectnCd
                        + '&searchAplctnStleCd=' + searchAplctnStleCd;

                location.href = contextPath + '/hom/servicemgt/workorder/list.do?' + searchKeyWord;
            } );

    //
    $ ( '#btnSubmit' ).click ( function ()
    {
        $ ( '#rstprtForm' ).submit ();
    } );

}

// 업무 형태 코드 조회
function selectAplctnStleCd ( aplctnSectnCd )
{
    var deferred = $.Deferred ();
    var $cmmnCdList = $ ( '#selAplctnStleCd' );

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectChildCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            parntsCdId : aplctnSectnCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var datas = json.data;

                if ( datas !== null && datas.length > 0 )
                {
                    $cmmnCdList.empty ();

                    _.each ( datas, function ( item )
                    {
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdKorNm + '</option>' );
                        } else
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdEngNm + '</option>' );
                        }
                    } );
                    $cmmnCdList.trigger ( 'change' );
                    deferred.resolve ();
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

    return deferred.promise ();
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 10;
    var liTpl = getTemplate ( templates.inputFileLi );
    var $addFile = $ ( '#add_file' );
    var disableFlag = false;
    var $selTypeFile = $ ( '.sel_type_file' );

    if ( !disableFlag )
    {
        $addFile.click ( function ()
        {
            var liCount = $ ( '.add_file_list li' ).size ();
            var $addFileList = $ ( '.add_file_list' );
            var $fileList = $ ( '.file_list li' );

            if ( liCount < fileCount - $fileList.size () )
            {
                liCount++;
                if ( liCount == fileCount - $fileList.size () )
                {
                    disableFlag = true;
                    $addFile.addClass ( 'dis' );
                }

                var template = _.template ( liTpl );
                var html = template ( {
                    fileNo : liCount,
                    selTypeHtml : $selTypeFile.html ()
                } );

                $addFileList.append ( html );

                fileCustomizeForm ();

                deleteFileInput ();
                checkFileSize ();
            } else
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validFileInputNumberDown,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }

        } );
    }
}

// 첨부파일 처리 하기
function checkFileSize ()
{
    var maxFileSize = 10 * 1024 * 1024;
    var flag = true;

    $ ( '.customizeFile' ).on ( 'change propertychange', function ()
    {
        var that = this;
        if ( maxFileSize < that.files[0].size )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validFileInputSizeDown,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        // 포함되는 확장자가 없는 경우
        if ( !homUtil.checkFileExtension ( that.files[0].name, homUtil.fileExtensionFormat.general ) )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validFileInputExtension,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

// 첨부파일 input 삭제
function deleteFileInput ()
{
    var $deleteFile = $ ( '.delete_file' );
    $deleteFile.unbind ( 'click' );
    $deleteFile.click ( function ()
    {
        var that = $ ( this );

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
                that.closest ( 'li' ).remove ();

                var $addFile = $ ( '#add_file' );
                $addFile.removeClass ( 'dis' );
            }
        } );
    } );

}

// 파일 제거
function deleteFile ()
{
    var tpl = getTemplate ( templates.labelError );
    var $btnFileDelete = $ ( '.btn_file_delete' );

    // $btnFileDelete.unbind ( 'click' );
    $btnFileDelete.click ( function ()
    {
        var $that = $ ( this );

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
                var $li = $that.closest ( 'li' );
                $.ajax ( {
                    url : $that.attr ( 'href' ),
                    type : 'GET',
                    dataType : 'json',
                    success : function ( json )
                    {
                        var $li = $that.closest ( 'li' );
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $li.remove ();
                            $li.find ( 'label' ).remove ();
                        } else if ( json.status === staticVariable.jsonStatusError )
                        {
                            $li.find ( 'label' ).remove ();

                            if ( tpl !== null )
                            {
                                var template = _.template ( tpl );
                                var html = template ( {
                                    id : 'file_delete',
                                    message : json.message,
                                    isLeft : false
                                } );
                                $li.append ( html );
                            }
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
        } );

        return false;
    } );
}

function templateChange ()
{
    itemCount = 0;

    var selVal;

    // 업무구분
    if ( aplctnSectnCd == null || aplctnSectnCd == '' )
    {
        selVal = $ ( '#selAplctnSectnCd' ).val ();
    } else
    {
        selVal = aplctnSectnCd;
    }

    var $selTypeFile = $ ( '#sampleArea' );
    var wchkTemplate;

    $ ( ".sel_work_order_box" ).remove ();

    switch ( selVal )
    {
        case 'WCHK01': // 점검
            wchkTemplate = getTemplate ( templates.chckRstprt );
            break;

        case 'WCHK09': // 보수
            wchkTemplate = getTemplate ( templates.brrercoRstprt );
            break;

        case 'WCHK12': // 정전
            wchkTemplate = getTemplate ( templates.iflccwRstprt );
            break;

        case 'WCHK13': // 사고
            wchkTemplate = getTemplate ( templates.acdntRstprt );
            break;
    }

    var template = _.template ( wchkTemplate );

    var acdntTyCdList = selectCmmnCdList ( 'CDK-COM-008' ); // 알람고장유형
    var docKndCdList = selectCmmnCdList ( 'CDK-COM-036' ); // 문서종류구분
    var chckTyCdList = selectCmmnCdList ( 'CDK-COM-078' ); // 점검유형결과
    var itemList = selectOpertPlanStdrItemMgtList ('TP01'); // 점검 항목 조회
    var itemListEss = selectOpertPlanStdrItemMgtList ('TP02'); // 점검 항목 조회

    // 작업계획 대상 설비 조회
    var compInfoList = null;
    var itemId = $ ( "input[name*='opertItemId']" ).val ();

    if ( itemId != "" )
    {
        compInfoList = selectEqmtInfoList ( itemId );
    }

    // 결과서 조회
    var rstprt = selectRstprt ();

    var html = template ( {
        method : method,
        acdntTyCdList : acdntTyCdList,
        docKndCdList : docKndCdList,
        chckTyCdList : chckTyCdList,
        compInfoList : compInfoList,
        rstprt : rstprt,
        // fileDetlInfoList : fileDetlInfoList,
        itemList : itemList,
        itemListEss : itemListEss,
        selectedbizTy : selectedbizTy
    } );

    $ ( '#sampleArea' ).html ( html );

    /*
     * $ ( ".item" ).each ( function () { var rows = $ ( ".item:contains('" + $ ( this ).text () + "')" ); if (
     * rows.length > 1 ) { rows.eq ( 0 ).attr ( "rowspan", rows.length ); rows.not ( ":eq(0)" ).remove (); } } );
     */

    // 점검항목 - 설비 병합
    $ ( '#tbl_chck' ).rowspan ( 0 );

    // 점검항목 - Component 병합
    $ ( '#tbl_chck' ).rowspan ( 1 );
    
    // 점검항목 - 설비 병합
    $ ( '#tbl_chckEss' ).rowspan ( 0 );

    // 점검항목 - Component 병합
    $ ( '#tbl_chckEss' ).rowspan ( 1 );

    eventInit ();
    
    if(selectedbizTy == 'BSN03')
    {
    	customTabAction();   	
    }	
}

//탭 액션
function customTabAction(){
    var tabLI = $('.tab_cont_box > .tab > li');

    tabLI.on('click', 'a', function (e) {
        var target = $(e.currentTarget);
        var li = target.parent();
        var idx = target.parent().index();
        var content = target.closest('ul').siblings('.tab_body').children('li');
        
        e.preventDefault();
        
        if (li.hasClass('disabled')) return;
        
        li.siblings().andSelf().removeClass('on');
        li.addClass('on');
        content.hide().eq(idx).show();
        
        // 점검항목 - 설비 병합
        $ ( '#tbl_chck' ).rowspan ( 0 );

        // 점검항목 - Component 병합
        $ ( '#tbl_chck' ).rowspan ( 1 );
        
        // 점검항목 - 설비 병합
        $ ( '#tbl_chckEss' ).rowspan ( 0 );

        // 점검항목 - Component 병합
        $ ( '#tbl_chckEss' ).rowspan ( 1 );
    });
}

// 결과서 조회
function selectRstprt ()
{
    var datas;

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectRstprt.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            pvId : pvId,
            aplctnStleCd : aplctnStleCd,
            opertPlanSeq : opertPlanSeq,
            aplctnSectnCd : aplctnSectnCd,
            bizTy : selectedbizTy
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

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

    return datas;
}

// 첨부파일 상세 조회
function selectFileDetlInfo ( fileMastrSeq )
{
    var datas;

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectFileDetlInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            fileMastrSeq : fileMastrSeq
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

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

    return datas;
}

// 공통코드 조회
function selectCmmnCdList ( clCd )
{
    var datas;

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            clCd : clCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

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

    return datas;
}

// 대상 설비 조회
function selectEqmtInfoList ( pParntsItemId )
{
    var datas;

    var deferred = $.Deferred ();
    var $cmmnCdList = $ ( '#selItem' );

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectEqmtInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            parntsItemId : pParntsItemId,
            pvId : pvId
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

                if ( (datas !== null && datas.length > 0) && pParntsItemId.length == 0 )
                {
                    $cmmnCdList.empty ();

                    _.each ( datas,
                            function ( item )
                            {
                                if ( lang == locale.korea || lang == locale.korean )
                                {
                                    $cmmnCdList.append ( '<option value="' + item.itemId + '">' + item.itemKorNm
                                            + '</option>' );
                                } else
                                {
                                    $cmmnCdList.append ( '<option value="' + item.itemId + '">' + item.itemEngNm
                                            + '</option>' );
                                }
                            } );

                    $cmmnCdList.trigger ( 'change' );
                    deferred.resolve ();
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

    return datas;

}

// 점검 항목 조회
function selectOpertPlanStdrItemMgtList (itemGubun)
{
    var aplctnStleCd = $ ( '#aplctnStleCd' ).val ();
    var datas;

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectOpertPlanStdrItemMgtList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            pvId : pvId,
            itemGubun : itemGubun,
            aplctnSectnCd : aplctnSectnCd,
            aplctnStleCd : aplctnStleCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

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

    return datas;

}


// 공통코드 조회
function selectCmmnCdList ( clCd )
{
    var datas;

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            clCd : clCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                datas = json.data;

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

    return datas;
}

// 정보 유효성 체크
function validateRegForm ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#rstprtForm' ).validate (
            {
                rules : {
                    // 점검
                    speNote : {
                        maxlength : 300
                    },
                    // 보수
                    hourrowDt : {
                        required : true,
                        date : true
                    },
                    trmnatDt : {
                        required : true,
                        date : true
                    },
                    lossqy : {
                        maxlength : 20,
                        number : true
                    },
                    chckBrrercoConts : {
                        maxlength : 300
                    },
                    rm : {
                        maxlength : 300
                    },
                    iflccwBeginDt : {
                        required : true,
                        date : true
                    },
                    iflccwTrmnatDt : {
                        required : true,
                        date : true
                    },
                    // 사고
                    frstConfmDt : {
                        required : true,
                        date : true
                    },
                    occrrncPrsmpDt : {
                        required : true,
                        date : true
                    }
                },
                messages : {
                    speNote : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeSpecialNote )
                    },
                    hourrowDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateInvalidEnforcementDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidEnforcementDate )
                    },
                    trmnatDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateInvalidTerminateDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidTerminateDate )
                    },
                    lossqy : {
                        number : makeValidateMessage ( i18nMessage.msg_validNumberLossKwh )
                    },
                    chckBrrercoConts : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeRepairInspectionContent )
                    },
                    rm : {
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeNote )
                    },
                    iflccwBeginDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateRequiredStart ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateRequiredStart )
                    },
                    iflccwTrmnatDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateRequiredEnd ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateRequiredEnd )
                    },
                    frstConfmDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateInvalidFirstConfirmationDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidFirstConfirmationDate )
                    },
                    occrrncPrsmpDt : {
                        required : makeValidateMessage ( i18nMessage.msg_validDateInvalidOccrrncPrsmpDate ),
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidOccrrncPrsmpDate )
                    }
                },
                submitHandler : function ( form )
                {

                    // 문서 파일 타입, file 선택여부
                    var $addFileList = $ ( '.add_file_list' );
                    var $addFileListLi = $ ( 'li', $addFileList );
                    var fileFlag = false;
                    _.each ( $addFileListLi, function ( li )
                    {
                        var $li = $ ( li );
                        var $selTypeFile = $li.find ( '.sel_type_file' );
                        var $customizeFile = $li.find ( '.customizeFile' );

                        if ( $selTypeFile.val () === '' && $customizeFile.val () !== '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFileKind,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        } else if ( $selTypeFile.val () !== '' && $customizeFile.val () === '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredAttachedFile,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );

                            fileFlag = true;
                            return true;
                        }
                    } );

                    if ( fileFlag )
                    {
                        return;
                    }

                    $.when (
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : method === staticVariable.methodInsert ? i18nMessage.msg_alertCreateConfirm
                                        : i18nMessage.msg_alertUpdateConfirm,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeConfirm
                            } ) ).then ( function ( confirm )
                    {
                        if ( confirm )
                        {
                            $ ( ".customize_select_ss" ).each ( function ( index )
                            {
                                $ ( this ).trigger ( "change", true );
                            } );

                            if ( aplctnSectnCd == "WCHK13" )
                            {

                                var selEqmtText = $ ( "#selEqmt option:selected" ).text ().trim ();
                                var selCompText = $ ( "#selComp option:selected" ).text ().trim ();

                                var acdntOccrrncSeq = "-1";
                                var acdntConts = selEqmtText + " " + selCompText;
                                var itemId = $ ( "#selComp option:selected" ).val ();
                                var occrrncDt = $ ( "#occrrncDt" ).val ();
                                var trmnatDt = $ ( "#trmnatDt" ).val ();
                                var defectTime = $ ( "#defectTime" ).val ();
                                var dvlpLossqy = $ ( "#dvlpLossqy" ).val ();
                                var rm = $ ( "#rm" ).val ();

                                $ ( "#hidAcdntOccrrncSeq" ).val ( acdntOccrrncSeq );
                                $ ( "#hidItemId" ).val ( itemId );
                                $ ( "#hidOccrrncDt" ).val ( occrrncDt );
                                $ ( "#hidTrmnatDt" ).val ( trmnatDt );
                                $ ( "#hidDefectTime" ).val ( defectTime );
                                $ ( "#hidAcdntConts" ).val ( acdntConts );
                                $ ( "#hidDvlpLossqy" ).val ( dvlpLossqy );
                                $ ( "#hidRm" ).val ( rm );

                            }

                            if ( aplctnSectnCd == "WCHK09" )
                            {
                                var formData = new FormData ( form );
                                $.ajax ( {
                                    url : contextPath + '/hom/servicemgt/workorder/brrercoForm.do?method=' + method,
                                    processData : false,
                                    contentType : false,
                                    data : formData,
                                    type : 'POST',
                                    success : applyAfter
                                } );

                            } else
                            {

                                $ ( '#rstprtForm' ).attr ( {
                                    action : contextPath + '/hom/servicemgt/workorder/form.do?method=' + method,
                                    method : 'post'
                                } );

                                form.submit ();
                            }
                        }
                    } );
                }
            } );
}

// 항목 추가
var itemCount = 0;

function addItem ()
{
    var $btnItemAdd = $ ( '#btnItemAdd' );
    var $tbAddItem = $ ( '#tbAddItem' );

    var params;

    $btnItemAdd.on ( 'click', function ()
    {
        if ( aplctnSectnCd == 'WCHK09' ) // 보수
        {
            $ ( '#rstprtForm' ).submit ();

        } else if ( aplctnSectnCd == 'WCHK13' ) // 사고
        {
            // var itemTrTpl = getTemplate ( templates.acdntRstprtTr );
            // var template = _.template ( itemTrTpl );

            // itemCount = itemCount + 1;

            var selEqmtText = $ ( "#selEqmt option:selected" ).text ().trim ();
            var selCompText = $ ( "#selComp option:selected" ).text ().trim ();
            var acdntConts = selEqmtText + " " + selCompText;

            params = {
                acdntOccrrncSeq : "-1",
                itemId : $ ( '#selComp' ).val (),
                acdntConts : acdntConts,
                occrrncDt : $ ( '#occrrncDt' ).val (),
                trmnatDt : $ ( '#trmnatDt' ).val (),
                defectTime : $ ( '#defectTime' ).val (),
                dvlpLossqy : $ ( '#dvlpLossqy' ).val (),
                rm : $ ( '#rm' ).val ()
            };

            acdntItemAdd ( params );

            removeItem ();
        }
    } );

}

// 항목 삭제
function removeItem ()
{
    var $delItem = $ ( '.del_item' );

    $delItem.unbind ( 'click' );
    $delItem.on ( 'click', function ()
    {
        var $that;

        if ( aplctnSectnCd == 'WCHK09' ) // 보수
        {
            $that = $ ( this ).closest ( 'table' );

            var brrercoRstSeq = $that.find ( '#brrercoRstSeq' ).val ();

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
                    $.ajax ( {
                        url : contextPath + '/hom/servicemgt/workorder/deleteBrrercoItem.do',
                        type : 'POST',
                        dataType : 'json',
                        data : {
                            brrercoRstSeq : brrercoRstSeq
                        },
                        async : false,
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                datas = json.data;

                                $that.remove ();

                                // item 순번 재정의
                                $ ( ".num_th" ).each ( function ( index )
                                {
                                    index = index + 1;
                                    $ ( this ).text ( index );
                                } );

                                itemCount = $ ( ".num_th" ).size ();

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
            } );
        } else if ( aplctnSectnCd == 'WCHK13' ) // 사고
        {
            $that = $ ( this ).closest ( 'tr' );

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
                    $that.remove ();

                    // item 순번 재정의
                    $ ( ".num_th" ).each ( function ( index )
                    {
                        index = index + 1;
                        $ ( this ).text ( index );
                    } );

                    itemCount = $ ( ".num_th" ).size ();
                }
            } );
        }
    } );
}

// 항목 초기화
function resetItem ()
{
    $ ( '#btnReset' ).trigger ( "click" );
}

// ajaxSubmit 전처리 함수
function applyBefore ( formData, jqForm, options )
{
    return true;
}

// // ajaxSubmit 후처리 함수
function applyAfter ( objResponse, statusText, xhr, $form )
{
    var json = objResponse;

    if ( json.status === staticVariable.jsonStatusSuccess )
    {
        data = json.data;

        console.log ( data );

        brrercoItemAdd ( data );

        // $ ( '#rstprtForm' ).clearForm ();
        $ ( '#btnReset' ).trigger ( "click" );

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
}

var brrercoItemAdd = function ( data )
{
    var $btnItemAdd = $ ( '#btnItemAdd' );
    var $tbAddItem = $ ( '#tbAddItem' );

    var itemTbTpl = getTemplate ( templates.brrercoRstprtTb );
    var template = _.template ( itemTbTpl );

    itemCount = itemCount + 1;

    var params = {
        itemCount : itemCount,
        brrercoRstSeq : data.brrercoRstSeq,
        hourrowDt : data.hourrowDt,
        trmnatDt : data.trmnatDt,
        lossqy : data.lossqy,
        itemId : data.itemId,
        itemKorNm : data.itemKorNm,
        itemEngNm : data.itemEngNm,
        chckmanEngNm : data.chckmanEngNm,
        chckmanKorNm : data.chckmanKorNm,
        brrercoRstCd : data.brrercoRstCd,
        brrercoRstKorNm : data.brrercoRstKorNm,
        brrercoRstEngNm : data.brrercoRstEngNm,
        chckBrrercoConts : data.chckBrrercoConts,
        fileDetlInfoVOList : data.fileDetlInfoVOList
    };

    var html = template ( params );
    $tbAddItem.append ( html );

    removeItem ();
    $ ( '#btnItemMgtInfoReset' ).trigger ( 'click' );

};

// 사고 유형 항목 추가
function acdntItemAdd ( data )
{
    var $btnItemAdd = $ ( '#btnItemAdd' );
    var $tbAddItem = $ ( '#tbAddItem' );

    var itemTrTpl = getTemplate ( templates.acdntRstprtTr );
    var template = _.template ( itemTrTpl );

    itemCount = itemCount + 1;

    var selEqmtText = $ ( "#selEqmt option:selected" ).text ().trim ();
    var selCompText = $ ( "#selComp option:selected" ).text ().trim ();
    var acdntConts = selEqmtText + " " + selCompText;

    // var params = {
    // itemId : $ ( '#selComp' ).val (),
    // acdntConts : acdntConts,
    // occrrncDt : $ ( '#occrrncDt' ).val (),
    // trmnatDt : $ ( '#trmnatDt' ).val (),
    // defectTime : $ ( '#defectTime' ).val (),
    // dvlpLossqy : $ ( '#dvlpLossqy' ).val (),
    // rm : $ ( '#rm' ).val ()
    // };

    var html = template ( data );
    $tbAddItem.append ( html );

    $ ( '#btnItemMgtInfoReset' ).trigger ( 'click' );
    removeItem ();

}

function eventInit ()
{
    $ ( '#selItem' ).trigger ( 'change' );

    addItem ();
    resetItem ();

    customizeForm ();
    customizeScroll ();

    initDatetimepicker ();
    // resetRegForm ();

}

$.fn.rowspan = function ( colIdx, isStats )
{
    return this.each ( function ()
    {
        var that;
        $ ( 'tr', this ).each (
                function ( row )
                {
                    $ ( 'td:eq(' + colIdx + ')', this ).filter ( ':visible' ).each (
                            function ( col )
                            {

                                if ( $ ( this ).html () == $ ( that ).html ()
                                        && (!isStats || isStats
                                                && $ ( this ).prev ().html () == $ ( that ).prev ().html ()) )
                                {
                                    rowspan = $ ( that ).attr ( "rowspan" ) || 1;
                                    rowspan = Number ( rowspan ) + 1;

                                    $ ( that ).attr ( "rowspan", rowspan );

                                    // do your action for the colspan cell here
                                    $ ( this ).hide ();

                                    // $(this).remove();
                                    // do your action for the old cell here

                                } else
                                {
                                    that = this;
                                }

                                // set the that if not already set
                                that = (that == null) ? this : that;
                            } );
                } );
    } );
};

$ ( function ()
{
    customizeForm ();
    customizeScroll ();

    initDatetimepicker ();
    resetRegForm ();

    templateChange ();
    setEvent ();
    // removeItem ();

    // 파일 관련
    checkFileSize ();
    addFileInput ();
    deleteFileInput ();
    deleteFile ();

    validateRegForm ();
    
} );

// form element customize
function popCustomizeForm ()
{
    // 업체명
    var $dateType1 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    // 국가,SPC 구분
    var $dateType1 = $ ( '#popNationId, #popSpcId, #popPvId,.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

function popInitDatetimepicker ()
{

    var $yyyy = $ ( '#divPopCopyWrapCreatReport .yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );

    var $yyyymm = $ ( '#divPopCopyWrapCreatReport .yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );

    var $yyyymmdd = $ ( '#divPopCopyWrapCreatReport .yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

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

    // // 조회기간
    var $date = $ ( '#divPopCopyWrapCreatReport .date' );
    var $dateType = $ ( '#divPopCopyWrapCreatReport #popRptCycleCd' );
    $dateType.on ( 'change', function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();
        if ( selectedType === 'RCT01' )
        {
            selectedType = homConstants.dateTypeYYYYMMDD
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === 'RCT02' )
        {
            selectedType = homConstants.dateTypeYYYYMMDD
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === 'RCT03' )
        {
            selectedType = homConstants.dateTypeYYYYMM
            className = staticVariable.formatYYYYMM;
        }
        $date.addClass ( 'dnone' );
        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedType, 2, false );
        var $dateBox = $ ( '#divPopCopyWrapCreatReport .' + className );
        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate );

        $dateBox.trigger ( 'changeDate' );

    } );

    // $ ( "#container .yyyymmdd" ).addClass ( 'dnone' );

    // $dateType.trigger ( 'change' );

}

function popSearchKpi ()
{
    var dateType = $ ( '#popRptCycleCd' ).val ();
    var className = null;

    paramPopRptMbySectn = $ ( ":selected", $ ( "#popRptMbySectn" ) ).val ();
    paramPopRptTyCd = $ ( ":selected", $ ( "#popRptTyCd" ) ).val ();
    paramPopSpcId = $ ( ":selected", $ ( "#popSpcId" ) ).val ();
    paramPopRptCycleCd = $ ( ":selected", $ ( "#popRptCycleCd" ) ).val ();
    paramPopPvId = $ ( ":selected", $ ( "#popPvId" ) ).val ();
    paramPopNationId = $ ( ":selected", $ ( "#popNationId" ) ).val ();
    paramPopRptMbyId = '';

    if ( dateType === 'RCT01' )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === 'RCT02' )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === 'RCT03' )
    {
        className = staticVariable.formatYYYYMM;
    }
    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    $ ( '#popStdrYm' ).val ( pureFromDate );

}

function popSpcChk ()
{

    var $rptMbySectn = $ ( '#popRptMbySectn' );
    paramPopRptMbySectn = $ ( ":selected", $ ( "#popRptMbySectn" ) ).val ();

    $rptMbySectn.on ( 'change', function ()
    {

        var selectedType = $ ( ":selected", this ).val ();
        if ( selectedType === 'RDT02' )
        {
            var $spcId = $ ( '#popSpcId' );
            $spcId.on ( 'change', function ()
            {
                var selectedType = $ ( ":selected", this ).val ();
                // alert ( selectedType );
                if ( selectedType === '' )
                {
                }

            } );
        }

    } );

}
// 사용자 정보 유효성 체크
function popUserValidate ()
{
    var tpl = getTemplate ( templates.labelError );
    $ ( '#popNationId' ).validate ( {
        rules : {
            spcId : {
                selectRequired : true
            },
            nationId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            }
        },
        messages : {

            nationId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredNation )
            }
        },
    } );
}

// SPC일때 발전소선택창 숨기기
function popSpcRptMbySectn ()
{
    $ ( '#popRptMbySectn' ).on ( 'change', function ( event )
    {
        if ( 'RDT02' == $ ( '#popRptMbySectn' ).val () )
        {
            $ ( "#spcHide01" ).hide ();
            $ ( "#spcHide02" ).hide ();
        } else
        {
            $ ( "#spcHide01" ).show ();
            $ ( "#spcHide02" ).show ();
        }

    } );
}

function popCustomForm ()
{

    var $rptMbySectn = $ ( '#popRptMbySectn' );
    var $rptTyCd = $ ( '#popRptTyCd' );
    var $spcId = $ ( '#popSpcId' );
    var $rptCycleCd = $ ( '#popRptCycleCd' );
    var $pvId = $ ( '#popPvId' );
    var $nationId = $ ( '#popNationId' );
    var $rptMbyId = '';

    paramPopRptMbySectn = $ ( ":selected", $ ( "#popRptMbySectn" ) ).val ();
    paramPopRptTyCd = $ ( ":selected", $ ( "#popRptTyCd" ) ).val ();
    paramPopSpcId = $ ( ":selected", $ ( "#popSpcId" ) ).val ();
    paramPopRptCycleCd = $ ( ":selected", $ ( "#popRptCycleCd" ) ).val ();
    paramPopPvId = $ ( ":selected", $ ( "#popPvId" ) ).val ();
    paramPopNationId = $ ( ":selected", $ ( "#popNationId" ) ).val ();
    paramPopRptMbyId = '';

    if ( 'RPT01' == paramPopRptTyCd )
    {
        $ ( "#popRptCycleCd" ).val ( 'RCT03' ).trigger ( 'change' );
        $ ( "#popRptCycleCd" ).attr ( 'disabled', 'disabled' );
    }

    $rptMbySectn.on ( 'change', function ()
    {
        paramPopRptMbySectn = $ ( ":selected", $ ( "#popRptMbySectn" ) ).val ();

    } );

    $rptTyCd.on ( 'change', function ()
    {
        paramPopRptTyCd = $ ( ":selected", $ ( "#popRptTyCd" ) ).val ();
        if ( 'RPT01' == paramPopRptTyCd )
        {
            $ ( "#popRptCycleCd" ).val ( 'RCT03' ).trigger ( 'change' );
            $ ( "#popRptCycleCd" ).attr ( 'disabled', 'disabled' );
        } else
        {
            $ ( "#popRptCycleCd" ).attr ( 'disabled', false );
        }
    } );

    $spcId.on ( 'change', function ()
    {
        paramPopSpcId = $ ( ":selected", $ ( "#popSpcId" ) ).val ();
    } );

    $rptCycleCd.on ( 'change', function ()
    {
        paramPopRptCycleCd = $ ( ":selected", $ ( "#popRptCycleCd" ) ).val ();
    } );

    var $btn_reg = $ ( '#btn_reg' );

    $btn_reg.on ( 'click', function ()
    {
        var bck = true;
        popSearchKpi ();
        if ( 'RPT01' == paramPopRptTyCd )
        {
            if ( 'RCT03' != paramPopRptCycleCd )
            {
                // $.customizeDialog ( {
                // template : templates.dialog,
                // message : i18nMessage.msg_alertSelectedMonthlyReport,
                // checkText : i18nMessage.msg_ok,
                // cancelText : i18nMessage.msg_cancel,
                // type : staticVariable.dialogTypeInfo
                // } );
                // bck = false;
                // $ ( '#all_reflct_popup' ).trigger ( 'click' );
                return false;
            }
        } else
        {
            ('RPT02' == paramPopRptTyCd)
        }
        {
            if ( 'RCT03' != paramPopRptCycleCd && 'RCT01' != paramPopRptCycleCd )
            {
                // $.customizeDialog ( {
                // template : templates.dialog,
                // message : i18nMessage.msg_alertSelectedDailyMonthlyReport,
                // checkText : i18nMessage.msg_ok,
                // cancelText : i18nMessage.msg_cancel,
                // type : staticVariable.dialogTypeInfo
                // } );
                // bck = false;
                return false;
            }
        }
        if ( bck == true )
        {
            $ ( "#popRptCycleCd" ).attr ( 'disabled', false );
            if ( 'RDT01' == paramPopRptMbySectn )
            {
                paramPopRptMbyId = paramPopPvId;
            } else if ( 'RDT02' == paramPopRptMbySectn )
            {
                paramPopRptMbyId = paramPopSpcId;
            }
            paramPopFromDate = $ ( '#popStdrYm' ).val ();

            var dateType = $ ( '#rptCycleCd' ).val ();
            var className = null;

            if ( dateType === 'RCT01' )
            {
                className = staticVariable.formatYYYYMMDD;
            } else if ( dateType === 'RCT02' )
            {
                className = staticVariable.formatYYYYMMDD;
            } else if ( dateType === 'RCT03' )
            {
                className = staticVariable.formatYYYYMM;
            }

            paramStdrYm = $ ( '#container #' + className + '_from_date' ).val ();
            paramStdrDt = $ ( '#container #' + className + '_to_date' ).val ();

            paramRptMbySectn = $ ( ":selected", $ ( '#rptMbySectn' ) ).val ();
            paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
            paramNationId = $ ( ":selected", $ ( '#nationId' ) ).val ();
            paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
            if ( typeof $ ( "#pvId" ) !== 'undefined' )
            {
                paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
            }
            paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();

            var varParamList = '&paramVarRptMbySectn=' + paramRptMbySectn + '&paramVarRptTyCd=' + paramRptTyCd
                    + '&paramVarNationId=' + paramNationId + '&paramVarSpcId=' + paramSpcId + '&paramVarRptCycleCd='
                    + paramRptCycleCd + '&paramVarPvId=' + paramPvId + '&paramVarStdrYm=' + paramStdrYm
                    + '&paramVarStdrDt=' + paramStdrDt;

            location.href = contextPath + '/hom/reportmgt/form.do?method=insert&rptMbyId=' + paramPopRptMbyId
                    + '&spcId=' + paramPopSpcId + '&nationId=' + paramPopNationId + '&pvId=' + paramPopPvId
                    + '&rptTyCd=' + paramPopRptTyCd + '&rptCycleCd=' + paramPopRptCycleCd + '&rptMbySectn='
                    + paramPopRptMbySectn + '&stdrYm=' + paramPopFromDate + '' + varParamList;
        }

    } );
}

// 국가별 발전소 정보 가져오기
function getPopNationPvInfo ()
{
    var $nationId = $ ( '#popNationId' );
    var $spcId = $ ( '#popSpcId' );
    var tpl = getTemplate ( templates.spcInfoSelect );

    $nationId.on ( 'change', function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/companyRepayFund/selectMainSpcInfoList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            spcInfoList : json.data
                        } );

                        $spcId.empty ().html ( html ).trigger ( 'change' );
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
    } );
}

// 국가법인별 발전소 정보 가져오기
function getPopNationSpcPvInfo ()
{
    var $nation = $ ( '#popNationId' );
    var $spcId = $ ( '#popSpcId' );
    var $pvId = $ ( '#popPvId' );
    var tpl = getTemplate ( templates.assetPvInfoSelect );

    $spcId.on ( 'change', function ( event )
    {

        var params = {
            nationId : $ ( ':selected', $ ( '#popNationId' ) ).val (),
            spcId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/reportmgt/selectMainPvInfoList.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            pvInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'change' );

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
    } );
}

function customFormat ( cellValue, options, rowdata, action )
{
    return homUtil.addNumberComma ( cellValue );
    // return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

$ ( function ()
{

    popCustomizeForm ();
    popInitDatetimepicker ();
    getPopNationPvInfo ();
    getPopNationSpcPvInfo ();
    popSpcChk ();
    popSearchKpi ();
    popUserValidate ();
    popCustomForm ();
    popSpcRptMbySectn ();

    $ ( '#popNationId' ).val ( acntNationId ).trigger ( 'change' );

    // $ ( '#popNationId' ).trigger ( 'change' );
    $ ( '#popRptTyCd' ).trigger ( 'click' );

} );
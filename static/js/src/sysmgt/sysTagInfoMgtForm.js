// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $reflctChk = $ ( '#reflctChk' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );

    // 셀렉트
    var $selType = $ ( '.sel_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 셀렉트
    var $selType = $ ( '.sel_type_sm' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $selType1 = $ ( '.sel_type_period, .sel_type_tag' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    // 검색 셀렉트
    var $select1 = $ ( '.select1' );
    $select1.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag = true;

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        if ( flag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag = false;
        }
    } );

    var $select2 = $ ( '.sel_physicl_table' );
    $select2.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag2 = true;

    // select event
    $select2.on ( 'select2:open', function ( e )
    {
        if ( flag2 )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag2 = false;
        }
    } );

    setParamtrNmSelect2 ();
}

function setParamtrNmSelect2 ()
{
    var $paramtrNm = $ ( '#paramtrNm' );
    $paramtrNm.select2 ( {
        language : language,
        enableMousewheel : false
    } );
    $paramtrNm.parent ().find ( '.select2' ).addClass ( 'mgl0' );

    var flag1 = true;

    // select event
    $paramtrNm.on ( 'select2:open', function ( e )
    {
        if ( flag1 )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag1 = false;
        }
    } );
}

function periodCustomizeForm ()
{
    // 셀렉트
    var $selType = $ ( '.sel_type_period' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    // 검색 셀렉트
    var $select1 = $ ( '.select1' );
    $select1.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var flag = true;

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        if ( flag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            flag = false;
        }
    } );
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhh' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:00',
        startView : 2,
        minView : 1,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmddhhmi' ).datetimepicker ( {
        format : 'yyyy-mm-dd hh:ii',
        startView : 2,
        minView : 0,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        minuteStep : 2,
        todayHighlight : true,
        todayBtn : true,
        minuteStep : 15
    } );

}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.op_cont' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.frm_con02 .frm_cont_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

// 태그 활용범위 선택시 그룹 설비를 가져옴
function getGrpEqmtList ( isKorean )
{
    var $tagPrcuseRng = $ ( '#tagPrcuseRng' );
    var $pvId = $ ( '#pvId' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );
    var $eqmtId = $ ( '#eqmtId' );
    var $eqmtGrpCd = $ ( '#eqmtGrpCd' );
    var $paramtrNm = $ ( '#paramtrNm' );
    var tpl = getTemplate ( templates.parntsEqmtSelect );
    var cmmnCdSelectTpl = getTemplate ( templates.cmmnCdSelect );
    var grpEqmtSelectTpl = getTemplate ( templates.grpEqmtSelect );
    var cmmnCdValSelectTpl = getTemplate ( templates.cmmnCdValSelect );

    // 추가
    var $infoTy = $ ( '#infoTy' );

    var $pvEqmtSelectParnts = $ ( '#pv_eqmt_select_parnts' );

    $tagPrcuseRng.on ( 'change',
            function ()
            {
                var tagPrcuseRng = $ ( ':selected', $ ( this ) ).val ();
                var pvId = $ ( ':selected', $pvId ).val ();

                if ( tagPrcuseRng !== '' )
                {
                    if ( pvId === '' )
                    {
                        // 발전소를 선택해주세요... alert
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        // 선택을 selected되도록 바꿈...
                        if ( tagPrcuseRng !== '' )
                        {
                            $ ( ':selected', $ ( this ) ).prop ( 'selected', false );
                        }
                    } else
                    {
                        var params = {
                            pvId : pvId
                        };

                        // 태그활용 범위가 그룹일 경우
                        if ( tagPrcuseRng === 'RNG02' )
                        {
                            $pvEqmtSelectParnts.removeClass ( 'inblock' );
                            $pvEqmtSelectParnts.hide ();
                            $ ( '#pv_eqmt_title' ).text ( i18nMessage.msg_equipment );

                            // 공통 코드 그룹 설비 리스트를 가져옴
                            $.ajax ( {
                                url : contextPath + '/hom/sysmgt/systag/selectEqmtGrpInfoCommonList.ajax',
                                type : 'POST',
                                data : params,
                                dataType : 'json',
                                success : function ( json )
                                {
                                    if ( json.status === staticVariable.jsonStatusSuccess )
                                    {
                                        if ( grpEqmtSelectTpl !== null )
                                        {
                                            _.each ( json.data, function ( data )
                                            {
                                                data.eqmtId += '0000';
                                            } );

                                            var template = _.template ( grpEqmtSelectTpl );
                                            var html = template ( {
                                                message : i18nMessage.msg_selection,
                                                isKorean : isKorean,
                                                eqmtList : json.data,
                                                useInSysTagForm : true
                                            } );

                                            $eqmtId.empty ().html ( html ).trigger ( 'change' );
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
                        // 그룹이 아닐경우
                        else
                        {
                            $pvEqmtSelectParnts.addClass ( 'inblock' );
                            $pvEqmtSelectParnts.show ();
                            $ ( '#pv_eqmt_title' ).text (
                                    i18nMessage.msg_parentEquipment + ' / ' + i18nMessage.msg_equipment );

                            $.ajax ( {
                                url : contextPath + '/hom/sysmgt/systag/selectParntsEqmtInfoList.ajax',
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
                                                message : i18nMessage.msg_selection,
                                                isKorean : isKorean,
                                                parntsEqmtInfoList : json.data
                                            } );

                                            $parntsEqmtId.empty ().html ( html ).trigger ( 'change' );
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

                        // 파라미터 명 셋팅
                        var params = {
                            eqmtGrpId : $ ( ':selected', $eqmtGrpCd ).val (),
                            tagPrcuseRng : tagPrcuseRng
                        };

                        $.ajax ( {
                            url : contextPath + '/hom/sysmgt/systag/selectParamtrInfoCommonList.ajax',
                            type : 'POST',
                            data : params,
                            dataType : 'json',
                            success : function ( json )
                            {
                                if ( json.status === staticVariable.jsonStatusSuccess )
                                {
                                    if ( cmmnCdValSelectTpl !== null )
                                    {
                                        var template = _.template ( cmmnCdValSelectTpl );
                                        var html = template ( {
                                            message : i18nMessage.msg_selection,
                                            isKorean : isKorean,
                                            cmmnCdList : json.data
                                        } );

                                        $paramtrNm.empty ().html ( html ).trigger ( 'change' );
                                        setParamtrNmSelect2 ();
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
                }
            } );

    $infoTy.on ( 'change',
            function ()
            {
                var infoTy = $ ( ':selected', $ ( this ) ).val ();
                var pvId = $ ( ':selected', $pvId ).val ();

                if ( tagPrcuseRng !== '' )
                {
                    if ( pvId === '' )
                    {
                        // 발전소를 선택해주세요... alert
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        // 선택을 selected되도록 바꿈...
                        if ( infoTy !== '' )
                        {
                            $ ( ':selected', $ ( this ) ).prop ( 'selected', false );
                        }
                    } else
                    {
                        var params = {
                            pvId : pvId
                        };

                        // 정보활용유형이 ESS일 경우
                        if ( infoTy === 'TP02' )
                        {
                            // infoTy_select
                            $ ( '#tagPrcuseRng' ).attr ( 'disabled', true ).val ( "RNG01" ).trigger ( 'change' );

                            $pvEqmtSelectParnts.removeClass ( 'inblock' );
                            $pvEqmtSelectParnts.hide ();
                            $ ( '#pv_eqmt_title' ).text ( i18nMessage.msg_equipment );

                            // 공통 코드 그룹 설비 리스트를 가져옴
                            $.ajax ( {
                                url : contextPath + '/hom/sysmgt/systag/selectEssEqmtInfoCommonList.ajax',
                                type : 'POST',
                                data : params,
                                dataType : 'json',
                                success : function ( json )
                                {
                                    if ( json.status === staticVariable.jsonStatusSuccess )
                                    {
                                        if ( grpEqmtSelectTpl !== null )
                                        {
                                            /*
                                             * _.each ( json.data, function ( data ) { data.eqmtId += '0000'; } );
                                             */
                                            var template = _.template ( grpEqmtSelectTpl );
                                            var html = template ( {
                                                message : i18nMessage.msg_selection,
                                                isKorean : isKorean,
                                                eqmtList : json.data,
                                                useInSysTagForm : true
                                            } );

                                            $eqmtId.empty ().html ( html );

                                            // $eqmtId.empty ().html ( html ).trigger ( 'change' );
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
                        // ESS가 아닐경우
                        else
                        {
                            $ ( '#tagPrcuseRng' ).attr ( 'disabled', false ).val ( "RNG01" ).trigger ( 'change' );

                            $pvEqmtSelectParnts.addClass ( 'inblock' );
                            $pvEqmtSelectParnts.show ();
                            $ ( '#pv_eqmt_title' ).text (
                                    i18nMessage.msg_parentEquipment + ' / ' + i18nMessage.msg_equipment );

                            $.ajax ( {
                                url : contextPath + '/hom/sysmgt/systag/selectParntsEqmtInfoList.ajax',
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
                                                message : i18nMessage.msg_selection,
                                                isKorean : isKorean,
                                                parntsEqmtInfoList : json.data
                                            } );

                                            $parntsEqmtId.empty ().html ( html ).trigger ( 'change' );
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
                    }
                }
            } );
}

// 로컬 타임을 가져와서 반영 시작일을 셋팅한다.
function getPvLocaleTime ()
{
    var $pvId = $ ( '#pvId' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );

    $pvId.on ( 'change', function ()
    {
        var params = {
            pvId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectPvUTC.ajax',
            type : 'POST',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    var pureFormat = homUtil.convertDateStringToPureFormat ( json.data );
                    var minute = parseInt ( pureFormat.substring ( 10, 12 ), 10 );
                    var intReflctBeginDt = null;

                    if ( minute > 45 )
                    {
                        intReflctBeginDt = (parseInt ( pureFormat.substring ( 0, 10 ), 10 ) + 1).toString () + '00';
                    }
                    // 정상 케이스
                    else
                    {
                        var addMinute = 15 - (parseInt ( pureFormat.substring ( 10, 12 ), 10 ) % 15);
                        intReflctBeginDt = parseInt ( pureFormat, 10 ) + addMinute;
                    }

                    var reflctBeginDt = homUtil.convertDateStringToFormat ( intReflctBeginDt.toString (),
                            homUtil.dateFormat.formatYYYYMMDDHHMM );
                    $ ( '#reflctBeginDt' ).val ( reflctBeginDt );
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

// 그룹설비의 설비나 부모설비의 설비들을 가져옴
function getEqmtList ( isKorean )
{
    var $tagPrcuseRng = $ ( '#tagPrcuseRng' );
    var $pvId = $ ( '#pvId' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );
    var $eqmtId = $ ( '#eqmtId' );
    var tpl = getTemplate ( templates.eqmtSelect );

    $parntsEqmtId.on ( 'change', function ()
    {
        var pvId = $ ( ':selected', $pvId ).val ();
        var parntsEqmtId = $ ( ':selected', $ ( this ) ).val ();
        var tagPrcuseRng = $ ( ':selected', $tagPrcuseRng ).val ();

        if ( pvId !== '' && parntsEqmtId !== '' )
        {
            if ( tagPrcuseRng === '' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validDataRequiredTagPracticalRange,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else if ( tagPrcuseRng === 'RNG02' )
            {
            } else
            {
                var params = {
                    pvId : pvId,
                    parntsEqmtId : parntsEqmtId
                };

                if ( params.pvId !== '' && params.parntsEqmtId !== '' )
                {
                    $.ajax ( {
                        url : contextPath + '/hom/sysmgt/systag/selectEqmtInfoList.ajax',
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
                                        message : i18nMessage.msg_selection,
                                        isKorean : isKorean,
                                        eqmtInfoList : json.data
                                    } );

                                    $eqmtId.empty ().html ( html ).trigger ( 'change' );
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
            }
        }
    } );
}

// 설비를 선택했을때 태그활용 범위가 그룹이 아니고 부모 설비를 선택하지않으면 alert을 발생시킨다.
function checkEqmtId ()
{
    var $tagPrcuseRng = $ ( '#tagPrcuseRng' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );
    var $eqmtId = $ ( '#eqmtId' );

    $eqmtId.on ( 'change', function ()
    {
        var tagPrcuseRngSelect = $ ( ':selected', $tagPrcuseRng ).val ();
        var parntsEqmtIdSelect = $ ( ':selected', $parntsEqmtId ).val ();

        var infoTy = $ ( ':selected', '#infoTy' ).val ();

        // if ( tagPrcuseRngSelect !== '' && tagPrcuseRngSelect !== 'RNG02' && parntsEqmtIdSelect === '' )
        if ( tagPrcuseRngSelect !== '' && tagPrcuseRngSelect !== 'RNG02' && parntsEqmtIdSelect === ''
                && infoTy !== 'TP02' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDataRequiredParentEquipment,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 실행주기 및 물리 테이블 대상 추가 버튼 클릭
function btnPeriodTableAdd ()
{
    var addCount = 5;
    var $btnPeriodTableAdd = $ ( '.btn_period_table_add' );
    var divTpl = getTemplate ( templates.periodTableDiv );
    var disableFlag = false;
    var $selTypePeriod = $ ( '.sel_type_period' );
    var $selPhysiclTable = $ ( '.sel_physicl_table' );

    if ( !disableFlag )
    {
        $btnPeriodTableAdd.click ( function ()
        {
            var $periodTable = $ ( '#period_table' );
            var divCount = $ ( '#period_table .period_table_list' ).size ();

            if ( divCount >= addCount )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertCanNotAdd,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else
            {
                divCount++;
                if ( divCount === addCount )
                {
                    disableFlag = true;
                    $btnPeriodTableAdd.addClass ( 'dis' );
                }

                var template = _.template ( divTpl );
                var html = template ( {
                    message : i18nMessage.msg_selection,
                    selTypePeriodHtml : $selTypePeriod.html (),
                    selPhysiclTable : $selPhysiclTable.html ()
                } );

                $periodTable.append ( html );

                btnPeriodTableRemove ();
                periodCustomizeForm ();
            }
        } );
    }
}

// 실행주기 및 물리 테이블 대상 삭제 버튼 클릭
function btnPeriodTableRemove ()
{
    var $btnPeriodTableRemove = $ ( '.btn_period_table_remove' );
    $btnPeriodTableRemove.unbind ( 'click' );
    $btnPeriodTableRemove.click ( function ()
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
                that.closest ( '.period_table_list' ).remove ();

                var $btnPeriodTableAdd = $ ( '.btn_period_table_add' );
                $btnPeriodTableAdd.removeClass ( 'dis' );
            }
        } );
    } );
}

// 태그 아이디 생성
function createTagId ()
{
    var $btnCreateTagId = $ ( '#btn_create_tag_id' )
    var $tagPrcuseRng = $ ( '#tagPrcuseRng' );
    var $pvId = $ ( '#pvId' );
    var $parntsEqmtId = $ ( '#parntsEqmtId' );
    var $eqmtId = $ ( '#eqmtId' );
    var $paramtrNm = $ ( '#paramtrNm' );
    var $reflctChk = $ ( '#reflctChk' );
    var $infoTy = $ ( '#infoTy' );
    var checkFlag = false;

    $btnCreateTagId.on ( 'click', function ()
    {
        var pvIdSelect = $ ( ':selected', $pvId ).val ();
        var tagPrcuseRngSelect = $ ( ':selected', $tagPrcuseRng ).val ();
        var parntsEqmtIdSelect = $ ( ':selected', $parntsEqmtId ).val ();
        var eqmtIdSelect = $ ( ':selected', $eqmtId ).val ();
        var paramtrNmSelect = $ ( ':selected', $paramtrNm ).val ();
        var infoTySelect = $ ( ':selected', $infoTy ).val ();

        var tagId = '';

        if ( pvIdSelect === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else if ( paramtrNmSelect === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_validDataRequiredParameterName,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            if ( tagPrcuseRngSelect === '' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validDataRequiredTagPracticalRange,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
            // 태그 활용범위를 그룹로 선택했을 경우
            else if ( tagPrcuseRngSelect === 'RNG02' )
            {
                if ( eqmtIdSelect === '' )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validDataRequiredEquipment,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else
                {
                    tagId = pvIdSelect + '#GRP0000_' + eqmtIdSelect;
                    checkFlag = true;
                }
            }
            // 태그 활용범위를 개별, 공용으로 선택했을 경우
            else
            {
                if ( parntsEqmtIdSelect === '' && infoTySelect !== 'TP02' )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validDataRequiredParentEquipment,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else
                {
                    tagId = pvIdSelect + '#' + parntsEqmtIdSelect;
                    // 태그 활용범위 개별
                    if ( tagPrcuseRngSelect === 'RNG01' )
                    {
                        if ( eqmtIdSelect === '' )
                        {
                            $.customizeDialog ( {
                                template : templates.dialog,
                                message : i18nMessage.msg_validDataRequiredEquipment,
                                checkText : i18nMessage.msg_ok,
                                cancelText : i18nMessage.msg_cancel,
                                type : staticVariable.dialogTypeInfo
                            } );
                        } else
                        {
                            if ( infoTySelect !== 'TP02' )
                            {
                                tagId += '_' + eqmtIdSelect;
                            } else
                            {
                                tagId += eqmtIdSelect;
                            }
                            checkFlag = true;
                        }
                    }
                    // 태그 활용범위 공용
                    else
                    {
                        tagId += '_COM0001';
                        checkFlag = true;
                    }
                }
            }

            if ( checkFlag )
            {
                tagId += '_S_';
                var originTagId = tagId;
                var tagSeq = '001';
                tagId += tagSeq + '_' + paramtrNmSelect;

                // 태그 아이디 중복확인 후 태그ID 셋팅
                // tagId = 'PV001#ACB0001_IVT0001_S_001_TAE';
                var params = {
                    tagId : tagId,
                    infoTy : $ ( '#infoTy' ).val ()
                };

                $.ajax ( {
                    url : contextPath + '/hom/sysmgt/systag/selectNoDplctTagId.ajax',
                    type : 'POST',
                    data : params,
                    dataType : 'json',
                    success : function ( json )
                    {
                        if ( json.status === staticVariable.jsonStatusSuccess )
                        {
                            $ ( '#tag_id_text' ).text ( json.data );
                            $ ( '#tagId' ).val ( json.data );
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
        }
    } );
}

// 즉시반영 처리
function checkImmediatelyReflct ()
{
    var $reflctChk = $ ( '#reflctChk' );
    var $reflctBeginDt = $ ( '#reflctBeginDt' );
    var $reflctTrmnatDt = $ ( '#reflctTrmnatDt' );
    var $yyyymmddhhmi = $ ( '.yyyymmddhhmi' );

    $reflctChk.on ( 'click', function ()
    {
        var isChecked = $ ( this ).prop ( 'checked' );
        // 체크 되었을 경우
        if ( isChecked )
        {
            $yyyymmddhhmi.datetimepicker ( 'remove' );
            $reflctBeginDt.prop ( 'disabled', true );
            $reflctTrmnatDt.prop ( 'disabled', true );
            $reflctBeginDt.val ( '' );
            $reflctTrmnatDt.val ( '' );
        }
        // 체크 되지 않았을 경우
        else
        {
            $yyyymmddhhmi.datetimepicker ( {
                format : 'yyyy-mm-dd hh:ii',
                startView : 2,
                minView : 0,
                language : language,
                pickerPosition : "bottom-right",
                autoclose : true,
                minuteStep : 2,
                todayHighlight : true,
                todayBtn : true,
                minuteStep : 15
            } );
            $reflctBeginDt.prop ( 'disabled', false );
            $reflctTrmnatDt.prop ( 'disabled', false );
        }
    } );
}

// 조건식 유형
function cndfrmlaSelect ()
{
    var $cndfrmlaTyCd = $ ( '#cndfrmlaTyCd' );
    var cndfrmlaTyCd = $ ( '#cndfrmlaTyCd option:selected' ).val ();
    showHideFmDiv ( cndfrmlaTyCd );

    $cndfrmlaTyCd.on ( 'change', function ()
    {
        var cndfrmlaTyCdSelect = $ ( ':selected', $ ( this ) ).val ();
        showHideFmDiv ( cndfrmlaTyCdSelect );
    } );
}

function showHideFmDiv ( cndfrmlaTyCdSelect )
{
    var $fm01Div = $ ( '#fm01_div' );
    var $fm02Div = $ ( '#fm02_div' );
    var $fm03Div = $ ( '#fm03_div' );
    var $fm01Cnd = $ ( '#fm01_cnd' );
    switch ( cndfrmlaTyCdSelect )
    {
        case 'FM01':
            $fm01Div.removeClass ( 'dnone' );
            $fm01Cnd.removeClass ( 'dnone' );
            $fm02Div.addClass ( 'dnone' );
            $fm03Div.addClass ( 'dnone' );
            break;
        case 'FM02':
            $fm01Div.addClass ( 'dnone' );
            $fm01Cnd.addClass ( 'dnone' );
            $fm02Div.removeClass ( 'dnone' );
            $fm03Div.addClass ( 'dnone' );
            break;
        case 'FM03':
            $fm01Div.addClass ( 'dnone' );
            $fm01Cnd.addClass ( 'dnone' );
            $fm02Div.addClass ( 'dnone' );
            $fm03Div.removeClass ( 'dnone' );
    }
}

// 부모 태그 단위 선택시 태그단위를 가져옴..
function getTagUnit ( isKorean )
{
    var $parntsTagUnit = $ ( '#parntsTagUnit' );
    var $tagUnit = $ ( '#tagUnit' );
    var cmmnCdSelectTpl = getTemplate ( templates.cmmnCdSelect );

    $parntsTagUnit.on ( 'change', function ()
    {
        var parntsTagUnit = $ ( ':selected', $ ( this ) ).val ();

        if ( parntsTagUnit !== '' )
        {
            var params = {
                parntsTagUnit : parntsTagUnit
            };

            $.ajax ( {
                url : contextPath + '/hom/sysmgt/systag/selectTagUnitInfoList.ajax',
                type : 'POST',
                data : params,
                dataType : 'json',
                success : function ( json )
                {
                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {
                        if ( cmmnCdSelectTpl !== null )
                        {
                            var template = _.template ( cmmnCdSelectTpl );
                            var html = template ( {
                                message : i18nMessage.msg_selection,
                                isKorean : isKorean,
                                cmmnCdList : json.data
                            } );

                            $tagUnit.empty ().html ( html ).trigger ( 'change' );
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
    } );
}

// 사용자 정보 유효성 체크
function sysTagValidate ()
{
    $ ( '#sysTagInfoMgtForm' ).validate (
            {
                errorPlacement : function ( error, element )
                {
                    var id = element.attr ( 'id' );
                    if ( id === 'tagTy' || id === 'scaleSeq' || id === 'tagKorNm' || id === 'tagEngNm'
                            || id === 'tagUnit' || id === 'tagAttrb' || id === 'paramtrType' || id === 'reflctBeginDt'
                            || id === 'reflctTrmnatDt' )
                    {
                        error.addClass ( 'mgl0' );
                    }
                    error.insertAfter ( element );
                },
                rules : {
                    pvId : {
                        required : true
                    },
                    tagPrcuseRng : {
                        required : true
                    },
                    tagId : {
                        required : true
                    },
                    tagTy : {
                        required : true
                    },
                    tagKorNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 100
                    },
                    tagEngNm : {
                        required : {
                            depends : function ()
                            {
                                $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                                return true;
                            }
                        },
                        maxlength : 100
                    },
                    paramtrType : {
                        required : true
                    },
                    paramtrNm : {
                        required : true
                    },
                    reflctBeginDt : {
                        date : true
                    },
                    reflctTrmnatDt : {
                        date : true
                    },
                    cndfrmlaTyCd : {
                        required : true
                    },
                    cndfrmla : {
                        required : true
                    }
                },
                messages : {
                    pvId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredElectricPowerStation )
                    },
                    tagPrcuseRng : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagPracticalRange )
                    },
                    tagId : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagId )
                    },
                    tagTy : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagType )
                    },
                    tagKorNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagKoreanName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagKoreanName )
                    },
                    tagEngNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredTagEnglishName ),
                        maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagEnglishName )
                    },
                    paramtrType : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParameterType )
                    },
                    paramtrNm : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredParameterName )
                    },
                    reflctBeginDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidReflectionBeginDate )
                    },
                    reflctTrmnatDt : {
                        date : makeValidateMessage ( i18nMessage.msg_validDateInvalidReflectionTerminateDate )
                    },
                    cndfrmlaTyCd : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredConditionFormulaType )
                    },
                    cndfrmla : {
                        required : makeValidateMessage ( i18nMessage.msg_validRequiredCndfrm )
                    }
                },
                submitHandler : function ( form )
                {
                    // 조건식 파라미터나 대상 태그, 수식 셋팅
                    var cndfrmlaTyCd = $ ( '#cndfrmlaTyCd' ).val ();
                    var $trgetTagIds = $ ( '#trgetTagIds' );
                    var $paramtrIds = $ ( '#paramtrIds' );
                    var $formlDetlSeqs = $ ( '#formlDetlSeqs' );
                    var $formlDetlTr = $ ( '#forml_detl_table tbody tr' );
                    var $cndfrmla = $ ( '#cndfrmla' );
                    var $formlaMastrSelect = $ ( '#formla_mastr_select' );
                    var flag = false;
                    switch ( cndfrmlaTyCd )
                    {
                        case 'FM01':
                            tagTargetTagList = _.uniq ( tagTargetTagList );
                            $trgetTagIds.val ( tagTargetTagList.toString () );
                            $formlDetlSeqs.val ( '' );
                            $paramtrIds.val ( '' );
                            $formlaMastrSelect.val ( '' );
                            flag = true;
                            break;
                        case 'FM02':
                            var $sqlCombineCndfrmla = $ ( '#sql_combine_cndfrmla' );
                            if ( $sqlCombineCndfrmla.val () !== $cndfrmla.val () )
                            {
                                $cndfrmla.val ( $sqlCombineCndfrmla.val () );
                                var cndfrmlaArr = $sqlCombineCndfrmla.val ().split ( ' ' );
                                sqlParamtrList = [];
                                _.each ( cndfrmlaArr, function ( item )
                                {
                                    if ( item.startsWith ( ':' ) )
                                    {
                                        sqlParamtrList.push ( item.replace ( /:/g, '' ) );
                                    }
                                } );
                            }

                            sqlParamtrList = _.uniq ( sqlParamtrList );
                            $paramtrIds.val ( sqlParamtrList.toString () );
                            $trgetTagIds.val ( '' );
                            $formlDetlSeqs.val ( '' );
                            $formlaMastrSelect.val ( '' );
                            flag = true;
                            break;
                        case 'FM03':
                            var formlDetlSeq = [];
                            var formlaTargetTagList = [];

                            var formlaMastrSelect = $ ( ':selected', $formlaMastrSelect ).val ();
                            if ( formlaMastrSelect === '' )
                            {
                                flag = false;
                                $.customizeDialog ( {
                                    template : templates.dialog,
                                    message : i18nMessage.msg_validDataRequiredFormula,
                                    checkText : i18nMessage.msg_ok,
                                    cancelText : i18nMessage.msg_cancel,
                                    type : staticVariable.dialogTypeInfo
                                } );

                                break;
                            }

                            $formlDetlTr.each ( function ()
                            {
                                flag = false;
                                var $that = $ ( this );
                                var targetTag = $ ( ':selected', $that.find ( '.target_tag_select' ) ).val ();

                                if ( targetTag === '' )
                                {
                                    return false;
                                } else
                                {
                                    flag = true;
                                }
                                formlDetlSeq.push ( $that.data ( 'forml-detl-seq' ) );
                                formlaTargetTagList.push ( targetTag );
                            } );

                            if ( flag )
                            {
                                $trgetTagIds.val ( formlaTargetTagList.toString () );
                                $formlDetlSeqs.val ( formlDetlSeq.toString () );
                                $paramtrIds.val ( '' );
                                $cndfrmla.val ( '' );
                            }
                    }

                    if ( !flag )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_validDataRequiredTargetTag,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );

                        return;
                    }

                    // 반영 예정일 중복 체크
                    if ( !$ ( '#reflctChk' ).prop ( 'checked' ) && isDuplicatedReflctDate () )
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_alertDuplicateItemReflectionBeginDate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
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
                            $ ( "#tagPrcuseRng" ).removeAttr ( "disabled", "disabled" );

                            form.submit ();
                        }
                    } );
                }

            } );
}

function isDuplicatedReflctDate ()
{
    var flag = false;
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/isDuplicatedReflctDate.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            tagId : $ ( '#tagId' ).val (),
            reflctBeginDt : $ ( '#reflctBeginDt' ).val ()
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                flag = json.data;
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

    return flag;
}

// 시스템 태그 정보 초기화(등록 화면)
function sysTagInitialization ()
{
    if ( method === staticVariable.methodInsert )
    {
        $ ( '#btn_reset' )
                .click (
                        function ()
                        {
                            $ ( 'form' ).each ( function ()
                            {
                                this.reset ();
                                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
                            } );

                            $ (
                                    '.customize_radio, #reflctChk, .sel_type, .sel_type_sm, .sel_type_period, .sel_type_tag, $paramtrType' )
                                    .trigger ( 'change' );
                            $ ( '.select1, .sel_physicl_table, #paramtrNm' ).trigger ( 'change.select2' );
                            $ ( '#tag_id_text' ).empty ();
                            $ ( 'label.error' ).remove ();
                        } );
    }
}

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }
    initDatetimepicker ();
    cndfrmlaSelect ();
    customizeForm ();
    customizeScroll ();
    getPvLocaleTime ();
    getEqmtList ( isKorean );
    getGrpEqmtList ( isKorean );
    btnPeriodTableAdd ();
    btnPeriodTableRemove ();
    createTagId ();
    checkImmediatelyReflct ();
    checkEqmtId ();
    getTagUnit ( isKorean );
    sysTagValidate ();
    sysTagInitialization ();
} );
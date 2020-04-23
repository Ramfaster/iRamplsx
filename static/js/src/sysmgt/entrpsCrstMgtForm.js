// form element customize
function customizeForm ()
{
    $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 셀렉트
    var $selType = $ ( '#sel_type, #sel_type1, #sel_type2' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $selType1 = $ ( '#sel_type3' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    var $selType = $ ( '.customize_select' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType1 = $ ( '.sel_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
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

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 담당자 아이디 가져오기
function getChargerId ( $frmItemListTable, $textChargerId )
{
    var chargerIdArray = [];
    _.each ( $frmItemListTable, function ( li )
    {
        chargerIdArray.push ( $ ( li ).data ( 'charger-id' ) );
    } );

    var params = {
        chargerIds : chargerIdArray.toString ()
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/entrps/selectChargerId.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                $textChargerId.val ( json.data );
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

// 담당자 추가
function addChargerInfo ()
{
    var $btnChargerAdd = $ ( '#btnItemAdd' );
    var $txtChargerId = $ ( '#txtChargerId' );
    var $txtChargerNm = $ ( '#txtChargerNm' );
    var $txtChargerEmail = $ ( '#txtChargerEmail' );
    var $txtChargerPhone = $ ( '#txtChargerPhone' );
    var $listNumber = $ ( '#listNumber' );
    var tableTpl = getTemplate ( templates.corprChargerInfoTable );
    var wrapTpl = getTemplate ( templates.corprChargerInfoWrap );
    var $roorItemTable = $ ( '#frm_con02' );
    $btnChargerAdd.click ( function ()
    {
        var $selChargerCntIntCd = $ ( '#charger_cntint_cd option:selected' );
        var $selChargerNationId = $ ( '#charger_nation_id option:selected' );

        if ( $txtChargerNm.val () !== '' && $selChargerCntIntCd.val () !== '' && $selChargerNationId.val () !== '' )
        {
            var $tableListWrap = $ ( '.tbl_add_wrap' );
            var $frmItemList = null;
            var $frmItemListLi = null;
            var listNumber = 1;
            var addFlag = false;
            var checkFlag = false;

            $frmItemList = $ ( '.tbl_add_wrap' );
            $frmItemListTable = $ ( 'table', $frmItemList );

            if ( $frmItemListTable.size () !== 0 )
            {
                listNumber = parseInt ( $frmItemListTable.last ().data ( 'list-number' ), 10 ) + 1;
            } else
            {
                $frmItemInit = $ ( "#mCSB_1_container" );
                if ( tableTpl !== null )
                {
                    getChargerId ( $frmItemListTable, $txtChargerId );

                    var template = _.template ( tableTpl );
                    var html = template ( {
                        listNumber : 0,
                        msg_corprChargerId : i18nMessage.msg_corprChargerId,
                        msg_corprChargername : i18nMessage.msg_corprChargername,
                        msg_email : i18nMessage.msg_email,
                        msg_phoneNumber : i18nMessage.msg_phoneNumber,
                        msg_nation : i18nMessage.msg_belong + " " + i18nMessage.msg_nation,
                        checkFlag : checkFlag,
                        chargerId : $txtChargerId.val (),
                        chargerNm : $txtChargerNm.val (),
                        cntintCd : $selChargerCntIntCd.val (),
                        cntintNm : $selChargerCntIntCd.text (),
                        nationId : $selChargerNationId.val (),
                        nationNm : $selChargerNationId.text (),
                        chargerEmail : $txtChargerEmail.val (),
                        chargerCp : $txtChargerPhone.val (),
                        chargerUpdate : "I"
                    } );

                    $frmItemInit.html ( html );
                    resetItemForm ();
                    return;
                }
            }

            if ( $listNumber.val () == -1 )
            {
                getChargerId ( $frmItemListTable, $txtChargerId );

                _.each ( $frmItemListTable, function ( li )
                {
                    if ( $ ( li ).data ( 'charger-id' ) == $txtChargerId.val () )
                    {
                        addFlag = true;
                        return true;
                    }
                } );

                // 이미 등록되어 있는 경우 처리
                if ( addFlag )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_chargerExists,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                } else
                {
                    if ( tableTpl !== null )
                    {
                        var template = _.template ( tableTpl );
                        var html = template ( {
                            listNumber : listNumber,
                            msg_corprChargerId : i18nMessage.msg_corprChargerId,
                            msg_corprChargername : i18nMessage.msg_corprChargername,
                            msg_email : i18nMessage.msg_email,
                            msg_phoneNumber : i18nMessage.msg_phoneNumber,
                            msg_nation : i18nMessage.msg_belong + " " + i18nMessage.msg_nation,
                            checkFlag : checkFlag,
                            chargerId : $txtChargerId.val (),
                            chargerNm : $txtChargerNm.val (),
                            cntintCd : $selChargerCntIntCd.val (),
                            cntintNm : $selChargerCntIntCd.text (),
                            nationId : $selChargerNationId.val (),
                            nationNm : $selChargerNationId.text (),
                            chargerEmail : $txtChargerEmail.val (),
                            chargerCp : $txtChargerPhone.val (),
                            chargerUpdate : "I"
                        } );

                        $frmItemListTable.parent ().append ( html );
                        resetItemForm ();
                    }
                }
            } else
            {
                if ( tableTpl !== null )
                {
                    var $locationLi = null;

                    _.each ( $frmItemListTable, function ( li )
                    {
                        if ( $ ( li ).data ( 'charger-id' ) == $txtChargerId.val () )
                        {
                            $locationLi = $ ( li );

                            return;
                        }
                    } );

                    if ( $locationLi != null )
                    {
                        var $inputUpdateFlag = $locationLi.find ( 'input.chargerUpdates' );
                        var updateFlag = "";
                        if ( $inputUpdateFlag.val () == 'N' || $inputUpdateFlag.val () == 'U' )
                        {
                            updateFlag = "U";
                        } else
                        {
                            updateFlag = "I";
                        }

                        var template = _.template ( tableTpl );
                        var html = template ( {
                            listNumber : $listNumber.val (),
                            msg_corprChargerId : i18nMessage.msg_corprChargerId,
                            msg_corprChargername : i18nMessage.msg_corprChargername,
                            msg_email : i18nMessage.msg_email,
                            msg_phoneNumber : i18nMessage.msg_phoneNumber,
                            msg_nation : i18nMessage.msg_belong + " " + i18nMessage.msg_nation,
                            checkFlag : checkFlag,
                            chargerId : $txtChargerId.val (),
                            chargerNm : $txtChargerNm.val (),
                            cntintCd : $selChargerCntIntCd.val (),
                            cntintNm : $selChargerCntIntCd.text (),
                            nationId : $selChargerNationId.val (),
                            nationNm : $selChargerNationId.text (),
                            chargerEmail : $txtChargerEmail.val (),
                            chargerCp : $txtChargerPhone.val (),
                            chargerUpdate : updateFlag
                        } );

                        $locationLi.after ( html );
                        $locationLi.remove ();

                        // 폼 초기화
                        resetItemForm ();
                    }

                    // $locationLi.append ( html );
                }
            }

            $ ( '#chargerIds-error, #chargerNms-error, #chargerEmails-error, #chargerCps-error' ).remove ();
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_noSelectedNewCharger,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// 담당자 수정
function updateChargerInfo ()
{
    $ ( document ).on ( 'click', '.btn_write', function ()
    {
        var itemInfo = null; // 초기화
        itemInfo = $ ( this ).data ();

        var chargerId = itemInfo.chargerId;
        var chargerNm = itemInfo.chargerName;
        var cntintCd = itemInfo.chargerCntintcd;
        var nationId = itemInfo.chargerNationid;
        var chargerEmail = itemInfo.chargerEmail;
        var chargerCp = itemInfo.chargerCps;
        var chargerNum = itemInfo.chargerNumber;

        $ ( '#txtChargerId' ).attr ( 'readonly', 'true' );

        $ ( '#txtChargerId' ).val ( chargerId );
        $ ( '#txtChargerNm' ).val ( chargerNm );
        $ ( '#txtChargerEmail' ).val ( chargerEmail );
        $ ( '#txtChargerPhone' ).val ( chargerCp );
        $ ( '#listNumber' ).val ( chargerNum );

        $ ( '#charger_cntint_cd' ).val ( cntintCd );
        $ ( '#charger_cntint_cd' ).trigger ( 'change' );

        $ ( '#charger_nation_id' ).val ( nationId );
        $ ( '#charger_nation_id' ).trigger ( 'change' );

        $ ( '#spnItemAdd' ).text ( i18nMessage.msg_update );
    } );
}

// 담당자 삭제
function deleteChargerInfo ()
{
    $ ( document ).on ( 'click', '.del_item', function ()
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
                var $inputUpdateFlag = that.closest ( 'table' ).find ( 'input.chargerUpdates' );
                if ( $inputUpdateFlag.val () == 'N' || $inputUpdateFlag.val () == 'U' )
                {
                    $inputUpdateFlag.val ( "D" );
                    that.closest ( 'table' ).hide ();
                } else if ( $inputUpdateFlag.val () == 'I' )
                {
                    that.closest ( 'table' ).remove ();
                }
            }
        } );
    } );
}

// 업체 정보 유효성 체크
function corprValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#corprForm' ).validate ( {
        rules : {
            corprId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 5,
                minlength : 5
            },
            sectnCd : {
                selectRequired : true
            },
            corprKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            corprEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            }
        },
        messages : {
            corprId : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredCorprId ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthCorprId ),
                minlength : makeValidateMessage ( i18nMessage.msg_validMaxWdLengthCorprId )
            },
            sectnCd : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredCorprSectn )
            },
            corprKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredCorprKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeCorprKoreanName )
            },
            corprEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredCorprEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagCorprlishName )
            }
        },
        submitHandler : function ( form )
        {
            // 중복 체크 여부
            if ( !existCorprId && $ ( '#duplication_flag' ).val () !== 'Y' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertIdDuplicate,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );

                return;
            }

            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existCorprId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    form.submit ();
                }
            } );
        }
    } );
}

// 담당자 입력 폼 초기화
function resetItemBtn ()
{
    $ ( '#btnItemReset' ).click ( function ()
    {
        resetItemForm ();
    } );
}

// 폼 초기화
function resetItemForm ()
{
    // 폼 초기화
    $ ( '#txtChargerId' ).val ( "" );
    $ ( '#txtChargerNm' ).val ( "" );
    $ ( '#charger_cntint_cd' ).val ( "" );
    $ ( '#charger_cntint_cd' ).trigger ( 'change' );
    $ ( '#charger_nation_id' ).val ( "" );
    $ ( '#charger_nation_id' ).trigger ( 'change' );
    $ ( '#txtChargerEmail' ).val ( "" );
    $ ( '#txtChargerPhone' ).val ( "" );
    $ ( '#listNumber' ).val ( -1 );
    $ ( '#txtChargerId' ).removeAttr ( 'readonly' );

    $ ( '#spnItemAdd' ).text ( i18nMessage.msg_add );
}

// 업체 정보 초기화(등록 화면)
function corprInfoInitialization ()
{
    if ( !existCorprId )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            resetItemForm ();

            $ ( '.customize_select' ).trigger ( 'change' );
            $ ( '.select1' ).trigger ( 'change.select2' );
            $ ( '.tbl_add_wrap' ).find ( 'table' ).remove ();
            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
            $ ( '#duplication_flag' ).val ( homConstants.checkN );
        } );
    }
}

// 협력 업체 국가 정보 가져오기
function getCorprNationInfo ()
{
    var $cntint = $ ( '#charger_cntint_cd' );
    var $nation = $ ( '#charger_nation_id' );
    var $corprCharger = $ ( '#corpr_charger' );
    var tpl = getTemplate ( templates.nationInfoSelect );

    $cntint.change ( function ( event )
    {
        var $selectedCntint = $ ( ':selected', $ ( this ) );
        if ( $selectedCntint.val () !== '' )
        {
            getNationInfoMethod ( tpl, $nation, $selectedCntint.val (), $cntint.is ( ':disabled' ), $corprCharger );
        }
    } );
}

// 대륙별 국가 정보 가져오기 공통 메소드
function getNationInfoMethod ( tpl, $nation, cntintCd, isDisabled, $corprCharger )
{
    var params = {
        cntintCd : cntintCd
    };

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/elcpwstn/selectNationInfoList.ajax',
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
                        message : i18nMessage.msg_selection,
                        nationInfoList : json.data
                    } );

                    $nation.empty ().html ( html ).trigger ( 'change' );

                    if ( isDisabled !== undefined && isDisabled )
                    {
                        var $select = $ ( ':selected', $corprCharger );
                        var nationId = $select.data ( 'charger-nation-id' );
                        $nation.attr ( 'disabled', 'disabled' ).val ( nationId ).trigger ( 'change' );
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

// 아이디 중복 체크
function checkDuplicationId ()
{
    var tpl = getTemplate ( contextPath + '/template/common/labelError.html' );

    $ ( '#corprId' ).blur ( function ()
    {
        var that = $ ( this );
        var $idCheck = $ ( '.id_check' );
        var $duplicationFlag = $ ( '#duplication_flag' );

        $.ajax ( {
            url : contextPath + '/hom/sysmgt/entrps/selectDuplicationId.ajax',
            type : 'POST',
            data : {
                corprId : that.val ()
            },
            dataType : 'json',
            success : function ( json )
            {
                var $td = $ ( '#corprId' ).closest ( 'td' );

                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.removeClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkY );

                } else if ( json.status === staticVariable.jsonStatusError )
                {
                    $td.find ( 'label' ).remove ();
                    $idCheck.addClass ( 'dnone' );
                    $duplicationFlag.val ( homConstants.checkN );

                    if ( tpl !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            id : 'corprId',
                            message : json.message,
                            isLeft : false
                        } );

                        $td.append ( html );
                    }
                }
            },
            error : function ( xhr, textStatus, error )
            {
                if ( xhr.status === staticVariable.statusUnapproved )
                {
                    location.href = contextPath + '/login.do?session=true';
                } else
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertServerError,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : 'info'
                    } );
                }
            }
        } );
    } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    addChargerInfo ();
    updateChargerInfo ();
    deleteChargerInfo ();
    resetItemBtn ();
    corprInfoInitialization ();
    getCorprNationInfo ();
    checkDuplicationId ();
    corprValidate ();
} );
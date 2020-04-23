// form element customize
function customizeForm ()
{
    if ( staticVariable.methodInsert == paramMethod )
    {
        var $dateType = $ ( '#spcId, #pvId' ).customizeSelect ( {
            width : 370,
            paddingHorizontal : 15,
            height : 30,
            color : '#3c3c3c',
            initClass : 'custom-form-select09',
            focusClass : 'custom-form-focused09',
            disableClass : 'custom-form-disabled09'
        } );

        var $dateType = $ ( '#insrncEntrpsCd, #bfrhdNtcnCd' ).customizeSelect ( {
            width : 150,
            paddingHorizontal : 15,
            height : 30,
            color : '#3c3c3c',
            initClass : 'custom-form-select05',
            focusClass : 'custom-form-focused05',
            disableClass : 'custom-form-disabled05'
        } );
    } else
    {
        var $dateType = $ ( '#bfrhdNtcnCd' ).customizeSelect ( {
            width : 150,
            paddingHorizontal : 15,
            height : 30,
            color : '#3c3c3c',
            initClass : 'custom-form-select05',
            focusClass : 'custom-form-focused05',
            disableClass : 'custom-form-disabled05'
        } );
    }
    var $searchType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    $ ( '.files' ).customizeFile ( {
        buttonType : 'bg_sprite',
        buttonText : i18nMessage.msg_find,
        buttonSpriteClass : 'btn_type05',
        buttonTextColor : '#4c4743',
        buttonWidth : 50,
        textWidth : 280,
        height : 25
    } );

    $ ( '.sel_type_file' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
        initClass : 'custom-form-select07'
    } );

}

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
    $ ( '.mscrd' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 250
    } );
}

function showPopup ()
{

    if ( typeof $ ( "#btn_insu_hist_popup" ) !== 'undefined' )
    {
        var btnPopup = $ ( "#btn_insu_hist_popup" );
        // btnPopup.attr('href','');
        btnPopup.magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll',
            closeOnContentClick : false,
            closeOnBgClick : false
        } );

        $ ( "#btn_insu_hist_popup" ).on (
                'click',
                function ()
                {
                    if ( staticVariable.methodUpdate == paramMethod )
                    {
                        $ ( "#btn_insu_hist_popup" ).attr (
                                'href',
                                $ ( "#btn_insu_hist_popup" ).attr () + '?spcId=' + $ ( "#spcId" ).val () + '&pvId='
                                        + $ ( "#pvId" ).val () + '&insrncEntrpsCd=' + $ ( "#insrncEntrpsCd" ).val () );
                    }
                } );
    }

}

function checkBtns ()
{
    if ( staticVariable.methodInsert == paramMethod )
    {
        $ ( "#spcId" ).on (
                'change',
                function ()
                {
                    $ ( "#pvId" ).empty ().html ( "<option value=''>" + i18nMessage.msg_selection + "</option>" )
                            .trigger ( 'change' );

                    reloadPvStdrInfo ();
                } );
        $ ( "#pvId" ).on ( 'change', function ()
        {
            reloadFcltyCpcty ();
            reloadPvCorprEntrpsInfo ();
        } );
        $ ( "#insrncEntrpsCd" ).on ( 'change', function ()
        {
            reloadFirstSbscrbInfo ();
        } );

        $ ( "#btn_reset" ).on ( 'click', reloadFirstSbscrbInfo );

    }
    $ ( "#btn_list" ).on (
            'click',
            function ()
            {
                location.href = $ ( this ).attr ( 'href' ) + '?nationId=' + paramNationId + '&spcId=' + paramSpcId
                        + '&pvId=' + paramPvId + '&stdryear=' + paramStdryear + '&searchKey=' + paramSearchKey
                        + '&searchKeyword=' + paramSearchKeyword;
                return false;
            } );

}

function reloadFcltyCpcty ()
{
    $ ( "#fcltyCpcty" ).val ( '0' );

    var params = {
        pvId : $ ( ':selected', $ ( "#pvId" ) ).val ()
    };
    if ( $ ( ':selected', $ ( "#pvId" ) ).val () != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/asset/plantInsurance/selectPvFcltyCpctyInfo.ajax',
            type : 'GET',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( Object.keys ( json.data ).length > 0 )
                    {
                        $ ( "#fcltyCpcty" ).val ( homUtil.mathFloorComma ( json.data[0].fcltyCpcty ) );
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

function reloadPvStdrInfo ()
{

    var tpl = getTemplate ( templates.pvStdrInfoSelect );

    var params = {
        spcId : $ ( ':selected', $ ( "#spcId" ) ).val ()
    };

    if ( $ ( ':selected', $ ( "#spcId" ) ).val () != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/asset/plantInsurance/selectPvStdrInfo.ajax',
            type : 'GET',
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
                            pvStdrInfoList : json.data
                        } );

                        $ ( "#pvId" ).empty ().html ( html ).trigger ( 'change' );
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

function reloadPvCorprEntrpsInfo ()
{
    $ ( "#insrncEntrpsCd" ).empty ().html ( "<option value=''>" + i18nMessage.msg_selection + "</option>" ).trigger (
            'change' );
    ;
    var tpl = getTemplate ( templates.assetCorprInfoSelect );

    var params = {
        spcId : $ ( ':selected', $ ( "#spcId" ) ).val (),
        pvId : $ ( ':selected', $ ( "#pvId" ) ).val ()
    };
    if ( $ ( ':selected', $ ( "#pvId" ) ).val () != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/asset/plantInsurance/selectPvCorprEntrpsInfo.ajax',
            type : 'GET',
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
                            corprInfoList : json.data
                        } );

                        $ ( "#insrncEntrpsCd" ).empty ().html ( html ).trigger ( 'change' );

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

function reloadFirstSbscrbInfo ()
{
    $ ( "#divFirstSbscrbInfo" ).empty ().trigger ( 'create' );

    var tpl = getTemplate ( templates.assetFirstInsuranceCrst );

    var params = {
        spcId : $ ( ':selected', $ ( "#spcId" ) ).val (),
        pvId : $ ( ':selected', $ ( "#pvId" ) ).val (),
        insrncEntrpsCd : $ ( ':selected', $ ( "#insrncEntrpsCd" ) ).val (),
        method : paramMethod
    };

    if ( $ ( ':selected', $ ( "#insrncEntrpsCd" ) ).val () != '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/asset/plantInsurance/selectFirstSbscrbInfo.ajax',
            type : 'GET',
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    var vfrstcrscnt = Object.keys ( json.data ).length;
                    if ( vfrstcrscnt == 0 )
                    {
                        // 발전소에 등록된 보험 항목이 없음
                        var template = _.template ( getTemplate ( templates.noData ) );
                        var html = template ( {
                            message : i18nMessage.msg_sentenceAssetMandaytoryNoData,
                        } );

                        $ ( "#divFirstSbscrbInfo" ).empty ().html ( html ).trigger ( 'create' );
                        customizeScroll ();
                        $.when ( $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_sentenceAssetPvNoRegisterInsurerCantCreate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeConfirm
                        } ) ).then ( function ( confirm )
                        {
                            if ( confirm )
                            {
                                top.location.href = contextPath + '/hom/asset/plantCostItem/list.do';
                                return false;
                            }
                        } );

                    } else
                    {
                        if ( tpl !== null )
                        {
                            var frstListSize = json.data[0].isExistData;
                            // alert ( frstListSize );

                            var template = _.template ( tpl );
                            var html = template ( {
                                lang : lang,
                                locale : locale,
                                msg_selection : i18nMessage.msg_selection,
                                method : paramMethod,
                                msg_division : i18nMessage.msg_division,
                                msg_unit : i18nMessage.msg_unit,
                                msg_amount : i18nMessage.msg_amount,
                                frstListSize : frstListSize,
                                homUtil : homUtil,
                                frstSbInfoList : json.data
                            } );

                            $ ( "#divFirstSbscrbInfo" ).empty ().html ( html ).trigger ( 'create' );
                            customizeScroll ();
                            if ( staticVariable.methodInsert == paramMethod )
                            {
                                if ( frstListSize != 0 )
                                {
                                    var template = _.template ( getTemplate ( templates.noData ) );
                                    var html = template ( {
                                        message : i18nMessage.msg_sentenceAssetMandaytoryNoData,
                                    } );
                                    $ ( "#divFirstSbscrbInfo" ).empty ().html ( html ).trigger ( 'create' );
                                    $.when ( $.customizeDialog ( {
                                        template : templates.dialog,
                                        message : i18nMessage.msg_sentenceAssetPvNoRegisterInsurerCantUpdate,
                                        checkText : i18nMessage.msg_ok,
                                        cancelText : i18nMessage.msg_cancel,
                                        type : staticVariable.dialogTypeConfirm
                                    } ) ).then (
                                            function ( confirm )
                                            {
                                                if ( confirm )
                                                {
                                                    top.location.href = contextPath
                                                            + '/hom/asset/plantInsurance/view.do?insrncEntrpsCd='
                                                            + $ ( ':selected', $ ( "#insrncEntrpsCd" ) ).val ()
                                                            + '&pvId=' + $ ( ':selected', $ ( "#pvId" ) ).val ()
                                                            + '&spcId=' + $ ( ':selected', $ ( "#spcId" ) ).val ();
                                                    return false;
                                                }
                                            } );
                                }
                            }
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
                customizeScroll ();
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

function itemValidate ()
{
    var tpl = getTemplate ( templates.labelError );
    var vvalrules = null;
    if ( staticVariable.methodInsert == paramMethod )
    {
        vvalrules = {
            spcId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( ':selected', $ ( this ) ).val () ) );

                        return true;
                    }
                }
            },
            pvId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            },
            insrncEntrpsCd : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            },
            frstSbscrbDtDate : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            }
        };
    }
    if ( staticVariable.methodUpdate == paramMethod )
    {
        vvalrules = {
            spcId : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            },
            frstSbInfo : {
                number : true
            },
            newfrstSbInfo : {
                number : true
            },
            frstSbscrbDtDate : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                }
            }
        };
    }

    $ ( '#insuranceForm' ).validate ( {
        rules : vvalrules,
        messages : {
            spcId : {
                required : makeValidateMessage ( i18nMessage.msg_validSelectRequiredSpcName )
            },
            pvId : {
                required : makeValidateMessage ( i18nMessage.msg_validSelectRequiredPvName )
            },
            insrncEntrpsCd : {
                required : makeValidateMessage ( i18nMessage.msg_validSelectRequiredInsurerName )
            },
            frstSbInfo : {
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            newfrstSbInfo : {
                number : makeValidateMessage ( i18nMessage.msg_alertOnlyNumber )
            },
            frstSbscrbDtDate : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredMenuKoreanName )
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

            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existItemId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    // tbl_frstInsuTplData
                    var vhidvar = '';
                    $ ( "#insuranceForm input[id='frstSbInfo']" ).each ( function ()
                    {
                        vhidvar = vhidvar + ';' + $ ( this ).data ( 'ids' );
                        // + ','+ $ ( this ).val ().replace ( /,/g, '' );

                    } );
                    if ( vhidvar != '' )
                    {
                        vhidvar = vhidvar.substr ( 1 );
                    }
                    $ ( "#hiddenVars" ).val ( vhidvar );

                    if ( vhidvar == '' )
                    {
                        $.when ( $.customizeDialog ( {
                            template : templates.dialog,
                            message : i18nMessage.msg_sentenceAssetPvNoRegisterInsurerCantCreate,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeConfirm
                        } ) ).then ( function ( confirm )
                        {
                            if ( confirm )
                            {
                                top.location.href = contextPath + '/hom/asset/plantCostItem/list.do';
                                return false;
                            }
                        } );
                    } else
                    {
                        if ( staticVariable.methodUpdate == paramMethod )
                        {

                            if ( $ ( "#btn_item_new_add" ).is ( ':visible' ) )
                            {
                                newFrsbAddYn = false;
                            }

                            if ( $ ( "#btn_item_minus" ).is ( ':visible' ) )
                            {
                                newFrsbAddYn = true;
                            }

                            if ( newFrsbAddYn == true )
                            {
                                vhidvar = '';
                                $ ( "#insuranceForm input[id='newfrstSbInfo']" ).each ( function ()
                                {
                                    vhidvar = vhidvar + ';' + $ ( this ).data ( 'ids' );
                                    // + ','+ $ ( this ).val ().replace ( /,/g, '' );

                                } );
                                if ( vhidvar != '' )
                                {
                                    vhidvar = vhidvar.substr ( 1 );
                                }
                                $ ( "#hiddenVarsNew" ).val ( vhidvar );
                            }
                        }
                        if ( staticVariable.methodInsert == paramMethod )
                        {
                            $ ( "#fcltyCpcty" ).val ( $ ( "#fcltyCpcty" ).val ().replace ( /\,/g, '' ) );
                        }
                        form.submit ();
                    }
                }
            } );
        }
    } );
}

function updateCheckLogic ()
{
    if ( staticVariable.methodUpdate == paramMethod )
    {
        // newFrsbAddYn = true;
        // $ ( "#spcId" ).disable ();
        // $ ( "#spcId" ).trigger ( 'change' );
        $ ( "#div_li_item_new_add" ).hide ();
        // $ ( "#div_li_item_new_add" ).disable ();

        $ ( "#btn_item_new_add" ).on ( 'click', function ()
        {
            if ( newFrsbAddYn == true )
            {
                $ ( "#div_li_item_new_add" ).show ();
                $ ( ".add_item .icon_add" ).attr ( 'class', 'icon_remove' );
                $ ( "#btn_item_new_add" ).attr ( 'id', 'btn_item_minus' );
                newFrsbAddYn = false;
            } else
            {
                $ ( "#div_li_item_new_add" ).hide ();
                $ ( ".add_item .icon_remove" ).attr ( 'class', 'icon_add' );
                $ ( "#btn_item_minus" ).attr ( 'id', 'btn_item_new_add' );
                newFrsbAddYn = true;
            }
        } );

    }
}

// 첨부파일 input 추가
function addFileInput ()
{
    var fileCount = 5;
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

                customizeForm ();
                customizeScroll ();

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
                message : homUtil.fileExtensionFormat.general + i18nMessage.msg_validDataRequiredAttachedFileKind,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            flag = false;
        }

        return flag;
    } );
}

function dataInitialization ()
{
    $ ( '.icon_delete' ).click ( function ()
    {
        $ ( "#div_li_item_new_add" ).find ( 'input[type=text], textarea, select' ).val ( '0.0' );
    } );
}

function setInputBoxFormat ()
{
    var $numType = $ ( '.num_type' );
    $numType.on ( 'blur', function ()
    {
        var $that = $ ( this );
        var data = $that.val ();

        if ( $.isNumeric ( data ) )
        {
            data = homUtil.mathFloorComma ( data, staticVariable.decimalPoint );
            $that.val ( data );
        } else
        {
            $that.val ( homUtil.mathFloorComma ( 0, staticVariable.decimalPoint ) );
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

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    showPopup ();
    checkBtns ();
    itemValidate ();
    updateCheckLogic ();
    addFileInput ();
    deleteFileInput ();
    deleteFile ();
    dataInitialization ();

    setInputBoxFormat ();
} );
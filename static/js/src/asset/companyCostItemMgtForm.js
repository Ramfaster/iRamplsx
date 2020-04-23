// form element customize
function customizeForm ()
{
    $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 사용자 정보
    var $selType = $ ( '#unitTyCd' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
    } );

    var $customizeSelect2 = $ ( '.customize_select2' ).select2 ( {
        language : language,
        enableMousewheel : false
    } );

    var initFlag = true;
    $customizeSelect2.on ( 'select2:open', function ( e )
    {
        if ( initFlag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            initFlag = false;
        }
    } );
}

// 메뉴 정보 초기화(등록 화면)
function itemInitialization ()
{
    if ( !existItemId )
    {
        $ ( '#btn_reset' ).on ( 'click', function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
            $ ( '.customize_radio' ).trigger ( 'change' );
        } );
    }
}

// 유효성 체크
function itemValidate ()
{
    var tpl = getTemplate ( templates.labelError );
    var $parntsItemCd = $ ( '#parntsItemCd' );

    $ ( '#assetForm' ).validate ( {
        rules : {
            itemKorNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            itemEngNm : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },

            itemDesc : {
                maxlength : 300
            }
        },
        messages : {
            itemKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredMenuKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeMenuKoreanName )
            },
            itemEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredMenuEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeMenuEnglishName )
            },
            itemDesc : {
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeDescription )
            }
        },
        submitHandler : function ( form )
        {
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
                    form.submit ();
                }
            } );
        }
    } );
}

function reloadJqgrid ( treeNode )
{
    // dummy
}
function customizeJqgrid ()
{
    // dummy
}

function checkBtnLinks ()
{
    var $btnList = $ ( '#btn_list' );

    if ( typeof $btnList != 'undefined' )
    {
        $btnList.on ( 'click', function ()
        {
            if ( staticVariable.methodUpdate == paramMethod )
            {
                location.href = $ ( this ).attr ( 'href' ) + '&itemId=' + paramParntsItemCd + '' + '&searchKey='
                        + paramSearchKey + '&searchKeyword=' + paramSearchKeyword;
            } else
            {
                location.href = $ ( this ).attr ( 'href' ) + '&itemId=' + paramItemId + '' + '&searchKey='
                        + paramSearchKey + '&searchKeyword=' + paramSearchKeyword;
            }
            return false;
        } );
    }
    // location.href = $ ( this ).attr ( 'href' ) + '&spcId=' + paramSpcId + '&parntsItemId=' + paramItemId;
}

$ ( function ()
{
    customizeForm ();
    customizeTree ();
    itemInitialization ();
    itemValidate ();
    showAllAssetCopyPopup ();
    checkBtnLinks ();
    // if ( typeof $ ( "#all_asset_copy_popup" ) !== 'undefined' )
    // {
    // $ ( "#all_asset_copy_popup" ).on ( 'click', showAllAssetCopyPopup );
    // }
} );
// form element customize
function customizeForm ()
{
    // 업체명
    var $dateType1 = $ ( '#sel_type0' ).customizeSelect ( {
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
    $ ( '.mail_template' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// set contents
function getMailTemplate ()
{
    // TODO 나중에 메일템플릿 용 템플릿이 바뀌는 것에 따라 적용하기
    // 데이터 없음 템플릿
    var tpl = getTemplate ( templates.mailTmplatPreview );
    var $selType = $ ( "#sel_type0" );
    $selType.change ( function ( event )
    {
        var mailTmplatSeq = $ ( ":selected", this ).val ();
        console.log ( mailTmplatSeq );
        if ( mailTmplatSeq != "" )
        {
            $.ajax ( {
                url : contextPath + '/hom/sysmgt/scheduler/getMailTemplate.ajax',
                type : 'post',
                data : {
                    mailTmplatSeq : mailTmplatSeq
                },
                async : false,
                success : function ( data )
                {
                    if ( tpl !== null && data != null )
                    {
                        var template = _.template ( tpl );
                        html = template ( {
                            sbjt : data.sbjt,
                            conts : data.conts,
                            atchFileComposition : data.atchFileComposition
                        } );
                        $ ( '.mail_template' ).html ( html );
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

function selectMailTemplate ()
{
    var $btnReg = $ ( "#btn_regPopup" );
    var $selType = $ ( "#sel_type0" );
    $btnReg.click ( function ()
    {
        var mailTmplatSeq = $ ( ":selected", $selType ).val ();
        var mailTmplatNm = $ ( ":selected", $selType ).text ();
        if ( mailTmplatSeq != "" )
        {
            $ ( "#mailTmplatSeq" ).val ( mailTmplatSeq );
            $ ( "#mailTmplatNm" ).val ( mailTmplatNm );
            $ ( "#mailtemplatePopup" ).attr (
                    "href",
                    contextPath + "/hom/sysmgt/scheduler/batchSchdulMgtFormPopupMailTemp.do?mailTmplatSeq="
                            + mailTmplatSeq );

            $ ( "#btn_closePopup" ).click ();
        } else
        {
            alert ( i18nMessage.msg_noSelectedCharger );
            return;
        }

    } );
}

$ ( function ()
{
    customizeForm ();
    customizeScroll ();
    getMailTemplate ();
    selectMailTemplate ();
    $ ( '#sel_type0' ).trigger ( 'change' );
} );
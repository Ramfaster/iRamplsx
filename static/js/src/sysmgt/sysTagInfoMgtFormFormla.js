//초기에 불러온 타겟 태그 리스트
var targetTagList;

// 검색 셀렉트
function customizeSelect2Tag ( isLoad )
{
    var selectIds = [];

    var $select1 = $ ( '.target_tag_select' );
    $select1.select2 ( {
        language : language,
        enableMousewheel : false
    } );

    // select event
    $select1.on ( 'select2:open', function ( e )
    {
        var initFlag = false;
        var thisId = $ ( this ).attr ( 'id' );
        $.each ( selectIds, function ( i, id )
        {
            if ( id == thisId )
            {
                initFlag = true;

                return false;
            }
        } );

        if ( !initFlag )
        {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );

            selectIds.push ( thisId );
        }
    } );
}

// 수식 마스터 정보 가져오기
function getFormlMastrInfoList ( isKorean )
{
    var $formlaMastrSelect = $ ( '#formla_mastr_select' );
    var $formlDetlTable = $ ( '#forml_detl_table tbody' );

    var tpl = getTemplate ( templates.formlMastrSelect );
    var formlDetlTrTpl = getTemplate ( templates.formlDetlTr );

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/selectFormlMastrInfoList.ajax',
        type : 'POST',
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
                        formlaMastrList : json.data,
                        formlMastrSeq : formlMastrSeq
                    } );

                    $formlaMastrSelect.empty ().html ( html ).trigger ( 'change' );

                    if ( method === staticVariable.methodUpdate )
                    {
                        var $selectFormlaMastr = $ ( ':selected', $formlaMastrSelect );
                        getFormlDetlInfoList ( $formlaMastrSelect, $formlDetlTable, formlDetlTrTpl, $selectFormlaMastr,
                                isKorean );
                    }

                    initFormlDetlInfoList ( isKorean );
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

// 대상 태그 정보 가져오기
function getTargetTagInfoList ()
{
    var flag = false;
    var errorData = '';
    var $pvId = $ ( '#pvId' );
    var $eqmtId = $ ( '#eqmtId' );
    var $tagGrp = $ ( '#tagGrp' );

    var pvId = null;
    var eqmtId = null;
    var tagGrpCd = null;
    if ( method === staticVariable.methodUpdate )
    {
        pvId = $pvId.val ();
        tagGrpCd = $tagGrp.val ();
        eqmtId = $eqmtId.val ();
    } else
    {
        pvId = $ ( ":selected", $pvId ).val ();
        tagGrpCd = $ ( ":selected", $tagGrp ).val ();
        eqmtId = $ ( ":selected", $eqmtId ).val ();
    }

    if ( pvId === '' )
    {
        errorData = 'pvId';
    } else if ( eqmtId === '' )
    {
        errorData = 'eqmtId';
    } else if ( pvId !== '' && eqmtId !== '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectTargetTagInfoList.ajax',
            type : 'POST',
            data : {
                pvId : pvId,
                eqmtId : eqmtId,
                tagGrpCd : tagGrpCd
            },
            dataType : 'json',
            async : false,
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    targetTagList = json.data;
                    flag = true;
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

    return {
        flag : flag,
        errorData : errorData
    };
}

// 수식 상세 정보 리스트 가져오기
function initFormlDetlInfoList ( isKorean )
{
    var $formlaMastrSelect = $ ( '#formla_mastr_select' );
    var $formlDetlTable = $ ( '#forml_detl_table tbody' );
    var tpl = getTemplate ( templates.formlDetlTr );

    $formlaMastrSelect.on ( 'change', function ()
    {
        targetTagList = null;
        var $selectFormlaMastr = $ ( ':selected', $ ( this ) );
        if ( $selectFormlaMastr.val () !== '' )
        {
            getFormlDetlInfoList ( $formlaMastrSelect, $formlDetlTable, tpl, $selectFormlaMastr, isKorean );
        }
    } );
}

function getFormlDetlInfoList ( $formlaMastrSelect, $formlDetlTable, tpl, $selectFormlaMastr, isKorean )
{
    var mastrSeq = $selectFormlaMastr.val ();
    if ( targetTagList === null )
    {
        var result = getTargetTagInfoList ();
        if ( !result.flag )
        {
            $formlaMastrSelect.val ( '' );
            if ( result.errorData === 'pvId' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            } else if ( result.errorData === 'eqmtId' )
            {
                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_validDataRequiredEquipment,
                    checkText : i18nMessage.msg_ok,
                    cancelText : i18nMessage.msg_cancel,
                    type : staticVariable.dialogTypeInfo
                } );
            }
        }
    }

    if ( mastrSeq !== '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectFormlDetlInfoList.ajax',
            type : 'POST',
            data : {
                formlMastrSeq : mastrSeq
            },
            dataType : 'json',
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null && targetTagList !== null )
                    {
                        var template = _.template ( tpl );
                        var html = template ( {
                            message : i18nMessage.msg_selection,
                            isKorean : isKorean,
                            formlNm : $selectFormlaMastr.text (),
                            formlDetlInfoList : json.data,
                            targetTagList : targetTagList
                        } );

                        $formlDetlTable.empty ().html ( html ).trigger ( 'change' );

                        setTrgetTagIds ();
                        customizeSelect2Tag ( true );
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

// 대상 태그 셋팅
function setTrgetTagIds ()
{
    var $trgetTagIds = $ ( '#trgetTagIds' );
    var $formlDetlSeqs = $ ( '#formlDetlSeqs' );

    if ( targetTagList === null || targetTagList.length === 0 )
    {
        tagTargetTagList = $trgetTagIds.val ().split ( ',' );
    }

    if ( tagTargetTagList.length > 0 && $formlDetlSeqs.val () !== '' )
    {
        var formlDetlSeqsList = $formlDetlSeqs.val ().split ( ',' );
        $ ( '.target_tag_select' ).each ( function ()
        {
            var $that = $ ( this );
            var formlDetlSeq = $that.closest ( 'tr' ).data ( 'forml-detl-seq' );
            $.each ( formlDetlSeqsList, function ( index, seq )
            {
                if ( formlDetlSeq == seq )
                {
                    console.log ( seq );
                    console.log ( tagTargetTagList[index] );
                    $that.val ( tagTargetTagList[index] ).trigger ( 'change' );
                    return false;
                }
            } );
        } );
    }
}

$ ( function ()
{
    targetTagList = null;
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    // getTargetTagInfoList ();
    getFormlMastrInfoList ( isKorean );
} );
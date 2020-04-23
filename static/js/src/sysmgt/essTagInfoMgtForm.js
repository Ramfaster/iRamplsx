var existTagIdChk = false;
var isKorean = null;

function customizeForm ()
{
    var $imageType = $('.image_type').customizeRadio({
        backgroundImage: contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width: 13,
        height  : 13
    });

    var $dateType = $ ( '.sel_type' ).customizeSelect ( {
        width : 370,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select09',
        focusClass : 'custom-form-focused09',
        disableClass : 'custom-form-disabled09'
    } );

    var $dateType2 = $ ( '.customize_select_m'  ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    });

    var $dateType3 = $ ( '.customize_select_s').customizeSelect ( {
        width : 55,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select10',
        focusClass : 'custom-form-focused10',
        disableClass : 'custom-form-disabled10'
    });

    var $dateType = $ ( '#sel_type1' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $searchType = $ ( '#search_type' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    var $select01 = $('.select01');
    var $select02 = $('.select02');
    var $select03 = $('.select03');
    var $frmContWrap = $('.frm_cont_wrap'); 
    
    $select01.select2({enableMousewheel : false});
    $select02.select2({enableMousewheel : false});
    $select03.select2({enableMousewheel : false});

    var flag1 = true;

    //select event
    $select01.on('select2:open', function(e){
        if(flag1) {
            mCustomScrollbar ();

            flag1 = false;
        }
    });

    var flag2 = true;

    //select event
    $select02.on('select2:open', function(e){
        if(flag2) {
            mCustomScrollbar ();
            
            flag2 = false;
        }   

    });

    var flag3 = true;

    //select event
    $select03.on('select2:open', function(e){
        if(flag3) {
            mCustomScrollbar ();

            flag3 = false;
        }
    });
    
    // form scroll
    $frmContWrap.mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
    
}

function setSelect2Scroll()
{
    var $select02 = $('.select02');
    
    var flag2 = true;

    $select02.unbind();
    //select event
    $select02.on('select2:open', function(e){
        if(flag2) {
            mCustomScrollbar ();
            flag2 = false;
        }   
           
    });
}

function mCustomScrollbar ()
{
    $ ( '.select2-results' ).mCustomScrollbar ( 'destroy' );
    $ ( '.select2-results' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

//사이트 선택 시 설비그룹 정보 가져오기
function getEqmtGrpInfoList ( isKorean )
{
    var $selPvId = $ ( '#sel_pv_id' );
    var $selEqmtId = $ ( '#eqmtId' );
    var tpl = getTemplate ( templates.essEqmtSelect );

    $selPvId.on ( 'change', function ()
    {
        getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtId );
    } );
}

function getEqmtGrpInfoListAjax ( isKorean, tpl, $selPvId, $selEqmtId )
{
    var params = {
        pvId : $selPvId.val ()
    };

    var $selColctTrgetTyVal = $('#colctTrgetTy').val(); 

    // 데이터수집대상유형 값이 설비일 경우 설비리스트 초기화 
    // (사이트일 경우 임시설비-DTA01)
    if ( params.pvId !== '' && $selColctTrgetTyVal !== 'DTA01' )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/ess/selectEqmtStdrInfoVOList.ajax',
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
                            isKorean : isKorean,
                            eqmtList : json.data
                        } );

                        $selEqmtId.empty ().html ( html );   
                        setSelect2Scroll();
                        
                        $selEqmtId.on ( 'change', function (e)
                        {
                            var optionSelected = $("option:selected", this);
                            $(this).find("option:eq(" + optionSelected[0].index + ")").prop("selected", true);
                            $('#select2-eqmtId-container').text( optionSelected[0].label );

                            setTagName ( $selEqmtId, $('#paramtrNm'), $('#tagGrpCd') ); 
                        });
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

// 부모 태그단위 선택 시 자식 태그단위 가져오기
function getTagUnitChildInfoList ( isKorean ) 
{
    var $selTagUnitParent = $ ( '#parntsTagUnit' );
    var $selTagUnitChild = $ ( '#tagUnit' );

    var tpl = getTemplate ( templates.essCmmnCdSelect );

    $selTagUnitParent.on ( 'change', function ()
    {
        getTagUnitChildInfoListAjax ( isKorean, tpl, $selTagUnitParent, $selTagUnitChild );
    });
}

function getTagUnitChildInfoListAjax ( isKorean, tpl, $selTagUnitParent, $selTagUnitChild )
{
    var params = {
            parntsCdId : $selTagUnitParent.val()
    };

    if ( params.parntsCdId !== 'all' &&  params.parntsCdId !== '' )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/ess/getChildTagUnitInfoList.ajax',
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
                            isKorean : isKorean,
                            cmmnCdList : json.data,
                            parentVal : params.parntsCdId,
                            parentNm : $selTagUnitParent.find('option:selected').prop('label')
                        } );
                        
                        $selTagUnitChild.empty ().html ( html ).trigger ( 'change' );
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
    } else
    {
        var html = '<option value="all">' + i18nMessage.msg_selection + '</option>';
        $selTagUnitChild.empty ().html ( html ).trigger ( 'change' );
    }
}

// 설비, 파라미터명, 태그그룹 값이 변경되면 Tag Name 설정
function generateTagName () 
{
    var $selEqmtId = $('#eqmtId');
    var $selParamName = $('#paramtrNm');
    var $selTagGrp = $('#tagGrpCd');
    
    $selEqmtId.on ( 'change', function ()
    {
        setTagName ( $selEqmtId, $selParamName, $selTagGrp ); 
    });
    
    $selTagGrp.on ( 'change', function()
    {
        setTagName ( $selEqmtId, $selParamName, $selTagGrp );   
    });
    
    $selParamName.on ( 'change', function ()
    {
        setTagName ( $selEqmtId, $selParamName, $selTagGrp );   
    });
}

// 태그명 설정
function setTagName ( $selEqmtId, $selParamName, $selTagGrp ) 
{
    var $tagName = $('#tagNm');

    var wholeName = '';
    
    if ( ( $selEqmtId.val() !== 'all' || $selEqmtId.val() !== '' ) &&
           ( $selTagGrp.val() !== 'all' || $selTagGrp.val() !== '' ) &&
               ( $selParamName.val() !== 'all' || $selParamName.val() !== '' ) ) 
    {
        wholeName = $selEqmtId.val() + "_" + $selTagGrp.val() + "_001_" + $selParamName.val();  
        $tagName.val ( wholeName );
    }
    
}

// ESS Tag ID 생성
function generateTagId ()
{
    var $btnTagIdGen = $('#btn_tagIdGen'); // 태그ID생성 버튼
    
    var $tagName = $('#tagNm'); // 태그명
    var $tagId = $('#tagId'); // 태그ID
    var $selPvId = $ ( '#sel_pv_id' ); // 사이트
    var $selEqmtGrp = $ ( '#eqmtId' ); // 설비그룹
    var $selParamName = $('#paramtrNm'); // 파라미터명
    var $essVariable = $('#varId'); // ESS Variable
    var $selColctAttrbTy = $('#colctAttrbTy'); // 데이터수집속성유형
    
    $btnTagIdGen.on ('click', function(){
       var wholeTagId = $selPvId.val() + "#" + $tagName.val();
       var colctAttrbTyVal = $selColctAttrbTy.val();
       
       $tagId.val (wholeTagId );
       
       if ( colctAttrbTyVal === 'DAT01' || colctAttrbTyVal === 'DAT02' ) // 집계or계측
       {
           $essVariable.val ( wholeTagId );
       }

       existTagIdChk = true; // 등록일 경우 체크됨 
    });
    
}

//ESS 항목 유효성 체크
function tagValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#tagForm' ).validate ( {
        rules : {
            eqmtId : { // 설비ID
                required : true
            },
            varId : {
                required : true
            },
            colctTrgetTy : {
                required : true
            },
            tagKorNm : { // 태그한글명
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 100
            },
            tagEngNm : { // 태그영문명
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 100
            },
            tagId : {
                required : true
            }
        },
        messages : {
            eqmtId : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredEqmtId )
            },
            varId : {
                required : '<i>*</i> 필수로 입력하세요.'
            },
            colctTrgetTy : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredcolctTrgetTy )
            },
            tagKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredTagKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagKoreanName )
            },
            tagEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredTagEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagEnglishName )
            },
            tagId : {
                required : '<i>*</i> 필수로 입력하세요.'
            }
        },
        submitHandler : function ( form )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : existTagIdChk ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                console.log ( form );
                if ( confirm )
                {
                    form.submit ();
                }
            } );
        }
    } );
}

// 데이터 수집 대상 유형 -> ESS 설비 Disable 처리
function changeEssEqmtStatus () 
{
    var $selColctTrgetTy = $('#colctTrgetTy');
    var $selEqmtId = $('#eqmtId');
    
    $selColctTrgetTy.on ( 'change', function(){
        var selVal = $selColctTrgetTy.val();
        
        if ( selVal === 'DTA01' ) // 사이트
        {
            var option = "<option value='TMP0001'>임시설비</option>";
            $selEqmtId.empty ().html ( option ).trigger ('change');  
            setSelect2Scroll ();
        } 
        else // 설비
        {
            // 기존 설비그룹 그대로 넣기            
            $('#sel_pv_id').trigger ( 'change' );
            
            $selEqmtId.on ( 'change', function (e)
            {
                var optionSelected = $("option:selected", this);
                // var valueSelected = this.value;
                $(this).find("option:eq(" + optionSelected[0].index + ")").prop("selected", true);
                $('#select2-eqmtId-container').text( optionSelected[0].label );

                setTagName ( $selEqmtId, $('#paramtrNm'), $('#tagGrpCd') ); 
            });
        }
    });
}

// 데이터 수집 속성 유형 -> ESS Variable 동적입력
function changeEssVariableStatus ()
{
    var $selColctAttrbTy = $('#colctAttrbTy');
    var $essValId = $('#varId');
    var selval = $selColctAttrbTy.val();
    
    if ( selval === 'DAT01' || selval === 'DAT02' ) // 집계or계측
    {
        $essValId.attr('readOnly', true);
        $essValId.val ( $('#tagId').val() ); // tagId와 동일하게 입력
    }
    
    $selColctAttrbTy.on ('change', function(){
        selval = $selColctAttrbTy.val();
        
        if ( selval === 'DAT01' || selval === 'DAT02' ) // 집계or계측
        {
            $essValId.attr('readOnly', true);
            $essValId.val ( $('#tagId').val() ); // tagId와 동일하게 입력
        } else // 알람
        {
            $essValId.attr('readOnly', false);
        }
    });
}


$ ( function ()
{
    isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }
    
    customizeForm ();
    
    getEqmtGrpInfoList ( isKorean ); // 사이트선택 시 설비그룹 변경
    getTagUnitChildInfoList ( isKorean ); // 부모태그단위 선택 시 자식태그단위 변경
    
    changeEssEqmtStatus (); // 데이터수집대상유형에 따라 ESS설비코드 처리
    changeEssVariableStatus (); // 데이터수집속성유형에 따라 ESS Variable 처리
    
    generateTagName (); // Tag명 생성
    generateTagId (); // Tag ID 생성
    
    
    
    tagValidate (); // 태그 유효성 체크 -> submit

} );
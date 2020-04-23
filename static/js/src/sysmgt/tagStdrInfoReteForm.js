//form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    var $dateType = $ ( '#sel_type, #sel_type1, .sel_type' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $searchType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
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
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    // jqgrid
    $ ( '#gridList' ).jqGrid ( {
        url : contextPath + '/hom/sysmgt/scale/list.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 478,
        autowidth : true,
        shrinkToFit : false,
        // postData : {
        // searchKey : '',
        // searchKeyword : ''
        // },
        colNames : [ '스케일번호', i18nMessage.msg_formulaName, i18nMessage.msg_formula, i18nMessage.msg_description ],
        colModel : [ {
            name : 'scaleSeq',
            key : true
        }, {
            name : 'formlNm',
            width : 200,
            align : 'center',
            fixed : true
        }, {
            name : 'forml',
            width : 250,
            align : 'center',
            fixed : true
        }, {
            name : 'formlDesc',
            width : 254,
            align : 'center',
            fixed : true
        } ],
        sortname : 'scaleSeq',
        sortorder : 'asc',
        multiselect : true,
        multiboxonly : true,
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '.gq_nodata' );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();
                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var $gridList = $ ( '#gridList' );

                // scaleSeq는 보여주지않음
                $gridList.jqGrid ( 'hideCol', [ 'scaleSeq', 'rn' ] );

                $gridList.setSelection ( $ ( "#scaleSeq" ).val (), true );
            }
        },
        onSelectRow : function ( rowId, status )
        {

            var $gridList = $ ( '#gridList' );
            var rowData = $gridList.getRowData ( rowId );
            if ( status )
            {
                $ ( "#txtFormlNm" ).val ( rowData.formlNm );
                $ ( "#scaleSeq" ).val ( rowData.scaleSeq );
            } else
            {
                $ ( "#txtFormlNm" ).val ( "" );
                $ ( "#scaleSeq" ).val ( "" );
            }

        },
        gridComplete : function ()
        {
            $ ( "#cb_gridList" ).hide (); // allCheck box 삭제
            $ ( "#jqgh_gridList_ch" ).html ( i18nMessage.msg_selection );
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
// jqgrid 검색
function searchJqgrid ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList, $searchKey, $searchValue );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $searchKey, $searchValue )
{
    $gridList.setGridParam ( {
        postData : {
            searchKey : $ ( ":selected", $searchKey ).val (),
            searchKeyword : $searchValue.val ()
        }
    } ).trigger ( 'reloadGrid' );
}

// 사용자 정보 초기화(등록 화면)
function userInitialization ()
{
    if ( !existTagId )
    {
        $ ( '#btn_reset' ).click ( function ()
        {
            $ ( 'form' ).each ( function ()
            {
                this.reset ();
                $ ( this ).find ( 'input[type=text], textarea, select' ).val ( '' );
            } );

            $ ( '#pvId' ).each ( function ()
            {
                if ( $ ( this ).val () !== '' )
                {
                    $ ( this ).remove ();
                }
            } );

            $ ( '.customize_select' ).trigger ( 'change' );
            $ ( '#nation' ).trigger ( 'change' );
            $ ( '.id_check' ).addClass ( 'dnone' );
            $ ( '#duplication_flag' ).val ( homConstants.checkN );
            $ ( '#usgAt1' ).prop ( 'checked', true ).trigger ( 'change' );
            $ ( '.frm_list_wrap' ).remove ();
            $ ( 'label.error' ).remove ();
            $ ( '.frm_type' ).removeClass ( 'error' );
        } );
    }
}

// 태그 정보 유효성 체크
function tagValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    $ ( '#tagForm' ).validate ( {
        rules : {
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
            }
        },
        messages : {
            tagKorNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredTagKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagKoreanName )
            },
            tagEngNm : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredTagEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeTagEnglishName )
            }
        },
        submitHandler : function ( form )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existTagId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
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

// 부모태그단위 선택시 자식 태그단위를 가져온다.
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

$ ( function ()
{
    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }

    customizeForm ();
    customizeJqgrid ();
    searchJqgrid ();
    getTagUnit ( isKorean );
    userInitialization ();
    tagValidate ();
} );
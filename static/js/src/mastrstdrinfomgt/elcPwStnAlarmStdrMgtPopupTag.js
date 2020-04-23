// form element customize
function customizePopForm ()
{
    // 설비 구분
    var $dateType1 = $ ( '#searchEqmtGrpCd' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );    

   
    var $dateType = $ ( '#searchInfoTy' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );
    
    $ ( '#searchInfoTy' ).change ( function (){
    	var searchEqmtGrpCd =  $ ( '#searchInfoTy' ).val();
    	getEqmtGrpCd(searchEqmtGrpCd);
    	
    });
}

function customizePopRadio ()
{
    $ ( '.radio_gridListPop' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );
}

// jqgird customize
function customizePopJqgrid ()
{
    // 데이터 없음 템플릿
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    colNames = [ "", i18nMessage.msg_tagId, "tagGrpCd", "EQMT ID", i18nMessage.msg_eqmtSection,
            i18nMessage.msg_facilities, i18nMessage.msg_tagGroup, i18nMessage.msg_paramName, i18nMessage.msg_tagName,
            i18nMessage.msg_tag + i18nMessage.msg_description ];

    if ( lang === locale.korea || lang === locale.korean )
    {
        colModel = [
                {
                    name : 'no',
                    index : 'No.',
                    align : 'center',
                    width : '50',
                    formatter : function ( cellValue, option )
                    {
                        return '<input type="radio" name="radio_' + option.gid + '" class="radio_' + option.gid
                                + '" value="' + option.rowId + '" />';
                    }
                }, {
                    name : 'tagId',
                    hidden : true
                }, {
                    name : 'tagGrpCd',
                    hidden : true
                }, {
                    name : 'eqmtId',
                    hidden : true
                }, {
                    name : 'eqmtGrpKorNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'eqmtKorNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'tagGrpKorNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'paramtrNm',
                    align : 'center',
                    width : '240'
                }, {
                    name : 'tagNm',
                    align : 'left',
                    width : '250'
                }, {
                    name : 'tagDesc',
                    align : 'left',
                    width : '265'
                } ];
    } else
    {
        colModel = [
                {
                    name : 'no',
                    index : 'No.',
                    align : 'center',
                    width : '80',
                    formatter : function ( cellValue, option )
                    {
                        return '<input type="radio" name="radio_' + option.gid + '" class="radio_' + option.gid
                                + '" value="' + option.rowId + '" />';
                    }
                }, {
                    name : 'tagId',
                    hidden : true
                }, {
                    name : 'tagGrpCd',
                    hidden : true
                }, {
                    name : 'eqmtId',
                    hidden : true
                }, {
                    name : 'eqmtGrpEngNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'eqmtEngNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'tagGrpEngNm',
                    align : 'center',
                    width : '150'
                }, {
                    name : 'paramtrNm',
                    align : 'center',
                    width : '240'
                }, {
                    name : 'tagNm',
                    align : 'left',
                    width : '250'
                }, {
                    name : 'tagDesc',
                    align : 'left',
                    width : '265'
                } ];
    }

    $ ( '#gridListPop' ).jqGrid ( {
        url : contextPath + '/hom/masterdata/alarm/selectAlarmTagList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 642,
        autowidth : true,
        shrinkToFit : false,
        sortname : 'tagId',
        sortorder : 'asc',
        multiselect : false,
        multiboxonly : false,
        rownumbers : false,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : 'Scroll to bottom to retrieve new page', // the message will be displayed at the bottom
        colNames : colNames,
        colModel : colModel,

        loadComplete : function ( data )
        {
            // console.log ( data );
            var $gqNodata = $ ( '.gq_nodata' );
            var $gridList = $ ( '#gridListPop' );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();
                customizePopRadio ();
                selectRadioButton ();
            }
            // $gridList.jqGrid ( 'hideCol', [ 'cb' ] );
        },

        // Row 선택시
        onSelectRow : function ( rowId, status )
        {
            var $gridList = $ ( '#gridListPop' );
            var rowData = $gridList.getRowData ( rowId );

            $ ( "#param_tagId" ).val ( rowData.tagId );
            $ ( "#param_paramtrNm" ).val ( rowData.paramtrNm );
            $ ( "#param_tagGrpCd" ).val ( rowData.tagGrpCd );
            $ ( "#param_eqmtId" ).val ( rowData.eqmtId );

            if ( lang === locale.korea || lang === locale.korean )
            {
                $ ( "#param_eqmtSection" ).val ( rowData.eqmtGrpKorNm );
                $ ( "#param_eqmtNm" ).val ( rowData.eqmtKorNm );
                $ ( "#param_tagGrpNm" ).val ( rowData.tagGrpKorNm );
            } else
            {
                $ ( "#param_eqmtSection" ).val ( rowData.eqmtGrpEngNm );
                $ ( "#param_eqmtNm" ).val ( rowData.eqmtEngNm );
                $ ( "#param_tagGrpNm" ).val ( rowData.tagGrpEngNm );
            }

            // $ ( "#viewFrm" ).submit ();
        },
        beforeSelectRow : function ( rowid, e )
        {
            $ ( e.target ).closest ( 'tr' ).find ( 'input[type=radio]' ).prop ( 'checked', true ).trigger ( 'change' );

            return true; // allow row selection
        }
    /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 라디오 버튼 선택시
function selectRadioButton ()
{
    var $gridListPop = $ ( '#gridListPop' );
    var $gridListPopRadio = $gridListPop.find ( 'input[type=radio]' );
    var $paramTagId = $ ( "#param_tagId" );
    var $paramParamtrNm = $ ( "#param_paramtrNm" );
    var $paramTagGrpCd = $ ( "#param_tagGrpCd" );
    var $paramEqmtId = $ ( "#param_eqmtId" );
    var $paramEqmtSection = $ ( "#param_eqmtSection" );
    var $paramEqmtNm = $ ( "#param_eqmtNm" );
    var $paramTagGrpNm = $ ( "#param_tagGrpNm" );

    $gridListPopRadio.on ( 'click', function ()
    {
        var rowId = $ ( this ).val ();
        var rowData = $gridListPop.getRowData ( rowId );

        $paramTagId.val ( rowData.tagId );
        $paramParamtrNm.val ( rowData.paramtrNm );
        $paramTagGrpCd.val ( rowData.tagGrpCd );
        $paramEqmtId.val ( eqmtId );

        if ( lang === locale.korea || lang === locale.korean )
        {
            $paramEqmtSection.val ( rowData.eqmtGrpKorNm );
            $paramEqmtNm.val ( rowData.eqmtKorNm );
            $paramTagGrpNm.val ( rowData.tagGrpKorNm );
        } else
        {
            $paramEqmtSection.val ( rowData.eqmtGrpEngNm );
            $paramEqmtNm.val ( rowData.eqmtEngNm );
            $paramTagGrpNm.val ( rowData.tagGrpEngNm );
        }

    } );
}

/**
 * 알람 태그 선택
 */
function selectTag ()
{
    var $btnReg = $ ( "#btn_regPopup" );
    $btnReg.click ( function ()
    {
        var myGridId = "grid";
        var myGrid = $ ( "#gridListPop" );

        var $selRadio = $ ( 'input[name=radio_' + myGrid[0].id + ']:radio:checked' ), $tr;
        if ( $selRadio.length > 0 )
        {
            $tr = $selRadio.closest ( 'tr' );
            if ( $tr.length > 0 )
            {
                var tagId = $ ( "#param_tagId" ).val ();// 태그ID
                var paramtrNm = $ ( "#param_paramtrNm" ).val ();
                var tagGrpCd = $ ( "#param_tagGrpCd" ).val ();
                var eqmtId = $ ( "#param_eqmtId" ).val ();
                eqmtSection = $ ( "#param_eqmtSection" ).val ();
                eqmtNm = $ ( "#param_eqmtNm" ).val ();
                tagGrpNm = $ ( "#param_tagGrpNm" ).val ();

                $ ( "#tagId" ).val ( tagId );

                $ ( "#paramtrNm" ).val ( paramtrNm );
                $ ( "#eqmtId" ).val ( eqmtId );
                if ( tagGrpCd == "S" )
                {
                    $ ( "#alarmGrpCd" ).val ( "ALG02" );
                    $ ( "#sel_type option" ).each ( function ()
                    {
                        var $that = $ ( this );
                        if ( $that.val () == 'ALK01' )
                        {
                            $that.attr ( 'disabled', 'disabled' );
                        } else
                        {
                            $that.removeAttr ( 'disabled' );
                        }
                        if ( $that.val () == 'ALK02' )
                        {
                            $that.attr ( 'selected', 'selected' ).trigger ( 'change' );
                        }
                    } );

                    $ ( "#sel_type1" ).val ( "ALVL01" ).trigger ( 'change' );
                    $ ( "#sel_type1 option" ).removeAttr ( 'disabled' );

                    // mail template 팝업창 tagId 정의
                    var $btnMailtemplatepopup = $ ( '.btn_mailtemplatepopup' );
                    var href = $btnMailtemplatepopup.attr ( 'href' ).split ( '?' )[0];
                    $btnMailtemplatepopup.attr ( 'href', href + '?tagId=' + encodeURIComponent ( tagId ) );
                    // elcPwStnAlarmStdrMgtForm.js 의 함수 콜
                    showMailTmplatPopup ();
                } else if ( tagGrpCd == "E" )
                {
                    $ ( "#alarmGrpCd" ).val ( "ALG01" );
                    $ ( "#sel_type option" ).each ( function ()
                    {
                        var $that = $ ( this );
                        if ( $that.val () == 'ALK02' || $that.val () == 'ALK03' )
                        {
                            $that.attr ( 'disabled', 'disabled' );
                        } else
                        {
                            $that.removeAttr ( 'disabled' );
                        }

                        if ( $that.val () == 'ALK01' )
                        {
                            $that.attr ( 'selected', 'selected' ).trigger ( 'change' );
                        }

                        $ ( "#sel_type1" ).val ( "ALVL01" ).trigger ( 'change' );
                        $ ( "#sel_type1 option" ).removeAttr ( 'disabled' );
                    } );
                }
                // 부모창으로 값 넘기기
                if ( lang === locale.korea || lang === locale.korean )
                {
                    $ ( "#eqmtGrpKorNm" ).val ( eqmtSection );
                    $ ( "#eqmtKorNm" ).val ( eqmtNm );
                    $ ( "#tagGrpKorNm" ).val ( tagGrpNm );
                } else
                {
                    $ ( "#eqmtGrpEngNm" ).val ( eqmtSection );
                    $ ( "#eqmtEngNm" ).val ( eqmtNm );
                    $ ( "#tagGrpEngNm" ).val ( tagGrpNm );
                }

                $ ( "#btn_closePopup" ).click ();
            } else
            {
                alert ( i18nMessage.msg_noSelectedTag );
                return;
            }
        } else
        {
            alert ( i18nMessage.msg_noSelectedTag );
            return;
        }
    } );
}

// jqgrid 검색
function searchPopJqgrid ()
{
    var $btn_search = $ ( '#btn_search' );
    var $gridList = $ ( '#gridListPop' );
    var $selBox = $ ( '#searchEqmtGrpCd' );

    var $searchTagNm = $ ( '#searchTagNm' );

    $selBox.change ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchTagNm, $selBox );

    } );

    $btn_search.click ( function ()
    {
        reloadPopJqgrid ( $gridList, $searchTagNm, $selBox );
    } );

    $searchTagNm.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadPopJqgrid ( $gridList, $searchTagNm, $selBox );
        }
    } );
}
// jqgrid reload
function reloadPopJqgrid ( $gridList, $searchTagNm, $searchEqmtGrpCd )
{
    $gridList.setGridParam ( {
        postData : {
            searchTagNm : $searchTagNm.val (),
            searchEqmtGrpCd : $ ( ":selected", $searchEqmtGrpCd ).val ()
        }
    } ).trigger ( 'reloadGrid' );
}
$ ( function ()
{
    customizePopForm ();
    customizePopJqgrid ();
    // reloadPopJqgrid ();
    searchPopJqgrid ();
    selectTag ();// 태그 선택 후 등록 버튼 클릭 시
} );

/**
 * 설비 그룹 목록 조회
 */
function getEqmtGrpCd (searchEqmtGrpCd)
{
   
    var params = {
    	searchEqmtGrpCd : searchEqmtGrpCd,
    };

    $.ajax ( {
        url : contextPath + '/hom/masterdata/alarm/getEqmtGrpCd.ajax',
        type : 'POST',
        dataType : 'json',
        data : params,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var option = "<option value='all'>"+i18nMessage.msg_all+"</option>" ;
            	$.each ( json.data, function ( index, item ){
            		if(lang === locale.korea || lang === locale.korean)
            		{
            			 option += "<option value='"+item.cdId+"'>"+item.cdKorNm+"</option>";  
            		}else
            		{
            			 option += "<option value='"+item.cdId+"'>"+item.cdEngNm+"</option>";  
            		}            	 
               } );
            	
            	$ ( '#searchEqmtGrpCd' ).empty().html(option);
            	
            	$ ( '#searchEqmtGrpCd' ).trigger ( 'change' );
            	
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
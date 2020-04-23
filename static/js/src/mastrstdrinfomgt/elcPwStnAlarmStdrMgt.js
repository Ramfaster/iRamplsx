// form element customize
function customizeForm ()
{
	var $searchInfoTy = $ ( '#searchInfoTy' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );
	
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

    // 검색 조건
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );

    // 알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#009944',
        selectedBorderColor : '#009944'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#ffb230',
        selectedBorderColor : '#ffb230'
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        width : 58,
        selectedColor : '#6c7176',
        selectedBorderColor : '#6c7176'
    } );
    // var checkOption5 = $.extend ( {}, defaultOption, {
    // width : 118,
    // selectedColor : '#c3a279',
    // selectedBorderColor : '#c3a279'
    // } );

    $ ( '#notice' ).customizeCheckbox ( checkOption1 );
    $ ( '#warning' ).customizeCheckbox ( checkOption2 );
    $ ( '#fault' ).customizeCheckbox ( checkOption3 );
    $ ( '#disconnect' ).customizeCheckbox ( checkOption4 );
    // $ ( '#system, #equipment' ).customizeCheckbox ( checkOption5 );

    // 조회기간
    /*
     * var $dateType = $ ( '#date_type' ).customizeSelect ( { width : 60, paddingHorizontal : 15, height : 30, color :
     * '#3c3c3c' } );
     */
    // var $searchEqmtGrpCd = $ ( '#searchEqmtGrpCd' );
    // $searchEqmtGrpCd.mCustomScrollbar ( {
    // scrollButtons : {
    // enable : true
    // },
    // theme : 'inset-2',
    // scrollbarPosition : 'inside',
    // scrollInertia : 300
    // } );
    
    $ ( '#searchInfoTy' ).change ( function (){
    	var searchEqmtGrpCd =  $ ( '#searchInfoTy' ).val();
    	getEqmtGrpCd(searchEqmtGrpCd);
    	
    });
}


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


/* customizeJqgrid */
function customizeJqgrid ()
{
    // 데이터 없음 템플릿
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    colNames = [ i18nMessage.msg_tagName, i18nMessage.msg_alarmName,"infoTy", i18nMessage.msg_bsnsRng, i18nMessage.msg_eqmtSection,
            i18nMessage.msg_alarmGradeCode, i18nMessage.msg_grade, i18nMessage.msg_actionGuide,
            i18nMessage.msg_alarmDescription, i18nMessage.msg_emailSendTargeter, i18nMessage.msg_smsSendTargeter,
            "mailSys", "mailCorpr", "smsSys", "smsCorpr" ];

    if ( lang === locale.korea || lang === locale.korean )
    {
        colModel = [ {
            name : 'tagId',
            align : 'left',
            width : '270'
        }, {
            name : 'alarmKorNm',
            align : 'left',
            width : '220'
        }, {
			name : 'infoTy',
			hidden : true
		}, {
			name : 'infoTyKorNm',
		    align : 'center',
	        width : '110',
	        sortable : false
		}, {
            name : 'eqmtGrpKorNm',
            align : 'center',
            width : '130'
        }, {
            name : 'alarmGradCd',
            hidden : true
        }, {
            name : 'alarmGradKorNm',
            align : 'center',
            width : '110'
        }, {
            name : 'alarmManagtGdeInfo',
            align : 'left',
            width : '230'
        }, {
            name : 'alarmDesc',
            align : 'left',
            width : '210'
        }, {
            name : 'mailSendTrget',
            align : 'left',
            width : '130',
            sortable : false
        }, {
            name : 'smsSendTrget',
            align : 'left',
            width : '144',
            sortable : false
        }, {
            name : 'mailSndSysCharger',
            hidden : true
        }, {
            name : 'mailSndCorprCharger',
            hidden : true
        }, {
            name : 'smsSndSysCharger',
            hidden : true
        }, {
            name : 'smsSndCorprCharger',
            hidden : true
        } ];
    } else
    {
        colModel = [ {
            name : 'tagId',
            align : 'left',
            width : '270'
        }, {
            name : 'alarmEngNm',
            align : 'left',
            width : '220'
        }, {
			name : 'infoTy',
			hidden : true
		},{
			name : 'infoTyEngNm',
		    align : 'center',
	        width : '110',
	        sortable : false
		}, {
            name : 'eqmtGrpEngNm',
            align : 'center',
            width : '110'
        }, {
            name : 'alarmGradCd',
            hidden : true
        }, {
            name : 'alarmGradEngNm',
            align : 'center',
            width : '110'
        }, {
            name : 'alarmManagtGdeInfo',
            align : 'left',
            width : '230'
        }, {
            name : 'alarmDesc',
            align : 'left',
            width : '210'
        }, {
            name : 'mailSendTrget',
            align : 'left',
            width : '130'
        }, {
            name : 'smsSendTrget',
            align : 'left',
            width : '144'
        }, {
            name : 'mailSndSysCharger',
            hidden : true
        }, {
            name : 'mailSndCorprCharger',
            hidden : true
        }, {
            name : 'smsSndSysCharger',
            hidden : true
        }, {
            name : 'smsSndCorprCharger',
            hidden : true
        } ];
    }

    var $searchEqmtGrpCd = $ ( '#searchEqmtGrpCd' );
    var $searchInfoTy = $ ( '#searchInfoTy' );
    var $notice = $ ( '#notice' );
    var $warning = $ ( '#warning' );
    var $fault = $ ( '#fault' );
    var $disconnect = $ ( '#disconnect' );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    $ ( '#gridList' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/masterdata/alarm/selectAlarmStdrList.ajax',
                        mtype : 'POST',
                        datatype : 'json',
                        postData : {
                            searchKey : $ ( ":selected", $searchKey ).val (),
                            searchKeyword : $searchValue.val (),
                            searchEqmtGrpCd : $ ( ":selected", $searchEqmtGrpCd ).val (),
                            searchInfoTy : $ ( ":selected", $searchInfoTy ).val (),
                            notice : $notice.val (),
                            warning : $warning.val (),
                            fault : $fault.val (),
                            disconnect : $disconnect.val ()
                        },
                        height : 580,
                        autowidth : true,
                        shrinkToFit : false,
                        sortname : 'tagId',
                        sortorder : 'asc',
                        multiselect : true,
                        multiboxonly : false,
                        rownumbers : true,
                        rowwidth : 25,
                        page : 1,
                        rowNum : staticVariable.gridRow30,
                        scroll : true,
                        viewrecords : true,
                        emptyrecordsemptyrecords : '데이터가 존재하지 않습니다.',
                        colNames : colNames,
                        colModel : colModel,

                        loadComplete : function ( data )
                        {
                            // console.log ( data );
                            var $gqNodata = $ ( '.gq_nodata' );

                            // 조회결과 타이틀
                            var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                            $ ( "#totalRowCount" ).html ( resultText );

                            if ( data.records === 0 )
                            {
                                $gqNodata.show ();
                            } else
                            {
                                $gqNodata.hide ();

                                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                                var $gridList = $ ( '#gridList' );
                                var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                                var ids = $gridList.jqGrid ( "getDataIDs" );
                                for ( var i = 0, length = ids.length; i <= length; i++ )
                                {
                                    var cl = ids[i];
                                    var rowData = $gridList.getRowData ( cl );

                                    // 알람등급 아이콘 으로 변환
                                    if ( rowData.alarmGradCd == "ALVL01" )// Notice
                                    {
                                        rowData.alarmGradKorNm = "<span class='t_green'>Notice</span>";
                                        rowData.alarmGradEngNm = "<span class='t_green'>Notice</span>";
                                    } else if ( rowData.alarmGradCd == "ALVL02" )// Wanning
                                    {
                                        rowData.alarmGradKorNm = "<span class='t_yellow'>Warning</span>";
                                        rowData.alarmGradEngNm = "<span class='t_yellow'>Warning</span>";
                                    } else if ( rowData.alarmGradCd == "ALVL03" )// Fault
                                    {
                                        rowData.alarmGradKorNm = "<i class='icon_fault02'></i> <span class='t_red'>Fault</span>";
                                        rowData.alarmGradEngNm = "<i class='icon_fault02'></i> <span class='t_red'>Fault</span>";

                                    } else if ( rowData.alarmGradCd == "ALVL04" )// Disconnect
                                    {
                                        rowData.alarmGradKorNm = "<span class='t_gray'>Disconnect</span>";
                                        rowData.alarmGradEngNm = "<span class='t_gray'>Disconnect</span>";
                                    }
                                    // $gridList.setCell ( cl, "alarmGradKorNm", rowData.alarmGradKorNm );

                                    // 메일발송대상자
                                    if ( rowData.mailSndSysCharger != "0" && rowData.mailSndCorprCharger != "0" )
                                    {
                                        rowData.mailSendTrget = i18nMessage.msg_administrator + ", "
                                                + i18nMessage.msg_staff;
                                    } else if ( rowData.mailSndSysCharger != "0" && rowData.mailSndCorprCharger == "0" )
                                    {
                                        rowData.mailSendTrget = i18nMessage.msg_administrator;
                                    } else if ( rowData.mailSndSysCharger == "0" && rowData.mailSndCorprCharger != "0" )
                                    {
                                        rowData.mailSendTrget = i18nMessage.msg_staff;
                                    } else
                                    {
                                        rowData.mailSendTrget = i18nMessage.msg_unspecified;
                                    }
                                    // $gridList.setCell ( cl, "mailSendTrget", rowData.mailSendTrget );

                                    // sms발송대상자
                                    if ( rowData.smsSndSysCharger != "0" && rowData.smsSndCorprCharger != "0" )
                                    {
                                        rowData.smsSendTrget = i18nMessage.msg_administrator + ", "
                                                + i18nMessage.msg_staff;
                                    } else if ( rowData.smsSndSysCharger != "0" && rowData.smsSndCorprCharger == "0" )
                                    {
                                        rowData.smsSendTrget = i18nMessage.msg_administrator;
                                    } else if ( rowData.smsSndSysCharger == "0" && rowData.smsSndCorprCharger != "0" )
                                    {
                                        rowData.smsSendTrget = i18nMessage.msg_staff;
                                    } else
                                    {
                                        rowData.smsSendTrget = i18nMessage.msg_unspecified;
                                    }
                                    // $gridList.setCell ( cl, "smsSndSysCharger", rowData.smsSndSysCharger );

                                    $gridList.jqGrid ( 'setRowData', cl, rowData );

                                    // checkbox 처리
                                    $checkboxs.eq ( i ).attr ( {
                                        name : 'tagId',
                                        value : rowData.tagId
                                    } ).addClass ( 'tagIds' );
                                }

                                if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                                {
                                    enableJqgridCheckbox ( $gridList, $checkboxs )
                                } else
                                {
                                    disableJqgridCheckbox ( $gridList, $checkboxs )
                                }
                            }
                        },

                        // Row 선택시
                        onSelectRow : function ( rowId, status )
                        {
                            var searchEqmtGrpCd = $ ( '#searchEqmtGrpCd' ).val ();
                            var alarmGradCd = [];
                            $ ( '.tform_wrap .f_chk input' ).each ( function ()
                            {
                                var $that = $ ( this );
                                var gradVal = $that.val ();
                                if ( gradVal === 'on' )
                                {
                                    alarmGradCd.push ( $that.attr ( 'id' ) );
                                }
                            } );
                            var searchKey = $ ( '#searchKey' ).val ();
                            var searchValue = $ ( '#searchValue' ).val ();
                            var $gridList = $ ( '#gridList' );
                            var rowData = $gridList.getRowData ( rowId );

                            var tagId = encodeURIComponent ( rowData.tagId )

                            location.href = contextPath + '/hom/masterdata/alarm/view.do?tagId=' + tagId
                                    + '&searchEqmtGrpCd=' + searchEqmtGrpCd + '&alarmGradCd=' + alarmGradCd.toString ()
                                    + '&searchKey=' + searchKey + '&searchValue=' + searchValue;
                        }

                    /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
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
    var $selBox = $ ( '#searchEqmtGrpCd' );
    var $searchInfoTy = $ ( '#searchInfoTy' );
    var $chkBox = $ ( ".chk" );

    var $notice = $ ( '#notice' );
    var $warning = $ ( '#warning' );
    var $fault = $ ( '#fault' );
    var $disconnect = $ ( '#disconnect' );

    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );

    $selBox.change ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue, $selBox, $searchInfoTy, $notice, $warning, $fault, $disconnect );

    } );
    
    $searchInfoTy.change ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue, $selBox, $searchInfoTy, $notice, $warning, $fault, $disconnect );

    } );

    $chkBox.click ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue, $selBox, $searchInfoTy,$notice, $warning, $fault, $disconnect );

    } );

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, $searchKey, $searchValue, $selBox, $searchInfoTy,$notice, $warning, $fault, $disconnect );
    } );

    $searchValue.keypress ( function ( event )
    {
        if ( event.keyCode === 13 )
        {
            reloadJqgrid ( $gridList, $searchKey, $searchValue, $selBox, $searchInfoTy, $notice, $warning, $fault, $disconnect );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, $searchKey, $searchValue, $searchEqmtGrpCd, $searchInfoTy, $notice, $warning, $fault, $disconnect )
{

    $gridList.setGridParam ( {
        postData : {
            searchKey : $ ( ":selected", $searchKey ).val (),
            searchKeyword : $searchValue.val (),
            searchEqmtGrpCd : $ ( ":selected", $searchEqmtGrpCd ).val (),
            searchInfoTy : $ ( ":selected", $searchInfoTy ).val (),
            notice : $notice.val (),
            warning : $warning.val (),
            fault : $fault.val (),
            disconnect : $disconnect.val (),
        }
    } ).trigger ( 'reloadGrid' );

}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );
}

// jqgrid 편집 disable 처리
function disableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'showCol', [ 'rn' ] );
    $gridList.jqGrid ( 'hideCol', [ 'cb' ] );

    // onSelectRow event 적용
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return true;
        }
    } );
}
// jqgrid end

// 체크박스 초기화
function init ()
{
    var $alarmGradCd = $ ( '.tform_wrap .f_chk input' );
    if ( alarmGradCdWithComma !== '' )
    {
        var alarmGradCdArr = alarmGradCdWithComma.split ( ',' );
        $alarmGradCd.each ( function ()
        {
            var $that = $ ( this );
            var flag = false;
            _.each ( alarmGradCdArr, function ( grad )
            {
                if ( $that.attr ( 'id' ) === grad )
                {
                    $that.val ( 'on' ).prop ( 'checked', true ).trigger ( 'change' );
                    flag = true;
                }
            } );

            if ( !flag )
            {
                $that.val ( 'off' ).prop ( 'checked', false ).trigger ( 'change' );
            }
        } );
    } else
    {
        $alarmGradCd.each ( function ()
        {
            $ ( this ).val ( 'on' ).prop ( 'checked', true ).trigger ( 'change' );
        } );
    }
}
// 체크박스 on/off
function ckbox ( $id )
{
    var isChecked = $ ( $id ).is ( ":checked" );

    if ( isChecked == false )
    {
        $ ( $id ).val ( "off" );
    } else if ( isChecked == true )
    {
        $ ( $id ).val ( "on" );
    }
}

// 필터링 알람등급 notice
$ ( "#notice" ).click ( function ()
{
    var $id = $ ( '#notice' );
    ckbox ( $id );
    searchJqgrid ();

} );

// 필터링 알람등급 warning
$ ( "#warning" ).click ( function ()
{
    var $id = $ ( '#warning' );
    ckbox ( $id );
    searchJqgrid ();

} );

// 필터링 알람등급 fault
$ ( "#fault" ).click ( function ()
{
    var $id = $ ( '#fault' );
    ckbox ( $id );
    searchJqgrid ();

} );

// 필터링 알람등급 disconnect
$ ( "#disconnect" ).click ( function ()
{
    var $id = $ ( '#disconnect' );
    ckbox ( $id );
    searchJqgrid ();

} );

// 메시지 체크
function checkMessage ()
{
    if ( paramDelete )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDelete,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    }
}

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );
    $btnExcel.on ( 'click', function ()
    {
        var $selBox = $ ( '#searchEqmtGrpCd' );
        var $searchInfoTy = $ ( '#searchInfoTy' );
        var $searchKey = $ ( '#searchKey' );
        var $searchValue = $ ( '#searchValue' );

        var $notice = $ ( '#notice' );
        var $warning = $ ( '#warning' );
        var $fault = $ ( '#fault' );
        var $disconnect = $ ( '#disconnect' );

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        var params = {
            searchKey : $ ( ":selected", $searchKey ).val (),
            searchKeyword : encodeURIComponent ( $searchValue.val () ),
            searchEqmtGrpCd : $ ( ":selected", $selBox ).val (),
            searchInfoTy : $ ( ":selected", $searchInfoTy ).val (),
            notice : $notice.val (),
            warning : $warning.val (),
            fault : $fault.val (),
            disconnect : $disconnect.val (),
            menuName : menuName
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;
    } );
}

function clickRegBtn ()
{
    var $btnAlarmRegist = $ ( '#btn_alarm_regist a' );
    var $searchEqmtGrpCd = $ ( '#searchEqmtGrpCd' );
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    var $alarmGradCd = $ ( '.tform_wrap .f_chk input' );
    $btnAlarmRegist.on ( 'click', function ()
    {
        var alarmGradCd = [];
        var searchEqmtGrpCd = $searchEqmtGrpCd.val ();
        var searchKey = $searchKey.val ();
        var searchValue = $searchValue.val ();
        $alarmGradCd.each ( function ()
        {
            var $that = $ ( this );
            var gradVal = $that.val ();
            if ( gradVal === 'on' )
            {
                alarmGradCd.push ( $that.attr ( 'id' ) );
            }
        } );

        location.href = $btnAlarmRegist.attr ( 'href' ) + '&searchEqmtGrpCd=' + searchEqmtGrpCd + '&alarmGradCd='
                + alarmGradCd.toString () + '&searchKey=' + searchKey + '&searchValue=' + searchValue;

        return false;
    } );
}

$ ( function ()
{
    jQuery.ajaxSettings.traditional = true;
    customizeForm ();
    init ();
    // initDatetimepicker ();
    customizeJqgrid ();
    checkMessage ();
    searchJqgrid ();
    clickBtnExcel ();
    clickRegBtn ();
} );

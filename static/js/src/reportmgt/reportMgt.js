// 리포트 메일전송 관련 정보
var reportSendInfo = null;

// form element customize
function customizeForm ()
{
    $ ( '#rptMbySectn' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    // 설비 구분
    var $dateType1 = $ ( '#itemTyCd, .customize_select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    // 국가,SPC 구분
    var $dateType1 = $ ( '#nationId, #spcId' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    $ ( '#pvId' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );

    // 검색 조건
    // var $dateType = $ ( '#searchKey' ).customizeSelect ( {
    // width : 80,
    // paddingHorizontal : 15,
    // height : 30,
    // color : '#3c3c3c',
    // initClass : 'custom-form-select03',
    // focusClass : 'custom-form-focused03'
    // } );

}

function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );

    // 조회기간
    var $date = $ ( '.search_area03 .date' );
    var $dateType = $ ( '#rptCycleCd' );
    $dateType.on ( 'change', function ( event )
    {

        var selectedType = $ ( ":selected", this ).val ();
        if ( selectedType === 'RCT01' )
        {
            selectedType = homConstants.dateTypeYYYYMMDD
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === 'RCT02' )
        {
            selectedType = homConstants.dateTypeYYYYMMDD
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === 'RCT03' )
        {
            selectedType = homConstants.dateTypeYYYYMM
            className = staticVariable.formatYYYYMM;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedType, false, false );
        var $dateBox = $ ( '.' + className );
        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate );
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );
        $dateBox.trigger ( 'changeDate' );
    } );

    $dateType.trigger ( 'change' );

}

// jqgrid start

/**
 * KPI 정보 조회
 */
function searchKpi ()
{
    var dateType = $ ( '#rptCycleCd' ).val ();
    var className = null;

    if ( dateType === 'RCT01' )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === 'RCT02' )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === 'RCT03' )
    {
        className = staticVariable.formatYYYYMM;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();

    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    $ ( '#stdrYm' ).val ( pureFromDate );
    $ ( '#stdrDt' ).val ( pureToDate );

    $ ( '#hidDateType' ).val ( $ ( '#rptCycleCd' ).val () );

}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;
    var $totalRowCount = $ ( "#totalRowCount" );
    var $rptMbySectn = $ ( '#rptMbySectn' );
    var $rptTyCd = $ ( '#rptTyCd' );
    var $spcId = $ ( '#spcId' );
    var $rptCycleCd = $ ( '#rptCycleCd' );
    var $pvId = $ ( '#pvId' );
    var $rptMbyId = $ ( '#pvId' );

    paramRptMbySectn = $ ( ":selected", $ ( '#rptMbySectn' ) ).val ();

    paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
    paramNationId = $ ( ":selected", $ ( '#nationId' ) ).val ();
    paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
    if ( typeof $ ( "#pvId" ) != 'undefined' )
    {
        paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
    }
    // alert ( $pvId );
    // alert ( paramPvId );
    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();
    paramStdrYm = $ ( "#stdrYm" ).val ();
    paramStdrDt = $ ( "#stdrDt" ).val ();

    var paramFromDate = $ ( "#stdrYm" ).val ();
    var paramToDate = $ ( "#stdrDt" ).val ();

    $rptMbySectn.on ( 'change', function ()
    {
        paramRptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();

        if ( 'RDT02' == paramRptMbySectn )
        {
            $ ( '#pvId' ).parent ().parent ().hide ();
        } else
        {
            $ ( '#pvId' ).parent ().parent ().show ();
        }

    } );

    $rptTyCd.on ( 'change', function ()
    {
        paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
        if ( 'RPT01' == paramRptTyCd )
        {
            $ ( "#rptCycleCd" ).val ( 'RCT03' ).trigger ( 'change' );
        }
    } );

    $spcId.on ( 'change', function ()
    {
        paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
    } );

    $pvId.on ( 'change', function ()
    {
        paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();

    } );

    $rptCycleCd.on ( 'change', function ()
    {
        paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();
    } );

    if ( paramIsOzView == true )
    {
        colModel = [
                {
                    name : 'rptTyNm',
                    width : 220,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'stdrDt',
                    width : 220,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'rptDt',
                    width : 220,
                    align : 'center',
                    fixed : true,
                    formatter : customFormat
                },
                {
                    name : 'wrterNm',
                    width : 220,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'confmerNm',
                    width : 220,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'buttonView',
                    width : 220,
                    align : 'center',
                    sortable : false,
                    fixed : true,
                    formatter : function ( cellValue, options, rowObject )
                    {
                        return '<a href="' + contextPath + '/hom/reportmgt/reportview.do?rptSeqString='
                                + rowObject.rptSeqString + '" class="btn_report_view btn_popup">'
                                + i18nMessage.msg_reportPreview + '</a>';
                    }
                }, {
                    name : 'regDt',
                    width : 230,
                    align : 'center',
                    fixed : true
                }, {
                    name : 'rptSeq',
                    hidden : true
                }, {
                    name : 'rptMbyId',
                    hidden : true
                }, {
                    name : 'pvId',
                    hidden : true
                }, {
                    name : 'spcId',
                    hidden : true
                }, {
                    name : 'rptTyCd',
                    hidden : true
                }, {
                    name : 'rptCycleCd',
                    hidden : true
                }, {
                    name : 'rptMbySectn',
                    hidden : true
                } ];
    } else
    {
        colModel = [
                {
                    name : 'rptTyNm',
                    width : 193,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'stdrDt',
                    width : 190,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'rptDt',
                    width : 190,
                    align : 'center',
                    fixed : true,
                    formatter : customFormat
                },
                {
                    name : 'wrterNm',
                    width : 190,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'confmerNm',
                    width : 190,
                    align : 'center',
                    fixed : true
                },
                {
                    name : 'buttonView',
                    width : 200,
                    align : 'center',
                    sortable : false,
                    fixed : true,
                    formatter : function ( cellValue, options, rowObject )
                    {
                        return '<a href="' + contextPath + '/hom/reportmgt/reportview.do?rptSeqString='
                                + rowObject.rptSeqString + '" class="btn_report_view btn_popup">'
                                + i18nMessage.msg_reportPreview + '</a>';
                    }
                },
                {
                    name : 'buttonSend',
                    width : 200,
                    align : 'center',
                    sortable : false,
                    fixed : true,
                    formatter : function ( cellValue, options, rowObject )
                    {
                        return '<a href="'
                                + contextPath
                                + '/hom/reportmgt/reportMgtSendPopup.do" class="btn_mail_trans btn_popup" data-row-id="'
                                + options.rowId + '">' + i18nMessage.msg_send + '</a>';
                    }
                }, {
                    name : 'regDt',
                    width : 190,
                    align : 'center',
                    fixed : true
                }, {
                    name : 'rptSeq',
                    hidden : true
                }, {
                    name : 'rptMbyId',
                    hidden : true
                }, {
                    name : 'pvId',
                    hidden : true
                }, {
                    name : 'spcId',
                    hidden : true
                }, {
                    name : 'rptTyCd',
                    hidden : true
                }, {
                    name : 'rptCycleCd',
                    hidden : true
                }, {
                    name : 'rptMbySectn',
                    hidden : true
                } ];
    }

    if ( paramIsOzView == true )
    {
        if ( lang === locale.korea || lang === locale.korean )
        {
            colNames = [ i18nMessage.msg_type, i18nMessage.msg_standardDate, i18nMessage.msg_reportDays,
                    i18nMessage.msg_writer, i18nMessage.msg_approver, i18nMessage.msg_readReport,
                    i18nMessage.msg_writeDays, 'hiddenRptSeq', 'hiddenRptMbyId', 'hiddenPvId ', 'hiddenSpcId',
                    'hiddenRptTyCd ', 'hiddenRptCycleCd ', 'hiddenRptMbySectn' ];

        } else
        {
            colNames = [ i18nMessage.msg_type, i18nMessage.msg_standardDate, i18nMessage.msg_reportDays,
                    i18nMessage.msg_writer, i18nMessage.msg_approver, i18nMessage.msg_readReport,
                    i18nMessage.msg_writeDays, 'hiddenRptSeq', 'hiddenRptMbyId', 'hiddenPvId ', 'hiddenSpcId',
                    'hiddenRptTyCd ', 'hiddenRptCycleCd ', 'hiddenRptMbySectn' ];

        }
    } else
    {
        if ( lang === locale.korea || lang === locale.korean )
        {
            colNames = [ i18nMessage.msg_type, i18nMessage.msg_standardDate, i18nMessage.msg_reportDays,
                    i18nMessage.msg_writer, i18nMessage.msg_approver, i18nMessage.msg_readReport,
                    i18nMessage.msg_emailSend, i18nMessage.msg_writeDays, 'hiddenRptSeq', 'hiddenRptMbyId',
                    'hiddenPvId ', 'hiddenSpcId', 'hiddenRptTyCd ', 'hiddenRptCycleCd ', 'hiddenRptMbySectn' ];

        } else
        {
            colNames = [ i18nMessage.msg_type, i18nMessage.msg_standardDate, i18nMessage.msg_reportDays,
                    i18nMessage.msg_writer, i18nMessage.msg_approver, i18nMessage.msg_readReport,
                    i18nMessage.msg_emailSend, i18nMessage.msg_writeDays, 'hiddenRptSeq', 'hiddenRptMbyId',
                    'hiddenPvId ', 'hiddenSpcId', 'hiddenRptTyCd ', 'hiddenRptCycleCd ', 'hiddenRptMbySectn' ];

        }
    }

    // jqgrid
    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/reportmgt/list.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 575,
                autowidth : true,
                shrinkToFit : false,

                postData : {
                    rptMbySectn : paramRptMbySectn == 'all' ? '' : paramRptMbySectn,
                    rptTyCd : paramRptTyCd == 'all' ? '' : paramRptTyCd,
                    rptCycleCd : paramRptCycleCd == 'all' ? '' : paramRptCycleCd,
                    nationId : paramNationId == 'all' ? '' : paramNationId,
                    spcId : paramSpcId == 'all' ? '' : paramSpcId,
                    pvId : paramPvId == 'all' ? '' : paramPvId,
                    fromDate : paramFromDate,
                    toDate : paramToDate

                },
                colNames : colNames,
                colModel : colModel,
                sortname : 'rptSeq',
                sortorder : 'asc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                async : false,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridList' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $totalRowCount.html ( resultText );

                    if ( data.records === 0 )
                    {

                        $gqNodata.show ();

                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( 'getDataIDs' );

                        if ( paramIsOzView == false )
                        {
                            showMailSendPopup ();
                        }
                        showPopup ();
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    if ( paramIsOzView == false )
                    {
                        var $gridList = $ ( '#gridList' );
                        var rowData = $gridList.getRowData ( rowId );

                        var dateType = $ ( '#rptCycleCd' ).val ();
                        var className = null;

                        if ( dateType === 'RCT01' )
                        {
                            className = staticVariable.formatYYYYMMDD;
                        } else if ( dateType === 'RCT02' )
                        {
                            className = staticVariable.formatYYYYMMDD;
                        } else if ( dateType === 'RCT03' )
                        {
                            className = staticVariable.formatYYYYMM;
                        }

                        paramStdrYm = $ ( '#container #' + className + '_from_date' ).val ();
                        paramStdrDt = $ ( '#container #' + className + '_to_date' ).val ();

                        // paramStdrYm = $ ( "#stdrYm" ).val ();
                        // paramStdrDt = $ ( "#stdrDt" ).val ();

                        var varParamList = '&paramVarRptMbySectn=' + paramRptMbySectn + '&paramVarRptTyCd='
                                + paramRptTyCd + '&paramVarNationId=' + paramNationId + '&paramVarSpcId=' + paramSpcId
                                + '&paramVarRptCycleCd=' + paramRptCycleCd + '&paramVarPvId=' + paramPvId
                                + '&paramVarStdrYm=' + paramStdrYm + '&paramVarStdrDt=' + paramStdrDt;

                        location.href = contextPath + '/hom/reportmgt/view.do?rptSeq=' + rowData.rptSeq + ''
                                + varParamList;
                    }
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

    $btn_search.on ( 'click', function ()
    {
        // if ( paramFirstLoad == false )
        // {
        // customizeJqgrid ();
        // paramFirstLoad = true;
        // } else
        // {
        reloadJqgrid ( $gridList );
        // }
    } );

}

// jqgrid reload
function reloadJqgrid ( $gridList )
{

    paramRptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();

    paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();

    paramNationId = $ ( ":selected", $ ( "#nationId" ) ).val ();
    paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
    paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();

    searchKpi ();
    paramFromDate = $ ( "#stdrYm" ).val ();
    paramToDate = $ ( "#stdrDt" ).val ();

    $gridList.setGridParam ( {
        postData : {

            nationId : paramNationId === 'all' ? '' : paramNationId,
            spcId : paramSpcId === 'all' ? '' : paramSpcId,
            rptMbySectn : paramRptMbySectn === 'all' ? '' : paramRptMbySectn,
            rptTyCd : paramRptTyCd === 'all' ? '' : paramRptTyCd,
            rptCycleCd : paramRptCycleCd === 'all' ? '' : paramRptCycleCd,
            pvId : paramPvId === 'all' ? '' : paramPvId,
            fromDate : paramFromDate,
            toDate : paramToDate
        }
    } ).trigger ( 'reloadGrid' );
}

// 오즈 보기 팝업창
function showPopup ()
{
    var $btnPopup = $ ( '.btn_report_view' );
    if ( typeof $btnPopup !== 'undefined' )
    {
        $btnPopup.magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll',
            closeOnContentClick : false,
            closeOnBgClick : false
        } );

        // $ ( '.btn_popup' ).magnificPopup ( {
        // type : 'ajax',
        // alignTop : false,
        // overflowY : 'scroll'
        // } );
    }
}

// 메일 전송 팝업
function showMailSendPopup ()
{
    var $mailTemplatePopup = $ ( '.btn_mail_trans' );
    $mailTemplatePopup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                $ ( '#btn_close_template' ).on ( 'click', function ()
                {
                    $mailTemplatePopup.magnificPopup ( 'close' );
                } );

                var rowId = $.magnificPopup.instance.st.el.data ( 'row-id' );
                var rowData = $ ( '#gridList' ).getRowData ( rowId );

                reportSendInfo = {
                    rptSeq : rowData.rptSeq,
                    rptTyCd : rowData.rptTyCd,
                    rptCycleCd : rowData.rptCycleCd,
                    rptMbySectn : rowData.rptMbySectn
                };
            },
            afterClose : function ()
            {
                $ ( '#btn_close_template' ).off ( 'click' );
            }
        }
    } );
}

function showRptNewRegister ()
{
    var $btnPopup = $ ( '#all_reflct_popup' );
    if ( typeof $btnPopup !== 'undefined' )
    {
        if ( $btnPopup.attr ( 'href' ) !== undefined )
        {
            var href = $btnPopup.attr ( 'href' ).split ( '?' );
            {
                $btnPopup.attr ( 'href', href );
            }

            $btnPopup.magnificPopup ( {
                type : 'ajax',
                alignTop : false,
                overflowY : 'scroll',
                closeOnContentClick : false,
                closeOnBgClick : false
            } );
        }
    }
}

// 국가별 법인 정보 가져오기
function getNationPvInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var tpl = getTemplate ( templates.paramSpcInfoSelect );

    $nation.on ( 'change', function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/asset/companyRepayFund/selectMainSpcInfoList.ajax',
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
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            paramSpcId : paramSpcId,
                            spcInfoList : json.data
                        } );

                        $spcId.empty ().html ( html ).trigger ( 'change' );

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
    } );
}

// 국가법인별 발전소 정보 가져오기
function getNationSpcPvInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var $pvId = $ ( '#pvId' );
    var tpl = getTemplate ( templates.paramPvInfoSelect );

    $spcId.on ( 'change', function ( event )
    {

        var params = {
            nationId : $ ( ':selected', $ ( '#nationId' ) ).val (),
            spcId : $ ( ':selected', $ ( this ) ).val ()
        };
        $.ajax ( {
            url : contextPath + '/hom/reportmgt/selectMainPvInfoList.ajax',
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
                            lang : lang,
                            locale : locale,
                            msg_selection : i18nMessage.msg_selection,
                            paramPvId : paramPvId,
                            pvInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'create' );
                        $pvId.trigger ( 'change' );
                        paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
                        if ( paramFirstLoad == false )
                        {
                            // alert ( '[' + paramPvId + '] ' + $ ( '#pvId' ).is ( ':visible' ) );

                            // if ( $ ( '#pvId' ).is ( ':visible' ) == true )
                            if ( paramPvId != undefined )
                            {
                                customizeJqgrid ();
                                paramFirstLoad = true
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

function customFormat ( cellValue, options, rowdata, action )
{
    return homUtil.addNumberComma ( cellValue );
    // return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

function initSearchParam ()
{
    if ( '' != paramRptCycleCd )
    {
        $ ( '#rptCycleCd' ).val ( paramRptCycleCd ).trigger ( 'change' );
    }
    if ( '' != paramStdrYm )
    {
        $ ( '#yyyymmdd_from_date' ).val ( paramStdrYm ).trigger ( 'change' );
        $ ( '#yyyymm_from_date' ).val ( paramStdrYm ).trigger ( 'change' );
        $ ( '#yyyy_from_date' ).val ( paramStdrYm ).trigger ( 'change' );
    }
    if ( '' != paramStdrDt )
    {
        $ ( '#yyyymmdd_to_date' ).val ( paramStdrDt ).trigger ( 'change' );
        $ ( '#yyyymm_to_date' ).val ( paramStdrDt ).trigger ( 'change' );
        $ ( '#yyyy_to_date' ).val ( paramStdrDt ).trigger ( 'change' );
    }

}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    initSearchParam ();

    getNationSpcPvInfo ();
    getNationPvInfo ();
    searchKpi ();
    // customizeJqgrid ();
    showRptNewRegister ();
    searchJqgrid ();

    $ ( '#rptTyCd' ).trigger ( 'change' );
    $ ( '#nationId' ).trigger ( 'change' );
} );
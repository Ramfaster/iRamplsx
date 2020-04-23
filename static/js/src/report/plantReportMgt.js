// 리포트 메일전송 관련 정보
var reportSendInfo = null;

// form element customize
function customizeForm ()
{
    var $dateType1 = $ ( '#itemTyCd, .customize_select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
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
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );

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
    var $date = $ ( '.search_area04 .date' );
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
    var $rptCycleCd = $ ( '#rptCycleCd' );
    var $pvId = $ ( '#pvId' );
    var $rptMbyId = $ ( '#pvId' );

    var paramPvId = $pvId.val ();

    paramRptMbySectn = $ ( '#rptMbySectn' ).val ();

    paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();

    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();
    paramStdrYm = $ ( "#stdrYm" ).val ();
    paramStdrDt = $ ( "#stdrDt" ).val ();

    var paramFromDate = $ ( "#stdrYm" ).val ();
    var paramToDate = $ ( "#stdrDt" ).val ();

    $rptTyCd.on ( 'change', function ()
    {
        paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
        if ( 'RPT01' == paramRptTyCd )
        {
            $ ( "#rptCycleCd" ).val ( 'RCT03' ).trigger ( 'change' );
        }
    } );

    $rptCycleCd.on ( 'change', function ()
    {
        paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();
    } );

    colModel = [
            {
                name : 'rptTyNm',
                width : 223,
                align : 'center',
                fixed : true
            },
            {
                name : 'stdrDt',
                width : 223,
                align : 'center',
                fixed : true
            },
            {
                name : 'rptDt',
                width : 223,
                align : 'center',
                fixed : true,
                formatter : customFormat
            },
            {
                name : 'wrterNm',
                width : 223,
                align : 'center',
                fixed : true
            },
            {
                name : 'confmerNm',
                width : 223,
                align : 'center',
                fixed : true
            },
            {
                name : 'buttonView',
                width : 223,
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
                width : 233,
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

                        showPopup ();
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    // if ( paramIsOzView == false )
                    // {
                    // var $gridList = $ ( '#gridList' );
                    // var rowData = $gridList.getRowData ( rowId );
                    //
                    // location.href = contextPath + '/hom/reportmgt/view.do?rptSeq=' + rowData.rptSeq;
                    // }
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
        reloadJqgrid ( $gridList );
    } );

}

// jqgrid reload
function reloadJqgrid ( $gridList )
{

    paramRptMbySectn = $ ( "#rptMbySectn" ).val ();

    paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();

    paramPvId = $ ( "#pvId" ).val ();

    searchKpi ();
    paramFromDate = $ ( "#stdrYm" ).val ();
    paramToDate = $ ( "#stdrDt" ).val ();

    $gridList.setGridParam ( {
        postData : {
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

function customFormat ( cellValue, options, rowdata, action )
{
    return homUtil.addNumberComma ( cellValue );
    // return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    searchKpi ();
    // customizeJqgrid ();
    searchJqgrid ();

    // if ( '' == paramNationId )
    // {
    // $ ( '#nationId' ).val ( acntNationId ).trigger ( 'change' );
    // }

    if ( paramFirstLoad == false )
    {
        customizeJqgrid ();
        paramFirstLoad = true
    }

} );
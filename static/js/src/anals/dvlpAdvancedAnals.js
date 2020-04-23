var chkcell = {
    cellId : undefined,
    chkval : undefined
};

var chkSumcell = {
    cellId : undefined,
    chkval : undefined
};

var chartOption;
var chartOptionEnergy;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.image_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );

    var $imageType = $ ( '.image_type1' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
    } );

    // 조회기간
    var $dateType = $ ( '#dateType' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

// init datetimepicker
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
    var $dateType = $ ( '#dateType' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();
        var className = "";

        if ( selectedType === 'D' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'M' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'Y' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

/**
 * datepicker의 변경에 따른 날짜를 설정한다.
 */
function setDatepickerDate ()
{
    $ ( '.date' ).change ( function ()
    {
        var dateType = $ ( "#dateType" ).val ();
        var fromDate = "";
        var toDate = "";
        if ( dateType === "D" ) // 일
        {
            fromDate = $ ( '#date01' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date04' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate.substring ( 0, 6 ) );
            $ ( '#hidToStdrYM' ).val ( toDate.substring ( 0, 6 ) );
        } else if ( dateType === "M" ) // 월
        {
            fromDate = $ ( '#date02' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date05' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate );
            $ ( '#hidToStdrYM' ).val ( toDate );
        } else if ( dateType === "Y" ) // 년
        {
            fromDate = $ ( '#date03' ).val ().replace ( /-/g, '' );
            toDate = $ ( '#date06' ).val ().replace ( /-/g, '' );

            $ ( '#hidFromStdrYM' ).val ( fromDate );
            $ ( '#hidToStdrYM' ).val ( toDate );
        }

        $ ( "#hidFromDate" ).val ( fromDate );
        $ ( "#hidToDate" ).val ( toDate );
    } );
}

/**
 * 기간 타이틀을 설정한다. *
 */
function setPeriodTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = null;
    var toDate = null;
    var result = false;

    if ( dateType === "D" ) // 일
    {
        fromDate = $ ( '#date01' ).val ();
        toDate = $ ( '#date04' ).val ();
    } else if ( dateType === "M" ) // 월
    {
        fromDate = $ ( '#date02' ).val ();
        toDate = $ ( '#date05' ).val ();
    } else if ( dateType === "Y" ) // 년
    {
        fromDate = $ ( '#date03' ).val ();
        toDate = $ ( '#date06' ).val ();
    }

    // 발전량 현황 타이틀
    var isChecked = $ ( "#radioIvt" ).prop ( 'checked' );
    if ( isChecked )
    {
        // 인버터
        $ ( '#period1' ).text (
                fromDate + "~" + toDate + " " + i18nMessage.msg_ivt + " " + i18nMessage.msg_facilityCapacity + " / "
                        + i18nMessage.msg_ratio );
        $ ( '#period2' ).text ( fromDate + "~" + toDate + " " + i18nMessage.msg_ivt + " " + i18nMessage.msg_energy );
        $ ( '#periodRank' ).text (
                fromDate + "~" + toDate + " " + i18nMessage.msg_ivt + " " + i18nMessage.msg_energyCurrentStatus );
    } else
    {
        // 발전소
        $ ( '#period1' ).text (
                fromDate + "~" + toDate + " " + i18nMessage.msg_electricPowerStation + " "
                        + i18nMessage.msg_facilityCapacity + " / " + i18nMessage.msg_ratio );
        $ ( '#period2' ).text (
                fromDate + "~" + toDate + " " + i18nMessage.msg_electricPowerStation + " " + i18nMessage.msg_energy );
        $ ( '#periodRank' ).text (
                fromDate + "~" + toDate + " " + i18nMessage.msg_electricPowerStation + " "
                        + i18nMessage.msg_energyCurrentStatus );
    }

}

// 단위 변경 버튼 클릭
function initUnit ()
{
    var $unitSelect = $ ( '.unit_select' );

    $ ( '.unit_select' ).on ( 'click', function ()
    {
        valueUnit = $ ( this ).data ( 'unit' );

        $unitSelect.removeClass ( 'on' );
        $ ( '.unit_select[data-unit=' + valueUnit + ']' ).addClass ( 'on' );

        // 데이터 조회
        $ ( '#btnSubmit' ).trigger ( 'click' );
    } );
}

/**
 * 날짜유형에 따라 검색 기간을 설정한다.
 */
function initParams ()
{
    // 기본 날짜유형을 "일" 로 설정
    $ ( '#date01' ).val ( homUtil.getIntervalDate ( new Date (), 'DA', -7 ) );
    $ ( '#date04' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );

    var fromDateYMD = $ ( '#date01' ).val ();
    var toDateYMD = $ ( '#date04' ).val ();

    $ ( '#hidFromDate' ).val ( fromDateYMD.replace ( /-/g, '' ) );
    $ ( '#hidToDate' ).val ( toDateYMD.replace ( /-/g, '' ) );

    // 날짜 유형 기본 일로 설정
    $ ( "#dateType option:eq(0)" ).prop ( "selected", "selected" ).trigger ( 'change' );
    $ ( "#dateType" ).change ( function ()
    {
        var date = "";
        var fromDateYMD = "";
        var toDateYMD = "";
        if ( $ ( this ).val () === "D" ) // 일
        {
            date = homUtil.getIntervalDate ( new Date (), 'DA', -7 );
            $ ( '#date01' ).val ( date );
            $ ( '#date04' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) );

            fromDateYMD = $ ( '#date01' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date04' ).val ().replace ( /-/g, '' );

        } else if ( $ ( this ).val () === "M" ) // 월
        {
            date = homUtil.getIntervalDate ( new Date (), 'MO', -7 );
            $ ( '#date02' ).val ( date );
            $ ( '#date05' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMM ) );

            fromDateYMD = $ ( '#date02' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date05' ).val ().replace ( /-/g, '' );

        } else
        // 년
        {
            date = homUtil.getIntervalDate ( new Date (), 'YE', -7 );
            $ ( '#date03' ).val ( date );
            $ ( '#date06' ).val ( homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYY ) );

            fromDateYMD = $ ( '#date03' ).val ().replace ( /-/g, '' );
            toDateYMD = $ ( '#date06' ).val ().replace ( /-/g, '' );
        }

        $ ( '#hidFromDate' ).val ( fromDateYMD );
        $ ( '#hidToDate' ).val ( toDateYMD );
    } );

    setPeriodTitle ();
}

/*
 * 검색 조건에 대한 유효성을 검사한다.
 */
function validateCondition ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = null;
    var toDate = null;
    var result = false;

    if ( dateType === "D" ) // 일
    {
        fromDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date01' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMMDD ) );
        toDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date04' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMMDD ) );
    } else if ( dateType === "M" ) // 월
    {
        fromDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date02' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMM ) );
        toDate = new Date ( homUtil.convertDateStringToFormat ( $ ( '#date05' ).val ().replace ( /-/g, '' ),
                homUtil.dateFormat.formatYYYYMM ) );
    } else if ( dateType === "Y" ) // 년
    {
        fromDate = $ ( '#date03' ).val ();
        toDate = $ ( '#date06' ).val ();
    }

    // 날짜 비교
    if ( dateType === "D" || dateType === "M" )
    {
        if ( fromDate.getTime () > toDate.getTime () )
        {
            result = true;
        }
    } else
    // 년
    {
        var diff = parseInt ( fromDate, 10 ) - parseInt ( toDate, 10 );
        if ( diff > 0 )
        {
            result = true;
        }
    }
    return result;
}

/**
 * 발전량 조회
 */
function searchEnergy ()
{
    $ ( '#btnSubmit' ).click (
            function ()
            {
                if ( validateCondition () )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_dateCanNotStartDateTheFutureEndDate,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );
                    return false;
                }

                setPeriodTitle ();

                var isChecked = $ ( "#radioIvt" ).prop ( 'checked' );
                var iSCheckedRank = $ ( "#chkRank" ).prop ( 'checked' );
                if ( isChecked )
                {
                    var dateType = $ ( '#dateType' ).val ();
                    var fromDate = $ ( '#hidFromDate' ).val ();
                    var toDate = $ ( '#hidToDate' ).val ();

                    // 인버터
                    var params = {
                        popType : "default",
                        popKind : "IVT",
                        dateType : dateType,
                        fromDate : fromDate,
                        toDate : toDate,
                        unit : valueUnit
                    };
                    var href = contextPath + "/hom/advancedanalysis/energy/dvlpAdvancedAnalsPopup.do?"
                            + $.param ( params );
                    $ ( "#defaultPopup" ).attr ( 'href', href );

                    var rankParams = {
                        popType : "rank",
                        popKind : "IVT",
                        dateType : dateType,
                        fromDate : fromDate,
                        toDate : toDate,
                        unit : valueUnit
                    };
                    var rankHref = contextPath + "/hom/advancedanalysis/energy/dvlpAdvancedAnalsRankPopup.do?"
                            + $.param ( rankParams );
                    $ ( "#rankPopup" ).attr ( 'href', rankHref );

                    if ( iSCheckedRank )
                    {
                        $ ( "#defaultSearch" ).hide ();
                        $ ( "#rankSearch" ).show ();
                        getIvtEnergyRank ();
                        $.jgrid.gridUnload ( "#rankGridList" );
                        customizeRankJqgrid ();
                        reloadRankJqgrid ( $ ( '#rankGridList' ) );
                    } else
                    {
                        $ ( "#defaultSearch" ).show ();
                        $ ( "#rankSearch" ).hide ();

                        getIvtCpcty ();
                        getIvtEnergy ();
                        $.jgrid.gridUnload ( "#gridList" );
                        customizeJqgrid ();
                        reloadJqgrid ( $ ( '#gridList' ) );
                    }

                } else
                {
                    // 발전소
                    var dateType = $ ( '#dateType' ).val ();
                    var fromDate = $ ( '#hidFromDate' ).val ();
                    var toDate = $ ( '#hidToDate' ).val ();

                    var params = {
                        popType : "default",
                        popKind : "PLANT",
                        dateType : dateType,
                        fromDate : fromDate,
                        toDate : toDate,
                        unit : valueUnit
                    };
                    var href = contextPath + "/hom/advancedanalysis/energy/dvlpAdvancedAnalsPlantPopup.do?"
                            + $.param ( params );
                    $ ( "#defaultPopup" ).attr ( 'href', href );

                    var rankParams = {
                        popType : "rank",
                        popKind : "PLANT",
                        dateType : dateType,
                        fromDate : fromDate,
                        toDate : toDate,
                        unit : valueUnit
                    };
                    var rankHref = contextPath + "/hom/advancedanalysis/energy/dvlpAdvancedAnalsPlantRankPopup.do?"
                            + $.param ( rankParams );

                    $ ( "#defaultPopup" ).attr ( 'href', href );
                    $ ( "#rankPopup" ).attr ( 'href', rankHref );

                    if ( iSCheckedRank )
                    {
                        $ ( "#defaultSearch" ).hide ();
                        $ ( "#rankSearch" ).show ();
                        getPlantEnergyRank ();
                        $.jgrid.gridUnload ( "#rankGridList" );
                        customizeRankJqgridPlant ();
                        reloadRankJqgridPlant ( $ ( '#rankGridList' ) );
                    } else
                    {
                        $ ( "#defaultSearch" ).show ();
                        $ ( "#rankSearch" ).hide ();
                        // 인버터
                        getPlantCpcty ();
                        getPlantEnergy ();
                        $.jgrid.gridUnload ( "#gridList" );
                        customizeJqgridPlant ();
                        reloadJqgridPlant ( $ ( '#gridList' ) );
                    }
                }

                showPopup ();

            } );

}

/**
 * 팝업을 보여준다.
 */
function showPopup ()
{
    $ ( '#defaultPopup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
    $ ( '#rankPopup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

// jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    var unitNm = "";

    if ( valueUnit == 'DEFAULT' )
    {
        unitNm = "(KWh)";
    } else if ( valueUnit == 'K' )
    {
        unitNm = "(KWh)";
    } else if ( valueUnit == 'M' )
    {
        unitNm = "(MWh)";
    } else if ( valueUnit == 'G' )
    {
        unitNm = "(GWh)";
    }

    var groupHeaderName = 'User';
    $ ( "#gridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + unitNm
        } ]
    } );
}

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectIvtEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 650,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                rownumbers : true,
                rowNum : 30,

                sortname : "stdrDate", // 처음 정렬될 컬럼
                sortorder : "desc", // 정렬방법 (asc/desc)
                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum,
                        i18nMessage.msg_acmslt, i18nMessage.msg_ratio + "(%)" ],

                colModel : [ {
                    name : 'stdrDate',
                    index : '',
                    align : 'center',
                    width : '80',
                // cellattr : jsFormatterCell
                }, {
                    name : 'corprNm',
                    index : '',
                    align : 'left',
                    width : '80',
                    sortable : false
                }, {
                    name : 'sumEnergy',
                    index : '',
                    align : 'right',
                    width : '80',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                // cellattr : jsFormatterCellSum
                }, {
                    name : 'energy',
                    index : '',
                    align : 'right',
                    width : '80',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'ratioEnergy',
                    index : '',
                    align : 'right',
                    width : '65',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                    }

                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                    $ ( this ).rowspan ( 1, 3 );
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
}

// jqgird customize
function customizeJqgrid ()
{
    // jqgrid
    jqGridBasic ();
    addGroupHeader ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : valueUnit
        },
    } ).trigger ( 'reloadGrid' );
}

// jqgrid start
// 헤더 병합
function addGroupHeaderRank ()
{
    var unitNm = "";

    if ( valueUnit == 'DEFAULT' )
    {
        unitNm = "(KWh)";
    } else if ( valueUnit == 'K' )
    {
        unitNm = "(KWh)";
    } else if ( valueUnit == 'M' )
    {
        unitNm = "(MWh)";
    } else if ( valueUnit == 'G' )
    {
        unitNm = "(GWh)";
    }

    var groupHeaderName = 'User';
    $ ( "#rankGridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + unitNm
        } ]
    } );
}

function jqGridBasicRank ()
{
    var tpl = getTemplate ( templates.noData );

    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $ ( '#rankGridList' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectIvtRankEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 204,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정

                rowNum : 10,

                sortname : "corprNm", // 처음 정렬될 컬럼
                sortorder : "asc", // 정렬방법 (asc/desc)
                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division, i18nMessage.msg_facilityCapacity,
                        i18nMessage.msg_facilityCapacity + " " + i18nMessage.msg_ratio + "(%)", i18nMessage.msg_energy,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_ratio + "(%)",
                        i18nMessage.msg_energy + " " + i18nMessage.msg_contrast + "(%)" ],

                colModel : [ {
                    name : 'rank',
                    index : '',
                    align : 'center',
                    width : '65',
                // cellattr : jsFormatterCell
                }, {
                    name : 'corprNm',
                    index : '',
                    align : 'left',
                    width : '198',
                    sortable : false
                }, {
                    name : 'eqmtCpcty',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                // cellattr : jsFormatterCellSum
                }, {
                    name : 'ratioEqmtCpcty',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energy',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'ratioEnergy',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyGap',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        // var rowids = $ ( this ).jqGrid ( 'getDataIDs' ); // 일단 jqgrid 데이타들의 id 값을 가져온다.
                        // $.each ( rowids, function ( idx, rowId )
                        // {
                        // rowData = $ ( this ).getRowData ( rowId );
                        // if ( rowData.energyGap > 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // } else if ( rowData.energyGap == 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // } else if ( rowData.energyGap < 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // }
                        // } );

                    }

                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                }

            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#rankGridList' ).parent ().append ( html );
    }
}

// jqgird customize
function customizeRankJqgrid ()
{
    // jqgrid
    jqGridBasicRank ();
    addGroupHeaderRank ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadRankJqgrid ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : valueUnit
        },
    } ).trigger ( 'reloadGrid' );
}

// init highcharts
function renderHighcharts ( type, kind, series, unit, dateType )
{
    if ( type == "Cpcty" )
    {
        // 설치용량
        homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

        if ( kind == "Ivt" )
        {
            // 인버터
            chartOption = {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 50,
                    marginLeft : 115
                },
                title : {
                    text : '',
                    style : {
                        display : 'none',
                    }
                },
                subtitle : {
                    text : '',
                    style : {
                        display : 'none'
                    }
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    categories : [ i18nMessage.msg_inverterCapacity ],
                    crosshair : true,
                    labels : {
                        align : 'middle',
                        x : -110
                    },
                },
                yAxis : [ {
                    min : 0,
                    title : {
                        text : i18nMessage.msg_ratio + "(%)",
                        align : 'low',
                        y : -20,
                        x : -110
                    }
                } ],
                tooltip : {
                    useHTML : true,
                    shared : true,
                    formatter : function ()
                    {
                        var tooltip = '<strong>' + this.x + '</strong>';

                        $.each ( this.points, function ()
                        {
                            tooltip += '<br /><span style="color:' + this.series.color + '">\u25CF</span>'
                                    + this.series.name + ': ' + this.y + 'KW '
                                    + homUtil.mathFloorComma ( this.percentage, staticVariable.decimalPoint ) + '%';
                        } );

                        return tooltip;
                    }
                },
                legend : {
                    enabled : false
                },
                plotOptions : {
                    bar : {
                        pointPadding : 0,
                        borderWidth : 0,
                        pointWidth : 15,
                        stacking : 'percent'
                    }
                },
                series : series
            };
        } else
        {
            chartOption = {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 50,
                    marginLeft : 115
                },
                title : {
                    text : '',
                    style : {
                        display : 'none',
                    }
                },
                subtitle : {
                    text : '',
                    style : {
                        display : 'none'
                    }
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    categories : [ i18nMessage.msg_electricPowerStationCapacity ],
                    crosshair : true,
                    labels : {
                        align : 'middle',
                        x : -110
                    },
                },
                yAxis : [ {
                    min : 0,
                    title : {
                        text : i18nMessage.msg_ratio + "(%)",
                        align : 'low',
                        y : -20,
                        x : -110
                    }
                } ],
                tooltip : {
                    useHTML : true,
                    shared : true,
                    formatter : function ()
                    {
                        var tooltip = '<strong>' + this.x + '</strong>';

                        $.each ( this.points, function ()
                        {
                            tooltip += '<br /><span style="color:' + this.series.color + '">\u25CF</span>'
                                    + this.series.name + ': ' + this.y + 'KW '
                                    + homUtil.mathFloorComma ( this.percentage, staticVariable.decimalPoint ) + '%';
                        } );

                        return tooltip;
                    }
                },
                legend : {
                    enabled : false
                },
                plotOptions : {
                    bar : {
                        pointPadding : 0,
                        borderWidth : 0,
                        pointWidth : 15,
                        stacking : 'percent'
                    }
                },
                tooltop : {
                    formatter : function ()
                    {
                        return '<b>' + this.series.name + '</b>: '
                                + homUtil.mathFloorComma ( this.percentage, staticVariable.decimalPoint ) + ' %';
                    }
                },
                series : series
            };
        }

        $ ( '#graph1' ).highcharts ( chartOption );
    } else
    {
        var dateFormat = null;
        var tooltipDateFormat = null;
        var txtFromDate = null;
        var txtToDate = null;
        var date1 = null;
        var date2 = null;

        if ( dateType === 'D' )
        {
            txtFromDate = $ ( "#date01" ).val ().replace ( /-/g, '' );
            txtToDate = $ ( "#date04" ).val ().replace ( /-/g, '' );

            date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ), 10 ) - 1,
                    txtFromDate.substring ( 6, 8 ) );
            date2 = new Date ( txtToDate.substring ( 0, 4 ), parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1,
                    txtToDate.substring ( 6, 8 ) );
            dateFormat = homUtil.dateFormat.convertMMDD;
            tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
        } else if ( dateType === 'M' )
        {
            txtFromDate = $ ( "#date02" ).val ().replace ( /-/g, '' );
            txtToDate = $ ( "#date05" ).val ().replace ( /-/g, '' );

            date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ), 10 ) - 1, 1 );
            date2 = new Date ( txtToDate.substring ( 0, 4 ), parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
            dateFormat = homUtil.dateFormat.convertYYYYMM;
            tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
        } else if ( dateType === 'Y' )
        {
            txtFromDate = $ ( "#date03" ).val ();
            txtToDate = $ ( "#date06" ).val ();

            date1 = new Date ( txtFromDate, 0, 1 );
            date2 = new Date ( txtToDate, 0, 1 );
            dateFormat = homUtil.dateFormat.convertYYYY;
            tooltipDateFormat = homUtil.dateFormat.convertYYYY;
        }

        // 발전량
        homUtil.clearHighcharts ( [ $ ( '#graph2' ).highcharts () ] );

        if ( kind == "Ivt" )
        {
            // 인버터
            chartOptionEnergy = {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 50
                },
                title : {
                    text : '',
                    style : {
                        display : 'none',
                    }
                },
                subtitle : {
                    text : '',
                    style : {
                        display : 'none'
                    }
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    type : 'datetime',
                    labels : {
                        style : {
                            color : '#3c3c3c'
                        },
                        formatter : function ()
                        {
                            var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                            return dateXAxis;
                        }
                    },
                    min : date1.getTime (),
                    max : date2.getTime ()
                },
                yAxis : {
                    min : 0,
                    title : {
                        text : i18nMessage.msg_energy + "(" + unit + ")"
                    }
                },
                tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                plotOptions : {
                    column : {
                        pointPadding : 0,
                        borderWidth : 0,
                        stacking : 'normal'
                    }
                },
                series : series
            };
        } else
        {
            chartOptionEnergy = {
                colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
                chart : {
                    marginTop : 50
                },
                title : {
                    text : '',
                    style : {
                        display : 'none',
                    }
                },
                subtitle : {
                    text : '',
                    style : {
                        display : 'none'
                    }
                },
                exporting : {
                    enabled : false
                },
                credits : {
                    enabled : false
                },
                xAxis : {
                    type : 'datetime',
                    labels : {
                        style : {
                            color : '#3c3c3c'
                        },
                        formatter : function ()
                        {
                            var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                            return dateXAxis;
                        }
                    },
                    min : date1.getTime (),
                    max : date2.getTime ()
                },
                yAxis : {
                    min : 0,
                    title : {
                        text : i18nMessage.msg_energy + "(" + unit + ")"
                    }
                },
                tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
                plotOptions : {
                    column : {
                        pointPadding : 0,
                        borderWidth : 0,
                        stacking : 'normal'
                    }
                },
                series : series
            };
        }
        // 그래프2
        $ ( '#graph2' ).highcharts ( chartOptionEnergy );
    }

    $ ( '#defaultExcel' ).unbind ( 'click' );
    // 엑셀 다운로드 버튼 이벤트
    $ ( '#defaultExcel' )
            .click (
                    function ()
                    {
                        var optionsStr = JSON.stringify ( chartOption );
                        var $graph1 = $ ( '#graph1' );

                        var exportUrl = 'http://export.highcharts.com/';
                        var dataString = "";

                        if ( $graph1.css ( 'display' ) != 'none' )
                        {
                            // dataString = encodeURI ( 'async=true&type=png&width=' + $graph1.width () + '&options=' +
                            // optionsStr );
                            dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
                        }

                        var optionsStrEnergy = JSON.stringify ( chartOptionEnergy );
                        var $graph2 = $ ( '#graph2' );
                        var dataStringEnergy = "";

                        if ( $graph2.css ( 'display' ) != 'none' )
                        {
                            dataStringEnergy = encodeURI ( 'async=true&type=png&width=' + $graph2.width ()
                                    + '&options=' + optionsStrEnergy );
                        }

                        var isIvt = $ ( "#radioIvt" ).prop ( 'checked' );
                        var dateType = $ ( '#dateType' ).val ();
                        var fromDate = $ ( '#hidFromDate' ).val ();
                        var toDate = $ ( '#hidToDate' ).val ();

                        if ( dataString != "" )
                        {
                            $.ajax ( {
                                type : 'POST',
                                data : dataString,
                                url : exportUrl,
                                success : function ( data )
                                {
                                    console.log ( 'get the file from relative url: ', exportUrl + data );
                                    if ( dataStringEnergy != "" )
                                    {
                                        $.ajax ( {
                                            type : 'POST',
                                            data : dataStringEnergy,
                                            url : exportUrl,
                                            success : function ( dataEnegry )
                                            {
                                                console.log ( 'get the file from relative energyUrl: ', exportUrl
                                                        + dataEnegry );

                                                // 엑셀 다운로드 함수 호출
                                                if ( isIvt )
                                                {
                                                    downloadExcel ( exportUrl + data, exportUrl + dataEnegry, dateType,
                                                            fromDate, toDate, isIvt );
                                                } else
                                                {
                                                    downloadExcelPlant ( exportUrl + data, exportUrl + dataEnegry,
                                                            dateType, fromDate, toDate, isIvt );
                                                }

                                            },
                                            error : function ( err )
                                            {
                                                console.log ( 'error', err.statusText );
                                            }
                                        } );
                                    } else
                                    {
                                        // 엑셀 다운로드 함수 호출
                                        if ( isIvt )
                                        {
                                            downloadExcel ( exportUrl + data, "", dateType, fromDate, toDate, isIvt );
                                        } else
                                        {
                                            downloadExcelPlant ( exportUrl + data, "", dateType, fromDate, toDate,
                                                    isIvt );
                                        }
                                    }
                                },
                                error : function ( err )
                                {
                                    console.log ( 'error', err.statusText );
                                }

                            } );
                        } else
                        {
                            if ( dataStringEnergy != "" )
                            {
                                $
                                        .ajax ( {
                                            type : 'POST',
                                            data : dataStringEnergy,
                                            url : exportUrl,
                                            success : function ( dataEnegry )
                                            {
                                                console.log ( 'get the file from relative energyUrl: ', exportUrl
                                                        + dataEnegry );

                                                // 엑셀 다운로드 함수 호출
                                                if ( isIvt )
                                                {
                                                    downloadExcel ( "", exportUrl + dataEnegry, dateType, fromDate,
                                                            toDate, isIvt );
                                                } else
                                                {
                                                    downloadExcelPlant ( "", exportUrl + dataEnegry, dateType,
                                                            fromDate, toDate, isIvt );
                                                }

                                            },
                                            error : function ( err )
                                            {
                                                console.log ( 'error', err.statusText );
                                            }
                                        } );
                            } else
                            {
                                // 엑셀 다운로드 함수 호출
                                if ( isIvt )
                                {
                                    downloadExcel ( "", "", dateType, fromDate, toDate, isIvt );
                                } else
                                {
                                    downloadExcelPlant ( "", "", dateType, fromDate, toDate, isIvt );
                                }
                            }
                        }
                    } );

}

// 그래프 데이터 조회
function getIvtCpcty ()
{
    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getIvtCpcty.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                _.each ( json.data, function ( seiresData, i )
                {
                    series.push ( {
                        type : 'bar',
                        yAxis : 0,
                        name : seiresData.corprNm,
                        // color : colors[i],
                        data : [ seiresData.eqmtCpcty ]
                    } );
                } );
                console.log ( series );
                renderHighcharts ( "Cpcty", "Ivt", series );

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

// 그래프 데이터 조회
function getIvtEnergy ()
{
    var dateType = $ ( '#dateType' ).val ();
    var params = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#hidFromDate' ).val (),
        toDate : $ ( '#hidToDate' ).val (),
        unit : valueUnit
    };

    console.log ( $ ( '#dateType' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getIvtEnergy.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                var unit = "";
                var chkData = 0;

                _.each ( json.data, function ( seriesData, i )
                {
                    if ( seriesData.unit != "" )
                    {
                        unit = seriesData.unit;
                    }

                    var data = [];
                    _.each ( seriesData.energyTrendValues, function ( energyTrendValues, i )
                    {
                        data.push ( [ homUtil.convertDateStringToLong ( energyTrendValues.stdrDate ),
                                energyTrendValues.energy ] );
                        chkData++;
                    } );

                    series.push ( {
                        type : 'column',
                        yAxis : 0,
                        name : seriesData.corprNm,
                        // color : colors[i],
                        data : data
                    } );
                } );

                if ( chkData > 0 )
                {
                    $ ( '#graph2' ).show ();
                    $ ( '#graph2NoData' ).hide ();
                    renderHighcharts ( "Energy", "Ivt", series, unit, dateType );
                } else
                {
                    $ ( '#graph2' ).hide ();
                    $ ( '#graph2NoData' ).show ();

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

// 그래프 데이터 조회
function getIvtEnergyRank ()
{
    var dateType = $ ( '#dateType' ).val ();
    var params = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#hidFromDate' ).val (),
        toDate : $ ( '#hidToDate' ).val (),
        unit : valueUnit
    };

    console.log ( $ ( '#dateType' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getIvtEnergy.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                var unit = "";
                var chkData = 0;

                _.each ( json.data, function ( seriesData, i )
                {
                    if ( seriesData.unit != "" )
                    {
                        unit = seriesData.unit;
                    }

                    var data = [];
                    _.each ( seriesData.energyTrendValues, function ( energyTrendValues, i )
                    {
                        data.push ( [ homUtil.convertDateStringToLong ( energyTrendValues.stdrDate ),
                                energyTrendValues.energy ] );
                        chkData++;
                    } );

                    series.push ( {
                        type : 'line',
                        yAxis : 0,
                        name : seriesData.corprNm,
                        // color : colors[i],
                        data : data
                    } );
                } );

                if ( chkData > 0 )
                {
                    $ ( '#rankGraph' ).show ();
                    $ ( '#rankGraphNoData' ).hide ();
                    renderHighchartsRank ( series, unit, dateType );
                } else
                {
                    renderHighchartsRank ( series, unit, dateType );
                    $ ( '#rankGraph' ).hide ();
                    $ ( '#rankGraphNoData' ).show ();

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
/*
 * 발전소 영역
 * 
 */

// 그래프 데이터 조회
function getPlantCpcty ()
{
    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getPlantCpcty.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                _.each ( json.data, function ( seiresData, i )
                {
                    series.push ( {
                        type : 'bar',
                        yAxis : 0,
                        name : seiresData.pvNm,
                        // color : colors[i],
                        data : [ seiresData.eqmtCpcty ]
                    } );
                } );
                console.log ( series );
                renderHighcharts ( "Cpcty", "Plant", series );

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

// 그래프 데이터 조회
function getPlantEnergy ()
{
    var dateType = $ ( '#dateType' ).val ();
    var params = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#hidFromDate' ).val (),
        toDate : $ ( '#hidToDate' ).val (),
        unit : valueUnit
    };

    console.log ( $ ( '#dateType' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getPlantEnergy.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                var unit = "";
                var chkData = 0;

                _.each ( json.data, function ( seriesData, i )
                {
                    if ( seriesData.unit != "" )
                    {
                        unit = seriesData.unit;
                    }

                    var data = [];
                    _.each ( seriesData.energyTrendValues, function ( energyTrendValues, i )
                    {
                        data.push ( [ homUtil.convertDateStringToLong ( energyTrendValues.stdrDate ),
                                energyTrendValues.energy ] );
                        chkData++;
                    } );

                    series.push ( {
                        type : 'column',
                        yAxis : 0,
                        name : seriesData.corprNm,
                        // color : colors[i],
                        data : data
                    } );
                } );

                if ( chkData > 0 )
                {
                    $ ( '#graph2' ).show ();
                    $ ( '#graph2NoData' ).hide ();
                    renderHighcharts ( "Energy", "Plant", series, unit, dateType );
                } else
                {
                    $ ( '#graph2' ).hide ();
                    $ ( '#graph2NoData' ).show ();

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

// 그래프 데이터 조회
function getPlantEnergyRank ()
{
    var dateType = $ ( '#dateType' ).val ();
    var params = {
        dateType : $ ( '#dateType' ).val (),
        fromDate : $ ( '#hidFromDate' ).val (),
        toDate : $ ( '#hidToDate' ).val (),
        unit : valueUnit
    };

    console.log ( $ ( '#dateType' ).val () );

    $.ajax ( {
        url : contextPath + '/hom/advancedanalysis/energy/getPlantEnergy.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var series = [];
                var yAxis = [];
                var colors = [ "#fc5d2a", "#f19ec2", "#cce198", "#80c269", "#32b16c", "#556fb5", "#7a418c", "#49351f",
                        "#d2a54e", "#7b2f2f", "#e98287", "#8585a8", "#36478a", "#926a74", "#f29a76", "#ae8ea9",
                        "#0068b7", "#4bc5c3", "#00732b", "#63a8c7", "#36478a", "#4bc5c3", "#e95fe7", "#c81526",
                        "#4c4743" ];

                var unit = "";
                var chkData = 0;

                _.each ( json.data, function ( seriesData, i )
                {
                    if ( seriesData.unit != "" )
                    {
                        unit = seriesData.unit;
                    }

                    var data = [];
                    _.each ( seriesData.energyTrendValues, function ( energyTrendValues, i )
                    {
                        data.push ( [ homUtil.convertDateStringToLong ( energyTrendValues.stdrDate ),
                                energyTrendValues.energy ] );
                        chkData++;
                    } );

                    series.push ( {
                        type : 'line',
                        yAxis : 0,
                        name : seriesData.corprNm,
                        // color : colors[i],
                        data : data
                    } );
                } );

                if ( chkData > 0 )
                {
                    $ ( '#rankGraph' ).show ();
                    $ ( '#rankGraphNoData' ).hide ();
                    renderHighchartsRank ( series, unit, dateType );

                } else
                {
                    renderHighchartsRank ( series, unit, dateType );
                    $ ( '#rankGraph' ).hide ();
                    $ ( '#rankGraphNoData' ).show ();

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

// init highcharts
function renderHighchartsRank ( series, unit, dateType )
{
    var dateFormat = null;
    var tooltipDateFormat = null;
    var txtFromDate = null;
    var txtToDate = null;
    var date1 = null;
    var date2 = null;

    if ( dateType === 'D' )
    {
        txtFromDate = $ ( "#date01" ).val ().replace ( /-/g, '' );
        txtToDate = $ ( "#date04" ).val ().replace ( /-/g, '' );

        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ), 10 ) - 1,
                txtFromDate.substring ( 6, 8 ) );
        date2 = new Date ( txtToDate.substring ( 0, 4 ), parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, txtToDate
                .substring ( 6, 8 ) );
        dateFormat = homUtil.dateFormat.convertMMDD;
        tooltipDateFormat = homUtil.dateFormat.convertYYYYMMDD;
    } else if ( dateType === 'M' )
    {
        txtFromDate = $ ( "#date02" ).val ().replace ( /-/g, '' );
        txtToDate = $ ( "#date05" ).val ().replace ( /-/g, '' );

        date1 = new Date ( txtFromDate.substring ( 0, 4 ), parseInt ( txtFromDate.substring ( 4, 6 ), 10 ) - 1, 1 );
        date2 = new Date ( txtToDate.substring ( 0, 4 ), parseInt ( txtToDate.substring ( 4, 6 ), 10 ) - 1, 1 );
        dateFormat = homUtil.dateFormat.convertYYYYMM;
        tooltipDateFormat = homUtil.dateFormat.convertYYYYMM;
    } else if ( dateType === 'Y' )
    {
        txtFromDate = $ ( "#date03" ).val ();
        txtToDate = $ ( "#date06" ).val ();

        date1 = new Date ( txtFromDate, 0, 1 );
        date2 = new Date ( txtToDate, 0, 1 );
        dateFormat = homUtil.dateFormat.convertYYYY;
        tooltipDateFormat = homUtil.dateFormat.convertYYYY;
    }

    homUtil.clearHighcharts ( [ $ ( '#rankGraph' ).highcharts () ] );

    var chartOptionRank = {
        colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
        chart : {
            marginTop : 50
        },
        legend : {
            align : 'right',
            verticalAlign : 'top',
            layout : 'vertical',
            x : 0,
            y : 15
        },
        title : {
            text : '',
            style : {
                display : 'none',
            }
        },
        subtitle : {
            text : '',
            style : {
                display : 'none'
            }
        },
        exporting : {
            enabled : false
        },
        credits : {
            enabled : false
        },
        xAxis : {
            type : 'datetime',
            labels : {
                style : {
                    color : '#3c3c3c'
                },
                formatter : function ()
                {
                    var dateXAxis = homUtil.convertDateLongToString ( this.value, dateFormat );

                    return dateXAxis;
                }
            },
            min : date1.getTime (),
            max : date2.getTime ()
        },
        yAxis : {
            min : 0,
            title : {
                text : i18nMessage.msg_energy + "(" + unit + ")"
            }
        },
        tooltip : homUtil.generateTooltip ( tooltipDateFormat, staticVariable.decimalPoint ),
        plotOptions : {
            line : {
                pointPadding : 0,
                borderWidth : 0,
                lineWidth : 1,
                marker : {
                    enabled : false
                }
            },
        },
        series : series
    };
    // 그래프
    $ ( '#rankGraph' ).highcharts ( chartOptionRank );

    $ ( '#rankExcel' ).unbind ( 'click' );
    // 엑셀 다운로드 버튼 이벤트
    $ ( '#rankExcel' ).click ( function ()
    {
        var optionsStr = JSON.stringify ( chartOptionRank );
        var $graph1 = $ ( '#rankGraph' );
        var exportUrl = 'http://export.highcharts.com/';
        var dataString = "";
        if ( $graph1.css ( 'display' ) != 'none' )
        {
            // dataString = encodeURI ( 'async=true&type=png&width=' + $graph1.width () + '&options=' + optionsStr );
            dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );
        }

        var isIvt = $ ( "#radioIvt" ).prop ( 'checked' );
        var dateType = $ ( '#dateType' ).val ();
        var fromDate = $ ( '#hidFromDate' ).val ();
        var toDate = $ ( '#hidToDate' ).val ();

        if ( dataString != "" )
        {
            $.ajax ( {
                type : 'POST',
                data : dataString,
                url : exportUrl,
                success : function ( data )
                {
                    console.log ( 'get the file from relative url: ', exportUrl + data );

                    // 엑셀 다운로드 함수 호출
                    if ( isIvt )
                    {
                        downloadExcelRank ( exportUrl + data, dateType, fromDate, toDate );
                    } else
                    {
                        downloadExcelPlantRank ( exportUrl + data, dateType, fromDate, toDate );
                    }
                },
                error : function ( err )
                {
                    console.log ( 'error', err.statusText );
                }
            } );
        } else
        {
            // 엑셀 다운로드 함수 호출
            if ( isIvt )
            {
                downloadExcelRank ( "", dateType, fromDate, toDate );
            } else
            {
                downloadExcelPlantRank ( "", dateType, fromDate, toDate );
            }
        }

    } );

}

// jqgrid start
// 헤더 병합
function addGroupHeaderPlant ()
{
    var groupHeaderName = 'User';
    $ ( "#gridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(kWh)'
        } ]
    } );
}

function jqGridBasicPlant ()
{
    var tpl = getTemplate ( templates.noData );
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectPlantEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 650,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                rownumbers : true,
                rowNum : 30,

                sortname : "stdrDate", // 처음 정렬될 컬럼
                sortorder : "desc", // 정렬방법 (asc/desc)
                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum,
                        i18nMessage.msg_acmslt, i18nMessage.msg_ratio + "(%)" ],

                colModel : [ {
                    name : 'stdrDate',
                    index : '',
                    align : 'center',
                    width : '80',
                // cellattr : jsFormatterCell
                }, {
                    name : 'corprNm',
                    index : '',
                    align : 'left',
                    width : '80',
                    sortable : false
                }, {
                    name : 'sumEnergy',
                    index : '',
                    align : 'right',
                    width : '80',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                // cellattr : jsFormatterCellSum
                }, {
                    name : 'energy',
                    index : '',
                    align : 'right',
                    width : '80',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'ratioEnergy',
                    index : '',
                    align : 'right',
                    width : '65',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                    }

                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                    $ ( this ).rowspan ( 1, 3 );
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
}

// jqgird customize
function customizeJqgridPlant ()
{
    // jqgrid
    jqGridBasicPlant ();
    addGroupHeaderPlant ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadJqgridPlant ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : valueUnit
        },
    } ).trigger ( 'reloadGrid' );
}

// jqgrid start
// 헤더 병합
function addGroupHeaderRankPlant ()
{
    var groupHeaderName = 'User';
    $ ( "#rankGridList" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(kWh)'
        } ]
    } );
}

function jqGridBasicRankPlant ()
{
    var tpl = getTemplate ( templates.noData );
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $ ( '#rankGridList' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectPlantRankEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 204,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정

                rowNum : 10,

                sortname : "rank", // 처음 정렬될 컬럼
                sortorder : "asc", // 정렬방법 (asc/desc)
                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division, i18nMessage.msg_facilityCapacity,
                        i18nMessage.msg_facilityCapacity + " " + i18nMessage.msg_ratio + "(%)", i18nMessage.msg_energy,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_ratio + "(%)",
                        i18nMessage.msg_energy + " " + i18nMessage.msg_contrast + "(%)" ],

                colModel : [ {
                    name : 'rank',
                    index : '',
                    align : 'center',
                    width : '65',
                // cellattr : jsFormatterCell
                }, {
                    name : 'corprNm',
                    index : '',
                    align : 'left',
                    width : '198',
                    sortable : false
                }, {
                    name : 'eqmtCpcty',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                // cellattr : jsFormatterCellSum
                }, {
                    name : 'ratioEqmtCpcty',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energy',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'ratioEnergy',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                }, {
                    name : 'energyGap',
                    index : '',
                    align : 'right',
                    width : '198',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                    }
                } ],

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        // var rowids = $ ( this ).jqGrid ( 'getDataIDs' ); // 일단 jqgrid 데이타들의 id 값을 가져온다.
                        // $.each ( rowids, function ( idx, rowId )
                        // {
                        // rowData = $ ( this ).getRowData ( rowId );
                        // if ( rowData.energyGap > 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // } else if ( rowData.energyGap == 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // } else if ( rowData.energyGap < 0 )
                        // {
                        // $ ( this ).setCell ( rowId, 'energyGap ', '', {
                        // 'color' : 'red'
                        // } );
                        // }
                        // } );

                    }

                },

                gridComplete : function ()
                {
                    console.log ( ">>>>> gridComplete " );
                }

            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#rankGridList' ).parent ().append ( html );
    }
}

// jqgird customize
function customizeRankJqgridPlant ()
{
    // jqgrid
    jqGridBasicRankPlant ();
    addGroupHeaderRankPlant ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid reload
function reloadRankJqgridPlant ( $gridList )
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $gridList.setGridParam ( {
        postData : {
            dateType : dateType,
            fromDate : fromDate,
            toDate : toDate,
            unit : valueUnit
        },
    } ).trigger ( 'reloadGrid' );
}

// 엑셀 다운로드 요청 인버터별 발전량
function downloadExcel ( url, energyUrl, dateType, fromDate, toDate )
{
    console.log ( url );

    $ (
            '<form action="' + contextPath
                    + '/hom/excel/anals/advance/download.do" method="post"><input type="hidden" name="url" value="'
                    + url + '" /><input type="hidden" name="energyUrl" value="' + energyUrl
                    + '" /><input type="hidden" name="dateType" value="' + dateType
                    + '" /><input type="hidden" name="fromDate" value="' + fromDate
                    + '" /><input type="hidden" name="toDate" value="' + toDate
                    + '" /><input type="hidden" name="unit" value="' + valueUnit + '" /></form>' ).appendTo ( 'body' )
            .submit ().remove ();
}

// 엑셀 다운로드 요청 - 발전소별 발전량
function downloadExcelPlant ( url, energyUrl, dateType, fromDate, toDate )
{
    console.log ( url );

    $ (
            '<form action="'
                    + contextPath
                    + '/hom/excel/anals/advance/downloadPlant.do" method="post"><input type="hidden" name="url" value="'
                    + url + '" /><input type="hidden" name="energyUrl" value="' + energyUrl
                    + '" /><input type="hidden" name="dateType" value="' + dateType
                    + '" /><input type="hidden" name="fromDate" value="' + fromDate
                    + '" /><input type="hidden" name="toDate" value="' + toDate
                    + '" /><input type="hidden" name="unit" value="' + valueUnit + '" /></form>' ).appendTo ( 'body' )
            .submit ().remove ();
}

// 엑셀 다운로드 요청 인버터별 발전량 순위조회
function downloadExcelRank ( url, dateType, fromDate, toDate )
{
    console.log ( url );

    $ (
            '<form action="' + contextPath
                    + '/hom/excel/anals/advance/downloadRank.do" method="post"><input type="hidden" name="url" value="'
                    + url + '" /><input type="hidden" name="dateType" value="' + dateType
                    + '" /><input type="hidden" name="fromDate" value="' + fromDate
                    + '" /><input type="hidden" name="toDate" value="' + toDate
                    + '" /><input type="hidden" name="unit" value="' + valueUnit + '" /></form>' ).appendTo ( 'body' )
            .submit ().remove ();
}

// 엑셀 다운로드 요청 - 발전소별 발전량 순위조회
function downloadExcelPlantRank ( url, dateType, fromDate, toDate )
{
    console.log ( url );

    $ (
            '<form action="'
                    + contextPath
                    + '/hom/excel/anals/advance/downloadRankPlant.do" method="post"><input type="hidden" name="url" value="'
                    + url + '" /><input type="hidden" name="dateType" value="' + dateType
                    + '" /><input type="hidden" name="fromDate" value="' + fromDate
                    + '" /><input type="hidden" name="toDate" value="' + toDate
                    + '" /><input type="hidden" name="unit" value="' + valueUnit + '" /></form>' ).appendTo ( 'body' )
            .submit ().remove ();
}

$ ( function ()
{

    customizeForm ();
    initDatetimepicker ();
    setDatepickerDate ();
    initParams ();
    initUnit ();
    searchEnergy ();
    $ ( '#btnSubmit' ).trigger ( 'click' );
} );
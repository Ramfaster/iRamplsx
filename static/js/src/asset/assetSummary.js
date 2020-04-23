var reportSendInfo = null;

// form element customize
function customizeForm ()
{

    // 설비 구분
    var $dateType1 = $ ( '#rptMbySectn, #itemTyCd, .customize_select_s' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03',
        disableClass : 'custom-form-disabled03'
    } );

    // 국가,SPC 구분
    var $dateType1 = $ ( '#nationId, #spcId,#pvId' ).customizeSelect ( {
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
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );

    var $imageType = $ ( '.image_type' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
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
    var $date = $ ( '.search_area03 .date' );
    var $dateType = $ ( '#rptCycleCd' );
    $dateType.on ( 'change', function ( event )
    {

        var selectedType = $ ( ":selected", this ).val ();
        if ( selectedType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
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

function customizeScroll ()
{
    // custom scroll
    $ ( '.scrl_box > .list_box' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// 국가별 법인 정보 가져오기
function getNationPvInfo ()
{
    var $nation = $ ( '#nationId' );
    var $spcId = $ ( '#spcId' );
    var tpl = getTemplate ( templates.spcInfoSelect );

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
    var tpl = getTemplate ( templates.assetPvInfoSelect );

    $spcId.on ( 'change', function ( event )
    {
        var xspcId = $ ( ':selected', $ ( this ) ).val ();
        if ( 'all' == xspcId )
        {
            xspcId = '';
        }

        var params = {
            nationId : $ ( ':selected', $ ( '#nationId' ) ).val (),
            spcId : xspcId
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
                            pvInfoList : json.data
                        } );

                        $pvId.empty ().html ( html ).trigger ( 'change' );
                        if ( paramInitLoadPage == false )
                        {
                            paramInitLoadPage = true;
                            $ ( "#btn_search" ).trigger ( 'click' );
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

function fnSummarySearch ()
{

    var $btnSearch = $ ( '#btn_search' );

    $btnSearch.on ( 'click', function ()
    {

        paramRptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();
        // paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
        paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();
        // paramRptCycleCd = 'RCT03';

        paramNationId = $ ( ":selected", $ ( "#nationId" ) ).val ();
        if ( typeof $ ( "#spcId" ) !== 'undefined' )
        {
            paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
            if ( 'all' == paramSpcId )
            {
                paramSpcId = '';
            }
        }
        if ( typeof $ ( "#pvId" ) !== 'undefined' )
        {
            paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
        }
        if ( 'RDT02' == paramRptMbySectn )
        {
            paramPvId = '';
        }
        paramRptMbyId = '';

        // paramFromDate = $ ( "#stdrYm" ).val ();
        // paramToDate = $ ( "#stdrDt" ).val ();

        // var dateType = $ ( '#rptCycleCd' ).val ();
        var className = null;
        var selectedType = $ ( ":selected", $ ( '#rptCycleCd' ) ).val ();
        if ( selectedType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();

        var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
        var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

        var amtIndictUnitCd2 = null;
        if ( typeof $ ( "#amtIndictUnitCd2" ) !== 'undefined' )
        {
            amtIndictUnitCd2 = $ ( 'input:radio[name=amtIndictUnitCd2]:checked' ).val ();
        }
        // rptTyCd : rptTyCd,
        var params = {
            rptMbySectn : paramRptMbySectn,
            rptCycleCd : paramRptCycleCd,
            stdrYm : pureFromDate,
            fromDate : pureFromDate,
            toDate : pureToDate,
            nationId : paramNationId,
            spcId : paramSpcId,
            pvId : paramPvId,
            amtIndictUnitCd2 : amtIndictUnitCd2
        };

        paramRunOmRptAjax02 = true;

        var tpl = getTemplate ( templates.reportAmMonthlyPlantCur );

        $.ajax ( {
            url : contextPath + '/hom/asset/assetSummary/selectReportAmMonthlyPlant2List.ajax',
            type : 'GET',
            async : false,
            data : params,
            dataType : 'json',
            success : function ( json )
            {
                paramRunOmRptAjax02 = false;

                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( tpl !== null )
                    {
                        var msgslist = []
                        msgslist = {
                            msg_importExpense : i18nMessage.msg_importExpense,
                            msg_monthImportExpense : i18nMessage.msg_monthImportExpense,
                            msg_yearAccumulation : i18nMessage.msg_yearAccumulation,
                            msg_importStatus : i18nMessage.msg_importStatus,
                            msg_expenseStatus : i18nMessage.msg_expenseStatus,
                            msg_operationCostComposition : i18nMessage.msg_operationCostComposition,
                            msg_notes : i18nMessage.msg_notes,
                            msg_expenseStatus : i18nMessage.msg_expenseStatus,
                            msg_selection : i18nMessage.msg_selection,
                            msg_amountUnit : i18nMessage.msg_amountUnit
                        };

                        // var template = _.template ( tpl );
                        // var html = template ( {
                        // lang : lang,
                        // locale : locale,
                        // msgslist : msgslist,
                        // dataSize01 : Object.keys ( json.data.childList01 ).length,
                        // dataSize02 : Object.keys ( json.data.childList02 ).length,
                        // dataSize03 : Object.keys ( json.data.childList03 ).length,
                        // dataSize04 : Object.keys ( json.data.childList04 ).length,
                        // dataSize05 : Object.keys ( json.data.childList05 ).length,
                        // rptDataList : json.data
                        // } );
                        // if ( divHtmlId != 'undefined' )
                        // {
                        // divHtmlId.empty ().html ( html ).trigger ( 'create' );
                        // } else
                        // {
                        // }
                        // if ( callbackfn != null )
                        // {
                        // callbackfn ();
                        // }
                        fnAssetSummaryHighcharts ( json.data );

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
                paramRunOmRptAjax01 = false;
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

        fnSummaryInsuranceSearch ();

        return false;
    } );

}

function fnAssetSummaryHighcharts ( data )
{
    var digit = staticVariable.decimalPoint;
    // '16-01', '16-02', '16-03', '16-04', '16-05', '16-06', '16-07'
    var varxxCategories = [];
    var varxxData01 = [];// 
    var varxxData02 = [];// 
    // var i=0;
    varxxCategories = [];
    var j = 0;
    var i = 0;
    var listSize = 0;
    // for ( i = 0; i < 12; i++ )
    // {
    // if ( i < 9 )
    // {
    // varxxCategories.push ( data.stdrYear.substr ( 2, 2 ) + '-0' + (i + 1) );
    // } else
    // {
    // varxxCategories.push ( data.stdrYear.substr ( 2, 2 ) + '-' + (i + 1) );
    // }
    // }

    var varxxPlanColor = [ '#bababa', '#a09f9f', '#828282' ];
    var varxxAcmsltColor = [ '#ea5b30', '#ff8921', '#ffbe21' ];
    var varxxGapColor = [ '#5086c3', '#41bdcc', '#2bdc8b' ];
    var varxxSeries = [];
    var varxxSeriesYear = [];
    var minValue = null;
    var maxValueArray = [];
    // getChildList04

    varxxSeries = [];
    listSize = Object.keys ( data.childList01 ).length;
    if ( listSize > 0 )
    {

        $.each ( data.childList01, function ( key, value )
        {
            varxxCategories.push ( value.statsDtFormat );
        } );

        j = 0;
        i = 1;
        var xxparntId = null;
        var xxdata001 = [];// 계획
        var xxdata002 = [];// 실적
        var xxdata003 = [];// 차이
        var xxcorprOmNm = '';
        var xxcorprAmNm = '';
        var xxcorprEpcNm = '';

        $.each ( data.childList01, function ( key, value )
        {
            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {

                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#fc5d2a',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );

                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {

                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#fc5d2a',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );
            }
            i++;
        } );
    }

    var maxValue = null;
    if ( maxValueArray.length > 0 )
    {
        maxValue = _.max ( maxValueArray );
    }

    // alert ( data.crncyCdVal );
    var yAxis = {
        title : {
            text : '' + i18nMessage.msg_amount + ' ( ' + data.crncyCdVal + ' / ' + data.amtIndictUnitCdVal2 + ' )'
        }
    };

    yAxis = setYaxisMin ( yAxis, minValue, maxValue );

    // if ( listSize > 0 )
    if ( Object.keys ( data.childList03 ).length > 0 )
    {
        // 그래프
        $ ( '#rptGraph1' ).highcharts (
                {
                    chart : {
                        marginTop : 20,
                        marginLeft : 73,
                        marginRight : 20,
                        marginBottom : 61,
                        zoomType : 'x',
                        panning : true,
                        panKey : 'shift'
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
                        categories : varxxCategories,
                        crosshair : true,
                        tickmarkPlacement : 'on'
                    },
                    yAxis : [ yAxis ],
                    plotOptions : {
                        column : {
                            pointPadding : 0,
                            borderWidth : 0
                        }
                    },
                    legend : {
                        align : 'center',
                        verticalAlign : 'bottom',
                        floating : false,
                        symbolWidth : 8,
                        symbolHeight : 8,
                        y : 10
                    },
                    tooltip : {
                        useHTML : true,
                        style : {
                            zIndex : 300
                        },
                        shared : true,
                        formatter : function ()
                        {
                            var tooltip = '';

                            $.each ( this.points, function ( i, point )
                            {

                                tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                        + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit )
                                        + '<br />';
                            } );

                            // var tooltipDate = homUtil.convertDateLongToString ( this.x, dateType );
                            // return '<strong>' + tooltipDate + '</strong><br />' + tooltip;
                            // var tooltipDate = homUtil.convertDateLongToString ( this.x, dateType );
                            // return '<strong>20' + this.x + '</strong><br />' + tooltip;
                            return '<strong>' + this.x + '</strong><br />' + tooltip;
                        }
                    },
                    series : varxxSeries
                } );
    } else
    {
        $ ( '#rptGraph1' ).html (
                '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
    }

    varxxSeries = [];
    varxxSeriesYear = [];
    listSize = Object.keys ( data.childList02 ).length;
    // listSize = Object.keys ( data.childList03 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        $.each ( data.childList02, function ( key, value )
        {
            varxxSeriesYear.push ( {
                id : 0,
                type : 'column',
                yAxis : 0,
                color : '#fc5d2a',
                name : value.corprOmNm,
                data : [ value.totalPlanSum ]
            } );
            varxxSeriesYear.push ( {
                id : 1,
                type : 'column',
                yAxis : 0,
                color : '#558bdc',
                name : value.corprAmNm,
                data : [ value.totalAcmsltSum ]
            } );
            varxxSeriesYear.push ( {
                id : 2,
                type : 'column',
                yAxis : 0,
                color : '#8f8f92',
                name : value.corprEpcNm,
                data : [ value.totalDif ]
            } );

            if ( j > 2 )
            {
                j = 0;
            }
            j++;

        } );
    }

    // if ( listSize > 0 )
    if ( Object.keys ( data.childList03 ).length > 0 )
    {
        $ ( '#rptGraph2' ).highcharts (
                {
                    chart : {
                        marginTop : 20,
                        marginLeft : 65,
                        marginRight : 25,
                        marginBottom : 46,
                        zoomType : 'x',
                        panning : true,
                        panKey : 'shift'
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
                        categories : [ i18nMessage.msg_accumulation ],
                        crosshair : true,
                        labels : {
                            y : 20
                        },
                        tickmarkPlacement : 'on'
                    },
                    yAxis : [ {
                        title : {
                            text : ''
                        }
                    } ],
                    plotOptions : {
                        column : {
                            pointPadding : 0,
                            borderWidth : 0
                        }
                    },
                    legend : {
                        enabled : false
                    },
                    tooltip : {
                        useHTML : true,
                        style : {
                            zIndex : 300
                        },
                        shared : true,
                        formatter : function ()
                        {
                            var tooltip = '';

                            $.each ( this.points, function ( i, point )
                            {

                                tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                        + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit )
                                        + '<br />';
                            } );

                            return '<strong>' + this.x + '</strong><br />' + tooltip;
                        }
                    },
                    series : varxxSeriesYear
                }, function ( chart )
                {
                    // $ ( '#rptGraph1' ).find ( '.highcharts-legend-item' ).on ( 'click', function ()
                    // {
                    // var index = $ ( this ).index ();
                    // var series = chart.get ( index );
                    // series.setVisible ( !series.visible );
                    //
                    // return true;
                    // } );
                } );
    } else
    {
        // $ ( '#rptGraph2' ).html (
        // '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
        $ ( '#rptGraph2' ).html ( '' );
    }

    varxxSeries = [];
    xxdata001 = [];
    xxdata002 = [];
    xxdata003 = [];
    minValue = null;
    maxValueArray = [];
    listSize = Object.keys ( data.childList03 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        i = 1;
        var xxparntId = null;
        var xxdata001 = [];// 계획
        var xxdata002 = [];// 실적
        var xxdata003 = [];// 차이
        var xxcorprOmNm = '';
        var xxcorprAmNm = '';
        var xxcorprEpcNm = '';

        $.each ( data.childList03, function ( key, value )
        {

            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {

                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : varxxPlanColor[j],
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : varxxAcmsltColor[j],
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : varxxGapColor[j],
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );

                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {

                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#ea762c',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );
            }
            i++;
        } );
    }

    maxValue = null;
    if ( maxValueArray.length > 0 )
    {
        maxValue = _.max ( maxValueArray );
    }

    yAxis = {
        title : {
            text : '' + i18nMessage.msg_amount + ' ( ' + data.crncyCdVal + ' / ' + data.amtIndictUnitCdVal2 + ' )'
        }
    };

    yAxis = setYaxisMin ( yAxis, minValue, maxValue );

    if ( listSize > 0 )
    {
        $ ( '#rptGraph3' ).highcharts (
                {
                    chart : {
                        marginTop : 20,
                        marginLeft : 73,
                        marginRight : 10,
                        marginBottom : 55,
                        zoomType : 'x',
                        panning : true,
                        panKey : 'shift'
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
                        categories : varxxCategories,
                        crosshair : true,
                        labels : {
                            step : 2
                        },
                        tickmarkPlacement : 'on'
                    },
                    yAxis : [ yAxis ],
                    plotOptions : {
                        column : {
                            pointPadding : 0,
                            borderWidth : 0
                        }
                    },
                    legend : {
                        align : 'center',
                        verticalAlign : 'bottom',
                        floating : false,
                        symbolWidth : 8,
                        symbolHeight : 8,
                        y : 10
                    },
                    tooltip : {
                        useHTML : true,
                        style : {
                            zIndex : 300
                        },
                        shared : true,
                        formatter : function ()
                        {
                            var tooltip = '';

                            $.each ( this.points, function ( i, point )
                            {

                                tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                        + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit )
                                        + '<br />';
                            } );

                            // return '<strong>20' + this.x + '</strong><br />' + tooltip;
                            return '<strong>' + this.x + '</strong><br />' + tooltip;
                        }
                    },
                    series : varxxSeries
                } );
    } else
    {
        $ ( '#rptGraph3' ).html (
                '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
    }

    varxxData01 = [];
    varxxAcmsltColor = [];
    varxxPlanColor = [ '#bababa', '#f4bc1d', '#8f8f92', '#ea5b2f', '#4f86c3' ];

    listSize = Object.keys ( data.childList08 ).length;
    j = 0;
    if ( data.childList08 != null )
    {
        $.each ( data.childList08, function ( key, value )
        {
            varxxData01.push ( {
                name : value.parntsItemIdNm,
                y : value.totalRate,
                y_label : value.totalAcmsltSum + ' %'
            } );
            varxxAcmsltColor.push ( varxxPlanColor[j] );
            if ( j > 4 )
            {
                j = 0;
            }
            j++;
        } );
    }
    if ( listSize > 0 )
    {
        // '#bababa', '#f4bc1d', '#ea5b2f', '#4f86c3'
        $ ( '#rptGraph4' ).highcharts ( {
            chart : {
                type : 'pie'
            },
            legend : {
                align : 'center',
                verticalAlign : 'bottom',
                floating : false,
                symbolWidth : 8,
                symbolHeight : 8,
                symbolRadius : 16,
                y : 10
            },
            credits : {
                enabled : false
            },
            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
            tooltip : {
                // pointFormat : '{series.name}: <b>{point.percentage:.1f} %</b>'
                pointFormat : '<b>{point.percentage:.1f} %</b>'
            },
            title : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            plotOptions : {
                pie : {

                    shadow : false,
                    size : '80%',
                    innerSize : '50%',
                    dataLabels : {
                        enabled : false
                    },
                    showInLegend : true
                // allowPointSelect : true,
                // cursor : 'pointer'
                // dataLabels : {
                // enabled : true,
                // format : '<b>{point.name}</b>: {point.percentage:.1f} %',
                // style : {
                // color : (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                // }
                // }
                }
            },
            series : [ {
                type : 'pie',
                name : i18nMessage.msg_accumulation,
                data : varxxData01
            } ]
        } );
    } else
    {
        // $ ( '#rptGraph4' ).html (
        // '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
        $ ( '#rptGraph4' ).html ( '' );
    }

    varxxSeries = [];
    xxdata001 = [];
    xxdata002 = [];
    xxdata003 = [];
    minValue = null;
    maxValueArray = [];
    listSize = Object.keys ( data.childList05 ).length;
    if ( listSize > 0 )
    {
        j = 0;
        i = 1;
        var xxparntId = null;
        var xxdata001 = [];// 계획
        var xxdata002 = [];// 실적
        var xxdata003 = [];// 차이
        var xxcorprOmNm = '';
        var xxcorprAmNm = '';
        var xxcorprEpcNm = '';
        $.each ( data.childList05, function ( key, value )
        {

            if ( xxparntId == null )
            {
                xxparntId = value.parntsItemId;
            }
            if ( xxparntId == value.parntsItemId )
            {
                xxdata001.push ( value.totalPlanSum );
                xxdata002.push ( value.totalAcmsltSum );
                xxdata003.push ( value.totalDif );
            } else
            {

                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );

                xxparntId = value.parntsItemId;
                xxdata001 = [];
                xxdata002 = [];
                xxdata003 = [];
            }
            xxcorprOmNm = value.corprOmNm;
            xxcorprAmNm = value.corprAmNm;
            xxcorprEpcNm = value.corprEpcNm;
            if ( j > 2 )
            {
                j = 0;
            }
            j++;
            if ( listSize == i )
            {

                // last
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#d0d0d1',
                    name : xxcorprOmNm,
                    data : xxdata001
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#558bdc',
                    name : xxcorprAmNm,
                    data : xxdata002
                } );
                varxxSeries.push ( {
                    type : 'column',
                    yAxis : 0,
                    color : '#8f8f92',
                    name : xxcorprEpcNm,
                    data : xxdata003
                } );

                minValue = _.min ( xxdata003 );
                maxValueArray.push ( _.max ( xxdata001 ) );
                maxValueArray.push ( _.max ( xxdata002 ) );
                maxValueArray.push ( _.max ( xxdata003 ) );
            }
            i++;
        } );
    }

    maxValue = null;
    if ( maxValueArray.length > 0 )
    {
        maxValue = _.max ( maxValueArray );
    }

    yAxis = {
        title : {
            text : '' + i18nMessage.msg_amount + ' ( ' + data.crncyCdVal + ' / ' + data.amtIndictUnitCdVal2 + ' )'
        }
    };

    yAxis = setYaxisMin ( yAxis, minValue, maxValue );

    if ( listSize > 0 )
    {
        $ ( '#rptGraph5' ).highcharts (
                {
                    chart : {
                        marginTop : 20,
                        marginLeft : 73,
                        marginRight : 10,
                        marginBottom : 55,
                        zoomType : 'x',
                        panning : true,
                        panKey : 'shift'
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
                        categories : varxxCategories,
                        crosshair : true,
                        labels : {
                            step : 2
                        },
                        tickmarkPlacement : 'on'
                    },
                    yAxis : [ yAxis ],
                    plotOptions : {
                        column : {
                            pointPadding : 0,
                            borderWidth : 0
                        }
                    },
                    legend : {
                        align : 'center',
                        verticalAlign : 'bottom',
                        floating : false,
                        symbolWidth : 8,
                        symbolHeight : 8,
                        y : 10
                    },
                    tooltip : {
                        useHTML : true,
                        style : {
                            zIndex : 300
                        },
                        shared : true,
                        formatter : function ()
                        {
                            var tooltip = '';

                            $.each ( this.points, function ( i, point )
                            {

                                tooltip += '<span style="color:' + point.series.color + '">\u25CF</span> '
                                        + point.series.name + ': ' + homUtil.mathFloorComma ( point.y, digit )
                                        + '<br />';
                            } );

                            // return '<strong>20' + this.x + '</strong><br />' + tooltip;
                            return '<strong>' + this.x + '</strong><br />' + tooltip;
                        }
                    },
                    series : varxxSeries
                } );
    } else
    {
        $ ( '#rptGraph5' ).html (
                '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
    }

    varxxAcmsltColor = [];
    varxxPlanColor = [ '#bababa', '#f4bc1d', '#ea5b2f', '#4f86c3' ];
    varxxData01 = [];

    listSize = Object.keys ( data.childList07 ).length;
    j = 0;
    if ( data.childList07 != null )
    {
        $.each ( data.childList07, function ( key, value )
        {
            varxxData01.push ( {
                name : value.parntsItemIdNm,
                y : value.totalRate,
                y_label : value.totalAcmsltSum + ' %'
            } );
            varxxAcmsltColor.push ( varxxPlanColor[j] );
            if ( j > 4 )
            {
                j = 0;
            }
            j++;
        } );
    }

    if ( listSize > 0 )
    {
        $ ( '#rptGraph6' ).highcharts ( {
            chart : {
                type : 'pie'
            },
            legend : {
                align : 'center',
                verticalAlign : 'bottom',
                floating : false,
                symbolWidth : 8,
                symbolHeight : 8,
                symbolRadius : 16,
                y : 10
            },
            credits : {
                enabled : false
            },
            colors : homUtil.getHighchartsColors ( homUtil.highchartsColorInfo.type5 ),
            tooltip : {
                // pointFormat : '{series.name}: <b>{point.percentage:.1f} %</b>'
                pointFormat : '<b>{point.percentage:.1f} %</b>'
            },
            title : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            plotOptions : {
                pie : {

                    shadow : false,
                    size : '80%',
                    innerSize : '50%',
                    dataLabels : {
                        enabled : false
                    },
                    showInLegend : true
                }
            },
            series : [ {
                type : 'pie',
                name : i18nMessage.msg_operationCost,
                data : varxxData01
            } ]
        } );
    } else
    {
        // $ ( '#rptGraph6' ).html (
        // '<div class="bg_nodata"><i class="icon_nodata"></i>' + i18nMessage.msg_sentenceGridNoData + '</div>' );
        $ ( '#rptGraph6' ).html ( '' );
    }
}

function fnSummaryInsuranceSearch ()
{

    paramRptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();
    // paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();

    paramNationId = $ ( ":selected", $ ( "#nationId" ) ).val ();
    if ( typeof $ ( "#spcId" ) !== 'undefined' )
    {
        paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
    }
    if ( typeof $ ( "#pvId" ) !== 'undefined' )
    {
        paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
    }

    // var dateType = $ ( '#rptCycleCd' ).val ();
    var selectedType = $ ( ":selected", $ ( '#rptCycleCd' ) ).val ();
    var className = null;

    if ( selectedType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( selectedType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( selectedType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var vvfromDate = $ ( '#' + className + '_from_date' ).val ();
    var vvtoDate = $ ( '#' + className + '_to_date' ).val ();

    var pureFromDate = homUtil.convertDateStringToPureFormat ( vvfromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( vvtoDate );

    var amtIndictUnitCd2 = null;
    if ( typeof $ ( "#amtIndictUnitCd2" ) !== 'undefined' )
    {
        amtIndictUnitCd2 = $ ( 'input:radio[name=amtIndictUnitCd2]:checked' ).val ();
    }
    // rptTyCd : rptTyCd,
    var params = {
        rptMbySectn : paramRptMbySectn,
        rptCycleCd : paramRptCycleCd,
        stdrYm : pureFromDate,
        fromDate : pureFromDate,
        toDate : pureToDate,
        nationId : paramNationId,
        spcId : paramSpcId,
        pvId : paramPvId,
        amtIndictUnitCd2 : amtIndictUnitCd2
    };

    var tpl = getTemplate ( templates.assetSummaryInsurance );

    $.ajax ( {
        url : contextPath + '/hom/asset/assetSummary/selectAssetSummaryInsurance.ajax',
        type : 'GET',
        async : true,
        data : params,
        dataType : 'json',
        success : function ( json )
        {

            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var msgslist = [];
                    msgslist = {
                        msg_sentenceInsurerExpirationNoDate : i18nMessage.msg_sentenceInsurerExpirationNoDate,
                        msg_InsurerName : i18nMessage.msg_InsurerName,
                        msg_InsurerExpirationDate : i18nMessage.msg_InsurerExpirationDate,
                        msg_InsurerKind : i18nMessage.msg_InsurerKind,
                        msg_selection : i18nMessage.msg_selection,
                        msg_amountUnit : i18nMessage.msg_amountUnit
                    };

                    var template = _.template ( tpl );
                    var html = template ( {
                        lang : lang,
                        locale : locale,
                        msgslist : msgslist,
                        dataSize01 : Object.keys ( json.data ).length,
                        rptDataList : json.data
                    } );
                    if ( typeof $ ( "#divSummaryInsuranceList" ) != 'undefined' )
                    {
                        $ ( "#divSummaryInsuranceList" ).empty ().html ( html ).trigger ( 'create' );
                    } else
                    {
                    }
                    customizeScroll ();

                    // $ ( ".btn_list_full .btn_popup" ).magnificPopup ( {
                    $ ( ".btn_popup" ).magnificPopup ( {
                        type : 'ajax',
                        alignTop : false,
                        overflowY : 'scroll',
                        closeOnContentClick : false,
                        closeOnBgClick : false
                    } );

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

function checkBtnLinks ()
{
    fnSummarySearch ();

    $ ( "#rptMbySectn" ).on ( 'change', function ()
    {

        var $rptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();

        if ( 'RDT02' == $rptMbySectn )
        {
            $ ( '#pvId' ).parent ().parent ().hide ();
        } else
        {
            $ ( '#pvId' ).parent ().parent ().show ();
        }

    } );

    if ( typeof $ ( "#btn_new_cashflow_popup" ) !== 'undefined' )
    {
        var btnCashflowPopup = $ ( "#btn_new_cashflow_popup" ).magnificPopup ( {
            type : 'ajax',
            alignTop : false,
            overflowY : 'scroll',
            closeOnContentClick : false,
            closeOnBgClick : false
        } );
    }

    if ( typeof $ ( "#btn_excel_popup" ) !== 'undefined' )
    {
        // var btnexcelPopup = $ ( "#btn_excel_popup" ).magnificPopup ( {
        // type : 'ajax',
        // alignTop : false,
        // overflowY : 'scroll',
        // closeOnContentClick : false,
        // closeOnBgClick : false
        // } );

        $ ( "#btn_excel_popup" ).on (
                'click',
                function ()
                {

                    // alert ( paramHighChartExportUrl01 );

                    paramRptMbySectn = $ ( ":selected", $ ( "#rptMbySectn" ) ).val ();
                    // paramRptTyCd = $ ( ":selected", $ ( "#rptTyCd" ) ).val ();
                    paramRptCycleCd = $ ( ":selected", $ ( "#rptCycleCd" ) ).val ();

                    paramNationId = $ ( ":selected", $ ( "#nationId" ) ).val ();
                    if ( typeof $ ( "#spcId" ) !== 'undefined' )
                    {
                        paramSpcId = $ ( ":selected", $ ( "#spcId" ) ).val ();
                    }
                    if ( typeof $ ( "#pvId" ) !== 'undefined' )
                    {
                        paramPvId = $ ( ":selected", $ ( "#pvId" ) ).val ();
                    }

                    paramRptMbyId = '';

                    var amtIndictUnitCd2 = null;
                    if ( typeof $ ( "#amtIndictUnitCd2" ) !== 'undefined' )
                    {
                        amtIndictUnitCd2 = $ ( 'input:radio[name=amtIndictUnitCd2]:checked' ).val ();
                    }

                    // var dateType = $ ( '#rptCycleCd' ).val ();
                    var className = null;
                    var selectedType = $ ( ":selected", $ ( '#rptCycleCd' ) ).val ();
                    if ( selectedType === homConstants.dateTypeYYYYMMDD )
                    {
                        className = staticVariable.formatYYYYMMDD;
                    } else if ( selectedType === homConstants.dateTypeYYYYMM )
                    {
                        className = staticVariable.formatYYYYMM;
                    } else if ( selectedType === homConstants.dateTypeYYYY )
                    {
                        className = staticVariable.formatYYYY;
                    }

                    var vvfromDate = $ ( '#' + className + '_from_date' ).val ();
                    var vvtoDate = $ ( '#' + className + '_to_date' ).val ();

                    var pvName = encodeURIComponent ( $ ( ':selected', $ ( '#pvId' ) ).text () );
                    var spcName = encodeURIComponent ( $ ( ':selected', $ ( '#spcId' ) ).text () );
                    var nationName = encodeURIComponent ( $ ( ':selected', $ ( '#nationId' ) ).text () );

                    // var optionsStr = JSON.stringify ( $ ( '#graph1' ).highcharts ().userOptions );
                    // var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                    fnHighChartGetImageUrl ( $ ( '#rptGraph1' ), 600, $ ( "#paramHighChartExportUrl01" ) );
                    fnHighChartGetImageUrl ( $ ( '#rptGraph2' ), 400, $ ( "#paramHighChartExportUrl02" ) );
                    fnHighChartGetImageUrl ( $ ( '#rptGraph3' ), 600, $ ( "#paramHighChartExportUrl03" ) );
                    fnHighChartGetImageUrl ( $ ( '#rptGraph4' ), 400, $ ( "#paramHighChartExportUrl04" ) );
                    fnHighChartGetImageUrl ( $ ( '#rptGraph5' ), 600, $ ( "#paramHighChartExportUrl05" ) );
                    fnHighChartGetImageUrl ( $ ( '#rptGraph6' ), 400, $ ( "#paramHighChartExportUrl06" ) );

                    var paramHighChartExportUrl = '' + $ ( "#paramHighChartExportUrl01" ).val ();
                    paramHighChartExportUrl += ',' + $ ( "#paramHighChartExportUrl02" ).val ();
                    paramHighChartExportUrl += ',' + $ ( "#paramHighChartExportUrl03" ).val ();
                    paramHighChartExportUrl += ',' + $ ( "#paramHighChartExportUrl04" ).val ();
                    paramHighChartExportUrl += ',' + $ ( "#paramHighChartExportUrl05" ).val ();
                    paramHighChartExportUrl += ',' + $ ( "#paramHighChartExportUrl06" ).val ();

                    var menuName = '';
                    $ ( '.lnb' ).find ( 'span' ).each ( function ()
                    {
                        menuName += ($ ( this ).text () + '_');
                    } );

                    menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

                    location.href = contextPath + '/hom/excel/asset/summary/download.do?fromDate=' + vvfromDate
                            + '&toDate=' + vvtoDate + '&stdrYm=' + vvfromDate + '&nationId='
                            + $ ( ':selected', $ ( '#nationId' ) ).val () + '&rd=1&spcId=' + paramSpcId + '&pvId='
                            + paramPvId + '&rptCycleCd=' + paramRptCycleCd + '&rptMbySectn=' + paramRptMbySectn
                            + '&amtIndictUnitCd2=' + amtIndictUnitCd2 + '&comparatorTmpString='
                            + paramHighChartExportUrl + '&spcIdNm=' + encodeURIComponent ( spcName ) + '&pvIdNm='
                            + encodeURIComponent ( pvName ) + '&nationIdNm=' + encodeURIComponent ( nationName )
                            + '&menuName=' + encodeURIComponent ( menuName );

                    return false;
                } );
    }

}

function fnInsurancePopup ( objpopup, insrncEntrpsCd, pvId, spcId )
{
    String
    surl = contextPath + '/hom/asset/plantInsurance/view.do?insrncEntrpsCd=' + insrncEntrpsCd + '&pvId=' + pvId
            + '&spcId=' + spcId;

    // $ ( objpopup ).attr ('href', surl );

    $ ( this ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false
    } );

    // this.location.href = surl;

    // summaryInsurancePopup

}

function fnHighChartGetImageUrl ( chartObj, width, destParam )
{
    if ( typeof chartObj !== 'undefined' )
    {
        var optionsStr = JSON.stringify ( chartObj.highcharts ().userOptions );
        var dataString = encodeURI ( 'async=false&type=png&width=' + width + '&options=' + optionsStr );

        $.ajax ( {
            type : 'POST',
            data : dataString,
            async : false,
            url : staticVariable.exportUrl,
            // url : 'http://localhost:9190/highcharts-export/',
            success : function ( data )
            {

                destParam.val ( staticVariable.exportUrl + data );

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

// highcharts의 minValue를 설정한다.
function setYaxisMin ( yAxis, minValue, maxValue )
{
    if ( minValue != null && maxValue != null )
    {
        var stdrValue = null;
        if ( maxValue < 1000 )
        {
            stdrValue = -10;
        } else if ( maxValue < 10000 )
        {
            stdrValue = -100;
        } else if ( maxValue < 100000 )
        {
            stdrValue = -1000;
        } else if ( maxValue < 1000000 )
        {
            stdrValue = -10000;
        } else if ( maxValue < 10000000 )
        {
            stdrValue = -100000;
        } else
        {
            stdrValue = minValue;
        }

        yAxis.min = minValue < stdrValue ? minValue : stdrValue;
        yAxis.startOnTick = false;
    }

    return yAxis;
}

$ ( function ()
{
    customizeForm ();
    initDatetimepicker ();
    customizeScroll ();
    getNationSpcPvInfo ();
    getNationPvInfo ();
    checkBtnLinks ();

    // $.when ( getNationSpcPvInfo () ).done ( function ()
    // {
    // getNationPvInfo ();
    // } );

    // $ ( '#nationId' ).trigger ( 'change' );

    $ ( '#nationId' ).val ( acntNationId ).trigger ( 'change' );

} );
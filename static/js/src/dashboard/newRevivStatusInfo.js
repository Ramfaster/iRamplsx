function initDatetimepicker ()
{
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() - 1);
	
    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true,
        setDate : todayDate,
        endDate : todayDate,
        onSelect : function ( dateText )
        {
            console.log ( "Selected date: " + dateText + ", Current Selected Value= " + this.value );
            $ ( this ).change ();
        }
    } ).on ( "input change", function ( e )
    {
        e.preventDefault ();
        console.log ( "Change event" );
        calendarEvent ();
    } );
    /*
     * }).on("changeDate", function (e) { console.log("changed date :: value={0}".format(e.format())); });
     */

    $ ( '.btn_date_next' ).on (
            "click",
            function ()
            {
                var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
                date.setTime ( date.getTime () + (1000 * 60 * 60 * 24) )

                var currentDate = new Date ();

                var numGetDate = makeDateToString ( date, '' );
                var numCurrentDate = makeDateToString ( currentDate, '' );

                /*
                 * if ((date.getFullYear() > currentDate.getFullYear()) || ((date.getMonth()+1) >
                 * (currentDate.getMonth()+1)) || ((date.getDate()) >= (currentDate.getDate()))) {
                 */
                if ( Number ( numGetDate ) >= Number ( numCurrentDate ) )
                {
                    console.log ( "getDate={0}, currentDate={1}".format ( Number ( numGetDate ),
                            Number ( numCurrentDate ) ) )
                    console.log ( "getYear={0},month={1},day={2}  / getYear={3},month={4},day={5}".format ( date
                            .getFullYear (), date.getMonth () + 1, date.getDate (), currentDate.getFullYear (),
                            currentDate.getMonth () + 1, currentDate.getDate () ) );
                    console.log ( "pickerDate={0}, currentDate={1}".format ( makeDateToString ( date, '-' ),
                            makeDateToString ( currentDate, '-' ) ) );

                    alert ( "조회 날짜는 오늘 날짜보다 작게 선택해 주세요." );
                    date.setTime ( date.getTime () - (1000 * 60 * 60 * 24) );

                    $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
                    dateClicked = false;
                    return;
                }

                $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
                reqDirectorDashboard ();
            } );

    $ ( '.btn_date_prev' ).on ( "click", function ()
    {
        var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
        date.setTime ( date.getTime () - (1000 * 60 * 60 * 24) )

        // getDateTimePickerDate();
        $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
        reqDirectorDashboard ();
    } );
}

function calendarEvent ()
{
    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );

    var currentDate = new Date ();

    var numGetDate = makeDateToString ( date, '' );
    var numCurrentDate = makeDateToString ( currentDate, '' );

    /*
     * if ((date.getFullYear() > currentDate.getFullYear()) || ((date.getMonth()+1) > (currentDate.getMonth()+1)) ||
     * ((date.getDate()) >= (currentDate.getDate()))) {
     */
    if ( Number ( numGetDate ) >= Number ( numCurrentDate ) )
    {
        console.log ( "getDate={0}, currentDate={1}".format ( Number ( numGetDate ), Number ( numCurrentDate ) ) )
        console.log ( "getYear={0},month={1},day={2}  / getYear={3},month={4},day={5}".format ( date.getFullYear (),
                date.getMonth () + 1, date.getDate (), currentDate.getFullYear (), currentDate.getMonth () + 1,
                currentDate.getDate () ) );
        console.log ( "pickerDate={0}, currentDate={1}".format ( makeDateToString ( date, '-' ), makeDateToString (
                currentDate, '-' ) ) );

        alert ( "조회 날짜는 오늘 날짜보다 작게 선택해 주세요." );
        date.setTime ( new Date () );

        $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
        return;
    }

    $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
    reqDirectorDashboard ();
}

/**
 * 전체 선택 telecube@LJI 2019.1.2
 */
$ ( '#cntSelAll' ).on ( "click", function ()
{
    $ ( '#cntSelAsia' ).prop ( "checked", false );
    $ ( '#cntSelAll' ).prop ( "checked", true );
    reqDirectorDashboard ();
} );

/**
 * 직영(한화에너지) 선택 telecube@LJI 2019.1.2
 */
$ ( '#cntSelAsia' ).on ( "click", function ()
{
    $ ( '#cntSelAsia' ).prop ( "checked", true );
    $ ( '#cntSelAll' ).prop ( "checked", false );
    reqDirectorDashboard ();
} );

function customizeScroll ()
{
    $ ( '.eng_dtl_box' ).perfectScrollbar ();
}

function numberWithCommas ( x )
{
    var regexp = /\B(?=(\d{3})+(?!\d))/g;
    return x.toString ().replace ( regexp, ',' );
}

function dsGridLayout ()
{
    var winHeight = $ ( window ).outerHeight ();
    var headerGap = 415;
    var repLstMinHeight = winHeight - headerGap;

    $ ( '.eng_dtl_box' ).height ( repLstMinHeight );
}

function moreToggle ()
{

    $ ( '.btn_sts_tt' ).click ( function ()
    {
        if ( $ ( this ).hasClass ( 'on' ) )
        {
            $ ( '.btn_sts_tt' ).removeClass ( 'on' );
        } else
        {
            $ ( '.btn_sts_tt' ).removeClass ( 'on' );

            $ ( this ).addClass ( 'on' );
        }
    } );

    $ ( document ).mouseup ( function ( e )
    {
        var container = $ ( '.sts_tt_box' );
        if ( container.has ( e.target ).length === 0 )
        {
            $ ( '.btn_sts_tt' ).removeClass ( 'on' );
        }
    } );
}

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnBgClick : false
    } );
}

function showSelectPopup ( id )
{

    $ ( '#btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnBgClick : false
    } );

    // alert('popup');
    // $('#solar_dt').val(id);
    // window.location.href=contextPath+"/hom/dashboard/execdashboard/newRevivStatusInfoPopupSolar.do";
}

$ ( window ).resize ( function ()
{
    dsGridLayout ();
} );

/*
 * 전달받은 날짜의 요일을 리턴한다.
 */
function getDaYLabel ( date )
{
    var week = new Array ( '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일' );
    var today = new Date ( date ).getDay ();
    var todayLabel = week[today];
    var retLabel = "";

    if ( todayLabel == '일요일' )
    {
        retLabel = i18nMessage.msg_sunday;
    } else if ( todayLabel == '월요일' )
    {
        retLabel = i18nMessage.msg_monday;
    } else if ( todayLabel == '화요일' )
    {
        retLabel = i18nMessage.msg_tuesday;
    } else if ( todayLabel == '수요일' )
    {
        retLabel = i18nMessage.msg_wednesday;
    } else if ( todayLabel == '목요일' )
    {
        retLabel = i18nMessage.msg_thursday;
    } else if ( todayLabel == '금요일' )
    {
        retLabel = i18nMessage.msg_friday;
    } else if ( todayLabel == '토요일' )
    {
        retLabel = i18nMessage.msg_saturday;
    }

    return retLabel;
}

/*
 * 값이 null 인 경우 0을 리턴 dt : 숫자 값 flotLen : 소숫점 자리수
 */
function setNumber ( dt, flotLen )
{
    var ret = dt;

    if ( (ret == null) || (ret == '') || (ret == undefined) || (ret == NaN) )
    {
        ret = 0;
    }

    ret = numberWithCommas ( Number ( ret ).toFixed ( flotLen ) );

    return ret;
}

/*
 * 파라미터로 전달된 날짜를 yyyy-mm-dd 형식으로 변환한다. telecube@LJI
 */
function makeDateToString ( dt, seperator )
{
    var year = dt.getFullYear ();
    var month = new String ( dt.getMonth () + 1 );
    var day = new String ( dt.getDate () );

    // 한자리수일 경우 0을 채워준다.
    if ( month.length == 1 )
    {
        month = "0" + month;
    }
    if ( day.length == 1 )
    {
        day = "0" + day;
    }

    var newDt = '';
    if ( seperator.length > 0 )
    {
        newDt = "{0}{1}{2}{3}{4}".format ( year, seperator, month, seperator, day );
    } else
    {
        newDt = "{0}{1}{2}".format ( year, month, day );
    }
    // console.log("convert date :: {0}".format(newDt));
    return newDt;
}

/*
 * 달성율에 따른 색상 리턴
 */
function setAchRateColor ( rate )
{
    var n = setNumber ( rate, 0 );
    var ret = '';

    if ( n >= 100 )
    {
        ret = 'morethan100';
    } else if ( (n < 100) && (n >= 90) )
    {
        ret = 'under100';
    } else
    {
        ret = 'under90';
    }

    return ret;
}


/*
 * 발전량 달성율(100% 기준)
 */
function getGeneqtyRate ( geneqty, digit )
{
    if(_.isNull(geneqty)) return setNumber(0,digit);
    if(setNumber(geneqty,digit) == setNumber(0,digit)) return setNumber(0,digit);
    
    return (geneqty>=100)?setNumber(geneqty-100,digit):setNumber(100 - geneqty,digit);  
}

/*
 * 발전량 달성율 UniCode : &#9650; --> ▲, &#9660; --> ▼ 
 */
function getGeneqtyUniCode ( geneqty )
{
    if(_.isNull(geneqty)) return ''; 
    if(setNumber(geneqty,1) == setNumber(0,1)) return ''; 
    
    return (geneqty>=100)?'&#9650;':'&#9660;'; 
}

/**
 * 달성율 color : up --> '#ff0000', down --> '#1192ff'
 */
function getGeneqtyHexCd ( geneqty )
{
    if(_.isNull(geneqty)) return '';  
    if(setNumber(geneqty,1) == setNumber(0,1)) return '';    
    if(geneqty>=100) return '#ff0000';   
    return (geneqty>=100)?'#ff0000':'#1192ff';    
}

/*
 * 태양광 사업 상세현황 출력
 */
function makeDailyPvReport ( pvDailyData )
{
    var insertTR = "";
    var warningBranch = 0;
    var paramPvName;

    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
    date.setTime ( date.getTime () );
    var year = makeDateToString ( date, '' ).substring ( 0, 4 );
    var yearM = makeDateToString ( date, '' ).substring ( 0, 6 );
    console.log ( "pv year::", year );

    for ( var i = 0; i < pvDailyData.length; i++ )
    {

        insertTR += "<tr>";
        if ( pvDailyData[i].lastRegDt != null )
        {
            insertTR += "  <td rowspan='2'>{0}</td>".format ( pvDailyData[i].lastRegDt.substring ( 5, 16 ) );
        }
        else{
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }
        insertTR += "  <td rowspan='2' class='tit'>{0}</td>".format ( pvDailyData[i].pvKorName );
        insertTR += "  <td><span class=''>{0}</span></td>".format ( i18nMessage.msg_energyKWh );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].planDayGeneration, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].acmsltDayGeneration, 1 ) );
        //발전량 : 일일실적-계획 대비(%)        
        insertTR += "  <td rowspan='2' class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    pvDailyData[i].planRateDayGeneration 
                    , pvDailyData[i].planRateDayGenerationHexCd
                    , pvDailyData[i].planRateDayGenerationUnicodeSign
                    , pvDailyData[i].planRateDayGenerationAchievementRate
                    );
                
        if ( pvDailyData[i].wheather9HStatus != null )
        {
            insertTR += "  <td rowspan='2'><i class='sts_wth {0}'></i></td>".format ( pvDailyData[i].wheather9HStatus );
        } else
        {
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }

        if ( pvDailyData[i].wheather12HStatus != null )
        {
            insertTR += "  <td rowspan='2'><i class='sts_wth {0}'></i></td>".format ( pvDailyData[i].wheather12HStatus );
        } else
        {
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }

        if ( pvDailyData[i].wheather15HStatus != null )
        {
            insertTR += "  <td rowspan='2'><i class='sts_wth {0}'></i></td>".format ( pvDailyData[i].wheather15HStatus );
        } else
        {
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }

        if ( pvDailyData[i].wheather18HStatus != null )
        {
            insertTR += "  <td rowspan='2'><i class='sts_wth {0}'></i></td>".format ( pvDailyData[i].wheather18HStatus );
        } else
        {
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }

        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].planYearGeneration, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].acmsltYearGeneration, 1 ) );
        //발전량 : 누계-계획 대비(%)
        insertTR += "  <td rowspan='2' class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    pvDailyData[i].planRateYearGeneration 
                    , pvDailyData[i].planRateYearGenerationHexCd
                    , pvDailyData[i].planRateYearGenerationUnicodeSign
                    , pvDailyData[i].planRateYearGenerationAchievementRate 
                    );
        
        insertTR += "  <td rowspan='2'>";
        insertTR += "    <span class='ttl'>{0}</span>".format ( setNumber ( pvDailyData[i].dayCountTotal, 0 ) );
        insertTR += "    <span class='ttl_sub'>(<span class='imp'>1{0} {1} : {2}</span> / {3} : {4})</span>".format (
                i18nMessage.msg_day, i18nMessage.msg_over2, setNumber ( pvDailyData[i].overdayCount, 0 ),
                i18nMessage.msg_less, setNumber ( pvDailyData[i].dayCount, 0 ) );
        insertTR += "  </td>";
        insertTR += "  <td rowspan='2'>";
        paramPvName = pvDailyData[i].pvKorName;
        insertTR += "    <a href="
                + contextPath
                + "/dashboard/execdashboard/newRevivStatusInfoPopupSolar.do?pv_id={0}&year={1}&yearm={2}&pv_name={3} class='btn_chart btn_popup'>"
                        .format ( pvDailyData[i].pvId, year, yearM, paramPvName  );
        insertTR += "      cctv {0}".format ( i18nMessage.msg_view );
        insertTR += "    </a>";
        insertTR += "  </td>";
        insertTR += "</tr>";
        insertTR += "<tr>";
        insertTR += "  <td><span class=''>{0}({1})</span></td>".format ( i18nMessage.msg_salesAmount,
                pvDailyData[i].currency );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].goalDaySelng, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].acmsltDaySelng, 1 ) );
        //매출액 : 일일실적-계획 대비(%)
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].goalYearSelng, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( pvDailyData[i].acmsltYearSelng, 1 ) );
        insertTR += "</tr>";

        if ( Number ( setNumber ( pvDailyData[i].dayCountTotal, 0 ) > 0 ) )
        {
            warningBranch++;
        }
    }

    // 설비이상 미조치 개소
    $ ( "#pvWarningBranch" ).html ( "총 {0}개소".format ( warningBranch ) );

    $ ( '#pv_table_row_insert > tbody >tr' ).remove ();
    $ ( '#pv_table_row_insert > tbody:last' ).append ( insertTR );
    showPopup ();
}

/*
 * ESS 사업 상세현황 출력
 */
function makeDailyEssReport ( essDailyData )
{
    var insertTR = "";
    var warningBranch = 0;

    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
    date.setTime ( date.getTime () );
    var year = makeDateToString ( date, '' ).substring ( 0, 4 );
    var yearM = makeDateToString ( date, '' ).substring ( 0, 6 );
    console.log ( "ess year::", year );

    $ ( '#ess_report_plan' ).html ( "{0} {1}".format ( year, i18nMessage.msg_reportPlan ) );

    for ( var i = 0; i < essDailyData.length; i++ )
    {
        insertTR += "<tr>";
        if ( essDailyData[i].lastRegDt != null )
        {
            insertTR += "  <td rowspan='2'>{0}</td>".format ( essDailyData[i].lastRegDt.substring ( 5, 16 ) );
        }
        else{
            insertTR += "  <td rowspan='2'><i class=''>-</i></td>"
        }
        insertTR += "  <td rowspan='2' class='tit'>{0}</td>".format ( essDailyData[i].pvKorName );
        insertTR += "  <td><span class=''>{0}(kWh)</span></td>".format ( i18nMessage.msg_dischargeRatio );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].planDayEDE, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].acmsltDayEDE, 1 ) );
        //일일 실적 : 방전량(kWh) - 계획 대비(%)
        insertTR += "  <td class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    essDailyData[i].planRateDayEDE 
                    , essDailyData[i].planRateDayEDEHexCd
                    , essDailyData[i].planRateDayEDEUnicodeSign
                    , essDailyData[i].planRateDayEDEAchievementRate
                    );

        
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].planYearEDE, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].acmsltYearEDE, 1 ) );
        //누계 실적 : 방전량(kWh) - 계획 대비(%)        
        insertTR += "  <td class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    essDailyData[i].planRateYearEDE 
                    , essDailyData[i].planRateYearEDEHexCd
                    , essDailyData[i].planRateYearEDEUnicodeSign
                    , essDailyData[i].planRateYearEDEAchievementRate
                    );
        
        insertTR += "  <td rowspan='2'>";
        insertTR += "    <span class='ttl'>{0}</span>".format ( setNumber ( essDailyData[i].dayCountTotal, 0 ) );
        insertTR += "    <span class='ttl_sub'>(<span class='imp'>1{0} {1} : {2}</span> / {3} : {4})</span>".format (
                i18nMessage.msg_day, i18nMessage.msg_over2, setNumber ( essDailyData[i].overdayCount, 0 ),
                i18nMessage.msg_less, setNumber ( essDailyData[i].dayCount, 0 ) );
        insertTR += "  </td>";
        insertTR += "  <td rowspan='2'>";
        insertTR += "    <a href="
                + contextPath
                + "/dashboard/execdashboard/newRevivStatusInfoPopupEss.do?pv_id={0}&year={1}&yearm={2}&pv_name={3} class='btn_chart btn_popup'>"
                        .format ( essDailyData[i].pvId, year,yearM, encodeURI ( essDailyData[i].pvKorName, "UTF-8" ) );
        insertTR += "      cctv {0}".format ( i18nMessage.msg_view );
        insertTR += "    </a>";
        insertTR += "  </td>";
        insertTR += "</tr>";
        insertTR += "<tr>";
        insertTR += "  <td><span class=''>SOH(%)</span></td>";
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].planDaySOH, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].acmsltDaySOH, 1 ) );
        //일일 실적 : SOH(%) - 계획 대비(%)        
        insertTR += "  <td class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    essDailyData[i].planRateDaySOH 
                    , essDailyData[i].planRateDaySOHHexCd
                    , essDailyData[i].planRateDaySOHUnicodeSign
                    , essDailyData[i].planRateDaySOHAchievementRate
                    );
        
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].planYearSOH, 1 ) );
        insertTR += "  <td class='item_num'>{0}</td>".format ( setNumber ( essDailyData[i].acmsltYearSOH, 1 ) );
        //누계 실적 : SOH(%) - 계획 대비(%)        
        insertTR += "  <td class='item_num'>{0}(<span style='color:{1};'><span class='perc'>{2}</span>{3}</span>)</td>"
            .format ( 
                    essDailyData[i].planRateYearSOH 
                    , essDailyData[i].planRateYearSOHHexCd
                    , essDailyData[i].planRateYearSOHUnicodeSign
                    , essDailyData[i].planRateYearSOHAchievementRate
                    );

        insertTR += "</tr>";

        if ( Number ( setNumber ( essDailyData[i].dayCountTotal, 0 ) > 0 ) )
        {
            warningBranch++;
        }
    }

    // 설비이상 미조치 개소
    $ ( "#essWarningBranch" ).html ( "총 {0}개소".format ( warningBranch ) );

    $ ( '#ess_table_row_insert > tbody >tr' ).remove ();
    $ ( '#ess_table_row_insert > tbody:last' ).append ( insertTR );
    showPopup ();
}

/*
 * 해당 일자의 경영자 대시보드 정보를 ajax 요청한다.
 * 
 */
function reqDirectorDashboard ()
{

    var newDate = getDateTimePickerDate ();
    var selectAllFlag = '0';

    if ( $ ( "#cntSelAll" ).prop ( "checked" ) )
    {
        selectAllFlag = '1';
    } else
    {
        selectAllFlag = '0';
    }

    var params = {
        newDate : newDate,
        selectAllFlag : selectAllFlag
    };

    console.log ( "reqDirectorDashboard() ajax:: {0}".format ( contextPath
            + '/dashboard/execdashboard/execDashboardPvList.ajax' ) );
    console.log ( "params:: {0}".format ( JSON.stringify ( params ) ) );

    $.ajax ( {
        url : contextPath + '/dashboard/execdashboard/execDashboardPvList.ajax',
        type : 'POST',
        data : params,
        dataType : 'json',
        success : function ( json )
        {
        	$('.eng_dtl_box').scrollTop(0);
        	
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                // 데이터가 없을 경우 화면 초기화
                if ( (json.data.pvReportList == null) || (json.data.essReportList == null) )
                {
                    console.log ( "received data empty." );
                    dataInit ();
                    return;
                }

                // 데이터가 없을 경우 화면 초기화
//                if ( (json.data.pvReportList.length <= 0) || (json.data.essReportList <= 0) )
//                {
//                    console.log ( "received data empty." );
//                    dataInit ();
//                    return;
//                }

                var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
                date.setTime ( date.getTime () );
                var convDate = makeDateToString ( date, '-' );

                var year = makeDateToString ( date, '' ).substring ( 0, 4 );
                console.log ( "year::", year );

                $ ( '#pv_summary_date' ).html ( '[ {0} ({1}) ]'.format ( convDate, getDaYLabel ( convDate ) ) );
                $ ( '#ess_summary_date' ).html ( '[ {0} ({1}) ]'.format ( convDate, getDaYLabel ( convDate ) ) );
                
                $("#pvGridStatusYear").html("* "+year+i18nMessage.msg_year+
                		" " +i18nMessage.msg_accumulation+" " +i18nMessage.msg_planAgainst);
                $("#essGridStatusYear").html("* "+year+i18nMessage.msg_year+
                		" " +i18nMessage.msg_accumulation+" " +i18nMessage.msg_planAgainst);

               
                // 일자별 태양광사업 상세현황
                if ( json.data.pvReportList.length > 0 )
                {
                    makeDailyPvReport ( json.data.pvReportList );
                }

                // 일자별 ESS사업 상세현황
                if ( json.data.essReportList.length > 0 )
                {
                    makeDailyEssReport ( json.data.essReportList );
                }

                $ ( '#pv_accumulation_year' ).html (
                        "{0} ({1}{2})".format ( i18nMessage.msg_accumulation, year, i18nMessage.msg_year ) );
                $ ( '#ess_accumulation_year' ).html (
                        "{0} ({1}{2})".format ( i18nMessage.msg_accumulation, year, i18nMessage.msg_year ) );

                $ ( '#pv_daily_acv' ).html (
                        '{0}% (<span style="color:{1};"><span class="perc">{2}</span>{3}</span>)'                        
                        .format ( 
                                setNumber ( json.data.pvDayPlanStatusAchieve, 0 )
                                ,getGeneqtyHexCd( json.data.pvDayPlanStatusAchieve )
                                ,getGeneqtyUniCode( json.data.pvDayPlanStatusAchieve )
                                ,getGeneqtyRate( json.data.pvDayPlanStatusAchieve, 0 )                                
                                )
                               );
                
                // 태양광사업 요약보고 / 2019년 계획대비 현황
                $ ( '#pv_report_plan' ).html ( "{0} {1}".format ( year, i18nMessage.msg_reportPlan ) );
                
                $ ( '#pv_year_acv' ).html (
                      '{0}% (<span style="color:{1};"><span class="perc">{2}</span>{3}</span>)'                        
                      .format ( 
                              setNumber ( json.data.pvYearPlanStatusAchieve, 0 )
                              ,getGeneqtyHexCd( json.data.pvYearPlanStatusAchieve )
                              ,getGeneqtyUniCode( json.data.pvYearPlanStatusAchieve )
                              ,getGeneqtyRate( json.data.pvYearPlanStatusAchieve, 0 )                                
                              )
                             );

                $ ( '#ess_daily_acv' ).html (
                        '{0}% (<span style="color:{1};"><span class="perc">{2}</span>{3}</span>)'                        
                        .format ( 
                                setNumber ( json.data.essDayPlanStatusAchieve, 0 )
                                ,getGeneqtyHexCd( json.data.essDayPlanStatusAchieve )
                                ,getGeneqtyUniCode( json.data.essDayPlanStatusAchieve )
                                ,getGeneqtyRate( json.data.essDayPlanStatusAchieve, 0)                                
                                )
                               );
                

                // ESS사업 요약보고 / 2019년 계획대비 현황
                $ ( '#ess_report_plan' ).html ( "{0} {1}".format ( year, i18nMessage.msg_reportPlan ) );

                $ ( '#ess_year_acv' ).html (
                        '{0}% (<span style="color:{1};"><span class="perc">{2}</span>{3}</span>)'                        
                        .format ( 
                                setNumber ( json.data.essYearPlanStatusAchieve, 0 )
                                ,getGeneqtyHexCd( json.data.essYearPlanStatusAchieve )
                                ,getGeneqtyUniCode( json.data.essYearPlanStatusAchieve )
                                ,getGeneqtyRate( json.data.essYearPlanStatusAchieve, 0 )                                
                                )
                               );

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                console.log ( "error1" );
                dataInit ();
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
            console.log ( "error2" );
            dataInit ();
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

/**
 * datetimepicker getdate telecube@LJI 2019.1.2
 */
function getDateTimePickerDate ()
{
    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
    var mm = date.getMonth () + 1;
    mm = formattedNumber = ("0" + mm).slice ( -2 );
    var dd = date.getDate ();
    dd = formattedNumber = ("0" + dd).slice ( -2 );
    var newDate = date.getFullYear () + "-" + mm + "-" + dd;
    // console.log("getDateTimePickerDate:: {0}".format(newDate));
    return newDate;
}

/*
 * 화면 정보 초기화 한다.
 */
function dataInit ()
{
    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
    date.setTime ( date.getTime () );
    var convDate = makeDateToString ( date, '-' );

    var year = makeDateToString ( date, '' ).substring ( 0, 4 );
    console.log ( "year::", year );

    $ ( '#pv_accumulation_year' ).html (
            "{0} ({1}{2})".format ( i18nMessage.msg_accumulation, year, i18nMessage.msg_year ) );
    $ ( '#ess_accumulation_year' ).html (
            "{0} ({1}{2})".format ( i18nMessage.msg_accumulation, year, i18nMessage.msg_year ) );

    $ ( '#pv_summary_date' ).html ( '[ {0} ({1}) ]'.format ( convDate, getDaYLabel ( convDate ) ) );
    $ ( '#ess_summary_date' ).html ( '[ {0} ({1}) ]'.format ( convDate, getDaYLabel ( convDate ) ) );
    $ ( "#pvWarningBranch" ).html ( "총 {0}개소".format ( '' ) );
    $ ( "#essWarningBranch" ).html ( "총 {0}개소".format ( '' ) );

    // 태양광사업 요약보고 / 일일계획대비 현황
    $ ( '#pv_daily_acv' ).html ( '{0}% {1}'.format ( '', i18nMessage.msg_achievement ) );
    $ ( '#pv_daily_udr' ).html ( '/ {0}% {1}'.format ( '', i18nMessage.msg_under2 ) );

    // 태양광사업 요약보고 / 2019년 계획대비 현황
    $ ( '#pv_report_plan' ).html ( "{0} {1}".format ( year, i18nMessage.msg_reportPlan ) );
    $ ( '#pv_year_acv' ).html ( '{0}% {1}'.format ( '', i18nMessage.msg_achievement ) );
    $ ( '#pv_year_udr' ).html ( '/ {0}% {1}'.format ( '', i18nMessage.msg_under2 ) );

    // ESS사업 요약보고 / 일일계획대비 현황
    $ ( '#ess_daily_acv' ).html ( '{0}% {1}'.format ( '', i18nMessage.msg_achievement ) );
    $ ( '#ess_daily_udr' ).html ( '/ {0}% {1}'.format ( '', i18nMessage.msg_under2 ) );

    // ESS사업 요약보고 / 2019년 계획대비 현황
    $ ( '#ess_report_plan' ).html ( "{0} {1}".format ( year, i18nMessage.msg_reportPlan ) );
    $ ( '#ess_year_acv' ).html ( '{0}% {1}'.format ( '', i18nMessage.msg_achievement ) );
    $ ( '#ess_year_udr' ).html ( '/ {0}% {1}'.format ( '', i18nMessage.msg_under2 ) );

    $ ( '#pv_table_row_insert > tbody >tr' ).remove ();
    $ ( '#ess_table_row_insert > tbody >tr' ).remove ();
}

/**
 * 브라우저 onLoad evet telecube@LJI 2019.1.2
 */
$ ( window ).on ( "load", function ()
{
    console.log ( "onload" );

    if ( !String.prototype.format )
    {
        String.prototype.format = function ()
        {
            var args = arguments;
            return this.replace ( /{(\d+)}/g, function ( match, number )
            {
                return typeof args[number] != 'undefined' ? args[number] : match;
            } );
        }
    }

    // 현재 날짜에서 1일전 날짜를 기본 설정한다.
    var date = $ ( '.yyyymmdd' ).datetimepicker ( 'getDate' );
    date.setTime ( date.getTime () - (1000 * 60 * 60 * 24) );
    oldDate = date;
    console.log ( "Set firstdate :: {0}".format ( makeDateToString ( oldDate, '-' ) ) );

    $ ( '.yyyymmdd' ).datetimepicker ( "setDate", date );
    getDateTimePickerDate ();
    // $('#cntSelAsia').prop("checked", true);
    $ ( '#cntSelAsia' ).prop ( "checked", true );

    /*
     * 화면 초기화
     */
    dataInit ();

    reqDirectorDashboard ();
} );

/*
 * 태양광 사업 상세현황 Excel 파일 다운로드
 */
function pvDownloadExcel ()
{

    $ ( '#btn_pv_download_xlx' ).on (
            'click',
            function ()
            {
                var newDate = getDateTimePickerDate ();
                var selectAllFlag = '0';

                if ( $ ( "#cntSelAll" ).prop ( "checked" ) )
                {
                    selectAllFlag = '1';
                } else
                {
                    selectAllFlag = '0';
                }

                // Excel download url 호출
                location.href = contextPath
                        + "/dashboard/execdashboard/PvExcelDownload.do?newDate={0}&selectAllFlag={1}".format (
                                newDate, selectAllFlag );
                console.log ( "downloadExcel() ajax:: {0}".format ( contextPath
                        + '/dashboard/execdashboard/PvExcelDownload.do' ) );

            } );
}

/*
 * ESS사업 상세현황 Excel 파일 다운로드
 */
function essDownloadExcel ()
{

    $ ( '#btn_ess_download_xlx' ).on (
            'click',
            function ()
            {
                var newDate = getDateTimePickerDate ();
                var selectAllFlag = '0';

                if ( $ ( "#cntSelAll" ).prop ( "checked" ) )
                {
                    selectAllFlag = '1';
                } else
                {
                    selectAllFlag = '0';
                }

                // Excel download url 호출
                location.href = contextPath
                        + "/dashboard/execdashboard/EssExcelDownload.do?newDate={0}&selectAllFlag={1}".format (
                                newDate, selectAllFlag );
                console.log ( "downloadExcel() ajax:: {0}".format ( contextPath
                        + '/dashboard/execdashboard/EssExcelDownload.do' ) );

            } );
}

/*
 * 태양광 사업 상세현황 PDF 파일 다운로드
 */
function pvDownloadPDF ()
{

    $ ( '#btn_pv_download_pdf' ).on (
            'click',
            function ()
            {
                var newDate = getDateTimePickerDate ();
                var selectAllFlag = '0';

                if ( $ ( "#cntSelAll" ).prop ( "checked" ) )
                {
                    selectAllFlag = '1';
                } else
                {
                    selectAllFlag = '0';
                }

                // Pdf download url 호출
                location.href = contextPath
                        + "/dashboard/execdashboard/PvPdfDownload.do?newDate={0}&selectAllFlag={1}".format (
                                newDate, selectAllFlag );
                console.log ( "downloadExcel() ajax:: {0}".format ( contextPath
                        + '/dashboard/execdashboard/PvPdfDownload.do' ) );

            } );
}

/*
 * ESS사업 상세현황 PDF 파일 다운로드
 */
function essDownloadPDF ()
{

    $ ( '#btn_ess_download_pdf' ).on (
            'click',
            function ()
            {
                var newDate = getDateTimePickerDate ();
                var selectAllFlag = '0';

                if ( $ ( "#cntSelAll" ).prop ( "checked" ) )
                {
                    selectAllFlag = '1';
                } else
                {
                    selectAllFlag = '0';
                }

                // Pdf download url 호출
                location.href = contextPath
                        + "/dashboard/execdashboard/EssPdflDownload.do?newDate={0}&selectAllFlag={1}".format (
                                newDate, selectAllFlag );
                console.log ( "downloadExcel() ajax:: {0}".format ( contextPath
                        + '/dashboard/execdashboard/EssPdflDownload.do' ) );

            } );
}

/*
 * load functions
 */
$ ( function ()
{
    console.log ( "function()::" );
    customizeScroll ();
    pvDownloadExcel ();
    essDownloadExcel ();
    pvDownloadPDF ();
    essDownloadPDF ();
    initDatetimepicker ();
    moreToggle ();
    showPopup ();
    dsGridLayout ();
    // reqDirectorDashboard(); => $(window).on("load", function() 에서 최초 호출
} );
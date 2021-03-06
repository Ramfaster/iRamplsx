var sectorDashboard = null;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/customizeForm/img/img_radio@2x.png',
        width : 13,
        height : 13
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

    var $dateType = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

// scroll customize
function customizeScroll ()
{
    $ ( '.intbl_scrl2' ).perfectScrollbar ();
}

// 국가에 해당하는 SPC 목록 정보 가져오기
function getNationSpcInfo ()
{
    var $nation = $ ( '#selNation' );
    var $spc = $ ( '#selSpc' );
    var tpl = getTemplate ( templates.dashboardSpcInfoSelect );

    $nation.change ( function ( event )
    {
        var params = {
            nationId : $ ( ':selected', $ ( this ) ).val ()
        };

        $.ajax ( {
            url : contextPath + '/hom/dashboard/sector/selectSpcInfoList.ajax',
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
                            spcInfoList : json.data
                        } );

                        sectorDashboard.sel.nation = params.nationId;

                        $spc.html ( html ).trigger ( 'change' );
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

// 각 발전소별 종합 운영 상태(Sector Dashboard) 화면 초기화
function initSector ()
{
    var sectorPromise = sectorList ();

    sectorPromise.done ( function ()
    {
        sectorDashboard.interval.sectorInterval = setInterval ( "sectorList()", sectorDashboard.interval.TIME );

    } )

}

// 데모 데이터 생성
function getDemoData ( sectorArray )
{
    var selNation = $ ( '#selNation' ).val ();
    var newArray = [];
    newArray.push.apply ( newArray, sectorArray );
    if ( staticVariable.homIsDemo && (selNation == 'all' || selNation == 'JP') )
    {
        var localTime = null;
        var opSttus = null;
        if ( sectorArray.length > 0 )
        {
            localTime = sectorArray[0].localTime;
            opSttus = sectorArray[0].opSttus;
        }

        var demoData = [ {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            spcNm : 'HSP10',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#ff0000',
            rateUnicode : '&#9650;',
            pvId : 'AI019',
            spcId : 'ACA006',
            pvNm : 'Kushiro kita',
            chargerNm : '아카이시',
            cod : '2014-12-24', // cod
            rtdCpcty : '810.9', // 설치용량
            goalGeneqty : '2040.224', // 발전량 목표
            acmsltGeneqty : '2311.065',
            geneqtyRate : '13.2750',
            genepw : '486.54', // 발전출력
            rdtn : '1386.64',
            avgGeneTm : '1.71',
            pr : '75',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#ff0000',
            rateUnicode : '&#9650;',
            pvId : 'AE015',
            pvNm : 'Kushiro minami',
            spcId : 'ACA006',
            spcNm : 'HSP10',
            chargerNm : '아카이시',
            cod : '2014-12-24', // cod
            rtdCpcty : '1193.4', // 설치용량
            goalGeneqty : '3002.594', // 발전량 목표
            acmsltGeneqty : '3446.539',
            geneqtyRate : '14.7854',
            genepw : '716.04', // 발전출력
            rdtn : '2067.92',
            avgGeneTm : '1.73',
            pr : '76',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AE011',
            pvNm : 'Awanishi',
            spcId : 'ACA004',
            spcNm : 'HSP8',
            chargerNm : '아카이시',
            cod : '2013-07-02', // cod
            rtdCpcty : '1990.5', // 설치용량
            goalGeneqty : '5143.452', // 발전량 목표
            acmsltGeneqty : '4471.459',
            geneqtyRate : '13.065',
            genepw : '1194.3', // 발전출력
            rdtn : '2682.88',
            avgGeneTm : '1.35',
            pr : '72',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AE012', // 여기부터
            pvNm : 'Higashinagamine2',
            spcId : 'ACA004',
            spcNm : 'HSP8',
            chargerNm : '아카이시',
            cod : '2014-03-01', // cod
            rtdCpcty : '1130.15', // 설치용량
            goalGeneqty : '2843.457', // 발전량 목표
            acmsltGeneqty : '2609.29',
            geneqtyRate : '8.2352',
            genepw : '678.09', // 발전출력
            rdtn : '1565.57',
            avgGeneTm : '1.39',
            pr : '74',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AI018', // 여기부터
            pvNm : 'Higashinagamine3',
            spcId : 'ACA004',
            spcNm : 'HSP8',
            chargerNm : '아카이시',
            cod : '2016-05-01', // cod
            rtdCpcty : '422.24', // 설치용량
            goalGeneqty : '1033.644', // 발전량 목표
            acmsltGeneqty : '974.8677',
            geneqtyRate : '5.6863',
            genepw : '253.344', // 발전출력
            rdtn : '584.92',
            avgGeneTm : '1.39',
            pr : '74',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AE013', // 여기부터
            pvNm : 'Higashinagamine4',
            spcId : 'ACA004',
            spcNm : 'HSP8',
            chargerNm : '아카이시',
            cod : '2016-05-01', // cod
            rtdCpcty : '1164.8', // 설치용량
            goalGeneqty : '3089.05', // 발전량 목표
            acmsltGeneqty : '2798.316',
            geneqtyRate : '9.4118',
            genepw : '698.88', // 발전출력
            rdtn : '1678.99',
            avgGeneTm : '1.44',
            pr : '77',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AE014', // 여기부터
            pvNm : 'Nishinagamine',
            spcId : 'ACA005',
            spcNm : 'HSP9',
            chargerNm : '아카이시',
            cod : '2015-03-02', // cod
            rtdCpcty : '2098.14', // 설치용량
            goalGeneqty : '5207.583', // 발전량 목표
            acmsltGeneqty : '5040.572',
            geneqtyRate : '3.207',
            genepw : '1258.884', // 발전출력
            rdtn : '3024.34',
            avgGeneTm : '1.44',
            pr : '77',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AI021', // 여기부터
            pvNm : 'Hokota',
            spcId : 'ACA002',
            spcNm : 'HSP5',
            chargerNm : '아카이시',
            cod : '2016-01-01', // cod
            rtdCpcty : '805.6', // 설치용량
            goalGeneqty : '1972.109', // 발전량 목표
            acmsltGeneqty : '1859.969',
            geneqtyRate : '5.6862',
            genepw : '483.36', // 발전출력
            rdtn : '1115.98',
            avgGeneTm : '1.39',
            pr : '74',
            avaty : '100.0000'
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusCd : 'ALVL01',
            opSttusIconCd : 'icon_green02',
            operId : 'CH0014',
            localTime : localTime,
            cctvQy : 0,
            nationNm : '일본',
            rdtnUnitNm : 'Wh/㎡',
            weatherTmp : '26.01',
            weather : '맑음',
            geneqtyHexCd : '#1f497d',
            rateUnicode : '&#9660;',
            pvId : 'AA001', // 여기부터
            pvNm : 'Kithuki',
            spcId : 'ACA001',
            spcNm : 'HSPK',
            chargerNm : '아카이시',
            cod : '2015-01-05', // cod
            rtdCpcty : '24472', // 설치용량
            goalGeneqty : '62403.6', // 발전량 목표
            acmsltGeneqty : '58028.01',
            geneqtyRate : '7.0118',
            genepw : '14683.2', // 발전출력
            rdtn : '34816.8',
            avgGeneTm : '1.42',
            pr : '76',
            avaty : '100.0000'
        } ];

        newArray.push.apply ( newArray, demoData );
    }

    return newArray;
}

// 각 발전소별 종합 운영 상태(Sector Dashboard) 데이터 구성
function sectorList ()
{
    var deferred = $.Deferred ();

    sectorDashboard.loadFlag.sector = false;
    // ajax로 데이터 가져오기
    var sectorArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/siteKpiStatusInfo/selectPvEssKpiInfo.ajax',
        type : 'POST',
        data : {
            acmsltCycleCd : sectorDashboard.acmsltCycleCd.acmsltCycleCd,
            nationId : sectorDashboard.sel.nation,
            spcId : sectorDashboard.sel.spc,
            bizTy : 'all'
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var template = _.template ( sectorDashboard.tpl.sectorList );
                var html = template ( {
                    homUtil : homUtil,
                    contextPath : contextPath,
                    siteKpiInfoList : json.data,
                    cctvMsg : i18nMessage.msg_cctv
                } );

                $ ( '#sectorList tbody' ).html ( html );

                customizeScroll ();

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
            deferred.resolve ();
            showPopup ();
            clickCctvPopup ();

            onChangeStandardDate ( $ ( '#search_option input[name="period"]:checked' ).val () );
            
            setAlarmStatus ();
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

            deferred.fail ();
        }
    } );

    sectorDashboard.loadFlag.sector = true;
    return deferred.promise ();
}

// sector option 변경시 새로운 Interval 세팅
function changeOption ()
{
    var originFlag = true;

    var $searchOptionInput = $ ( '#search_option input' );
    var $selSpc = $ ( '#selSpc' );

    // SPC 변경 시 새로운 Interval 생성
    $selSpc.on ( 'change', function ()
    {
        if ( sectorDashboard.loadFlag.sector )
        {

            var clearSectorPromise = clearSectorList ();

            clearSectorPromise.done ( function ()
            {
                // 현재 선택된 SPC 확인
                sectorDashboard.sel.spc = $selSpc.val ();

                // 선택된 값으로 sectorList ajax 데이터 가져오기
                initSector ();

            } );
        } else if ( !sectorDashboard.loadFlag.sector )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertLoadPageNoChange,
                checkText : i18nMessage.msg_ok,
                type : staticVariable.dialogTypeInfo
            } );
        }

    } );

    // Radio 옵션 변경 시 새로운 Interval 생성
    $searchOptionInput.on ( 'change', function ()
    {
        if ( sectorDashboard.loadFlag.sector )
        {

            var clearSectorPromise = clearSectorList ();

            clearSectorPromise.done ( function ()
            {
                // 현재 선택된 RADIO 값 확인
                sectorDashboard.acmsltCycleCd.acmsltCycleCd = $ ( '#search_option input[name="period"]:checked' )
                        .val ();

                // 선택된 RADIO 값으로 sectorList ajax 데이터 가져오기
                initSector ();

            } );
        } else if ( !sectorDashboard.loadFlag.sector )
        {
            if ( originFlag )
            {
                originFlag = false;
                var option = _.find ( $searchOptionInput, function ( option )
                {
                    return $ ( option ).attr ( 'id' ) === sectorDashboard.acmsltCycleCd.acmsltCycleCd;
                } );
                $ ( option ).prop ( 'checked', true ).trigger ( 'change' );

                $.customizeDialog ( {
                    template : templates.dialog,
                    message : i18nMessage.msg_alertLoadPageNoChange,
                    checkText : i18nMessage.msg_ok,
                    type : staticVariable.dialogTypeInfo
                } );
                originFlag = true;

            }
        }

    } );
}

function onChangeStandardDate ( checkedVal )
{
    var date = new Date ();
    date.setDate ( date.getDate () - 1 );

    if ( checkedVal == homConstants.acmsltCycleColct03 )
    {
    	$ ( '.thisDayMonthYearVar' ).text (
    			i18nMessage.msg_today );
    	
    	$ ( '.prevDayMonthYearVar' ).text (
    			i18nMessage.msg_daybef );
    	
        $ ( '.ntc' ).text (
                '(' + i18nMessage.msg_standardDate + ' : '
                        + homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMMDD ) + ')' );
        

    } else if ( checkedVal == homConstants.acmsltCycleColct04 )
    {
    	
    	$ ( '.thisDayMonthYearVar' ).text (
    			i18nMessage.msg_thisMonth );
    	
    	$ ( '.prevDayMonthYearVar' ).text (
    			i18nMessage.msg_prevMonth );
    	
        $ ( '.ntc' ).text (
                '(' + i18nMessage.msg_standardDate + ' : '
                        + homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYYMM ) + ')' );

    } else if ( checkedVal == homConstants.acmsltCycleColct05 )
    {
    	$ ( '.thisDayMonthYearVar' ).text (
    			i18nMessage.msg_thisYear );
    	
    	$ ( '.prevDayMonthYearVar' ).text (
    			i18nMessage.msg_prevYear );

    	$ ( '.ntc' ).text (
                '(' + i18nMessage.msg_standardDate + ' : '
                        + homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYY ) + ')' );

    } else if ( checkedVal == homConstants.acmsltCycleColct06 )
    {
    	
    	$ ( '.thisDayMonthYearVar' ).text ( '-' );
    	
    	$ ( '.prevDayMonthYearVar' ).text (
    			i18nMessage.msg_codstat );

    	
        $ ( '.ntc' ).text (
                '(' + i18nMessage.msg_standardDate + ' : COD ~ '
                        + homUtil.getParamFormatDate ( date, homUtil.dateFormat.convertYYYY ) + ')' );
    }
}


function clearSectorList ()
{
    var deferred = $.Deferred ();

    // 기존에 선택된 RADIO 버튼의 Interval 이벤트 CLEAR하기
    clearInterval ( sectorDashboard.interval.sectorInterval );

    deferred.resolve ();
    return deferred.promise ();
}

// 엑셀 다운로드
function clickBtnExcel ()
{

    var $btnExcel = $ ( '.btn_excel' );
    $btnExcel.on ( 'click', function ()
    {
        console.log ( "AcmsltCycleCd : " + sectorDashboard.acmsltCycleCd.acmsltCycleCd );
        console.log ( "NationId : " + sectorDashboard.sel.nation );
        console.log ( "spcId : " + sectorDashboard.sel.spc );

        var params = {
            acmsltCycleCd : sectorDashboard.acmsltCycleCd.acmsltCycleCd,
            nationId : sectorDashboard.sel.nation,
            spcId : sectorDashboard.sel.spc,
            bizTy : 'all'
        };

        console.log ( params );

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );
}

// sector cctv 개별보기 팝업
function clickCctvPopup ()
{
    $ ( '.btn_cctv' ).on ( 'click', function ()
    {
        
        var agent = navigator.userAgent.toLowerCase();
        if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1))
        {
             // ie일 경우
        }
        else
        {
             // ie가 아닐 경우
            alert(i18nMessage.msg_alertOnlyIe);
            return false;
        }
        
        // var popUrl = contextPath + "/hom/dashboard/sector/cctvPopUp.do"; // 팝업창에 출력될 페이지 URL
        var popUrl = $ ( this ).attr ( 'href' ); // 팝업창에 출력될 페이지 URL
        var width = 1075, height = 640;
        // var width = 1075, height = 750;

        var winHeight = document.body.clientHeight; // 현재창의 높이
        var winWidth = document.body.clientWidth; // 현재창의 너비
        var winX = window.screenX || window.screenLeft || 0;// 현재창의 x좌표
        var winY = window.screenY || window.screenTop || 0; // 현재창의 y좌표

        var popX = winX + (winWidth - width) / 2;
        var popY = winY + (winHeight - height) / 2;

        var popOption = 'width=' + width;
        popOption += 'px,height=' + height;
        popOption += 'px,left=' + popX;
        popOption += ',top=' + popY;

        var popOption = 'width=' + width + 'px,height=' + height + 'px,left=' + popX + ',top=' + popY;
        window.open ( popUrl, '', popOption );

        return false;
    } );
}

// 담당자 팝업창
function showPopup ()
{
    var $btnPopup = $ ( '.btn_user_popup' );
    $btnPopup.magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,

        callbacks : {
            ajaxContentAdded : function ()
            {
                setChargerPopUp ( $.magnificPopup.instance.st.el.closest ( 'tr' ).find ( '.pvName' ).text () );
            }
        }
    } );
}

// 일사량 단위 변경
function changeRdtnUnit ()
{
    var $rdtnUnitNM = $ ( '#rdtnUnitNM' );

    // 전일,금일 일 경우
    if ( sectorDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct02
            || sectorDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct03 )
    {
        $rdtnUnitNM.html ( '(' + sectorDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixD + ')' );
    }
    // 전년,금년 일 경우
    else if ( sectorDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct01
            || sectorDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct05 )
    {
        $rdtnUnitNM.html ( '(' + sectorDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixY + ')' );
    }
    // 금월 일 경우
    else if ( sectorDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct04 )
    {
        $rdtnUnitNM.html ( '(' + sectorDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixM + ')' );
    }
    // cod 일 경우
    else
    {
        $rdtnUnitNM.html ( '(' + sectorDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixCod + ')' );
    }

}

//알람상태 : 서버에 있는 알람상태 가져오는 부분이 시간이 많이 걸려서 화면로딩 후 ajax로 발전소별로 상태정보를 가져 옴. 
function setAlarmStatus ()
{
    //webapp/template/dashboard/sectorList.html 에 있는   아래 속성이 있는 span list를 가져 온 후 상태정보 업데이트.
    //<span class="dvc_status normal" alarm_status pv_id="{{=itemInfo.pvId}}" biz_ty="{{=itemInfo.bizTy}}"></span>
    var $alarm_status_list = $ ( '*[alarm_status]' );
    
    $.each ( $alarm_status_list, function ( index, item )
    {
        getAlarmStatus($(this).attr('pv_id'),$(this).attr('biz_ty'), $(this));    
    } );
    
}


function getAlarmStatus (pvId, bizTy, $span)
{
    
    $.ajax ( {
        url : contextPath + '/hom/dashboard/sector/getAlarmStatus.ajax',
        type : 'POST',
        data : {
            pvId : pvId,
            bizTy : bizTy
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmLevel = json.data;
                
                if(alarmLevel === 'ALVL01') {
                    $span.attr('class','dvc_status normal');
                    $span.text(i18nMessage.msg_mntrNormal);                    
                } else if(alarmLevel === 'ALVL02') {
                    $span.attr('class','dvc_status warnng');   
                    $span.text(i18nMessage.msg_mntrEqmtWarning);                    
                } else if(alarmLevel === 'ALVL03') {
                    $span.attr('class','dvc_status broken');
                    $span.text(i18nMessage.msg_mntrFault);                    
                } else if(alarmLevel === 'ALVL04') {
                    $span.attr('class','dvc_status neterr'); 
                    $span.text(i18nMessage.msg_mntrNetErr);                    
                } else  {
                    $span.attr('class','dvc_status normal'); 
                    $span.text(i18nMessage.msg_mntrNormal);                    
                }

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                //loop 를 돌면서 span tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않고 상태정보만 '' 로 처리.
                $span.attr('class','dvc_status normal');
                $span.text('');                    

            }
        },
        error : function ( xhr, textStatus, error )
        {
            //loop 를 돌면서 span tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않고 상태정보만 '' 로 처리.
            $span.attr('class','dvc_status normal');
            $span.text('');                    
        }
    } );
    
}


$ ( function ()
{

    sectorDashboard = {
        interval : {
            TIME : (1000 * 4 * 60) + 5000,
            sectorInterval : null
        },
        tpl : {
            sectorList : getTemplate ( templates.sectorList ),
            dashboardNoData : getTemplate ( templates.dashboardNoData )
        },
        acmsltCycleCd : {
            acmsltCycleCd : $ ( '#search_option input[name="period"]:checked' ).val ()
        },
        loadFlag : {
            sector : true
        },
        unit : {
            rdtnUniNm : null
        },
        sel : {
            nation : $ ( '#selNation' ).val (),
            spc : $ ( '#selSpc' ).val ()
        }
    };

    customizeForm ();
    // customizeScroll ();
    // rssFeedSlide ();
    getNationSpcInfo ();
    initSector ();
    changeOption ();
    clickBtnExcel ();    

} );
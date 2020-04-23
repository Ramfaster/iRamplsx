var insightDashboard = null;

// form element customize
function customizeForm ()
{
    var $imageType = $ ( '.customize_radio' ).customizeRadio ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_radio@2x.png',
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
    $ ( '.intbl_scrl' ).perfectScrollbar ();
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
            url : contextPath + '/hom/dashboard/insight/selectSpcInfoList.ajax',
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

                        insightDashboard.sel.nation = params.nationId;

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

// 각 발전소별 목표 대비 실적(Insight Dashboard) 화면 초기화
function initInsight ()
{
    var insightPromise = insightList ();

    insightPromise.done ( function ()
    {
        // 해당 데이터로 Interval 함수 생성 (해당 함수 실행)
        insightDashboard.interval.insightInterval = setInterval ( "insightList()", insightDashboard.interval.TIME );

    } )

}

// 데모 일경우 특정 발전소 필터링 하기
function setRemoveSpecificPv ( insightArray )
{
    var filteredArray = _.filter ( insightArray, function ( insight )
    {
        return !(insight.pvId === 'AI019' || insight.pvId === 'AE015' || insight.pvId === 'AE011'
                || insight.pvId === 'AE012' || insight.pvId === 'AI018' || insight.pvId === 'AE013'
                || insight.pvId === 'AE014' || insight.pvId === 'AI021' || insight.pvId === 'AA001')
    } );

    return filteredArray;
}

// 데모 데이터 생성
function getDemoData ( insightArray )
{
    var newArray = [];
    var selNation = $ ( '#selNation' ).val ();

    if ( staticVariable.homIsDemo && (selNation == 'all' || selNation == 'JP') )
    {
        insightArray = setRemoveSpecificPv ( insightArray );
        newArray.push.apply ( newArray, insightArray );
        var localTime = null;
        var opSttus = null;
        if ( insightArray.length > 0 )
        {
            opSttus = insightArray[0].opSttus;
        }

        var demoData = [ {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AI019', // 여기부터
            spcId : 'ACA006',
            pvNm : 'Kushiro kita',
            rtdCpcty : '810.9',
            nationNm : '일본',
            spcNm : 'HSP10',
            cod : '2014-12-24',
            chargerNm : '아카이시',
            goalPr : '74',
            acmsltPr : '75',
            prRate : '1.0',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3800',
            rdtnRate : '11.7647',
            rdtnHexCd : '#ff0000',
            rdtnUnicode : '&#9650;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '2040',
            acmsltGeneqty : '2311',
            geneqtyRate : '13.2843',
            geneqtyHexCd : '#ff0000',
            geneqtyUnicode : '&#9650;',
            goalSelng : '0.07',
            acmsltSelng : '0.07',
            selngRate : '0',
            selngHexCd : '#ff0000',
            selngUnicode : '&#9650;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AE015', // 여기부터
            spcId : 'ACA006',
            pvNm : 'Kushiro minami',
            rtdCpcty : '1193.4',
            nationNm : '일본',
            spcNm : 'HSP10',
            cod : '2014-12-24',
            chargerNm : '아카이시',
            goalPr : '74',
            acmsltPr : '76',
            prRate : '2.0',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3800',
            rdtnRate : '11.7647',
            rdtnHexCd : '#ff0000',
            rdtnUnicode : '&#9650;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '3003',
            acmsltGeneqty : '3447',
            geneqtyRate : '14.7852',
            geneqtyHexCd : '#ff0000',
            geneqtyUnicode : '&#9650;',
            goalSelng : '0.1',
            acmsltSelng : '0.11',
            selngRate : '10',
            selngHexCd : '#ff0000',
            selngUnicode : '&#9650;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AE011', // 여기부터
            spcId : 'ACA004',
            pvNm : 'Awanishi',
            rtdCpcty : '1990.5',
            nationNm : '일본',
            spcNm : 'HSP8',
            cod : '2013-07-02',
            chargerNm : '아카이시',
            goalPr : '76',
            acmsltPr : '72',
            prRate : '4.0',
            prHexCd : '#1f497d',
            prUnicode : '&#9660;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '5143',
            acmsltGeneqty : '4471',
            geneqtyRate : '13.0663',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.16',
            acmsltSelng : '0.14',
            selngRate : '12.5',
            selngHexCd : '#1f497d',
            selngUnicode : '&#9660;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AE012', // 여기부터
            spcId : 'ACA004',
            pvNm : 'Higashinagamine2',
            nationNm : '일본',
            spcNm : 'HSP8',
            rtdCpcty : '1130.15',
            cod : '2014-03-01',
            chargerNm : '아카이시',
            goalPr : '74',
            acmsltPr : '74',
            prRate : '0',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '2843',
            acmsltGeneqty : '2609',
            geneqtyRate : '8.2307',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.09',
            acmsltSelng : '0.08',
            selngRate : '11.11',
            selngHexCd : '#1f497d',
            selngUnicode : '&#9660;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AI018', // 여기부터
            spcId : 'ACA004',
            pvNm : 'Higashinagamine3',
            nationNm : '일본',
            spcNm : 'HSP8',
            rtdCpcty : '422.24',
            cod : '2016-05-01',
            chargerNm : '아카이시',
            goalPr : '72',
            acmsltPr : '74',
            prRate : '2',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '1034',
            acmsltGeneqty : '975',
            geneqtyRate : '5.706',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.03',
            acmsltSelng : '0.03',
            selngRate : '0',
            selngHexCd : '#ff0000',
            selngUnicode : '&#9650;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            // opSttusCd : '',
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AE013', // 여기부터
            spcId : 'ACA004',
            pvNm : 'Higashinagamine4',
            nationNm : '일본',
            spcNm : 'HSP8',
            rtdCpcty : '1164.8',
            cod : '2016-05-01',
            chargerNm : '아카이시',
            goalPr : '78',
            acmsltPr : '77',
            prRate : '1',
            prHexCd : '#1f497d',
            prUnicode : '&#9660;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '3089',
            acmsltGeneqty : '2798',
            geneqtyRate : '9.4205',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.1',
            acmsltSelng : '0.09',
            selngRate : '0.01',
            selngHexCd : '#1f497d',
            selngUnicode : '&#9660;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AE014', // 여기부터
            spcId : 'ACA005',
            pvNm : 'Nishinagamine',
            nationNm : '일본',
            spcNm : 'HSP9',
            rtdCpcty : '2098.14',
            cod : '2016-03-02',
            chargerNm : '아카이시',
            goalPr : '73',
            acmsltPr : '77',
            prRate : '4',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '5208',
            acmsltGeneqty : '5041',
            geneqtyRate : '3.2066',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.17',
            acmsltSelng : '0.16',
            selngRate : '5.8823',
            selngHexCd : '#1f497d',
            selngUnicode : '&#9660;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AI021', // 여기부터
            spcId : 'ACA002',
            pvNm : 'Hokota',
            nationNm : '일본',
            spcNm : 'HSP5',
            rtdCpcty : '805.6',
            cod : '2016-01-01',
            chargerNm : '아카이시',
            goalPr : '72',
            acmsltPr : '74',
            prRate : '2',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '1972',
            acmsltGeneqty : '1860',
            geneqtyRate : '5.6795',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '0.06',
            acmsltSelng : '0.06',
            selngRate : '0',
            selngHexCd : '#ff0000',
            selngUnicode : '&#9650;',
        }, {
            isDemo : true,
            opSttus : opSttus,
            opSttusIconCd : 'icon_green02',
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            serviceSttus : 'SS04',
            geneqtyUnitNm : 'kWh',
            crncyUnitNm : '¥',
            pvId : 'AA001', // 여기부터
            spcId : 'ACA001',
            pvNm : 'Kithuki',
            nationNm : '일본',
            spcNm : 'HSPK',
            rtdCpcty : '24472',
            cod : '2015-01-05',
            chargerNm : '아카이시',
            goalPr : '75',
            acmsltPr : '76',
            prRate : '1',
            prHexCd : '#ff0000',
            prUnicode : '&#9650;',
            goalAvaty : '99.0000',
            acmsltAvaty : '100.0000',
            avatyRate : '1.0',
            avatyHexCd : '#ff0000',
            avatyUnicode : '&#9650;',
            goalRdtn : '3400',
            acmsltRdtn : '3120',
            rdtnRate : '8.2353',
            rdtnHexCd : '#1f497d',
            rdtnUnicode : '&#9660;',
            rdtnUnitNm : 'Wh/㎡',
            goalGeneqty : '62404',
            acmsltGeneqty : '5828',
            geneqtyRate : '7.0124',
            geneqtyHexCd : '#1f497d',
            geneqtyUnicode : '&#9660;',
            goalSelng : '2',
            acmsltSelng : '1.86',
            selngRate : '0.93',
            selngHexCd : '#ff0000',
            selngUnicode : '&#9650;',
        } ];

        newArray.push.apply ( newArray, demoData );
    } else
    {
        newArray.push.apply ( newArray, insightArray );
    }

    return newArray;
}

// 각 발전소별 목표 대비 실적(Insight Dashboard) 데이터 구성
function insightList ()
{
    var deferred = $.Deferred ();
    insightDashboard.loadFlag.insight = false;
    // ajax로 데이터 가져오기
    var insightArray = null;

    $.ajax ( {
        url : contextPath + '/hom/dashboard/insight/selectInsightList.ajax',
        type : 'POST',
        dataType : 'json',
        async : false,
        data : {
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            nationCd : insightDashboard.sel.nation,
            spcId : insightDashboard.sel.spc,
            serviceSttus : insightDashboard.sel.status
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                insightArray = getDemoData ( json.data );

                if ( insightArray.length > 0 )
                {

                    if ( insightArray[0].rdtnUnitNm === "" )
                    {
                        insightDashboard.unit.rdtnUniNm = homConstants.unitSsrs;
                    } else
                    {
                        insightDashboard.unit.rdtnUniNm = insightArray[0].rdtnUnitNm;
                    }

                    changeRdtnUnit ();

                    var geneqtyUnitHtml = null

                    if ( insightArray[0].geneqtyUnitNm === null )
                    {
                        geneqtyUnitHtml = '(' + homConstants.unitGeneqty + ')';

                    } else
                    {
                        geneqtyUnitHtml = '(' + insightArray[0].geneqtyUnitNm + ')';
                    }

                    $ ( '#geneqtyUnitNM' ).html ( geneqtyUnitHtml );

                    if ( insightDashboard.tpl.insightList !== null )
                    {
                        var nationCount = 0;
                        var spcCount = 0;
                        for ( var i = 0, length = insightArray.length; i < length; i++ )
                        {
                            if ( insightArray[i].nationNm == insightArray[0].nationNm )
                            {
                                nationCount++;
                            }
                            if ( insightArray[i].spcNm == insightArray[0].spcNm )
                            {
                                spcCount++;
                            }
                        }

                        var template = _.template ( insightDashboard.tpl.insightList );
                        var html = template ( {
                            homUtil : homUtil,
                            contextPath : contextPath,
                            insightArray : insightArray,
                            nationNm : insightArray[0].nationNm,
                            spcNm : insightArray[0].spcNm
                        } );
                        $ ( '#insightList tbody' ).html ( html );
                        customizeScroll ();

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
                } else
                {
                    if ( insightDashboard.tpl.dashboardNoData !== null )
                    {
                        insightDashboard.unit.rdtnUniNm = homConstants.unitSsrs;
                        changeRdtnUnit ();

                        var geneqtyUnitHtml = '(' + homConstants.unitGeneqty + ')';

                        $ ( '#geneqtyUnitNM' ).html ( geneqtyUnitHtml );

                        var template = _.template ( insightDashboard.tpl.dashboardNoData );
                        var html = template ( {
                            message : i18nMessage.msg_sentenceGridNoData
                        } );
                        $ ( '#insightList tbody' ).html ( html );
                        $ ( ".gq_nodata" ).show ();

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
            
            setAlarmStatus();
            setCommStatus();
            
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

    // mergeCell ();
    insightDashboard.loadFlag.insight = true;
    return deferred.promise ();
}

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );
    $btnExcel.on ( 'click', function ()
    {
        // var $searchKey = $ ( '#searchKey' );
        // var $searchValue = $ ( '#searchValue' );
        //
        var params = {
            acmsltCycleCd : insightDashboard.acmsltCycleCd.acmsltCycleCd,
            nationCd : insightDashboard.sel.nation,
            spcId : insightDashboard.sel.spc,
            serviceSttus : insightDashboard.sel.status
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );
        return false;
    } );
}

// insight option 변경시 새로운 Interval 세팅
function changeOption ()
{
    var originFlag = true;
    var $searchOptionInput = $ ( '#search_option input' );
    var $selSpc = $ ( '#selSpc' );
    var $selStatus = $ ( '#selStatus' );

    // SPC 변경 시 새로운 Interval 생성
    $selSpc.on ( 'change', function ()
    {
        if ( insightDashboard.loadFlag.insight )
        {
            var clearInsightPromise = clearInsightList ();

            clearInsightPromise.done ( function ()
            {
                // 현재 선택된 SPC 확인
                insightDashboard.sel.spc = $selSpc.val ();

                // 선택된 값으로 insightList ajax 데이터 가져오기;
                initInsight ();

            } );
        } else if ( !insightDashboard.loadFlag.insight )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertLoadPageNoChange,
                checkText : i18nMessage.msg_ok,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );

    // 서비스 상태 변경 시 새로운 Interval 생성
    $selStatus.on ( 'change', function ()
    {
        if ( insightDashboard.loadFlag.insight )
        {
            var clearInsightPromise = clearInsightList ();

            clearInsightPromise.done ( function ()
            {
                // 현재 선택된 SPC 확인
                insightDashboard.sel.status = $selStatus.val ();

                // 선택된 값으로 insightList ajax 데이터 가져오기;
                initInsight ();

            } );
        } else if ( !insightDashboard.loadFlag.insight )
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
        if ( insightDashboard.loadFlag.insight )
        {
            var clearInsightPromise = clearInsightList ();

            clearInsightPromise.done ( function ()
            {
                // 현재 선택된 RADIO 값 확인
                insightDashboard.acmsltCycleCd.acmsltCycleCd = $ ( '#search_option input[name="period"]:checked' )
                        .val ();

                // 선택된 RADIO 값으로 insightList ajax 데이터 가져오기;
                initInsight ();

            } );
        } else if ( !insightDashboard.loadFlag.insight )
        {
            if ( originFlag )
            {
                originFlag = false;

                var option = _.find ( $searchOptionInput, function ( option )
                {
                    return $ ( option ).attr ( 'id' ) === insightDashboard.acmsltCycleCd.acmsltCycleCd;
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

function clearInsightList ()
{
    var deferred = $.Deferred ();

    // 기존에 선택된 RADIO 버튼의 Interval 이벤트 CLEAR하기
    clearInterval ( insightDashboard.interval.insightInterval );

    deferred.resolve ();
    return deferred.promise ();
}

// 셀 병합
function mergeCell ()
{
    $ ( ".tdCountry" ).each ( function ()
    {
        var rows = $ ( ".tdCountry:contains('" + $ ( this ).text () + "')" );

        if ( rows.length > 1 )
        {
            rows.eq ( 0 ).attr ( "rowspan", rows.length );
            rows.not ( ":eq(0)" ).remove ();
        }
    } );

    $ ( ".tdSpc" ).each ( function ()
    {

        var rows = $ ( ".tdSpc:contains('" + $ ( this ).text () + "')" );
        if ( rows.length > 1 )
        {
            rows.eq ( 0 ).attr ( "rowspan", rows.length );
            rows.not ( ":eq(0)" ).remove ();
        }
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
                // console.log ( $.magnificPopup.instance.st.el );
                // console.log ( $.magnificPopup.instance.st.el.closest ( 'tr' ).find ( '.pvName' ).text () );
                setChargerPopUp ( $.magnificPopup.instance.st.el.closest ( 'tr' ).find ( '.pvName' ).text () );
            }
        }
    } );
}

// 일사량 단위 변경
function changeRdtnUnit ()
{
    // 전일,금일 일 경우
    if ( insightDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct02
            || insightDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct03 )
    {
        $ ( '#rdtnUnitNM' ).html ( '(' + insightDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixD + ')' );

    }
    // 전년,금년 일 경우
    else if ( insightDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct01
            || insightDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct05 )
    {
        $ ( '#rdtnUnitNM' ).html ( '(' + insightDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixY + ')' );
    }
    // 금월 일 경우
    else if ( insightDashboard.acmsltCycleCd.acmsltCycleCd === homConstants.acmsltCycleColct04 )
    {
        $ ( '#rdtnUnitNM' ).html ( '(' + insightDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixM + ')' );
    }
    // cod 일 경우
    else
    {
        $ ( '#rdtnUnitNM' ).html ( '(' + insightDashboard.unit.rdtnUniNm + '/' + homConstants.unitSuffixCod + ')' );
    }

}

//알람상태 : 서버에 있는 알람상태 가져오는 부분이 시간이 많이 걸려서 화면로딩 후 ajax로 발전소별로 상태정보를 가져 옴. 
function setAlarmStatus ()
{
    //webapp/template/dashboard/insightList.html 에 있는   아래 속성이 있는 i tag list를 가져 온 후 상태정보 업데이트.
    //<i class="" alarm_status pv_id="{{=insight.pvId}}"></i>
    var $alarm_status_list = $ ( '*[alarm_status]' );
    
    $.each ( $alarm_status_list, function ( index, item )
    {
        getAlarmStatus($(this).attr('pv_id'), $(this));    
    } );
    
}


function getAlarmStatus (pvId, $iTag)
{
    
    $.ajax ( {
        url : contextPath + '/hom/dashboard/insight/getAlarmStatus.ajax',
        type : 'POST',
        data : {
            pvId : pvId,
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmLevel = json.data;
                
                if(alarmLevel === 'ALVL01') {
                    $iTag.attr('class','icon_green02');
                } else if(alarmLevel === 'ALVL02') {
                    $iTag.attr('class','icon_yellow02');   
                } else if(alarmLevel === 'ALVL03') {
                    $iTag.attr('class','icon_red02');
                } else if(alarmLevel === 'ALVL04') {
                    $iTag.attr('class','icon_gray02'); 
                } else  {
                    $iTag.attr('class','icon_green02'); 
                }

            } else if ( json.status === staticVariable.jsonStatusError )
            {
                //loop 를 돌면서 tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않음.
//                $iTag.attr('class','icon_green02');

            }
        },
        error : function ( xhr, textStatus, error )
        {
            //loop 를 돌면서 tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않음.
//            $iTag.attr('class','icon_green02');
        }
    } );
    
}

//통신상태 : 서버에 있는 상태정보 가져오는 부분이 시간이 많이 걸려서 화면로딩 후 ajax로 발전소별로 상태정보를 가져 옴. 
function setCommStatus ()
{
    //webapp/template/dashboard/insightList.html 에 있는   아래 속성이 있는 i tag list를 가져 온 후 상태정보 업데이트.
    //<i class="" comm_status pv_id="{{=insight.pvId}}"></i>
    var $comm_status_list = $ ( '*[comm_status]' );
    
    $.each ( $comm_status_list, function ( index, item )
    {
        getCommStatus($(this).attr('pv_id'), $(this));    
    } );
    
}


function getCommStatus (pvId, $iTag)
{
    
    $.ajax ( {
        url : contextPath + '/hom/dashboard/insight/getCommStatus.ajax',
        type : 'POST',
        data : {
            pvId : pvId,
        },
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var alarmLevel = json.data;
                
                if(alarmLevel === '-1' || alarmLevel === '1') {
                    $iTag.attr('class','icon_red02');
                } else if(alarmLevel === 'icon_red02') {
                    $iTag.attr('class','icon_green02');   
                } else {
                    $iTag.attr('class','icon_green02');
                }
            } else if ( json.status === staticVariable.jsonStatusError )
            {
                //loop 를 돌면서 tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않음.
//                $iTag.attr('class','icon_green02');

            }
        },
        error : function ( xhr, textStatus, error )
        {
            //loop 를 돌면서 tag 단위로 처리되므로 에러 발생할 경우 에러 메시지를 화면에 alert 처리하지 않음.
//            $iTag.attr('class','icon_green02');
        }
    } );
    
}



$ ( function ()
{
    insightDashboard = {
        interval : {
            TIME : (1000 * 4 * 60) + 5000,
            insightInterval : null
        },
        tpl : {
            insightList : getTemplate ( templates.insightList ),
            dashboardNoData : getTemplate ( templates.dashboardNoData )
        },
        acmsltCycleCd : {
            acmsltCycleCd : $ ( '#search_option input[name="period"]:checked' ).val ()
        },
        loadFlag : {
            insight : true
        },
        unit : {
            rdtnUniNm : null
        },
        sel : {
            nation : $ ( '#selNation' ).val (),
            spc : $ ( '#selSpc' ).val (),
            status : $ ( '#selStatus' ).val ()
        }
    };

    customizeForm ();
    // customizeScroll ();
    getNationSpcInfo ();
    initInsight ();
    changeOption ();
    clickBtnExcel ();

} );
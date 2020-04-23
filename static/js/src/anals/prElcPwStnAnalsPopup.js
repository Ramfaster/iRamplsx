/**
 * 발전량 그리드 전체 목록 조회
 */
// jqgird customize
function jqGridBasicPop ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtId = $ ( '#eqmtId' ).val ();
    var isEqmtGrp = $ ( '#isEqmtGrp' ).val ();
    var goalFromStdrYM = $ ( '#hidFromStdrYM' ).val ();
    var goalToStdrYM = $ ( '#hidToStdrYM' ).val ();
    var beforeYearFromDate = $ ( '#hidBeforeYearFromDate' ).val ();
    var beforeYearToDate = $ ( '#hidBeforeYearToDate' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    var tpl = getTemplate ( templates.noData );

    // jqgrid
    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/analysis/energy/selectEnergyGridList.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 630,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    // fromStdrYM : fromStdrYM,
                    // toStdrYM : toStdrYM,
                    eqmtId : eqmtId,
                    isEqmtGrp : isEqmtGrp,
                    goalFromStdrYM : goalFromStdrYM,
                    goalToStdrYM : goalToStdrYM,
                    beforeYearFromDate : beforeYearFromDate,
                    beforeYearToDate : beforeYearToDate,
                    unit : unit
                },
                sortname : 'stdrDate',
                sortorder : 'asc',
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                colNames : [ i18nMessage.msg_date, i18nMessage.msg_goal, i18nMessage.msg_beforeYear,
                        i18nMessage.msg_expected, i18nMessage.msg_acmslt, i18nMessage.msg_goal,
                        i18nMessage.msg_beforeYear, i18nMessage.msg_expected, "energyUnitNm" ],
                colModel : [
                        {
                            name : 'stdrDate',
                            align : 'center',
                            width : '140'
                        },
                        {
                            name : 'goalEnergy',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }

                        },
                        {
                            name : 'beforeYearEnergy',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'expectedEnergy',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'acmsltEnergy',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'goalGap',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                        staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'beforeYearGap',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                        staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'expectedGap',
                            align : 'right',
                            width : '150',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                        staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'energyUnitNm',
                            align : 'center',
                            width : '150',
                            hidden : true
                        } ],
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
                    }

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                            + i18nMessage.msg_count;
                    $ ( "#totalRowCount" ).text ( resultText );

                    var $gridList = $ ( '#gridListPop' );
                    var ids = $gridList.jqGrid ( "getDataIDs" );
                    var cl = ids[0];
                    var rowData = $gridList.getRowData ( cl );

                    // console.log ( rowData );

                    var energyUnitNm = rowData.energyUnitNm;

                    if ( typeof energyUnitNm === 'undefined' )
                    {
                        energyUnitNm = "kWh";
                    }

                    // 발전량
                    $ ( '#gridListPop_stdrDate' ).next ( 'th' ).html (
                            i18nMessage.msg_energy + '(' + energyUnitNm + ')' );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }
}
// jqgrid end

function getFormattedCellValue ( cellValue )
{
    var prefix = '';
    if ( cellValue > 0 )
    {
        prefix = '(<i class="icon_up"></i>)';
    } else if ( cellValue < 0 )
    {
        prefix = '(<i class="icon_down"></i>)';
    } else
    {
        prefix = '(<i>-</i>)';
    }
    return prefix + homUtil.mathAbsFloorComma ( cellValue, staticVariable.decimalPoint );
}

// jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    var groupHeaderName = 'User';
    $ ( "#gridListPop" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'goalEnergy',
            numberOfColumns : 4,
            titleText : i18nMessage.msg_energy + '(kWh)'
        }, {
            startColumnName : 'goalGap',
            numberOfColumns : 3,
            titleText : 'GAP(%)'
        } ]
    } );
}

// jqgird customize
function customizeJqgridPop ()
{
    // jqgrid
    jqGridBasicPop ();
    addGroupHeader ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * 설비 그룹 별 발전량 jqGrid 초기화
 */
function jqGridBasicAtPop ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtId = $ ( '#jbList' ).val ();
    var eqmtGrpCd = $ ( '#eqmtId' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    // console.log ( "popup eqmtGrpCd " + eqmtGrpCd );

    var tpl = getTemplate ( templates.noData );

    var url = "";
    if ( eqmtGrpCd === "STR" )
    {
        url = contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAtStr.ajax';
    } else
    {
        eqmtId = eqmtGrpCd;
        url = contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAt.ajax';
    }

    $ ( '#gridListPop' )
            .jqGrid (
                    {
                        url : url,
                        mtype : 'POST',
                        datatype : 'json',
                        height : 650,
                        autowidth : true,
                        shrinkToFit : false,
                        postData : {
                            dateType : dateType,
                            fromDate : fromDate,
                            toDate : toDate,
                            isEqmtGrp : eqmtGrpCd,
                            jbEqmtId : eqmtId,
                            unit : unit
                        },
                        rowNum : staticVariable.gridRow30,
                        sortname : "No",
                        sortorder : "asc",
                        multiselect : false,
                        multiboxonly : false,
                        page : 1,
                        scroll : true,
                        viewrecords : true,
                        emptyrecords : i18nMessage.msg_sentenceGridNoData,
                        colNames : [ i18nMessage.msg_date, i18nMessage.msg_division, i18nMessage.msg_sum,
                                i18nMessage.msg_acmslt, i18nMessage.msg_ratio + i18nMessage.msg_unitPercent,
                                "energyUnitNm" ],
                        colModel : [ {
                            name : 'stdrDate',
                            index : '',
                            align : 'center',
                            width : '80'
                        }, {
                            name : 'eqmtNm',
                            index : '',
                            align : 'left',
                            width : '80'
                        }, {
                            name : 'energySum',
                            index : '',
                            align : 'right',
                            width : '80',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'acmsltEnergy',
                            index : '',
                            align : 'right',
                            width : '80',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'energyRatio',
                            index : '',
                            align : 'right',
                            width : '65',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'energyUnitNm',
                            index : '',
                            align : 'center',
                            width : '65',
                            hidden : true
                        } ],
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
                            }

                            // 조회결과 타이틀
                            var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                                    + data.records + i18nMessage.msg_count;
                            $ ( "#totalRowCount" ).text ( resultText );

                            var $gridList = $ ( '#gridListPop' );
                            var ids = $gridList.jqGrid ( "getDataIDs" );
                            var cl = ids[0];
                            var rowData = $gridList.getRowData ( cl );

                            console.log ( rowData );

                            var energyUnitNm = rowData.energyUnitNm;
                            if ( typeof energyUnitNm === 'undefined' )
                            {
                                energyUnitNm = "kWh";
                            }

                            // 발전량
                            $ ( '#gridListPop_eqmtNm' ).next ( 'th' ).html (
                                    i18nMessage.msg_energy + '(' + energyUnitNm + ')' );
                        },
                        gridComplete : function ()
                        {
                            console.log ( ">>>>> gridComplete " );

                            $ ( this ).rowspan ( 0, 0 );
                            $ ( this ).rowspan ( 2, 2 );
                        }
                    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }
}

/**
 * 스트링 별 발전량 그리드 헤더 병합
 */
function addGroupHeaderAt ()
{
    var groupHeaderName = 'User';
    $ ( "#gridListPop" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'energySum',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(kWh)'
        } ]
    } );
}

// jqgird customize
function customizeJqgridAtPop ()
{
    // jqgrid
    jqGridBasicAtPop ();
    addGroupHeaderAt ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

/**
 * 설비 순위 별 발전량 통계 그리드 초기화
 */
function jqGridBasicAtEqmtRankingPop ()
{
    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();
    var eqmtId = $ ( '#jbList' ).val ();
    var eqmtGrpCd = $ ( '#eqmtId' ).val ();
    var unit = $ ( '#hidUnit' ).val ();

    var tpl = getTemplate ( templates.noData );

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/analysis/energy/selectEnergyStatsGridListAtRanking.ajax',
                mtype : 'POST',
                datatype : 'json',
                height : 650,
                autowidth : true,
                shrinkToFit : false,
                postData : {
                    dateType : dateType,
                    fromDate : fromDate,
                    toDate : toDate,
                    eqmtId : eqmtGrpCd,
                    unit : unit
                },
                rowNum : staticVariable.gridRow30,
                sortname : "eqmtRanking",
                sortorder : "asc",
                multiselect : false,
                multiboxonly : false,
                page : 1,
                scroll : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                colNames : [ i18nMessage.msg_rank, i18nMessage.msg_division, i18nMessage.msg_facilityCapacity,
                        i18nMessage.msg_facilityCapacity + " " + i18nMessage.msg_ratio + i18nMessage.msg_unitPercent,
                        i18nMessage.msg_energy,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_ratio + i18nMessage.msg_unitPercent,
                        i18nMessage.msg_energy + " " + i18nMessage.msg_contrast + i18nMessage.msg_unitPercent,
                        "energyUnitNm" ],
                colModel : [
                        {
                            name : 'eqmtRanking',
                            index : '',
                            align : 'center',
                            width : '65'
                        },
                        {
                            name : 'eqmtNm',
                            index : '',
                            align : 'left',
                            width : '198'
                        },
                        {
                            name : 'eqmtCpcty',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'cpctyRatio',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'acmsltEnergy',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'energyRatio',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return numberFloorComma ( cellvalue, staticVariable.decimalPoint );
                            }
                        },
                        {
                            name : 'energyDiff',
                            index : '',
                            align : 'right',
                            width : '198',
                            formatter : function ( cellvalue, options, rowObject )
                            {
                                return jqgridNumberAbsGapFormatter ( cellvalue, options, rowObject,
                                        staticVariable.decimalPoint );
                            }
                        }, {
                            name : 'energyUnitNm',
                            index : '',
                            align : 'center',
                            width : '198',
                            hidden : true
                        } ],
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
                    }

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " " + data.records
                            + i18nMessage.msg_count;
                    $ ( "#totalRowCount" ).text ( resultText );

                    var $gridList = $ ( '#gridListPop' );
                    var ids = $gridList.jqGrid ( "getDataIDs" );
                    var cl = ids[0];
                    var rowData = $gridList.getRowData ( cl );

                    console.log ( rowData );

                    // 헤더 명 변경
                    $gridList.jqGrid ( 'setLabel', "acmsltEnergy", i18nMessage.msg_energy + '(' + rowData.energyUnitNm
                            + ')' );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }
}

// jqgird customize
function customizeJqgridAtEqmtRankingPop ()
{
    // jqgrid
    jqGridBasicAtEqmtRankingPop ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function gridFormatter ( cellValue, options, rowObject )
{
    return homUtil.mathFloorComma ( cellValue, staticVariable.decimalPoint );
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$ ( function ()
{
    var popType = $ ( '#popType' ).val ();
    var isEqmtRanking = $ ( '#isEqmtRanking' ).val ();

    console.log ( "pop popType " + popType );
    console.log ( "pop isEqmtRanking " + isEqmtRanking );

    if ( popType !== "period" )
    {
        // 설비 별 순위 조회 체크 시
        if ( isEqmtRanking === "Y" )
        {
            customizeJqgridAtEqmtRankingPop ();
        } else
        {
            console.log ( "customizeJqgridAt begin" );

            customizeJqgridAtPop ();
        }
    } else
    {
        customizeJqgridPop ();
    }
} );
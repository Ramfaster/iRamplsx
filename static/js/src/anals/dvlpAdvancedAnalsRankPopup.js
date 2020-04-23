// jqgrid start
// 헤더 병합
function addGroupHeaderRankPopup ()
{
    var groupHeaderName = 'User';
    $ ( "#gridListPop" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'sumEnergy',
            numberOfColumns : 3,
            titleText : i18nMessage.msg_energy + '(kWh)'
        } ]
    } );
}

function jqGridBasicRankPopup ()
{
    var tpl = getTemplate ( templates.noData );

    var dateType = $ ( '#dateType' ).val ();
    var fromDate = $ ( '#hidFromDate' ).val ();
    var toDate = $ ( '#hidToDate' ).val ();

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/advancedanalysis/energy/selectIvtRankEnergyGridList.ajax',
                mtype : 'POST',
                postData : {
                    dateType : serarhDateType,
                    fromDate : searchFromDate,
                    toDate : searchToDate,
                    unit : valueUnit
                },
                datatype : 'json',
                loadonce : false,
                height : 650,
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

                    // 조회결과 타이틀
                    var resultText = i18nMessage.msg_retrieve + " " + i18nMessage.msg_result + " "
                            + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;

                    $ ( "#totalRowCount" ).text ( resultText );

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

        $ ( '#gridListPop' ).parent ().append ( html );
    }
}

// jqgird customize
function customizeJqgridPopup ()
{
    // jqgrid
    jqGridBasicRankPopup ();
    addGroupHeaderRankPopup ();

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

$ ( function ()
{
    customizeJqgridPopup ();
} );
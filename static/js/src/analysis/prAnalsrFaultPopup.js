// 기간 내 설비별 성능비 rank
function customizeFaultJqGridPopup ()
{
    var noDataId = 'popup_equip_fault_jqgrid_nodata';

    popupFaultJqGridBasic ( noDataId );
    var $popupGridList = $ ( '#popup_grid_list' );
    if ( prAnalsr.templates.noData !== null )
    {
        var template = _.template ( prAnalsr.templates.noData );
        var html = template ( {
            id : noDataId,
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $popupGridList.parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function popupFaultJqGridBasic ( noDataId )
{
    var $popupGridList = $ ( '#popup_grid_list' );
    $popupGridList.jqGrid ( {
        url : contextPath + '/hom/analysis/pr/faultList.ajax',
        mtype : 'POST',
        datatype : 'json',
        postData : {
            dateType : $ ( '#dateType' ).val (),
            fromDate : $ ( '#fromDate' ).val (),
            toDate : $ ( '#toDate' ).val ()
        },
        height : 592,
        autowidth : true,
        shrinkToFit : false,
        colNames : [ "발생 일시", "해제 일시", "종료 일시", "고장 내용" ],
        colModel : [ {
            name : 'occrrncDt',
            align : 'center',
            width : '205'
        }, {
            name : 'releaseDt',
            align : 'center',
            width : '205'
        }, {
            name : 'trmnatDt',
            align : 'center',
            width : '205'
        }, {
            name : 'defectConts',
            align : 'left',
            width : '605'
        } ],
        sortname : 'occrrncDt',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        multiselect : false,
        multiboxonly : false,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gqNodata = $ ( '#' + noDataId );

            // 조회결과
            var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                    + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
            $ ( '#popup_count' ).text ( resultText );

            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );
            }
        }
    } );
}

$ ( function ()
{
    customizeFaultJqGridPopup ();
} );
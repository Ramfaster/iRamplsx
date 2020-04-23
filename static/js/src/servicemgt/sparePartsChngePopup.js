var sparePartsMgt = null;

function popupCustomizeForm ()
{
    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select05',
        focusClass : 'custom-form-focused05',
        disableClass : 'custom-form-disabled05'
    } );
}

function popupCustomizeScroll ()
{
    // custom scroll
    $ ( '.popup_tbl_box_add' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

function popupJqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );
    var colNames = null;
    var colModel = null;
    var noDataId = 'spare_jqgrid_nodata';

    colNames = [ "", "관리번호", "발전소 아이디", "예비품 분류 코드", "예비품 항목", "예비품 항목 코드", i18nMessage.msg_preparprdItemCd,
            i18nMessage.msg_manufacturer, i18nMessage.msg_standard, i18nMessage.msg_serialNum,
            i18nMessage.msg_useAvailability, i18nMessage.msg_stockedDate, i18nMessage.msg_usgDate ];
    colModel = [ {
        name : 'sel',
        align : 'center',
        width : '40',
        formatter : function ( cellValue, option )
        {
            return '<input type="radio" name="radio_' + option.gid + '"  />';
        }
    }, {
        name : 'mgtSeq',
        align : 'center',
        hidden : true
    }, {
        name : 'pvId',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdClCd',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdClCdNm',
        align : 'center',
        hidden : true
    }, {
        name : 'preparprdItemCd',
        align : 'left',
        hidden : true
    }, {
        name : 'preparprdItemCdNm',
        width : 171,
        align : 'center'
    }, {
        name : 'corprNm',
        width : 171,
        align : 'left'
    }, {
        name : 'modlNm',
        width : 171,
        align : 'left'
    }, {
        name : 'sn',
        width : 171,
        align : 'left'
    }, {
        name : 'usgAt',
        width : 170,
        align : 'center'
    }, {
        name : 'purchsDt',
        width : 170,
        align : 'center'
    }, {
        name : 'usgDt',
        width : 170,
        align : 'center'
    } ];

    $ ( '#gridList2' ).jqGrid ( {
        url : contextPath + '/hom/servicemgt/spare/selectSparePartsGridList.ajax',
        mtype : 'POST',
        datatype : 'json',
        height : 448,
        autowidth : true,
        async : false,
        shrinkToFit : false,
        datatype : 'json',
        postData : {
            pvId : paramPvId,
            preparprdClCd : paramPreparprdClCd === '' ? 'all' : paramPreparprdClCd,
            preparprdItemCd : paramPreparprdItemCd === '' ? 'all' : paramPreparprdItemCd,
            corprId : sparePartsMgt.corprId,
            modlId : sparePartsMgt.modlId
        },
        colNames : colNames,
        colModel : colModel,
        sortname : 'preparprdClCd',
        sortorder : 'asc',
        rownumbers : true,
        rowwidth : 25,
        page : 1,
        rowNum : staticVariable.gridRow30,
        scroll : true,
        viewrecords : true,
        emptyrecords : i18nMessage.msg_sentenceGridNoData,
        loadComplete : function ( data )
        {
            var $gridList = $ ( '#gridList2' );
            var $gqNodata = $ ( '#' + noDataId );
            if ( data.records === 0 )
            {
                $gqNodata.show ();
            } else
            {
                $gqNodata.hide ();

                $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                var ids = $gridList.jqGrid ( 'getDataIDs' );
                for ( var i = 0, length = ids.length; i < length; i++ )
                {
                    var id = ids[i];
                    var rowData = $gridList.getRowData ( id );

                    // 사용 여부(사용/입고) alias
                    if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                    {
                        rowData.usgAt = i18nMessage.msg_use;
                    } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                    {
                        rowData.usgAt = i18nMessage.msg_stocked;
                    }

                    $gridList.jqGrid ( 'setRowData', id, rowData );

                }

            }
            $gridList.jqGrid ( 'hideCol', [ 'rn' ] );

        },
        onSelectRow : function ( rowId, status )
        {
            // var $gridList = $ ( '#gridList2' );
            // var rowData = $gridList.getRowData ( rowId );

            // location.href = contextPath + '/hom/servicemgt/spare/sparePartsView.do?pvId=' + rowData.pvId
            // + '&preparprdClCd=' + rowData.preparprdClCd + '&preparprdItemCd=' + rowData.preparprdItemCd
            // + '&mgtSeq=' + rowData.mgtSeq;
        }

    } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData,
            id : noDataId
        } );

        $ ( '#gridList2' ).parent ().append ( html );
    }

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();

}

// jqgrid end

function popupBtnClick ()
{
    var $btnRegister = $ ( '#btnRegister' );
    var $gridList = $ ( '#gridList2' );

    $btnRegister.on ( 'click', function ()
    {
        var $selRadio = $ ( 'input[name=radio_' + $gridList[0].id + ']:checked' ), $tr;

        if ( $selRadio.length > 0 )
        {
            $tr = $selRadio.closest ( 'tr' );
            if ( $tr.length > 0 )
            {
                var mgtSeq = $gridList.getCell ( $tr.attr ( 'id' ), "mgtSeq" );
                var usgAt = $gridList.getCell ( $tr.attr ( 'id' ), "usgAt" );

                if ( usgAt === i18nMessage.msg_use )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_alertAlreayRegisterEqmt,
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    return false;
                } else
                {
                    var params = {
                        preparprdClCd : paramPreparprdClCd,
                        preparprdItemCd : paramPreparprdItemCd,
                        eqmtId : paramEqmtId,
                        mgtSeq : mgtSeq,
                        adiEqmtId : paramAdiEqmtId,
                        mdlEqmtId : paramMdlEqmtId
                    };

                    location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

                    return false;
                }
            }
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertSelectChangeEqmt,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
            return false;
        }
    } );
}

// 예비품 항목 정보 jqgrid reload
function popupSearchJqgrid ()
{
    var $gridList = $ ( '#gridList2' );
    var $btn_search = $ ( '#btn_search' );

    $btn_search.on ( 'click', function ()
    {
        sparePartsMgt.modlId = $ ( '#sel_eqmtModlCd' ).val ();
        sparePartsMgt.corprId = $ ( '#sel_corprId' ).val ();

        popupReloadJqgrid ();
    } );

}

// 예비품 관리 대장 jqgrid reload
function popupReloadJqgrid ()
{
    var $gridList = $ ( '#gridList2' );

    $gridList.setGridParam ( {
        postData : {
            pvId : paramPvId,
            preparprdClCd : paramPreparprdClCd,
            preparprdItemCd : paramPreparprdItemCd,
            modlId : sparePartsMgt.modlId,
            corprId : sparePartsMgt.corprId
        }
    } ).trigger ( 'reloadGrid' );
}

$ ( function ()
{
    sparePartsMgt = {
        modlId : '',
        corprId : ''
    }

    popupCustomizeForm ();
    popupCustomizeScroll ();
    popupJqGridBasic ();
    popupBtnClick ();
    popupSearchJqgrid ();
} );
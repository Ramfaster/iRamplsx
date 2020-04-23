// jqgrid start

function setColModel ()
{
    var colModel = [ {
        name : 'tagEngNm',
        index : '',
        align : 'center',
        width : '160'
    }, {
        name : 'tagId',
        index : '',
        align : 'center',
        width : '240'
    }, {
        name : 'eqmtNm',
        index : '',
        align : 'center',
        width : '110'
    }, {
        name : 'paramtrType',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'paramtrNm',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'cndfrmlaTyNm',
        index : '',
        align : 'center',
        width : '120'
    }, {
        name : 'reflctBeginDt',
        index : '',
        align : 'center',
        width : '160'
    }, {
        name : 'reflctTrmnatDt',
        index : '',
        align : 'center',
        width : '160'
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'tagKorNm',
            index : '',
            align : 'center',
            width : '160'
        }, {
            name : 'tagId',
            index : '',
            align : 'center',
            width : '240'
        }, {
            name : 'eqmtNm',
            index : '',
            align : 'center',
            width : '110'
        }, {
            name : 'paramtrType',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'paramtrNm',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'cndfrmlaTyNm',
            index : '',
            align : 'center',
            width : '120'
        }, {
            name : 'reflctBeginDt',
            index : '',
            align : 'center',
            width : '160'
        }, {
            name : 'reflctTrmnatDt',
            index : '',
            align : 'center',
            width : '160'
        } ];
    }

    return colModel;
}

// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();

    var sortname = 'tagEngNm';
    if ( lang == locale.korea || lang == locale.korean )
    {
        sortname = 'tagKorNm';
    }

    $ ( '#gridListPop' ).jqGrid (
            {
                url : contextPath + '/hom/sysmgt/systag/sysTagReflctList.ajax',
                mtype : 'POST',
                datatype : 'json',
                postData : {
                    tagId : tagId
                },
                height : 592,
                autowidth : true,
                shrinkToFit : false,
                colNames : [ i18nMessage.msg_systemTagName, i18nMessage.msg_systemTagId, i18nMessage.msg_eqmtName,
                        i18nMessage.msg_parameterType, i18nMessage.msg_parameterName, i18nMessage.msg_cndfrm,
                        i18nMessage.msg_reflectionBeginDate, i18nMessage.msg_reflectionTerminateDate ],
                colModel : colModel,
                sortname : sortname,
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true,
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow30,
                scroll : true,
                viewrecords : true,
                emptyrecords : i18nMessage.msg_sentenceGridNoData,
                loadComplete : function ( data )
                {
                    var $gridList = $ ( '#gridListPop' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    if ( data.records === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();
                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            // checkbox 처리
                            $checkboxs.eq ( i ).attr ( {
                                'name' : 'reflctBeginDt',
                                'value' : rowData.reflctBeginDt,
                                'data-tag-id' : rowData.tagId
                            } ).addClass ( 'reflctBeginDt' );
                        }
                    }

                    if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                    {
                        enableJqgridCheckbox ( $gridList, $checkboxs )
                    } else
                    {
                        disableJqgridCheckbox ( $gridList, $checkboxs )
                    }
                }
            } );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    // jqgrid
    jqGridBasic ();
    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : i18nMessage.msg_sentenceGridNoData
        } );

        $ ( '#gridListPop' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}
// jqgrid end

// 삭제 체크
function checkDelete ()
{
    var $btnDelete = $ ( '#btn_delete' );

    $btnDelete.click ( function ()
    {
        var tagIdArray = [];
        var reflctBeginDtArray = [];
        var $that = $ ( this );

        $ ( '.reflctBeginDt' ).each ( function ()
        {
            if ( $ ( this ).prop ( 'checked' ) )
            {
                var $that = $ ( this );
                tagIdArray.push ( encodeURIComponent ( $that.data ( 'tag-id' ) ) );
                reflctBeginDtArray.push ( encodeURIComponent ( $that.val () ) );
            }
        } );

        if ( reflctBeginDtArray.length === 0 )
        {
            alert ( i18nMessage.msg_alertNoSelectedDeleteItem );
        } else
        {
            if ( confirm ( i18nMessage.msg_alertDeleteConfirm ) == true )
            {
                location.href = $that.attr ( 'href' ) + '?tagId=' + tagIdArray.toString () + '&reflctBeginDt='
                        + reflctBeginDtArray.toString ();
            }
        }

        return false;
    } );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $btnCancel01 = $ ( '#btn_cancel01' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    var $gridList = $ ( '#gridListPop' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

    $btnEdit01.click ( function ()
    {
        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        enableJqgridCheckbox ( $gridList, $checkboxs );
    } );

    $btnCancel01.click ( function ()
    {
        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        disableJqgridCheckbox ( $gridList, $checkboxs );
    } );
}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );
}

// jqgrid 편집 disable 처리
function disableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'showCol', [ 'rn' ] );
    $gridList.jqGrid ( 'hideCol', [ 'cb' ] );

    // onSelectRow event 적용
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return true;
        }
    } );
}

$ ( function ()
{
    customizeJqgrid ();
    switchButtonGroup ();
    checkDelete ();
} );
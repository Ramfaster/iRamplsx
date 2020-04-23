// 태그 결합 : 타겟 태그 리스트
var tagTargetTagList;

function setColModel ()
{
    var colModel = [ {
        name : 'applyFormla',
        index : '',
        align : 'center',
        width : '70',
        sortable : false
    }, {
        name : 'tagId',
        index : '',
        align : 'center',
        width : '260'
    }, {
        name : 'tagEngNm',
        index : '',
        align : 'center',
        width : '100'
    }, {
        name : 'paramtrTypeNm',
        index : '',
        align : 'center',
        width : '100'
    }, {
        name : 'paramtrNm',
        index : '',
        align : 'center',
        width : '105'
    }, {
        name : 'tagGrpNm',
        index : '',
        align : 'center',
        width : '90'
    } ];

    if ( lang == locale.korea || lang == locale.korean )
    {
        colModel = [ {
            name : 'applyFormla',
            index : '',
            align : 'center',
            width : '70',
            sortable : false
        }, {
            name : 'tagId',
            index : '',
            align : 'center',
            width : '260'
        }, {
            name : 'tagKorNm',
            index : '',
            align : 'center',
            width : '100'
        }, {
            name : 'paramtrTypeNm',
            index : '',
            align : 'center',
            width : '100'
        }, {
            name : 'paramtrNm',
            index : '',
            align : 'center',
            width : '105'
        }, {
            name : 'tagGrpNm',
            index : '',
            align : 'center',
            width : '90'
        } ];
    }

    return colModel;
}

// jqgrid start
function jqGridBasic ()
{
    var colModel = setColModel ();

    // TODO 수정일 경우
    var $pvId = $ ( '#pvId' );
    var $eqmtId = $ ( '#eqmtId' );
    var $tagGrp = $ ( '#tagGrp' );

    $ ( '#gridList' )
            .jqGrid (
                    {
                        url : contextPath + '/hom/sysmgt/systag/tagList.ajax',
                        mtype : 'POST',
                        datatype : 'json',
                        postData : {
                            pvId : $ ( ":selected", $pvId ).val (),
                            eqmtId : $ ( ":selected", $eqmtId ).val (),
                            tagGrpCd : $ ( ":selected", $tagGrp ).val ()
                        },
                        height : 285,
                        autowidth : true,
                        shrinkToFit : false,
                        colNames : [ i18nMessage.msg_formulaApply, i18nMessage.msg_tagId, i18nMessage.msg_tagName,
                                i18nMessage.msg_parameterType, i18nMessage.msg_parameterName, i18nMessage.msg_tagGroup ],
                        colModel : colModel,
                        sortname : 'tagId',
                        sortorder : 'asc',
                        page : 1,
                        rowNum : staticVariable.gridRow30,
                        scroll : true,
                        viewrecords : true,
                        emptyrecords : i18nMessage.msg_sentenceGridNoData,
                        loadComplete : function ( data )
                        {
                            var $gqNodata = $ ( '.gq_nodata' );
                            var $gridList = $ ( '#gridList' );

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

                                    rowData.applyFormla = '<a href="javascript:;" class="btn_intbl link btn_tag_add" data-tag-id="'
                                            + rowData.tagId
                                            + '"><i class="icon_add03"></i>'
                                            + i18nMessage.msg_addition
                                            + '</a>';

                                    $gridList.jqGrid ( 'setRowData', cl, rowData );
                                }

                                tagAdd ();
                            }
                        }
                    } );
}

// jqgrid 검색
function searchJqgrid ()
{
    var $btn_search = $ ( '#btn_search_tag_grp' );
    var $gridList = $ ( '#gridList' );

    var param = {
        $pvId : $ ( '#pvId' ),
        $eqmtId : $ ( '#eqmtId' ),
        $tagGrp : $ ( '#tagGrp' ),
        $searchKeyword : $ ( '#searchKeyword' ),
        $tagPrcuseRng : $ ( '#tagPrcuseRng' ),
        $tagId : $ ( '#tagId' )
    };

    $btn_search.click ( function ()
    {
        reloadJqgrid ( $gridList, param );
    } );
}

// jqgrid reload
function reloadJqgrid ( $gridList, param )
{
    var pvId = null;
    var tagPrcuseRng = null;
    var eqmtId = null;
    if ( method === staticVariable.methodUpdate )
    {
        pvId = param.$pvId.val ();
        tagPrcuseRng = param.$tagPrcuseRng.val ();
        eqmtId = param.$eqmtId.val ();
    } else
    {
        pvId = $ ( ":selected", param.$pvId ).val ();
        tagPrcuseRng = $ ( ":selected", param.$tagPrcuseRng ).val ();
        eqmtId = $ ( ":selected", param.$eqmtId ).val ();
    }

    if ( tagPrcuseRng === 'RNG02' )
    {
        eqmtId = eqmtId.replace ( /0/g, '' );
    }

    if ( pvId === '' )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertNoSelectedElectricPowerStation,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } else if ( eqmtId === '' )
    {
        $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_validDataRequiredEquipment,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeInfo
        } );
    } else
    {
        $gridList.setGridParam ( {
            postData : {
                pvId : pvId,
                eqmtId : eqmtId,
                tagGrpCd : $ ( ":selected", param.$tagGrp ).val (),
                searchKeyword : param.$searchKeyword.val (),
                tagId : param.$tagId.val (),
            }
        } ).trigger ( 'reloadGrid' );
    }
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

        $ ( '#gridList' ).parent ().append ( html );
    }
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// 수식 적용 추가 버튼 클릭
function tagAdd ()
{
    var $btnTagAdd = $ ( '.btn_tag_add' );
    var $tagCombineCndfrmla = $ ( '#tag_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );
    $btnTagAdd.click ( function ()
    {
        var tagId = $ ( this ).data ( 'tag-id' );
        var originCndfrmla = $tagCombineCndfrmla.val ();
        $tagCombineCndfrmla.val ( originCndfrmla + ' ' + tagId );
        $cndfrmla.val ( originCndfrmla + ' ' + tagId );

        tagTargetTagList.push ( tagId );
    } );
}

// 연산자 추가
function operatorAdd ()
{
    var $btnOperator = $ ( '.btn_operator' );
    var $tagCombineCndfrmla = $ ( '#tag_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );
    $btnOperator.on ( 'click', function ()
    {
        var operator = $ ( this ).data ( 'operator' );
        var originCndfrmla = $tagCombineCndfrmla.val ();
        $tagCombineCndfrmla.val ( originCndfrmla + ' ' + operator );
        $cndfrmla.val ( originCndfrmla + ' ' + operator );
    } );
}

// 상수 추가
function constantAdd ()
{
    var $tagCombineConstant = $ ( '#tag_combine_constant' );
    var $tagCombineConstantAdd = $ ( '#tag_combine_constant_add' );
    var $tagCombineCndfrmla = $ ( '#tag_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );

    $tagCombineConstantAdd.on ( 'click', function ()
    {
        var constant = $tagCombineConstant.val ();
        if ( constant === '' )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertEnterConstantValue,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else if ( $.isNumeric ( constant ) )
        {
            var originCndfrmla = $tagCombineCndfrmla.val ();
            $tagCombineCndfrmla.val ( originCndfrmla + ' ' + constant );
            $cndfrmla.val ( originCndfrmla + ' ' + constant );
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertOnlyNumber,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        }
    } );
}

// backspace
function clickBackspace ()
{
    var $tagCombineBackspace = $ ( '#tag_combine_backspace' );
    var $tagCombineCndfrmla = $ ( '#tag_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );
    $tagCombineBackspace.on ( 'click', function ()
    {
        var cndfrmalVal = $tagCombineCndfrmla.val ();
        var lastIndex = cndfrmalVal.lastIndexOf ( ' ' );
        var tempVal = cndfrmalVal.substring ( 0, lastIndex )
        $tagCombineCndfrmla.val ( tempVal );
        $cndfrmla.val ( tempVal );

        var tempRemove = $.trim ( cndfrmalVal.substring ( lastIndex, cndfrmalVal.length ) );
        $.each ( tagTargetTagList, function ( index, tag )
        {
            if ( tag === tempRemove )
            {
                tagTargetTagList.splice ( index, 1 );
                return false;
            }
        } );
    } );
}

// clear all
function clickClearAll ()
{
    var $tagCombineReset = $ ( '#tag_combine_reset' );
    var $tagCombineCndfrmla = $ ( '#tag_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );
    $tagCombineReset.on ( 'click', function ()
    {
        $tagCombineCndfrmla.val ( '' );
        $cndfrmla.val ( '' );
    } );
}

// 연산자 체크
function checkOperator ()
{
    var $paramtrType = $ ( '#paramtrType' );
    setOperatorType ( $ ( ":selected", $paramtrType ).val () );

    $paramtrType.on ( 'change', function ()
    {
        var paramtrType = $ ( ":selected", $ ( this ) ).val ();
        setOperatorType ( paramtrType );
    } );
}

// 연산자 셋팅
function setOperatorType ( paramtrType )
{
    var $tagCombineOperatorBasic = $ ( '#tag_combine_operator_basic' );
    var $tagCombineOperatorAlm = $ ( '#tag_combine_operator_alm' );
    if ( paramtrType === 'PARMTY02' || paramtrType === 'PARMTY03' )
    {
        $tagCombineOperatorBasic.addClass ( 'dnone' );
        $tagCombineOperatorAlm.removeClass ( 'dnone' );
    } else
    {
        $tagCombineOperatorBasic.removeClass ( 'dnone' );
        $tagCombineOperatorAlm.addClass ( 'dnone' );
    }
}

$ ( function ()
{
    var $trgetTagIdsVal = $ ( '#trgetTagIds' );
    if ( $trgetTagIdsVal.val () !== '' )
    {
        tagTargetTagList = $trgetTagIdsVal.val ().split ( ',' );
    } else
    {
        tagTargetTagList = [];
    }

    customizeJqgrid ();
    searchJqgrid ();
    operatorAdd ();
    clickBackspace ();
    clickClearAll ();
    checkOperator ();
    constantAdd ();

    if ( method === staticVariable.methodUpdate )
    {
        $ ( '#btn_search_tag_grp' ).click ();
    }
} );
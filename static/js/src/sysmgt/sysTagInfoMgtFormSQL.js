// 선택된 테이블 아이디
var checkedTblIds;
// 태그 결합 : 타겟 태그 리스트
var sqlParamtrList;

// customizeCheckbox
function customizeCheckboxTbl ()
{
    $ ( '.sql_tbl_checkbox_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

function customizeCheckboxAttrb ()
{
    $ ( '.sql_attrb_checkbox_type' ).customizeCheckbox ( {
        backgroundImage : contextPath + '/css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x : contextPath + '/css/lib/customizeForm/img/img_checkbox@2x.png',
        width : 13,
        height : 13
    } );
}

// step 옮기기
function moveStepNavi ( isKorean )
{
    var $sqlStepNavi = $ ( '.sql_step_navi' );
    var $sqlStepDiv = $ ( '.sql_step_div' );
    var $sqlStep01 = $ ( '#sql_step01' );
    var $sqlStep02 = $ ( '#sql_step02' );
    var $sqlStep03 = $ ( '#sql_step03' );
    var $sqlStep04 = $ ( '#sql_step04' );

    $sqlStepNavi.on ( 'click', function ()
    {
        $ ( '.step_sql li' ).removeClass ( 'on' );

        var $currentNavi = $ ( this ).closest ( 'li' );
        var dataId = $currentNavi.data ( 'id' );
        $currentNavi.addClass ( 'on' );
        switch ( dataId )
        {
            case 'table':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep01.removeClass ( 'dnone' );
                break;
            case 'cloums':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep02.removeClass ( 'dnone' );
                checkDataStep02 ();
                break;
            case 'where':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep03.removeClass ( 'dnone' );
                getDataStep03 ( isKorean );
                break;
            case 'sql':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep04.removeClass ( 'dnone' );
                getDataStep04 ();
                break;
        }
    } );
}

// 이전 버튼 클릭
function clickPrevBtn ( isKorean )
{
    var $sqlStepDiv = $ ( '.sql_step_div' );
    var $sqlStep01 = $ ( '#sql_step01' );
    var $sqlStep02 = $ ( '#sql_step02' );
    var $sqlStep03 = $ ( '#sql_step03' );
    var $sqlStep04 = $ ( '#sql_step04' );
    var $btnSqlPrev = $ ( '.btn_sql_prev' );
    var $stepSql = $ ( '.step_sql' );

    $btnSqlPrev.on ( 'click', function ()
    {
        var $sqlStep = $ ( this ).closest ( '.sql_step_div' );
        switch ( $sqlStep.attr ( 'id' ) )
        {
            case 'sql_step02':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep01.removeClass ( 'dnone' );
                $stepSql.find ( '.step01' ).addClass ( 'on' );
                $stepSql.find ( '.step02' ).removeClass ( 'on' );
                break;
            case 'sql_step03':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep02.removeClass ( 'dnone' );
                $stepSql.find ( '.step02' ).addClass ( 'on' );
                $stepSql.find ( '.step03' ).removeClass ( 'on' );
                checkDataStep02 ();
                break;
            case 'sql_step04':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep03.removeClass ( 'dnone' );
                $stepSql.find ( '.step03' ).addClass ( 'on' );
                $stepSql.find ( '.step04' ).removeClass ( 'on' );
                getDataStep03 ( isKorean );
                break;
        }
    } );
}

// 다음 버튼 클릭
function clickNextBtn ( isKorean )
{
    var $sqlStepDiv = $ ( '.sql_step_div' );
    var $sqlStep01 = $ ( '#sql_step01' );
    var $sqlStep02 = $ ( '#sql_step02' );
    var $sqlStep03 = $ ( '#sql_step03' );
    var $sqlStep04 = $ ( '#sql_step04' );
    var $btnSqlNext = $ ( '.btn_sql_next' );
    var $stepSql = $ ( '.step_sql' );

    $btnSqlNext.on ( 'click', function ()
    {
        var $sqlStep = $ ( this ).closest ( '.sql_step_div' );
        switch ( $sqlStep.attr ( 'id' ) )
        {
            case 'sql_step01':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep02.removeClass ( 'dnone' );
                $stepSql.find ( '.step02' ).addClass ( 'on' );
                $stepSql.find ( '.step01' ).removeClass ( 'on' );
                checkDataStep02 ();
                break;
            case 'sql_step02':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep03.removeClass ( 'dnone' );
                $stepSql.find ( '.step03' ).addClass ( 'on' );
                $stepSql.find ( '.step02' ).removeClass ( 'on' );
                getDataStep03 ( isKorean );
                break;
            case 'sql_step03':
                $sqlStepDiv.addClass ( 'dnone' );
                $sqlStep04.removeClass ( 'dnone' );
                $stepSql.find ( '.step04' ).addClass ( 'on' );
                $stepSql.find ( '.step03' ).removeClass ( 'on' );
                getDataStep04 ();
                break;
        }
    } );
}

// 조건식 유형이 sql인지 확인하고 테이블 정보 가져오기
function checkCndformlaInSQL ()
{
    var $cndfrmlaTyCd = $ ( '#cndfrmlaTyCd' );
    var tpl = getTemplate ( templates.tblPhysiclTr );
    var cndfrmlaTyCd = $ ( ':selected', $ ( '#cndfrmlaTyCd' ) ).val ();
    var $sqlTblListTbody = $ ( '#sql_tbl_list tbody' );

    if ( cndfrmlaTyCd === 'FM02' )
    {
        getTblPhysiclInfo ( $sqlTblListTbody, tpl );
    }

    $cndfrmlaTyCd.on ( 'change', function ()
    {
        cndfrmlaTyCd = $ ( ':selected', $ ( '#cndfrmlaTyCd' ) ).val ();
        if ( cndfrmlaTyCd === 'FM02' )
        {
            getTblPhysiclInfo ( $sqlTblListTbody, tpl );
        }
    } );
}

// 테이블 정보 가져오기
function getTblPhysiclInfo ( $sqlTblListTbody, tpl )
{
    // 초기에 한번 조건식 유형이 sql결합인지 확인하고 맞으면 가져오기
    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/selectTblPhysiclInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        tblPhysiclInfoList : json.data
                    } );

                    $sqlTblListTbody.empty ().html ( html ).trigger ( 'change' );

                    customizeCheckboxTbl ();
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

// 2단계 - 체크된 데이터가 바뀌었는지 확인
function checkDataStep02 ()
{
    var tempCheckedTblIds = [];
    $ ( '.sql_tbl_checkbox_type:checkbox:checked' ).each ( function ()
    {
        tempCheckedTblIds.push ( $ ( this ).val () );
    } );

    if ( checkedTblIds.length > 0 )
    {
        if ( checkedTblIds.length < tempCheckedTblIds.length )
        {
            checkedTblIds = tempCheckedTblIds;
            getDataStep02 ();
        } else if ( checkedTblIds.length > tempCheckedTblIds.length )
        {
            if ( tempCheckedTblIds.length !== 0 )
            {
                checkedTblIds = tempCheckedTblIds;
                getDataStep02 ();
            } else
            {
                $ ( '#sql_step02 table tbody' ).empty ();
                $ ( '#sql_where_column .mCSB_container' ).empty ();
            }
        } else
        {
            var flag = false;
            $.grep ( checkedTblIds, function ( el )
            {
                if ( $.inArray ( el, tempCheckedTblIds ) == -1 )
                {
                    flag = true;
                }
            } );

            // 수정된것이 있다면
            if ( flag )
            {
                checkedTblIds = tempCheckedTblIds;
                getDataStep02 ();
            }
        }
    } else if ( tempCheckedTblIds.length > 0 )
    {
        checkedTblIds = tempCheckedTblIds;
        getDataStep02 ();
    }
}

// 2단계 - 데이터를 가져와서 뿌림
function getDataStep02 ()
{
    var $sqlStep02TableTbody = $ ( '#sql_step02 table tbody' );
    var $sqlWhereColumn = $ ( '#sql_where_column .mCSB_container' );
    var tblAttrbTr = getTemplate ( templates.tblAttrbTr );
    var tblAttrbDiv = getTemplate ( templates.tblAttrbDiv );

    $.ajax ( {
        url : contextPath + '/hom/sysmgt/systag/selectTblAttrbInfoList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            tblIds : checkedTblIds
        },
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                if ( tblAttrbTr !== null )
                {
                    var template = _.template ( tblAttrbTr );
                    var html = template ( {
                        tblAttrbInfoList : json.data
                    } );

                    $sqlStep02TableTbody.empty ().html ( html ).trigger ( 'change' );

                    customizeCheckboxAttrb ();
                }

                if ( tblAttrbDiv !== null )
                {
                    var template = _.template ( tblAttrbDiv );
                    var html = template ( {
                        tblAttrbInfoList : json.data
                    } );

                    $sqlWhereColumn.empty ().html ( html ).trigger ( 'change' );

                    addWhereColumnsSQL ();
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

// 3단계 - 데이터를 가져와서 뿌림
function getDataStep03 ( isKorean )
{
    var paramtrIds = [];
    var paramtrDivTpl = getTemplate ( templates.paramtrDiv );
    var $sqlWhereColumn = $ ( '#sql_where_column' ).find ( '.sql_where_attrb_operator' );
    var $sqlWhereParamtr = $ ( '#sql_where_paramtr .mCSB_container' );

    $sqlWhereColumn.each ( function ()
    {
        paramtrIds.push ( $ ( this ).data ( 'paramtr-id' ) );
    } );

    if ( paramtrIds.length > 0 )
    {
        $.ajax ( {
            url : contextPath + '/hom/sysmgt/systag/selectSysTagParamtrInfoList.ajax',
            type : 'POST',
            dataType : 'json',
            data : {
                paramtrIds : paramtrIds
            },
            success : function ( json )
            {
                if ( json.status === staticVariable.jsonStatusSuccess )
                {
                    if ( paramtrDivTpl !== null )
                    {
                        var template = _.template ( paramtrDivTpl );
                        var html = template ( {
                            isKorean : isKorean,
                            paramtrInfoList : json.data
                        } );

                        $sqlWhereParamtr.empty ().html ( html ).trigger ( 'change' );
                        addWhereParamtrsSQL ();
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
}

// columns 삽입
function addWhereColumnsSQL ()
{
    var $sqlWhereAttrbOperatorAdd = $ ( '.sql_where_attrb_operator_add' );
    var $sqlCombineWhereCndfrmla = $ ( '#sql_combine_where_cndfrmla' );
    $sqlWhereAttrbOperatorAdd.click ( function ()
    {
        var $attrDiv = $ ( this ).closest ( '.sql_where_attrb_operator' );
        var colId = $attrDiv.data ( 'paramtr-id' );
        var tblId = $attrDiv.data ( 'table-id' );
        var originCndfrmla = $sqlCombineWhereCndfrmla.val ();

        $sqlCombineWhereCndfrmla.val ( originCndfrmla + ' ' + tblId + "." + colId );
    } );
}

// paramtr 삽입
function addWhereParamtrsSQL ()
{
    var $sqlWhereParamtrOperatorAdd = $ ( '.sql_where_paramtr_operator_add' );
    var $sqlCombineWhereCndfrmla = $ ( '#sql_combine_where_cndfrmla' );
    $sqlWhereParamtrOperatorAdd.click ( function ()
    {
        var $attrDiv = $ ( this ).closest ( '.sql_where_paramtr_operator' );
        var paramtrId = $attrDiv.data ( 'paramtr-id' );
        var originCndfrmla = $sqlCombineWhereCndfrmla.val ();

        $sqlCombineWhereCndfrmla.val ( originCndfrmla + ' :' + paramtrId );

        sqlParamtrList.push ( paramtrId );
    } );
}

// 연산자 추가
function operatorWhereAddSQL ()
{
    var $btnOperator = $ ( '.sql_operator .btn_operator' );
    var $sqlCombineWhereCndfrmla = $ ( '#sql_combine_where_cndfrmla' );
    $btnOperator.on ( 'click', function ()
    {
        var operator = $ ( this ).data ( 'operator' );
        var originCndfrmla = $sqlCombineWhereCndfrmla.val ();

        $sqlCombineWhereCndfrmla.val ( originCndfrmla + ' ' + operator );
    } );
}

// where backspace
function clickWhereBackspaceSQL ()
{
    var $sqlCombineWhereBackspace = $ ( '#sql_combine_where_backspace' );
    var $sqlCombineWhereCndfrmla = $ ( '#sql_combine_where_cndfrmla' );
    $sqlCombineWhereBackspace.on ( 'click', function ()
    {
        var cndfrmalVal = $sqlCombineWhereCndfrmla.val ();
        var lastIndex = cndfrmalVal.lastIndexOf ( ' ' );
        $sqlCombineWhereCndfrmla.val ( cndfrmalVal.substring ( 0, lastIndex ) );

        var tempVal = $.trim ( cndfrmalVal.substring ( lastIndex, cndfrmalVal.length ) );

        $.each ( sqlParamtrList, function ( index, param )
        {
            if ( param === tempVal.replace ( ':', '' ) )
            {
                sqlParamtrList.splice ( index, 1 );
                return false;
            }
        } );
    } );
}

// where clear all
function clickWhereClearAllSQL ()
{
    var $sqlCombineWhereReset = $ ( '#sql_combine_where_reset' );
    var $sqlCombineWhereCndfrmla = $ ( '#sql_combine_where_cndfrmla' );
    $sqlCombineWhereReset.on ( 'click', function ()
    {
        $sqlCombineWhereCndfrmla.val ( '' );
    } );
}

// clear all
function clickClearAllSQL ()
{
    var $sqlCombineReset = $ ( '#sql_combine_reset' );
    var $sqlCombineCndfrmla = $ ( '#sql_combine_cndfrmla' );
    var $cndfrmla = $ ( '#cndfrmla' );
    $sqlCombineReset.on ( 'click', function ()
    {
        $.when ( $.customizeDialog ( {
            template : templates.dialog,
            message : i18nMessage.msg_alertDeleteConfirm,
            checkText : i18nMessage.msg_ok,
            cancelText : i18nMessage.msg_cancel,
            type : staticVariable.dialogTypeConfirm
        } ) ).then ( function ( confirm )
        {
            if ( confirm )
            {
                $sqlCombineCndfrmla.val ( '' );
                $cndfrmla.val ( '' );
            }
        } );
    } );
}

// 4단계 - 데이터를 가져와서 뿌림 - SQL 구성
function getDataStep04 ()
{
    var tableIds = getSqlTableIds ();
    var selectAttrbs = getSqlSelectAttrbs ();
    var whereCndfrmla = $ ( '#sql_combine_where_cndfrmla' ).val ();

    var sql = 'SELECT';
    for ( var i = 0, length = selectAttrbs.length; i < length; i++ )
    {
        sql += ' ' + selectAttrbs[i].tblId + '.' + selectAttrbs[i].colId;
        if ( i !== length - 1 )
        {
            sql += ','
        }
    }

    sql += ' FROM';
    for ( var i = 0, length = tableIds.length; i < length; i++ )
    {
        sql += ' ' + tableIds[i];
        if ( i !== length - 1 )
        {
            sql += ','
        }
    }

    sql += ' WHERE ' + whereCndfrmla;

    $ ( '#sql_combine_cndfrmla' ).val ( sql );
    $ ( '#cndfrmla' ).val ( sql );
}

// table id를 반환
function getSqlTableIds ()
{
    var tableIds = [];
    $ ( '.sql_tbl_checkbox_type:checkbox:checked' ).each ( function ()
    {
        tableIds.push ( $ ( this ).val () );
    } );

    return tableIds;
}

// select용 column 가져오기
function getSqlSelectAttrbs ()
{
    var selectAttrbs = [];
    $ ( '.sql_attrb_checkbox_type:checkbox:checked' ).each ( function ()
    {
        selectAttrbs.push ( {
            tblId : $ ( this ).data ( 'table-id' ),
            colId : $ ( this ).val ()
        } );
    } );

    return selectAttrbs;
}

// sql method가 업데이트 인경우
function initSql ()
{
    var $sqlStepDiv = $ ( '.sql_step_div' );
    var $sqlStep04 = $ ( '#sql_step04' );
    var $stepSql = $ ( '.step_sql' );
    var cndfrmla = $ ( '#cndfrmla' ).val ();
    $ ( '#sql_combine_cndfrmla' ).val ( cndfrmla );

    $sqlStepDiv.addClass ( 'dnone' );
    $sqlStep04.removeClass ( 'dnone' );
    $stepSql.find ( '.step04' ).addClass ( 'on' );
    $stepSql.find ( '.step01' ).removeClass ( 'on' );
}

$ ( function ()
{
    var $paramtrIdVal = $ ( '#paramtrIds' );
    if ( $paramtrIdVal.val () !== '' )
    {
        sqlParamtrList = $paramtrIdVal.val ().split ( ',' );
    } else
    {
        sqlParamtrList = [];
    }

    var isKorean = false;
    if ( lang == locale.korea || lang == locale.korean )
    {
        isKorean = true;
    }
    checkedTblIds = [];

    checkCndformlaInSQL ();
    moveStepNavi ( isKorean );
    clickPrevBtn ( isKorean );
    clickNextBtn ( isKorean );
    addWhereColumnsSQL ();
    addWhereParamtrsSQL ();
    operatorWhereAddSQL ();
    clickWhereBackspaceSQL ();
    clickWhereClearAllSQL ();
    clickClearAllSQL ();

    // method 셋팅
    if ( method === staticVariable.methodUpdate )
    {
        initSql ();
    }
} );
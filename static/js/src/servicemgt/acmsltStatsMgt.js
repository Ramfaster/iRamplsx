var pvSearchList;

// form element customize
function customizeForm ()
{
    var $selType1 = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );
}

// init datetimepicker
function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#start_yyyy' );
    var $endYYYY = $ ( '#end_yyyy' );
    var $yyyyFromDate = $ ( '#yyyy_from_date' );
    var $yyyyToDate = $ ( '#yyyy_to_date' );

    var $yyyymm = $ ( '.yyyymm' );
    var $startYYYYMM = $ ( '#start_yyyymm' );
    var $endYYYYMM = $ ( '#end_yyyymm' );
    var $yyyymmFromDate = $ ( '#yyyymm_from_date' );
    var $yyyymmToDate = $ ( '#yyyymm_to_date' );

    var $yyyymmdd = $ ( '.yyyymmdd' );
    var $startYYYYMMDD = $ ( '#start_yyyymmdd' );
    var $endYYYYMMDD = $ ( '#end_yyyymmdd' );
    var $yyyymmddFromDate = $ ( '#yyyymmdd_from_date' );
    var $yyyymmddToDate = $ ( '#yyyymmdd_to_date' );

    // 기간유형 datetimepicker 설정
    $yyyy.datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymm.datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyymmdd.datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : language,
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );

    $yyyymm.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMM, $endYYYYMM, $yyyymmFromDate, $yyyymmToDate );
    } );

    $yyyymmdd.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYYMMDD, $endYYYYMMDD, $yyyymmddFromDate, $yyyymmddToDate );
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.tree_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        axis : 'yx',
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );

    $ ( '.frm_con01 .frm_cont_wrap, .tbl_add_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    // 조회기간
    var $date = $ ( '.sa01 .date' );
    var $dateType = $ ( '#sel_dateType' );
    $dateType.on ( 'change', function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( selectedType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( selectedType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        $date.addClass ( 'dnone' );

        var localFromTodate = homUtil.getLocalFromToDate ( date, selectedType, false, false );
        var $dateBox = $ ( '.' + className );
        $dateBox.removeClass ( 'dnone' );
        $ ( '#' + className + '_from_date' ).val ( localFromTodate.fromDate );
        $ ( '#' + className + '_to_date' ).val ( localFromTodate.toDate );

        $dateBox.trigger ( 'changeDate' );
    } );

    $dateType.trigger ( 'change' );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(조회 조건, 시작, 종료, 설비 등)을 바꾼 후 조회버튼을 누르지 않고 내려받기, 전체보기 등 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParamaeter ()
{
    var dateType = $ ( '#sel_dateType' ).val ();
    var className = null;
    var dateFormat = null;

    var $aplctnSectnCd = $ ( '#searchAplctnSectnCd' );
    var $aplctnStleCd = $ ( '#searchAplctnStleCd' );

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
        dateFormat = homUtil.dateFormat.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
        dateFormat = homUtil.dateFormat.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
        dateFormat = homUtil.dateFormat.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();

    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    $ ( '#pvId' ).val ( pvSearchList );
    $ ( '#dateType' ).val ( $ ( '#sel_dateType' ).val () );
    $ ( '#fromDate' ).val ( pureFromDate );
    $ ( '#toDate' ).val ( pureToDate );
    $ ( '#aplctnSectnCd' ).val ( $aplctnSectnCd.val () );
    $ ( '#aplctnStleCd' ).val ( $aplctnStleCd.val () );

    // var fromDate = homUtil.convertDateStringToFormat ( $ ( '#fromDate' ).val (), dateFormat );
    // var toDate = homUtil.convertDateStringToFormat ( $ ( '#toDate' ).val (), dateFormat );

    // $ ( '#select_date_type' ).val ( dateType ).trigger ( 'change' );
    // $ ( '#' + className + '_from_date' ).val ( fromDate );
    // $ ( '#' + className + '_to_date' ).val ( toDate );

    // if ( typeof treeNode !== 'undefined' && treeNode !== null )
    // {
    // zTree.selectNode ( treeNode );
    // zTree.checkNode ( treeNode, true, true );
    // }

}

// treemenu customize
function customizeTree ()
{
    $.ajax ( {
        url : contextPath + '/hom/common/selectEquipmentTreeList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            treeType : staticVariable.treeTypeNationPv
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                initTree ( json.data );

                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var nodes = zTree.transformToArray ( zTree.getNodes () );

                var checkedNode = null;
                if ( paramPvId !== '' )
                {
                    $.each ( nodes, function ( i, node )
                    {
                        if ( node.id === paramPvId )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                } else
                {
                    // check노드가 없을 경우 check 설정
                    $.each ( nodes, function ( i, node )
                    {
                        if ( !node.isParent )
                        {
                            node.checked = true;
                            zTree.refresh ();
                            checkedNode = node;

                            return false;
                        }
                    } );
                }

                if ( checkedNode !== null )
                {
                    // initJqgrid
                    pvSearchList = checkedNode.id;
                    // customizeJqgrid ();
                    searchJqgrid ();

                }

                setNoChildTreeNodeChkDisabled ( zTree, nodes, true );
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

/**
 * 트리 초기화
 */
function initTree ( data )
{
    // 트리메뉴
    var setting = {
        view : {
            // addHoverDom : addHoverDom,
            // removeHoverDom : removeHoverDom,
            selectedMulti : false
        },
        check : {
            enable : true,
            chkStyle : 'radio',
            radioType : 'all',
            chkDisabled : true
        },
        data : {
            simpleData : {
                enable : true
            }
        },
        view : {
            showIcon : false
        },
        callback : {
            beforeClick : function beforeClick ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var selectedNodes = zTree.getSelectedNodes ();

                if ( selectedNodes.length > 0 && selectedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    if ( treeNode.chkDisabled )
                    {
                        return false;
                    } else
                    {
                        zTree.checkNode ( treeNode, true, true );

                        // reloadJqgrid ( treeNode.id );
                        pvSearchList = treeNode.id;
                        $ ( '#btnSubmit' ).trigger ( "click" );
                    }
                }
            },
            beforeCheck : function ( treeId, treeNode )
            {
                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var checkedNodes = zTree.getCheckedNodes ( true );

                if ( checkedNodes.length > 0 && checkedNodes[0].id === treeNode.id )
                {
                    return false;
                } else
                {
                    zTree.selectNode ( treeNode );

                    // reloadJqgrid ( treeNode.id );
                    pvSearchList = treeNode.id;
                    $ ( '#btnSubmit' ).trigger ( "click" );

                }
            }
        }
    };

    // 트리 데이터 설정
    $.fn.zTree.init ( $ ( '#treeList' ), setting, data );
}

// 제일 상위 노드 enable/disable 처리
function setNoChildTreeNodeChkDisabled ( zTree, nodes, disabled )
{
    for ( var i = 0, length = nodes.length; i < length; i++ )
    {
        if ( nodes[i].pId == null )
        {
            zTree.setChkDisabled ( nodes[i], true );
        }
    }
}

// init highcharts
function searchPrChart ( data )
{
    var categoriesArray = [];
    var dataArr = [];
    var dataArr2 = [];

    var pvNm;

    // 기존 차트 삭제
    homUtil.clearHighcharts ( [ $ ( '#graph1' ).highcharts () ] );

    if ( data.rows.length > 0 )
    {
        $.each ( data.rows, function ( index, item )
        {
            if ( index == 0 )
            {
                if ( lang === locale.korea || lang === locale.korean )
                {
                    pvNm = item.pvKorNm;
                } else
                {
                    pvNm = item.pvEngNm;
                }
            }

            categoriesArray.push ( item.formatDate );
            dataArr.push ( item.planAccumulation );
            dataArr2.push ( item.accumulation );
        } );

        // var yAxisMax = Math.max ( ... dataArr );
        var yAxisMax = _.max ( dataArr );

        if ( yAxisMax <= 10 )
        {
            yAxisMax = 10;
        } else
        {
            yAxisMax *= 1.5;
        }

        // 그래프
        $ ( '#graph1' ).highcharts ( {
            chart : {
                marginTop : 50
            },
            title : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            subtitle : {
                text : '',
                style : {
                    display : 'none'
                }
            },
            exporting : {
                enabled : false
            },
            credits : {
                enabled : false
            },
            xAxis : {
                categories : categoriesArray,
                crosshair : true
            },
            yAxis : [ {
                min : 0,
                max : yAxisMax,
                title : {
                    text : i18nMessage.msg_acmslt + '(' + i18nMessage.msg_cnt + ')'
                }
            } ],
            plotOptions : {
                column : {
                    pointPadding : 0,
                    borderWidth : 0
                }
            },
            series : [ {
                type : 'column',
                yAxis : 0,
                color : '#ed6c44',
                name : pvNm + ' ' + i18nMessage.msg_plan,
                data : dataArr
            }, {
                type : 'column',
                yAxis : 0,
                color : '#bbde9d',
                name : pvNm + ' ' + i18nMessage.msg_acmslt,
                data : dataArr2
            } ]
        } );
    }
}

// / jqgrid start
// 헤더 병합
function addGroupHeader ()
{
    $ ( "#gridList2" ).jqGrid ( 'destroyGroupHeader', false );

    $ ( "#gridList2" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'dailyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_daily
        }, {
            startColumnName : 'weeklyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_weekly
        }, {
            startColumnName : 'monthlyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_monthly
        }, {
            startColumnName : 'quarterPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_quarter
        }, {
            startColumnName : 'halfYearPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_halfYear
        }, {
            startColumnName : 'yearlyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_yearly
        }, {
            startColumnName : 'normalPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_general
        }, {
            startColumnName : 'specialPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_special
        }, {
            startColumnName : 'inspectionPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_inspection
        }, {
            startColumnName : 'repairPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_repair
        }, {
            startColumnName : 'blackoutPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_blackout
        }, {
            startColumnName : 'accidentPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_accident
        }, {
            startColumnName : 'planAccumulation',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_accumulation
        } ]
    } );
}

function addGroupHeader2 ()
{
    $ ( "#gridList2" ).jqGrid ( 'destroyGroupHeader', false );

    $ ( "#gridList2" ).jqGrid ( 'setGroupHeaders', {
        useColSpanStyle : true,
        groupHeaders : [ {
            startColumnName : 'dailyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_daily
        }, {
            startColumnName : 'weeklyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_weekly
        }, {
            startColumnName : 'monthlyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_monthly
        }, {
            startColumnName : 'quarterPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_quarter
        }, {
            startColumnName : 'halfYearPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_halfYear
        }, {
            startColumnName : 'yearlyPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_yearly
        }, {
            startColumnName : 'normalPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_general
        }, {
            startColumnName : 'inspectionPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_inspection
        }, {
            startColumnName : 'repairPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_repair
        }, {
            startColumnName : 'blackoutPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_blackout
        }, {
            startColumnName : 'accidentPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_accident
        }, {
            startColumnName : 'specialPlan',
            numberOfColumns : 2,
            titleText : i18nMessage.msg_special
        } ]
    } );
}

function dataInitialize ()
{
    var data = [];
    var length = 30;
    var temp = null;

    for ( var i = 0; i < length; i++ )
    {
        temp = {
            'date' : '2016-02-1' + (i + 1),
            'name_pp' : '강북아리수정수장' + (i + 1),
            'plan' : '10' + (i + 1),
            'performance' : '10' + (i + 1)
        };

        data.push ( temp );
    }

    return data;
}

function dataInitialize2 ()
{
    var data = [];
    var length = 30;
    var temp = null;

    for ( var i = 0; i < length; i++ )
    {
        temp = {
            'date' : '2016-02-1' + (i + 1),
            'name_pp' : '강북아리수정수장' + (i + 1),
            'plan_daily' : '10' + (i + 1),
            'performance_daily' : '10' + (i + 1),
            'plan_weekly' : '10' + (i + 1),
            'performance_weekly' : '10' + (i + 1),
            'plan_monthly' : '10' + (i + 1),
            'performance_monthly' : '10' + (i + 1),
            'plan_quarterly' : '10' + (i + 1),
            'performance_quarterly' : '10' + (i + 1),
            'plan_half_year' : '10' + (i + 1),
            'performance_half_year' : '10' + (i + 1),
            'plan_yearly' : '10' + (i + 1),
            'performance_yearly' : '10' + (i + 1),
            'plan_specialy' : '10' + (i + 1),
            'performance_specialy' : '10' + (i + 1),
            'plan_cumulatively' : '10' + (i + 1),
            'performance_cumulatively' : '10' + (i + 1)
        };

        data.push ( temp );
    }

    return data;
}

function addDataToJqGrid ( data )
{
    var $gridList = $ ( '#gridList' );
    for ( var i = 0, length = data.length; i < length; i++ )
    {
        $gridList.jqGrid ( 'addRowData', i + 1, data[i] );
    }
}

function addDataToJqGrid2 ( data )
{
    var $gridList = $ ( '#gridList2' );
    for ( var i = 0, length = data.length; i < length; i++ )
    {
        $gridList.jqGrid ( 'addRowData', i + 1, data[i] );
    }
}

function jqGridBasic ()
{
    var tpl = getTemplate ( templates.noData );

    var korean = true;
    var english = false;
    if ( lang === locale.korea || lang === locale.korean )
    {
        korean = false;
        english = true;
    }

    var $gridList = $ ( '#gridList2' );

    var dateType = $ ( '#sel_dateType' ).val ();
    var $aplctnSectnCd = $ ( '#searchAplctnSectnCd' );
    var $aplctnStleCd = $ ( '#searchAplctnStleCd' );

    var className = null;

    if ( dateType === homConstants.dateTypeYYYYMMDD )
    {
        className = staticVariable.formatYYYYMMDD;
    } else if ( dateType === homConstants.dateTypeYYYYMM )
    {
        className = staticVariable.formatYYYYMM;
    } else if ( dateType === homConstants.dateTypeYYYY )
    {
        className = staticVariable.formatYYYY;
    }

    var fromDate = $ ( '#' + className + '_from_date' ).val ();
    var toDate = $ ( '#' + className + '_to_date' ).val ();

    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
    {
        return;
    }

    $ ( '#gridList2' ).jqGrid (
            {
                url : contextPath + '/hom/servicemgt/acmsltStats/selectAcmsltStatsGridList.ajax',
                datatype : 'json',
                height : 261,
                autowidth : true, // 그리드 넓이 자동 지정 (true시 그리드 최대로 설정), width와 같이 사용 못함 - >
                shrinkToFit : false, // 컬럼너비 자동 지정
                // :default:false

                rowNum : staticVariable.gridRow30,
                // rowList : [ 10, 20 ],

                mtype : "POST",
                // mtype : "GET",
                postData : { /* 그리드 리스트 호출시 파라미터 값 전달 */
                    pvSearchList : pvSearchList,
                    dateType : dateType,
                    fromDate : pureFromDate,
                    toDate : pureToDate,
                    aplctnSectnCd : $aplctnSectnCd.val (),
                    aplctnStleCd : $aplctnStleCd.val ()
                },

                // caption : 'jqGrid Sample Table', //title

                sortname : "formatDate", // 처음 정렬될 컬럼
                sortorder : "asc", // 정렬방법 (asc/desc)

                // styleUI : 'Bootstrap',
                // datatype : "json",

                multiselect : false, // multi-select checkboxes appear
                multiboxonly : false, // checkboxes act like radio buttons where only one is selected at a
                // time

                page : 1,
                scroll : true, // set the scroll property to 1 to enable paging with scrollbar - virtual
                // loading of
                // records
                emptyrecords : 'Scroll to bottom to retrieve new page', // the message will be displayed at the
                // bottom

                // pager: '#samplePager',

                colNames : [ i18nMessage.msg_date, i18nMessage.msg_pvName, i18nMessage.msg_pvName,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt, i18nMessage.msg_plan, i18nMessage.msg_acmslt,
                        i18nMessage.msg_plan, i18nMessage.msg_acmslt ],

                colModel : [ {
                    name : 'formatDate',
                    index : 'formatDate',
                    align : 'center',
                    width : '96',
                    sortable : false,
                }, {
                    name : 'pvKorNm',
                    index : 'pvKorNm',
                    align : 'center',
                    width : '170',
                    ortable : false,
                    hidden : korean,
                    sortable : false,
                }, {
                    name : 'pvEngNm',
                    index : 'pvEngNm',
                    align : 'center',
                    width : '170',
                    ortable : false,
                    hidden : english,
                    sortable : false,
                }, {
                    name : 'dailyPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'dailyAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'weeklyPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'weeklyAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'monthlyPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'monthlyAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'quarterPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'quarterAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    hidden : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'halfYearPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'halfYearAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'yearlyPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'yearlyAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'normalPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    hiddel : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'normalAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    hiddel : true,
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'specialPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'specialAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue
                    }
                }, {
                    name : 'inspectionPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'inspectionAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'repairPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'repairAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'blackoutPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'blackoutAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'accidentPlan',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'accidentAcmslt',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'planAccumulation',
                    index : '계획',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                }, {
                    name : 'accumulation',
                    index : '실적',
                    align : 'center',
                    width : '58',
                    sortable : false,
                    formatter : function ( cellvalue, options, rowObject )
                    {
                        return (cellvalue == 0) ? '-' : cellvalue;
                    }
                } ],
                // beforeSelectRow: function () {
                // return false;
                // },
                loadError : function ( xhr, st, err )
                {
                    // alert("err-->" + err);
                    console.log ( ">>>>> loadError " );
                    console.log ( err );
                },

                loadComplete : function ( data )
                {
                    console.log ( ">>>>> loadComplete " );
                    searchPrChart ( data );

                    console.log ( ">>>>> gridComplete " );

                    var colModel = $ ( this ).jqGrid ( "getGridParam", "colModel" );

                    for ( i = 0; i < colModel.length; i++ )
                    {
                        $gridList.hideCol ( colModel[i].name );
                    }

                    var aplctnSectnCd = $aplctnSectnCd.val ();
                    var aplctnStleCd = $aplctnStleCd.val ();

                    // $ ( '#gridList2' ).hideCol ( 'dailyPlan' );
                    // $ ( '#gridList2' ).hideCol ( 'dailyAcmslt' );

                    $ ( this ).showCol ( 'formatDate' );
                    if ( lang === locale.korea || lang === locale.korean )
                    {
                        $ ( this ).showCol ( 'pvKorNm' );
                    } else
                    {
                        $ ( this ).showCol ( 'pvEngNm' );
                    }

                    $ ( this ).showCol ( 'planAccumulation' );
                    $ ( this ).showCol ( 'accumulation' );

                    if ( aplctnSectnCd == "all" )
                    {
                        $ ( this ).jqGrid (
                                "showCol",
                                [ "inspectionPlan", "inspectionAcmslt", "repairPlan", "repairAcmslt", "blackoutPlan",
                                        "blackoutAcmslt", "accidentPlan", "accidentAcmslt" ] );

                    } else
                    {
                        if ( aplctnSectnCd == "WCHK01" && aplctnStleCd == "all" )
                        {
                            $ ( this ).jqGrid (
                                    "showCol",
                                    [ "dailyPlan", "dailyAcmslt", "weeklyPlan", "weeklyAcmslt", "monthlyPlan",
                                            "monthlyAcmslt", "quarterPlan", "quarterAcmslt", "halfYearPlan",
                                            "halfYearAcmslt", "yearlyPlan", "yearlyAcmslt", "specialPlan",
                                            "specialAcmslt" ] );
                        } else if ( aplctnSectnCd == "WCHK09" && aplctnStleCd == 'all' )
                        {
                            $ ( this ).jqGrid ( "showCol",
                                    [ "normalPlan", "normalAcmslt", "specialPlan", "specialAcmslt" ] );

                        }
                    }

                    // WCHK12 보수
                    // WCHK13 사고

                    if ( aplctnSectnCd != 'WCHK12' && aplctnSectnCd != 'WCHK13' && aplctnStleCd == 'all' )
                    {
                        addGroupHeader ();
                    } else
                    {
                        // 누계 X , 계획/실적
                        addGroupHeader2 ();
                    }

                    if ( data.total === data.page )
                    {
                        colspanLastRow ( $gridList, 0, 2 );
                    }
                },

                beforeSelectRow : function ( rowid, e )
                {
                    console.log ( '>>>>> beforeSelectRow' );
                    return true;
                },

                // Row 선택시
                onSelectRow : function ( rowId, status )
                {
                    console.log ( '>>>>> onSelectRow' );
                },

                onSelectAll : function ( aRowids, status )
                {
                    console.log ( ">>>>> onSelectAll" );

                },

                // paging 부분의 버튼 액션 처리 first, prev, next, last, records ex) if(action == 'next')
                onPaging : function ( action )
                {
                    console.log ( '>>>>> onPaging' );
                },

                gridComplete : function ( data )
                {
                    console.log ( ">>>>> gridComplete " );
                },

                loadBeforeSend : function ()
                {
                    console.log ( 'loadBeforeSend' );
                },
                viewrecords : false
            /* 화면 하단에 총 데이터 갯수와 현재 페이지의 데이터가 몇번째 데이터인지 화면에 노출 */
            } );

}

// jqgird customize
function customizeJqgrid ()
{
    // jqgrid
    jqGridBasic ();
    addGroupHeader ();
    // var data = dataInitialize ();
    // var data2 = dataInitialize2 ();
    // addDataToJqGrid ( data );
    // addDataToJqGrid2 ( data2 );

    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

// jqgrid 검색
function searchJqgrid ()
{
    $ ( '#btnSubmit' ).on ( 'click', function ( event, initFlag )
    {
        var dateType = $ ( '#sel_dateType' ).val ();

        var className = null;

        if ( dateType === homConstants.dateTypeYYYYMMDD )
        {
            className = staticVariable.formatYYYYMMDD;
        } else if ( dateType === homConstants.dateTypeYYYYMM )
        {
            className = staticVariable.formatYYYYMM;
        } else if ( dateType === homConstants.dateTypeYYYY )
        {
            className = staticVariable.formatYYYY;
        }

        var fromDate = $ ( '#' + className + '_from_date' ).val ();
        var toDate = $ ( '#' + className + '_to_date' ).val ();

        if ( !homUtil.fromToDateValidate ( fromDate, toDate, dateType ) )
        {
            return;
        }

        if ( initFlag )
        {
            customizeJqgrid ();
        } else
        {
            reloadJqgrid ( dateType, fromDate, toDate );
        }
    } );
}

// jqgrid reload
function reloadJqgrid ( dateType, fromDate, toDate )
{
    var $gridList = $ ( '#gridList2' );

    var $aplctnSectnCd = $ ( '#searchAplctnSectnCd' );
    var $aplctnStleCd = $ ( '#searchAplctnStleCd' );

    var pureFromDate = homUtil.convertDateStringToPureFormat ( fromDate );
    var pureToDate = homUtil.convertDateStringToPureFormat ( toDate );

    $gridList.setGridParam ( {
        postData : {
            pvSearchList : pvSearchList,
            dateType : dateType,
            fromDate : pureFromDate,
            toDate : pureToDate,
            aplctnSectnCd : $aplctnSectnCd.val (),
            aplctnStleCd : $aplctnStleCd.val ()
        }
    } ).trigger ( 'reloadGrid' );
}

/*
 * 마지막 row의 붙어있는 셀들(가로)을 병합 처리
 * 
 * mergeStartIndex : 병합 시작 인덱스
 * 
 * length : 병합 갯수
 */
function colspanLastRow ( $codGridList, mergeStartIndex, length )
{

    var ids = $codGridList.jqGrid ( "getDataIDs" );
    var lastRowCl = ids[ids.length - 1];
    var $tds = $ ( '#' + lastRowCl ).find ( 'td' );

    for ( var i = mergeStartIndex + 1, size = mergeStartIndex + length; i < size; i++ )
    {
        $tds.eq ( i ).hide ();
    }

    $tds.eq ( mergeStartIndex ).attr ( "colspan", length );
}

// jqgrid end

function showPopup ()
{
    $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll'
    } );
}

function setEvent ()
{
    // 업무 구분 Select Box Event
    $ ( '#searchAplctnSectnCd' ).change (
            function ()
            {
                var aplctnSectnCd = $ ( this ).val ();
                var selectInitTextFormat = '<option value="all">' + i18nMessage.msg_all + '</option>';

                switch ( aplctnSectnCd )
                {
                    case 'all': // 점검
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger (
                                'change' );
                        break;
                    case 'WCHK01': // 점검
                        selectAplctnStleCd ( aplctnSectnCd );
                        // 업무 형태 콤보 박스 활성화
                        $ ( '#searchAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                        break;
                    case 'WCHK09': // 보수
                        selectAplctnStleCd ( aplctnSectnCd );
                        // 업무 형태 콤보 박스 활성화
                        $ ( '#searchAplctnStleCd' ).prop ( 'disabled', false ).trigger ( 'change' );
                        break;
                    case 'WCHK12': // 정전
                        // 업무 형태 콤보 박스 비활성화
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger (
                                'change' );
                        break;
                    case 'WCHK13': // 사고
                        // 업무 형태 콤보 박스 비활성화
                        $ ( '#searchAplctnStleCd' ).html ( selectInitTextFormat ).prop ( 'disabled', true ).trigger (
                                'change' );
                        break;
                }

                $ ( '#searchAplctnStleCd' ).trigger ( "change" );

            } );

    $ ( '#searchAplctnSectnCd' ).trigger ( "change" );
}

// 업무 형태 코드 조회
function selectAplctnStleCd ( aplctnSectnCd )
{
    var deferred = $.Deferred ();
    var $cmmnCdList = $ ( '#searchAplctnStleCd' );

    $.ajax ( {
        url : contextPath + '/hom/servicemgt/workorder/selectChildCmmnCdList.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
            parntsCdId : aplctnSectnCd
        },
        async : false,
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
                var datas = json.data;

                if ( datas !== null && datas.length > 0 )
                {
                    $cmmnCdList.empty ();

                    $cmmnCdList.append ( '<option value="all">' + i18nMessage.msg_all + '</option>' );

                    _.each ( datas, function ( item )
                    {
                        if ( lang == locale.korea || lang == locale.korean )
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdKorNm + '</option>' );
                        } else
                        {
                            $cmmnCdList.append ( '<option value="' + item.cdId + '">' + item.cdEngNm + '</option>' );
                        }
                    } );
                    $cmmnCdList.trigger ( 'change' );
                    deferred.resolve ();
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

    return deferred.promise ();
}

// 엑셀 다운로드
function downloadExcel ()
{
    console.log ( "downloadExcel" );

    $ ( '#btn_excel' ).on (
            'click',
            function ()
            {
                var optionsStr = JSON.stringify ( $ ( '#graph1' ).highcharts ().userOptions );
                var dataString = encodeURI ( 'async=true&type=png&width=600&options=' + optionsStr );

                var zTree = $.fn.zTree.getZTreeObj ( 'treeList' );
                var checkedNodes = zTree.getCheckedNodes ( true );
                var pvId = '';

                if ( checkedNodes.length === 0 )
                {
                    $.customizeDialog ( {
                        template : templates.dialog,
                        message : i18nMessage.msg_validSelectEquipment,// alert.no.selected.electric.power.station
                        checkText : i18nMessage.msg_ok,
                        cancelText : i18nMessage.msg_cancel,
                        type : staticVariable.dialogTypeInfo
                    } );

                    return;
                } else
                {
                    pvId = checkedNodes[0].id;
                }

                setSearchedParamaeter ();

                console.log ( $ ( "#sel_dateType" ).val () );

                $.ajax ( {
                    type : 'POST',
                    data : dataString,
                    url : staticVariable.exportUrl,
                    success : function ( data )
                    {
                        var $excelUrl = $ ( '<input />', {
                            type : 'hidden',
                            id : 'excelUrl',
                            name : 'url',
                            value : staticVariable.exportUrl + data
                        } );

                        var menuName = '';
                        $ ( '.lnb' ).find ( 'span' ).each ( function ()
                        {
                            menuName += ($ ( this ).text () + '_');
                        } );

                        menuName += $ ( '.lnb' ).find ( 'strong' ).text ();

                        var $menuName = $ ( '<input />', {
                            type : 'hidden',
                            id : 'menuName',
                            name : 'menuName',
                            value : menuName
                        } );

                        // $ ( '#sel_dateType' ).val ( $ ( '#sel_dateType' ).val () );

                        $ ( 'form' ).prepend ( $excelUrl, $menuName ).prop ( 'action',
                                contextPath + '/hom/excel/servicemgt/acmsltStats/acmsltStatsDownload.do' ).submit ();

                        $excelUrl.remove ();
                        $menuName.remove ();
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

// 페이지 로드 완료 시 처리
function initPage ()
{
    $ ( '#btnSubmit' ).trigger ( 'click', true );
}

$ ( function ()
{
    // initHighcharts ();
    initDatetimepicker ();
    customizeForm ();
    customizeScroll ();
    showPopup ();
    // customizeJqgrid ();

    setEvent ();
    // searchJqgrid ();

    $.when ( customizeTree () ).done ( function ()
    {
        // searchJqgrid ();
        downloadExcel ();
        initPage ();
    } );
} );
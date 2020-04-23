var selectedPvGoalInfoList = [];
// init datetimepicker
function initDatetimepicker ()
{
    var $yyyy = $ ( '.yyyy' );
    var $startYYYY = $ ( '#startdatetimepicker' );
    var $endYYYY = $ ( '#enddatetimepicker' );
    var $yyyyFromDate = $ ( '#date01' );
    var $yyyyToDate = $ ( '#date02' );

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

    var localFromTodate = homUtil.getLocalFromToDate ( date, homConstants.dateTypeYYYY, 2, false );
    $yyyyFromDate.val ( localFromTodate.fromDate );
    $yyyyToDate.val ( localFromTodate.toDate );

    $ ( '#search_from_date' ).val ( homUtil.convertDateStringToPureFormat ( localFromTodate.fromDate ) );
    $ ( '#search_to_date' ).val ( homUtil.convertDateStringToPureFormat ( localFromTodate.toDate ) );

    $yyyy.datetimepicker ().on ( 'changeDate', function ( event )
    {
        homUtil.setStartEndDatetimepicker ( $startYYYY, $endYYYY, $yyyyFromDate, $yyyyToDate );
    } );
    $yyyy.trigger ( 'changeDate' );
}

// jqgird customize
function customizeJqgrid ()
{
    var tpl = getTemplate ( templates.noData );

    var fromDate = $ ( '#search_from_date' ).val ();
    var toDate = $ ( '#search_to_date' ).val ();

    $ ( '#gridList' ).jqGrid (
            {
                url : contextPath + '/hom/masterdata/goal/selectGoalValSetuplList.ajax',
                mtype : 'POST',
                postData : {
                    fromDate : fromDate,
                    toDate : toDate
                },
                datatype : 'json',
                height : 642,
                autowidth : true,
                shrinkToFit : false,
                // postData : {
                // parntsEqmtId : parntsEqmtId
                // },
                colNames : [ "PV_ID", i18nMessage.msg_base + " " + i18nMessage.msg_year, i18nMessage.msg_yearDo,
                        i18nMessage.msg_month, i18nMessage.msg_goalPowerGen + "<br>(kWh)",
                        i18nMessage.msg_prfomncRatio + "<br>(%)", i18nMessage.msg_avaty + "<br>(%)",
                        i18nMessage.msg_sales + "<br>(" + crncyUnitNm + ")", i18nMessage.msg_stdrInPlaneRdth + "<br>(W/㎡)",
                        i18nMessage.msg_targetRadiation + "<br>(Wh/㎡/m)", i18nMessage.msg_poProductTime + "<br>(Wh/Wp)",
                        i18nMessage.msg_rdtEfficiency + "<br>(%)", "ESS "+i18nMessage.msg_avaty + "<br>(%)",
                        "ESS "+i18nMessage.msg_effectiveness + "<br>(%)", "SOH<br>(%)", i18nMessage.msg_dischargeRatio +"<br>(%)",
                        "등록자ID", i18nMessage.msg_registrant, "수정자ID",
                        i18nMessage.msg_amender, i18nMessage.msg_accessIp, i18nMessage.msg_edit, "매출단위" ],

                colModel : [ {
                    name : 'pvId',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'stdrYm',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'stdrYear',
                    align : 'center',
                    width : 41,
                    fixed : true
                }, {
                    name : 'stdrMonth',
                    align : 'center',
                    width : 41
                }, {
                    name : 'goalGeneqty',
                    align : 'right',
                    width : 139

                }, {
                    name : 'pr',
                    align : 'right',
                    width : 94
                }, {
                    name : 'avaty',
                    align : 'right',
                    width : 94
                }, {
                    name : 'selng',
                    align : 'right',
                    width : 90
                }, {
                    name : 'stdrRdtn',
                    align : 'right',
                    width : 150
                }, {
                    name : 'goalRdtn',
                    align : 'right',
                    width : 150
                }, {
                    name : 'dvlptime',
                    align : 'right',
                    width : 120
                }, {
                    name : 'efcnyDcrsrt',
                    align : 'right',
                    width : 100
                }, {
                    name : 'essAvaty',
                    align : 'right',
                    width : 90
                }, {
                    name : 'essEfcny',
                    align : 'right',
                    width : 80
                }, {
                    name : 'essSoh',
                    align : 'right',
                    width : 85
                }, {
                    name : 'essEde',
                    align : 'right',
                    width : 110
                }, {
                    name : 'regrId',
                    align : 'right',
                    hidden : true
                }, {
                    name : 'regrName',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'modrId',
                    align : 'center',
                    hidden : true
                }, {
                    name : 'modrName',
                    align : 'center',
                    width : 110
                }, {
                    name : 'conectIp',
                    align : 'left',
                    hidden : true
                }, {
                    name : 'copyColumn',
                    align : 'center',
                    width : 146,
                    sortable : false

                }, {
                    name : 'crncyUnitNm',
                    align : 'center',
                    width : 146,
                    hidden : true

                } ],
                sortname : 'stdrYm',
                sortorder : 'asc',
                multiselect : true,
                multiboxonly : false,
                rownumbers : true, // show row numbers
                // rownumWidth : 25, // the width of the row numbers columns
                rowwidth : 25,
                page : 1,
                rowNum : staticVariable.gridRow99999,
                scroll : true,
                viewrecords : true,
                async : false,

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

                        var $gridList = $ ( '#gridList' );
                        var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
                        var colModel = $ ( "#gridList" ).jqGrid ( 'getGridParam', 'colModel' );

                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            $gridList.jqGrid ( 'setRowData', cl, rowData );
                            // checkbox 처리(설비아이디(eqmtId)를 value값으로 설정)
                            $checkboxs.eq ( i ).attr ( {
                                name : 'stdrYm',
                                value : rowData.stdrYm
                            } ).addClass ( 'stdrYms' );

                            copyColumn = '<a href="javascript:;" class="btn_copy link" id="' + ids[i] + "_copyColumn"
                                    + '" ><i class="icon_copy"></i>Copy</a>';
                            $gridList.jqGrid ( 'setCell', ids[i], "copyColumn", copyColumn );
                        }

                        if ( $ ( '#btn_group_edit' ).hasClass ( 'dnone' ) )
                        {
                            enableJqgridCheckbox ( $gridList, $checkboxs );
                        } else
                        {
                            disableJqgridCheckbox ( $gridList, $checkboxs );
                        }
                    }
                },
                onSelectRow : function ( rowId, status )
                {
                    var $gridList = $ ( '#gridList' );
                    var rowDataObj = $gridList.getRowData ( rowId );
                    if ( status )
                    {
                        var pvGoalInfo = new Object ();
                        pvGoalInfo.stdrYm = rowDataObj.stdrYm;
                        selectedPvGoalInfoList.push ( rowDataObj );
                    } else
                    {
                        var idx = selectedPvGoalInfoList.indexOf ( rowId );
                        selectedPvGoalInfoList.splice ( idx, 1 );
                    }
                },
                onSelectAll : function ( aRowids, status )
                {
                    var $gridList = $ ( '#gridList' );
                    if ( status )
                    {
                        for ( var i = 0; i < aRowids.length; i++ )
                        {
                            var chkInclude = selectedPvGoalInfoList.indexOf ( aRowids[i] );
                            if ( chkInclude < 0 )
                            {
                                var rowDataObj = $gridList.jqGrid ( "getRowData", aRowids[i] ); // 선택한 Row의
                                // rowDataObj

                                var pvGoalInfo = new Object ();
                                pvGoalInfo.stdrYm = rowDataObj.stdrYm;

                                selectedPvGoalInfoList.push ( rowDataObj.tagId );
                            }
                        }

                    } else
                    {
                        for ( var i = 0; i < aRowids.length; i++ )
                        {
                            var chkInclude = selectedPvGoalInfoList.indexOf ( aRowids[i] );
                            if ( chkInclude > -1 )
                            {
                                var rowDataObj = $gridList.jqGrid ( "getRowData", aRowids[i] ); // 선택한 Row의
                                // rowDataObj

                                var idx = selectedPvGoalInfoList.indexOf ( rowDataObj.tagId );
                                selectedPvGoalInfoList.splice ( idx, 1 );
                            }
                        }
                    }
                },
                gridComplete : function ()
                {
                    var $gridList = $ ( '#gridList' );
                    var ids = $gridList.jqGrid ( 'getDataIDs' );
                    var rowDatas = $gridList.jqGrid ( 'getRowData' );
                    var custumVal = 0;
                    for ( var i = 0, size = ids.length; i < size; i++ )
                    {
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].goalGeneqty, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "goalGeneqty", custumVal );

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].pr, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "pr", custumVal );

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].avaty, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "avaty", custumVal );

                        if ( rowDatas[i].selng === '' )
                        {
                            rowDatas[i].selng = '0';
                        }

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].selng, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "selng", custumVal );

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].stdrRdtn, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "stdrRdtn", custumVal );

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].goalRdtn, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "goalRdtn", custumVal );

                        if ( rowDatas[i].dvlptime === '' )
                        {
                            rowDatas[i].dvlptime = '0';
                        }

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].dvlptime, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "dvlptime", custumVal );

                        custumVal = homUtil.mathFloorComma ( rowDatas[i].efcnyDcrsrt, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "efcnyDcrsrt", custumVal );
                        
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].essAvaty, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "essAvaty", custumVal );
                        
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].essEfcny, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "essEfcny", custumVal );
                        
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].essSoh, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "essSoh", custumVal );
                        
                        custumVal = homUtil.mathFloorComma ( rowDatas[i].essEde, 4 );
                        $gridList.jqGrid ( 'setCell', ids[i], "essEde", custumVal );
                    }

                }
            } );
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

// jqgrid 검색
function searchJqgrid ()
{
    var $btnSearch = $ ( '#btn_search' );
    var $gridList = $ ( '#gridList' );

    var $date01 = $ ( '#date01' );
    var $date02 = $ ( '#date02' );

    $btnSearch.on ( 'click', function ()
    {
        if ( !homUtil.fromToDateValidate ( $date01.val (), $date02.val (), homConstants.dateTypeYYYY ) )
        {
            return false;
        }

        var pureFromDate = homUtil.convertDateStringToPureFormat ( $date01.val () );
        var pureToDate = homUtil.convertDateStringToPureFormat ( $date02.val () );

        // set parameters
        setSearchParameter ( pureFromDate, pureToDate );

        reloadJqgrid ( $gridList );
    } );
}

// 검색 조회조건 셋팅
function setSearchParameter ( pureFromDate, pureToDate )
{
    $ ( '#search_from_date' ).val ( pureFromDate );
    $ ( '#search_to_date' ).val ( pureToDate );
}

// jqgrid reload
function reloadJqgrid ( $grid )
{
    $grid.setGridParam ( {
        postData : {
            // parntsEqmtId : searchValue
            fromDate : $ ( '#search_from_date' ).val (),
            toDate : $ ( '#search_to_date' ).val ()
        }
    } ).trigger ( 'reloadGrid' );

    selectedPvGoalInfoList.length = 0;
}

// add input Box
function initializeInputBoxes ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );
    var noEditBox = null;
    var custumVal = 0;
    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        custumVal = homUtil.removeNumberComma ( rowDatas[i].goalGeneqty );
        noEditBox = '<input class="goalGeneqty" id="' + ids[i] + "_goalGeneqty" + '" type="text" value="' + custumVal
                + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "goalGeneqty", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].pr );
        noEditBox = '<input class="pr" size="15" id="' + ids[i] + "_pr" + '" type="text" value="' + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "pr", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].avaty );
        noEditBox = '<input class="avaty" size="15" id="' + ids[i] + "_avaty" + '" type="text" value="' + custumVal
                + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "avaty", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].selng );
        noEditBox = '<input class="selng" id="' + ids[i] + "_selng" + '" type="text" value="' + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "selng", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].stdrRdtn );
        noEditBox = '<input class="stdrRdtn" id="' + ids[i] + "_stdrRdtn" + '" type="text" value="' + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "stdrRdtn", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].goalRdtn );
        noEditBox = '<input class="goalRdtn" id="' + ids[i] + "_goalRdtn" + '" type="text" value="' + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "goalRdtn", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].dvlptime );
        noEditBox = '<input class="dvlptime" id="' + ids[i] + "_dvlptime" + '" type="text" value="' + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "dvlptime", noEditBox );

        custumVal = homUtil.removeNumberComma ( rowDatas[i].efcnyDcrsrt );
        noEditBox = '<input class="efcnyDcrsrt" size="18" id="' + ids[i] + "_efcnyDcrsrt" + '" type="text" value="'
                + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "efcnyDcrsrt", noEditBox );
        
        custumVal = homUtil.removeNumberComma ( rowDatas[i].essAvaty );
        noEditBox = '<input class="essAvaty" size="18" id="' + ids[i] + "_essAvaty" + '" type="text" value="'
                + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "essAvaty", noEditBox );
        
        custumVal = homUtil.removeNumberComma ( rowDatas[i].essEfcny );
        noEditBox = '<input class="essEfcny" size="18" id="' + ids[i] + "_essEfcny" + '" type="text" value="'
                + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "essEfcny", noEditBox );
        
        custumVal = homUtil.removeNumberComma ( rowDatas[i].essSoh );
        noEditBox = '<input class="essSoh" size="18" id="' + ids[i] + "_essSoh" + '" type="text" value="'
                + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "essSoh", noEditBox );
        
        custumVal = homUtil.removeNumberComma ( rowDatas[i].essEde );
        noEditBox = '<input class="dicharqy" size="18" id="' + ids[i] + "_essEde" + '" type="text" value="'
                + custumVal + '"/>';
        $gridList.jqGrid ( 'setCell', ids[i], "essEde", noEditBox );
    }
}

// remove input Box
function removeInputBoxes ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    var rowDatas = $gridList.jqGrid ( 'getRowData' );
    var noEditBox = null;
    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        if ( $ ( "#" + ids[i] + "_goalGeneqty" ).val () != null )
        {
            noEditBox = $ ( "#" + ids[i] + "_goalGeneqty" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "goalGeneqty", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_pr" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "pr", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_avaty" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "avaty", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_selng" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "selng", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_stdrRdtn" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "stdrRdtn", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_goalRdtn" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "goalRdtn", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_dvlptime" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "dvlptime", noEditBox );

            noEditBox = $ ( "#" + ids[i] + "_efcnyDcrsrt" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "efcnyDcrsrt", noEditBox );
            
            
            
            noEditBox = $ ( "#" + ids[i] + "_essAvaty" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "essAvaty", noEditBox );
            
            noEditBox = $ ( "#" + ids[i] + "_essEfcny" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "essEfcny", noEditBox );
            
            noEditBox = $ ( "#" + ids[i] + "_essSoh" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "essSoh", noEditBox );
            
            noEditBox = $ ( "#" + ids[i] + "_essEde" ).val ();
            if ( noEditBox == "" )
            {
                noEditBox = " ";
            } else
            {
                noEditBox = homUtil.mathFloorComma ( noEditBox, 4 );
            }
            $gridList.jqGrid ( 'setCell', ids[i], "essEde", noEditBox );
        }

    }
}

// jqgrid 편집 enable 처리
function enableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'hideCol', [ 'rn', 'modrName', 'conectIp' ] );
    $gridList.jqGrid ( 'showCol', [ 'cb', 'copyColumn' ] );

    // onSelectRow event 해제
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );

    initializeInputBoxes ( $gridList );
    setOnClickBtnCopy ();
}

// jqgrid 편집 disable 처리
function disableJqgridCheckbox ( $gridList, $checkboxs )
{
    $gridList.jqGrid ( 'showCol', [ 'rn', 'modrName', 'conectIp' ] );
    $gridList.jqGrid ( 'hideCol', [ 'cb', 'copyColumn' ] );

    // onSelectRow event 적용
    $gridList.jqGrid ( "setGridParam", {
        beforeSelectRow : function ( rowId, e )
        {
            return false;
        }
    } );

    removeInputBoxes ( $gridList );
    initCopyBtn ( $gridList );
}

// 버튼 그룹 switch
function switchButtonGroup ()
{
    var $btnEdit01 = $ ( '#btn_edit01' );
    var $btnCancel01 = $ ( '#btn_cancel01' );
    var $btnGroupEdit = $ ( '#btn_group_edit' );
    var $btnGroupDelete = $ ( '#btn_group_delete' );

    var $gridList = $ ( '#gridList' );
    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );

    $btnEdit01.click ( function ()
    {
        $btnGroupEdit.addClass ( 'dnone' );
        $btnGroupDelete.removeClass ( 'dnone' );

        enableJqgridCheckbox ( $gridList, $checkboxs );

        selectedPvGoalInfoList.length = 0;

        setSearchedParameter ();

        reloadJqgrid ( $gridList );
    } );

    $btnCancel01.click ( function ()
    {
        $btnGroupEdit.removeClass ( 'dnone' );
        $btnGroupDelete.addClass ( 'dnone' );

        // 그리디 리로드하기 때문에 입력창및 복사컬럼 숨기기 할 필요 없음 추후 리로딩 안하는 경우 주석 제거
        // disableJqgridCheckbox ( $gridList, $checkboxs );
        setSearchedParameter ();

        reloadJqgrid ( $gridList );
    } );
    ;
}

/**
 * Copy 버튼 클릭 이벤트
 */
function setOnClickBtnCopy ()
{
    var $gridList = $ ( '#gridList' );
    $ ( '.btn_copy' ).click (
            function ( e )
            {
                var id = e.target.id.split ( '_' );
                var ids = $gridList.jqGrid ( 'getDataIDs' );
                for ( var i = 0, size = ids.length; i < size; i++ )
                {
                    if ( ids[i] == id[0] )
                    {
                        copyColumn = '<a href="javascript:;" class="btn_cancel link" id="' + ids[i] + "_copyColumn"
                                + '"><i class="icon_cancel"></i>Cancel</a>';
                        $gridList.jqGrid ( 'setCell', ids[i], "copyColumn", copyColumn );
                    } else
                    {
                        copyColumn = '<a href="javascript:;" class="btn_paste link" id="' + ids[i] + "_copyColumn"
                                + '"><i class="icon_paste"></i>Paste</a>';
                        $gridList.jqGrid ( 'setCell', ids[i], "copyColumn", copyColumn );
                    }

                }
                setOnClickBtnPaste ( id[0] );
                setOnClickBtnCancel ();
            } );
}

/**
 * Cancel 버튼 클릭 이벤트
 */
function setOnClickBtnCancel ()
{
    var $gridList = $ ( '#gridList' );
    $ ( '.btn_cancel' ).click ( function ()
    {
        initCopyBtn ( $gridList );
    } );
}

/**
 * Copy 버튼 클릭 이벤트
 */
function setOnClickBtnPaste ( id )
{
    $ ( '.btn_paste' ).click ( function ( e )
    {
        var pasteId = e.target.id.split ( '_' );

        $ ( "#" + pasteId[0] + "_goalGeneqty" ).val ( $ ( "#" + id + "_goalGeneqty" ).val () );
        $ ( "#" + pasteId[0] + "_pr" ).val ( $ ( "#" + id + "_pr" ).val () );
        $ ( "#" + pasteId[0] + "_avaty" ).val ( $ ( "#" + id + "_avaty" ).val () );
        $ ( "#" + pasteId[0] + "_selng" ).val ( $ ( "#" + id + "_selng" ).val () );
        $ ( "#" + pasteId[0] + "_stdrRdtn" ).val ( $ ( "#" + id + "_stdrRdtn" ).val () );
        $ ( "#" + pasteId[0] + "_goalRdtn" ).val ( $ ( "#" + id + "_goalRdtn" ).val () );
        $ ( "#" + pasteId[0] + "_dvlptime" ).val ( $ ( "#" + id + "_dvlptime" ).val () );
        $ ( "#" + pasteId[0] + "_efcnyDcrsrt" ).val ( $ ( "#" + id + "_efcnyDcrsrt" ).val () );
        
        $ ( "#" + pasteId[0] + "_essAvaty" ).val ( $ ( "#" + id + "_essAvaty" ).val () );
        $ ( "#" + pasteId[0] + "_essEfcny" ).val ( $ ( "#" + id + "_essEfcny" ).val () );
        $ ( "#" + pasteId[0] + "_essSoh" ).val ( $ ( "#" + id + "_essSoh" ).val () );
        $ ( "#" + pasteId[0] + "_essEde" ).val ( $ ( "#" + id + "_essEde" ).val () );
    } );
}

function initCopyBtn ( $gridList )
{
    var ids = $gridList.jqGrid ( 'getDataIDs' );
    for ( var i = 0, size = ids.length; i < size; i++ )
    {
        copyColumn = '<a href="javascript:;" class="btn_copy link" id="' + ids[i] + "_copyColumn"
                + '" ><i class="icon_copy"></i>Copy</a>';
        $gridList.jqGrid ( 'setCell', ids[i], "copyColumn", copyColumn );

    }

    setOnClickBtnCopy ();
}

/**
 * 일괄등록 팝업 오픈
 */
function openBathRegPop ()
{
    var $btnPopup = $ ( '.btn_popup' ).magnificPopup ( {
        type : 'ajax',
        alignTop : false,
        overflowY : 'scroll',
        closeOnContentClick : false,
        closeOnBgClick : false,
        callbacks : {
            ajaxContentAdded : function ()
            {
                customizePopupForm ();
                setParameter ( $btnPopup );
            }
        }
    } );

}

// 엑셀 다운로드
function excelDownload ()
{
    var $btnExcel = $ ( '.btn_excel' );
    $btnExcel.on ( 'click', function ()
    {
        setSearchedParameter ();

        var menuName = '';
        $ ( '.lnb' ).find ( 'span' ).each ( function ()
        {
            menuName += ($ ( this ).text () + '_');
        } );

        menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());

        var params = {
            fromDate : $ ( '#search_from_date' ).val (),
            toDate : $ ( '#search_to_date' ).val (),
            sortColumn : "stdrYm",
            sortMethod : "asc",
            menuName : menuName
        };

        location.href = $ ( this ).attr ( 'href' ) + '?' + $.param ( params );

        return false;
    } );
}

/**
 * 저장 버튼 클릭
 */
function onSave ()
{
    var $gridList = $ ( '#gridList' );
    $ ( '#btn_save' ).click ( function ()
    {
        var rowDataObj = $gridList.jqGrid ( 'getRowData' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );
        var pvGoalInfoList = [];
        var chkValidate = 0;
        for ( var i = 0, size = ids.length; i < size; i++ )
        {
            var pvGoalInfo = new Object ();
            pvGoalInfo.stdrYm = rowDataObj[i].stdrYm;
            pvGoalInfo.goalGeneqty = $ ( "#" + ids[i] + "_goalGeneqty" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.goalGeneqty, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_goalGeneqty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.goalGeneqty, 20, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_goalGeneqty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.goalGeneqty ) )
            {
                $ ( "#" + ids[i] + "_goalGeneqty" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.pr = $ ( "#" + ids[i] + "_pr" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.pr, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_pr" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.pr, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_pr" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.pr ) )
            {
                $ ( "#" + ids[i] + "_pr" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.avaty = $ ( "#" + ids[i] + "_avaty" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.avaty, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_avaty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.avaty, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_avaty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.avaty ) )
            {
                $ ( "#" + ids[i] + "_avaty" ).addClass ( 'error' );
                chkValidate++;
            }
            pvGoalInfo.selng = $ ( "#" + ids[i] + "_selng" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.selng, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_selng" ).addClass ( 'error' );
                chkValidate++;
            }

            if ( cf_chkIntFractionLength ( pvGoalInfo.selng, 20, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_selng" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.selng ) )
            {
                $ ( "#" + ids[i] + "_selng" ).addClass ( 'error' );
                chkValidate++;
            }
            pvGoalInfo.stdrRdtn = $ ( "#" + ids[i] + "_stdrRdtn" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.stdrRdtn, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_stdrRdtn" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.stdrRdtn, 20, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_stdrRdtn" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.stdrRdtn ) )
            {
                $ ( "#" + ids[i] + "_stdrRdtn" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.goalRdtn = $ ( "#" + ids[i] + "_goalRdtn" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.goalRdtn, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_goalRdtn" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.goalRdtn, 20, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_goalRdtn" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.goalRdtn ) )
            {
                $ ( "#" + ids[i] + "_goalRdtn" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.dvlptime = $ ( "#" + ids[i] + "_dvlptime" ).val ();

            if ( cf_checkValidation ( pvGoalInfo.dvlptime, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_dvlptime" ).addClass ( 'error' );
                chkValidate++;
            }

            if ( cf_chkIntFractionLength ( pvGoalInfo.dvlptime, 3, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_dvlptime" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.dvlptime ) )
            {
                $ ( "#" + ids[i] + "_dvlptime" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.efcnyDcrsrt = $ ( "#" + ids[i] + "_efcnyDcrsrt" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.efcnyDcrsrt, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_efcnyDcrsrt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.efcnyDcrsrt, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_efcnyDcrsrt" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.efcnyDcrsrt ) )
            {
                $ ( "#" + ids[i] + "_efcnyDcrsrt" ).addClass ( 'error' );
                chkValidate++;
            }
            
            pvGoalInfo.essAvaty = $ ( "#" + ids[i] + "_essAvaty" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.essAvaty, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_essAvaty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.essAvaty, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_essAvaty" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.essAvaty ) )
            {
                $ ( "#" + ids[i] + "_essAvaty" ).addClass ( 'error' );
                chkValidate++;
            }
            
            pvGoalInfo.essEfcny = $ ( "#" + ids[i] + "_essEfcny" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.essEfcny, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_essEfcny" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.essEfcny, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_essEfcny" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.essEfcny ) )
            {
                $ ( "#" + ids[i] + "_essEfcny" ).addClass ( 'error' );
                chkValidate++;
            }
            
            pvGoalInfo.essSoh = $ ( "#" + ids[i] + "_essSoh" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.essSoh, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_essSoh" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.essSoh, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_essSoh" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.essSoh ) )
            {
                $ ( "#" + ids[i] + "_essSoh" ).addClass ( 'error' );
                chkValidate++;
            }
            pvGoalInfo.essEde = $ ( "#" + ids[i] + "_essEde" ).val ();
            if ( cf_checkValidation ( pvGoalInfo.essEde, 9 ) == false )
            {
                $ ( "#" + ids[i] + "_essEde" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( cf_chkIntFractionLength ( pvGoalInfo.essEde, 7, 4 ) == false )
            {
                $ ( "#" + ids[i] + "_essEde" ).addClass ( 'error' );
                chkValidate++;
            }
            if ( !$.isNumeric ( pvGoalInfo.essEde ) )
            {
                $ ( "#" + ids[i] + "_essEde" ).addClass ( 'error' );
                chkValidate++;
            }

            pvGoalInfo.regrId = rowDataObj[i].regrId;
            pvGoalInfoList.push ( pvGoalInfo );

        }
        var fromDate = $ ( '#date01' ).val ();
        var toDate = $ ( '#date02' ).val ();

        if ( chkValidate == 0 )
        {
            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertSaveConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    $.ajax ( {
                        url : contextPath + '/hom/masterdata/goal/savePvGoalInfo.ajax',
                        type : 'POST',
                        dataType : 'json',
                        data : {
                            fromDate : fromDate,
                            toDate : toDate,
                            "jsonData" : JSON.stringify ( pvGoalInfoList )
                        },
                        success : function ( json )
                        {
                            if ( json.status === staticVariable.jsonStatusSuccess )
                            {
                                var $btnCancel01 = $ ( '#btn_cancel01' );
                                $btnCancel01.trigger ( 'click' );
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

            } );
        } else
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_valueInvalidAll,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );

        }
    } );
}

/**
 * 삭제 버튼 클릭 (그리드 값 초기화)
 */
function onDelete ()
{
    var $gridList = $ ( '#gridList' );
    $ ( '#btn_delete' ).click ( function ()
    {
        var deleteArray = [];
        var idArray = [];
        var rowDataObj = $gridList.jqGrid ( 'getRowData' );
        var ids = $gridList.jqGrid ( 'getDataIDs' );

        for ( var i = 0, size = ids.length; i < size; i++ )
        {
            if ( $ ( "#jqg_gridList_" + ids[i] ).is ( ":checked" ) )
            {
                var pvGoalInfo = new Object ();
                pvGoalInfo.stdrYm = rowDataObj[i].stdrYm;
                pvGoalInfo.pvId = rowDataObj[i].pvId;

                idArray.push ( ids[i] );
                deleteArray.push ( pvGoalInfo )
            }
        }

        if ( deleteArray.length === 0 )
        {
            $.customizeDialog ( {
                template : templates.dialog,
                message : i18nMessage.msg_alertNoSelectedDeleteItem,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeInfo
            } );
        } else
        {
            deleteInfo ( idArray );
        }

        return false;
    } );
}

function deleteInfo ( idArray )
{
    var noEditBox = null;
    var $gridList = $ ( '#gridList' );

    for ( var i = 0, size = idArray.length; i < size; i++ )
    {
        noEditBox = '<input class="goalGeneqty" id="' + idArray[i] + "_goalGeneqty" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "goalGeneqty", noEditBox );

        noEditBox = '<input class="pr" id="' + idArray[i] + "_pr" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "pr", noEditBox );

        noEditBox = '<input class="avaty" id="' + idArray[i] + "_avaty" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "avaty", noEditBox );

        noEditBox = '<input class="selng" id="' + idArray[i] + "_selng" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "selng", noEditBox );

        noEditBox = '<input class="stdrRdtn" id="' + idArray[i] + "_stdrRdtn" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "stdrRdtn", noEditBox );

        noEditBox = '<input class="goalRdtn" id="' + idArray[i] + "_goalRdtn" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "goalRdtn", noEditBox );

        noEditBox = '<input class="dvlptime" id="' + idArray[i] + "_dvlptime" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "dvlptime", noEditBox );

        noEditBox = '<input class="efcnyDcrsrt" id="' + idArray[i] + "_efcnyDcrsrt" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "efcnyDcrsrt", noEditBox );
        
        
        noEditBox = '<input class="_essAvaty" id="' + idArray[i] + "__essAvaty" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "_essAvaty", noEditBox );
        
        noEditBox = '<input class="essEfcny" id="' + idArray[i] + "_essEfcny" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "essEfcny", noEditBox );
        
        noEditBox = '<input class="essSoh" id="' + idArray[i] + "_essSoh" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "essSoh", noEditBox );
        
        noEditBox = '<input class="essEde" id="' + idArray[i] + "_essEde" + '" type="text" value="0"/>';
        $gridList.jqGrid ( 'setCell', idArray[i], "essEde", noEditBox );
    }

}
// 발전소 월별 목표 유효성 체크
function goalValSetupValidate ()
{
    var tpl = getTemplate ( templates.labelError );

    var pwdRules = null;
    var pwdCheckRules = null;
    var pwdMessages = null;
    var pwdCheckMessages = null;

    if ( existAcntId )
    {
        pwdRules = {
            passwordValid : true
        };
        pwdCheckRules = {
            equalTo : '#pwd'
        };

        pwdMessages = {
            passwordValid : makeValidateMessage ( i18nMessage.msg_validPasswordPasswd )
        };
        pwdCheckMessages = {
            equalTo : makeValidateMessage ( i18nMessage.msg_validPasswdConfirmDifferent )
        };
    } else
    {
        pwdRules = {
            required : {
                depends : function ()
                {
                    $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                    return true;
                }
            },
            passwordValid : true
        };
        pwdCheckRules = {
            required : {
                depends : function ()
                {
                    $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                    return true;
                }
            },
            equalTo : '#pwd'
        };

        pwdMessages = {
            required : makeValidateMessage ( i18nMessage.msg_validRequiredPasswd ),
            passwordValid : makeValidateMessage ( i18nMessage.msg_validPasswordPasswd )
        };
        pwdCheckMessages = {
            required : makeValidateMessage ( i18nMessage.msg_validRequiredPasswdConfirm ),
            equalTo : makeValidateMessage ( i18nMessage.msg_validPasswdConfirmDifferent )
        };
    }

    $ ( '#userForm' ).validate ( {
        rules : {
            acntKorName : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            acntEngName : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                maxlength : 50
            },
            pwd : pwdRules,
            pwdCheck : pwdCheckRules,
            acntGradCd : {
                selectRequired : true
            },
            nationId : {
                selectRequired : true
            },
            endDt : {
                required : {
                    depends : function ()
                    {
                        $ ( this ).val ( $.trim ( $ ( this ).val () ) );

                        return true;
                    }
                },
                date : true
            },
            cttpc : {
                phoneValid : true
            },
            email : {
                emailValid : true
            },
            authGrpId : {
                selectRequired : true
            }
        },
        messages : {
            acntKorName : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredKoreanName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeKoreanName )
            },
            acntEngName : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredEnglishName ),
                maxlength : makeValidateMessage ( i18nMessage.msg_validMaxsizeEnglishName )
            },
            pwd : pwdMessages,
            pwdCheck : pwdCheckMessages,
            acntGradCd : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredUserGrade )
            },
            nationId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredNation )
            },
            endDt : {
                required : makeValidateMessage ( i18nMessage.msg_validRequiredDateExpiration ),
                date : makeValidateMessage ( i18nMessage.msg_validDateInvalidDateExpiration )
            },
            cttpc : {
                phoneValid : makeValidateMessage ( i18nMessage.msg_validPhone )
            },
            email : {
                emailValid : makeValidateMessage ( i18nMessage.msg_validEmail )
            },
            authGrpId : {
                selectRequired : makeValidateMessage ( i18nMessage.msg_validSelectRequiredAuthorityGroup )
            }
        },
        submitHandler : function ( form )
        {
            // 발전소 - required : true
            if ( $ ( '.pvIds' ).size () === 0 )
            {
                if ( tpl !== null )
                {
                    var template = _.template ( tpl );
                    var html = template ( {
                        id : 'pvIds',
                        message : i18nMessage.msg_validSelectRequiredElectricPowerStation,
                        isLeft : true
                    } );

                    $ ( '.pv_choice_box' ).closest ( 'td' ).append ( html );
                }

                return;
            }

            $.when ( $.customizeDialog ( {
                template : templates.dialog,
                message : !existAcntId ? i18nMessage.msg_alertCreateConfirm : i18nMessage.msg_alertUpdateConfirm,
                checkText : i18nMessage.msg_ok,
                cancelText : i18nMessage.msg_cancel,
                type : staticVariable.dialogTypeConfirm
            } ) ).then ( function ( confirm )
            {
                if ( confirm )
                {
                    form.submit ();
                }
            } );
        }
    } );
}

/*
 * 검색한 조건으로 화면 세팅
 * 
 * 사용자가 조회 후 조건(시작, 종료)을 바꾼 후 조회버튼을 누르지 않고 엑셀 다운로드, 편집 진행 시 원래 조회했던 조건으로 화면을 세팅
 */
function setSearchedParameter ()
{
    var fromDate = homUtil.convertDateStringToFormat ( $ ( '#search_from_date' ).val (), homUtil.dateFormat.formatYYYY );
    var toDate = homUtil.convertDateStringToFormat ( $ ( '#search_to_date' ).val (), homUtil.dateFormat.formatYYYY );

    $ ( '#date01' ).val ( fromDate );
    $ ( '#date02' ).val ( toDate );
}

$ ( function ()
{
    initDatetimepicker ();
    customizeJqgrid ();
    searchJqgrid ();
    switchButtonGroup ();
    excelDownload ();
    openBathRegPop ();
    onSave ();
    onDelete ();
    // $ ( "#addBtn_treeList_6" ).bind ( "click", copy );
    // $("#cut").bind("click", cut);
    // $("#paste").bind("click", paste);
} );
var isEditing = false;

// form element customize
function customizeForm ()
{
 

    // 검색 조건
    var $dateType = $ ( '#searchKey' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select03',
        focusClass : 'custom-form-focused03'
    } );
}

// jqGrid customize
function customizeJqgrid ()
{
    // jqGrid
    jqGridBasic ();

    // scroll
    $ ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();
}

function jqGridBasic ()
{
    var tpl = "<p class='gq_nodata' id=''><i class='icon_nodata'></i></p>";
    //var tpl = getTemplate ( templates.noData );

    var colNames = null;
    var colModel = null;

    colNames = ['NO','한글명', '영문약어', '영문의미','단어유형','동의어','설명'];
	colModel = [ {
		name : 'no',
		width : 100
	}, {
		name : 'korNm',
		width : 200,
		align : 'left'
	}, {
		name : 'engAbrv',
		width : 200,
                align : 'left'
	}, {
		name : 'means',
		width : 400,
		align : 'left'
	}, {
		name : 'type',
		align : 'left',
		width : 200
	}, {
		name : 'synonym',
	        width : 200,
                align : 'left'	
	}, {
		name : 'desc',
		align : 'left',
		width : 300 
	}];

    setSearchCondition ();

    $ ( '#gridList' ).jqGrid (
            {
                //url : "{{ url_for('terms_bp.list') }}",
				url : "list",
                mtype : "POST",
                datatype : "json",
                postData : {
                    searchKey : searchCondition.searchKey,
                    searchKeyword : searchCondition.searchKeyword
                },
                height : 565,
                autowidth : true,
                shrinkToFit : false,
                colNames : colNames,
                colModel : colModel,
                sortname : 'korNm,engAbrv',
                sortorder : 'desc',
                multiselect : false,
                multiboxonly : false,
                rownumbers : true,
                // rowwidth: 25,
                page : 1,
                rowNum : 30, 
                // rowNum : staticVariable.gridRow30,
                scroll : true,
				pager : "#pager_list",
                viewrecords : true,
                loadComplete : function ( data )
                {
					alert(data.total);
                    var $gridList = $ ( '#gridList' );
                    var $checkboxs = $ ( '.ui-jqgrid-btable .cbox' );
                    var $gqNodata = $ ( '.gq_nodata' );

                    // 조회결과 타이틀
                    var resultText = "조회" + " " + "결과" + " " + homUtil.addNumberComma ( data.total ) +  "횟수";
					
                    $ ( "#totalRowCount" ).html ( resultText );
					
                    if ( data.total === 0 )
                    {
                        $gqNodata.show ();
                    } else
                    {
                        $gqNodata.hide ();

                        $ ( this ).find ( 'tbody tr.jqgrow:odd' ).addClass ( 'jqgrow_odd' );

                        var ids = $gridList.jqGrid ( "getDataIDs" );
						alert(ids.length);
                        for ( var i = 0, length = ids.length; i <= length; i++ )
                        {
                            var cl = ids[i];
                            var rowData = $gridList.getRowData ( cl );

                            // 사용/미사용 alias
                            if ( rowData.usgAt !== null && rowData.usgAt === 'Y' )
                            {
                                rowData.usgAt = "사용";
                            } else if ( rowData.usgAt !== null && rowData.usgAt === 'N' )
                            {
                                rowData.usgAt = "미사용";
                            }

                            $gridList.jqGrid ( 'setRowData', cl, rowData );
                        }
                    }
                },
                loadError : function ( xhr, st, err )
                {
                    console.log ( ">>>>> loadError " );
                    console.log ( xhr, st, err );
                },
                gridComplete : function ()
                {
                    console.log ( ">>>>> OK " );
                }
            } );

    if ( tpl !== null )
    {
        var template = _.template ( tpl );
        var html = template ( {
            message : "조회된 데이터가 없습니다." 
        } );

        $ ( '#gridList' ).parent ().append ( html );
    }
	
}



//jqGrid 검색
function searchJqgrid ()
{
     var $btn_search = $ ( '#btn_search' );
     var $gridList = $ ( '#gridList' );
     var $searchValue = $ ( '#searchValue' );

     $btn_search.click ( function ()
     {
         reloadJqgrid ( $gridList );
     } );
    
     $searchValue.keypress ( function ( event )
     {
         if ( event.keyCode === 13 )
         {
             reloadJqgrid ( $gridList );
         }
     } );
}

//jqGrid reload
function reloadJqgrid ( $gridList )
{
    setSearchCondition ();

    $gridList.setGridParam ( {
        postData : {
            searchKey : searchCondition.searchKey,
            searchKeyword : searchCondition.searchKeyword
         }
    } ).trigger ( 'reloadGrid' );
    
}

//jqGrid end

// 엑셀 다운로드
function clickBtnExcel ()
{
    var $btnExcel = $ ( '.btn_excel' );

    $btnExcel.on ( 'click', function ()
    {
        setSearchCondition ();
        
        var menuName = '';
         $ ( '.lnb' ).find ( 'span' ).each ( function ()
         {
         menuName += ($ ( this ).text () + '_');
         } );
         menuName += ($ ( '.lnb' ).find ( 'strong' ).text ());
        
        var params = {
            searchKey : searchCondition.searchKey,
            searchKeyword : encodeURIComponent ( searchCondition.searchKeyword ),
            menuName : encodeURIComponent ( menuName )
        };

        location.href = $ ( this ).attr ( 'href' ) + "?" + $.param ( params );

        return false;

    } );

}


// 검색조건 저장
function setSearchCondition()
{
    var $searchKey = $ ( '#searchKey' );
    var $searchValue = $ ( '#searchValue' );
    
    searchCondition = {
        searchKey : $ ( ":selected", $searchKey ).val (),
        searchKeyword : $searchValue.val ()
    };
}


$ ( function ()
{
    setSearchCondition (); // 검색조건 저장
    
    customizeForm ();
    customizeJqgrid (); // jqGrid에 Data 출력
    clickBtnExcel (); // 엑셀 다운로드
    searchJqgrid (); // 검색
    
} );

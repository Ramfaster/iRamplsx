// 조회 조건에 해당하는 타이틀 세팅
function setPeriodPopupTitle ()
{
    var dateType = $ ( '#dateType' ).val ();
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

    $ ( '#search_period_popup' ).text ( homUtil.wrapWord ( fromDate + ' ~ ' + toDate, '(', ')' ) );
}

//jqgrid start
//헤더 병합
function addGroupHeaderPopup() {
  var groupHeaderName = 'User';

  $("#gridListPop").jqGrid('setGroupHeaders', {
      useColSpanStyle: true,
      groupHeaders:[
			{startColumnName: 'totalCnt', numberOfColumns: 2, titleText: i18nMessage.msg_totalSummary},
			{startColumnName: 'faultCnt', numberOfColumns: 2, titleText: i18nMessage.msg_mntrFault},
			{startColumnName: 'warningCnt', numberOfColumns: 2, titleText: i18nMessage.msg_mntrEqmtWarning}
      ]
  });
}


function jqGridBasicPopup() {
	var $gridListPop = $ ( '#gridListPop' );
	var tpl = getTemplate ( templates.noData );
 

  var noDataId = 'rdtn_pv_jqgrid_nodata';
 
  var dateType = $ ( '#dateType' ).val ();
  var fromDate = $ ( '#fromDate' ).val ();
  var toDate = $ ( '#toDate' ).val ();
  var selectedPvIds = $ ( '#selectedPvIds' ).val ();
  console.log(selectedPvIds);
  $gridListPop.jqGrid ( {
      url : contextPath + '/hom/advancedanalysis/ess/alarm/selectAdvanAlsAlarmGridList.ajax',
      mtype : 'POST',
      datatype : 'json',
      height : 630,
      autowidth : true,
      shrinkToFit : false,
      postData : {
          dateType : dateType,
          fromDate : fromDate,
          toDate : toDate,
          selectedPvIds : selectedPvIds
      },
      colNames : [ "설비그룹", i18nMessage.msg_eqmtSection, i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)',
                   i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)',
                   i18nMessage.msg_num, i18nMessage.msg_ratio+ '(%)'],
      colModel : [
               {
                    name : 'eqmtGrpCd',
                    align : 'center',
                    width : '82',
                    fixed : true,
                    hidden : true,
                    sortable : true
              },
              {
                  name : 'eqmtGrpCdNm',
                  align : 'center',
                  width : '199',
                  fixed : true,
                  sortable : false
              },
              {
                  name : 'totalCnt',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 0 );
                  }
              },
              {
                  name : 'totalPct',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1 );
                  }
              },
              {
                  name : 'faultCnt',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 0 );
                  }
              },
              {
                  name : 'faultPct',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1 );
                  }
              },
              {
                  name : 'warningCnt',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 0 );
                  }
              },
              {
                  name : 'warningPct',
                  align : 'right',
                  width : '160',
                  fixed : true,
                  sortable : true,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1);
                  }
              }],
              sortname : 'totalCnt',
              sortorder : 'desc',
              rownumbers : false,
              rowwidth : 25,
              multiselect : false,
              multiboxonly : false,
              page : 1,
              rowNum : staticVariable.gridRow99999,
              scroll : true,
              viewrecords : true,
      loadComplete : function ( data )
      {
          var $gqNodata = $ ( '#' + noDataId );

          // 조회결과
          var resultText = i18nMessage.msg_retrieve + ' ' + i18nMessage.msg_result + ' '
                  + homUtil.addNumberComma ( data.records ) + i18nMessage.msg_count;
          $ ( '#totalPopupRowCount' ).text ( resultText );

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

  if ( tpl !== null )
  {
      var template = _.template ( tpl );
      var html = template ( {
          id : noDataId,
          message : i18nMessage.msg_sentenceGridNoData
      } );

      $gridListPop.parent ().append ( html );
  }

  $gridListPop.closest ( '.popup_cont' ).find ( 'div.ui-jqgrid-bdiv' ).perfectScrollbar ();    
}
//jqgird customize
function customizeJqgridPopup ()
{
	
	$("#current").val(0);
	$("#rowCount").val(10);
	jqGridBasicPopup();

	addGroupHeaderPopup();
}

$ ( function ()
{
    setPeriodPopupTitle ();
    customizeJqgridPopup ();
} );
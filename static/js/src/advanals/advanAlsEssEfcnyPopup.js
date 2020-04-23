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
			{startColumnName: 'goalEfcny', numberOfColumns: 2, titleText: i18nMessage.msg_chargeDischargeEfficy+'(%)'},
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
      url : contextPath + '/hom/advancedanalysis/ess/efcny/selectAdvanAlsEssEfcnyRankGridList.ajax',
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
      colNames : [ i18nMessage.msg_rank, i18nMessage.msg_siteName, i18nMessage.msg_area,
              i18nMessage.msg_goal, i18nMessage.msg_acmslt,
              i18nMessage.msg_chargeRatio + '(kWh)', i18nMessage.msg_dischargeRatio + '(kWh)'],
      colModel : [
              {
                  name : 'rank',
                  align : 'center',
                  width : '82',
                  fixed : true,
                  sortable : true
              },
              {
                  name : 'pvNm',
                  align : 'left',
                  width : '199',
                  fixed : true,
                  sortable : false
              },
              {
                  name : 'areaNm',
                  align : 'center',
                  width : '98',
                  fixed : true,
                  sortable : false
              },
              {
                  name : 'goalEfcny',
                  align : 'right',
                  width : '210',
                  fixed : true,
                  sortable : false,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1 );
                  }
              },
              {
                  name : 'acmsltEfcny',
                  align : 'right',
                  width : '210',
                  fixed : true,
                  sortable : false,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1 );
                  }
              },
              {
                  name : 'charqy',
                  align : 'right',
                  width : '210',
                  fixed : true,
                  sortable : false,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1);
                  }
              },
              {
                  name : 'dicharqy',
                  align : 'right',
                  width : '210',
                  fixed : true,
                  sortable : false,
                  formatter : function ( cellvalue, options, rowObject )
                  {
                      return numberRoundComma ( cellvalue, 1 );
                  }
              }],
              sortname : 'rank',
              sortorder : 'asc',
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
var dataArray = [
  {
        "NO": "1",
        "한글명": "모니터링",
        "영문약어": "MNTR",
        "영문의미": "MONITORING",
        "단어유형": "표준단어",
        "설명": "방송국이나 신문사의 의뢰를 받아 프로그램이나 기사에 대한 의견을 제출하는 사람.  생산 업체의 의뢰를 받아 상품을 써 보고 그 결과를 보고하는 사람.",
        "동의어": ""
  },
  {
        "NO": "2",
        "한글명": "발전량",
        "영문약어": "GENEQTY",
        "영문의미": "generation quantity",
        "단어유형": "표준용어",
        "설명": "발전한 전기의 전체 ",
        "동의어": "전력량,출력량"
  }
];

function makeTable(id, array){
		 $("#"+id).jqGrid({
			url : "/terms_list/",
			datatype: "json",
			height: 570,
			autowidth:true,
			shrinkToFit: true,
			rowNum: 10,
			sortable:true,
			sortname:'order_doc',
			rowList: [10, 20, 30],
	//        scroll:true,
			colNames:['NO','한글명', '영문약어', '영문의미','단어유형','동의어','설명'],
			colModel:[
					{name:'no', index:'no', editable: false,width:30, sorttype:"int",search:true},
					{name:'korea', index:'korea', editable: true,width:50, editrules:{required:true},search:true},
					{name:'english', index:'english', editable: true, width:80,search:true,editrules:{required:true}},
					{name:'means',index:'means', editable: false, width:100},
					{name:'type',index:'type', editable: false, width:40},
					{name:'synonym',index:'type', editable: false, width:80},
					{name:'desc',index:'type', editable: false, width:100}                
				],
				caption: "용어정의",
				pager: "#pager",
				viewrecords: true,
				pgbuttons:true,
				loadonce: true,
				add: true,
				edit: true,
				addtext: 'Add',
				edittext: 'Edit',
				hidegrid: false,
				multiselect:true,
				editurl:"#"
		  });
	  
		  // Setup buttons
			$("#"+id).jqGrid('navGrid', '#pager',
					{edit: false, add: false, del: false, search: false},
					{height: 150, reloadAfterSubmit: true}
			);
		
            // Add responsive to jqGrid
            $(window).bind('resize', function () {
                var width = $('.jqGrid_wrapper').width();
 
                $("#"+id).setGridWidth(width);
            });	

            $("#btn_search").click(function(){
                jQuery("#table_list_2").jqGrid('searchGrid',
                        {sopt:['cn','bw','eq','ne','lt','gt','ew']}
                );
            });
          

      //for(var I in array){
         //  $("#"+id).jqGrid('addRowData',i+1,array[i]);
      //}
}

makeTable('gridList', dataArray);




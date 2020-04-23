// form element customize
function customizeForm ()
{
    var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,							
		height	: 13
	});

	var $selType1 = $ ( '#sel_type0' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );

    var $selType2 = $ ( '#sel_type, #sel2_type, #sel3_type, #sel4_type, #sel5_type, #sel6_type, #sel7_type, #sel8_type, #sel9_type' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select06',
		focusClass : 'custom-form-focused06',
		disableClass : 'custom-form-disabled06'
    } );
    
	var $selType3 = $ ( '#sel_type_file, #sel_type_file1, #sel_type_file2, #sel_type_file3, #sel_type_file4' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
		initClass : 'custom-form-select07'
    } );

	 $('#file1, #file7').customizeFile({
            buttonType: 'bg_sprite',
            buttonText: '찾기',
            buttonSpriteClass: 'btn_type05',
            buttonTextColor: '#4c4743',
            buttonWidth: 50,
            textWidth: 280,
            height: 25
    });

    $('#file2, #file3, #file4, #file5, #file6').customizeFile({
            buttonType: 'bg_sprite',
            buttonText: '찾기',
            buttonSpriteClass: 'btn_type05',
            buttonTextColor: '#4c4743',
            buttonWidth: 50,
            textWidth: 230,
            height: 25
    });

	//통화단위 선택
	var $select1 = $('.select1');
    $select1.select2();
    
    var flag = true;
    
    //select event
    $select1.on('select2:open', function(e){
        if(flag) {
            $ ( '.select2-results' ).mCustomScrollbar ( {
                scrollButtons : {
                    enable : true
                },
                theme : 'inset-2',
                scrollbarPosition : 'inside',
                scrollInertia : 300
            } );
            
            flag = false;
        }
    });	
}

// init datetimepicker
function initDatetimepicker ()
{
    // 기간유형 datetimepicker 설정
    $ ( '.yyyy' ).datetimepicker ( {
        format : 'yyyy',
        startView : 4,
        minView : 4,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymm' ).datetimepicker ( {
        format : 'yyyy-mm',
        startView : 3,
        minView : 3,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

    $ ( '.yyyymmdd' ).datetimepicker ( {
        format : 'yyyy-mm-dd',
        startView : 2,
        minView : 2,
        language : 'ko',
        pickerPosition : "bottom-right",
        autoclose : true,
        todayHighlight : true,
        todayBtn : true
    } );

	$('.yyyymmddhh').datetimepicker({
		format: 'yyyy-mm-dd hh:00',
		startView: 2,
		minView: 1,
		language: 'ko',
		pickerPosition: "bottom-right",
		autoclose: true,
		todayHighlight: true,
		todayBtn: true
	} );

	$('.yyyymmddhhmi').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		startView: 2,
		minView: 0,
		language: 'ko',
		pickerPosition: "bottom-right",
		autoclose: true,
		minuteStep: 2,
		todayHighlight: true,
		todayBtn: true
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
		axis: 'yx',
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
}

// treemenu customize
function customizeTree ()
{
    //트리메뉴
	var setting = {
        view: {
            showIcon: false
        },
        check: {
            enable: true,
			chkStyle: 'checkbox',
            radioType: 'all'
        },
        data: {
            simpleData: {
                enable: true
            }
        }
    };

    var zNodes =[
        { id:1, pId:0, name:'수배전반', open:true},
        { id:11, pId:1, name:'VCB #1', open:false},
        { id:111, pId:11, name:'VCB01'},
        { id:112, pId:11, name:'VCB02'},
        { id:12, pId:1, name:'VCB #2', open:false},
        { id:121, pId:12, name:'VCB01'},
        { id:122, pId:12, name:'VCB02'},		
		{ id:2, pId:0, name:'인버터', open:true},		
		{ id:21, pId:2, name:'IVT #1', open:true},
        { id:211, pId:21, name:'접속반 #1', open:true},
        { id:212, pId:211, name:'모듈 #1'},
		{ id:213, pId:211, name:'모듈 #2'},
		{ id:214, pId:211, name:'모듈 #3'},
		{ id:215, pId:211, name:'모듈 #4'},
		{ id:216, pId:211, name:'모듈 #5'},
		{ id:217, pId:211, name:'모듈 #6'},
		{ id:218, pId:211, name:'모듈 #6_1'},
		{ id:22, pId:2, name:'IVT #2', open:true},
		{ id:221, pId:22, name:'접속반 #1'},
		{ id:222, pId:22, name:'접속반 #2'},
		{ id:223, pId:22, name:'접속반 #3'},
		{ id:224, pId:22, name:'접속반 #4'},
		{ id:225, pId:22, name:'접속반 #5'},
		{ id:226, pId:22, name:'접속반 #6'},
		{ id:227, pId:22, name:'접속반 #7'},  
		{ id:23, pId:2, name:'IVT #3', open:true},
        { id:231, pId:23, name:'접속반 #1', open:true},
		{ id:232, pId:23, name:'접속반 #2'},
		{ id:233, pId:23, name:'접속반 #3'},
		{ id:234, pId:23, name:'접속반 #4'},
		{ id:235, pId:23, name:'접속반 #5'},
		{ id:236, pId:23, name:'접속반 #6'},
		{ id:237, pId:23, name:'접속반 #7'},
		{ id:238, pId:23, name:'접속반 #8'},
		{ id:239, pId:23, name:'접속반 #9'},
		{ id:240, pId:23, name:'접속반 #10'},
		{ id:241, pId:23, name:'접속반 #11'},
		{ id:242, pId:23, name:'접속반 #12'},
		{ id:243, pId:23, name:'접속반 #13'},
		{ id:244, pId:23, name:'접속반 #14접속반 #14접속반 #14접속반 #14접속반 #14'},
		{ id:3, pId:0, name:'UPS'}
    ];
    
    $.fn.zTree.init($('#treeList'), setting, zNodes);
}

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}


$ ( function ()
{
    customizeForm ();  
	initDatetimepicker ();
    customizeTree ();
	customizeScroll ();
    showPopup();
} );
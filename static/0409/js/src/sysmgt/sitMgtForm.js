// form element customize
function customizeForm ()
{
    var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,
		height	: 13
	});

	var $selType = $ ( '#sel_type, #sel_type1, #sel_type2, #sel_type3, #sel_type4, #sel_type5, #sel_type6, #sel_type8, #sel_type9, #sel_type10, #sel_type11, #sel_type12,.sel_type_f' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );

	var $selType1 = $ ( '#sel_type_file, #sel_type_file1, #sel_type_file2, #sel_type_file3, #sel_type_file4' ).customizeSelect ( {
        width : 80,
        paddingHorizontal : 15,
        height : 25,
        color : '#3c3c3c',
		initClass : 'custom-form-select07'
    } );

   $('#file1, #file2, #file3, #file4, #file5, #file6').customizeFile({
            buttonType: 'bg_sprite',
            buttonText: '찾기',
            buttonSpriteClass: 'btn_type05',
            buttonTextColor: '#4c4743',
            buttonWidth: 50,
            textWidth: 280,
            height: 25
    });

   var $imageTypeChk = $('.image_type_chk').customizeCheckbox({
        backgroundImage: '../../css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_checkbox@2x.png',
        width: 13,
        height  : 13
    });

	//담당자 선택
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
    $ ( '.form_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}

function showPopup() {
    $('.btn_popup').magnificPopup({
        type: 'ajax',
        alignTop: false,
        overflowY: 'scroll'
    });
}

function colorPicker() {
	$('#cpBoth').colorpicker();
}

$ ( function ()
{
    customizeForm ();
	initDatetimepicker ();
	customizeScroll ();
	showPopup();
	colorPicker();
} );
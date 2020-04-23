//작업선택
function selWorkOrder(){
	$('#sel_work_order').change(function(){
        $('.sel_work_order_box').hide();
        $('#' + $(this).val()).show();
    });
}

function customizeForm ()
{
    var $imageType = $('.image_type').customizeRadio({
	    backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
		width: 13,							
		height	: 13
	});

	var $dateType = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select01',
		focusClass : 'custom-form-focused01',
		disableClass : 'custom-form-disabled01'
    } );	

    var $dateType1 = $ ( '.customize_select_m' ).customizeSelect ( {
        width : 150,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select05',
		focusClass : 'custom-form-focused05',
		disableClass : 'custom-form-disabled05'
    } );

	var $searchType2 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
		initClass : 'custom-form-select06',
		focusClass : 'custom-form-focused06',
		disableClass : 'custom-form-disabled06'
    } );

    var $selType3 = $ ( '.sel_type_file' ).customizeSelect ( {
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
}

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

    // 조회기간
    var $date = $ ( '.calendar_wrap .date' );
    var $dateType = $ ( '#date_type' );
    $dateType.change ( function ( event )
    {
        var selectedType = $ ( ":selected", this ).val ();

        if ( selectedType === 'day' )
        {
            className = 'yyyymmdd';
        } else if ( selectedType === 'month' )
        {
            className = 'yyyymm';
        } else if ( selectedType === 'year' )
        {
            className = 'yyyy';
        }

        $date.addClass ( 'dnone' );

        var currentObject = $ ( '.' + className );
        currentObject.removeClass ( 'dnone' ).find ( '.from_date' ).val ( '' );
        currentObject.find ( '.to_date' ).val ( '' );
    } );
}

// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.frm_con02' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'outside',
        scrollInertia : 300
    } );
}


$ ( function ()
{
    customizeForm ();
	customizeScroll ();
	initDatetimepicker();
	selWorkOrder();
} );
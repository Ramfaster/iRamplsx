// 라디오버튼 액션
function radioAction(){    
    $('p.sel_rt_date input').on('click',function(){
        $('.rd_sel_wrap > li').hide();
        var radioIdx = $(this).attr('id');
        $('.rd_sel_wrap > li.sel_' + radioIdx).show();
    });

    $('.radio_box > input').on('click',function(){
        $('.radio_box').removeClass('on');
        $(this).parent('.radio_box').addClass('on');
    });
}

// form element customize
function customizeForm ()
{
    var $dateType1 = $ ( '.customize_select_s' ).customizeSelect ( {
        width : 110,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select06',
        focusClass : 'custom-form-focused06',
        disableClass : 'custom-form-disabled06'
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

    var $dateType2 = $ ( '.customize_select_l' ).customizeSelect ( {
        width : 262,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select08',
        focusClass : 'custom-form-focused08',
        disableClass : 'custom-form-disabled08'
    } );

    var $dateType3 = $ ( '.customize_select_ss' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c',
        initClass : 'custom-form-select01',
        focusClass : 'custom-form-focused01',
        disableClass : 'custom-form-disabled01'
    } );

    var $imageType = $('.image_type').customizeRadio({
        backgroundImage: '../../css/lib/customizeForm/img/img_radio.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_radio@2x.png',
        width: 13,                          
        height  : 13
    });

    var $imageType = $('.image_type2').customizeCheckbox({
        backgroundImage: '../../css/lib/customizeForm/img/img_checkbox.png',
        backgroundImage2x: '../../css/lib/customizeForm/img/img_checkbox@2x.png',
        width: 13,                          
        height  : 13
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


$ ( function ()
{    
    customizeForm ();  
    initDatetimepicker (); 
    radioAction();
} );
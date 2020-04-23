// more btn action
function moreAction(){

    var moreBox = $('.more_detail_box');    
    var btnMore = $('.btn_more');

    btnMore.on('click', function(e){            
        var target = $(e.currentTarget);    

        moreBox.toggleClass('on');

        if(moreBox.hasClass('on')){

            function moreBoxFix(){
                var moreBoxHeight = moreBox.outerHeight();
                alert(moreBoxHeight);
                var moreBoxPos = moreBoxHeight / 2;
                moreBox.css('margin-top','-'+ moreBoxPos + 'px');
            }

            moreBox.show();
            
        } else {
            moreBox.hide();
        }

        e.preventDefault();
    });    

        

    // $('.btn_more').click(function(){
    //     moreBox.toggle();
    //     
    // })

    $('.more_detail_box .btn_close').click(function(){
        moreBox.removeClass('on');
        moreBox.hide();
    })
}



// form element customize
function customizeForm ()
{
    // 미조치알람 필터
    var defaultOption = {
        type : 'text',
        backgroundColor : 'f5f5f5',
        selectedBackgroundColor : '#fff',
        borderColor : '#e8e8e8',
        color : '#8f8f92',
        width : 58,
        height : 23,
        borderRadius : 3,
        labelMarginRight : 0,
    };

    var checkOption1 = $.extend ( {}, defaultOption, {
        selectedColor : '#7d7d7d',
        selectedBorderColor : '#7d7d7d'
    } );
    var checkOption2 = $.extend ( {}, defaultOption, {
        selectedColor : '#7d7d7d',
        selectedBorderColor : '#7d7d7d'        	
    } );
    var checkOption3 = $.extend ( {}, defaultOption, {
        selectedColor : '#f47321',
        selectedBorderColor : '#f47321'
    } );
    var checkOption4 = $.extend ( {}, defaultOption, {
        selectedColor : '#c03014',
        selectedBorderColor : '#c03014'
    } );

    $ ( '#disconnect' ).customizeCheckbox ( checkOption1 );
    $ ( '#error' ).customizeCheckbox ( checkOption2 );
    $ ( '#warning' ).customizeCheckbox ( checkOption3 );
    $ ( '#fault' ).customizeCheckbox ( checkOption4 );

    // 조회기간
    var $dateType = $ ( '#date_type' ).customizeSelect ( {
        width : 60,
        paddingHorizontal : 15,
        height : 30,
        color : '#3c3c3c'
    } );
}


// scroll customize
function customizeScroll ()
{
    // custom scroll
    $ ( '.al_list_wrap' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );

    $ ( '.scr_smr' ).mCustomScrollbar ( {
        scrollButtons : {
            enable : true
        },
        theme : 'inset-2',
        scrollbarPosition : 'inside',
        scrollInertia : 300
    } );
}

// @see /HOM-WebService/src/main/webapp/js/src/opertn/eqmtOpertnSttus.js
//상태조회
function getStatus ()
{

    var params = {
        eqmtId : $ ( '#eqmtId' ).val (),
        parntsEqmtId : $ ( '#parntsEqmtId' ).val ()
    };

    $
            .ajax ( {
                url : contextPath + '/hom/operation/equipment/selectStatusList.ajax',
                type : 'POST',
                dataType : 'json',
                data : params,
                success : function ( json )
                {

                    if ( json.status === staticVariable.jsonStatusSuccess )
                    {

                        var data = json.data;

                        if ( data != null && data.length > 0 )
                        {
                            // 전체 데이터 수.
                            var dataLength = data.length;

                            // TR 수.
                            var trLength = parseInt ( dataLength / 3, 10 );

                            // 나머지가 있을 경우 TR 개수 1 증가.
                            if ( dataLength % 3 > 0 )
                            {
                                trLength = trLength + 1;
                            }

                            var appendHtml = "";

                            for ( index = 1; index <= trLength * 3; index++ )
                            {

                                if ( index % 3 == 1 )
                                {
                                    appendHtml = appendHtml + "<tr>"
                                }

                                if ( index <= dataLength )
                                {
                                    var item = json.data[index - 1];

                                    var tagNm = "";
                                    if ( lang === locale.korea || lang === locale.korean )
                                    {
                                        tagNm = item.tagKorNm;
                                    } else
                                    {
                                        tagNm = item.tagEngNm;
                                    }

                                    appendHtml = appendHtml + "<td><i class= " + item.tagColor + "></i>" + tagNm
                                            + "  </td>"
                                } else
                                {
                                    appendHtml = appendHtml + "<td></td>";
                                }

                                if ( index % 3 == 0 )
                                {
                                    appendHtml = appendHtml + "</tr>"
                                }

                            }

                            $ ( '#t_Status' ).empty ();
                            $ ( '#t_Status' ).append ( appendHtml );

                        } else
                        {
                            $ ( '#t_Status' ).empty ();
                            $ ( '#t_Status' ).append (
                                    "<tr><td colspan='3' align='center'>" + i18nMessage.msg_sentenceGridNoData
                                            + "</td></tr>" );
                        }

                    } else
                    {
                        $.customizeDialog ( {
                            template : templates.dialog,
                            message : json.message,
                            checkText : i18nMessage.msg_ok,
                            cancelText : i18nMessage.msg_cancel,
                            type : staticVariable.dialogTypeInfo
                        } );
                    }

                },// success
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


//Show popup
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
    customizeScroll ();
	showPopup();
    moreAction();
    getStatus();
} );
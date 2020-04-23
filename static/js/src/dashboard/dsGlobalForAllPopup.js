function customizeScroll ()
{
	$('.intbl_scrl').perfectScrollbar();
}
function initCheckBox ()
{
	$('#cntSelAll').click(function(){
		var bizType ="";
		if($('#cntSelAll').is(":checked")){
			$("input[name=ctChk]").each(function() {

				$(this).prop('checked', true);
			});
			initData("ALL");
		}else{
			$("input[name=ctChk]:checked").each(function() {

				$(this).prop('checked', false);					
			});
			
			$ ( '#popupTable tr' ).remove();
		}
	});
	
	$('input[name=ctChk]').click(function(){
	
		var cntIds ="";
		var chkSel = 0;
		$("input[name=ctChk]:checked").each(function() {

			if(cntIds == ""){
				cntIds = $(this).val();
			}else{
				cntIds = cntIds+","+$(this).val();
			}	
			chkSel++;
		});
		if(chkSel == 5){
			$('#cntSelAll').prop('checked', true);	
		}else{
			$('#cntSelAll').prop('checked', false);	
		}
			
		initData(cntIds);
	});	
	
}
function initData(cntIds)
{
	var tpl = getTemplate ( templates.dsGrobalPopupTr );
	
	//기존 정보 삭제
	$ ( '#popupTable tr' ).remove();
	
	console.log($ ( '#nationId' ).val());
	console.log($ ( '#cntintCd' ).val());
	
	$.ajax ( {
        url : contextPath + '/hom/dashboard/dermsGlbal/all/selectTotalPvDtInfo.ajax',
        type : 'POST',
        dataType : 'json',
        data : {
        	cntIds : cntIds
        },       
        success : function ( json )
        {
            if ( json.status === staticVariable.jsonStatusSuccess )
            {
            	var siteRepInfoList = json.data;
            	var template;
            	template = _.template ( tpl );   		
        		var html = template ( {
        			dsGroupPopupMap : json.data
                 } ); 
            	console.log(json.data);
            	$ ( '#popupTable' ).append ( html );
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
    });
}

$ ( function ()
{
	customizeScroll ();
	initCheckBox ();
	initData("ALL");
} );
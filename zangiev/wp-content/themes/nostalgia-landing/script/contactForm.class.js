/******************************************************************************/
/******************************************************************************/

function NLThemeContactForm(id)
{
	this.id=id;
};
	
/******************************************************************************/
	
NLThemeContactForm.prototype.init=function()
{
	var self=this;
	jQuery('#contact_form_'+this.id).submit(function()
	{
		self.submit();
		return(false);
	});
};
	
/******************************************************************************/
	
NLThemeContactForm.prototype.submit=function()
{
	this.blockForm('block');
	var data=jQuery('#contact_form_'+this.id).serialize()+'&id='+this.id;
	jQuery.ajax(themeOption.config.ajax_url,{data:data,type:'POST',success:this.submitResponse,dataType:'json',contextObject:this});
};

/******************************************************************************/

NLThemeContactForm.prototype.submitResponse=function(response)
{
	this.contextObject.blockForm('unblock');

	jQuery('#contact_form_'+this.contextObject.id).find(':input').qtip('destroy');

	var tPosition=
	{
		'contact_form_name'		: {'my':'bottom center','at':'top center'},
		'contact_form_mail'		: {'my':'bottom center','at':'top center'},
		'contact_form_submit'	: {'my':'right center','at':'left center'},
		'contact_form_message'	: {'my':'top center','at':'bottom center'}
	};

	if(typeof(response.info)!=='undefined')
	{	
		if(response.info.length)
		{	
			for(var key in response.info)
			{
				var id=response.info[key].fieldId;
				var nId=id.replace('_'+this.contextObject.id,'');

				jQuery('#'+response.info[key].fieldId).parents('li:first').qtip(
				{
						style:      { classes:(parseInt(response.error)===1 ? 'qtip-error' : 'qtip-success')},
						content: 	{ text:response.info[key].message },
						position: 	{ my:tPosition[nId]['my'],at:tPosition[nId]['at'] }
				}).qtip('show');				
			}
		}
	}
	
	if(parseInt(response.error)===0) 
	{
		if(parseInt(response.reset)===1)
		{
			var cId=this.contextObject.id;
			
			jQuery('#contact_form_'+this.contextObject.id).find('input[type="text"],textarea').val('').blur();
			window.setTimeout(function() { jQuery('#contact_form_submit_'+cId).parents('.block:first').qtip('destroy'); },2000);
		}
	}
};

/******************************************************************************/

NLThemeContactForm.prototype.blockForm=function(action)
{
	if(action==='block') jQuery('#contact_form_'+this.id).find('.block').block({message:false,overlayCSS:{opacity:'0.3'}});
	else jQuery('#contact_form_'+this.id).find('.block').unblock();	
};

/******************************************************************************/
/******************************************************************************/
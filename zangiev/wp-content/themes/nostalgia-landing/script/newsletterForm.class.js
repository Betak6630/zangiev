/******************************************************************************/
/******************************************************************************/

function NLThemeNewsletterForm(id)
{
	this.id=id;
};
	
/******************************************************************************/
	
NLThemeNewsletterForm.prototype.init=function()
{
	var self=this;
	jQuery('#newsletter_form_'+this.id).submit(function()
	{
		self.submit();
		return(false);
	});
};
	
/******************************************************************************/
	
NLThemeNewsletterForm.prototype.submit=function()
{
	this.blockForm('block');
	var data=jQuery('#newsletter_form_'+this.id).serialize()+'&id='+this.id;
	jQuery.ajax(themeOption.config.ajax_url,{data:data,type:'POST',success:this.submitResponse,dataType:'json',contextObject:this});		
};
	
/******************************************************************************/
	
NLThemeNewsletterForm.prototype.submitResponse=function(response)
{
	this.contextObject.blockForm('unblock');

	jQuery('#newsletter_form_'+this.contextObject.id).find(':input').qtip('destroy');

	var tPosition=
	{
		'newsletter_form_mail'			: {'my':'bottom center','at':'top center'},
		'newsletter_form_submit'		: {'my':'right center','at':'left center'}
	};

	if(typeof(response.info)!=='undefined')
	{	
		if(response.info.length)
		{	
			for(var key in response.info)
			{
				var id=response.info[key].fieldId;
				var nId=id.replace('_'+this.contextObject.id,'');

				jQuery('#'+response.info[key].fieldId).qtip(
				{
						style:      { classes:(parseInt(response.error)===1 ? 'qtip-error' : 'qtip-success')},
						content: 	{ text:response.info[key].message },
						position: 	{ my:tPosition[nId]['my'],at:tPosition[nId]['at'] }
				}).qtip('show');				
			}
		}
	}
};

/******************************************************************************/
	
NLThemeNewsletterForm.prototype.blockForm=function(action)
{
	if(action==='block') jQuery('#newsletter_form_'+this.id).find('.block').block({message:false,overlayCSS:{opacity:'0.3'}});
	else jQuery('#newsletter_form_'+this.id).find('.block').unblock();	
};
	
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/

jQuery(document).ready(function($) 
{	
	var theme=new NLTheme();
	
	/**************************************************************************/
	/*	Set gallery responsive												  */
	/**************************************************************************/
	
	jQuery('.gallery').each(function() 
	{
		theme.setGalleryResponsive(jQuery(this));	
	});
		
	jQuery(window).resize(function()	
	{
		jQuery('.gallery').each(function() 
		{
			theme.setGalleryResponsive(jQuery(this));	
		});
	});	
	
	/**************************************************************************/
	/*	Background Image Slider												  */
	/*	Background Video													  */
	/**************************************************************************/

	if(typeof(themeOption.backgroundSlider)!=='undefined')
		theme.createBackgroundSlider(themeOption.backgroundSlider,themeOption.config);
	else if(typeof(themeOption.backgroundVideo)!=='undefined')
		theme.createBackgroundVideo(themeOption.backgroundVideo,themeOption.config);
	
	/**************************************************************************/
	/*	Audio player														  */
	/**************************************************************************/	
	
	if(typeof(themeOption.audioPlayer)!=='undefined')
		theme.createAudioPlayer(themeOption.audioPlayer,themeOption.config);
	
	/**************************************************************************/
	/*	Links																  */
	/**************************************************************************/
	
	jQuery('a.target-blank').attr('target','_blank');
	
	/**************************************************************************/
	/*	Right click															  */
	/*	Text selection														  */
	/**************************************************************************/
	
	if(parseInt(themeOption.rightClick.enable)===0) theme.disableRightClick();
	if(parseInt(themeOption.textSelect.enable)===0) theme.disableSelection();
	
	/**************************************************************************/
	/*	Image preloader														  */
	/**************************************************************************/

	jQuery('.preloader img').each(function() 
	{
		jQuery(this).attr('src',jQuery(this).attr('src')+'?i='+theme.getRandom(1,100000));
		jQuery(this).bind('load',function() 
		{ 
			jQuery(this).parents('a').first().css('background-image','none'); 
			jQuery(this).animate({opacity:1},1000); 
		});
	});
	
	/**************************************************************************/
	/*	Fancybox															  */
	/**************************************************************************/
	
	theme.createImageFancybox('.fancybox-image',themeOption.fancyboxImage,themeText.fancybox);
	theme.createVideoFancybox('.fancybox-video-vimeo',themeOption.fancyboxVideo,themeText.fancybox);
	theme.createVideoFancybox('.fancybox-video-youtube',themeOption.fancyboxVideo,themeText.fancybox);
	
	theme.createPopupFancybox();

	/**************************************************************************/
	/*	Gallery																  */
	/**************************************************************************/	
	
	jQuery(window).load(function() 
	{	
		theme.createGalleryDefault();
		theme.createGalleryCarousel(themeOption.galleryCarousel);
	});

	/**************************************************************************/
	/*	Contact details button												  */
	/**************************************************************************/
	
	jQuery('.contact-details-button').bind('click',function(e) 
	{
		e.preventDefault();
		
		var contactDetails=jQuery(this).parent('.contact-details');
		
		var marginTop=parseInt(contactDetails.css('margin-top'));
		var nMarginTop=(parseInt(marginTop)===0 ? parseInt(contactDetails.height()) : 0);

		contactDetails.animate({marginTop:-1*nMarginTop},{duration:100,complete:function() { }});
	});
	
	if((themeOption.googleMapCompanyInfo.enable) && (parseInt(themeOption.googleMapCompanyInfo.enable_start)===1))
		jQuery('.contact-details-button').trigger('click');
	
	/**************************************************************************/
	/*	Navigation bar														  */
	/**************************************************************************/	
	
	jQuery(window).load(function() 
	{
		if(typeof(themeOption.navigationBar)!=='undefined')
			theme.createNavigationBar(themeOption.navigationBar);
	});
	
	/**************************************************************************/
	/*	Blink																  */
	/**************************************************************************/
	
	theme.blink(jQuery('.click-here'));
	
	/**************************************************************************/
	/*	Widnow resize														  */
	/**************************************************************************/
	
	jQuery(window).resize(function() 
	{
		theme.windowResize();
	});
	
	theme.windowResize();
});

/******************************************************************************/
/******************************************************************************/
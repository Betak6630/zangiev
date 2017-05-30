
/******************************************************************************/
/******************************************************************************/

function NLTheme()
{
	$this=this;
};

/******************************************************************************/
	
NLTheme.prototype.getRandom=function(min,max)
{
	return((Math.floor(Math.random()*(max-min)))+min);
};

/******************************************************************************/

NLTheme.prototype.blink=function(element)
{
	jQuery(element).animate({opacity:(parseInt(jQuery(element).css('opacity'))===1 ? 0.2 : 1)},500,function() { $this.blink(jQuery(this)); });
};

/******************************************************************************/

NLTheme.prototype.windowResize=function()
{
	$this.setTwitterCarouselResponsive();
};

/******************************************************************************/

NLTheme.prototype.getVisiblePage=function()
{
	jQuery('.page-list>li').each(function() 
	{
		var object=jQuery('#navigation-bar').find('a[href="#'+jQuery(this).attr('id').substring(5)+'"]');
		
		if($this.isScrolledIntoView(jQuery(this))) object.parent('li').addClass('visible');
		else object.parent('li').removeClass('visible');
	});
};

/******************************************************************************/

NLTheme.prototype.isScrolledIntoView=function(element)
{
	var viewTop=jQuery(window).scrollTop();
	var viewBottom=viewTop+jQuery(window).height();

	var elementTop=jQuery(element).offset().top;
	var elementBottom=elementTop+element.height();
	
	if((elementTop>=viewTop) && ((elementBottom<=viewBottom) || (elementTop<=viewBottom))) return(true);
	
	if((viewTop>=elementTop) && (viewBottom<=elementBottom)) return(true);
	if((elementBottom>=viewTop) && (elementBottom<=viewBottom)) return(true);
	
	return(false);
};
	
/******************************************************************************/

NLTheme.prototype.createAudioPlayer=function(option,config)
{
	if(parseInt(option.file.length)===0) 
	{
		jQuery('.audio-player-button').addClass('hidden');
		return;
	}

	jQuery('body').append(jQuery(document.createElement('div')).attr('id','jPlayer'));

	var i=0;
	jQuery('#jPlayer').jPlayer( 
	{
		ready		:	function() 
		{
			jQuery(this).jPlayer('setMedia',option.file[0]);

			if(parseInt(option.autostart)===1) 
			{
				jQuery('#jPlayer').jPlayer('play');

				var click=(document.ontouchstart===undefined ? 'click' : 'touchstart');
				var kickoff=function()
				{
					jQuery('#jPlayer').jPlayer('play');
					document.documentElement.removeEventListener(click,kickoff,true);
				};
				document.documentElement.addEventListener(click,kickoff,true);
			}
		},
		ended		:	function()
		{
			i++;
			if(i>=option.file.length) 
			{
				if(parseInt(option.loop)!==1) return;
				i=0;
			}

			jQuery(this).jPlayer('setMedia',option.file[i]).jPlayer('play');
		},
		swfPath		:	config.theme_url+'script/Jplayer.swf',
		solution	:	'html,flash',
		volume		:	option.volume/100
	});

	jQuery('.audio-player-button').bind('click',function(e) 
	{
		e.preventDefault();
		jQuery('#jPlayer').jPlayer(jQuery('.audio-player-button').hasClass('on') ? 'pause' : 'play');
	});

	jQuery('#jPlayer').bind(jQuery.jPlayer.event.play,function()	{ jQuery('.audio-player-button').removeClass('off').addClass('on'); });
	jQuery('#jPlayer').bind(jQuery.jPlayer.event.pause,function()	{ jQuery('.audio-player-button').removeClass('on').addClass('off'); });
};

/******************************************************************************/

NLTheme.prototype.createAccordion=function(selector,option)
{
	jQuery(selector).accordion(
	{
		icons			:	'',
		active			:	option.active==='false' ? false : parseInt(option.active),
		animate			:	'easeOutExpo',
		heightStyle		:	'content',
		collapsible		:	true
	});
};

/******************************************************************************/

NLTheme.prototype.createTwitterCarousel=function(selector)
{
	var hashExp=/(^|\s)#(\w+)/g;
	var userExp=/(^|\s)@(\w+)/g;
	
	var list=jQuery(selector+' li');
	
	list.linkify();

	list.each(function() 
	{
		var paragraph=jQuery(this).children('p');
		
		paragraph.html(paragraph.html().replace(userExp,' <a href="http://www.twitter.com/$2" title="@$2">$2</a>'));
		paragraph.html(paragraph.html().replace(hashExp,' <a href="http://www.twitter.com/search?q=#$2&src=hash">#$2</a>'));
	});

	jQuery(selector+'>ul').carouFredSel(
	{
		circular		:	true,
		direction		:	'up',
		items: 
		{
			visible		: 1,
			minimum		: 1
		},
		scroll: 
		{
			items		: 1,
			duration	: 750
		}
	});	
			
	list.find('a').attr('target','_blank');
};

/******************************************************************************/

NLTheme.prototype.setTwitterCarouselResponsive=function()
{
	if(!jQuery('.twitter-carousel').length) return;

	jQuery('.twitter-carousel').each(function() 
	{
		var width=jQuery(this).width();
		var height=jQuery(this).height();

		var widthItem=width-parseInt(jQuery(this).children('div').css('margin-left'));

		jQuery(this).find('ul').trigger('configuration',{items:{width:widthItem,height:height}});
		jQuery(this).find('ul li,ul li p').css({width:width,height:height});
	});
};
	
/******************************************************************************/
	
NLTheme.prototype.disableRightClick=function()
{
	document.oncontextmenu=function() {return false;};
	jQuery(document).mousedown(function(e)
	{ 
		if(parseInt(e.button)===2) return false; 
		return true; 
	});
};

/******************************************************************************/

NLTheme.prototype.disableSelection=function()
{
	return(jQuery('body').attr('unselectable','on').css('user-select','none').on('selectstart',false));
};
	
/******************************************************************************/
	
NLTheme.prototype.createGoogleMap=function(id,option)
{		
	try
	{
		var object=jQuery('#'+id);
		object.css({width:option.width+'%',height:option.height+'px'});			

		var coordinate=new google.maps.LatLng(option.coordinate_lat,option.coordinate_lng);

		var mapOptions= 
		{
			zoom						:	parseInt(option.zoom_level),
			center						:	coordinate,
			mapTypeId					:	google.maps.MapTypeId[option.map_type_id],
			mapTypeControl				:	parseInt(option.map_type_control_enable),
			mapTypeControlOptions		: 
			{
				style					:	google.maps.MapTypeControlStyle[option.map_type_control_style],
				position				:	google.maps.ControlPosition[option.map_type_control_position]
			},
			panControl					:	parseInt(option.pan_control_enable),
			panControlOptions			: 
			{
				position				:	google.maps.ControlPosition[option.pan_control_position]
			},
			zoomControl					:	parseInt(option.zoom_control_enable),
			zoomControlOptions			: 
			{
				style					:	google.maps.ZoomControlStyle[option.zoom_style],
				position				:	google.maps.ControlPosition[option.zoom_position]
			},
			scaleControl				:	parseInt(option.scale_control_enable),
			scaleControlOptions			: 
			{
				position				:	google.maps.ControlPosition[option.scale_control_position]
			},
			streetViewControl			:	parseInt(option.street_view_enable),
			streetViewControlOptions	: 
			{
				position				:	google.maps.ControlPosition[option.street_view_position]
			}				
		}

		var googleMap=new google.maps.Map(document.getElementById(id),mapOptions);

		if((option.coordinate_marker_lat.length!==0) && (option.coordinate_marker_lng.length!==0))
		{
			coordinate=new google.maps.LatLng(option.coordinate_marker_lat,option.coordinate_marker_lng);

			var markerOptions=
			{
				map			:	googleMap,
				position	:	coordinate,
				icon		:	option.theme_url+'media/image/public/map_pointer.png'
			}

			new google.maps.Marker(markerOptions);

			jQuery(window).resize(function() 
			{
				var currCenter=googleMap.getCenter();
				google.maps.event.trigger(googleMap,'resize');
				googleMap.setCenter(currCenter);
			});
			
			google.maps.event.addListener(googleMap,'resize',function() 
			{
				var contactDetails=jQuery('.contact-details');
				if(contactDetails.length!==1) return;

				var marginTop=parseInt(contactDetails.css('margin-top'));
				if(parseInt(marginTop)===0) return;

				contactDetails.css('margin-top',0);
			});
		}
	}
	catch(e) {}		
};

/******************************************************************************/

NLTheme.prototype.createBackgroundSlider=function(option)
{
	if(option.file.length)
	{
		jQuery.supersized(
		{
			slides					: option.file,
			autoplay				: parseInt(option.autoplay),
			slide_interval			: parseInt(option.slide_interval),
			start_slide				: parseInt(option.start_slide),
			stop_loop				: parseInt(option.stop_loop),
			random					: parseInt(option.random),
			slideshow				: parseInt(option.slideshow),
			transition				: option.transition,
			transition_speed		: parseInt(option.transition_speed),
			fit_always				: parseInt(option.fit_always),
			fit_landscape			: parseInt(option.fit_landscape),
			fit_portrait			: parseInt(option.fit_portrait),
			horizontal_center		: parseInt(option.horizontal_center),
			vertical_center			: parseInt(option.vertical_center),
			keyboard_nav			: parseInt(option.keyboard_nav),
			performance				: option.performance,
			thumb_links				: false,
			thumbnail_navigation	: false
		});	
	}
};
	
/******************************************************************************/
	
NLTheme.prototype.createBackgroundVideo=function(option)
{
	if(option.file.length)
	{
		jQuery('body').append(jQuery(document.createElement('div')).attr('id','video-background'));
		jQuery('#video-background').videobackground(
		{
			videoSource		:	option.file,
			loop			:	option.loop,
			control			:	false,
			poster			:	option.poster
		});
	}	
};

/******************************************************************************/

NLTheme.prototype.createNavigationBar=function(option)
{
	if(parseInt(option.enable)!==1) return;

	var navigationBar=jQuery('#navigation-bar');
	
	if(navigationBar.hasClass('navigation-bar-position-left-center') || navigationBar.hasClass('navigation-bar-position-right-center'))
	{
		var height=navigationBar.outerHeight();
		navigationBar.css('margin-top',(parseInt(-1*(height/2)))+'px');
	}
	else if(navigationBar.hasClass('navigation-bar-position-top-center') || navigationBar.hasClass('navigation-bar-position-bottom-center'))
	{
		var width=navigationBar.outerWidth();
		navigationBar.css('margin-left',(parseInt(-1*(width/2)))+'px');		
	}

	jQuery(window).bind('scroll',function() { $this.getVisiblePage(); });
	
	jQuery(window).bind('hashchange',function(e) 
	{
		e.preventDefault();
		
		var hash=window.location.hash;
		var object=navigationBar.find('a[href="'+hash+'"]');
		
		navigationBar.find('li').removeClass('selected');
		navigationBar.find('a[href="'+hash+'"]').parent('li').addClass('selected');
		
		if(object.length===1)
		{
			jQuery.scrollTo('#page-'+hash.substring(1),{'duration':parseInt(option.animation_speed),'easing':option.animation_easing,'onAfter':function() 
			{

			}});			
		}
	});
	
	jQuery(window).bind('resize',function() 
	{ 
		$this.getVisiblePage(); 
	
		if(navigationBar.hasClass('navigation-bar-position-bottom-center') || navigationBar.hasClass('navigation-bar-position-top-center'))
		{
			navigationBar.css('display','block');
			return;
		}
	
		if(parseInt(option.full_width_hide)===1)
		{
			if(jQuery('div.main:first').width()+(2*navigationBar.width())>jQuery(window).width())
				navigationBar.css('display','none');
			else navigationBar.css('display','block');
		}
		else navigationBar.css('display','block');
	});
	
	jQuery(window).trigger('resize');
	jQuery(window).trigger('hashchange');
};

/******************************************************************************/

NLTheme.prototype.createImageFancybox=function(selector,option,text)
{
	var helpers={title:{type:'inside'}};
	
	if(option.helper_button_enable)
	{
		helpers.buttons={skipSingle:true,tpl:'<div id="fancybox-buttons"><ul><li><a class="btnPrev" title="'+text.previous+'" href="javascript:;"></a></li><li><a class="btnPlay" title="'+text.start_slideshow+'" href="javascript:;"></a></li><li><a class="btnNext" title="'+text.next+'" href="javascript:;"></a></li><li><a class="btnToggle" title="'+text.toggle+'" href="javascript:;"></a></li><li><a class="btnClose" title="'+text.close+'" href="javascript:jQuery.fancybox.close();"></a></li></ul></div>'};
	}
	
	jQuery(selector).fancybox(
	{
		type					:	'image',
		margin					:	parseInt(option.margin),
		padding					:	parseInt(option.padding),
		minWidth				:	parseInt(option.min_width),
		minHeight				:	parseInt(option.min_height),
		maxWidth				:	parseInt(option.max_width),
		maxHeight				:	parseInt(option.max_height),
		autoResize				:	parseInt(option.autoresize)===1 ? true : false,
		autoCenter				:	parseInt(option.autocenter)===1 ? true : false,
		fitToView				:	parseInt(option.fittoview)===1 ? true : false,
		arrows					:	parseInt(option.arrow)===1 ? true : false,
		closeBtn				:	parseInt(option.close_button)===1 ? true : false,
		closeClick				:	parseInt(option.close_click)===1 ? true : false,
		nextClick				:	parseInt(option.next_click)===1 ? true : false,
		mouseWheel				:	parseInt(option.mouse_wheel)===1 ? true : false,
		autoPlay				:	parseInt(option.autoplay)===1 ? true : false,
		playSpeed				:	parseInt(option.playspeed),
		loop					:	parseInt(option.loop)===1 ? true : false,
		openEffect				:	option.animation_effect_open,
		closeEffect				:	option.animation_effect_close,
		nextEffect				:	option.animation_effect_nex,
		prevEffect				:	option.animation_effect_previous,
		openSpeed				:	option.speed_open,
		closeSpeed				:	option.speed_close,
		nextSpeed				:	option.speed_next,
		prevSpeed				:	option.speed_previous,		
		openEasing				:	option.easing_open,
		closeEasing				:	option.easing_close,
		nextEasing				:	option.easing_next,
		prevEasing				:	option.easing_previous,		
		beforeShow				:	function()
		{
			this.title=jQuery(this.element).nextAll('.title').html();
		},
		helpers					:	helpers,
		tpl						:
		{
			error				:	'<p class="fancybox-error">'+text.error+'</p>',
			closeBtn			:	'<a title="'+text.close+'" class="fancybox-item fancybox-close" href="javascript:;"></a>',
			next				:	'<a title="'+text.next+'" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
			prev				:	'<a title="'+text.previous+'" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
		}
	});
};
	
/******************************************************************************/
	
NLTheme.prototype.createVideoFancybox=function(selector,option,text)
{
	var helpers={title:{type:'inside'}};
	
	helpers.media={};
	
	jQuery(selector).fancybox(
	{
		margin					:	parseInt(option.margin),
		padding					:	parseInt(option.padding),
		minWidth				:	parseInt(option.min_width),
		minHeight				:	parseInt(option.min_height),
		maxWidth				:	parseInt(option.max_width),
		maxHeight				:	parseInt(option.max_height),
		autoResize				:	parseInt(option.autoresize)===1 ? true : false,
		autoCenter				:	parseInt(option.autocenter)===1 ? true : false,
		fitToView				:	parseInt(option.fittoview)===1 ? true : false,
		closeBtn				:	parseInt(option.close_button)===1 ? true : false,
		openEffect				:	'none',
		closeEffect				:	'none',
		beforeShow				:	function()
		{
			this.title=jQuery(this.element).nextAll('.title').html();
		},
		helpers					:	helpers,
		tpl						:
		{
			error				:	'<p class="fancybox-error">'+text.error+'</p>',
			closeBtn			:	'<a title="'+text.close+'" class="fancybox-item fancybox-close" href="javascript:;"></a>'
		}
	});
}; 

/******************************************************************************/

NLTheme.prototype.createGalleryDefault=function()
{	
	jQuery('.gallery-default').each(function() 
	{
		var gallery=jQuery(this);

		if(gallery.hasClass('gallery-default-filter-1'))
		{
			var element=gallery.parent('div:first').find('ul.gallery-filter-list li');

			element.find('a').bind('click',function(e)
			{
				e.preventDefault();
				$this.filter(jQuery(this));
			});

			element.find('a.selected').trigger('click');				
		}
	});	
};

/******************************************************************************/

NLTheme.prototype.createGalleryCarousel=function(option)
{
	jQuery('.gallery-carousel').carouFredSel(
	{
		swipe			:	true,
		auto			:	parseInt(option.autoplay)===1 ? true : false,
		circular		:	parseInt(option.circular)===1 ? true : false,
		infinite		:	parseInt(option.infinite)===1 ? true : false,
		direction		:	option.direction,
		items: 
		{
			height		:	'100%',
			start		:	parseInt(option.item_start),
			visible		:	parseInt(option.item_visible),
			minimum		:	parseInt(option.item_minimum)
		},
		scroll: 
		{
			items		:	parseInt(option.scroll_item),
			fx			:	option.scroll_effect,
			easing		:	option.scroll_easing,
			duration	:	parseInt(option.scroll_duration)
		},
		onCreate		:	function()
		{
			jQuery(this).trigger('configuration',['prev',jQuery(this).parents('div.gallery-carousel-wrapper:first').find('a.navigation-prev')]);
			jQuery(this).trigger('configuration',['next',jQuery(this).parents('div.gallery-carousel-wrapper:first').find('a.navigation-next')]);
		},
		debug			:	false
	});	
};

/******************************************************************************/

NLTheme.prototype.setGalleryResponsive=function(gallery)
{
	var parent=gallery.parents('.gallery-wrapper').parent().first();
		
	var width=parent.actual('width');
		
	var columnCount=1;
	var columnWidth=280;
	var columnMargin=20;

	if(width>=960)
	{
		columnCount=4;
		columnWidth=225;
	}
	else if(width>=750)
	{
		columnCount=3;
		columnWidth=235;			
	}
	else if(width>=460)
	{
		columnCount=2;
		columnWidth=220;			
	}
		
	var width1=columnCount*(columnWidth+columnMargin);
	var width2=((columnCount*(columnWidth+columnMargin))-columnMargin);
		
	gallery.width(width1);
	gallery.parents('.gallery-wrapper').width(width2);

	gallery.children('li').css('width',columnWidth);	
		
	if(gallery.hasClass('gallery-default'))
	{
		gallery.isotope(
		{ 
			masonry			:	{columnWidth:columnWidth+20},
			resizable		:	true,
			itemSelector	:	'li'
		});
	}
	else
	{
		gallery.trigger('updateSizes');
	}
};
	
/******************************************************************************/
	
NLTheme.prototype.filter=function(object)
{
	var filter='';

	object.parent('li').parent('ul').find('a').removeClass('selected');
	object.addClass('selected');

	if(!object.hasClass('filter-0'))
	{
		var aClass=object.attr('class').split(' ');
		for(var i=0;i<aClass.length;i++) 
		{
			if(parseInt(aClass[i].indexOf('filter-'))!==-1) filter+=' .'+aClass[i];			
		}			
	}
	
	object.parent('li').parent('ul').parent('div').find('ul:last').isotope({filter:filter});
};

/******************************************************************************/

NLTheme.prototype.createPopupFancybox=function()
{
	jQuery('a.target-popup').bind('click',function(e) 
	{
		e.preventDefault();
		
		var width='auto';
		var height='auto';
		
		var className=jQuery(this).attr('class').split(' ');
		
		for(var i=0;i<className.length;i++)
		{
			if(parseInt(className[i].indexOf('popup-width-'))!==-1) width=parseInt(className[i].substring(12));
			if(parseInt(className[i].indexOf('popup-height-'))!==-1) height=parseInt(className[i].substring(13));
		}
		
		jQuery.fancybox(
		{
			width					:	width,
			height					:	height,
			href					:	this.href,
			type					:	'iframe',
			onStart					:	function()
			{

			}
		});
		
		return(false);
	});
};
	
/******************************************************************************/
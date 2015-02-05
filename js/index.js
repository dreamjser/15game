require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		"public": 'module/public'
	},
	shim: {

		'zepto': {

			exports: 'Zepto'
		}
	}

});
require(['zepto', 'public'], function($, Pub) {

	var logo = $('#logo'),
		slogan = $('#slogan'),
		menu = $('#menu'),
		SPEED = Pub.SPEED/3,
		ANI_time = 500,
		delay = Pub.delay,
		doAni = Pub.ani;


	function init() {

		var initCss = {
			'-webkit-transform': 'translate3d(0,-40px,0)',
			'opacity': 0,
			'display': 'block'
		};

		doAni(slogan, initCss, function() {

			doAni(logo, initCss, function(){

				delay(function(){

					$('.index-sun,.index-cloud1,.index-cloud2').fadeIn(ANI_time, function(){

						menu.fadeIn(ANI_time);
					});

				}, SPEED)
				
			},SPEED);

		}, SPEED);
	}

	init();

});
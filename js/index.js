require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		"public": 'module/public',
		'load': 'module/load'

	},
	shim: {

		'zepto': {

			exports: 'Zepto'
		}
	}

});
require(['zepto', 'public', 'load'], function($, Pub, load) {

	var logo = $('#logo'),
		slogan = $('#slogan'),
		menu = $('.index-menu'),
		SPEED = 200,
		ANI_time = 500,
		delay = Pub.delay,
		doAni = Pub.ani,
		ImgLoader = load.ImgLoader;

	var imgArr = [

					'images/index/index_bg.jpg',
					'images/index/index_all.png'
				 ];

	function init() {

		$('#loading').fadeOut('fast');

		var initCss = {
			'-webkit-transform': 'translate3d(0,-40px,0)',
			'opacity': 0,
			'display': 'block'
		};

		var menuCss = {

			'-webkit-transform': 'translate3d(-600px,0,0)',
			'opacity': 0,
			'display': 'block'
		}

		doAni(slogan, initCss, function() {

			doAni(logo, initCss, function(){

				delay(function(){

					$('.index-sun,.index-cloud1,.index-cloud2').fadeIn(ANI_time, function(){

							doAni(menu.eq(0), menuCss, function(){

						  		doAni(menu.eq(1), menuCss, function(){

						  			doAni(menu.eq(2), menuCss, function(){

						  				

						  			}, SPEED);

						  		}, SPEED);

							}, SPEED);
					});

				}, SPEED)
				
			},SPEED);

		}, SPEED);
	}

	var imgLoader = new ImgLoader(imgArr);

	imgLoader.completed(init);

	imgLoader.start();

});
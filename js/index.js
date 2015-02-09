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
		title = $('#title'),
		close = $('#close'),
		read = $('#read'),
		menu = $('.index-menu'),
		read_btn = $('#read_btn'),
		SPEED = 180,
		ANI_time = 400,
		EASEING = 'easeIn',
		delay = Pub.delay,
		doAni = Pub.ani,
		ImgLoader = load.ImgLoader;

	var imgArr = [

		'images/index/index_bg.jpg',
		'images/index/index_all.png'
	];

	function bindClose(){

		close.click(function(){

			read.fadeOut('fast');
		});

		read_btn.click(function(){

			read.fadeIn('fast');
		});
	}

	function init() {

		$('#loading').fadeOut('fast');

		bindClose();

		var sloganCss = {
			'-webkit-transform': 'scale(0)',
			'display': 'block'
		};
		var logoCss = {
			'-webkit-transform': 'rotateY(90deg)',
			'display': 'block'
		};
		var titleCss = {
			'-webkit-transform': 'translate3d(-700px,0,0)',
			'display': 'block'
		};
		var menuCss = {
			'-webkit-transform': 'translate3d(0,80px,0)',
			'opacity': 0,
			'display': 'block'
		}

		delay(function() {

			slogan.css(sloganCss).animate({
				scale: 1
			}, ANI_time, EASEING);

			delay(function() {

				logo.css(logoCss).animate({
					rotateY: 0
				}, ANI_time, EASEING);

				delay(function() {

					title.css(titleCss).animate({
						translate3d: '0,0,0'
					}, ANI_time, EASEING);

					delay(function(){

						doAni(menu.eq(0), menuCss, function(){

					  		doAni(menu.eq(1), menuCss, function(){

					  			doAni(menu.eq(2), menuCss, function(){

					  				$('.index-sun,.index-cloud1,.index-cloud2').fadeIn('fast',function(){

					  					read_btn.fadeIn('fast');
					  				});
					  				

					  			}, 2*SPEED);

					  		}, SPEED);

						}, SPEED);

					}, SPEED+100);

				}, SPEED);

			}, SPEED);


		}, SPEED);

	}

	var imgLoader = new ImgLoader(imgArr);

	imgLoader.completed(init);

	imgLoader.start();

});
require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		"public": 'module/public',
		'load': 'module/load',
		"sprite": 'module/sprite'
	},
	shim: {

		'zepto': {

			exports: 'Zepto'
		}
	}

});
require(['zepto', 'public', 'load', 'sprite'], function($, Pub, load, sprite) {

	var logo = $('#logo'),
		slogan = $('#slogan'),
		title = $('#title'),
		close = $('#close'),
		read = $('#read'),
		cloud1 = $('#cloud1'),
		cloud2 = $('#cloud2'),
		cloud3 = $('#cloud3'),
		menu = $('.index-menu'),
		read_btn = $('#read_btn'),
		truck = $('#truck'),
		SPEED = 300,
		ANI_time = 500,
		EASEING = 'easeIn',
		delay = Pub.delay,
		doAni = Pub.ani,
		Sprite = sprite.Sprite,
		ImgLoader = load.ImgLoader;

	var Sp = new Sprite(truck[0], {

		width: 239,
		height: 108,
		count: 4,
		url: 'images/index/truck.png',
		time: 300

	});

	var imgArr = [

		'images/index/index_bg.jpg',
		'images/index/index_all.png',
		'images/index/truck.png'
	];

	function bindClose() {

		close.click(function() {

			read.fadeOut('fast');
		});

		read_btn.click(function() {

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
		};

		var sunClass = {
			'-webkit-transform': 'translate3d(-200px,0,0)',
			'opacity': 0,
			'display': 'block'
		};

		var cloudeCss1 = {
			'-webkit-transform': 'translate3d(-200px,0,0)',
			'opacity': 0,
			'display': 'block'
		};

		var cloudeCss2 = {
			'-webkit-transform': 'translate3d(200px,0,0)',
			'opacity': 0,
			'display': 'block'
		};


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

					delay(function() {

						doAni(menu.eq(0), menuCss, function() {

							doAni(menu.eq(1), menuCss, function() {

								doAni(menu.eq(2), menuCss, function() {

									doAni(cloud1, cloudeCss1, function(){

										doAni(cloud2, cloudeCss2, function(){

											doAni(cloud3, cloudeCss2, function(){

												doAni($('.index-sun'), sunClass, function(){

													$('.index-cloud2,.index-cloud1').addClass('index-animation');

												},SPEED);
												
											},SPEED);

										},SPEED);

									},SPEED);

									delay(function(){
										
										read_btn.fadeIn('fast');

										truck.fadeIn('fast',function(){
											
											Sp.init();
										});

									},SPEED);


								}, 2 * SPEED);

							}, SPEED);

						}, SPEED);

					}, SPEED + 100);

				}, SPEED);

			}, SPEED);


		}, SPEED);

	}

	var imgLoader = new ImgLoader(imgArr);

	imgLoader.completed(init);

	imgLoader.start();

});
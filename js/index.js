require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		'io': 'lib/socket.io',
		'wx': 'lib/jweixin-1.0.0',
		'qrcode': 'lib/qrcode.min',
		"public": 'module/public',
		'load': 'module/load',
		'sprite': 'module/sprite',
		'share': 'module/share'
	},
	shim: {

		'zepto': {

			exports: 'Zepto'
		},
		'io': {
			exports: 'io'
		},
		'qrcode': {

			exports: 'QRCode'
		}
	}

});
require(['zepto', 'public', 'load', 'sprite', 'share'], function($, Pub, load, sprite, sh) {

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
		return_btn = $('#return_btn'),
		online = $('#online'),
		pub_share = sh.share,
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

	var imgArr = ImgArr.arr;

	function bindClose() {

		close.tap(function() {

			read.fadeOut('fast');
		});

		read_btn.tap(function() {

			read.fadeIn('fast');
		});

		/*$('.index-menu').tap(function(){

			if($(this).data('online') === 'none'){

				online.fadeIn('fast');
				return false;
			}
			
		});*/

		return_btn.tap(function() {

			online.fadeOut('fast');
		});
	}

	function isWeiXin() {

		var ua = window.navigator.userAgent.toLowerCase();

		if (ua.match(/MicroMessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
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

									doAni(cloud1, cloudeCss1, function() {

										doAni(cloud2, cloudeCss2, function() {

											doAni(cloud3, cloudeCss2, function() {

												doAni($('.index-sun'), sunClass, function() {

													$('.index-cloud2,.index-cloud1').addClass('index-animation');


												}, SPEED);

												delay(function() {

													read_btn.fadeIn('fast');

													truck.fadeIn('fast', function() {

														Sp.init();
													});

												}, SPEED);

											}, SPEED);

										}, SPEED);

									}, SPEED);


								}, 2 * SPEED);

							}, SPEED);

						}, SPEED);

					}, SPEED + 100);

				}, SPEED);

			}, SPEED);


		}, SPEED);

	}

	var imgLoader = new ImgLoader(imgArr);

	if(!isWeiXin()){

		$('#no_wx').show();

	}

	imgLoader.completed(init);

	imgLoader.start();

	pub_share({

		content: Share.content
	});

});
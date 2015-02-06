require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		'io': 'lib/socket.io-1.3.2',
		'qrcode': 'lib/qrcode.min',
		"public": 'module/public',
		'load': 'module/load'
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
require(['zepto', 'io', 'qrcode', 'public', 'load'], function($, io, qrcode, Pub, load) {

	var delay = Pub.delay,
		doAni = Pub.ani,
		ImgLoader = load.ImgLoader,
		wrapper = $('#wrapper'),
		loading = $('#loading'),
		code = $('#code'),
		link = $('#link'),
		time = $('#time'),
		share = $('#share'),
		restart = $('#restart'),
		audio_success = $('#audio_success')[0],
		audio_fail = $('#audio_fail')[0],
		time_num = $('#time_num'),
		tree_number = $('#tree_number'),
		code_box = $('#code_box'),
		link_sure = $('#link_sure'),
		time_num_box = $('#time_num_box'),
		time_box = $('#time_box'),
		arrow = $('#arrow'),
		tree_box = $('#tree_box'),
		time_leave = $('#time_leave'),
		game1_sun = $('#sun'),
		game1_cloud = $('.game1-cloud'),
		arrow = $('#arrow'),
		saw = $('#saw'),
		tree_top = $('#tree_top'),
		sawY = 0;

	var imgArr = [
			'images/game1/game1_bg.jpg',
			'images/public.png'
		];

	var CONFIG = {

		duration: 800,

		time: 60,

		sawCount : 4,

		rightClass: 'bg-r',

		sawLangClass: 'game-arrow-r'
	};

	var socket,
		tree_total_num = 0,
		roomId = Pub.getUrlParam('chat'),
		isLeft = false,
		isTouch = true,
		isTreeFade = false,
		isEnd = false,
		IO_URL = '116.213.76.9:7000/?chat=';;


	var Game = {

		startGame: function() {

			code.hide();

			this.beginTime();

			restart.click(function(){

				Game.restartGame();

				$(this).unbind('click');
			});

		},

		beginTime: function() {

			var beginTimeAuto = setInterval(function() {

				CONFIG.time--;

				time_leave.html(formatInt(CONFIG.time));

				if (CONFIG.time <= 0) {

					clearInterval(beginTimeAuto);

					socket.emit("gameover");
				}

			}, 1000);

		},

		gameOver: function() {

			isEnd = true;

			share.fadeIn(CONFIG.duration);
		},

		restartGame : function(){

			isEnd = false;
			sawY = 0;
			tree_total_num = 0;
			tree_number.html(0);
			CONFIG.time = 60;
			time_leave.html(CONFIG.time);
			time_num.html(3);
			arrow.removeClass(CONFIG.sawLangClass);
			$('.pie').css({'-webkit-transform':'rotate(0deg)'});
			saw.css({'-webkit-transform' : 'translate3d(0,0,0)'});

			share.hide();
			gameTimeBegin();
		}

	}


	//生成二维码
	function createCode(url) {

		var qr = new qrcode(code_box[0], {
			width: 232,
			height: 232
		});

		qr.makeCode(url);
	}

	//PC端测试用
	function clickTestCode(url) {

		code.click(function() {

			window.open(url, 'blank');
		});
	}

	//设置房间id
	function setRoomId() {

		var c = encodeURI(new Date().getTime()),
			href = location.href,
			url = href.indexOf('?') > 0 ? href + '&chat=' + c : href + '?chat=' + c;

		if (roomId == null || roomId.length < 10) {

			clickTestCode(url); //测试用
			createCode(url);
			code.show();
			isLeft = true;
			roomId = c;
		}

		//右面手机body样式
		if (!isLeft) {

			$('body').addClass(CONFIG.rightClass);
		}
	}

	//显示链接成功
	function showConnectSuccess(){

		code.hide();

		link.show();

		link_sure.click(function(){

			alert(111);

			socket.emit('confirm');

			$(this).unbind('click');
		});

	}

	//开始游戏倒计时

	function gameTimeBegin(){

		link.hide();

		time.show();

		Pub.circleAni();

		var t = 3,

			autoTime = setInterval(function(){

				time_num.html(t);

				t--;

				if(t<0){
					time.hide();
					clearInterval(autoTime);
					Game.startGame();
				}
			},1000);
	}

	//链接socket
	function connectSocket() {

		socket = io.connect(IO_URL + roomId);

		socket.on('connect', function() {
			console.log("conected!!!");

			socket.on('info', function(data) {
				console.log("response from server:" + data);
			});

			socket.on('disconnect', function() {
				console.log("断开连接");
			});

			socket.on('swipeSucc', function(data) {
				console.log("成功：" + data);

				audio_success.play();

				tree_total_num = parseInt(data/CONFIG.sawCount);

				changeSawLang();

				sawTreeSuccess(data);
			});

			socket.on('swipeFail', function(data) {

				audio_fail.play();

				isTouch = true;
			});

			socket.on('confirm', function(data) {
				
				gameTimeBegin();
			});

			// 游戏开始
			socket.on('gamestart', function(data) {

				console.log("游戏开始" + new Date().toLocaleString());

				showConnectSuccess();
			});

			socket.on('gameover', function(data) {
				
				!isEnd && Game.gameOver();
			});

		});

		socket.on('error', function(e) {
			console.log(e);
		});

	}

	//绑定touch事件
	function bindTouchEvent() {

		wrapper.swipeLeft(function() {

			if(!isTouch || isTreeFade || isEnd){
				return;
			}

			isTouch = false;

			socket.emit("swipeLeft");

		});

		wrapper.swipeRight(function() {

			if(!isTouch || isTreeFade || isEnd){
				return;
			}

			isTouch = false;

			socket.emit("swipeRight");

		});
	}

	//锯木头成功
	function sawTreeSuccess(data) {

		var count = CONFIG.sawCount;

		if (data % count === 0) {

			isTreeFade = true;

			tree_top.animate({translate3d : '0,-200px,0'}, CONFIG.duration,function(){

				tree_box.fadeOut(CONFIG.duration, function(){

					tree_top.css({'-webkit-transform' : 'translate3d(0,0,0)'});
					saw.css({'-webkit-transform' : 'translate3d(0,0,0)'});
					tree_box.show();

					sawY = 0;
					isTreeFade = false;
				});

				tree_number.html(tree_total_num);

			});
		}
	}

	//锯木头成功后改变方向
	function changeSawLang() {

		if(isTreeFade){
			return;
		}

		var X = 0;

		if (arrow.hasClass(CONFIG.sawLangClass)) {

			arrow.removeClass(CONFIG.sawLangClass);

			X = 50;
		} else {

			arrow.addClass(CONFIG.sawLangClass);

			X = -50;
		}

		sawY += 6;

		saw.animate({

			translate3d: X + 'px,' + sawY + 'px,0'

		}, 300, function() {

			isTouch = true;
		});
	}


	//初始化页面动画
	function initAnimate() {

		wrapper.children('div').show();

		/*tree_box.fadeIn(CONFIG.duration);

		delay(function() {

			game1_sun.fadeIn(CONFIG.duration);

			game1_cloud.fadeIn(CONFIG.duration, function() {

				delay(function() {

					time_num_box.fadeIn(CONFIG.duration);
					time_box.fadeIn(CONFIG.duration);
					arrow.fadeIn(CONFIG.duration);

				}, 350);

			});

		}, 350);*/
	}


	//格式化数字
	function formatInt(number) {

		return number < 10 ? '0' + number : number;
	}


	//禁止touchmove
	function forbTouchMove() {

		$('body').bind('touchmove', function(e) {

			e.preventDefault();
		});
	}

	//loading
	function loadImg(){

		var imgLoader = new ImgLoader(imgArr);

		imgLoader.completed(function(){

			loading.hide();
			connectSocket();
		});

		imgLoader.start();
	}

	function init() {

		setRoomId();

		if (!isLeft) {

			imgArr.push('images/game1/game1_bg.jpg');
			imgArr.push('images/game1/tree_left.png');

		}else{
			imgArr.push('images/game1/game1_bg_r.jpg');
			imgArr.push('images/game1/tree_right.png');
		}

		loadImg();

		bindTouchEvent();

		forbTouchMove();
		
		initAnimate();

	}

	init();

});
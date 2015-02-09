require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		'io': 'lib/socket.io',
		'qrcode': 'lib/qrcode.min',
		"public": 'module/public',
		'load': 'module/load',
		'sprite': 'module/sprite'
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
require(['zepto', 'io', 'qrcode', 'public', 'load', 'sprite'], function($, io, qrcode, Pub, load, sprite) {

	var delay = Pub.delay,
		doAni = Pub.ani,
		ImgLoader = load.ImgLoader,
		Sprite = sprite.Sprite,
		wrapper = $('#wrapper'),
		loading = $('#loading'),
		code = $('#code'),
		link = $('#link'),
		time = $('#time'),
		share = $('#share'),
		exit = $('#exit'),
		exit_sure = $('#exit_sure'),
		restart = $('#restart'),
		share_num = $('#share_num'),
		share_score = $('#share_score'),
		audio_success = $('#audio_success')[0],
		audio_fail = $('#audio_fail')[0],
		time_num = $('#time_num'),
		tree_number = $('#tree_number'),
		tree_ani = $('#tree_ani'),
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

	var tree_sp = new Sprite(tree_ani[0], {

		width: 197,
		height: 299,
		lang: 'x',
		count: 3,
		isOne: true,
		url: 'images/game1/mx.png',
		time: 100,
		result: function() {
			tree_ani.hide();
		}
	});

	var tree_sp2 = new Sprite(tree_ani[0], {

		width: 197,
		height: 299,
		lang: 'x',
		count: 3,
		isOne: true,
		url: 'images/game1/mx2.png',
		time: 100,
		result: function() {
			tree_ani.hide();
		}
	});


	var CONFIG = {

		duration: 800,

		// time: 60,

		time: 10,

		sawCount: 4,

		sawTimes : 60,

		rightClass: 'bg-r',

		sawLangClass: 'game-arrow-r',

		linkClass: 'link-sure2'
	};

	var socket,
		time_number = CONFIG.time,
		tree_total_num = 0,
		score_count = 0,
		roomId = Pub.getUrlParam('chat'),
		isLeft = false,
		isTouch = true,
		isTreeFade = false,
		isEnd = false,
		isLink = false,
		isLoad = false,
		// IO_URL = '192.168.1.133:7000/?chat=';
		IO_URL = '116.213.76.9:7000/?chat=';

	var Game = {

		startGame: function() {

			code.hide();

			this.beginTime();

			restart.click(function() {

				socket.emit('replay');

				Game.restartGame();

				$(this).unbind('click');
			});

		},

		beginTime: function() {

			var beginTimeAuto = setInterval(function() {

				time_number--;

				time_leave.html(formatInt(time_number));

				if (time_number <= 0) {

					clearInterval(beginTimeAuto);

					socket.emit("gameover");
				}

			}, 1000);

		},

		gameOver: function() {

			isEnd = true;

			share_num.html(tree_total_num);

			share_score.html(getScores());

			share.fadeIn('fast');
		},

		restartGame: function() {

			isEnd = false;
			sawY = 0;
			tree_total_num = 0;
			tree_number.html(0);
			time_number = CONFIG.time;
			time_leave.html(time_number);
			time_num.html(3);
			link_sure.removeClass(CONFIG.linkClass);
			arrow.removeClass(CONFIG.sawLangClass);
			$('.pie').css({
				'-webkit-transform': 'rotate(0deg)'
			});
			saw.css({
				'-webkit-transform': 'translate3d(0,0,0)'
			});

			share.hide();
			showConnectSuccess();
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
	function showConnectSuccess() {

		code.hide();

		link.show();

		link_sure.click(function() {

			socket.emit('confirm');

			$(this).addClass(CONFIG.linkClass);

			$(this).unbind('click');

		});

	}

	//开始游戏倒计时

	function gameTimeBegin() {

		link.hide();

		time.show();

		Pub.circleAni();

		var t = 3,

			autoTime = setInterval(function() {

				if (t <= 1) {
					time.hide();
					clearInterval(autoTime);
					Game.startGame();
					return;
				}

				t--;

				time_num.html(t);


			}, 1000);
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

				score_count = data;

				audio_success.play();

				tree_total_num = parseInt(data / CONFIG.sawCount);

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

			socket.on('exit', function(data) {

				console.log('exit');

				exit.show();
			});

			socket.on('replay', function(data) {

				console.log('replay');

				Game.restartGame();
			});

			socket.on('full', function(data) {

				console.log('full');

			});

			// 游戏开始
			socket.on('gamestart', function(data) {

				console.log("游戏开始" + new Date().toLocaleString());

				showConnectSuccess();

				isLink = true;

				hideLoading();
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

			if (!isTouch || isTreeFade || isEnd) {
				return;
			}

			isTouch = false;

			socket.emit("swipeLeft");

		});

		wrapper.swipeRight(function() {

			if (!isTouch || isTreeFade || isEnd) {
				return;
			}

			isTouch = false;

			socket.emit("swipeRight");

		});
	}

	//绑定断开连接页面确定按钮
	function bindExitSure() {

		exit_sure.click(function() {

			location.reload();
		});
	}

	//锯木头成功
	function sawTreeSuccess(data) {

		var count = CONFIG.sawCount;

		if (isLeft && data % 2 === 1) {
			tree_ani.show();
			tree_sp.init();
		}
		if (!isLeft && data % 2 === 0) {
			tree_ani.show();
			tree_sp2.init();
		}

		if (data % count === 0) {


			isTreeFade = true;

			tree_top.animate({
				translate3d: '0,-200px,0'
			}, CONFIG.duration, function() {

				tree_top.fadeOut(CONFIG.duration, function() {

					tree_top.css({
						'-webkit-transform': 'translate3d(0,0,0)'
					}).show();
					saw.css({
						'-webkit-transform': 'translate3d(0,0,0)'
					});

					sawY = 0;
					isTreeFade = false;
				});

				tree_number.html(tree_total_num);

			});
		}
	}

	//锯木头成功后改变方向
	function changeSawLang() {

		if (isTreeFade) {
			return;
		}

		var X = 0;

		if (arrow.hasClass(CONFIG.sawLangClass)) {

			arrow.removeClass(CONFIG.sawLangClass);

			X = 120;
		} else {

			arrow.addClass(CONFIG.sawLangClass);

			X = -120;
		}

		sawY += 8;

		saw.animate({

			translate3d: X + 'px,' + sawY + 'px,0'

		}, 300, function() {

			isTouch = true;

		}, 'easeIn');
	}

	// 计算最后得分
	function getScores() {

		var scores = parseInt((100 / CONFIG.sawTimes) * score_count);

		if (scores >= 100) {
			scores = 99;
		}

		return scores;
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
	function loadImg() {

		var imgLoader = new ImgLoader(imgArr);

		imgLoader.completed(function() {

			isLoad = true;

			connectSocket();

			hideLoading();
		});

		imgLoader.start();
	}

	//隐藏loading
	function hideLoading() {

		if (!isLeft) {

			if (isLink && isLoad && !isLeft) {

				loading.fadeOut('fast');

			}

		} else {

			loading.fadeOut('fast');
		}

	}

	function init() {

		time_leave.html(CONFIG.time);

		setRoomId();

		if (isLeft) {

			imgArr.push('images/game1/game1_bg.jpg');
			imgArr.push('images/game1/tree_left.png');
			imgArr.push('images/game1/mx.png');

		} else {
			imgArr.push('images/game1/game1_bg_r.jpg');
			imgArr.push('images/game1/tree_right.png');
			imgArr.push('images/game1/mx2.png');
		}

		bindExitSure();

		loadImg();

		bindTouchEvent();

		forbTouchMove();

	}

	init();

});
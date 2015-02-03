require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		'io': 'lib/socket.io-1.3.2',
		'qrcode': 'lib/qrcode.min',
		"public": 'module/public'
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
require(['zepto', 'io', 'qrcode', 'public'], function($, io, qrcode, Pub) {

	var ANI_time = 800,
		delay = Pub.delay,
		doAni = Pub.ani,
		wrapper = $('#wrapper'),
		code = $('#code'),
		code_box = $('#code_box'),
		time_num_box = $('#time_num_box'),
		time_box = $('#time_box'),
		arrow = $('#arrow'),
		tree_box = $('#tree_box'),
		time_leave = $('#time_leave'),
		game1_sun = $('#sun'),
		game1_cloud = $('.game1-cloud');

	var CONFIG = {

		time: 60
	};

	var roomId = getUrlParam('chat'),
		isLeft = false,
		socket,
		IO_URL = '116.213.76.9:7000/?chat=';;

	

	//设置房间id
	function setRoomId() {

		var c = encodeURI(new Date().getTime()),
			href = location.href,
			url = href.indexOf('?') > 0 ? href + '&chat=' + c : href + '?chat=' + c;

		if (roomId == null || roomId.length < 10) {

			clickTestCode(url);//测试用
			createCode(url);
			code.show();
			isLeft = true;
			roomId = c;
		}

		createRoom();
	}

	//创建房间
	function createRoom(){


		delay(connectSocket, 2000);
	}

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
				$("#info").text("成功：" + data);
			});

			socket.on('swipeFail', function(data) {
				$("#info").text("失败");
			});

			// 游戏开始
			socket.on('gamestart', function(data) {

				console.log("游戏开始" + new Date().toLocaleString());

				beginGame();
			});

			socket.on('gameTimeout', function(data) {
				$("#info").text("游戏结束");
			});

		});

		socket.on('error', function(e) {
			console.log(e);
		});

	}

	//PC端测试用
	function clickTestCode(url) {

		code.click(function() {

			window.open(url, 'blank');
		});
	}

	//生成二维码
	function createCode(url) {

		var qr = new qrcode(code_box[0], {
			width: 232,
			height: 232
		});

		qr.makeCode(url);
	}

	//初始化页面动画
	function initAnimate() {

		tree_box.fadeIn(ANI_time);

		delay(function() {

			game1_sun.fadeIn(ANI_time);

			game1_cloud.fadeIn(ANI_time, function() {

				delay(function() {

					time_num_box.fadeIn(ANI_time);
					time_box.fadeIn(ANI_time);
					arrow.fadeIn(ANI_time);

				}, 350);

			});

		}, 350);
	}

	//开始游戏
	function beginGame() {

		code.hide();

		beginTime();

		bindTouchEvent();
	}

	function bindTouchEvent(){

		wrapper.swipeLeft(function(){
			alert(1);
		});
	}

	//开始计时
	function beginTime() {

		var auto = setInterval(function() {

			CONFIG.time--;

			time_leave.html(formatInt(CONFIG.time));

			if (CONFIG.time <= 0) {

				clearInterval(auto);

				gameOver();
			}

		}, 1000);
	}

	//格式化数字
	function formatInt(number) {

		return number < 10 ? '0' + number : number;
	}

	//游戏结束
	function gameOver() {
		// alert('game over');
	}

	//禁止touchmove
	function forbTouchMove() {

		$('body').bind('touchmove', function() {

			return false;
		});
	}

	//获取URL参数
	function getUrlParam(name) {

		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}

	function init() {

		forbTouchMove();
		setRoomId();
		delay(initAnimate, 200);

	}

	init();

});
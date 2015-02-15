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
require(['zepto', 'io', 'qrcode', 'public', 'load', 'sprite', 'share'], function($, io, qrcode, Pub, load, sprite, sh) {

	var delay = Pub.delay,
		ImgLoader = load.ImgLoader,
		Sprite = sprite.Sprite,
		pubShare = sh.share,
		wrapper = $('#wrapper'),
		loading = $('#loading'),
		code = $('#code'),
		link = $('#link'),
		time = $('#time'),
		share = $('#share'),
		exit = $('#exit'),
		plantform = $('#plantform'),
		pubcode = $('#pubcode'),
		no_price = $('#no_price'),
		exit_sure = $('#exit_sure'),
		restart = $('#restart'),
		game_price = $('#game_price'),
		share_num = $('#share_num'),
		share_score = $('#share_score'),
		price_submit = $('#price_submit'),
		share_tips = $('#share_tips'),
		noprice_sure = $('#noprice_sure'),
		myname = $('#myname'),
		myhead = $('#myhead'),
		oname = $('#oname'),
		ohead = $('#ohead'),
		audio_success = $('#audio_success')[0],
		audio_fail = $('#audio_fail')[0],
		time_num = $('#time_num'),
		code_box = $('#code_box'),
		link_sure = $('#link_sure'),
		time_num_box = $('#time_num_box'),
		time_box = $('#time_box'),
		time_leave = $('#time_leave'),
		stick = $('#stick'),
		bucket = $('#bucket'),
		arrow_top = $('#arrow_top'),
		arrow_bottom = $('#arrow_bottom'),
		danger = $('#danger'),
		bucket_end = $('#bucket_end'),
		meters_num = $('#meters_num'),
		audio_over = $('#audio_over')[0];


	var CONFIG = {

		duration: 800,

		time: 30,

		sawCount: 4,

		SPEED : 600,

		sawTimes: GAME1_TIMES,

		rightClass: 'bg-r',

		linkClass: 'link-sure2'
	};

	var socket,
		time_number = CONFIG.time,
		total_meters = 0,
		meters_auto = 0,
		score_count = 0,
		metersX = 0,
		roomId = Pub.getUrlParam('chat'),
		isLeft = false,
		isTouch = true,
		isTreeFade = false,
		isEnd = false,
		isLink = false,
		isLoad = false,
		isBeginTime = false,
		imgArr = ImgArr.arr1,
		IO_URL = socketUrl;

	var Game = {

		beginTimeAuto: 0,

		startGame: function() {

			code.hide();

			this.beginTime();

			updateMeters();

			pubShare({

				content: Share.content3
			});

			restart.click(function() {

				socket.emit('replay');

				Game.restartGame();

				$(this).unbind('click');
			});

		},

		beginTime: function() {

			Game.beginTimeAuto = setInterval(function() {

				time_number--;

				time_leave.html(formatInt(time_number));

				if (time_number <= 0) {

					clearInterval(Game.beginTimeAuto);

					!isEnd && Game.gameOver();
				}

			}, 1000);

		},

		gameOver: function() {

			var content = userInfo.nickname + '和' + oUserInfo.nickname + '在山路上担水前进' + total_meters + '米，快来一起玩，看看你和谁可以桶一步调！';

			isEnd = true;

			pubShare({

				content: content
			});

			if (userInfo.head == '') {
				userInfo.head = API.defaultHead;
			}

			if (oUserInfo.head == '') {
				oUserInfo.head = API.defaultHead;
			}

			myname.html(userInfo.nickname);
			oname.html(oUserInfo.nickname);
			myhead.attr('src', userInfo.head);
			ohead.attr('src', oUserInfo.head);
			danger.hide();
			clearInterval(Game.beginTimeAuto);
			clearInterval(meters_auto);

		},

		restartGame: function() {

			isEnd = false;
			isBeginTime = false;
			time_number = CONFIG.time;
			time_leave.html(time_number);
			time_num.html(3);
			link_sure.removeClass(CONFIG.linkClass);
			total_meters = 0;
			meters_num.html(total_meters);

			$('.game3-arrow').show();

			stick.css({
				'-webkit-transform': 'rotate(0deg)'
			});

			bucket.css({
				'-webkit-transform': 'translate3d(0,0,0)'
			});

			$('.pie').css({
				'-webkit-transform': 'rotate(0deg)'
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

		var c = G_roomid,
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

			socket.emit('confirm', JSON.stringify(userInfo));

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

	function updateAngles(ang) {

		var rot = ang / 16,
			tra = rot * rot * 2;

		metersX = tra;

		// console.log(rot);

		if(Math.abs(rot) >= 10){

			danger.show();
		}else{
			danger.hide();
		}

		stick.css('-webkit-transform','rotate('+rot+'deg)');

		bucket.css('-webkit-transform','translate3d('+tra+'px,0,0)');

		bucket_end.css('-webkit-transform','translate3d('+tra+'px,0,0)');


		// stick.animate({
		// 	rotate: rot + 'deg',
		// }, 50);

		// bucket.animate({
		// 	translate3d: tra + 'px,0,0'
		// }, 50);

	}

	function updateMeters(){

		meters_auto = setInterval(function(){

			total_meters++;

			meters_num.html(total_meters);

		},CONFIG.SPEED);
	}

	function connectSocket() {

		var transportsAry = !!window.WebSocket ? ["websocket"] : ["polling"];

		socket = io.connect(IO_URL + roomId, {
			"transports": transportsAry
		});

		socket.on('connect', function() {
			console.log("conected!!!");

			socket.on('info', function(data) {
				console.log("response from server:" + data);
			});

			socket.on('disconnect', function() {
				console.log("断开连接");
			});

			socket.on('userInfo', function(msg) {
				console.log(msg);

				oUserInfo = $.parseJSON(msg);
			});

			socket.on('update', function(msg) {

				updateAngles(msg);

			});

			socket.on('confirm', function(data) {

				if (!isBeginTime) {

					gameTimeBegin();
					isBeginTime = true;

				}

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

				$('.game3-arrow').hide();

				$('#bucket,#bucket_end').animate({translate3d:metersX*(1+0.3)+'px,200px,0'}, 5000, 'easeIn', function(){

					delay(function(){

						share.fadeIn('fast');

					}, 500)
					
				});

				!isEnd && Game.gameOver();
			});

		});

		socket.on('error', function(e) {
			console.log(e);
		});

	}

	//绑定touch事件
	function bindTouchEvent() {

		if (isLeft) {

			arrow_top.click(turnUp);
			arrow_bottom.click(turnDown);

		} else {

			arrow_top.click(turnDown);
			arrow_bottom.click(turnUp);
		}



		function turnUp() {

			if (isEnd) {
				return;
			}

			socket.emit("up");

		}

		function turnDown() {

			if (isEnd) {
				return;
			}

			socket.emit("down");
		}


	}

	//绑定断开连接页面确定按钮
	function bindExitSure() {

		exit_sure.click(function() {

			location.href = API.game3Src;
		});
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

	//提交中奖qq
	function bindSubmitQQ() {

		var flag = true,
			reg = /\d+/;

		price_submit.click(function() {

			var qq = $('#price_qq').val();

			if (!reg.test(qq)) {

				Pub.showTips("请输入正确的QQ号！");
				return;
			}

			if (!flag) {
				return;
			}

			flag = false;

			$.ajax({

				url: API.submitPriceQQ,

				type: 'post',

				data: {
					qq: qq,
					t: 3
				},

				success: function(d) {

					var data = typeof d === "string" ? $.parseJSON(d) : d;

					if (data.err === 0) {

						Pub.showTips("提交成功！", function() {

							$('#price').fadeOut('fast');
						});

					} else {

						Pub.showTips(data.msg);
					}

					flag = true;
				},

				error: function() {

					Pub.showTips('请求错误', function() {

						location.href = API.home
					});
				}

			});
		});

		game_price.click(function() {

			share_tips.fadeIn('fast');
		});

		noprice_sure.click(function() {

			no_price.fadeOut('fast');
		});

		plantform.click(function() {

			pubcode.fadeIn('fast');
		});

		pubcode.click(function() {

			$(this).fadeOut('fast');
		});

		full_sure.click(function(){

			location.href = API.game2Src;
		});

		share_tips.click(function(){

			$(this).fadeOut('fast');
		});

	}


	function init() {

		time_leave.html(CONFIG.time);

		pubShare({

			content: Share.content3
		});

		setRoomId();

		bindExitSure();

		loadImg();

		bindSubmitQQ();

		bindTouchEvent();

		forbTouchMove();

	}

	init();

});
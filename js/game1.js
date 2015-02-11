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
		full = $('#full'),
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
		full_sure = $('#full_sure'),
		myname = $('#myname'),
		myhead = $('#myhead'),
		oname = $('#oname'),
		ohead = $('#ohead'),
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

		time: 60,

		// time: 20,

		sawCount: 4,

		sawTimes: GAME1_TIMES,

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
		isBeginTime = false,
		imgArr = ImgArr.arr1,
		IO_URL = socketUrl;

	var Game = {

		startGame: function() {

			code.hide();

			this.beginTime();

			pubShare({

				content: Share.content1
			});

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

			var content = userInfo.nickname + '和' + oUserInfo.nickname + '在' + CONFIG.time + '秒内锯断' + tree_total_num + '棵大树，快来一起玩，看看你和谁锯有默契！';

			isEnd = true;

			pubShare({

				content: content
			});

			share_num.html(tree_total_num);

			share_score.html(getScores());

			if(userInfo.head == ''){
				userInfo.head = API.defaultHead;
			}

			if(oUserInfo.head == ''){
				oUserInfo.head = API.defaultHead;
			}

			myname.html(userInfo.nickname);
			oname.html(oUserInfo.nickname);
			myhead.attr('src', userInfo.head);
			ohead.attr('src', oUserInfo.head);

			share.fadeIn('fast');
		},

		restartGame: function() {

			isEnd = false;
			isBeginTime = false;
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
			arrow.css({
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

		var c = G_roomid,
			href = location.href,
			url = href.indexOf('?') > 0 ? href + '&chat=' + c : href + '?chat=' + c;

		if (roomId == null || roomId.length < 10) {

			// clickTestCode(url); //测试用
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

				fullRoom();

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

	// 房间已满
	function fullRoom() {

		loading.hide();
		full.fadeIn('fast');
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

			location.href = API.game1Src;
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
					arrow.css({
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


			X = 70;
		} else {


			X = -70;
		}

		sawY += 8;

		arrow.animate({

			translate3d: X + 'px,' + sawY + 'px,0'

		}, 300, 'easeIn');

		saw.animate({

			translate3d: X + 'px,' + sawY + 'px,0'

		}, 300, function() {

			isTouch = true;

			if (arrow.hasClass(CONFIG.sawLangClass)) {

				arrow.removeClass(CONFIG.sawLangClass);

			} else {

				arrow.addClass(CONFIG.sawLangClass);

			}

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

				data: {
					qq: qq,
					type: 1
				},

				success: function(d) {

					var data = typeof d === "string" ? $.parseJSON : d;

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

			location.href = API.game1Src;
		});

		share_tips.click(function(){

			$(this).fadeOut('fast');
		});

	}


	function init() {

		time_leave.html(CONFIG.time);

		pubShare({

			content: Share.content1
		});

		setRoomId();

		if (isLeft) {

			imgArr = imgArr.concat(ImgArr.arr1_left);

		} else {
			imgArr = imgArr.concat(ImgArr.arr1_right);
		}


		bindExitSure();

		loadImg();

		bindSubmitQQ();

		bindTouchEvent();

		forbTouchMove();

	}

	init();

});
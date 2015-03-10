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
		full_sure = $('#full_sure'),
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
		audio_over = $('#audio_over')[0],
		audio_drop = $('#audio_drop')[0],
		audio_anger = $('#audio_anger')[0],
		audio_click = $('#audio_click')[0];

	var playImgArr = [

		'images/game3/show/show1.png',
		'images/game3/show/show2.png',
		'images/game3/show/show3.png',
		'images/game3/show/show4.png',
		'images/game3/show/show5.png',
		'images/game3/show/show6.png',
		'images/game3/show/show7.png'
	];

	var CONFIG = {

		duration: 800,

		time: 60,

		sawCount: 4,

		SPEED: 600,

		rightClass: 'bg-r',

		linkClass: 'link-sure2',

		bucket: 'game3-bucket2',

		bgAniClass : 'wrapper-bg-ani'
	};

	var socket,
		time_number = CONFIG.time,
		whole_angle = 0,
		total_meters = 0,
		meters_auto = 0,
		score_count = 0,
		show_count = 0,
		metersX = 0,
		roomId = Pub.getUrlParam('chat'),
		isLeft = false,
		isTouch = true,
		isTreeFade = false,
		isEnd = false,
		isLink = false,
		isLoad = false,
		isBeginTime = false,
		imgArr = ImgArr.arr3,
		IO_URL = socketUrl,
		bucket_sp;

	var Game = {

		beginTimeAuto: 0,

		startGame: function() {

			code.hide();

			this.beginTime();

			$('#wrapper_bg').addClass(CONFIG.bgAniClass);

			pubShare({

				content: Share.content3
			});

			restart.tap(function() {

				// socket.emit('replay');

				// $(this).unbind('tap');
				location.href = API.home;
			});

		},

		beginTime: function() {

			Game.beginTimeAuto = setInterval(function() {

				time_number--;

				time_leave.html(formatInt(time_number));

				if (time_number <= 0) {

					clearInterval(Game.beginTimeAuto);
				}

			}, 1000);

		},

		gameOver: function() {

			var content = userInfo.nickname + '和' + oUserInfo.nickname + '在山路上担水前进' + total_meters + '米，快来一起玩，看看你和谁可以心灵相“桶”！';

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
			share_num.html(total_meters);
			share_score.html(getScores());
			clearInterval(meters_auto);
			$('#wrapper_bg').removeClass(CONFIG.bgAniClass);

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

			$('.game3-arrow, .game3-meters').show();
			bucket.removeClass(CONFIG.bucket).css({
				'display': 'block'
			});
			$('#bucket_ani').css({
				'display': 'none',
				'background-position': '0 0'
			});

			initShowAnimation();

			initShowStep();

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

		$('#code_box').tap(function() {

			window.open(url, 'blank');
		});
	}

	//设置房间id
	function setRoomId() {

		var c = G_roomid,
            href = location.href,
            mainUrl = location.search === '' ? href : href.substring(0,href.indexOf(location.search)),
            url = mainUrl+"?chat="+c;
            // url = API.game3Src+"?chat="+c;
        
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

	function initShowAnimation() {

		show_count = 0;

		$('#link_show').attr('src', playImgArr[0]);
	}

	//播放游戏演示
	function playShowAnimation() {

		show_auto = setInterval(function() {

			var src = playImgArr[show_count];

			$('#link_show').attr('src', src);

			show_count++;

			if (show_count >= playImgArr.length) {

				show_count = 0;
			}


		}, 800);
	}

	//播放步骤
	function showPlayStep() {

		var w = 750,
			showEnd = false,
			showAni = false,
			a, b, c, d;

		a = setTimeout(function() {

			showAni = true;

			$('#code_show_box').animate({
				translate3d: -w + 'px,0,0'
			}, 600, 'easeIn', function() {

				showAni = false;
			});

		}, 2500);

		b = setTimeout(function() {

			$('.code-show-m1').animate({
				translate3d: '70px,0,0',
				rotate: '20deg'
			});

			c = setTimeout(function() {

				$('.code-show-m2').animate({
					translate3d: '-70px,0,0',
					rotate: '-20deg'
				});

			}, 500);

		}, 5000);

		d = setTimeout(function() {

			showAni = true;

			$('#code_show_box').animate({
				translate3d: -w * 2 + 'px,0,0'
			}, 600, 'easeIn', function() {

				showAni = false;
			});

		}, 6500);


		$('.code-show-know').tap(function() {

			if (showAni) {
				return;
			}

			// $.fx.off = true;

			clearTimeout(a);
			clearTimeout(b);
			clearTimeout(c);
			clearTimeout(d);

			$(this).unbind('tap');


			$('#code_show_box').css({
				'-webkit-transform': 'translate3d(-1500px,0,0)'
			});

		});

		$('.code-show-reknow').tap(function() {

			$(this).unbind('tap');

			replayShowStep();
		});

	}

	function initShowStep() {

		// $.fx.off = false;

		$('#code_show_box').css({
			'-webkit-transform': 'translate3d(0,0,0)'
		});

		$('.code-show-m1,.code-show-m2').css({
			'-webkit-transform': 'translate3d(0,0,0) rotate(0)'
		});


	}

	function replayShowStep() {

		initShowStep();

		showPlayStep();
	}

	//显示链接成功
	function showConnectSuccess() {

		code.hide();

		link.show();

		playShowAnimation();

		link_sure.tap(function() {

			socket.emit('confirm', JSON.stringify(userInfo));

			$(this).addClass(CONFIG.linkClass);

			$(this).unbind('tap');

		});

	}

	//开始游戏倒计时
	function gameTimeBegin() {

		clearInterval(show_auto);

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

	function updateAngles(ang, t) {

		var rot = ang,
			tra = rot * Math.abs(rot) * 0.3;

		metersX = tra;

		if (Math.abs(rot) >= 8) {

			danger.show();

			audio_anger.play();

		} else {

			danger.hide();
		}

		total_meters = parseInt(t / 800);

		meters_num.html(total_meters);

		// stick.animate({rotate:rot+'deg'},10);

		stick.css('-webkit-transform', 'rotate(' + rot + 'deg)');

		bucket.css('-webkit-transform', 'translate3d(' + tra + 'px,0,0)');

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

				var m = msg.match(/(.+),(.+)/),
					ang = m[1],
					t = m[2];

				whole_angle = ang;

				updateAngles(ang, t);

			});

			socket.on('confirm', function(data) {

				if (!isBeginTime) {

					gameTimeBegin();
					isBeginTime = true;

				}

			});

			socket.on('exit', function(data) {

				console.log('exit');
				if(isEnd){
					return;
				}
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

				var endX = metersX > 0 ? 500 : -500,
					endX2 = metersX > 0 ? 520 : -520,
					rot = isLeft ? 5 : -4,
					eRot = metersX < 0 ? -13 : 13;

					console.log("gameover:"+data);

				if(data === '1'){

					$('#share_mask').show();

					share.fadeIn('fast',function(){

						delay(function(){

							$('#share_mask').hide();
						},1000);
					});
					audio_over.play();

					!isEnd && Game.gameOver();
					return;

				}

				if ((isLeft && metersX < 0) || (!isLeft && metersX > 0)) {

					$('.game3-arrow, .game3-meters').hide();

				}

				stick.css({
					'-webkit-transform': 'rotate(' + eRot + 'deg)'
				});

				bucket.animate({

					translate3d: endX + 'px,0,0'

				}, 800, 'cubic-bezier(0.15, 0, 1.0, 1.0)', function() {

					bucket.addClass(CONFIG.bucket).animate({

						translate3d: endX2 + 'px,150px,0',
						rotate: rot + 'deg'

					}, 600, 'cubic-bezier(0, 0, 0.15, 1.0)', function() {

						audio_drop.play();

						if ((isLeft && metersX < 0) || (!isLeft && metersX > 0)) {

							$('#bucket_ani').css({
								'display': 'block'
							});
						}

						bucket.css({
							'display': 'none'
						});

						bucket_sp.init();

					});

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

		var up,down;

		if (isLeft) {

			arrow_top.tap(turnUp);
			arrow_bottom.tap(turnDown);

		} else {

			arrow_top.tap(turnDown);
			arrow_bottom.tap(turnUp);
		}



		function turnUp(e) {

			var arrowClass,
				self = this;

			if (isEnd) {
				return;
			}

			if(whole_angle>0){

				if(this === arrow_top[0]){

					arrowClass = 'arrow-top-red';
				}else{
					arrowClass = 'arrow-bottom-red';
				}
			}else{

				if(this === arrow_top[0]){

					arrowClass = 'arrow-top-green';
				}else{
					arrowClass ='arrow-bottom-green';
				}
			}

			$(this).addClass(arrowClass);


			e.preventDefault();

			audio_click.play();

			$(this).animate({scale:1.2}, 200, 'easeOut', function(){

				$(this).css({'-webkit-transform':'scale(1)'});
				$(this).removeClass(arrowClass);
			});

			socket.emit("up");

		}

		function turnDown(e) {

			var arrowClass,
				self = this;

			if (isEnd) {
				return;
			}

			if(whole_angle>0){

				if(this === arrow_top[0]){

					arrowClass = 'arrow-top-green';
				}else{
					arrowClass = 'arrow-bottom-green';
				}
			}else{

				if(this === arrow_top[0]){

					arrowClass = 'arrow-top-red';
				}else{
					arrowClass ='arrow-bottom-red';
				}
			}

			$(this).addClass(arrowClass);


			e.preventDefault();

			audio_click.play();

			$(this).animate({scale:1.2}, 200, 'easeOut', function(){

				$(this).css({'-webkit-transform':'scale(1)'});
				$(this).removeClass(arrowClass);
			});

			socket.emit("down");
		}


	}

	//绑定断开连接页面确定按钮
	function bindExitSure() {

		exit_sure.tap(function() {

			location.href = API.game3Src;
		});
	}


	// 计算最后得分
	function getScores() {

		var scores = parseInt((100 / CONFIG.time) * (total_meters * 0.8));

		if (scores >= 100) {
			scores = 99;
		}

		if (scores <= 10) {

			scores = 10;
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

		$('body').bind('touchend', function(e) {

			if(e.target.id == 'price_qq' || e.target.className.indexOf('game-detail')>=0){
				return;
			}
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

			showPlayStep();

			loading.fadeOut('fast');
		}

	}

	//提交中奖qq
	function bindSubmitQQ() {

		var flag = true,
			reg = /\d+/;

		price_submit.tap(function() {

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

		game_price.tap(function() {

			share_tips.fadeIn('fast');
		});

		noprice_sure.tap(function() {

			no_price.fadeOut('fast');
		});

		plantform.tap(function() {

			pubcode.fadeIn('fast');
		});

		pubcode.tap(function() {

			$(this).fadeOut('fast');
		});

		full_sure.tap(function() {

			location.href = API.game2Src;
		});

		share_tips.tap(function() {

			$(this).fadeOut('fast');
		});

	}

	function setBucketSprite() {

		var src = isLeft ? 'images/game3/bucket_left.png' : 'images/game3/bucket_right.png',
			width = isLeft ? 569 : 577,
			height = isLeft ? 432 : 425;

		var image = new Image();

		image.src = src;
		
		bucket_sp = new Sprite($('#bucket_ani')[0], {

			width: width,
			height: height,
			lang: 'y',
			count: 6,
			isOne: true,
			url: src,
			time: 180,
			result: function() {

				delay(function() {

					$('#share_mask').show();

					share.fadeIn('fast',function(){

						delay(function(){

							$('#share_mask').hide();
						},1000);
					});
					audio_over.play();
				}, 800);

			}
		});
	}


	function init() {

		time_leave.html(CONFIG.time);

		pubShare({

			content: Share.content3
		});

		setRoomId();

		if (isLeft) {

			imgArr = imgArr.concat(ImgArr.arr3_left);

		} else {

			imgArr = imgArr.concat(ImgArr.arr3_right);
		}

		setBucketSprite();

		bindExitSure();

		loadImg();

		bindSubmitQQ();

		bindTouchEvent();

		forbTouchMove();

	}

	init();

});
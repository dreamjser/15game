define(['zepto'], function() {

	var SPEED = 400,
		EASING = 'easeIn',
		ani = false;

	function doAni(node, css, next, nextTime) {

		next = next || function() {};
		nextTime = nextTime || 0;

		node.css(css).animate({
			translate3d: '0,0,0',
			opacity: 1

		}, SPEED, EASING);


		nextTime && delay(next, nextTime);
	}

	//圆形倒计时
	function circleAni() {

		$(".pie1").animate({
			rotate: '180deg'
		}, 500, function() {

			$(".pie2").animate({
				rotate: '180deg'
			}, 500, function() {

				result(function() {

					result();
				});
			});
		});

		function result(callback) {

			callback = callback ? callback : function() {};

			$('.pie').css({
				'-webkit-transform': 'rotate(0)'
			});

			$(".pie1").animate({
				rotate: '180deg'
			}, 500, function() {

				$(".pie2").animate({
					rotate: '180deg'
				}, 500, callback);
			});
		}

	}

	function showTips(tips, result){

		var div=document.createElement('div'),
			winW=$(window).width(),
			winH=$(window).height();

		if(ani){
			return;
		}

		div.className="pub-tips";
		div.innerHTML=tips;

		$('body').append($(div));

		$(div).css({left:(winW-$(div).width())/2,top:winH});

		

		ani = true;

		$(div).animate({'translate3d':'0,-200px,0'},'ease-out',500,function(){

			setTimeout(function(){

				$(div).remove();
				ani = false;

				result && result();

			},500);

		});
	}

	function delay(result, time) {

		setTimeout(result, time);
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


	return {

		SPEED: SPEED,

		delay: delay,

		ani: doAni,

		getUrlParam: getUrlParam,

		circleAni: circleAni,

		showTips : showTips
	}

});
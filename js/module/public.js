define(['zepto'], function() {

	var SPEED = 400,
		EASING = 'easeIn';

	function ani(node, css, next, nextTime) {

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

		ani: ani,

		getUrlParam: getUrlParam,

		circleAni: circleAni
	}

});

define(['zepto'], function() {

	var SPEED = 900,
		EASING = 'easeOut';

	function ani(node, css, next, nextTime) {

		next = next || function() {};
		nextTime = nextTime || 0;

		node.css(css).animate({
			translate3d: '0,0,0',
			opacity: 1

		}, SPEED, EASING);

		nextTime && delay(next, nextTime);
	}

	function delay(result, time) {

		setTimeout(result, time);
	}

	return{

		SPEED : SPEED,

		delay : delay,

		ani : ani
	}

});
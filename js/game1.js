require.config({
	baseUrl: 'js',
	paths: {
		"zepto": 'lib/zepto',
		"public": 'module/public',
		"api": 'module/api'
	},
	shim: {

		'zepto': {

			exports: 'Zepto'
		}
	}

});
require(['zepto', 'public', 'api'], function($, Pub, Api) {

	var SPEED = Pub.SPEED/3,
		ANI_time = 500,
		delay = Pub.delay,
		doAni = Pub.ani;


	function init() {

		
	}

	init();

});
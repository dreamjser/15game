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

	

}); 
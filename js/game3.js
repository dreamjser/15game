require.config({
	baseUrl : 'js',
	paths : {
		"zepto"  : 'lib/zepto',
		"public" : 'module/public',
		"api"    : 'module/api'
	},
	shim : {

		'zepto' : {

			exports: 'Zepto'
		}
	}
	
});
require(['zepto','public','api'], function($, Pub, Api) {

	

}); 

(function(window) {

	var API = { },
		//是否未测试环境
		test = false;

	// socket地址
	API.socketUrl = '116.213.76.9:7000/?chat=';

	if(test){

		//中奖
		API.getPrice = 'json/getPrice.json';
		//提交中奖QQ
		API.submitPriceQQ = 'json/getPrice.json';

	}else{

		//中奖
		API.getPrice = 'http://15.qq.com/price';
		//提交中奖QQ
		API.submitPriceQQ = 'http://15.qq.com/price/commit';
	}

	// 分享配置
	var Share = {};

	Share.imgUrl = '';
	Share.title = '创造精彩人生，你需要一个“锯”有默契的伙伴！';
	Share.content = '我们15个理想生活养成记';


	window.API = API;
	window.Share = Share;

})(window);
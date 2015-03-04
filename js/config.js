 (function(window) {

	var API = {},
		//是否未测试环境
		test = false,

		GAME1_TIMES = 75;

	API.home = 'http://15.qq.com/game';

	API.game1Src = 'http://15.qq.com/game/jumutou';

	API.game3Src = 'http://15.qq.com/game/tong';

	API.defaultHead = 'images/head.jpg';

	if (test) {
		//中奖
		API.getPrice = 'json/getPrice.json';
		//提交中奖QQ
		API.submitPriceQQ = 'json/getPrice.json';

	} else {

		//中奖
		API.getPrice = 'http://15.qq.com/price';
		//提交中奖QQ
		API.submitPriceQQ = 'http://15.qq.com/price/commit';
	}

	// 分享配置
	var Share = {};

	Share.imgUrl = 'http://1251063774.cdn.myqcloud.com/1251063774/game/images/share.jpg';
	
	Share.title = '我们15个理想生活养成记';

	//首页分享
	Share.content = '《我们15个》官方双屏协作游戏，带你实现另一种可能！';
	//锯木头分享内容
	Share.content1 = '创造精彩人生，你需要一个“锯”有默契的伙伴！';
	// 采水果
	Share.content2 = '谁能与你鼓起勇气挑战未知，谁和你“果”然合拍？';
	//水桶分享内容
	Share.content3 = '路途艰辛，你们只能“桶”一步调，坚韧前行！';

	//loading图片
	var ImgArr = {};

	// 首页图片
	ImgArr.arr = [

		'images/index/index_bg.jpg',
		'images/index/index_all.png',
		'images/index/truck.png',
		'images/index/price.png',
		'images/index/index_online.png'

	];

	// game1图片
	ImgArr.arr1 = [
		'images/game1/game1_bg.jpg',
		'images/public.png',
		'images/public_code.png',
		'images/game1/game1_show.png',
		'images/game1/show/show1.png',
		'images/game1/show/show2.png',
		'images/game1/show/show3.png',
		'images/game1/show/show4.png'
	];
	// game1 left
	ImgArr.arr1_left = [

		'images/game1/game1_bg.jpg',
		'images/game1/tree_left.png',
		'images/game1/mx.png'
	];
	// game1 right
	ImgArr.arr1_right = [

		'images/game1/game1_bg_r.jpg',
		'images/game1/tree_right.png',
		'images/game1/mx2.png'
	];

	// game1图片
	ImgArr.arr3 = [
		
		'images/game3/game3.png',
		'images/public.png',
		'images/public_code.png',
		'images/game3/show/show1.png',
		'images/game3/show/show2.png',
		'images/game3/show/show3.png',
		'images/game3/show/show4.png',
		'images/game3/show/show5.png',
		'images/game3/show/show6.png',
		'images/game3/show/show7.png'
	];

	// game3 left
	ImgArr.arr3_left = [

		'images/game3/game3_bg.jpg'
	];
	// game3 right
	ImgArr.arr3_right = [

		'images/game3/game3_bg_r.jpg'
	];


	window.API = API;
	window.Share = Share;
	window.ImgArr = ImgArr;
	window.GAME1_TIMES = GAME1_TIMES;

})(window);
define(['zepto','wx'], function($, wx) {

	var _ = this,
		href = document.location.href,
		path = href.substr(0, href.lastIndexOf('/')),
		src = path + '/images/share.jpg',
		imgUrl = Share.imgUrl,
		lineLink = href,
		descContent = Share.title,
		shareTitle = Share.content;

	wx.config({
		appId: '',
		
		jsApiList: [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'checkJsApi'
			// 所有要调用的 API 都要加到这个列表中
		]
	});

	console.log(Share);

	//获取抽奖结果
	function getPrice(){

		$.ajax({
			
			url: API.getPrice,

			type: 'get',

			success:function(d){

				var data = typeof d === "string" ? $.parseJSON(d) : d;

				// 中奖
				if(data.hit === true){

					$('#price').fadeIn('fast');

				}else{

					$('#no_price').fadeIn('fast');
				}
			}
		});	
	}

	// getPrice();
	
	wx.ready(function () {
		// 在这里调用 API

		wx.onMenuShareAppMessage({
			title: shareTitle,
			desc: descContent,
			link: lineLink,
			imgUrl: imgUrl,
			trigger: function (res) {
				// alert('用户点击发送给朋友');
			},
			success: function (res) {
				
				getPrice();
			},
			cancel: function (res) {
				// alert('已取消');
			},
			fail: function (res) {
				alert(JSON.stringify(res));
			}
		});


		wx.onMenuShareTimeline({
			title: shareTitle,
			link: lineLink,
			imgUrl: imgUrl,
			trigger: function (res) {
				// alert('用户点击分享到朋友圈');
			},
			success: function (res) {
				
				getPrice()
			},
			cancel: function (res) {
				// alert('已取消');
			},
			fail: function (res) {
				alert(JSON.stringify(res));
			}
		});

		/*wx.onMenuShareQQ({
			title: shareTitle,
			desc: descContent,
			link: lineLink,
			imgUrl: imgUrl,
			trigger: function (res) {
				// alert('用户点击分享到QQ');
			},
			complete: function (res) {
				// alert(JSON.stringify(res));
			},
			success: function (res) {
				// alert('已分享');
			},
			cancel: function (res) {
				// alert('已取消');
			},
			fail: function (res) {
				alert(JSON.stringify(res));
			}
		});



		wx.onMenuShareWeibo({
			title: shareTitle,
			desc: descContent,
			link: lineLink,
			imgUrl: imgUrl,
			trigger: function (res) {
				// alert('用户点击分享到微博');
			},
			complete: function (res) {
				// alert(JSON.stringify(res));
			},
			success: function (res) {
				// alert('已分享');
			},
			cancel: function (res) {
				// alert('已取消');
			},
			fail: function (res) {
				alert(JSON.stringify(res));
			}
		});*/

	});

	return{

	}
});
define(['zepto', 'wx', 'public'], function($, wx, Pub) {

	var _ = this,
		href = location.href,
		imgUrl = Share.imgUrl,
		lineLink = href.substring(0, href.indexOf('?') > 0 ? href.indexOf('?') : href.length),
		descContent = Share.content1,
		shareTitle = Share.title;

	wx.config({
		appId: '',

		jsApiList: [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'checkJsApi'
		]
	});

	console.log(Share);
	console.log(lineLink);

	//获取抽奖结果
	function getPrice() {

		$.ajax({

			url: API.getPrice,

			type: 'get',

			success: function(d) {

				var data = typeof d === "string" ? $.parseJSON(d) : d;

				$('#share_tips').fadeOut('fast');

				// 中奖
				if (data.hit === true) {

					$('#price').fadeIn('fast');

				} else {

					$('#no_price').fadeIn('fast');
				}
			},

			error: function() {

				Pub.showTips('请求错误', function() {

					location.href = API.home
				});
			}
		});
	}

	// 在这里调用 API
	function share(config) {

		config = config || {};

		var title = config.title || shareTitle,
			content = config.content || descContent,
			href = config.href || lineLink,
			imgSrc = config.imgUrl || imgUrl;

		console.log(title + "--" + content + "--" + href + "--" + imgSrc);
		
		wx.ready(function() {

			wx.onMenuShareAppMessage({
				title: title,
				desc: content,
				link: href,
				imgUrl: imgSrc,
				trigger: function(res) {
					// alert('用户点击发送给朋友');
				},
				success: function(res) {
					console.log("分享成功！");
					getPrice();
				},
				cancel: function(res) {
					// alert('已取消');
				},
				fail: function(res) {
					alert(JSON.stringify(res));
				}
			});

			
			wx.onMenuShareTimeline({
				title: content,
				link: href,
				imgUrl: imgSrc,
				trigger: function(res) {
					// alert('用户点击分享到朋友圈');
				},
				success: function(res) {
					console.log("分享朋友圈成功！");
					getPrice()
				},
				cancel: function(res) {
					// alert('已取消');
				},
				fail: function(res) {
					alert(JSON.stringify(res));
				}
			});

			/*wx.onMenuShareQQ({
				title: title,
				desc: content,
				link: href,
				imgUrl: imgSrc,
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
				title: title,
				desc: content,
				link: href,
				imgUrl: imgSrc,
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

	}

	return {

		share: share
	}
});
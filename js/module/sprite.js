define([], function() {

	//序列帧动画
	function Sprite(imgNode, config) {

		this.img = imgNode;

		this.url = config.url || [];

		this.time = config.time || 200;

		this.isOne = config.isOne || false;

		this.result = config.result || function() {};

		this.count = config.count || this.url.length;

		this.width = config.width;

		this.height = config.height;

		this.lang = config.lang || 'y'; //x||y

		this.num = 0;

		this.auto = null;

	}

	Sprite.prototype = {

		init: function() {

			this.num = 0;

			this.distance = this.lang == 'y' ? this.height : this.width;

			this.doSprite();

			this.auto = setInterval(this.bind(this, this.doSprite), this.time);

		},

		doSprite: function() {

			if (this.num >= this.count) {

				if (this.isOne) {

					clearInterval(this.auto);

					this.result();

					return;
				}

				this.num = 0;

			}

			// console.log(this.num*this.distance);

			this.img.style.backgroundPosition = this._getBgPosition(this.num * this.distance);

			this.num++;
		},

		_getBgPosition: function(d) {

			// console.log(d);

			if (this.lang === 'x') {

				return -d + "px 0";

			} else {

				return "0px " + (-d) + "px";

			}

		},

		clearSprite: function() {

			clearInterval(this.auto);
		},

		bind: function(obj, handler) {

			return function() {

				return handler.apply(obj, arguments);
			}

		}
	}

	return {

		Sprite: Sprite
	}

});
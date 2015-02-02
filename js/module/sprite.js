
define([], function() {

	//序列帧动画
	function Sprite(imgNode,config){

		this.img = imgNode;

		this.url = config.url || [];

		this.time = config.time || 50;

		this.isOne = config.isOne || false;

		this.result = config.result || function(){};

		this.count = this.url.length;

		this.num = 0;

		this.auto = null;

	}

	Sprite.prototype={

		init : function(){

			this.auto = setInterval(this.bind(this,this.doSprite), this.time);
			
		},

		doSprite : function(){

			if(this.num >=this.count){

				if(this.isOne){

					clearInterval(this.auto);

					this.result();
					
					return;
				}

				this.num = 0;
				
			}

			this.img.src = this.url[this.num];

			this.num++;
		},

		clearSprite : function(){

			clearInterval(this.auto);
		},

		bind : function(obj, handler){

			return function(){

				return handler.apply(obj,arguments);
			}

		}
	}

	return{

		Sprite : Sprite
	}

});
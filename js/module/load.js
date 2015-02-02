define([], function() {
	
	/*
	 * @desc 图片预加载
	 * @param object confing{imageList:array,loading:boolean,success:function}
	 */
	var ImageLoad=function(confing){
		
		this.load=confing.load || null;
		this.imageList=confing.imageList||[];
		this.loading=confing.loading||true;
		this.success=confing.success||function(){};
		
	}
	
	ImageLoad.prototype={
		//加载图片计数
		_count:0,
		
		init:function(){
			var self=this,
				imageList=this.imageList,
				loading=this.loading;
				
			this.wrapper=loading?this._createLoading():null;
			
			for(var i=0,len=imageList.length;i<len;i++){
				var image=new Image(),
					src=imageList[i];
					
				image.onload=this.bind(self,this._loadHandler);
				image.src=src;
				
			}
		},
		//图片加载函数
		_loadHandler:function(){
			this._count++;
			if(this.wrapper){
				var percent=parseInt(this._count/this.imageList.length*100)+"%";
				this._loadingProgress(percent);
			}
			if(this._count>=this.imageList.length){
				this.success();
				if(this.wrapper){
					document.body.removeChild(this.wrapper);
				}
			}
		},
		//加载中
		_loadingProgress:function(percent){
			var line=document.getElementById('sui_loading_line'),
				perc=document.getElementById('sui_loading_percent');
			line.style.width=percent;
			perc.innerHTML=percent;
		},
		//创建加载元素
		_createLoading:function(){

			var winH=document.documentElement.clientHeight,
				wrapper=this.load,
				html='';
			// wrapper.className='sui-loading-wrapper';
			
			html+='<div class="sui-loading-mask"></div>';
			html+='<div class="sui-loading-progress">';
			html+='<div id="sui_loading_line" class="sui-loading-line"></div>';
			html+='<p id="sui_loading_percent" class="sui-loading-percent"></p>';
			html+='</div>';
			
			// document.body.appendChild(wrapper);
			wrapper.innerHTML=html;
			wrapper.style.height=winH+"px";
			
			return wrapper;
		},
		
		bind:function(obj,handler){
			return function(){
				return handler.apply(obj,arguments);
			}
		}	
	}

	return {

		load : ImageLoad
	}
})


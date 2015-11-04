(function(){
	function pageMusic(url,pos,opt){
		var audioStatus = false,audio = null,element = null,initFlag = false,eventName = "ontouchend" in document ? 'touchstart':'click',params = {};
		
		var default_option = {
			on:'http://zj.sinaimg.cn/zj_2015/summerholiday2015/images/music_on.png',
			off:'http://zj.sinaimg.cn/zj_2015/summerholiday2015/images/music_off.png',
			w:'45',
			h:'45',
			size:23
		}
		opt = opt || {};
		for (var key in default_option) {
			params[key] = opt[key] || default_option[key];
		}
		pos = pos || {};
		//init
		createHTML(pos,params);
		createAudio(url);
		bindEvent();
		document.addEventListener(eventName,play,false);
		
		function createHTML(pos,img){
			var posStr = '',htmlStr = '';
			
			for (var key in pos){
				posStr += key+':'+pos[key]+';'
			}
			if(posStr == ''){posStr = 'left:0;top:0;';}
			
			htmlStr='<style>.musiccontrol {position: absolute;width: '+img.w+'px;height: '+img.h+'px;z-index: 20;'+posStr+'}.off {background: url('+img.off+') no-repeat center center;background-size: '+img.size+'px;}.on {background: url('+img.on+') no-repeat center center;background-size: '+img.size+'px;}</style><div id="musicPlay" class="musiccontrol off"></div>';
			var div = document.createElement('div');
			div.innerHTML = htmlStr;
			document.body.appendChild(div);
		}
		
		function createAudio(url){
			audio = document.createElement("audio");
			audio.src = url;
			audio.loop = 'loop';
			audio.play();
			audio.addEventListener("playing",setState,false);
		}
		
		function setState(){
			if (audioStatus){
				return;
			}else{
				audioStatus = true;
				initFlag = true;
				element.className = 'musiccontrol on';
				audio.removeEventListener("playing",setState,false)
			}
		}
		
		function bindEvent(){
			element = document.getElementById('musicPlay');
			element.addEventListener(eventName,_play,false);
		}
		
		function play(){
			if (initFlag){
				document.removeEventListener(eventName,play,false);
			}else{
				initFlag = true;
				_play();
			}
		}
		
		function _play(){
			if (audioStatus){
				audioStatus = false;
				audio.pause();
				audio.currentTime = 0.0;
				element.className = 'musiccontrol off';
			}else{
				audioStatus = true;
				audio.play();
				element.className = 'musiccontrol on';
			}
		}
	}
	window.pageMusic = pageMusic;
})(window);
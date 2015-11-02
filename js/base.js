//requestAnimationFrame兼容写法
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // webkit中此取消方法的名字变�?
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

//事件兼容
var eventStr = "ontouchend" in document ? 'mousedown' : 'touchstart';
var CLICK = "ontouchend" in document ? 'click' : 'touchend';
var eventMove = "ontouchend" in document ? 'mousemove' : 'touchmove';


//手机检�?
var isMobile = {
    Android: function() {
    return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
	
    return navigator.userAgent.match(/iPhone|ipad|iPod/i) ? true : false;
    },
    Windows: function() {
    return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

//基础工具命名空间
var baseTools = baseTools || {};
//检测下命名空间，略~

baseTools.getElementsByClass = function(node,classname){
	if (node.getElementsByClassName) {
		return node.getElementsByClassName(classname);  //高级浏览器已经支持getElementsByClassName�?
	} else {
		return (function getElementsByClass(searchClass,node) {
			if ( node == null ) node = document;
			
			var classElements = [],
			els = node.getElementsByTagName("*"),
			elsLen = els.length,
			pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;

			for (i = 0, j = 0; i < elsLen; i++) {
				if ( pattern.test(els[i].className) ) {
					classElements[j] = els[i];
					j++;
				}
			}
			return classElements;
		})(classname, node);
	}
}
baseTools.hasClass = function(obj, cls) { 
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));  
}  
baseTools.addClass = function(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;  
}

baseTools.removeClass = function(obj, cls) {
    if (this.hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}
//事件绑定
baseTools.event = {
	bind : function(element, eventType, handler, capture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }
        if (typeof capture != "Boolean") {
            capture = false;
        }

        if (element.addEventListener) {
            element.addEventListener(eventType, handler, capture);
        }
        else if (element.attachEvent) {
            if (capture) {
                element.setCapture();
            }
            element.attachEvent("on" + eventType, handler);
        }
        else {
            element["on" + eventType] = handler;
        }
    },
	unbind : function(element, eventType, handler, releaseCapture) {
        if (typeof element == "string") {
            element = document.getElementById(element);
        }

        if (typeof releaseCapture != "Boolean") {
            releaseCapture = false;
        }

        if (element.removeEventListener) {
            element.removeEventListener(eventType, handler, releaseCapture);
        }
        else if (element.detachEvent) {
            if (releaseCapture) {
                element.releaseCapture();
            }

            element.detachEvent("on" + eventType, handler);
        }
        else {
            element["on" + eventType] = null;
        }
    },
	cancelBubble : function(e) {  //冒泡处理
        e = e || window.event;

        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true; //IE
        }
    },
	stopDefault : function(e){
		//阻止默认浏览器动�?(W3C) 
		if ( e && e.preventDefault ) {
			e.preventDefault(); 
		}
		else{//IE中阻止函数器默认动作的方�?
			window.event.returnValue = false; 
		}
		return false; 
	}
}

//获取currentStyle
baseTools.getcss = function(dom){
	return dom.currentStyle || document.defaultView.getComputedStyle(dom, null);
}
//页面高度
baseTools.getbodyCH = function(){var bh=document.body.clientHeight;var eh=document.documentElement.clientHeight;if(bh>eh){return bh}else{return eh}}
//屏幕高度
baseTools.showbodyCH = function(){if(window.innerHeight){return window.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){return document.documentElement.clientHeight;}else if(document.body){return document.body.clientHeight;}}
//屏幕宽度
baseTools.getbodyCW = function(){var bw=document.body.clientWidth;var ew=document.documentElement.clientWidth;if(bw>ew){return bw}else{return ew}}
//滚动条高�?
baseTools.scrolltop = function(){if(window.pageYOffset){return window.pageYOffset;}else if(document.documentElement&&document.documentElement.scrollTop){return document.documentElement.scrollTop;}else if(document.body){return document.body.scrollTop;}}


/*图片加载*/
var loadImage = function (url, callback) {
	var img = new Image();
	img.src = url;
	if (img.complete) {
		callback.call(img);
		return img;
	};
	img.onload = function () {
		callback.call(img);
	};
	img.onerror = function (){
		callback.call(img);
		console.log('load fail:'+url);
	};
	return img;
};

var imgLoad = function (srcs, callback) {
	var srcs = srcs || [];
	var len = srcs.length;
	if (len < 1) return;
	//记录加载长度
	var loadNum = 0,loading_p = 0,imgElements = [];
	var loading = function(){
		if (loadNum < len){
			loading_p = Math.ceil(100 * loadNum / len);
			callback && callback(loading_p);
		}else{
			loading_p = '100';
			callback && callback(loading_p,imgElements);
		}
	}
	for (var i=0;i<len;i++){
		var _src = srcs[i];
		imgElements.push(loadImage(_src, function (img) {
			loadNum++;
			loading();
		}))
	}
};

//帧动画实�?
var Sprite = function(img,cxt,fps,w,h,params){
	if (img instanceof Array && img.length > 1){
		this.type = 'images';
		this.index = 0;
		this.dw = params.dw || w;
		this.dh = params.dh || h;
		this.startX = params.startX || 0;
		this.startY = params.startY || 0;
		this.x = params.x || 0;
		this.y = params.y || 0;
	}else{
		this.type = 'sprite';
		this.animation = new Animation(params,w,h);
	}
	this.img = img;
	this.loop = !!params.loop;
	this.cxt = cxt;
	this.interval = 1000/fps;
	
	this.w = w || 0;
	this.h = h || 0;
	this.cb = params.cb || function(){};
	this.timer = null;
	this.update = this.update.bind(this);
}

Sprite.prototype = {
	draw : function(){
		this.cxt.clearRect(0,0,this.dw, this.dh);
		if (this.type == 'images'){
			this.cxt.drawImage(this.img[this.index], this.startX, this.startY, this.w, this.h, this.x, this.y, this.dw, this.dh);
		}
		if (this.type == 'sprite'){
			var frame = this.animation.current;
			
			this.cxt.drawImage(this.img, frame.x, frame.y, frame.w, frame.h, this.x, this.y, frame.dw, frame.dh);
		}
	},
	move : function(x, y) {
		this.x = x;
		this.y = y;
	},
	update : function(){
		this.draw();
		if (this.type == 'images'){
			if (this.index + 1 >= this.img.length){
				this.index = 0;
				if (!this.loop){
					this.stop();
				}
			}else{
				this.index++;
			}
		}
		if (this.type == 'sprite'){
			if (!this.animation.next()){
				this.stop();
			}
		}
	},
	stop : function(){
		clearInterval(this.timer);
		this.timer = null;
		typeof this.cb == 'function' && this.cb();
	},
	reset : function(){
		this.type == 'sprite' && this.animation.reset();
		if (this.type == 'images'){
			this.index = 0;
		}
		//this.type == 'images' && this.index = 0
	},
	play : function(){
		this.update();//立即执行后设置循�?
		this.timer = setInterval(this.update,this.interval);
	}
}

var Frame = function(x, y, w, h, dw, dh) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.dw = dw;
	this.dh = dh;
}

var Animation = function(params,width,height){
	this.startX = params.startX || 0;
	this.startY = params.startY || 0;
	this.step = params.step || 1;
	this.sw = params.sw || 0;
	this.sh = params.sh || 0;
	this.width = params.width || params.sw;
	this.height = params.height || params.sh;
	this.dir = params.dir || "right";
	this.loop = !!params.loop;
	this.ls = [];
	this.current = null;
	this.index = -1;
	this.init();
}

Animation.prototype = {
	init : function(){
		for (var i = 0; i < this.step; i++) {
			var x = this.startX + (this.dir == "right" ? i * this.sw : 0);
			var y = this.startY + (this.dir == "down" ? i * this.sh : 0);
			var frame = new Frame(x, y, this.sw, this.sh, this.width, this.height);
			this.ls.push(frame);
		}
		this.index = 0;
		this.current = this.ls[0];
	},
	next : function(){
		if (this.index + 1 >= this.ls.length) {
			if (this.loop) {
				this.current = this.ls[0];
				this.index = 0;
			}else{
				return false;
			}
		} else {
			this.index += 1;
			this.current = this.ls[this.index];
		}
		return true;
	},
	reset : function(){
		this.current = this.ls[0];
		this.index = 0;
	}
}

// 获取地址栏的指定参数
function GetQueryString(str) {
	var tmp = new RegExp("(^|)" + str + "=([^\&]*)(\&|$)", "gi").exec(String(window.location.href));
	return tmp?tmp[2]:'';
}
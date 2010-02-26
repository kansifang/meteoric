/**
 * @author Administrator
 */
!(function(){
    var th = this;
	    th.pageSize = 1000;/* 每屏大概高度为1000px */
	    th.pageQuotiety = 0.5;/* 提前下载量 */
	    th.imgName = "page_cnt_";/* 图片通用名 */
	    th.imgs = [];/* 每屏图片 [每屏所有图片，第一张图片，第一张图片绝对top:加载图片的top] */
		
    var B = {};/* Browser check */
	    B.ua = window.navigator.userAgent.toLowerCase();
	    B.ie = /msie/.test(B.ua);
	    B.moz = /gecko/.test(B.ua);
	    B.opera = /opera/.test(B.ua);
	    B.safari = /safari/.test(B.ua);
	
    var $N = function(s, docu){
        var doc = docu ? docu : document;
        return (typeof s == "object") ? s : doc.getElementsByName(s);
    };
    th.getWindowSize = function(){
        var a = {};
        if (window.self && self.innerWidth) {
            a.width = self.innerWidth;
            a.height = self.innerHeight;
            return a;
        }
        if (document.documentElement && document.documentElement.clientHeight) {
            a.width = document.documentElement.clientWidth;
            a.height = document.documentElement.clientHeight;
            return a;
        }
        a.width = document.body.clientWidth;
        a.height = document.body.clientHeight;
        return a;
    }
    th.getObjPosition = function(obj){
        var a = {};
        a.x = obj.offsetLeft, a.y = obj.offsetTop;
        while (obj = obj.offsetParent) {
            a.x += obj.offsetLeft;
            a.y += obj.offsetTop;
        }
        return a;
    }
    th._getPageScroll = function(){
        var s;
        if (typeof(window.pageYOffset) != "undefined") {
            s = window.pageYOffset;
        }
        else 
            if (document.documentElement && document.documentElement.scrollTop) {
                s = document.documentElement.scrollTop;
            } 
			else 
				if (document.body) {
	                s = document.body.scrollTop;
	            }
        return s;
    }
    th._loadImages = function(a){
        if (!a) 
            return;
        var obj = a;
        if (typeof a == "string") {
            obj = $N(a);
        }
        for (var i = 0; i < obj.length; i++) {
            var s = obj[i];
            if (typeof s == "object") {
                if (s.getAttribute("_src")) {
                    s.setAttribute("src", s.getAttribute("_src"));
                    s.removeAttribute("_src", 0);
                }
            }
        }
        delete obj;
        obj = null;
    }
    th._loadAllImgs = function(){
        var i = 0;
        while (th.imgs[i]) {
            th._loadImages(th.imgs[i][0]);
            i++;
        }
    }
    th.getImgPosition = function(){
        var i = 1;
        var p = $N(th.imgName + i);
        while (p && p.length > 0) {
            var p = $N("page_cnt_" + i);
            var t = th.getImgLoadPosition(p[0]);
            th.imgs.push([p, p[0], t]);
            i++;
            p = $N(th.imgName + i);
        }
    }
    th.getImgLoadPosition = function(a){
        var t = {
            imgTop: 0,
            pageTop: 0
        };
        if (a) {
            var w = th.getWindowSize();
            t.imgTop = parseInt(th.getObjPosition(a).y);
            t.pageTop = parseInt((t.imgTop / 1000 - th.pageQuotiety) * 1000,10);
        }
        return t;
    }
    th._addScrollEven = function(){
        if (B.ie) {
            window.attachEvent("onscroll", th._scrollFn);
        }
        else {
            window.addEventListener("scroll", th._scrollFn, false);
        }
    }
    th._removeScrollEven = function(){
        if (B.ie) {
            window.detachEvent("onscroll", th._scrollFn);
        }
        else {
            window.removeEventListener("scroll", th._scrollFn, false);
        }
    }
    th._scrollFn = function(){
        var y = th._getPageScroll();
        var w = th.getWindowSize().height;
        if (w == 0) {
            th._loadAllImgs();
            return;
        }
        var i = 0;
        var j = 0;
        while (th.imgs[i]) {
            if (!(y + w < th.imgs[i][2].pageTop)) {
                th._loadImages(th.imgs[i][0]);
                j++
            }
            i++;
            if (j >= th.imgs.length) {
                th._removeScrollEven();
            }
        }
    }	
    th.getImgPosition();
    th._addScrollEven();
    th._scrollFn();
})();

/*
 * o2HotButton 1.0.0 - o2js js 
 *
 * Copyright (c) 2009 apeng (http://o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-06-10 14:39:06 $
 * $Rev: 1 $
 */
;(function($){
	jQuery.o2Repair = function(c){
		return Math.max(Math.min( parseInt(c), 255), 0);
	};
	jQuery.o2colors = {
			aqua:[0,255,255],
			azure:[240,255,255],
			beige:[245,245,220],
			black:[0,0,0],
			blue:[0,0,255],
			brown:[165,42,42],
			cyan:[0,255,255],
			darkblue:[0,0,139],
			darkcyan:[0,139,139],
			darkgrey:[169,169,169],
			darkgreen:[0,100,0],
			darkkhaki:[189,183,107],
			darkmagenta:[139,0,139],
			darkolivegreen:[85,107,47],
			darkorange:[255,140,0],
			darkorchid:[153,50,204],
			darkred:[139,0,0],
			darksalmon:[233,150,122],
			darkviolet:[148,0,211],
			fuchsia:[255,0,255],
			gold:[255,215,0],
			green:[0,128,0],
			indigo:[75,0,130],
			khaki:[240,230,140],
			lightblue:[173,216,230],
			lightcyan:[224,255,255],
			lightgreen:[144,238,144],
			lightgrey:[211,211,211],
			lightpink:[255,182,193],
			lightyellow:[255,255,224],
			lime:[0,255,0],
			magenta:[255,0,255],
			maroon:[128,0,0],
			navy:[0,0,128],
			olive:[128,128,0],
			orange:[255,165,0],
			pink:[255,192,203],
			purple:[128,0,128],
			violet:[128,0,128],
			red:[255,0,0],
			silver:[192,192,192],
			white:[255,255,255],
			yellow:[255,255,0],
			transparent: [255,255,255]
   };
	/* getRGB */
	jQuery.o2RGB = function(color){
		var result;
		if ( color && color.constructor == Array && color.length == 3 )
			return color;
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [jQuery.o2Repair(parseInt(result[1])), jQuery.o2Repair(parseInt(result[2])), jQuery.o2Repair(parseInt(result[3]))];
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [jQuery.o2Repair(parseInt(result[1])*2.55), jQuery.o2Repair(parseInt(result[2])*2.55), jQuery.o2Repair(parseInt(result[3])*2.55)];
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [jQuery.o2Repair(parseInt(result[1],16)), jQuery.o2Repair(parseInt(result[2],16)), jQuery.o2Repair(parseInt(result[3],16))];
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [jQuery.o2Repair(parseInt(result[1]+result[1],16)), jQuery.o2Repair(parseInt(result[2]+result[2],16)), jQuery.o2Repair(parseInt(result[3]+result[3],16))];
		if (result = /rgba\(0, 0, 0, 0\)/.exec(color))
			return jQuery.o2colors['transparent'];
		return jQuery.o2colors[jQuery.trim(color).toLowerCase()];
	};
	jQuery.fn.o2HotButton = function(r){
		var R = {
			seconds:3,//几秒完成转变
			tout:10, //颜色变化频率
			target:[255,0,0],//目标颜色
			cssType:'color',  //颜色变化类型'backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'
			shake:false,
			shakeTime:3,
			popHandler:'click'
		};
		jQuery.extend(R,r);
		return this.each(function(){
			/* 一些变量 */
			var th = this;
			var target = R.target;
			var source = jQuery.o2RGB(jQuery(th).css(R.cssType));
			var h_basic,h_target;
			var f_target = function(){
				clearTimeout(h_basic);
				var cur = jQuery.o2RGB(jQuery(th).css(R.cssType));
			 
				if(cur[0] == target[0] && cur[1] == target[1] && cur[2] == target[2]){
					/* 结束 */
					if(typeof R.popHandler == 'string'){
						eval('jQuery(th).'+R.popHandler+'();');
					}else if(typeof R.popHandler == 'function'){
						R.popHandler();
					}
					clearTimeout(h_target);
					//h_target = setTimeout(f_target,R.tout);
				}else{
					jQuery(th).css(R.cssType,"rgb(" + [
						jQuery.o2Repair(cur[0]>target[0]?(cur[0] - 1):( cur[0]<target[0]?(cur[0] + 1):(target[0]) )),
						jQuery.o2Repair(cur[1]>target[1]?(cur[1] - 1):( cur[1]<target[1]?(cur[1] + 1):(target[1]) )),
						jQuery.o2Repair(cur[2]>target[2]?(cur[2] - 1):( cur[2]<target[2]?(cur[2] + 1):(target[2]) ))
					].join(",") + ")" );
					h_target = setTimeout(f_target,R.tout);
				}
			};
			var f_basic = function(){
				clearTimeout(h_target);
				var cur = jQuery.o2RGB(jQuery(th).css(R.cssType));
				var tar = source;
				if(cur[0] == tar[0] && cur[1] == tar[1] && cur[2] == tar[2]){
					/* 结束 */
					clearTimeout(h_basic);
				}else{
					jQuery(th).css(R.cssType,"rgb(" + [
						jQuery.o2Repair(cur[0]>tar[0]?(cur[0] - 1):( cur[0]<tar[0]?(cur[0] + 1):(tar[0]) )),
						jQuery.o2Repair(cur[1]>tar[1]?(cur[1] - 1):( cur[1]<tar[1]?(cur[1] + 1):(tar[1]) )),
						jQuery.o2Repair(cur[2]>tar[2]?(cur[2] - 1):( cur[2]<tar[2]?(cur[2] + 1):(tar[2]) ))
					].join(",") + ")" );
					h_basic = setTimeout(f_basic,R.tout);
				}
			};
			jQuery(th).bind('mouseover',function(e){
				clearTimeout(h_basic);
				h_target = setTimeout(f_target,R.tout);
			}).bind('mouseout',function(e){
				clearTimeout(h_target);
				h_basic = setTimeout(f_basic,R.tout);
			});
		});
	};
})(jQuery);
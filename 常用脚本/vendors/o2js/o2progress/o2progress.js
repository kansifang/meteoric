/*
 * o2Grid 1.0.0 - Javascript Progress Bar
 *
 * Copyright (c) 2009 apeng (http://www.o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-04-16 09:06:55 $
 * $Rev: 55 $
 */ 
jQuery.fn.progress = function(args){
	var th = this;
	var D = {height:'9px',color:'#B7E820',bar:0};
	jQuery.extend(D,args);
	D.bar = parseInt(D.bar);
	if(isNaN(D.bar)) D.bar=0; else if(D.bar < 0 ) D.bar=0; else if(D.bar > 100 ) D.bar=100;
  th.html('<span class="o2progressspan"></span>').css({
		'text-align':'left',
		'line-height':'0px',
		'font-size':'0px',
		'color':'#FFFFFF',
		'background-color':'#FFFFFF',
		'border':'1px solid #366D00',
		'padding':'1px',
		'height': D.height
	});
	$('span.o2progressspan',th).css({
		'line-height':'0px',
		'font-size':'0px',
		'color':D.color,
		'background-color':D.color,
		'display':'block',
		'padding':'0px',
		'margin':'0px',
		'width':(D.bar+'%'),
		'height': D.height
	});
};
jQuery.fn.setProgress = function(bar){
	var spans = $('span.o2progressspan',this);
	if(spans.length <= 0){
		$(this).progress();
		spans = $('span.o2progressspan',this);
	}
	bar = parseInt(bar);
	if(isNaN(bar)) bar=0; else if(bar < 0 ) bar=0; else if(bar > 100 ) bar=100;
	spans.css({'width':(bar+'%')});
}
jQuery.fn.getProgress = function(bar){
	return parseInt($('span.o2progressspan',this).css('width'));
}
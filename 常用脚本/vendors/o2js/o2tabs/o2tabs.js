/*
 * o2tabs 1.0.0 - Javascript Tabs
 *
 * Copyright (c) 2009 apeng (http://www.o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-04-16 09:06:55 $
 * $Rev: 15 $
 */ 
jQuery.fn.tabs = function(args){
	//验证机制，组建一个tab，要有的UL DIV等，如不满足则报异常
	//...
	var D = {
			tabfeel:'click' ,//mouseover click
			selected:0,
			//个人认为可以去除,保留方便统一管理
			tabs_hover           : "tabs_hover",
			tabs_select          : "tabs_select",
			tabs_c    					 : "tabs_c"
	};
	jQuery.extend(D,args);
	var th = this;
	//赋予一些样式，以后好精确的办事
	$(th).addClass('o2tabs');
	$("ul",th).eq(0).addClass('tabs_ul').find('li').addClass('tabs_li');
	$("ul.tabs_ul li.tabs_li",th).each(function(e){
		$($(this).find("a").attr("href")).addClass('tabs_div');
	});
	
	//获得焦点时，和移出焦点时
	$("ul.tabs_ul li.tabs_li",th).hover(function(){
	 	$(this).addClass(D.tabs_hover);
	},function(){
	 	$(this).removeClass(D.tabs_hover);
	});
	// 触发tab事件
	$("ul.tabs_ul li.tabs_li",th).bind(D.tabfeel,function(e){
		$($(this).parent().find("."+D.tabs_select+" a").attr("href")).removeClass(D.tabs_c).hide();
		$($(this).find("a").attr("href")).addClass(D.tabs_c).show();
		$(this).parent().find("."+D.tabs_select).removeClass(D.tabs_select);
		$(this).removeClass(D.tabs_hover).addClass(D.tabs_select);
	});
	//去除默认事件
	$("ul.tabs_ul li.tabs_li a",th).bind('click',function(e){
		e.preventDefault();
		$(this).blur();
	});
	//选中默认
	$("div.tabs_div",th).hide().eq(D.selected).addClass(D.tabs_c).show();
	$("ul.tabs_ul li.tabs_li",th).eq(D.selected).addClass(D.tabs_select);
	
	return th;
}
jQuery.fn.triggerTab = function(slts){
	$("div.tabs_div",this).hide().eq(slts).addClass('tabs_c').show();
	$("ul.tabs_ul li.tabs_li",this).removeClass('tabs_select').eq(slts).addClass('tabs_select');
}
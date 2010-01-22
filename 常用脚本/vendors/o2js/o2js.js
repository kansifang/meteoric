/*
 * o2js 1.0.0 - o2js js lib constructor
 *
 * Copyright (c) 2009 apeng (http://o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-07-21 22:11:06 $
 * $Rev: 2 $
 */
if(typeof window.jQuery == "undefined"){ throw('Please load Jquery lib at the first!'); }
/* o2js Constructor Class */
function o2jsConstructorClass(r){
	/* this命名寄存 */
	var $th = this;
	/* 私有静态变量 */
	var $libs = {
	};
	/* 将参数，以及需要初始化的变量 放置变量区R */
	$th.R = $.extend(
		{path:'.'},
		r || {},
		{libs:$libs,writer:'o2jsConstructorWrite'}
	);
	/* 构造对象 */
	$th.build = function(target){
		var nowlib = $th.getLib(target);
		if(typeof nowlib['obj'] == 'undefined'){
			/* 开始加载 */
			var c_path = $th.R.path+target+'/';
			for(var ii=0;ii<nowlib.css.length;ii++){
				$('#'+$th.R.writer).append('<link rel="stylesheet" type="text/css" href="'+c_path+nowlib.css[ii]+'" />')
			}
			for(var jj=0;jj<nowlib.js.length;jj++){
				$('#'+$th.R.writer).append('<script type="text/javascript" src="'+c_path+nowlib.js[jj]+'"><\/script>')
			}
			nowlib['obj'] = true;
		}
	};
	/* 添加库 */
	$th.addLibs = function(lname,ljs,lcss){
		if(typeof $th.R.libs[lname] == "undefined") $th.R.libs[lname] = {};
		$th.R.libs[lname]['js'] = ljs;
		$th.R.libs[lname]['css'] = lcss;
	};
	/* 显示当前拥有库 */
	$th.showLib = function(){
		var str='';
		for(k in $th.R.libs){
			str += '【' + k + '】';
			str += '\n   Path：'+$th.R.path+k;
			str += '\n   js：';
			for(var i=0; i<$th.R.libs[k].js.length; i++) str += $th.R.libs[k].js[i];
			str += '\n   css：';
			for(var i=0; i<$th.R.libs[k].css.length; i++) str += $th.R.libs[k].css[i];
			str += '\n--------------------------------------------\n\n';
		};
		alert(str);
	}
	/* 得到对象 */
	$th.getLib = function(target){
		if(typeof $th.R.libs[target] == "undefined"){ throw('Constructor can not find the libs type ['+target+'] , Report by o2js!'); }
		return $th.R.libs[target];
	};
	/* 设置路径!! */
	$th.setPath = function(path){
		$th.R['path'] = path;
	};
	/* 初始化 */
	$th.init = function(){
		$().ready(function(){
			$('<div id="'+$th.R.writer+'"></div>').appendTo('body');
			/* 设置当前路径 */			
			$('script').each(function(){
				if(this.src && (this.src.indexOf('o2js.js') != -1)){
					var temppath = this.src.replace('o2js.js','');
					$th.setPath(temppath);
				}
			});
		});
	};
	$th.init();
};
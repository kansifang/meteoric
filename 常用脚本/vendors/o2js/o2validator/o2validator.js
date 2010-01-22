 /*
 * o2validator 1.0.0 - Javascript Validator
 *
 * Copyright (c) 2009 apeng (http://www.o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-04-16 09:06:55 $
 * $Rev: 22 $
 */ 
if(typeof oValidator == "undefined"){
if(typeof window.jQuery == "undefined"){ throw('Please load Jquery lib at the first!'); }
var oValidator = 
{
	version : "0.0.1",
	/* 参加验证的节点数组 */
	elements : [],
	/* 初始化 */
	init : function()
	{
		oValidator.elements = [];
	},
	/* 从当前验证节点数组去掉某个ID号的节点 */
	out : function()
	{
		if(arguments[0]){
			if(typeof arguments[0] == "string"){
				oValidator.__out(arguments[0]);
			}else{
				var outs = arguments[0];
				for(var out_i=0 ; out_i< outs.length ; out_i++){
					oValidator.__out(outs[out_i]);
				}
			}
		}else{
			/* .. out the last one */
			if(oValidator.elements.length>0) oValidator.elements.pop();
		}
	},
	__out : function(_id)
	{
		var elements = oValidator.elements;
		for(var $i=0 ; $i< elements.length ; $i++)
		{
			if(_id == elements[$i].id){
				oValidator.elements.splice($i,1);
				break;
			}
		}
	},
	/* 添加验证节点，如果节点不存在，会自动忽略,提供不同的验证构造器 */
	add : function()
	{
		var elements = [];
		if(arguments[0]) elements = arguments[0];
		for(var $i=0 ; $i< elements.length ; $i++)
		{
			oValidator.__add(elements[$i]);
		}
	},
	__add : function(_obj)
	{ 
		var defaults = 
		{
			id 					: "", 								//涉及验证的dom节点ID
			type  			: "", 								//验证类别
			func				: undefined,					//外部判断函数
			room				: undefined,					//提供一个存储空间，可以暂存一些变量,(你可以自由发挥了)				
			regkey			: "", 								//正则关键字对应 eRegexEnum 变量
			regexpress	: "",									//正则关键字对应 eRegexEnum 变量 自己填写的
			name 				: "",									//出错提示的名称	
			val 				: "",									//默认值
			without			: undefined,					//一定不能是这个值
			error 			: "此项输入有误!", 			//出错语句
			empty 			: false, 							//是否可以为空
			ltrim 			: false,							//是否验证前先去除空格
			rtirm 			: false, 							//是否验证前先去除空格
			trim 				: true, 							//是否验证前先去除空格
			errorClass	:	'ovalidator-error',	//出错时，dom节点的样式
			focusClass	:	'ovalidator-focus',	//获得焦点时，dom节点的样式
			onfocus			:	function(){},				//获得焦点事件
			onblur			:	function(){},				//失去焦点事件
			onkeyup			:	function(){},				//输入事件
			onerror			:	function(){},				//错误时触发的事件
			/* .. 以下函数为系统级，不能传参数设置 */
			isValid			: false,
			in_on:function(){
				if(this.val){
					$('#'+this.id).val(this.val);
				}
				//一个本身的参数带的，一个一定要执行的
				$('#'+this.id).bind('focus',this.onfocus);
				$('#'+this.id).bind('focus',function(){
					$('#'+this.id).addClass('ovalidator-focus');
					//oValidator.seek_check(this.id);
				});
				//一个本身的参数带的，一个一定要执行的
				$('#'+this.id).bind('blur',this.onblur);
				$('#'+this.id).bind('blur',function(){
					$('#'+this.id).removeClass('ovalidator-focus');
					oValidator.seek_check(this.id);
				});
				$('#'+this.id).bind('keyup',this.onkeyup);
				$('#'+this.id).bind('keyup',function(){
					oValidator.seek_check(this.id);
				});
			},
			highlight: function(){$('#'+this.id).addClass(this.errorClass );},
			unhighlight: function(){$('#'+this.id).removeClass(this.errorClass);},
			check:function(){
				if(!oValidator.isDom(this.id)){
					/* 节点可能被删 */
					this.isValid = true;
				}else{
					var t_goon = true;
					/* 是否使用外部函数判断 */
					if(typeof this.func == 'function'){
						this.isValid = this.func(this.id,this);
						t_goon = false;
					}
					
					if(t_goon){
						var $val = $("#"+this.id).val();
						if(this.ltrim) $val = oValidator.ltrim($val);
						if(this.rtrim) $val = oValidator.rtrim($val);
						if(this.trim) $val  = oValidator.trim($val);
						/* 验证:根据类型做不同的验证 */
						switch(this.type){
							case "date":
								if(isDateString($val)){
									this.isValid = true;
								}else{
									this.isValid = false;
								}
								break;
							/* 正则 */
							case "regexp":
								/* 是否有自己写的表达式 */
								if(this.regexpress != ''){
									regexpress =  this.regexpress;
								}else{
									regexpress = eval("eRegexEnum."+this.regkey);
								}
								if(regexpress==undefined || regexpress==""){
									throw("Can't find the validator type \""+this.regkey+"\"! ");
								}				
								var $exps = new RegExp(regexpress,"g");
								if (!$exps.test($val)){
									this.isValid = false;
								}else{
									this.isValid = true;
								}
								break;
							/* 数字范围 */	
							case "numarea":
								if(!isNaN($val)){
									$nval = parseFloat($val);
									if(this.min){
										if($nval <  this.min)
											this.isValid = false;
										else
											this.isValid = true;
									}
									if(this.max){
										if($nval >  this.max) 
											this.isValid = false;
										else
											this.isValid = true;
									}
									if(this.min && this.max){
										if($nval >=  this.min && $nval <= this.max){
											this.isValid = true;
										}else{
											this.isValid = false;
										}
									}
								}else{
									this.isValid = false;
								}
								break;
							/* 字符串长度范围 */
							case "strarea":
								var len = 0;
								for (var j_1 = 0; j_1 < $val.length; j_1++) {
									if ($val.charCodeAt(j_1) >= 0x4e00 && $val.charCodeAt(j_1) <= 0x9fa5) 
										len += 2;
									else 
										len++;
								}
								if(this.min){
									if(len <  this.min)
										this.isValid = false;
									else
										this.isValid = true;
								}
								if(this.max){
									if(len >  this.max) 
										this.isValid = false;
									else
										this.isValid = true;
								}
								if(this.min && this.max){
									if(len >=  this.min && len <= this.max)
										this.isValid = true;
									else
										this.isValid = false;
								}
								break;	
							default :
								this.isValid = true;
								break;	
						}
						/* 验证：不能等于这个数 */
						if(typeof this.without != 'undefined'){
							if(this.without === $val){
								this.isValid = false;
							}else{
								this.isValid = true;
							}
						}
						/* 验证：是否为空 */
						if(this.empty){
							if($val == ""){
								this.isValid = true;
							}	
						}else{
							if($val == ""){
								this.isValid = false;
							}
						}
					}
				}
				/* 结尾做处理 */
				if(this.isValid){
					this.unhighlight();
				}else{
					this.highlight();
					this.onerror();
				}
			}
		};
		_obj = _obj || {};
		element = jQuery.extend(defaults, _obj);
		/* ..以上的默认值和实参之间的重叠操作 */
		
		/* 添加到操作数组中 */
		if(oValidator.isDom(element.id)){
			oValidator.elements.push(element);
			/* 初始化 */
			element.in_on();
		}
		else throw('The dom id "'+element.id+'" is not defined!');
	},
	/* 真正的操作全部验证 */
	seek_check : function(_id){
		var elements = oValidator.elements;
		for(var $i=0 ; $i< elements.length ; $i++)
		{
			if(_id == elements[$i].id){
				oValidator.elements[$i].check();
			}
		}
	},
	seek_check_all : function(){
		for(var $i=0 ; $i< oValidator.elements.length ; $i++)
		{
			oValidator.elements[$i].check();
		}
	},
	/* 错误信息-DOM对象数组 */
	error_dom : function(){
		var err_obj = [];
		//oValidator.seek_check_all();
		for(var $i=0 ; $i< oValidator.elements.length ; $i++)
		{
			var element = oValidator.elements[$i];
			if(oValidator.isDom(element.id) && !element.isValid){
				err_obj.push( $('#'+element.id) );
			}
		}	
		return err_obj;
	},
	/* 错误信息-字符串数组 */
	error_str : function(){
		var error_str_obj = [];
		//oValidator.seek_check_all();
		for(var $i=0 ; $i< oValidator.elements.length ; $i++)
		{
			var element = oValidator.elements[$i];
			if(oValidator.isDom(element.id) && !element.isValid){
				if(element.name == ''){
					error_str_obj.push(element.error);
				}else{
					error_str_obj.push(element.name + ' : ' + element.error);
				}
			}
		}
		if(arguments[0]){
			return error_str_obj.join(arguments[0]);
		}else{
			return error_str_obj;
		}
	},
	/* 错误信息-对象数组 */
	error_obj : function()
	{
		var err_obj = [];
		//oValidator.seek_check_all();
		for(var $i=0 ; $i< oValidator.elements.length ; $i++)
		{
			var element = oValidator.elements[$i];
			if(oValidator.isDom(element.id) && !element.isValid){
				err_obj.push(element);
			}
		}	
		return err_obj;
	},
	/* 是否通过验证 */
	pass : function()
	{
		/* 开始验证 */
		oValidator.seek_check_all();
		for(var $i=0 ; $i< oValidator.elements.length ; $i++)
		{
			var element = oValidator.elements[$i];
			if(oValidator.isDom(element.id) && !element.isValid){
				return false;
			}
		}	
		return true;
	},
	/* 状态 */
	status : function()
	{
		return oValidator.elements;
	},
	/* 是否有节点 */
	isDom : function(_id)
	{
		if(document.getElementById(_id)){
			return true;
		}else{
			return false;
		}	
	},
	/* 去除空格 */
	trim : function(str)
	{
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},
	/* 去除左空格 */
	ltrim : function(str){
		return str.replace(/(^\s*)/g, "");
	},
	/* 去除右空格 */
	rtrim : function(str){
		return str.replace(/(\s*$)/g, "");
	}
};
/* 正则判断数组 */
eRegexEnum = 
{
	reg_int:"^([+-]?)\\d+$",					//整数
	reg_int1:"^([+]?)\\d+$",					//正整数
	reg_int2:"^-\\d+$",						//负整数
	reg_num:"^([+-]?)\\d*\\.?\\d+$",			//数字
	reg_num1:"^([+]?)\\d*\\.?\\d+$",			//正数
	reg_num2:"^-\\d*\\.?\\d+$",					//负数
	reg_dec:"^([+-]?)\\d*\\.\\d+$",			//浮点数
	reg_dec1:"^([+]?)\\d*\\.\\d+$",			//正浮点数
	reg_dec2:"^-\\d*\\.\\d+$",				//负浮点数
	reg_email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
	reg_color:"^[a-fA-F0-9]{6}$",				//颜色
	reg_url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",	//url
	reg_chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",					//仅中文
	reg_ascii:"^[\\x00-\\xFF]+$",				//仅ACSII字符
	reg_zipcode:"^\\d{6}$",						//邮编
	reg_mobile:"^(13|15)[0-9]{9}$",				//手机
	reg_ip:"^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5]).(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5]).(d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5]).(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$",				//ip地址
	reg_notempty:"^\\S+$",						//非空
	reg_picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",	//图片
	reg_rar:"(.*)\\.(rar|zip|7zip|tgz)$",								//压缩文件
	reg_date:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$",					//日期
	reg_qq:"^[1-9]*[1-9][0-9]*$",				//QQ号码
	reg_tel:"(\\d{3}-|\\d{4}-)?(\\d{8}|\\d{7})",	//国内电话
	reg_username:"^\\w+$",						//用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
	reg_letter:"^[A-Za-z]+$",					//字母
	reg_letter_u:"^[A-Z]+$",					//大写字母
	reg_letter_l:"^[a-z]+$",					//小写字母
	reg_idcard:"^[1-9]([0-9]{14}|[0-9]{17})$"	//身份证
}
}


//附属函数
//dhtml.js 添加了，所以我这里就不重复添加了
function isDateString(sDate)
{ 
	var exps = new RegExp("^\\d{4}\\-\\d{1,2}\\-\\d{1,2}$","g");
	if(!exps.test(sDate)) return false;
	var iaMonthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
	var iaDate = sDate.toString().split("-");
	var year 	= parseFloat(iaDate[0]);
	var month = parseFloat(iaDate[1]);
	var day		= parseFloat(iaDate[2]);
	if (year < 1900 || year > 2100) return false
	if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1]=29;
	if (month < 1 || month > 12) return false
	if (day < 1 || day > iaMonthDays[month - 1]) return false
	return true
}
 
/* 时间处理函数*************************************************************************** */
/*格式化日期原型控制  yyyy-M-dd*/
Date.prototype.eformat = function(format)
{
	var o = {
		"M+" : this.getMonth()+1, //month
		"d+" : this.getDate(),    //day
		"h+" : this.getHours(),   //hour
		"m+" : this.getMinutes(), //minute
		"s+" : this.getSeconds(), //second
		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
		"S"  : this.getMilliseconds() //millisecond
	}
	if(/(y+)/.test(format)){
		format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}	
	for(var k in o){
		if(new RegExp("("+ k +")").test(format)){
			format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
		}
	}		
	return format;
}
/* 是否为日期格式的字符串YYYY-MM-DD */
function isDateString(sDate){
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
function today(){
	return (new Date()).eformat('yyyy-MM-dd');
}
/* 转字符串为日期对象，可以是yyyy-mm-dd 也可以是yyyy-mm-dd hh:ii:ss */
function strToDate(_str){
	var _y='',_m='',_d='',_h='',_i='',_s='';
	_y = (_str.substring(0,_str.indexOf ('-')));//y
	_m = (_str.substring(_str.indexOf ('-')+1,_str.lastIndexOf ('-')));//m
	_d = (_str.substring(_str.lastIndexOf ('-')+1));//d	
	if(_str.indexOf (' ') > 0){ 
		_d = (_str.substring(_str.lastIndexOf ('-')+1,_str.indexOf (' ')));//d	
		_h = (_str.substring(_str.indexOf (' ')+1,_str.indexOf (':')));//h
		_i = (_str.substring(_str.indexOf (':')+1,_str.lastIndexOf (':')));//i
		_s = (_str.substring(_str.lastIndexOf (':')+1));//s
 	}
	var eval_str = ' new Date("'+_y+'","'+(_m-1)+'","'+_d+'"';
	if(_h != ''){
		eval_str += ',"'+_h+'"';
		eval_str += ',"'+_i+'"';
		eval_str += ',"'+_s+'"';
	}
	return eval(eval_str+');');
}
/* 时间比较函数 */
function dateDiff(interval, b_date, e_date) {
	var returns=false;
	if(typeof b_date == "string"){
		b_date =strToDate(b_date);
	}
	if(typeof e_date == "string"){
		e_date =strToDate(e_date);
	}
	interval = interval.toLowerCase();
	switch(interval){
		case 'y':
			returns = ((e_date- b_date)/86400000/365);
			break;
		case 'm':
			returns = (e_date.getMonth()+1)+((e_date.getFullYear()-b_date.getFullYear())*12) - (b_date.getMonth()+1);
			break;
		case 'd':
			returns = ((e_date- b_date)/86400000);
			break;
		case 'h':
			returns = ((e_date- b_date)/(3600000));
			break;
		case 'i':
			returns = ((e_date- b_date)/(60000));
			break;
		case 's':
			returns = (e_date- b_date)/1000;
			break;
		default:
			returns = ((e_date- b_date)/86400000);
			break;
	}
	return Math.floor(returns);
}
/*在_obj基础上再加几天*/
function addDay(_obj,_num){
	var returns = null;
	returns = new Date(_obj.getTime() + (3600000*24*_num));
 	return returns;
}
/*在_obj基础上再加几周*/
function addWeek(_obj,_num){
	var returns = null;
	returns = new Date(_obj.getTime() + (3600000*24*7*_num));
 	return returns;
}
/*得到这周的第一天*/
function getWeekFirst(_obj){
	return addDay(_obj,1 - _obj.getDay());
}
/*得到这周的最后一天*/
function getWeekLast(_obj){
	return addDay(_obj,7 - _obj.getDay());
}
/*在_obj基础上再加几月*/
function addMonth(_obj,_num){
	var returns = null;
	var obj = new Date(_obj.getTime());
	returns = new Date(obj.setMonth(obj.getMonth()+_num));
 	return returns;
}
/*得到这个月份的第一天*/
function getMonthFirst(_obj){
	var obj = new Date(_obj.getTime());
	returns = new Date(obj.setDate(1));
 	return returns;
}
/*得到这个月份的最后一天*/
function getMonthLast(_obj){
	var returns = null;
	returns = new Date(_obj.getFullYear(),(_obj.getMonth()+1),0);
 	return returns;
}
/*在_obj基础上再加几年*/
function addYear(_obj,_num){
	return addMonth(_obj,_num*12);
}
/*得到这年的第一天*/
function getYearFirst(_obj){
	_obj.setMonth(0);
	_obj.setDate(1);
	return _obj;
}
/*得到这年的最后一天*/
function getYearLast(_obj){
	 return addDay(getYearFirst( addYear(_obj,1) ),-1);
}
/*在_obj基础上再加几个季度*/
function addQuarter(_obj,_num){
	return addMonth(_obj,_num*3);
}
/*得到这个季度的第一天*/
function getQuarterFirst(_obj){
	var returns = null;
	switch((_obj.getMonth()+1)){
		case 1:
		case 2:
		case 3:
			returns = new Date(_obj.getFullYear(),0,1);
			break;
		case 4:
		case 5:
		case 6:
			returns = new Date(_obj.getFullYear(),3,1);
			break;
		case 7:
		case 8:
		case 9:
			returns = new Date(_obj.getFullYear(),6,1);
			break;
		case 10:
		case 11:
		case 12:
			returns = new Date(_obj.getFullYear(),9,1);
			break;
	}
	return returns;
}
/*得到这个季度的最后一天*/
function getQuarterLast(_obj){
	var returns = null;
	switch((_obj.getMonth()+1)){
		case 1:
		case 2:
		case 3:
			returns = new Date(_obj.getFullYear(),3,0);
			break;
		case 4:
		case 5:
		case 6:
			returns = new Date(_obj.getFullYear(),6,0);
			break;
		case 7:
		case 8:
		case 9:
			returns = new Date(_obj.getFullYear(),9,0);
			break;
		case 10:
		case 11:
		case 12:
			returns = new Date(_obj.getFullYear(),12,0);
			break;
	}
	return returns;
}
/* 时间处理函数 */ 
//检查是否安装软件
var xiamiInstalled=false;
var getBrowser = function(){
	var s = navigator.userAgent.toLowerCase();
	var a = new Array("msie", "firefox", "safari", "opera", "netscape");
	for(var i = 0; i < a.length; i ++){
		if(s.indexOf(a[i]) != -1){
			return a[i];
		}
	}
	return "other";
}

try{
	if(!xiamiInstalled){
		var obj=new ActiveXObject("XiaMiplugin.xiamistart");
		if(obj){
			xiamiInstalled=true;
			delete obj
		}
	}
}catch(e){}
function runxiami(){
	if(xiamiInstalled || getBrowser() == 'firefox'){
		return true;
	}else{
		window.location='/software';
		return false;
	}
}
function runxiami_p(p){
	if(xiamiInstalled || getBrowser() == 'firefox'){
		window.location= p;
	}else{
		window.location='/software';
	}
}
//选择name 的check box
function selectAll(name){
	var arr = $(':input[@name='+name+']');
	for(var i=0;i<arr.length;i++){
		if(arr[i].disabled == false){
			arr[i].checked = true;
		}
	}
}
//反选
function inverse(name){
	var arr = $(':input[@name='+name+']');
	for(var i=0;i<arr.length;i++){
		if(arr[i].disabled == false){
			arr[i].checked = ! arr[i].checked;
		}
	}
}
//获取选择的值
function getSelectValues(name)
{
	var sValue = "";
	var tmpels = $(':input[@name='+name+']');
	for(var i=0;i<tmpels.length;i++)
	{
		if(tmpels[i].checked){
			if(sValue == ""){
				sValue = tmpels[i].value;
			}else{
				sValue = sValue + "," + tmpels[i].value;
			}
		}
	}
	return sValue;
}
function playsongs(checkname,type_name,type_id){
	var ids = getSelectValues(checkname);
	if(ids == ''){
		alert("没有歌曲可以播放!");
		return;
	}
	if(!type_name){
	type_name  ='default';
	}	
	if(!type_id){
	type_id = 0;
	}
	
	thisMovie('trans').addSongs(escape("/song/playlist?id="+ids+"&object_name="+type_name+"&object_id="+type_id));
	//$.getScript("/song/script/id/"+ids+"/type_name/"+type_name+"/type_id/"+type_id); 
	//alert(playform.id.value);
	//window.open("/song/play/id/"+ids, "play","height=400,width=550,status=no,toolbar=no,menubar=no,location=no");

}

function playsongsignore(checkname,type_name,type_id){
	if(!type_name){
	type_name  ='default';
	}	
	if(!type_id){
	type_id = 0;
	}
	var ids = getSelectValues(checkname);
	if(ids == ''){
		alert("没有歌曲可以播放!");
		return;
	}
	thisMovie('trans').addSongs(escape("/song/playlist?id="+ids+"&object_name="+type_name+"&object_id="+type_id));
	
	//alert(playform.id.value);
	//window.open("/song/play/ignore/1/id/"+ids, "play","height=400,width=550,status=no,toolbar=no,menubar=no,location=no");

}


//type_name : collect , album 
function play(song_id,type_name,type_id){
	if(!type_name){
	type_name  ='default';
	}	
	if(!type_id){
	type_id = 0;
	}
	thisMovie('trans').addSongs(escape("/song/playlist?id="+song_id+"&object_name="+type_name+"&object_id="+type_id));
	//$.getScript("/song/script/id/"+song_id+"/type_name/"+type_name+"/type_id/"+type_id); 
}

function playalbum(album_id){
	thisMovie('trans').addSongs(escape("/song/playlist/id/"+album_id+"/type/1"));
	//$.getScript("/song/script/id/"+album_id+"/type/1"); 
}

function playartist(artist_id){
	thisMovie('trans').addSongs(escape("/song/playlist/id/"+artist_id+"/type/2"));
	//$.getScript("/song/script/id/"+artist_id+"/type/2"); 
}

function playcollect(list_id){
	thisMovie('trans').addSongs(escape("/song/playlist/id/"+list_id+"/type/3"));
	//$.getScript("/song/script/id/"+list_id+"/type/3"); 
}


var ajaxText = '<div class="dialog_content"><p class="loading">虾小米正为您在处理数据, 请稍候...</p></div><p class="close"><a href="#" title="" class="jqmClose">关闭</a></p>';

//ie6下高度的问题
dialogbg=function(){
	if(getBrowser() == 'msie'){
	$('.dialog_sharp').height($('.dialog_main').height());
	};	
}

var myjqmOnShow = function(hash){
	hash.w.show();
	dialogbg();	
};

var myjqmOnLoad = function(hash){
	dialogbg();
};

function collect(id){	
	var url = '/song/collect/id/'+ encodeURIComponent(id);	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

function closedialog(){
	$('#dialog_clt').jqmHide();
}
function insertsongs(){
	var url = '/search/popsongs?id=x';		
	$('#dialog').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.pop_message',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}
function search_songs(search_result,key){

	var url = '/search/searchpopsongs';
	var pars = 'key=' + encodeURIComponent(key);
	var myAjax = new Ajax.Updater(
	search_result, // 更新的页面元素
	url, // 请求的URL
	{
		method: 'post',
		parameters: pars,
		evalScripts: true
	}
	);
}

//下载单曲
function download(id){
	var url = '/download/song?id='+encodeURIComponent(id);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}

//推广的下载单曲
function promotion_download(id,type,pid){
	var url = '/download/song?id='+ encodeURIComponent(id) +'&ptype='+type +'&pid='+pid;;
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}

//下载专辑
function downloadalbum(id,type){
	var url = '/download/song?id=' + encodeURIComponent(id) + '&type=album';
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}

//参与主题精选集
function joinsub(id,type){
	var url = '/collect/joinsub?id=' + encodeURIComponent(id)+"&type="+encodeURIComponent(type);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}

//下载精选集
function downloadcollect(id,type){
	var url = '/download/song?id=' + encodeURIComponent(id) + '&type=collect';
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad	
	}).jqDrag('.jqDrag').jqmShow();
}

//下载多首歌曲
function downloadsongs(ids){
	var url = '/download/song';
	var id = getSelectValues(ids);
	if(id == ''){
		alert("没有资源可以下载！");
		return;
	}
	var url = url+'?id=' + encodeURIComponent(id);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}
//推荐
//32,歌曲，33，专辑，34，歌手，35，精选集，36，歌曲评论，37，专辑评论，38，歌手评论， 39，精选集评论， 310， 小组话题， 311，用户， 312，小组
function recommend(id,type){
	var url = '/recommend/post';	
	var url = url+'?object_id=' + encodeURIComponent(id)+"&type="+encodeURIComponent(type);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

//参与精选集
function addcollect(id){
	var url = '/collect/addcollect';	
	var url = url+'?cid=' + encodeURIComponent(id)+"&"+Math.random();
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

//专辑想要
function require(aid,type){
	var url = '/album/require';	
	var url = url+'?id=' + encodeURIComponent(aid)+"&type="+encodeURIComponent(type);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

//介绍给好友
//33，专辑，35，精选集
function intro(id,type){
	var url = '/member/intro';	
	var url = url+'?object_id=' + encodeURIComponent(id)+"&type="+encodeURIComponent(type);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

function friends(id){
	var url = '/member/myfriends/t/new/to_user_id/'+ encodeURIComponent(id);	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}

//专辑收藏到小组
function groupalbum(id){
	var url = '/group/pooladd/id/'+ encodeURIComponent(id);	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

//加入小组
function groupjoin(id){
	var url = '/group/join/id/'+ encodeURIComponent(id);	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}


//精选集收藏到小组
function groupcollect(id){
	var url = '/group/pooladd/type/1/id/'+ encodeURIComponent(id);	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}
//修改个人介绍
function editprofile(id){
	var url = '/member/editprofile';	
	var url = url+'?object_id=' + encodeURIComponent(id);
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();	
}

function getshengxiao(yyyy){
    //by Go_Rush(阿舜) from http://ashun.cnblogs.com/    
    var arr=['猴','鸡','狗','猪','鼠','牛','虎','兔','龙','蛇','马','羊'];
    return /^\d{4}$/.test(yyyy)?arr[yyyy%12]:null
}

// 取星座, 参数分别是 月份和日期
function getxingzuo(month,day){    
    //by Go_Rush(阿舜) from http://ashun.cnblogs.com/        
    var d=new Date(1999,month-1,day,0,0,0);
    var arr=[];
    arr.push(["魔羯座",new Date(1999, 0, 1,0,0,0)])
    arr.push(["水瓶座",new Date(1999, 0,20,0,0,0)])
    arr.push(["双鱼座",new Date(1999, 1,19,0,0,0)])
    arr.push(["牡羊座",new Date(1999, 2,21,0,0,0)])
    arr.push(["金牛座",new Date(1999, 3,21,0,0,0)])
    arr.push(["双子座",new Date(1999, 4,21,0,0,0)])
    arr.push(["巨蟹座",new Date(1999, 5,22,0,0,0)])    
    arr.push(["狮子座",new Date(1999, 6,23,0,0,0)])
    arr.push(["处女座",new Date(1999, 7,23,0,0,0)])
    arr.push(["天秤座",new Date(1999, 8,23,0,0,0)])
    arr.push(["天蝎座",new Date(1999, 9,23,0,0,0)])
    arr.push(["射手座",new Date(1999,10,22,0,0,0)])
    arr.push(["魔羯座",new Date(1999,11,22,0,0,0)])        
    for(var i=arr.length-1;i>=0;i--){
        if (d>=arr[i][1]) return arr[i][0];    
    }
}

/*
魔羯座(12/22 - 1/19)、水瓶座(1/20 - 2/18)、双鱼座(2/19 - 3/20)、牡羊座(3/21 - 4/20)、金牛座(4/21 - 5/20)、
双子座(5/21 - 6/21)、巨蟹座(6/22 - 7/22)、狮子座(7/23 - 8/22)、处女座(8/23 - 9/22)、天秤座(9/23 - 10/22)、
天蝎座(10/23 - 11/21)、射手座(11/22 - 12/21)    
*/

function resendmail() {
	var url = '/member/regresend/type/ajax';	
	$('#dialog_clt').jqm({
	ajax:url,
	modal:true,
	toTop:true,
	target: 'div.dialog_main',
	ajaxText: ajaxText,
	onShow:myjqmOnShow,
	onLoad:myjqmOnLoad
	}).jqDrag('.jqDrag').jqmShow();
}


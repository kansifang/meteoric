//收藏的
function player_collect(obj){
	//alert(obj.objectName);
	//alert(obj.objectId);	
	collect(obj.songId);
}
//下载
function player_download(obj){
	download(obj.songId);
}
//推荐
function player_recommend(obj){
	recommend(obj.songId,32);
}

//评价
function player_review(obj,num){
	//download(obj.songId);
	var url = '/song/review/id/'+ encodeURIComponent(obj.songId) + '/num/'+ encodeURIComponent(num);
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
//歌曲有错
//歌词有错
//词曲不同步
function player_reportlyric(obj,type){
	//download(obj.songId);
	var url = '/song/reportlyric/type/'+type+'/id/'+ encodeURIComponent(obj.songId);	
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
//上传歌词
function player_uploadlyric(obj){
	//download(obj.songId);
	var url = '/song/addlyric/id/'+ encodeURIComponent(obj.songId);	
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
//歌曲改变
function player_changeSong(obj){
	//download(obj.songId);
	document.title= obj.songName + "——虾小米打碟中……";
}
//播放完成
function player_overSong(obj){
	$.get("/count/playrecord/sid/"+obj.songId+"?object_name="+obj.objectName+"&object_id="+obj.objectId); 
	//download(obj.songId);
}


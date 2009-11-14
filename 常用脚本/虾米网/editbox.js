// JavaScript Document
/*
调用editbox的方式
<a href="/somelink/tosave/the/editbox/content/always/use/ajax" class="rebox" rel="contentid" title="">编辑</a>
<div id="contentid">here is your content</div>
调用rebox的方式类似
*/
$(document).ready(function(){
	$("a.editbox").click(function(){
		editbox(this);
		//防止点击事件发生
		return false;	
	});
	$("a.rebox").click(function(){
		rebox(this);
		return false;
	});
	$("a.quotebox").click(function(){
		quotebox(this);
		return false;
	})	
});

function editbox(alink){
	//关联的容器
	var rel='#'+$(alink).attr('rel') ;
	if($(rel).length<1) return false;
	//保存未修改时的内容	
	var backup = $(rel).html();
	//替换<br />
	var txt=backup.replace(/\n/gi,'');
	txt=txt.replace(/<br\s*\/?>/gi,'\n');	
	txt=txt.replace(/<a\s*href=\"(.*)\"*>(.*)<\/a>/gi,'$2');
	//创建editbox
	var editbox='<div class="post_item_editbox"><p><textarea rows="4" cols="60" id="editbox" onkeydown="if(event.ctrlKey&&event.keyCode==13) $(this).parent().next().children(\':first\').click();">'+txt+'</textarea></p><p class="editbox_act"><input type="button" value="保 存" class="bt_sub2 editbox_saveButton" /> <input type="button" value="取 消" class="bt_cancle2 editbox_cancelButton" /></p></div>';
	$(rel).html('').append(editbox);
	$(alink).hide();
	$('.editbox_saveButton').click(function(){saveEditbox(this,false,backup,alink);});
	$('.editbox_cancelButton').click(function(){saveEditbox(this,true, backup,alink);});	
	return false;
}

function saveEditbox(btn,cancel,backup,alink) {
	var editbox=$(btn).parent().parent();
	$(btn).addClass('bt_cancle2').attr('disabled',true).val('请稍候');
	//获取当前点击的链接的href
	var href=$(alink).attr('href');	
	if(!cancel) {
		var t = $(btn).parent().prev(0).children().val();
		$.post(href,{content: t},function(txt){	
			if(txt=='1'){
				alert('请先登陆');
				editbox.after(backup).remove();
				$(alink).show();	
			}else if(txt=='2'){
				alert('您还不是该小组的成员');
				editbox.after(backup).remove();
				$(alink).show();	
			}else{
				txt=txt.replace(/\r\n/g,'<br />');
				editbox.after(txt).remove();
				$(alink).show();	
			}
		});
	}
	else {
		editbox.after(backup).remove();
		$(alink).show();	
	}
}	


function rebox(alink){
	//关联的容器
	var rel='#'+$(alink).attr('rel') ;
	//创建editbox
	var backup = $(alink).parent().prev().prev().children().html();
	var txt=backup.replace(/\n/gi,'');
	txt=txt.replace(/<br\s*\/?>/gi,'\n');	
	txt=txt.replace(/<a\s*href=\"(.*)\"*>(.*)<\/a>/gi,'$2');
	var rebox='<div class="post_item_editbox"><h5>回复'+txt+'</h5><p><textarea rows="4" cols="60" id="rebox" onkeydown="if(event.ctrlKey&&event.keyCode==13) $(this).parent().next().children(\':first\').click();"></textarea></p><p class="editbox_act"><input type="button" value="回 复"  class="bt_sub2" /> <input type="button" value="取 消" class="bt_cancle2" /></p></div>';
	$(rel).parent().append(rebox);	
	$(rel).parent().find('textarea').trigger('focus');
	$(alink).hide();
	
	$('.bt_sub2').click(function(){saveRebox(this,false,alink);});
	$('.bt_cancle2').click(function(){saveRebox(this,true,alink);});
}

function saveRebox(btn,cancel,alink) {
	var rebox=$(btn).parent().parent();
	if(!cancel) {
		$(btn).addClass('bt_cancle2').attr('disabled',true).val('请稍候');
		var t = $(btn).parent().prev(1).children().val();
		if(t.length<1) { alert('回复内容不能为空'); return false;}
		//获取当前点击的链接的href
		var href=$(alink).attr('href');	
		$.post(href,{content: t},function(txt){	
			if(txt=='1'){
				alert('请先登陆');
				rebox.remove();
				$(alink).show();	
			}if(txt=='2'){
				alert('您不是该小组的成员');
				rebox.remove();
				$(alink).show();	
			}else{
				rebox.after(txt).remove();
				$(alink).show();	
			}
		});
	}
	else {
		rebox.remove();
		$(alink).show();	
	}	
}	


function quotebox(alink){
	//关联的容器
	var rel='#'+$(alink).attr('rel') ;
	//创建editbox
	var backup = $(alink).parent().prev().prev().children().html();
	var txt=backup.replace(/\n/gi,'');
	txt=txt.replace(/<br\s*\/?>/gi,'\n');	
	txt=txt.replace(/<a\s*href=\"(.*)\"*>(.*)<\/a>/gi,'$2');
	var quotebox='<div class="post_item_editbox"><h5>回复'+txt+'</h5><p><textarea rows="4" cols="60" id="rebox" onkeydown="if(event.ctrlKey&&event.keyCode==13) $(this).parent().next().children(\':first\').click();"></textarea></p><p class="editbox_act"><input type="button" value="回 复"  class="bt_sub2" /> <input type="button" value="取 消" class="bt_cancle2" /></p></div>';
	$(rel).parent().append(quotebox);	
	$(rel).parent().find('textarea').trigger('focus');
	$(alink).hide();
	
	$('.bt_sub2').click(function(){saveQuoteBox(this,false,alink);});
	$('.bt_cancle2').click(function(){saveQuoteBox(this,true,alink);});
}

function saveQuoteBox(btn,cancel,alink) {
	var quotebox=$(btn).parent().parent();
	if(!cancel) {
		$(btn).addClass('bt_cancle2').attr('disabled',true).val('请稍候');
		var t = $(btn).parent().prev(1).children().val();
		if(t.length<1) { alert('回复内容不能为空'); return false;}
		//获取当前点击的链接的href
		var href=$(alink).attr('href');	
		$.post(href,{content: t,act:'quote'},function(txt){	
			if(txt=='1'){
				alert('请先登陆');
				quotebox.remove();
				$(alink).show();	
			}if(txt=='2'){
				alert('您不是该小组的成员');
				quotebox.remove();
				$(alink).show();	
			}else{				
				quotebox.parent().parent().parent().append(txt);
				quotebox.remove();
				$(alink).show();	
			}
		});
	}
	else {
		quotebox.remove();
		$(alink).show();	
	}	
}
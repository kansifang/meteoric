/*
 * o2dialog 1.0.0 - Javascript Dialog
 *
 * Copyright (c) 2009 apeng (http://www.o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-04-19 15:27:18
 * $Rev: 1 $
 */  
function o2Dialog(r){
	var $th = this;
	/* 继承参数 */
	$th.R = $.extend(
		{
			bind:'',
			loadMask:true,
			width:600,
			title:'请确认',
			okText:'确 定',
			okFunc:function(e){},
			cancelText:'取 消',
			cancelFunc:function(e){},
			func:function(){}
		},r
	);
	var suijishu = Math.round(Math.random()*1000);
	$th.R['overlay'] = 'o2dialog_overlay_'+((new Date()).getTime())+'_'+suijishu;
	$th.R['popup']   = 'o2dialog_pop_'+((new Date()).getTime())+'_'+suijishu;
	/* 关闭 */
	$th.close = function(){$('#'+$th.R.overlay).hide();$('#'+$th.R.popup).hide();};
	/* 显示对话框 */
	$th.show = function(){
		$('.o2dialog_overlay').hide();
		$('.o2dialog_pop').hide();
		$('#'+$th.R.overlay).show();
		$('#'+$th.R.popup).show();
		$th.R.func();
	};
	/**
	* 初始化当前对象的html
	*/
	/* 遮罩层 */
	if($th.R.loadMask){
		$(document.body.firstChild).before('<div id="'+$th.R.overlay+'" class="o2dialog_overlay"></div>');
		var div_height=screen.height>document.body.offsetHeight?screen.height:document.body.offsetHeight;
		$('#'+$th.R.overlay).css('height',div_height);
		$('#'+$th.R.overlay).css('width',window.screen.width);
		//document.documentElement.clientWidth
	}
	/* 对话框 */
	var htmls = '<div id="'+$th.R.popup+'" class="o2dialog_pop">  ';
  htmls += '    <table class="pop_dialog_table" style="width:'+$th.R.width+'px" >';
  htmls += '     <tbody>';
  htmls += '       <tr>';
  htmls += '         <td class="pop_topleft"></td>';
  htmls += '         <td class="pop_border"></td>';
  htmls += '         <td class="pop_topright"></td>';
  htmls += '       </tr>';
  htmls += '       <tr>';
  htmls += '         <td class="pop_border"></td>';
  htmls += '         <td class="pop_content">';
	htmls += ' 					<h2><span>'+$th.R.title+'</span></h2>';
  htmls += '           <div class="dialog_content" >';
												/* 内容 */
  htmls += '           </div>';
	htmls += ' 					<div class="dialog_buttons">';
	htmls += ' 						<input type="button" value="'+$th.R.okText+'" class="dialog_ok_btn"/>';
	htmls += ' 						<input type="button" value="'+$th.R.cancelText+'" class="dialog_cancel_btn"/>';
	htmls += ' 					</div>';
	htmls += ' 				</td>';
  htmls += '        <td class="pop_border"></td>';
  htmls += '       </tr>';
  htmls += '       <tr>';
  htmls += '         <td class="pop_bottomleft"></td>';
  htmls += '         <td class="pop_border"></td>';
  htmls += '         <td class="pop_bottomright"></td>';
  htmls += '       </tr>';
  htmls += '     </tbody>';
  htmls += '   </table>';
  htmls += ' </div> ';
  $(document.body.firstChild).before(htmls);
	/* 把内容塞进去 */
	$('#'+$th.R.popup).find('.dialog_content').append($('#'+$th.R.bind).show());
	/* 赋一些事件 */
	$('#'+$th.R.popup).find('.dialog_ok_btn').click(function(e){
		$th.R.okFunc(e);
	});
	$('#'+$th.R.popup).find('.dialog_cancel_btn').click(function(e){
		$th.close();
		$th.R.cancelFunc(e);
	});
	window.setInterval(function(){$('#'+$th.R.popup).css('top',document.documentElement.scrollTop+60);}, 300);
} 
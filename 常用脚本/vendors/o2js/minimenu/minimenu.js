/*通用的小型功能菜单
 * 2008-10-09 by aHuang*/
if(typeof miniMenu == "undefined"){
	if(typeof window.jQuery == "undefined"){
	   thorw('由于没有加载jQuery库，所以本功能不能使用，请加载jQuery库，谢谢合作！');
	}
	
	function miniMenu(_objs){
		var $sObj = this;
		var outStr = '';
		var outStr2 = '';
		var display = '';
		var colors = '';
		var indexs = 1;
		$sObj.args = $.extend({
			id:'',//功能菜单所绑定的位置
			height:'',//高
			width:'',//宽
			titlecss:'mini_titles',//标题样式
			subtitlecss:'mini_subtitles',//菜单标题样式
			linecss:'mini_lineWidth',//分割线样式
			divcss:'mini_divcss',//divcss样式
			tabcss:'mini_tabcss',//tabcss样式
			menuTitle:['一般操作'],//菜单标题的名称
			menuTitleDisplay:['none'],//菜单标题显示开关
			menuStr:['一般操作:操作会议营销'],//菜单的名称
			menStrEvent:[],//菜单的事件
			menFlag:[],//可访问菜单的权限
			fun:function(){},//外部函数
			ver:'ver 1.0.0.0'//版本
		},_objs||{});
		
		$sObj.creates = function(){
			
			$('#MinMenu').remove();
			
			$sObj.outStr = '<div id="MinMenu" class="'+$sObj.args.divcss+'">';
			$sObj.outStr += '<table class="'+$sObj.args.tabcss+'" height="'+$sObj.args.height+'" width="'+$sObj.args.width+'">';
			$sObj.outStr += '<tr>';
			$sObj.outStr += '<td bgcolor="#FFFFFF" valign="top" id="contectMenu">';
			$sObj.outStr += '</td>';
			$sObj.outStr += '</tr>';
			$sObj.outStr += '</table >';
			
			$('body').append($sObj.outStr);
			
			$sObj.outStr2 = '<table>';
			
			for(var i=0;i<($sObj.args.menuTitle).length;i++){
				$sObj.outStr2 +='<tr style="display:'+($sObj.args.menuTitleDisplay)[i]+'"><td colspan="4"><div class="'+$sObj.args.titlecss+'">'+($sObj.args.menuTitle)[i]+'</div></td></tr><tr>';
				$sObj.indexs = 1;
				for(var j=0;j<($sObj.args.menuStr).length;j++){
					var splitStr = (($sObj.args.menuStr)[j]).split(':');
					if(splitStr[0]==($sObj.args.menuTitle)[i]){
						if(($sObj.args.menFlag)[j]=="1"){
							$sObj.display = '<a href="#" onClick="'+($sObj.args.menStrEvent)[j]+'" id="'+($sObj.args.menStrEvent)[j]+'">'+splitStr[1]+'</a>';
						}else{
							$sObj.display = splitStr[1];
							$sObj.colors = 'style="color:#CCCCCC"';
						}
						
						$sObj.outStr2 += '<td class="'+$sObj.args.subtitlecss+'" '+$sObj.colors+'>'+$sObj.display+'</td>';
						
						if($sObj.indexs%4==0){
							$sObj.outStr2 += '</tr><tr>';
						}
						$sObj.indexs ++;
					}
				}
			}
			
			$sObj.outStr2 += '</tr><tr><td class="e-form-line2 '+$sObj.args.linecss+'" colspan="4">&nbsp;</td></tr>';
			$sObj.outStr2 += '</table>';
			$('#contectMenu').empty();
			$('#contectMenu').append($sObj.outStr2);
			
			//$sObj.events();
		}
		
		$sObj.events = function(){
			$('#'+$sObj.args.id).mouseover(function(event){
				
				$sObj.creates();
				
		   		$('#MinMenu').show(400);
		   		$('body').bind("click",function(){
		   			$('#MinMenu').hide(400,function(){$('#MinMenu').remove();});
		   		});
		   		var dx = (screen.width-document.body.clientWidth)/2;
		   		var dy = (screen.height-document.body.clientHeight)/2;
		   		
		   		if(event.pageX+parseInt($sObj.args.width)>document.body.clientWidth){
		   			event.pageX = document.body.clientWidth-parseInt($sObj.args.width);
		   		}
		   		
		   		if(event.pageY+parseInt($sObj.args.height)>document.body.clientHeight){
		   			event.pageY = document.body.clientHeight-parseInt($sObj.args.height);
		   		}
		   		//alert(document.body.clientWidth);
		   		$('#MinMenu').css('left',event.pageX);
		   		$('#MinMenu').css('top',event.pageY);
		   		$sObj.args.fun();
		   });
		   $('#MinMenu').mouseover(function(){
		   		$('body').unbind("click");
		   }).mouseout(function(){
		   		$('body').bind("click",function(){
		   			$('#MinMenu').hide(400);
		   		});
		   });
		}
	}
}
/*
 * o2Grid 1.2.2 - Javascript Grid
 *
 * Copyright (c) 2009 apeng (http://o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-08-4 11:55:15 $
 * $Rev: 111 $
 */
function o2Grid(r){
	var $th = this;
	/* 继承参数 */
	$th.R = $.extend(
		{
			bind:'',				 
			url: '',
			type:'post',
			caption:'',
			loadtext: "加载中...",		
			imgpath:'.',
			height: 0,
			width:0,
			rowNum: 10,
			sortindex: '',
			sortmapping:'',
			dir: 'desc',
			autoExpandCol: 'remark',
			singleSelect:true,
			highSelect:false,//只在 singleSelect 为true情况下 有效
			loadMask: false,
			className:'theme1',
			pageCtl:{top:false,bottom:true},
			pageCtlShowText:true,
			pageCtlShowImage:true,
			pageAlign:'left',
			cols:[
			],
			sltrows:[],
			page:1,
			total:0,
			baseParams:{},
			runfunc:function(obj){},
			beforefunc:function(obj){},
			rowClick:function(obj,json,rowIndex,EventObject){},
			rowDblClick:function(obj,json,rowIndex,EventObject){},
			rows:[],
			tableTotal:'',
			cookies:false,			//是否记录cookie信息
			cookieName:'example',//记录cookie信息时的唯一标示
			cookie_obj:false,
			groups:false,
			groupBy:''
		},
		r || {}
	);
 	/* 赋baseparams的值 */
	this.setBaseParams = function(obj){
		for(var k in obj){
			$th.R.baseParams[k] = obj[k];
		}
	};
	/* 清空baseparams的值 */
	this.clearBaseParams = function(){
		$th.R.baseParams = {};
	};
	
	/* 加载cookie记录值，分为系统和自定义obj */
	this.loadCookie = function(obj){
		var val1 = $th._loadParamsCookie(obj);
		var val2 = $th._loadSystemCookie();
		return (val1 || val2);
	};
	/* 检查cookie条件，并且初始化cookie的值到当前对象里 */
	this._loadParamsCookie = function(obj){
		var cur_cookie = $th.getcookie('o2grid_key_');
		var ret = false;
		if(cur_cookie === $th.R.cookieName){
			ret = true;
			/* 挖赛，最后一次存的是我的cookie标识 */
			var temps = $th._returncookie();
			for(var ii=0; ii<obj.length; ii++){
				var c_v = temps['u_'+obj[ii]];
				if(typeof c_v !== 'undefined'){
					var o_temp = {};
					o_temp[obj[ii]] = c_v;
					$th.setBaseParams(o_temp);
				}
			}
		}
		return ret;
	};
	/* 检查cookie条件，加载cookie里的page信息,翻页信息 */
	this._loadSystemCookie = function(){
		var cur_cookie = $th.getcookie('o2grid_key_');
		var ret = false;
		if(cur_cookie === $th.R.cookieName){
			ret = true;
			/* 挖赛，最后一次存的是我的cookie标识 */
			var temps = $th._returncookie();
			$th.R.sortindex = temps.s_si;
			$th.R.sortmapping = temps.s_sm;
			$th.R.dir = temps.s_dir;
			$th.R.page = Math.abs(temps.s_page);
			if(temps.s_si != '' && temps.s_sm != ''){
				$th.sortTableImg(temps.s_si,temps.s_sm);
			}
		}
		return ret;
	};
	/* 提供两个获取这些cookie值的函数 1 根据参数变量返回对应cookie值 */
	this.getParamsCookie = function(obj){
		var cur_cookie = $th.getcookie('o2grid_key_');
		var ret = {};
		if(cur_cookie === $th.R.cookieName){
			/* 挖赛，最后一次存的是我的cookie标识 */
			var temps = $th._returncookie();
			for(var ii=0; ii<obj.length; ii++){
				var c_v = temps['u_'+obj[ii]];
				if(typeof c_v !== 'undefined'){
					ret[obj[ii]] = c_v;
				}
			}
		}
		return ret;
	};
	/* 提供两个获取这些cookie值的函数 2 系统数据，页面、排序字段、排序标题、排序类型 */
	this.getSystemCookie = function(){
		var cur_cookie = $th.getcookie('o2grid_key_');
		var ret = {};
		if(cur_cookie === $th.R.cookieName){
			/* 挖赛，最后一次存的是我的cookie标识 */
			var temps = $th._returncookie();
			ret['sortindex'] = temps.s_si;
			ret['sortmapping'] = temps.s_sm;
			ret['dir'] = temps.s_dir;
			ret['page'] = temps.s_page;
		}
		return ret;
	};
	/* 返回cookie */
	this._returncookie = function(){
		if($th.R.cookie_obj === false){
			$th.R.cookie_obj = $th._deparam($th.getcookie('o2grid_val_'));
		}
		return $th.R.cookie_obj;
	}
	/* 记录cookie */
	this._recordcookie = function(){
		/* 覆盖当前的cookie */
		$th.setcookie('o2grid_key_',$th.R.cookieName);
		/* 组装对象进行保存 */
		var c_obj = {};
		c_obj['s_si'] = $th.R.sortindex;
		c_obj['s_sm'] = $th.R.sortmapping;
		c_obj['s_dir'] = $th.R.dir;
		c_obj['s_page'] = $th.R.page;
		for(var kk in $th.R.baseParams){
			c_obj['u_'+kk] = $th.R.baseParams[kk];
		}
		$th.setcookie('o2grid_val_',$th._enparam(c_obj));
	};
	/* 序列化对象 */
	this._enparam = function(obj){
		return $.param(obj);
	};
	/* 反序列化对象 */
	this._deparam = function(str){
		var arrStr = str.split("&");
		var tm_obj = {};
		for ( var ii = 0; ii < arrStr.length; ii++) {
			var temp = arrStr[ii].split("=");
			tm_obj[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
		}
		return tm_obj;
	};
	/* 加载数据 */
	this.load = function($page){
		if($page){
			$th.R.page = Math.abs( $page );
		}
		$th.reload();
	};
	/* 刷新加载 */
	this.reload = function(){
		$th.R.beforefunc($th);
		/* 页面表现设置 */
		$('#'+$th.R.bind + ' input.reload').each(function(e){
			$(this).attr('src',$th.R.imgpath+'/load.gif');
		});
		$('#'+$th.R.bind + ' .NavBtn').attr('disabled','disabled');
		//$('#'+$th.R.bind + ' span.resultsInfo').html($th.R.loadtext);
		/* 参数设置 */
		var $url = $th.R.url;
		if($url.indexOf('?') == -1){
			$url += '?timer='+ (new Date().getTime());
		}else{
			$url += '&timer='+ (new Date().getTime());
		}
		var $data = {};
		/* 开始点和个数 */
		if($th.R.page < 1) $th.R.page = 1;
		$data['start'] = ($th.R.page - 1) * $th.R.rowNum;
		$data['limit'] = $th.R.rowNum;
		/* 排序信息 */
		if( $th.R.sortindex != ''){
			$data['sort'] = $th.R.sortmapping;
			$data['dir'] = $th.R.dir;
		}
		/* load层 */
		if($th.R.loadMask){
			$('#'+$th.R.bind + ' .LoadMsg').show();
		}
		/* 记录当前搜索信息到cookie */
		if($th.R.cookies){
			$th._recordcookie();
		}
		$.ajax({
			type:$th.R.type,
			url:$url,
			data:$.extend($data,($th.R.baseParams || {})),
			success: function(e){		
				if($th.R.loadMask){
					$('#'+$th.R.bind + ' .LoadMsg').hide();
				}
				try{
					var resp = eval('(' + e + ')');
				}catch(e){
					throw('Ajax Response data error,Do you understand?');
				}
				$th.R.runfunc(resp);
				$th.R.total = resp.total;
				$th.R.rows = resp.results;
				
				/* 底部统计栏 */
				if($th.R.tableTotal !== '' && $th.R.tableTotal.constructor == Function){
						$('#'+$th.R.bind + ' .GridTableTotal').html($th.R.tableTotal(resp));
				}
				
				var $rowNums = Math.ceil( $th.R.total/$th.R.rowNum );
				/* 还原页面表现 */
				$('#'+$th.R.bind + ' .first').attr('src',$th.R.imgpath+'/first.gif');
				$('#'+$th.R.bind + ' .prev').attr('src',$th.R.imgpath+'/prev.gif');
				$('#'+$th.R.bind + ' .next').attr('src',$th.R.imgpath+'/next.gif');
				$('#'+$th.R.bind + ' .last').attr('src',$th.R.imgpath+'/last.gif');
				$('#'+$th.R.bind + ' .NavBtn').attr('disabled','');				
				$('#'+$th.R.bind + ' .reload').attr('src',$th.R.imgpath+'/load.png');
				if(resp.total == 0){
					$('#'+$th.R.bind + ' span.resultsInfo').html('0');
				}else{
					$('#'+$th.R.bind + ' span.resultsInfo').html(resp.total);
				}
				$('#'+$th.R.bind+' .results').html($rowNums);
				$('#'+$th.R.bind+' input.inputpage').val($th.R.page);
				$('#'+$th.R.bind + ' .GridCols .cboxall').attr('checked','');
				/* 如果到了第一页或最后一页 */
				if($th.R.page == 1){
					$('#'+$th.R.bind + ' .first').attr('disabled','disabled');
					$('#'+$th.R.bind + ' .prev').attr('disabled','disabled');		
					$('#'+$th.R.bind + ' .first').attr('src',$th.R.imgpath+'/off-first.gif');
					$('#'+$th.R.bind + ' .prev').attr('src',$th.R.imgpath+'/off-prev.gif');
				}
				if($th.R.page == $rowNums || $rowNums==0){
					$('#'+$th.R.bind + ' .next').attr('disabled','disabled');
					$('#'+$th.R.bind + ' .last').attr('disabled','disabled');	
					$('#'+$th.R.bind + ' .next').attr('src',$th.R.imgpath+'/off-next.gif');
					$('#'+$th.R.bind + ' .last').attr('src',$th.R.imgpath+'/off-last.gif');
				}
				/* 组装数据 */ 
				$('#'+$th.R.bind + ' .GridRowsInner').empty();
				/* 如果没有字段就不再执行下去了 */
				if( $th.R.cols.length == 0 ){
					$('#'+$th.R.bind + ' .GridCols').remove();
					$('#'+$th.R.bind + ' .GridRows').remove();
					return false;
				}
				var innerhtml = '';
				var group_now = '';
				var group_length = Math.abs($th.R.cols.length);
				var group_pointer = 0;
				var group_class = 'group_class_'+group_pointer;
				if(!$th.R.singleSelect) group_length++;
				var grouptd_width = 0;
				if($th.R.groups){
					if(!$th.R.singleSelect) grouptd_width += 20;
					for(var kk=0; kk<$th.R.cols.length; kk++){
						grouptd_width += Math.abs($th.R.cols[kk].width);
					}			
				}
				
				for(var jj=0; jj<resp.results.length ; jj++){
					var cls = '';
					var res_obj = resp.results[jj];
					if( jj%2 == 0){
						cls = 'odd';
					}
					var htmls = '';
					
					/* 分组显示 */
					if($th.R.groups){
						try{
							var group_val = res_obj[$th.R.groupBy];
							if(typeof group_val == 'undefined'){
								throw('groupBy set error! Please check your grid setting');
							}
						}catch(e){
							throw('groupBy set error! Please check your grid setting');
						}
						if(group_now != group_val){
							group_pointer++;
							group_class = 'group_class_'+group_pointer;
							/* 第一行的分组前要加tr */
							if(jj == 0){
								htmls += '<tr>';
								if(!$th.R.singleSelect){
									htmls += '<td style="width:20px;line-height:0px;height:0px;padding:0px;border-bottom:0px;border-left:0px"></td>';
								}
								for(var kk=0; kk<$th.R.cols.length; kk++){
									htmls += '<td style="width:'+$th.R.cols[kk].width+'px;line-height:0px;height:0px;padding:0px;border-bottom:0px;border-left:0px"></td>';
								}
								htmls += '</tr>';
							}
							//新组
							group_now = group_val;
							htmls += '<tr class="GridRowsGroupTr"><td class="GridRowsGroupTd" style="text-align:left;width:'+grouptd_width+'px" colspan="'+group_length+'" >';
							/* 伸缩按钮 */
							htmls += '<img src="'+$th.R.imgpath+'/group_open.gif" imgState="open" class="group_power" childers="'+group_class+'" />';
							htmls += ' '+group_now;
							htmls += '</td></tr>';
						}
					}					
					
					htmls += '<tr class="' + cls + ' GridRowsInnerTr '+group_class+'" trIndex="' + jj + '" trslt="0" >';
					if(!$th.R.singleSelect){
						htmls += '<td class="GridRowsInnerTd" style="width:20px;text-align:center"><input type="checkbox" class="cbox"  /></td>';
					}
					for(var kk=0; kk<$th.R.cols.length; kk++){
						eval('var temp_str = res_obj.'+$th.R.cols[kk].index);
						
						if($th.R.cols[kk].func != ''){
							temp_str = $th.R.cols[kk].func(temp_str,jj,$th.R.cols[kk].index,resp.results[jj],$th.R);
						}
						if(temp_str == "" || temp_str == " " || temp_str == "  " ) temp_str = "&nbsp;";
						htmls += '<td style="width:'+$th.R.cols[kk].width+'px;text-align: '+$th.R.cols[kk].align+';" class=" '+$th.R.cols[kk].index+' '+$th.R.cols[kk].index+'_td GridRowsInnerTd">'+temp_str+'</td>';
					}
					htmls += '</tr>';
					innerhtml += htmls;
				}
				if(innerhtml == ''){
					innerhtml = '<tr><td></td></tr>';
				}
				$('#'+$th.R.bind + ' .GridRowsInner').append(innerhtml);
				
				/* 分组的打开和关闭 */
				if($th.R.groups){
					$('#'+$th.R.bind + ' .group_power').each(function(e){
						var childers = $(this).attr('childers');
						$(this).click(function(e){
							$('#'+$th.R.bind + ' .'+childers).toggle();
							var states = $(this).attr('imgState');
							if(states == 'open'){
								 $(this).attr('imgState','close');
								 $(this).attr('src',$th.R.imgpath+'/group_close.gif');
							}else{
								 $(this).attr('imgState','open');
								 $(this).attr('src',$th.R.imgpath+'/group_open.gif');
							}
						});
					}); 
				} 
				
				/* 设置数据样式,以及行选中样式 */
				$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').mouseover(function(){
					$(this).addClass("mouseon");
				}).mouseout(function(){
					$(this).removeClass("mouseon");
				});
				/* 单击事件 */
				$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').click(function(e){
					/* 添加参数事件 */
					$th.R.rowClick($th,$th.R.rows[$(this).attr('trIndex')],$(this).attr('trIndex'),e);
					/* 单选的时候才高亮行控制 */
					if(!$th.R.singleSelect){
						/* 一些常规事件 */
						if($(this).attr('trslt') == '0'){
							$th.rowSelect($(this).attr('trIndex'));
						}else{
							$th.rowUnSelect($(this).attr('trIndex'));
						}
					}else{
						if($th.R.highSelect){
							/* 一些常规事件 */
							if($(this).attr('trslt') == '0'){
								$th.rowSelect($(this).attr('trIndex'));
							}else{
								$th.rowUnSelect($(this).attr('trIndex'));
							}
						}
					}
				});
				/* 双击事件 */
				$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').dblclick(function(e){
					/* 添加参数事件 */
					$th.R.rowDblClick($th,$th.R.rows[$(this).attr('trIndex')],$(this).attr('trIndex'),e);
				});
				/* 设置checkbox选中 */
				if(!$th.R.singleSelect){
					$('#'+$th.R.bind + ' .GridCols .cboxall').bind('click',function(){
						if(this.checked){
							$('#'+$th.R.bind + ' .cbox').attr('checked','checked');
							$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').addClass('selected');
							$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').attr('trslt','1');
						}else{
							$('#'+$th.R.bind + ' .cbox').attr('checked','');
							$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').removeClass('selected');
							$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').attr('trslt','0');
						}
					});
				}
				/* ajax完毕......... */
			}
		});
	};
	/* 选中某行 */
	this.rowSelect = function(row){
		if($th.R.singleSelect){
			$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').removeClass('selected').attr('trslt','0');
			$('#'+$th.R.bind + ' .cbox').attr('checked','');
		}
		$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').each(function(){
			if($(this).attr('trindex') == row){
				$(this).addClass('selected').attr('trslt','1').find('.cbox').attr('checked','checked');
			}
		});
	};
	/* 不选中某行 */
	this.rowUnSelect = function(row){
		$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').each(function(){
			if($(this).attr('trindex') == row){
				$(this).removeClass('selected').attr('trslt','0').find('.cbox').attr('checked','');
			}
		});
	};
	/* 得到选中 */
	this.getSelect = function(){
		var slt_obj = [];
		$('#'+$th.R.bind + ' .GridRowsInner tr.GridRowsInnerTr').each(function(e){
			if($(this).attr('trslt') == '1') slt_obj.push($th.R.rows[$(this).attr('trIndex')]);
		});
		return slt_obj;
	};
	/* 翻到第一页 */
	this.toFirst = function(){
		$th.R.page = 1;
		$th.reload();
	};
	/* 翻到上一页 */
	this.toPrev = function(){
		$th.R.page = $th.R.page - 1;
		$th.reload();
	};
	/* 翻到下一页 */
	this.toNext = function(){
		$th.R.page = $th.R.page + 1;
		$th.reload();
	};
	/* 翻到最后一页 */
	this.toLast = function(){
		var $page = 1;
		$page = Math.ceil( $th.R.total/$th.R.rowNum );

		$th.R.page = Math.abs($page);
		$th.reload();
	};
	/* 排序，仅仅是图标显示 */
	this.sortTableImg = function($sortindex,$sortmapping){
		if($th.R.sortindex != ''){
			$('#'+$th.R.bind+' .'+$th.R.sortindex+'_div img').each(function(e){
				$(this).remove();
			})
		}
		$th.R.sortindex = $sortindex;
		$th.R.sortmapping = $sortmapping;
		if($th.R.dir == 'desc'){
			$th.R.dir = 'desc';
		}else{
			$th.R.dir = 'asc';
		}
		$('#'+$th.R.bind+' .'+$sortindex+'_div').append('<img src="'+$th.R.imgpath+'/'+$th.R.dir+'.png"/>');
	};
	/* 排序 */
	this.sortTable = function($sortindex,$sortmapping){
		if($th.R.sortindex != ''){
			$('#'+$th.R.bind+' .'+$th.R.sortindex+'_div img').each(function(e){
				$(this).remove();
			})
		}
		$th.R.sortindex = $sortindex;
		$th.R.sortmapping = $sortmapping;
		if($th.R.dir == 'desc'){
			$th.R.dir = 'asc';
		}else{
			$th.R.dir = 'desc';
		}
		$('#'+$th.R.bind+' .'+$sortindex+'_div').append('<img src="'+$th.R.imgpath+'/'+$th.R.dir+'.png"/>');
		$th.reload();
	};
	/**************************************************/
 	/******************** 组装grid ********************/
	/**************************************************/
	$('#'+$th.R.bind).addClass('o2grid '+$th.R.className);
	var widths = 0;
	for(var k=0; k<$th.R.cols.length; k++){
		$th.R.cols[k] = $.extend(
			{
				index:'id',
				name:'ID',
				width:80,
				align:'left',
				sortable:true,
				mapping:'',
				func:''  //function XXX(val,row_index,column_name,json, R)
			},
			$th.R.cols[k]
		);
		if($th.R.cols[k].mapping == ''){
			$th.R.cols[k].mapping = $th.R.cols[k].index;
		}
		widths += $th.R.cols[k].width;
	}
	widths += $th.R.cols.length * 7 + ($th.R.singleSelect ? 0:20 );
	var tableWidth = ' width:'+widths+'px ';
	var divWidth   = '';
	var divHeight   = '';
	if($th.R.height > 0){
		divHeight = ' height:'+$th.R.height+'px ';
	}
	if($th.R.width > 0){
		divWidth = ' width:'+$th.R.width+'px ';
	}else{
		
		if($th.R.cols.length>0 && $.browser.msie){
	  	divWidth = ' width:'+$('#'+$th.R.bind).width()+'px ';
		}
//		/* 赋事件自适应宽度,还未完成。。。 */
//		window.onresize = function(){ 
//			$w = $('#'+$th.R.bind).width();
//			$('#'+$th.R.bind + ' .GridHead').css('width',$w+'px');
//			$('#'+$th.R.bind + ' .GridNav').css('width',$w+'px');
//			$('#'+$th.R.bind + ' .GridCols').css('width',$w+'px');
//			$('#'+$th.R.bind + ' .GridRows').css('width',$w+'px');
//		};
	}
	var htmls = '';
	/* 头部 */
	if($th.R.caption != ''){
		htmls += '<div class="GridHead" style=" '+divWidth+' ">';
		htmls += '<div class="GridHead2">';
		htmls += $th.R.caption + '</div></div>';
	}
	/* 公用的导航条 */
	var htmls_nav = '';
	htmls_nav += '<div class="GridNav" style=" '+divWidth+' ; text-align:'+$th.R.pageAlign+' ">';
	//htmls_nav += '[ 页码: <input class="inputpage NavBtn" disabled="disabled" type="text" value="1" maxlength="5"  /><span class="inputpagego">Go</span> / <span style="font-weight:bold;" class="results">0</span> 共计:<span class="resultsInfo" style="color:red;font-weight:bold;">0</span>条 ] ';
	if($th.R.pageCtlShowText){
		htmls_nav += '[ 页码: <input class="inputpage NavBtn" disabled="disabled" type="text" value="1" maxlength="5"  /> / <span style="font-weight:bold;" class="results">0</span> 共计:<span class="resultsInfo" style="color:red;font-weight:bold;">0</span>条 ] ';
	}
	if($th.R.pageCtlShowImage){
		htmls_nav += '<input class="first NavBtn" disabled="disabled" value="first"  type="image" src="'+$th.R.imgpath+'/first.gif" /> ';
		htmls_nav += '<input class="prev NavBtn" disabled="disabled" value="prev"  type="image" src="'+$th.R.imgpath+'/prev.gif"  /> ';
		htmls_nav += '<input class="reload NavBtn"  value="reload" type="image" src="'+$th.R.imgpath+'/load.png"  /> ';
		htmls_nav += '<input class="next NavBtn" disabled="disabled" value="next" type="image" src="'+$th.R.imgpath+'/next.gif" /> ';
		htmls_nav += '<input class="last NavBtn" disabled="disabled" value="last" type="image" src="'+$th.R.imgpath+'/last.gif"  /> ';
	}
	htmls_nav += '</div>';
	/* 头部导航条 */
	if($th.R.pageCtl.top === true){
		htmls += htmls_nav;
	}
	/* 标题 */
	htmls += '<div class="GridCols" style=" '+divWidth+' ">';
	htmls += '<div class="LoadMsg" >'+$th.R.loadtext+'</div>';
	htmls += '<table cellspacing="0" cellpadding="0" class="o2table" border="0" style="'+tableWidth+'" >';
	htmls += '<thead><tr>';
	if(!$th.R.singleSelect){
		htmls += '<th style="width:20px;text-align:center"><input type="checkbox" class="cbox cboxall"  /></th>';
	}
	for(var k=0; k<$th.R.cols.length; k++){
		var objs=$th.R.cols[k];
		htmls += '<th style="width: '+objs.width+'px;" class=" '+objs.index+' '+objs.index+'_'+k+'_th ">';
	  /* htmls += '<span> </span>'; */
		if(objs.sortable){
			htmls += '<div class=" '+objs.index+'_'+k+'_div " style="cursor:pointer;">'+objs.name+'</div>';
		}else{
			htmls += '<div class=" '+objs.index+'_'+k+'_div "  style="cursor:default;">'+objs.name+'</div>';
		}
		htmls += '</th>';
	}
	htmls += '</tr></thead></table></div>';
	/* 内容 */
	htmls += '<div class="GridRows" style=" '+divHeight+' ; '+divWidth+'  ">';
	htmls += '<table cellspacing="0" cellpadding="0" class="o2table"  border="0" style="'+tableWidth+'" >';
	htmls += '<tbody class="GridRowsInner"><tr class="GridRowsInnerTrNoData"><td class="GridRowsInnerTdNoData"></td></tr></tbody></table></div>';
	/* 底部统计栏 */
	if($th.R.tableTotal !== ''){
		if($th.R.tableTotal.constructor == String){
			htmls += '<div class="GridTableTotal" >'+$th.R.tableTotal+'</div>';
		}else if($th.R.tableTotal.constructor == Function){
			htmls += '<div class="GridTableTotal" ></div>';
		}
	}
	/* 底部导航条 */
	if($th.R.pageCtl.bottom === true){
		htmls += htmls_nav;
	}
	$('#'+$th.R.bind).append(htmls);
	/* 事件绑定 */
	$('#'+$th.R.bind+' .GridRows').scroll(function(){
		var tmp = $('#'+$th.R.bind+' .GridRows').get(0).scrollLeft;
		if(!tmp) tmp = 0;
		$('#'+$th.R.bind+' .GridCols').scrollLeft(tmp);
	});
	$('#'+$th.R.bind+' .first').click ( $th.toFirst );
	$('#'+$th.R.bind+' .prev').click ( $th.toPrev );
	$('#'+$th.R.bind+' .next').click ( $th.toNext );
	$('#'+$th.R.bind+' .last').click ( $th.toLast );
	$('#'+$th.R.bind+' .inputpagego').click(function(e){
			var $page = $('#'+$th.R.bind+' .inputpage').val();
			if(isNaN($page)){
				$page = 1;
			}
			var $rowNums = Math.ceil( $th.R.total/$th.R.rowNum );
			if($page < 1) $page=1;
			if($page > $rowNums ) $page = $rowNums;
			$('#'+$th.R.bind+' .inputpage').val($page);
			$th.load($page);
	});
	$('#'+$th.R.bind+' .inputpage').keypress(function(e){
	  if(e.keyCode==13||e.keyCode==10){
			var $page = this.value;
			if(isNaN($page)){
				$page = 1;
			}
			var $rowNums = Math.ceil( $th.R.total/$th.R.rowNum );
			if($page < 1) $page=1;
			if($page > $rowNums ) $page = $rowNums;
			this.value = $page;
			$th.load($page);
		}
	});
	$('#'+$th.R.bind+' .inputpage').keyup(function(e){
		$('#'+$th.R.bind+' .inputpage').val($('#'+$th.R.bind+' .inputpage').val());																			
	});
	$('#'+$th.R.bind+' .reload').click ( $th.reload );
	/* 排序按钮 */
	for(var k=0; k<$th.R.cols.length; k++){
		/*!! 使用匿名函数来创建使用闭包的函数所需要的作用域*/
		(function(){
			var objs=$th.R.cols[k];
			var cur_k = k;
			if(objs.sortable){
				$('#'+$th.R.bind+' .'+objs.index+'_'+cur_k+'_th').click( function(){
					$th.sortTable(objs.index+'_'+cur_k,objs.mapping);
				})
			}
		})();
	}
};
o2Grid.prototype.R = {};
o2Grid.prototype.setcookie = function(name, value){
	var date = null;
	var expires = date;
	var path = '/';
	var domain = null;
	document.cookie = name + "=" + escape(value)
			+ ((expires == null) ? "" : ("; expires=" + expires.toGMTString()))
			+ ((path == null) ? "" : ("; path=" + path))
			+ ((domain == null) ? "" : ("; domain=" + domain));
};
o2Grid.prototype.getcookie = function(cookieName){
	var arrStr = document.cookie.split("; ");
	for ( var i = 0; i < arrStr.length; i++) {
		var temp = arrStr[i].split("=");
		if (unescape(temp[0]) == cookieName)
			return unescape(temp[1]);
	}
	return false;
};
o2Grid.prototype.throws = function(str){
	throw(str);
};
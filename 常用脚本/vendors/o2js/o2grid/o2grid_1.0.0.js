/*
 * o2Grid 1.0.0 - Grid Javascript (Free)
 *
 * Copyright (c) 2008 apeng (o2script.com)
 * $Date: 2008-07-16 18:05:17
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
			rowNum: 20,
			rowList:[20,30,40,50],
			sortindex: '',
			sortmapping:'',
			dir: 'desc',
			autoExpandCol: 'remark',
			singleSelect:true,
			loadMask: false,
			className:'theme1',
			pageCtl:{top:false,bottom:true},
			cols:[
			],
			sltrows:[],
			page:1,
			total:0,
			baseParams:{},
			rowClick:function(obj,json,rowIndex,EventObject){},
			rowDblClick:function(obj,json,rowIndex,EventObject){},
			rows:''
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
	/* 设置宽度 */
	this.resizeX = function($w){
		$('#'+$th.R.bind + ' .GridHead').css('width',$w+'px');
		$('#'+$th.R.bind + ' .GridNav').css('width',$w+'px');
		$('#'+$th.R.bind + ' .GridCols').css('width',$w+'px');
		$('#'+$th.R.bind + ' .GridRows').css('width',$w+'px');
	};
	this.resizeBindDiv = function(){
		$th.resizeX(  parseInt( $('#'+$th.R.bind+'').width() ) ||0 );
	};
	/* 设置高度 */
	this.resizeY = function($w){
		alert('Making...');
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
		/* 页面表现设置 */
		$('#'+$th.R.bind + ' .reload').each(function(e){
			$(this).attr('src',$th.R.imgpath+'/load.gif');
		});
		$('#'+$th.R.bind + ' .NavBtn').attr('disabled','disabled');
		
		$('#'+$th.R.bind + ' .resultsInfo').html($th.R.loadtext);
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
		/* 其他参数 */
		for(var k in $th.R.baseParams){
			$data[k] = $th.R.baseParams[k];
		}
		/* load层 */
		if($th.R.loadMask){
			$('#'+$th.R.bind + ' .LoadMsg').show();
		}
		$.ajax({
			type:$th.R.type,
			url:$url,
			data:$data,
			success: function(e){
				if($th.R.loadMask){
					$('#'+$th.R.bind + ' .LoadMsg').hide();
				}
				try{
					var resp = eval('(' + e + ')');
				}catch(e){
					throw('Ajax Response data error,Do you understand?');
				}
				$th.R.total = resp.total;
				$th.R.rows = resp.results;
				var $rowNums = Math.ceil( $th.R.total/$th.R.rowNum );
				/* 还原页面表现 */
				$('#'+$th.R.bind + ' .first').attr('src',$th.R.imgpath+'/first.gif');
				$('#'+$th.R.bind + ' .prev').attr('src',$th.R.imgpath+'/prev.gif');
				$('#'+$th.R.bind + ' .next').attr('src',$th.R.imgpath+'/next.gif');
				$('#'+$th.R.bind + ' .last').attr('src',$th.R.imgpath+'/last.gif');
				$('#'+$th.R.bind + ' .NavBtn').attr('disabled','');				
				$('#'+$th.R.bind + ' .reload').attr('src',$th.R.imgpath+'/load.png');
				if(resp.total == 0){
					$('#'+$th.R.bind + ' .resultsInfo').html('没有任何数据！');
				}else{
					$('#'+$th.R.bind + ' .resultsInfo').html('共检索出 '+resp.total+' 条数据！');
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
				for(var jj=0; jj<resp.results.length ; jj++){
					var cls = '';
					var res_obj = resp.results[jj];
					if( jj%2 == 0){
						cls = 'odd';
					}
					var htmls = '<tr class="' + cls + '" trIndex="' + jj + '" trSlt="0" >';
					if(!$th.R.singleSelect){
						htmls += '<td style="width:20px;text-align:center"><input type="checkbox" class="cbox"  /></td>';
					}
					for(var kk=0; kk<$th.R.cols.length; kk++){
						eval('var temp_str = res_obj.'+$th.R.cols[kk].index);
						if($th.R.cols[kk].func != ''){
							temp_str = $th.R.cols[kk].func(temp_str,kk,$th.R.cols[kk].index);
						}
						if(temp_str == "" || temp_str == " " || temp_str == "  " ) temp_str = "&nbsp;";
						htmls += '<td style="width:'+$th.R.cols[kk].width+'px;text-align: '+$th.R.cols[kk].align+';" class=" '+$th.R.cols[kk].index+' '+$th.R.cols[kk].index+'_td ">'+temp_str+'</td>';
					}
					htmls += '</tr>'; 
					$('#'+$th.R.bind + ' .GridRowsInner').append(htmls);
				}
				/* 设置数据样式,以及行选中样式 */
				$('#'+$th.R.bind + ' .GridRowsInner tr').mouseover(function(){
					$(this).addClass("mouseon");
				}).mouseout(function(){
					$(this).removeClass("mouseon");
				});
				/* 单击事件 */
				$('#'+$th.R.bind + ' .GridRowsInner tr').click(function(e){
					/* 添加参数事件 */
					$th.R.rowClick($th,$th.R.rows[$(this).attr('trIndex')],$(this).attr('trIndex'),e);
					/* 一些常规事件 */
					if($(this).attr('trSlt') == '0'){
						$th.rowSelect($(this).attr('trIndex'));
					}else{
						$th.rowUnSelect($(this).attr('trIndex'));
					}
				});
				/* 双击事件 */
				$('#'+$th.R.bind + ' .GridRowsInner tr').dblclick(function(e){
					/* 添加参数事件 */
					$th.R.rowDblClick($th,$th.R.rows[$(this).attr('trIndex')],$(this).attr('trIndex'),e);
				});
				/* 设置checkbox选中 */
				if(!$th.R.singleSelect){
					$('#'+$th.R.bind + ' .GridCols .cboxall').bind('click',function(){
						if(this.checked){
							$('#'+$th.R.bind + ' .cbox').attr('checked','checked');
							$('#'+$th.R.bind + ' .GridRowsInner tr').addClass('selected');
							$('#'+$th.R.bind + ' .GridRowsInner tr').attr('trSlt','1');
						}else{
							$('#'+$th.R.bind + ' .cbox').attr('checked','');
							$('#'+$th.R.bind + ' .GridRowsInner tr').removeClass('selected');
							$('#'+$th.R.bind + ' .GridRowsInner tr').attr('trSlt','0');
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
			$('#'+$th.R.bind + ' .GridRowsInner tr').removeClass('selected').attr('trSlt','0');
			$('#'+$th.R.bind + ' .cbox').attr('checked','');
		}
		$('#'+$th.R.bind + ' .GridRowsInner tr[@trindex='+row+']').addClass('selected').attr('trSlt','1');
		$('#'+$th.R.bind + ' .GridRowsInner tr[@trindex='+row+'] .cbox').attr('checked','checked');
	};
	/* 不选中某行 */
	this.rowUnSelect = function(row){
		$('#'+$th.R.bind + ' .GridRowsInner tr[@trindex='+row+']').removeClass('selected').attr('trSlt','0');
		$('#'+$th.R.bind + ' .GridRowsInner tr[@trindex='+row+'] .cbox').attr('checked','');
	};
	/* 得到选中 */
	this.getSelect = function(){
		var slt_obj = [];
		$('#'+$th.R.bind + ' .GridRowsInner tr[@trslt=1]').each(function(e){
			slt_obj.push($th.R.rows[$(this).attr('trIndex')]);
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
		$th.R.page = $page;
		$th.reload();
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
	$('#'+$th.R.bind).addClass('o2grid');
	$('#'+$th.R.bind).addClass($th.R.className);
	var divWidth   = 0;
	var tableWidth = 0;
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
				func:''
			},
			$th.R.cols[k]
		);
		if($th.R.cols[k].mapping == ''){
			$th.R.cols[k].mapping = $th.R.cols[k].index;
		}
		var objs = $th.R.cols[k];
		widths += objs.width;
	}
	if($th.R.singleSelect){
		widths += $th.R.cols.length * 7;
	}else{
		widths += $th.R.cols.length * 7 + 20;
	}
	tableWidth = widths;
	divWidth   = widths;
	if($th.R.width > 0){
		divWidth = $th.R.width;
	}else{
		divWidth = $('#'+$th.R.bind).width();
		/* 赋事件自适应宽度 */
		window.onresize = function(){
			$th.resizeX(  parseInt( $('#'+$th.R.bind+'').width() ) ||0 );
		};
	}
	var htmls = '';
	/* 头部 */
	if($th.R.caption != ''){
		htmls += '<div class="GridHead" style="width:'+(divWidth+0)+'px;">';
		htmls += '<div class="GridHead2">';
		htmls += $th.R.caption ;
		htmls += '</div></div>';
	}
	/* 导航条 */
	if($th.R.pageCtl.top === true){
		htmls += '<div class="GridNav" style=" width:'+(divWidth+0)+'px;">';
		htmls += '<input class="first NavBtn" disabled="disabled" value="first"  type="image" src="'+$th.R.imgpath+'/first.gif" /> ';
		htmls += '<input class="prev NavBtn" disabled="disabled" value="prev"  type="image" src="'+$th.R.imgpath+'/prev.gif"  /> ';
		htmls += '<input class="inputpage NavBtn" disabled="disabled" type="text" value="1" maxlength="5"  /> ';
		htmls += '<span > / </span>';
		htmls += '<span class="results" >0</span> ';
		htmls += '<input class="next NavBtn" disabled="disabled" value="next" type="image" src="'+$th.R.imgpath+'/next.gif" /> ';
		htmls += '<input class="last NavBtn" disabled="disabled" value="last" type="image" src="'+$th.R.imgpath+'/last.gif"  /> ';
		htmls += '<select class="rowlist NavBtn" disabled="disabled" >';
		for(var k=0; k<$th.R.rowList.length; k++){
			htmls += '<option >'+$th.R.rowList[k]+'</option>';
		}
		htmls += '</select> ';
		htmls += '<input class="reload NavBtn" disabled="disabled" value="reload" type="image" src="'+$th.R.imgpath+'/load.gif"  /> ';
		htmls += '<span class="resultsInfo" >'+$th.R.loadtext+'</span> ';
		htmls += '</div>';
	}
	/* 标题 */
	htmls += '<div class="GridCols" style="width:'+(divWidth+0)+'px;">';
	htmls += '<div class="LoadMsg" >'+$th.R.loadtext+'</div>';
	htmls += '<table cellspacing="0" cellpadding="0" class="o2table" border="0" style="width:'+tableWidth+'px" >';
	htmls += '<thead><tr>';
	if(!$th.R.singleSelect){
		htmls += '<th style="width:20px;text-align:center"><input type="checkbox" class="cbox cboxall"  /></th>';
	}
	for(var k=0; k<$th.R.cols.length; k++){
		var objs=$th.R.cols[k];
		htmls += '<th style="width: '+objs.width+'px;" class=" '+objs.index+' '+objs.index+'_th ">';
		/*htmls += '<span> </span>';*/
		if(objs.sortable){
			htmls += '<div class=" '+objs.index+'_div " style="cursor:pointer;">'+objs.name+'</div>';
		}else{
			htmls += '<div class=" '+objs.index+'_div "  style="cursor:default;">'+objs.name+'</div>';
		}
		htmls += '</th>';
	}
	htmls += '</tr></thead></table></div>';
	/* 内容 */
	if($th.R.height == 0){
		htmls += '<div class="GridRows" style="width:'+ (divWidth+0) +'px; ">';
	}else{
		htmls += '<div class="GridRows" style="height: '+$th.R.height+'px; width:'+ (divWidth+0) +'px; ">';
	}
	htmls += '<table cellspacing="0" cellpadding="0" class="o2table"  border="0" style="width:'+tableWidth+'px" >';
	htmls += '<tbody class="GridRowsInner">';
	htmls += '</tbody></table></div>';
	/* 导航条 */
	if($th.R.pageCtl.bottom === true){
		htmls += '<div class="GridNav" style=" width:'+(divWidth+0)+'px;">';
		htmls += '<input class="first NavBtn" disabled="disabled" value="first"  type="image" src="'+$th.R.imgpath+'/first.gif" /> ';
		htmls += '<input class="prev NavBtn" disabled="disabled" value="prev"  type="image" src="'+$th.R.imgpath+'/prev.gif"  /> ';
		htmls += '<input class="inputpage NavBtn" disabled="disabled" type="text" value="1" maxlength="5"  /> ';
		htmls += '<span > / </span>';
		htmls += '<span class="results" >0</span> ';
		htmls += '<input class="next NavBtn" disabled="disabled" value="next" type="image" src="'+$th.R.imgpath+'/next.gif" /> ';
		htmls += '<input class="last NavBtn" disabled="disabled" value="last" type="image" src="'+$th.R.imgpath+'/last.gif"  /> ';
		htmls += '<select class="rowlist NavBtn" disabled="disabled" >';
		for(var k=0; k<$th.R.rowList.length; k++){
			htmls += '<option >'+$th.R.rowList[k]+'</option>';
		}
		htmls += '</select> ';
		htmls += '<input class="reload NavBtn" disabled="disabled" value="reload" type="image" src="'+$th.R.imgpath+'/load.gif"  /> ';
		htmls += '<span class="resultsInfo" >'+$th.R.loadtext+'</span> ';
		htmls += '</div>';
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
	$('#'+$th.R.bind+' .reload').click ( $th.reload );
	$('#'+$th.R.bind+' .rowlist').bind ('change', function(){
		$th.R.rowNum = Math.abs($(this).val());
		$('#'+$th.R.bind+' .rowlist').val($(this).val());
		$th.load(1);
	});
	/* 排序按钮 */
	for(var k=0; k<$th.R.cols.length; k++){
		/*!! 使用匿名函数来创建使用闭包的函数所需要的作用域*/
		(function(){
			var objs=$th.R.cols[k];
			if(objs.sortable){
				$('#'+$th.R.bind+' .'+objs.index+'_th').click( function(){
					$th.sortTable(objs.index,objs.mapping);
				})
			}
		})();
	}
};
/* 对象核心变量对象 */
o2Grid.prototype.R = {}; 
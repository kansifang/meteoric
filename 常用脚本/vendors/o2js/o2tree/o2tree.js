/*
 * o2Tree 0.0.1 - Javascript Tree
 *
 * Copyright (c) 2009 apeng (http://www.o2cn.cn)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2009-05-07 23:12:23 $
 * $Rev: 1 $
 */
function o2Tree(r){
	var $th = this;
	/* 继承参数 */
	$th.R = $.extend(
		{
			bind:'______xxxxxxx_____',	       //绑定到哪个节点
			loadUrl: '',         //如果有值则 异步加载路径，每次送到后台 就一个  node  当前父亲节点ID	
			imgpath:'.',
			rootText:'目录',
		//	rootVisible:true,
		//	nodes:[],
		//	theme:'default',  //样式
			animate:true,
			lines:false,
			baseParams:{},
			loadAsync:true,
			loadType:'post',
			loadbBefore:function(obj,val){},
			loadEnd:function(obj,val,response){},
			nodeChange:function(obj,val){},
			nodeClick:function(obj,val){},
			nodeDblClick:function(obj,val){}
		},
		r || {},
		{
			temp:{expandLevel:''}
		}
	);
	$th.R.sgif = $th.R.imgpath+'/s.gif';
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
	/* 重新加载 */
	this.reload = function(){
		$th.setup();
		$th.load();
	};
	/* 根节点开始加载 */
	this.load = function(){
		$th.reader(0);
	};
	/* 得到选中 */
	this.getSelect = function(){
		var slt_obj = [];
		var finder = $('#'+$th.R.bind+' .o2tree_selected').find('input._var_id');
		if(finder.length == 0) return false;
		return $th.getVar(finder.val());
	};
	/* 定位到节点 */
	this.setSelect = function(id){
		var nodediv = $th.getNodeDiv(id);
		if(nodediv.length == 0) return false;
		if(!nodediv.hasClass('o2tree_selected')){
			$th.R.nodeChange($th,$th.getVar(id));
		}
		$('#'+$th.R.bind+' .o2tree_selected').removeClass('o2tree_selected');
		nodediv.addClass('o2tree_selected');
	};
	/* 展开所有 */
	this.expandAll = function(){
		var goon = false;
		$('#'+$th.R.bind+' div.o2tree_node_div').each(function(){
			var id = $(this).find('input._var_id').val();
			var v = $th.getVar(id);
			if(v.isleaf == 0){
				if(v.expanded == '0') goon = true;
				if(v.loading == '1') goon = true;
				$th.expand(id);
			}
		});
		if(goon){
			setTimeout($th.expandAll,300);
		}
	};
	/* 展开到第几层  */
	this.expandLevel = function(){
		if($th.R.temp.expandLevel == ''){
			$th.R.temp.expandLevel = arguments[0];
		}
		var levels = $th.R.temp.expandLevel;
		var goon = false;
		$('#'+$th.R.bind+' div.o2tree_node_div').each(function(){
			var id = $(this).find('input._var_id').val();
			var v = $th.getVar(id);	 
			if(levels>=v.level && v.isleaf == 0){
				if(v.expanded == '0') goon = true;
				if(v.loading == '1') goon = true;
				$th.expand(id);
			}
		});
		if(goon){
			setTimeout($th.expandLevel,300);
		}else{
			$th.R.temp.expandLevel = '';
		}
	};
	/* 按照某个mapping展开 */
	this.expandByMapping = function(mapping){
		
	};
	/* 收起所有 */
	this.collapseAll = function(){
		$('#'+$th.R.bind+' div.o2tree_node_div').each(function(){
			var id = $(this).find('input._var_id').val();
			var v = $th.getVar(id);
			if(v.isleaf == 0){
				$th.collapse(id);
			}
		});
	};
	
	/************************ 系统级别事件 ************************/
 	/* 停止默认事件 */
	this.stopDefault = function(e){
		if( e && e.preventDefault )
			e.preventDefault();
		else
			window.event.returnValue = false;
		return false;
	};
	/* 得到节点命名空间DIV */
	this.getNodeDiv = function(id){
		return $('#'+$th.R.bind).find('div.o2tree_var_id_'+id);
	};
	/* 显示 */
	this.showC = function(obj){
		if($th.R.animate)
			$(obj).show('fast');
		else
			$(obj).show();
	};
	/* 隐藏 */
	this.hideC = function(obj){
		if($th.R.animate)
			$(obj).hide('fast');
		else
			$(obj).hide();
	};
	/* 展开节点 */
	this.expand = function(id){
		var v = $th.getVar(id);
		if(v.isleaf == '0' && v.loading == '0'){
			if(v.expanded != '1'){
				
				if(v.hasload == '1'){
					$th.setVal(id,{expanded:'1'});
					$th.showC($th.getNodeDiv(id).parent().find('> ul.o2tree_child'));
					$th.setNodeIcon(id);
					return false;
				}else{
					/* 进入数据加载准备阶段 */
					$th.setVal(id,{loading:'1'});
					$th.setNodeIcon(id);
					var $url = $th.R.loadUrl;
					if($url.indexOf('?') == -1){
						$url += '?timer='+ (new Date().getTime());
					}else{
						$url += '&timer='+ (new Date().getTime());
					}
					var $data = {node:v.id};
					/* 数据加载前函数 */
					$th.R.loadbBefore($th,v);
					$.ajax({
						async:$th.R.loadAsync,
						type:$th.R.loadType,
						url:$url,
						data:$.extend(($th.R.baseParams || {}),$data),
						success: function(e){
							try{
								var robj = eval('(' + e + ')');
							}catch(e){
								throw('Ajax Response data error!Report by o2js.');
							}
							/* ajax完毕进行数据组装 */
							var child_space = $th.getNodeDiv(id).parent().find('> ul.o2tree_child');
							if(robj.length == 0){
								$th.setVal(id,{isleaf:'1'});
								$th.setNodeIcon(id);
								$th.hideC(child_space.html(''));
							}else{
								child_space.html('');
								for(var kk=0; kk<robj.length; kk++){
									var tmp = robj[kk];
									var cur_level = (parseInt(v.level)+1);
									var cur_end = '0';
									var cur_mapping = tmp.id;
									if(v.mapping != '' && v.mapping != '0' ){
										cur_mapping = v.mapping+','+tmp.id;
									}
									if((kk+1) == robj.length) cur_end = '1';
									var htmls = '';
									htmls += '<li class="o2tree_node">';
										/* 节点内容 */
										htmls += '<div class="o2tree_node_div o2tree_node_root o2tree_var_id_'+tmp.id+'">';
											/* 变量存储区 */
											htmls += '<input type="hidden" class="_var_id" value="'+tmp.id+'" />';
											htmls += '<input type="hidden" class="_var_text" value="'+tmp.text+'" />';
											htmls += '<input type="hidden" class="_var_level" value="'+cur_level+'" />';
											htmls += '<input type="hidden" class="_var_parentid" value="'+(v.id)+'" />';
											htmls += '<input type="hidden" class="_var_isleaf" value="'+tmp.isleaf+'" />';
											htmls += '<input type="hidden" class="_var_expanded" value="0" />';
											htmls += '<input type="hidden" class="_var_hasload" value="0" />';
											htmls += '<input type="hidden" class="_var_loading" value="0" />';
											htmls += '<input type="hidden" class="_var_end" value="'+cur_end+'" />';
											htmls += '<input type="hidden" class="_var_root" value="0" />';
											htmls += '<input type="hidden" class="_var_mapping" value="'+cur_mapping+'" />';
											/* 前缀 */
											htmls += '<span class="o2tree_node_indent">';
											/* 前缀处理 */
											var p_temp = '';
											var parentid_temp = v.id;
											for(var level_k=0; level_k<cur_level ; level_k++){
												
												var v_temp = $th.getVar(parentid_temp);
												/* 是否有线条 */
												if($th.R.lines){
													if(parentid_temp == '0'){
														p_temp = '<img  class="o2tree_icon" src="../misc/vendors/o2js/o2tree/images/s.gif"/>' + p_temp;
													}else{
														if(v_temp.end == '1'){
															p_temp = '<img  class="o2tree_icon" src="../misc/vendors/o2js/o2tree/images/s.gif"/>' + p_temp;
														}else{
															p_temp = '<img  class="o2tree_icon o2tree_elbow_line" src="../misc/vendors/o2js/o2tree/images/s.gif"/>' + p_temp;
														}
													}
												}else{
													p_temp = '<img  class="o2tree_icon" src="../misc/vendors/o2js/o2tree/images/s.gif"/>' + p_temp;
												}
												parentid_temp = v_temp.parentid;
											}
											htmls += p_temp;
											htmls += '</span>';
											htmls += '<img  class="o2tree_icon o2tree_icon_connect" src="'+$th.R.sgif+'" />';
											htmls += '<img  class="o2tree_icon o2tree_icon_type" src="'+$th.R.sgif+'" />';
											htmls += '<a class="o2tree_a" tabindex="1" href="#" hidefocus="on" ><span unselectable="on" >'+tmp.text+'</span></a>';
										htmls += '</div>';
										/* 子节点的层次 */
										htmls += '<ul class="o2tree_child" style="display:none" ></ul>';
									htmls += '</li>';
									child_space.append(htmls);
									/* 初始化该节点 */
									$th.initNode(tmp.id);
								}
								$th.setVal(id,{loading:'0',hasload:'1',expanded:'1'});
								$th.setNodeIcon(id);
								$th.showC(child_space);
							}
							$th.R.loadEnd($th,v,robj);
						}
					});
				}
				
			}
		}
	}
	/* 缩起节点 */
	this.collapse = function(id){		
		var v = $th.getVar(id);
		if(v.isleaf == '0' && v.loading == '0'){
			if(v.expanded == '1'){
				/* 已展开,需要收起 */
				$th.setVal(id,{expanded:'0'});
				$th.hideC($th.getNodeDiv(id).parent().find('> ul.o2tree_child'));
				$th.setNodeIcon(id);
			}
		}
	}
	/* 节点阅读,有可能展开，有可能缩起 */
	this.reader = function(id){
		var v = $th.getVar(id);
		if(v.isleaf == '0' && v.loading == '0'){
			if(v.expanded == '1'){
				/* 已展开,需要收起 */
				$th.collapse(id);
			}else{
				/* 已收起,需要展开 */
				$th.expand(id);
			}
		}
	};
 
	/* 设置变量集 */
	$th.setVal = function(id,vobj){
		var u = $th.getNodeDiv(id);
		for(var k in vobj){
			$(u).find('input._var_'+k).val(vobj[k]);
		}
	};
	/* 得到变量集 */
	$th.getVar = function(id){
		var u = $th.getNodeDiv(id);
		if(u.length == 0) return false;
		
		return {
			id:u.find('input._var_id').val(),							// 节点ID（唯一值）
			text:u.find('input._var_text').val(), 				// 节点文本
			level:u.find('input._var_level').val(),  			// 层级
			parentid:u.find('input._var_parentid').val(),	// 父节点ID 
			isleaf:u.find('input._var_isleaf').val(),			// 是否是文件夹
			expanded:u.find('input._var_expanded').val(),	// 是否展开
			hasload:u.find('input._var_hasload').val(),		// 是否已经加载完成
			loading:u.find('input._var_loading').val(), 	// 整在加载数据
			end:u.find('input._var_end').val(),						// 是否最尾部
			root:u.find('input._var_root').val(), 				// 是否根节点
			mapping:u.find('input._var_mapping').val()		// mapping
		};
	};
	/* 设置节点图标 */
	this.clearNodeIcon = function(nobj){
		nobj.removeClass('o2tree_leaf').removeClass('o2tree_folder').removeClass('o2tree_folder_open').removeClass('o2tree_elbow').removeClass('o2tree_elbow_end').removeClass('o2tree_elbow_connect').removeClass('o2tree_elbow_connect_open').removeClass('o2tree_loading').removeClass('o2tree_elbow_connect_nk').removeClass('o2tree_elbow_connect_nk_open');
	};
	this.setNodeIcon = function(id){
		var v = $th.getVar(id);
		var node = $th.getNodeDiv(id);
		$th.clearNodeIcon(node.find('img.o2tree_icon_type'));
		$th.clearNodeIcon(node.find('img.o2tree_icon_connect'));
		if(v.isleaf == '0'){
			if(v.loading == '1'){
				node.find('img.o2tree_icon_type').addClass('o2tree_loading');
			  //node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect');
				
				if($th.R.lines)
					node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect');
				else
					node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect_nk');
				  
			}else{ 				
				if(v.expanded == '1'){
					node.find('img.o2tree_icon_type').addClass('o2tree_folder_open');
					 
					if($th.R.lines)
						node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect_open');
					else
						node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect_nk_open');
				}else{
					node.find('img.o2tree_icon_type').addClass('o2tree_folder');
					 
					if($th.R.lines)
						node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect');
					else
						node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_connect_nk');
					
				}
			}
		}else{
			if(v.end == '1'){
				node.find('img.o2tree_icon_type').addClass('o2tree_leaf');
				if($th.R.lines)
					node.find('img.o2tree_icon_connect').addClass('o2tree_elbow_end');
				else
					node.find('img.o2tree_icon_connect').addClass('o2tree_none');
			}else{
				node.find('img.o2tree_icon_type').addClass('o2tree_leaf');
				if($th.R.lines)
					node.find('img.o2tree_icon_connect').addClass('o2tree_elbow');
				else
					node.find('img.o2tree_icon_connect').addClass('o2tree_none');
			}
		} 
	};
	/* 节点单击事件 */
	this.nodeEventClick = function(id){
		$th.setSelect(id);
		$th.R.nodeClick($th,$th.getVar(id));
	};
	/* 节点双击事件 */
	this.nodeEventDblClick = function(id){
		$th.reader(id);
		$th.R.nodeDblClick($th,$th.getVar(id));
	};
	/* 设置节点事件 */
	this.setNodeEvent= function(id){
		var v = $th.getVar(id);
		var node = $th.getNodeDiv(id);
		node.find('a.o2tree_a').dblclick(function(){
			$th.nodeEventDblClick(id);
		}).click(function(e){
			$th.stopDefault(e);
			$th.nodeEventClick(id);
	  });
		node.find('img.o2tree_icon_connect').click(function(e){
			$th.reader(id);
		});
	}; 
	/* 初始化节点的样式和事件 */
	this.initNode = function(id){
		$th.setNodeIcon(id);
		$th.setNodeEvent(id);
	}
 	/* 组装tree */
	this.setup = function(){
		$('#'+$th.R.bind).addClass('o2tree o2tree_auto');
		var htmls = '';
		/* 根节点 */
		htmls += '<ul class="o2tree_child o2tree_lines_root" >';
			/* 节点 */ 
			htmls += '<li class="o2tree_node o2tree_node_root" ">';
			/* 节点内容 */
			htmls += '<div class="o2tree_node_div o2tree_node_root o2tree_var_id_0" >';
				/* 变量存储区 */
				htmls += '<input type="hidden" class="_var_id" value="0" />';
				htmls += '<input type="hidden" class="_var_text" value="'+$th.R.rootText+'" />';
				htmls += '<input type="hidden" class="_var_level" value="0" />';
				htmls += '<input type="hidden" class="_var_parentid" value="-1" />';
				htmls += '<input type="hidden" class="_var_isleaf" value="0" />';
				htmls += '<input type="hidden" class="_var_expanded" value="0" />';
				htmls += '<input type="hidden" class="_var_hasload" value="0" />';
				htmls += '<input type="hidden" class="_var_loading" value="0" />';
				htmls += '<input type="hidden" class="_var_end" value="1" />';
				htmls += '<input type="hidden" class="_var_root" value="1" />';
				htmls += '<input type="hidden" class="_var_mapping" value="0" />';
				/* 前缀 */
				htmls += '<span class="o2tree_node_indent"></span>';
				htmls += '<img  class="o2tree_icon o2tree_icon_connect" src="'+$th.R.sgif+'" />';
				htmls += '<img  class="o2tree_icon o2tree_icon_type" src="'+$th.R.sgif+'" />';
				htmls += '<a class="o2tree_a" tabindex="1" href="#" hidefocus="on" ><span unselectable="on" >'+$th.R.rootText+'</span></a>';
			htmls += '</div>';
			/* 子节点的层次 */
			htmls += '<ul class="o2tree_child" style="display:none" ></ul>';
			htmls += '</li>';
		htmls += '</ul>';
		$('#'+$th.R.bind).html(htmls);
		$th.initNode(0);
	}
	$th.setup();
};
o2Tree.prototype.R = {};
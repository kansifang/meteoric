XN.namespace( 'app.share' );

XN.namespace( 'config.share' );

XN.config.share.enableSyncComment = false;

XN.app.share.action = function( params )
{
    this.config = {
        reqeustURI : '/share/submit.do',
        commentLength : 300
    };
    
    this.config.reqeustURI = 'http://share.xiaonei.com/share/submit.do';

    $extend( this.config , params );

};

XN.app.share.action.prototype = {
    getConfig : function( key )
    {
        return this.config[ key ];
    },
    
    add : function( p )
    {
        var maxL = this.getConfig( 'commentLength' );
	    if ( p.body.length > maxL )
        {
			this.fireEvent( 'checkError' , '评论字数不能超过' + maxL );
		    return;
		}
        
        this.request( p );
        

    },

    send : function( p )
    {
        var maxL = this.getConfig( 'commentLength' );

        if ( p.ids.length == 0 )
        {
            this.fireEvent( 'checkError' , '请至少选择一个好友' );
            return;
        }

        if ( p.body.length > maxL )
        {
            this.fireEvent( 'checkError' , '评论字数不能超过' + maxL );
            return;
        }
        
        this.request( p );
    },
    _addParamInEditor : function()
    {
        if ( $( 'isfromshare' ) )
        {
            return;
        }

        if ( XN.browser.IE )
        {
            var input = $element( '<input name="isfromshare" />' );
        }
        else
        {
            var input = $element( 'input' );
            input.name = 'isfromshare';
        }
         
        input.id = 'isfromshare';
        input.type = 'hidden';
        input.value = '1';

        $( 'cmtbody' ).parentNode.insertBefore( input , $( 'cmtbody' ) );
    },

    commentBlog : function( p )
    {
        if ( window.addNewCommentEntry && $( 'cmtbody' ) )
        {
            $( 'cmtbody' ).value = p.body;
            this._addParamInEditor();
            $( 'isfromshare' ).value = '1';
            
            if ( $( 'feedComment' ) ) $( 'feedComment' ).checked = false;
            if ( $( 'cmttoid' ) ) $( 'cmttoid' ).value = '';
            if ( $( 'whisper1' ) ) $( 'whisper1' ).value = '0';

            addNewCommentEntry();
            $( 'isfromshare' ).value = '0';
            return;
        }

        var This = this;
        var bid = XN.string.getQuery( 'id' , p.link );
        var owner = XN.string.getQuery( 'owner' , p.link );
        new XN.net.xmlhttp(
        {
            url : 'http://blog.xiaonei.com/PostComment.do',
            data : 'id=' + bid + '&owner=' + owner + '&body=' + encodeURIComponent( p.body ) + '&to=0&only_to_me=0&isfromshare=1',
            onSuccess : function( r )
            {
                This.fireEvent( 'commentBlogSuccess' , r.responseText );
            },
            onError : function()
            {
                This.fireEvent( 'commentBlogError' );
            }
        })
    },

    commentPhoto : function( p )
    {
        if ( $( 'cmtbody' ) && window.XN && XN.page.albumPhoto )
        {
            $( 'cmtbody' ).value = p.body;
            this._addParamInEditor();
            $( 'isfromshare' ).value = '1';
            XN.PAGE.albumPhoto.commentEditorSave();
            $( 'isfromshare' ).value = '0';
            return;
        }

        var pid = XN.string.getQuery( 'id' , p.link );
        var owner = XN.string.getQuery( 'owner' , p.link );
        new XN.net.xmlhttp(
        {
            url : 'http://photo.xiaonei.com/ajaxcommentphoto2.do',
            data : 'id=' + pid + '&owner=' + owner + '&body=' + encodeURIComponent( p.body ) + '&isfromshare=1',
            onSuccess : function( r )
            {
                This.fireEvent( 'commentPhotoSuccess' , r.responseText );
            },
            onError : function()
            {
                This.fireEvent( 'commentPhotoError' );
            }
        });
    },

    request : function( p )
    {
        var This = this;
        this.fireEvent( 'beforePost' );
        var tsc = p.tsc;
        delete p.tsc;
        new XN.net.xmlhttp(
        {
            url : this.getConfig( 'reqeustURI' ),
            data : 'tsc=' + tsc + '&post=' + encodeURIComponent( XN.json.build( p ) ),
            onComplete : function()
            {
                This.fireEvent( 'postComplete' );
            },
            onSuccess : function( r )
            {
                try
                {
                    var rs = XN.json.parse( r.responseText );
                }
                catch( e )
                {
                     This.fireEvent( 'postError' );
                }

                if ( rs.status === 0 )
                {
                    This.fireEvent( 'postSuccess' , rs.msg );

                    if ( /blog\.xiaonei\.com/.test( ( p.link || p.form.link ) ) )
                    {
                        new XN.net.xmlhttp(
                        {
                            url : 'http://blog.xiaonei.com/share/incShareCount.do',
                            data : 'link=' + encodeURIComponent( ( p.link || p.form.link ) )
                        });
                    }
                    else if ( /page\.xiaonei\.com\/note/.test( ( p.link || p.form.link ) ) )
                    {
                        new XN.net.xmlhttp(
                        {
                            url : 'http://page.xiaonei.com/note/addShareCount',
                            method: 'post',
                            data : 'id='+(p.noteId||p.form.noteId) +'&pid='+ (p.fromno||p.form.formno)
                         });
                    }

                    if ( !XN.config.share.enableSyncComment ) return;
                    if ( !p.body || XN.string.isBlank( p.body ) ) return;
                    if ( !p.sendcomment ) return;

                    if ( p.pic && p.pic != '' )
                    {
                        This.commentPhoto( p );        
                    }
                    else if ( /blog\.xiaonei\.com/.test( p.link ) )
                    {
                        This.commentBlog( p ); 
                    }
                }
                else
                {
                    This.fireEvent( 'postError'  , rs.msg );
                }
            },
            onError : function()
            {
                This.fireEvent( 'postError' );
            }
        });
    }
};

XN.event.enableCustomEvent( XN.app.share.action.prototype );

function checkShareAuth( el )
{
    if ( !XN.config.share.enableSyncComment ) return;
    if ( !XN.app.share.pop.sysMode ) return;
    if ( String( el.value ) != '99' )
    {
        $( 'pop_share_syscomment' ).hide();
        $( 'pop_share_sendcomment' ).disabled = true;
    }
    else
    {
        $( 'pop_share_syscomment' ).show();
        $( 'pop_share_sendcomment' ).disabled = false;
    }
}


(function()
{
    var friendSelector;
    XN.form = XN.FORM;	
	//用户加入的page
	var pages=null;
	//是否已经请求 (由于后台压力大 而且现在page管理员非常少暂时 所以屏蔽此功能)
	var hasRequest=true;//false;
	
    XN.app.share.pop = function( url , data ){
		if(!pages && !hasRequest){
			new XN.NET.xmlhttp({
				url : "http://page.xiaonei.com/myPages",
				method : "get",
				onSuccess:function(r){
					try{
						var rsp=XN.JSON.parse(r.responseText);
						if(rsp.pages && rsp.pages.length>0)
							pages=rsp.pages;
						XN.app.share.pop(url,data);
					}
					catch(e){}
				},
				onComplete:function(){
					hasRequest=true;
				}
			});
			return;
		}
		
        var action = 'add';
        if ( !friendSelector )
            friendSelector = new XN.ui.multiFriendSelector({url:"http://home.xiaonei.com/friendsSelector.do"});

        if ( data.tid )
			data = 'tid=' + data.tid + '&tribeId=' + data.tribeId;
        else
			data = 'post=' + encodeURIComponent( XN.json.build( data ) );

		var pagesOptions="";						
		if (pages){
			for (var i = 0; i < pages.length; i++) {
				pagesOptions += '<option value="' + pages[i].id + '">' + pages[i].name + '</option>';
			}
		}
        var html = '<div id="popShareContainer" style="display:none;"><div class="share_header">' +
'		<div class="tabs clearfix">' +
'				<ul class="toggle_tabs clearfix">' +
'					<li class="first">'+
'						<a id="shareSendTab" onfocus="this.blur()" href="javascript:void(0)">分享给我的好友</a>' +
'					</li>';
		if(pages){
			html+='<li class="middle">'+
'						<a id="sharePageTab" onfocus="this.blur()" href="javascript:void(0)">分享到公共主页</a>' +
'					</li>';
		}
		html+=
'					<li class="last">' +
'						<a id="shareAddTab" onfocus="this.blur()" class="selected" href="javascript:void(0)">添加到我的分享</a>' +
'					</li>' +
'				</ul>' +
'			</div>' +
'		</div>'+
'		<div id="shareSendContent" class="share_send">' +
'			<div class="share_fields">' +
'				<dl class="composer_fields clearfix">' +
'					<dt id="dt_to_field">' +
'						<label for="to_field">分享给: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_to_field">' +
'						<div id="shareSelectFriends" class="composer"></div>' +
'					</dd>' +
'					<dt id="dt_subject_field">' +
'						<label for="subject_field">标题: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_subject_field">' +
'						<input id="popShareSubjectInput" value="" class="inputtext" type="text">' +
'					</dd>' +
'					<dt id="dt_message_field">' +
'						<label for="message_field">添加评论: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_message_field">' +
'						<textarea name="send_message" id="popShareSendMessage"></textarea>' +
'					</dd>' +
'				</dl>' +
'			</div>' +
'		</div>' ;
	if(pages){
		html+=
'		<div id="sharePageContent" class="share_send" style="display:block;">' +
'			<div class="share_fields">' +
'				<dl class="composer_fields clearfix">' +
'					<dt id="dt_to_field">' +
'						<label for="to_field">分享给: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_to_field">' +
'						<select id="pagePid" name="pid" class="select float-left">'+pagesOptions+'</select>' +
'					</dd>' +
'					<dt id="dt_subject_field" style="display:none;">' +
'						<label for="subject_field">标题: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_subject_field" style="display:none;">' +
'						<input id="popShareSubjectInputForPage" value="" class="inputtext" type="text">' +
'					</dd>' +
'					<dt id="dt_message_field">' +
'						<label for="message_field">添加评论: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_message_field">' +
'						<textarea name="send_message" id="popShareSendMessageForPage"></textarea>' +
'					</dd>' +
'				</dl>' +
'			</div>' +
'		</div>';
		}
		html+=
'		<div id="shareAddContent" class="share_post">' +
'			<div class="share_fields">' +
'				<dl class="composer_fields clearfix">' +
'					<dt id="dt_message_field">' +
'						<label for="message_field">添加评论: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_message_field">' +
'						<textarea name="message" id="sharer_popup_message"></textarea>' +
'					</dd>' +
'					<dt id="dt_privacy_field">' +
'						<label for="dt_privacy_field">浏览权限: </label>' +
'					</dt>' +
'					<dd class="field" id="dd_privacy_field">' +
'						<select id="popShareAuth" onchange="checkShareAuth(this);" class="select float-left">' +
'							<option value="99">所有人</option>' +
'							<option value="0">所有好友</option>' +
'							<option value="-1">自己收藏</option>' +
'						</select>' +
'                       <span id="pop_share_syscomment" style="display:none;"  class="float-right" >' +
'                       <input  type="checkbox" checked="true" id="pop_share_sendcomment" name="sendcomment" />' +
'                       <label id="pop_share_sclabel" style="display:inline;" for="pop_share_sendcomment">评论同步发送到日志/照片</label>' +
'                       </span>' +
'					</dd>' +
'				</dl>' +
'			</div>' +
'		</div>' +
'		<div id="shareAjaxResult"></div>' +
'		</div></div><div class="loading" id="popShareLoading"><p>载入中...</p></div>' ;
        
        var dialog = XN.DO.confirm(
        {
            title : '分享',
            message : html,
            callBack : function( r )
            {
                if ( r )
                {
                    this.preventHide();
                    getData();
                }
                else
                {
                    this.hide();
                }
            },
            submit : '分享',
            params : {
                addIframe : true
            },
            width : 465
        });

        dialog.setIndex( 600 );
        dialog.body.addClass( 'share_popup' );
        dialog.header.hide();
        dialog.footer.hide();
        $( 'shareSelectFriends' ).setContent( friendSelector );
        friendSelector.reset();
        
        function loadSuccess( r )
        {
            var html = r.responseText;
            if ( XN.string.isBlank( html ) )
            {
                $( 'popShareLoading' ).innerHTML = '<p>该分享不存在或者已被删除</p>';
                setTimeout( function()
                {
                    dialog.hide();
                } , 1500 );
                return;
            }

            $( 'shareAjaxResult' ).innerHTML = html;
            $( 'popShareSubjectInput' ).value = $( 'popShareTitle' ).value;
            $( 'popShareContainer' ).show();
            $( 'popShareLoading' ).hide();
            dialog.header.show();
            dialog.footer.show();

            var link = $( 'popShareParams' ).link.value;
            
            XN.app.share.pop.sysMode = false;
            
            if ( XN.config.share.enableSyncComment )
            {
                if ( /^http:\/\/blog\.xiaonei\.com/.test( link ) )
                {
                    $( 'pop_share_syscomment' ).show();
                    $( 'pop_share_sclabel' ).innerHTML = '评论同步发送到日志';
                    XN.app.share.pop.sysMode = true;
                }
                else if ( /^http:\/\/photo\.xiaonei\.com/.test( link ) )
                {
                    $( 'pop_share_syscomment' ).show();
                    $( 'pop_share_sclabel' ).innerHTML = '评论同步发送到照片';
                    XN.app.share.pop.sysMode = true;
                }
                else
                {
                    XN.app.share.pop.sysMode = false;
                }
            }

            $( 'sharer_popup_message' ).focus();
            dialog.refresh();     
        }

        function loadError()
        {
            XN.DO.showError( '获取分享失败,请稍候重试' );
        }


        new XN.net.xmlhttp(
        {
            url : url,
            data : data,
            onSuccess : loadSuccess,
            onError : loadError
        });


		var tabView=new XN.ui.tabView(
        {
			selectedClass : 'selected'
		}).addTab(
        {
			label : 'shareSendTab',
			content : 'shareSendContent',
			onActive : function()
            {
				$('shareSendContent').style.display = 'block';
				action = 'send';
			}
		});
		if(pages){
			tabView.addTab(
			{
				label : 'sharePageTab',
				content : 'sharePageContent',
				onActive : function()
				{
					$('sharePageContent').style.display = 'block';
					action = 'page';
				}
			});
		}
		
		tabView.addTab(
        {
			label : 'shareAddTab',
			content :'shareAddContent',
			active : true,
			onActive : function()
            {
				action = 'add';
			}
		});
        
        var rq = new XN.app.share.action();
        
        rq.addEvent( 'checkError' , function( msg )
        {
            XN.DO.showError( msg );
        });

        var msg_dialog = null;

        rq.addEvent( 'beforePost' , function()
        {
            dialog.hide();
	        msg_dialog = XN.DO.alert(
            {
			    msg : '<div id="share_msg_dialog" class="large">正在发送请求...</div><div id="pop_share_ads"></div>',
                width : 460,
			    noFooter : true
		    });
            $( 'pop_share_ads' ).appendChild( $( 'ad1000000025' ).firstChild );
        });
        
        rq.addEvent( 'postSuccess' , function( r )
        {
            $( 'share_msg_dialog' ).setContent( r );
            setTimeout( function()
            {
                msg_dialog.hide();
            } , 2000 );
        });
        
        rq.addEvent( 'postError' , function( r )
        {
            XN.DO.showError( r || '请求失败，请重试' );
        });

        function getData()
        {
            var data = {} , str;
            
            if ( action == 'add' )
            {
                data = XN.form.serialize( 'popShareParams' , 'hash' );
                if ( !$( 'pop_share_sendcomment' ).disabled ) data[ 'sendcomment' ] = $( 'pop_share_sendcomment' ).value;
                data[ 'tsc' ] = $('tsc_popShare').value;
                data[ 'action' ] = 'add';
                data[ 'auth' ] = $( 'popShareAuth' ).value;
                data[ 'body' ] = $( 'sharer_popup_message' ).value;
                if( $( 'summary' ) ) data[ 'summary' ] = $( 'summary' ).innerHTML;
                data[ 'noteId' ] = $( 'noteId' )?$( 'noteId' ).value:0;
                rq.add( data );
            }
            else if ( action == 'send')
            {
                data[ 'tsc' ] = $('tsc_popShare').value;
                data[ 'action' ] = 'sharetofriend';
                data[ 'ids' ] = friendSelector.getIds();
                data[ 'form' ] = XN.form.serialize( 'popShareParams' , 'hash' );
                if ( $('summary') ) data[ 'form' ][ 'summary' ] = $( 'summary' ).innerHTML;
                data[ 'body' ] = $( 'popShareSendMessage' ).value;
                data[ 'subject' ] = $( 'popShareSubjectInput' ).value;
                data[ 'noteId' ] = $( 'noteId' )?$( 'noteId' ).value:0;
		        rq.send( data );
            }         
			else if( action == 'page'){
				data = XN.form.serialize('popShareParams', 'hash');
				if (!$('pop_share_sendcomment').disabled)
					data['sendcomment'] = $('pop_share_sendcomment').value;
				data['tsc'] = $('tsc_popShare').value;
				data['action'] = 'add';
				data['auth'] = '99';
				data['body'] = $('popShareSendMessageForPage').value;
				if ($('summary'))
					data['summary'] = $('summary').innerHTML;
				data['pageId'] = $("pagePid").value;
                data[ 'noteId' ] = $( 'noteId' )?$( 'noteId' ).value:0;
				rq.add(data);
			}
        }

        //发送分享时添加广告
        XN.func.runOnce( function()
        {
            var div = $element( 'div' );
            div.setAttribute( 'id', 'ad1000000025' );
            div.hide();
            document.body.appendChild( div );
        });

        //加载分享广告
        load_jebe_ads( 1,'http://share.xiaonei.com/popupdiv' );
    };
    
    XN.app.share.showDialog = XN.app.share.pop;

   XN.app.share.del = function(id,type,curpage,pid)
    {
		XN.DO.confirm({
			msg:'您确定要删除此分享吗',
			callBack:function(r){
				if(r){					
					var url = 'http://share.xiaonei.com/share/EditShare.do';
					var data = 'action=del&sid=' + id;
					data+=type ? "&type="+type : '';
					data+=pid ? "&pid="+pid : '';
					
					//如果在page里面删除分享
					if(pid && location.href.indexOf('http://page.xiaonei.com')==0){
						url='http://page.xiaonei.com/share/del';
						data='id='+id+'&pid='+pid;
					}
					new XN.NET.xmlhttp({
                        url : url,
                        data : data,
                        onSuccess : function(){
							$("share_" + id).remove();
							var list = XN.dom.getElementsByClassName( 'share-itembox', 'shareList', 'div' );
							if(list && list.length==0){
								window.location.reload();
							}
						},
						onError:function(){
							alert('删除错误');
						}
					});	
					
				}
			}
		});
	};
})();



	pop_share_new =  function(url,pars){
		XN.APP.share.showDialog(url,pars);
	};

	create_share_div = function(id,owner,host){
        var url = 'http://share.xiaonei.com/share/ajax.do';		
        pop_share_new(url,{id:id,owner:owner,host:host});
	};
	
	create_thread_share_div = function(tid,tribeId){
        var url = '/getshare.do';
        
        url='http://share.xiaonei.com'+url;

		pop_share_new(url,{tid:tid,tribeId:tribeId});
	};
	
	pop_share = function(){
		try{
			var post = XN.FORM.serialize('popShareParams','hash');
		}catch(e){
			var post = {};
			post.link=ge('link').value;post.type=ge('type').value;post.title=ge('title').value;post.pic=ge('pic').value;post.fromno=ge('fromno').value;post.fromname=ge('fromname').value;post.fromuniv=ge('fromuniv').value;post.albumid=ge('albumid').value;
			post.largeurl=$('largeurl').value;
		}	
		post.summary=$('summary').innerHTML;
        var url = '/share/popup.do';
        
            url = 'http://share.xiaonei.com/share/popup.do';

		pop_share_new(url,post);
	};
	
	pop_share_for_list = function(index){
		var post = XN.FORM.serialize('popShareParams_' + index,'hash');
		post.summary = $('summary_' + index).innerHTML;
        var url = '/share/popup.do';
        
        url = 'http://share.xiaonei.com/share/popup.do';

		pop_share_new(url,post);
	};
	
	delete_share = function(id,type,curpage,pid){
		XN.APP.share.del(id,type,curpage,pid);
	};
	play = function(el,t,file){
		el = $(el + '');
		if(t == 'mp3'){
			el.innerHTML = XN.Template.flashPlayer({filename:file});
		}else{
			el.innerHTML = XN.Template.mediaPlayer({filename:file});
		}
	};
	
	playswf = function(el,file,scale){
		var w,h;
		el = $(el + '');
		w = el.parentNode.offsetWidth - 24;
		if(w > 500){
			w = 500;
		}
		h = parseInt(w/scale);
//			el.setStyle('background-image:url(http://s.xnimg.cn/img/upload_progress.gif);float:none;margin-bottom:10px;');
		el.innerHTML = XN.Template.flash({width:w,height:h,filename:file});
		el.onclick = null;
	};	



  
  
/**
 *  share comment
 */

function show_or_hide(action,share_id,share_owner){
//		var link=ge('show_link_'+share_id);
//		if (!link) {
//			return;
//		}
		if(action=='show'){
			ge('share_comment_'+share_id).style.display='block';
			ge('share_footer_'+share_id).style.display='none';
			//link.innerHTML='隐藏评论';
			//link.onclick=function(){return share_hide_comments(share_id,share_owner);};
		}
		else if(action=='hide'){
			ge('share_comment_'+share_id).style.display='none';
			ge('share_footer_'+share_id).style.display='block';
			window.location='#share_'+share_id;
			//link.innerHTML='发表评论';
			//link.onclick=function(){return share_show_comments(share_id,share_owner);};
		}
	}
	
	function share_hide_comments(share_id,share_owner){
		ge('share_comment_'+share_id).style.display='none';
		show_or_hide('hide',share_id,share_owner);
	}

	function share_show_comments(share_id,share_owner){
		var comment_list=ge('commentList_'+share_id);
		if(!comment_list){
			return;
		}
		if(XN.STRING.isBlank(comment_list.innerHTML)){
			comment_list=$X('commentList_'+share_id);
			var post={share_id:share_id,share_owner:share_owner};
			new XN.net.xmlhttp(
            {
                url : 'http://share.xiaonei.com/share/showcomment.do',
                data : 'post='+ XN.json.build(post),
                onSuccess : function(r){
            		comment_list.innerHTML=r.responseText;
            		if(window.location.hash){
                		window.location=window.location.hash;
            		}
            	},
                onError:function()
                {
					alert('加载回复失败');
				}
            })
		}
		show_or_hide('show',share_id,share_owner);
	}
	
	function share_reply_comment(share_id,id,name){
		var form = $('comment_form_'+share_id);
		form.repetNo = id;
		form.comment.value = '回复'+name+":"+form.comment.value 
	}
	
	function share_add_comment_submit(share_id){
		var form = $('comment_form_'+share_id);
		var comment_text=form.comment.value;
		if(XN.STRING.isBlank(comment_text)){
			XN.DO.showError('评论内容不能为空');
			return false;
		}
		if(comment_text.length>500){
			XN.DO.showError('评论内容不能超过500字');
			return false;
		}
		var error=$('ajax_msgerror');
		if(error){
			error.parentNode.removeChild(error);
		}
		new XN.net.xmlhttp(
		        {
		            url : 'http://share.xiaonei.com/share/addcomment.do',
		            data : XN.form.serialize( 'comment_form_'+share_id ),
		            onSuccess : function(r)
		            {
					    var text=r.responseText;
					    $('commentList_'+share_id).innerHTML=$('commentList_'+share_id).innerHTML+text;
					    if(!text.match('ajax_msgerror')) form.comment.value='';
				    },
				    onError:function()
	                {
						alert('回复失败');
					}
		        }
		);
	}


	function share_delete_comment(obj,share_id,share_owner,comment_id){

		XN.DO.confirm({
			title:'删除该评论',
			msg:'确定要删除吗?',
			callBack:function(r){
				if(r){
					var post={share_id:share_id,share_owner:share_owner,comment_id:comment_id};
					var comment_body=$X('comment_'+comment_id);
					comment_body.setContent(new XN.NET.xmlhttp(
                    {
                        url : 'http://share.xiaonei.com/share/deletecomment.do',
                        data : 'post=' + encodeURIComponent(XN.JSON.build(post)),
                        onSuccess : function()
                        {
							comment_body.parentNode.removeChild(comment_body);
						},
						onError:function()
                        {
							alert('删除错误');
						}
					}));			
				}
			}
		});
	}

	function share_show_add_comment(obj,share_id){
		var node=obj.parentNode;
		remove_node(node);
		var add_comment=ge('add_comment_input'+share_id);
		show(add_comment);
		var submit_button=ge('add_comment_button'+share_id);
		submit_button.disabled=false;
		var textarea_id='comment'+share_id;
		$(textarea_id).focus();
		return false;
	}
	
	
	function shareonkeydown(e){
		var k = (e.which)?e.which:window.event.keyCode; 
	   if(k==13){
		   sharelink1();return;
	   }
	}
	
	function sharelink1(){
		var sharelink=document.getElementById("sharelink").weblink.value;	
		var regex=/\s/ig;
		sharelink=sharelink.replace(regex,'');
     	if((sharelink=="")||(sharelink=="http://")||(sharelink=="分享网址、音乐、视频")){		
			alert("请输入一个网址");
			return false ;
		}
		if(sharelink.substr(0,7)!="http://"&&sharelink.substr(0,6)!="ftp://"&&sharelink.substr(0,8)!="https://"){
			sharelink = "http://"+sharelink;
	        document.getElementById("isUrl").value=sharelink;
		}
		if(/^http:\/\/([A-Za-z0-9\.]*)xiaonei\.com/i.test(sharelink)){
			alert('站内内容可以直接分享，此处请分享站外内容');return false;
		}
		var sharecolumn=document.getElementById("share-pre");
		sharecolumn.style.display="none";
		document.sharelink.submit();
		var shareload=document.getElementById("share-pre-hidden");
		shareload.style.display = 'block';
		shareload.src = 'http://s.xnimg.cn/img/upload_progress.gif';
	}
	
	//好友选择器(单选)
	XN.dom.ready(function(){
		var panel=$('friendsPanel');
		if(panel){			
			var s = new XN.ui.friendSelectorWithMenu({
				autoSelectFirst : true
			});
			panel.setContent( s );
			s.menu.setWidth( s.input.offsetWidth );
			s.addEvent( 'select' , function( p ){
				if(location.href.indexOf('http://blog.xiaonei.com')!=-1)
					location.href = 'http://blog.xiaonei.com/friendsBlog.do?friend=' + p.id;
				else if(location.href.indexOf('http://share.xiaonei.com')!=-1)
					location.href = 'http://share.xiaonei.com/share/ShareList.do?select=1&id='+p.id;
			});
			new XN.FORM.inputHelper( s.input ).setDefaultValue( '输入好友姓名...' );
		}
	});
	
	//站外分享复制链接
	function setClipboard(txt){
		if(window.clipboardData && window.clipboardData.setData("Text", txt)){
			$('copyTip').innerHTML='(链接已复制)';
		}
		else{
			$('shareLinkVal').select();
			$('copyTip').innerHTML='(Ctrl+C或右键复制)';
		}
		$('copyTip').show();
	}
	
	function clearCopyTip(){
		$('copyTip').hide();
	}

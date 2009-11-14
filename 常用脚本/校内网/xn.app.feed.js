if(XN.APP.feed)XN.APP.feed = null;

XN.APP.feed = function(){
}; 

XN.APP.feed.prototype = {
	readMiniFeedUrl:'/readMini.do',
	readNewsFeedUrl:'/readNews.do',
	//readHomeFeedUrl:'/feedhome_ajax.do',
	readHomeFeedCount:0,
	setAsRead:function(fid,uid,type){
		if(type == 'newsfeed'){
			this.setNewsFeedAsRead(fid,uid);
		}else if(type == 'minifeed'){
			this.setMiniFeedAsRead(fid,uid);
		}
	},
	setNewsFeedAsRead:function(fid,uid){
		var s = this;
		this.onBeforeReadNewsFeed(fid);
		new XN.NET.xmlhttp().post(this.readNewsFeedUrl,'t=s&i=' + fid,function(){
			s.onreadNewsFeedSuccess(fid);
		},{onError:function(){s.onError()}});
	},
	setAllAsRead:function(){
		var s = this;
		this.onBeforeReadAll();
		new XN.NET.xmlhttp({
			url:this.readNewsFeedUrl,
			data:'t=a',
			onSuccess:function(){
				s.onreadAllSuccess();
			},
			onError:function(){
				XN.DO.showError('通信失败');
			}
		})
	},
	
	setMiniFeedAsRead:function(fid,uid){
		var s = this;
		var p = 't=s&u='+uid+'&i=' + fid + '&ran=' + Math.random();
		this.onBeforeReadMiniFeed(fid);
		new XN.NET.xmlhttp(this.readMiniFeedUrl,p,function(){
			s.onreadMiniFeedSuccess(fid);
		},{onError:function(){s.onError()}});
	},
	setHomeFeedAsRead:function(fid){
		this.setNewsFeedAsRead(fid);
	},
	getNewFeeds:function(fid){
		var s = this;
		var url = "retrieveNews.do";
		new XN.NET.xmlhttp(url,"",function(r){
			r = r.responseText.split("##@L#");
			try{
				$('feedCountDiv').innerHTML = r[0];
			}catch(e){}
			try{
				$('feedHome').innerHTML = r[1] || '';
			}catch(e){}
		},{onError:function(){s.onError();}});
	},
	onBeforeReadAll:function(){
		
	},
	onreadAllSuccess:function(){
		this.getNewFeeds();
	},
	onBeforeReadMiniFeed:function(fid){
		XN.Element.remove( 'feed' + fid );
	},
	onreadMiniFeedSuccess:function(fid){
		
	},
	onBeforeReadNewsFeed:function(fid){
		XN.Element.remove( 'feed' + fid );
//		var el = $('feedCountDiv');
//		el.innerHTML = parseInt(el.innerHTML) - 1 + '';
	},
	onreadNewsFeedSuccess:function(fid){
//		if($('feedHome').childNodes.length <= 14){
//			this.getNewFeeds();
//		}
	},
	onBeforeReadHomeFeed:function(fid){
		XN.Element.remove( 'feed' + fid);
	},
	onreadHomeFeedSuccess:function(fid){
		
	},
	onError:function(e){
		
	}
};

var feedEditor = new XN.APP.feed();

window.readHomeFeed = function(fid){
	feedEditor.setHomeFeedAsRead(fid);
}

window.readThisFeed = function(fid,uid,type){
	feedEditor.setAsRead(fid,uid,type);
};

function readMyFeed(el){
	$(el.parentNode.parentNode.parentNode.parentNode.parentNode).remove();
	new XN.NET.xmlhttp({
		url:el.href
	});
	return false;
}

window.playFeedAudio = function(el,t,file){
	el = $( 'feed' + el);
	var wrap = $element('div');
	wrap.className = 'media-player';
	if(t == 'mp3'){
		wrap.innerHTML = XN.Template.flashPlayer({filename:file});
	}else{
		wrap.innerHTML = XN.Template.mediaPlayer({filename:file});
	}
	el.addClass('playing');
	//XN.DOM.getElementsByClassName('feedbody',el)[0].appendChild(wrap);
    var pos = XN.DOM.getElementsByClassName('audio',el)[0];
    pos.parentNode.insertBefore( wrap , pos.nextSibling );
};

window.playFeedVideo = function(shareid,feedid,owner,scale){
       var url = "http://share." + XN.env.domain + "/share/share.do" ;
	   var el = $( 'feed' + feedid );
	   var wrap = $element('div');
	   wrap.className = 'media-player';
	   el.addClass('playing');
	   //wrap.setStyle('background:url(http://s.xnimg.cn/img/upload_progress.gif) no-repeat center center;height:100px;float:none;margin-bottom:10px;');
       //XN.DOM.getElementsByClassName('feedbody',el)[0].appendChild(wrap);
       wrap.setStyle('background:url(http://s.xnimg.cn/img/upload_progress.gif) no-repeat center center;height:100px;float:none;margin-bottom:10px;');
       var pos = XN.DOM.getElementsByClassName('video',el)[0];
	   pos.style.display = "none";
       pos.parentNode.insertBefore( wrap , pos.nextSibling );
       
	   function playswf(file,scale){
	   		wrap.setStyle('height:auto;');
			var w,h;
			w = el.offsetWidth - 24;
			if(w > 450){
				w = 450;
			}
			h = parseInt(w/scale);
			wrap.innerHTML = XN.Template.flash({width:w,height:h,filename:file});
		};
	   new XN.NET.xmlhttp({
	   		'url':url,
			data:"id=" + shareid + "&owner=" + owner ,
			onSuccess:function(r){
	             try{
					  var ret = XN.JSON.parse(r.responseText);
		              var status = ret.status ;
		              if ( status == 0 ){
		                  playurl = ret.playUrl;
		                  if ( playurl != '' )
		                     playswf (playurl,scale);
		              }
		              else if (status == 1){
					  	XN.DO.showError('该分享不存在或已被删除');
		                  return ;
		              }
				}catch(e){
					XN.DO.showError('该分享不存在或已被删除');
				}
			},
			onError:function(){
				XN.DO.showError('该分享不存在或已被删除');
			}
       });
};

window.playFlyerVideo = function(url,feedid,scale){
	   var el = $(feedid);
	   var wrap = XN.DOM.getElementsByClassName('media-player',el)[0];
		el.addClass('playing');
		playswf (url,scale);
		wrap.style.display = 'block';
	   function playswf(file,scale){
			var w,h;
			w = el.offsetWidth - 24;
			if(w > 450){
				w = 450;
			}
			h = parseInt(w/scale);
			wrap.innerHTML = XN.Template.flash({width:w,height:h,filename:file});
		};
};
/**
 *  for old feed
 */

window.play = function(el,t,file){
	el = $(el + '');
	if(t == 'mp3'){
		el.innerHTML = XN.Template.flashPlayer({filename:file});
	}else{
		el.innerHTML = XN.Template.mediaPlayer({filename:file});
	}
};

window.playswf = function(el,file,scale){
	var w,h;
	el = $(el + '');
	w = el.parentNode.offsetWidth - 24;
	if(w > 450){
		w = 450;
	}
	h = parseInt(w/scale);
	el.innerHTML = XN.Template.flash({width:w,height:h,filename:file});
	el.onclick = null;
};

function moreFeedPic(feedID,ownerID){
		var ids = $('morePicFeed'+feedID).innerHTML;
		var url = "retrieveMorePic.do?i="+ids+"&o="+ownerID;
		new XN.NET.xmlhttp(url,"",function(r){
			var photoList = eval(r.responseText);
			var s = "";
			for(var i=0;i<photoList.length ;i++){
				s+="<li><a href=\"http://photo.xiaonei.com/getphoto.do?id="+photoList[i].i+"&owner="+ownerID+"\" target=\"_blank\">"+
				"<img width=\"80\" height=\"80\" src=\"http://s.xnimg.cn/a.gif\" style=\"background-image:url("+photoList[i].p+")\" /></a></li>"
			}
			$("moreThumbnails" + feedID).innerHTML = "<ul class=\"thumbnails grid\">"+s+"</ul>";
			$("moreThumbnails" + feedID).style.display = 'block';
		},{onError:function(){s.onError();}});
}

window.preplayswf = function(id,owner,elem,scale){
       var url = 'http://share.' + XN.env.domain + "/share/share.do" ;
	  if(elem && scale)$(id + '').setStyle('background-image:url(' + XN.ENV.staticRoot + 'img/upload_progress.gif);float:none;margin-bottom:10px;');
       new XN.NET.xmlhttp({
	   		'url':url,
			data: "id=" + id + "&owner=" + owner ,
			onSuccess:function(r){
			   try{
				  var ret = XN.JSON.parse(r.responseText);
	              var status = ret.status ;
	              if ( status == 0 ){
	                  playurl = ret.playUrl;
	                  if ( playurl != '' )
	                     playswf (elem,playurl,scale);
				  }
	              else if (status == 1){
					XN.DO.showError('该分享不存在或已被删除!');
	                  return ;
	              }
				}catch(e){
					XN.DO.showError('该分享不存在或已被删除!');
				}
                
			},
			onError:function(){
				XN.DO.showError('该分享不存在或已被删除!');
			}
 		});
 }


//叉掉所有新鲜事
XN.dom.ready(function()
{
    if ( !$( 'setAllFeedsAsRead' ) ) return;

    $( 'setAllFeedsAsRead' ).onclick = function()
    {
        XN.DO.confirm(
        {
            title : '标记已读',
            message : '确定将全部新鲜事设置为已读吗?',
            callBack : function( r )
            {
                if ( r )
                {
                    feedEditor.setAllAsRead();
                    if ( $( 'moreFeed' ) ) $( 'moreFeed' ).hide();
                }
            }
        });
    }
});

//更新新鲜事计数

XN.dom.ready(function()
{
    if ( !$( 'feedHome' ) && feedEditor ) return;

	feedEditor.onreadNewsFeedSuccess = function()
    {
		var currentCount;
		if ( $( 'feedUnReadCount' ) ) 
        {
			currentCount = parseInt( $('feedUnReadCount').innerHTML );
			if ( currentCount )
            {
				$('feedUnReadCount').innerHTML = '';
				$('feedUnReadCount').appendChild( document.createTextNode( currentCount - 1 ) );
			}
		}
		if ( $( 'feedEnd' ) )
        {
			currentCount = parseInt( $( 'feedEnd' ).innerHTML );
			if( currentCount )
            {
				$( 'feedEnd' ).innerHTML = '';
				$( 'feedEnd' ).appendChild( document.createTextNode( currentCount - 1 ) );
			}
		}
		if( $('feedHome').childNodes.length < 1 )
        {
			feedFilter.currentPage = 0;
            feedFilter.loadMore();
			//getMoreFeeds();
		}
	};

});

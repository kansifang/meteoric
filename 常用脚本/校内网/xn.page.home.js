XN.namespace( 'page.home' );
//左侧app菜单
XN.dom.ready(function()
{
    var bar = $('showMoreAppShortcuts');
    if ( !bar ) return;

    var menu = $('moreAppShortcuts');
    var hideBar = $('hideMoreAppShortcuts');
    var appUls = menu.getElementsByTagName('ul').length;
    
    var subMenu = new XN.ui.menu(
    {
        bar : bar,
        menu : menu,
        fireOn : 'click',
        alignType : '1-1',
        offsetY : -4
    });

    subMenu.setWidth( 135 + ( appUls - 2 ) * 144 );
    bar.hover( 'rounded-hover' , 'appNavHolder' );
    hideBar.hover( 'rounded-hover' , 'moreAppShortcuts' );
    
    hideBar.onclick = function( e )
    {
        subMenu.hide();
    };
});

//新鲜事筛选
XN.dom.ready(function()
{
    var feedHolder = $('feedHolder');
    var feedHome = $('feedHome');
    var feedFilter = XN.page.home.feedFilter = XN.event.enableCustomEvent( {
        currentPage : 0    
    } );

    //所有新鲜事类型
    var feedTypes = {};


    //添加一种新鲜事类型
    function addFeedType( type )
    {
        feedTypes[ type.flag ] = type;
        return type;
    }

    //根据新鲜事名称获取新鲜事类型
    function getFeedByName( name )
    {
        for ( var i in feedTypes )
        {
            if ( feedTypes[ i ].name == name )
                return feedTypes[ i ];
        }
        return null;
    }
    
    //filter的标签  
    var tabView = new XN.ui.tabView({
        selectedClass : 'current'        
    });
    feedFilter.tabView = tabView;

    addFeedType(
    {
        name : '全部',
        flag : -1,
        p : 'tab',
        label : 'showAllFeed',
        active : true,
        nofeed : '当你的朋友发表日志、照片或者帖子，这里会有提示'
    });

    addFeedType(
    {
        name : '状态',
        flag : 5,
        p : 'tab',
        label : 'showStatusFeed',
        nofeed : '没有状态相关的新鲜事'
    });

    addFeedType(
    {
        name : '相册',
        flag : 7,
        p : 'tab',
        label : 'showAlbumFeed',
        nofeed : '没有相册相关的新鲜事，去<a target=\"_blank\" href=\"http://photo.xiaonei.com/friendsalbum.do?fb\">相册</a>看看吧'
    });

    addFeedType(
    {
        name : '日志',
        flag : 6,
        p : 'tab',
        label : 'showBlogFeed',
        nofeed : '没有日志相关的新鲜事，去<a target=\"_blank\" href=\"http://blog.xiaonei.com/BlogHome.do\">日志</a>看看吧。'
    });

    var shareFeed = addFeedType(
    {
        name : '分享',
        flag : 1,
        p : 'tab',
        label : 'showMenuFeed',
        icon : 'url(http://app.xnimg.cn/application/20080812/19/44/L147120198188JIA.gif)',
        backgroundPosition : '10px 50%',
        more : false,
        nofeed : '没有分享相关的新鲜事，去<a target=\"_blank\" href=\"http://share.xiaonei.com/share/ShareList.do\">分享</a>看看吧。'
    });

    if ( $( 'showPageFeed' ) )
    {
        addFeedType(
        {
            name : '公共主页',
            flag : 20,
            p : 'tab',
            label : 'showPageFeed',
            more : true,
            icon : 'url(' + XN.env.staticRoot + 'imgpro/icons/follow-add.gif)',
            backgroundPosition : '10px 50%',
            nofeed : '没有更多的公共主页新鲜事了'
        });
    }
    else
    {
        shareFeed.more = true;
    }

    for ( var i in feedTypes )
    {
        var feed = feedTypes[ i ];
        if ( feed.p == 'tab' )
        {
            tabView.addTab({
                label : feed.label,
                active : feed.active,
                onActive : ((function( feed )
                {
                    return function()
                    {
                        feedTabActive( feed );
                    }
                })( feed ))
            });
        }
        if ( feed.more )
        {
            feedFilter.moreType = feed;
            feedFilter.moreLabel = feed.label;
        }

        if ( feed.active )
        {
            feedFilter.currentFeed = feed;
        }
    }

    //新鲜事标签切换时的回调

    function feedTabActive( feed )
    {

        
        //加载新鲜事
        if ( feed.more )
        {
            feedFilter.load( feedFilter.moreType );
        }
        else
        {
            feedFilter.load( feed );
        }
        
        feedFilter.currentFeed = feed;
        feedFilter.currentPage = 0;

        if ( feed.flag == -1 ) //所有
        {

            //显示全部标记已读
            $( 'setAllFeedsAsRead' ).show();
		    
            feedHolder.delClass( 'filter-view' );
            /*
            if ( XN.page.home.fmodeChanger.currentMode() == 'smode' )
            {
                feedHolder.addClass( 's-mode' );
            }
			*/
        }
        else 
        {
            $( 'setAllFeedsAsRead' ).hide();
            
            feedHolder.addClass( 'filter-view' );
            //feedHolder.delClass( 's-mode' );
            
        }

    }

    var loadingDiv = $element( 'div' );
    loadingDiv.className = 'filter-loading';
    loadingDiv.innerHTML = '<p>新鲜事读取中...</p>';
    loadingDiv.hide();
    feedHolder.appendChild( loadingDiv );


    feedFilter.load = function( feed , page )
    {
        try{ this.request.abort(); }catch(e){}
        
        if ( !page ) feedHome.innerHTML = '';
        if ( page )
        {
            this.loadMode = 'more';
        }
        else
        {
            this.loadMode = 'normal';
        }

        loadingDiv.show();
        
        if ( page ) window.scrollTo( 0 , loadingDiv.realTop() + 100 );

        this.request = new XN.net.xmlhttp(
        {
            url : 'feedretrieve.do',
            data : 'f=' + feed.flag + '&host=' + XN.cookie.get( 'hostid' ) + ( page ? '&p=' + page : '' ),
            onSuccess : function( r )
            {
                loadFeedSuccess( r , feed );
            },
            onError : loadFeedError
        });
    };
    /*
    归入框架
	//将str:String 补充道 parent:DOM后面
	function append(parent,str){
		var tempNode=document.createElement("div");
		tempNode.innerHTML=str;
		while(tempNode.firstChild){
			parent.appendChild(tempNode.firstChild);
		}
	}
    */

    function loadFeedSuccess( r , feed )
    {
		r = r.responseText.split( '##@L#' );

		if ( !r || isUndefined( r[1] ) )
        {
			loadingDiv.hide();
			return;
		}
        if ( feedFilter.loadMode == 'more' )
        {
            XN.log( 'feed:load more mode' );
            /*try
            {
                var tmp = document.createDocumentFragment();
                tmp.innerHTML = r[1];
			    feedHome.appendChild( tmp );
            }
            catch(e)
            {*/				
                //feedHome.innerHTML += r[1];
				//append(feedHome,r[1]);
                feedHome.appendHTML( r[1] );
            //}

            XN.log( 'feed:render over' );
			$($( 'moreFeed' ).parentNode).show();
            feedFilter.fireEvent( 'loadMoreSuccess' , feed );
	    }
        else
        {
			if( r[0] == "0" )
            {
                feedHome.innerHTML = '<p class=\"newsfeed-empty\">' + feed.nofeed + '</p>';
			}
            else
            {
				feedHome.innerHTML = r[1];
				$($( 'moreFeed' ).parentNode).show();
                feedFilter.fireEvent( 'loadFeedSuccess' , feed );
			}
        }
        if ( r[3] == r[4] )
        {
            $($( 'moreFeed' ).parentNode).hide();
        }
        //$( 'feedEnd' ).innerHTML = '';
        //$( 'feedEnd' ).appendChild( document.createTextNode( r[3] ) );
        if ( feedFilter.mode == 'more' )
        {
            if( r[4] >= parseInt( $('feedUnReadCount').innerHTML ) )
            {
                //$( 'feedUnReadCount' ).innerHTML = '';
                //$( 'feedUnReadCount' ).appendChild( document.createTextNode( r[4] ) );
            }
        }
        else
        {
            //$( 'feedUnReadCount' ).innerHTML = '';
            //$( 'feedUnReadCount' ).appendChild( document.createTextNode( r[4] ) );					
        }
        loadingDiv.hide();
        $( 'maxPage' ).value = r[0];        
    }

    function loadFeedError( r )
    {
        XN.DO.showError( '返回数据失败，请重试' );
    }


    window.showFeed = function( el )
    {
        var a = $( feedFilter.moreLabel ).getElementsByTagName('a')[0];
        var tmpType = el.innerHTML;
        var nfeed = getFeedByName( tmpType );
        
        if ( !nfeed.icon )
        {
            nfeed.icon = el.style.backgroundImage;
        }

        var ofeed = getFeedByName( a.innerHTML );
        
        el.style.backgroundImage = ofeed.icon;
        el.style.backgroundPosition = ofeed.backgroundPosition;
        el.innerHTML = ofeed.name;
        
        a.innerHTML = nfeed.name;
        
        feedFilter.moreType = nfeed;
        feedFilter.tabView.setCurrentTab( feedFilter.moreLabel , true );
        
    };


    feedFilter.loadMore = function()
    {
        var currentFeedName = feedFilter.currentFeed.name;

        var maxPage = $('maxPage').value;
		
        feedFilter.currentPage ++;
        var curpage = feedFilter.currentPage;

        if ( curpage > maxPage )
        {
            return ;
        }
        
        if ( curpage == maxPage )
        {
            //append(feedHome,'<p class="newsfeed-empty-ajax">没有更多' + (currentFeedName == '所有' ? '' :  currentFeedName) + '新鲜事了</p>');
            feedHome.appendHTML( '<p class="newsfeed-empty-ajax">没有更多' + (currentFeedName == '所有' ? '' :  currentFeedName) + '新鲜事了</p>' );
			$($( 'moreFeed' ).parentNode).hide();
            return;
        }
        feedFilter.load( feedFilter.currentFeed , curpage );
    }

    $( 'moreFeed' ).onclick = function()
    {
        feedFilter.loadMore();
    };
});

//展开全部新鲜事
XN.dom.ready(function()
{
    XN.page.home.feedFilter.addEvent( 'loadFeedSuccess' , extendsall );
    
    function evalcode( code )
    {
        if ( isArray( code ) ) code = code.join( '\n' );
        eval( '(function(){' + code + '})();' );
    }
	
	function extendsall( feed )
    {
      var js = $( 'feedHome' ).getElementsByTagName( 'script' );
      var code = [];

      if ( js.length > 0 )
      {
          XN.array.each( js , function( i , v )
          {
              if ( v.getAttribute( 'status' ) )
              {
                  code.push( v.innerHTML );
              }
          });
          
          //eval( code.join( '\n' ) );
          if ( XN.browser.IE )
          {
              if ( code.length > 5 )
              {
                  var code1 = code.slice( 0 , 4 );
                  XN.page.home.statusFeeds = code.slice( 4 );
                  evalcode( code1 );
              }
              else
              {
                  XN.page.home.statusFeeds = null;
                  evalcode( code );
              }
          }
          else
          {
              evalcode( code );
          }
      }
    }
    
    if ( !XN.browser.IE ) return;

    XN.event.addEvent( window , 'scroll' , function( e )
    {
        if ( XN.page.home.statusFeeds )
        {
            var str = XN.page.home.statusFeeds.shift();
            evalcode( str );
        }
    });
});


//你可能认识的人
(function()
{
    var loadURI = 'http://friend.xiaonei.com/ajax_get_common_friend.do';
	var delURI = 'http://friend.xiaonei.com/ajax_remove_common_friend.do';
    var defaultLoadNum = 7;
    var friends = null;
    var isloading = false;
    

    delCommonFriend = function( uid )
    {
        if ( !friends || friends.length < 1 )
        {
			if ( isloading ) return;
			load( uid );
			return;
		}

		new XN.net.xmlhttp({
            url : delURI,
            data : 'bid=' + uid 
        });
		var cf = $( 'commonFriend_' + uid );
		var rf = newCommonFriend( friends.shift() );
		cf.parentNode.replaceChild(rf,cf);
    };

    function preloadPhoto()
    {
        XN.dom.preloadImg( friends[ 0 ].tinyFullUrl );
    }

    function load( uid , num )
    {
        uid = uid || false;
        num = num || defaultLoadNum;
    
        new XN.net.xmlhttp(
        {
            url : loadURI,
            data : 'count=' + num + '&type=1',
            method : 'get',
            
            onComplete : function()
            {
                isloading = false;
            },
            
            onSuccess : function( r )
            {
                r = XN.json.parse( r.responseText );
                friends = r.friendCommonList;
                preloadPhoto();

                if ( uid )
                {
                    delCommonFriend( uid );
                }
            }

        });
    }
        
    function newCommonFriend( o )
    {
        var li = $element('li');
        li.id = 'commonFriend_' + o.id;
        li.innerHTML = '<span class="headpichold"><a href="http://xiaonei.com/profile.do?id=' + o.id + '" title="查看' + o.name + '的个人主页"><img src="' + o.tinyFullUrl + '" onload="roundify(this);" /></a></span>' + '<span><a class="addfriend_action" onclick="showRequestFriendDialog(\'' + o.id + '\',\'' + o.name + '\',\'' + o.head_url +　'\')" href="javascript:void(0);"><img src="http://xnimg.cn/imgpro/icons/addfriendicons.gif"/></a>' + '<a class="name" href="http://xiaonei.com/profile.do?id=' + o.id + '">' + o.name + '</a></span>';
        return li;
    }
    
    currentUser.onaddFriendSuccess = function( uid , msg )
    {
		delCommonFriend(uid);
	};

    
})()

/**
 * 新留言及回复提示 from /js/dispatch.js
 */
function today(dt) {
	var result = dt;

	var nnn = new Date();
	var nmm = nnn.getMonth() + 1;
	var ndd = nnn.getDate();
	if(nmm < 10) nmm = "0" + nmm;
	if(ndd < 10) ndd = "0" + ndd;

	var dmm = dt.substring(0, 2);
	var ddd = dt.substring(3, 5);

	if(nmm == dmm && ndd == ddd) {
		result = dt.substring(6);
	} else {
		result = dt.substring(0, 6);
	}
	return result;
}


var alldata;
var REPLY = 1, FANGLE=2, ALL=0, GROUP=3, SCHOOLCLASS=6;
var NUMBER_PER_PAGE = 30;
var showtype = 0, bAtHome = false, gCurPage;
var myDate = new Date();
var feedUserId = 0;
var fdCount = 0;
domainImg = "img.xiaonei.com";
domainStatic = "s.xnimg.cn";
domainGroup = "";
myDomain = "";
var CampusInfo = new Object();
CampusInfo.NewsIsEmpty = 0;
//新留言以及回复提示
CampusInfo.buildNewRepInfo=function(type){
try{
	var gossipReplyCount;
	var total;
	if ((!alldatanew.replys) && (!alldatanew.fangles)){

		if(showtype==0) {
	 		gossipReplyCount= alldatanew.count.replyc;
		} else {
	 		gossipReplyCount= alldatanew.count;
		}
		if(gossipReplyCount == 0) {
			CampusInfo.NewsIsEmpty++;
			if($("gossipReplyFeed"))
			{
			  $('opilist').innerHTML = "当有人回复了你发表的内容或者给你留言，这里会有提示" ;
			  $('opilist').style.display="";
			}
			if(bAtHome && (alldatanew.count.replytc > 0) ) {
				//更多
				if($("replyMoreDiv")) $("replyMoreDiv").innerHTML = '<a href="/myreplylist.do">更多</a>' ;
			}
			if($('replyDiv')) $('replyDiv').style.display="none";
			return;
 		}else{
 			if($('replyDiv')&&$('replyDiv').style.display=="none") $('replyDiv').style.display="";
 		}
	}
	var data;
	if(alldatanew.replys) {
		data = alldatanew.replys;
	}else {
		data = alldatanew.fangles;
	}
	var pages = 0;
	//显示数量

	var rep = "";

	for(var i = 0 ;i<data.length;i++){
		rep +="<div class=\"feed\"><div class=\"feed-icon\"><img src=\"http://s.xnimg.cn/imgpro/icons/wall_post.gif\"/></div>"
					+"<div class=\"feed-content\"><div class=\"headline\"><div class=\"title\"><span class=\"share-n-hide\">"
					+"<a class=\"x-to-hide\" href=\"javascript:void(0)\" onclick=\"CampusInfo.readOneNew("+type+","+data[i].recordNo+","+data[i].type+","+data[i].sourceNo+",'"+data[i].link+"',"+type+","+type+","+data[i].unread+" )\">&nbsp</a></span>";
		if (data[i].type==48){
			rep +="<h4><a href='"+data[i].link+"' target=\"_blank\" onclick=\"CampusInfo.readOneNew("+type+","+data[i].recordNo+","+data[i].type+","+data[i].sourceNo+",'"+data[i].link+"',"+type+","+type+","+data[i].unread+" )\">"+CampusUtils.resizeTitle(data[i].title)+"</a> "+data[i].sufix+" <span class='date'>"+today(data[i].createTime)+"</span></h4>";
		}else if (data[i].type==65540){
				if(data[i].fromUserName=="一个TA")
					rep +="<h4>"+CampusUtils.resizeName(data[i].fromUserName)+data[i].prefix+" <a href='"+data[i].link+"' target=\"_blank\" onclick=\"CampusInfo.readOneNew("+type+","+data[i].recordNo+","+data[i].type+","+data[i].sourceNo+",'"+data[i].link+"',"+type+","+type+","+data[i].unread+" )\">"+CampusUtils.resizeTitle(data[i].title)+"</a> "+data[i].sufix+" <span class='date'>"+today(data[i].createTime)+"</span></h4>";
		}else if (data[i].type==61){
					rep +="<h4>神秘的TA"+data[i].prefix+" <a href='"+data[i].link+"' target=\"_blank\" onclick=\"CampusInfo.readOneNew("+type+","+data[i].recordNo+","+data[i].type+","+data[i].sourceNo+",'"+data[i].link+"',"+type+","+type+","+data[i].unread+" )\">"+CampusUtils.resizeTitle(data[i].title)+"</a> "+data[i].sufix+" <span class='date'>"+today(data[i].createTime)+"</span></h4>";		
		}else{
			rep +="<h4><a href='http://xiaonei.com/profile.do?id="+data[i].fromUserNo+"' target='_blank'>"+CampusUtils.resizeName(data[i].fromUserName)+"</a> "+data[i].prefix+
			" <a href=\""+data[i].link+"\" target='_blank' onclick=\"CampusInfo.readOneNew("+type+","+data[i].recordNo+","+data[i].type+","+data[i].sourceNo+",'"+data[i].link+"',"+type+","+type+","+data[i].unread+" )\">"+CampusUtils.resizeTitle(data[i].title)+"</a> "+data[i].sufix+" <span class=\"date\">"+today(data[i].createTime)+"</span></h4>";
		}
		rep +="</div></div></div></div>";
	}

	if(showtype==0) {
 		gossipReplyCount= alldatanew.count.replyc;
	} else {
 		gossipReplyCount= alldatanew.count;
	}

	if($("gossipReplyCount"))
	    $("gossipReplyCount").innerHTML = "(" + gossipReplyCount + ")";

	if(bAtHome) {
		total = alldatanew.count.replytc;
	}
	if(bAtHome && (total > 0) ) {
		//更多
		if($("replyMoreDiv")) $("replyMoreDiv").innerHTML = '<a href="/myreplylist.do">更多</a>' ;
	}

 	if((!bAtHome) && gossipReplyCount > NUMBER_PER_PAGE) {
		rep +='<div id="pNav">';
		if(alldatanew.page>0) {
 			rep +='<a href="javascript:fnFeed('+showtype+',' + (alldatanew.page - 1) + ',0)">上一页</a>';
		}else if (bAtHome==0){
			rep += '<span  style="color: #999999; text-decoration:none">上一页</span>';
		}
 		if(alldatanew.page < ((gossipReplyCount- (gossipReplyCount % NUMBER_PER_PAGE) )/NUMBER_PER_PAGE)){
			if(alldatanew.page>0) rep +="<span class='separator'> </span>";
			rep += '<a href="javascript:fnFeed('+showtype+',' + (alldatanew.page + 1) + ',0)">下一页</a>';
		}else if (bAtHome==0){
			if(alldatanew.page>0) rep +="<span class='separator'> </span>";
			rep += '<span style="color:#999999;text-decoration:none">下一页</span>';
		}

		rep +='</div>';
	}
	if($('replyDiv')) $('replyDiv').style.display="";
  if($("opilist"))
	  $("opilist").innerHTML = rep;
	}catch(E){
	    $('opilist').innerHTML = "当有人回复了你发表的内容或者给你留言，这里会有提示" ;
			if($('replyDiv'))
				$('replyDiv').style.display="";
			if($('opilist'))
				$('opilist').style.display="";
  }
};

var CampusUtils = new Object();
CampusUtils.iconRep=[    {atype:1,ln:"http://"+domainStatic+"/img/dispatch/icon04.gif"},
	                     {atype:2,ln:"http://"+domainStatic+"/img/dispatch/icon05.gif"},
	                     {atype:4,ln:"http://"+domainStatic+"/img/dispatch/icon05.gif"},
	                     {atype:8,ln:"http://"+domainStatic+"/img/dispatch/icon02.gif"},
	                     {atype:16,ln:"http://"+domainStatic+"/img/dispatch/icon06.gif"},
	                     {atype:32,ln:"http://"+domainStatic+"/img/dispatch/icon04.gif"},
	                     {atype:64,ln:"http://"+domainStatic+"/img/dispatch/icon05.gif"},
	                     {atype:128,ln:"http://"+domainStatic+"/img/dispatch/icon05.gif"},
	                     {atype:256,ln:"http://"+domainStatic+"/img/dispatch/icon02.gif"},
	                     {atype:512,ln:"http://"+domainStatic+"/img/dispatch/icon06.gif"}];
CampusUtils.resizeName = function (name, limit){
	return CampusUtils.substring(name,3,null);
};
CampusUtils.resizeTitle = function (title, limit){

   try{
    if(title==null||title=="")
        //return "无标题" ;
        return "去看看" ;
    return CampusUtils.substringForTitle(title,16,null) ;
   }catch(e){
   	//return "无标题" ;
   	return "去看看" ;
   }
};
CampusUtils.resizeTitle2 = function (title){
    if(title==null)
        return "" ;
    return CampusUtils.substring(title,15,null);
};
CampusUtils.substring = function(str, len, postfix) {
	var res = "";
	var p = 0;
	for (var i=0; i<str.length; i++) {
		var ch = str.charAt(i);
		if (ch > '!' && ch < '~') {
			p += 1;
		} else {
			p += 2;
		}
		if (p <= len*2) {
			res += ch;
		}
	}
	if (p > len*2) {
		if (postfix != null)
			res += postfix;
		else
			res += "...";
	}
	return res;
};
CampusUtils.substringForTitle = function(str, len, postfix) {
	var res = "";
	var p = 0;
	var pattern =/<img.*?\/>/ig;
	var result = str.match(pattern);
	var replacedText = str.replace(pattern,'\t');
	for (var i=0; i<replacedText.length; i++) {
		var ch = replacedText.charAt(i);
		if (ch > '!' && ch < '~') {
			p += 1;
		} else {
			p += 2;
		}
		if (p <= len*2) {
			res += ch;
		}
	}
	if (p > len*2) {
		if (postfix != null)
			res += postfix;
		else
			res += "...";
	}
	for (var i=0; result!=null && i<result.length; i++) {
		res = res.replace(/\t/,result[i]);
	}
	return res;
};
CampusUtils.shortString = function (str){
	document.write(str.substring(0,5));
}
function showResponseHomeReply(r) {
	eval("alldatanew="+r.responseText);
	CampusInfo.buildNewRepInfo(1);
}
function getReplyList(){
	showtype = 1;
	bAtHome = 2;
	gCurPage = 0;
 	//if(getEl("fangle_curpage_hid")) {getEl("fangle_curpage_hid").value=0;}
	//if(getEl("fangle_first_hid")) {getEl("fangle_first_hid").value=2;}
	var url = '/dispatchview.do';
	var pars = "type=1&curpage=0&isfirst=2&t="+myDate.getTime();
	var myAjax = new Ajax.Request(
				url,
				{
							method: 'post',
							parameters: pars,
							onComplete: showResponseHomeReply,
							onFailure: showError
				});
}
function showError(t) {
	var errmsg = t.status + ' -- ' + t.statusText;
	alert("抱歉，出错了；错误信息: " + errmsg + " 麻烦点页面底部的 “给管理员留言”报告错误");
}
CampusInfo.readOneNew = function(type,no,atttype,sourceno,link,orgtype,unread){
	if (type==1){
		isreadone1 = 'read';
	}
	if(unread){
		var cur, first;
		if($("fangle_curpage_hid")) {
			cur = $("fangle_curpage_hid").value ;
		} else {
			cur = 0;
		}
		if($("fangle_first_hid")) {
		 	first = 0 ;
		} else {
			first = 1;
		}
		var url="/dispatchreadone.do";
		var pars="type="+type+"&cur="+cur+"&isfrist="+first+"&dispatchNo="+no+"&atttype="+atttype+"&sourceno="+sourceno+"&ran="+Math.random() ;
    
		var myAjax = new Ajax.Request(
					url,
					{
								method: 'get',
								parameters: pars,
								onComplete: getReplyList,
								onFailure: showError
					});
        if ( window.webpager && webpager.removeNotify ) 
            webpager.removeNotify( link ); 
	}
};

//公告系统
(function()
{
    //patch
    XN.net = XN.NET , XN.env = XN.ENV;
    
    var ids = {};

    announcement_show = function( div , uid )
    {
        new XN.net.xmlhttp(
        {
            url : 'http://publicity.' + XN.env.domain + '/show?' + uid,
            onSuccess : function( r )
            {
                var str = r.responseText;
                ids[ div ] = XN.string.trim( str.substr( 0 , 11 ) );
                if ( $( div ) ) $( div ).innerHTML = str.substring( 11 , str.length );
            }
        });
    };
    
    announcement_close = function( uid , div )
    {
        if ( $( div ) ) $( div ).remove();
        new XN.net.xmlhttp( {
            url : 'http://publicity.' + XN.env.domain + '/close?u=' + uid + '&i=' + ids[ div ],
            method : 'get'
        });
    }
    
    announcement_click = function( uid , url , openWin , div )
    {
        if ( $( div ) ) $( div ).remove();
        if ( openWin ) window.open( url );

        new XN.net.xmlhttp(
        {
            url : 'http://publicity.' + XN.env.domain + '/close?u=' + uid + '&i=' + ids[ div ], 
            onComplete : function()
            {
                if ( !openWin ) window.location.href = url;
            }
        });
    }

})();

//写入Flash视频
function playVideo(panel,url){
	var swfObject=new SWFObject("http://s.xnimg.cn/actimg/08daren/videoplayer.swf", "", 480,360, "9.0.124");
	swfObject.addVariable("videourl",url);
	swfObject.addVariable("autoplay",1);
	swfObject.addParam("wmode", "transparent");
	swfObject.useExpressInstall('http://s.xnimg.cn/xnapp/common/swf/playerProductInstall.swf');
	swfObject.write(panel);
}

//推广page
XN.DOM.readyDo(function(){
	var pages=$('sideItemPages');
	var pageName=$('pageName');
	if(pages && pages.getElementsByTagName("li").length>=2){
		$("rightPage").addEvent("click",function(e){
			var list=pages.getElementsByTagName("li");
			list[0].className="";
			list[1].className="first";
			pageName.innerHTML=list[1].getElementsByTagName("input")[0].value;
			pages.appendChild(list[0]);
		});
		$("leftPage").addEvent("click",function(e){
			var list=pages.getElementsByTagName("li");
			list[0].className="";
			list[list.length-1].className="first";
			pageName.innerHTML=list[list.length-1].getElementsByTagName("input")[0].value;
			pages.insertBefore(list[list.length-1],list[0]);
		});
	}
});


// 状态推广

XN.DOM.readyDo(
	function(){
		// if ( /guide\.kaixin\.com/.test( window.location.href ) || XN.cookie.get( 's_g_over' ) || $('statusCount') == null ) return;
		function lastStage()
		{
			XN.cookie.set( 's_g_over' , '1' );
		}
		var publisherGuideHolder = document.createElement("div");
		publisherGuideHolder.id="publisherGuideHolder";
		$('publisher_frame').appendChild(publisherGuideHolder);
		var guide1='<div class="arrownew" style="display:none;">' +
			'<div class="newfunc">' +
				'<span class="new"></span>' +
				'<a class="shut" href="#"></a>' +
				'<h3>新功能</h3>' +
				'<p>在状态里照片和音视频！</p>' +
			'</div>' +
		'</div>';
		var guide2='<div class="arrowone" style="display:none;">' +
			'<div class="status">' +
				'<span class="one"></span>' +
				'<a class="shut" href="#"></a>' +
				'<h3>10秒钟精通发状态</h3>' +
				'<p>这是一个神奇的框框，有什么想法，马上记录下来，享受分享的快乐！例如：“今天天气很好，心情很好”“旁边楼着火啦！”</p>' +
			'</div>' +
		'</div>';
		var guide3='<div class="arrowtwo">' +
			'<div class="stronger">' +
				'<span class="two"></span>' +
				'<a class="shut" href="#"></a>' +
				'<h3>更强功能</h3>' +
				'<p>这里你可以添加照片，分享视频，音频或网页<a class="text" href="#">OK,没问题</a></p>' +
			'</div>' +
		'</div>';

		var statusNumb = parseInt($('statusCount').innerHTML);

		if(statusNumb == 0){

			$('status_guide1').show();

			XN.widgets.publisher.statusEditor.addEvent( 'updateSuccess',function()
			{
				$('status_guide1').hide();
				$( 'status_guide2' ).show();
			});

			$('closeGuide').addEvent('click',function(e){
				$('selSthElseID').addEvent('click',function(e){
					$('status_guide3').hide();XN.func.runOnce(function(){$('status_guide4').show();});lastStage();
				});
			});
			$('noProblem').addEvent('click',function(e){
				$('selSthElseID').addEvent('click',function(e){
					$('status_guide3').hide();XN.func.runOnce(function(){$('status_guide4').show();});lastStage();
				});
			});

		}else{lastStage();}
	}
);

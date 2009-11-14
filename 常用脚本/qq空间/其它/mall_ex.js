
var vipRightMsg=[
	{onuse:"0",title:"黄钻特权:黄钻自定义模板",url:""},
	{onuse:"1",title:"黄钻特权:黄钻信纸",url:"http://imgcache.qq.com/qzone/newblog/blogcanvas.html?secondary=1&paperdialog=1"},
	{onuse:"1",title:"黄钻特权:左侧皮肤",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=sk_left"},
	{onuse:"1",title:"黄钻特权:大头帖",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=big"},
	{onuse:"0",title:"黄钻特权:黄钻QQ秀",url:""},
	{onuse:"1",title:"黄钻特权:黄钻QQ秀泡泡",url:"http://imgcache.qq.com/qzone/newblog/blogcanvas.html?secondary=1&paperdialog=2"},
	{onuse:"1",title:"黄钻特权:免费装扮",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=hp"},
	{onuse:"1",title:"黄钻特权:自定义个性头像",url:"http://imgcache.qq.com/qzone/profile/user_infomation_main.html#9"},
	{onuse:"0",title:"黄钻特权:免费领取道具",url:""},
	{onuse:"1",title:"黄钻LV3及以上特权:DIY装扮",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=skin_diy"},
	{onuse:"1",title:"黄钻LV2及以上特权:商城特供品免费",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=hp"},
	{onuse:"1",title:"黄钻LV4及以上特权:免费送信纸",url:"http://imgcache.qq.com/qzone/newblog/blogcanvas.html?secondary=1&paperdialog=1"},
	{onuse:"1",title:"黄钻特权:专享5G以上相册",url:"http://imgcache.qq.com/qzone/client/photo/pages/qzone_v4/album_list.htm"},
	{onuse:"1",title:"黄钻特权:商城黄钻专区",url:"http://imgcache.qq.com/qzone/mall/v5/web/mall/index.htm?target=zqhp"}];

var g_msgPath_Set = false;//消息通道中msgPath.js的内容是否已经处理完成
var g_msgPath;
function msgPathCallBack(obj)
{//msgPath.js返回处理函数
	if(ownermode)
	{//主人态
		if(obj&&obj.bottomHtml)
			QZONE.allTips.fillHtml(1,obj.bottomHtml);//插入消息通道底部内容

		if(obj&&obj.vipRight)
		{
			if(vipRightMsg[obj.vipRight]&&vipRightMsg[obj.vipRight].onuse=="1")
			{
				QZONE.allTips.addRemind(//插入消息通道黄钻特权内容
				{
					icon:"icon_vip_yl",
					title:vipRightMsg[obj.vipRight].title,
					tips:"", 
					click:
					{
						url:vipRightMsg[obj.vipRight].url,
						target:"" 
					}
				});
			}
		}
	}
	g_msgPath = obj;
	g_msgPath_Set = true;
	return;
}

if(ownermode)
{
	loadJsonData("msgPathByMall","http://imgcache.qq.com/qzone/mall/static/json/msgPath_v5.json",msgPathCallBack,void(0),false,null,"_Callback");
}
else
{
	g_msgPath_Set=true;
	g_msgPath="";
}

var diamonEncharge=[
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=YELLOW_SHOWTIPS",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=YELLOW_CLICKMORE",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=YELLOW_CLICKPAY"
];

function diamonSendStat(id){
	if(diamonEncharge[id])
	{
		if(typeof(send_stat_request)=="function")
			send_stat_request(diamonEncharge[id],500);
		else
			top.send_stat_request(diamonEncharge[id],500);
	}
}

var tipsStaEncharge=[
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV1",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV2",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV3",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV4",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV5",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV6",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_LV7",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_SIMPLE",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_SIMPLE_CHARM",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_TOP_SIMPLE_7DAY",
"http://mall2.qzone.qq.com/fcg-bin/v3/fcg_mall_statis?type=TIPS_BOTTOM"
];

function tipsSendStat(id){
	if(tipsStaEncharge[id])
	{
		if(typeof(send_stat_request)=="function")
			send_stat_request(tipsStaEncharge[id],500);
		else
			top.send_stat_request(tipsStaEncharge[id],500);
	}
}

function dateFactory(s){
	return new Date(s.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,"$1/$2/$3 $4:$5:$6"));
};

var g_vipStatus = QZONE.FrontPage.getVipStatus();		//0为非黄钻，1为黄钻

//处理小黄条
var yellowwhitemsg = '';
function show_yellowTips(obj)
{
	o=obj.ownerinfo;
	if(o.bitmap && o.bitmap.length==64 && o.bitmap[1]=="1")
	{//在小黄条白名单里,显示特殊内容
		if(yellowwhitemsg != "")
			QZONE.space.showTips(yellowwhitemsg);
		return;
	}
	if(g_vipStatus==0)
	{//黄钻已过期，不输出小黄条	
		return;
	}	
		
	var d = parseInt(obj.overday);
	if(d<=7 && d>=0){//黄钻还有七天就过期或者刚过期
		var nick = QZONE.FrontPage.getNickname();	//昵称
		var level= obj.ownerinfo.level;				//等级
		var leftday= obj.ownerinfo.leftday;	//还有多少天升级
		var strstr="";
		switch(level)
		{
			case 1:
				if(d>=4&&d<=7)
					strstr='您的黄钻特权还有<strong>'+d+'</strong>天到期，距离您升级还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到LV2可享受特供品都免费！';
				else if(d>=1&&d<=3)
					strstr='您的黄钻特权仅有<strong>'+d+'</strong>天到期，届时空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到LV2连特供品都免费！';
				else
					strstr='您的黄钻特权即将到期，空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到<strong>LV2</strong>连特供品都免费！';
			break;
			case 2:
				if(d>=4&&d<=7)
					strstr='您的黄钻特权还有<strong>'+d+'</strong>天到期，距离您升级到<strong>LV3</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>！';					
				else if(d>=1&&d<=3)
					strstr='您的黄钻特权仅有<strong>'+d+'</strong>天到期，届时空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到LV3可以享受DIY装扮！';					
				else
					strstr='您的黄钻特权即将到期，距离您升级到<strong>LV3</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到LV3可以享受DIY装扮！';					
			break;
			case 3:
				if(d>=4&&d<=7)
					strstr='您的黄钻特权还有<strong>'+d+'</strong>天到期，距离您升级到<strong>LV4</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>！';					
				else if(d>=1&&d<=3)
					strstr='您的黄钻特权仅有<strong>'+d+'</strong>天到期，届时空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到LV4还可以赠送信纸！';
				else
					strstr='您的黄钻特权即将到期，距离您升级到<strong>LV4</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，现在升级到<strong>LV4</strong>还可以赠送信纸！';
			break;
			case 4: 
			case 5:        
			case 6:
				if(d>=4&&d<=7)
					strstr='您的黄钻特权还有<strong>'+d+'</strong>天到期，距离您升级到<strong>LV'+(level+1)+'</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>！';
			    else if(d>=1&&d<=3)
					strstr='您的黄钻特权仅有<strong>'+d+'</strong>天到期，届时空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，继续享受高等级尊贵特权！';
				else
					strstr='您的黄钻特权即将到期，距离您升级到<strong>LV'+(level+1)+'</strong>还有<strong>'+leftday+'</strong>天，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，继续享受高等级尊贵特权！';
			break;
			case 7:
				if(d>=4&&d<=7)
					strstr='您的黄钻特权还有<strong>'+d+'</strong>天到期，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，继续享受高等级尊贵特权！';
			    else if(d>=1&&d<=3)
					strstr='您的黄钻特权仅有<strong>'+d+'</strong>天到期，届时空间装扮将消失，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，继续享受高等级尊贵特权！';
				else
					strstr='您的黄钻特权即将到期，<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">点击续费保留特权</a>，继续享受高等级尊贵特权！';
			break;
			default:
				strstr='主人，您的黄钻贵族身份'+((d<=0)?'<strong>今天</strong>':('<strong>'+d+'天</strong>后'))+'就要过期啦，过期后将失去您现有的精美装扮，请尽快续费哦！&nbsp;<a href="http://imgcache.qq.com/qzone/mall/v3/diamonnote/default.html?d='+d+'&n='+encodeURIComponent(nick)+'&t='+dateFactory(""+o.timeover).getTime()+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(1)">点击了解&gt;&gt;</a>&nbsp;&nbsp;<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.lytips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" target="_blank" style="color:blue;text-decoration:underline" onclick="diamonSendStat(2)">我要续费&gt;&gt;</a>';
		}
		QZONE.space.showTips(strstr);//显示小黄条
	
		diamonSendStat(0);
	}
}

//处理消息通道顶层内容
var tipswhitemsg= '';
function deal_alltips_top(obj)
{
	o=obj.ownerinfo;
	if(o.bitmap && o.bitmap.length==64 && o.bitmap[1]=="1")
	{//在消息通道顶上内容白名单，直接显示特殊内容
		if(tipswhitemsg != "")
			QZONE.allTips.fillHtml(0,tipswhitemsg);
		return;
	}

	if(g_vipStatus==0)
	{//非黄钻
		if(obj.ownerinfo.charm == "0")
		{//没有经验值
			if(g_msgPath_Set&&g_msgPath.topHtml&&g_msgPath.topHtml[7])
				QZONE.allTips.fillHtml(0,g_msgPath.topHtml[7]);
		}
		else
		{//有经验值			
			var d = parseInt(obj.overday);
			if(d<=7 && d>=0)
			{//已经过期1-7天
				var strstr0 ="";
				var strstr="";
				var level = obj.ownerinfo.level;	
				switch(level)
				{
					case 1://1级
						if(d<=1)
							strstr0 = "您刚关闭了黄钻，曾经漂亮的空间装扮消失了多可惜啊，赶紧回来吧";
						else if(d<=2)
							strstr0 = "您已经关闭黄钻2天了，商城又出新装扮了，早点回来装扮吧";
						else if(d<=4)
							strstr0 = "只要升级到黄钻LV2连特供品都免费用，赶紧重新开通黄钻吧";
						else if(d<=6)
							strstr0 = "还记得曾经的空间装扮么，多吸引人啊，现在开通黄钻把它们找回来吧";
						else
							strstr0 = "没有黄钻特权一定不习惯了吧，赶紧回来看看黄钻的新玩法吧";
					break;
					case 2://2级
						if(d<=1)
							strstr0 = "您刚关闭黄钻，曾经漂亮的免费特供品都不能用了多可惜，赶紧回来吧";
						else if(d<=2)
							strstr0 = "您曾经是黄钻LV2贵族，升级到LV3可以用自己相片做皮肤，赶紧恢复黄钻吧";
						else if(d<=4)
							strstr0 = "其实只要再升一级就可以使用相册图片做空间皮肤了，赶紧恢复黄钻吧";
						else if(d<=6)
							strstr0 = "喜欢空间的那些特供品装扮么？赶紧开通黄钻免费拥有它们吧";
						else
							strstr0 = "您曾经是黄钻LV2贵族，升级到LV3还可以用自己相片做皮肤，不要错过哦";
					break;
					case 3://3级
						if(d<=1)
							strstr0 = "您刚关闭黄钻，不能自己做空间皮肤多可惜啊，赶紧回来吧";
						else if(d<=2)
							strstr0 = "您曾经是尊贵的黄钻LV3贵族，连空间皮肤都可以自定义，现在关闭太可惜了";
						else if(d<=4)
							strstr0 = "看看周围朋友用自己相片做的空间皮肤多漂亮啊，恢复黄钻马上拥有";
						else if(d<=6)
							strstr0 = "曾经可以把自己相册图片设置为空间皮肤，现在开通黄钻继续享用";
						else
							strstr0 = "现在很多人都自己上传相册图片做皮肤了，其实您也可以的，不要错过哦";
					break;
					case 4://4级
						if(d<=1)
							strstr0 = "您刚关闭黄钻，现在恢复继续享受黄钻特权，还可以赠送信纸给好友";
						else if(d<=2)
							strstr0 = "您曾经是黄钻LV4,连信纸都可以免费赠送给好友，赶紧恢复吧";
						else if(d<=4)
							strstr0 = "您曾经是黄钻LV4,连信纸都可以免费赠送给好友，赶紧恢复吧";
						else if(d<=6)
							strstr0 = "您是黄钻高等级用户，温馨提示您，黄钻已到期，别忘记续费哦";
						else
							strstr0 = "您是黄钻高等级用户，温馨提示您，黄钻已到期，别忘记续费哦";
					break;
					case 5://5级     
					case 6://6级
					case 7://7级
						if(d<=1)
							strstr0 = "您是黄钻高等级用户，温馨提示您，黄钻已到期，别忘记续费哦";
						else if(d<=2)
							strstr0 = "您是黄钻高等级用户，温馨提示您，黄钻已到期，别忘记续费哦";
						else if(d<=4)
							strstr0 = "您是黄钻高等级用户，温馨提示您，黄钻已到期，别忘记续费哦";
						else if(d<=6)
							strstr0 = "你已经关闭黄钻几天了，黄钻贵族圈时刻等待王者的归来";
						else
							strstr0 = "你已经关闭黄钻7天了，黄钻贵族圈时刻等待王者的归来";
					break;
					default:
						strstr0 = "";
					break;
				}
				if(strstr0!="")
				{
					strstr= strstr='<a href="http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&aid=zone.tips&subtype=1&clientkey='+getCookie("zzpanelkey")+'&clientuin='+getCookie("zzpaneluin")+'" onclick="tipsSendStat(9);return true;" target="_blank">'+strstr0+'</a>';
					QZONE.allTips.fillHtml(0,strstr);//插入消息通导顶部消息
				}
			}
			else
			{//过期7天以上时间
				if(g_msgPath_Set&&g_msgPath.topHtml&&g_msgPath.topHtml[8])
					QZONE.allTips.fillHtml(0,g_msgPath.topHtml[8]);
			}
		}
	}
	else
	{//黄钻未过期，按等级显示
		if(g_msgPath_Set&&g_msgPath.topHtml&&g_msgPath.topHtml[obj.ownerinfo.level-1])
			QZONE.allTips.fillHtml(0,g_msgPath.topHtml[obj.ownerinfo.level-1]);
	}
	return;
}

//显示消息通道
var g_show_allTips_CallTimes = 0;
function show_allTips(obj)
{
	if(ownermode)
	{//主人态
		if(!g_msgPath_Set&&g_show_allTips_CallTimes<3)
		{//要等msgPath的内容还没处理完
			g_show_allTips_CallTimes++;
			setTimeout(function(){show_allTips(obj)},1000);
			return;
		}
		show_yellowTips(obj);//处理小黄条显示
		deal_alltips_top(obj);//处理消息通道顶上内容

		QZONE.allTips.show();
	}
}

function MallExCallback(obj)
{//fcg_get_mall_ex返回处函数
	if(!obj||!obj.result||obj.result=="0"){//cgi出错
		if(obj.errmsg)
			alert(obj.errmsg);
		return;
	}

	if(obj.ownerinfo)
	{
		obj.ownerinfo.bitmap = obj.bitmap.split("");
		QZONE.allTips.setDiamondInfo(obj.ownerinfo);//把黄钻信息传给前台
	}

	if(ownermode)	
	{
		show_allTips(obj);
	}

	return;
}

var MallExUrl = "";
if(!ownermode)	//客人态
	MallExUrl = "http://vip.qzone.qq.com/fcg-bin/fcg_get_mall_ex?uin="+g_iUin+"&vip="+g_vipStatus+"&mode=0&sds="+Math.random();
else	//主人态
	MallExUrl = "http://vip.qzone.qq.com/fcg-bin/fcg_get_mall_ex?uin="+g_iUin+"&vip="+g_vipStatus+"&mode=1&sds="+Math.random();

loadJsonData("VipTimeOverTips",MallExUrl,MallExCallback,void(0),false,null,"_Callback");


//黄钻过期提醒
if(ownermode && !QZONE.FrontPage.getVipStatus()){
	QZONE.FrontPage.getSecondaryBitMapFlag(function(wholeBitmap, needBitmap){
		if(needBitmap == '1'){
			QZONE.FrontPage.popupDialog('黄钻过期提醒', {src:'/qzone/mall/develop/yellowscore/yellow_expired_pages/closetips.htm'}, 344, 260);
		}
	}, 32, 1, top.g_iLoginUin);
}
/*  |xGv00|da250f42354302c82ffeb85c16c4f8c8 */
var maxLang = {};
maxLang['zh-cn'] = {
	'cookieDisabled':'对不起，您的浏览器的Cookie功能被禁用，请开启,否则设置不能被保存。',
	'load':'载入中....',	
	'error':'数据载入出错，请刷新页面。',
	'errorData':'数据载入出错！',
	'more':'更多&raquo;',
	'favCollection':'经常访问收藏',
	'lastVisit':'上次访问页面',
	'visitHistory':'浏览历史',
	'openAll':'全部打开',
	'noLastData':'没有上次访问页面.',
	'webLinks':'常用网址',
	'webTools':'在线工具',
	'webSofts':'常用软件',
	'sinaBlog':'新浪博客',
	'otherThings':'新鲜事',
	'sinaNews':'新浪新闻',
	'hotTalk':'热点话题',
	'todayGet':'今日抢购&raquo;',
	'shopping':'抢购',
	'sougou':'酷狗音乐排行榜&raquo;',
	'movie':'影视排行榜&raquo;',
	'taobao':'淘宝热卖推荐&raquo;',
	'game':'休闲小游戏排行榜&raquo;',
	'foceWord':'请输入关键字',
	'sWord':'搜索',
	'weatherTit':'天气信息城市选择',
	'province':'省份',
	'city':'城市',
	'confirm':'确定',
	'cancel':'取消',
	'cookieShow':'当您清除Cookie或者更换电脑时，这里所作的设置将无法保存.',
	'disCookieShow':'当前浏览器没有打开cookie,您所做的操作将无法保存',
	'backDef':'恢复默认设置',
	'c_city':'选择城市',
	'c_weather':'详细天气&raquo;',
	'c_error':'没有您选择城市的数据.',
	'conChose':'内容选择',
	'bStyle':'页面风格',
	'm_news':'今日新闻',
	'm_webUse':'网络导航,实用工具',
	'm_webList':'网络流行趋势榜',
	'm_maxFav':'傲游浏览器:经常访问收藏',
	'm_maxLast':'傲游浏览器:上次访问页面',
	'm_small':'小字体版',
	'm_big':'大字体版',
	'st_blue':'晶蓝',
	'st_green':'茶香',
	'st_grey':'雅灰',
	'st_pink':'浅粉',
	'search_web':'网页',
	'search_image':'图像',
	'search_music':'音乐',
	'search_video':'视频',
	'search_dict':'辞典',
	'search_answer':'百科',
	'search_shopping':'购物'
}

var dataWebLinks = [
	{n:'百&nbsp;度',l:'http://www.baidu.com/index.php?tn=maxco3_pg'},
	{n:'Google',l:'http://www.google.cn/search?client=aff-maxthon&channel=channel3&q='},
	{n:'新&nbsp;浪',l:'http://sina.allyes.com/main/adfclick?db=sina&bid=150439,189376,194356&cid=0,0,0&sid=182093&advid=3406&camid=26067&show=ignore&url=http://www.sina.com.cn'},
	{n:'网&nbsp;易',l:'http://www.163.com'},
	{n:'搜&nbsp;狐',l:'http://www.sohu.com'},
	{n:'腾讯QQ',l:'http://www.qq.com/'},
	
	{n:'校内网',l:'http://www.xiaonei.com/'},
	{n:'开心网',l:'http://www.kaixin001.com'},
	{n:'天涯社区',l:'http://www.tianya.cn/'},
	{n:'猫扑大杂烩',l:'http://www.mop.com/'},
	{n:'大众点评网',l:'http://www.dianping.com'},
	{n:'百度贴吧',l:'http://tieba.baidu.com/'},
	
	{n:'淘宝网',l:'http://adtaobao.allyes.cn/main/adfclick?db=adtaobao&bid=8031,3028,929&cid=34829,416,1&sid=70007&show=ignore&url=http://s.click.alimama.com/ma_a?ne=P7qqTeMkUnog%2BABaFJJT94nTNlpCxGqzFVGWe5O4brZ8I7FL%2FLbH0Ekngc4hpoB9EnYik0vGAnvZ%2Bsy9ULReJ85b%2BDbFRT1lNrt95Zna3IFYR5u9sFhWOe2bTMFcNVuqh7rr9YE1XzFaoIsx5T%2BlZ6mWCb4%2BZWTaevU4%2BX4iLp0%3D'},
	{n:'京东商城',l:'http://p.yiqifa.com/c?s=1a8183e2&w=628&c=254&i=160&l=0&e=shouyecywz&t=http://www.360buy.com/Union/Union_default.aspx'},
	{n:'当当',l:'http://p.yiqifa.com/c?s=e1a5300d&w=628&c=247&i=159&l=0&e=shouyecywz&t=http://www.dangdang.com'},
	{n:'卓越',l:'http://p.yiqifa.com/c?s=5ae1bc3a&w=628&c=245&i=201&l=0&e=shouyecywz&t=http://www.amazon.cn'},
	{n:'携程网',l:'http://www.ctrip.com/smartlink/smartlink.asp?c=qiqf151&url=http://flights.ctrip.com/Domestic/SearchFlights.aspx'},
	{n:'瑞丽女性网',l:'http://www.rayli.com.cn/'},
	
	{n:'凤凰网',l:'http://www.ifeng.com'},
	{n:'新华网',l:'http://www.xinhuanet.com/'},
	{n:'联合早报',l:'http://www.zaobao.com'},
	{n:'太平洋网',l:'http://www.pconline.com.cn/'},
	{n:'中关村在线',l:'http://www.zol.com.cn/'},
	{n:'CCTV',l:'http://www.cctv.com/'},
	
	{n:'优酷网',l:'http://www.youku.com'},
	{n:'土豆网',l:'http://www.tudou.com'},
	{n:'迅雷看看',l:'http://kankan.xunlei.com/'},
	{n:'多玩',l:'http://www.duowan.com'},
	{n:'汽车之家',l:'http://www.autohome.com.cn/'},
	{n:'搜房网',l:'http://www.soufun.com/'},
	
	{n:'工商银行',l:'http://www.icbc.com.cn/icbc/'},
	{n:'招商银行',l:'http://www.cmbchina.com/'},
	{n:'支付宝',l:'https://www.alipay.com/'},
	{n:'天天基金',l:'http://fund.eastmoney.com/'},
	{n:'中彩网',l:'http://www.zhcw.com/'},
	{n:'东方财富',l:'http://www.eastmoney.com/'},
	
	
	{n:'起点中文网',l:'http://www.qidian.com/'},
	{n:'4399小游戏',l:'http://www.4399.net'},
	{n:'51.com',l:'http://www.51.com'},
	{n:'世纪佳缘',l:'http://www.jiayuan.com/'},
	{n:'前程无忧',l:'http://www.51job.com/'},
	{n:'中国移动',l:'http://www.chinamobile.com/'}
];

var dataSofts = [
	{n:'腾讯QQ',l:'http://dl_dir.qq.com/qqfile/qq/QQ2009/QQ2009_chs.exe'},
	{n:'MSN',l:'http://download.get.live.cn/components/Install_WLMessenger.exe'},
	{n:'PPstream',l:'http://download.ppstream.com/ppstreamsetup.exe'},
	
	{n:'暴风影音',l:'http://dl.baofeng.com/storm3/Storm2009-0510.exe'},
	{n:'千千静听',l:'http://ttplayer.qianqian.com/download/ttpsetup.exe'},
	{n:'酷狗音乐',l:'http://downmini.kugoo.com/kugou.exe'},
	
	{n:'迅雷',l:'http://down.sandai.net/Thunder5.8.14.706.exe'},
	{n:'网际快车',l:'http://61.141.5.181/flashget3.0.0.1047cn.exe'},
	{n:'电驴Emule',l:'http://download.verycd.com/easyMule-Setup.exe'},
	
	{n:'WinRAR',l:'http://www.winrar.com.cn/download/wrar380sc.exe'},
	{n:'优化大师',l:'http://liveupdate.wopti.net/WoptiFree.zip'},
	{n:'同花顺',l:'http://zjcmpp.hexin.com.cn/soft/10JQKA_maxthon_v4.50.52_Build90327.exe'},
	
	{n:'瑞星2009',l:'http://rsdownload.rising.com.cn/Middle/RisolXZ.exe'},
	{n:'光影魔术手',l:'http://down.neoimaging.cn/neoimaging/NeoImaging3.1.1.58.exe'},
	{n:'驱动精灵',l:'ftp://file8.mydrivers.com/others/mydrivers.DriverGenius_v2009b1_bd.zip'},
	
	//{n:'大智慧',l:'ftp://southdown.gw.com.cn/pub/Dzh_2in1.exe'},
	
	{n:'谷歌拼音',l:'http://dl.google.com/pinyin/GooglePinyinInstaller.exe'},
	{n:'搜狗拼音',l:'http://ime.sogou.com/dl/sogou_pinyin_41d.exe'},
	{n:'极品五笔',l:'http://www.jpwb.net/download/jpwb.exe'}
//	{n:'WinRAR',l:'http://www.winrar.com.cn/download/wrar380sc.exe'},
//	{n:'360安全卫士',l:'http://down.360safe.com/setup.exe'},
//	{n:'驱动精灵',l:'ftp://file6.mydrivers.com/others/mydrivers_dg_b52.zip'},
];

var dataWebTools = [
	{n:'手机归属地',l:'http://www.ip138.com/'},
	{n:'航班查询',l:'http://flights.ctrip.com/Domestic/SearchFlights.aspx'},
	{n:'列车时刻',l:'http://www.huoche.com.cn/'},
	
	{n:'快递查询',l:'http://www.kiees.cn/'},
	{n:'天气预报',l:'http://weather.news.sina.com.cn/'},
//	{n:'邮政区号',l:'http://www.soft8.net/yb.htm'},
	{n:'在线翻译',l:'http://translate.google.cn/translate_t#'},
//	{n:'万年历',l:'http://site.baidu.com/list/wannianli.htm'},


	{n:'IP地址',l:'http://www.ip138.com/'},
	{n:'股票查询',l:'http://quote.eastmoney.com/quote1_1.html'},
	{n:'基金净值',l:'http://fund.baidu.com/'},
	
	
	{n:'公交查询',l:'http://bus.mapbar.com/'},
	{n:'汽车报价',l:'http://car.autohome.com.cn/'},
	{n:'交通违章查询',l:'http://auto.sohu.com/s2004/weizhangchaxun.shtml'},
	
	
	{n:'周公解梦',l:'http://www.51jiemeng.com/'},
	{n:'福利彩票',l:'http://www.zhcw.com/'},
	{n:'体育彩票',l:'http://www.lottery.gov.cn/'},
	
	{n:'汉语字典辞典',l:'http://www.zdic.net/'},
	{n:'地图查询',l:'http://map.baidu.com/'},
	{n:'简繁转换',l:'http://www.hao123.com/haoserver/jianfanzh.htm'},
	
	{n:'星座查询',l:'http://www.hao123.com/haoserver/xzcx.htm'},
	{n:'外汇牌价',l:'http://www.boc.cn/sourcedb/whpj/'},
	//{n:'法律法规',l:'http://law.chinalawinfo.com/'}
	{n:'邮政区号',l:'http://www.soft8.net/yb.htm'}
];
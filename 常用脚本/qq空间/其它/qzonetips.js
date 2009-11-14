callback(
{
//普通用户背景图
"normal_background_img":"http://imgcache.qq.com/qzone/space_item/qzonetips/tip_normalpic.jpg",
//黄钻用记背景图
"vip_background_img":"http://imgcache.qq.com/qzone/space_item/qzonetips/tip_yellowpic.jpg",

/*
跳转方式
"_self" -> 空间内跳转
"_blank" -> 空间个跳转
*/



//星座
"astro":
[
{
"name" : "白羊座",
"level": "2",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "金牛座",
"level": "3",
"trend": "2",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "双子座",
"level": "2",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "巨蟹座",
"level": "3",
"trend": "2",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "狮子座",
"level": "3",
"trend": "2",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "处女座",
"level": "4",
"trend": "2",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "天秤座",
"level": "2",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "天蝎座",
"level": "3",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "射手座",
"level": "2",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "摩羯座",
"level": "2",
"trend": "2",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "水瓶座",
"level": "2",
"trend": "1",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
},
{
"name" : "双鱼座",
"level": "3",
"trend": "0",
"href": "javascript:QZONE.space.toApp('/myhome/350')",
"target": "_self"
}
],

/*
受众：
10 -> 全部用户
11 -> 黄钻1级
12 -> 黄钻2级
13 -> 黄钻3级
14 -> 黄钻4级
15 -> 黄钻5级
16 -> 黄钻6级
17 -> 黄钻7级
20 -> 黄钻过期七天
21 -> 非黄钻,无经验值
22 -> 非黄钻,有经验值
*/

//热点
"hot":
{ 
"10":
{
"title": "功能速递",
"title_href" : "http://20050607.qzone.qq.com/",
"title_href_target" : "_blank",
"content": "生活锦囊，你的生活小帮手",
"content_href" : "http://user.qzone.qq.com/20050607/blog/1245642716",
"content_href_target" : "_blank"
}
},
//话题1
"list_1":
{ 
"10":
{
"title": "特权",
"title_href" : "javascript:top.guide(15)",
"title_href_target" : "_blank",
"content": "QQ空间新功能抢先尝！",
"content_href" : "http://imgcache.qq.com/qzone/mall/act/yellow/priority.html",
"content_href_target" : "_blank"
}, 
"20":
{
"title": "提醒",
"title_href" : "javascript:window.open('http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&subtype=1&clientuin='+top.getCookie('zzpaneluin')+'&clientkey='+top.getCookie('zzpanelkey')+'','_blank');return false;",
"title_href_target" : "_blank",
"content": "您的黄钻已到期，立即续费享受更多特权",
"content_href" : "javascript:window.open('http://paycenter.qq.com/cgi-bin/showopenservice.cgi?service_type=home&subtype=1&clientuin='+top.getCookie('zzpaneluin')+'&clientkey='+top.getCookie('zzpanelkey')+'','_blank');return false;",
"content_href_target" : "_blank"
}
},
//话题2
"list_2":
{ 
"10":
{
"title": "活动",
"title_href" : "http://mobile.qq.com/activity/qzone_3year/",
"title_href_target" : "_blank",
"content": "手机QQ空间三周年，奇景旅游机票免费拿",
"content_href" : "http://mobile.qq.com/activity/qzone_3year/",
"content_href_target" : "_blank"
}
}
}
);
